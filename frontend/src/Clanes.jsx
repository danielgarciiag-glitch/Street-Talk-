/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'

const API = 'http://localhost:3000'

function Clanes() {
  const [tab, setTab] = useState('mi-clan')
  const [miClan, setMiClan] = useState(null)
  const [miembros, setMiembros] = useState([])
  const [miRol, setMiRol] = useState(null)
  const [ranking, setRanking] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const token = localStorage.getItem('token')
  const miId = JSON.parse(atob(token.split('.')[1])).id

  async function cargarMiClan() {
    try {
      const res = await fetch(`${API}/clanes/mi-clan`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.clan) {
        setMiClan(data.clan)
        setMiembros(data.miembros)
        setMiRol(data.miRol)
      } else {
        setMiClan(null)
        setMiembros([])
        setMiRol(null)
      }
    } catch (err) { console.error(err) }
  }

  async function cargarRanking() {
    try {
      const res = await fetch(`${API}/clanes/ranking`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.clanes) setRanking(data.clanes)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    cargarMiClan()
    cargarRanking()
  }, [])

  async function crearClan() {
    if (!nombre.trim()) return
    setCargando(true)
    try {
      const res = await fetch(`${API}/clanes/crear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ nombre, descripcion })
      })
      const data = await res.json()
      if (data.error) {
        setMensaje('⚠️ ' + data.error)
      } else {
        setMensaje('✅ ¡Clan creado!')
        setNombre('')
        setDescripcion('')
        cargarMiClan()
        cargarRanking()
        setTab('mi-clan')
      }
    } catch (err) { console.error(err) }
    setCargando(false)
    setTimeout(() => setMensaje(''), 3000)
  }

  async function unirse(clan_id) {
    try {
      const res = await fetch(`${API}/clanes/unirse/${clan_id}`, {
        method: 'POST',
        headers: { authorization: token }
      })
      const data = await res.json()
      if (data.error) {
        setMensaje('⚠️ ' + data.error)
      } else {
        setMensaje('✅ ' + data.mensaje)
        cargarMiClan()
        cargarRanking()
        setTab('mi-clan')
      }
    } catch (err) { console.error(err) }
    setTimeout(() => setMensaje(''), 3000)
  }

  async function salirClan() {
    if (!confirm('¿Seguro que quieres salir del clan?')) return
    try {
      const res = await fetch(`${API}/clanes/salir`, {
        method: 'POST',
        headers: { authorization: token }
      })
      const data = await res.json()
      setMensaje(data.error ? '⚠️ ' + data.error : '✅ ' + data.mensaje)
      cargarMiClan()
      cargarRanking()
    } catch (err) { console.error(err) }
    setTimeout(() => setMensaje(''), 3000)
  }

  async function buscarClanes() {
    if (!busqueda.trim()) return
    try {
      const res = await fetch(`${API}/clanes/buscar/${busqueda}`, { headers: { authorization: token } })
      const data = await res.json()
      setResultados(data.clanes || [])
    } catch (err) { console.error(err) }
  }

  return (
    <div className="container">
      <h1 className="logo">🛡️ Clanes</h1>
      <p className="tagline">Únete a un equipo y compite contra otros clanes</p>

      {mensaje && <div className="desafio-mensaje">{mensaje}</div>}

      <div className="desafio-tabs">
        <button className={tab === 'mi-clan' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('mi-clan')}>
          🛡️ Mi Clan
        </button>
        <button className={tab === 'ranking' ? 'filtro-activo' : 'filtro-btn'} onClick={() => { setTab('ranking'); cargarRanking() }}>
          🏆 Ranking
        </button>
        <button className={tab === 'buscar' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('buscar')}>
          🔍 Buscar
        </button>
        {!miClan && (
          <button className={tab === 'crear' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('crear')}>
            ➕ Crear
          </button>
        )}
      </div>

      {/* MI CLAN */}
      {tab === 'mi-clan' && (
        <div>
          {!miClan ? (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p className="tagline" style={{ fontSize: '3rem' }}>🛡️</p>
              <p className="tagline">No perteneces a ningún clan todavía</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={() => setTab('crear')}>➕ Crear clan</button>
                <button className="filtro-btn" onClick={() => setTab('buscar')}>🔍 Buscar clan</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="arena-card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ color: '#6c63ff', fontSize: '1.8rem', margin: 0 }}>🛡️ {miClan.nombre}</h2>
                    {miClan.descripcion && <p style={{ color: '#aaa', marginTop: '0.5rem' }}>{miClan.descripcion}</p>}
                    <p style={{ color: '#f0c040', marginTop: '0.5rem' }}>⭐ {Number(miClan.xp_total).toLocaleString()} XP del clan</p>
                    <p style={{ color: '#aaa', fontSize: '0.85rem' }}>👥 {miembros.length} miembro{miembros.length !== 1 ? 's' : ''}</p>
                  </div>
                  {miRol === 'lider' && (
                    <span style={{ background: '#f0c040', color: '#000', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      👑 Líder
                    </span>
                  )}
                </div>
              </div>

              <h3 style={{ color: 'white', marginBottom: '1rem' }}>👥 Miembros</h3>
              <div className="pendientes-lista">
                {miembros.map((m, i) => (
                  <div key={m.id} className="rival-card">
                    <div className="rival-info">
                      <span className="rival-nombre">
                        {m.rol === 'lider' ? '👑' : '🗣️'} {m.nombre}
                        {m.id === miId && <span style={{ color: '#6c63ff' }}> (tú)</span>}
                      </span>
                      <span className="rival-rango">{m.rango}</span>
                    </div>
                    <div className="rival-xp">⭐ {m.xp} XP</div>
                  </div>
                ))}
              </div>

              <button
                onClick={salirClan}
                style={{ marginTop: '1.5rem', background: 'transparent', border: '1px solid #f44336', color: '#f44336', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer' }}
              >
                🚪 Salir del clan
              </button>
            </div>
          )}
        </div>
      )}

      {/* RANKING */}
      {tab === 'ranking' && (
        <div className="pendientes-lista">
          {ranking.length === 0 && <p className="tagline">No hay clanes aún. ¡Sé el primero!</p>}
          {ranking.map((c, i) => (
            <div key={c.id} className="rival-card" style={{ border: miClan?.id === c.id ? '1px solid #6c63ff' : '' }}>
              <div className="rival-info">
                <span className="rival-nombre">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`} 🛡️ {c.nombre}
                  {miClan?.id === c.id && <span style={{ color: '#6c63ff' }}> (tu clan)</span>}
                </span>
                <span className="rival-rango">👑 {c.lider_nombre} · 👥 {c.total_miembros}</span>
              </div>
              <div className="rival-xp">⭐ {Number(c.xp_total).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      {/* BUSCAR */}
      {tab === 'buscar' && (
        <div className="desafio-buscar">
          <div className="buscar-input-group">
            <input
              className="input-field"
              type="text"
              placeholder="Buscar clan por nombre..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarClanes()}
            />
            <button className="btn-primary" onClick={buscarClanes}>Buscar</button>
          </div>
          <div className="resultados-lista">
            {resultados.map(c => (
              <div key={c.id} className="rival-card">
                <div className="rival-info">
                  <span className="rival-nombre">🛡️ {c.nombre}</span>
                  <span className="rival-rango">👑 {c.lider_nombre} · 👥 {c.total_miembros} miembros</span>
                  {c.descripcion && <span style={{ color: '#aaa', fontSize: '0.8rem' }}>{c.descripcion}</span>}
                </div>
                {!miClan && (
                  <button className="btn-retar" onClick={() => unirse(c.id)}>➕ Unirse</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREAR */}
      {tab === 'crear' && !miClan && (
        <div style={{ marginTop: '1rem' }}>
          <div className="arena-card">
            <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>➕ Crear nuevo clan</h3>
            <input
              className="input-field"
              type="text"
              placeholder="Nombre del clan (mín. 3 caracteres)"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              style={{ marginBottom: '1rem' }}
              maxLength={50}
            />
            <input
              className="input-field"
              type="text"
              placeholder="Descripción (opcional)"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              style={{ marginBottom: '1.5rem' }}
              maxLength={100}
            />
            <button className="btn-primary" onClick={crearClan} disabled={cargando}>
              {cargando ? 'Creando...' : '🛡️ Crear clan'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clanes