const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://street-talk-five.vercel.app'
  ],
  credentials: true
}))

app.use(express.json())

const authRoutes = require('./routes/auth')
const usuarioRoutes = require('./routes/usuario')
const desafiosRoutes = require('./routes/desafios')
const amigosRoutes = require('./routes/amigos')
const chatRoutes = require('./routes/chat')
const torneosRoutes = require('./routes/torneos')
const iaRoutes = require('./routes/ia')
const clanesRoutes = require('./routes/clanes')

app.use('/auth', authRoutes)
app.use('/usuario', usuarioRoutes)
app.use('/desafios', desafiosRoutes)
app.use('/amigos', amigosRoutes)
app.use('/chat', chatRoutes)
app.use('/torneos', torneosRoutes)
app.use('/ia', iaRoutes)
app.use('/clanes', clanesRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: '🗣️ Street Talk API funcionando!' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})