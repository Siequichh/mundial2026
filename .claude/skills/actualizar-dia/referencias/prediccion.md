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

## 4. Corners, tarjetas, faltas, disparos y atajadas

### 4.1 Corners
- Modelar con Poisson independiente para cada equipo.
- Media de corners: promedio de los últimos 5 partidos de cada equipo + ajuste por estilo del rival.
- Calcular Over 8.5/9.5/10.5 con `P(total ≥ 9/10/11)`.
- **Opcional** — guardar también el split por equipo en `extras.corners.home.esperados` /
  `.away.esperados` (media de corners forzados por cada uno). Si se guarda, la app deriva sola el
  Over 4.5 córners por equipo — no hace falta calcularlo a mano.

### 4.2 Tarjetas
- Lambda base = promedio histórico del árbitro designado.
- Ajustar +10-20% si alguno de los equipos tiene historial disciplinario alto.
- Fuente: transfermarkt.com o RSSSF para stats de árbitros FIFA.

### 4.3 Faltas
- Dato directo del árbitro: `prom_faltas` o promedio del torneo (~22/partido). Guardar solo
  `extras.faltas.esperadas` — **el Over 22.5/24.5 se deriva solo** en el cliente (Poisson sobre ese
  lambda). No hace falta calcularlo ni guardarlo en `predicciones.js`.

### 4.4 Disparos (tiros al arco) — OPCIONAL, enriquece el catálogo si hay dato confiable
- Fuentes: FBref (pestaña "Shooting", columnas `Sh` tiros totales / `SoT` tiros al arco),
  Understat, Sofascore (stats del partido/torneo).
- Estimar λ_disparos por equipo: promedio de tiros al arco de los últimos 5-10 partidos, mismo
  criterio de ajuste que el xG (calidad de rival, sede neutral).
- Guardar en `extras.disparos: { home: { esperados }, away: { esperados } }`. La app deriva sola
  el Over 3.5 tiros al arco por equipo (Poisson).
- **Si no hay dato confiable, omitir el campo por completo** — nada se rompe, la ficha
  simplemente no muestra esa sección. No es un requisito del flujo diario.

### 4.5 Atajadas (saves del arquero) — se derivan solas, CERO investigación propia
- No hace falta buscar nada adicional. La app calcula:
  ```
  esperado_atajadas_home = max(disparos.away.esperados − xg.away, 0.3)
  esperado_atajadas_away = max(disparos.home.esperados − xg.home, 0.3)
  ```
  (tiros al arco del rival que no terminaron en gol ≈ atajadas del arquero propio; piso de 0.3
  para evitar un lambda irreal). Esto solo aparece si ya se cargó `extras.disparos` (§4.4).

