import { jornadas } from '../data/predicciones'
import { buildCombinadas } from '../utils/combinadas'

export function getJornadas() {
  return jornadas
}

export function getJornadaDelDia() {
  const hoy = new Date().toISOString().slice(0, 10)
  // jornadas newest-first → reverse to find the earliest upcoming date
  return [...jornadas].reverse().find(j => j.fecha >= hoy) ?? jornadas[0]
}

export function getCombinadasDelDia() {
  return buildCombinadas(getJornadaDelDia()?.partidos ?? [])
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
