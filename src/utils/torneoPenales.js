// Lógica pura del mini-torneo de penales. Sin dependencias de React.
// ponytail: colisión por celdas 3×2, no física real. Mejorar a hitbox continua si se pide.

export const RONDAS = ['Octavos de final', 'Cuartos de final', 'Semifinal', 'Final']
// IQ del arquero por ronda: sube de predecible (0.34) a casi telepático (0.82).
export const IQ_RONDA = [0.34, 0.50, 0.66, 0.82]

const ZONAS_N = 6

// ─── Torneo ─────────────────────────────────────────────────────────────────
// Baraja Fisher–Yates con rng inyectable (default Math.random).
function barajar(arr, rng = Math.random) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Genera el cuadro inicial de 16 con el jugador elegido en slot 0.
 * Retorna un array de 4 rondas, cada ronda = array de matches:
 *   { a: jugador, b: jugador, ganador: null, marcador: null, esTuyo: bool }
 * Solo la ronda 0 está poblada; las siguientes se generan al avanzar.
 */
export function sortearTorneo(todosJugadores, tuId, rng = Math.random) {
  const yo = todosJugadores.find((j) => j.id === tuId)
  const otros = barajar(todosJugadores.filter((j) => j.id !== tuId), rng)
  // Cuadro: [yo, rival0], [1, 2], [3, 4], … = 8 partidos
  const semilla = [yo, ...otros] // 16 slots; yo en 0
  const octavos = []
  for (let i = 0; i < 16; i += 2) {
    octavos.push({ a: semilla[i], b: semilla[i + 1], ganador: null, marcador: null, esTuyo: i === 0 })
  }
  return octavos
}

/**
 * Fuerza agregada de un jugador: potencia 40%, precisión 40%, nivel arquero 20%.
 */
export function fuerza(j) {
  return j.potencia * 0.4 + j.precision * 0.4 + j.arquero.nivel * 0.2
}

/**
 * Simula un partido de penales entre dos jugadores CPU vs CPU.
 * Retorna { ganadorId, marcador: [golesA, golesB] }.
 * Basado en la relación de fuerzas, con algo de ruido.
 */
export function simularPartido(a, b, rng = Math.random) {
  const fa = fuerza(a), fb = fuerza(b)
  const probA = fa / (fa + fb) // 0–1
  let ga = 0, gb = 0
  for (let k = 0; k < 5; k++) {
    if (rng() < probA + rng() * 0.08 - 0.04) ga++
    if (rng() < (1 - probA) + rng() * 0.08 - 0.04) gb++
  }
  // Muerte súbita si empate (simplificado: 1 tiro extra por lado)
  if (ga === gb) {
    if (rng() < probA) ga++; else gb++
    if (ga === gb) gb++ // romper empate forzado (rarísimo)
  }
  return { ganadorId: ga > gb ? a.id : b.id, marcador: [ga, gb] }
}

// ─── IA del arquero ──────────────────────────────────────────────────────────
/**
 * Construye un mapa de frecuencia { zonaId: count } del historial acumulado.
 */
export function frecuencias(histZonas) {
  const freq = Array(ZONAS_N).fill(0)
  histZonas.forEach((z) => freq[z]++)
  return freq
}

/**
 * El arquero elige una zona, con IQ que sube por ronda:
 * - Si IQ alto y hay historial: lee la zona favorita del jugador (con ruido).
 * - Si IQ bajo o sin historial: elige al azar con sesgo leve a los palos.
 *
 * @param {number}   iq        0–1, de IQ_RONDA + ajuste del arquero.
 * @param {number[]} histZonas Zonas disparadas en todo el torneo (acumulado).
 * @param {function} rng
 * @returns {number} zona 0–5
 */
export function keeperElige(iq, histZonas, rng = Math.random) {
  if (histZonas.length >= 2 && rng() < iq) {
    // Modo lectura: detecta zona favorita
    const freq = frecuencias(histZonas)
    const maxFreq = Math.max(...freq)
    const favoritas = freq.reduce((acc, f, i) => (f === maxFreq ? [...acc, i] : acc), [])
    const zonaLectura = favoritas[Math.floor(rng() * favoritas.length)]
    // 72% exacto, 28% zona vecina (horizontal)
    if (rng() < 0.72) return zonaLectura
    const vecina = zonaLectura % 3 !== 2 ? zonaLectura + 1 : zonaLectura - 1
    return vecina
  }
  // Modo azar con sesgo a palos (zonas 0, 2, 3, 5) — arquero menos predecible que puro random
  const sesgoPalos = [0, 2, 3, 5]
  if (rng() < 0.45) return sesgoPalos[Math.floor(rng() * sesgoPalos.length)]
  return Math.floor(rng() * ZONAS_N)
}

