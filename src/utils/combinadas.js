import { formatoMercado, cuotaJusta } from './mercados'

// Recorte de correlación para combinadas del MISMO partido (bet builder / same-game parlay).
// Los mercados de un mismo partido están correlacionados, así que la casa paga menos que la
// multiplicación ingenua de cuotas. 0.80 = se recorta ~20% de la ganancia neta del producto.
// ponytail: heurística fija; un SGP real usa la distribución conjunta, que aquí no modelamos.
const CORRELACION_MISMO_PARTIDO = 0.80

function pickCuota(pick) {
  return pick.cuota ?? cuotaJusta(pick.prob)
}

function buildLeg(partido, pick, texto) {
  const sel = texto ?? pick.seleccion
  const mkt = formatoMercado(sel)
  return {
    partidoId: partido.id,
    partido: `${partido.home} vs ${partido.away}`,
    seleccion: sel,
    texto: mkt.texto,
    chip: mkt.chip,
    prob: pick.prob,
    cuota: pickCuota(pick),
    fuenteCuota: pick.fuenteCuota,
  }
}

// Combinada de partidos DISTINTOS: independencia, producto directo.
export function combinar(legs) {
  const cuotaTotal = +(legs.reduce((a, l) => a * l.cuota, 1).toFixed(2))
  const probCombinada = +(legs.reduce((a, l) => a * (l.prob / 100), 1) * 100).toFixed(1)
  return { cuotaTotal, probCombinada }
}

// Combinada del MISMO partido (bet builder): recorta la cuota por correlación.
// `probCombinada` (producto) queda como cota inferior — con legs correlacionados
// positivamente la probabilidad real es mayor, pero no la modelamos exacto.
export function combinarMismoPartido(legs) {
  const { cuotaTotal: cuotaSinAjuste, probCombinada } = combinar(legs)
  const cuotaTotal = +(1 + (cuotaSinAjuste - 1) * CORRELACION_MISMO_PARTIDO).toFixed(2)
  return { cuotaTotal, cuotaSinAjuste, probCombinada }
}

function equipoFavorito(partido) {
  return partido.prob.home >= partido.prob.away ? partido.home : partido.away
}

// Bet builder auto-armado desde los mercados del propio partido: resultado (fija) +
// goleador estrella del favorito + Over 1.5. Legs compatibles y correlacionados, como los
// que ofrecen las casas (bet365 "Bet Builder", FanDuel "Same Game Parlay").
function buildBetBuilder(partido) {
  const legs = [buildLeg(partido, partido.picks.fija)]

  const fav = equipoFavorito(partido)
  const gols = partido.arriesgados?.goleadores ?? []
  const gol = gols.find(g => g.equipo === fav) ?? gols[0]
  if (gol) {
    legs.push(buildLeg(partido, { prob: gol.prob, cuota: gol.cuota, fuenteCuota: gol.fuenteCuota }, `${gol.jugador} marca`))
  }

  if (partido.goles?.over15) {
    legs.push(buildLeg(partido, { seleccion: 'Over 1.5 goles', prob: partido.goles.over15 }))
  }

  if (legs.length < 2) return null
  const { cuotaTotal, cuotaSinAjuste, probCombinada } = combinarMismoPartido(legs)
  return {
    perfil: 'betbuilder',
    emoji: '🎯',
    titulo: 'Bet Builder',
    mismoPartido: `${partido.home} vs ${partido.away}`,
    riesgoAlto: false,
    legs,
    cuotaTotal,
    cuotaSinAjuste,
    probCombinada,
  }
}

function combo(legs, perfil, emoji, titulo, riesgoAlto = false) {
  const { cuotaTotal, probCombinada } = combinar(legs)
  return { perfil, emoji, titulo, riesgoAlto, legs, cuotaTotal, probCombinada }
}

export function buildCombinadas(partidos) {
  const futuros = partidos.filter(p => !p.resultadoReal)
  const result = []

  // Combinadas multi-partido (una selección por partido) — requieren ≥2 partidos.
  if (futuros.length >= 2) {
    const seguraLegs = futuros.map(p => buildLeg(p, p.picks.fija))
    const valorLegs = futuros.map(p => {
      const cand = p.picks.alternativas.find(a => a.prob >= 50 && a.prob <= 78)
      return buildLeg(p, cand ?? p.picks.fija)
    })
    const arriesgadaLegs = futuros
      .map(p => {
        const g = p.arriesgados?.goleadores?.[0]
        if (!g) return null
        return buildLeg(p, { prob: g.prob, cuota: g.cuota, fuenteCuota: g.fuenteCuota }, `${g.jugador} marca`)
      })
      .filter(Boolean)

    result.push(combo(seguraLegs, 'segura', '🟢', 'Combinada Segura'))
    result.push(combo(valorLegs, 'valor', '🟡', 'Combinada Valor'))
    if (arriesgadaLegs.length >= 2) {
      result.push(combo(arriesgadaLegs, 'arriesgada', '🔴', 'Combinada Arriesgada', true))
    }
  }

  // Bet builder (mismo partido) para cada partido futuro. Garantiza que la sección no
  // desaparezca aunque quede un solo partido en el día.
  for (const p of futuros) {
    const bb = buildBetBuilder(p)
    if (bb) result.push(bb)
  }

  return result
}
