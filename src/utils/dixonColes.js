import { poissonPmf } from './poisson.js'

function tau(x, y, lam, mu, rho) {
  if (x === 0 && y === 0) return 1 - lam * mu * rho
  if (x === 1 && y === 0) return 1 + mu * rho
  if (x === 0 && y === 1) return 1 + lam * rho
  if (x === 1 && y === 1) return 1 - rho
  return 1
}

// Reconstruye la matriz Dixon-Coles a partir de xg + rho ya guardados en el partido.
// Espejo de model/simulate.py::construir_matriz_dc — mismo modelo, sin re-simular.
export function matrizDC(xg, rho, maxGoles = 8) {
  const lam = xg.home, mu = xg.away
  const m = []
  for (let i = 0; i <= maxGoles; i++) {
    const fila = []
    for (let j = 0; j <= maxGoles; j++) {
      fila.push(tau(i, j, lam, mu, rho) * poissonPmf(i, lam) * poissonPmf(j, mu))
    }
    m.push(fila)
  }
  return m
}

function sumaCelda(m, pred) {
  let s = 0
  for (let i = 0; i < m.length; i++) {
    for (let j = 0; j < m[i].length; j++) {
      if (pred(i, j)) s += m[i][j]
    }
  }
  return Math.round(s * 1000) / 10
}

// Hándicap europeo: home da/recibe `linea` goles antes de comparar (linea > 0 = handicap al home).
export function handicapEuropeo(m, linea) {
  return {
    home: sumaCelda(m, (i, j) => i + linea > j),
    draw: sumaCelda(m, (i, j) => i + linea === j),
    away: sumaCelda(m, (i, j) => i + linea < j),
  }
}

export function parImpar(m) {
  const par = sumaCelda(m, (i, j) => (i + j) % 2 === 0)
  return { par, impar: Math.round((100 - par) * 10) / 10 }
}

export function rangoGoles(m) {
  return {
    r01: sumaCelda(m, (i, j) => i + j <= 1),
    r23: sumaCelda(m, (i, j) => i + j >= 2 && i + j <= 3),
    r4mas: sumaCelda(m, (i, j) => i + j >= 4),
  }
}

if (typeof process !== 'undefined' && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const m = matrizDC({ home: 1.5, away: 1.1 }, -0.05)
  const total = sumaCelda(m, () => true)
  console.assert(Math.abs(total - 100) < 1, `matriz debe sumar ~100%, dio ${total}`)
  const pi = parImpar(m)
  console.assert(Math.abs(pi.par + pi.impar - 100) < 0.2, `par+impar debe ser ~100, dio ${pi.par + pi.impar}`)
  const rg = rangoGoles(m)
  console.assert(Math.abs(rg.r01 + rg.r23 + rg.r4mas - 100) < 0.5, `rangoGoles debe sumar ~100`)
  console.log('dixonColes.js OK')
}
