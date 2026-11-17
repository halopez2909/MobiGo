import { useState, useEffect } from "react"
import { getModelos, getProductos } from "../services/api"
import formatPrice from "../utils/formatPrice"
import "./Carga.css"

function Carga({ agregarAlCarrito }) {
  const [modelos, setModelos] = useState([])
  const [cargadores, setCargadores] = useState([])
  const [modeloId, setModeloId] = useState("")
  const [vatiosActual, setVatiosActual] = useState("10")
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // La funcion se define dentro del efecto porque solo se usa aca
  useEffect(() => {
    async function cargarDatos() {
      try {
        const [mods, prods] = await Promise.all([getModelos(), getProductos()])
        setModelos(mods.filter((m) => m.bateria_mah))
        setCargadores(prods.filter((p) => p.vatios))
      } catch (e) {
        setError(e.message)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  const modelo = modelos.find((m) => String(m.id) === modeloId)

  // Formula: la energía de la batería dividida por la potencia del cargador.
  // 3.85 V es el voltaje de una batería de litio.
  // 0.8 es la eficiencia, porque parte de la energía se pierde en calor.
  function minutos(mah, vatios) {
    const horas = ((mah / 1000) * 3.85) / (vatios * 0.8)
    return Math.round(horas * 60)
  }

  function enTexto(total) {
    const h = Math.floor(total / 60)
    const min = total % 60
    if (h === 0) return min + " min"
    return h + " h " + min + " min"
  }

  const actual = modelo ? minutos(modelo.bateria_mah, Number(vatiosActual) || 1) : 0

  return (
    <section className="section">
      <div className="container carga">
        <h2>¿Cuánto se demora en cargar tu celular?</h2>
        <p className="subtitle">
          Un cargador de 25W no es un número, son minutos de tu vida. Mira la diferencia
          antes de comprar.
        </p>

        {error && <p className="admin-error">{error}</p>}

        {cargando ? (
          <p className="admin-cargando">Cargando datos...</p>
        ) : (
          <>
            <div className="carga-form">
              <label>
                Tu celular
                <select value={modeloId} onChange={(e) => setModeloId(e.target.value)}>
                  <option value="">Elige tu modelo</option>
                  {modelos.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre} ({m.bateria_mah} mAh)
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Vatios de tu cargador actual
                <input
                  type="number"
                  value={vatiosActual}
                  onChange={(e) => setVatiosActual(e.target.value)}
                />
              </label>
            </div>

            {!modelo ? (
              <p className="carga-vacio">Elige tu celular para ver la comparación.</p>
            ) : (
              <>
                <div className="carga-actual">
                  <span>Con tu cargador de {vatiosActual}W</span>
                  <strong>{enTexto(actual)}</strong>
                </div>

                <div className="carga-lista">
                  {cargadores.map((c) => {
                    const nuevo = minutos(modelo.bateria_mah, c.vatios)
                    const ahorro = actual - nuevo

                    return (
                      <div key={c.id} className="carga-item">
                        <div className="carga-item-datos">
                          <p className="carga-item-nombre">{c.nombre}</p>
                          <p className="carga-item-precio">{formatPrice(c.precio)}</p>
                        </div>

                        <div className="carga-item-tiempo">
                          <strong>{enTexto(nuevo)}</strong>
                          {ahorro > 0 && (
                            <span className="carga-ahorro">
                              te ahorras {enTexto(ahorro)} cada carga
                            </span>
                          )}
                          {ahorro <= 0 && (
                            <span className="carga-igual">
                              tu cargador actual va igual o mejor
                            </span>
                          )}
                        </div>

                        <button
                          className="btn btn-primary"
                          onClick={() => agregarAlCarrito(c)}
                        >
                          Agregar
                        </button>
                      </div>
                    )
                  })}
                </div>

                <p className="carga-nota">
                  Los tiempos son aproximados y corresponden a una carga de 0 a 100 por
                  ciento. En la vida real el último 20 por ciento siempre carga más lento,
                  porque el celular baja la potencia a propósito para cuidar la batería.
                </p>
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Carga