import { useState, useEffect } from "react"
import {
  getProductos,
  getCategorias,
  getModelos,
  crearProducto,
  eliminarProducto,
  getEliminados,
  restaurarProducto,
} from "../services/api"
import formatPrice from "../utils/formatPrice"
import "./Admin.css"

function Admin() {
  const [pestana, setPestana] = useState("productos")

  const [productos, setProductos] = useState([])
  const [papelera, setPapelera] = useState([])
  const [categorias, setCategorias] = useState([])
  const [modelos, setModelos] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")
  const [aviso, setAviso] = useState("")

  // Producto que se va a eliminar y el motivo que escribe el administrador
  const [porEliminar, setPorEliminar] = useState(null)
  const [motivo, setMotivo] = useState("")

  const [mostrarForm, setMostrarForm] = useState(false)
  const [nuevo, setNuevo] = useState({
    nombre: "",
    categoria_id: "",
    precio: "",
    imagen_url: "",
    stock: "",
    modelos: [],
  })

  // Carga inicial de todo lo que necesita el panel
  useEffect(() => {
    cargarTodo()
  }, [])

  async function cargarTodo() {
    try {
      setCargando(true)
      setError("")
      const [listaProductos, listaPapelera, listaCategorias, listaModelos] =
        await Promise.all([
          getProductos(),
          getEliminados(),
          getCategorias(),
          getModelos(),
        ])
      setProductos(listaProductos)
      setPapelera(listaPapelera)
      setCategorias(listaCategorias)
      setModelos(listaModelos)
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
      avisar("Producto archivado en la papelera. No se perdio ningun dato.")
      await cargarTodo()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleRestaurar(id) {
    try {
      setError("")
      await restaurarProducto(id)
      avisar("Producto restaurado al catalogo.")
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

  async function handleCrear(e) {
    e.preventDefault()
    if (!nuevo.nombre.trim() || !nuevo.categoria_id || !nuevo.precio) {
      setError("Nombre, categoria y precio son obligatorios")
      return
    }
    try {
      setError("")
      await crearProducto(
        {
          nombre: nuevo.nombre.trim(),
          categoria_id: Number(nuevo.categoria_id),
          precio: Number(nuevo.precio),
          imagen_url: nuevo.imagen_url.trim() || null,
          stock: Number(nuevo.stock) || 0,
        },
        nuevo.modelos,
      )
      setNuevo({ nombre: "", categoria_id: "", precio: "", imagen_url: "", stock: "", modelos: [] })
      setMostrarForm(false)
      avisar("Producto creado.")
      await cargarTodo()
    } catch (e) {
      setError(e.message)
    }
  }

  function fecha(valor) {
    return new Date(valor).toLocaleString("es-CO")
  }

  return (
    <section className="section">
      <div className="container">
        <h2>Panel de administracion</h2>
        <p className="subtitle">
          Las eliminaciones no destruyen informacion: el registro se archiva en una tabla
          de auditoria con fecha y motivo, y se puede restaurar.
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
        </div>

        {aviso && <p className="admin-aviso">{aviso}</p>}
        {error && <p className="admin-error">{error}</p>}

        {cargando ? (
          <p className="admin-cargando">Cargando datos...</p>
        ) : pestana === "productos" ? (
          <>
            <button
              className="btn btn-outline btn-nuevo"
              onClick={() => setMostrarForm(!mostrarForm)}
            >
              {mostrarForm ? "Cancelar" : "Agregar producto"}
            </button>

            {mostrarForm && (
              <form className="admin-form" onSubmit={handleCrear}>
                <div className="admin-form-fila">
                  <label>
                    Nombre
                    <input name="nombre" value={nuevo.nombre} onChange={handleCampo} />
                  </label>
                  <label>
                    Categoria
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
                  Guardar producto
                </button>
              </form>
            )}

            <div className="tabla-scroll">
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoria</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Accion</th>
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
        ) : (
          <div className="tabla-scroll">
            {papelera.length === 0 ? (
              <p className="admin-vacio">La papelera esta vacia.</p>
            ) : (
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoria</th>
                    <th>Eliminado</th>
                    <th>Por</th>
                    <th>Motivo</th>
                    <th>Accion</th>
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
        )}

        {porEliminar && (
          <div className="modal-fondo">
            <div className="modal">
              <h3>Eliminar "{porEliminar.nombre}"</h3>
              <p>
                El producto sale del catalogo pero queda archivado en la papelera con la
                fecha y el motivo. La operacion se puede revertir.
              </p>
              <label>
                Motivo de la eliminacion
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
