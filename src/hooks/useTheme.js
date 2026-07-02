import { useEffect, useState } from 'react'

// El tema inicial lo fija un script inline en index.html (evita flash).
// Este hook solo sincroniza el toggle con <html data-theme> y localStorage.
export function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}
