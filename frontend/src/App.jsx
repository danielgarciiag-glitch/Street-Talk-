/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Arena from './pages/Arena'
import Lecciones from './pages/Lecciones'
import Perfil from './pages/Perfil'
import Ranking from './pages/Ranking'
import Login from './pages/Login'
import Desafios from './pages/Desafios'
import Amigos from './pages/Amigos'
import Chat from './pages/Chat'
import Torneos from './pages/Torneos'
import Clanes from './pages/Clanes'
import './App.css'

function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null)
  const [amigoSeleccionado, setAmigoSeleccionado] = useState(null)
  const [palabraPractica, setPalabraPractica] = useState(null)

  useEffect(() => {
    const guardado = localStorage.getItem('usuario')
    if (guardado) setUsuarioActivo(JSON.parse(guardado))
  }, [])

  function handleLogin(usuario) {
    setUsuarioActivo(usuario)
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuarioActivo(null)
    setAmigoSeleccionado(null)
    setPalabraPractica(null)
  }

  if (!usuarioActivo) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/">🗣️</Link>
        <Link to="/lecciones">📚</Link>
        <Link to="/arena">⚔️</Link>
        <Link to="/desafios">🥊</Link>
        <Link to="/torneos">🏆</Link>
        <Link to="/ranking">📊</Link>
        <Link to="/clanes">🛡️</Link>
        <Link to="/amigos">👥</Link>
        <Link to="/chat">💬</Link>
        <Link to="/perfil">👤</Link>
        <button className="btn-logout" onClick={handleLogout}>Salir</button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lecciones" element={<Lecciones setPalabraPractica={setPalabraPractica} />} />
        <Route path="/arena" element={<Arena palabraPractica={palabraPractica} setPalabraPractica={setPalabraPractica} />} />
        <Route path="/desafios" element={<Desafios />} />
        <Route path="/torneos" element={<Torneos />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/clanes" element={<Clanes />} />
        <Route path="/amigos" element={<Amigos setAmigoSeleccionado={setAmigoSeleccionado} />} />
        <Route path="/chat" element={<Chat amigoSeleccionado={amigoSeleccionado} setAmigoSeleccionado={setAmigoSeleccionado} />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App