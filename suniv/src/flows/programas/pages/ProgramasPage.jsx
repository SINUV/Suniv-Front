const PROGRAMAS = [
  {
    area: 'Tecnologia',
    color: '#4C7DFF',
    icon: '💻',
    nombre: 'Ingenieria en Desarrollo de Software',
    duracion: '9 semestres',
    descripcion:
      'Formacion en diseno, desarrollo e implementacion de sistemas de software y soluciones tecnologicas.',
  },
  {
    area: 'Sector Productivo',
    color: '#32D46F',
    icon: '🌱',
    nombre: 'Ingenieria en Sistemas Agroalimentarios',
    duracion: '9 semestres',
    descripcion:
      'Enfocada en la optimizacion de procesos agroalimentarios con enfoque sustentable y tecnologico.',
  },
  {
    area: 'Negocios y Emprendimiento',
    color: '#FF9F43',
    icon: '📊',
    nombre: 'Licenciatura en Emprendimiento y Desarrollo de MIPyMES',
    duracion: '8-9 semestres',
    descripcion:
      'Orientada a la creacion, gestion y fortalecimiento de micro, pequenas y medianas empresas.',
  },
]

export default function ProgramasPage() {
  return (
    <main className="page-main">
      <section className="page-hero">
        <div className="page-hero__copy">
          <p className="eyebrow">Programas Academicos</p>
          <h1 className="page-hero__title">
            Oferta educativa especializada para el{' '}
            <span className="hero-highlight">desarrollo regional</span>
          </h1>
          <p className="page-hero__subtitle">
            NovaUniversitas ofrece programas enfocados en areas estrategicas con
            formacion profesional orientada a necesidades reales del entorno.
          </p>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Areas de formacion</h2>
        <div className="programs-grid">
          {PROGRAMAS.map((programa) => (
            <article className="program-card" key={programa.area}>
              <div className="program-card__header" style={{ borderColor: programa.color }}>
                <span className="program-card__icon">{programa.icon}</span>
                <h3 className="program-card__area" style={{ color: programa.color }}>
                  {programa.area}
                </h3>
              </div>
              <ul className="program-card__list">
                <li className="program-card__item">
                  <span className="program-card__name">{programa.nombre}</span>
                  <span className="program-card__duracion">{programa.duracion}</span>
                </li>
              </ul>
              <div style={{ padding: '0 1.4rem 1.2rem' }}>
                <p className="mv-card__text" style={{ margin: 0 }}>
                  {programa.descripcion}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
