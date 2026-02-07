import { LogOut } from "lucide-react"

export default function NavbarSISEP({ aprendiz, onLogout }) {
  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* IZQUIERDA — Logo + Nombre sistema */}
        <div className="flex items-center gap-4">
          {/* Logo SENA */}
          <div className="w-12 h-12 bg-white rounded-xl shadow flex items-center justify-center overflow-hidden">
            <img
              src="/sena.png"   // 👉 coloca tu logo en public/
              alt="Logo SENA"
              className="object-contain w-10 h-10"
            />
          </div>

          {/* Nombre del sistema */}
          <div className="leading-tight">
            <h1 className="text-sm md:text-base font-bold text-gray-800">
              Sistema Integrado de Seguimiento de Etapa Productiva
            </h1>
            <p className="text-xs text-primary-600 font-semibold tracking-wide">
              SISEP - CAI
            </p>
          </div>
        </div>

        {/* DERECHA — Usuario + salir */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-gray-800">
              {aprendiz?.nombres} {aprendiz?.apellidos}
            </p>
            <p className="text-xs text-gray-500">Aprendiz</p>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-semibold hover:bg-red-100 transition"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
