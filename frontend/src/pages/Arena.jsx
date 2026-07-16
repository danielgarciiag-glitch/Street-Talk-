import { useState } from 'react'
import { useUser } from '../useUser'

const bancoPorPalabra = {
  "no cap": [
    { frase: "En serio, esa fiesta estuvo increíble", respuesta_correcta: "no cap", opciones: ["no cap", "lowkey", "slay", "bet"] },
    { frase: "Te juro que no estoy mintiendo", respuesta_correcta: "no cap", opciones: ["bussin", "no cap", "sus", "fr fr"] },
    { frase: "De verdad me encantó esa película", respuesta_correcta: "no cap", opciones: ["rizz", "lowkey", "no cap", "bet"] }
  ],
  "lowkey": [
    { frase: "En secreto me encanta esa canción", respuesta_correcta: "lowkey", opciones: ["no cap", "lowkey", "bussin", "slay"] },
    { frase: "Un poco me da miedo pero no lo admito", respuesta_correcta: "lowkey", opciones: ["lowkey", "bet", "sus", "rizz"] },
    { frase: "Discretamente me gusta ese chico", respuesta_correcta: "lowkey", opciones: ["slay", "lowkey", "fr fr", "bussin"] }
  ],
  "bussin": [
    { frase: "Esa comida estaba deliciosa", respuesta_correcta: "bussin", opciones: ["slay", "bussin", "lowkey", "no cap"] },
    { frase: "Este restaurante está increíble", respuesta_correcta: "bussin", opciones: ["bussin", "bet", "rizz", "sus"] },
    { frase: "Las papas fritas de aquí están brutales", respuesta_correcta: "bussin", opciones: ["fr fr", "slay", "bussin", "lowkey"] }
  ],
  "slay": [
    { frase: "Ella lo hizo increíble en el escenario", respuesta_correcta: "slay", opciones: ["bussin", "no cap", "slay", "lowkey"] },
    { frase: "Ese outfit es perfecto, lo clavó", respuesta_correcta: "slay", opciones: ["slay", "bet", "sus", "rizz"] },
    { frase: "Brilló en toda la presentación", respuesta_correcta: "slay", opciones: ["lowkey", "slay", "fr fr", "bussin"] }
  ],
  "rizz": [
    { frase: "Bro tiene demasiado carisma con las chicas", respuesta_correcta: "rizz", opciones: ["rizz", "bet", "sus", "fr fr"] },
    { frase: "Ese tipo tiene un poder de atracción increíble", respuesta_correcta: "rizz", opciones: ["slay", "rizz", "lowkey", "bussin"] },
    { frase: "Le habló y ella cayó inmediatamente, tiene demasiado", respuesta_correcta: "rizz", opciones: ["no cap", "bet", "rizz", "sus"] }
  ],
  "bet": [
    { frase: "De acuerdo, nos vemos a las 5", respuesta_correcta: "bet", opciones: ["slay", "bet", "sus", "no cap"] },
    { frase: "Listo, ahí estaré", respuesta_correcta: "bet", opciones: ["bet", "rizz", "lowkey", "fr fr"] },
    { frase: "Ok perfecto, confirmado", respuesta_correcta: "bet", opciones: ["bussin", "slay", "bet", "lowkey"] }
  ],
  "sus": [
    { frase: "Ese tipo está actuando muy raro", respuesta_correcta: "sus", opciones: ["rizz", "bet", "sus", "fr fr"] },
    { frase: "No confío en él, hay algo sospechoso", respuesta_correcta: "sus", opciones: ["slay", "sus", "lowkey", "bussin"] },
    { frase: "Eso que hizo fue muy extraño", respuesta_correcta: "sus", opciones: ["no cap", "bet", "rizz", "sus"] }
  ],
  "hits different": [
    { frase: "Esta canción se siente diferente de noche", respuesta_correcta: "hits different", opciones: ["hits different", "lowkey", "slay", "bussin"] },
    { frase: "Ese café sabe mejor cuando hace frío", respuesta_correcta: "hits different", opciones: ["bet", "hits different", "rizz", "fr fr"] },
    { frase: "La música en vivo toca de otra manera", respuesta_correcta: "hits different", opciones: ["slay", "no cap", "hits different", "sus"] }
  ],
  "fr fr": [
    { frase: "De verdad de verdad que fue el mejor día", respuesta_correcta: "fr fr", opciones: ["fr fr", "bet", "sus", "lowkey"] },
    { frase: "En serio en serio que no lo puedo creer", respuesta_correcta: "fr fr", opciones: ["slay", "fr fr", "rizz", "bussin"] },
    { frase: "Esto es real, no estoy exagerando", respuesta_correcta: "fr fr", opciones: ["no cap", "bet", "fr fr", "sus"] }
  ],
  "flex": [
    { frase: "Siempre presumiendo su carro nuevo", respuesta_correcta: "flex", opciones: ["flex", "drip", "slay", "rizz"] },
    { frase: "Muestra su dinero en cada historia", respuesta_correcta: "flex", opciones: ["drip", "flex", "bussin", "bet"] },
    { frase: "Está alardeando de sus tenis en Instagram", respuesta_correcta: "flex", opciones: ["slay", "rizz", "flex", "fr fr"] }
  ],
  "drip": [
    { frase: "Su ropa hoy está demasiado cool", respuesta_correcta: "drip", opciones: ["drip", "flex", "slay", "rizz"] },
    { frase: "Tiene un estilo increíble ese tipo", respuesta_correcta: "drip", opciones: ["bussin", "drip", "bet", "sus"] },
    { frase: "Todo lo que usa le queda perfecto", respuesta_correcta: "drip", opciones: ["slay", "fr fr", "drip", "lowkey"] }
  ],
  "ouf": [
    { frase: "Esa película estuvo increíble", respuesta_correcta: "ouf", opciones: ["ouf", "chelou", "grave", "kiffer"] },
    { frase: "Ese concierto estuvo loco", respuesta_correcta: "ouf", opciones: ["chelou", "ouf", "kiffer", "grave"] },
    { frase: "Qué situación tan extrema", respuesta_correcta: "ouf", opciones: ["grave", "kiffer", "chelou", "ouf"] }
  ],
  "chelou": [
    { frase: "Ese tipo es realmente raro y sospechoso", respuesta_correcta: "chelou", opciones: ["chelou", "ouf", "grave", "kiffer"] },
    { frase: "Esa situación me pareció muy extraña", respuesta_correcta: "chelou", opciones: ["kiffer", "chelou", "ouf", "grave"] },
    { frase: "Hay algo raro en ese lugar", respuesta_correcta: "chelou", opciones: ["grave", "ouf", "chelou", "kiffer"] }
  ],
  "kiffer": [
    { frase: "Me encanta demasiado esa música", respuesta_correcta: "kiffer", opciones: ["kiffer", "chelou", "grave", "ouf"] },
    { frase: "Amo ese restaurante francés", respuesta_correcta: "kiffer", opciones: ["grave", "kiffer", "ouf", "chelou"] },
    { frase: "Le gusta mucho el fútbol", respuesta_correcta: "kiffer", opciones: ["ouf", "chelou", "kiffer", "grave"] }
  ],
  "grave": [
    { frase: "Tienes razón, totalmente de acuerdo", respuesta_correcta: "grave", opciones: ["grave", "ouf", "chelou", "kiffer"] },
    { frase: "Exacto, eso fue lo que pasó", respuesta_correcta: "grave", opciones: ["chelou", "grave", "kiffer", "ouf"] },
    { frase: "Sí completamente, sin duda", respuesta_correcta: "grave", opciones: ["kiffer", "ouf", "grave", "chelou"] }
  ],
  "mano": [
    { frase: "Amigo, qué situación tan rara", respuesta_correcta: "mano", opciones: ["mano", "bora", "massa", "saudade"] },
    { frase: "Bro, no puedo creerlo", respuesta_correcta: "mano", opciones: ["bora", "mano", "salve", "massa"] },
    { frase: "Oye amigo, ven acá", respuesta_correcta: "mano", opciones: ["massa", "saudade", "mano", "bora"] }
  ],
  "bora": [
    { frase: "Vamos a la fiesta ya", respuesta_correcta: "bora", opciones: ["bora", "mano", "massa", "salve"] },
    { frase: "Let's go, nos vamos", respuesta_correcta: "bora", opciones: ["massa", "bora", "mano", "saudade"] },
    { frase: "Apúrate que nos vamos", respuesta_correcta: "bora", opciones: ["salve", "saudade", "bora", "massa"] }
  ],
  "massa": [
    { frase: "Qué show tan increíble fue ese", respuesta_correcta: "massa", opciones: ["massa", "bora", "mano", "salve"] },
    { frase: "Esa película estuvo genial", respuesta_correcta: "massa", opciones: ["bora", "massa", "saudade", "mano"] },
    { frase: "Estuvo brutal esa fiesta", respuesta_correcta: "massa", opciones: ["salve", "mano", "massa", "bora"] }
  ],
  "sugoi": [
    { frase: "¡Wow, eso es increíble!", respuesta_correcta: "sugoi", opciones: ["sugoi", "kawaii", "yabai", "nakama"] },
    { frase: "¡Asombroso, no puedo creerlo!", respuesta_correcta: "sugoi", opciones: ["kawaii", "sugoi", "oshi", "yabai"] },
    { frase: "¡Qué impresionante ese resultado!", respuesta_correcta: "sugoi", opciones: ["yabai", "nakama", "sugoi", "kawaii"] }
  ],
  "kawaii": [
    { frase: "Ese gatito es demasiado tierno", respuesta_correcta: "kawaii", opciones: ["kawaii", "sugoi", "yabai", "oshi"] },
    { frase: "Qué cosa tan adorable y cute", respuesta_correcta: "kawaii", opciones: ["nakama", "kawaii", "sugoi", "yabai"] },
    { frase: "Ese personaje es muy lindo", respuesta_correcta: "kawaii", opciones: ["yabai", "oshi", "kawaii", "sugoi"] }
  ],
  "yabai": [
    { frase: "Eso puede ser muy malo o increíble según el contexto", respuesta_correcta: "yabai", opciones: ["yabai", "sugoi", "kawaii", "nakama"] },
    { frase: "Esa situación está brutal", respuesta_correcta: "yabai", opciones: ["kawaii", "yabai", "oshi", "sugoi"] },
    { frase: "Esto está muy extremo", respuesta_correcta: "yabai", opciones: ["nakama", "sugoi", "yabai", "kawaii"] }
  ]
}

