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

// Enviar mensaje
router.post('/enviar', verificarToken, async (req, res) => {
  const { receptor_id, contenido } = req.body
  if (!contenido || !contenido.trim())
    return res.status(400).json({ error: 'Mensaje vacío' })
  try {
    const result = await pool.query(
      `INSERT INTO mensajes (remitente_id, receptor_id, contenido)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.usuarioId, receptor_id, contenido.trim()]
    )
    res.json({ mensaje: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Ver conversación con un usuario
router.get('/conversacion/:otro_id', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.nombre as remitente_nombre
       FROM mensajes m
       JOIN usuarios u ON m.remitente_id = u.id
       WHERE (m.remitente_id = $1 AND m.receptor_id = $2)
          OR (m.remitente_id = $2 AND m.receptor_id = $1)
       ORDER BY m.creado_en ASC`,
      [req.usuarioId, req.params.otro_id]
    )
    await pool.query(
      `UPDATE mensajes SET leido = TRUE
       WHERE receptor_id = $1 AND remitente_id = $2`,
      [req.usuarioId, req.params.otro_id]
    )
    res.json({ mensajes: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Ver lista de conversaciones
router.get('/conversaciones', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT ON (otro_id)
        CASE WHEN m.remitente_id = $1 THEN m.receptor_id ELSE m.remitente_id END as otro_id,
        CASE WHEN m.remitente_id = $1 THEN u2.nombre ELSE u1.nombre END as nombre,
        m.contenido as ultimo_mensaje,
        m.creado_en,
        COUNT(CASE WHEN m.receptor_id = $1 AND m.leido = FALSE THEN 1 END) 
          OVER (PARTITION BY CASE WHEN m.remitente_id = $1 THEN m.receptor_id ELSE m.remitente_id END) as no_leidos
       FROM mensajes m
       JOIN usuarios u1 ON m.remitente_id = u1.id
       JOIN usuarios u2 ON m.receptor_id = u2.id
       WHERE m.remitente_id = $1 OR m.receptor_id = $1
       ORDER BY otro_id, m.creado_en DESC`,
      [req.usuarioId]
    )
    res.json({ conversaciones: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router