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

router.post('/solicitar', verificarToken, async (req, res) => {
  const { receptor_id } = req.body
  try {
    const existente = await pool.query(
      `SELECT * FROM amigos 
       WHERE (solicitante_id = $1 AND receptor_id = $2)
       OR (solicitante_id = $2 AND receptor_id = $1)`,
      [req.usuarioId, receptor_id]
    )
    if (existente.rows.length > 0)
      return res.status(400).json({ error: 'Ya existe una solicitud o amistad con este usuario' })

    await pool.query(
      `INSERT INTO amigos (solicitante_id, receptor_id) VALUES ($1, $2)`,
      [req.usuarioId, receptor_id]
    )
    res.json({ mensaje: 'Solicitud enviada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/responder', verificarToken, async (req, res) => {
  const { solicitud_id, accion } = req.body
  try {
    if (accion === 'rechazar') {
      await pool.query('DELETE FROM amigos WHERE id = $1 AND receptor_id = $2',
        [solicitud_id, req.usuarioId])
      return res.json({ mensaje: 'Solicitud rechazada' })
    }
    await pool.query(
      `UPDATE amigos SET estado = 'aceptado' WHERE id = $1 AND receptor_id = $2`,
      [solicitud_id, req.usuarioId]
    )
    res.json({ mensaje: 'Solicitud aceptada' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/lista', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        a.id,
        CASE WHEN a.solicitante_id = $1 THEN u2.id ELSE u1.id END as amigo_id,
        CASE WHEN a.solicitante_id = $1 THEN u2.nombre ELSE u1.nombre END as nombre,
        CASE WHEN a.solicitante_id = $1 THEN u2.rango ELSE u1.rango END as rango,
        CASE WHEN a.solicitante_id = $1 THEN u2.xp ELSE u1.xp END as xp
       FROM amigos a
       JOIN usuarios u1 ON a.solicitante_id = u1.id
       JOIN usuarios u2 ON a.receptor_id = u2.id
       WHERE (a.solicitante_id = $1 OR a.receptor_id = $1)
       AND a.estado = 'aceptado'`,
      [req.usuarioId]
    )
    res.json({ amigos: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/solicitudes', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, u.nombre, u.rango, u.xp
       FROM amigos a
       JOIN usuarios u ON a.solicitante_id = u.id
       WHERE a.receptor_id = $1 AND a.estado = 'pendiente'`,
      [req.usuarioId]
    )
    res.json({ solicitudes: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router