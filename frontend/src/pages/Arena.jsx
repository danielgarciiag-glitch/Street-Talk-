/* eslint-disable no-unused-vars */
import { useState, useRef } from 'react'
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
    { frase: "Le habló y ella cayó inmediatamente", respuesta_correcta: "rizz", opciones: ["no cap", "bet", "rizz", "sus"] }
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
    { frase: "Eso puede ser muy malo o increíble según contexto", respuesta_correcta: "yabai", opciones: ["yabai", "sugoi", "kawaii", "nakama"] },
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

const palabrasPronunciacion = [
  { palabra: "No cap", pronunciacion: "noh cap", significado: "Sin mentira / En serio", ejemplo: "That party was crazy, no cap.", idioma: "🇺🇸" },
  { palabra: "Lowkey", pronunciacion: "loh-kee", significado: "En secreto / Un poco", ejemplo: "I lowkey love this song.", idioma: "🇺🇸" },
  { palabra: "Bussin", pronunciacion: "buh-sin", significado: "Delicioso / Increíble", ejemplo: "This food is bussin fr.", idioma: "🇺🇸" },
  { palabra: "Slay", pronunciacion: "slay", significado: "Hacerlo increíble / Brillar", ejemplo: "She slayed that performance.", idioma: "🇺🇸" },
  { palabra: "Rizz", pronunciacion: "riz", significado: "Carisma / Poder de atracción", ejemplo: "Bro has so much rizz.", idioma: "🇺🇸" },
  { palabra: "Bet", pronunciacion: "bet", significado: "De acuerdo / Listo", ejemplo: "Meet me at 5. – Bet.", idioma: "🇺🇸" },
  { palabra: "Sus", pronunciacion: "sus", significado: "Sospechoso / Raro", ejemplo: "That guy is acting sus.", idioma: "🇺🇸" },
  { palabra: "Fr fr", pronunciacion: "for real for real", significado: "De verdad de verdad", ejemplo: "That was the best day fr fr.", idioma: "🇺🇸" },
  { palabra: "Flex", pronunciacion: "flex", significado: "Presumir / Mostrar", ejemplo: "He's always flexing his car.", idioma: "🇺🇸" },
  { palabra: "Drip", pronunciacion: "drip", significado: "Estilo / Ropa cool", ejemplo: "Bro's drip is immaculate.", idioma: "🇺🇸" },
  { palabra: "Ouf", pronunciacion: "oof", significado: "Increíble / Loco", ejemplo: "Ce film était ouf!", idioma: "🇫🇷" },
  { palabra: "Chelou", pronunciacion: "sheh-loo", significado: "Raro / Sospechoso", ejemplo: "C'est chelou comme situation.", idioma: "🇫🇷" },
  { palabra: "Sugoi", pronunciacion: "su-goi", significado: "¡Increíble! / ¡Wow!", ejemplo: "Sugoi! That's amazing!", idioma: "🇯🇵" },
  { palabra: "Kawaii", pronunciacion: "ka-wai-i", significado: "Tierno / Adorable", ejemplo: "That cat is so kawaii!", idioma: "🇯🇵" },
  { palabra: "Yabai", pronunciacion: "ya-bai", significado: "Brutal / Extremo", ejemplo: "That movie was yabai!", idioma: "🇯🇵" },
]

const API = 'http://localhost:3000'

