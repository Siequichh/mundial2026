# 🏆 FIFA World Cup 2026™ Match Predictions & Analytics Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React Router](https://img.shields.io/badge/React_Router-7.18-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Oxlint](https://img.shields.io/badge/Linter-Oxlint-00E599)](https://oxc.rs/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An advanced, responsive, and aesthetically authentic web application providing statistical match predictions, market analysis, and knockout brackets for the **2026 FIFA World Cup** hosted across **Mexico, the United States, and Canada**.

Built with modern **React 19**, **Vite**, and **React Router 7**, this project transcends generic data dashboards by combining **Bivariate Poisson & Dixon-Coles mathematical modeling** with an authentic football/soccer stadium design system.

---

## ✨ Key Features

### 🎨 Authentic Tri-Host Stadium Aesthetics
* **Tri-Host Accent System:** Employs official colors representing the three host nations: Mexico Green (`#006847`), USA Red/Blue (`#B31942` / `#0A3161`), and Canada Red (`#D80621`). Featured via signature tricolor header borders, section dividers, and gradient badges.
* **Stadium Ticket-Stub UI:** Match cards are crafted with CSS `clip-path` perforations and subtle midfield line textures to emulate physical stadium passes.
* **Self-Hosted Typography:** Zero external CDN dependencies. Employs condensed sports-style headers ([Big Shoulders Display](https://fontsource.org/fonts/big-shoulders-display)), athletic humanistic body copy ([Barlow](https://fontsource.org/fonts/barlow)), and monospace data tables ([IBM Plex Mono](https://fontsource.org/fonts/ibm-plex-mono)).
* **Day & Night Stadium Themes:** Fully persisted dual theme engine (`useTheme`) supporting automatic system preferences (`prefers-color-scheme`) and manual toggling. Both palettes meet **WCAG AA 4.5:1 contrast standards**.

### 📊 Advanced Statistical & Market Modeling
* **Dixon-Coles & Poisson Models:** Calculates expected goals ($xG$) and exact score probability matrices adjusted for low-scoring match interdependence ($\rho$).
* **Multi-Source De-Vigged Odds Validation:** Cross-references internal mathematical probabilities against true (de-vigged) bookmaker odds (e.g., bet365) and live prediction markets (e.g., Kalshi).
* **Referee-Calibrated Prop Markets:** Estimates corners, fouls, and card totals by factoring in match dynamics and the historical booking averages of officially designated FIFA referees (e.g., Glenn Nyberg).
* **Dynamic Pick Confidence ("La Fija"):** Assigns algorithmic confidence tiers (**HIGH** $\ge 65\%$, **MEDIUM** $50\text{--}65\%$, **LOW** $<50\%$) directly derived from individual pick probabilities, accompanied by ranked alternative markets (Exact Scores, BTTS, Over/Under lines).

### 🏟️ FIFA Knockout Bracket & Live Navigation
* **Converging Knockout Tree:** Interactive 32-team tournament bracket (Round of 16 $\rightarrow$ Quarterfinals $\rightarrow$ Semifinals $\rightarrow$ Final) designed with dual converging flanks mirroring official FIFA and Google layouts.
* **Vector Flag Icons:** High-definition SVG flags via `flag-icons` ensuring crisp rendering across all OS environments (including Windows where native emoji flags fail).
* **Dynamic Time Zone Conversion:** All match kickoff times are stored in strict UTC (`kickoffUtc`) and rendered automatically in the visitor's local browser timezone via `Intl.DateTimeFormat`.

---

## 📐 Mathematical Model Overview

The prediction engine relies on a **Bivariate Poisson distribution** enhanced by the **Dixon-Coles adjustment** to correct for the historical under-representation of low-scoring draws ($0\text{--}0$, $1\text{--}1$, $1\text{--}0$, $0\text{--}1$) in international football tournaments.

$$\Pr(X=x, Y=y) = \frac{\lambda_1^x e^{-\lambda_1}}{x!} \cdot \frac{\lambda_2^y e^{-\lambda_2}}{y!} \cdot \tau_{\lambda_1, \lambda_2, \rho}(x, y)$$

Where:
* $\lambda_1, \lambda_2$: Expected goals ($xG$) for Home and Away teams.
* $\rho$: Interdependence parameter adjusting probabilities for low scores ($x, y \in \{0, 1\}$).
* $\tau$: Adjustment multiplier recalculating $1\text{X}2$ win/draw/loss percentages, clean sheets, and Over/Under thresholds.

---

## 🏗️ Architecture & Project Structure

The project is structured with strict **separation of concerns**, decoupling UI components from data structures via an intermediate **Service Layer** to facilitate seamless future backend integration.

```text
mundial2026/
├── .github/workflows/
│   └── deploy.yml              # Automated GitHub Pages deployment pipeline
├── docs/
│   └── BACKEND_PLAN.md         # Comprehensive Spring Boot REST API migration blueprint
├── public/                     # Static public assets
└── src/
    ├── components/
    │   ├── BracketFifa.jsx     # Converging 32-team knockout tree component
    │   ├── GroupTable.jsx      # Standings & group stage table with flag icons
    │   ├── Header.jsx          # App navigation, tricolor stripe & theme toggle
    │   ├── Footer.jsx          # Footer & methodology disclaimers
    │   ├── Layout.jsx          # Main route wrapper with mobile bottom app bar
    │   ├── PartidoCard.jsx     # Ticket-stub match card with odds & prop markets
    │   └── ProbBar.jsx         # Visual 1X2 probability bar
    ├── data/
    │   ├── bracket.js          # Tournament bracket matchups & results
    │   ├── grupos.js           # Group stage standings data
    │   └── predicciones.js     # Match fixtures, xG, odds & statistical data
    ├── hooks/
    │   ├── useReveal.js        # Scroll reveal animation hook
    │   └── useTheme.js         # Light/dark theme persistence hook
    ├── pages/
    │   ├── Inicio.jsx          # Hero section & today's featured matches
    │   ├── Predicciones.jsx    # Complete match predictions archive by matchday
    │   ├── Resultados.jsx      # 12 group stage standings tables
    │   └── Camino.jsx          # Full knockout tournament tree
    ├── services/
    │   ├── bracketService.js   # Service seam for bracket data access
    │   ├── groupsService.js    # Service seam for group standings
    │   └── predictionsService.js # Service seam for prediction fixtures
    ├── utils/
    │   ├── fecha.js            # Local timezone formatting utilities
    │   └── flags.js            # Country-to-ISO flag mapping helper
    ├── App.jsx                 # HashRouter route definitions
    ├── index.css               # Design system tokens, variables & utility styles
    └── main.jsx                # Application entry point & font loads
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<your-username>/mundial2026.git
   cd mundial2026
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173/mundial2026/`.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite hot-module-replacement (HMR) dev server |
| `npm run build` | Compiles and minifies production-ready bundles into `./dist` |
| `npm run preview` | Spawns a local static server to inspect the production build |
| `npm run lint` | Runs high-speed TypeScript/JSX code linter via **Oxlint** |

---

## 🌐 Deployment (GitHub Pages)

This project uses `HashRouter` specifically configured to eliminate 404 client-side routing errors on GitHub Pages without requiring custom single-page-app rewrite hacks.

### Automated CI/CD Setup
1. Push your changes to your repository's `main` branch.
2. In your GitHub repository settings, navigate to **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment** $\rightarrow$ **Source**, select **GitHub Actions**.
4. The workflow defined in `.github/workflows/deploy.yml` will automatically build, lint, and publish your site to GitHub Pages on every push.

---

## 🔮 Roadmap: Backend Service Integration

The frontend currently uses static data files served via synchronous **Service Layer seams** (`src/services/*.js`). A complete architecture and migration plan for a production **Java Spring Boot 3 + PostgreSQL** backend is fully specified in [`docs/BACKEND_PLAN.md`](file:///C:/projects/mundial2026/docs/BACKEND_PLAN.md).

Key highlights of the planned backend architecture:
* **Spring Boot REST API v1:** Versioned endpoints (`/api/v1/jornadas`, `/api/v1/grupos`, `/api/v1/bracket`).
* **Security Hardening:** OWASP compliant security headers, API Key authentication for admin endpoints, rate limiting via Bucket4j, and strict CORS configuration.
* **Zero-Breaking Migration:** Simply updating the service layer to async `fetch()` calls allows full backend integration without altering UI components.

---

## ⚠️ Disclaimer

This platform is an independent statistical and predictive modeling project created for educational and informational purposes only. It is not affiliated with, endorsed by, or sponsored by FIFA or any official sports betting operator. Betting involves financial risk; always gamble responsibly.
