const MAPA = [
  [/^[Oo]ver (\d+\.?\d*) goles$/i,     (m) => ({ texto: `Más de ${m[1]} goles`,     chip: `+${m[1]}` })],
  [/^[Uu]nder (\d+\.?\d*) goles$/i,    (m) => ({ texto: `Menos de ${m[1]} goles`,   chip: `−${m[1]}` })],
  [/^[Oo]ver (\d+\.?\d*) tarjetas$/i,  (m) => ({ texto: `Más de ${m[1]} tarjetas`, chip: `+${m[1]}` })],
  [/^[Uu]nder (\d+\.?\d*) tarjetas$/i, (m) => ({ texto: `Menos de ${m[1]} tarjetas`, chip: `−${m[1]}` })],
  [/^[Oo]ver (\d+\.?\d*) córners$/i,   (m) => ({ texto: `Más de ${m[1]} córners`,   chip: `+${m[1]}` })],
  [/^[Aa]mbos anotan$/i,               ()  => ({ texto: 'Ambos anotan',              chip: 'GG' })],
  [/^[Vv]alla a cero/i,                (_, s) => ({ texto: s.replace(/valla a cero/i, 'Arco en cero'), chip: null })],
]

export function formatoMercado(seleccion) {
  if (!seleccion) return { texto: seleccion, chip: null }
  for (const [re, fn] of MAPA) {
    const m = seleccion.match(re)
    if (m) return fn(m, seleccion)
  }
  return { texto: seleccion, chip: null }
}

export function cuotaJusta(prob) {
  return Math.round((100 / prob) * 100) / 100
}
