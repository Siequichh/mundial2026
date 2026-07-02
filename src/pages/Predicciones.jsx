import { useState } from 'react'
import { getJornadas } from '../services/predictionsService'
import { fechaLarga } from '../utils/fecha'
import PartidoCard from '../components/PartidoCard'
import ModelExplainer from '../components/ModelExplainer'

export default function Predicciones() {
  const jornadas = getJornadas()
  const [showModel, setShowModel] = useState(false)

  return (
    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Análisis e Inteligencia Deportiva</p>
        <h2 className="section-title">Predicciones del Día</h2>
        <p className="section-lede">
          Probabilidades y cuotas calculadas mediante simulación Dixon-Coles y método Monte Carlo. Las proyecciones se recalibran dinámicamente con alineaciones oficiales previas al encuentro.
        </p>

        <div className="pred-explainer-bar">
          <button onClick={() => setShowModel(!showModel)} className="btn-toggle-model">
            <span className="btm-title">METODOLOGÍA PROBABILÍSTICA · ARQUITECTURA DEL MODELO</span>
            <span className="toggle-indicator">{showModel ? 'Ocultar especificación técnica ↑' : 'Ver arquitectura cuantitativa ↓'}</span>
          </button>
        </div>

        {showModel && (
          <div className="pred-model-dropdown">
            <ModelExplainer />
          </div>
        )}

        {jornadas.map((j) => (
          <div className="jornada" key={j.fecha}>
            <div className="jornada-tag">
              <span className="jornada-fecha">{fechaLarga(j.fecha)}</span>
              <span className="jornada-ronda">{j.etiqueta}</span>
            </div>
            <div className="partidos-grid">
              {j.partidos.map((p, i) => <PartidoCard key={p.id} partido={p} index={i} />)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
