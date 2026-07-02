import { useReveal } from '../hooks/useReveal'
import { flagClass } from '../utils/flags'

export default function GroupTable({ grupo, index }) {
  const [ref, visible] = useReveal()
  return (
    <div ref={ref} className={`group-table ${visible ? 'is-visible' : ''}`} style={{ '--i': index }}>
      <h3>Grupo {grupo.grupo}</h3>
      <table>
        <thead>
          <tr><th></th><th>Equipo</th><th>PJ</th><th>DG</th><th>Pts</th></tr>
        </thead>
        <tbody>
          {grupo.equipos.map((eq) => (
            <tr key={eq.nombre} className={eq.estadoClasificacion || (eq.posicion <= 2 ? 'clasificado' : eq.posicion === 3 ? 'repechaje' : 'eliminado')}>
              <td className="pos">{eq.posicion}</td>
              <td className="team">
                <span className={`flag flag-sm ${flagClass(eq.nombre)}`} aria-hidden="true" />
                {eq.nombre}
              </td>
              <td>{eq.pj}</td>
              <td>{eq.dg > 0 ? `+${eq.dg}` : eq.dg}</td>
              <td className="pts">{eq.pts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