const preguntasGenericas = [
  { frase: "En serio, esa fiesta estuvo increíble", respuesta_correcta: "no cap", opciones: ["no cap", "lowkey", "slay", "bussin"] },
  { frase: "En secreto me encanta esa canción", respuesta_correcta: "lowkey", opciones: ["no cap", "lowkey", "bussin", "slay"] },
  { frase: "Esa comida estaba deliciosa", respuesta_correcta: "bussin", opciones: ["slay", "bussin", "lowkey", "no cap"] },
  { frase: "Ella lo hizo increíble en el escenario", respuesta_correcta: "slay", opciones: ["bussin", "no cap", "slay", "lowkey"] },
  { frase: "Bro tiene demasiado carisma", respuesta_correcta: "rizz", opciones: ["rizz", "bet", "sus", "fr fr"] }
]

const API = 'http://localhost:3000'

function Arena({ palabraPractica, setPalabraPractica }) {
  const { ganarXP, sumarPartida } = useUser()
  const [modoActivo, setModoActivo] = useState(palabraPractica ? 'practica' : null)
  const [indice, setIndice] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [puntaje, setPuntaje] = useState(0)
  const [terminado, setTerminado] = useState(false)
  const [xpGanado, setXpGanado] = useState(0)
  const [preguntas, setPreguntas] = useState(() => {
    if (palabraPractica) {
      const clave = palabraPractica.toLowerCase()
      return bancoPorPalabra[clave] || preguntasGenericas.slice(0, 3)
    }
    return []
  })

  const pregunta = preguntas[indice]

  async function iniciarModo(modo) {
    setPreguntas(preguntasGenericas)
    setModoActivo(modo)
    setIndice(0)
    setPuntaje(0)
    setXpGanado(0)
    setTerminado(false)
    setSeleccion(null)
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

    setTimeout(async () => {
      if (indice + 1 < preguntas.length) {
        setIndice(indice + 1)
        setSeleccion(null)
      } else {
        const xpFinal = esCorrecta ? xpGanado + 50 : xpGanado
        const gano = puntaje + (esCorrecta ? 1 : 0) >= Math.floor(preguntas.length / 2)
        await guardarEnDB(xpFinal, gano)
        if (gano) ganarXP(xpFinal)
        else sumarPartida()
        setTerminado(true)
      }
    }, 1200)
  }

  function reiniciar() {
    setIndice(0)
    setSeleccion(null)
    setPuntaje(0)
    setTerminado(false)
    setXpGanado(0)
    setModoActivo(null)
    setPreguntas([])
    if (setPalabraPractica) setPalabraPractica(null)
  }

  if (!modoActivo) {
    return (
      <div className="container">
        <h1 className="logo">⚔️ Language Arena</h1>
        <p className="tagline">Elige tu modo de juego</p>
        <div className="modos-grid">
          <div className="modo-selector" onClick={() => iniciarModo('traduccion')}>
            <span className="modo-icon">⚡</span>
            <h3>Traducción Veloz</h3>
            <p>Traduce frases al slang correcto</p>
            <span className="modo-xp">+50 XP por respuesta</span>
          </div>
          <div className="modo-selector" onClick={() => iniciarModo('completar')}>
            <span className="modo-icon">✏️</span>
            <h3>Completar Frases</h3>
            <p>Completa la frase con el slang correcto</p>
            <span className="modo-xp">+50 XP por respuesta</span>
          </div>
          <div className="modo-selector" onClick={() => iniciarModo('verdadmentira')}>
            <span className="modo-icon">🤔</span>
            <h3>¿Verdad o Mentira?</h3>
            <p>¿La definición del slang es correcta?</p>
            <span className="modo-xp">+50 XP por respuesta</span>
          </div>
          <div className="modo-selector bloqueado">
            <span className="modo-icon">🗣️</span>
            <h3>Pronunciación</h3>
            <p>Próximamente</p>
            <span className="modo-xp">🔒 Pronto</span>
          </div>
        </div>
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

  return (
    <div className="container">
      <h1 className="logo">⚔️ Language Arena</h1>
      {modoActivo === 'practica' && palabraPractica && (
        <p className="tagline">🎯 Practicando: <strong>{palabraPractica}</strong></p>
      )}
      {modoActivo !== 'practica' && (
        <p className="tagline">
          {modoActivo === 'traduccion' ? '⚡ Traducción Veloz' : modoActivo === 'completar' ? '✏️ Completar Frases' : '🤔 ¿Verdad o Mentira?'}
        </p>
      )}
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