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

// Todos los partidos con resultadoReal, aplanados y anotados con la fecha de su jornada,
// más reciente primero (las jornadas ya vienen ordenadas así).
export function getPartidosArchivados() {
  const archivados = []
  for (const j of jornadas) {
    for (const p of j.partidos) {
      if (p.resultadoReal) archivados.push({ ...p, fechaJornada: j.fecha })
    }
  }
  return archivados
}
