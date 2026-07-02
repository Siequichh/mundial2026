import { useReveal } from '../hooks/useReveal'
import { flagClass } from '../utils/flags'
import { fechaHoraLocal } from '../utils/fecha'
import ProbBar from './ProbBar'

// Confianza derivada de la probabilidad del propio pick — por partido, no repartida.
export function confianzaDe(prob) {
  if (prob >= 65) return { label: 'ALTA', cls: 'conf-alta' }
  if (prob >= 50) return { label: 'MEDIA', cls: 'conf-media' }
  return { label: 'BAJA', cls: 'conf-baja' }
}

export default function PartidoCard({ partido, index }) {
  const [ref, visible] = useReveal()
  const conf = confianzaDe(partido.picks.fija.prob)

  return (
    <article ref={ref} className={`ticket ${visible ? 'is-visible' : ''}`} style={{ '--i': index }}>
      {/* Talón del ticket: equipos, hora local, sede */}
      <header className="ticket-head">
        <div className="th-teams">
          <span className="th-team">
            <span className={`flag ${flagClass(partido.home)}`} aria-hidden="true" />
            {partido.home}
          </span>
          <span className="th-vs">VS</span>
          <span className="th-team">
            <span className={`flag ${flagClass(partido.away)}`} aria-hidden="true" />
            {partido.away}
          </span>
        </div>
        <div className="th-meta">
          <span className="th-kickoff">{fechaHoraLocal(partido.kickoffUtc)} <em>tu hora</em></span>
          <span className="th-sede">{partido.sede}</span>
        </div>
      </header>

      <div className="ticket-body">
        <p className="tk-contexto">{partido.contexto}</p>

        <div className="tk-xg">
          <div className="xg-box">
            <span className="xg-num">{partido.xg.home.toFixed(2)}</span>
            <span className="xg-tag">xG {partido.home}</span>
          </div>
          <span className="xg-vs">–</span>
          <div className="xg-box">
            <span className="xg-num">{partido.xg.away.toFixed(2)}</span>
            <span className="xg-tag">xG {partido.away}</span>
          </div>
          <span className="xg-rho">ρ = {partido.rho}</span>
        </div>

        <ProbBar {...partido.prob} homeLabel={partido.home} awayLabel={partido.away} />

        <div className="tk-grid">
          <div className="tk-block">
            <h4>Validación cruzada</h4>
            <table className="mini-table">
              <thead><tr><th>Fuente</th><th>1</th><th>X</th><th>2</th></tr></thead>
              <tbody>
                {partido.validacion.map((v) => (
                  <tr key={v.fuente}><td>{v.fuente}</td><td>{v.home}%</td><td>{v.draw}%</td><td>{v.away}%</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tk-block">
            <h4>Goles</h4>
            <ul className="stat-list">
              <li><span>Over 2.5</span><b>{partido.goles.over25}%</b></li>
              <li><span>Over 3.5</span><b>{partido.goles.over35}%</b></li>
              <li><span>Ambos anotan</span><b>{partido.goles.bttsSi}%</b></li>
              <li><span>Valla a cero {partido.home}</span><b>{partido.goles.vallaHome}%</b></li>
            </ul>
          </div>

          <div className="tk-block">
            <h4>Marcadores probables</h4>
            <ul className="score-list">
              {partido.marcadores.map((m) => (
                <li key={m.score}><span className="score-chip">{m.score}</span><b>{m.pct}%</b></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="tk-extras">
          <h4>Otros mercados <small>· árbitro: {partido.arbitro.nombre} ({partido.arbitro.pais}), {partido.arbitro.promAmarillas} amarillas/partido</small></h4>
          <div className="extras-grid">
            <div className="extra">
              <span className="extra-name">Córners <i className="ruido">mercado ruidoso</i></span>
              <ul className="stat-list">
                <li><span>Esperados</span><b>{partido.extras.corners.esperados}</b></li>
                <li><span>Over 8.5</span><b>{partido.extras.corners.over85}%</b></li>
                <li><span>Over 9.5</span><b>{partido.extras.corners.over95}%</b></li>
                <li><span>Over 10.5</span><b>{partido.extras.corners.over105}%</b></li>
              </ul>
            </div>
            <div className="extra">
              <span className="extra-name">Tarjetas <i className="ruido">el más impredecible</i></span>
              <ul className="stat-list">
                <li><span>Esperadas</span><b>{partido.extras.tarjetas.esperadas}</b></li>
                <li><span>Over 3.5</span><b>{partido.extras.tarjetas.over35}%</b></li>
                <li><span>Over 4.5</span><b>{partido.extras.tarjetas.over45}%</b></li>
              </ul>
            </div>
            <div className="extra">
              <span className="extra-name">Faltas</span>
              <ul className="stat-list">
                <li><span>Esperadas</span><b>~{partido.extras.faltas.esperadas}</b></li>
              </ul>
            </div>
          </div>
        </div>

        <p className="tk-lectura"><b>Lectura del modelo:</b> {partido.lectura}</p>
      </div>

      {/* Perforación del ticket */}
      <div className="ticket-tear" aria-hidden="true" />

      <footer className="ticket-picks">
        <div className="pick-fija">
          <span className="pick-label">La Fija</span>
          <span className="pick-value">{partido.picks.fija.seleccion}</span>
          <span className={`pick-conf ${conf.cls}`}>{partido.picks.fija.prob}% · {conf.label}</span>
        </div>
        <ul className="pick-alts">
          {partido.picks.alternativas.map((a) => {
            const c = confianzaDe(a.prob)
            return (
              <li key={a.seleccion}>
                <span className="alt-sel">{a.seleccion}</span>
                <span className={`pick-conf ${c.cls}`}>{a.prob}%</span>
                {a.nota && <span className="alt-nota">{a.nota}</span>}
              </li>
            )
          })}
        </ul>
      </footer>
    </article>
  )
}
