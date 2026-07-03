# Metodología de Predicción — Mundial 2026

Guía de referencia para generar predicciones cuantitativas rigurosas.
Absorbe el contenido de `origin-prompt.md.txt` + mejoras del pipeline actual.

---

## 1. Modelo base: Poisson Bivariado + Dixon-Coles

### 1.1 Distribución Poisson bivariada

Cada equipo genera goles de forma (aproximadamente) independiente según:
- `X ~ Poisson(λh)` — goles del equipo local
- `Y ~ Poisson(λa)` — goles del equipo visitante

`P(X=x, Y=y) = P_poisson(x; λh) × P_poisson(y; λa) × τ(x, y, λh, λa, ρ)`

### 1.2 Corrección Dixon-Coles (ρ)

El factor τ corrige solo los marcadores (0-0), (1-0), (0-1), (1-1):
```
τ(0,0) = 1 − λh·λa·ρ
τ(1,0) = 1 + λa·ρ
τ(0,1) = 1 + λh·ρ
τ(1,1) = 1 − ρ
τ(x,y) = 1  para el resto
```

**Valores típicos de ρ por tipo de partido:**
| Tipo | ρ recomendado |
|---|---|
| Partido abierto/ofensivo | -0.03 a -0.04 |
| Partido estándar de selecciones | -0.05 |
| Partido táctico / defensivo | -0.07 a -0.10 |

### 1.3 Monte Carlo (N = 300,000)

El script `model/simulate.py` ejecuta 300,000 partidos virtuales con weighted resampling para convergencia estadística. Margen de error teórico: ±0.2%.

---

## 2. Calibración de xG

### 2.1 Fuentes de xG
- **FBref** (Stats > Squad > Shooting): xG creados y concedidos por partido.
- **FotMob / Sofascore**: xG in-match para últimos partidos.
- **Understat**: historiales de selecciones nacionales.

### 2.2 Proceso de ajuste
1. Tomar xG promedio de los últimos 5-10 partidos de cada equipo.
2. **Ajustar por calidad de rival**: si el rival es mucho más fuerte/débil que los anteriores, escalar el xG ±10-20%.
3. **Factor sede neutral**: en sedes del Mundial (MX/US/CA), ambas selecciones reciben un empuje pequeño (+2-3% al "home" designado por FIFA).
4. No usar xG crudo de un solo partido — regresión a la media en fútbol es alta.

### 2.3 Validación vs mercado
Comparar `prob.home/draw/away` del modelo con las cuotas de-vigadas de al menos 2 casas:
- **Divergencia aceptable**: ±5-7 puntos porcentuales.
- Si el modelo da 60% y el mercado da 75% → revisar si hay información que el modelo no tiene (baja confirmada, motivación especial).
- **No ajustar hacia el mercado a ciegas**: el valor está en la divergencia. Solo corregir si hay una razón fundamentada.

---

## 3. Mercados de goles

Derivar de la matriz Poisson completa (0-10 goles por equipo):

| Mercado | Fórmula |
|---|---|
| Over 1.5 | `P(total ≥ 2)` |
| Over 2.5 | `P(total ≥ 3)` |
| Over 3.5 | `P(total ≥ 4)` |
| BTTS Sí | `P(X≥1 ∩ Y≥1)` |
| Valla home | `P(Y=0)` |
| Valla away | `P(X=0)` |

---

## 4. Corners, tarjetas y faltas

### 4.1 Corners
- Modelar con Poisson independiente para cada equipo.
- Media de corners: promedio de los últimos 5 partidos de cada equipo + ajuste por estilo del rival.
- Calcular Over 8.5/9.5/10.5 con `P(total ≥ 9/10/11)`.

### 4.2 Tarjetas
- Lambda base = promedio histórico del árbitro designado.
- Ajustar +10-20% si alguno de los equipos tiene historial disciplinario alto.
- Fuente: transfermarkt.com o RSSSF para stats de árbitros FIFA.

### 4.3 Faltas
- Dato directo del árbitro: `prom_faltas` o promedio del torneo (~22/partido).

---

## 5. Mercados de alto riesgo (arriesgados)

### 5.1 Equipo que anota primero

```
P(home_first) = λh/(λh + λa) × (1 − P(0-0))
P(away_first) = λa/(λh + λa) × (1 − P(0-0))
P(ninguno)    = P(0-0)
```

`P(0-0)` se extrae directamente de la celda [0][0] de la matriz Dixon-Coles.

### 5.2 Goleadores anytime

```
P(jugador anota) = 1 − exp(−λ_equipo × share_jugador)
```

**Cómo calcular share:**
- `share = goles_jugador_en_torneo / goles_totales_equipo_en_torneo`
- Ajustar si el jugador es suplente o está en duda: reducir share 30-50%.
- Share razonable para un 9 titular: 0.30-0.45.
- Share para un mediapunta/extremo: 0.10-0.25.

**Ejemplo**: España λh=2.15, Oyarzabal share=0.33 → `1 - exp(-2.15×0.33) = 50.8%`

**Obligatorio**: etiquetar SIEMPRE como "ALTO RIESGO" en el UI. Estos mercados tienen alta varianza irreducible y son para prode/entretenimiento, no apuesta seria.

---

## 6. Investigación pre-partido

