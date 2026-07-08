import MagicalKicks from '../components/MagicalKicks'

export default function Juego() {
  return (
    <section className="section">
      <div className="section-inner">
        <p className="eyebrow">Juego interactivo</p>
        <h2 className="section-title">Tiros de Estrella</h2>
        <p className="section-lede">
          Elige tu figura, enfrenta a los mejores del mundo y llévala desde
          octavos hasta la gloria. Cada ronda es una tanda de penales.
        </p>
        <MagicalKicks />
      </div>
    </section>
  )
}
