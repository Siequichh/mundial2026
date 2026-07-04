import { cuotaJusta } from './mercados'
import { poissonOverProb } from './poisson'
import { matrizDC, handicapEuropeo, parImpar, rangoGoles } from './dixonColes'

const r1 = (n) => Math.round(n * 10) / 10

export function mercadosDerivados(partido) {
  const { prob, goles, xg } = partido
  const m = []

  // ── Doble oportunidad (liquida a 90') ─────────────────────────
  const dc1x = r1(prob.home + prob.draw)
  const dcx2 = r1(prob.draw + prob.away)
  const dc12 = r1(prob.home + prob.away)
  m.push(
    { grupo: 'resultado90', seleccion: 'Doble oportunidad 1X', prob: dc1x, cuota: cuotaJusta(dc1x), nota: `${partido.home} gana o empate` },
    { grupo: 'resultado90', seleccion: 'Doble oportunidad X2', prob: dcx2, cuota: cuotaJusta(dcx2), nota: `Empate o gana ${partido.away}` },
    { grupo: 'resultado90', seleccion: 'Doble oportunidad 12', prob: dc12, cuota: cuotaJusta(dc12), nota: 'Cualquiera gana, el empate no paga' },
  )

  // ── Empate no apuesta / Draw no bet (liquida a 90') ───────────
  const sum12 = prob.home + prob.away
  if (sum12 > 0) {
    const dnbH = r1(prob.home / sum12 * 100)
    const dnbA = r1(prob.away / sum12 * 100)
    m.push(
      { grupo: 'resultado90', seleccion: `${partido.home} empate no apuesta`, prob: dnbH, cuota: cuotaJusta(dnbH), nota: 'Reembolso si empatan' },
      { grupo: 'resultado90', seleccion: `${partido.away} empate no apuesta`, prob: dnbA, cuota: cuotaJusta(dnbA), nota: 'Reembolso si empatan' },
    )
  }

  // ── Clasifica (prórroga y penales incluidos) ───────────────────
  // Fórmula: P(clasifica_home) = P(gana_90) + P(empate_90) × λh/(λh+λa)
  // ponytail: reparto de penales proporcional a fuerza relativa (xG) — simplificación conocida
  const ls = xg.home + xg.away
  if (ls > 0) {
    const clH = r1(prob.home + prob.draw * (xg.home / ls))
    const clA = r1(prob.away + prob.draw * (xg.away / ls))
    m.push(
      { grupo: 'clasifica', seleccion: `${partido.home} clasifica`, prob: clH, cuota: cuotaJusta(clH), nota: 'Incluye prórroga y penales' },
      { grupo: 'clasifica', seleccion: `${partido.away} clasifica`, prob: clA, cuota: cuotaJusta(clA), nota: 'Incluye prórroga y penales' },
    )
  }

  // ── Goles adicionales ──────────────────────────────────────────
  m.push(
    { grupo: 'goles', seleccion: 'Over 1.5 goles',   prob: goles.over15,              cuota: cuotaJusta(goles.over15) },
    { grupo: 'goles', seleccion: 'Under 3.5 goles',  prob: r1(100 - goles.over35),    cuota: cuotaJusta(r1(100 - goles.over35)) },
    { grupo: 'goles', seleccion: 'Ambos anotan No',  prob: goles.bttsNo,              cuota: cuotaJusta(goles.bttsNo), nota: 'Al menos un equipo no anota' },
  )

  // ── Hándicap, par/impar, rango de goles ────────────────────────
  // Gratis: se reconstruyen de xg+rho, que ya existen en todo partido (pasado o futuro).
  const matriz = matrizDC(xg, partido.rho)

  const h1 = handicapEuropeo(matriz, 1)
  m.push(
    { grupo: 'handicap', seleccion: `Hándicap europeo ${partido.home} +1`, prob: r1(h1.home), cuota: cuotaJusta(h1.home), nota: `${partido.home} gana o empata dándole 1 gol de ventaja` },
    { grupo: 'handicap', seleccion: `Hándicap europeo ${partido.away} +1`, prob: r1(h1.away), cuota: cuotaJusta(h1.away), nota: `${partido.away} gana o empata dándole 1 gol de ventaja` },
  )

  const pi = parImpar(matriz)
  m.push(
    { grupo: 'parimpar', seleccion: 'Total de goles Par',   prob: pi.par,   cuota: cuotaJusta(pi.par) },
    { grupo: 'parimpar', seleccion: 'Total de goles Impar', prob: pi.impar, cuota: cuotaJusta(pi.impar) },
  )

  const rg = rangoGoles(matriz)
  m.push(
    { grupo: 'rangogoles', seleccion: 'Rango de goles 0-1', prob: rg.r01,   cuota: cuotaJusta(rg.r01) },
    { grupo: 'rangogoles', seleccion: 'Rango de goles 2-3', prob: rg.r23,   cuota: cuotaJusta(rg.r23) },
    { grupo: 'rangogoles', seleccion: 'Rango de goles 4+',  prob: rg.r4mas, cuota: cuotaJusta(rg.r4mas) },
  )

  // ── Faltas Over/Under ──────────────────────────────────────────
  // Gratis: se derivan del lambda `extras.faltas.esperadas` que ya existe en todo partido.
  const faltasLambda = partido.extras?.faltas?.esperadas
  if (faltasLambda) {
    const over225 = poissonOverProb(faltasLambda, 22.5)
    const over245 = poissonOverProb(faltasLambda, 24.5)
    m.push(
      { grupo: 'faltas', seleccion: 'Over 22.5 faltas', prob: over225, cuota: cuotaJusta(over225) },
      { grupo: 'faltas', seleccion: 'Over 24.5 faltas', prob: over245, cuota: cuotaJusta(over245) },
    )
  }

  return m
}

// ── Mercados que ya viven en `extras` pero nunca llegaban al pool ──
// Corners/tarjetas totales: passthrough de valores ya calculados.
// Corners/disparos/atajadas por equipo: condicionales, solo si el campo existe.
export function mercadosDeExtras(partido) {
  const { extras, xg } = partido
  const m = []
  if (!extras) return m

  if (extras.corners) {
    const c = extras.corners
    m.push(
      { grupo: 'corners', seleccion: 'Over 8.5 córners',  prob: c.over85,  cuota: cuotaJusta(c.over85) },
      { grupo: 'corners', seleccion: 'Over 9.5 córners',  prob: c.over95,  cuota: cuotaJusta(c.over95) },
      { grupo: 'corners', seleccion: 'Over 10.5 córners', prob: c.over105, cuota: cuotaJusta(c.over105) },
    )
    if (c.home?.esperados) {
      const p = poissonOverProb(c.home.esperados, 4.5)
      m.push({ grupo: 'corners', seleccion: `${partido.home} Over 4.5 córners`, prob: p, cuota: cuotaJusta(p) })
    }
    if (c.away?.esperados) {
      const p = poissonOverProb(c.away.esperados, 4.5)
      m.push({ grupo: 'corners', seleccion: `${partido.away} Over 4.5 córners`, prob: p, cuota: cuotaJusta(p) })
    }
  }

  if (extras.tarjetas) {
    const t = extras.tarjetas
    m.push(
      { grupo: 'tarjetas', seleccion: 'Over 3.5 tarjetas', prob: t.over35, cuota: cuotaJusta(t.over35) },
      { grupo: 'tarjetas', seleccion: 'Over 4.5 tarjetas', prob: t.over45, cuota: cuotaJusta(t.over45) },
    )
  }

  if (extras.disparos?.home?.esperados) {
    const p = poissonOverProb(extras.disparos.home.esperados, 3.5)
    m.push({ grupo: 'disparos', seleccion: `${partido.home} Over 3.5 tiros al arco`, prob: p, cuota: cuotaJusta(p) })
  }
  if (extras.disparos?.away?.esperados) {
    const p = poissonOverProb(extras.disparos.away.esperados, 3.5)
    m.push({ grupo: 'disparos', seleccion: `${partido.away} Over 3.5 tiros al arco`, prob: p, cuota: cuotaJusta(p) })
  }

  // Atajadas: derivadas de los tiros al arco del rival menos su xG — sin research propia.
  // ponytail: aproximación (tiros al arco no convertidos ≈ atajados), piso 0.3 para evitar lambda ~0
  if (extras.disparos?.away?.esperados) {
    const lambda = Math.max(extras.disparos.away.esperados - xg.away, 0.3)
    const p = poissonOverProb(lambda, 2.5)
    m.push({ grupo: 'atajadas', seleccion: `Arquero de ${partido.home} Over 2.5 atajadas`, prob: p, cuota: cuotaJusta(p) })
  }
  if (extras.disparos?.home?.esperados) {
    const lambda = Math.max(extras.disparos.home.esperados - xg.home, 0.3)
    const p = poissonOverProb(lambda, 2.5)
    m.push({ grupo: 'atajadas', seleccion: `Arquero de ${partido.away} Over 2.5 atajadas`, prob: p, cuota: cuotaJusta(p) })
  }

  return m
}

// ── Etiquetas de grupo para el UI ─────────────────────────────────
export const ETIQ_GRUPO = {
  resultado90: "Resultado (90')",
  clasifica:   'Clasificación',
  goles:       'Goles adicionales',
  handicap:    'Hándicap',
  parimpar:    'Par / Impar',
  rangogoles:  'Rango de goles',
  faltas:      'Faltas',
  corners:     'Córners',
  tarjetas:    'Tarjetas',
  disparos:    'Disparos (tiros al arco)',
  atajadas:    'Atajadas',
}
