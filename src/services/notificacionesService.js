import { supabase } from '../lib/supabase'

/**
 * Crear notificación en la base de datos
 */
export const crearNotificacion = async (aprendizId, tipo, mensaje) => {
  try {
    const { data, error } = await supabase
      .from('seguimientos')
      .insert({
        aprendiz_id: aprendizId,
        tipo: tipo,
        descripcion: mensaje,
        fecha: new Date()
      })
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creando notificación:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Generar link de WhatsApp personalizado
 */
export const generarLinkWhatsApp = (aprendiz, tipo = 'recordatorio') => {
  const mensajes = {
    recordatorio: `Hola ${aprendiz.nombres}, te escribo para recordarte que debes actualizar tu información de práctica en el sistema. Tu número de documento es ${aprendiz.numero_documento}. Ingresa en: https://sisep.vercel.app`,
    
    bienvenida: `Hola ${aprendiz.nombres} de la ficha ${aprendiz.ficha}, bienvenido al sistema de seguimiento SENA. Ingresa con tu documento ${aprendiz.numero_documento} en: https://sisep.vercel.app`,
    
    visita: `Hola ${aprendiz.nombres} de la ficha ${aprendiz.ficha}, necesito coordinar contigo la visita de seguimiento. ¿Podrías confirmarme tu disponibilidad?`,
    
    documentos: `Hola ${aprendiz.nombres}, recuerda que tienes documentos pendientes: ${aprendiz.documentos_pendientes || 'Revisa tu perfil'}. Ficha: ${aprendiz.ficha}`
  }

  const mensaje = mensajes[tipo] || mensajes.recordatorio
  const telefono = aprendiz.telefono?.replace(/\D/g, '') || ''
  
  if (!telefono) {
    return null
  }
  
  return `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`
}

/**
 * Generar link de email con template
 */
export const generarLinkEmail = (aprendiz, tipo = 'recordatorio') => {
  if (!aprendiz.email) return null

  const templates = {
    recordatorio: {
      subject: '📋 SENA - Actualiza tu información de práctica',
      body: `Hola ${aprendiz.nombres} ${aprendiz.apellidos},

Te escribo para recordarte que debes actualizar tu información de práctica en el sistema de seguimiento.

Tu información:
📌 Ficha: ${aprendiz.ficha}
📚 Programa: ${aprendiz.programa}
📄 Documento: ${aprendiz.numero_documento}

${aprendiz.documentos_pendientes ? `⚠️ Documentos pendientes:\n${aprendiz.documentos_pendientes}\n\n` : ''}
Ingresa al sistema: https://sisep.vercel.app

Saludos,
Diana Marín
Instructora de Seguimiento SENA
WhatsApp: 300 677 6148`
    },
    
    bienvenida: {
      subject: '👋 Bienvenido al Sistema de Seguimiento SENA',
      body: `Hola ${aprendiz.nombres},

Ya estás registrado en el sistema de seguimiento de práctica del SENA.

Tus datos de acceso:
Número de documento: ${aprendiz.numero_documento}

Por favor, ingresa al sistema para completar tu información: https://sisep.vercel.app

Saludos,
Diana Marín
Instructora de Seguimiento SENA
WhatsApp: 300 677 6148`
    },
    
    confirmacion: {
      subject: '✅ Información recibida - SENA Seguimiento',
      body: `Gracias ${aprendiz.nombres},

He recibido tu información correctamente. Estaré revisándola y te contactaré pronto.

Próximos pasos:
📌 Revisaré tu información
📞 Te contactaré para coordinar la visita
📋 Mantente atento a tus mensajes

Saludos,
Diana Marín
Instructora de Seguimiento SENA
WhatsApp: 300 677 6148`
    }
  }

  const template = templates[tipo] || templates.recordatorio
  
  return `mailto:${aprendiz.email}?subject=${encodeURIComponent(template.subject)}&body=${encodeURIComponent(template.body)}`
}

/**
 * Abrir WhatsApp en nueva ventana
 */
export const enviarWhatsApp = (aprendiz, tipo = 'recordatorio') => {
  const link = generarLinkWhatsApp(aprendiz, tipo)
  if (link) {
    window.open(link, '_blank')
    return { success: true }
  }
  return { success: false, error: 'Sin número de teléfono' }
}

/**
 * Abrir cliente de email
 */
export const enviarEmail = (aprendiz, tipo = 'recordatorio') => {
  const link = generarLinkEmail(aprendiz, tipo)
  if (link) {
    window.location.href = link
    return { success: true }
  }
  return { success: false, error: 'Sin email' }
}

/**
 * Notificar a Diana que un aprendiz respondió (guardar en BD)
 */
export const notificarRespuestaADiana = async (aprendiz) => {
  try {
    const mensaje = `
🔔 NUEVO SEGUIMIENTO RECIBIDO

Aprendiz: ${aprendiz.nombres} ${aprendiz.apellidos}
Documento: ${aprendiz.numero_documento}
Ficha: ${aprendiz.ficha}
Programa: ${aprendiz.programa}
Email: ${aprendiz.email || 'No registrado'}
Teléfono: ${aprendiz.telefono || 'No registrado'}
Estado: ${aprendiz.estado}

El aprendiz ha completado el formulario de seguimiento.
    `.trim()

    const resultado = await crearNotificacion(aprendiz.id, 'notificacion_diana', mensaje)
    
    return resultado
  } catch (error) {
    console.error('Error notificando a Diana:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Obtener estadísticas de notificaciones
 */
export const obtenerEstadisticasNotificaciones = async () => {
  try {
    // Total de aprendices
    const { count: totalAprendices } = await supabase
      .from('aprendices')
      .select('*', { count: 'exact', head: true })

    // Aprendices que han respondido
    const { count: hanRespondido } = await supabase
      .from('aprendices')
      .select('*', { count: 'exact', head: true })
      .eq('respondio', true)

    // Aprendices pendientes
    const pendientes = totalAprendices - hanRespondido

    // Seguimientos por tipo
    const { data: seguimientos } = await supabase
      .from('seguimientos')
      .select('tipo')

    const porTipo = seguimientos?.reduce((acc, s) => {
      acc[s.tipo] = (acc[s.tipo] || 0) + 1
      return acc
    }, {}) || {}

    return {
      success: true,
      data: {
        totalAprendices,
        hanRespondido,
        pendientes,
        porcentajeRespuesta: totalAprendices > 0 ? Math.round((hanRespondido / totalAprendices) * 100) : 0,
        seguimientosPorTipo: porTipo
      }
    }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return { success: false, error: error.message }
  }
}