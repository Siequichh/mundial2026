import { Link } from 'react-router-dom'
import { getJornadaDelDia } from '../services/predictionsService'
import { flagClass } from '../utils/flags'
import { horaLocal, fechaLarga, tzVisitante } from '../utils/fecha'
import { confianzaDe } from '../components/PartidoCard'
import { useReveal } from '../hooks/useReveal'
import ModelExplainer from '../components/ModelExplainer'

function MatchMini({ p, index }) {
  const [ref, visible] = useReveal()
  const conf = confianzaDe(p.picks.fija.prob)
  return (
    <Link
      to="/predicciones"
      ref={ref}
      className={`match-mini ${visible ? 'is-visible' : ''}`}
      style={{ '--i': index }}
    >
      <div className="mm-teams">
        <span className="mm-team">
          <span className={`flag ${flagClass(p.home)}`} aria-hidden="true" />
          {p.home}
        </span>
        <span className="mm-hora">{horaLocal(p.kickoffUtc)}</span>
        <span className="mm-team mm-away">
          {p.away}
          <span className={`flag ${flagClass(p.away)}`} aria-hidden="true" />
        </span>
      </div>
      <div className="mm-bar" aria-hidden="true">
        <i style={{ width: `${p.prob.home}%` }} className="mm-h" />
        <i style={{ width: `${p.prob.draw}%` }} className="mm-x" />
        <i style={{ width: `${p.prob.away}%` }} className="mm-a" />
      </div>
      <div className="mm-foot">
        <span className="mm-fija">{p.picks.fija.seleccion}</span>
        <span className={`pick-conf ${conf.cls}`}>{p.picks.fija.prob}%</span>
      </div>
    </Link>
  )
}

export default function Inicio() {
  const jornada = getJornadaDelDia()

  const scrollToExplainer = (e) => {
    e.preventDefault()
    const el = document.getElementById('como-funciona')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-hosts">
              <span className={`flag ${flagClass('México')}`} /> México
              <span className={`flag ${flagClass('Estados Unidos')}`} /> Estados Unidos
              <span className={`flag ${flagClass('Canadá')}`} /> Canadá
            </p>
            <h1 className="hero-title">
              <span className="ht-line">LA FIJA</span>
              <span className="ht-line ht-accent">DEL MUNDIAL</span>
              <span className="ht-26">26</span>
            </h1>
            <p className="hero-lede">
              Pronósticos probabilísticos para el Mundial 2026 basados en rendimiento de ataque/defensa (xG) y simulaciones Monte Carlo. Sin especulaciones: datos objetivos calibrados con el mercado en tiempo real.
            </p>
            <div className="hero-cta">
              <Link to="/predicciones" className="btn-primary">
                <span>Predicciones de hoy</span>
                <svg className="btn-arrow-svg" viewBox="0 0 20 20" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link to="/camino" className="btn-ghost">
                <span>Cuadro del torneo</span>
              </Link>
            </div>
            <div className="model-snippet-card">
              <div className="msc-header">
                <span className="msc-badge">METODOLOGÍA DIXON-COLES (1997)</span>
                <span className="msc-sims">10,000 SIMULACIONES / PARTIDO</span>
              </div>
              <p className="msc-text">
                Modelo cuantitativo verificable basado en goles esperados y ajuste dinámico por sede y altitud.
              </p>
              <button onClick={scrollToExplainer} className="msc-link-btn">Explorar arquitectura técnica del modelo &rarr;</button>
            </div>
          </div>

          <aside className="hero-panel">
            <div className="hp-head">
              <span className="hp-fecha">{fechaLarga(jornada.fecha)}</span>
              <span className="hp-ronda">{jornada.etiqueta}</span>
            </div>
            <div className="hp-matches">
              {jornada.partidos.map((p, i) => <MatchMini key={p.id} p={p} index={i} />)}
            </div>
            <p className="hp-tz">Horas en tu zona: {tzVisitante()}</p>
          </aside>
        </div>
      </section>

      <section className="section home-teaser">
        <div className="section-inner">
          <div className="pitch-divider" aria-hidden="true"><span /></div>
          <div className="teaser-grid">
            <Link to="/resultados" className="teaser-card">
              <div className="tc-header">
                <span className="tc-badge tc-done">Clasificados y Terceros</span>
              </div>
              <h3 className="tc-title">Fase de Grupos</h3>
              <p className="tc-desc">12 grupos, 48 selecciones. Tablas finales y el ranking oficial de las 8 mejores terceras que avanzaron.</p>
              <div className="tc-footer">
                <span className="teaser-go">Explorar resultados finales</span>
                <span className="tc-arrow" aria-hidden="true">→</span>
              </div>
            </Link>
            <Link to="/camino" className="teaser-card">
              <div className="tc-header">
                <span className="tc-badge tc-live">Mundial en Vivo</span>
              </div>
              <h3 className="tc-title">Camino al Título</h3>
              <p className="tc-desc">El bracket estilo FIFA con las 32 selecciones clasificadas desde Dieciseisavos hasta la final en Nueva York / New Jersey.</p>
              <div className="tc-footer">
                <span className="teaser-go">Ver cuadro interactivo</span>
                <span className="tc-arrow" aria-hidden="true">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="section model-section">
        <div className="section-inner">
          <ModelExplainer />
        </div>
      </section>
    </>
  )
}
