import { useState, useEffect, useCallback } from "react"
import ProductCard from "../components/ProductCard"
import FilterPanel from "../components/FilterPanel"
import DeviceBanner from "../components/DeviceBanner"
import useDeviceDetection from "../hooks/useDeviceDetection"
import { getProductos, getCategorias, getModelos } from "../services/api"
import "./Products.css"

function Products({ agregarAlCarrito }) {
  // Valor agregado: se lee el dispositivo antes del primer renderizado
  const dispositivo = useDeviceDetection()

  // Datos que llegan de la base
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [modelos, setModelos] = useState([])

  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  // Filtros. El de modelo arranca con el celular detectado,
  // asi que la preseleccion no necesita ningun efecto aparte.
  const [busqueda, setBusqueda] = useState("")
  const [categoriasSel, setCategoriasSel] = useState([])
  const [modelo, setModelo] = useState(dispositivo.modeloSugerido)
  const [precioMin, setPrecioMin] = useState("")
  const [precioMax, setPrecioMax] = useState("")
  const [orden, setOrden] = useState("")

  const [bannerVisible, setBannerVisible] = useState(
    Boolean(dispositivo.modeloSugerido),
  )

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true)
      setError("")
      const [listaProductos, listaCategorias, listaModelos] = await Promise.all([
        getProductos(),
        getCategorias(),
        getModelos(),
      ])
      setProductos(listaProductos)
      setCategorias(listaCategorias)
      setModelos(listaModelos)
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [])

  // Se ejecuta una sola vez, al montar el componente.
  // Traer datos de una API es el caso para el que existe useEffect, asi que
  // aca se desactiva la regla que advierte sobre setState dentro de un efecto.
  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    cargarDatos()
  }, [cargarDatos])

  function alternarCategoria(nombre) {
    const yaEsta = categoriasSel.includes(nombre)
    setCategoriasSel(
      yaEsta ? categoriasSel.filter((c) => c !== nombre) : [...categoriasSel, nombre],
    )
  }

  function limpiarFiltros() {
    setBusqueda("")
    setCategoriasSel([])
    setModelo("")
    setPrecioMin("")
    setPrecioMax("")
    setOrden("")
    setBannerVisible(false)
  }

  // Valor derivado: se recalcula en cada renderizado a partir de los filtros
  const productosFiltrados = productos
    .filter((producto) => {
      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase())

      const coincideCategoria =
        categoriasSel.length === 0 || categoriasSel.includes(producto.categoria)

      const coincideModelo =
        modelo === "" || producto.compatibilidad.includes(modelo)

      const minimo = precioMin === "" ? 0 : Number(precioMin)
      const maximo = precioMax === "" ? Infinity : Number(precioMax)
      const coincidePrecio = producto.precio >= minimo && producto.precio <= maximo

      return coincideNombre && coincideCategoria && coincideModelo && coincidePrecio
    })
    .sort((a, b) => {
      if (orden === "precio-asc") return a.precio - b.precio
      if (orden === "precio-desc") return b.precio - a.precio
      if (orden === "nombre") return a.nombre.localeCompare(b.nombre)
      return 0
    })

  return (
    <section className="section">
      <div className="container">
        <h2>Productos</h2>
        <p className="subtitle">
          Busca un accesorio o elige tu celular para ver solo lo compatible.
        </p>

        {bannerVisible && (
          <DeviceBanner
            marca={dispositivo.marca}
            modelo={dispositivo.modeloSugerido}
            onCambiar={() => {
              setModelo("")
              setBannerVisible(false)
            }}
          />
        )}

        <FilterPanel
          categorias={categorias}
          modelos={modelos}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          categoriasSel={categoriasSel}
          alternarCategoria={alternarCategoria}
          modelo={modelo}
          setModelo={setModelo}
          precioMin={precioMin}
          setPrecioMin={setPrecioMin}
          precioMax={precioMax}
          setPrecioMax={setPrecioMax}
          orden={orden}
          setOrden={setOrden}
          limpiarFiltros={limpiarFiltros}
        />

        {cargando && <p className="estado cargando">Cargando productos...</p>}

        {error && (
          <div className="estado error">
            <p>No pudimos cargar el catalogo: {error}</p>
            <button type="button" className="btn btn-outline" onClick={cargarDatos}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <>
            <p className="results">
              Mostrando {productosFiltrados.length}{" "}
              {productosFiltrados.length === 1 ? "producto" : "productos"}
            </p>

            {productosFiltrados.length === 0 ? (
              <p className="estado vacio">No encontramos productos con esos filtros.</p>
            ) : (
              <div className="products-grid">
                {productosFiltrados.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    agregarAlCarrito={agregarAlCarrito}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default Products