/**
 * Resuelve un tiro del jugador:
 * - ATAJADO si misma zona que el arquero.
 * - ATAJADO si zona vecina y rng < iq * 0.5 (estirada; sube con IQ).
 * - GOL en cualquier otro caso.
 */
export function resolverTiro(zonaImpacto, zonaArquero, iq, rng = Math.random) {
  if (zonaImpacto === zonaArquero) return 'atajado'
  const vecina = zonaArquero % 3 !== 2 ? zonaArquero + 1 : zonaArquero - 1
  if (zonaImpacto === vecina && rng() < iq * 0.5) return 'atajado'
  return 'gol'
}

/**
 * Probabilidad de que el rival convierta su penal contra TU arquero.
 * Baja con un buen arquero, sube con arqueros débiles y en rondas avanzadas.
 */
export function probGolRival(rivalKicker, tuArqueroNivel, rondaIdx) {
  const base = 0.62 + rondaIdx * 0.04 // la presión sube en cada ronda
  const ajusteKicker = (rivalKicker.potencia - 85) / 100
  const ajusteArquero = (82 - tuArqueroNivel) / 80
  return Math.min(0.92, Math.max(0.35, base + ajusteKicker + ajusteArquero))
}

/**
 * Evalúa el estado de la tanda (mejor de 5 con cierre anticipado + muerte súbita).
 * Retorna 'sigue' | 'ganaste' | 'perdiste'.
 */
export function veredicto(tuGoles, tuKicks, rivalGoles, rivalKicks) {
  const tirosRestantes = 5 - Math.max(tuKicks, rivalKicks)
  // Cierre anticipado
  if (tuGoles > rivalGoles + tirosRestantes) return 'ganaste'
  if (rivalGoles > tuGoles + tirosRestantes) return 'perdiste'
  // Fin de la ronda regular
  if (tuKicks >= 5 && rivalKicks >= 5) {
    if (tuGoles > rivalGoles) return 'ganaste'
    if (rivalGoles > tuGoles) return 'perdiste'
    // Muerte súbita: ya se habrán añadido tiros extra — aquí no puede llegar empatado
  }
  // Muerte súbita (kicks > 5): comparar totales al final de cada ronda par
  if (tuKicks > 5 && rivalKicks > 5 && tuKicks === rivalKicks) {
    if (tuGoles > rivalGoles) return 'ganaste'
    if (rivalGoles > tuGoles) return 'perdiste'
  }
  return 'sigue'
}

// ─── Self-check (DEV) ────────────────────────────────────────────────────────
if (import.meta.env.DEV) {
  // resolverTiro: misma zona = atajado siempre
  console.assert(resolverTiro(2, 2, 0.9, () => 0) === 'atajado', 'misma zona = atajado')
  // zona lejana con iq alto = gol
  console.assert(resolverTiro(0, 5, 0.9, () => 0.99) === 'gol', 'zona lejana = gol')
  // zona vecina con iq alto y rng bajo = atajado (estirada)
  console.assert(resolverTiro(1, 0, 0.9, () => 0.01) === 'atajado', 'zona vecina + iq alto + rng bajo = atajado')
  // keeperElige: con histZonas repetitivo y iq=1 debe leer zona 0
  const hist = [0, 0, 0, 1, 2]
  const elegida = keeperElige(1.0, hist, () => 0.01)
  console.assert(elegida === 0 || elegida === 1, 'keeper lee zona favorita o vecina')
  // veredicto cierre anticipado
  console.assert(veredicto(4, 4, 0, 4) === 'ganaste', 'cierre anticipado victoria')
  console.assert(veredicto(0, 4, 4, 4) === 'perdiste', 'cierre anticipado derrota')
  console.assert(veredicto(2, 3, 2, 3) === 'sigue', 'tanda sigue')
}
