// Utilidad para manejar localStorage de forma segura con try/catch

const CART_KEY = 'mobi_go_cart';

/**
 * Lee el carrito guardado en localStorage.
 * Si no existe o está dañado, devuelve un arreglo vacío.
 */
export const leerCarrito = () => {
  try {
    const cartData = localStorage.getItem(CART_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error al leer el carrito de localStorage:', error);
    return [];
  }
};

/**
 * Guarda el carrito actual en localStorage.
 */
export const guardarCarrito = (cart) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error al guardar el carrito en localStorage:', error);
  }
};

/**
 * Limpia el carrito de localStorage.
 */
export const limpiarCarritoStorage = () => {
  try {
    localStorage.removeItem(CART_KEY);
  } catch (error) {
    console.error('Error al limpiar el carrito de localStorage:', error);
  }
};