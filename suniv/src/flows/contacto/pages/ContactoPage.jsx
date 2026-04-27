import { useState } from 'react'

const CANALES = [
  {
    icon: '📍',
    titulo: 'Dirección',
    detalle: 'Carretera a Puerto Angel Km 34.5, Ocotlán de Morelos, Oaxaca',
  },
  {
    icon: '📞',
    titulo: 'Teléfono',
    detalle: '(951) 123 4567',
    href: 'tel:+529511234567',
  },
  {
    icon: '✉️',
    titulo: 'Correo electrónico',
    detalle: 'admisiones@novauniversitas.edu.mx',
    href: 'mailto:admisiones@novauniversitas.edu.mx',
  },
  {
    icon: '🕑',
    titulo: 'Horario de atención',
    detalle: 'Lunes a Viernes · 8:00 – 18:00 h',
  },
]

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Aquí iría la llamada al API
    setEnviado(true)
  }

  return (
    <main className="page-main">
      {/* ── Hero ── */}
      <section className="page-hero">
        <div className="page-hero__copy">
          <p className="eyebrow">Contáctanos</p>
          <h1 className="page-hero__title">
            Estamos aquí para{' '}
            <span className="hero-highlight">ayudarte</span>
          </h1>
          <p className="page-hero__subtitle">
            Resuelve tus dudas sobre aspirantes, programas académicos o servicios
            escolares. Nuestro equipo te responde a la brevedad.
          </p>
        </div>
      </section>

      {/* ── Canales + Formulario ── */}
      <section className="content-section">
        <div className="contacto-layout">
          {/* Canales */}
          <aside className="contacto-canales">
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
              Información de contacto
            </h2>
            {CANALES.map((canal) => (
              <div className="canal-item" key={canal.titulo}>
                <span className="canal-icon">{canal.icon}</span>
                <div>
                  <p className="canal-titulo">{canal.titulo}</p>
                  {canal.href ? (
                    <a className="canal-detalle canal-detalle--link" href={canal.href}>
                      {canal.detalle}
                    </a>
                  ) : (
                    <p className="canal-detalle">{canal.detalle}</p>
                  )}
                </div>
              </div>
            ))}
          </aside>

          {/* Formulario */}
          <div className="contacto-form-wrap">
            {enviado ? (
              <div className="form-success">
                <span className="form-success__icon">✅</span>
                <h3>¡Mensaje enviado!</h3>
                <p>Gracias por contactarnos. Te responderemos en un plazo de 24–48 horas hábiles.</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => { setEnviado(false); setForm({ nombre: '', email: '', asunto: '', mensaje: '' }) }}
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form className="contacto-form" onSubmit={handleSubmit} noValidate>
                <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                  Envíanos un mensaje
                </h2>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="nombre">Nombre completo</label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      className="form-input"
                      placeholder="Ej. María González"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Correo electrónico</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="correo@ejemplo.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="asunto">Asunto</label>
                  <select
                    id="asunto"
                    name="asunto"
                    className="form-input form-select"
                    value={form.asunto}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un asunto</option>
                    <option value="aspirantes">Aspirantes</option>
                    <option value="programas">Información de programas</option>
                    <option value="servicios">Servicios escolares</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mensaje">Mensaje</label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    className="form-input form-textarea"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    value={form.mensaje}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="primary-button" style={{ width: '100%' }}>
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