### 6.1 Forma reciente
- Últimos 5 partidos (incluyendo fase de grupos del torneo).
- Resultado, xG creado/concedido, contexto del rival.

### 6.2 Alineaciones (~24h antes)
- Twitter/X oficial del equipo, FlashScore, Sofascore.
- Identificar bajas por lesión/sanción. Mencionar en `contexto`.

### 6.3 Árbitro designado
- Nombre, país, `promAmarillas`, `prom_faltas`.
- Fuentes: referee.com, transfermarkt, reporte FIFA Match Officials.

### 6.4 Cuotas de mercado
- bet365, Betfair, Pinnacle, DraftKings, Bwin.
- **De-vigar**: `prob_implícita = (1/cuota) / Σ(1/cuota_i)`.

---

## 7. Formato exacto de un partido en predicciones.js

```javascript
{
  id: 'xxx-yyy',                    // 3 letras por equipo, guión, minúsculas
  home: 'Nombre', away: 'Nombre',   // coincidir con bracket.js / grupos.js
  sede: 'Estadio, Ciudad',
  kickoffUtc: 'YYYY-MM-DDTHH:mm:ssZ',
  contexto: 'Narrativa del partido...',
  xg: { home: 0.00, away: 0.00 },
  rho: -0.05,
  prob: { home: 00.0, draw: 00.0, away: 00.0 },
  validacion: [
    { fuente: 'Modelo (Dixon-Coles)', home: 00.0, draw: 00.0, away: 00.0 },
    { fuente: 'bet365 (de-vig)', home: 00.0, draw: 00.0, away: 00.0 },
  ],
  goles: { over15: 00.0, over25: 00.0, over35: 00.0, bttsSi: 00.0, bttsNo: 00.0, vallaHome: 00.0, vallaAway: 00.0 },
  marcadores: [
    { score: '1-0', pct: 0.0 },
    // 5 más probables en orden descendente
  ],
  arbitro: { nombre: 'Nombre', pais: 'País', promAmarillas: 0.0 },
  extras: {
    corners: { esperados: 0.0, over85: 0.0, over95: 0.0, over105: 0.0 },
    tarjetas: { esperadas: 0.0, over35: 0.0, over45: 0.0 },
    faltas: { esperadas: 0 },
  },
  arriesgados: {
    anotaPrimero: { home: 0.0, away: 0.0, ninguno: 0.0 },
    goleadores: [
      { jugador: 'Nombre', equipo: 'Equipo', prob: 0.0, cuota: 0.00, nota: '...' },
      // 2-3 jugadores, los de mayor share de cada equipo
    ],
  },
  picks: {
    fija: { seleccion: 'Texto del pick', prob: 00.0, cuota: 0.00 },
    alternativas: [
      { seleccion: 'Texto', prob: 00.0, cuota: 0.00, nota: 'Nota breve' },
      // 2-3 alternativas
    ],
  },
  lectura: 'Análisis editorial honesto...',
  // La skill agrega estos campos el día siguiente:
  // resultadoReal: '2-1',
  // postAnalisis: 'El modelo acertó por las razones correctas...',
  // fijaAcerto: true,
}
```

---

## 8. Campo `cuota` (obligatorio desde julio 2026)

Cada pick (fija, alternativas, goleadores) **debe incluir `cuota`** en formato decimal universal (ej. `1.85`).

**Cómo obtenerla:**
1. Buscar en Bet365, Betsson o Te Apuesto la cuota del mercado exacto.
2. Si la casa no cubre ese mercado puntual, usar la cuota justa del modelo: `round(100 / prob, 2)`.

**Vocabulario canónico en `seleccion`** (la UI localiza al español en display; no cambiar los datos):
- Usar `'Over 2.5 goles'` / `'Under 2.5 goles'` (no "Más de" — eso lo aplica el formatter)
- Usar `'Ambos anotan'` (no "GG")
- Usar `'Valla a cero …'` (no "Arco en cero")
- Para doble oportunidad: `'X o empate (doble oportunidad)'`

Las **combinadas sugeridas** se generan automáticamente desde los picks — no hay que autorarlas.
Lo único necesario es que cada pick tenga `cuota`.

## 9. Convenciones

- Nombres de equipos: consistentes con `bracket.js` y `grupos.js`.
  Ej: `'Países Bajos'` (no `'Holanda'`), `'Estados Unidos'` (no `'USA'`).
- `id`: código de 3 letras en minúsculas (`'esp-aut'`, `'por-cro'`).
- Insertar siempre al **PRINCIPIO** del array `jornadas`.
- `prob.home + prob.draw + prob.away` debe sumar ~100% (±0.2%).
- `lectura` honesta: si el modelo no tiene una lectura fuerte, decirlo.

---

## 10. Principios editoriales

1. **Calibración honesta**: los picks tienen probabilidades, no certezas.
2. **No oversell**: si el favorito tiene 52%, es un partido parejo — decirlo.
3. **Cada pick tiene su propia confianza** (ALTA ≥65%, MEDIA 50-65%, BAJA <50%).
   No distribuir ALTA/MEDIA/BAJA entre partidos — cada pick la gana o no por su propia probabilidad.
4. **Los mercados arriesgados son para prode, no para apuesta seria**: etiqueta obligatoria.
5. **Varianza es real**: un upset del 10% no es un error del modelo si ocurre — el modelo dijo que pasaría 1 de cada 10 veces.
