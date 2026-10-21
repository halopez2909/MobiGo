import { useState } from "react"

// Imagen de respaldo dibujada en el mismo archivo: no depende de internet,
// asi que funciona aunque la direccion de la foto este caida.
const RESPALDO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 300\">" +
      "<rect width=\"300\" height=\"300\" fill=\"#dde2ee\"/>" +
      "<text x=\"150\" y=\"156\" font-family=\"Arial\" font-size=\"18\" fill=\"#5b6478\" " +
      "text-anchor=\"middle\">Sin imagen</text></svg>",
  )

function ProductImage({ src, alt }) {
  const [url, setUrl] = useState(src || RESPALDO)

  return (
    <div className="product-image">
      <img
        src={url}
        alt={alt}
        loading="lazy"
        onError={() => setUrl(RESPALDO)}
      />
    </div>
  )
}

export default ProductImage
