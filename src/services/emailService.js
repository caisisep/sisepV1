import { Resend } from 'resend'

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY)

/**
 * Enviar email individual a un aprendiz
 */
export const enviarEmailAprendiz = async (aprendiz, tipo = 'recordatorio') => {
  try {
    const templates = {
      recordatorio: {
        subject: '📋 SENA - Actualiza tu información de práctica',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">SENA Seguimiento</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #1f2937;">Hola ${aprendiz.nombres} ${aprendiz.apellidos},</h2>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Te escribo para recordarte que debes actualizar tu información de práctica en el sistema de seguimiento.
              </p>
              
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                <strong style="color: #1e40af;">Tu información:</strong><br>
                📌 Ficha: <strong>${aprendiz.ficha}</strong><br>
                📚 Programa: ${aprendiz.programa}<br>
                📄 Documento: ${aprendiz.numero_documento}
              </div>
              
              ${aprendiz.documentos_pendientes ? `
                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                  <strong style="color: #92400e;">⚠️ Documentos pendientes:</strong><br>
                  ${aprendiz.documentos_pendientes}
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}" 
                   style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Actualizar Información
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Si tienes alguna pregunta, no dudes en contactarme.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                  <strong>Diana Marín</strong><br>
                  Instructora de Seguimiento SENA<br>
                  📱 WhatsApp: <a href="https://wa.me/573006776148" style="color: #0ea5e9;">300 677 6148</a>
                </p>
              </div>
            </div>
          </div>
        `
      },
      
      bienvenida: {
        subject: '👋 Bienvenido al Sistema de Seguimiento SENA',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">¡Bienvenido!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #1f2937;">Hola ${aprendiz.nombres},</h2>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Ya estás registrado en el sistema de seguimiento de práctica del SENA.
              </p>
              
              <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
                <strong style="color: #166534;">✅ Tus datos de acceso:</strong><br>
                Número de documento: <strong>${aprendiz.numero_documento}</strong>
              </div>
              
              <p style="color: #4b5563; line-height: 1.6;">
                Por favor, ingresa al sistema para completar tu información de práctica.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${window.location.origin}" 
                   style="background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Ingresar al Sistema
                </a>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                  <strong>Diana Marín</strong><br>
                  Instructora de Seguimiento SENA<br>
                  📧 Email: caisisep@gmail.com<br>
                  📱 WhatsApp: <a href="https://wa.me/573006776148" style="color: #0ea5e9;">300 677 6148</a>
                </p>
              </div>
            </div>
          </div>
        `
      },
      
      confirmacion: {
        subject: '✅ Información recibida - SENA Seguimiento',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0;">✅ ¡Información Recibida!</h1>
            </div>
            
            <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
              <h2 style="color: #1f2937;">Gracias ${aprendiz.nombres},</h2>
              
              <p style="color: #4b5563; line-height: 1.6;">
                He recibido tu información correctamente. Estaré revisándola y te contactaré pronto.
              </p>
              
              <div style="background: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; margin: 20px 0;">
                <strong style="color: #166534;">Próximos pasos:</strong><br>
                📌 Revisaré tu información<br>
                📞 Te contactaré para coordinar la visita<br>
                📋 Mantente atento a tus mensajes
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Si necesitas hacer algún cambio o tienes preguntas, no dudes en contactarme.
              </p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
                  <strong>Diana Marín</strong><br>
                  Instructora de Seguimiento SENA<br>
                  📧 Email: caisisep@gmail.com<br>
                  📱 WhatsApp: <a href="https://wa.me/573006776148" style="color: #22c55e;">300 677 6148</a>
                </p>
              </div>
            </div>
          </div>
        `
      }
    }

    const template = templates[tipo] || templates.recordatorio

    const { data, error } = await resend.emails.send({
      from: 'SENA Seguimiento <onboarding@resend.dev>',
      to: [aprendiz.email],
      subject: template.subject,
      html: template.html,
    })

    if (error) {
      console.error('Error enviando email:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error en enviarEmailAprendiz:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Enviar emails masivos a múltiples aprendices
 */
export const enviarEmailMasivo = async (aprendices, tipo = 'recordatorio') => {
  const resultados = {
    exitosos: 0,
    fallidos: 0,
    detalles: []
  }

  for (const aprendiz of aprendices) {
    if (!aprendiz.email) {
      resultados.fallidos++
      resultados.detalles.push({
        aprendiz: `${aprendiz.nombres} ${aprendiz.apellidos}`,
        success: false,
        error: 'Sin email'
      })
      continue
    }

    const resultado = await enviarEmailAprendiz(aprendiz, tipo)
    
    if (resultado.success) {
      resultados.exitosos++
    } else {
      resultados.fallidos++
    }

    resultados.detalles.push({
      aprendiz: `${aprendiz.nombres} ${aprendiz.apellidos}`,
      email: aprendiz.email,
      ...resultado
    })

    // Esperar 100ms entre emails para no sobrecargar
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return resultados
}

/**
 * Generar link de WhatsApp personalizado
 */
export const generarLinkWhatsApp = (aprendiz, tipo = 'recordatorio') => {
  const mensajes = {
    recordatorio: `Hola ${aprendiz.nombres}, te escribo para recordarte que debes actualizar tu información de práctica en el sistema. Tu número de documento es ${aprendiz.numero_documento}. Ingresa en: ${window.location.origin}`,
    
    bienvenida: `Hola ${aprendiz.nombres}, bienvenido al sistema de seguimiento SENA. Tu número de documento es ${aprendiz.numero_documento}. Ingresa en: ${window.location.origin}`,
    
    visita: `Hola ${aprendiz.nombres}, necesito coordinar contigo la visita de seguimiento a tu lugar de práctica. ¿Podrías confirmarme tu disponibilidad?`
  }

  const mensaje = mensajes[tipo] || mensajes.recordatorio
  const telefono = aprendiz.telefono?.replace(/\D/g, '') || ''
  
  return `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`
}

/**
 * Notificación a Diana cuando un aprendiz responde
 */
export const notificarRespuestaADiana = async (aprendiz) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'SENA Seguimiento <onboarding@resend.dev>',
      to: ['caisisep@gmail.com'],
      subject: `🔔 Nuevo seguimiento recibido - ${aprendiz.nombres} ${aprendiz.apellidos}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">🔔 Nuevo Seguimiento</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none;">
            <h2 style="color: #1f2937;">Aprendiz ha respondido</h2>
            
            <div style="background: #f5f3ff; border-left: 4px solid #8b5cf6; padding: 15px; margin: 20px 0;">
              <strong>Datos del aprendiz:</strong><br>
              👤 Nombre: <strong>${aprendiz.nombres} ${aprendiz.apellidos}</strong><br>
              📄 Documento: ${aprendiz.numero_documento}<br>
              📌 Ficha: ${aprendiz.ficha}<br>
              📚 Programa: ${aprendiz.programa}<br>
              📧 Email: ${aprendiz.email || 'No registrado'}<br>
              📱 Teléfono: ${aprendiz.telefono || 'No registrado'}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${window.location.origin}/admin" 
                 style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Ver en el Sistema
              </a>
            </div>
          </div>
        </div>
      `
    })

    if (error) {
      console.error('Error notificando a Diana:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error en notificarRespuestaADiana:', error)
    return { success: false, error: error.message }
  }
}