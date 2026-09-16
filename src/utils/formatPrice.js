// convierte 45000 en $45.000
function formatPrice(precio) {
  return '$' + precio.toLocaleString('es-CO')
}

export default formatPrice
