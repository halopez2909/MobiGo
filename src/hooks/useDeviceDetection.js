import { useState } from "react"

// Patrones por marca. Android suele traer el modelo en el userAgent,
// iOS solo dice "iPhone", por eso la deteccion es por marca y no por modelo exacto.
const PATRONES = [
  { patron: /iPhone|iPad|iPod/i, marca: "Apple", modelo: "iPhone 15" },
  { patron: /SM-|Samsung|Galaxy/i, marca: "Samsung", modelo: "Samsung Galaxy S24" },
  { patron: /Xiaomi|Redmi|POCO/i, marca: "Xiaomi", modelo: "Xiaomi Redmi Note 13" },
  { patron: /moto|Motorola/i, marca: "Motorola", modelo: "Motorola Moto G54" },
]

// El userAgent no cambia durante la sesion, asi que se lee una sola vez
function detectarDispositivo() {
  const agente = navigator.userAgent
  const esMovil = /Android|iPhone|iPad|iPod|Windows Phone/i.test(agente)
  const encontrado = PATRONES.find((p) => p.patron.test(agente))

  return {
    esMovil,
    marca: encontrado ? encontrado.marca : "",
    modeloSugerido: encontrado ? encontrado.modelo : "",
  }
}

function useDeviceDetection() {
  // Inicializacion perezosa: la funcion corre una sola vez, al montar
  const [info] = useState(detectarDispositivo)
  return info
}

export default useDeviceDetection
