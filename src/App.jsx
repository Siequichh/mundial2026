import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Predicciones from './pages/Predicciones'
import Resultados from './pages/Resultados'
import Camino from './pages/Camino'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="predicciones" element={<Predicciones />} />
          <Route path="resultados" element={<Resultados />} />
          <Route path="camino" element={<Camino />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
