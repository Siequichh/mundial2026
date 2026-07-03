// Archivo de jornadas de predicción. Cada día nuevo se agrega al PRINCIPIO del array.
// Modelo: Poisson bivariado + ajuste Dixon-Coles (rho) para goles; Poisson independiente
// para córners y tarjetas (calibradas con el árbitro designado).
// kickoffUtc en ISO UTC: el frontend lo muestra en la hora local de cada visitante.
// La confianza de cada pick se deriva de su propia probabilidad (no se reparte entre partidos).
export const jornadas = [
  {
    fecha: '2026-07-03',
    etiqueta: 'Dieciseisavos de Final',
    partidos: [
      {
        id: 'aus-egi',
        home: 'Australia', away: 'Egipto',
        sede: 'AT&T Stadium, Arlington',
        kickoffUtc: '2026-07-03T18:00:00Z',
        contexto: 'Cruce entre dos segundos de grupo. Egipto llega invicto (5 pts, +2) con Salah al mando: superó la molestia en el isquiotibial, entrenó completo y el DT confirmó que jugará "en alguna capacidad" — la duda es si arranca o entra desde el banco. Australia salió del Grupo D con 4 pts y diferencia 0: bloque defensivo cerrado y poca generación. El ganador cruza con Argentina/Cabo Verde en octavos (7 jul, Atlanta).',
        xg: { home: 0.95, away: 1.20 },
        rho: -0.08,
        prob: { home: 27.7, draw: 29.1, away: 43.2 },
        validacion: [
          { fuente: 'Modelo (Dixon-Coles)', home: 27.7, draw: 29.1, away: 43.2 },
          { fuente: 'bet365 (de-vig)', home: 23.0, draw: 27.0, away: 50.0 },
          { fuente: 'Kalshi (traders)', home: 28, draw: 34, away: 38 },
        ],
        goles: { over15: 63.3, over25: 36.4, over35: 17.1, bttsSi: 42.8, bttsNo: 57.2, vallaHome: 30.1, vallaAway: 38.7 },
        marcadores: [
          { score: '0-1', pct: 14.0 }, { score: '1-1', pct: 13.3 }, { score: '0-0', pct: 11.7 },
          { score: '1-0', pct: 11.1 }, { score: '0-2', pct: 8.4 },
        ],
        arbitro: { nombre: 'Gustavo Tejera', pais: 'Uruguay', promAmarillas: 3.9 },
        extras: {
          corners: { esperados: 8.5, over85: 49.8, over95: 36.9, over105: 25.8 },
          tarjetas: { esperadas: 3.9, over35: 53.5, over45: 33.6 },
          faltas: { esperadas: 25 },
        },
        arriesgados: {
          anotaPrimero: { home: 39.0, away: 49.3, ninguno: 11.7 },
          goleadores: [
            { jugador: 'Mohamed Salah', equipo: 'Egipto', prob: 41.7, cuota: 2.40, nota: 'Apto tras superar la molestia; jugará "en alguna capacidad". La prob asume titularidad — si entra desde el banco, baja. Referencia absoluta del ataque egipcio' },
            { jugador: 'Omar Marmoush', equipo: 'Egipto', prob: 30.0, cuota: 3.33, nota: 'Segunda vía ofensiva, gana peso si Salah no llega' },
            { jugador: 'Mitchell Duke', equipo: 'Australia', prob: 27.0, cuota: 3.70, nota: 'Nueve titular australiano, casi toda su generación pasa por él' },
          ],
        },
        picks: {
          fija: { seleccion: 'Under 2.5 goles', prob: 63.6, cuota: 1.57 },
          alternativas: [
            { seleccion: 'Egipto o empate (doble oportunidad)', prob: 72.3, cuota: 1.38, nota: 'La cobertura si Salah llega; Egipto controla el mediocampo' },
            { seleccion: 'Gana Egipto', prob: 43.2, cuota: 2.31, nota: 'Favorito leve, pero por debajo del 50% — sin lectura fuerte' },
            { seleccion: 'Marcador exacto 0-1', prob: 14.0, cuota: 7.14, nota: 'El más probable de la matriz: triunfo egipcio por la mínima' },
          ],
        },
        lectura: 'Partido cerrado y de pocos goles: Egipto favorito leve pero la duda de Salah aplana todo. El modelo ve más valor en el Under que en el ganador — todo pick de resultado acá es a consideración de cada uno.',
      },
      {
        id: 'arg-cv',
        home: 'Argentina', away: 'Cabo Verde',
        sede: 'Hard Rock Stadium, Miami',
        kickoffUtc: '2026-07-03T22:00:00Z',
        contexto: 'Argentina llega con puntaje ideal en grupos (3-0 Argelia, 2-0 Austria, 3-1 Jordania) y Messi como goleador del torneo (6). Cabo Verde sorprendió avanzando invicto pero con ataque casi nulo: apenas 0.21 xG generados ante España en todo el partido. Miami funciona como localía prácticamente argentina. El ganador cruza con Australia/Egipto en octavos (7 jul, Atlanta).',
        xg: { home: 2.35, away: 0.45 },
        rho: -0.03,
        prob: { home: 82.5, draw: 12.3, away: 5.2 },
        validacion: [
          { fuente: 'Modelo (Dixon-Coles)', home: 82.5, draw: 12.3, away: 5.2 },
          { fuente: 'bet365 (de-vig)', home: 82.4, draw: 12.8, away: 4.8 },
          { fuente: 'Kalshi (traders)', home: 85, draw: 11, away: 4 },
        ],
        goles: { over15: 76.9, over25: 53.1, over35: 30.9, bttsSi: 32.8, bttsNo: 67.2, vallaHome: 63.8, vallaAway: 9.5 },
        marcadores: [
          { score: '2-0', pct: 16.8 }, { score: '1-0', pct: 14.3 }, { score: '3-0', pct: 13.1 },
          { score: '2-1', pct: 7.6 }, { score: '1-1', pct: 6.4 },
        ],
        arbitro: { nombre: 'Drew Fischer', pais: 'Canadá', promAmarillas: 3.4 },
        extras: {
          corners: { esperados: 10.6, over85: 70.4, over95: 58.2, over105: 45.6 },
          tarjetas: { esperadas: 3.4, over35: 44.8, over45: 25.1 },
          faltas: { esperadas: 22 },
        },
        arriesgados: {
          anotaPrimero: { home: 78.8, away: 15.1, ninguno: 6.1 },
          goleadores: [
            { jugador: 'Lionel Messi', equipo: 'Argentina', prob: 61.5, cuota: 1.63, nota: 'Goleador del torneo con 6 — comparte la mayor cuota del ataque argentino' },
            { jugador: 'Lautaro Martínez', equipo: 'Argentina', prob: 37.0, cuota: 2.70, nota: 'Nueve de referencia, segunda vía de gol' },
            { jugador: 'Jovane Cabral', equipo: 'Cabo Verde', prob: 13.0, cuota: 7.69, nota: 'La escasa producción ofensiva caboverdiana pasa por él — probabilidad baja' },
          ],
        },
        picks: {
          fija: { seleccion: 'Gana Argentina', prob: 82.5, cuota: 1.21 },
          alternativas: [
            { seleccion: 'Argentina gana sin recibir gol', prob: 63.8, cuota: 1.57, nota: 'Cabo Verde apenas generó 0.21 xG ante España' },
            { seleccion: 'Over 2.5 goles', prob: 53.1, cuota: 1.88, nota: 'Si Argentina rompe temprano, hay margen para goleada' },
            { seleccion: 'Marcador exacto 2-0', prob: 16.8, cuota: 5.95, nota: 'El más probable de la matriz' },
          ],
        },
        lectura: 'Favorito abrumador y tres fuentes alineadas por encima del 82%. Cabo Verde generó apenas 0.21 xG ante España: el interés real del partido es por cuántos y quién, no por el resultado.',
      },
      {
        id: 'col-gha',
        home: 'Colombia', away: 'Ghana',
        sede: 'Arrowhead Stadium, Kansas City',
        kickoffUtc: '2026-07-04T01:30:00Z',
        contexto: 'Colombia ganó el Grupo K invicta (3-1 Uzbekistán, 1-0 R.D. Congo, 0-0 Portugal) pero con ataque de bajo voltaje: solo 4 goles, y Daniel Muñoz —lateral derecho— como inesperado máximo goleador con 2. Ghana llega con pegada en Kudus y Semenyo. Arbitra Clément Turpin, de los más estrictos. El ganador cruza con Suiza/Argelia en octavos (7 jul, Vancouver).',
        xg: { home: 1.75, away: 0.72 },
        rho: -0.05,
        prob: { home: 58.5, draw: 22.8, away: 18.7 },
        validacion: [
          { fuente: 'Modelo (Dixon-Coles)', home: 58.5, draw: 22.8, away: 18.7 },
          { fuente: 'bet365 (de-vig)', home: 62.9, draw: 23.5, away: 13.6 },
          { fuente: 'Modelo IA (medios)', home: 65, draw: 24, away: 14 },
        ],
        goles: { over15: 70.6, over25: 44.8, over35: 23.6, bttsSi: 42.4, bttsNo: 57.6, vallaHome: 48.7, vallaAway: 17.4 },
        marcadores: [
          { score: '1-0', pct: 14.8 }, { score: '2-0', pct: 13.0 }, { score: '1-1', pct: 10.6 },
          { score: '2-1', pct: 9.3 }, { score: '0-0', pct: 8.5 },
        ],
        arbitro: { nombre: 'Clément Turpin', pais: 'Francia', promAmarillas: 4.5 },
        extras: {
          corners: { esperados: 9.2, over85: 55.8, over95: 42.6, over105: 30.4 },
          tarjetas: { esperadas: 4.5, over35: 66.2, over45: 46.3 },
          faltas: { esperadas: 27 },
        },
        arriesgados: {
          anotaPrimero: { home: 64.9, away: 26.6, ninguno: 8.5 },
          goleadores: [
            { jugador: 'Luis Díaz', equipo: 'Colombia', prob: 40.8, cuota: 2.45, nota: 'Principal amenaza ofensiva colombiana, gran nivel individual' },
            { jugador: 'James Rodríguez', equipo: 'Colombia', prob: 32.0, cuota: 3.13, nota: 'Motor creativo con llegada y remate desde el borde del área' },
            { jugador: 'Mohammed Kudus', equipo: 'Ghana', prob: 22.3, cuota: 4.48, nota: 'Mayor share del ataque ghanés — el que puede romper el planteo colombiano' },
          ],
        },
        picks: {
          fija: { seleccion: 'Gana Colombia', prob: 58.5, cuota: 1.71 },
          alternativas: [
            { seleccion: 'Colombia o empate (doble oportunidad)', prob: 81.3, cuota: 1.23, nota: 'La cobertura sensata: Colombia rara vez pierde, pero marca poco' },
            { seleccion: 'Under 2.5 goles', prob: 55.2, cuota: 1.81, nota: 'Ataque colombiano de bajo voltaje (4 goles en grupos)' },
            { seleccion: 'Over 3.5 tarjetas', prob: 66.2, cuota: 1.51, nota: 'Turpin estricto + partido físico — el mercado de tarjetas es el más jugoso acá' },
          ],
        },
        lectura: 'Colombia favorita clara pero sin pólvora: 4 goles en toda la fase de grupos y su goleador es un lateral. Ghana tiene con qué incomodar (Kudus, Semenyo). Marcador corto probable — la fija es sólida, la goleada no.',
      },
    ],
  },
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
        arriesgados: {
          anotaPrimero: { home: 71.8, away: 21.7, ninguno: 6.5 },
          goleadores: [
            { jugador: 'Mikel Oyarzabal', equipo: 'España', prob: 50.8, cuota: 1.97, nota: '9 titular, 3 goles en el torneo — share ≈33% del ataque español' },
            { jugador: 'Lamine Yamal', equipo: 'España', prob: 22.8, cuota: 4.39, nota: '18 años (cumple 19 el 13 jul), 1G+2A — tiro desde fuera del área frecuente' },
            { jugador: 'Michael Gregoritsch', equipo: 'Austria', prob: 20.4, cuota: 4.90, nota: 'Delantero centro, 35% del peso ofensivo austríaco' },
          ],
        },
        picks: {
          fija: { seleccion: 'Gana España', prob: 71.6, cuota: 1.40 },
          alternativas: [
            { seleccion: 'España gana sin recibir gol', prob: 52.2, cuota: 1.92, nota: 'La valla a cero viene intacta en 4 partidos' },
            { seleccion: 'Over 2.5 goles', prob: 53.1, cuota: 1.88, nota: 'España genera mucho; si rompe temprano hay goleada' },
            { seleccion: 'Marcador exacto 2-0', prob: 14.1, cuota: 7.09, nota: 'El más probable de la matriz' },
          ],
        },
        lectura: 'Favorito claro y tres fuentes alineadas. Austria acaba de dar una remontada increíble ante Argelia: el batacazo (9.5%) existe, pero es el escenario improbable ya contemplado.',
        resultadoReal: '3-0',
        fijaAcerto: true,
        postAnalisis: 'Fija correcta por las razones correctas: dominio total (61% posesión, 19 tiros / 8 al arco vs 0 a puerta de Austria). Oyarzabal doblete y Pedro Porro de cabeza; la valla a cero aguantó como preveía el modelo. El diferencial de xG modelado (2.15 vs 0.65) se quedó incluso corto frente al dominio real — confirma que una brecha de xG >1.5 en eliminatorias es señal fiable. Acertaron también la valla a cero y el Over 1.5.',
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
        arriesgados: {
          anotaPrimero: { home: 57.6, away: 35.5, ninguno: 6.9 },
          goleadores: [
            { jugador: 'Cristiano Ronaldo', equipo: 'Portugal', prob: 47.6, cuota: 2.10, nota: '9 titular, 2G en grupos — todavía decide en área' },
            { jugador: 'Andrej Kramarić', equipo: 'Croacia', prob: 37.6, cuota: 2.66, nota: 'Delantero referencia, mayor share del ataque croata (~45%)' },
            { jugador: 'Bruno Fernandes', equipo: 'Portugal', prob: 31.2, cuota: 3.21, nota: 'Motor ofensivo, llegada + tiro lejano' },
          ],
        },
        picks: {
          fija: { seleccion: 'Gana Portugal', prob: 52.1, cuota: 1.92 },
          alternativas: [
            { seleccion: 'Portugal o empate (doble oportunidad)', prob: 77.0, cuota: 1.30, nota: 'La cobertura si Croacia compite como suele' },
            { seleccion: 'Ambos anotan', prob: 53.6, cuota: 1.87, nota: 'Las dos generan; Croacia no se guarda' },
            { seleccion: 'Marcador exacto 1-1', prob: 11.9, cuota: 8.40, nota: 'El resultado modal — ojo, más probable que cualquier triunfo exacto' },
          ],
        },
        lectura: 'Portugal favorita por poco: empate + Croacia suman 47.8%. El marcador individual más probable es el empate. El modelo no tiene una lectura fuerte acá.',
        resultadoReal: '2-1',
        fijaAcerto: true,
        postAnalisis: 'Fija correcta pero por el margen más fino: Croacia se adelantó (Perišić 53\'), Ronaldo empató de penal (67\') y Gonçalo Ramos la ganó de cabeza en el 90+3\'. El modelo fue honesto al marcarla como baja confianza (52.1%, sin lectura fuerte) — el partido casi termina en el 1-1 modal que señalaba la matriz. Nota de proceso alta aunque el resultado fue un volado: acertar no valida sobrevender un casi-empate. El mercado arriesgado también avisaba: Croacia anota primero era 35.5% y ocurrió.',
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
        arriesgados: {
          anotaPrimero: { home: 55.7, away: 35.9, ninguno: 8.4 },
          goleadores: [
            { jugador: 'Breel Embolo', equipo: 'Suiza', prob: 40.1, cuota: 2.49, nota: 'Centro de ataque titular, 33% del peso ofensivo suizo' },
            { jugador: 'Riyad Mahrez', equipo: 'Argelia', prob: 33.0, cuota: 3.03, nota: '2G+1A en grupos — referencia técnica del ataque argelino' },
            { jugador: 'Xherdan Shaqiri', equipo: 'Suiza', prob: 26.7, cuota: 3.75, nota: 'Veterano con llegada y remate desde media distancia' },
          ],
        },
        picks: {
          fija: { seleccion: 'Gana Suiza', prob: 49.5, cuota: 2.02 },
          alternativas: [
            { seleccion: 'Suiza o empate (doble oportunidad)', prob: 76.2, cuota: 1.31, nota: 'La jugada sensata en el partido más parejo del día' },
            { seleccion: 'Under 2.5 goles', prob: 53.1, cuota: 1.88, nota: 'Choque táctico, tendencia a marcador corto' },
            { seleccion: 'Marcador exacto 1-1', prob: 12.7, cuota: 7.87, nota: 'El resultado modal de la matriz' },
          ],
        },
        lectura: 'El partido más parejo del día: Suiza favorita por menos del 50% y empate+Argelia superan la mitad. Cualquiera de los tres resultados es plausible — todo pick acá es a consideración de cada uno.',
        resultadoReal: '2-0',
        fijaAcerto: true,
        postAnalisis: 'Fija correcta y más cómoda de lo que el modelo anticipaba (49.5% baja confianza). Suiza dominó desde el arranque: Embolo abrió en el 10\' (el pick de goleador arriesgado acertó) y Ndoye la sentenció en el 46\'. La defensiva suiza mantuvo el arco en cero (probabilidad modelada 36.8%) — el Under 2.5 también acertó. Lección: cuando el favorito tiene el 49% y el marcador 2-0 está en la lista, el dominio real puede superar holgadamente la estrechez estadística.',
      },
    ],
  },
]
