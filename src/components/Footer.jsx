import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div>
          <h3>MobiGo</h3>
          <p>Accesorios que sí le quedan a tu celular.</p>
        </div>

        <div>
          <h4>Enlaces</h4>
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/carrito">Carrito</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div>
          <h4>Contacto</h4>
          <p>Bogotá, Colombia</p>
          <p>hola@mobigo.co</p>
          <p>+57 300 123 4567</p>
        </div>
      </div>

      <p className="copy">© {year} MobiGo - Proyecto Uniminuto</p>
    </footer>
  )
}

export default Footer
