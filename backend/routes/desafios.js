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

router.get('/buscar/:nombre', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, nivel, rango, xp FROM usuarios WHERE nombre ILIKE $1 AND id != $2 LIMIT 5`,
      [`%${req.params.nombre}%`, req.usuarioId]
    )
    res.json({ usuarios: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/enviar', verificarToken, async (req, res) => {
  const { retado_id, idioma, apuesta } = req.body
  try {
    const existente = await pool.query(
      `SELECT * FROM desafios WHERE retador_id = $1 AND retado_id = $2 AND estado = 'pendiente'`,
      [req.usuarioId, retado_id]
    )
    if (existente.rows.length > 0)
      return res.status(400).json({ error: 'Ya tienes un desafío pendiente con este usuario' })

    // Verificar que el retador tenga suficiente XP para apostar
    if (apuesta > 0) {
      const usuario = await pool.query('SELECT xp FROM usuarios WHERE id = $1', [req.usuarioId])
      if (usuario.rows[0].xp < apuesta)
        return res.status(400).json({ error: 'No tienes suficiente XP para esta apuesta' })

      // Congelar el XP apostado del retador
      await pool.query('UPDATE usuarios SET xp = xp - $1 WHERE id = $2', [apuesta, req.usuarioId])
    }

    const result = await pool.query(
      `INSERT INTO desafios (retador_id, retado_id, idioma, apuesta) VALUES ($1, $2, $3, $4) RETURNING *`,
      [req.usuarioId, retado_id, idioma || 'Inglés', apuesta || 0]
    )
    res.json({ desafio: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

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

router.post('/completar/:id', verificarToken, async (req, res) => {
  const { puntaje } = req.body
  try {
    const desafio = await pool.query('SELECT * FROM desafios WHERE id = $1', [req.params.id])
    if (desafio.rows.length === 0)
      return res.status(404).json({ error: 'Desafío no encontrado' })

    const d = desafio.rows[0]
    const esRetador = d.retador_id === req.usuarioId

    // Si hay apuesta y es el retado quien completa, congelar su XP también
    if (d.apuesta > 0 && !esRetador) {
      const retado = await pool.query('SELECT xp FROM usuarios WHERE id = $1', [req.usuarioId])
      if (retado.rows[0].xp < d.apuesta)
        return res.status(400).json({ error: 'No tienes suficiente XP para aceptar esta apuesta' })
      await pool.query('UPDATE usuarios SET xp = xp - $1 WHERE id = $2', [d.apuesta, req.usuarioId])
    }

    let updateQuery
    if (esRetador) {
      updateQuery = await pool.query(
        `UPDATE desafios SET retador_puntaje = $1 WHERE id = $2 RETURNING *`,
        [puntaje, req.params.id]
      )
    } else {
      updateQuery = await pool.query(
        `UPDATE desafios SET retado_puntaje = $1 WHERE id = $2 RETURNING *`,
        [puntaje, req.params.id]
      )
    }

    const actualizado = updateQuery.rows[0]

    // Si ambos jugaron, resolver la apuesta
    if (actualizado.retador_puntaje !== null && actualizado.retado_puntaje !== null) {
      await pool.query(`UPDATE desafios SET estado = 'completado' WHERE id = $1`, [req.params.id])

      const retadorGano = actualizado.retador_puntaje > actualizado.retado_puntaje
      const empate = actualizado.retador_puntaje === actualizado.retado_puntaje

      if (d.apuesta > 0) {
        if (empate) {
          // Devolver XP a ambos
          await pool.query('UPDATE usuarios SET xp = xp + $1 WHERE id = $2', [d.apuesta, d.retador_id])
          await pool.query('UPDATE usuarios SET xp = xp + $1 WHERE id = $2', [d.apuesta, d.retado_id])
        } else {
          const ganadorId = retadorGano ? d.retador_id : d.retado_id
          await pool.query('UPDATE usuarios SET xp = xp + $1 WHERE id = $2', [d.apuesta * 2, ganadorId])
        }
      }

      return res.json({
        desafio: actualizado,
        resultado: empate ? 'empate' : retadorGano ? 'retador' : 'retado',
        apuesta: d.apuesta
      })
    }

    res.json({ desafio: actualizado })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router