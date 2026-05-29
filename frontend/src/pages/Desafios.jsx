import { useState, useEffect } from 'react'
import { useUser } from '../useUser'

const preguntasDesafio = [
  {
    frase: "En serio, esa fiesta estuvo increíble",
    respuesta_correcta: "no cap",
    opciones: ["no cap", "lowkey", "slay", "bussin"]
  },
  {
    frase: "Esa comida estaba deliciosa",
    respuesta_correcta: "bussin",
    opciones: ["slay", "bussin", "lowkey", "no cap"]
  },
  {
    frase: "Ella lo hizo increíble en el escenario",
    respuesta_correcta: "slay",
    opciones: ["bussin", "no cap", "slay", "lowkey"]
  },
  {
    frase: "En secreto me encanta esa canción",
    respuesta_correcta: "lowkey",
    opciones: ["no cap", "lowkey", "bussin", "slay"]
  },
  {
    frase: "Bro tiene demasiado carisma",
    respuesta_correcta: "rizz",
    opciones: ["rizz", "bet", "sus", "fr fr"]
  }
]

const API = 'https://street-talk-backend.onrender.com'

function Desafios() {
  useUser()

  const [tab, setTab] = useState('buscar')
  const [busqueda, setBusqueda] = useState('')
  const [resultados, setResultados] = useState([])
  const [pendientes, setPendientes] = useState([])
  const [desafioActivo, setDesafioActivo] = useState(null)
  const [indice, setIndice] = useState(0)
  const [puntaje, setPuntaje] = useState(0)
  const [seleccion, setSeleccion] = useState(null)
  const [terminado, setTerminado] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const token = localStorage.getItem('token')

  async function cargarPendientes() {
    try {
      const res = await fetch(`${API}/desafios/pendientes`, {
        headers: {
          authorization: token
        }
      })

      const data = await res.json()

      if (data.desafios) {
        setPendientes(data.desafios)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    async function obtenerPendientes() {
      try {
        const res = await fetch(`${API}/desafios/pendientes`, {
          headers: {
            authorization: token
          }
        })

        const data = await res.json()

        if (data.desafios) {
          setPendientes(data.desafios)
        }
      } catch (err) {
        console.error(err)
      }
    }

    obtenerPendientes()
  }, [token])

  async function buscarUsuario() {
    if (!busqueda.trim()) return

    setCargando(true)

    try {
      const res = await fetch(`${API}/desafios/buscar/${busqueda}`, {
        headers: {
          authorization: token
        }
      })

      const data = await res.json()

      setResultados(data.usuarios || [])
    } catch (err) {
      console.error(err)
    }

    setCargando(false)
  }

  async function enviarDesafio(retado_id) {
    try {
      const res = await fetch(`${API}/desafios/enviar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: token
        },
        body: JSON.stringify({
          retado_id,
          idioma: 'Inglés'
        })
      })

      const data = await res.json()

      if (data.error) {
        setMensaje('⚠️ ' + data.error)
      } else {
        setMensaje('✅ Desafío enviado!')
        setResultados([])
        setBusqueda('')
      }

      setTimeout(() => {
        setMensaje('')
      }, 3000)

    } catch (err) {
      console.error(err)
    }
  }

  function iniciarDesafio(desafio) {
    setDesafioActivo(desafio)
    setIndice(0)
    setPuntaje(0)
    setSeleccion(null)
    setTerminado(false)
  }

  function responder(opcion) {
    if (seleccion) return

    setSeleccion(opcion)

    const esCorrecta =
      opcion === preguntasDesafio[indice].respuesta_correcta

    const nuevoPuntaje = esCorrecta
      ? puntaje + 1
      : puntaje

    if (esCorrecta) {
      setPuntaje(prev => prev + 1)
    }

    setTimeout(async () => {

      if (indice + 1 < preguntasDesafio.length) {

        setIndice(prev => prev + 1)
        setSeleccion(null)

      } else {

        try {
          await fetch(
            `${API}/desafios/completar/${desafioActivo.id}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                authorization: token
              },
              body: JSON.stringify({
                puntaje: nuevoPuntaje
              })
            }
          )
        } catch (err) {
          console.error(err)
        }

        setPuntaje(nuevoPuntaje)
        setTerminado(true)

        cargarPendientes()
      }

    }, 1200)
  }

  if (desafioActivo && !terminado) {

    const pregunta = preguntasDesafio[indice]

    return (
      <div className="container">

        <h1 className="logo">⚔️ Desafío</h1>

        <p className="tagline">
          Pregunta {indice + 1} de {preguntasDesafio.length}
        </p>

        <div className="arena-card">

          <div className="arena-progreso">
            <span>
              Pregunta {indice + 1} de {preguntasDesafio.length}
            </span>

            <span>
              ⭐ {puntaje} pts
            </span>
          </div>

          <h2 className="arena-frase">
            "{pregunta.frase}"
          </h2>

          <div className="arena-opciones">

            {pregunta.opciones.map(opcion => (

              <button
                key={opcion}
                className={`opcion-btn
                  ${seleccion === opcion &&
                    opcion === pregunta.respuesta_correcta
                    ? 'correcta'
                    : ''
                  }

                  ${seleccion === opcion &&
                    opcion !== pregunta.respuesta_correcta
                    ? 'incorrecta'
                    : ''
                  }

                  ${seleccion &&
                    opcion === pregunta.respuesta_correcta
                    ? 'correcta'
                    : ''
                  }
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

  if (desafioActivo && terminado) {

    return (
      <div className="container">

        <h1 className="logo">⚔️ Resultado</h1>

        <div className="resultado-card">

          <p className="resultado-emoji">
            {puntaje >= 4
              ? '🏆'
              : puntaje >= 3
              ? '💪'
              : '😅'
            }
          </p>

          <h2 className="resultado-titulo">
            {puntaje >= 4
              ? '¡Dominaste!'
              : puntaje >= 3
              ? '¡Buen duelo!'
              : '¡Sigue entrenando!'
            }
          </h2>

          <p className="resultado-puntaje">
            {puntaje} / {preguntasDesafio.length} correctas
          </p>

          <button
            className="btn-primary"
            onClick={() => setDesafioActivo(null)}
          >
            Volver a Desafíos
          </button>

        </div>

      </div>
    )
  }

  return (
    <div className="container">

      <h1 className="logo">⚔️ Desafíos</h1>

      <p className="tagline">
        Reta a otros jugadores y demuestra quién habla mejor
      </p>

      {mensaje && (
        <div className="desafio-mensaje">
          {mensaje}
        </div>
      )}

      <div className="desafio-tabs">

        <button
          className={
            tab === 'buscar'
              ? 'filtro-activo'
              : 'filtro-btn'
          }
          onClick={() => setTab('buscar')}
        >
          🔍 Buscar rival
        </button>

        <button
          className={
            tab === 'pendientes'
              ? 'filtro-activo'
              : 'filtro-btn'
          }
          onClick={() => {
            setTab('pendientes')
            cargarPendientes()
          }}
        >
          ⏳ Pendientes {
            pendientes.length > 0 &&
            `(${pendientes.length})`
          }
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
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  buscarUsuario()
                }
              }}
            />

            <button
              className="btn-primary"
              onClick={buscarUsuario}
            >
              {cargando ? '...' : 'Buscar'}
            </button>

          </div>

          {resultados.length === 0 &&
            busqueda &&
            !cargando && (
              <p className="tagline">
                No se encontraron jugadores con ese nombre
              </p>
          )}

          <div className="resultados-lista">

            {resultados.map(u => (

              <div
                key={u.id}
                className="rival-card"
              >

                <div className="rival-info">

                  <span className="rival-nombre">
                    🗣️ {u.nombre}
                  </span>

                  <span className="rival-rango">
                    {u.rango}
                  </span>

                </div>

                <div className="rival-xp">
                  ⭐ {u.xp} XP
                </div>

                <button
                  className="btn-retar"
                  onClick={() => enviarDesafio(u.id)}
                >
                  ⚔️ Retar
                </button>

              </div>

            ))}

          </div>

        </div>

      )}

      {tab === 'pendientes' && (

        <div className="pendientes-lista">

          {pendientes.length === 0 && (
            <p className="tagline">
              No tienes desafíos pendientes
            </p>
          )}

          {pendientes.map(d => (

            <div
              key={d.id}
              className="rival-card"
            >

              <div className="rival-info">

                <span className="rival-nombre">
                  {d.retador_nombre} retó a {d.retado_nombre}
                </span>

                <span className="rival-rango">
                  {d.idioma}
                </span>

              </div>

              <button
                className="btn-retar"
                onClick={() => iniciarDesafio(d)}
              >
                ▶️ Jugar
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default Desafios