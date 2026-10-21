import { useState } from "react"
import ProductImage from "./ProductImage"
import formatPrice from "../utils/formatPrice"

function ProductCard({ producto, agregarAlCarrito }) {
  const [agregado, setAgregado] = useState(false)

  const handleAgregar = () => {
    agregarAlCarrito(producto)
    setAgregado(true)

    // despues de 1.5 segundos el boton vuelve a la normalidad
    setTimeout(() => {
      setAgregado(false)
    }, 1500)
  }

  return (
    <div 
      className="product-card"
      draggable
      onDragStart={(e) => e.dataTransfer.setData('application/json', JSON.stringify(producto))}
    >
      <ProductImage src={producto.imagen_url} alt={producto.nombre} />

      <span className="product-category">{producto.categoria}</span>
      <h3>{producto.nombre}</h3>
      <p className="product-compat">
        Compatible con: {producto.compatibilidad.join(", ")}
      </p>
      <p className="product-price">{formatPrice(producto.precio)}</p>

      <button className="btn btn-primary" onClick={handleAgregar}>
        {agregado ? "Agregado" : "Agregar al carrito"}
      </button>
    </div>
  )
}

export default ProductCard