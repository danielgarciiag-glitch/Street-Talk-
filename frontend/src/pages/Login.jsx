import { useState } from 'react'

function Login({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    setCargando(true)
    setError('')

    const url = modo === 'login'
      ? 'https://street-talk-backend.onrender.com'
      : 'https://street-talk-backend.onrender.com'

    const body = modo === 'login'
      ? { email: form.email, password: form.password }
      : { nombre: form.nombre, email: form.email, password: form.password }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Algo salió mal')
      } else {
        localStorage.setItem('token', data.token)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        onLogin(data.usuario)
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('No se pudo conectar al servidor')
    }

    setCargando(false)
  }

  return (
    <div className="container">
      <h1 className="logo">🗣️ Street Talk</h1>
      <p className="tagline">
        {modo === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta gratis'}
      </p>

      <div className="login-card">
        <div className="login-tabs">
          <button
            className={modo === 'login' ? 'tab-activo' : 'tab'}
            onClick={() => setModo('login')}
          >
            Iniciar sesión
          </button>
          <button
            className={modo === 'registro' ? 'tab-activo' : 'tab'}
            onClick={() => setModo('registro')}
          >
            Registrarse
          </button>
        </div>

        {modo === 'registro' && (
          <input
            className="input-field"
            type="text"
            name="nombre"
            placeholder="Tu nombre de usuario"
            value={form.nombre}
            onChange={handleChange}
          />
        )}

        <input
          className="input-field"
          type="email"
          name="email"
          placeholder="Tu email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="input-field"
          type="password"
          name="password"
          placeholder="Tu contraseña"
          value={form.password}
          onChange={handleChange}
        />

        {error && <p className="error-msg">{error}</p>}

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={cargando}
        >
          {cargando ? 'Cargando...' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </div>
    </div>
  )
}

export default Login
