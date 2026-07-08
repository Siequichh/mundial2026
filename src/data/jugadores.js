import { flagClass, nombreCorto } from '../utils/flags'

// 16 figuras para el cuadro de octavos. Cada una trae su propio arquero (el que
// defiende TU arco cuando el rival patea, y por nación su nivel real aproximado).
const lista = [
  { nombre: 'Messi',        pais: 'Argentina',    potencia: 85, precision: 96, arquero: { nombre: 'Dibu Martínez', nivel: 90 } },
  { nombre: 'Mbappé',       pais: 'Francia',      potencia: 95, precision: 88, arquero: { nombre: 'Maignan',       nivel: 87 } },
  { nombre: 'Cristiano',    pais: 'Portugal',     potencia: 93, precision: 91, arquero: { nombre: 'Diogo Costa',   nivel: 84 } },
  { nombre: 'Haaland',      pais: 'Noruega',      potencia: 97, precision: 81, arquero: { nombre: 'Nyland',        nivel: 76 } },
  { nombre: 'Kane',         pais: 'Inglaterra',   potencia: 90, precision: 92, arquero: { nombre: 'Pickford',      nivel: 85 } },
  { nombre: 'Lamine Yamal', pais: 'España',       potencia: 80, precision: 93, arquero: { nombre: 'Unai Simón',    nivel: 84 } },
  { nombre: 'De Bruyne',    pais: 'Bélgica',      potencia: 88, precision: 90, arquero: { nombre: 'Courtois',      nivel: 92 } },
  { nombre: 'Vinícius Jr.', pais: 'Brasil',       potencia: 87, precision: 85, arquero: { nombre: 'Alisson',       nivel: 91 } },
  { nombre: 'Modrić',       pais: 'Croacia',      potencia: 82, precision: 90, arquero: { nombre: 'Livaković',     nivel: 83 } },
  { nombre: 'Depay',        pais: 'Países Bajos', potencia: 86, precision: 86, arquero: { nombre: 'Verbruggen',    nivel: 82 } },
  { nombre: 'Hakimi',       pais: 'Marruecos',    potencia: 85, precision: 86, arquero: { nombre: 'Bounou',        nivel: 86 } },
  { nombre: 'Musiala',      pais: 'Alemania',     potencia: 84, precision: 88, arquero: { nombre: 'Ter Stegen',    nivel: 88 } },
  { nombre: 'Pulisic',      pais: 'Estados Unidos', potencia: 83, precision: 85, arquero: { nombre: 'Turner',      nivel: 80 } },
  { nombre: 'Luis Díaz',    pais: 'Colombia',     potencia: 88, precision: 83, arquero: { nombre: 'Camilo Vargas', nivel: 79 } },
  { nombre: 'Son',          pais: 'Corea del Sur', potencia: 88, precision: 87, arquero: { nombre: 'Kim Seung-gyu', nivel: 79 } },
  { nombre: 'Valverde',     pais: 'Uruguay',      potencia: 90, precision: 84, arquero: { nombre: 'Rochet',        nivel: 81 } },
]

export const jugadores = lista.map((j, id) => ({
  ...j,
  id,
  flagCls: flagClass(j.pais),
  paisCorto: nombreCorto(j.pais),
}))
