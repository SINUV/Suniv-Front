import { Link } from 'react-router-dom'

const VALORES = [
  { icon: '🎓', titulo: 'Excelencia académica', desc: 'Docentes con perfil PRODEP y experiencia profesional activa en cada disciplina.' },
  { icon: '🤝', titulo: 'Compromiso social', desc: 'Formamos profesionales con sentido ético y responsabilidad hacia su comunidad.' },
  { icon: '🚀', titulo: 'Innovación', desc: 'Programas actualizados con tendencias globales y herramientas tecnológicas de vanguardia.' },
  { icon: '🌱', titulo: 'Desarrollo integral', desc: 'Impulsamos el crecimiento personal, cultural y deportivo junto al académico.' },
]

const CIFRAS = [
  { valor: '20+', etiqueta: 'Años de trayectoria' },
  { valor: '8,000+', etiqueta: 'Egresados en activo' },
  { valor: '12', etiqueta: 'Programas educativos' },
  { valor: '95%', etiqueta: 'Índice de empleabilidad' },
]

export default function SobreNosotrosPage() {
  return (
    <main className="page-main">
      {/* ── Hero ── */}
      <section className="page-hero">
        <div className="page-hero__copy">
          <p className="eyebrow">Sobre nosotros</p>
          <h1 className="page-hero__title">
            Más de dos décadas{' '}
            <span className="hero-highlight">formando líderes</span>
          </h1>
          <p className="page-hero__subtitle">
            NovaUniversitas es una institución de educación superior con reconocimiento oficial SEP,
            comprometida con la formación de profesionales competentes y humanistas.
          </p>
        </div>
      </section>

      {/* ── Cifras ── */}
      <section className="content-section">
        <div className="cifras-grid">
          {CIFRAS.map((c) => (
            <div className="cifra-card" key={c.etiqueta}>
              <span className="cifra-valor">{c.valor}</span>
              <span className="cifra-label">{c.etiqueta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Misión y Visión ── */}
      <section className="content-section content-section--alt">
        <div className="mv-grid">
          <div className="mv-card">
            <h2 className="mv-card__title">Misión</h2>
            <p className="mv-card__text">
              Brindar educación superior de calidad, centrada en el estudiante, que promueva
              el desarrollo del conocimiento científico, tecnológico y humanístico, formando
              profesionistas capaces de contribuir al desarrollo sostenible de su entorno.
            </p>
          </div>
          <div className="mv-card">
            <h2 className="mv-card__title">Visión</h2>
            <p className="mv-card__text">
              Ser una institución de educación superior reconocida a nivel nacional por su
              calidad académica, innovación educativa y el impacto positivo de sus egresados
              en la sociedad y el sector productivo.
            </p>
          </div>
        </div>
      </section>

      {/* ── Valores ── */}
      <section className="content-section">
        <h2 className="section-title">Nuestros valores</h2>
        <div className="valores-grid">
          {VALORES.map((v) => (
            <div className="valor-card" key={v.titulo}>
              <span className="valor-icon">{v.icon}</span>
              <h3 className="valor-title">{v.titulo}</h3>
              <p className="valor-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="content-section cta-band">
        <h2 className="cta-band__title">Forma parte de nuestra comunidad</h2>
        <p className="cta-band__sub">
          Da el primer paso hacia tu futuro profesional con nosotros.
        </p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Link to="/aspirantes" className="primary-button">
            Iniciar proceso de aspirantes
          </Link>
          <Link to="/programas" className="secondary-button">
            Ver programas
          </Link>
        </div>
      </section>
    </main>
  )
}