function ModoPronunciacion({ onVolver }) {
  const [indice, setIndice] = useState(0)
  const [escuchando, setEscuchando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [textoEscuchado, setTextoEscuchado] = useState('')
  const [puntaje, setPuntaje] = useState(0)
  const [terminado, setTerminado] = useState(false)
  const [xpGanado, setXpGanado] = useState(0)
  const recognitionRef = useRef(null)
  const token = localStorage.getItem('token')

  const palabraActual = palabrasPronunciacion[indice]

  function normalizar(texto) {
    return texto.toLowerCase()
      .replace(/[^a-záéíóúüñ\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function verificarPronunciacion(textoHablado) {
    const hablado = normalizar(textoHablado)
    const objetivo = normalizar(palabraActual.palabra)
    const pronunciacionGuia = normalizar(palabraActual.pronunciacion)

    const coincideExacto = hablado.includes(objetivo)
    const coincidePronunciacion = hablado.includes(pronunciacionGuia)
    const similitud = calcularSimilitud(hablado, objetivo)

    return coincideExacto || coincidePronunciacion || similitud >= 0.6
  }

  function calcularSimilitud(a, b) {
    if (a === b) return 1
    if (a.length === 0 || b.length === 0) return 0
    const longer = a.length > b.length ? a : b
    const shorter = a.length > b.length ? b : a
    const editDistance = levenshtein(longer, shorter)
    return (longer.length - editDistance) / longer.length
  }

  function levenshtein(a, b) {
    const matrix = []
    for (let i = 0; i <= b.length; i++) matrix[i] = [i]
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }
    return matrix[b.length][a.length]
  }

  function escuchar() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome.')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition

    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setEscuchando(true)

    recognition.onresult = (event) => {
      const texto = event.results[0][0].transcript
      setTextoEscuchado(texto)
      const correcto = verificarPronunciacion(texto)
      setResultado(correcto ? 'correcto' : 'incorrecto')
      if (correcto) {
        setPuntaje(p => p + 1)
        setXpGanado(x => x + 75)
      }
      setEscuchando(false)
    }

    recognition.onerror = () => {
      setEscuchando(false)
      setResultado('error')
    }

    recognition.onend = () => setEscuchando(false)

    recognition.start()
  }

  async function siguiente() {
    if (indice + 1 < palabrasPronunciacion.length) {
      setIndice(indice + 1)
      setResultado(null)
      setTextoEscuchado('')
    } else {
      const token2 = localStorage.getItem('token')
      try {
        await fetch(`${API}/usuario/actualizar-xp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', authorization: token2 },
          body: JSON.stringify({ xp_ganado: xpGanado, gano: puntaje >= Math.floor(palabrasPronunciacion.length / 2) })
        })
      } catch (err) { console.error(err) }
      setTerminado(true)
    }
  }

  function reproducirPalabra() {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(palabraActual.palabra)
      utterance.lang = palabraActual.idioma === '🇯🇵' ? 'ja-JP' : palabraActual.idioma === '🇫🇷' ? 'fr-FR' : 'en-US'
      utterance.rate = 0.8
      window.speechSynthesis.speak(utterance)
    }
  }

  if (terminado) {
    return (
      <div className="container">
        <h1 className="logo">🗣️ Pronunciación</h1>
        <div className="resultado-card">
          <p className="resultado-emoji">{puntaje >= 10 ? '🏆' : puntaje >= 7 ? '💪' : '😅'}</p>
          <h2 className="resultado-titulo">
            {puntaje >= 10 ? '¡Pronunciación perfecta!' : puntaje >= 7 ? '¡Muy bien!' : '¡Sigue practicando!'}
          </h2>
          <p className="resultado-puntaje">{puntaje} / {palabrasPronunciacion.length} correctas</p>
          <p className="xp-ganado">+{xpGanado} XP ganados</p>
          <button className="btn-primary" onClick={onVolver}>Volver a Arena</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="logo">🗣️ Pronunciación</h1>
      <p className="tagline">Di la palabra en voz alta</p>

      <div className="arena-card">
        <div className="arena-progreso">
          <span>Palabra {indice + 1} de {palabrasPronunciacion.length}</span>
          <span>⭐ {puntaje} pts</span>
        </div>

        <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
          <span style={{ fontSize: '2rem' }}>{palabraActual.idioma}</span>
          <h2 style={{ fontSize: '2.5rem', color: '#f0c040', margin: '0.5rem 0' }}>{palabraActual.palabra}</h2>
          <p style={{ color: '#aaa', marginBottom: '0.5rem' }}>{palabraActual.significado}</p>
          <p style={{ color: '#6c63ff', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            📖 Pronunciación: <strong>"{palabraActual.pronunciacion}"</strong>
          </p>
          <p style={{ color: '#888', fontSize: '0.85rem', fontStyle: 'italic' }}>"{palabraActual.ejemplo}"</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <button
            onClick={reproducirPalabra}
            style={{ background: '#2a2a3e', border: '1px solid #6c63ff', color: 'white', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '1rem' }}
          >
            🔊 Escuchar
          </button>
          <button
            onClick={escuchar}
            disabled={escuchando || resultado !== null}
            style={{
              background: escuchando ? '#f44336' : '#6c63ff',
              border: 'none',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              animation: escuchando ? 'pulse 1s infinite' : 'none'
            }}
          >
            {escuchando ? '🎙️ Escuchando...' : '🎤 Hablar'}
          </button>
        </div>

        {textoEscuchado && (
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem' }}>
            🎙️ Escuché: <strong>"{textoEscuchado}"</strong>
          </p>
        )}

        {resultado === 'correcto' && (
          <div style={{ textAlign: 'center', padding: '1rem', background: '#1a3a1a', borderRadius: '12px', marginBottom: '1rem' }}>
            <p style={{ color: '#4caf50', fontSize: '1.3rem', fontWeight: 'bold' }}>✅ ¡Perfecto! +75 XP</p>
          </div>
        )}

        {resultado === 'incorrecto' && (
          <div style={{ textAlign: 'center', padding: '1rem', background: '#3a1a1a', borderRadius: '12px', marginBottom: '1rem' }}>
            <p style={{ color: '#f44336', fontSize: '1.1rem' }}>❌ Inténtalo de nuevo</p>
            <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Pronuncia: <strong>"{palabraActual.pronunciacion}"</strong></p>
          </div>
        )}

        {resultado === 'error' && (
          <div style={{ textAlign: 'center', padding: '1rem', background: '#3a2a1a', borderRadius: '12px', marginBottom: '1rem' }}>
            <p style={{ color: '#f0c040' }}>⚠️ No se escuchó bien. Intenta de nuevo.</p>
          </div>
        )}

        {resultado && (
          <button className="btn-primary" onClick={siguiente} style={{ width: '100%' }}>
            {indice + 1 < palabrasPronunciacion.length ? 'Siguiente →' : 'Ver resultado'}
          </button>
        )}
      </div>
    </div>
  )
}

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
    } catch (err) { console.error('Error guardando XP:', err) }
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

  if (modoActivo === 'pronunciacion') {
    return <ModoPronunciacion onVolver={reiniciar} />
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
          <div className="modo-selector" onClick={() => setModoActivo('pronunciacion')}>
            <span className="modo-icon">🗣️</span>
            <h3>Pronunciación</h3>
            <p>Di la palabra en voz alta y gana XP</p>
            <span className="modo-xp">+75 XP por palabra</span>
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