import React, { useState } from 'react';
import './CartDropZone.css';

export const CartDropZone = ({ agregarAlCarrito }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const productData = e.dataTransfer.getData('application/json');
      if (productData) {
        const producto = JSON.parse(productData);
        agregarAlCarrito(producto);
      }
    } catch (error) {
      console.error("Error al procesar el producto soltado:", error);
    }
  };

  return (
    <div
      className={`cart-drop-zone ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className="cart-drop-icon">🛒</span>
      <span className="cart-drop-text">
        {isDragOver ? '¡Suelta aquí!' : 'Arrastra aquí'}
      </span>
    </div>
  );
};