import { useState, useCallback } from 'react'
import { jugadores } from '../data/jugadores'
import {
  RONDAS, IQ_RONDA,
  sortearTorneo, simularPartido,
  keeperElige, resolverTiro,
  probGolRival, veredicto,
} from '../utils/torneoPenales'

// ─── Geometría SVG (viewBox 0 0 100 92) ──────────────────────────────────────
const GOAL = { x0: 16.5, x1: 83.5, y0: 13.5, y1: 54 }
const COL_W = (GOAL.x1 - GOAL.x0) / 3
const ROW_H = (GOAL.y1 - GOAL.y0) / 2
const BALL_START = { x: 50, y: 79 }

const ZONAS = [
  { id: 0, x: 0, y: 0, label: 'Palo izquierdo, arriba' },
  { id: 1, x: 1, y: 0, label: 'Centro, arriba' },
  { id: 2, x: 2, y: 0, label: 'Palo derecho, arriba' },
  { id: 3, x: 0, y: 1, label: 'Palo izquierdo, abajo' },
  { id: 4, x: 1, y: 1, label: 'Centro, abajo' },
  { id: 5, x: 2, y: 1, label: 'Palo derecho, abajo' },
]

const centroZona = (id) => {
  const z = ZONAS[id]
  return { x: GOAL.x0 + z.x * COL_W + COL_W / 2, y: GOAL.y0 + z.y * ROW_H + ROW_H / 2 }
}

const jitter = (id) => ({ x: ((id * 7) % 9) - 4, y: ((id * 5) % 7) - 3 })

const CONFETI = Array.from({ length: 22 }, (_, i) => ({
  left: 4 + ((i * 41) % 92),
  delay: (i % 7) * 0.05,
  hue: ['var(--grass)', 'var(--gold)', '#fff', 'var(--sky)', 'var(--danger)'][i % 5],
  drift: ((i * 17) % 50) - 25,
}))

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

