/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef } from 'react'

const API = 'https://street-talk-backend.onrender.com'

function Chat() {
  const [conversaciones, setConversaciones] = useState([])
  const [chatActivo, setChatActivo] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [texto, setTexto] = useState('')
  const [cargando, setCargando] = useState(false)
  const token = localStorage.getItem('token')
  const miId = JSON.parse(atob(token.split('.')[1])).id
  const bottomRef = useRef(null)

  async function cargarConversaciones() {
    try {
      const res = await fetch(`${API}/chat/conversaciones`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.conversaciones) setConversaciones(data.conversaciones)
    } catch (err) { console.error(err) }
  }

  async function abrirChat(otro) {
    setChatActivo(otro)
    setCargando(true)
    try {
      const res = await fetch(`${API}/chat/conversacion/${otro.otro_id}`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.mensajes) setMensajes(data.mensajes)
    } catch (err) { console.error(err) }
    setCargando(false)
  }

  async function enviarMensaje() {
    if (!texto.trim() || !chatActivo) return
    try {
      await fetch(`${API}/chat/enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ receptor_id: chatActivo.otro_id, contenido: texto })
      })
      setTexto('')
      const res = await fetch(`${API}/chat/conversacion/${chatActivo.otro_id}`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.mensajes) setMensajes(data.mensajes)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    cargarConversaciones()
    const intervalo = setInterval(cargarConversaciones, 5000)
    return () => clearInterval(intervalo)
  }, [])

  useEffect(() => {
    if (chatActivo) {
      const intervalo = setInterval(() => abrirChat(chatActivo), 3000)
      return () => clearInterval(intervalo)
    }
  }, [chatActivo])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  return (
    <div className="container">
      <h1 className="logo">💬 Chat</h1>
      <p className="tagline">Habla con tus amigos</p>

      {!chatActivo ? (
        <div className="pendientes-lista">
          {conversaciones.length === 0 && (
            <p className="tagline">No tienes conversaciones aún. ¡Agrega amigos y escríbeles!</p>
          )}
          {conversaciones.map(c => (
            <div key={c.otro_id} className="rival-card" style={{ cursor: 'pointer' }} onClick={() => abrirChat(c)}>
              <div className="rival-info">
                <span className="rival-nombre">🗣️ {c.nombre}</span>
                <span className="rival-rango" style={{ fontSize: '0.8rem', color: '#aaa' }}>
                  {c.ultimo_mensaje?.substring(0, 30)}...
                </span>
              </div>
              {c.no_leidos > 0 && (
                <span style={{ background: '#6c63ff', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem' }}>
                  {c.no_leidos}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <button className="filtro-btn" onClick={() => { setChatActivo(null); cargarConversaciones() }}>← Volver</button>
            <span className="rival-nombre">💬 {chatActivo.nombre}</span>
          </div>

          <div className="chat-mensajes">
            {cargando && <p className="tagline">Cargando...</p>}
            {mensajes.map(m => (
              <div
                key={m.id}
                className={`chat-burbuja ${m.remitente_id === miId ? 'mio' : 'suyo'}`}
              >
                <span>{m.contenido}</span>
                <small>{new Date(m.creado_en).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-group">
            <input
              className="input-field"
              type="text"
              placeholder="Escribe un mensaje..."
              value={texto}
              onChange={e => setTexto(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviarMensaje()}
            />
            <button className="btn-primary" onClick={enviarMensaje}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat