import { getGrupos, getMejoresTerceros } from '../services/groupsService'
import GroupTable from '../components/GroupTable'
import { flagClass } from '../utils/flags'

export default function Resultados() {
  const grupos = getGrupos()
  const terceros = getMejoresTerceros()

  return (
    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Fase de grupos · Oficial</p>
        <h2 className="section-title">Resultados</h2>
        <p className="section-lede">
          12 grupos, 48 selecciones. Clasifican directamente los 2 primeros de cada grupo
          junto con las 8 mejores selecciones ubicadas en el tercer puesto.
        </p>

        <div className="legend">
          <span><i className="dot dot-clasificado" /> Clasificado directo (1º y 2º)</span>
          <span><i className="dot dot-repechaje" /> Mejor tercero clasificado (Top 8)</span>
          <span><i className="dot dot-eliminado" /> Eliminado</span>
        </div>

        <div className="groups-grid">
          {grupos.map((g, i) => <GroupTable key={g.grupo} grupo={g} index={i} />)}
        </div>

        <div className="pitch-divider" aria-hidden="true"><span /></div>

        <div className="thirds-section">
          <div className="thirds-head">
            <p className="eyebrow">Clasificación general</p>
            <h3 className="thirds-title">Tabla de Mejores Terceros</h3>
            <p className="thirds-desc">
              Reglamento FIFA: En el formato de 48 equipos, los 12 terceros compiten en una tabla unificada. 
              Los 8 primeros avanzan a los Dieciseisavos de Final. Criterios de desempate: Puntos (Pts), Diferencia de Goles (DG) y Goles a Favor (GF).
            </p>
          </div>

          <div className="thirds-table-wrap">
            <table className="thirds-table">
              <thead>
                <tr>
                  <th className="t-pos">#</th>
                  <th>Selección</th>
                  <th className="t-grp">Grupo</th>
                  <th>PJ</th>
                  <th>DG</th>
                  <th className="t-pts">Pts</th>
                  <th className="t-status">Estado</th>
                </tr>
              </thead>
              <tbody>
                {terceros.map((t, index) => (
                  <tr key={t.nombre} className={`third-row ${t.clasificado ? 'is-in' : 'is-out'} ${index === 7 ? 'cutoff-row' : ''}`}>
                    <td className="t-pos">{t.ranking}</td>
                    <td className="team">
                      <span className={`flag flag-sm ${flagClass(t.nombre)}`} aria-hidden="true" />
                      <strong>{t.nombre}</strong>
                    </td>
                    <td className="t-grp"><span className="grp-badge">Gr. {t.grupo}</span></td>
                    <td>{t.pj}</td>
                    <td>{t.dg > 0 ? `+${t.dg}` : t.dg}</td>
                    <td className="t-pts">{t.pts}</td>
                    <td className="t-status">
                      {t.clasificado ? (
                        <span className="status-badge status-ok">Clasificado (16avos)</span>
                      ) : (
                        <span className="status-badge status-out">Eliminado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  )
}
