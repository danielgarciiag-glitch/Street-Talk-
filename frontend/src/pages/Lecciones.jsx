import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const todasLasLecciones = [
  { id: 1, idioma: "Inglés", bandera: "🇺🇸", categoria: "TikTok Speak", emoji: "🔥", palabra: "No cap", significado: "Sin mentira / En serio", ejemplo: "That party was crazy, no cap.", traduccion: "Esa fiesta estuvo loca, en serio.", nivel: "Básico" },
  { id: 2, idioma: "Inglés", bandera: "🇺🇸", categoria: "Street Slang", emoji: "🛹", palabra: "Lowkey", significado: "En secreto / Un poco", ejemplo: "I lowkey love this song.", traduccion: "En secreto me encanta esta canción.", nivel: "Básico" },
  { id: 3, idioma: "Inglés", bandera: "🇺🇸", categoria: "Expresiones", emoji: "😂", palabra: "It's giving...", significado: "Da vibras de... / Se siente como...", ejemplo: "This outfit is giving rockstar.", traduccion: "Este outfit da vibras de rockstar.", nivel: "Intermedio" },
  { id: 4, idioma: "Inglés", bandera: "🇺🇸", categoria: "Gen Z", emoji: "⚡", palabra: "Slay", significado: "Hacerlo increíble / Brillar", ejemplo: "She slayed that presentation.", traduccion: "Ella brilló en esa presentación.", nivel: "Básico" },
  { id: 5, idioma: "Inglés", bandera: "🇺🇸", categoria: "TikTok Speak", emoji: "🔥", palabra: "Bussin", significado: "Delicioso / Increíble", ejemplo: "This food is bussin fr.", traduccion: "Esta comida está deliciosa de verdad.", nivel: "Básico" },
  { id: 6, idioma: "Inglés", bandera: "🇺🇸", categoria: "Gen Z", emoji: "⚡", palabra: "Rizz", significado: "Carisma / Poder de atracción", ejemplo: "Bro has so much rizz.", traduccion: "Este tipo tiene demasiado carisma.", nivel: "Intermedio" },
  { id: 7, idioma: "Inglés", bandera: "🇺🇸", categoria: "Street Slang", emoji: "🛹", palabra: "Bet", significado: "De acuerdo / Listo", ejemplo: "Meet me at 5. – Bet.", traduccion: "Encuéntrame a las 5. – Listo.", nivel: "Básico" },
  { id: 8, idioma: "Inglés", bandera: "🇺🇸", categoria: "Expresiones", emoji: "😂", palabra: "Hits different", significado: "Se siente diferente / Toca diferente", ejemplo: "This song hits different at night.", traduccion: "Esta canción toca diferente de noche.", nivel: "Intermedio" },
  { id: 19, idioma: "Inglés", bandera: "🇺🇸", categoria: "Gen Z", emoji: "⚡", palabra: "Sus", significado: "Sospechoso / Raro", ejemplo: "That guy is acting sus.", traduccion: "Ese tipo está actuando raro.", nivel: "Básico" },
  { id: 20, idioma: "Inglés", bandera: "🇺🇸", categoria: "TikTok Speak", emoji: "🔥", palabra: "Fr fr", significado: "De verdad de verdad / En serio", ejemplo: "That was the best day fr fr.", traduccion: "Ese fue el mejor día de verdad.", nivel: "Básico" },
  { id: 21, idioma: "Inglés", bandera: "🇺🇸", categoria: "Street Slang", emoji: "🛹", palabra: "Ghosting", significado: "Desaparecer / Ignorar a alguien", ejemplo: "He ghosted me after the date.", traduccion: "Me ignoró después de la cita.", nivel: "Intermedio" },
  { id: 22, idioma: "Inglés", bandera: "🇺🇸", categoria: "Expresiones", emoji: "😂", palabra: "NPC", significado: "Persona sin personalidad / Robótico", ejemplo: "He just stands there like an NPC.", traduccion: "Solo se queda ahí parado como un NPC.", nivel: "Avanzado" },
  { id: 23, idioma: "Inglés", bandera: "🇺🇸", categoria: "Gen Z", emoji: "⚡", palabra: "Understood the assignment", significado: "Entendió perfectamente lo que había que hacer", ejemplo: "She wore that dress and understood the assignment.", traduccion: "Usó ese vestido y entendió perfectamente la misión.", nivel: "Avanzado" },
  { id: 24, idioma: "Inglés", bandera: "🇺🇸", categoria: "TikTok Speak", emoji: "🔥", palabra: "Rent free", significado: "Vivir en tu cabeza / No poder dejar de pensar en algo", ejemplo: "That song lives rent free in my head.", traduccion: "Esa canción vive sin pagar renta en mi cabeza.", nivel: "Avanzado" },
  { id: 25, idioma: "Inglés", bandera: "🇺🇸", categoria: "Street Slang", emoji: "🛹", palabra: "Flex", significado: "Presumir / Mostrar lo que tienes", ejemplo: "He's always flexing his new car.", traduccion: "Siempre está presumiendo su carro nuevo.", nivel: "Básico" },
  { id: 26, idioma: "Inglés", bandera: "🇺🇸", categoria: "Expresiones", emoji: "😂", palabra: "Caught in 4K", significado: "Pillado en el acto / Con pruebas claras", ejemplo: "He lied and got caught in 4K.", traduccion: "Mintió y lo pillaron con pruebas claras.", nivel: "Intermedio" },
  { id: 27, idioma: "Inglés", bandera: "🇺🇸", categoria: "Gen Z", emoji: "⚡", palabra: "Ate", significado: "Lo hizo perfectamente / Se lo comió", ejemplo: "She ate that performance.", traduccion: "Se comió esa actuación.", nivel: "Intermedio" },
  { id: 28, idioma: "Inglés", bandera: "🇺🇸", categoria: "TikTok Speak", emoji: "🔥", palabra: "Main character", significado: "Actuar como protagonista de tu propia vida", ejemplo: "I'm having a main character moment.", traduccion: "Estoy teniendo un momento de personaje principal.", nivel: "Intermedio" },
  { id: 29, idioma: "Inglés", bandera: "🇺🇸", categoria: "Street Slang", emoji: "🛹", palabra: "Drip", significado: "Estilo / Ropa muy cool", ejemplo: "Bro's drip is immaculate today.", traduccion: "El estilo del bro hoy está impecable.", nivel: "Básico" },
  { id: 30, idioma: "Inglés", bandera: "🇺🇸", categoria: "Expresiones", emoji: "😂", palabra: "Touch grass", significado: "Sal afuera / Deja de estar en internet", ejemplo: "You need to touch grass bro.", traduccion: "Necesitas salir afuera bro.", nivel: "Intermedio" },
  { id: 9, idioma: "Portugués", bandera: "🇧🇷", categoria: "Gíria", emoji: "🌴", palabra: "Mano", significado: "Amigo / Bro", ejemplo: "Mano, que situação estranha!", traduccion: "Bro, ¡qué situación tan rara!", nivel: "Básico" },
  { id: 10, idioma: "Portugués", bandera: "🇧🇷", categoria: "Gíria", emoji: "🌴", palabra: "Saudade", significado: "Nostalgia profunda / Extrañar mucho", ejemplo: "Tô com saudade de você.", traduccion: "Te extraño mucho.", nivel: "Básico" },
  { id: 11, idioma: "Portugués", bandera: "🇧🇷", categoria: "Internet", emoji: "📱", palabra: "Tá ligado?", significado: "¿Entiendes? / ¿Sabes?", ejemplo: "É complicado, tá ligado?", traduccion: "Es complicado, ¿entiendes?", nivel: "Intermedio" },
  { id: 12, idioma: "Portugués", bandera: "🇧🇷", categoria: "Internet", emoji: "📱", palabra: "Bora", significado: "Vamos / Let's go", ejemplo: "Bora pro rolê!", traduccion: "¡Vamos a la fiesta!", nivel: "Básico" },
  { id: 13, idioma: "Portugués", bandera: "🇧🇷", categoria: "Gíria", emoji: "🌴", palabra: "Massa", significado: "Genial / Increíble", ejemplo: "Que show massa foi esse!", traduccion: "¡Qué show tan increíble fue ese!", nivel: "Básico" },
  { id: 31, idioma: "Portugués", bandera: "🇧🇷", categoria: "Gíria", emoji: "🌴", palabra: "Cara", significado: "Tipo / Guy / Persona", ejemplo: "Esse cara é muito engraçado.", traduccion: "Ese tipo es muy gracioso.", nivel: "Básico" },
  { id: 32, idioma: "Portugués", bandera: "🇧🇷", categoria: "Internet", emoji: "📱", palabra: "Zueira", significado: "Burla / Bromear / No va en serio", ejemplo: "Tô na zueira, não leva a sério.", traduccion: "Estoy bromeando, no lo tomes en serio.", nivel: "Intermedio" },
  { id: 33, idioma: "Portugués", bandera: "🇧🇷", categoria: "Gíria", emoji: "🌴", palabra: "Trampar", significado: "Trabajar duro / Chambear", ejemplo: "Preciso trampar muito esse mês.", traduccion: "Necesito trabajar duro este mes.", nivel: "Intermedio" },
  { id: 34, idioma: "Portugués", bandera: "🇧🇷", categoria: "Internet", emoji: "📱", palabra: "Salve", significado: "Hola / Qué tal / Saludo informal", ejemplo: "Salve mano, tudo bem?", traduccion: "Hola bro, ¿todo bien?", nivel: "Básico" },
  { id: 35, idioma: "Portugués", bandera: "🇧🇷", categoria: "Gíria", emoji: "🌴", palabra: "Mitar", significado: "Dominar / Ser el mejor", ejemplo: "Ele mitou no jogo hoje.", traduccion: "Él dominó en el juego hoy.", nivel: "Intermedio" },
  { id: 36, idioma: "Portugués", bandera: "🇧🇷", categoria: "Internet", emoji: "📱", palabra: "Stalkear", significado: "Curiosear el perfil de alguien", ejemplo: "Fui stalkear o perfil dele.", traduccion: "Fui a curiosear su perfil.", nivel: "Básico" },
  { id: 37, idioma: "Portugués", bandera: "🇧🇷", categoria: "Gíria", emoji: "🌴", palabra: "Chapar", significado: "Quedarse dormido / Desmayarse de cansancio", ejemplo: "Chapei assim que cheguei em casa.", traduccion: "Me quedé dormido apenas llegué a casa.", nivel: "Avanzado" },
  { id: 38, idioma: "Portugués", bandera: "🇧🇷", categoria: "Internet", emoji: "📱", palabra: "Rachar", significado: "Dividir la cuenta / Partir gastos", ejemplo: "Bora rachar a conta?", traduccion: "¿Vamos a dividir la cuenta?", nivel: "Intermedio" },
  { id: 14, idioma: "Francés", bandera: "🇫🇷", categoria: "Argot", emoji: "🥖", palabra: "Ouf", significado: "Increíble / Loco (al revés de fou)", ejemplo: "Ce film était ouf!", traduccion: "¡Esa película estuvo increíble!", nivel: "Básico" },
  { id: 15, idioma: "Francés", bandera: "🇫🇷", categoria: "Argot", emoji: "🥖", palabra: "C'est nul", significado: "Es una porquería / No vale nada", ejemplo: "Ce film c'est nul.", traduccion: "Esta película es una porquería.", nivel: "Básico" },
  { id: 16, idioma: "Francés", bandera: "🇫🇷", categoria: "Internet", emoji: "📱", palabra: "Kiffer", significado: "Gustar mucho / Amar algo", ejemplo: "Je kiffe trop cette musique.", traduccion: "Me encanta demasiado esta música.", nivel: "Intermedio" },
  { id: 17, idioma: "Francés", bandera: "🇫🇷", categoria: "Argot", emoji: "🥖", palabra: "Chelou", significado: "Raro / Sospechoso", ejemplo: "Ce mec est vraiment chelou.", traduccion: "Este tipo es realmente raro.", nivel: "Intermedio" },
  { id: 18, idioma: "Francés", bandera: "🇫🇷", categoria: "Internet", emoji: "📱", palabra: "Grave", significado: "Totalmente / Exacto", ejemplo: "T'as raison, grave!", traduccion: "Tienes razón, ¡totalmente!", nivel: "Básico" },
  { id: 39, idioma: "Francés", bandera: "🇫🇷", categoria: "Argot", emoji: "🥖", palabra: "Wesh", significado: "Hola / Oye / Saludo de calle", ejemplo: "Wesh, ça va?", traduccion: "Oye, ¿qué tal?", nivel: "Básico" },
  { id: 40, idioma: "Francés", bandera: "🇫🇷", categoria: "Internet", emoji: "📱", palabra: "Péter un câble", significado: "Perder la cabeza / Volverse loco", ejemplo: "Il a pété un câble en réunion.", traduccion: "Perdió la cabeza en la reunión.", nivel: "Avanzado" },
  { id: 41, idioma: "Francés", bandera: "🇫🇷", categoria: "Argot", emoji: "🥖", palabra: "Bolos", significado: "Tonto / Persona sin gracia", ejemplo: "T'es vraiment un bolos.", traduccion: "Eres realmente un tonto.", nivel: "Intermedio" },
  { id: 42, idioma: "Francés", bandera: "🇫🇷", categoria: "Internet", emoji: "📱", palabra: "Trop bien", significado: "Genial / Demasiado bueno", ejemplo: "Ce resto était trop bien!", traduccion: "¡Ese restaurante estuvo genial!", nivel: "Básico" },
  { id: 43, idioma: "Francés", bandera: "🇫🇷", categoria: "Argot", emoji: "🥖", palabra: "Zarbi", significado: "Raro / Extraño (al revés de bizarre)", ejemplo: "C'est zarbi comme situation.", traduccion: "Es una situación muy rara.", nivel: "Avanzado" },
  { id: 44, idioma: "Francés", bandera: "🇫🇷", categoria: "Internet", emoji: "📱", palabra: "Pécho", significado: "Ligar / Conquistar a alguien", ejemplo: "Il a pécho à la soirée.", traduccion: "Ligó en la fiesta.", nivel: "Intermedio" },
  { id: 45, idioma: "Francés", bandera: "🇫🇷", categoria: "Argot", emoji: "🥖", palabra: "Avoir la flemme", significado: "Tener pereza / No tener ganas", ejemplo: "J'ai la flemme d'aller au sport.", traduccion: "Tengo pereza de ir al gimnasio.", nivel: "Intermedio" },
  { id: 46, idioma: "Japonés", bandera: "🇯🇵", categoria: "Anime Slang", emoji: "⛩️", palabra: "Sugoi", significado: "¡Increíble! / ¡Wow!", ejemplo: "Sugoi! That's amazing!", traduccion: "¡Increíble! ¡Eso es asombroso!", nivel: "Básico" },
  { id: 47, idioma: "Japonés", bandera: "🇯🇵", categoria: "Internet", emoji: "📱", palabra: "Kawaii", significado: "Tierno / Adorable / Cute", ejemplo: "That cat is so kawaii!", traduccion: "¡Ese gato es tan adorable!", nivel: "Básico" },
  { id: 48, idioma: "Japonés", bandera: "🇯🇵", categoria: "Anime Slang", emoji: "⛩️", palabra: "Senpai", significado: "Alguien mayor o más experimentado que tú", ejemplo: "Notice me senpai!", traduccion: "¡Fíjate en mí senpai!", nivel: "Básico" },
  { id: 49, idioma: "Japonés", bandera: "🇯🇵", categoria: "Calle", emoji: "🏙️", palabra: "Mendokusai", significado: "Qué fastidio / Qué pereza", ejemplo: "Mendokusai, I don't want to go.", traduccion: "Qué pereza, no quiero ir.", nivel: "Intermedio" },
  { id: 50, idioma: "Japonés", bandera: "🇯🇵", categoria: "Internet", emoji: "📱", palabra: "Ikemen", significado: "Chico guapo / Tipo atractivo", ejemplo: "He's such an ikemen!", traduccion: "¡Es tan guapo!", nivel: "Intermedio" },
  { id: 51, idioma: "Japonés", bandera: "🇯🇵", categoria: "Anime Slang", emoji: "⛩️", palabra: "Nakama", significado: "Amigos / Compañeros / Equipo", ejemplo: "These are my nakama.", traduccion: "Estos son mis compañeros.", nivel: "Básico" },
  { id: 52, idioma: "Japonés", bandera: "🇯🇵", categoria: "Calle", emoji: "🏙️", palabra: "Yabai", significado: "Puede ser malo o increíble según contexto", ejemplo: "That movie was yabai!", traduccion: "¡Esa película estuvo brutal!", nivel: "Avanzado" },
  { id: 53, idioma: "Japonés", bandera: "🇯🇵", categoria: "Internet", emoji: "📱", palabra: "Oshi", significado: "Tu favorito / A quien apoyas más", ejemplo: "She's my oshi in the group.", traduccion: "Ella es mi favorita del grupo.", nivel: "Intermedio" },
  { id: 54, idioma: "Japonés", bandera: "🇯🇵", categoria: "Anime Slang", emoji: "⛩️", palabra: "Tsundere", significado: "Frío por fuera pero cariñoso por dentro", ejemplo: "He's such a tsundere character.", traduccion: "Es un personaje muy tsundere.", nivel: "Avanzado" },
]

