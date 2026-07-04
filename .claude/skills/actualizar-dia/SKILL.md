---
description: >
  Flujo diario completo: archiva predicciones pasadas con resultados reales,
  recalibra partidos a <1h del kickoff, genera predicciones de la fecha nueva,
  actualiza bracket y entrega commit message + summary para push/redeploy.
  Compatible con Claude Code, GitHub Copilot, OpenAI Codex, o cualquier
  asistente de IA con acceso a web y edición de archivos.
---

# /actualizar-dia — Flujo Diario Mundial 2026

Skill orquestadora. Decide qué hacer según el estado actual del proyecto.
**No corre git.** Al final entrega el commit message y summary para que el usuario haga push.

> **Compatibilidad:** Esta skill está escrita como instrucciones autocontenidas.
> Funciona con **Claude Code** (`/actualizar-dia`), **GitHub Copilot Chat**,
> **OpenAI GPT-4o/o1**, **Codex**, o cualquier LLM con acceso a web y a los
> archivos del repo. Si usás otro asistente, pegá el contenido de este archivo
> como prompt de sistema y adjuntá las `referencias/` si el contexto lo permite.

---

## Paso 0 — Orientación: ¿qué toca hoy?

1. Leer `src/data/predicciones.js` → identificar la jornada más reciente (`jornadas[0]`).
2. Obtener la fecha y hora actual (UTC).
3. Clasificar el estado:

| Situación | Acción |
|---|---|
| Hay partidos pasados sin `resultadoReal` | → **Paso 1: Archivar** |
| Hay un partido de hoy que arranca en <60-90 min y sin XI | → **Paso 2: Recalibrar** |
| La fecha de hoy no tiene jornada en `predicciones.js` | → **Paso 3: Nueva fecha** |
| Bracket tiene `hoy: true` en partidos ya jugados | → Siempre actualizar bracket |

Pueden aplicar varios pasos a la vez. Ejecutarlos en orden: 1 → 2 → 3.

**Anotar al inicio:** qué partidos de hoy tienen kickoff posterior a la hora actual y aún no tienen `resultadoReal`. Esos son "pendientes de terminar esta sesión" → revisar en el Paso 3.5 antes del build.

---

## Paso 1 — Archivar predicciones pasadas

Para cada partido en `jornadas` donde falte `resultadoReal`:

1. **Buscar en la web** el resultado final del partido (FlashScore, FIFA, Marca, etc.).
   - Anotar: marcador al 90', si hubo prórroga, si hubo penales y el marcador de la tanda.

2. **Completar los campos** en `predicciones.js` (dentro del objeto del partido):
   ```js
   resultadoReal: '2-1',    // marcador al 90' o al final del partido
   postAnalisis: '...',     // ver metodología en referencias/post-partido.md
   fijaAcerto: true,        // true si la fija fue correcta, false si no
   ```

3. **postAnalisis**: texto conciso (2-4 frases). Incluir:
   - Si la fija acertó y POR QUÉ (razones correctas o suerte).
   - Una observación útil para calibrar futuros partidos.
   - Si falló, qué variable no se modeló bien.
   - Ver metodología honesta en `referencias/post-partido.md`.

4. **Actualizar `bracket.js`**:
   - Poner `resultado: 'X-Y'` en el partido correspondiente.
   - Si hubo prórroga: `nota: 'prórroga'`. Si hubo penales: `penales: 'A-B'`.
   - Quitar `hoy: true` del partido archivado.
   - Si el resultado desbloquea la siguiente ronda: actualizar `home`/`away` del cruce hijo, quitar `pendiente`.

---

## Paso 2 — Recalibrar (<1h antes del kickoff)

Solo si hay un partido de hoy con kickoff en menos de 60-90 minutos:

1. **Buscar los XI confirmados** (Twitter/X oficial del equipo, FlashScore Live, Sofascore).
2. **Identificar cambios respecto a las alineaciones previstas**:
   - ¿Baja de un jugador clave (goleador, creador principal)?
   - ¿Titular inesperado?
3. **Si el impacto es material (>2% en prob principal)**:
   - Ajustar `xg.home` o `xg.away` en el partido.
   - Re-simular mentalmente o correr `model/simulate.py` con los nuevos valores.
   - Actualizar `prob`, `goles`, `marcadores`, `arriesgados.goleadores` si corresponde.
   - Agregar una nota al campo `contexto` mencionando la novedad: `[RECAL 1h: ...]`.
   - Mostrar delta en `lectura`: `ANTES xG 1.70/1.05 → AHORA 1.55/1.10`.
