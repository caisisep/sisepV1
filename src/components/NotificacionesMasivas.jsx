import { useState } from 'react'
import { generarLinkWhatsApp, generarLinkEmail } from '../services/notificacionesService'

export default function NotificacionesMasivas({ aprendices, onClose }) {
  const [tipo, setTipo] = useState('whatsapp') // 'whatsapp' o 'email'
  const [filtroSeleccionado, setFiltroSeleccionado] = useState('todos')
  const [mensajePersonalizado, setMensajePersonalizado] = useState('')

  // Filtrar aprendices según selección
  const aprendicesFiltrados = aprendices.filter(a => {
    if (filtroSeleccionado === 'todos') return true
    if (filtroSeleccionado === 'no_respondidos') return !a.respondio
    if (filtroSeleccionado === 'en_formacion') return a.estado === 'EN FORMACION'
    if (filtroSeleccionado === 'sin_telefono') return !a.telefono
    if (filtroSeleccionado === 'sin_email') return !a.email
    return true
  })

  const handleEnviarMasivo = () => {
    if (tipo === 'whatsapp') {
      enviarWhatsAppMasivo()
    } else {
      enviarEmailMasivo()
    }
  }

  const enviarWhatsAppMasivo = () => {
    const aprendicesConTelefono = aprendicesFiltrados.filter(a => a.telefono)
    
    if (aprendicesConTelefono.length === 0) {
      alert('No hay aprendices con teléfono en este filtro')
      return
    }

    const confirmacion = confirm(
      `¿Estás segura de abrir ${aprendicesConTelefono.length} conversaciones de WhatsApp?\n\n` +
      `Se abrirán en pestañas separadas con el mensaje predefinido.`
    )

    if (!confirmacion) return

    // Mensaje personalizado o default
    const mensajeBase = mensajePersonalizado || 
      `Hola {nombre}, te escribo para recordarte que debes actualizar tu información de práctica en el sistema SISEP-CAI. Ingresa con tu documento {documento} en: https://sisep.vercel.app`

    aprendicesConTelefono.forEach((aprendiz, index) => {
      setTimeout(() => {
        const mensaje = mensajeBase
          .replace('{nombre}', aprendiz.nombres)
          .replace('{ficha}', aprendiz.ficha)
          .replace('{documento}', aprendiz.numero_documento)

        const telefono = aprendiz.telefono.replace(/\D/g, '')
        const link = `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`
        window.open(link, '_blank')
      }, index * 1000) // 1 segundo entre cada ventana
    })

    alert(`Se abrirán ${aprendicesConTelefono.length} conversaciones de WhatsApp. Por favor espera...`)
  }

  const enviarEmailMasivo = () => {
    const aprendicesConEmail = aprendicesFiltrados.filter(a => a.email)
    
    if (aprendicesConEmail.length === 0) {
      alert('No hay aprendices con email en este filtro')
      return
    }

    const confirmacion = confirm(
      `¿Estás segura de enviar emails a ${aprendicesConEmail.length} aprendices?\n\n` +
      `Se abrirá tu cliente de correo con todos los destinatarios.`
    )

    if (!confirmacion) return

    // Crear lista de emails
    const emails = aprendicesConEmail.map(a => a.email).join(',')
    
    const subject = 'SENA - Actualiza tu información de práctica SISEP-CAI'
    const body = mensajePersonalizado || 
      `Estimado(a) aprendiz,\n\n` +
      `Te escribo para recordarte que debes actualizar tu información de práctica en el sistema SISEP-CAI.\n\n` +
      `Por favor ingresa con tu número de documento en:\n` +
      `https://sisep.vercel.app\n\n` +
      `Saludos,\n` +
      `Diana Marín\n` +
      `Instructora SENA - CAI\n` +
      `WhatsApp: 300 677 6148`

    const mailtoLink = `mailto:${emails}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Notificaciones Masivas</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tipo de notificación */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Tipo de Notificación
          </label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value="whatsapp"
                checked={tipo === 'whatsapp'}
                onChange={(e) => setTipo(e.target.value)}
                className="sr-only"
              />
              <div className={`p-4 rounded-xl border-2 transition-all ${
                tipo === 'whatsapp' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-green-300'
              }`}>
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-800">WhatsApp</p>
                    <p className="text-xs text-gray-600">Mensajes directos</p>
                  </div>
                </div>
              </div>
            </label>

            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="tipo"
                value="email"
                checked={tipo === 'email'}
                onChange={(e) => setTipo(e.target.value)}
                className="sr-only"
              />
              <div className={`p-4 rounded-xl border-2 transition-all ${
                tipo === 'email' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}>
                <div className="flex items-center gap-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-gray-800">Email</p>
                    <p className="text-xs text-gray-600">Correo electrónico</p>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Filtrar Destinatarios
          </label>
          <select
            value={filtroSeleccionado}
            onChange={(e) => setFiltroSeleccionado(e.target.value)}
            className="select-field"
          >
            <option value="todos">Todos los aprendices</option>
            <option value="no_respondidos">Solo no respondidos</option>
            <option value="en_formacion">Solo en formación</option>
            {tipo === 'whatsapp' && <option value="sin_telefono">Sin teléfono (para revisar)</option>}
            {tipo === 'email' && <option value="sin_email">Sin email (para revisar)</option>}
          </select>

          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Destinatarios seleccionados:</strong> {aprendicesFiltrados.length}
            </p>
            {tipo === 'whatsapp' && (
              <p className="text-xs text-gray-600 mt-1">
                Con teléfono: {aprendicesFiltrados.filter(a => a.telefono).length}
              </p>
            )}
            {tipo === 'email' && (
              <p className="text-xs text-gray-600 mt-1">
                Con email: {aprendicesFiltrados.filter(a => a.email).length}
              </p>
            )}
          </div>
        </div>

        {/* Mensaje personalizado */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mensaje Personalizado (Opcional)
          </label>
          <textarea
            value={mensajePersonalizado}
            onChange={(e) => setMensajePersonalizado(e.target.value)}
            className="input-field min-h-[120px]"
            placeholder={
              tipo === 'whatsapp'
                ? "Puedes usar {nombre}, {ficha}, {documento} para personalizar\n\nEjemplo: Hola {nombre} de la ficha {ficha}..."
                : "Escribe el mensaje que quieres enviar a todos..."
            }
          />
          <p className="text-xs text-gray-500 mt-1">
            {tipo === 'whatsapp' 
              ? 'Variables disponibles: {nombre}, {ficha}, {documento}'
              : 'El mensaje se enviará igual a todos'
            }
          </p>
        </div>

        {/* Vista previa */}
        {mensajePersonalizado && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm font-semibold text-gray-700 mb-2">Vista Previa:</p>
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {mensajePersonalizado
                .replace('{nombre}', 'JUAN PEREZ')
                .replace('{ficha}', '2621337')
                .replace('{documento}', '1234567890')
              }
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviarMasivo}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-colors ${
              tipo === 'whatsapp'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {tipo === 'whatsapp' ? '📱 Abrir WhatsApp' : '📧 Enviar Emails'}
          </button>
        </div>

        {/* Advertencia */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>Nota:</strong> {tipo === 'whatsapp' 
              ? 'Se abrirá una pestaña de WhatsApp por cada aprendiz. Ten paciencia mientras se cargan.'
              : 'Se abrirá tu cliente de correo predeterminado con todos los destinatarios en el campo "Para".'
            }
          </p>
        </div>
      </div>
    </div>
  )
}