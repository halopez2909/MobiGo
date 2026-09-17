// utils/validators.js

export const validarNombre = (nombre) => {
  if (nombre.trim().length < 3) return "El nombre debe tener mínimo 3 letras.";
  return "";
};

export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Formato de correo válido requerido.";
  return "";
};

export const validarCelular = (celular) => {
  // Debe ser un número colombiano de 10 dígitos que empiece por 3
  const regex = /^3\d{9}$/;
  if (!regex.test(celular)) return "Debe ser un número de 10 dígitos que empiece por 3.";
  return "";
};

export const validarMensaje = (mensaje) => {
  if (mensaje.trim().length < 20) return "El mensaje debe tener mínimo 20 caracteres.";
  return "";
};