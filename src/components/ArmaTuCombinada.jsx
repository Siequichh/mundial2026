import { useState, useMemo } from 'react'
import { getJornadaDelDia } from '../services/predictionsService'
import { poolDePartido } from '../utils/mercadoPool'
import { combinar, combinarMismoPartido } from '../utils/combinadas'

const TIER_LABEL = { seguro: 'Seguro', medio: 'Medio', bajo: 'Bajo', arriesgado: 'Arriesg.' }
const TIER_CLS   = { seguro: 'conf-alta', medio: 'conf-media', bajo: 'conf-baja', arriesgado: 'tier-arr' }
const FILTROS    = ['todos', 'seguro', 'medio', 'bajo', 'arriesgado']

export default function ArmaTuCombinada() {
  const jornada = getJornadaDelDia()
  const futuros = (jornada?.partidos ?? []).filter(p => !p.resultadoReal)
  const [selected, setSelected] = useState({})   // { id: leg }
  const [stake, setStake]       = useState(10)
  const [filtro, setFiltro]     = useState('todos')

  if (futuros.length === 0) return null

  const pools = futuros.map(p => ({
    partido: p,
    legs: poolDePartido(p).filter(l =>
      filtro === 'todos' || l.tier === filtro
    ),
  })).filter(({ legs }) => legs.length > 0)

  const selectedLegs = Object.values(selected)

  // Todos los legs del mismo partido (≥2) = bet builder → cuota ajustada por correlación.
  const partidosUnicos = new Set(selectedLegs.map(l => l.partidoId)).size
  const esBetBuilder = selectedLegs.length >= 2 && partidosUnicos === 1

  const resultado = useMemo(() => {
    if (selectedLegs.length < 1) return null
    return esBetBuilder ? combinarMismoPartido(selectedLegs) : combinar(selectedLegs)
  }, [selectedLegs, esBetBuilder])

  // Aviso de correlación solo cuando hay legs del mismo partido MEZCLADOS con otros partidos
  // (ahí no aplicamos ajuste porque el cálculo mixto sería aproximado).
  const hayCorrelacion = !esBetBuilder && partidosUnicos < selectedLegs.length

  function toggle(leg) {
    setSelected(prev => {
      if (prev[leg.id]) {
        const { [leg.id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [leg.id]: leg }
    })
  }

  function limpiar() { setSelected({}) }

  return (
    <details className="armador-section">
      <summary className="armador-head">
        <span className="comb-eyebrow">CALCULADORA INTERACTIVA</span>
        <h3 className="comb-title">Arma tu combinada</h3>
        <p className="comb-sub">Selecciona mercados de distintos partidos y calcula cuota + probabilidad en tiempo real.</p>
      </summary>

      <div className="armador-filtros">
        {FILTROS.map(f => (
          <button
            key={f}
            className={`armador-filtro-btn${filtro === f ? ' active' : ''}`}
            onClick={() => setFiltro(f)}
          >
            {f === 'todos' ? 'Todos' : TIER_LABEL[f]}
          </button>
        ))}
      </div>

      <div className="armador-body">
        <div className="armador-mercados">
          {pools.map(({ partido, legs }) => (
            <div key={partido.id} className="armador-match">
              <div className="am-header">
                <span className="am-label">{partido.home} vs {partido.away}</span>
              </div>
              <ul className="am-list">
                {legs.map(leg => {
                  const isOn = !!selected[leg.id]
                  return (
                    <li
                      key={leg.id}
                      className={`am-item${isOn ? ' selected' : ''}${leg.riesgoAlto ? ' riesgo-alto-item' : ''}`}
                      onClick={() => toggle(leg)}
                    >
                      <input
                        type="checkbox"
                        className="ami-check"
                        checked={isOn}
                        onChange={() => toggle(leg)}
                        onClick={e => e.stopPropagation()}
                      />
                      <div className="ami-info">
                        <span className="ami-sel">
                          {leg.texto}
                          {leg.chip && <span className="mkt-chip">{leg.chip}</span>}
                          {leg.riesgoAlto && <span className="riesgo-alto ami-riesgo">RIESGO</span>}
                        </span>
                        {leg.nota && <span className="ami-nota">{leg.nota}</span>}
                      </div>
                      <div className="ami-meta">
                        <span className={`ami-prob ${TIER_CLS[leg.tier]}`}>{leg.prob}%</span>
                        <span className="ami-cuota">@{leg.cuota}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="armador-slip">
          <div className="slip-head">
            <span className="slip-title">Tu apuesta</span>
            {selectedLegs.length > 0 && (
              <button className="slip-limpiar" onClick={limpiar}>Limpiar</button>
            )}
          </div>

          {selectedLegs.length === 0 ? (
            <p className="slip-empty">Marca mercados de la izquierda para armar tu combinada.</p>
          ) : (
            <>
              <ul className="slip-legs">
                {selectedLegs.map(l => (
                  <li key={l.id} className="slip-leg">
                    <button className="sl-remove" onClick={() => toggle(l)} title="Quitar">×</button>
                    <div className="sl-body">
                      <span className="sl-partido">{l.partido}</span>
                      <span className="sl-sel">
                        {l.texto}
                        {l.chip && <span className="mkt-chip">{l.chip}</span>}
                      </span>
                    </div>
                    <span className="sl-cuota">@{l.cuota}</span>
                  </li>
                ))}
              </ul>

              {esBetBuilder && (
                <p className="slip-betbuilder">
                  🎯 Bet Builder (mismo partido): cuota ajustada por correlación, como en las casas de apuestas. Sin ajustar sería @{resultado?.cuotaSinAjuste}.
                </p>
              )}

              {hayCorrelacion && (
                <p className="slip-corr">
                  ⚠ Mezclas mercados del mismo partido con otros: la multiplicación no ajusta por correlación. Para un Bet Builder, elige solo mercados de un mismo juego.
                </p>
              )}

              {resultado && (
                <div className="slip-result">
                  <div className="sr-cuota">
                    <span className="sr-num">{resultado.cuotaTotal}</span>
                    <span className="sr-lbl">cuota total</span>
                  </div>
                  <div className="sr-prob">Prob. combinada: <b>{resultado.probCombinada}%</b>{esBetBuilder && ' (aprox.)'}</div>
                  <div className="slip-stake">
                    <label className="stake-label">Apuesta S/</label>
                    <input
                      type="number"
                      className="stake-input"
                      value={stake}
                      min={1}
                      onChange={e => setStake(Number(e.target.value) || 1)}
                    />
                    <span className="stake-payout">
                      → <b>S/ {(stake * resultado.cuotaTotal).toFixed(2)}</b>
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
          <p className="slip-disclaimer">Algunos mercados (hándicap, corners por equipo, disparos, atajadas, par/impar, rango de goles) son estimaciones del modelo cuando la casa no cotiza esa línea puntual. Verifica la cuota real en tu casa de apuestas antes de jugar.</p>
        </div>
      </div>
    </details>
  )
}