// ─── Estadio SVG ─────────────────────────────────────────────────────────────
function Estadio({ estado, zonaArquero, impacto, zonaAim, onZonaTap }) {
  const volando = estado === 'volando'
  const terminado = estado === 'resultado'

  let ballStyle
  if ((volando || terminado) && impacto) {
    const jx = jitter(impacto.zona).x, jy = jitter(impacto.zona).y
    const c = centroZona(impacto.zona)
    ballStyle = { '--tx': `${c.x + jx - BALL_START.x}px`, '--ty': `${c.y + jy - BALL_START.y}px` }
  }

  let gkStyle
  if ((volando || terminado) && zonaArquero !== null) {
    const z = ZONAS[zonaArquero]
    const kx = z.x === 0 ? -20 : z.x === 2 ? 20 : 0
    const ky = z.y === 0 ? -13 : 1
    const rot = z.x === 0 ? -62 : z.x === 2 ? 62 : 0
    gkStyle = { '--kx': `${kx}px`, '--ky': `${ky}px`, '--krot': `${rot}deg` }
  }

  return (
    <svg viewBox="0 0 100 92" className="mk-escena" role="img" aria-label="Estadio de penales">
      <defs>
        <linearGradient id="mk-cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050d0a" />
          <stop offset="1" stopColor="#0d1f16" />
        </linearGradient>
        <linearGradient id="mk-cesped" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#14532d" />
          <stop offset="1" stopColor="#0b3d20" />
        </linearGradient>
        <radialGradient id="mk-foco" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(255,244,194,0.35)" />
          <stop offset="1" stopColor="rgba(255,244,194,0)" />
        </radialGradient>
        <pattern id="mk-red" width="3.2" height="3.2" patternUnits="userSpaceOnUse">
          <path d="M0 1.6 L1.6 0 L3.2 1.6 L1.6 3.2 Z" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="0.35" />
        </pattern>
        <pattern id="mk-publico" width="2.4" height="2" patternUnits="userSpaceOnUse">
          <circle cx="0.7" cy="0.7" r="0.45" fill="rgba(255,255,255,0.08)" />
          <circle cx="1.9" cy="1.5" r="0.45" fill="rgba(255,255,255,0.05)" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="100" height="58" fill="url(#mk-cielo)" />
      <rect x="0" y="0" width="100" height="20" fill="url(#mk-publico)" />
      <rect x="0" y="19.4" width="100" height="1.2" fill="rgba(255,255,255,0.07)" />
      <ellipse cx="8" cy="4" rx="26" ry="14" fill="url(#mk-foco)" />
      <ellipse cx="92" cy="4" rx="26" ry="14" fill="url(#mk-foco)" />

      <rect x="0" y="54" width="100" height="38" fill="url(#mk-cesped)" />
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i}
          points={`${12 + i * 19},54 ${21.5 + i * 19},54 ${18 + i * 22},92 ${-4 + i * 22},92`}
          fill="rgba(255,255,255,0.045)"
        />
      ))}
      <polygon points="24,54 76,54 92,78 8,78" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.7" />
      <path d="M 36 78 Q 50 87 64 78" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />

      <rect x={GOAL.x0} y={GOAL.y0} width={GOAL.x1 - GOAL.x0} height={GOAL.y1 - GOAL.y0} fill="rgba(0,0,0,0.35)" />
      <rect x={GOAL.x0} y={GOAL.y0} width={GOAL.x1 - GOAL.x0} height={GOAL.y1 - GOAL.y0} fill="url(#mk-red)" />

      {ZONAS.map((z) => {
        const zx = GOAL.x0 + z.x * COL_W
        const zy = GOAL.y0 + z.y * ROW_H
        const activa = zonaAim === z.id && estado === 'apuntar'
        const marcada = terminado && impacto?.zona === z.id
        return (
          <g key={z.id}>
            {(activa || marcada) && (
              <rect
                x={zx + 0.8} y={zy + 0.8} width={COL_W - 1.6} height={ROW_H - 1.6} rx="1.5"
                fill={marcada
                  ? (impacto.zona === zonaArquero ? 'rgba(255,92,116,0.22)' : 'rgba(38,194,129,0.25)')
                  : 'rgba(242,183,5,0.16)'}
                stroke={activa ? 'var(--gold)' : 'none'}
                strokeWidth="0.5"
                strokeDasharray={activa ? '2 1.5' : undefined}
                className={activa ? 'mk-zona-aim' : undefined}
              />
            )}
            <rect x={zx} y={zy} width={COL_W} height={ROW_H} fill="transparent"
              className="mk-zona-tap" role="button" aria-label={`Disparar: ${z.label}`}
              onClick={() => onZonaTap(z.id)}
            />
          </g>
        )
      })}

      <g stroke="#f5f7f4" strokeWidth="1.9" strokeLinecap="round" fill="none">
        <path d={`M ${GOAL.x0 - 0.9} ${GOAL.y1} V ${GOAL.y0 - 0.9} H ${GOAL.x1 + 0.9} V ${GOAL.y1}`} />
      </g>
      <line x1={GOAL.x0 - 3} y1={GOAL.y1 + 0.4} x2={GOAL.x1 + 3} y2={GOAL.y1 + 0.4}
        stroke="rgba(255,255,255,0.5)" strokeWidth="0.7" />

      <g className={`mk-gk ${volando || terminado ? 'mk-gk-dive' : 'mk-gk-idle'}`} style={gkStyle} aria-hidden="true">
        <line x1="48.4" y1="53.6" x2="49.2" y2="47.5" stroke="#0e1713" strokeWidth="1.7" strokeLinecap="round" />
        <line x1="51.6" y1="53.6" x2="50.8" y2="47.5" stroke="#0e1713" strokeWidth="1.7" strokeLinecap="round" />
        <rect x="46.2" y="38.6" width="7.6" height="9.6" rx="2.2" fill="var(--gold)" />
        <rect x="46.2" y="38.6" width="7.6" height="3" rx="1.5" fill="rgba(0,0,0,0.18)" />
        <line x1="46.6" y1="40.6" x2="42.2" y2="36.2" stroke="var(--gold)" strokeWidth="1.7" strokeLinecap="round" />
        <line x1="53.4" y1="40.6" x2="57.8" y2="36.2" stroke="var(--gold)" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="41.7" cy="35.7" r="1.25" fill="#f5f7f4" />
        <circle cx="58.3" cy="35.7" r="1.25" fill="#f5f7f4" />
        <circle cx="50" cy="35.6" r="2.5" fill="#d9a066" />
      </g>

      {!volando && !terminado && (
        <ellipse cx={BALL_START.x} cy={BALL_START.y + 3.4} rx="4" ry="1.1" fill="rgba(0,0,0,0.4)" />
      )}

      <g className={`mk-ball ${volando || terminado ? 'mk-ball-fly' : 'mk-ball-idle'}`} style={ballStyle} aria-hidden="true">
        <circle cx={BALL_START.x} cy={BALL_START.y} r="3.3" fill="#fdfdfb" stroke="rgba(0,0,0,0.35)" strokeWidth="0.3" />
        <path d={`M ${BALL_START.x} ${BALL_START.y - 1.7} l 1.6 1.1 l -0.6 1.9 h -2 l -0.6 -1.9 Z`} fill="#1a1a1a" />
        <path d={`M ${BALL_START.x - 3} ${BALL_START.y - 1} q 1 -1.6 3 -2.2 M ${BALL_START.x + 3} ${BALL_START.y - 1} q -1 -1.6 -3 -2.2`}
          fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="0.35"
        />
      </g>
    </svg>
  )
}

