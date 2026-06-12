/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'

const API = 'https://street-talk-backend.onrender.com'

function Chat({ amigoSeleccionado, setAmigoSeleccionado }) {
  const [mensajes, setMensajes] = useState([])
  const [conversaciones, setConversaciones] = useState([])
  const [nuevoMensaje, setNuevoMensaje] = useState('')
  const token = localStorage.getItem('token')
  const usuarioGuardado = localStorage.getItem('usuario')
  const miUsuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null
  const scrollRef = useRef(null)

  async function cargarConversaciones() {
    try {
      const res = await fetch(`${API}/chat/conversaciones`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.conversaciones) setConversaciones(data.conversaciones)
    } catch (err) { console.error(err) }
  }

  async function cargarMensajes() {
    if (!amigoSeleccionado) return
    try {
      const res = await fetch(`${API}/chat/conversacion/${amigoSeleccionado.id}`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.mensajes) setMensajes(data.mensajes)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (!amigoSeleccionado) {
      cargarConversaciones()
    } else {
      cargarMensajes()
      const intervalo = setInterval(cargarMensajes, 3000)
      return () => clearInterval(intervalo)
    }
  }, [amigoSeleccionado])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [mensajes])

  async function enviarMensaje() {
    if (!nuevoMensaje.trim() || !amigoSeleccionado) return
    try {
      const res = await fetch(`${API}/chat/enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ receptor_id: amigoSeleccionado.id, contenido: nuevoMensaje.trim() })
      })
      const data = await res.json()
      if (data.mensaje) {
        setMensajes(prev => [...prev, data.mensaje])
        setNuevoMensaje('')
      }
    } catch (err) { console.error(err) }
  }

  if (!amigoSeleccionado) {
    return (
      <div className="container">
        <h1 className="logo">💬 Mensajes</h1>
        <p className="tagline">Tus conversaciones activas en Street Talk</p>
        <div className="pendientes-lista" style={{ marginTop: '20px' }}>
          {conversaciones.length === 0 ? (
            <p className="tagline" style={{ textAlign: 'center', marginTop: '40px' }}>
              No tienes conversaciones aún. ¡Ve a Amigos y escríbeles!
            </p>
          ) : (
            conversaciones.map(c => (
              <div
                key={c.otro_id}
                className="rival-card"
                onClick={() => setAmigoSeleccionado({ id: c.otro_id, nombre: c.nombre })}
                style={{ cursor: 'pointer' }}
              >
                <div className="rival-info">
                  <span className="rival-nombre">🗣️ {c.nombre}</span>
                  <span className="rival-rango" style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                    {c.ultimo_mensaje || 'Dale click para chatear'}
                  </span>
                </div>
                {c.no_leidos > 0 && (
                  <span style={{ backgroundColor: '#ffcc00', color: '#000', padding: '2px 8px', borderRadius: '50%', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {c.no_leidos}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', height: '82vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <button
          className="filtro-btn"
          onClick={() => setAmigoSeleccionado(null)}
          style={{ padding: '5px 12px', fontSize: '0.9rem' }}
        >
          ⬅️ Volver
        </button>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>🗣️ {amigoSeleccionado.nombre}</h2>
          <p className="tagline" style={{ margin: 0, fontSize: '0.8rem' }}>En línea (Street Talk Live)</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '15px 5px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {mensajes.length === 0 ? (
          <p className="tagline" style={{ textAlign: 'center', marginTop: '30px' }}>
            No hay mensajes previos. ¡Rompe el hielo con algo de jerga!
          </p>
        ) : (
          mensajes.map(m => {
            const esMio = miUsuario && m.remitente_id === miUsuario.id
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: esMio ? 'flex-end' : 'flex-start',
                  backgroundColor: esMio ? '#ffcc00' : '#222',
                  color: esMio ? '#000' : '#fff',
                  padding: '10px 15px',
                  borderRadius: esMio ? '16px 16px 0 16px' : '16px 16px 16px 0',
                  maxWidth: '75%',
                  wordBreak: 'break-word',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.15)'
                }}
              >
                {!esMio && <div style={{ fontSize: '0.7rem', opacity: 0.6, marginBottom: '2px', fontWeight: 'bold' }}>{m.remitente_nombre}</div>}
                <div style={{ fontSize: '0.95rem' }}>{m.contenido}</div>
              </div>
            )
          })
        )}
      </div>

      <div className="buscar-input-group" style={{ marginTop: 'auto', paddingTop: '10px' }}>
        <input
          className="input-field"
          type="text"
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={e => setNuevoMensaje(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" onClick={enviarMensaje}>
          Enviar
        </button>
      </div>
    </div>
  )
}

export default Chat