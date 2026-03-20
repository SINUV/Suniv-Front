import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import bannerOne from '../../../assets/images/BannerNovaCentral_1.jpg'
import bannerTwo from '../../../assets/images/BannerNovaCentral_2.jpg'
import bannerThree from '../../../assets/images/BannerNovaCentral_3.jpg'

export default function InicioPage() {
  const slides = useMemo(
    () => [
      {
        image: bannerOne,
        title: 'Aprender hoy abre puertas para toda la vida',
        description:
          'Cada clase, cada lectura y cada reto te acerca a la mejor versión de tu futuro.',
      },
      {
        image: bannerTwo,
        title: 'Tu esfuerzo diario construye metas reales',
        description:
          'Convierte la constancia en tu mayor fortaleza y avanza con propósito en cada semestre.',
      },
      {
        image: bannerThree,
        title: 'Estudiar es sembrar oportunidades',
        description:
          'Sigue creciendo con disciplina, curiosidad y confianza en todo lo que puedes lograr.',
      },
    ],
    [],
  )

  const [currentSlide, setCurrentSlide] = useState(0)

  const goToPrevious = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))

  const goToNext = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))

  return (
    <main className="home-main">
      <section className="hero-section">
        {/* ── Copy ── */}
        <div className="hero-copy">
          <p className="eyebrow">Bienvenido</p>
          <h1 className="motivational-title">
            Estudiar hoy es{' '}
            <span className="hero-highlight">encender</span> el futuro que sueñas.
          </h1>
          <p className="hero-subtitle">
            Consulta tu proceso, completa tu registro y mantén viva la motivación para
            llegar más lejos en cada etapa de tu formación.
          </p>
          <div className="hero-actions">
            <Link to="/admisiones" className="primary-button">
              Comenzar
            </Link>
            <Link to="/programas" className="secondary-button">
              Explorar oportunidades
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
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <article className="slide" key={slide.title}>
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
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Ir a la imagen ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  )
}
