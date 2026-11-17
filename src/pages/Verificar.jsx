import { useState } from "react"
import { verificarCodigo } from "../services/api"
import "./Verificar.css"

function Verificar() {
  const [codigo, setCodigo] = useState("")
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    if (codigo.trim().length < 5) {
      setError("Escribe el código completo que viene en el empaque")
      return
    }

    try {
      setError("")
      setCargando(true)
      setResultado(null)
      const r = await verificarCodigo(codigo)
      setResultado(r)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  function fecha(valor) {
    if (!valor) return "-"
    return new Date(valor).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  // La garantía arranca el día que el cliente activa su código
  function garantia(valor) {
    const d = new Date(valor)
    d.setMonth(d.getMonth() + 6)
    return d.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <section className="section">
      <div className="container verificar">
        <h2>Verifica tu producto</h2>
        <p className="subtitle">
          Cada accesorio MobiGo trae un código único en el empaque. Escríbelo acá y te
          confirmamos si es original.
        </p>

        <form className="verificar-form" onSubmit={handleSubmit}>
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="MG-XXXX-XXXX"
            maxLength={12}
          />
          <button type="submit" className="btn btn-primary" disabled={cargando}>
            {cargando ? "Verificando..." : "Verificar"}
          </button>
        </form>

        {error && <p className="admin-error">{error}</p>}

        {resultado && resultado.resultado === "valido" && (
          <div className="tarjeta valida">
            <p className="tarjeta-titulo">Producto original</p>
            <p className="tarjeta-producto">{resultado.unidad.nombre_producto}</p>
            <p>Código {resultado.unidad.codigo}</p>
            <p>Registrado el {fecha(resultado.unidad.creado_en)}</p>
            <p>Garantía vigente hasta {garantia(resultado.unidad.verificado_en)}</p>
          </div>
        )}

        {resultado && resultado.resultado === "no_existe" && (
          <div className="tarjeta invalida">
            <p className="tarjeta-titulo">Código no encontrado</p>
            <p>Este código no fue emitido por MobiGo.</p>
            <p>
              Si lo compró como original, el producto puede ser una copia. Escríbanos y
              lo revisamos.
            </p>
          </div>
        )}

        {resultado && resultado.resultado === "repetido" && (
          <div className="tarjeta repetida">
            <p className="tarjeta-titulo">Este código ya fue verificado</p>
            <p className="tarjeta-producto">{resultado.unidad.nombre_producto}</p>
            <p>Se activó el {fecha(resultado.unidad.verificado_en)}.</p>
            <p>
              Un código solo se puede activar una vez. Si usted no fue quien lo verificó,
              puede tratarse de una copia del empaque.
            </p>
          </div>
        )}

        <div className="verificar-ayuda">
          <p>
            <strong>¿Dónde está mi código?</strong> Viene impreso en una etiqueta dentro
            del empaque, debajo del producto.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Verificar