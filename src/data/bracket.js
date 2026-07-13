// Estructura de llaves de la fase eliminatoria, organizada como bracket FIFA
// (mitad izquierda y derecha convergen a la final). Cruces según bracket oficial FIFA.
// Los emparejamientos de cuartos en adelante quedan "Por definir" hasta confirmación oficial.

// Dieciseisavos: 16 partidos, 8 por mitad, en orden visual de arriba a abajo.
// `feeds` = índice del partido de octavos (en su misma mitad) al que avanza el ganador.
export const dieciseisavos = {
  izquierda: [
    // feeds 0 → octavos[0] (Paraguay vs Francia)
    { home: 'Alemania', away: 'Paraguay', resultado: '1-1', penales: '3-4', fecha: '29 jun', sede: 'Foxborough, MA', feeds: 0 },
    { home: 'Francia', away: 'Suecia', resultado: '3-0', fecha: '30 jun', sede: 'East Rutherford, NJ', feeds: 0 },
    // feeds 1 → octavos[1] (Canadá vs Marruecos)
    { home: 'Sudáfrica', away: 'Canadá', resultado: '0-1', fecha: '28 jun', sede: 'Inglewood, CA', feeds: 1 },
    { home: 'Países Bajos', away: 'Marruecos', resultado: '1-1', penales: '2-3', fecha: '29 jun', sede: 'Monterrey', feeds: 1 },
    // feeds 2 → octavos[2] (Portugal vs España)
    { home: 'Portugal', away: 'Croacia', resultado: '2-1', fecha: '2 jul', sede: 'Toronto', feeds: 2 },
    { home: 'España', away: 'Austria', resultado: '3-0', fecha: '2 jul', sede: 'Los Ángeles', feeds: 2 },
    // feeds 3 → octavos[3] (EE.UU. vs Bélgica)
    { home: 'Estados Unidos', away: 'Bosnia y Herzegovina', resultado: '2-0', fecha: '2 jul', sede: 'Santa Clara, CA', feeds: 3 },
    { home: 'Bélgica', away: 'Senegal', resultado: '3-2', fecha: '1 jul', sede: 'Seattle, WA', feeds: 3 },
  ],
  derecha: [
    // feeds 0 → octavos[0] (Brasil vs Noruega)
    { home: 'Brasil', away: 'Japón', resultado: '2-1', fecha: '29 jun', sede: 'Houston, TX', feeds: 0 },
    { home: 'Costa de Marfil', away: 'Noruega', resultado: '1-2', fecha: '30 jun', sede: 'Arlington, TX', feeds: 0 },
    // feeds 1 → octavos[1] (México vs Inglaterra)
    { home: 'México', away: 'Ecuador', resultado: '2-0', fecha: '1 jul', sede: 'Ciudad de México', feeds: 1 },
    { home: 'Inglaterra', away: 'R.D. Congo', resultado: '2-1', fecha: '1 jul', sede: 'Atlanta, GA', feeds: 1 },
    // feeds 2 → octavos[2] (Argentina vs Egipto)
    { home: 'Argentina', away: 'Cabo Verde', resultado: '3-2', fecha: '3 jul', sede: 'Miami', feeds: 2 },
    { home: 'Australia', away: 'Egipto', resultado: '1-1', penales: '2-4', fecha: '3 jul', sede: 'Arlington, TX', feeds: 2 },
    // feeds 3 → octavos[3] (Suiza vs Colombia)
    { home: 'Suiza', away: 'Argelia', resultado: '2-0', fecha: '2 jul', sede: 'Vancouver', feeds: 3 },
    { home: 'Colombia', away: 'Ghana', resultado: '1-0', fecha: '3 jul', sede: 'Kansas City', feeds: 3 },
  ],
}

// Octavos confirmados por FIFA, en orden visual de arriba a abajo por mitad.
export const octavos = {
  izquierda: [
    { home: 'Paraguay', away: 'Francia', resultado: '0-1', fecha: '4 jul', sede: 'Filadelfia' },
    { home: 'Canadá', away: 'Marruecos', resultado: '0-3', fecha: '4 jul', sede: 'Houston' },
    { home: 'Portugal', away: 'España', resultado: '0-1', fecha: '6 jul', sede: 'Dallas' },
    { home: 'Estados Unidos', away: 'Bélgica', resultado: '1-4', fecha: '6 jul', sede: 'Seattle' },
  ],
  derecha: [
    { home: 'Brasil', away: 'Noruega', resultado: '1-2', fecha: '5 jul', sede: 'East Rutherford' },
    { home: 'México', away: 'Inglaterra', resultado: '2-3', fecha: '5 jul', sede: 'Ciudad de México' },
    { home: 'Argentina', away: 'Egipto', resultado: '3-2', fecha: '7 jul', sede: 'Atlanta' },
    { home: 'Suiza', away: 'Colombia', resultado: '0-0', penales: '4-3', fecha: '7 jul', sede: 'Vancouver' },
  ],
}

// Cuartos: cruces confirmados por el bracket oficial FIFA.
export const cuartos = {
  izquierda: [
    { home: 'Francia',  away: 'Marruecos', resultado: '2-0', fecha: '9 jul',  sede: 'Foxborough, MA' },
    { home: 'España',   away: 'Bélgica',   resultado: '2-1', fecha: '10 jul', sede: 'Los Ángeles' },
  ],
  derecha: [
    { home: 'Noruega',    away: 'Inglaterra', resultado: '1-2', nota: 'prórroga', fecha: '11 jul', sede: 'Kansas City' },
    { home: 'Argentina',  away: 'Suiza',      resultado: '3-1', nota: 'prórroga', fecha: '11 jul', sede: 'Miami' },
  ],
}

// Semifinales confirmadas.
export const semis = {
  izquierda: [
    { home: 'Francia', away: 'España', fecha: '14 jul', sede: 'Arlington, TX' },
  ],
  derecha: [
    { home: 'Inglaterra', away: 'Argentina', fecha: '15 jul', sede: 'Atlanta, GA' },
  ],
}

export const rondasPorDefinir = {
  final: { porLado: 0 },
}