// ─── Selector de pateador ────────────────────────────────────────────────────
function StatBar({ label, valor, color }) {
  return (
    <div className="mk-stat">
      <span className="mk-stat-label">{label}</span>
      <span className="mk-stat-track">
        <span className="mk-stat-fill" style={{ width: `${valor}%`, background: color }} />
      </span>
      <span className="mk-stat-num">{valor}</span>
    </div>
  )
}

function SelectorJugador({ onSelect }) {
  return (
    <div className="mk-selector">
      <div className="mk-selector-head">
        <span className="mk-selector-kicker">Paso 1 — Elige tu figura</span>
        <h3 className="mk-selector-titulo">¿Quién pateas?</h3>
        <p className="mk-selector-sub">Cada jugador trae su propio arquero. Los rivales del torneo se sortean al azar.</p>
      </div>
      <div className="mk-jugadores-grid">
        {jugadores.map((j, i) => (
          <button key={j.id} className="mk-card" style={{ '--i': i }} onClick={() => onSelect(j)} type="button"
            aria-label={`${j.nombre} (${j.pais})`}>
            <span className="mk-card-top">
              <span className={`flag flag-sm ${j.flagCls}`} aria-hidden="true" />
              <span className="mk-card-pais">{j.paisCorto}</span>
            </span>
            <span className="mk-card-nombre">{j.nombre}</span>
            <span className="mk-card-arquero">🧤 {j.arquero.nombre}</span>
            <span className="mk-card-stats">
              <StatBar label="POT" valor={j.potencia} color="var(--gold)" />
              <StatBar label="PRE" valor={j.precision} color="var(--grass)" />
              <StatBar label="ARQ" valor={j.arquero.nivel} color="var(--sky)" />
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Llave del torneo ────────────────────────────────────────────────────────
function Chip({ jugador, esGanador, marcador, esTu }) {
  if (!jugador) return <span className="tk-chip tk-chip-tbd">?</span>
  return (
    <span className={`tk-chip ${esGanador ? 'tk-chip-winner' : ''} ${esTu ? 'tk-chip-tu' : ''}`}>
      <span className={`flag flag-sm ${jugador.flagCls}`} aria-hidden="true" />
      <span className="tk-chip-nombre">{jugador.paisCorto}</span>
      {marcador !== null && <span className="tk-chip-score">{marcador}</span>}
    </span>
  )
}

function Llave({ rondas, rondaIdx, tuId }) {
  // Construir ronda a ronda; solo mostrar hasta la ronda actual + 1
  return (
    <div className="tk-llave-scroll" role="region" aria-label="Llave del torneo">
      <div className="tk-llave">
        {RONDAS.map((nombreRonda, ri) => {
          const partidos = rondas[ri] ?? []
          return (
            <div key={ri} className={`tk-col ${ri <= rondaIdx ? 'tk-col-activa' : 'tk-col-futura'}`}>
              <span className="tk-col-label">{nombreRonda}</span>
              <div className="tk-col-matches">
                {partidos.length === 0
                  ? Array.from({ length: Math.pow(2, 3 - ri) / 2 }, (_, i) => (
                    <div key={i} className="tk-match tk-match-tbd">
                      <span className="tk-chip tk-chip-tbd">?</span>
                      <span className="tk-vs-sep">·</span>
                      <span className="tk-chip tk-chip-tbd">?</span>
                    </div>
                  ))
                  : partidos.map((m, mi) => {
                    const esTuPartido = m.esTuyo
                    const ganadorA = m.ganador === m.a?.id
                    const ganadorB = m.ganador === m.b?.id
                    const mA = m.marcador ? m.marcador[0] : null
                    const mB = m.marcador ? m.marcador[1] : null
                    return (
                      <div key={mi} className={`tk-match ${esTuPartido ? 'tk-match-tuyo' : ''}`}>
                        <Chip jugador={m.a} esGanador={ganadorA} marcador={mA} esTu={m.a?.id === tuId} />
                        <span className="tk-vs-sep">{m.ganador ? '·' : 'vs'}</span>
                        <Chip jugador={m.b} esGanador={ganadorB} marcador={mB} esTu={m.b?.id === tuId} />
                      </div>
                    )
                  })
                }
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Pantalla de sorteo ──────────────────────────────────────────────────────
function PantallaSorteo({ yo, rival, rondas, rondaIdx, onComenzar }) {
  return (
    <div className="tk-sorteo">
      <p className="tk-sorteo-kicker">Sorteo realizado</p>
      <div className="tk-vs-card">
        <div className="tk-vs-lado tk-vs-yo">
          <span className={`flag ${yo.flagCls}`} aria-hidden="true" />
          <strong>{yo.nombre}</strong>
          <span className="tk-vs-arquero">🧤 {yo.arquero.nombre}</span>
        </div>
        <div className="tk-vs-centro">
          <span className="tk-vs-ronda">{RONDAS[rondaIdx]}</span>
          <span className="tk-vs-vs">VS</span>
        </div>
        <div className="tk-vs-lado tk-vs-rival">
          <span className={`flag ${rival.flagCls}`} aria-hidden="true" />
          <strong>{rival.nombre}</strong>
          <span className="tk-vs-arquero">🧤 {rival.arquero.nombre}</span>
        </div>
      </div>
      <Llave rondas={rondas} rondaIdx={rondaIdx} tuId={yo.id} />
      <button className="mk-btn" type="button" onClick={onComenzar}>
        Comenzar → {RONDAS[rondaIdx]}
      </button>
    </div>
  )
}

// ─── Barra VS del partido ────────────────────────────────────────────────────
function BarraVS({ yo, rival, rondaIdx, tanda }) {
  return (
    <div className="tk-partida-head">
      <span className="tk-partida-ronda">{RONDAS[rondaIdx]}</span>
      <div className="tk-partida-vs">
        <span className="tk-partida-lado">
          <span className={`flag flag-sm ${yo.flagCls}`} aria-hidden="true" />
          <span className="tk-partida-nombre">{yo.nombre}</span>
        </span>
        <div className="tk-partida-score">
          <span className="tk-ps-yo">{tanda.tuGoles}</span>
          <span className="tk-ps-sep">–</span>
          <span className="tk-ps-rival">{tanda.rivalGoles}</span>
        </div>
        <span className="tk-partida-lado tk-partida-lado-r">
          <span className="tk-partida-nombre">{rival.nombre}</span>
          <span className={`flag flag-sm ${rival.flagCls}`} aria-hidden="true" />
        </span>
      </div>
      <span className="tk-partida-arquero">Arquero rival: {rival.arquero.nombre}</span>
    </div>
  )
}

// ─── Slots de tanda ──────────────────────────────────────────────────────────
function Tanda({ tanda, total = 5 }) {
  return (
    <div className="tk-tanda">
      <div className="tk-tanda-fila tk-tanda-yo">
        <span className="tk-tanda-etiq">TÚ</span>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`mk-dot ${tanda.tuHist[i] ?? 'pendiente'}`} aria-label={tanda.tuHist[i] ?? 'pendiente'} />
        ))}
      </div>
      <div className="tk-tanda-fila tk-tanda-rival">
        <span className="tk-tanda-etiq">RIVAL</span>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`mk-dot ${tanda.rivalHist[i] ?? 'pendiente'}`} aria-label={tanda.rivalHist[i] ?? 'pendiente'} />
        ))}
      </div>
    </div>
  )
}

// ─── Estado inicial de tanda ─────────────────────────────────────────────────
const tandaVacia = () => ({ tuGoles: 0, tuKicks: 0, rivalGoles: 0, rivalKicks: 0, tuHist: [], rivalHist: [] })

// ─── Componente principal ────────────────────────────────────────────────────
export default function MagicalKicks() {
  // Máquina de estados del torneo
  const [fase, setFase] = useState('seleccion')
  // seleccion | sorteo | partido | entreronda | campeon | eliminado

  // Bracket: array de rondas; cada ronda = array de matches
  const [rondas, setRondas] = useState([])
  const [rondaIdx, setRondaIdx] = useState(0)

  // Jugador elegido
  const [yo, setYo] = useState(null)

  // Historial de zonas disparadas en TODO el torneo (para lectura del keeper)
  const [histZonas, setHistZonas] = useState([])

  // Estado del partido activo
  const [tanda, setTanda] = useState(tandaVacia())
  const [escena, setEscena] = useState('apuntar') // apuntar | volando | resultado
  const [zonaArquero, setZonaArquero] = useState(null)
  const [impacto, setImpacto] = useState(null)
  const [zonaAim, setZonaAim] = useState(null)
  const [drag, setDrag] = useState(null)
  const [finPartido, setFinPartido] = useState(null) // 'ganaste' | 'perdiste'

  // ── Helpers de bracket ───────────────────────────────────────────────────
  const tuRival = rondas[rondaIdx]?.[0]?.b ?? null

  const iq = clamp(
    (IQ_RONDA[rondaIdx] ?? 0.82) + (tuRival ? (tuRival.arquero.nivel - 82) / 200 : 0),
    0.25, 0.96
  )

  // ── Elegir jugador ────────────────────────────────────────────────────────
  const elegirJugador = useCallback((j) => {
    setYo(j)
    const octavos = sortearTorneo(jugadores, j.id)
    setRondas([octavos])
    setRondaIdx(0)
    setHistZonas([])
    setTanda(tandaVacia())
    setEscena('apuntar')
    setFinPartido(null)
    setZonaArquero(null)
    setImpacto(null)
    setZonaAim(null)
    setFase('sorteo')
  }, [])

  // ── Disparar ──────────────────────────────────────────────────────────────
  const disparar = useCallback((zonaId) => {
    if (escena !== 'apuntar' || !yo || !tuRival) return
    const za = keeperElige(iq, histZonas)
    setZonaArquero(za)
    setImpacto({ zona: zonaId })
    setZonaAim(null)
    setEscena('volando')

    const resJugador = resolverTiro(zonaId, za, iq)

    const nuevasHistZonas = [...histZonas, zonaId]

    // Simular penal del rival contra mi arquero
    const probRival = probGolRival(tuRival, yo.arquero.nivel, rondaIdx)
    const resRival = Math.random() < probRival ? 'gol' : 'atajado'

    setTimeout(() => {
      setHistZonas(nuevasHistZonas)
      setTanda((prev) => {
        const nuevo = {
          tuGoles: prev.tuGoles + (resJugador === 'gol' ? 1 : 0),
          tuKicks: prev.tuKicks + 1,
          rivalGoles: prev.rivalGoles + (resRival === 'gol' ? 1 : 0),
          rivalKicks: prev.rivalKicks + 1,
          tuHist: [...prev.tuHist, resJugador],
          rivalHist: [...prev.rivalHist, resRival],
        }
        const v = veredicto(nuevo.tuGoles, nuevo.tuKicks, nuevo.rivalGoles, nuevo.rivalKicks)
        if (v !== 'sigue') setFinPartido(v)
        return nuevo
      })
      setEscena('resultado')
    }, 650)
  }, [escena, yo, tuRival, histZonas, rondaIdx, iq])

  // ── Siguiente tiro ────────────────────────────────────────────────────────
  const siguienteTiro = useCallback(() => {
    setZonaArquero(null)
    setImpacto(null)
    setEscena('apuntar')
  }, [])

  // ── Avanzar ronda ─────────────────────────────────────────────────────────
  const avanzarRonda = useCallback(() => {
    if (!finPartido || !yo || !tuRival) return
    const ganaste = finPartido === 'ganaste'

    // Actualizar mi partido en el bracket
    const rondasCopia = rondas.map((r) => r.map((m) => ({ ...m })))
    const miPartido = rondasCopia[rondaIdx][0]
    miPartido.ganador = ganaste ? yo.id : tuRival.id
    miPartido.marcador = [tanda.tuGoles, tanda.rivalGoles]

    if (!ganaste) {
      setRondas(rondasCopia)
      setFase('eliminado')
      return
    }

    // Simular el resto de la ronda
    for (let i = 1; i < rondasCopia[rondaIdx].length; i++) {
      const m = rondasCopia[rondaIdx][i]
      const { ganadorId, marcador } = simularPartido(m.a, m.b)
      m.ganador = ganadorId
      m.marcador = marcador
    }

    const sigIdx = rondaIdx + 1
    if (sigIdx >= RONDAS.length) {
      setRondas(rondasCopia)
      setFase('campeon')
      return
    }

    // Construir siguiente ronda con los ganadores
    const completada = rondasCopia[rondaIdx]
    const ganadores = completada.map((m) => (m.ganador === m.a.id ? m.a : m.b))
    const sigRonda = []
    for (let i = 0; i < ganadores.length; i += 2) {
      const ga = ganadores[i], gb = ganadores[i + 1]
      sigRonda.push({ a: ga, b: gb, ganador: null, marcador: null, esTuyo: ga?.id === yo.id || gb?.id === yo.id })
    }
    rondasCopia.push(sigRonda)
    setRondas(rondasCopia)
    setRondaIdx(sigIdx)
    setTanda(tandaVacia())
    setEscena('apuntar')
    setFinPartido(null)
    setZonaArquero(null)
    setImpacto(null)
    setFase('entreronda')
  }, [finPartido, yo, tuRival, rondas, rondaIdx, tanda])

  const comenzarPartido = () => setFase('partido')

  const reiniciar = () => {
    setFase('seleccion')
    setYo(null)
    setRondas([])
    setRondaIdx(0)
    setHistZonas([])
    setTanda(tandaVacia())
    setEscena('apuntar')
    setFinPartido(null)
    setZonaArquero(null)
    setImpacto(null)
    setZonaAim(null)
    setDrag(null)
  }

  // ── Drag (apuntado por slingshot) ─────────────────────────────────────────
  const zonaDesdeDrag = (dx, dy) => {
    const col = dx < -16 ? 0 : dx > 16 ? 2 : 1
    const fila = dy < -10 ? 0 : 1
    return ZONAS.find((z) => z.x === col && z.y === fila)?.id ?? null
  }
  const onPointerDown = (e) => {
    if (escena !== 'apuntar') return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ startX: e.clientX, startY: e.clientY })
  }
  const onPointerMove = (e) => {
    if (!drag || escena !== 'apuntar') return
    const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY
    if (Math.abs(dx) + Math.abs(dy) > 12) setZonaAim(zonaDesdeDrag(dx, dy))
  }
  const onPointerUp = (e) => {
    if (!drag) return
    const dx = e.clientX - drag.startX, dy = e.clientY - drag.startY
    setDrag(null)
    if (Math.abs(dx) + Math.abs(dy) < 12) { setZonaAim(null); return }
    const z = zonaDesdeDrag(dx, dy)
    if (z !== null) disparar(z)
  }

  const ultimo = tanda.tuHist[tanda.tuHist.length - 1]

  // ── Render por fase ───────────────────────────────────────────────────────
  if (fase === 'seleccion') {
    return <div className="mk-wrap"><SelectorJugador onSelect={elegirJugador} /></div>
  }

  if (fase === 'sorteo' && yo) {
    const rival = rondas[0]?.[0]?.b
    if (!rival) return null
    return (
      <div className="mk-wrap">
        <PantallaSorteo yo={yo} rival={rival} rondas={rondas} rondaIdx={0} onComenzar={comenzarPartido} />
      </div>
    )
  }

  if (fase === 'entreronda' && yo) {
    const nuevoRival = rondas[rondaIdx]?.[0]?.b
    return (
      <div className="mk-wrap">
        <div className="tk-entreronda">
          <span className="tk-sorteo-kicker">Clasificado</span>
          <h3 className="tk-entreronda-titulo">{RONDAS[rondaIdx]}</h3>
          <div className="tk-vs-card">
            <div className="tk-vs-lado tk-vs-yo">
              <span className={`flag ${yo.flagCls}`} aria-hidden="true" />
              <strong>{yo.nombre}</strong>
              <span className="tk-vs-arquero">🧤 {yo.arquero.nombre}</span>
            </div>
            <div className="tk-vs-centro">
              <span className="tk-vs-ronda">{RONDAS[rondaIdx]}</span>
              <span className="tk-vs-vs">VS</span>
            </div>
            <div className="tk-vs-lado tk-vs-rival">
              <span className={`flag ${nuevoRival?.flagCls}`} aria-hidden="true" />
              <strong>{nuevoRival?.nombre}</strong>
              <span className="tk-vs-arquero">🧤 {nuevoRival?.arquero.nombre}</span>
            </div>
          </div>
          <Llave rondas={rondas} rondaIdx={rondaIdx} tuId={yo.id} />
          <button className="mk-btn" type="button" onClick={comenzarPartido}>
            Continuar → {RONDAS[rondaIdx]}
          </button>
        </div>
      </div>
    )
  }

  if (fase === 'campeon' && yo) {
    return (
      <div className="mk-wrap">
        <div className="tk-campeon">
          <span className="mk-confeti" aria-hidden="true">
            {CONFETI.map((c, i) => (
              <i key={i} style={{ left: `${c.left}%`, background: c.hue, animationDelay: `${c.delay}s`, '--drift': `${c.drift}px` }} />
            ))}
          </span>
          <span className="tk-campeon-trofeo" aria-hidden="true">🏆</span>
          <span className="tk-campeon-kicker">¡Campeón del torneo!</span>
          <h3 className="tk-campeon-titulo">{yo.nombre}</h3>
          <p className="tk-campeon-sub">{yo.pais} — {yo.arquero.nombre}</p>
          <Llave rondas={rondas} rondaIdx={rondaIdx} tuId={yo.id} />
          <button className="mk-btn" type="button" onClick={reiniciar}>Jugar de nuevo</button>
        </div>
      </div>
    )
  }

  if (fase === 'eliminado' && yo) {
    return (
      <div className="mk-wrap">
        <div className="tk-eliminado">
          <span className="tk-eliminado-icono" aria-hidden="true">⛔</span>
          <span className="tk-campeon-kicker">Eliminado en {RONDAS[rondaIdx]}</span>
          <h3 className="tk-eliminado-titulo">{tuRival?.nombre ?? 'el rival'} fue mejor</h3>
          <p className="tk-campeon-sub">{tanda.tuGoles} – {tanda.rivalGoles}</p>
          <Llave rondas={rondas} rondaIdx={rondaIdx} tuId={yo.id} />
          <button className="mk-btn" type="button" onClick={reiniciar}>Intentar de nuevo</button>
        </div>
      </div>
    )
  }

  // ── Partido ───────────────────────────────────────────────────────────────
  if (!yo || !tuRival) return null

  return (
    <div className="mk-wrap">
      <div className="mk-juego">
        <BarraVS yo={yo} rival={tuRival} rondaIdx={rondaIdx} tanda={tanda} />
        <Tanda tanda={tanda} />

        <div className="mk-campo"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <Estadio
            estado={escena}
            zonaArquero={zonaArquero}
            impacto={impacto}
            zonaAim={zonaAim}
            onZonaTap={(z) => escena === 'apuntar' && disparar(z)}
          />

          {escena === 'resultado' && !finPartido && (
            <div className={`mk-overlay mk-overlay-${ultimo}`} aria-live="assertive">
              {ultimo === 'gol' && (
                <span className="mk-confeti" aria-hidden="true">
                  {CONFETI.slice(0, 12).map((c, i) => (
                    <i key={i} style={{ left: `${c.left}%`, background: c.hue, animationDelay: `${c.delay}s`, '--drift': `${c.drift}px` }} />
                  ))}
                </span>
              )}
              <span className="mk-overlay-texto">{ultimo === 'gol' ? '¡GOOOL!' : '¡ATAJADO!'}</span>
            </div>
          )}

          {escena === 'resultado' && finPartido && (
            <div className={`mk-overlay mk-overlay-fin mk-overlay-${finPartido}`} aria-live="assertive">
              {finPartido === 'ganaste' && (
                <span className="mk-confeti" aria-hidden="true">
                  {CONFETI.map((c, i) => (
                    <i key={i} style={{ left: `${c.left}%`, background: c.hue, animationDelay: `${c.delay}s`, '--drift': `${c.drift}px` }} />
                  ))}
                </span>
              )}
              <span className="mk-overlay-texto">
                {finPartido === 'ganaste' ? '¡CLASIFICADO!' : '¡ELIMINADO!'}
              </span>
              <span className="mk-overlay-sub">
                {tanda.tuGoles} – {tanda.rivalGoles}
              </span>
            </div>
          )}
        </div>

        <div className="mk-accion">
          {escena === 'apuntar' && (
            <p className="mk-hint">
              <span className="mk-hint-icon" aria-hidden="true">◎</span>
              {zonaAim !== null ? 'Suelta para disparar' : 'Arrastra para apuntar · o toca una zona del arco'}
            </p>
          )}
          {escena === 'volando' && <p className="mk-hint mk-hint-live">● EN EL AIRE…</p>}
          {escena === 'resultado' && !finPartido && (
            <button className="mk-btn" type="button" onClick={siguienteTiro}>
              Siguiente tiro →
            </button>
          )}
          {escena === 'resultado' && finPartido && (
            <button className="mk-btn" type="button" onClick={avanzarRonda}>
              {finPartido === 'ganaste'
                ? `Continuar a ${rondaIdx + 1 < RONDAS.length ? RONDAS[rondaIdx + 1] : '¡Final!'} →`
                : 'Ver resultado final'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
