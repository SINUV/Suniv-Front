import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  API_BASE_URL,
  consultarStatusInscripcion,
  smokeTestInscripcionStatus,
  submitAdmisionFormulario,
} from '../../../services/admisionApi'

const DRAFT_KEY = 'suniv_aspirante_draft_v1'

const STEPS = [
  {
    id: 'programa',
    num: 1,
    titulo: 'Programa',
    subtitulo: '¿Qué quieres estudiar?',
    descripcion: 'Elige el campus y la carrera a la que deseas inscribirte en NovaUniversitas.',
    requiredFields: ['campusId', 'carreraId'],
  },
  {
    id: 'personal',
    num: 2,
    titulo: 'Datos personales',
    subtitulo: '¿Quién eres?',
    descripcion: 'Ingresa tus datos tal y como aparecen en tu documento de identificación oficial.',
    requiredFields: ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'curp'],
  },
  {
    id: 'contacto',
    num: 3,
    titulo: 'Contacto y domicilio',
    subtitulo: '¿Dónde podemos comunicarnos contigo?',
    descripcion: 'Usa tu dirección actual y un correo electrónico que revises frecuentemente.',
    requiredFields: ['telefono', 'correo', 'calle', 'numExt', 'colonia', 'municipio', 'estado', 'codigoPostal'],
  },
  {
    id: 'escolar',
    num: 4,
    titulo: 'Procedencia escolar',
    subtitulo: 'Tu historial académico',
    descripcion: 'Información sobre el bachillerato o preparatoria de donde egresaste.',
    requiredFields: ['nombreEscuela', 'tipoEscuela', 'areaConocimiento', 'anioIngreso', 'anioEgreso', 'promedioFinal', 'medioEnterado'],
  },
  {
    id: 'salud',
    num: 5,
    titulo: 'Salud y perfil',
    subtitulo: 'Información confidencial',
    descripcion: 'Datos para brindarte atención adecuada. Esta información es estrictamente confidencial.',
    requiredFields: ['tipoSangre'],
  },
  {
    id: 'responsable',
    num: 6,
    titulo: 'Responsable',
    subtitulo: 'Contacto de emergencia y envío final',
    descripcion: 'Persona a quien contactaremos ante cualquier situación importante de tu proceso.',
    requiredFields: ['nombreResponsable', 'parentesco', 'telefonoResponsable', 'lugarAplicacion', 'consentimiento'],
  },
]

function buildInitialForm() {
  return {
    campusId: '',
    carreraId: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    sexo: 'M',
    estadoCivil: '',
    curp: '',
    telefono: '',
    correo: '',
    calle: '',
    numExt: '',
    numInt: '',
    colonia: '',
    municipio: '',
    estado: '',
    codigoPostal: '',
    nombreEscuela: '',
    tipoEscuela: '',
    areaConocimiento: '',
    anioIngreso: '',
    anioEgreso: '',
    promedioFinal: '',
    medioEnterado: '',
    lenguaIndigena: '',
    grupoEtnico: '',
    esAfrodesc: false,
    descendencia: '',
    tipoSangre: 'O+',
    enfermedades: '',
    alergias: '',
    medicamentosEspeciales: '',
    servicioMedico: '',
    numeroAfiliacion: '',
    nombreResponsable: '',
    parentesco: '',
    ocupacionResponsable: '',
    telefonoResponsable: '',
    lugarAplicacion: '',
    consentimiento: false,
  }
}

function normalizePayload(formData) {
  return {
    ...formData,
    anioIngreso: Number(formData.anioIngreso),
    anioEgreso: Number(formData.anioEgreso),
    promedioFinal: Number(formData.promedioFinal),
  }
}

