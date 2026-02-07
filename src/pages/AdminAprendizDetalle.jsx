import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { generarLinkWhatsApp, generarLinkEmail } from '../services/notificacionesService'

export default function AdminAprendizDetalle() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [aprendiz, setAprendiz] = useState(null)
  const [seguimientos, setSeguimientos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar autenticación
    const auth = localStorage.getItem('admin_auth')
    if (!auth) {
      navigate('/admin')
      return
    }

    cargarDatos()
  }, [id, navigate])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      // Cargar aprendiz
      const { data: aprendizData, error: aprendizError } = await supabase
        .from('aprendices')
        .select('*')
        .eq('id', id)
        .single()

      if (aprendizError) throw aprendizError
      setAprendiz(aprendizData)

      // Cargar seguimientos
      const { data: seguimientosData, error: seguimientosError } = await supabase
        .from('seguimientos')
        .select('*')
        .eq('aprendiz_id', id)
        .order('fecha', { ascending: false })

      if (seguimientosError) throw seguimientosError
      setSeguimientos(seguimientosData || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
      alert('Error cargando información del aprendiz')
      navigate('/admin/dashboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!aprendiz) return null

  const getTipoIcon = (tipo) => {
    const icons = {
      'formulario_completo': '📋',
      'contacto': '📞',
      'visita': '🏢',
      'documento': '📄',
      'comentario': '💬',
      'notificacion_diana': '🔔'
    }
    return icons[tipo] || '📝'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 pb-20">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header con navegación */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Detalles del Aprendiz
          </h1>
        </div>

        {/* Información del aprendiz */}
        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {aprendiz.nombres.charAt(0)}{aprendiz.apellidos.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {aprendiz.nombres} {aprendiz.apellidos}
                </h2>
                <p className="text-gray-600">{aprendiz.tipo_documento} {aprendiz.numero_documento}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    aprendiz.estado === 'EN FORMACION' ? 'bg-blue-100 text-blue-800' :
                    aprendiz.estado === 'POR CERTIFICAR' ? 'bg-green-100 text-green-800' :
                    aprendiz.estado === 'CONDICIONADO' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {aprendiz.estado || 'N/A'}
                  </span>
                  {aprendiz.respondio && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      ✓ Ha respondido
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Acciones rápidas */}
            <div className="flex gap-2">
              <button
                onClick={() => window.open(generarLinkWhatsApp(aprendiz, 'recordatorio'), '_blank')}
                className="p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                title="WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
              <button
                onClick={() => window.location.href = generarLinkEmail(aprendiz, 'recordatorio')}
                className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                title="Email"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Información detallada */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ficha</p>
              <p className="text-lg font-bold text-gray-800">{aprendiz.ficha}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Teléfono</p>
              <p className="text-sm text-gray-800">{aprendiz.telefono || 'No registrado'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
              <p className="text-sm text-gray-800 break-all">{aprendiz.email || 'No registrado'}</p>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 p-4 rounded-xl">
            <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Programa</p>
            <p className="text-sm text-gray-800">{aprendiz.programa}</p>
          </div>

          {aprendiz.documentos_pendientes && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <p className="text-xs text-yellow-800 uppercase font-semibold mb-2">⚠️ Documentos Pendientes</p>
              <p className="text-sm text-gray-800 whitespace-pre-line">{aprendiz.documentos_pendientes}</p>
            </div>
          )}
        </div>

        {/* Historial de seguimientos */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Historial de Seguimientos
            </h3>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              {seguimientos.length} registros
            </span>
          </div>

          {seguimientos.length > 0 ? (
            <div className="space-y-4">
              {seguimientos.map((seg, index) => (
                <div key={seg.id} className="border-l-4 border-primary-500 bg-gray-50 p-4 rounded-r-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getTipoIcon(seg.tipo)}</span>
                      <div>
                        <p className="font-semibold text-gray-800 capitalize">
                          {seg.tipo.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(seg.fecha || seg.created_at).toLocaleString('es-CO', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-semibold">
                      #{seguimientos.length - index}
                    </span>
                  </div>
                  <div className="mt-3 text-sm text-gray-700 whitespace-pre-line bg-white p-3 rounded-lg">
                    {seg.descripcion}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No hay seguimientos registrados aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}