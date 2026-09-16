import { useState } from 'react'
import formatPrice from '../utils/formatPrice'

function ProductCard({ producto, agregarAlCarrito }) {
  const [agregado, setAgregado] = useState(false)

  const handleAgregar = () => {
    agregarAlCarrito(producto)
    setAgregado(true)

    // después de 1.5 segundos el botón vuelve a la normalidad
    setTimeout(() => {
      setAgregado(false)
    }, 1500)
  }

  return (
    <div className="product-card">
      <div className="product-image">{producto.icono}</div>

      <span className="product-category">{producto.categoria}</span>
      <h3>{producto.nombre}</h3>
      <p className="product-compat">Compatible con: {producto.compatibilidad.join(', ')}</p>
      <p className="product-price">{formatPrice(producto.precio)}</p>

      <button className="btn btn-primary" onClick={handleAgregar}>
        {agregado ? 'Agregado ✓' : 'Agregar al carrito'}
      </button>
    </div>
  )
}

export default ProductCard
