import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1>Accesorios que sí le quedan a tu celular</h1>
          <p>
            Fundas, cargadores, audífonos y más, organizados según el modelo de tu celular para
            que no compres a ciegas.
          </p>
          <div className="hero-buttons">
            <Link to="/productos" className="btn btn-primary">Ver productos</Link>
            <Link to="/contacto" className="btn btn-outline">Escríbenos</Link>
          </div>
        </div>

        {/* celular hecho con css */}
        <div className="hero-phone">
          <div className="phone">
            <div className="screen">
              <p>Cargando</p>
              <div className="battery">
                <div className="battery-level"></div>
              </div>
            </div>
          </div>
          <div className="cable"></div>
          <div className="charger"></div>
        </div>
      </div>
    </section>
  )
}

export default Hero
