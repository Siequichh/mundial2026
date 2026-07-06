// Estructura de llaves de la fase eliminatoria, organizada como bracket FIFA
// (mitad izquierda y derecha convergen a la final). Cruces de octavos según FIFA/CBS.
// Los emparejamientos de cuartos en adelante quedan "Por definir" hasta confirmación oficial.

// Dieciseisavos: 16 partidos, 8 por mitad, en orden de posición en la llave.
// `feeds` = índice del partido de octavos (en su misma mitad) al que avanza el ganador.
export const dieciseisavos = {
  izquierda: [
    { home: 'Sudáfrica', away: 'Canadá', resultado: '0-1', fecha: '28 jun', sede: 'Inglewood, CA', feeds: 0 },
    { home: 'Países Bajos', away: 'Marruecos', resultado: '1-1', penales: '2-3', fecha: '29 jun', sede: 'Monterrey', feeds: 0 },
    { home: 'Alemania', away: 'Paraguay', resultado: '1-1', penales: '3-4', fecha: '29 jun', sede: 'Foxborough, MA', feeds: 1 },
    { home: 'Francia', away: 'Suecia', resultado: '3-0', fecha: '30 jun', sede: 'East Rutherford, NJ', feeds: 1 },
    { home: 'Brasil', away: 'Japón', resultado: '2-1', fecha: '29 jun', sede: 'Houston, TX', feeds: 2 },
    { home: 'Costa de Marfil', away: 'Noruega', resultado: '1-2', fecha: '30 jun', sede: 'Arlington, TX', feeds: 2 },
    { home: 'México', away: 'Ecuador', resultado: '2-0', fecha: '1 jul', sede: 'Ciudad de México', feeds: 3 },
    { home: 'Inglaterra', away: 'R.D. Congo', resultado: '2-1', fecha: '1 jul', sede: 'Atlanta, GA', feeds: 3 },
  ],
  derecha: [
    { home: 'Portugal', away: 'Croacia', resultado: '2-1', fecha: '2 jul', sede: 'Toronto', feeds: 0 },
    { home: 'España', away: 'Austria', resultado: '3-0', fecha: '2 jul', sede: 'Los Ángeles', feeds: 0 },
    { home: 'Estados Unidos', away: 'Bosnia y Herzegovina', resultado: '2-0', fecha: '2 jul', sede: 'Santa Clara, CA', feeds: 1 },
    { home: 'Bélgica', away: 'Senegal', resultado: '3-2', nota: 'prórroga', fecha: '1 jul', sede: 'Seattle, WA', feeds: 1 },
    { home: 'Argentina', away: 'Cabo Verde', resultado: '3-2', nota: 'prórroga', fecha: '3 jul', sede: 'Miami', feeds: 2 },
    { home: 'Australia', away: 'Egipto', resultado: '1-1', penales: '4-2', fecha: '3 jul', sede: 'Arlington, TX', feeds: 2 },
    { home: 'Suiza', away: 'Argelia', resultado: '2-0', fecha: '2 jul', sede: 'Vancouver', feeds: 3 },
    { home: 'Colombia', away: 'Ghana', resultado: '1-0', fecha: '3 jul', sede: 'Kansas City', feeds: 3 },
  ],
}

// Octavos confirmados por FIFA (equipo null = ganador aún por definirse en dieciseisavos).
export const octavos = {
  izquierda: [
    { home: 'Canadá', away: 'Marruecos', resultado: '0-3', fecha: '4 jul', sede: 'Houston' },
    { home: 'Paraguay', away: 'Francia', resultado: '0-1', fecha: '4 jul', sede: 'Filadelfia' },
    { home: 'Brasil', away: 'Noruega', resultado: '1-2', fecha: '5 jul', sede: 'East Rutherford' },
    { home: 'México', away: 'Inglaterra', resultado: '2-3', fecha: '5 jul', sede: 'Ciudad de México' },
  ],
  derecha: [
    { home: 'Portugal', away: 'España', resultado: '0-1', fecha: '6 jul', sede: 'Dallas' },
    { home: 'Estados Unidos', away: 'Bélgica', resultado: null, fecha: '6 jul', sede: 'Seattle' },
    { home: 'Argentina', away: 'Egipto', resultado: null, fecha: '7 jul', sede: 'Atlanta' },
    { home: 'Suiza', away: 'Colombia', resultado: null, fecha: '7 jul', sede: 'Vancouver' },
  ],
}

// Cuartos, semis y final: por definir (no se inventan cruces).
export const rondasPorDefinir = {
  cuartos: { porLado: 2 },
  semis: { porLado: 1 },
}
