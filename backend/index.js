const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const authRoutes = require('./routes/auth')
const usuarioRoutes = require('./routes/usuario')

app.use('/auth', authRoutes)
app.use('/usuario', usuarioRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: '🗣️ Street Talk API funcionando!' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})