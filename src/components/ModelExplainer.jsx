import { useState } from 'react'

export default function ModelExplainer() {
  const [activeTab, setActiveTab] = useState(0)

  const steps = [
    {
      id: 'dixon-coles',
      stepNum: '01',
      title: 'Motor Dixon-Coles & xG',
      subtitle: 'Ataque y Defensa Diferencial por Selección',
      desc: 'En lugar de promedios simples de goles, el algoritmo Dixon-Coles modela la fuerza ofensiva (α) y defensiva (β) de cada equipo partiendo del Expected Goals (xG) en torneos oficiales e internacionales recientes.',
      metrics: [
        { label: 'Parámetro Ofensivo (α)', val: '1.42 xG' },
        { label: 'Parámetro Defensivo (β)', val: '0.85 xG' },
        { label: 'Ajuste Altitud / Sede', val: '+6.4%' }
      ],
      detail: 'El modelo aplica un parámetro de corrección para partidos con marcador corto (0-0, 1-0, 0-1 y 1-1) y pondera la localía real en las sedes de México, Estados Unidos y Canadá.'
    },
    {
      id: 'monte-carlo',
      stepNum: '02',
      title: 'Simulación Monte Carlo',
      subtitle: '10,000 Iteraciones por Encuentro',
      desc: 'Con las distribuciones de Poisson ajustadas para cada selección, ejecutamos 10,000 partidos virtuales independientes antes del silbatazo inicial para estabilizar la varianza estadística.',
      metrics: [
        { label: 'Iteraciones por Match', val: '10,000' },
        { label: 'Margen de Error (95% CI)', val: '±1.1%' },
        { label: 'Frecuencia de Actualización', val: 'Horaria' }
      ],
      detail: 'El porcentaje final de victoria, empate o derrota refleja la frecuencia exacta en que cada marcador ocurrió a través de las diez mil simulaciones ejecutadas.'
    },
    {
      id: 'calibracion',
      stepNum: '03',
      title: 'Validación y Mercado',
      subtitle: 'Detección de Valor y Nivel de Confianza',
      desc: 'Las probabilidades teóricas del modelo se comparan en tiempo real contra la liquidez y las cuotas del mercado asiático y europeo para detectar ineficiencias o sesgos de la afición.',
      metrics: [
        { label: 'Confianza ALTA', val: '> 64.0%' },
        { label: 'Confianza MEDIA', val: '48% - 64%' },
        { label: 'SORPRESA / BAJA', val: '< 48.0%' }
      ],
      detail: 'Cuando el modelo proyecta una probabilidad significativamente superior a la implícita en el mercado, la selección se califica como "La Fija" de la jornada.'
    }
  ]

  return (
    <section className="model-explainer">
      <div className="me-header">
        <span className="me-eyebrow">ESPECIFICACIÓN TÉCNICA · ARQUITECTURA DEL SISTEMA</span>
        <h3 className="me-title">Metodología de Predicción Cuantitativa</h3>
        <p className="me-subtitle">
          Arquitectura analítica del torneo basada en modelado estadístico riguroso, sin sesgos emocionales ni heurísticas arbitrarias.
        </p>
      </div>

      <div className="me-nav">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(idx)}
            className={`me-tab-btn ${activeTab === idx ? 'active' : ''}`}
          >
            <span className="me-step-num">{s.stepNum}</span>
            <div className="me-step-info">
              <span className="me-step-title">{s.title}</span>
              <span className="me-step-sub">{s.subtitle}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="me-body-card">
        <div className="me-body-content">
          <div className="me-body-top">
            <span className="me-tag">FASE ANALÍTICA {steps[activeTab].stepNum}</span>
            <h4>{steps[activeTab].title}</h4>
            <h5>{steps[activeTab].subtitle}</h5>
          </div>

          <p className="me-desc">{steps[activeTab].desc}</p>

          <div className="me-metrics-grid">
            {steps[activeTab].metrics.map((m) => (
              <div className="me-metric-box" key={m.label}>
                <span className="me-metric-val">{m.val}</span>
                <span className="me-metric-lbl">{m.label}</span>
              </div>
            ))}
          </div>

          <div className="me-note">
            <span className="me-note-label">NOTA DE CALIBRACIÓN:</span>
            <p>{steps[activeTab].detail}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
