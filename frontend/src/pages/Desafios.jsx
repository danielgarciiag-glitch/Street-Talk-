/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'

const preguntasDesafio = [
  { frase: "En serio, esa fiesta estuvo increíble", respuesta_correcta: "no cap", opciones: ["no cap", "lowkey", "slay", "bussin"] },
  { frase: "Esa comida estaba deliciosa", respuesta_correcta: "bussin", opciones: ["slay", "bussin", "lowkey", "no cap"] },
  { frase: "Ella lo hizo increíble en el escenario", respuesta_correcta: "slay", opciones: ["bussin", "no cap", "slay", "lowkey"] },
  { frase: "En secreto me encanta esa canción", respuesta_correcta: "lowkey", opciones: ["no cap", "lowkey", "bussin", "slay"] },
  { frase: "Bro tiene demasiado carisma", respuesta_correcta: "rizz", opciones: ["rizz", "bet", "sus", "fr fr"] }
]

const APUESTAS = [0, 50, 100, 200, 500]
const API = 'http://localhost:3000'

function Desafios() {
  const [tab, setTab] = useState('buscar')
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [pendientes, setPendientes] = useState([])
  const [desafioActivo, setDesafioActivo] = useState(null)
  const [indice, setIndice] = useState(0)
  const [puntaje, setPuntaje] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [terminado, setTerminado] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)
  const [apuestaSeleccionada, setApuestaSeleccionada] = useState(0)
  const [rivalSeleccionado, setRivalSeleccionado] = useState(null)
  const [miXP, setMiXP] = useState(0)

  const token = localStorage.getItem('token')
  const miId = JSON.parse(atob(token.split('.')[1])).id

  useEffect(() => {
    cargarPendientes()
    cargarMiXP()
  }, [])

  async function cargarMiXP() {
    try {
      const res = await fetch(`${API}/usuario/perfil`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.usuario) setMiXP(data.usuario.xp)
    } catch (err) { console.error(err) }
  }

  async function cargarPendientes() {
    try {
      const res = await fetch(`${API}/desafios/pendientes`, { headers: { authorization: token } })
      const data = await res.json()
      if (data.desafios) setPendientes(data.desafios)
    } catch (err) { console.error(err) }
  }

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

  function seleccionarRival(usuario) {
    setRivalSeleccionado(usuario)
    setApuestaSeleccionada(0)
  }

  async function enviarDesafio() {
    if (!rivalSeleccionado) return
    try {
      const res = await fetch(`${API}/desafios/enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ retado_id: rivalSeleccionado.id, idioma: 'Inglés', apuesta: apuestaSeleccionada })
      })
      const data = await res.json()
      if (data.error) {
        setMensaje('⚠️ ' + data.error)
      } else {
        setMensaje(`✅ ¡Desafío enviado${apuestaSeleccionada > 0 ? ` con apuesta de ${apuestaSeleccionada} XP` : ''}!`)
        setResultados([])
        setBusqueda('')
        setRivalSeleccionado(null)
        setApuestaSeleccionada(0)
        cargarMiXP()
      }
      setTimeout(() => setMensaje(''), 3000)
    } catch (err) { console.error(err) }
  }

  function iniciarDesafio(desafio) {
    setDesafioActivo(desafio)
    setIndice(0)
    setPuntaje(0)
    setSeleccion(null)
    setTerminado(false)
    setResultado(null)
  }

  function responder(opcion) {
    if (seleccion) return
    setSeleccion(opcion)
    const esCorrecta = opcion === preguntasDesafio[indice].respuesta_correcta
    if (esCorrecta) setPuntaje(p => p + 1)

    setTimeout(async () => {
      if (indice + 1 < preguntasDesafio.length) {
        setIndice(indice + 1)
        setSeleccion(null)
      } else {
        const puntajeFinal = esCorrecta ? puntaje + 1 : puntaje
        try {
          const res = await fetch(`${API}/desafios/completar/${desafioActivo.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', authorization: token },
            body: JSON.stringify({ puntaje: puntajeFinal })
          })
          const data = await res.json()
          if (data.resultado) setResultado(data)
        } catch (err) { console.error(err) }
        setTerminado(true)
        cargarPendientes()
        cargarMiXP()
      }
    }, 1200)
  }

  // PANTALLA DE JUEGO
  if (desafioActivo && !terminado) {
    const pregunta = preguntasDesafio[indice]
    return (
      <div className="container">
        <h1 className="logo">⚔️ Desafío</h1>
        {desafioActivo.apuesta > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <span style={{ background: '#f0c040', color: '#000', padding: '4px 16px', borderRadius: '20px', fontWeight: 'bold' }}>
              💰 Apuesta: {desafioActivo.apuesta} XP en juego
            </span>
          </div>
        )}
        <div className="arena-card">
          <div className="arena-progreso">
            <span>Pregunta {indice + 1} de {preguntasDesafio.length}</span>
            <span>⭐ {puntaje} pts</span>
          </div>
          <h2 className="arena-frase">"{pregunta.frase}"</h2>
          <div className="arena-opciones">
            {pregunta.opciones.map(opcion => (
              <button
                key={opcion}
                className={`opcion-btn
                  ${seleccion === opcion && opcion === pregunta.respuesta_correcta ? 'correcta' : ''}
                  ${seleccion === opcion && opcion !== pregunta.respuesta_correcta ? 'incorrecta' : ''}
                  ${seleccion && opcion === pregunta.respuesta_correcta ? 'correcta' : ''}
                `}
                onClick={() => responder(opcion)}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // PANTALLA DE RESULTADO
  if (desafioActivo && terminado) {
   const yoGane = resultado?.resultado === (Number(desafioActivo.retador_id) === Number(miId) ? 'retador' : 'retado')
    const esEmpate = resultado?.resultado === 'empate'
    const apuesta = desafioActivo.apuesta || 0

    return (
      <div className="container">
        <h1 className="logo">⚔️ Resultado</h1>
        <div className="resultado-card">
          <p className="resultado-emoji">
            {esEmpate ? '🤝' : yoGane ? '🏆' : '😅'}
          </p>
          <h2 className="resultado-titulo">
            {esEmpate ? '¡Empate!' : yoGane ? '¡Ganaste!' : '¡Perdiste!'}
          </h2>
          <p className="resultado-puntaje">{puntaje} / {preguntasDesafio.length} correctas</p>

          {apuesta > 0 && (
            <div style={{ margin: '1rem 0', padding: '1rem', background: '#1a1a2e', borderRadius: '12px' }}>
              {esEmpate && <p style={{ color: '#f0c040' }}>🤝 Se devolvió la apuesta: +{apuesta} XP</p>}
              {yoGane && <p style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '1.2rem' }}>💰 ¡Ganaste {apuesta * 2} XP!</p>}
              {!yoGane && !esEmpate && <p style={{ color: '#f44336' }}>💸 Perdiste {apuesta} XP</p>}
            </div>
          )}

          <button className="btn-primary" onClick={() => setDesafioActivo(null)}>
            Volver a Desafíos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="logo">⚔️ Desafíos</h1>
      <p className="tagline">Reta a otros jugadores — apuesta XP y gana el doble</p>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <span style={{ background: '#2a2a3e', padding: '6px 16px', borderRadius: '20px', color: '#f0c040' }}>
          💰 Tu XP disponible: {miXP}
        </span>
      </div>

      {mensaje && <div className="desafio-mensaje">{mensaje}</div>}

      <div className="desafio-tabs">
        <button className={tab === 'buscar' ? 'filtro-activo' : 'filtro-btn'} onClick={() => setTab('buscar')}>
          🔍 Buscar rival
        </button>
        <button className={tab === 'pendientes' ? 'filtro-activo' : 'filtro-btn'} onClick={() => { setTab('pendientes'); cargarPendientes() }}>
          ⏳ Pendientes {pendientes.length > 0 && `(${pendientes.length})`}
        </button>
      </div>

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
            <p className="tagline">No se encontraron jugadores con ese nombre</p>
          )}

          <div className="resultados-lista">
            {resultados.map(u => (
              <div key={u.id} className={`rival-card ${rivalSeleccionado?.id === u.id ? 'rival-seleccionado' : ''}`}>
                <div className="rival-info">
                  <span className="rival-nombre">🗣️ {u.nombre}</span>
                  <span className="rival-rango">{u.rango}</span>
                </div>
                <div className="rival-xp">⭐ {u.xp} XP</div>
                <button className="btn-retar" onClick={() => seleccionarRival(u)}>
                  ⚔️ Retar
                </button>
              </div>
            ))}
          </div>

          {rivalSeleccionado && (
            <div style={{ marginTop: '1.5rem', background: '#1a1a2e', padding: '1.5rem', borderRadius: '16px', border: '1px solid #6c63ff' }}>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}>⚔️ Retando a {rivalSeleccionado.nombre}</h3>
              <p style={{ color: '#aaa', marginBottom: '1rem' }}>💰 ¿Quieres apostar XP? El ganador se lleva el doble.</p>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {APUESTAS.map(monto => (
                  <button
                    key={monto}
                    onClick={() => setApuestaSeleccionada(monto)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: apuestaSeleccionada === monto ? '2px solid #f0c040' : '2px solid #333',
                      background: apuestaSeleccionada === monto ? '#f0c040' : '#2a2a3e',
                      color: apuestaSeleccionada === monto ? '#000' : 'white',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    {monto === 0 ? 'Sin apuesta' : `${monto} XP`}
                  </button>
                ))}
              </div>

              {apuestaSeleccionada > 0 && (
                <p style={{ color: '#f0c040', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  ⚠️ Se descontarán {apuestaSeleccionada} XP de tu cuenta ahora. El ganador recibe {apuestaSeleccionada * 2} XP.
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" onClick={enviarDesafio}>
                  {apuestaSeleccionada > 0 ? `💰 Apostar ${apuestaSeleccionada} XP y retar` : '⚔️ Retar sin apuesta'}
                </button>
                <button className="filtro-btn" onClick={() => setRivalSeleccionado(null)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'pendientes' && (
        <div className="pendientes-lista">
          {pendientes.length === 0 && <p className="tagline">No tienes desafíos pendientes</p>}
          {pendientes.map(d => {
            const soyRetado = Number(d.retado_id) === Number(miId)
            return (
              <div key={d.id} className="rival-card">
                <div className="rival-info">
                  <span className="rival-nombre">
                    {soyRetado ? `⚔️ ${d.retador_nombre} te retó` : `⏳ Retaste a ${d.retado_nombre}`}
                  </span>
                  <span className="rival-rango">{d.idioma}</span>
                  {d.apuesta > 0 && (
                    <span style={{ color: '#f0c040', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      💰 Apuesta: {d.apuesta} XP
                    </span>
                  )}
                </div>
                {soyRetado ? (
                  <button className="btn-retar" onClick={() => iniciarDesafio(d)}>▶️ Jugar</button>
                ) : (
                  <span style={{ color: '#aaa', fontSize: '0.85rem' }}>⏳ Esperando</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Desafios