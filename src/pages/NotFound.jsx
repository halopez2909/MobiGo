import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <h2>Página no encontrada</h2>
        <p>La página que buscas no existe.</p>
        <br />
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    </section>
  )
}

export default NotFound
