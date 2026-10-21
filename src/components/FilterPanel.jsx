import VoiceSearch from "./VoiceSearch"

function FilterPanel({
  categorias,
  modelos,
  busqueda,
  setBusqueda,
  categoriasSel,
  alternarCategoria,
  modelo,
  setModelo,
  precioMin,
  setPrecioMin,
  precioMax,
  setPrecioMax,
  orden,
  setOrden,
  limpiarFiltros,
}) {
  return (
    <div className="filtros">
      <div className="filtros-fila">
        <input
          type="text"
          className="buscador"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <VoiceSearch onResultado={(texto) => setBusqueda(texto)} />

        <select value={modelo} onChange={(e) => setModelo(e.target.value)}>
          <option value="">Que celular tienes?</option>
          {modelos.map((m) => (
            <option key={m.id} value={m.nombre}>
              {m.nombre}
            </option>
          ))}
        </select>

        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="">Ordenar por</option>
          <option value="precio-asc">Precio: menor a mayor</option>
          <option value="precio-desc">Precio: mayor a menor</option>
          <option value="nombre">Nombre (A-Z)</option>
        </select>

        <button type="button" className="btn btn-outline" onClick={limpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      <div className="filtros-fila filtros-avanzados">
        <fieldset className="categorias-check">
          <legend>Categorias</legend>
          {categorias.map((c) => (
            <label key={c.id} className="check">
              <input
                type="checkbox"
                checked={categoriasSel.includes(c.nombre)}
                onChange={() => alternarCategoria(c.nombre)}
              />
              {c.icono} {c.nombre}
            </label>
          ))}
        </fieldset>

        <fieldset className="rango-precio">
          <legend>Precio</legend>
          <label>
            Desde
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
            />
          </label>
          <label>
            Hasta
            <input
              type="number"
              min="0"
              step="1000"
              placeholder="100000"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
            />
          </label>
        </fieldset>
      </div>
    </div>
  )
}

export default FilterPanel
