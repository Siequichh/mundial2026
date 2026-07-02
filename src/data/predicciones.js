// Archivo de jornadas de predicción. Cada día nuevo se agrega al PRINCIPIO del array.
// Modelo: Poisson bivariado + ajuste Dixon-Coles (rho) para goles; Poisson independiente
// para córners y tarjetas (calibradas con el árbitro designado).
// kickoffUtc en ISO UTC: el frontend lo muestra en la hora local de cada visitante.
// La confianza de cada pick se deriva de su propia probabilidad (no se reparte entre partidos).
export const jornadas = [
  {
    fecha: '2026-07-02',
    etiqueta: 'Dieciseisavos de Final',
    partidos: [
      {
        id: 'esp-aut',
        home: 'España', away: 'Austria',
        sede: 'SoFi Stadium, Los Ángeles',
        kickoffUtc: '2026-07-02T19:00:00Z',
        contexto: 'España llega invicta y con valla a cero como líder del Grupo H. Dudas físicas de Nico Williams y Yeremy Pino. Austria clasificó in extremis: empató 3-3 a Argelia en el 96\'. El ganador cruza con Portugal/Croacia en octavos (6 jul, Dallas).',
        xg: { home: 2.15, away: 0.65 },
        rho: -0.05,
        prob: { home: 71.6, draw: 18.9, away: 9.5 },
        validacion: [
          { fuente: 'Modelo (Dixon-Coles)', home: 71.6, draw: 18.9, away: 9.5 },
          { fuente: 'bet365 (de-vig)', home: 73.5, draw: 20.1, away: 6.4 },
          { fuente: 'Kalshi (traders)', home: 75, draw: 18, away: 9 },
        ],
        goles: { over15: 77.3, over25: 53.1, over35: 30.8, bttsSi: 42.7, bttsNo: 57.3, vallaHome: 52.2, vallaAway: 11.6 },
        marcadores: [
          { score: '2-0', pct: 14.1 }, { score: '1-0', pct: 12.6 }, { score: '3-0', pct: 10.1 },
          { score: '2-1', pct: 9.1 }, { score: '1-1', pct: 8.9 },
        ],
        arbitro: { nombre: 'Glenn Nyberg', pais: 'Suecia', promAmarillas: 3.21 },
        extras: {
          corners: { esperados: 10.2, over85: 68.9, over95: 56.7, over105: 44.2 },
          tarjetas: { esperadas: 3.2, over35: 39.7, over45: 21.9 },
          faltas: { esperadas: 21 },
        },
        picks: {
          fija: { seleccion: 'Gana España', prob: 71.6 },
          alternativas: [
            { seleccion: 'España gana sin recibir gol', prob: 52.2, nota: 'La valla a cero viene intacta en 4 partidos' },
            { seleccion: 'Over 2.5 goles', prob: 53.1, nota: 'España genera mucho; si rompe temprano hay goleada' },
            { seleccion: 'Marcador exacto 2-0', prob: 14.1, nota: 'El más probable de la matriz' },
          ],
        },
        lectura: 'Favorito claro y tres fuentes alineadas. Austria acaba de dar una remontada increíble ante Argelia: el batacazo (9.5%) existe, pero es el escenario improbable ya contemplado.',
      },
      {
        id: 'por-cro',
        home: 'Portugal', away: 'Croacia',
        sede: 'BMO Field, Toronto',
        kickoffUtc: '2026-07-02T23:00:00Z',
        contexto: 'Portugal favorita ante la finalista de 2018. Último cruce terminó 1-1 (Nations League 2024). Croacia rinde históricamente bien en fases eliminatorias. El ganador cruza con España/Austria en octavos (6 jul, Dallas).',
        xg: { home: 1.70, away: 1.05 },
        rho: -0.04,
        prob: { home: 52.1, draw: 24.9, away: 22.9 },
        validacion: [
          { fuente: 'Modelo (Dixon-Coles)', home: 52.1, draw: 24.9, away: 22.9 },
          { fuente: 'bet365 (de-vig)', home: 53.0, draw: 26.5, away: 20.6 },
        ],
        goles: { over15: 76.5, over25: 51.9, over35: 29.7, bttsSi: 53.6, bttsNo: 46.4, vallaHome: 35.0, vallaAway: 18.3 },
        marcadores: [
          { score: '1-1', pct: 11.9 }, { score: '1-0', pct: 10.4 }, { score: '2-1', pct: 9.7 },
          { score: '2-0', pct: 9.2 }, { score: '0-0', pct: 6.8 },
        ],
        arbitro: { nombre: 'Espen Eskås', pais: 'Noruega', promAmarillas: 3.8 },
        extras: {
          corners: { esperados: 9.2, over85: 57.0, over95: 43.9, over105: 31.8 },
          tarjetas: { esperadas: 3.8, over35: 52.7, over45: 33.2 },
          faltas: { esperadas: 24 },
        },
        picks: {
          fija: { seleccion: 'Gana Portugal', prob: 52.1 },
          alternativas: [
            { seleccion: 'Portugal o empate (doble oportunidad)', prob: 77.0, nota: 'La cobertura si Croacia compite como suele' },
            { seleccion: 'Ambos anotan', prob: 53.6, nota: 'Las dos generan; Croacia no se guarda' },
            { seleccion: 'Marcador exacto 1-1', prob: 11.9, nota: 'El resultado modal — ojo, más probable que cualquier triunfo exacto' },
          ],
        },
        lectura: 'Portugal favorita por poco: empate + Croacia suman 47.8%. El marcador individual más probable es el empate. El modelo no tiene una lectura fuerte acá.',
      },
      {
        id: 'sui-arg',
        home: 'Suiza', away: 'Argelia',
        sede: 'BC Place, Vancouver',
        kickoffUtc: '2026-07-03T03:00:00Z',
        contexto: 'Suiza ganó el Grupo B invicta. Argelia entra como uno de los mejores terceros, irregular pero con Mahrez (2G+1A) en gran nivel. Debilidad clara: 7 goles concedidos en grupos. El ganador cruza con Colombia/Ghana en octavos (7 jul, Vancouver).',
        xg: { home: 1.55, away: 1.00 },
        rho: -0.05,
        prob: { home: 49.5, draw: 26.7, away: 23.8 },
        validacion: [
          { fuente: 'Modelo (Dixon-Coles)', home: 49.5, draw: 26.7, away: 23.8 },
          { fuente: 'bet365 (de-vig)', home: 51.2, draw: 27.8, away: 21.0 },
          { fuente: 'Mercado predicción', home: 47, draw: 30, away: 24 },
        ],
        goles: { over15: 72.9, over25: 46.9, over35: 25.3, bttsSi: 50.4, bttsNo: 49.6, vallaHome: 36.8, vallaAway: 21.2 },
        marcadores: [
          { score: '1-1', pct: 12.7 }, { score: '1-0', pct: 11.5 }, { score: '2-0', pct: 9.4 },
          { score: '2-1', pct: 9.4 }, { score: '0-0', pct: 8.4 },
        ],
        arbitro: { nombre: 'Yael Falcón Pérez', pais: 'Argentina', promAmarillas: 4.2 },
        extras: {
          corners: { esperados: 9.0, over85: 54.4, over95: 41.3, over105: 29.4 },
          tarjetas: { esperadas: 4.2, over35: 60.5, over45: 41.0 },
          faltas: { esperadas: 26 },
        },
        picks: {
          fija: { seleccion: 'Gana Suiza', prob: 49.5 },
          alternativas: [
            { seleccion: 'Suiza o empate (doble oportunidad)', prob: 76.2, nota: 'La jugada sensata en el partido más parejo del día' },
            { seleccion: 'Under 2.5 goles', prob: 53.1, nota: 'Choque táctico, tendencia a marcador corto' },
            { seleccion: 'Marcador exacto 1-1', prob: 12.7, nota: 'El resultado modal de la matriz' },
          ],
        },
        lectura: 'El partido más parejo del día: Suiza favorita por menos del 50% y empate+Argelia superan la mitad. Cualquiera de los tres resultados es plausible — todo pick acá es a consideración de cada uno.',
      },
    ],
  },
]
