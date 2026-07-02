# Plan de Backend — Spring Boot para Predicciones del Día

> Documento de planificación. El frontend hoy sirve todo desde `src/data/*.js` estáticos;
> este plan define cómo reemplazarlos por una API real sin reescribir la UI.
> La costura de migración ya existe: `src/services/*.js` es el ÚNICO punto que cambia.

## 1. Contexto y objetivo

**Problema actual:** cada jornada nueva (predicciones, resultados, avances del bracket) requiere
editar archivos JS y redesplegar el sitio. Funciona para el Mundial (un mes), pero acopla
contenido con código.

**Objetivo v1:** una API REST de solo-lectura pública + escritura protegida para un único
operador (quien carga la jornada del día). Nada más.

**Alcance v1:** NO multi-usuario, NO cuentas, NO apuestas reales. Lectura abierta, escritura con
credencial de operador.

## 2. Modelo de datos

Mapeo 1:1 con los shapes actuales del frontend (así la migración es mecánica):

| Entidad | Origen frontend | Campos clave |
|---|---|---|
| `Jornada` | `predicciones.js` | fecha (PK, ISO date), etiqueta, partidos[] |
| `Partido` | `predicciones.js` | id, home, away, sede, kickoffUtc, contexto, xgHome, xgAway, rho, probHome/Draw/Away, goles (embebido), lectura |
| `Validacion` | `predicciones.js` | partidoId, fuente, home, draw, away |
| `Marcador` | `predicciones.js` | partidoId, score, pct |
| `Arbitro` | `predicciones.js` | partidoId (o entidad propia), nombre, país, promAmarillas |
| `MercadoExtra` | `predicciones.js` | partidoId, tipo (corners/tarjetas/faltas), esperados, overs (JSON) |
| `Pick` | `predicciones.js` | partidoId, esFija (bool), seleccion, prob, nota |
| `Grupo` / `EquipoGrupo` | `grupos.js` | grupo (A-L); equipo, pj, pg, pe, pp, gf, gc, dg, pts, posicion |
| `PartidoBracket` | `bracket.js` | ronda, lado (izq/der), orden, home, away, resultado, penales, nota, fecha, sede, feeds |

**Persistencia:** decidir al arrancar entre
- **H2 file-based / SQLite** — cero infra, suficiente para un solo escritor y ~100 filas. Riesgo: hosting efímero pierde el archivo (mitigable con volumen persistente).
- **Postgres gestionado gratis (Neon / Supabase)** — sobrevive redeploys, backups incluidos. Recomendado si el hosting elegido no tiene disco persistente.

Criterio: volumen de escritura minúsculo (1 jornada/día), lectura pública moderada → cualquiera
de las dos alcanza; elegir según el hosting (ver §5).

## 3. Endpoints REST v1

Versionado desde el día uno: prefijo `/api/v1`.

### Lectura (pública)
| Método | Ruta | Devuelve |
|---|---|---|
| GET | `/api/v1/jornadas` | Lista de jornadas (con partidos completos) |
| GET | `/api/v1/jornadas/{fecha}` | Una jornada por fecha ISO |
| GET | `/api/v1/grupos` | Los 12 grupos con sus tablas |
| GET | `/api/v1/bracket` | Estructura completa de llaves |

### Escritura (protegida, solo operador)
| Método | Ruta | Acción |
|---|---|---|
| POST | `/api/v1/jornadas` | Cargar la jornada del día |
| PUT | `/api/v1/jornadas/{fecha}` | Recalibrar (ej. con alineaciones ~1h antes) |
| PUT | `/api/v1/bracket/partidos/{id}` | Cargar resultado de un partido |

**Errores:** RFC 7807 (`application/problem+json`) — Spring Boot 3 lo trae con
`spring.mvc.problemdetails.enabled=true`. No inventar formato propio.

## 4. Seguridad (OWASP aplicable)

- **AuthN/AuthZ:** un solo operador → API key estática en header `X-API-Key`, validada por filtro.
  Sin JWT, sin OAuth, sin tabla de usuarios — sobre-diseño para un escritor único.
  Si algún día hay más operadores: recién ahí evaluar Spring Security con usuarios reales.
- **Validación de inputs:** Bean Validation en todos los DTOs de escritura —
  `@NotNull`, `@DecimalMin("0")/@DecimalMax("100")` para probabilidades, `@Pattern` para fechas ISO
  y marcadores (`\d+-\d+`), tamaños máximos en strings. Nunca persistir input sin validar.
- **CORS:** whitelist explícita — `https://<usuario>.github.io` + `http://localhost:5173` (dev).
  Nunca `*`. Métodos de escritura solo desde orígenes permitidos.
- **Rate limiting:** bucket4j (o filtro propio simple) en los endpoints de escritura;
  opcional en lectura si el hosting no tiene protección propia.
- **Secretos:** API key y credenciales de DB SOLO por variables de entorno
  (`application.properties` referencia `${API_KEY}`, jamás el valor en claro en el repo).
- **Headers HTTP reales** (lo que GitHub Pages no permite): vía Spring Security —
  `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Content-Security-Policy`
  para cualquier respuesta HTML (la API es JSON, pero el actuator/errores pueden servir HTML).
- **Auditoría mínima:** log estructurado de cada escritura (qué endpoint, cuándo, desde qué IP).
- **Actuator:** exponer solo `/actuator/health`; el resto deshabilitado o protegido.

## 5. Infraestructura y despliegue

Opciones gratuitas/baratas para un jar de Spring Boot:

| Opción | A favor | En contra |
|---|---|---|
| **Render (free)** | Deploy desde repo, HTTPS incluido | Se duerme tras inactividad (cold start ~30s) |
| **Fly.io** | Volumen persistente (sirve SQLite), buen free tier | CLI propia, algo más de setup |
| **Railway** | DX simple | Free tier con límite de horas |

HTTPS obligatorio en cualquier caso (todas lo dan por defecto).

**Variables de entorno necesarias:** `API_KEY` (escritura), `DATABASE_URL` (si Postgres),
`CORS_ORIGINS` (lista separada por comas).

## 6. Migración del frontend (paso a paso)

El diseño actual hace que esto sea quirúrgico:

1. **`src/services/*.js`** — único cambio de lógica: de `import` estático a
   `fetch(`${import.meta.env.VITE_API_URL}/api/v1/...`)`. Las funciones pasan a `async`.
2. **`VITE_API_URL`** — agregar `.env.production` (o variable en el workflow de Actions).
3. **`src/pages/*.jsx`** — agregar `useState` + `useEffect` simple para loading/error.
   Sin librería de data-fetching (React Query etc.) salvo que el caching se vuelva doloroso.
4. **`src/data/*.js`** — decidir en el momento: borrar, o conservar como fallback offline
   (si la API no responde, mostrar el último snapshot embebido).
5. **CSP** — ampliar `connect-src` en `index.html` con el dominio del backend.
6. **`deploy.yml`** — inyectar `VITE_API_URL` en el step de build.

## 7. Fuera de alcance v1 (explícito)

- Autenticación de usuarios finales / cuentas / perfiles.
- Comentarios, social, notificaciones.
- WebSockets o SSE (polling o redeploy diario alcanza para un prode).
- GraphQL.
- Panel de administración web (el operador usa `curl`/Postman o un script; UI de admin recién si duele).
