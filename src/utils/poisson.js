export function poissonPmf(k, lambda) {
  if (lambda <= 0) return k === 0 ? 1 : 0
  let logP = -lambda + k * Math.log(lambda)
  for (let i = 2; i <= k; i++) logP -= Math.log(i)
  return Math.exp(logP)
}

// P(X > umbral), redondeado a 1 decimal, en porcentaje. Umbral típico X.5 (línea de apuesta).
export function poissonOverProb(lambda, umbral) {
  let acumulado = 0
  for (let k = 0; k <= Math.floor(umbral); k++) acumulado += poissonPmf(k, lambda)
  return Math.round((1 - acumulado) * 1000) / 10
}

// node src/utils/poisson.js — self-check, sin framework
if (typeof process !== 'undefined' && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  const p = poissonOverProb(3, 2.5) // lambda=3 → P(X>2.5) tabulado ≈ 57.68%
  console.assert(Math.abs(p - 57.7) < 1, `poissonOverProb(3, 2.5) esperado ~57.7, obtuvo ${p}`)
  console.assert(Math.abs(poissonPmf(0, 0) - 1) < 1e-9, 'poissonPmf(0,0) debe ser 1')
  console.log('poisson.js OK')
}
