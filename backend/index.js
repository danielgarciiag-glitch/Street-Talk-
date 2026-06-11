const express = require('express')
const cors = require('cors')
const http = require('http') // 1. Importamos el módulo HTTP nativo
const { Server } = require('socket.io') // 2. Importamos el servidor de Socket.io
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Crear el servidor HTTP usando Express
const server = http.createServer(app)

// Configurar Socket.io con las mismas políticas de CORS que tu App
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://street-talk-five.vercel.app'
    ],
    credentials: true
  }
})

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://street-talk-five.vercel.app'
  ],
  credentials: true
}))

app.use(express.json())

// Carga de Rutas Existentes
const authRoutes = require('./routes/auth')
const usuarioRoutes = require('./routes/usuario')
const desasfiosRoutes = require('./routes/desafios')
const amigosRoutes = require('./routes/amigos')
const chatRoutes = require('./routes/chat')
const torneosRoutes = require('./routes/torneos')

app.use('/auth', authRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/desafios', desasfiosRoutes)
app.use('/amigos', amigosRoutes)
app.use('/chat', chatRoutes)
app.use('/torneos', torneosRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: '🗣️ Street Talk API funcionando con WebSockets!' })
})

// ==========================================
// 🚀 LÓGICA DE WEBSOCKETS PARA CHAT Y ARENA
// ==========================================
const usuariosConectados = {} // Diccionario para mapear id_usuario -> socket.id

io.on('connection', (socket) => {
  console.log(`👤 Usuario conectado al socket: ${socket.id}`)

  // Cuando el frontend se conecta, envía el ID del usuario logueado
  socket.on('registrar_usuario', (usuarioId) => {
    usuariosConectados[usuarioId] = socket.id
    console.log(`📌 Usuario ID ${usuarioId} mapeado al socket ${socket.id}`)
  })

  // Escuchar cuando un jugador envía un mensaje a otro
  socket.on('enviar_mensaje', async (datos) => {
    const { remitente_id, receptor_id, contenido } = datos

    // Aquí Claude Code deberá ayudarte a conectar tu controlador de base de datos
    // para hacer el INSERT INTO mensajes...
    
    // Verificamos si el receptor está conectado en este momento
    const socketReceptorId = usuariosConectados[receptor_id]
    
    if (socketReceptorId) {
      // Si está conectado, le enviamos el mensaje instantáneamente
      io.to(socketReceptorId).emit('recibir_mensaje', {
        remitente_id,
        contenido,
        creado_en: new Date()
      })
    }
  })

  // Manejo de desconexión
  socket.on('disconnect', () => {
    // Limpiar el usuario del diccionario al desconectarse
    for (const id in usuariosConectados) {
      if (usuariosConectados[id] === socket.id) {
        delete usuariosConectados[id]
        break
      }
    }
    console.log(`❌ Socket desconectado: ${socket.id}`)
  })
})

// ⚠️ IMPORTANTE: Ahora escuchamos desde 'server', NO desde 'app'
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})