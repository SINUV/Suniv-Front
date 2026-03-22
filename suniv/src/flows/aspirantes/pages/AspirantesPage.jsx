import { Link } from 'react-router-dom'

const PASOS = [
  {
    num: '01',
    titulo: 'Registro en línea',
    desc: 'Completa el formulario de pre-registro con tus datos personales y académicos en la plataforma SUNIV.',
  },
  {
    num: '02',
    titulo: 'Entrega de documentos',
    desc: 'Sube o entrega en ventanilla tu certificado de bachillerato, identificación oficial y comprobante de domicilio.',
  },
  {
    num: '03',
    titulo: 'Examen de admisión',
    desc: 'Presenta el examen de selección en la fecha asignada. Recibirás un correo de confirmación con tu cita.',
  },
  {
    num: '04',
    titulo: 'Resultados y pago',
    desc: 'Consulta tu resultado en el portal, realiza el pago de inscripción y agenda tu cita de bienvenida.',
  },
]

const REQUISITOS = [
  'Certificado de bachillerato (original y copia)',
  'Identificación oficial vigente (INE / pasaporte)',
  'CURP (impresión reciente)',
  'Comprobante de domicilio (no mayor a 3 meses)',
  '4 fotografías tamaño infantil, fondo blanco',
  'Acta de nacimiento (original y copia)',
]

export default function AspirantesPage() {
  return (
    <main className="page-main">
      {/* ── Hero ── */}
      <section className="page-hero page-hero--aspirantes">
        <div className="page-hero__copy">
          <p className="eyebrow">Proceso para aspirantes</p>
          <h1 className="page-hero__title">
            Tu camino a <span className="hero-highlight">NovaUniversitas</span> empieza aquí
          </h1>
          <p className="page-hero__subtitle">
            Conoce los pasos, requisitos y fechas para ingresar al siguiente ciclo escolar.
          </p>
          <Link to="/registro" className="primary-button">
            Iniciar mi registro
          </Link>
        </div>
      </section>

      {/* ── Pasos ── */}
      <section className="content-section">
        <h2 className="section-title">¿Cómo es el proceso?</h2>
        <div className="steps-grid">
          {PASOS.map((paso) => (
            <div className="step-card" key={paso.num}>
              <span className="step-num">{paso.num}</span>
              <h3 className="step-title">{paso.titulo}</h3>
              <p className="step-desc">{paso.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Requisitos ── */}
      <section className="content-section content-section--alt">
        <h2 className="section-title">Documentos requeridos</h2>
        <ul className="req-list">
          {REQUISITOS.map((req) => (
            <li className="req-item" key={req}>
              <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                <circle cx="10" cy="10" r="9" fill="#e63930" opacity="0.12" />
                <path
                  d="M6 10.5 8.5 13 14 7.5"
                  stroke="#e63930"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              {req}
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ── */}
      <section className="content-section cta-band">
        <h2 className="cta-band__title">¿Listo para comenzar?</h2>
        <p className="cta-band__sub">
          Inicia tu proceso de aspirantes y asegura tu lugar en el próximo ciclo escolar.
        </p>
        <div className="hero-actions" style={{ justifyContent: 'center' }}>
          <Link to="/registro" className="primary-button">
            Registrarse
          </Link>
          <Link to="/contacto" className="secondary-button">
            Tengo una pregunta
          </Link>
        </div>
      </section>
    </main>
  )
}
