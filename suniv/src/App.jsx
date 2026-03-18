import { useMemo, useState } from 'react'
import logo from './assets/images/logo.png'
import bannerOne from './assets/images/BannerNovaCentral_1.jpg'
import bannerTwo from './assets/images/BannerNovaCentral_2.jpg'
import bannerThree from './assets/images/BannerNovaCentral_3.jpg'
import './App.css'

function App() {
  const slides = useMemo(
    () => [
      {
        image: bannerOne,
        title: 'Aprender hoy abre puertas para toda la vida',
        description: 'Cada clase, cada lectura y cada reto te acerca a la mejor versión de tu futuro.',
      },
      {
        image: bannerTwo,
        title: 'Tu esfuerzo diario construye metas reales',
        description: 'Convierte la constancia en tu mayor fortaleza y avanza con propósito en cada semestre.',
      },
      {
        image: bannerThree,
        title: 'Estudiar es sembrar oportunidades',
        description: 'Sigue creciendo con disciplina, curiosidad y confianza en todo lo que puedes lograr.',
      },
    ],
    [],
  )
  const [currentSlide, setCurrentSlide] = useState(0)

  const goToPreviousSlide = () => {
    setCurrentSlide((previousSlide) =>
      previousSlide === 0 ? slides.length - 1 : previousSlide - 1,
    )
  }

  const goToNextSlide = () => {
    setCurrentSlide((previousSlide) =>
      previousSlide === slides.length - 1 ? 0 : previousSlide + 1,
    )
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <div className="brand-wrap">
          <img className="brand-logo" src={logo} alt="Logo de SUNIV" />
          <span className="brand">SUNIV</span>
        </div>
        <div className="header-actions">
          <form className="search-form" role="search">
            <input
              className="search-input"
              type="search"
              placeholder="Buscar..."
              aria-label="Buscar"
            />
            <button className="search-btn" type="submit" aria-label="Buscar">
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </form>
          <button className="hamburger-menu" aria-label="Abrir menú">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main className="home-main">
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">Bienvenido</p>
            <h1 className="motivational-title">
              Estudiar hoy es <span className="hero-highlight">encender</span> el futuro que sueñas.
            </h1>
            <p className="hero-subtitle">
              Consulta tu proceso, completa tu registro y mantén viva la motivación para llegar más lejos en cada etapa de tu formación.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-button">
                Comenzar
              </button>
              <button type="button" className="secondary-button">
                Explorar oportunidades
              </button>
            </div>
          </div>

          <section className="slider-section" aria-label="Galería destacada de NovaUniversitas">
            <div className="slider-shell">
              <button
                type="button"
                className="slider-arrow slider-arrow--left"
                onClick={goToPreviousSlide}
                aria-label="Imagen anterior"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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
                onClick={goToNextSlide}
                aria-label="Imagen siguiente"
              >
                <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M8.5 4.5 16 12l-7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="slider-dots" aria-label="Indicadores del slider">
                {slides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    className={`slider-dot ${index === currentSlide ? 'is-active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir a la imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-intro">
            <p className="footer-kicker">Contacto institucional</p>
            <h2 className="footer-title">SUNIV · NovaUniversitas</h2>
            <p className="footer-note">
              Mantente al tanto de noticias, convocatorias y atención oficial a
              través de los canales institucionales.
            </p>
          </div>

          <div className="footer-links" aria-label="Canales oficiales">
            <a
              className="contact-link"
              href="https://www.facebook.com/p/NovaUniversitas-100057372853186/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook de NovaUniversitas"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H17V4.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3h2.8v8h3.2Z" />
              </svg>
              <span></span>
            </a>

            <a
              className="contact-link"
              href="https://www.instagram.com/nu_suneo/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram de NovaUniversitas"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm0 2.2A1.8 1.8 0 0 0 5.2 7v10c0 1 .8 1.8 1.8 1.8h10c1 0 1.8-.8 1.8-1.8V7c0-1-.8-1.8-1.8-1.8H7Zm10.25 1.65a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9ZM12 7.8A4.2 4.2 0 1 1 7.8 12 4.2 4.2 0 0 1 12 7.8Zm0 2.2A2 2 0 1 0 14 12a2 2 0 0 0-2-2Z" />
              </svg>
              <span></span>
            </a>

            <a
              className="contact-link"
              href="https://x.com/NU_SUNEO"
              target="_blank"
              rel="noreferrer"
              aria-label="X de NovaUniversitas"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.9 3H22l-6.8 7.8L23 21h-6.2l-4.9-6.4L6.3 21H3.2l7.3-8.3L3 3h6.3L13.7 9 18.9 3Zm-1.1 16h1.7L8.4 4.9H6.6L17.8 19Z" />
              </svg>
              <span></span>
            </a>

            <a
              className="contact-link"
              href="https://www.novauniversitas.edu.mx/web/"
              target="_blank"
              rel="noreferrer"
              aria-label="Sitio web de NovaUniversitas"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm6.9 9h-3.1a15.5 15.5 0 0 0-1.2-5A8 8 0 0 1 18.9 11ZM12 4.1c.9 1 1.9 3 2.3 6h-4.6c.4-3 1.4-5 2.3-6ZM9.4 6a15.5 15.5 0 0 0-1.2 5H5.1A8 8 0 0 1 9.4 6ZM5.1 13h3.1a15.5 15.5 0 0 0 1.2 5A8 8 0 0 1 5.1 13Zm6.9 6c-.9-1-1.9-3-2.3-6h4.6c-.4 3-1.4 5-2.3 6Zm2.6-1a15.5 15.5 0 0 0 1.2-5h3.1a8 8 0 0 1-4.3 5Z" />
              </svg>
              <span></span>
            </a>
          </div>

          <div className="footer-meta">
            <p>
              Consulta información institucional, comunicados y medios oficiales
              desde el portal web de la universidad.
            </p>
          </div>

          <p className="footer-copy">© {new Date().getFullYear()} SUNIV</p>
        </div>
      </footer>
    </div>
  )
}

export default App
