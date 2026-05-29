import { useEffect, useState } from 'react'
import { useUser } from '../useUser'

const medallas = { 0: "🥇", 1: "🥈", 2: "🥉" }

function Ranking() {
  const { usuario } = useUser()
  const [jugadores, setJugadores] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    async function cargarRanking() {
      try {
        const res = await fetch('https://street-talk-backend.onrender.com/usuario/ranking')
        const data = await res.json()
        if (data.jugadores) {
          setJugadores(data.jugadores)
        }
      } catch (err) {
        console.error('Error cargando ranking:', err)
      }
      setCargando(false)
    }
    cargarRanking()
  }, [])

  if (cargando) {
    return (
      <div className="container">
        <h1 className="logo">🏆 Ranking Global</h1>
        <p className="tagline">Cargando ranking...</p>
      </div>
    )
  }

  if (jugadores.length === 0) {
    return (
      <div className="container">
        <h1 className="logo">🏆 Ranking Global</h1>
        <p className="tagline">Aún no hay jugadores en el ranking. ¡Sé el primero!</p>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="logo">🏆 Ranking Global</h1>
      <p className="tagline">Los mejores hablantes de la calle</p>

      <div className="ranking-container">
        {jugadores.map((jugador, index) => (
          <div
            key={jugador.id}
            className={`ranking-fila ${jugador.nombre === usuario.nombre ? 'eres-tu' : ''}`}
          >
            <span className="ranking-pos">
              {medallas[index] || `#${index + 1}`}
            </span>

            <div className="ranking-info">
              <span className="ranking-nombre">
                {jugador.nombre}
                {jugador.nombre === usuario.nombre && <span className="tu-tag"> TÚ</span>}
              </span>
              <span className="ranking-nivel">{jugador.rango}</span>
            </div>

            <div className="ranking-stats">
              <span className="ranking-xp">⭐ {jugador.xp} XP</span>
              <span className="ranking-racha">🔥 {jugador.racha}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Ranking