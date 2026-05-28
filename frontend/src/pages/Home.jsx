function Home() {
  return (
    <div className="container">
      <div className="logo-section">
        <h1 className="logo">🗣️ Street Talk</h1>
        <p className="tagline">Aprende idiomas como la gente real los habla</p>
      </div>
      <div className="buttons">
        <button className="btn-primary">Empezar gratis</button>
        <button className="btn-secondary">Iniciar sesión</button>
      </div>
      <div className="langs">
        <p>Idiomas disponibles próximamente</p>
        <div className="flags">
          <div className="flag-item">
            <img src="https://flagcdn.com/w40/us.png" alt="USA" />
            <span>Inglés</span>
          </div>
          <div className="flag-item">
            <img src="https://flagcdn.com/w40/br.png" alt="Brasil" />
            <span>Portugués</span>
          </div>
          <div className="flag-item">
            <img src="https://flagcdn.com/w40/fr.png" alt="Francia" />
            <span>Francés</span>
          </div>
          <div className="flag-item">
            <img src="https://flagcdn.com/w40/jp.png" alt="Japón" />
            <span>Japonés</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home