### 4.6 Hándicap, Par/Impar y Rango de goles — GRATIS, no autorar nada
Estos tres mercados se calculan en el cliente reconstruyendo la matriz Dixon-Coles a partir de
`xg.home`, `xg.away` y `rho` — campos que **todo partido ya tiene**. No requieren investigación ni
campos nuevos en `predicciones.js`, ni en partidos viejos ni en los nuevos. La skill no tiene que
hacer nada para que aparezcan.

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
    // corners.home / corners.away: opcional, ver §4.1
    tarjetas: { esperadas: 0.0, over35: 0.0, over45: 0.0 },
    faltas: { esperadas: 0 },   // Over 22.5/24.5 se derivan solos, no se guardan
    // disparos: { home: { esperados: 0.0 }, away: { esperados: 0.0 } },  // OPCIONAL, ver §4.4
    // atajadas NO se guarda — se deriva sola de disparos + xg, ver §4.5
  },
  arriesgados: {
    anotaPrimero: { home: 0.0, away: 0.0, ninguno: 0.0 },
    goleadores: [
      { jugador: 'Nombre', equipo: 'Equipo', prob: 0.0, cuota: 0.00, fuenteCuota: 'bet365', nota: '...' },
      // 2-3 jugadores, los de mayor share de cada equipo
    ],
  },
  picks: {
    fija: { seleccion: 'Texto del pick', prob: 00.0, cuota: 0.00, fuenteCuota: 'bet365' },
    alternativas: [
      { seleccion: 'Texto', prob: 00.0, cuota: 0.00, fuenteCuota: 'bet365', nota: 'Nota breve' },
      // 2-3 alternativas
    ],
    // fuenteCuota: 'bet365' | 'betsson' | 'modelo' — OBLIGATORIO junto a cuota, ver §8.
  },
  lectura: 'Análisis editorial honesto...',
  // La skill agrega estos campos el día siguiente:
  // resultadoReal: '2-1',
  // postAnalisis: 'El modelo acertó por las razones correctas...',
  // fijaAcerto: true,
}
```

---

## 8. Campo `cuota` y `fuenteCuota` (obligatorios desde julio 2026)

Cada pick (fija, alternativas, goleadores) **debe incluir `cuota`** en formato decimal universal
(ej. `1.85`) **y `fuenteCuota`** indicando de dónde salió.

> ⚠ **Auditoría de 2026-07**: se revisaron los 56 picks existentes en `predicciones.js` y **45
> (80%) coincidían exactamente** con `round(100/prob, 2)` — la fórmula de respaldo, NO una cuota
> real. En los 6 partidos ya archivados eran **42/42 (100%)**. Una cuota real de casa de apuestas
> **siempre** es menor a la cuota justa (la casa retiene margen/vig) — que coincidan al centavo es
> estadísticamente imposible si de verdad se hubiese consultado una casa. Conclusión: el fallback
> se venía usando como regla general, no como excepción. **No repetir este error.**

### 8.0 Proceso obligatorio para cada `cuota`

1. **Casa de referencia primaria: Bet365.** Secundaria (si Bet365 no cubre el mercado): Betsson.
   No mezclar casas dentro del mismo partido salvo necesidad.
2. Buscar la cuota **del mercado exacto** que dice `seleccion` (ver tabla de vocabulario abajo y
   §8.1 para no confundir 90' con Clasifica). Anotar `fuenteCuota: 'bet365'` (o `'betsson'`).
3. **Solo si la casa genuinamente no cubre ese mercado puntual** (p. ej. line de córners por
   equipo, marcador exacto poco común): usar la cuota justa `round(100/prob, 2)` y marcar
   `fuenteCuota: 'modelo'`. Esto es la excepción, no el default.
4. **Auto-chequeo antes de guardar**: si TODAS las cuotas de un partido son exactamente
   `round(100/prob, 2)`, es señal de que no se investigó nada real — parar y buscar de verdad
   antes de continuar. Un partido real normalmente tiene una mezcla: algunos picks con cuota de
   casa (con vig, por lo tanto más bajas que la justa) y como mucho 1-2 con `'modelo'` si el
   mercado es raro.
5. **Líneas over/under**: usar la línea exacta si la casa la tiene (ej. Over 2.5). Si solo ofrece
   una línea distinta (ej. Over 2.25 asiático), usar esa y anotarlo en `nota`, o caer a `'modelo'`
   si no hay nada comparable — nunca forzar una coincidencia.

**Vocabulario canónico en `seleccion`** (la UI localiza al español en display; no cambiar los datos):

| Selección canónica | Chip UI | Notas |
|---|---|---|
| `'Over 2.5 goles'` / `'Under 2.5 goles'` | `+2.5` / `−2.5` | Aplica a cualquier threshold |
| `'Ambos anotan'` | `GG` | |
| `'Ambos anotan No'` | `NG` | |
| `'Valla a cero …'` | — | Formatter lo muestra como "Arco en cero" |
| `'X o empate (doble oportunidad)'` | — | Para el formato antiguo de alternativas |
| **`'Gana X (90 min)'`** | `90'` | **Usar SIEMPRE en fases eliminatorias.** Solo cubre los 90'. |
| **`'X clasifica'`** | `Q` | Incluye prórroga y penales. Ver §8.1. |
| `'Doble oportunidad 1X'` / `'X2'` / `'12'` | `1X` / `X2` / `'12` | UI los muestra con chip propio |
| `'X empate no apuesta'` | `DNB` | |
| `'X anota primero'` | `1er` | |
| `'X marca'` | `GOL` | Para goleadores en combinadas/pool |

### 8.1 Gana (90 min) vs Clasifica — CRÍTICO en eliminatorias

En fases eliminatorias **son mercados distintos**:

- **`'Gana X (90 min)'`** → liquida al pitazo final del tiempo reglamentario. Si el partido va a prórroga o penales, la apuesta **se pierde** aunque ese equipo clasifique después.
- **`'X clasifica'`** → incluye prórroga y penales. El modelo la computa como:
  ```
  P(clasifica_home) = P(gana_home_90) + P(empate_90) × λh/(λh + λa)
  P(clasifica_away) = P(gana_away_90) + P(empate_90) × λa/(λh + λa)
  ```
  El reparto del empate en prórroga/penales es proporcional a la fuerza relativa (xG) — simplificación conocida.

> ⚠ **Ejemplo**: Argentina-Cabo Verde terminó 1-1 en 90'. La fija "Gana Argentina (90 min)" **falló**. Argentina clasificó en prórroga, que es el mercado "Argentina clasifica".

