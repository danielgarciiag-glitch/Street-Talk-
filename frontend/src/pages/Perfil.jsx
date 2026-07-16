import { useEffect, useState } from 'react'
import { useUser } from '../useUser'

function Perfil() {
  const { usuario, setUsuario } = useUser()
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarPerfil() {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch('http://localhost:3000/usuario/perfil', {
          headers: { 'authorization': token }
        })
        const data = await res.json()
        if (data.usuario) {
          setUsuario(data.usuario)
        }
      } catch (err) {
        console.error('Error cargando perfil:', err)
      }
      setCargando(false)
    }
    cargarPerfil()
  }, [setUsuario])

  const porcentaje = usuario.xp_siguiente
    ? Math.round((usuario.xp / usuario.xp_siguiente) * 100)
    : Math.round((usuario.xp / 500) * 100)

  if (cargando) {
    return (
      <div className="container">
        <p className="tagline">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="logo">👤 Perfil</h1>

      <div className="perfil-card">
        <div className="perfil-avatar">🗣️</div>
        <h2 className="perfil-nombre">{usuario.nombre}</h2>
        <p className="perfil-rango">{usuario.rango}</p>

        <div className="perfil-xp">
          <div className="xp-info">
            <span>Nivel {usuario.nivel}</span>
            <span>{usuario.xp} XP</span>
          </div>
          <div className="xp-barra">
            <div className="xp-relleno" style={{ width: `${Math.min(porcentaje, 100)}%` }}></div>
          </div>
        </div>

        <div className="perfil-stats">
          <div className="stat-item">
            <span className="stat-numero">🔥 {usuario.racha}</span>
            <span className="stat-label">Racha</span>
          </div>
          <div className="stat-item">
            <span className="stat-numero">🎮 {usuario.partidas}</span>
            <span className="stat-label">Partidas</span>
          </div>
          <div className="stat-item">
            <span className="stat-numero">🏆 {usuario.victorias}</span>
            <span className="stat-label">Victorias</span>
          </div>
        </div>
      </div>

      <div className="logros-section">
        <h3 className="logros-titulo">🎖️ Logros</h3>
        <div className="logros-grid">
          <div className="logro-card desbloqueado">
            <span>🔥</span>
            <p>Primera racha</p>
          </div>
          <div className="logro-card desbloqueado">
            <span>⚔️</span>
            <p>Primera Arena</p>
          </div>
          <div className={`logro-card ${usuario.racha >= 10 ? 'desbloqueado' : 'bloqueado'}`}>
            <span>{usuario.racha >= 10 ? '🔥' : '🔒'}</span>
            <p>Racha de 10</p>
          </div>
          <div className={`logro-card ${usuario.nivel >= 10 ? 'desbloqueado' : 'bloqueado'}`}>
            <span>{usuario.nivel >= 10 ? '🌟' : '🔒'}</span>
            <p>Street Legend</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Perfil
