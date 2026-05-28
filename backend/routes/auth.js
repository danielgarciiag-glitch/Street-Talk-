const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')
require('dotenv').config()

// REGISTRO
router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body

  try {
    const existe = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1', [email]
    )
    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    const hash = await bcrypt.hash(password, 10)

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password)
       VALUES ($1, $2, $3) RETURNING id, nombre, email, xp, nivel, rango`,
      [nombre, email, hash]
    )

    const usuario = resultado.rows[0]
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({ token, usuario })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1', [email]
    )

    if (resultado.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' })
    }

    const usuario = resultado.rows[0]
    const passwordOk = await bcrypt.compare(password, usuario.password)

    if (!passwordOk) {
      return res.status(400).json({ error: 'Contraseña incorrecta' })
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        xp: usuario.xp,
        nivel: usuario.nivel,
        racha: usuario.racha,
        partidas: usuario.partidas,
        victorias: usuario.victorias,
        rango: usuario.rango
      }
    })
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
})

module.exports = router