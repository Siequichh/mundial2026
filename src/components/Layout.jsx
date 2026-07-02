import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

const NAV = [
  { to: '/', label: 'Inicio', icon: '⌂' },
  { to: '/predicciones', label: 'Predicciones', icon: '◉' },
  { to: '/resultados', label: 'Resultados', icon: '≡' },
  { to: '/camino', label: 'Camino al Título', icon: '⛁' },
]

export default function Layout() {
  const [theme, toggleTheme] = useTheme()
  const { pathname } = useLocation()
  const hideTrophies = pathname.startsWith('/camino')

  return (
    <>
      <div className="trihost-stripe" aria-hidden="true"><i /><i /><i /></div>

      <header className="site-header">
        <div className="site-header-inner">
          <NavLink to="/" className="brand-logo">
            <span className="bl-main">LA FIJA</span>
            <span className="bl-slash" aria-hidden="true">//</span>
            <div className="bl-meta">
              <span className="bl-top">MUNDIAL 2026</span>
              <span className="bl-sub">PREDICCIONES DEL DÍA</span>
            </div>
          </NavLink>

          <nav className="site-nav" aria-label="Navegación principal">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'}>{n.label}</NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
            title={theme === 'dark' ? 'Modo día' : 'Modo noche'}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>

      {!hideTrophies && <div className="global-bg-trophies" aria-hidden="true">
        {/* Trofeo de la Copa Mundial de la FIFA (1974 - Actualidad) - Escultura clásica */}
        <div className="trophy-layer trophy-fifa">
          <svg viewBox="0 0 240 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M70 80C70 42 98 15 135 15C172 15 200 42 200 80C200 115 178 140 145 145C112 145 70 115 70 80Z" fill="url(#fifa-globe)" opacity="0.9"/>
            <path d="M75 55C90 35 160 30 185 55" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
            <path d="M52 110C65 85 92 80 118 105C138 125 145 165 140 215C135 270 148 315 165 370H75C92 315 105 270 100 215C95 165 102 125 122 105C148 80 175 85 188 110" stroke="url(#fifa-body)" strokeWidth="32" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M72 370H168V392C168 396 164 400 160 400H80C76 400 72 396 72 392V370Z" fill="url(#fifa-body)"/>
            <rect x="66" y="400" width="108" height="16" rx="2" fill="#006847"/>
            <path d="M60 416H180V438C180 442 176 446 172 446H68C64 446 60 442 60 438V416Z" fill="url(#fifa-body)"/>
            <rect x="54" y="446" width="132" height="16" rx="2" fill="#006847"/>
            <path d="M48 462H192V474C192 477 189 480 186 480H54C51 480 48 477 48 474V462Z" fill="url(#fifa-body)"/>
            <defs>
              <linearGradient id="fifa-globe" x1="70" y1="15" x2="200" y2="145" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF4C2"/><stop offset="0.4" stopColor="#F3B705"/><stop offset="0.9" stopColor="#A87000"/>
              </linearGradient>
              <linearGradient id="fifa-body" x1="48" y1="80" x2="192" y2="480" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE071"/><stop offset="0.5" stopColor="#E5A800"/><stop offset="1" stopColor="#7A5000"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="trophy-caption">TROFEO FIFA · 1974–2026</span>
        </div>

        {/* Trofeo Jules Rimet (1930 - 1970) - Diosa Nike con alas abiertas */}
        <div className="trophy-layer trophy-rimet">
          <svg viewBox="0 0 240 480" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 35L190 35L170 95H70L50 35Z" fill="url(#rimet-body)"/>
            <ellipse cx="120" cy="35" rx="70" ry="14" fill="#FFE893"/>
            <ellipse cx="120" cy="95" rx="50" ry="10" fill="#9C6B00"/>
            <path d="M30 155C55 125 90 120 120 135C150 120 185 125 210 155C185 175 160 170 140 150C135 185 138 250 148 330H92C102 250 105 185 100 150C80 170 55 175 30 155Z" fill="url(#rimet-body)"/>
            <circle cx="120" cy="118" r="16" fill="#FFE893"/>
            <path d="M80 330H160V355L172 435H68L80 355V330Z" fill="#1B2D5A"/>
            <path d="M76 355H164V364H76V355Z" fill="url(#rimet-body)"/>
            <path d="M70 395H170V404H70V395Z" fill="url(#rimet-body)"/>
            <path d="M58 435H182V465C182 470 177 475 172 475H68C63 475 58 470 58 465V435Z" fill="#1B2D5A"/>
            <defs>
              <linearGradient id="rimet-body" x1="30" y1="35" x2="210" y2="475" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE071"/><stop offset="0.5" stopColor="#D89B00"/><stop offset="1" stopColor="#6E4800"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="trophy-caption">JULES RIMET · 1930–1970</span>
        </div>
      </div>}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="pitch-divider" aria-hidden="true"><span /></div>
        <p>
          Modelo Poisson bivariado con ajuste Dixon-Coles. Probabilidades con fines educativos y de
          prode, no de apuestas con dinero real. El fútbol tiene varianza irreducible: esto son
          distribuciones de probabilidad, no certezas — todo resultado tomalo a tu consideración.
        </p>
        <p className="site-footer-sub">
          Mundial 2026 · México · Estados Unidos · Canadá — Se recalibra con alineaciones confirmadas ~1h antes de cada partido.
        </p>
      </footer>

      <nav className="mobile-nav" aria-label="Navegación móvil">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}>
            <span className="mn-icon" aria-hidden="true">{n.icon}</span>
            <span className="mn-label">{n.label.split(' ')[0]}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
