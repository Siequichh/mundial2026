import { useState } from 'react'
import { getJornadas } from '../services/predictionsService'
import { fechaLarga } from '../utils/fecha'
import PartidoCard from '../components/PartidoCard'
import ModelExplainer from '../components/ModelExplainer'
import CombinadasSugeridas from '../components/CombinadasSugeridas'
import ArmaTuCombinada from '../components/ArmaTuCombinada'
import HistorialPredicciones from '../components/HistorialPredicciones'

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
                <tr><td>Primer gol</td><td>Qué equipo o jugador anota primero en el partido</td><td>1er</td></tr>
                <tr><td>Marca en el partido</td><td>Un jugador anota en cualquier momento del partido (anytime scorer)</td><td>GOL</td></tr>
                <tr><td>Gana (90 min)</td><td>El equipo gana en los 90 minutos de tiempo reglamentario. Se PIERDE si el partido va a prórroga o penales, aunque ese equipo clasifique.</td><td>90'</td></tr>
                <tr><td>Clasifica</td><td>El equipo avanza a la siguiente ronda por cualquier vía: gana en 90', en prórroga o en penales.</td><td>Q</td></tr>
                <tr><td>Empate no apuesta</td><td>Si el partido termina empatado en 90', te devuelven la apuesta. Solo gana si el equipo elegido gana en 90'.</td><td>DNB</td></tr>
                <tr><td>Ambos anotan No</td><td>Al menos uno de los dos equipos termina sin marcar goles</td><td>NG</td></tr>
                <tr><td>Cuota @1.85</td><td>Por cada S/ 1 apostado ganas S/ 1.85 si aciertas (formato decimal universal)</td><td>—</td></tr>
              </tbody>
            </table>
          </div>
        </details>

        <CombinadasSugeridas />
        <ArmaTuCombinada />

        {jornadas.map((j) => {
          const partidosFuturos = j.partidos.filter(p => !p.resultadoReal)
          if (partidosFuturos.length === 0) return null
          return (
            <div className="jornada" key={j.fecha}>
              <div className="jornada-tag">
                <span className="jornada-fecha">{fechaLarga(j.fecha)}</span>
                <span className="jornada-ronda">{j.etiqueta}</span>
              </div>
              <div className="partidos-grid">
                {partidosFuturos.map((p, i) => <PartidoCard key={p.id} partido={p} index={i} />)}
              </div>
            </div>
          )
        })}

        <HistorialPredicciones />

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
      </div>
    </section>
  )
}