4. Si el impacto es menor de 2%, dejar la predicción original intacta (no sobre-editar).

---

## Paso 3 — Generar predicciones de fecha nueva

Para cada partido de hoy (o mañana si ya es tarde) sin predicción en `predicciones.js`:

### 3.1 Investigación (obligatoria)
Seguir la metodología completa en **`referencias/prediccion.md`**:
- Forma reciente de cada equipo (últimos 5 partidos + fase de grupos del torneo).
- xG creados/concedidos por equipo (FBref, FotMob, Understat).
- Ranking FIFA + ELO si disponible.
- Alineaciones probables y bajas conocidas.
- Árbitro designado: nombre, país, promedio amarillas/faltas.
- Cuotas de al menos 2 casas → de-vigar para obtener probabilidades implícitas.
- Mercados de predicción (Kalshi, Polymarket) si hay data.
- **Opcional** — tiros al arco promedio por equipo (FBref/Understat/Sofascore), ver §4.4 de
  `prediccion.md`. Enriquece disparos + atajadas. Si no aparece en la búsqueda, se omite sin
  bloquear el resto del flujo — hándicap, par/impar, rango de goles y faltas over/under NO
  dependen de esto, se calculan solos (ver 3.2).

### 3.2 Calibración xG + Dixon-Coles
Seguir los pasos 3.1 → 3.5 de `referencias/prediccion.md`:
- xG ajustado por calidad de rival y sede neutral.
- Determinar ρ (rho) según tipo de partido.
- Calcular prob 1X2, goles, marcadores, extras.

### 3.3 Mercados arriesgados
Para cada partido, calcular con las fórmulas de `referencias/prediccion.md`:
```
anotaPrimero.home  = λh/(λh+λa) × (1 - P(0-0))
anotaPrimero.away  = λa/(λh+λa) × (1 - P(0-0))
anotaPrimero.ninguno = P(0-0)

prob_anytime(jugador) = 1 - exp(−λ_equipo × share_jugador)
```
Investigar shares de los 2-3 goleadores más probables por equipo (goles en el torneo / goles totales del equipo).

### 3.3b Vocabulario de picks — CRÍTICO en eliminatorias

**`'Gana X (90 min)'`** y **`'X clasifica'`** son mercados distintos. Siempre usar la variante correcta:

| Mercado | Cuándo usarlo | `seleccion` canónico |
|---|---|---|
| Gana en 90' | Partido se resuelve en tiempo reglamentario | `'Gana Argentina (90 min)'` |
| Clasifica | Fase eliminatoria; incluye prórroga + penales | `'Argentina clasifica'` |
| Doble oportunidad | Cubre 90' | `'Doble oportunidad 1X'` / `'X2'` / `'12'` |
| Empate no apuesta | Reembolso si empate a 90' | `'Argentina empate no apuesta'` |

Ver §8.1 de `referencias/prediccion.md` para las fórmulas.

### 3.3c mercadosExtra (opcional — mercados adicionales de la matriz)

Si se corre `model/simulate.py`, agregar al partido un campo `mercadosExtra`:
```js
mercadosExtra: [
  { grupo: 'goles',     seleccion: 'Par de goles',          prob: 50.8, cuota: 1.97 },
  { grupo: 'goles',     seleccion: 'Rango 2-3 goles',       prob: 47.8, cuota: 2.09 },
  { grupo: 'tiempos',   seleccion: 'Gol en el primer tiempo', prob: 62.5, cuota: 1.60 },
  { grupo: 'especiales',seleccion: 'Gana Colombia por 1 gol', prob: 22.1, cuota: 4.52 },
  // etc. — ver §8.2 de referencias/prediccion.md
]
```
Los derivados básicos (doble oportunidad, DNB, clasifica, Over 1.5, Under 3.5, BTTS No) se calculan automáticamente en la UI desde los campos `prob`, `goles` y `xg` existentes. `mercadosExtra` es solo para mercados que requieren la matriz completa.

### 3.4 Picks
- `fija`: el pick de mayor confianza según probabilidad (≥65% ALTA, 50-65% MEDIA, <50% BAJA).
- **En eliminatorias:** si la fija es de resultado, usar `'Gana X (90 min)'`. Agregar `'X clasifica'` como alternativa.
- `alternativas`: 2-3 opciones con prob y nota breve.
- `arriesgados.goleadores`: 2-3 jugadores, siempre etiquetados como ALTO RIESGO.
- `lectura`: 1-2 frases honestas. Si el modelo no tiene lectura fuerte, decirlo.

