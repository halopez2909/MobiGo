import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import products from '../data/products'
import models from '../data/models'
import './Products.css'

function Products({ agregarAlCarrito }) {
  const [busqueda, setBusqueda] = useState('')
  const [modelo, setModelo] = useState('')

  const productosFiltrados = products.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideModelo = modelo === '' || producto.compatibilidad.includes(modelo)

    return coincideNombre && coincideModelo
  })

  const limpiarFiltros = () => {
    setBusqueda('')
    setModelo('')
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Productos</h2>
        <p className="subtitle">Busca un accesorio o elige tu celular para ver solo lo compatible.</p>

        <div className="filters">
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select value={modelo} onChange={(e) => setModelo(e.target.value)}>
            <option value="">¿Qué celular tienes?</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <button className="btn btn-outline" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </div>

        <p className="results">
          Mostrando {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
        </p>

        {productosFiltrados.length === 0 ? (
          <p className="no-results">No encontramos productos con esos filtros.</p>
        ) : (
          <div className="products-grid">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                agregarAlCarrito={agregarAlCarrito}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Products
