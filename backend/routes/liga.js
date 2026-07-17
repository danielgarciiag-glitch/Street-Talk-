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

const LIGAS = ['Bronce', 'Plata', 'Oro', 'Diamante', 'Legend']
const LIGA_COLORES = {
  'Bronce': '#cd7f32',
  'Plata': '#c0c0c0',
  'Oro': '#ffd700',
  'Diamante': '#b9f2ff',
  'Legend': '#ff6b6b'
}
const LIGA_EMOJIS = {
  'Bronce': '🥉',
  'Plata': '🥈',
  'Oro': '🥇',
  'Diamante': '💎',
  'Legend': '👑'
}

// Ver mi liga y ranking de mi liga
router.get('/mi-liga', verificarToken, async (req, res) => {
  try {
    const yo = await pool.query(
      'SELECT id, nombre, liga, liga_xp, xp, rango FROM usuarios WHERE id = $1',
      [req.usuarioId]
    )
    if (yo.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' })

    const miLiga = yo.rows[0].liga || 'Bronce'

    const jugadores = await pool.query(
      `SELECT id, nombre, liga, liga_xp, xp, rango
       FROM usuarios
       WHERE liga = $1
       ORDER BY liga_xp DESC
       LIMIT 20`,
      [miLiga]
    )

    const miPosicion = jugadores.rows.findIndex(j => j.id === req.usuarioId) + 1

    res.json({
      yo: yo.rows[0],
      liga: miLiga,
      jugadores: jugadores.rows,
      miPosicion,
      color: LIGA_COLORES[miLiga],
      emoji: LIGA_EMOJIS[miLiga]
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Ver todas las ligas
router.get('/ligas', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT liga, COUNT(*) as total, MAX(liga_xp) as max_xp
       FROM usuarios
       GROUP BY liga
       ORDER BY CASE liga
         WHEN 'Bronce' THEN 1
         WHEN 'Plata' THEN 2
         WHEN 'Oro' THEN 3
         WHEN 'Diamante' THEN 4
         WHEN 'Legend' THEN 5
       END`
    )
    res.json({ ligas: result.rows, colores: LIGA_COLORES, emojis: LIGA_EMOJIS })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Sumar XP de liga (se llama cuando el usuario gana partidas)
router.post('/sumar-xp', verificarToken, async (req, res) => {
  const { xp } = req.body
  try {
    await pool.query(
      'UPDATE usuarios SET liga_xp = liga_xp + $1 WHERE id = $2',
      [xp, req.usuarioId]
    )

    // Verificar ascenso automático
    const usuario = await pool.query(
      'SELECT liga, liga_xp FROM usuarios WHERE id = $1',
      [req.usuarioId]
    )
    const { liga, liga_xp } = usuario.rows[0]
    const indiceActual = LIGAS.indexOf(liga)

    let mensaje = null
    if (liga_xp >= 1000 && indiceActual < LIGAS.length - 1) {
      const nuevaLiga = LIGAS[indiceActual + 1]
      await pool.query(
        'UPDATE usuarios SET liga = $1, liga_xp = 0 WHERE id = $2',
        [nuevaLiga, req.usuarioId]
      )
      mensaje = `¡Subiste a ${nuevaLiga}!`
    }

    res.json({ mensaje, liga_xp: liga_xp + xp })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Reset semanal — ascensos y descensos (llamar manualmente o con cron)
router.post('/reset-semanal', async (req, res) => {
  try {
    for (const liga of LIGAS) {
      const jugadores = await pool.query(
        `SELECT id FROM usuarios WHERE liga = $1 ORDER BY liga_xp DESC`,
        [liga]
      )

      const total = jugadores.rows.length
      if (total < 4) continue

      const top3 = jugadores.rows.slice(0, 3).map(j => j.id)
      const bottom3 = jugadores.rows.slice(-3).map(j => j.id)

      const indice = LIGAS.indexOf(liga)

      if (indice < LIGAS.length - 1) {
        const ligaSuperior = LIGAS[indice + 1]
        for (const id of top3) {
          await pool.query('UPDATE usuarios SET liga = $1, liga_xp = 0 WHERE id = $2', [ligaSuperior, id])
        }
      }

      if (indice > 0) {
        const ligaInferior = LIGAS[indice - 1]
        for (const id of bottom3) {
          await pool.query('UPDATE usuarios SET liga = $1, liga_xp = 0 WHERE id = $2', [ligaInferior, id])
        }
      }
    }

    await pool.query('UPDATE usuarios SET liga_xp = 0')
    res.json({ mensaje: 'Reset semanal completado' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router