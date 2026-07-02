# Análisis Post-Partido — Metodología

Guía para escribir el `postAnalisis` y evaluar cada predicción con honestidad.
El objetivo es aprender, no celebrar ni excusar.

---

## 1. Recopilar estadísticas reales

Antes de escribir nada, obtener:

| Dato | Fuente preferida |
|---|---|
| Resultado final (90', prórroga, penales) | FlashScore, FIFA.com |
| xG real por equipo | FBref, FotMob, Sofascore |
| Posesión, tiros, tiros a puerta | ESPN, FBref |
| Corners totales | FlashScore, FBref |
| Tarjetas amarillas/rojas | Fuente oficial FIFA |
| Goleadores y minutos | FlashScore, Marca, ESPN |

---

## 2. Comparar predicción vs realidad

| Métrica | Cómo comparar |
|---|---|
| xG predicho vs real | Delta = real − modelo (+ si el equipo generó más de lo esperado) |
| Resultado 1X2 | ¿El resultado del partido coincide con el de la fija? |
| Over/Under goles | ¿El total de goles superó la línea pronosticada? |
| BTTS | ¿Ambos equipos anotaron? |
| Corners | ¿Estuvo dentro del rango esperado? |
| Tarjetas | ¿El árbitro actuó como su promedio? |

---

## 3. Clasificar el resultado del modelo

Asignar UNA de estas categorías:

| Categoría | Cuándo |
|---|---|
| ✅ Acierto por las razones correctas | El resultado coincidió Y el xG real fue similar al modelado Y la narrativa previa fue correcta |
| 🍀 Acierto con suerte | Acertó el 1X2 pero por razones distintas (ej: gol en propia puerta, expulsión temprana, xG real muy diferente) |
| ❌ Error comprensible | Falló pero la predicción tenía lógica (el favorito perdió en un upset legitimamente improbable) |
| 💀 Error de modelo | Falló Y había señales que el modelo debió haber capturado (baja clave ignorada, xG sobreestimado claramente) |

---

## 4. Dos notas separadas (proceso vs resultado)

Dar **SIEMPRE** dos calificaciones:

- **Nota de proceso** (1-10): ¿La investigación fue rigurosa? ¿Los xG estaban bien calibrados? ¿Se consideraron las variables correctas? Esta nota NO depende del resultado.
- **Nota de resultado** (1-10): ¿El modelo acertó? Simple comparación con la realidad.

> Una predicción puede tener proceso 9/10 y resultado 3/10 (todo bien pero hubo un upset).
> Y viceversa: proceso 4/10 y resultado 8/10 (suerte pura).
> Separar SIEMPRE las dos.

---

## 5. Redactar el postAnalisis

Campo conciso (2-4 frases). Estructura sugerida:
1. Resultado del partido y la fija (acertó/falló).
2. Categoría + razón principal (una oración).
3. Observación sobre xG real vs modelado.
4. Lección concreta para futuros partidos (si aplica).

**Ejemplos:**

```
España ganó 3-0, fija correcta. Acierto por las razones correctas: el xG
real (2.42 vs 0.31) superó lo modelado (2.15 vs 0.65) pero la dirección
era la misma. Austria colapsó físicamente en la segunda parte. Confirma que
el diferencial de xG Spain > 1.5 es señal confiable en eliminatorias.
```

```
Croacia ganó 2-1 en prórroga, fija falló (Portugal era favorita). Error
comprensible: el modelo la daba 52.1% y Croacia demostró su capacidad
histórica en fases eliminatorias. xG real fue 1.61 vs 1.43 — casi
empatados, como preveía el modelo. Lección: con Croacia en eliminatorias,
ajustar el ρ a -0.07 (partido más táctico de lo usual).
```

---

## 6. Actualizar bracket.js

Siempre después de un partido:
- `resultado: 'X-Y'` en el cruce correspondiente.
- `penales: 'A-B'` si hubo penales.
- `nota: 'prórroga'` si hubo prórroga.
- Quitar `hoy: true`.
- Actualizar el cruce de siguiente ronda con el ganador:
  - Quitar `pendiente` si ya se conocen ambos equipos.
  - Poner `home`/`away` con el equipo que avanzó.

---

## 7. Principios de honestidad

1. **Nunca reescribir la predicción original** después del kickoff. El campo `resultadoReal` documenta el resultado; los campos originales (`xg`, `prob`, `picks`) quedan intactos como registro.
2. **El proceso importa más que el resultado**. Un modelo que acierta por suerte 10 veces seguidas es peor que uno que falla una vez por razones sólidas.
3. **Reconocer la varianza**: si algo tenía 10% de probabilidad y ocurrió, el modelo no estuvo equivocado — el modelo dijo que pasaría 1 de cada 10 veces.
4. **Ser específico en los errores**: "el modelo falló" no es suficiente. ¿Qué variable estuvo mal calibrada? ¿Por qué?
5. **Acumular lecciones**: cada post-partido debe producir al menos UNA observación aplicable a futuros partidos del torneo.
