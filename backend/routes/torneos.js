const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const jwt = require('jsonwebtoken')
require('dotenv').config()

function verificarToken(req, res, next) {
  const token = req.headers['authorization']
  if (!token) return res.status(401).json({ error: 'Token requerido' })
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.usuarioId = decoded.id
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
}

// Ver torneo activo
router.get('/activo', verificarToken, async (req, res) => {
  try {
    const torneo = await pool.query(
      `SELECT * FROM torneos WHERE estado = 'activo' ORDER BY inicio DESC LIMIT 1`
    )
    if (torneo.rows.length === 0)
      return res.json({ torneo: null })

    const t = torneo.rows[0]

    const participantes = await pool.query(
      `SELECT tp.usuario_id, u.nombre, u.rango, tp.puntaje
       FROM torneos_participantes tp
       JOIN usuarios u ON tp.usuario_id = u.id
       WHERE tp.torneo_id = $1
       ORDER BY tp.puntaje DESC
       LIMIT 10`,
      [t.id]
    )

    const yaParticipa = await pool.query(
      `SELECT * FROM torneos_participantes 
       WHERE torneo_id = $1 AND usuario_id = $2`,
      [t.id, req.usuarioId]
    )

    res.json({
      torneo: t,
      ranking: participantes.rows,
      yaParticipa: yaParticipa.rows.length > 0
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Unirse al torneo
router.post('/unirse', verificarToken, async (req, res) => {
  try {
    const torneo = await pool.query(
      `SELECT * FROM torneos WHERE estado = 'activo' ORDER BY inicio DESC LIMIT 1`
    )
    if (torneo.rows.length === 0)
      return res.status(404).json({ error: 'No hay torneo activo' })

    const t = torneo.rows[0]

    await pool.query(
      `INSERT INTO torneos_participantes (torneo_id, usuario_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [t.id, req.usuarioId]
    )
    res.json({ mensaje: 'Te uniste al torneo' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Sumar puntos al torneo (se llama al completar una lección o arena)
router.post('/sumar-puntos', verificarToken, async (req, res) => {
  const { puntos } = req.body
  try {
    const torneo = await pool.query(
      `SELECT * FROM torneos WHERE estado = 'activo' ORDER BY inicio DESC LIMIT 1`
    )
    if (torneo.rows.length === 0)
      return res.json({ mensaje: 'Sin torneo activo' })

    const t = torneo.rows[0]

    await pool.query(
      `UPDATE torneos_participantes SET puntaje = puntaje + $1
       WHERE torneo_id = $2 AND usuario_id = $3`,
      [puntos, t.id, req.usuarioId]
    )
    res.json({ mensaje: 'Puntos sumados' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router