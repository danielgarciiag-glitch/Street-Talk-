import { useState } from 'react'
import { useUser } from '../useUser'

const modos = {
  traduccion: [
    {
      id: 1,
      frase: "En serio, esa fiesta estuvo increíble",
      respuesta_correcta: "no cap",
      pista: "Se usa para decir que algo es verdad",
      opciones: ["no cap", "lowkey", "slay", "it's giving"]
    },
    {
      id: 2,
      frase: "En secreto me encanta esa canción",
      respuesta_correcta: "lowkey",
      pista: "Algo que no quieres admitir abiertamente",
      opciones: ["no cap", "lowkey", "bussin", "slay"]
    },
    {
      id: 3,
      frase: "Esa comida estaba deliciosa",
      respuesta_correcta: "bussin",
      pista: "Slang para describir comida muy buena",
      opciones: ["slay", "bussin", "lowkey", "no cap"]
    },
    {
      id: 4,
      frase: "Ella lo hizo increíble en el escenario",
      respuesta_correcta: "slay",
      pista: "Brillar y hacerlo perfecto",
      opciones: ["bussin", "no cap", "slay", "lowkey"]
    }
  ],
  completar: [
    {
      id: 1,
      frase: "That party was crazy, _____.",
      respuesta_correcta: "no cap",
      pista: "Completa con la expresión correcta",
      opciones: ["no cap", "lowkey", "bet", "sus"]
    },
    {
      id: 2,
      frase: "I _____ love this song but I won't admit it.",
      respuesta_correcta: "lowkey",
      pista: "Algo que haces en secreto",
      opciones: ["bussin", "lowkey", "fr fr", "rizz"]
    },
    {
      id: 3,
      frase: "Meet me at 8pm. — _____.",
      respuesta_correcta: "bet",
      pista: "Forma de decir de acuerdo en slang",
      opciones: ["slay", "bet", "sus", "no cap"]
    },
    {
      id: 4,
      frase: "This food is _____, I can't stop eating.",
      respuesta_correcta: "bussin",
      pista: "Algo delicioso o increíble",
      opciones: ["rizz", "fr fr", "bussin", "hits different"]
    },
    {
      id: 5,
      frase: "Bro has so much _____, everyone loves him.",
      respuesta_correcta: "rizz",
      pista: "Carisma y poder de atracción",
      opciones: ["rizz", "bet", "sus", "slay"]
    }
  ]
}

function Arena() {
  const { ganarXP, sumarPartida } = useUser()
  const [modoActivo, setModoActivo] = useState(null)
  const [indice, setIndice] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [puntaje, setPuntaje] = useState(0)
  const [terminado, setTerminado] = useState(false)
  const [xpGanado, setXpGanado] = useState(0)

  const preguntas = modoActivo ? modos[modoActivo] : []
  const pregunta = preguntas[indice]

  async function guardarEnDB(xp, gano) {
    const token = localStorage.getItem('token')
    try {
      await fetch('http://localhost:3000/usuario/actualizar-xp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': token
        },
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
  }

  // PANTALLA DE SELECCIÓN DE MODO
  if (!modoActivo) {
    return (
      <div className="container">
        <h1 className="logo">⚔️ Language Arena</h1>
        <p className="tagline">Elige tu modo de juego</p>

        <div className="modos-grid">
          <div className="modo-selector" onClick={() => setModoActivo('traduccion')}>
            <span className="modo-icon">⚡</span>
            <h3>Traducción Veloz</h3>
            <p>Traduce frases al slang correcto</p>
            <span className="modo-xp">+50 XP por respuesta</span>
          </div>

          <div className="modo-selector" onClick={() => setModoActivo('completar')}>
            <span className="modo-icon">✍️</span>
            <h3>Completar Frases</h3>
            <p>Completa la frase con el slang correcto</p>
            <span className="modo-xp">+50 XP por respuesta</span>
          </div>

          <div className="modo-selector bloqueado">
            <span className="modo-icon">🎤</span>
            <h3>Debates Rápidos</h3>
            <p>Próximamente</p>
            <span className="modo-xp">🔒 Pronto</span>
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

  // PANTALLA DE RESULTADO
  if (terminado) {
    return (
      <div className="container">
        <h1 className="logo">⚔️ Language Arena</h1>
        <div className="resultado-card">
          <p className="resultado-emoji">
            {puntaje >= preguntas.length - 1 ? "🏆" : puntaje >= Math.floor(preguntas.length / 2) ? "💪" : "😅"}
          </p>
          <h2 className="resultado-titulo">
            {puntaje >= preguntas.length - 1 ? "¡Perfecto!" : puntaje >= Math.floor(preguntas.length / 2) ? "¡Buen trabajo!" : "¡Sigue practicando!"}
          </h2>
          <p className="resultado-puntaje">{puntaje} / {preguntas.length} correctas</p>
          <p className="xp-ganado">+{xpGanado} XP ganados ⭐</p>
          <button className="btn-primary" onClick={reiniciar}>Volver a la Arena</button>
        </div>
      </div>
    )
  }

  // PANTALLA DE JUEGO
  return (
    <div className="container">
      <h1 className="logo">⚔️ Language Arena</h1>
      <p className="tagline">
        {modoActivo === 'traduccion' ? '⚡ Traducción Veloz' : '✍️ Completar Frases'}
      </p>

      <div className="arena-card">
        <div className="arena-progreso">
          <span>Pregunta {indice + 1} de {preguntas.length}</span>
          <span>⭐ {puntaje} pts</span>
        </div>

        <p className="arena-pista">💡 {pregunta.pista}</p>
        <h2 className="arena-frase">"{pregunta.frase}"</h2>

        <div className="arena-opciones">
          {pregunta.opciones.map((opcion) => (
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