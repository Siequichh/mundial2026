import { mercadosDerivados, mercadosDeExtras } from './mercadosDerivados'
import { formatoMercado, cuotaJusta } from './mercados'

function tier(prob) {
  return prob >= 65 ? 'seguro' : prob >= 50 ? 'medio' : 'bajo'
}

function entry(partido, seleccion, prob, cuota, opts = {}) {
  const fmt = formatoMercado(seleccion)
  return {
    id: `${partido.id}::${seleccion}`,
    partidoId: partido.id,
    partido: `${partido.home} vs ${partido.away}`,
    seleccion,
    texto: fmt.texto,
    chip: fmt.chip,
    prob,
    cuota: cuota ?? cuotaJusta(prob),
    tier: opts.riesgoAlto ? 'arriesgado' : tier(prob),
    riesgoAlto: opts.riesgoAlto ?? false,
    nota: opts.nota ?? null,
    grupo: opts.grupo ?? null,
    fuenteCuota: opts.fuenteCuota ?? null,
  }
}

export function poolDePartido(partido) {
  const entries = []

  // Picks del modelo (fija + alternativas)
  const fija = partido.picks.fija
  entries.push(entry(partido, fija.seleccion, fija.prob, fija.cuota ?? cuotaJusta(fija.prob), { grupo: 'fija', fuenteCuota: fija.fuenteCuota }))
  for (const alt of partido.picks.alternativas) {
    entries.push(entry(partido, alt.seleccion, alt.prob, alt.cuota ?? cuotaJusta(alt.prob), { grupo: 'alternativas', nota: alt.nota, fuenteCuota: alt.fuenteCuota }))
  }

  // Mercados derivados (doble oportunidad, DNB, clasifica, goles, hándicap, par/impar, rango, faltas)
  for (const d of mercadosDerivados(partido)) {
    entries.push(entry(partido, d.seleccion, d.prob, d.cuota, { grupo: d.grupo, nota: d.nota }))
  }

  // Mercados que viven en `extras` (córners, tarjetas, disparos, atajadas)
  for (const d of mercadosDeExtras(partido)) {
    entries.push(entry(partido, d.seleccion, d.prob, d.cuota, { grupo: d.grupo, nota: d.nota }))
  }

  // mercadosExtra (de la simulación, si el partido los incluye)
  for (const e of (partido.mercadosExtra ?? [])) {
    entries.push(entry(partido, e.seleccion, e.prob, e.cuota ?? cuotaJusta(e.prob), { grupo: e.grupo, nota: e.nota }))
  }

  // Arriesgados
  if (partido.arriesgados) {
    const ap = partido.arriesgados.anotaPrimero
    entries.push(entry(partido, `${partido.home} anota primero`, ap.home, cuotaJusta(ap.home), { riesgoAlto: true, grupo: 'arriesgados' }))
    entries.push(entry(partido, `${partido.away} anota primero`, ap.away, cuotaJusta(ap.away), { riesgoAlto: true, grupo: 'arriesgados' }))
    for (const g of (partido.arriesgados.goleadores ?? [])) {
      entries.push(entry(partido, `${g.jugador} marca`, g.prob, g.cuota ?? cuotaJusta(g.prob), { riesgoAlto: true, grupo: 'goleadores', nota: g.nota, fuenteCuota: g.fuenteCuota }))
    }
  }

  return entries
}
