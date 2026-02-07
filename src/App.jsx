import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AprendizLogin from './pages/AprendizLogin'
import AprendizPerfilCompleto from './pages/AprendizPerfilCompleto'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de aprendices */}
        <Route path="/" element={<AprendizLogin />} />
        <Route path="/perfil" element={<AprendizPerfilCompleto />} />
        
        {/* Rutas de admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App