import { getCombinadasDelDia } from '../services/predictionsService'

const CLASES = { segura: 'combo-segura', valor: 'combo-valor', arriesgada: 'combo-arriesgada', betbuilder: 'combo-betbuilder' }
const PREMIO_BASE = 10

export default function CombinadasSugeridas() {
  const combinadas = getCombinadasDelDia()
  if (!combinadas.length) return null

  return (
    <div className="combinadas-section">
      <div className="comb-header">
        <span className="comb-eyebrow">ARMADAS DESDE LOS PICKS DEL MODELO</span>
        <h3 className="comb-title">Combinadas sugeridas</h3>
        <p className="comb-sub">Combinadas del mismo partido (segura → valor → arriesgada) y Bet Builder. Todo resultado tómalo a tu consideración.</p>
      </div>

      <div className="combo-cards">
        {combinadas.map((c, idx) => (
          <div key={`${c.perfil}-${idx}`} className={`combo-card ${CLASES[c.perfil]}`}>
            <div className="combo-top">
              <span className="combo-perfil">{c.emoji} {c.titulo}</span>
              {c.mismoPartido && <span className="combo-sgp-badge">MISMO PARTIDO</span>}
              {c.riesgoAlto && <span className="riesgo-alto combo-riesgo">ALTO RIESGO</span>}
            </div>

            {c.mismoPartido && <span className="combo-match">{c.mismoPartido}</span>}

            <div className="combo-cuota-total">
              <span className="cqt-num">{c.cuotaTotal}</span>
              <span className="cqt-label">cuota total</span>
            </div>

            <ul className="combo-legs">
              {c.legs.map((leg, i) => (
                <li key={c.mismoPartido ? `${leg.seleccion}-${i}` : leg.partido} className="combo-leg">
                  {!c.mismoPartido && <span className="cl-partido">{leg.partido}</span>}
                  <span className="cl-sel">
                    {leg.texto}
                    {leg.chip && <span className="mkt-chip">{leg.chip}</span>}
                  </span>
                  <span className="cl-cuota">@{leg.cuota}</span>
                </li>
              ))}
            </ul>

            {c.mismoPartido && (
              <p className="combo-corr-note">
                Cuota ajustada por correlación (los mercados del mismo partido no son independientes; la casa paga menos que multiplicar). Sin ajustar sería @{c.cuotaSinAjuste}.
              </p>
            )}

            <div className="combo-foot">
              <span className="combo-prob">Prob. combinada: {c.probCombinada}%{c.mismoPartido && ' (aprox.)'}</span>
              <span className="combo-premio">
                S/ {PREMIO_BASE} → <b>S/ {(PREMIO_BASE * c.cuotaTotal).toFixed(2)}</b>
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="comb-disclaimer">
        Las cuotas mostradas son estimaciones del modelo (100/probabilidad) o de mercado al momento de la predicción.
        Verifica la cuota real en tu casa antes de apostar. Esto es solo para prode y análisis.
      </p>
    </div>
  )
}
