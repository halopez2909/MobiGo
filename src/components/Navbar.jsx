import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const links = [
  { id: 1, ruta: '/', texto: 'Inicio' },
  { id: 2, ruta: '/productos', texto: 'Productos' },
  { id: 3, ruta: '/contacto', texto: 'Contacto' },
]

function Navbar({ cantidadCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  const cerrarMenu = () => {
    setMenuAbierto(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo" onClick={cerrarMenu}>
          MobiGo
        </Link>

        <button className="menu-btn" onClick={toggleMenu}>
          {menuAbierto ? '✕' : '☰'}
        </button>

        <nav className={menuAbierto ? 'nav-links open' : 'nav-links'}>
          {links.map((link) => (
            <NavLink key={link.id} to={link.ruta} onClick={cerrarMenu}>
              {link.texto}
            </NavLink>
          ))}

          <NavLink to="/carrito" className="cart-link" onClick={cerrarMenu}>
            Carrito <span className="cart-count">{cantidadCarrito}</span>
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
