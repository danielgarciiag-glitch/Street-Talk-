/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // 👈 Importamos la navegación

const API = 'https://street-talk-backend.onrender.com'

function Amigos({ setAmigoSeleccionado }) { // 👈 Recibimos el puente de App.jsx
  const navigate = useNavigate() // 👈 Inicializamos el navegador interno
  const [tab, setTab] = useState('amigos')
  const [amigos, setAmigos] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const token = localStorage.getItem('token')

  async function cargarAmigos() {
    try {
      const res = await fetch(`${API}/amigos/lista`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.amigos) setAmigos(data.amigos)
    } catch (err) { console.error(err) }
  }

  async function cargarSolicitudes() {
    try {
      const res = await fetch(`${API}/amigos/solicitudes`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.solicitudes) setSolicitudes(data.solicitudes)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    cargarAmigos()
    cargarSolicitudes()
  }, [])

  async function buscarUsuario() {
    if (!busqueda.trim()) return
    setCargando(true)
    try {
      const res = await fetch(`${API}/desafios/buscar/${busqueda}`, { headers: { authorization: token } })
      const data = await res.json()
      setResultados(data.usuarios || [])
    } catch (err) { console.error(err) }
    setCargando(false)
  }

  async function enviarSolicitud(receptor_id) {
    try {
      const res = await fetch(`${API}/amigos/solicitar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ receptor_id })
      })
      const data = await res.json()
      setMensaje(data.error ? '⚠️ ' + data.error : '✅ Solicitud enviada')
      setResultados([])
      setBusqueda('')
    } catch (err) { console.error(err) }
    setTimeout(() => setMensaje(''), 3000)
  }

  async function responderSolicitud(solicitud_id, accion) {
    try {
      await fetch(`${API}/amigos/responder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ solicitud_id, accion })
      })
      setMensaje(accion === 'aceptar' ? '✅ Amigo aceptado' : '❌ Solicitud rechazada')
      cargarAmigos()
      cargarSolicitudes()
    } catch (err) { console.error(err) }
    setTimeout(() => setMensaje(''), 3000)
  }

  // 🌉 FUNCIÓN MÁGICA DEL PUENTE
  function abrirChatConAmigo(amigo) {
    setAmigoSeleccionado({ id: amigo.id, nombre: amigo.nombre }) // Guardamos sus datos globalmente
    navigate('/chat') // Redirigimos de inmediato al chat
  }

  return (
    <div className="container">
      <h1 className="logo">👥 Amigos</h1>
      <p className="tagline">Conecta con otros jugadores</p>

      {mensaje && <div className="desafio-mensaje">{mensaje}</div>}

      <div className="desafio-tabs">
        <button className={tab === 'amigos' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('amigos')}>
          👥 Mis amigos {amigos.length > 0 && `(${amigos.length})`}
        </button>
        <button className={tab === 'solicitudes' ? 'filtro-activo' : 'filtro-btn'} onClick={() => { setTab('solicitudes'); cargarSolicitudes() }}>
          📩 Solicitudes {solicitudes.length > 0 && `(${solicitudes.length})`}
        </button>
        <button className={tab === 'buscar' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('buscar')}>
          🔍 Buscar
        </button>
      </div>

      {tab === 'amigos' && (
        <div className="pendientes-lista">
          {amigos.length === 0 && <p className="tagline">Aún no tienes amigos agregados</p>}
          {amigos.map(a => (
            <div 
              key={a.id} 
              className="rival-card" 
              onClick={() => abrirChatConAmigo(a)} // 👈 Activamos el clic en toda la tarjeta
              style={{ cursor: 'pointer' }}
              title="Haz clic para enviarle un mensaje"
            >
              <div className="rival-info">
                <span className="rival-nombre">🗣️ {a.nombre}</span>
                <span className="rival-rango">{a.rango}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="rival-xp">⭐ {a.xp} XP</div>
                <span style={{ fontSize: '1.2rem' }}>💬</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'solicitudes' && (
        <div className="pendientes-lista">
          {solicitudes.length === 0 && <p className="tagline">No tienes solicitudes pendientes</p>}
          {solicitudes.map(s => (
            <div key={s.id} className="rival-card">
              <div className="rival-info">
                <span className="rival-nombre">🗣️ {s.nombre}</span>
                <span className="rival-rango">{s.rango}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-retar" onClick={() => responderSolicitud(s.id, 'aceptar')}>✅ Aceptar</button>
                <button className="filtro-btn" onClick={() => responderSolicitud(s.id, 'rechazar')}>❌</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'buscar' && (
        <div className="desafio-buscar">
          <div className="buscar-input-group">
            <input
              className="input-field"
              type="text"
              placeholder="Buscar jugador por nombre..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && buscarUsuario()}
            />
            <button className="btn-primary" onClick={buscarUsuario}>
              {cargando ? '...' : 'Buscar'}
            </button>
          </div>
          {resultados.length === 0 && busqueda && !cargando && (
            <p className="tagline">No se encontraron jugadores</p>
          )}
          <div className="resultados-lista">
            {resultados.map(u => (
              <div key={u.id} className="rival-card">
                <div className="rival-info">
                  <span className="rival-nombre">🗣️ {u.nombre}</span>
                  <span className="rival-rango">{u.rango}</span>
                </div>
                <div className="rival-xp">⭐ {u.xp} XP</div>
                <button className="btn-retar" onClick={() => enviarSolicitud(u.id)}>
                  ➕ Agregar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Amigos