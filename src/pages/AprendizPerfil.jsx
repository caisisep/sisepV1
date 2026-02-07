import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AprendizPerfil() {
  const [aprendiz, setAprendiz] = useState(null)
  const [comentario, setComentario] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

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

  const handleEnviarComentario = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Insertar seguimiento
      const { error } = await supabase
        .from('seguimientos')
        .insert({
          aprendiz_id: aprendiz.id,
          tipo: 'comentario',
          descripcion: comentario
        })

      if (error) throw error

      // Marcar como respondido
      await supabase
        .from('aprendices')
        .update({ respondio: true, ultima_actualizacion: new Date() })
        .eq('id', aprendiz.id)

      setSuccess(true)
      setComentario('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      alert('Error al enviar comentario')
    } finally {
      setLoading(false)
    }
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
    <div className="min-h-screen p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header con logout */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Mi Perfil
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Salir
          </button>
        </div>

        {/* Tarjeta de información personal */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
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
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Ficha</p>
              <p className="text-lg font-bold text-gray-800">{aprendiz.ficha}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Programa</p>
              <p className="text-sm font-semibold text-gray-800">{aprendiz.programa}</p>
            </div>
            {aprendiz.email && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Email</p>
                <p className="text-sm text-gray-800">{aprendiz.email}</p>
              </div>
            )}
            {aprendiz.telefono && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Teléfono</p>
                <p className="text-sm text-gray-800">{aprendiz.telefono}</p>
              </div>
            )}
          </div>
        </div>

        {/* Documentos pendientes */}
        {aprendiz.documentos_pendientes && (
          <div className="card border-l-4 border-yellow-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800 mb-2">Documentos Pendientes</h3>
                <p className="text-gray-700 whitespace-pre-line">{aprendiz.documentos_pendientes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Contrato */}
        {aprendiz.tipo_contrato && (
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-4">Información de Contrato</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-semibold text-gray-800">{aprendiz.tipo_contrato}</span>
              </div>
              {aprendiz.fecha_inicio_contrato && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Inicio:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(aprendiz.fecha_inicio_contrato).toLocaleDateString('es-CO')}
                  </span>
                </div>
              )}
              {aprendiz.fecha_fin_contrato && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Fin:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(aprendiz.fecha_fin_contrato).toLocaleDateString('es-CO')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Formulario de comentario */}
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Enviar Comentario o Actualización</h3>
          <form onSubmit={handleEnviarComentario} className="space-y-4">
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Escribe aquí tu comentario, consulta o actualización..."
              className="input-field min-h-[120px] resize-none"
              required
            />
            
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">¡Comentario enviado exitosamente!</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar Comentario'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}