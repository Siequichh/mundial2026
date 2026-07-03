import { useState } from 'react'
import { getJornadas } from '../services/predictionsService'
import { fechaLarga } from '../utils/fecha'
import PartidoCard from '../components/PartidoCard'
import ModelExplainer from '../components/ModelExplainer'
import CombinadasSugeridas from '../components/CombinadasSugeridas'

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

        <details className="glosario">
          <summary className="glosario-toggle">¿Qué significa cada mercado?</summary>
          <div className="glosario-body">
            <table className="glosario-tabla">
              <thead><tr><th>Término</th><th>Significado</th><th>Chip</th></tr></thead>
              <tbody>
                <tr><td>Más de X goles</td><td>El partido termina con más de X goles en total (ej. +2.5 = al menos 3 goles)</td><td>+2.5</td></tr>
                <tr><td>Menos de X goles</td><td>El partido termina con menos de X goles (ej. −2.5 = máximo 2 goles)</td><td>−2.5</td></tr>
                <tr><td>Ambos anotan</td><td>Los dos equipos marcan al menos un gol cada uno</td><td>GG</td></tr>
                <tr><td>Arco en cero</td><td>Un equipo termina el partido sin recibir goles</td><td>—</td></tr>
                <tr><td>Doble oportunidad</td><td>Dos resultados te cubren: ejemplo "Colombia o empate" = gana Colombia o empatan</td><td>—</td></tr>
                <tr><td>Primer gol</td><td>Qué equipo o jugador anota primero en el partido</td><td>—</td></tr>
                <tr><td>Marca en el partido</td><td>Un jugador anota en cualquier momento del partido (anytime scorer)</td><td>—</td></tr>
                <tr><td>Cuota @1.85</td><td>Por cada S/ 1 apostado ganás S/ 1.85 si acertás (formato decimal universal)</td><td>—</td></tr>
              </tbody>
            </table>
          </div>
        </details>

        <CombinadasSugeridas />

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
