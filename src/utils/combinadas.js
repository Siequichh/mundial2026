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

// ─── Same-game parlays escalonados (segura → valor → arriesgada) ───────────
// Siempre se generan para cada partido futuro, independientemente de cuántos hay.

// 🟢 Segura: fija (prob alta) + Over 1.5 — dos mercados de alta confianza.
function buildSGPSegura(partido) {
  const legs = [buildLeg(partido, partido.picks.fija)]

  if (partido.goles?.over15) {
    legs.push(buildLeg(partido, { seleccion: 'Over 1.5 goles', prob: partido.goles.over15 }))
  }

  if (legs.length < 2) return null
  const { cuotaTotal, cuotaSinAjuste, probCombinada } = combinarMismoPartido(legs)
  return {
    perfil: 'segura',
    emoji: '🟢',
    titulo: 'Segura (mismo partido)',
    mismoPartido: `${partido.home} vs ${partido.away}`,
    riesgoAlto: false,
    legs,
    cuotaTotal,
    cuotaSinAjuste,
    probCombinada,
  }
}

// 🟡 Valor: resultado favorito (90') + goleador estrella — riesgo medio, cuota atractiva.
function buildSGPValor(partido) {
  const fav = equipoFavorito(partido)
  const legs = []

  // Buscar "Gana X (90 min)" en alternativas o construirlo
  const gana90 = partido.picks.alternativas?.find(a =>
    /Gana .+ \(90 min\)/i.test(a.seleccion)
  )
  if (gana90) {
    legs.push(buildLeg(partido, gana90))
  } else if (partido.prob.home >= 45 || partido.prob.away >= 45) {
    // Construir desde probabilidades si no hay alternativa explícita
    const probFav = Math.max(partido.prob.home, partido.prob.away)
    const nombre = fav
    legs.push(buildLeg(partido, { seleccion: `Gana ${nombre} (90 min)`, prob: probFav }))
  }

  const gols = partido.arriesgados?.goleadores ?? []
  const gol = gols.find(g => g.equipo === fav) ?? gols[0]
  if (gol) {
    legs.push(buildLeg(partido, { prob: gol.prob, cuota: gol.cuota, fuenteCuota: gol.fuenteCuota }, `${gol.jugador} marca`))
  }

  if (legs.length < 2) return null
  const { cuotaTotal, cuotaSinAjuste, probCombinada } = combinarMismoPartido(legs)
  return {
    perfil: 'valor',
    emoji: '🟡',
    titulo: 'Valor (mismo partido)',
    mismoPartido: `${partido.home} vs ${partido.away}`,
    riesgoAlto: false,
    legs,
    cuotaTotal,
    cuotaSinAjuste,
    probCombinada,
  }
}

// 🔴 Arriesgada: resultado favorito (90') + goleador estrella + BTTS Sí/No o Under.
// Tres legs del mismo partido con cuota alta — alto riesgo, alto premio.
function buildSGPArriesgada(partido) {
  const fav = equipoFavorito(partido)
  const legs = []

  // Resultado favorito
  const gana90 = partido.picks.alternativas?.find(a =>
    /Gana .+ \(90 min\)/i.test(a.seleccion)
  )
  if (gana90) {
    legs.push(buildLeg(partido, gana90))
  } else {
    const probFav = Math.max(partido.prob.home, partido.prob.away)
    if (probFav >= 40) {
      legs.push(buildLeg(partido, { seleccion: `Gana ${fav} (90 min)`, prob: probFav }))
    }
  }

  // Goleador estrella del favorito
  const gols = partido.arriesgados?.goleadores ?? []
  const gol = gols.find(g => g.equipo === fav) ?? gols[0]
  if (gol) {
    legs.push(buildLeg(partido, { prob: gol.prob, cuota: gol.cuota, fuenteCuota: gol.fuenteCuota }, `${gol.jugador} marca`))
  }

  // Tercer leg: BTTS No si vallaAway es alta (favorito mantiene arco), sino Under 2.5
  if (partido.goles) {
    if (partido.goles.bttsNo >= 50) {
      legs.push(buildLeg(partido, { seleccion: 'Ambos anotan No', prob: partido.goles.bttsNo }))
    } else if (partido.goles.over25 < 50) {
      legs.push(buildLeg(partido, { seleccion: 'Under 2.5 goles', prob: 100 - partido.goles.over25 }))
    } else if (partido.goles.bttsSi >= 48) {
      legs.push(buildLeg(partido, { seleccion: 'Ambos anotan', prob: partido.goles.bttsSi }))
    }
  }

  if (legs.length < 3) return null
  const { cuotaTotal, cuotaSinAjuste, probCombinada } = combinarMismoPartido(legs)
  return {
    perfil: 'arriesgada',
    emoji: '🔴',
    titulo: 'Arriesgada (mismo partido)',
    mismoPartido: `${partido.home} vs ${partido.away}`,
    riesgoAlto: true,
    legs,
    cuotaTotal,
    cuotaSinAjuste,
    probCombinada,
  }
}

// Bet builder clásico (legacy): fija + goleador + Over 1.5.
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

  // Same-game parlays escalonados: segura → valor → arriesgada para cada partido.
  // Siempre se generan, garantizan contenido incluso con un solo partido en el día.
  for (const p of futuros) {
    const sgpSegura = buildSGPSegura(p)
    if (sgpSegura) result.push(sgpSegura)

    const sgpValor = buildSGPValor(p)
    if (sgpValor) result.push(sgpValor)

    const sgpArriesgada = buildSGPArriesgada(p)
    if (sgpArriesgada) result.push(sgpArriesgada)

    // Bet builder clásico (legacy) como opción adicional
    const bb = buildBetBuilder(p)
    if (bb) result.push(bb)
  }

  return result
}
