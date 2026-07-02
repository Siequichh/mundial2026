import { jornadas } from '../data/predicciones'

export function getJornadas() {
  return jornadas
}

export function getJornadaDelDia() {
  return jornadas[0]
}
