import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import NavbarSISEP from '../components/NavbarSISEP'
import { LogOut } from "lucide-react";
                       


export default function AprendizPerfilCompleto() {
  const [aprendiz, setAprendiz] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  // Estados del formulario
  const [formData, setFormData] = useState({
    ha_tenido_seguimientos: '',
    cantidad_seguimientos: '',
    donde_subio_bitacoras: '',
    tipo_alternativa: '',
    nombre_empresa: '',
    direccion_empresa: '',
    nombre_jefe: '',
    telefono_jefe: '',
    correo_jefe: '',
    fecha_inicio_alternativa: '',
    tipo_visita: '',
    fecha_visita: '',
    horario_visita: '',
    ya_termine: false,
    comentarios: ''
  })

  useEffect(() => {
    const data = localStorage.getItem('aprendiz')
    if (!data) {
      navigate('/')
      return
    }
    setAprendiz(JSON.parse(data))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('aprendiz')
    navigate('/')
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

   try {
  // Guardar en seguimientos
  const descripcionCompleta = `
SEGUIMIENTO COMPLETO:
- Ha tenido seguimientos: ${formData.ha_tenido_seguimientos}
${formData.ha_tenido_seguimientos === 'si' ? `- Cantidad: ${formData.cantidad_seguimientos}\n- Dónde subió bitácoras: ${formData.donde_subio_bitacoras}` : ''}
- Tipo de alternativa: ${formData.tipo_alternativa}
${formData.tipo_alternativa !== 'no_iniciado' ? `
- Empresa: ${formData.nombre_empresa}
- Dirección: ${formData.direccion_empresa}
- Jefe inmediato: ${formData.nombre_jefe}
- Teléfono jefe: ${formData.telefono_jefe}
- Correo jefe: ${formData.correo_jefe}
- Fecha inicio: ${formData.fecha_inicio_alternativa}
- Tipo visita: ${formData.tipo_visita}
- Fecha visita: ${formData.fecha_visita}
- Horario: ${formData.horario_visita}
` : ''}
- Ya terminó: ${formData.ya_termine ? 'Sí' : 'No'}
- Comentarios: ${formData.comentarios}
  `.trim()

  const { error } = await supabase
    .from('seguimientos')
    .insert({
      aprendiz_id: aprendiz.id,
      tipo: 'formulario_completo',
      descripcion: descripcionCompleta
    })

  if (error) throw error

  // Marcar como respondido
  await supabase
    .from('aprendices')
    .update({ 
      respondio: true, 
      ultima_actualizacion: new Date() 
    })
    .eq('id', aprendiz.id)

  // NUEVO: Enviar notificación a Diana
try {
  const { notificarRespuestaADiana } = await import('../services/notificacionesService')
  await notificarRespuestaADiana(aprendiz)
} catch (notifError) {
  console.log('No se pudo guardar notificación:', notifError)
}

  setSuccess(true)
  setTimeout(() => {
    setShowModal(true)
  }, 1000)} catch (error) {
      console.error('Error:', error)
      alert('Error al enviar el formulario')
    } finally {
      setLoading(false)
    }
  }

  const getWhatsAppLink = () => {
  const mensaje = encodeURIComponent(
    `Hola Diana, soy ${aprendiz?.nombres} ${aprendiz?.apellidos} de la ficha ${aprendiz?.ficha}. Ya terminé mi etapa productiva. Mi documento es ${aprendiz?.numero_documento}`
  )
  return `https://wa.me/573006776148?text=${mensaje}`
}

  if (!aprendiz) return null

  const getEstadoBadge = (estado) => {
    const badges = {
      'EN FORMACION': 'bg-blue-100 text-blue-800 border-blue-200',
      'POR CERTIFICAR': 'bg-green-100 text-green-800 border-green-200',
      'CONDICIONADO': 'bg-red-100 text-red-800 border-red-200'
    }
    return badges[estado] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50">
    <NavbarSISEP aprendiz={aprendiz} onLogout={handleLogout} />
      {/* Imagen de fondo MUY sutil */}
      <div
        className="fixed inset-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('/cai.jpg')`,
          filter: 'brightness(1.2)',
          opacity: '0.1'
        }}
      />
      <div className="max-w-4xl mx-auto space-y-6  pt-6 px-4">
        {/* Header */}
       


        {/* Tarjeta de perfil */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {aprendiz.nombres.charAt(0)}{aprendiz.apellidos.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {aprendiz.nombres} {aprendiz.apellidos}
                </h2>
                <p className="text-gray-600 text-sm">{aprendiz.tipo_documento} {aprendiz.numero_documento}</p>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getEstadoBadge(aprendiz.estado)}`}>
              {aprendiz.estado}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Ficha</p>
              <p className="text-lg font-bold text-gray-800">{aprendiz.ficha}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100">
              <p className="text-xs text-gray-600 uppercase font-semibold mb-1">Programa</p>
              <p className="text-sm font-semibold text-gray-800">{aprendiz.programa}</p>
            </div>
          </div>
        </div>

        {/* Documentos pendientes */}
        {aprendiz.documentos_pendientes && (
          <div className="card border-l-4 border-yellow-500 bg-yellow-50">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">⚠️ Documentos Pendientes</h3>
                <p className="text-gray-700 whitespace-pre-line">{aprendiz.documentos_pendientes}</p>
              </div>
            </div>
          </div>
        )}

        {/* FORMULARIO COMPLETO */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Seguimientos previos */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">1</span>
              ¿Ha recibido seguimientos de algún instructor del CAI?
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ha_tenido_seguimientos"
                    value="si"
                    onChange={handleChange}
                    required
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-gray-700">Sí</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="ha_tenido_seguimientos"
                    value="no"
                    onChange={handleChange}
                    required
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>

              {formData.ha_tenido_seguimientos === 'si' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Cuántos seguimientos ha recibido?
                    </label>
                    <input
                      type="number"
                      name="cantidad_seguimientos"
                      value={formData.cantidad_seguimientos}
                      onChange={handleChange}
                      className="input-field"
                      min="1"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ¿Dónde ha subido sus bitácoras?
                    </label>
                    <textarea
                      name="donde_subio_bitacoras"
                      value={formData.donde_subio_bitacoras}
                      onChange={handleChange}
                      className="input-field min-h-[80px]"
                      placeholder="Ej: Google Drive, correo electrónico, etc."
                      required
                    />
                  </div>

                  <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                    <h4 className="font-bold text-cyan-800 mb-2">📁 Subir Bitácoras</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Debe seguir esta estructura en Google Drive:
                    </p>
                    <ol className="text-sm text-gray-700 space-y-1 mb-3 ml-4 list-decimal">
                      <li>Buscar la carpeta de su ficha: <strong>{aprendiz.ficha}</strong></li>
                      <li>Crear carpeta: <strong>{aprendiz.nombres} {aprendiz.apellidos}</strong></li>
                      <li>Dentro crear carpeta: <strong>Bitácoras</strong></li>
                      <li>Subir sus bitácoras ahí</li>
                    </ol>
                    <a
                      href="https://sena4-my.sharepoint.com/:f:/g/personal/dmarint_sena_edu_co/IgCMSqSAl2DNQ49p_hwBgEhEAfmyFCUVpVh-czpgNDQtlOw?e=eixB2h"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Ir a Drive - Diana Marín SEGUIMIENTOS
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Tipo de alternativa */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">2</span>
              Tipo de Alternativa
            </h3>
            
            <select
              name="tipo_alternativa"
              value={formData.tipo_alternativa}
              onChange={handleChange}
              className="select-field"
              required
            >
              <option value="">Seleccione una opción</option>
              <option value="contrato">Contrato de Aprendizaje</option>
              <option value="pasantia">Pasantía</option>
              <option value="proyecto">Proyecto Productivo</option>
              <option value="no_iniciado">No he iniciado práctica aún</option>
            </select>

            {formData.tipo_alternativa && formData.tipo_alternativa !== 'no_iniciado' && (
              <div className="mt-6 space-y-4 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
                <h4 className="font-bold text-gray-800">Datos de la Empresa</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre de la Empresa *
                    </label>
                    <input
                      type="text"
                      name="nombre_empresa"
                      value={formData.nombre_empresa}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dirección de la Empresa *
                    </label>
                    <input
                      type="text"
                      name="direccion_empresa"
                      value={formData.direccion_empresa}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Jefe Inmediato *
                    </label>
                    <input
                      type="text"
                      name="nombre_jefe"
                      value={formData.nombre_jefe}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono Jefe Inmediato *
                    </label>
                    <input
                      type="tel"
                      name="telefono_jefe"
                      value={formData.telefono_jefe}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="3001234567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Correo Jefe Inmediato *
                    </label>
                    <input
                      type="email"
                      name="correo_jefe"
                      value={formData.correo_jefe}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="jefe@empresa.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      name="fecha_inicio_alternativa"
                      value={formData.fecha_inicio_alternativa}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Programar visita */}
          {formData.tipo_alternativa && formData.tipo_alternativa !== 'no_iniciado' && (
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">3</span>
                Programar Visita
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Visita *
                  </label>
                  <select
                    name="tipo_visita"
                    value={formData.tipo_visita}
                    onChange={handleChange}
                    className="select-field"
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="virtual">Virtual</option>
                    <option value="presencial">Presencial</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fecha de Visita *
                    </label>
                    <input
                      type="date"
                      name="fecha_visita"
                      value={formData.fecha_visita}
                      onChange={handleChange}
                      className="input-field"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Horario (Solo en la tarde) *
                    </label>
                    <select
                      name="horario_visita"
                      value={formData.horario_visita}
                      onChange={handleChange}
                      className="select-field"
                      required
                    >
                      <option value="">Seleccione hora</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="14:30">2:30 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="15:30">3:30 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="16:30">4:30 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Comentarios adicionales */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">4</span>
              Comentarios Adicionales
            </h3>
            <textarea
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              className="input-field min-h-[120px]"
              placeholder="Escriba aquí cualquier información adicional que considere importante..."
            />
          </div>

          {/* 5. ¿Ya terminó? */}
          <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="ya_termine"
                checked={formData.ya_termine}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 mt-1"
              />
              <div>
                <p className="font-bold text-gray-800">¿Ya terminó su etapa productiva o quiere contactarse con la instructora?</p>
                <p className="text-sm text-gray-600 mt-1">
                  Si ya completó su práctica o quiere contactarse con la instructora, márquelo aquí para contactar directamente con la instructora
                </p>
              </div>
            </label>

            {formData.ya_termine && (
              <div className="mt-4 p-4 bg-white rounded-xl border border-green-200 animate-fade-in">
                <p className="text-sm text-gray-700 mb-3">
                 Puede contactar directamente a la instructora Diana:
                </p>
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contactar por WhatsApp
                </a>
              </div>
            )}
          </div>

          {/* Success message */}
          {success && (
            <div className="card bg-green-50 border-green-200 animate-fade-in">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-semibold text-green-800">¡Información enviada exitosamente!</p>
              </div>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-cyan-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-6 w-6 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enviando...
              </div>
            ) : (
              'Enviar Información'
            )}
          </button>
        </form>

        {/* Modal de confirmación */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Perfecto!</h3>
                <p className="text-gray-600 mb-6">
                  La instructora Diana Marín ha recibido tu información y te contactará pronto.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}