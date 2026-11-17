import { useState, useEffect } from "react"
import {
  getProductos,
  getCategorias,
  getModelos,
  crearProducto,
  actualizarProducto,
  reemplazarModelos,
  eliminarProducto,
  getEliminados,
  restaurarProducto,
  generarCodigos,
  getUnidades,
} from "../services/api"
import formatPrice from "../utils/formatPrice"
import "./Admin.css"

const FORM_VACIO = {
  nombre: "",
  categoria_id: "",
  precio: "",
  imagen_url: "",
  stock: "",
  ancho_mm: "",
  alto_mm: "",
  vatios: "",
  modelos: [],
}

function Admin() {
  const [pestana, setPestana] = useState("productos")

  const [productos, setProductos] = useState([])
  const [papelera, setPapelera] = useState([])
  const [categorias, setCategorias] = useState([])
  const [modelos, setModelos] = useState([])
  const [unidades, setUnidades] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [aviso, setAviso] = useState("")

  // Producto que se va a eliminar y el motivo que escribe el administrador
  const [porEliminar, setPorEliminar] = useState(null)
  const [motivo, setMotivo] = useState("")

  // El mismo formulario sirve para crear y para editar.
  // Si editando tiene un id, estamos editando ese producto.
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [nuevo, setNuevo] = useState(FORM_VACIO)

  // Generacion de codigos de autenticidad
  const [loteProducto, setLoteProducto] = useState("")
  const [loteCantidad, setLoteCantidad] = useState("5")
  const [codigosNuevos, setCodigosNuevos] = useState([])

  // Carga inicial de todo lo que necesita el panel
  useEffect(() => {
    cargarTodo()
  }, [])

  async function cargarTodo() {
    try {
      setCargando(true)
      setError("")
      const [lista, basura, cats, mods, unis] = await Promise.all([
        getProductos(),
        getEliminados(),
        getCategorias(),
        getModelos(),
        getUnidades(),
      ])
      setProductos(lista)
      setPapelera(basura)
      setCategorias(cats)
      setModelos(mods)
      setUnidades(unis)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }

  function avisar(texto) {
    setAviso(texto)
    setTimeout(() => setAviso(""), 4000)
  }

  async function confirmarEliminacion() {
    if (motivo.trim().length < 5) {
      setError("El motivo debe tener al menos 5 caracteres")
      return
    }
    try {
      setError("")
      await eliminarProducto(porEliminar.id, motivo.trim())
      setPorEliminar(null)
      setMotivo("")
      avisar("Producto archivado en la papelera. No se perdió ningún dato.")
      await cargarTodo()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleRestaurar(id) {
    try {
      setError("")
      await restaurarProducto(id)
      avisar("Producto restaurado al catálogo.")
      await cargarTodo()
    } catch (e) {
      setError(e.message)
    }
  }

  function handleCampo(e) {
    const { name, value } = e.target
    setNuevo({ ...nuevo, [name]: value })
  }

  function alternarModelo(nombreModelo) {
    const yaEsta = nuevo.modelos.includes(nombreModelo)
    setNuevo({
      ...nuevo,
      modelos: yaEsta
        ? nuevo.modelos.filter((m) => m !== nombreModelo)
        : [...nuevo.modelos, nombreModelo],
    })
  }

  // Llena el formulario con los datos del producto que se va a editar
  function abrirEditar(p) {
    const cat = categorias.find((c) => c.nombre === p.categoria)
    setEditando(p.id)
    setNuevo({
      nombre: p.nombre,
      categoria_id: cat ? String(cat.id) : "",
      precio: String(p.precio),
      imagen_url: p.imagen_url || "",
      stock: String(p.stock),
      ancho_mm: p.ancho_mm ? String(p.ancho_mm) : "",
      alto_mm: p.alto_mm ? String(p.alto_mm) : "",
      vatios: p.vatios ? String(p.vatios) : "",
      modelos: p.compatibilidad || [],
    })
    setMostrarForm(true)
    setError("")
    window.scrollTo(0, 0)
  }

  function cerrarForm() {
    setNuevo(FORM_VACIO)
    setEditando(null)
    setMostrarForm(false)
  }

  async function handleGuardar(e) {
    e.preventDefault()
    if (!nuevo.nombre.trim() || !nuevo.categoria_id || !nuevo.precio) {
      setError("Nombre, categoría y precio son obligatorios")
      return
    }

    const datos = {
      nombre: nuevo.nombre.trim(),
      categoria_id: Number(nuevo.categoria_id),
      precio: Number(nuevo.precio),
      imagen_url: nuevo.imagen_url.trim() || null,
      stock: Number(nuevo.stock) || 0,
      ancho_mm: nuevo.ancho_mm ? Number(nuevo.ancho_mm) : null,
      alto_mm: nuevo.alto_mm ? Number(nuevo.alto_mm) : null,
      vatios: nuevo.vatios ? Number(nuevo.vatios) : null,
    }

    try {
      setError("")
      if (editando) {
        await actualizarProducto(editando, datos)
        await reemplazarModelos(editando, nuevo.modelos)
        avisar("Producto actualizado.")
      } else {
        await crearProducto(datos, nuevo.modelos)
        avisar("Producto creado.")
      }
      cerrarForm()
      await cargarTodo()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleGenerar(e) {
    e.preventDefault()
    if (!loteProducto) {
      setError("Elige un producto")
      return
    }
    const cantidad = Number(loteCantidad)
    if (!cantidad || cantidad < 1 || cantidad > 50) {
      setError("La cantidad debe estar entre 1 y 50")
      return
    }
    const producto = productos.find((p) => p.id === Number(loteProducto))
    try {
      setError("")
      const creados = await generarCodigos(producto, cantidad)
      setCodigosNuevos(creados)
      avisar("Se generaron " + cantidad + " códigos.")
      await cargarTodo()
    } catch (e) {
      setError(e.message)
    }
  }

  function fecha(valor) {
    if (!valor) return "-"
    return new Date(valor).toLocaleString("es-CO")
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Panel de administración</h2>
        <p className="subtitle">
          Las eliminaciones no destruyen información: el registro se archiva en una tabla
          de auditoría con fecha y motivo, y se puede restaurar.
        </p>

        <div className="admin-tabs">
          <button
            className={pestana === "productos" ? "tab activa" : "tab"}
            onClick={() => setPestana("productos")}
          >
            Productos ({productos.length})
          </button>
          <button
            className={pestana === "papelera" ? "tab activa" : "tab"}
            onClick={() => setPestana("papelera")}
          >
            Papelera ({papelera.length})
          </button>
          <button
            className={pestana === "codigos" ? "tab activa" : "tab"}
            onClick={() => setPestana("codigos")}
          >
            Códigos ({unidades.length})
          </button>
        </div>

        {aviso && <p className="admin-aviso">{aviso}</p>}
        {error && <p className="admin-error">{error}</p>}

        {cargando ? (
          <p className="admin-cargando">Cargando datos...</p>
        ) : pestana === "productos" ? (
          <>
            <button
              className="btn btn-outline btn-nuevo"
              onClick={() => (mostrarForm ? cerrarForm() : setMostrarForm(true))}
            >
              {mostrarForm ? "Cancelar" : "Agregar producto"}
            </button>

            {mostrarForm && (
              <form className="admin-form" onSubmit={handleGuardar}>
                <p className="admin-form-titulo">
                  {editando ? "Editando: " + nuevo.nombre : "Nuevo producto"}
                </p>

                <div className="admin-form-fila">
                  <label>
                    Nombre
                    <input name="nombre" value={nuevo.nombre} onChange={handleCampo} />
                  </label>
                  <label>
                    Categoría
                    <select name="categoria_id" value={nuevo.categoria_id} onChange={handleCampo}>
                      <option value="">Elige una</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="admin-form-fila">
                  <label>
                    Precio
                    <input name="precio" type="number" value={nuevo.precio} onChange={handleCampo} />
                  </label>
                  <label>
                    Stock
                    <input name="stock" type="number" value={nuevo.stock} onChange={handleCampo} />
                  </label>
                </div>

                <div className="admin-form-fila">
                  <label>
                    Ancho (mm)
                    <input name="ancho_mm" type="number" value={nuevo.ancho_mm} onChange={handleCampo} />
                  </label>
                  <label>
                    Alto (mm)
                    <input name="alto_mm" type="number" value={nuevo.alto_mm} onChange={handleCampo} />
                  </label>
                  <label>
                    Vatios
                    <input name="vatios" type="number" value={nuevo.vatios} onChange={handleCampo} />
                  </label>
                </div>

                <label>
                  Imagen (URL)
                  <input name="imagen_url" value={nuevo.imagen_url} onChange={handleCampo} />
                </label>

                <fieldset className="admin-modelos">
                  <legend>Compatible con</legend>
                  {modelos.map((m) => (
                    <label key={m.id} className="check">
                      <input
                        type="checkbox"
                        checked={nuevo.modelos.includes(m.nombre)}
                        onChange={() => alternarModelo(m.nombre)}
                      />
                      {m.nombre}
                    </label>
                  ))}
                </fieldset>

                <button type="submit" className="btn btn-primary">
                  {editando ? "Guardar cambios" : "Guardar producto"}
                </button>
              </form>
            )}

            <div className="tabla-scroll">
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Medidas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td>{formatPrice(p.precio)}</td>
                      <td>{p.stock}</td>
                      <td>
                        {p.ancho_mm ? p.ancho_mm + " x " + p.alto_mm + " mm" : "-"}
                        {p.vatios ? " / " + p.vatios + "W" : ""}
                      </td>
                      <td className="acciones">
                        <button className="btn-editar" onClick={() => abrirEditar(p)}>
                          Editar
                        </button>
                        <button
                          className="btn-eliminar"
                          onClick={() => {
                            setPorEliminar(p)
                            setMotivo("")
                            setError("")
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : pestana === "papelera" ? (
          <div className="tabla-scroll">
            {papelera.length === 0 ? (
              <p className="admin-vacio">La papelera está vacía.</p>
            ) : (
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Eliminado</th>
                    <th>Por</th>
                    <th>Motivo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {papelera.map((r) => (
                    <tr key={r.id}>
                      <td>{r.nombre}</td>
                      <td>{r.categoria}</td>
                      <td>{fecha(r.eliminado_en)}</td>
                      <td>{r.eliminado_por}</td>
                      <td className="motivo">{r.motivo}</td>
                      <td>
                        <button className="btn-restaurar" onClick={() => handleRestaurar(r.id)}>
                          Restaurar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          <>
            <p className="subtitle">
              Cada unidad vendida lleva un código único que el cliente puede verificar en
              la página. Así sabe que su accesorio es original y no una copia.
            </p>

            <form className="admin-form" onSubmit={handleGenerar}>
              <div className="admin-form-fila">
                <label>
                  Producto
                  <select value={loteProducto} onChange={(e) => setLoteProducto(e.target.value)}>
                    <option value="">Elige uno</option>
                    {productos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Cuántas unidades
                  <input
                    type="number"
                    value={loteCantidad}
                    onChange={(e) => setLoteCantidad(e.target.value)}
                  />
                </label>
              </div>
              <button type="submit" className="btn btn-primary">
                Generar códigos
              </button>
            </form>

            {codigosNuevos.length > 0 && (
              <div className="lote-nuevo">
                <p>Códigos recién generados, listos para imprimir y pegar:</p>
                <div className="lote-lista">
                  {codigosNuevos.map((u) => (
                    <span key={u.id} className="codigo-chip">
                      {u.codigo}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="tabla-scroll">
              {unidades.length === 0 ? (
                <p className="admin-vacio">Todavía no hay códigos generados.</p>
              ) : (
                <table className="admin-tabla">
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Producto</th>
                      <th>Estado</th>
                      <th>Generado</th>
                      <th>Verificado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unidades.map((u) => (
                      <tr key={u.id}>
                        <td className="codigo">{u.codigo}</td>
                        <td>{u.nombre_producto}</td>
                        <td>
                          <span className={"estado estado-" + u.estado}>{u.estado}</span>
                        </td>
                        <td>{fecha(u.creado_en)}</td>
                        <td>{fecha(u.verificado_en)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {porEliminar && (
          <div className="modal-fondo">
            <div className="modal">
              <h3>Eliminar "{porEliminar.nombre}"</h3>
              <p>
                El producto sale del catálogo pero queda archivado en la papelera con la
                fecha y el motivo. La operación se puede revertir.
              </p>
              <label>
                Motivo de la eliminación
                <textarea
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej: producto descontinuado por el proveedor"
                />
              </label>
              <div className="modal-acciones">
                <button className="btn btn-outline" onClick={() => setPorEliminar(null)}>
                  Cancelar
                </button>
                <button className="btn-eliminar" onClick={confirmarEliminacion}>
                  Archivar y eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Admin