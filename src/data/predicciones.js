// Archivo de jornadas de predicción. Cada día nuevo se agrega al PRINCIPIO del array.
// Modelo: Poisson bivariado + ajuste Dixon-Coles (rho) para goles; Poisson independiente
// para córners y tarjetas (calibradas con el árbitro designado).
// kickoffUtc en ISO UTC: el frontend lo muestra en la hora local de cada visitante.
// La confianza de cada pick se deriva de su propia probabilidad (no se reparte entre partidos).
export const jornadas = [
  {
    fecha: '2026-07-04',
    etiqueta: 'Octavos de Final',
    partidos: [
      {
        id: 'can-mar',
        home: 'Canadá', away: 'Marruecos',
        sede: 'NRG Stadium, Houston',
        kickoffUtc: '2026-07-04T17:00:00Z',
        contexto: 'Canadá alcanza los octavos por primera vez en su historia tras vencer a Sudáfrica en dieciseisavos; el anfitrión llega enchufado pero pierde a Ismael Koné (tobillo fracturado). Marruecos —campeón de África y semifinalista en 2022— llega invicto y crecido: eliminó a Países Bajos por penales y su bloque es de los más sólidos del torneo. En el único antecedente reciente (grupos Qatar 2022) ganó Marruecos 2-1. Jonathan David (3 goles, 3.23 xG) es la referencia canadiense; Ismael Saibari (3) la marroquí. El ganador cruza con Francia/Paraguay en cuartos. Árbitro aún sin confirmar por FIFA.',
        xg: { home: 1.05, away: 1.35 },
        rho: -0.06,
        prob: { home: 28.4, draw: 28.9, away: 42.7 },
        validacion: [
          { fuente: 'Modelo (Dixon-Coles)', home: 28.4, draw: 28.9, away: 42.7 },
          { fuente: 'FanDuel (de-vig)', home: 17.1, draw: 28.1, away: 54.8 },
          { fuente: 'Kalshi (traders)', home: 20, draw: 28, away: 54 },
        ],
        goles: { over15: 69.9, over25: 43.0, over35: 22.1, bttsSi: 49.0, bttsNo: 51.0, vallaHome: 25.9, vallaAway: 35.0 },
        marcadores: [
          { score: '1-1', pct: 13.6 }, { score: '0-1', pct: 11.5 }, { score: '0-0', pct: 9.8 },
          { score: '1-0', pct: 8.8 }, { score: '1-2', pct: 8.7 },
        ],
        arbitro: { nombre: 'Por confirmar', pais: '—', promAmarillas: 3.8 },
        extras: {
          corners: { esperados: 9.5, over85: 61.5, over95: 48.5, over105: 36.5 },
          tarjetas: { esperadas: 4.0, over35: 58.0, over45: 37.0 },
          faltas: { esperadas: 24 },
        },
        arriesgados: {
          anotaPrimero: { home: 39.5, away: 50.7, ninguno: 9.8 },
          goleadores: [
            { jugador: 'Jonathan David', equipo: 'Canadá', prob: 34.3, cuota: 4.33, fuenteCuota: 'consenso casas', nota: 'Talismán canadiense: 3 goles y 3.23 xG en el torneo, casi todo el peso ofensivo pasa por él' },
            { jugador: 'Ismael Saibari', equipo: 'Marruecos', prob: 33.3, cuota: 3.00, fuenteCuota: 'bet365', nota: 'Máximo goleador marroquí (3), llega desde segunda línea con gran timing' },
            { jugador: 'Brahim Díaz', equipo: 'Marruecos', prob: 23.7, cuota: 4.20, fuenteCuota: 'modelo', nota: 'Diferencial entre líneas, segunda vía de gol marroquí' },
          ],
        },
        picks: {
          fija: { seleccion: 'Marruecos o empate (doble oportunidad)', prob: 71.6, cuota: 1.21, fuenteCuota: 'fanduel' },
          alternativas: [
            { seleccion: 'Gana Marruecos (90 min)', prob: 42.7, cuota: 1.74, fuenteCuota: 'fanduel', nota: 'Favorito claro pero por debajo del 50%: Canadá anfitrión es rival incómodo' },
            { seleccion: 'Under 2.5 goles', prob: 57.0, cuota: 1.65, fuenteCuota: 'fanduel', nota: 'Dos bloques cautos de eliminatoria; Marruecos rara vez se abre' },
            { seleccion: 'Marcador exacto 1-1', prob: 13.6, cuota: 7.35, fuenteCuota: 'modelo', nota: 'El más probable de la matriz — ojo, más que cualquier triunfo exacto' },
          ],
        },
        lectura: 'Marruecos es mejor equipo y llega crecido, pero un anfitrión en su primer octavo histórico no es trámite: el favorito no pasa del 43% y el empate empuja. Sin lectura fuerte de resultado exacto — el valor está en la cobertura y el Under.',
      },
      {
        id: 'par-fra',
        home: 'Paraguay', away: 'Francia',
        sede: 'Lincoln Financial Field, Filadelfia',
        kickoffUtc: '2026-07-04T21:00:00Z',
        contexto: 'Francia es una de las candidatas al título: ganó el Grupo I y barrió 3-0 a Suecia en dieciseisavos, con Mbappé como goleador del torneo (6 goles, 2.61 xG, 13 tiros al arco) en su mejor momento. Paraguay es la sorpresa: superó su grupo y eliminó a Alemania por penales (1-1) con Orlando Gill de héroe en la tanda. Su fútbol vive del orden, la transición y el caos; Julio Enciso (1G+2A) es su chispa ofensiva. Diferencia de jerarquía enorme, pero Paraguay ya demostró que aguanta y patea penales. El ganador cruza con Marruecos/Canadá en cuartos. Árbitro aún sin confirmar por FIFA.',
        xg: { home: 0.60, away: 2.30 },
        rho: -0.04,
        prob: { home: 7.6, draw: 16.7, away: 75.7 },
        validacion: [
          { fuente: 'Modelo (Dixon-Coles)', home: 7.6, draw: 16.7, away: 75.7 },
          { fuente: 'bet365 (de-vig)', home: 6.3, draw: 13.5, away: 80.1 },
          { fuente: 'Kalshi (traders)', home: 5, draw: 13, away: 84 },
        ],
        goles: { over15: 78.8, over25: 55.4, over35: 33.0, bttsSi: 41.0, bttsNo: 59.0, vallaHome: 10.0, vallaAway: 54.8 },
        marcadores: [
          { score: '0-2', pct: 14.6 }, { score: '0-1', pct: 12.4 }, { score: '0-3', pct: 11.2 },
          { score: '1-2', pct: 8.7 }, { score: '1-1', pct: 7.9 },
        ],
        arbitro: { nombre: 'Por confirmar', pais: '—', promAmarillas: 4.0 },
        extras: {
          corners: { esperados: 10.5, over85: 70.0, over95: 58.0, over105: 45.0 },
          tarjetas: { esperadas: 4.2, over35: 60.0, over45: 40.0 },
          faltas: { esperadas: 24 },
        },
        arriesgados: {
          anotaPrimero: { home: 19.5, away: 74.7, ninguno: 5.8 },
          goleadores: [
            { jugador: 'Kylian Mbappé', equipo: 'Francia', prob: 60.2, cuota: 1.61, fuenteCuota: 'bet365', nota: 'Goleador del torneo (6) y en su mejor forma — comparte la mayor cuota del ataque francés' },
            { jugador: 'Ousmane Dembélé', equipo: 'Francia', prob: 36.9, cuota: 2.70, fuenteCuota: 'modelo', nota: 'Desequilibrio y llegada por derecha, segunda vía de gol clara' },
            { jugador: 'Julio Enciso', equipo: 'Paraguay', prob: 18.9, cuota: 5.30, fuenteCuota: 'modelo', nota: 'La escasa producción ofensiva paraguaya pasa por él — probabilidad baja' },
          ],
        },
        picks: {
          fija: { seleccion: 'Gana Francia (90 min)', prob: 75.7, cuota: 1.20, fuenteCuota: 'bet365' },
          alternativas: [
            { seleccion: 'Francia gana sin recibir gol', prob: 54.8, cuota: 1.75, fuenteCuota: 'modelo', nota: 'Paraguay generó muy poco ante Alemania; Francia puede dejar el arco en cero' },
            { seleccion: 'Over 2.5 goles', prob: 55.4, cuota: 1.60, fuenteCuota: 'consenso casas', nota: 'Si Francia rompe temprano hay margen para goleada' },
            { seleccion: 'Marcador exacto 0-2', prob: 14.6, cuota: 6.85, fuenteCuota: 'modelo', nota: 'El más probable de la matriz: triunfo francés cómodo' },
          ],
        },
        lectura: 'Favorito claro y tres fuentes alineadas por encima del 75%. Paraguay vive del caos y ya eliminó a Alemania por penales: el batacazo (7.6%) existe pero es el escenario improbable ya contemplado. El interés real es por cuántos marca Francia y si Mbappé sigue su racha.',
      },
    ],
  },
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
        lectura: 'Partido cerrado y de pocos goles: Egipto favorito leve pero la duda de Salah aplana todo. El modelo ve más valor en el Under que en el ganador — todo pick de resultado aquí es a consideración de cada uno.',
        resultadoReal: '1-1',
        postAnalisis: 'Egipto ganó 4-2 en penales tras 1-1 en los 90\' (Ashour 13\', autogol de Hany 55\'). La fija Under 2.5 acertó: partido tan cerrado como anticipó el modelo (xG 0.95/1.20, empate 29%). Salah, en duda física, no marcó y el gol egipcio llegó desde una vía no modelada (Ashour), así que los goleadores arriesgados fallaron. Buena lectura del bajo voltaje; el desempate por penales confirma la paridad total.',
        fijaAcerto: true,
      },
      {
        id: 'arg-cv',
        home: 'Argentina', away: 'Cabo Verde',
        sede: 'Hard Rock Stadium, Miami',
        kickoffUtc: '2026-07-03T22:00:00Z',
        contexto: 'Argentina llega con puntaje ideal en grupos (3-0 Argelia, 2-0 Austria, 3-1 Jordania) y Messi como goleador del torneo (6). Cabo Verde sorprendió avanzando invicto pero con ataque casi nulo: apenas 0.21 xG generados ante España en todo el partido. Miami funciona como localía prácticamente argentina. El ganador cruza con Egipto en octavos (7 jul, Atlanta). [RECAL 1h: XI de Argentina confirmado a plena potencia (Messi y Lautaro titulares, De Paul/Mac Allister/Enzo/Almada); sin sorpresas ni bajas — xG sin cambios.]',
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
          fija: { seleccion: 'Gana Argentina (90 min)', prob: 82.5, cuota: 1.21 },
          alternativas: [
            { seleccion: 'Argentina gana sin recibir gol', prob: 63.8, cuota: 1.57, nota: 'Cabo Verde apenas generó 0.21 xG ante España' },
            { seleccion: 'Over 2.5 goles', prob: 53.1, cuota: 1.88, nota: 'Si Argentina rompe temprano, hay margen para goleada' },
            { seleccion: 'Marcador exacto 2-0', prob: 16.8, cuota: 5.95, nota: 'El más probable de la matriz' },
          ],
        },
        lectura: 'Favorito abrumador y tres fuentes alineadas por encima del 82%. Cabo Verde generó apenas 0.21 xG ante España: el interés real del partido es por cuántos y quién, no por el resultado.',
        resultadoReal: '3-2',
        postAnalisis: 'FIJA FALLÓ A 90\': el partido terminó 1-1 en tiempo reglamentario (Messi 29\', Duarte 59\') — cualquier apuesta a "Gana Argentina (90 min)" habría perdido. Argentina clasificó en la prórroga (Lisandro 92\', Cabral 103\' para Cabo Verde, autogol Borges 111\'), pero eso es otro mercado ("Clasifica"). El modelo modeló el peligro de Cabo Verde en 5.2% y 0.45 xG; terminaron anotando dos y forzando 120 minutos. Lección de proceso: el xG de un tapado eliminatorio sin presión puede rebotar su histórico por 3-4x — la confianza del 82.5% encubrió una varianza real mucho mayor.',
        fijaAcerto: false,
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
            { seleccion: 'Over 3.5 tarjetas', prob: 66.2, cuota: 1.51, nota: 'Turpin estricto + partido físico — el mercado de tarjetas es el más jugoso aquí' },
          ],
        },
        lectura: 'Colombia favorita clara pero sin pólvora: 4 goles en toda la fase de grupos y su goleador es un lateral. Ghana tiene con qué incomodar (Kudus, Semenyo). Marcador corto probable — la fija es sólida, la goleada no.',
        resultadoReal: '1-0',
        postAnalisis: 'Fija "Gana Colombia" correcta por las razones correctas: gol tempranero de Jhon Arias (14\') y control total (61% posesión, 7 tiros al arco vs 0 de Ghana, xG real 2.06 vs 0.26). La valla a cero y el Under 2.5 acertaron: Ghana no remató nunca al arco, justo el bajo voltaje que anticipaba el modelo (xG 1.75/0.72). El único fallo fue el goleador: los arriesgados eran Luis Díaz, James y Kudus, pero el gol lo hizo Arias — recordatorio de que en un ataque colombiano tan repartido el share individual es difícil de clavar. Marcador corto exactamente como preveía la lectura.',
        fijaAcerto: true,
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
        lectura: 'Portugal favorita por poco: empate + Croacia suman 47.8%. El marcador individual más probable es el empate. El modelo no tiene una lectura fuerte aquí.',
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
        lectura: 'El partido más parejo del día: Suiza favorita por menos del 50% y empate+Argelia superan la mitad. Cualquiera de los tres resultados es plausible — todo pick aquí es a consideración de cada uno.',
        resultadoReal: '2-0',
        fijaAcerto: true,
        postAnalisis: 'Fija correcta y más cómoda de lo que el modelo anticipaba (49.5% baja confianza). Suiza dominó desde el arranque: Embolo abrió en el 10\' (el pick de goleador arriesgado acertó) y Ndoye la sentenció en el 46\'. La defensiva suiza mantuvo el arco en cero (probabilidad modelada 36.8%) — el Under 2.5 también acertó. Lección: cuando el favorito tiene el 49% y el marcador 2-0 está en la lista, el dominio real puede superar holgadamente la estrechez estadística.',
      },
    ],
  },
]
