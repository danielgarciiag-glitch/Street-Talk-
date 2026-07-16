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

// Crear clan
router.post('/crear', verificarToken, async (req, res) => {
  const { nombre, descripcion } = req.body
  if (!nombre || nombre.trim().length < 3)
    return res.status(400).json({ error: 'El nombre debe tener al menos 3 caracteres' })
  try {
    // Verificar que no esté ya en un clan
    const yaEnClan = await pool.query(
      'SELECT * FROM clanes_miembros WHERE usuario_id = $1', [req.usuarioId]
    )
    if (yaEnClan.rows.length > 0)
      return res.status(400).json({ error: 'Ya perteneces a un clan. Sal primero para crear uno nuevo.' })

    const clan = await pool.query(
      `INSERT INTO clanes (nombre, descripcion, lider_id) VALUES ($1, $2, $3) RETURNING *`,
      [nombre.trim(), descripcion || '', req.usuarioId]
    )
    await pool.query(
      `INSERT INTO clanes_miembros (clan_id, usuario_id, rol) VALUES ($1, $2, 'lider')`,
      [clan.rows[0].id, req.usuarioId]
    )
    res.json({ clan: clan.rows[0] })
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Ya existe un clan con ese nombre' })
    res.status(500).json({ error: err.message })
  }
})

// Unirse a un clan
router.post('/unirse/:clan_id', verificarToken, async (req, res) => {
  try {
    const yaEnClan = await pool.query(
      'SELECT * FROM clanes_miembros WHERE usuario_id = $1', [req.usuarioId]
    )
    if (yaEnClan.rows.length > 0)
      return res.status(400).json({ error: 'Ya perteneces a un clan' })

    const clan = await pool.query('SELECT * FROM clanes WHERE id = $1', [req.params.clan_id])
    if (clan.rows.length === 0)
      return res.status(404).json({ error: 'Clan no encontrado' })

    await pool.query(
      `INSERT INTO clanes_miembros (clan_id, usuario_id, rol) VALUES ($1, $2, 'miembro')`,
      [req.params.clan_id, req.usuarioId]
    )
    res.json({ mensaje: `Te uniste al clan ${clan.rows[0].nombre}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Salir del clan
router.post('/salir', verificarToken, async (req, res) => {
  try {
    const miembro = await pool.query(
      'SELECT * FROM clanes_miembros WHERE usuario_id = $1', [req.usuarioId]
    )
    if (miembro.rows.length === 0)
      return res.status(400).json({ error: 'No perteneces a ningún clan' })

    const clan = await pool.query('SELECT * FROM clanes WHERE id = $1', [miembro.rows[0].clan_id])
    
    // Si es el líder y hay más miembros, transferir liderazgo
    if (clan.rows[0].lider_id === req.usuarioId) {
      const otroMiembro = await pool.query(
        `SELECT usuario_id FROM clanes_miembros WHERE clan_id = $1 AND usuario_id != $2 LIMIT 1`,
        [clan.rows[0].id, req.usuarioId]
      )
      if (otroMiembro.rows.length > 0) {
        await pool.query('UPDATE clanes SET lider_id = $1 WHERE id = $2', [otroMiembro.rows[0].usuario_id, clan.rows[0].id])
        await pool.query(`UPDATE clanes_miembros SET rol = 'lider' WHERE usuario_id = $1`, [otroMiembro.rows[0].usuario_id])
      } else {
        // Era el único, eliminar clan
        await pool.query('DELETE FROM clanes_miembros WHERE clan_id = $1', [clan.rows[0].id])
        await pool.query('DELETE FROM clanes WHERE id = $1', [clan.rows[0].id])
        return res.json({ mensaje: 'Clan eliminado por quedarse sin miembros' })
      }
    }

    await pool.query('DELETE FROM clanes_miembros WHERE usuario_id = $1', [req.usuarioId])
    res.json({ mensaje: 'Saliste del clan' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Ver mi clan
router.get('/mi-clan', verificarToken, async (req, res) => {
  try {
    const miembro = await pool.query(
      'SELECT * FROM clanes_miembros WHERE usuario_id = $1', [req.usuarioId]
    )
    if (miembro.rows.length === 0)
      return res.json({ clan: null })

    const clan = await pool.query('SELECT * FROM clanes WHERE id = $1', [miembro.rows[0].clan_id])
    const miembros = await pool.query(
      `SELECT u.id, u.nombre, u.xp, u.rango, u.nivel, cm.rol
       FROM clanes_miembros cm
       JOIN usuarios u ON cm.usuario_id = u.id
       WHERE cm.clan_id = $1
       ORDER BY u.xp DESC`,
      [clan.rows[0].id]
    )

    // Calcular XP total del clan
    const xpTotal = miembros.rows.reduce((sum, m) => sum + m.xp, 0)
    await pool.query('UPDATE clanes SET xp_total = $1 WHERE id = $2', [xpTotal, clan.rows[0].id])

    res.json({ clan: { ...clan.rows[0], xp_total: xpTotal }, miembros: miembros.rows, miRol: miembro.rows[0].rol })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Ranking de clanes
router.get('/ranking', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.nombre as lider_nombre,
        COUNT(cm.usuario_id) as total_miembros,
        COALESCE(SUM(u2.xp), 0) as xp_total
       FROM clanes c
       JOIN usuarios u ON c.lider_id = u.id
       LEFT JOIN clanes_miembros cm ON c.id = cm.clan_id
       LEFT JOIN usuarios u2 ON cm.usuario_id = u2.id
       GROUP BY c.id, u.nombre
       ORDER BY xp_total DESC
       LIMIT 20`
    )
    res.json({ clanes: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Buscar clanes
router.get('/buscar/:nombre', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, u.nombre as lider_nombre, COUNT(cm.usuario_id) as total_miembros
       FROM clanes c
       JOIN usuarios u ON c.lider_id = u.id
       LEFT JOIN clanes_miembros cm ON c.id = cm.clan_id
       WHERE c.nombre ILIKE $1
       GROUP BY c.id, u.nombre
       LIMIT 5`,
      [`%${req.params.nombre}%`]
    )
    res.json({ clanes: result.rows })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router