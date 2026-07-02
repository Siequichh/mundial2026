import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fuentes self-hosted (solo los pesos usados) — sin CDNs de terceros.
import '@fontsource/big-shoulders-display/500.css'
import '@fontsource/big-shoulders-display/700.css'
import '@fontsource/big-shoulders-display/900.css'
import '@fontsource/barlow/400.css'
import '@fontsource/barlow/500.css'
import '@fontsource/barlow/600.css'
import '@fontsource/barlow/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/600.css'
import 'flag-icons/css/flag-icons.min.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
