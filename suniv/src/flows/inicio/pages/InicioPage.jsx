import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import bannerOne from '../../../assets/images/BannerNovaCentral_1.jpg'
import bannerTwo from '../../../assets/images/BannerNovaCentral_2.jpg'
import bannerThree from '../../../assets/images/BannerNovaCentral_3.jpg'
import campusImage from '../../../assets/images/img1.jpg'
import isaImage from '../../../assets/images/ISA.jpg'
import ldsImage from '../../../assets/images/LDS.jpg'
import ledmImage from '../../../assets/images/LEDM.jpg'

export default function InicioPage() {
  const slides = useMemo(
    () => [
      {
        image: bannerOne,
        title: 'Campus Periférico San Jacinto',
        description:
          'Cada clase, cada lectura y cada reto te acerca a la mejor versión de tu futuro.',
      },
      {
        image: bannerTwo,
        title: 'Campus Periférico Santos Reyes Nopala',
        description:
          'Convierte la constancia en tu mayor fortaleza y avanza con propósito en cada semestre.',
      },
      {
        image: bannerThree,
        title: 'Campus Periférico Juxtlahuaca',
        description:
          'Sigue creciendo con disciplina, curiosidad y confianza en todo lo que puedes lograr.',
      },
    ],
    [],
  )

  const loopSlides = useMemo(
    () => [slides[slides.length - 1], ...slides, slides[0]],
    [slides],
  )

  const [displaySlide, setDisplaySlide] = useState(1)
  const [trackTransitionEnabled, setTrackTransitionEnabled] = useState(true)

  const currentSlide =
    displaySlide === 0
      ? slides.length - 1
      : displaySlide === slides.length + 1
        ? 0
        : displaySlide - 1

  const goToPrevious = () => setDisplaySlide((prev) => prev - 1)

  const goToNext = () => setDisplaySlide((prev) => prev + 1)

  const handleTrackTransitionEnd = () => {
    if (displaySlide === slides.length + 1) {
      setTrackTransitionEnabled(false)
      setDisplaySlide(1)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTrackTransitionEnabled(true))
      })
      return
    }

    if (displaySlide === 0) {
      setTrackTransitionEnabled(false)
      setDisplaySlide(slides.length)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setTrackTransitionEnabled(true))
      })
    }
  }

  return (
    <main className="home-main">
      <section className="hero-section">
        {/* ── Copy ── */}
        <div className="hero-copy">
          <h1 className="motivational-title">
            Estudiar hoy es{' '}
            <span className="hero-highlight">encender</span> el futuro que sueñas.
          </h1>
          <p className="hero-subtitle">
            Consulta tu proceso, completa tu registro y mantén viva la motivación para
            llegar más lejos en cada etapa de tu formación.
          </p>
          <div className="hero-actions">
            <Link to="/aspirantes" className="primary-button">
              Iniciar admision
            </Link>
          </div>
        </div>

        {/* ── Slider ── */}
        <section
          className="slider-section"
          aria-label="Galería destacada de NovaUniversitas"
        >
          <div className="slider-shell">
            <button
              type="button"
              className="slider-arrow slider-arrow--left"
              onClick={goToPrevious}
              aria-label="Imagen anterior"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path
                  d="M15.5 4.5 8 12l7.5 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div
              className="slider-track"
              style={{
                transform: `translateX(-${displaySlide * 100}%)`,
                transition: trackTransitionEnabled
                  ? 'transform 0.62s cubic-bezier(0.22, 0.61, 0.36, 1)'
                  : 'none',
              }}
              onTransitionEnd={handleTrackTransitionEnd}
            >
              {loopSlides.map((slide, index) => (
                <article
                  className={`slide${index === displaySlide ? ' is-active' : ''}`}
                  key={`${slide.title}-${index}`}
                >
                  <img className="slide-image" src={slide.image} alt={slide.title} />
                  <div className="slide-overlay">
                    <div className="slide-caption">
                      <h2>{slide.title}</h2>
                      <p>{slide.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="slider-arrow slider-arrow--right"
              onClick={goToNext}
              aria-label="Imagen siguiente"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path
                  d="M8.5 4.5 16 12l-7.5 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="slider-dots" aria-label="Indicadores del slider">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  className={`slider-dot${index === currentSlide ? ' is-active' : ''}`}
                  onClick={() => setDisplaySlide(index + 1)}
                  aria-label={`Ir a la imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </section>

      <section className="home-floating" aria-label="Información destacada de campus">
        <article className="home-floating__card">
          <div className="home-floating__copy">
            <h2 className="home-floating__title">
              Formacion cercana,{' '}
              <span className="home-floating__title-accnte">recibe atencion
              directa y seguimiento constante.</span>
            </h2>
            <p className="home-floating__text">
              Un modelo enfocado en aprender haciendo, desarrollar criterio y prepararte
              para el mundo real en Oaxaca.
            </p>
          </div>

          <div className="home-floating__media">
            <img src={campusImage} alt="Vista destacada del campus" />
          </div>
        </article>
      </section>

      <section className="home-model-intro" aria-label="Introducción al Modelo Educativo">
        <p className="home-model-intro__eyebrow">Modelo Educativo</p>
      </section>

      <section className="home-model" aria-label="Modelo Educativo de NovaUniversitas">
        <div className="home-model__header">
          <h2 className="home-model__title">
            Educacion telepresencial con{' '}
            <span className="home-model__accent">acompanamiento real</span>
          </h2>
          <p className="home-model__lead">
            NovaUniversitas combina lo mejor de la universidad a distancia y presencial:
            clases desde un campus central, con estudiantes en jornada completa en cada
            sede y seguimiento continuo de su avance.
          </p>
          <p className="home-model__lead">
            Nuestro enfoque garantiza que cada estudiante tenga acceso a educación de
            calidad independientemente de su ubicación, con docentes especializados,
            infraestructura tecnológica avanzada y un acompañamiento académico permanente
            para asegurar el éxito en su formación integral.
          </p>
        </div>

        <div className="home-model__grid">
          <article className="home-model__card">
            <h3>Ensenanza en tiempo real</h3>
            <p>
              Clases telepresenciales y sesiones de dudas en vivo para mantener el ritmo
              academico en cada sede, en directo para todos los campus.
            </p>
          </article>

          <article className="home-model__card">
            <h3>Aulas para aprender haciendo</h3>
            <p>
              Cada aula integra computadoras, pizarron electronico y pantallas para una
              practica guiada y efectiva.
            </p>
          </article>

          <article className="home-model__card">
            <h3>Soporte academico permanente</h3>
            <p>
              Un tecnico academico por aula resuelve dudas, acompana practicas y da
              seguimiento junto al docente titular.
            </p>
          </article>

          <article className="home-model__card">
            <h3>Formacion integral</h3>
            <p>
              La formacion se complementa con actividades culturales y vinculacion
              comunitaria para generar impacto social.
            </p>
          </article>
        </div>

        <p className="home-model__campus">
          Campus contemplados de NovaUniversitas: Campus Central San Jacinto, Campus Santos Reyes Nopala y Campus Santiago Juxtlahuaca.
        </p>
      </section>

      <section className="home-programs" aria-label="Carreras Académicas de NovaUniversitas">
        <div className="home-programs__header">
          <p className="home-programs__eyebrow">Nuestras Carreras</p>
          <h2 className="home-programs__title">
            Estudios especializados para{' '}
            <span className="home-programs__accent">tu futuro</span>
          </h2>
        </div>

        <div className="home-programs__grid">
          <article className="home-programs__card">
            <div className="home-programs__card-image">
              <img src={ldsImage} alt="Ingeniería en Desarrollos de Software" />
            </div>
            <div className="home-programs__card-content">
              <h3 className="home-programs__title--software">Ingeniería en Desarrollos de Software</h3>
              <p>
                Forma profesionales capaces de diseñar, desarrollar y gestionar soluciones
                de software innovadoras, utilizando metodologías ágiles y tecnologías de
                vanguardia para resolver problemas empresariales complejos.
              </p>
            </div>
          </article>

          <article className="home-programs__card">
            <div className="home-programs__card-image">
              <img src={isaImage} alt="Ingeniería en Sistemas Agroalimentarios" />
            </div>
            <div className="home-programs__card-content">
              <h3 className="home-programs__title--agro">Ingeniería en Sistemas Agroalimentarios</h3>
              <p>
                Prepara ingenieros para optimizar procesos en la agroindustria y
                agroalimentaria, integrando tecnología, sostenibilidad y gestión
                empresarial para el desarrollo rural integral.
              </p>
            </div>
          </article>

          <article className="home-programs__card">
            <div className="home-programs__card-image">
              <img src={ledmImage} alt="Licenciatura en Emprendimiento y Desarrollo de MIPyMES" />
            </div>
            <div className="home-programs__card-content">
              <h3 className="home-programs__title--mipymes">Licenciatura en Emprendimiento y Desarrollo de MIPyMES</h3>
              <p>
                Capacita emprendedores y gestores para crear y administrar micro, pequeñas
                y medianas empresas, promoviendo la innovación, el liderazgo y el impacto
                socioeconómico en sus comunidades.
              </p>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