La `fija` y las `alternativas` de picks **siempre deben usar la variante correcta**. El campo `seleccion` canónico define qué mercado es, no el texto que el usuario ve.

**Al buscar la cuota (§8.0) de un pick de eliminatoria, cruzar con esto:**
- Para `'Gana X (90 min)'` → buscar el mercado de la casa llamado **"Regular Time" / "Tiempo
  Reglamentario" / "90 Minutes"** (Bet365 lo separa del "Match Winner" principal en fases
  eliminatorias). NO usar el "Match Winner" genérico si ese incluye prórroga+penales — sería la
  cuota de otro mercado pegada en el pick equivocado.
- Para `'X clasifica'` → buscar **"To Qualify" / "Pasar de ronda" / "Match Winner incl. Overtime"**.
- Si la casa no distingue los dos mercados explícitamente para ese partido, tratar la cuota como
  no disponible para ese pick puntual y usar `fuenteCuota: 'modelo'` — no asumir que un mercado
  sirve para el otro.

### 8.2 mercadosExtra (campo opcional para mercados de la simulación)

Para mercados que requieren la matriz completa (hándicap, par/impar, rango de goles, totales por equipo, margen de victoria, córners por equipo), el sim puede emitirlos en un campo opcional:

```javascript
mercadosExtra: [
  { grupo: 'handicap',  seleccion: 'Hándicap europeo +1 Colombia', prob: 78.2, cuota: 1.28, nota: 'Colombia gana o empata si le dan un gol de ventaja' },
  { grupo: 'goles',     seleccion: 'Par de goles',                 prob: 50.8, cuota: 1.97 },
  { grupo: 'goles',     seleccion: 'Rango 0-1 goles',             prob: 28.4, cuota: 3.52, nota: 'Partido muy cerrado' },
  { grupo: 'goles',     seleccion: 'Rango 2-3 goles',             prob: 47.8, cuota: 2.09 },
  { grupo: 'goles',     seleccion: 'Rango 4+ goles',              prob: 23.8, cuota: 4.20 },
  { grupo: 'tiempos',   seleccion: 'Gol en el primer tiempo',     prob: 62.5, cuota: 1.60 },
  { grupo: 'tiempos',   seleccion: 'Más goles en 2do tiempo',     prob: 54.2, cuota: 1.84 },
  { grupo: 'especiales',seleccion: 'Colombia gana por 1 gol',     prob: 22.1, cuota: 4.52 },
  { grupo: 'especiales',seleccion: 'Colombia gana por 2+',        prob: 36.4, cuota: 2.75 },
]
```

Grupos disponibles: `handicap`, `goles`, `tiempos`, `especiales`, `corners`. Si el partido no tiene `mercadosExtra`, la UI simplemente no muestra esa sección.

Las **combinadas sugeridas** se generan automáticamente desde los picks — no hay que autorarlas.
Lo único necesario es que cada pick tenga `cuota`.

## 9. Convenciones

- Nombres de equipos: consistentes con `bracket.js` y `grupos.js`.
  Ej: `'Países Bajos'` (no `'Holanda'`), `'Estados Unidos'` (no `'USA'`).
- `id`: código de 3 letras en minúsculas (`'esp-aut'`, `'por-cro'`).
- Insertar siempre al **PRINCIPIO** del array `jornadas`.
- `prob.home + prob.draw + prob.away` debe sumar ~100% (±0.2%).
- `lectura` honesta: si el modelo no tiene una lectura fuerte, decirlo.
- **Español neutro, forma "tú" (no "vos").** Nada de voseo ("verificá", "armá", "tildá") ni modismos
  de un solo país (ej. "acá" → "aquí"). Todo `contexto`/`lectura`/`nota`/`postAnalisis` y cualquier
  texto de UI debe leerse igual de natural en México, Colombia, Perú o España.

---

## 10. Principios editoriales

1. **Calibración honesta**: los picks tienen probabilidades, no certezas.
2. **No oversell**: si el favorito tiene 52%, es un partido parejo — decirlo.
3. **Cada pick tiene su propia confianza** (ALTA ≥65%, MEDIA 50-65%, BAJA <50%).
   No distribuir ALTA/MEDIA/BAJA entre partidos — cada pick la gana o no por su propia probabilidad.
4. **Los mercados arriesgados son para prode, no para apuesta seria**: etiqueta obligatoria.
5. **Varianza es real**: un upset del 10% no es un error del modelo si ocurre — el modelo dijo que pasaría 1 de cada 10 veces.
