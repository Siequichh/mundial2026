import { getBracket } from '../services/bracketService'
import { flagClass, nombreCorto } from '../utils/flags'

function ganador(m) {
  if (!m.resultado) return null
  const [h, a] = m.resultado.split('-').map(Number)
  if (h > a) return 'home'
  if (a > h) return 'away'
  if (m.penales) {
    const [ph, pa] = m.penales.split('-').map(Number)
    return ph > pa ? 'home' : 'away'
  }
  return null
}

function Fila({ nombre, score, esGanador }) {
  return (
    <div className={`bk-row ${esGanador ? 'bk-winner' : ''}`}>
      {nombre ? (
        <>
          <span className={`flag flag-sm ${flagClass(nombre)}`} aria-hidden="true" />
          <span className="bk-name">{nombreCorto(nombre)}</span>
        </>
      ) : (
        <span className="bk-name bk-tbd">Por definir</span>
      )}
      <span className="bk-score">{score ?? '–'}</span>
    </div>
  )
}

function Match({ m, lado }) {
  const g = ganador(m)
  const [sh, sa] = m.resultado ? m.resultado.split('-') : [null, null]
  return (
    <div className={`bk-match bk-${lado} ${m.hoy ? 'bk-hoy' : ''}`}>
      {m.hoy && <span className="bk-tag">HOY</span>}
      {m.pendiente ? (
        <div className="bk-pendiente">{m.pendiente}</div>
      ) : (
        <>
          <Fila nombre={m.home} score={sh} esGanador={g === 'home'} />
          <Fila nombre={m.away} score={sa} esGanador={g === 'away'} />
        </>
      )}
      {m.penales && <span className="bk-pen">pen {m.penales}</span>}
      <span className="bk-meta">{m.fecha} · {m.sede}</span>
    </div>
  )
}

function ColumnaTBD({ n, lado, titulo }) {
  return (
    <div className={`bk-col bk-col-${lado}`} data-ronda={titulo}>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} className={`bk-match bk-${lado} bk-vacio`}>
          <div className="bk-pendiente">Por definir</div>
        </div>
      ))}
    </div>
  )
}

export default function BracketFifa() {
  const { dieciseisavos, octavos, cuartos, semis, tercerPuesto, finalMatch } = getBracket()

  return (
    <div className="bracket-scroll">
      <div className="bracket-fifa">
        <div className="bk-col bk-col-izq" data-ronda="Dieciseisavos">
          {dieciseisavos.izquierda.map((m) => <Match key={`${m.home}-${m.away}`} m={m} lado="izq" />)}
        </div>
        <div className="bk-col bk-col-izq" data-ronda="Octavos">
          {octavos.izquierda.map((m) => <Match key={m.sede + m.fecha} m={m} lado="izq" />)}
        </div>
        <div className="bk-col bk-col-izq" data-ronda="Cuartos">
          {cuartos.izquierda.map((m) => <Match key={`${m.home}-${m.away}`} m={m} lado="izq" />)}
        </div>
        <div className="bk-col bk-col-izq" data-ronda="Semifinal">
          {semis.izquierda.map((m) => <Match key={`${m.home}-${m.away}`} m={m} lado="izq" />)}
        </div>

        <div className="bk-col bk-col-final" data-ronda="Final · 19 jul · MetLife">
          <div className="bk-final">
            <span className="bk-trofeo" aria-hidden="true">
              <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="60">
                <path d="M16 8H48V28C48 40 40 50 32 52C24 50 16 40 16 28V8Z" fill="url(#bk-cup)"/>
                <path d="M16 14C10 14 4 18 4 26C4 34 10 38 16 36V14Z" fill="url(#bk-cup)" opacity="0.85"/>
                <path d="M48 14C54 14 60 18 60 26C60 34 54 38 48 36V14Z" fill="url(#bk-cup)" opacity="0.85"/>
                <rect x="8" y="4" width="48" height="6" rx="3" fill="#FFE893"/>
                <path d="M27 52H37V58H27V52Z" fill="url(#bk-cup)"/>
                <path d="M20 58H44V64C44 66 42 68 40 68H24C22 68 20 66 20 64V58Z" fill="url(#bk-cup)"/>
                <rect x="16" y="68" width="32" height="4" rx="1" fill="#006847"/>
                <path d="M14 72H50V78C50 79 49 80 48 80H16C15 80 14 79 14 78V72Z" fill="url(#bk-cup)"/>
                <defs>
                  <linearGradient id="bk-cup" x1="4" y1="4" x2="60" y2="80" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFF4C2"/><stop offset="0.45" stopColor="#F3B705"/><stop offset="1" stopColor="#8A5A00"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            {finalMatch ? (
              <Match m={finalMatch} lado="izq" />
            ) : (
              <div className="bk-match bk-vacio bk-match-final">
                <div className="bk-pendiente">Final</div>
              </div>
            )}
            {tercerPuesto && (
              <div className="bk-tercer">
                <span className="bk-tercer-label">Tercer puesto</span>
                <Match m={tercerPuesto} lado="izq" />
              </div>
            )}
          </div>
        </div>

        <div className="bk-col bk-col-der" data-ronda="Semifinal">
          {semis.derecha.map((m) => <Match key={`${m.home}-${m.away}`} m={m} lado="der" />)}
        </div>
        <div className="bk-col bk-col-der" data-ronda="Cuartos">
          {cuartos.derecha.map((m) => <Match key={`${m.home}-${m.away}`} m={m} lado="der" />)}
        </div>
        <div className="bk-col bk-col-der" data-ronda="Octavos">
          {octavos.derecha.map((m) => <Match key={m.sede + m.fecha} m={m} lado="der" />)}
        </div>
        <div className="bk-col bk-col-der" data-ronda="Dieciseisavos">
          {dieciseisavos.derecha.map((m) => <Match key={`${m.home}-${m.away}`} m={m} lado="der" />)}
        </div>
      </div>
    </div>
  )
}
