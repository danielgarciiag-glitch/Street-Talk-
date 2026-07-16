function Home() {
  return (
    <div className="container">
      <div className="logo-section">
        <h1 className="logo">🗣️ Street Talk</h1>
        <p className="tagline">Aprende idiomas como la gente real los habla</p>
      </div>

      <div className="langs">
        <p>Idiomas disponibles</p>
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

      <div className="home-stats">
        <div className="home-stat">
          <span className="home-stat-num">12+</span>
          <span className="home-stat-label">Expresiones</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-num">3</span>
          <span className="home-stat-label">Modos Arena</span>
        </div>
        <div className="home-stat">
          <span className="home-stat-num">4</span>
          <span className="home-stat-label">Idiomas</span>
        </div>
      </div>
    </div>
  )
}

export default Home
