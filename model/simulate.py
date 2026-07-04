#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║  simulate.py — Motor de simulación Dixon-Coles para el Mundial 2026        ║
║                                                                            ║
║  Modelo:  Poisson bivariado con corrección Dixon-Coles (rho)               ║
║  Método:  Monte Carlo con N = 300 000 simulaciones (configurable)          ║
║  Salida:  Fragmento JS listo para pegar en src/data/predicciones.js        ║
║                                                                            ║
║  Uso:     python simulate.py ejemplo_partidos.yaml                         ║
║  Autor:   Proyecto Mundial 2026                                            ║
╚══════════════════════════════════════════════════════════════════════════════╝

Explicación breve del modelo Dixon-Coles:
─────────────────────────────────────────
El modelo de Poisson independiente asume que los goles de cada equipo siguen
distribuciones Poisson separadas:
    P(X=x, Y=y) = P(X=x) · P(Y=y)    con X ~ Poi(λ), Y ~ Poi(μ)

Esto funciona bien para marcadores altos, pero SUBESTIMA la probabilidad de
resultados 0-0, 1-0, 0-1 y 1-1 porque en la realidad hay una correlación
negativa leve entre los goles de ambos equipos (cuando uno ataca, el otro
no lo hace y viceversa).

Dixon y Coles (1997) corrigen esto con un factor τ(x,y,λ,μ,ρ) que ajusta
SOLO esos 4 marcadores:
    P_DC(X=x, Y=y) = τ(x,y,λ,μ,ρ) · P(X=x) · P(Y=y)

donde ρ ∈ [-1, 1] y τ vale:
    τ(0,0) = 1 − λ·μ·ρ
    τ(1,0) = 1 + μ·ρ
    τ(0,1) = 1 + λ·ρ
    τ(1,1) = 1 − ρ
    τ(x,y) = 1    para todos los demás marcadores.

