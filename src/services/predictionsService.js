import { jornadas } from '../data/predicciones'
import { buildCombinadas } from '../utils/combinadas'

export function getJornadas() {
  return jornadas
}

export function getJornadaDelDia() {
  return jornadas[0]
}

export function getCombinadasDelDia() {
  return buildCombinadas(jornadas[0]?.partidos ?? [])
}
