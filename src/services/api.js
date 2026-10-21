// Capa de servicios: TODA la comunicacion con la base de datos pasa por aca.
// Ningun componente llama a fetch directamente.

const URL_BASE = import.meta.env.VITE_SUPABASE_URL
const CLAVE = import.meta.env.VITE_SUPABASE_ANON_KEY
const REST = `${URL_BASE}/rest/v1`

// Encabezados que Supabase exige en toda peticion
function encabezados(extra = {}) {
  return {
    apikey: CLAVE,
    Authorization: `Bearer ${CLAVE}`,
    "Content-Type": "application/json",
    ...extra,
  }
}

// Envoltura de fetch: arma la peticion y revisa siempre el resultado
async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(`${REST}${ruta}`, {
    ...opciones,
    headers: encabezados(opciones.headers),
  })

  if (!respuesta.ok) {
    const detalle = await respuesta.text()
    throw new Error(`Error ${respuesta.status}: ${detalle}`)
  }

  const texto = await respuesta.text()
  return texto ? JSON.parse(texto) : null
}

/* ---------- Catalogo ----------
   Se consulta la vista, no la tabla: la vista ya trae la categoria
   como texto y la compatibilidad como arreglo. */

export async function getProductos() {
  return await pedir("/catalogo?select=*&order=id.asc")
}

export async function getProducto(id) {
  const filas = await pedir(`/catalogo?id=eq.${id}&select=*`)
  return filas && filas.length > 0 ? filas[0] : null
}

export async function getCategorias() {
  return await pedir("/categorias?select=*&order=nombre.asc")
}

export async function getModelos() {
  return await pedir("/modelos?select=*&order=nombre.asc")
}

/* ---------- Alta y edicion ---------- */

export async function crearProducto(datos, nombresModelos = []) {
  const creados = await pedir("/productos", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(datos),
  })
  const nuevo = creados[0]

  if (nombresModelos.length > 0) {
    await vincularModelos(nuevo.id, nombresModelos)
  }

  return nuevo
}

export async function actualizarProducto(id, cambios) {
  const filas = await pedir(`/productos?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(cambios),
  })
  return filas[0]
}

// Crea las filas de la tabla intermedia a partir de los nombres de modelo
async function vincularModelos(productoId, nombresModelos) {
  const modelos = await getModelos()
  const filas = modelos
    .filter((m) => nombresModelos.includes(m.nombre))
    .map((m) => ({ producto_id: productoId, modelo_id: m.id }))

  if (filas.length === 0) return

  await pedir("/producto_modelo", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify(filas),
  })
}

/* ---------- Borrado trazable ----------
   No se elimina y ya: primero se archiva en la tabla alternativa.
   Son tres pasos en orden y si uno falla no se sigue con el siguiente. */

export async function eliminarProducto(id, motivo, usuario = "admin") {
  // Paso 1: leer el producto completo desde la vista
  const producto = await getProducto(id)
  if (!producto) {
    throw new Error("El producto ya no existe en el catalogo")
  }

  // Paso 2: archivar la copia con fecha, responsable y motivo
  await pedir("/productos_eliminados", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      producto_id: producto.id,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: producto.precio,
      imagen_url: producto.imagen_url,
      compatibilidad: producto.compatibilidad,
      stock: producto.stock,
      eliminado_por: usuario,
      motivo: motivo,
    }),
  })

  // Paso 3: solo ahora se retira de la tabla principal
  await pedir(`/productos?id=eq.${id}`, { method: "DELETE" })

  return producto
}

export async function getEliminados() {
  return await pedir("/productos_eliminados?select=*&order=eliminado_en.desc")
}

// Camino inverso: vuelve al catalogo y sale de la papelera
export async function restaurarProducto(idPapelera) {
  const filas = await pedir(`/productos_eliminados?id=eq.${idPapelera}&select=*`)
  if (!filas || filas.length === 0) {
    throw new Error("El registro no esta en la papelera")
  }
  const archivado = filas[0]

  // Buscar el id de la categoria por su nombre
  const categorias = await getCategorias()
  const categoria = categorias.find((c) => c.nombre === archivado.categoria)
  if (!categoria) {
    throw new Error(`La categoria "${archivado.categoria}" ya no existe`)
  }

  // Volver a insertar el producto
  const creados = await pedir("/productos", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      nombre: archivado.nombre,
      categoria_id: categoria.id,
      precio: archivado.precio,
      imagen_url: archivado.imagen_url,
      stock: archivado.stock || 0,
    }),
  })
  const restaurado = creados[0]

  // Reconstruir la compatibilidad en la tabla intermedia
  await vincularModelos(restaurado.id, archivado.compatibilidad || [])

  // Sacarlo de la papelera
  await pedir(`/productos_eliminados?id=eq.${idPapelera}`, { method: "DELETE" })

  return restaurado
}

/* ---------- Pedidos ---------- */

export async function crearPedido(datosPedido, items) {
  const creados = await pedir("/pedidos", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(datosPedido),
  })
  const pedido = creados[0]

  if (items && items.length > 0) {
    const filas = items.map((item) => ({
      pedido_id: pedido.id,
      producto_id: item.id,
      nombre_producto: item.nombre,
      precio_unitario: item.precio,
      cantidad: item.cantidad || 1,
    }))

    await pedir("/pedido_items", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(filas),
    })
  }

  return pedido
}