function validateStep(formData, stepId) {
  const errors = {}
  const step = STEPS.find((s) => s.id === stepId)
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const currentYear = new Date().getFullYear()

  for (const field of step.requiredFields) {
    const value = formData[field]
    if (field === 'consentimiento') {
      if (!value) errors[field] = 'Debes aceptar el consentimiento para enviar tu solicitud.'
    } else if (typeof value === 'string' && !value.trim()) {
      errors[field] = 'Este campo es obligatorio.'
    }
  }

  if (stepId === 'personal') {
    if (formData.curp && formData.curp.trim().length < 10) {
      errors.curp = 'La CURP debe tener al menos 10 caracteres.'
    }
  }
  if (stepId === 'contacto') {
    if (formData.correo && !EMAIL_REGEX.test(formData.correo)) {
      errors.correo = 'Ingresa un correo electrónico válido (ej. tu@correo.com).'
    }
  }
  if (stepId === 'escolar') {
    const ing = Number(formData.anioIngreso)
    const egr = Number(formData.anioEgreso)
    const prom = Number(formData.promedioFinal)
    if (formData.anioIngreso && (ing < 1900 || ing > currentYear)) {
      errors.anioIngreso = `Ingresa un año entre 1900 y ${currentYear}.`
    }
    if (formData.anioEgreso && (egr < 1900 || egr > currentYear)) {
      errors.anioEgreso = `Ingresa un año entre 1900 y ${currentYear}.`
    }
    if (formData.promedioFinal && (isNaN(prom) || prom < 0 || prom > 10)) {
      errors.promedioFinal = 'El promedio debe estar entre 0 y 10.'
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors }
}

/* ── Componente reutilizable de campo ── */
function Field({ label, name, required, hint, error, children }) {
  return (
    <div className={`wz-field${error ? ' wz-field--error' : ''}`}>
      <label className="wz-field__label" htmlFor={name}>
        {label}
        {required && (
          <span className="wz-field__req" aria-label="obligatorio">
            {' '}*
          </span>
        )}
      </label>
      {children}
      {hint && !error && <span className="wz-field__hint">{hint}</span>}
      {error && (
        <span className="wz-field__error" role="alert">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M6 4v2.5M6 8.3v.2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}

export default function AspirantesPage() {
  const [formData, setFormData] = useState(buildInitialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingConsulta, setIsLoadingConsulta] = useState(false)
  const [isLoadingSmoke, setIsLoadingSmoke] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [consultaResult, setConsultaResult] = useState('')
  const [smokeResult, setSmokeResult] = useState('')
  const [registroInfo, setRegistroInfo] = useState(null)
  const [folioInput, setFolioInput] = useState('')

  /* ── Cargar borrador ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      setFormData((prev) => ({ ...prev, ...parsed }))
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [])

  /* ── Guardar borrador ── */
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
  }, [formData])

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleNext = () => {
    const stepId = STEPS[currentStep].id
    const validation = validateStep(formData, stepId)
    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      return
    }
    setFieldErrors({})
    setCompletedSteps((prev) => new Set([...prev, currentStep]))
    setCurrentStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setFieldErrors({})
    setCurrentStep((s) => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    const stepId = STEPS[currentStep].id
    const validation = validateStep(formData, stepId)
    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      return
    }
    setIsLoadingSubmit(true)
    try {
      const payload = normalizePayload(formData)
      const result = await submitAdmisionFormulario(payload)
      const responseData = result.data?.data || result.data || {}
      const success = Boolean(result.data?.success ?? result.data?.succes ?? result.ok)
      if (!success) {
        setSubmitError(result.data?.message || 'El backend recibió la solicitud pero la marcó como no exitosa.')
        return
      }
      const nextFolio = responseData.folio || result.data?.folio || ''
      setRegistroInfo({
        folio: nextFolio,
        fechaExamen: responseData.fechaExamen || '-',
        horaExamen: responseData.horaExamen || '-',
        lugarExamen: responseData.lugarExamen || '-',
      })
      setFolioInput(nextFolio)
      if (nextFolio) {
        const statusResult = await consultarStatusInscripcion(nextFolio)
        if (statusResult.found) {
          setConsultaResult('Integración completa: el folio se creó y el estatus responde 200.')
          localStorage.removeItem(DRAFT_KEY)
        }
      }
    } catch (error) {
      if (error.type === 'HTTP_ERROR' && error.status >= 500) {
        setSubmitError(`Error del servidor (${error.status}). Verifica la configuración de Supabase:Url.`)
      } else {
        setSubmitError(`Error al enviar: ${error.message}`)
      }
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  const handleSmokeTest = async () => {
    setIsLoadingSmoke(true)
    setSmokeResult('')
    try {
      const result = await smokeTestInscripcionStatus('TEST-000001')
      if (result.status === 404) {
        setSmokeResult('Conexión OK (404). El backend respondió y TEST-000001 no existe, como se esperaba.')
      } else {
        setSmokeResult(`Status ${result.status}: ${result.data?.message || 'Sin mensaje'}`)
      }
    } catch (error) {
      setSmokeResult(`Error de conexión: ${error.message}`)
    } finally {
      setIsLoadingSmoke(false)
    }
  }

  const handleConsultarFolio = async () => {
    if (!folioInput.trim()) {
      setConsultaResult('Ingresa un folio para consultar su estatus.')
      return
    }
    setIsLoadingConsulta(true)
    setConsultaResult('')
    try {
      const result = await consultarStatusInscripcion(folioInput.trim())
      setConsultaResult(
        result.found
          ? 'Estatus consultado correctamente (HTTP 200).'
          : `Folio no encontrado: ${result.message}`,
      )
    } catch (error) {
      setConsultaResult(`No se pudo consultar: ${error.message}`)
    } finally {
      setIsLoadingConsulta(false)
    }
  }

  const handleCopiarFolio = async () => {
    if (!registroInfo?.folio) return
    try {
      await navigator.clipboard.writeText(registroInfo.folio)
      setConsultaResult('Folio copiado al portapapeles.')
    } catch {
      setConsultaResult('No se pudo copiar automáticamente. Copia el folio manualmente.')
    }
  }

  const e = (name) => fieldErrors[name]
  const step = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1
  const isSubmitted = registroInfo !== null

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
            Completa tu solicitud en 6 pasos guiados y recibe tu folio en minutos.
          </p>
          <Link to="/contacto" className="primary-button">
            Necesito ayuda
          </Link>
        </div>
      </section>

      {/* ── Wizard / Éxito ── */}
      {isSubmitted ? (
        /* ── Tarjeta de éxito ── */
        <section className="content-section">
          <div className="wz-success">
            <div className="wz-success__icon">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
                <circle cx="28" cy="28" r="28" fill="#dcfce7" />
                <path
                  d="M16 28 23 35 40 18"
                  stroke="#16a34a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="wz-success__title">¡Solicitud enviada!</h2>
            <p className="wz-success__sub">
              Guarda tu folio. Lo necesitarás para dar seguimiento a tu proceso de admisión.
            </p>
            <div className="wz-success__folio-box">
              <span className="wz-success__folio-label">Tu folio de admisión</span>
              <span className="wz-success__folio-num">{registroInfo.folio || '—'}</span>
              <button type="button" className="wz-success__copy-btn" onClick={handleCopiarFolio}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Copiar folio
              </button>
            </div>
            <div className="wz-success__meta">
              <span>
                <strong>Fecha:</strong> {registroInfo.fechaExamen}
              </span>
              <span>
                <strong>Hora:</strong> {registroInfo.horaExamen}
              </span>
              <span>
                <strong>Lugar:</strong> {registroInfo.lugarExamen}
              </span>
            </div>
            {consultaResult && <p className="wz-success__status">{consultaResult}</p>}
          </div>
        </section>
      ) : (
        /* ── Formulario wizard ── */
        <section className="content-section wz-section">
          {/* Indicador de progreso */}
          <nav className="wz-progress" aria-label="Pasos del formulario">
            {STEPS.map((s, index) => {
              const isDone = completedSteps.has(index)
              const isActive = index === currentStep
              return (
                <div
                  key={s.id}
                  className={`wz-progress__item${isDone ? ' is-done' : isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <div className="wz-progress__bubble">
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="completado">
                        <path d="M2.5 7 6 10.5 11.5 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span aria-hidden="true">{s.num}</span>
                    )}
                  </div>
                  <span className="wz-progress__label">{s.titulo}</span>
                </div>
              )
            })}
          </nav>

          {/* Tarjeta del paso activo */}
          <div className="wz-card">
            <div className="wz-card__head">
              <span className="wz-card__badge">
                Paso {step.num} de {STEPS.length} — {step.subtitulo}
              </span>
              <h2 className="wz-card__title">{step.titulo}</h2>
              <p className="wz-card__desc">{step.descripcion}</p>
            </div>

            <form className="wz-card__body" onSubmit={handleSubmit} noValidate>
              <div className="wz-grid">

                {/* ── Paso 1: Programa ── */}
                {currentStep === 0 && (
                  <>
                    <div className="wz-grid__full wz-info-banner">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 8v5M9 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Consulta con el equipo de admisiones los identificadores UUID de campus y carrera.
                    </div>
                    <Field label="Campus ID" name="campusId" required hint="UUID del campus · Ej. 3fa85f64-5717-4562-b3fc-2c963f66afa6" error={e('campusId')}>
                      <input id="campusId" name="campusId" value={formData.campusId} onChange={handleChange} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                    </Field>
                    <Field label="Carrera ID" name="carreraId" required hint="UUID de la carrera deseada" error={e('carreraId')}>
                      <input id="carreraId" name="carreraId" value={formData.carreraId} onChange={handleChange} placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
                    </Field>
                  </>
                )}

                {/* ── Paso 2: Datos personales ── */}
                {currentStep === 1 && (
                  <>
                    <Field label="Nombre(s)" name="nombre" required error={e('nombre')}>
                      <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. María Elena" />
                    </Field>
                    <Field label="Apellido paterno" name="apellidoPaterno" required error={e('apellidoPaterno')}>
                      <input id="apellidoPaterno" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange} placeholder="Ej. García" />
                    </Field>
                    <Field label="Apellido materno" name="apellidoMaterno" required error={e('apellidoMaterno')}>
                      <input id="apellidoMaterno" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange} placeholder="Ej. López" />
                    </Field>
                    <Field label="Fecha de nacimiento" name="fechaNacimiento" required hint="Tal como aparece en tu acta de nacimiento" error={e('fechaNacimiento')}>
                      <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} />
                    </Field>
                    <Field label="Sexo" name="sexo" error={e('sexo')}>
                      <select id="sexo" name="sexo" value={formData.sexo} onChange={handleChange}>
                        <option value="M">Masculino (M)</option>
                        <option value="F">Femenino (F)</option>
                        <option value="O">Prefiero no especificar (O)</option>
                      </select>
                    </Field>
                    <Field label="Estado civil" name="estadoCivil" hint="Ej. Soltero/a, Casado/a" error={e('estadoCivil')}>
                      <input id="estadoCivil" name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} placeholder="Ej. Soltero/a" />
                    </Field>
                    <Field label="CURP" name="curp" required hint="18 caracteres · Ej. MAAD900101HDFNNL04" error={e('curp')}>
                      <input
                        id="curp"
                        name="curp"
                        value={formData.curp}
                        onChange={handleChange}
                        placeholder="AAAA000000AAAAAA00"
                        maxLength={18}
                        style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}
                      />
                    </Field>
                  </>
                )}

                {/* ── Paso 3: Contacto y domicilio ── */}
                {currentStep === 2 && (
                  <>
                    <Field label="Teléfono" name="telefono" required hint="10 dígitos sin espacios · Ej. 5512345678" error={e('telefono')}>
                      <input id="telefono" name="telefono" type="tel" value={formData.telefono} onChange={handleChange} placeholder="5512345678" />
                    </Field>
                    <Field label="Correo electrónico" name="correo" required hint="Usa un correo que revises con frecuencia" error={e('correo')}>
                      <input id="correo" name="correo" type="email" value={formData.correo} onChange={handleChange} placeholder="tu@correo.com" />
                    </Field>
                    <Field label="Calle" name="calle" required error={e('calle')}>
                      <input id="calle" name="calle" value={formData.calle} onChange={handleChange} placeholder="Nombre de la calle" />
                    </Field>
                    <Field label="Número exterior" name="numExt" required error={e('numExt')}>
                      <input id="numExt" name="numExt" value={formData.numExt} onChange={handleChange} placeholder="Ej. 42" />
                    </Field>
                    <Field label="Número interior" name="numInt" hint="Opcional · dejar vacío si no aplica" error={e('numInt')}>
                      <input id="numInt" name="numInt" value={formData.numInt} onChange={handleChange} placeholder="Ej. 3-B" />
                    </Field>
                    <Field label="Colonia" name="colonia" required error={e('colonia')}>
                      <input id="colonia" name="colonia" value={formData.colonia} onChange={handleChange} placeholder="Ej. Centro Histórico" />
                    </Field>
                    <Field label="Municipio / Alcaldía" name="municipio" required error={e('municipio')}>
                      <input id="municipio" name="municipio" value={formData.municipio} onChange={handleChange} placeholder="Ej. Cuauhtémoc" />
                    </Field>
                    <Field label="Estado" name="estado" required error={e('estado')}>
                      <input id="estado" name="estado" value={formData.estado} onChange={handleChange} placeholder="Ej. Ciudad de México" />
                    </Field>
                    <Field label="Código postal" name="codigoPostal" required hint="5 dígitos · Ej. 06600" error={e('codigoPostal')}>
                      <input id="codigoPostal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} placeholder="06600" maxLength={5} />
                    </Field>
                  </>
                )}

                {/* ── Paso 4: Procedencia escolar ── */}
                {currentStep === 3 && (
                  <>
                    <Field label="Nombre de la escuela" name="nombreEscuela" required error={e('nombreEscuela')}>
                      <input id="nombreEscuela" name="nombreEscuela" value={formData.nombreEscuela} onChange={handleChange} placeholder="Ej. Preparatoria No. 5 UNAM" />
                    </Field>
                    <Field label="Tipo de escuela" name="tipoEscuela" required hint="Ej. Pública / Privada / Técnica" error={e('tipoEscuela')}>
                      <input id="tipoEscuela" name="tipoEscuela" value={formData.tipoEscuela} onChange={handleChange} placeholder="Ej. Pública" />
                    </Field>
                    <Field label="Área de conocimiento" name="areaConocimiento" required hint="Ej. Ciencias Sociales, Ingeniería" error={e('areaConocimiento')}>
                      <input id="areaConocimiento" name="areaConocimiento" value={formData.areaConocimiento} onChange={handleChange} placeholder="Ej. Ciencias Sociales" />
                    </Field>
                    <Field label="Año de ingreso" name="anioIngreso" required hint="4 dígitos · Ej. 2020" error={e('anioIngreso')}>
                      <input type="number" id="anioIngreso" name="anioIngreso" value={formData.anioIngreso} onChange={handleChange} placeholder="2020" min={1900} max={new Date().getFullYear()} />
                    </Field>
                    <Field label="Año de egreso" name="anioEgreso" required hint="4 dígitos · Ej. 2023" error={e('anioEgreso')}>
                      <input type="number" id="anioEgreso" name="anioEgreso" value={formData.anioEgreso} onChange={handleChange} placeholder="2023" min={1900} max={new Date().getFullYear()} />
                    </Field>
                    <Field label="Promedio final" name="promedioFinal" required hint="Escala 0–10 · Ej. 8.5" error={e('promedioFinal')}>
                      <input type="number" step="0.1" id="promedioFinal" name="promedioFinal" value={formData.promedioFinal} onChange={handleChange} placeholder="8.5" min={0} max={10} />
                    </Field>
                    <Field label="¿Cómo te enteraste de NovaUniversitas?" name="medioEnterado" required hint="Ej. Redes sociales, recomendación de amigo" error={e('medioEnterado')}>
                      <input id="medioEnterado" name="medioEnterado" value={formData.medioEnterado} onChange={handleChange} placeholder="Ej. Instagram" />
                    </Field>
                  </>
                )}

                {/* ── Paso 5: Salud y perfil sociocultural ── */}
                {currentStep === 4 && (
                  <>
                    <div className="wz-grid__full wz-info-banner wz-info-banner--blue">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M9 8v5M9 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Los campos de esta sección son opcionales, excepto el tipo de sangre.
                    </div>
                    <Field label="Tipo de sangre" name="tipoSangre" required error={e('tipoSangre')}>
                      <select id="tipoSangre" name="tipoSangre" value={formData.tipoSangre} onChange={handleChange}>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Servicio médico" name="servicioMedico" hint="Ej. IMSS, ISSSTE, privado" error={e('servicioMedico')}>
                      <input id="servicioMedico" name="servicioMedico" value={formData.servicioMedico} onChange={handleChange} placeholder="Ej. IMSS" />
                    </Field>
                    <Field label="Número de afiliación" name="numeroAfiliacion" hint="De tu servicio médico, si aplica" error={e('numeroAfiliacion')}>
                      <input id="numeroAfiliacion" name="numeroAfiliacion" value={formData.numeroAfiliacion} onChange={handleChange} placeholder="Opcional" />
                    </Field>
                    <Field label="Enfermedades crónicas" name="enfermedades" hint="Relevantes para tu atención, si las hay" error={e('enfermedades')}>
                      <input id="enfermedades" name="enfermedades" value={formData.enfermedades} onChange={handleChange} placeholder="Opcional" />
                    </Field>
                    <Field label="Alergias" name="alergias" error={e('alergias')}>
                      <input id="alergias" name="alergias" value={formData.alergias} onChange={handleChange} placeholder="Opcional" />
                    </Field>
                    <Field label="Medicamentos especiales" name="medicamentosEspeciales" error={e('medicamentosEspeciales')}>
                      <input id="medicamentosEspeciales" name="medicamentosEspeciales" value={formData.medicamentosEspeciales} onChange={handleChange} placeholder="Opcional" />
                    </Field>
                    <Field label="Lengua indígena" name="lenguaIndigena" hint="Si hablas una lengua indígena" error={e('lenguaIndigena')}>
                      <input id="lenguaIndigena" name="lenguaIndigena" value={formData.lenguaIndigena} onChange={handleChange} placeholder="Ej. Náhuatl (opcional)" />
                    </Field>
                    <Field label="Grupo étnico" name="grupoEtnico" error={e('grupoEtnico')}>
                      <input id="grupoEtnico" name="grupoEtnico" value={formData.grupoEtnico} onChange={handleChange} placeholder="Opcional" />
                    </Field>
                    <Field label="Descendencia" name="descendencia" hint="Comunidad de origen, si aplica" error={e('descendencia')}>
                      <input id="descendencia" name="descendencia" value={formData.descendencia} onChange={handleChange} placeholder="Opcional" />
                    </Field>
                    <div className="wz-grid__full">
                      <label className="wz-checkbox">
                        <input type="checkbox" name="esAfrodesc" checked={formData.esAfrodesc} onChange={handleChange} />
                        <span className="wz-checkbox__box" aria-hidden="true" />
                        <span className="wz-checkbox__text">Me identifico como afrodescendiente</span>
                      </label>
                    </div>
                  </>
                )}

                {/* ── Paso 6: Responsable y confirmación ── */}
                {currentStep === 5 && (
                  <>
                    <Field label="Nombre completo del responsable" name="nombreResponsable" required error={e('nombreResponsable')}>
                      <input id="nombreResponsable" name="nombreResponsable" value={formData.nombreResponsable} onChange={handleChange} placeholder="Nombre y apellidos" />
                    </Field>
                    <Field label="Parentesco" name="parentesco" required hint="Ej. Madre, Padre, Tutor legal" error={e('parentesco')}>
                      <input id="parentesco" name="parentesco" value={formData.parentesco} onChange={handleChange} placeholder="Ej. Madre" />
                    </Field>
                    <Field label="Ocupación del responsable" name="ocupacionResponsable" hint="Opcional" error={e('ocupacionResponsable')}>
                      <input id="ocupacionResponsable" name="ocupacionResponsable" value={formData.ocupacionResponsable} onChange={handleChange} placeholder="Ej. Docente" />
                    </Field>
                    <Field label="Teléfono del responsable" name="telefonoResponsable" required hint="10 dígitos sin espacios" error={e('telefonoResponsable')}>
                      <input id="telefonoResponsable" name="telefonoResponsable" type="tel" value={formData.telefonoResponsable} onChange={handleChange} placeholder="5512345678" />
                    </Field>
                    <Field label="Lugar de aplicación del examen" name="lugarAplicacion" required hint="Ciudad o sede donde presentarás tu examen" error={e('lugarAplicacion')}>
                      <input id="lugarAplicacion" name="lugarAplicacion" value={formData.lugarAplicacion} onChange={handleChange} placeholder="Ej. Campus Norte" />
                    </Field>
                    <div className="wz-grid__full wz-consent">
                      <label className={`wz-checkbox${e('consentimiento') ? ' wz-checkbox--error' : ''}`}>
                        <input type="checkbox" name="consentimiento" checked={formData.consentimiento} onChange={handleChange} />
                        <span className="wz-checkbox__box" aria-hidden="true" />
                        <span className="wz-checkbox__text">
                          He leído y acepto el tratamiento de mis datos personales para el proceso
                          de admisión de NovaUniversitas, conforme al aviso de privacidad vigente.
                        </span>
                      </label>
                      {e('consentimiento') && (
                        <span className="wz-field__error" role="alert">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <circle cx="6" cy="6" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                            <path d="M6 4v2.5M6 8.3v.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                          </svg>
                          {e('consentimiento')}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* ── Navegación ── */}
              <div className="wz-nav">
                {currentStep > 0 ? (
                  <button type="button" className="wz-nav__back" onClick={handleBack}>
                    ← Anterior
                  </button>
                ) : (
                  <span />
                )}
                <div className="wz-nav__right">
                  {isLastStep ? (
                    <button type="submit" className="primary-button" disabled={isLoadingSubmit}>
                      {isLoadingSubmit ? 'Enviando solicitud…' : 'Enviar solicitud'}
                    </button>
                  ) : (
                    <button type="button" className="primary-button" onClick={handleNext}>
                      Siguiente →
                    </button>
                  )}
                </div>
              </div>

              {submitError && (
                <p className="wz-submit-error" role="alert">
                  {submitError}
                </p>
              )}
            </form>
          </div>
        </section>
      )}

      {/* ── Consultar folio ── */}
      <section className="content-section aspirantes-api">
        <h2 className="section-title">Consultar estatus por folio</h2>
        <p className="aspirantes-api__text">¿Ya tienes un folio? Consulta aquí el estado de tu solicitud de admisión.</p>
        <div className="aspirantes-api__actions aspirantes-api__actions--inline">
          <input
            className="folio-input"
            placeholder="Ej. FOL-2026-000123"
            value={folioInput}
            onChange={(ev) => setFolioInput(ev.target.value)}
            aria-label="Folio de admisión"
          />
          <button
            type="button"
            className="primary-button"
            onClick={handleConsultarFolio}
            disabled={isLoadingConsulta}
          >
            {isLoadingConsulta ? 'Consultando…' : 'Consultar estatus'}
          </button>
        </div>
        {consultaResult && <p className="aspirantes-api__result">{consultaResult}</p>}
      </section>

      {/* ── Smoke test ── */}
      <section className="content-section aspirantes-api">
        <h2 className="section-title">Diagnóstico de conexión</h2>
        <p className="aspirantes-api__text">
          Base URL activa: <strong>{API_BASE_URL}</strong>
        </p>
        <p className="aspirantes-api__text">
          Configura <strong>VITE_API_URL</strong> en tu archivo <code>.env.local</code> para apuntar al backend.
        </p>
        <div className="aspirantes-api__actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleSmokeTest}
            disabled={isLoadingSmoke}
          >
            {isLoadingSmoke ? 'Probando…' : 'Smoke test de conexión'}
          </button>
        </div>
        {smokeResult && <p className="aspirantes-api__result">{smokeResult}</p>}
      </section>
    </main>
  )
}