import { grupos } from '../data/grupos'

export function getMejoresTerceros() {
  const terceros = grupos.map((g) => {
    const eq = g.equipos.find((e) => e.posicion === 3) || g.equipos[2]
    return { ...eq, grupo: g.grupo }
  })

  return terceros
    .sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts
      if (b.dg !== a.dg) return b.dg - a.dg
      return b.gf - a.gf
    })
    .map((item, idx) => ({
      ...item,
      ranking: idx + 1,
      clasificado: idx < 8,
    }))
}

export function getGrupos() {
  const mejoresTerceros = getMejoresTerceros()
  const clasificadosTerceros = new Set(
    mejoresTerceros.filter((t) => t.clasificado).map((t) => t.nombre)
  )

  return grupos.map((g) => ({
    ...g,
    equipos: g.equipos.map((eq) => {
      let estado = 'eliminado'
      if (eq.posicion <= 2) {
        estado = 'clasificado'
      } else if (eq.posicion === 3 && clasificadosTerceros.has(eq.nombre)) {
        estado = 'repechaje'
      }
      return { ...eq, estadoClasificacion: estado }
    }),
  }))
}

