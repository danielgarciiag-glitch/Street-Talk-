// backend/routes/desafios.js

const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const jwt = require('jsonwebtoken')

function verificarToken(req, res, next) {
  try {
    const token = req.headers.authorization

    if (!token) {
      return res.status(401).json({
        error: 'Token requerido'
      })
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.usuarioId = decoded.id

    next()
  } catch (err) {
    console.log(err)

    return res.status(401).json({
      error: 'Token inválido'
    })
  }
}

// BUSCAR USUARIO
router.get(
  '/buscar/:nombre',
  verificarToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT 
          id,
          nombre,
          nivel,
          rango,
          xp
        FROM usuarios
        WHERE nombre ILIKE $1
        AND id != $2
        LIMIT 5
        `,
        [
          `%${req.params.nombre}%`,
          req.usuarioId
        ]
      )

      res.json({
        usuarios: result.rows
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        error: err.message
      })
    }
  }
)

// ENVIAR DESAFÍO
router.post(
  '/enviar',
  verificarToken,
  async (req, res) => {
    try {
      const { retado_id, idioma } = req.body

      const existente = await pool.query(
        `
        SELECT *
        FROM desafios
        WHERE retador_id = $1
        AND retado_id = $2
        AND estado = 'pendiente'
        `,
        [req.usuarioId, retado_id]
      )

      if (existente.rows.length > 0) {
        return res.status(400).json({
          error:
            'Ya existe un desafío pendiente'
        })
      }

      const result = await pool.query(
        `
        INSERT INTO desafios
        (
          retador_id,
          retado_id,
          idioma
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [
          req.usuarioId,
          retado_id,
          idioma || 'Inglés'
        ]
      )

      res.json({
        desafio: result.rows[0]
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        error: err.message
      })
    }
  }
)

// PENDIENTES
router.get(
  '/pendientes',
  verificarToken,
  async (req, res) => {
    try {
      const result = await pool.query(
        `
        SELECT
          d.*,

          u1.nombre AS retador_nombre,
          u1.rango AS retador_rango,

          u2.nombre AS retado_nombre,
          u2.rango AS retado_rango

        FROM desafios d

        JOIN usuarios u1
        ON d.retador_id = u1.id

        JOIN usuarios u2
        ON d.retado_id = u2.id

        WHERE
        (
          d.retador_id = $1
          OR
          d.retado_id = $1
        )

        AND d.estado = 'pendiente'

        ORDER BY d.creado_en DESC
        `,
        [req.usuarioId]
      )

      res.json({
        desafios: result.rows
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        error: err.message
      })
    }
  }
)

// COMPLETAR
router.post(
  '/completar/:id',
  verificarToken,
  async (req, res) => {
    try {
      const { puntaje } = req.body

      const desafio = await pool.query(
        `
        SELECT *
        FROM desafios
        WHERE id = $1
        `,
        [req.params.id]
      )

      if (desafio.rows.length === 0) {
        return res.status(404).json({
          error: 'Desafío no encontrado'
        })
      }

      const d = desafio.rows[0]

      let result

      if (d.retador_id === req.usuarioId) {
        result = await pool.query(
          `
          UPDATE desafios
          SET
            retador_puntaje = $1,
            estado = 'completado'
          WHERE id = $2
          RETURNING *
          `,
          [puntaje, req.params.id]
        )
      } else {
        result = await pool.query(
          `
          UPDATE desafios
          SET
            retado_puntaje = $1,
            estado = 'completado'
          WHERE id = $2
          RETURNING *
          `,
          [puntaje, req.params.id]
        )
      }

      res.json({
        desafio: result.rows[0]
      })
    } catch (err) {
      console.log(err)

      res.status(500).json({
        error: err.message
      })
    }
  }
)

module.exports = router