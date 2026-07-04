import { useReveal } from '../hooks/useReveal'
import { flagClass } from '../utils/flags'
import { fechaHoraLocal } from '../utils/fecha'
import { formatoMercado, cuotaJusta } from '../utils/mercados'
import { mercadosDerivados, ETIQ_GRUPO } from '../utils/mercadosDerivados'
import { poissonOverProb } from '../utils/poisson'
import ProbBar from './ProbBar'

// mercadosDeExtras (córners/tarjetas/disparos/atajadas) no se repite acá: ya se ve en el bloque
// "Otros mercados" de arriba. Este "ver más" es para lo que no tiene espacio propio en la ficha.
function MasMercados({ partido }) {
  const todos = mercadosDerivados(partido).concat(partido.mercadosExtra ?? [])
  if (!todos.length) return null

  // Agrupar por grupo
  const porGrupo = {}
  for (const m of todos) {
    const g = m.grupo ?? 'otros'
    ;(porGrupo[g] = porGrupo[g] ?? []).push(m)
  }

  return (
    <details className="mas-mercados">
      <summary className="mas-mercados-toggle">Ver más mercados</summary>
      <div className="mas-mercados-body">
        {Object.entries(porGrupo).map(([grupo, items]) => (
          <div key={grupo} className="mas-grupo">
            <span className="mas-grupo-label">{ETIQ_GRUPO[grupo] ?? grupo}</span>
            <ul className="stat-list">
              {items.map((m) => {
                const fmt = formatoMercado(m.seleccion)
                const cuota = m.cuota ?? cuotaJusta(m.prob)
                return (
                  <li key={m.seleccion}>
                    <span>
                      {fmt.texto}
                      {fmt.chip && <span className="mkt-chip">{fmt.chip}</span>}
                      {m.nota && <em className="mas-nota"> · {m.nota}</em>}
                    </span>
                    <span className="mas-prob-cuota">
                      <b>{m.prob}%</b>
                      <span className="pick-cuota"> · @{cuota}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </details>
  )
}

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
          {partido.resultadoReal
            ? <span className="th-resultado">FINAL {partido.resultadoReal}</span>
            : <span className="th-kickoff">{fechaHoraLocal(partido.kickoffUtc)} <em>tu hora</em></span>
          }
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
              <li><span>Más de 2.5 <span className="mkt-chip">+2.5</span></span><b>{partido.goles.over25}%</b></li>
              <li><span>Más de 3.5 <span className="mkt-chip">+3.5</span></span><b>{partido.goles.over35}%</b></li>
              <li><span>Ambos anotan <span className="mkt-chip">GG</span></span><b>{partido.goles.bttsSi}%</b></li>
              <li><span>Arco en cero {partido.home}</span><b>{partido.goles.vallaHome}%</b></li>
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
                <li><span>Más de 8.5 <span className="mkt-chip">+8.5</span></span><b>{partido.extras.corners.over85}%</b></li>
                <li><span>Más de 9.5 <span className="mkt-chip">+9.5</span></span><b>{partido.extras.corners.over95}%</b></li>
                <li><span>Más de 10.5 <span className="mkt-chip">+10.5</span></span><b>{partido.extras.corners.over105}%</b></li>
              </ul>
            </div>
            <div className="extra">
              <span className="extra-name">Tarjetas <i className="ruido">el más impredecible</i></span>
              <ul className="stat-list">
                <li><span>Esperadas</span><b>{partido.extras.tarjetas.esperadas}</b></li>
                <li><span>Más de 3.5 <span className="mkt-chip">+3.5</span></span><b>{partido.extras.tarjetas.over35}%</b></li>
                <li><span>Más de 4.5 <span className="mkt-chip">+4.5</span></span><b>{partido.extras.tarjetas.over45}%</b></li>
              </ul>
            </div>
            <div className="extra">
              <span className="extra-name">Faltas</span>
              <ul className="stat-list">
                <li><span>Esperadas</span><b>~{partido.extras.faltas.esperadas}</b></li>
                <li><span>Más de 22.5 <span className="mkt-chip">+22.5</span></span><b>{poissonOverProb(partido.extras.faltas.esperadas, 22.5)}%</b></li>
                <li><span>Más de 24.5 <span className="mkt-chip">+24.5</span></span><b>{poissonOverProb(partido.extras.faltas.esperadas, 24.5)}%</b></li>
              </ul>
            </div>
            {partido.extras.disparos && (
              <div className="extra">
                <span className="extra-name">Disparos al arco</span>
                <ul className="stat-list">
                  <li><span>{partido.home} esperados</span><b>{partido.extras.disparos.home.esperados}</b></li>
                  <li><span>{partido.home} Más de 3.5</span><b>{poissonOverProb(partido.extras.disparos.home.esperados, 3.5)}%</b></li>
                  <li><span>{partido.away} esperados</span><b>{partido.extras.disparos.away.esperados}</b></li>
                  <li><span>{partido.away} Más de 3.5</span><b>{poissonOverProb(partido.extras.disparos.away.esperados, 3.5)}%</b></li>
                </ul>
              </div>
            )}
            {partido.extras.disparos && (
              <div className="extra">
                <span className="extra-name">Atajadas <i className="ruido">derivado, no medido</i></span>
                <ul className="stat-list">
                  <li>
                    <span>Arquero {partido.home} Más de 2.5</span>
                    <b>{poissonOverProb(Math.max(partido.extras.disparos.away.esperados - partido.xg.away, 0.3), 2.5)}%</b>
                  </li>
                  <li>
                    <span>Arquero {partido.away} Más de 2.5</span>
                    <b>{poissonOverProb(Math.max(partido.extras.disparos.home.esperados - partido.xg.home, 0.3), 2.5)}%</b>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="tk-lectura"><b>Lectura del modelo:</b> {partido.lectura}</p>

        <MasMercados partido={partido} />

        {partido.arriesgados && (
          <div className="tk-arriesgados">
            <h4>Mercados de alto riesgo <i className="riesgo-alto">ALTO RIESGO</i></h4>
            <div className="arriesgados-grid">
              <div className="arr-block">
                <span className="arr-sub">Anota primero</span>
                <div className="anota-primero">
                  <div className="ap-row">
                    <span className="ap-label">{partido.home}</span>
                    <div className="ap-bar-wrap">
                      <div className="ap-bar ap-home" style={{ width: `${partido.arriesgados.anotaPrimero.home}%` }} />
                    </div>
                    <span className="ap-pct">{partido.arriesgados.anotaPrimero.home}%</span>
                  </div>
                  <div className="ap-row">
                    <span className="ap-label">{partido.away}</span>
                    <div className="ap-bar-wrap">
                      <div className="ap-bar ap-away" style={{ width: `${partido.arriesgados.anotaPrimero.away}%` }} />
                    </div>
                    <span className="ap-pct">{partido.arriesgados.anotaPrimero.away}%</span>
                  </div>
                  <div className="ap-row ap-row-ninguno">
                    <span className="ap-label">Ninguno / 0-0</span>
                    <div className="ap-bar-wrap">
                      <div className="ap-bar ap-ninguno" style={{ width: `${partido.arriesgados.anotaPrimero.ninguno}%` }} />
                    </div>
                    <span className="ap-pct">{partido.arriesgados.anotaPrimero.ninguno}%</span>
                  </div>
                </div>
              </div>
              <div className="arr-block">
                <span className="arr-sub">Goleadores (anytime)</span>
                <ul className="goleador-list">
                  {partido.arriesgados.goleadores.map((g) => (
                    <li key={g.jugador} className="goleador">
                      <div className="gl-top">
                        <span className="gl-name">{g.jugador}</span>
                        <span className="gl-equipo">{g.equipo}</span>
                        <span className="gl-prob">{g.prob}%</span>
                      </div>
                      {g.nota && <span className="gl-nota">{g.nota}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {partido.resultadoReal && partido.postAnalisis && (
          <div className={`tk-historial ${partido.fijaAcerto ? 'hist-ok' : 'hist-fail'}`}>
            <span className="hist-badge">{partido.fijaAcerto ? '✓ FIJA ACERTÓ' : '✗ FIJA FALLÓ'}</span>
            <p className="hist-analisis">{partido.postAnalisis}</p>
          </div>
        )}
      </div>

      {/* Perforación del ticket */}
      <div className="ticket-tear" aria-hidden="true" />

      <footer className="ticket-picks">
        <div className="pick-fija">
          <span className="pick-label">La Fija</span>
          <span className="pick-value">
            {formatoMercado(partido.picks.fija.seleccion).texto}
            {formatoMercado(partido.picks.fija.seleccion).chip && (
              <span className="mkt-chip">{formatoMercado(partido.picks.fija.seleccion).chip}</span>
            )}
          </span>
          <span className={`pick-conf ${conf.cls}`}>
            {partido.picks.fija.prob}% · {conf.label}
            {partido.picks.fija.cuota && <span className="pick-cuota"> · @{partido.picks.fija.cuota}</span>}
          </span>
        </div>
        <ul className="pick-alts">
          {partido.picks.alternativas.map((a) => {
            const c = confianzaDe(a.prob)
            const mkt = formatoMercado(a.seleccion)
            return (
              <li key={a.seleccion}>
                <span className="alt-sel">
                  {mkt.texto}
                  {mkt.chip && <span className="mkt-chip">{mkt.chip}</span>}
                </span>
                <span className={`pick-conf ${c.cls}`}>
                  {a.prob}%
                  {a.cuota && <span className="pick-cuota"> · @{a.cuota}</span>}
                </span>
                {a.nota && <span className="alt-nota">{a.nota}</span>}
              </li>
            )
          })}
        </ul>
      </footer>
    </article>
  )
}
