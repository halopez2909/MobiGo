import React from 'react';
import { Link } from 'react-router-dom';

function Cart({ carrito, total, onEliminar, onVaciar }) {
  if (carrito.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <h2>Tu carrito</h2>
        <p>El carrito está vacío. ¡Ve a la sección de productos para agregar accesorios!</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/productos" className="btn btn-primary">
            Ir al Catálogo
          </Link>
        </div>
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
            <button className="btn-eliminar" onClick={() => onEliminar(index)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <h3>Total a pagar: ${total.toLocaleString('es-CO')}</h3>
        
        {/* Botones para vaciar e ir al formulario de pago */}
        <div className="cart-actions" style={{ display: 'flex', gap: '10px', marginTop: '15px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onVaciar}>
            Vaciar Carrito
          </button>
          <Link to="/checkout" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Proceder al Pago
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;