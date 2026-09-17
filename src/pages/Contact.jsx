import { useState } from 'react';
import { validarNombre, validarEmail, validarCelular, validarMensaje } from '../utils/validators';

function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    celular: '',
    mensaje: ''
  });
  
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    
    const nuevosErrores = {
      nombre: validarNombre(formData.nombre),
      email: validarEmail(formData.email),
      celular: validarCelular(formData.celular),
      mensaje: validarMensaje(formData.mensaje)
    };

    const erroresFiltrados = Object.fromEntries(
      Object.entries(nuevosErrores).filter((entrada) => entrada[1] !== "")
    );

    if (Object.keys(erroresFiltrados).length > 0) {
      setErrores(erroresFiltrados);
      setExito(false);
    } else {
      setErrores({});
      setExito(true);
      setFormData({ nombre: '', email: '', celular: '', mensaje: '' });
    }
  };

  return (
    <div className="contacto-container">
      <h2>Contáctanos</h2>
      {exito && <p style={{ color: 'green', textAlign: 'center', fontWeight: 'bold' }}>¡Mensaje enviado con éxito!</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Aquí agregamos className="form-group" */}
        <div className="form-group">
          <label>Nombre:</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange}
            style={{ borderColor: errores.nombre ? 'red' : '#ccc' }}
          />
          {errores.nombre && <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>{errores.nombre}</p>}
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            style={{ borderColor: errores.email ? 'red' : '#ccc' }}
          />
          {errores.email && <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>{errores.email}</p>}
        </div>

        <div className="form-group">
          <label>Celular:</label>
          <input 
            type="text" 
            name="celular" 
            value={formData.celular} 
            onChange={handleChange}
            style={{ borderColor: errores.celular ? 'red' : '#ccc' }}
          />
          {errores.celular && <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>{errores.celular}</p>}
        </div>

        <div className="form-group">
          <label>Mensaje:</label>
          <textarea 
            name="mensaje" 
            value={formData.mensaje} 
            onChange={handleChange}
            style={{ borderColor: errores.mensaje ? 'red' : '#ccc', minHeight: '80px' }}
          />
          {errores.mensaje && <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0 0' }}>{errores.mensaje}</p>}
        </div>

        {/* Aquí agregamos className="btn-enviar" */}
        <button type="submit" className="btn-enviar">Enviar Mensaje</button>
      </form>
    </div>
  );
}

export default Contact;