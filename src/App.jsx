import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AprendizLogin from './pages/AprendizLogin'
import AprendizPerfilMejorado from './pages/AprendizPerfilCompleto'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminAprendizDetalle from './pages/AdminAprendizDetalle'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AprendizLogin />} />
        <Route path="/perfil" element={<AprendizPerfilMejorado />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/aprendiz/:id" element={<AdminAprendizDetalle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App