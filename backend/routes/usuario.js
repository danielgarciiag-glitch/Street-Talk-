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

// Actualizar XP después de una partida
router.post('/actualizar-xp', verificarToken, async (req, res) => {
  const { xp_ganado, gano } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1', [req.usuarioId]
    )
    const usuario = result.rows[0]

    const nuevoXP = usuario.xp + xp_ganado
    const subioNivel = nuevoXP >= (usuario.nivel * 200 + 300)
    const nuevoNivel = subioNivel ? usuario.nivel + 1 : usuario.nivel

    function calcularRango(nivel) {
      if (nivel >= 10) return '🥇 Street Legend'
      if (nivel >= 6) return '🥈 Native Vibe'
      return '🥉 Street Rookie'
    }

    const xpSiguiente = usuario.nivel * 200 + 300
const nuevoXP = usuario.xp + xp_ganado
const subioNivel = nuevoXP >= xpSiguiente
const nuevoNivel = subioNivel ? usuario.nivel + 1 : usuario.nivel
const xpFinal = subioNivel ? nuevoXP - xpSiguiente : nuevoXP

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

// Obtener datos actuales del usuario
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

module.exports = router