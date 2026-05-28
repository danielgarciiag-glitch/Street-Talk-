import { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Arena from './pages/Arena'
import Lecciones from './pages/Lecciones'
import Perfil from './pages/Perfil'
import Ranking from './pages/Ranking'
import Login from './pages/Login'
import './App.css'

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null)

  useEffect(() => {
    const guardado = localStorage.getItem('usuario')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (guardado) setUsuarioActivo(JSON.parse(guardado))
  }, [])

  function handleLogin(usuario) {
    setUsuarioActivo(usuario)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuarioActivo(null)
  }

  if (!usuarioActivo) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">🗣️ Street Talk</Link>
        <Link to="/lecciones">📚 Lecciones</Link>
        <Link to="/arena">⚔️ Arena</Link>
        <Link to="/ranking">🏆 Ranking</Link>
        <Link to="/perfil">👤 Perfil</Link>
        <button className="btn-logout" onClick={handleLogout}>Salir</button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lecciones" element={<Lecciones />} />
        <Route path="/arena" element={<Arena />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App