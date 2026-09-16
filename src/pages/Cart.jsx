function Cart({ carrito, total, onEliminar }) {
  if (carrito.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Tu carrito</h2>
        <p>El carrito está vacío. ¡Ve a la sección de productos para agregar accesorios!</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Tu carrito</h2>
      
      <div className="cart-items-wrapper">
        {carrito.map((producto, index) => (
          <div key={`${producto.id}-${index}`} className="cart-item">
            <div className="cart-item-details">
              <span className="cart-item-name">{producto.nombre}</span>
              <span className="cart-item-price">
                ${producto.precio.toLocaleString('es-CO')}
              </span>
            </div>
            <button className="btn-eliminar" onClick={() => onEliminar(producto.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>Total a pagar: ${total.toLocaleString('es-CO')}</h3>
      </div>
    </div>
  );
}

export default Cart;