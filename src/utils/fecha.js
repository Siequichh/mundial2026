export function horaLocal(iso) {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export function fechaHoraLocal(iso) {
  return new Intl.DateTimeFormat('es', {
    weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso))
}

export function fechaLarga(isoDate) {
  return new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' })
    .format(new Date(isoDate + 'T12:00:00'))
}

export function tzVisitante() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

// Diferencia en días entre dos fechas 'YYYY-MM-DD' (positivo si `fecha` es anterior a `hoy`).
export function diasDesde(fecha, hoy) {
  const ms = new Date(hoy + 'T12:00:00') - new Date(fecha + 'T12:00:00')
  return Math.round(ms / 86400000)
}
