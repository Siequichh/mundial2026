import { useState } from 'react'
import { getPartidosArchivados, getJornadaDelDia } from '../services/predictionsService'
import { fechaLarga, diasDesde } from '../utils/fecha'
import { flagClass } from '../utils/flags'

const FILTROS = [
  { key: 'todos', label: 'Todos', dias: null },
  { key: '3d',    label: 'Últimos 3 días', dias: 3 },
  { key: '7d',    label: 'Últimos 7 días', dias: 7 },
]

export default function HistorialPredicciones() {
  const archivados = getPartidosArchivados()
  const hoy = getJornadaDelDia()?.fecha
  const [filtro, setFiltro] = useState('todos')

  if (archivados.length === 0) return null

  const dias = FILTROS.find(f => f.key === filtro)?.dias
  const visibles = archivados.filter(p =>
    dias === null || !hoy || diasDesde(p.fechaJornada, hoy) <= dias
  )

  return (
    <details className="historial-section">
      <summary className="historial-head">
        <span className="comb-eyebrow">RESULTADOS YA JUGADOS</span>
        <h3 className="comb-title">Historial de predicciones <span className="historial-count">({archivados.length})</span></h3>
        <p className="comb-sub">Cómo le fue al modelo en los partidos que ya terminaron.</p>
      </summary>

      <div className="historial-filtros">
        {FILTROS.map(f => (
          <button
            key={f.key}
            className={`armador-filtro-btn${filtro === f.key ? ' active' : ''}`}
            onClick={() => setFiltro(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="historial-list">
        {visibles.map(p => (
          <li key={p.id} className={`historial-item ${p.fijaAcerto ? 'hist-ok' : 'hist-fail'}`}>
            <div className="hi-top">
              <span className="hi-fecha">{fechaLarga(p.fechaJornada)}</span>
              <span className="hi-badge">{p.fijaAcerto ? '✓ FIJA ACERTÓ' : '✗ FIJA FALLÓ'}</span>
            </div>
            <div className="hi-teams">
              <span className="hi-team"><span className={`flag flag-sm ${flagClass(p.home)}`} aria-hidden="true" />{p.home}</span>
              <span className="hi-resultado">{p.resultadoReal}</span>
              <span className="hi-team"><span className={`flag flag-sm ${flagClass(p.away)}`} aria-hidden="true" />{p.away}</span>
            </div>
            {p.postAnalisis && <p className="hi-analisis">{p.postAnalisis}</p>}
          </li>
        ))}
      </ul>
    </details>
  )
}
