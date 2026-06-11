/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'

const API = 'https://street-talk-backend.onrender.com'

function Torneos() {
  const [torneo, setTorneo] = useState(null)
  const [ranking, setRanking] = useState([])
  const [yaParticipa, setYaParticipa] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const token = localStorage.getItem('token')
  const miId = JSON.parse(atob(token.split('.')[1])).id

  async function cargarTorneo() {
    try {
      const res = await fetch(`${API}/torneos/activo`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.torneo) {
        setTorneo(data.torneo)
        setRanking(data.ranking)
        setYaParticipa(data.yaParticipa)
      }
    } catch (err) { console.error(err) }
  }

  async function unirse() {
    try {
      const res = await fetch(`${API}/torneos/unirse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token }
      })
      const data = await res.json()
      setMensaje(data.error ? '⚠️ ' + data.error : '✅ ' + data.mensaje)
      cargarTorneo()
    } catch (err) { console.error(err) }
    setTimeout(() => setMensaje(''), 3000)
  }

  useEffect(() => { cargarTorneo() }, [])

  function tiempoRestante() {
    if (!torneo) return ''
    const fin = new Date(torneo.fin)
    const ahora = new Date()
    const diff = fin - ahora
    if (diff <= 0) return 'Terminado'
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
    const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${dias}d ${horas}h restantes`
  }

  return (
    <div className="container">
      <h1 className="logo">🏆 Torneos</h1>
      <p className="tagline">Compite cada semana por premios de XP</p>

      {mensaje && <div className="desafio-mensaje">{mensaje}</div>}

      {!torneo ? (
        <p className="tagline">No hay torneos activos en este momento</p>
      ) : (
        <>
          <div className="arena-card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ color: '#6c63ff', marginBottom: '0.5rem' }}>{torneo.nombre}</h2>
            <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>⏳ {tiempoRestante()}</p>
            <p style={{ color: '#f0c040', marginBottom: '1rem' }}>🎁 Premio: {torneo.premio_xp} XP al ganador</p>
            {!yaParticipa ? (
              <button className="btn-primary" onClick={unirse}>⚡ Unirse al torneo</button>
            ) : (
              <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✅ Ya estás participando — juega en Arena o Lecciones para sumar puntos</span>
            )}
          </div>

          <h3 style={{ color: 'white', marginBottom: '1rem' }}>🥇 Ranking del torneo</h3>
          <div className="pendientes-lista">
            {ranking.length === 0 && <p className="tagline">Nadie ha participado aún. ¡Sé el primero!</p>}
            {ranking.map((p, i) => (
              <div key={p.usuario_id} className="rival-card" style={{ border: p.usuario_id === miId ? '1px solid #6c63ff' : '' }}>
                <div className="rival-info">
                  <span className="rival-nombre">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} {p.nombre}
                    {p.usuario_id === miId && <span style={{ color: '#6c63ff' }}> (tú)</span>}
                  </span>
                  <span className="rival-rango">{p.rango}</span>
                </div>
                <div className="rival-xp">⭐ {p.puntaje} pts</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Torneos