Un ρ negativo (lo habitual en fútbol, típicamente -0.03 a -0.10) AUMENTA
ligeramente la probabilidad del 0-0 y REDUCE la del 1-1.
"""

import sys
import json
import math
from collections import Counter
from pathlib import Path

import numpy as np
import yaml
from scipy.stats import poisson


# ═══════════════════════════════════════════════════════════════════════════
# FUNCIONES AUXILIARES DEL MODELO
# ═══════════════════════════════════════════════════════════════════════════

def tau_dixon_coles(x: int, y: int, lam: float, mu: float, rho: float) -> float:
    """
    Factor de corrección Dixon-Coles τ(x, y, λ, μ, ρ).
    Solo modifica los marcadores (0,0), (1,0), (0,1) y (1,1).
    """
    if x == 0 and y == 0:
        return 1.0 - lam * mu * rho
    elif x == 1 and y == 0:
        return 1.0 + mu * rho
    elif x == 0 and y == 1:
        return 1.0 + lam * rho
    elif x == 1 and y == 1:
        return 1.0 - rho
    else:
        return 1.0


def prob_marcador_dc(x: int, y: int, lam: float, mu: float, rho: float) -> float:
    """
    Probabilidad de un marcador exacto (x, y) bajo el modelo Dixon-Coles.
    """
    return (
        tau_dixon_coles(x, y, lam, mu, rho)
        * poisson.pmf(x, lam)
        * poisson.pmf(y, mu)
    )


def construir_matriz_dc(lam: float, mu: float, rho: float, max_goles: int = 10):
    """
    Construye la matriz completa de probabilidades (max_goles+1) × (max_goles+1)
    usando el modelo Dixon-Coles. Cada celda [i][j] = P(home=i, away=j).
    """
    matriz = np.zeros((max_goles + 1, max_goles + 1))
    for i in range(max_goles + 1):
        for j in range(max_goles + 1):
            matriz[i][j] = prob_marcador_dc(i, j, lam, mu, rho)
    return matriz


# ═══════════════════════════════════════════════════════════════════════════
# SIMULACIÓN MONTE CARLO
# ═══════════════════════════════════════════════════════════════════════════

def simular_partidos_mc(lam: float, mu: float, rho: float, n: int = 300_000,
                        semilla: int = 42) -> np.ndarray:
    """
    Ejecuta N simulaciones Monte Carlo del marcador usando Dixon-Coles.

    Método: muestreo por rechazo (rejection sampling).
    ─────────────────────────────────────────────────
    1. Generamos goles_home ~ Poisson(λ) y goles_away ~ Poisson(μ) independientes.
    2. Calculamos el peso de cada muestra = τ(x, y, λ, μ, ρ).
    3. Aceptamos la muestra con probabilidad = peso (ya que τ ∈ [0.9, 1.1] aprox.
       para ρ típicos, la tasa de aceptación es altísima).

    En la práctica usamos weighted resampling para eficiencia máxima.

    Devuelve: array de forma (n, 2) con [goles_home, goles_away] por simulación.
    """
    rng = np.random.default_rng(semilla)

    # Paso 1: generar muestras Poisson independientes (rápido y vectorizado)
    goles_home = rng.poisson(lam, size=n)
    goles_away = rng.poisson(mu, size=n)

    # Paso 2: calcular pesos Dixon-Coles para cada simulación
    pesos = np.ones(n)

    # Máscara para cada caso especial de Dixon-Coles
    mask_00 = (goles_home == 0) & (goles_away == 0)
    mask_10 = (goles_home == 1) & (goles_away == 0)
    mask_01 = (goles_home == 0) & (goles_away == 1)
    mask_11 = (goles_home == 1) & (goles_away == 1)

    pesos[mask_00] = 1.0 - lam * mu * rho
    pesos[mask_10] = 1.0 + mu * rho
    pesos[mask_01] = 1.0 + lam * rho
    pesos[mask_11] = 1.0 - rho

    # Paso 3: remuestreo ponderado (weighted resampling) para obtener exactamente n muestras
    pesos /= pesos.sum()
    indices = rng.choice(n, size=n, replace=True, p=pesos)

    return np.column_stack([goles_home[indices], goles_away[indices]])


def simular_corners(corners_home_media: float, corners_away_media: float,
                    n: int = 300_000, semilla: int = 43) -> np.ndarray:
    """
    Simula corners por equipo con Poisson independiente.
    Devuelve: array (n, 2) con [corners_home, corners_away].
    """
    rng = np.random.default_rng(semilla)
    ch = rng.poisson(corners_home_media, size=n)
    ca = rng.poisson(corners_away_media, size=n)
    return np.column_stack([ch, ca])


def simular_tarjetas(media_amarillas: float, n: int = 300_000,
                     semilla: int = 44) -> np.ndarray:
    """
    Simula tarjetas amarillas totales con Poisson independiente.
    Calibradas con el promedio histórico del árbitro asignado.
    Devuelve: array (n,) con total de tarjetas.
    """
    rng = np.random.default_rng(semilla)
    return rng.poisson(media_amarillas, size=n)


# ═══════════════════════════════════════════════════════════════════════════
# CÁLCULO DE MÉTRICAS
# ═══════════════════════════════════════════════════════════════════════════

def calcular_metricas(sims: np.ndarray, lam: float, mu: float, rho: float,
                      corners_sims: np.ndarray, tarjetas_sims: np.ndarray,
                      arbitro: dict, partido: dict, n: int) -> dict:
    """
    A partir de las simulaciones, calcula todas las métricas que necesita
    el archivo predicciones.js.
    """
    gh = sims[:, 0]  # goles home
    ga = sims[:, 1]  # goles away
    total_goles = gh + ga

    # ── 1. Probabilidades 1X2 ────────────────────────────────────────────
    wins_h = np.sum(gh > ga) / n * 100
    draws  = np.sum(gh == ga) / n * 100
    wins_a = np.sum(gh < ga) / n * 100

    prob = {
        'home': round(wins_h, 1),
        'draw': round(draws, 1),
        'away': round(wins_a, 1),
    }

    # ── 2. Mercados de goles ─────────────────────────────────────────────
    over15 = np.sum(total_goles >= 2) / n * 100
    over25 = np.sum(total_goles >= 3) / n * 100
    over35 = np.sum(total_goles >= 4) / n * 100
    btts_si = np.sum((gh >= 1) & (ga >= 1)) / n * 100
    btts_no = 100.0 - btts_si
    valla_home = np.sum(ga == 0) / n * 100  # home mantiene valla a cero
    valla_away = np.sum(gh == 0) / n * 100  # away mantiene valla a cero

    goles = {
        'over15': round(over15, 1),
        'over25': round(over25, 1),
        'over35': round(over35, 1),
        'bttsSi': round(btts_si, 1),
        'bttsNo': round(btts_no, 1),
        'vallaHome': round(valla_home, 1),
        'vallaAway': round(valla_away, 1),
    }

    # ── 3. Marcadores más probables (top 5) ──────────────────────────────
    # Usamos la matriz analítica (más precisa que contar simulaciones para
    # marcadores poco frecuentes)
    matriz = construir_matriz_dc(lam, mu, rho, max_goles=8)
    marcadores_flat = []
    for i in range(9):
        for j in range(9):
            marcadores_flat.append({
                'score': f'{i}-{j}',
                'pct': round(matriz[i][j] * 100, 1),
            })
    marcadores_flat.sort(key=lambda m: m['pct'], reverse=True)
    top5 = marcadores_flat[:5]

    # ── 4. Corners ───────────────────────────────────────────────────────
    # Split por equipo expuesto además del total: la app deriva Over/Under por
    # equipo con Poisson a partir de 'home'/'away' (ver src/utils/mercadosDerivados.js).
    total_corners = corners_sims[:, 0] + corners_sims[:, 1]
    media_corners = float(np.mean(total_corners))
    corners = {
        'esperados': round(media_corners, 1),
        'over85': round(np.sum(total_corners >= 9) / n * 100, 1),
        'over95': round(np.sum(total_corners >= 10) / n * 100, 1),
        'over105': round(np.sum(total_corners >= 11) / n * 100, 1),
        'home': {'esperados': round(float(np.mean(corners_sims[:, 0])), 1)},
        'away': {'esperados': round(float(np.mean(corners_sims[:, 1])), 1)},
    }

    # ── 5. Tarjetas ─────────────────────────────────────────────────────
    media_tarjetas = float(np.mean(tarjetas_sims))
    tarjetas = {
        'esperadas': round(media_tarjetas, 1),
        'over35': round(np.sum(tarjetas_sims >= 4) / n * 100, 1),
        'over45': round(np.sum(tarjetas_sims >= 5) / n * 100, 1),
    }

    # ── 6. Faltas esperadas (dato directo del árbitro) ───────────────────
    # Over/Under NO se calculan acá: se derivan en el cliente con Poisson sobre
    # 'esperadas' (ver §4.3 de referencias/prediccion.md).
    faltas = {
        'esperadas': arbitro.get('prom_faltas', 22),
    }

    # ── 6b. Disparos (tiros al arco) — opcional, solo si el YAML los trae ────
    # Atajadas se deriva sola en el cliente (disparos rival − xG rival); no se
    # calcula acá (ver §4.5 de referencias/prediccion.md).
    disparos = None
    if 'tiros_home' in partido and 'tiros_away' in partido:
        disparos = {
            'home': {'esperados': round(partido['tiros_home'], 1)},
            'away': {'esperados': round(partido['tiros_away'], 1)},
        }

    # ── 7. Extras combinados ─────────────────────────────────────────────
    extras = {
        'corners': corners,
        'tarjetas': tarjetas,
        'faltas': faltas,
    }
    if disparos:
        extras['disparos'] = disparos

    # ── 8. Picks ─────────────────────────────────────────────────────────
    picks_config = partido.get('picks', {})

    # Determinar la probabilidad de la pick fija
    fija_sel = picks_config.get('fija', {}).get('seleccion', '')
    fija_prob = _probabilidad_pick(fija_sel, prob, goles, top5, partido)

    fija = {'seleccion': fija_sel, 'prob': fija_prob}

    # Alternativas
    alternativas = []
    for alt in picks_config.get('alternativas', []):
        alt_prob = _probabilidad_pick(alt['seleccion'], prob, goles, top5, partido)
        alternativas.append({
            'seleccion': alt['seleccion'],
            'prob': alt_prob,
            'nota': alt.get('nota', ''),
        })

    picks = {'fija': fija, 'alternativas': alternativas}

    # ── 9. Validación ────────────────────────────────────────────────────
    validacion = [{'fuente': 'Modelo (Dixon-Coles)', **prob}]
    for v in partido.get('validacion_extra', []):
        validacion.append({
            'fuente': v['fuente'],
            'home': v['home'],
            'draw': v['draw'],
            'away': v['away'],
        })

    # ── 10. Mercados arriesgados ─────────────────────────────────────────
    arriesgados = mercados_arriesgados(
        matriz=matriz,
        lam=lam, mu=mu,
        goleadores_home=partido.get('goleadores_home', []),
        goleadores_away=partido.get('goleadores_away', []),
        home=partido['home'],
        away=partido['away'],
    )

    # ── 11. Índice de confianza ──────────────────────────────────────────
    confianza = _indice_confianza(prob)

    return {
        'id': partido['id'],
        'home': partido['home'],
        'away': partido['away'],
        'sede': partido['sede'],
        'kickoffUtc': partido['kickoff_utc'],
        'contexto': partido.get('contexto', ''),
        'xg': {'home': partido['xg_home'], 'away': partido['xg_away']},
        'rho': partido['rho'],
        'prob': prob,
        'validacion': validacion,
        'goles': goles,
        'marcadores': top5,
        'arbitro': {
            'nombre': arbitro['nombre'],
            'pais': arbitro['pais'],
            'promAmarillas': arbitro['prom_amarillas'],
        },
        'extras': extras,
        'arriesgados': arriesgados,
        'picks': picks,
        'lectura': partido.get('lectura', ''),
        '_confianza': confianza,
    }


def _probabilidad_pick(seleccion: str, prob: dict, goles: dict,
                        marcadores: list, partido: dict) -> float:
    """
    Determina la probabilidad numérica asociada a una selección de pick,
    deduciéndola del texto de la selección.
    """
    sel_lower = seleccion.lower()
    home_lower = partido['home'].lower()
    away_lower = partido['away'].lower()

    # Victoria simple
    if 'gana' in sel_lower and home_lower in sel_lower:
        return prob['home']
    if 'gana' in sel_lower and away_lower in sel_lower:
        return prob['away']

    # Doble oportunidad
    if 'doble oportunidad' in sel_lower or 'o empate' in sel_lower:
        if home_lower in sel_lower:
            return round(prob['home'] + prob['draw'], 1)
        if away_lower in sel_lower:
            return round(prob['away'] + prob['draw'], 1)

    # Valla a cero (clean sheet)
    if 'sin recibir gol' in sel_lower or 'valla' in sel_lower:
        if home_lower in sel_lower:
            return goles['vallaHome']
        if away_lower in sel_lower:
            return goles['vallaAway']

    # Over/Under goles
    if 'over 2.5' in sel_lower:
        return goles['over25']
    if 'over 1.5' in sel_lower:
        return goles['over15']
    if 'over 3.5' in sel_lower:
        return goles['over35']
    if 'under 2.5' in sel_lower:
        return round(100.0 - goles['over25'], 1)
    if 'under 1.5' in sel_lower:
        return round(100.0 - goles['over15'], 1)

    # BTTS
    if 'ambos anotan' in sel_lower:
        return goles['bttsSi']

    # Marcador exacto
    if 'marcador exacto' in sel_lower:
        # Buscar el marcador en el texto, ej: "Marcador exacto 2-0"
        for m in marcadores:
            if m['score'] in seleccion:
                return m['pct']
        # Si no lo encuentra, devolver el más probable
        return marcadores[0]['pct'] if marcadores else 0.0

    # Empate
    if 'empate' in sel_lower and 'doble' not in sel_lower:
        return prob['draw']

    # Fallback: devolver la probabilidad del favorito
    return max(prob['home'], prob['away'])


def mercados_arriesgados(matriz: np.ndarray, lam: float, mu: float,
                         goleadores_home: list, goleadores_away: list,
                         home: str, away: str) -> dict:
    """
    Calcula los mercados de alto riesgo:
    - anotaPrimero: probabilidad de que marque primero cada equipo (o nadie).
    - goleadores: prob anytime scorer = 1 - exp(-lambda_equipo * share_jugador).

    Fórmulas:
      P(home_first) ≈ λh/(λh+λa) × (1 - P(0-0))
      P(away_first) ≈ λa/(λh+λa) × (1 - P(0-0))
      P(ninguno)    = P(0-0)
      anytime_scorer = 1 - exp(-λ_equipo × share)
    """
    p_00 = round(matriz[0][0] * 100, 1)
    total = lam + mu
    home_first = round((lam / total) * (100 - p_00), 1) if total > 0 else 0.0
    away_first = round((mu / total) * (100 - p_00), 1) if total > 0 else 0.0

    goleadores = []
    for g in goleadores_home:
        prob = round((1 - math.exp(-lam * g['share'])) * 100, 1)
        goleadores.append({
            'jugador': g['jugador'],
            'equipo': home,
            'prob': prob,
            'nota': g.get('nota', ''),
        })
    for g in goleadores_away:
        prob = round((1 - math.exp(-mu * g['share'])) * 100, 1)
        goleadores.append({
            'jugador': g['jugador'],
            'equipo': away,
            'prob': prob,
            'nota': g.get('nota', ''),
        })

    return {
        'anotaPrimero': {'home': home_first, 'away': away_first, 'ninguno': p_00},
        'goleadores': goleadores,
    }


def _indice_confianza(prob: dict) -> str:
    """
    Genera un índice de confianza basado en la separación entre las probabilidades.

    ALTA   → el favorito supera el 65% (dominio claro)
    MEDIA  → el favorito está entre 50% y 65%
    BAJA   → el favorito está por debajo del 50% (partido abierto)
    """
    max_prob = max(prob['home'], prob['away'])
    if max_prob >= 65:
        return 'ALTA'
    elif max_prob >= 50:
        return 'MEDIA'
    else:
        return 'BAJA'


# ═══════════════════════════════════════════════════════════════════════════
# GENERACIÓN DE SALIDA JS
# ═══════════════════════════════════════════════════════════════════════════

def _js_value(v, indent=0):
    """Convierte un valor de Python a representación JS literal."""
    prefix = '  ' * indent
    if isinstance(v, dict):
        if not v:
            return '{}'
        items = []
        for k, val in v.items():
            items.append(f"{prefix}  {k}: {_js_value(val, indent + 1)}")
        return '{\n' + ',\n'.join(items) + f',\n{prefix}}}'
    elif isinstance(v, list):
        if not v:
            return '[]'
        # Para listas de diccionarios, formato multilínea
        if isinstance(v[0], dict):
            items = []
            for item in v:
                items.append(f"{prefix}  {_js_value(item, indent + 1)}")
            return '[\n' + ',\n'.join(items) + f',\n{prefix}]'
        else:
            return json.dumps(v, ensure_ascii=False)
    elif isinstance(v, str):
        # Escapar comillas simples y usar comillas simples para JS
        escaped = v.replace("\\", "\\\\").replace("'", "\\'")
        return f"'{escaped}'"
    elif isinstance(v, bool):
        return 'true' if v else 'false'
    elif isinstance(v, (int, float)):
        return str(v)
    else:
        return repr(v)


def generar_js(resultados: list, fecha: str, etiqueta: str) -> str:
    """
    Genera el bloque de código JavaScript listo para insertar en predicciones.js.
    """
    lineas = []
    lineas.append('// ── Generado automáticamente por simulate.py ──')
    lineas.append('// Copiar este bloque al PRINCIPIO del array `jornadas` en')
    lineas.append('// src/data/predicciones.js')
    lineas.append('{')
    lineas.append(f"  fecha: '{fecha}',")
    lineas.append(f"  etiqueta: '{etiqueta}',")
    lineas.append('  partidos: [')

    for r in resultados:
        # Indicador de confianza como comentario
        confianza = r.pop('_confianza', 'MEDIA')
        lineas.append(f'    {{ // ── {r["home"]} vs {r["away"]} ── Confianza: {confianza}')
        lineas.append(f"      id: '{r['id']}',")
        lineas.append(f"      home: '{r['home']}', away: '{r['away']}',")
        lineas.append(f"      sede: '{r['sede']}',")
        lineas.append(f"      kickoffUtc: '{r['kickoffUtc']}',")

        # Contexto
        ctx = r['contexto'].replace("'", "\\'")
        lineas.append(f"      contexto: '{ctx}',")

        # xG y rho
        lineas.append(f"      xg: {{ home: {r['xg']['home']}, away: {r['xg']['away']} }},")
        lineas.append(f"      rho: {r['rho']},")

        # Probabilidades 1X2
        p = r['prob']
        lineas.append(f"      prob: {{ home: {p['home']}, draw: {p['draw']}, away: {p['away']} }},")

        # Validación
        lineas.append('      validacion: [')
        for v in r['validacion']:
            fuente = v['fuente'].replace("'", "\\'")
            lineas.append(f"        {{ fuente: '{fuente}', home: {v['home']}, draw: {v['draw']}, away: {v['away']} }},")
        lineas.append('      ],')

        # Goles
        g = r['goles']
        lineas.append(f"      goles: {{ over15: {g['over15']}, over25: {g['over25']}, over35: {g['over35']}, "
                      f"bttsSi: {g['bttsSi']}, bttsNo: {g['bttsNo']}, vallaHome: {g['vallaHome']}, vallaAway: {g['vallaAway']} }},")

        # Marcadores top 5
        lineas.append('      marcadores: [')
        scores_parts = []
        for m in r['marcadores']:
            scores_parts.append(f"{{ score: '{m['score']}', pct: {m['pct']} }}")
        # Agrupar en máximo 3 por línea
        for i in range(0, len(scores_parts), 3):
            chunk = ', '.join(scores_parts[i:i+3])
            lineas.append(f"        {chunk},")
        lineas.append('      ],')

        # Árbitro
        arb = r['arbitro']
        nombre_arb = arb['nombre'].replace("'", "\\'")
        pais_arb = arb['pais'].replace("'", "\\'")
        lineas.append(f"      arbitro: {{ nombre: '{nombre_arb}', pais: '{pais_arb}', promAmarillas: {arb['promAmarillas']} }},")

        # Extras
        c = r['extras']['corners']
        t = r['extras']['tarjetas']
        f = r['extras']['faltas']
        d = r['extras'].get('disparos')
        lineas.append('      extras: {')
        lineas.append(
            f"        corners: {{ esperados: {c['esperados']}, over85: {c['over85']}, over95: {c['over95']}, over105: {c['over105']}, "
            f"home: {{ esperados: {c['home']['esperados']} }}, away: {{ esperados: {c['away']['esperados']} }} }},"
        )
        lineas.append(f"        tarjetas: {{ esperadas: {t['esperadas']}, over35: {t['over35']}, over45: {t['over45']} }},")
        lineas.append(f"        faltas: {{ esperadas: {f['esperadas']} }},")
        if d:
            lineas.append(f"        disparos: {{ home: {{ esperados: {d['home']['esperados']} }}, away: {{ esperados: {d['away']['esperados']} }} }},")
        lineas.append('      },')

        # Mercados arriesgados
        ar = r['arriesgados']
        ap = ar['anotaPrimero']
        lineas.append('      arriesgados: {')
        lineas.append(f"        anotaPrimero: {{ home: {ap['home']}, away: {ap['away']}, ninguno: {ap['ninguno']} }},")
        lineas.append('        goleadores: [')
        for gl in ar['goleadores']:
            gl_jugador = gl['jugador'].replace("'", "\\'")
            gl_equipo = gl['equipo'].replace("'", "\\'")
            gl_nota = gl.get('nota', '').replace("'", "\\'")
            lineas.append(f"          {{ jugador: '{gl_jugador}', equipo: '{gl_equipo}', prob: {gl['prob']}, nota: '{gl_nota}' }},")
        lineas.append('        ],')
        lineas.append('      },')

        # Picks
        pk = r['picks']
        fija_sel = pk['fija']['seleccion'].replace("'", "\\'")
        lineas.append('      picks: {')
        lineas.append(f"        fija: {{ seleccion: '{fija_sel}', prob: {pk['fija']['prob']} }},")
        lineas.append('        alternativas: [')
        for alt in pk['alternativas']:
            alt_sel = alt['seleccion'].replace("'", "\\'")
            alt_nota = alt['nota'].replace("'", "\\'")
            lineas.append(f"          {{ seleccion: '{alt_sel}', prob: {alt['prob']}, nota: '{alt_nota}' }},")
        lineas.append('        ],')
        lineas.append('      },')

        # Lectura
        lect = r['lectura'].replace("'", "\\'")
        lineas.append(f"      lectura: '{lect}',")

        lineas.append('    },')

    lineas.append('  ],')
    lineas.append('},')

    return '\n'.join(lineas)


# ═══════════════════════════════════════════════════════════════════════════
# PUNTO DE ENTRADA
# ═══════════════════════════════════════════════════════════════════════════

def main():
    """
    Lee un archivo YAML con la configuración de los partidos,
    ejecuta las simulaciones y genera la salida JS.
    """
    if len(sys.argv) < 2:
        print('Uso: python simulate.py <archivo_config.yaml>')
        print('Ejemplo: python simulate.py ejemplo_partidos.yaml')
        sys.exit(1)

    config_path = Path(sys.argv[1])
    if not config_path.exists():
        print(f'Error: no se encontró el archivo "{config_path}"')
        sys.exit(1)

    # ── Leer configuración ───────────────────────────────────────────────
    with open(config_path, 'r', encoding='utf-8') as f:
        config = yaml.safe_load(f)

    fecha = config['fecha']
    etiqueta = config['etiqueta']
    n_sims = config.get('simulaciones', 300_000)
    partidos = config['partidos']

    print(f'╔══════════════════════════════════════════════════════════════╗')
    print(f'║  Dixon-Coles Monte Carlo — {etiqueta:>33} ║')
    print(f'║  Fecha: {fecha}   |   Simulaciones: {n_sims:>10,}            ║')
    print(f'║  Partidos: {len(partidos)}                                              ║')
    print(f'╚══════════════════════════════════════════════════════════════╝')
    print()

    resultados = []

    for idx, partido in enumerate(partidos, 1):
        lam = partido['xg_home']
        mu = partido['xg_away']
        rho = partido['rho']
        arbitro = partido['arbitro']
        corners_h = partido.get('corners_home', 5.0)
        corners_a = partido.get('corners_away', 4.5)

        print(f'  ⚽ [{idx}/{len(partidos)}] {partido["home"]} vs {partido["away"]}')
        print(f'     xG: {lam:.2f} – {mu:.2f}  |  ρ = {rho}')
        print(f'     Simulando {n_sims:,} partidos...', end=' ', flush=True)

        # Semillas diferentes por partido para reproducibilidad
        semilla_base = hash(partido['id']) % 100_000

        # Ejecutar simulaciones
        sims_goles = simular_partidos_mc(lam, mu, rho, n=n_sims,
                                          semilla=semilla_base)
        sims_corners = simular_corners(corners_h, corners_a, n=n_sims,
                                        semilla=semilla_base + 1)
        sims_tarjetas = simular_tarjetas(arbitro['prom_amarillas'], n=n_sims,
                                          semilla=semilla_base + 2)

        # Calcular métricas
        metricas = calcular_metricas(
            sims=sims_goles,
            lam=lam, mu=mu, rho=rho,
            corners_sims=sims_corners,
            tarjetas_sims=sims_tarjetas,
            arbitro=arbitro,
            partido=partido,
            n=n_sims,
        )

        resultados.append(metricas)

        # Resumen rápido en consola
        p = metricas['prob']
        confianza = metricas['_confianza']
        print(f'✓')
        print(f'     → {partido["home"]} {p["home"]}% | Empate {p["draw"]}% | {partido["away"]} {p["away"]}%')
        print(f'     → Confianza: {confianza}')
        print(f'     → Over 2.5: {metricas["goles"]["over25"]}% | BTTS: {metricas["goles"]["bttsSi"]}%')
        print(f'     → Marcador más probable: {metricas["marcadores"][0]["score"]} ({metricas["marcadores"][0]["pct"]}%)')
        print()

    # ── Generar salida JS ────────────────────────────────────────────────
    js_output = generar_js(resultados, fecha, etiqueta)

    print('═' * 64)
    print('  SALIDA JS — Copiar en src/data/predicciones.js')
    print('═' * 64)
    print()
    print(js_output)
    print()

    # ── También guardar en archivo ───────────────────────────────────────
    output_path = config_path.with_suffix('.js')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('// Generado por simulate.py — Dixon-Coles Monte Carlo\n')
        f.write(f'// Fecha: {fecha} | N = {n_sims:,} simulaciones\n')
        f.write('// Copiar el contenido de abajo al array `jornadas` en predicciones.js\n\n')
        f.write(js_output)
        f.write('\n')

    print(f'  💾 Guardado también en: {output_path}')
    print()
    print('  ✅ Listo. Copiar el bloque JS al array `jornadas` en')
    print('     src/data/predicciones.js (al PRINCIPIO del array).')
    print()


if __name__ == '__main__':
    main()
