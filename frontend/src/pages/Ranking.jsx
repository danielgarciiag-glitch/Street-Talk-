import { useUser } from '../useUser'

const otrosJugadores = [
  { posicion: 1, nombre: "NativeVibes_MX", xp: 4800, racha: 21, bandera: "🇲🇽", nivel: "Street Legend" },
  { posicion: 2, nombre: "SlangKing_BR", xp: 4200, racha: 15, bandera: "🇧🇷", nivel: "Street Legend" },
  { posicion: 3, nombre: "NoCapQueen", xp: 3900, racha: 12, bandera: "🇺🇸", nivel: "Native Vibe" },
  { posicion: 4, nombre: "LowkeyLearner", xp: 3100, racha: 9, bandera: "🇫🇷", nivel: "Native Vibe" },
  { posicion: 5, nombre: "SlayMaster_JP", xp: 2700, racha: 7, bandera: "🇯🇵", nivel: "Street Rookie" },
  { posicion: 6, nombre: "BussinBoss", xp: 2400, racha: 5, bandera: "🇧🇷", nivel: "Street Rookie" },
]

const medallas = { 1: "🥇", 2: "🥈", 3: "🥉" }

function Ranking() {
  const { usuario } = useUser()

  const todos = [
    ...otrosJugadores,
    {
      nombre: usuario.nombre,
      xp: usuario.xp,
      racha: usuario.racha,
      bandera: "🇪🇨",
      nivel: usuario.rango,
      eres_tu: true
    }
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((j, i) => ({ ...j, posicion: i + 1 }))

  return (
    <div className="container">
      <h1 className="logo">🏆 Ranking Global</h1>
      <p className="tagline">Los mejores hablantes de la calle</p>

      <div className="ranking-container">
        {todos.map((jugador) => (
          <div
            key={jugador.nombre}
            className={`ranking-fila ${jugador.eres_tu ? 'eres-tu' : ''}`}
          >
            <span className="ranking-pos">
              {medallas[jugador.posicion] || `#${jugador.posicion}`}
            </span>

            <div className="ranking-info">
              <span className="ranking-nombre">
                {jugador.bandera} {jugador.nombre}
                {jugador.eres_tu && <span className="tu-tag"> TÚ</span>}
              </span>
              <span className="ranking-nivel">{jugador.nivel}</span>
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