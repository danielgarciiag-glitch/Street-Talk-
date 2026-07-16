/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useUser } from '../useUser'

const palabrasDisponibles = [
  "no cap", "lowkey", "bussin", "slay", "rizz", "bet", "sus", "hits different", "it's giving", "fr fr",
  "ouf", "chelou", "kiffer", "grave", "mano", "saudade", "bora", "massa"
]

const API = 'http://localhost:3000'

function Arena() {
  const { ganarXP, sumarPartida } = useUser()
  const [modoActivo, setModoActivo] = useState(null)
  const [indice, setIndice] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [puntaje, setPuntaje] = useState(0)
  const [terminado, setTerminado] = useState(false)
  const [xpGanado, setXpGanado] = useState(0)
  const [explicacion, setExplicacion] = useState(null)
  const [preguntas, setPreguntas] = useState([])
  const [cargandoIA, setCargandoIA] = useState(false)
  const [errorIA, setErrorIA] = useState(null)

  const pregunta = preguntas[indice]

  async function iniciarModo(modo) {
    setCargandoIA(true)
    setErrorIA(null)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API}/ia/generar-preguntas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ palabras: palabrasDisponibles, modo })
      })
      const data = await res.json()
      if (data.preguntas && data.preguntas.length > 0) {
        setPreguntas(data.preguntas)
        setModoActivo(modo)
        setIndice(0)
        setPuntaje(0)
        setXpGanado(0)
        setTerminado(false)
        setSeleccion(null)
      } else {
        setErrorIA('No se pudieron generar preguntas. Intenta de nuevo.')
      }
    } catch (err) {
      setErrorIA('Error conectando con la IA. Intenta de nuevo.')
    }
    setCargandoIA(false)
  }

  async function guardarEnDB(xp, gano) {
    const token = localStorage.getItem('token')
    try {
      await fetch(`${API}/usuario/actualizar-xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', authorization: token },
        body: JSON.stringify({ xp_ganado: xp, gano })
      })
    } catch (err) {
      console.error('Error guardando XP:', err)
    }
  }

  function responder(opcion) {
    if (seleccion) return
    setSeleccion(opcion)

    const esCorrecta = opcion === pregunta.respuesta_correcta
    if (esCorrecta) {
      setPuntaje(p => p + 1)
      setXpGanado(x => x + 50)
    }

    if (modoActivo === 'verdadmentira' && pregunta.explicacion) {
      setExplicacion(pregunta.explicacion)
    }

    setTimeout(async () => {
      if (indice + 1 < preguntas.length) {
        setIndice(indice + 1)
        setSeleccion(null)
        setExplicacion(null)
      } else {
        const xpFinal = esCorrecta ? xpGanado + 50 : xpGanado
        const gano = puntaje + (esCorrecta ? 1 : 0) >= Math.floor(preguntas.length / 2)
        await guardarEnDB(xpFinal, gano)
        if (gano) ganarXP(xpFinal)
        else sumarPartida()
        setTerminado(true)
      }
    }, modoActivo === 'verdadmentira' ? 2000 : 1200)
  }

  function reiniciar() {
    setIndice(0)
    setSeleccion(null)
    setPuntaje(0)
    setTerminado(false)
    setXpGanado(0)
    setModoActivo(null)
    setExplicacion(null)
    setPreguntas([])
  }

  if (!modoActivo) {
    return (
      <div className="container">
        <h1 className="logo">⚔️ Language Arena</h1>
        <p className="tagline">Elige tu modo de juego — preguntas generadas por IA</p>

        {errorIA && <div className="desafio-mensaje">⚠️ {errorIA}</div>}

        {cargandoIA ? (
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p className="tagline" style={{ fontSize: '1.2rem' }}>🤖 La IA está generando tus preguntas...</p>
            <p className="tagline">Esto toma unos segundos</p>
          </div>
        ) : (
          <div className="modos-grid">
            <div className="modo-selector" onClick={() => iniciarModo('traduccion')}>
              <span className="modo-icon">⚡</span>
              <h3>Traducción Veloz</h3>
              <p>Traduce frases al slang correcto</p>
              <span className="modo-xp">+50 XP por respuesta · 🤖 IA</span>
            </div>
            <div className="modo-selector" onClick={() => iniciarModo('completar')}>
              <span className="modo-icon">✏️</span>
              <h3>Completar Frases</h3>
              <p>Completa la frase con el slang correcto</p>
              <span className="modo-xp">+50 XP por respuesta · 🤖 IA</span>
            </div>
            <div className="modo-selector" onClick={() => iniciarModo('verdadmentira')}>
              <span className="modo-icon">🤔</span>
              <h3>¿Verdad o Mentira?</h3>
              <p>¿La definición del slang es correcta?</p>
              <span className="modo-xp">+50 XP por respuesta · 🤖 IA</span>
            </div>
            <div className="modo-selector bloqueado">
              <span className="modo-icon">🗣️</span>
              <h3>Pronunciación</h3>
              <p>Próximamente</p>
              <span className="modo-xp">🔒 Pronto</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (terminado) {
    return (
      <div className="container">
        <h1 className="logo">⚔️ Language Arena</h1>
        <div className="resultado-card">
          <p className="resultado-emoji">
            {puntaje >= preguntas.length - 1 ? '🏆' : puntaje >= Math.floor(preguntas.length / 2) ? '💪' : '😅'}
          </p>
          <h2 className="resultado-titulo">
            {puntaje >= preguntas.length - 1 ? '¡Perfecto!' : puntaje >= Math.floor(preguntas.length / 2) ? '¡Buen trabajo!' : '¡Sigue practicando!'}
          </h2>
          <p className="resultado-puntaje">{puntaje} / {preguntas.length} correctas</p>
          <p className="xp-ganado">+{xpGanado} XP ganados</p>
          <button className="btn-primary" onClick={reiniciar}>Jugar de nuevo</button>
        </div>
      </div>
    )
  }

  if (!pregunta) return null

  if (modoActivo === 'verdadmentira') {
    return (
      <div className="container">
        <h1 className="logo">⚔️ Language Arena</h1>
        <p className="tagline">🤔 ¿Verdad o Mentira?</p>
        <div className="arena-card">
          <div className="arena-progreso">
            <span>Pregunta {indice + 1} de {preguntas.length}</span>
            <span>⭐ {puntaje} pts</span>
          </div>
          <h2 className="arena-frase">"{pregunta.palabra}"</h2>
          <p style={{ color: '#ccc', marginBottom: '1.5rem', textAlign: 'center' }}>{pregunta.definicion}</p>
          {explicacion && (
            <div style={{ background: '#2a2a3e', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', color: '#aaa', fontSize: '0.9rem' }}>
              💡 {explicacion}
            </div>
          )}
          <div className="arena-opciones">
            {['verdad', 'mentira'].map(opcion => (
              <button
                key={opcion}
                className={`opcion-btn
                  ${seleccion === opcion && opcion === pregunta.respuesta_correcta ? 'correcta' : ''}
                  ${seleccion === opcion && opcion !== pregunta.respuesta_correcta ? 'incorrecta' : ''}
                  ${seleccion && opcion === pregunta.respuesta_correcta ? 'correcta' : ''}
                `}
                onClick={() => responder(opcion)}
              >
                {opcion === 'verdad' ? '✅ Verdad' : '❌ Mentira'}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="logo">⚔️ Language Arena</h1>
      <p className="tagline">
        {modoActivo === 'traduccion' ? '⚡ Traducción Veloz' : '✏️ Completar Frases'}
      </p>
      <div className="arena-card">
        <div className="arena-progreso">
          <span>Pregunta {indice + 1} de {preguntas.length}</span>
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

export default Arena
