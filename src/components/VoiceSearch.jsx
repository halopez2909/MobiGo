import { useState } from "react"

function VoiceSearch({ onResultado }) {
  const [escuchando, setEscuchando] = useState(false)

  // La Web Speech API no existe en todos los navegadores
  const Reconocimiento =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!Reconocimiento) return null

  const escuchar = () => {
    const reconocimiento = new Reconocimiento()
    reconocimiento.lang = "es-CO"
    reconocimiento.continuous = false
    reconocimiento.interimResults = false

    reconocimiento.onstart = () => setEscuchando(true)
    reconocimiento.onend = () => setEscuchando(false)
    reconocimiento.onerror = () => setEscuchando(false)
    reconocimiento.onresult = (evento) => {
      onResultado(evento.results[0][0].transcript)
    }

    reconocimiento.start()
  }

  return (
    <button
      type="button"
      className={escuchando ? "voz escuchando" : "voz"}
      onClick={escuchar}
      title="Buscar por voz"
      aria-label="Buscar por voz"
    >
      {escuchando ? "Escuchando..." : "Buscar por voz"}
    </button>
  )
}

export default VoiceSearch
