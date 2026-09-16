import { Link } from 'react-router-dom'

function CategoryCard({ categoria }) {
  return (
    <Link to="/productos" className="category-card">
      <span className="category-icon">{categoria.icono}</span>
      <h3>{categoria.nombre}</h3>
      <p>{categoria.descripcion}</p>
    </Link>
  )
}

export default CategoryCard
