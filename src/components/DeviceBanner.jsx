function DeviceBanner({ marca, modelo, onCambiar }) {
  return (
    <div className="device-banner">
      <span>
        Detectamos que entras desde un <strong>{marca}</strong>. Mostrando solo los
        accesorios compatibles con {modelo}.
      </span>
      <button type="button" onClick={onCambiar}>
        No es mi celular
      </button>
    </div>
  )
}

export default DeviceBanner
