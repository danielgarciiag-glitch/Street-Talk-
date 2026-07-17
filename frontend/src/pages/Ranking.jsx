/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react'
import { useUser } from '../useUser'

const API = 'http://localhost:3000'
const LIGA_COLORES = {
  'Bronce': '#cd7f32',
  'Plata': '#c0c0c0',
  'Oro': '#ffd700',
  'Diamante': '#b9f2ff',
  'Legend': '#ff6b6b'
}
const LIGA_EMOJIS = {
  'Bronce': '🥉',
  'Plata': '🥈',
  'Oro': '🥇',
  'Diamante': '💎',
  'Legend': '👑'
}
const LIGAS_ORDEN = ['Bronce', 'Plata', 'Oro', 'Diamante', 'Legend']
const medallas = { 0: '🥇', 1: '🥈', 2: '🥉' }

function Ranking() {
  const { usuario } = useUser()
  const [tab, setTab] = useState('liga')
  const [jugadoresGlobal, setJugadoresGlobal] = useState([])
  const [ligaData, setLigaData] = useState(null)
  const [todasLigas, setTodasLigas] = useState([])
  const [cargando, setCargando] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    cargarTodo()
  }, [])

  async function cargarTodo() {
    setCargando(true)
    try {
      const [resGlobal, resLiga, resLigas] = await Promise.all([
        fetch(`${API}/usuario/ranking`),
        fetch(`${API}/liga/mi-liga`, { headers: { authorization: token } }),
        fetch(`${API}/liga/ligas`, { headers: { authorization: token } })
      ])
      const dataGlobal = await resGlobal.json()
      const dataLiga = await resLiga.json()
      const dataLigas = await resLigas.json()

      if (dataGlobal.jugadores) setJugadoresGlobal(dataGlobal.jugadores)
      if (dataLiga.liga) setLigaData(dataLiga)
      if (dataLigas.ligas) setTodasLigas(dataLigas.ligas)
    } catch (err) { console.error(err) }
    setCargando(false)
  }

  if (cargando) {
    return (
      <div className="container">
        <h1 className="logo">🏆 Ranking</h1>
        <p className="tagline">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="logo">🏆 Ranking</h1>
      <p className="tagline">Compite, sube de liga y domina</p>

      <div className="desafio-tabs">
        <button className={tab === 'liga' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('liga')}>
          {ligaData ? `${LIGA_EMOJIS[ligaData.liga]} Mi Liga` : '🥉 Mi Liga'}
        </button>
        <button className={tab === 'global' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('global')}>
          🌍 Global
        </button>
        <button className={tab === 'ligas' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('ligas')}>
          📊 Todas las Ligas
        </button>
      </div>

      {/* MI LIGA */}
      {tab === 'liga' && ligaData && (
        <div>
          <div className="arena-card" style={{ marginBottom: '1.5rem', borderTop: `3px solid ${LIGA_COLORES[ligaData.liga]}` }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '3rem' }}>{LIGA_EMOJIS[ligaData.liga]}</span>
              <h2 style={{ color: LIGA_COLORES[ligaData.liga], margin: '0.5rem 0' }}>Liga {ligaData.liga}</h2>
              <p style={{ color: '#aaa' }}>Posición #{ligaData.miPosicion} de {ligaData.jugadores.length}</p>

              <div style={{ margin: '1rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#aaa', fontSize: '0.85rem' }}>XP de liga: {ligaData.yo?.liga_xp || 0} / 1000</span>
                  <span style={{ color: LIGA_COLORES[ligaData.liga], fontSize: '0.85rem' }}>
                    {LIGAS_ORDEN.indexOf(ligaData.liga) < 4 ? `→ ${LIGA_EMOJIS[LIGAS_ORDEN[LIGAS_ORDEN.indexOf(ligaData.liga) + 1]]} ${LIGAS_ORDEN[LIGAS_ORDEN.indexOf(ligaData.liga) + 1]}` : '👑 Máximo'}
                  </span>
                </div>
                <div style={{ background: '#2a2a3e', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{
                    background: LIGA_COLORES[ligaData.liga],
                    height: '100%',
                    width: `${Math.min((ligaData.yo?.liga_xp || 0) / 10, 100)}%`,
                    borderRadius: '8px',
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', fontSize: '0.8rem', color: '#aaa' }}>
                <span>🟢 Top 3 suben de liga</span>
                <span>🔴 Últimos 3 bajan</span>
              </div>
            </div>
          </div>

          <div className="pendientes-lista">
            {ligaData.jugadores.map((j, i) => (
              <div
                key={j.id}
                className="rival-card"
                style={{
                  border: j.nombre === usuario?.nombre ? `1px solid ${LIGA_COLORES[ligaData.liga]}` : '',
                  background: i < 3 ? 'rgba(255,215,0,0.05)' : i >= ligaData.jugadores.length - 3 ? 'rgba(244,67,54,0.05)' : ''
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '30px' }}>
                  <span style={{ fontWeight: 'bold', color: i < 3 ? '#4caf50' : i >= ligaData.jugadores.length - 3 ? '#f44336' : '#aaa' }}>
                    {i < 3 ? '▲' : i >= ligaData.jugadores.length - 3 ? '▼' : '—'} {i + 1}
                  </span>
                </div>
                <div className="rival-info">
                  <span className="rival-nombre">
                    {j.nombre}
                    {j.nombre === usuario?.nombre && <span style={{ color: LIGA_COLORES[ligaData.liga] }}> (tú)</span>}
                  </span>
                  <span className="rival-rango">{j.rango}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: LIGA_COLORES[ligaData.liga], fontWeight: 'bold' }}>{j.liga_xp} pts</div>
                  <div style={{ color: '#aaa', fontSize: '0.75rem' }}>⭐ {j.xp} XP total</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GLOBAL */}
      {tab === 'global' && (
        <div className="ranking-container">
          {jugadoresGlobal.map((jugador, index) => (
            <div
              key={jugador.id}
              className={`ranking-fila ${jugador.nombre === usuario?.nombre ? 'eres-tu' : ''}`}
            >
              <span className="ranking-pos">
                {medallas[index] || `#${index + 1}`}
              </span>
              <div className="ranking-info">
                <span className="ranking-nombre">
                  {jugador.nombre}
                  {jugador.nombre === usuario?.nombre && <span className="tu-tag"> TÚ</span>}
                </span>
                <span className="ranking-nivel">
                  {LIGA_EMOJIS[jugador.liga] || '🥉'} {jugador.liga || 'Bronce'} · {jugador.rango}
                </span>
              </div>
              <div className="ranking-stats">
                <span className="ranking-xp">⭐ {jugador.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TODAS LAS LIGAS */}
      {tab === 'ligas' && (
        <div className="pendientes-lista">
          {LIGAS_ORDEN.map(liga => {
            const data = todasLigas.find(l => l.liga === liga)
            const esLaMia = ligaData?.liga === liga
            return (
              <div
                key={liga}
                className="rival-card"
                style={{ border: esLaMia ? `1px solid ${LIGA_COLORES[liga]}` : '' }}
              >
                <div style={{ fontSize: '2rem' }}>{LIGA_EMOJIS[liga]}</div>
                <div className="rival-info">
                  <span className="rival-nombre" style={{ color: LIGA_COLORES[liga] }}>
                    Liga {liga}
                    {esLaMia && <span style={{ color: '#6c63ff' }}> (tú estás aquí)</span>}
                  </span>
                  <span className="rival-rango">
                    {data ? `👥 ${data.total} jugadores` : '👥 0 jugadores'}
                  </span>
                </div>
                <div style={{ textAlign: 'right', color: '#aaa', fontSize: '0.85rem' }}>
                  {LIGAS_ORDEN.indexOf(liga) === 0 ? '🔰 Inicio' :
                   LIGAS_ORDEN.indexOf(liga) === 4 ? '👑 Élite' : '⚡ Intermedio'}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Ranking