### 3.5 Inserción en predicciones.js
```js
// Al PRINCIPIO del array jornadas
{
  fecha: 'YYYY-MM-DD',
  etiqueta: 'Octavos / Cuartos / Semifinal / Final',
  partidos: [
    {
      // ... esquema completo con arriesgados
    }
  ],
}
```
El esquema completo de un partido (con `arriesgados`) está en `referencias/prediccion.md`.

---

## Paso 3.5 — Checkpoint: partidos que terminaron mientras trabajabas

Antes de hacer el build, revisar si alguno de los "pendientes de terminar esta sesión" (anotados en Paso 0) ya tiene resultado.

1. **Buscar en la web** los resultados de esos partidos (mismas fuentes que Paso 1).
2. **Para cada partido que ya terminó:**
   - Aplicar exactamente la misma lógica del Paso 1 (completar `resultadoReal`, `postAnalisis`, `fijaAcerto`).
   - Actualizar `bracket.js` (resultado, quitar `hoy: true`, desbloquear cruce siguiente si corresponde).
3. **Si algún partido todavía está en curso** (empezó pero no terminó): no forzar un resultado. Anotar en el summary del commit que ese partido sigue pendiente para el próximo `/actualizar-dia`.
4. **Si ningún partido terminó todavía:** continuar al Paso 4 sin cambios, indicar en el summary que quedan N partidos pendientes de archivar.

> **Por qué existe este paso:** el Paso 3 (investigación y generación de predicciones) puede durar 30-90 minutos. Partidos con kickoff durante esa ventana pueden terminar sin que el Paso 1 los haya cubierto. Este checkpoint los captura antes del commit.

---

## Paso 4 — Verificar build

```bash
cd C:/projects/mundial2026 && npm run build
```

Si falla: corregir el error de sintaxis y volver a intentar.
Verificar que los `prob.home + prob.draw + prob.away` sumen ~100% (±0.1%).

---

## Paso 5 — Entrega: commit message + summary

Al terminar, entregar al usuario:

```
COMMIT (una línea):
──────────────────────────────────────────────────────────
feat: predicciones <FECHA> + historial <PARTIDOS_ARCHIVADOS>
──────────────────────────────────────────────────────────

SUMMARY (cuerpo del commit):
──────────────────────────────────────────────────────────
Archivado: <Lista de partidos archivados con resultado>
  - <Equipo A> X-Y <Equipo B>: fija <acertó/falló> — <una frase de post-análisis>

Predicciones <FECHA>:
  - <Partido 1>: fija = <pick>, confianza <ALTA/MEDIA/BAJA>
  - <Partido 2>: fija = <pick>, confianza <ALTA/MEDIA/BAJA>

Bracket actualizado: <cambios si los hay>
──────────────────────────────────────────────────────────
```

El usuario hace `git add -A && git commit -m "..."` y `git push`.
El workflow de GitHub Pages (`deploy.yml`) redespliega automáticamente.

---

## Checklist de cierre

- [ ] Partidos pasados tienen `resultadoReal`, `postAnalisis`, `fijaAcerto`.
- [ ] Checkpoint 3.5 ejecutado: partidos que terminaron durante la sesión también archivados.
- [ ] `bracket.js` refleja resultados reales + próximos cruces actualizados.
- [ ] La fecha de hoy tiene predicciones completas en `predicciones.js`.
- [ ] Cada partido tiene `arriesgados` (anotaPrimero + goleadores).
- [ ] **En eliminatorias**: picks de resultado usan `'Gana X (90 min)'` (no `'Gana X'`). Alternativa `'X clasifica'` incluida.
- [ ] `fijaAcerto` refleja el mercado correcto (90' ≠ clasifica).
- [ ] (Opcional) Si se encontró dato de tiros al arco, `extras.disparos` cargado — si no, se omite sin problema.
- [ ] `npm run build` pasa sin errores.
- [ ] Summary del commit menciona partidos que siguen pendientes de archivar (si los hay).
- [ ] Commit message y summary entregados al usuario.

---

## Referencias

- Metodología de predicción completa → `referencias/prediccion.md`
- Análisis post-partido (honestidad, suerte vs habilidad) → `referencias/post-partido.md`
- Metodología fundacional del analista cuantitativo → `origin-prompt.md.txt`
- Pipeline Python → `model/simulate.py` (N=300,000 simulaciones)
- Formato YAML de entrada → `model/ejemplo_partidos.yaml`
