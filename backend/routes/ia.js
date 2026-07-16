const express = require('express')
const router = express.Router()
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

router.post('/generar-preguntas', verificarToken, async (req, res) => {
  const { palabras, modo } = req.body

  const prompt = modo === 'traduccion'
    ? `Eres un generador de preguntas de slang. Con estas palabras de slang: ${palabras.join(', ')}, genera 5 preguntas de opción múltiple en español donde el usuario debe elegir el slang correcto para una frase en español. Responde SOLO con JSON válido, sin texto extra, sin markdown, sin bloques de código. Formato exacto: {"preguntas":[{"frase":"frase en español","respuesta_correcta":"slang","opciones":["op1","op2","op3","op4"]}]}`
    : modo === 'completar'
    ? `Eres un generador de preguntas de slang. Con estas palabras: ${palabras.join(', ')}, genera 5 frases en inglés con un espacio en blanco para completar con el slang correcto. Responde SOLO con JSON válido, sin texto extra, sin markdown, sin bloques de código. Formato exacto: {"preguntas":[{"frase":"frase con _____","respuesta_correcta":"slang","opciones":["op1","op2","op3","op4"]}]}`
    : `Eres un generador de preguntas de slang. Con estas palabras: ${palabras.join(', ')}, genera 5 definiciones donde el usuario dice si es verdad o mentira. Responde SOLO con JSON válido, sin texto extra, sin markdown, sin bloques de código. Formato exacto: {"preguntas":[{"palabra":"slang","definicion":"definición","respuesta_correcta":"verdad o mentira","explicacion":"explicación corta"}]}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    })

    const data = await response.json()
    const texto = data.content[0].text.trim()
    const parsed = JSON.parse(texto)
    res.json(parsed)
  } catch (err) {
    console.error('Error IA:', err)
    res.status(500).json({ error: 'Error generando preguntas' })
  }
})

module.exports = router