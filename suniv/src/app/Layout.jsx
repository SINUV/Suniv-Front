import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import logo from '../assets/images/logo1.jpg'
import '../App.css'

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <div className="home-page">
      {/* ── Header ── */}
      <header className="home-header">
        <nav className="main-nav" aria-label="Navegación principal">
          <Link to="/" className="nav-logo" aria-label="Ir al inicio de NovaUniversitas">
            <img className="brand-logo" src={logo} alt="Logo de NovaUniversitas" />
          </Link>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/aspirantes"
            className={({ isActive }) =>
              isActive
                ? 'nav-link nav-link--highlight nav-link--active'
                : 'nav-link nav-link--highlight'
            }
          >
            Obtener Ficha
          </NavLink>
          <NavLink
            to="/programas"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Programas
          </NavLink>
          <NavLink
            to="/nosotros"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Sobre Nosotros
          </NavLink>
          <NavLink
            to="/contacto"
            className={({ isActive }) =>
              isActive ? 'nav-link nav-link--active' : 'nav-link'
            }
          >
            Contacto
          </NavLink>
        </nav>

        <div className="header-end">
          <Link to="/" className="mobile-brand" aria-label="Inicio">
            <img className="brand-logo" src={logo} alt="Logo de NovaUniversitas" />
          </Link>
          <button
            className={`hamburger-menu${mobileMenuOpen ? ' is-open' : ''}`}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* ── Nav móvil ── */}
      {mobileMenuOpen && (
        <nav className="mobile-nav" aria-label="Menú móvil">
          <NavLink className="mobile-nav-link" to="/" end onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink
            className="mobile-nav-link mobile-nav-link--highlight"
            to="/aspirantes"
            onClick={closeMenu}
          >
            Obtener Ficha
          </NavLink>
          <NavLink className="mobile-nav-link" to="/programas" onClick={closeMenu}>
            Programas
          </NavLink>
          <NavLink className="mobile-nav-link" to="/nosotros" onClick={closeMenu}>
            Sobre Nosotros
          </NavLink>
          <NavLink className="mobile-nav-link" to="/contacto" onClick={closeMenu}>
            Contacto
          </NavLink>
        </nav>
      )}

      {/* ── Contenido de la ruta activa ── */}
      <Outlet />

      {/* ── Footer ── */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-intro">
            <p className="footer-kicker">Contacto institucional</p>
            <h2 className="footer-title">SUNIV · NovaUniversitas</h2>
            <p className="footer-note">
              Mantente al tanto de noticias, convocatorias y atención oficial a través de
              los canales institucionales.
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
              <span>Facebook</span>
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
              <span>Instagram</span>
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
              <span>X / Twitter</span>
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
              <span>Portal Web</span>
            </a>
          </div>

          <div className="footer-meta">
            <p>
              Consulta información institucional, comunicados y medios oficiales desde el
              portal web de la universidad.
            </p>
          </div>

          <p className="footer-copy">© {new Date().getFullYear()} SUNIV</p>
        </div>
      </footer>
    </div>
  )
}
