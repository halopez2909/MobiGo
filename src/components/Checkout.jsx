import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearPedido } from '../services/api';
import './Checkout.css';

function Checkout({ carrito, total, onVaciar }) {
  const navigate = useNavigate();

  // 1. Estados para los campos del formulario exigidos por el docente
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: '',
    ciudad: '',
    metodoPago: 'efectivo',
    aceptaTerminos: false,
    quiereFactura: false,
    observaciones: ''
  });

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [ordenExitosa, setOrdenExitosa] = useState(null);

  // Manejador genérico para inputs, selects y textareas
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // 2. Manejador del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas requeridas
    if (!formData.nombre || !formData.email || !formData.celular || !formData.ciudad) {
      setError('Por favor completa todos los campos obligatorios del cliente y ciudad.');
      return;
    }

    if (!formData.aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones para continuar.');
      return;
    }

    if (!carrito || carrito.length === 0) {
      setError('Tu carrito está vacío.');
      return;
    }

    try {
      setCargando(true);

      // Generar un número de orden único
      const numeroOrden = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

      // Estructura de los datos del cliente según la tabla pedidos de Supabase
      const datosPedido = {
        numero_orden: numeroOrden,
        cliente_nombre: formData.nombre,
        cliente_email: formData.email,
        cliente_celular: formData.celular,
        ciudad: formData.ciudad,
        metodo_pago: formData.metodoPago,
        total: total
      };

      // Llamada obligatoria a la API de Supabase proporcionada por Andrés
      await crearPedido(datosPedido, carrito);

      // Guardar el número de orden para mostrarlo en pantalla
      setOrdenExitosa(numeroOrden);

      // Vaciar el carrito (estado y localStorage)
      if (typeof onVaciar === 'function') {
        onVaciar();
      }

    } catch (err) {
      console.error("Error al enviar el pedido:", err);
      setError('Hubo un error al procesar tu pedido en la base de datos. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  // Si el pedido fue exitoso, mostramos la confirmación
  if (ordenExitosa) {
    return (
      <div className="container checkout-success">
        <h2>🎉 ¡Pedido Confirmado con Éxito!</h2>
        <p>Tu número de orden es: <strong>{ordenExitosa}</strong></p>
        <p>Hemos guardado tu pedido correctamente en el sistema. Pronto nos pondremos en contacto contigo.</p>
        <button className="btn btn-primary" onClick={() => navigate('/productos')}>
          Volver al Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="container checkout-container">
      <h2>Finalizar Pedido</h2>
      
      {error && <div className="alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="checkout-form">
        {/* Cajas de texto */}
        <div className="form-group">
          <label>Nombre completo *</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            placeholder="Ej. Juan Ardila"
          />
        </div>

        <div className="form-group">
          <label>Correo electrónico *</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div className="form-group">
          <label>Celular / Teléfono *</label>
          <input 
            type="tel" 
            name="celular" 
            value={formData.celular} 
            onChange={handleChange} 
            placeholder="3001234567"
          />
        </div>

        {/* Lista desplegable (Select) para la ciudad */}
        <div className="form-group">
          <label>Ciudad *</label>
          <select name="ciudad" value={formData.ciudad} onChange={handleChange}>
            <option value="">Selecciona una ciudad...</option>
            <option value="Bogotá">Bogotá</option>
            <option value="Medellín">Medellín</option>
            <option value="Cali">Cali</option>
            <option value="Barranquilla">Barranquilla</option>
          </select>
        </div>

        {/* Botones de radio para método de pago */}
        <div className="form-group">
          <label>Método de pago:</label>
          <div className="radio-group">
            <label>
              <input 
                type="radio" 
                name="metodoPago" 
                value="efectivo" 
                checked={formData.metodoPago === 'efectivo'} 
                onChange={handleChange} 
              /> Efectivo / Contra entrega
            </label>
            <label>
              <input 
                type="radio" 
                name="metodoPago" 
                value="transferencia" 
                checked={formData.metodoPago === 'transferencia'} 
                onChange={handleChange} 
              /> Transferencia Bancaria
            </label>
          </div>
        </div>

        {/* Casillas de selección (Checkboxes) - CORREGIDAS */}
        <div className="form-group checkbox-group">
          <label>
            <input 
              type="checkbox" 
              name="aceptaTerminos" 
              checked={formData.aceptaTerminos} 
              onChange={handleChange} 
            /> Acepto los términos y condiciones *
          </label>
          <label>
            <input 
              type="checkbox" 
              name="quiereFactura" 
              checked={formData.quiereFactura} 
              onChange={handleChange} 
            /> Solicitar factura electrónica
          </label>
        </div>

        {/* Área de texto para observaciones */}
        <div className="form-group">
          <label>Observaciones o notas adicionales</label>
          <textarea 
            name="observaciones" 
            value={formData.observaciones} 
            onChange={handleChange} 
            placeholder="Indicaciones de entrega, torre, apartamento..."
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary" disabled={cargando}>
          {cargando ? 'Guardando pedido...' : 'Confirmar Pedido'}
        </button>
      </form>
    </div>
  );
}

export default Checkout;