import { useState } from 'react'

const todasLasLecciones = [
  {
    id: 1,
    categoria: "TikTok Speak",
    emoji: "🔥",
    palabra: "No cap",
    significado: "Sin mentira / En serio",
    ejemplo: "That party was crazy, no cap.",
    traduccion: "Esa fiesta estuvo loca, en serio.",
    nivel: "Básico"
  },
  {
    id: 2,
    categoria: "Street Slang",
    emoji: "🛹",
    palabra: "Lowkey",
    significado: "En secreto / Un poco",
    ejemplo: "I lowkey love this song.",
    traduccion: "En secreto me encanta esta canción.",
    nivel: "Básico"
  },
  {
    id: 3,
    categoria: "Expresiones",
    emoji: "😂",
    palabra: "It's giving...",
    significado: "Da vibras de... / Se siente como...",
    ejemplo: "This outfit is giving rockstar.",
    traduccion: "Este outfit da vibras de rockstar.",
    nivel: "Intermedio"
  },
  {
    id: 4,
    categoria: "Gen Z",
    emoji: "⚡",
    palabra: "Slay",
    significado: "Hacerlo increíble / Brillar",
    ejemplo: "She slayed that presentation.",
    traduccion: "Ella brilló en esa presentación.",
    nivel: "Básico"
  },
  {
    id: 5,
    categoria: "TikTok Speak",
    emoji: "🔥",
    palabra: "Bussin",
    significado: "Delicioso / Increíble",
    ejemplo: "This food is bussin fr.",
    traduccion: "Esta comida está deliciosa de verdad.",
    nivel: "Básico"
  },
  {
    id: 6,
    categoria: "Gen Z",
    emoji: "⚡",
    palabra: "Fr fr",
    significado: "For real / De verdad",
    ejemplo: "That movie was scary fr fr.",
    traduccion: "Esa película daba miedo de verdad.",
    nivel: "Básico"
  },
  {
    id: 7,
    categoria: "Street Slang",
    emoji: "🛹",
    palabra: "Bet",
    significado: "De acuerdo / Listo",
    ejemplo: "Meet me at 5. — Bet.",
    traduccion: "Encuéntrame a las 5. — Listo.",
    nivel: "Básico"
  },
  {
    id: 8,
    categoria: "Expresiones",
    emoji: "😂",
    palabra: "Hits different",
    significado: "Se siente diferente / Toca diferente",
    ejemplo: "This song hits different at night.",
    traduccion: "Esta canción toca diferente de noche.",
    nivel: "Intermedio"
  },
  {
    id: 9,
    categoria: "TikTok Speak",
    emoji: "🔥",
    palabra: "Understood the assignment",
    significado: "Lo hizo perfectamente / Entendió todo",
    ejemplo: "She understood the assignment tonight.",
    traduccion: "Ella lo entendió todo esta noche.",
    nivel: "Intermedio"
  },
  {
    id: 10,
    categoria: "Gen Z",
    emoji: "⚡",
    palabra: "Rizz",
    significado: "Carisma / Poder de atracción",
    ejemplo: "Bro has so much rizz.",
    traduccion: "Este tipo tiene demasiado carisma.",
    nivel: "Intermedio"
  },
  {
    id: 11,
    categoria: "Street Slang",
    emoji: "🛹",
    palabra: "Sus",
    significado: "Sospechoso / Raro",
    ejemplo: "That's kinda sus bro.",
    traduccion: "Eso es medio sospechoso bro.",
    nivel: "Básico"
  },
  {
    id: 12,
    categoria: "Expresiones",
    emoji: "😂",
    palabra: "Living rent free",
    significado: "No puedes dejar de pensar en algo",
    ejemplo: "That song is living rent free in my head.",
    traduccion: "Esa canción no se me sale de la cabeza.",
    nivel: "Avanzado"
  }
]

const categorias = ["Todas", "TikTok Speak", "Street Slang", "Expresiones", "Gen Z"]

function Lecciones() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todas")
  const [nivelActivo, setNivelActivo] = useState("Todos")

  const filtradas = todasLasLecciones.filter(l => {
    const porCategoria = categoriaActiva === "Todas" || l.categoria === categoriaActiva
    const porNivel = nivelActivo === "Todos" || l.nivel === nivelActivo
    return porCategoria && porNivel
  })

  return (
    <div className="container">
      <h1 className="logo">📚 Lecciones</h1>
      <p className="tagline">Slang, expresiones y lenguaje real</p>

      <div className="filtros">
        <div className="filtro-grupo">
          {categorias.map(cat => (
            <button
              key={cat}
              className={categoriaActiva === cat ? 'filtro-activo' : 'filtro-btn'}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="filtro-grupo">
          {["Todos", "Básico", "Intermedio", "Avanzado"].map(niv => (
            <button
              key={niv}
              className={nivelActivo === niv ? 'filtro-activo' : 'filtro-btn'}
              onClick={() => setNivelActivo(niv)}
            >
              {niv}
            </button>
          ))}
        </div>
      </div>

      <p className="total-lecciones">{filtradas.length} expresiones encontradas</p>

      <div className="lecciones-grid">
        {filtradas.map((leccion) => (
          <div className="leccion-card" key={leccion.id}>
            <div className="leccion-header">
              <span className="leccion-emoji">{leccion.emoji}</span>
              <span className="leccion-categoria">{leccion.categoria}</span>
              <span className="leccion-nivel">{leccion.nivel}</span>
            </div>
            <h2 className="leccion-palabra">{leccion.palabra}</h2>
            <p className="leccion-significado">{leccion.significado}</p>
            <div className="leccion-ejemplo">
              <p className="ejemplo-en">"{leccion.ejemplo}"</p>
              <p className="ejemplo-es">"{leccion.traduccion}"</p>
            </div>
            <button className="btn-primary">Practicar esta palabra</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Lecciones