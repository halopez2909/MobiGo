import CategoryCard from './CategoryCard'
import categories from '../data/categories'

function Categories() {
  return (
    <section className="section">
      <div className="container">
        <h2>Categorías</h2>
        <p className="subtitle">Todo lo que tu celular necesita en un solo lugar.</p>

        <div className="categories-grid">
          {categories.map((categoria) => (
            <CategoryCard key={categoria.id} categoria={categoria} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