const idiomas = ["Todos", "Inglés", "Portugués", "Francés", "Japonés"]
const categorias = {
  "Todos": ["Todas"],
  "Inglés": ["Todas", "TikTok Speak", "Street Slang", "Expresiones", "Gen Z"],
  "Portugués": ["Todas", "Gíria", "Internet"],
  "Francés": ["Todas", "Argot", "Internet"],
  "Japonés": ["Todas", "Anime Slang", "Internet", "Calle"]
}
const niveles = ["Todos", "Básico", "Intermedio", "Avanzado"]

function Lecciones({ setPalabraPractica }) {
  const navigate = useNavigate()
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

  function practicarPalabra(palabra) {
    setPalabraPractica(palabra)
    navigate('/arena')
  }

  return (
    <div className="container">
      <h1 className="logo">📚 Lecciones</h1>
      <p className="tagline">Slang, expresiones y lenguaje real</p>

      <div className="filtros">
        <div className="filtro-grupo">
          {idiomas.map(idioma => (
            <button key={idioma} className={idiomaActivo === idioma ? 'filtro-activo' : 'filtro-btn'} onClick={() => cambiarIdioma(idioma)}>
              {idioma === "Inglés" ? "🇺🇸" : idioma === "Portugués" ? "🇧🇷" : idioma === "Francés" ? "🇫🇷" : idioma === "Japonés" ? "🇯🇵" : "🌍"} {idioma}
            </button>
          ))}
        </div>
        <div className="filtro-grupo">
          {categoriasActuales.map(cat => (
            <button key={cat} className={categoriaActiva === cat ? 'filtro-activo' : 'filtro-btn'} onClick={() => setCategoriaActiva(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="filtro-grupo">
          {niveles.map(niv => (
            <button key={niv} className={nivelActivo === niv ? 'filtro-activo' : 'filtro-btn'} onClick={() => setNivelActivo(niv)}>
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
            <button className="btn-primary" onClick={() => practicarPalabra(leccion.palabra)}>
              ⚔️ Practicar esta palabra
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Lecciones