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

// Buscar usuario para retar
router.get('/buscar/:nombre', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, nivel, rango, xp 
       FROM usuarios 
       WHERE nombre ILIKE $1 AND id != $2
       LIMIT 5`,
      [`%${req.params.nombre}%`, req.usuarioId]
    )
    res.json({ usuarios: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Enviar desafío
router.post('/enviar', verificarToken, async (req, res) => {
  const { retado_id, idioma } = req.body
  try {
    const existente = await pool.query(
      `SELECT * FROM desafios 
       WHERE retador_id = $1 AND retado_id = $2 AND estado = 'pendiente'`,
      [req.usuarioId, retado_id]
    )
    if (existente.rows.length > 0) {
      return res.status(400).json({ error: 'Ya tienes un desafío pendiente con este usuario' })
    }

    const result = await pool.query(
      `INSERT INTO desafios (retador_id, retado_id, idioma)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.usuarioId, retado_id, idioma || 'Inglés']
    )
    res.json({ desafio: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Ver desafíos pendientes
router.get('/pendientes', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, 
        u1.nombre as retador_nombre, u1.rango as retador_rango,
        u2.nombre as retado_nombre, u2.rango as retado_rango
       FROM desafios d
       JOIN usuarios u1 ON d.retador_id = u1.id
       JOIN usuarios u2 ON d.retado_id = u2.id
       WHERE (d.retado_id = $1 OR d.retador_id = $1)
       AND d.estado = 'pendiente'
       ORDER BY d.creado_en DESC`,
      [req.usuarioId]
    )
    res.json({ desafios: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Completar desafío
router.post('/completar/:id', verificarToken, async (req, res) => {
  const { puntaje } = req.body
  try {
    const desafio = await pool.query(
      'SELECT * FROM desafios WHERE id = $1', [req.params.id]
    )

    if (desafio.rows.length === 0) {
      return res.status(404).json({ error: 'Desafío no encontrado' })
    }

    const d = desafio.rows[0]
    let updateQuery

    if (d.retador_id === req.usuarioId) {
      updateQuery = await pool.query(
        `UPDATE desafios SET retador_puntaje = $1, estado = 'completado'
         WHERE id = $2 RETURNING *`,
        [puntaje, req.params.id]
      )
    } else {
      updateQuery = await pool.query(
        `UPDATE desafios SET retado_puntaje = $1, estado = 'completado'
         WHERE id = $2 RETURNING *`,
        [puntaje, req.params.id]
      )
    }

    res.json({ desafio: updateQuery.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router