import { formatoMercado, cuotaJusta } from './mercados'

function pickCuota(pick) {
  return pick.cuota ?? cuotaJusta(pick.prob)
}

function buildLeg(partido, pick, texto) {
  const sel = texto ?? pick.seleccion
  const mkt = formatoMercado(sel)
  return {
    partido: `${partido.home} vs ${partido.away}`,
    seleccion: sel,
    texto: mkt.texto,
    chip: mkt.chip,
    prob: pick.prob,
    cuota: pickCuota(pick),
  }
}

export function buildCombinadas(partidos) {
  // ponytail: asume independencia entre partidos distintos — correcto para parlays de partidos separados
  const futuros = partidos.filter(p => !p.resultadoReal)
  if (futuros.length < 2) return []

  const seguraLegs = futuros.map(p => buildLeg(p, p.picks.fija))

  const valorLegs = futuros.map(p => {
    const cand = p.picks.alternativas.find(a => a.prob >= 50 && a.prob <= 78)
    return buildLeg(p, cand ?? p.picks.fija)
  })

  const arriesgadaLegs = futuros
    .map(p => {
      const g = p.arriesgados?.goleadores?.[0]
      if (!g) return null
      return buildLeg(p, { prob: g.prob, cuota: g.cuota }, `${g.jugador} marca`)
    })
    .filter(Boolean)

  function combo(legs, perfil, emoji, titulo, riesgoAlto = false) {
    const cuotaTotal = +(legs.reduce((a, l) => a * l.cuota, 1).toFixed(2))
    const probCombinada = +(legs.reduce((a, l) => a * (l.prob / 100), 1) * 100).toFixed(1)
    return { perfil, emoji, titulo, riesgoAlto, legs, cuotaTotal, probCombinada }
  }

  const result = [
    combo(seguraLegs, 'segura',     '🟢', 'Combinada Segura'),
    combo(valorLegs,  'valor',      '🟡', 'Combinada Valor'),
  ]
  if (arriesgadaLegs.length >= 2) {
    result.push(combo(arriesgadaLegs, 'arriesgada', '🔴', 'Combinada Arriesgada', true))
  }
  return result
}
