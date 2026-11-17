import { useState, useEffect } from "react"
import { getProductos } from "../services/api"
import "./Medidor.css"

// Toda cédula y toda tarjeta bancaria del mundo mide lo mismo de ancho.
// Es el estándar internacional ISO 7810. Esa es nuestra regla.
const ANCHO_TARJETA_MM = 85.6
const CLAVE = "mobigo_px_por_mm"

function leerCalibracion() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? Number(guardado) : 0
  } catch (error) {
    console.error("No se pudo leer la calibracion:", error)
    return 0
  }
}

function Medidor() {
  const [pxPorMm, setPxPorMm] = useState(() => leerCalibracion())
  const [calibrando, setCalibrando] = useState(() => leerCalibracion() === 0)
  const [anchoRegla, setAnchoRegla] = useState(320)

  const [productos, setProductos] = useState([])
  const [productoId, setProductoId] = useState("")
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function cargarDatos() {
      try {
        const lista = await getProductos()
        setProductos(lista.filter((p) => p.ancho_mm && p.alto_mm))
      } catch (e) {
        setError(e.message)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  function guardarCalibracion() {
    const valor = anchoRegla / ANCHO_TARJETA_MM
    setPxPorMm(valor)
    setCalibrando(false)
    try {
      localStorage.setItem(CLAVE, String(valor))
    } catch (e) {
      console.error("No se pudo guardar la calibracion:", e)
    }
  }

  const producto = productos.find((p) => String(p.id) === productoId)
  const anchoPx = producto ? producto.ancho_mm * pxPorMm : 0
  const altoPx = producto ? producto.alto_mm * pxPorMm : 0
  const cabe = anchoPx > 0 && anchoPx <= 820 && altoPx <= 900

  function enCm(mm) {
    return (mm / 10).toFixed(1).replace(".", ",") + " cm"
  }

  return (
    <section className="section">
      <div className="container medidor">
        <h2>Ve el producto a su tamaño real</h2>
        <p className="subtitle">
          Calibra tu pantalla una vez con cualquier tarjeta y después puedes ver
          cualquier accesorio del tamaño exacto que tiene de verdad.
        </p>

        {error && <p className="admin-error">{error}</p>}

        {calibrando ? (
          <div className="calibrar">
            <p className="calibrar-paso">
              Pon una tarjeta sobre la pantalla (cédula, débito, la del transporte) y
              mueve la barra hasta que el rectángulo quede exactamente del mismo tamaño.
            </p>

            <div className="tarjeta-modelo" style={{ width: anchoRegla + "px" }}>
              <span>Tu tarjeta va aquí</span>
            </div>

            <input
              className="calibrar-barra"
              type="range"
              min="150"
              max="700"
              value={anchoRegla}
              onChange={(e) => setAnchoRegla(Number(e.target.value))}
            />

            <button className="btn btn-primary" onClick={guardarCalibracion}>
              Listo, así queda
            </button>

            <p className="calibrar-nota">
              Funciona porque toda cédula y toda tarjeta bancaria miden 85,6 mm de ancho.
              Es un estándar internacional, el ISO 7810.
            </p>
          </div>
        ) : cargando ? (
          <p className="admin-cargando">Cargando productos...</p>
        ) : (
          <>
            <div className="medidor-barra">
              <label>
                Producto
                <select value={productoId} onChange={(e) => setProductoId(e.target.value)}>
                  <option value="">Elige uno</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <button className="btn btn-outline" onClick={() => setCalibrando(true)}>
                Calibrar otra vez
              </button>
            </div>

            {!producto ? (
              <p className="medidor-vacio">Elige un producto para verlo a tamaño real.</p>
            ) : (
              <div className="medidor-resultado">
                <p className="medidor-medida">
                  {producto.nombre} mide {enCm(producto.ancho_mm)} por{" "}
                  {enCm(producto.alto_mm)}
                </p>

                {cabe ? (
                  <>
                    <div
                      className="pieza"
                      style={{ width: anchoPx + "px", height: altoPx + "px" }}
                    />
                    <p className="medidor-nota">
                      Ese rectángulo mide en tu pantalla exactamente lo que mide el
                      producto de verdad. Pon tu celular encima para comprobarlo.
                    </p>
                  </>
                ) : (
                  <p className="medidor-grande">
                    Este producto no cabe en tu pantalla a tamaño real, porque mide{" "}
                    {enCm(producto.ancho_mm)} de largo. Para que te hagas una idea, son{" "}
                    {Math.round(producto.ancho_mm / 85.6)} tarjetas puestas en fila.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Medidor