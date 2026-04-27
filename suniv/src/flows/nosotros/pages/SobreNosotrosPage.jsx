export default function SobreNosotrosPage() {
  return (
    <main className="page-main about-page">
      <section className="page-hero">
        <div className="page-hero__copy">
          <p className="eyebrow">Sobre nosotros</p>
          <h1 className="page-hero__title">
            NovaUniversitas, educacion superior con{' '}
            <span className="about-gradient-key">impacto regional</span>
          </h1>
          <p className="page-hero__subtitle">
            Somos una universidad publica de Oaxaca integrada al sistema SUNEO,
            con un modelo academico que acerca formacion universitaria de calidad
            a regiones con menor acceso.
          </p>
        </div>
      </section>

      <section className="content-section">
        <p className="about-kicker">Base institucional</p>
        <h2 className="section-title about-section-title">
          Que es <span className="about-gradient-key">NovaUniversitas</span>
        </h2>
        <div className="mv-grid">
          <div className="mv-card">
            <h3 className="mv-card__title">Caracteristicas oficiales</h3>
            <ul className="about-list">
              <li>Es parte del sistema SUNEO.</li>
              <li>Campus pequenos (maximo aproximado de 300 alumnos por campus).</li>
              <li>Oferta educativa limitada y enfocada.</li>
              <li>Infraestructura suficiente, no masiva.</li>
              <li>Educacion orientada al desarrollo regional.</li>
            </ul>
          </div>
          <div className="mv-card">
            <h3 className="mv-card__title">Clave del modelo</h3>
            <p className="mv-card__text">
              NovaUniversitas no busca ser masiva. Su propuesta prioriza grupos
              pequenos, acompanamiento cercano y calidad academica en zonas
              estrategicas del estado.
            </p>
            <p className="about-note">Calidad sobre cantidad, con enfoque territorial.</p>
          </div>
        </div>
      </section>

      <section className="content-section content-section--alt">
        <p className="about-kicker">Identidad academica</p>
        <div className="mv-grid">
          <div className="mv-card">
            <h2 className="mv-card__title">Ubicacion</h2>
            <p className="mv-card__text">
              Campus principal en Ocotlan de Morelos, Oaxaca, Carretera a Puerto Angel
              Km 34.5. Tambien tiene presencia en otras comunidades del estado.
            </p>
          </div>
          <div className="mv-card">
            <h2 className="mv-card__title">Modelo educativo</h2>
            <ul className="about-list">
              <li>Descentralizar la educacion superior.</li>
              <li>Evitar migracion de estudiantes a otras ciudades.</li>
              <li>Formar profesionistas que aporten a su region.</li>
              <li>Mantener grupos pequenos y atencion personalizada.</li>
            </ul>
            <p className="mv-card__text">
              Este enfoque se comparte con universidades del sistema como la Universidad
              Tecnologica de la Mixteca y la Universidad de la Sierra Sur.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <p className="about-kicker">Propuesta formativa</p>
        <h2 className="section-title about-section-title">
          Oferta academica y <span className="about-gradient-key">alcance real</span>
        </h2>
        <div className="mv-grid">
          <div className="mv-card">
            <h3 className="mv-card__title">Oferta academica realista</h3>
            <ul className="about-list">
              <li>Ingenieria en Desarrollo de Software.</li>
              <li>Ingenieria en Sistemas Agroalimentarios.</li>
              <li>Licenciatura en Emprendimiento y Desarrollo de MIPyMES.</li>
            </ul>
            <p className="mv-card__text">
              La oferta se mantiene focalizada porque el modelo prioriza pertinencia,
              capacidad instalada y calidad de ejecucion academica.
            </p>
          </div>
          <div className="mv-card">
            <h3 className="mv-card__title">Tamano de la universidad</h3>
            <p className="mv-card__text">
              Los campus estan disenados para pocos alumnos (alrededor de 300 maximo por
              campus), con una matricula total relativamente pequena.
            </p>
            <p className="mv-card__text">
              Este enfoque refuerza la esencia institucional: acompanamiento,
              control de calidad y contribucion directa al desarrollo regional.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
