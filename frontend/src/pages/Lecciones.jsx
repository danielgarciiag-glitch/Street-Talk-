import { useState } from 'react'

const todasLasLecciones = [
  // ===== INGLÉS =====
  {
    id: 1,
    idioma: "Inglés",
    bandera: "🇺🇸",
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
    idioma: "Inglés",
    bandera: "🇺🇸",
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
    idioma: "Inglés",
    bandera: "🇺🇸",
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
    idioma: "Inglés",
    bandera: "🇺🇸",
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
    idioma: "Inglés",
    bandera: "🇺🇸",
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
    idioma: "Inglés",
    bandera: "🇺🇸",
    categoria: "Gen Z",
    emoji: "⚡",
    palabra: "Rizz",
    significado: "Carisma / Poder de atracción",
    ejemplo: "Bro has so much rizz.",
    traduccion: "Este tipo tiene demasiado carisma.",
    nivel: "Intermedio"
  },
  {
    id: 7,
    idioma: "Inglés",
    bandera: "🇺🇸",
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
    idioma: "Inglés",
    bandera: "🇺🇸",
    categoria: "Expresiones",
    emoji: "😂",
    palabra: "Hits different",
    significado: "Se siente diferente / Toca diferente",
    ejemplo: "This song hits different at night.",
    traduccion: "Esta canción toca diferente de noche.",
    nivel: "Intermedio"
  },
  // ===== PORTUGUÉS =====
  {
    id: 9,
    idioma: "Portugués",
    bandera: "🇧🇷",
    categoria: "Gíria",
    emoji: "🌴",
    palabra: "Mano",
    significado: "Amigo / Bro",
    ejemplo: "Mano, que situação estranha!",
    traduccion: "Bro, ¡qué situación tan rara!",
    nivel: "Básico"
  },
  {
    id: 10,
    idioma: "Portugués",
    bandera: "🇧🇷",
    categoria: "Gíria",
    emoji: "🌴",
    palabra: "Saudade",
    significado: "Nostalgia profunda / Extrañar mucho",
    ejemplo: "Tô com saudade de você.",
    traduccion: "Te extraño mucho.",
    nivel: "Básico"
  },
  {
    id: 11,
    idioma: "Portugués",
    bandera: "🇧🇷",
    categoria: "Internet",
    emoji: "📱",
    palabra: "Tá ligado?",
    significado: "¿Entiendes? / ¿Sabes?",
    ejemplo: "É complicado, tá ligado?",
    traduccion: "Es complicado, ¿entiendes?",
    nivel: "Intermedio"
  },
  {
    id: 12,
    idioma: "Portugués",
    bandera: "🇧🇷",
    categoria: "Internet",
    emoji: "📱",
    palabra: "Bora",
    significado: "Vamos / Let's go",
    ejemplo: "Bora pro rolê!",
    traduccion: "¡Vamos a la fiesta!",
    nivel: "Básico"
  },
  {
    id: 13,
    idioma: "Portugués",
    bandera: "🇧🇷",
    categoria: "Gíria",
    emoji: "🌴",
    palabra: "Massa",
    significado: "Genial / Increíble",
    ejemplo: "Que show massa foi esse!",
    traduccion: "¡Qué show tan increíble fue ese!",
    nivel: "Básico"
  },
  // ===== FRANCÉS =====
  {
    id: 14,
    idioma: "Francés",
    bandera: "🇫🇷",
    categoria: "Argot",
    emoji: "🥖",
    palabra: "Ouf",
    significado: "Increíble / Loco (al revés de fou)",
    ejemplo: "Ce film était ouf!",
    traduccion: "¡Esa película estuvo increíble!",
    nivel: "Básico"
  },
  {
    id: 15,
    idioma: "Francés",
    bandera: "🇫🇷",
    categoria: "Argot",
    emoji: "🥖",
    palabra: "C'est nul",
    significado: "Es una porquería / No vale nada",
    ejemplo: "Ce film c'est nul.",
    traduccion: "Esta película es una porquería.",
    nivel: "Básico"
  },
  {
    id: 16,
    idioma: "Francés",
    bandera: "🇫🇷",
    categoria: "Internet",
    emoji: "📱",
    palabra: "Kiffer",
    significado: "Gustar mucho / Amar algo",
    ejemplo: "Je kiffe trop cette musique.",
    traduccion: "Me encanta demasiado esta música.",
    nivel: "Intermedio"
  },
  {
    id: 17,
    idioma: "Francés",
    bandera: "🇫🇷",
    categoria: "Argot",
    emoji: "🥖",
    palabra: "Chelou",
    significado: "Raro / Sospechoso",
    ejemplo: "Ce mec est vraiment chelou.",
    traduccion: "Este tipo es realmente raro.",
    nivel: "Intermedio"
  },
  {
    id: 18,
    idioma: "Francés",
    bandera: "🇫🇷",
    categoria: "Internet",
    emoji: "📱",
    palabra: "Grave",
    significado: "Totalmente / Exacto",
    ejemplo: "T'as raison, grave!",
    traduccion: "Tienes razón, ¡totalmente!",
    nivel: "Básico"
  }
]

const idiomas = ["Todos", "Inglés", "Portugués", "Francés"]
const categorias = {
  "Todos": ["Todas"],
  "Inglés": ["Todas", "TikTok Speak", "Street Slang", "Expresiones", "Gen Z"],
  "Portugués": ["Todas", "Gíria", "Internet"],
  "Francés": ["Todas", "Argot", "Internet"]
}
const niveles = ["Todos", "Básico", "Intermedio", "Avanzado"]

function Lecciones() {
  const [idiomaActivo, setIdiomaActivo] = useState("Todos")
  const [categoriaActiva, setCategoriaActiva] = useState("Todas")
  const [nivelActivo, setNivelActivo] = useState("Todos")

  const filtradas = todasLasLecciones.filter(l => {
    const porIdioma = idiomaActivo === "Todos" || l.idioma === idiomaActivo
    const porCategoria = categoriaActiva === "Todas" || l.categoria === categoriaActiva
    const porNivel = nivelActivo === "Todos" || l.nivel === nivelActivo
    return porIdioma && porCategoria && porNivel
  })

  const categoriasActuales = categorias[idiomaActivo] || ["Todas"]

  function cambiarIdioma(idioma) {
    setIdiomaActivo(idioma)
    setCategoriaActiva("Todas")
  }

  return (
    <div className="container">
      <h1 className="logo">📚 Lecciones</h1>
      <p className="tagline">Slang, expresiones y lenguaje real</p>

      <div className="filtros">
        <div className="filtro-grupo">
          {idiomas.map(idioma => (
            <button
              key={idioma}
              className={idiomaActivo === idioma ? 'filtro-activo' : 'filtro-btn'}
              onClick={() => cambiarIdioma(idioma)}
            >
              {idioma === "Inglés" ? "🇺🇸" : idioma === "Portugués" ? "🇧🇷" : idioma === "Francés" ? "🇫🇷" : "🌍"} {idioma}
            </button>
          ))}
        </div>

        <div className="filtro-grupo">
          {categoriasActuales.map(cat => (
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
          {niveles.map(niv => (
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
            <div className="leccion-idioma-tag">{leccion.bandera} {leccion.idioma}</div>
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