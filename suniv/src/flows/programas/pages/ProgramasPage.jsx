import { Link } from 'react-router-dom'

const PROGRAMAS = [
  {
    area: 'Tecnología',
    color: '#E63930',
    icon: '💻',
    carreras: [
      { nombre: 'Ingeniería en Sistemas Computacionales', duracion: '9 semestres' },
      { nombre: 'Ingeniería en Tecnologías de la Información', duracion: '9 semestres' },
      { nombre: 'Licenciatura en Ciencias de Datos', duracion: '8 semestres' },
    ],
  },
  {
    area: 'Negocios',
    color: '#F96E41',
    icon: '📊',
    carreras: [
      { nombre: 'Licenciatura en Administración de Empresas', duracion: '8 semestres' },
      { nombre: 'Licenciatura en Contaduría Pública', duracion: '8 semestres' },
      { nombre: 'Ingeniería en Gestión Empresarial', duracion: '9 semestres' },
    ],
  },
  {
    area: 'Humanidades',
    color: '#FFA057',
    icon: '📚',
    carreras: [
      { nombre: 'Licenciatura en Derecho', duracion: '9 semestres' },
      { nombre: 'Licenciatura en Psicología', duracion: '8 semestres' },
      { nombre: 'Licenciatura en Comunicación', duracion: '8 semestres' },
    ],
  },
  {
    area: 'Ingeniería',
    color: '#323322',
    icon: '⚙️',
    carreras: [
      { nombre: 'Ingeniería Civil', duracion: '9 semestres' },
      { nombre: 'Ingeniería Industrial', duracion: '9 semestres' },
      { nombre: 'Ingeniería en Mecatrónica', duracion: '9 semestres' },
    ],
  },
]

export default function ProgramasPage() {
  return (
    <main className="page-main">
      {/* ── Hero ── */}
      <section className="page-hero">
        <div className="page-hero__copy">
          <p className="eyebrow">Oferta académica</p>
          <h1 className="page-hero__title">
            Encuentra tu <span className="hero-highlight">carrera ideal</span>
          </h1>
          <p className="page-hero__subtitle">
            Explora nuestros programas de licenciatura e ingeniería con reconocimiento
            oficial SEP y enfoque en competencias profesionales.
          </p>
        </div>
      </section>

      {/* ── Programas por área ── */}
      <section className="content-section">
        <h2 className="section-title">Áreas de formación</h2>
        <div className="programs-grid">
          {PROGRAMAS.map((area) => (
            <div className="program-card" key={area.area}>
              <div className="program-card__header" style={{ borderColor: area.color }}>
                <span className="program-card__icon">{area.icon}</span>
                <h3 className="program-card__area" style={{ color: area.color }}>
                  {area.area}
                </h3>
              </div>
              <ul className="program-card__list">
                {area.carreras.map((carrera) => (
                  <li key={carrera.nombre} className="program-card__item">
                    <span className="program-card__name">{carrera.nombre}</span>
                    <span className="program-card__duracion">{carrera.duracion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="content-section cta-band">
        <h2 className="cta-band__title">¿Ya elegiste tu carrera?</h2>
        <p className="cta-band__sub">
          Inicia tu proceso de admisión hoy mismo y asegura tu futuro profesional.
        </p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Link to="/admisiones" className="primary-button">
            Ver admisiones
          </Link>
          <Link to="/contacto" className="secondary-button">
            Solicitar información
          </Link>
        </div>
      </section>
    </main>
  )
}
