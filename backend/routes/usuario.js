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

router.post('/actualizar-xp', verificarToken, async (req, res) => {
  const { xp_ganado, gano } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1', [req.usuarioId]
    )
    const usuario = result.rows[0]

    function calcularRango(nivel) {
      if (nivel >= 10) return '🥇 Street Legend'
      if (nivel >= 6) return '🥈 Native Vibe'
      return '🥉 Street Rookie'
    }

    const xpSiguiente = usuario.nivel * 200 + 300
    const xpTotal = usuario.xp + xp_ganado
    const subioNivel = xpTotal >= xpSiguiente
    const nuevoNivel = subioNivel ? usuario.nivel + 1 : usuario.nivel
    const xpFinal = subioNivel ? xpTotal - xpSiguiente : xpTotal

    const actualizado = await pool.query(
      `UPDATE usuarios SET
        xp = $1,
        nivel = $2,
        rango = $3,
        partidas = partidas + 1,
        victorias = victorias + $4
      WHERE id = $5
      RETURNING id, nombre, email, xp, nivel, racha, partidas, victorias, rango`,
      [
        xpFinal,
        nuevoNivel,
        calcularRango(nuevoNivel),
        gano ? 1 : 0,
        req.usuarioId
      ]
    )

    res.json({ usuario: actualizado.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error actualizando XP' })
  }
})

router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, xp, nivel, racha, partidas, victorias, rango FROM usuarios WHERE id = $1',
      [req.usuarioId]
    )
    res.json({ usuario: result.rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo perfil' })
  }
})
router.get('/ranking', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, xp, nivel, racha, victorias, rango
       FROM usuarios
       ORDER BY xp DESC
       LIMIT 20`
    )
    res.json({ jugadores: result.rows })
  } catch (err) {
    console.error('ERROR RANKING:', err.message)
    res.status(500).json({ error: err.message })
  }
})





module.exports = router