import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  API_BASE_URL,
  consultarStatusInscripcion,
  smokeTestInscripcionStatus,
  submitAdmisionFormulario,
} from '../../../services/admisionApi'
import { validateAdmisionPayload } from '../../../utils/admisionValidation'

const DRAFT_KEY = 'suniv_aspirante_draft_v1'

const PASOS = [
  {
    num: '01',
    titulo: 'Captura tu formulario',
    desc: 'Completa tus datos personales, académicos y de contacto en una sola solicitud.',
  },
  {
    num: '02',
    titulo: 'Envío y folio automático',
    desc: 'Al enviar, recibirás tu folio para seguimiento del proceso de inscripción.',
  },
  {
    num: '03',
    titulo: 'Consulta de estatus',
    desc: 'Con tu folio podrás revisar el estado de tu solicitud cuando lo necesites.',
  },
]

const REQUISITOS = [
  'CURP y correo electrónico vigentes',
  'Datos de domicilio completos',
  'Promedio final y datos de procedencia escolar',
  'Responsable con teléfono de contacto',
  'Consentimiento para envío de solicitud',
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

function getFieldMessage(errors, fieldName) {
  return errors[fieldName] ? <span className="form-error">{errors[fieldName]}</span> : null
}

export default function AspirantesPage() {
  const [formData, setFormData] = useState(buildInitialForm)
  const [fieldErrors, setFieldErrors] = useState({})
  const [formSummaryError, setFormSummaryError] = useState('')
  const [smokeResult, setSmokeResult] = useState('')
  const [submitResult, setSubmitResult] = useState('')
  const [consultaResult, setConsultaResult] = useState('')
  const [folio, setFolio] = useState('')
  const [isLoadingSmoke, setIsLoadingSmoke] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [isLoadingConsulta, setIsLoadingConsulta] = useState(false)
  const [registroInfo, setRegistroInfo] = useState(null)

  const hasFieldErrors = useMemo(() => Object.keys(fieldErrors).length > 0, [fieldErrors])

  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(DRAFT_KEY)
      if (!rawDraft) return
      const parsedDraft = JSON.parse(rawDraft)
      setFormData((prev) => ({ ...prev, ...parsedDraft }))
    } catch {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
  }, [formData])

  const handleFieldChange = (event) => {
    const { name, type, value, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleSmokeTest = async () => {
    setIsLoadingSmoke(true)
    setSmokeResult('')

    try {
      const result = await smokeTestInscripcionStatus('TEST-000001')
      if (result.status === 404) {
        setSmokeResult(
          `Conexion OK (${result.status}). El backend respondio y TEST-000001 no existe, como se esperaba.`,
        )
      } else {
        const message = result.data?.message || result.data?.mensaje || 'Respuesta sin mensaje'
        setSmokeResult(`Status ${result.status}: ${message}`)
      }
    } catch (error) {
      setSmokeResult(`Error de conexion: ${error.message}`)
    } finally {
      setIsLoadingSmoke(false)
    }
  }

  const handleSubmitFormulario = async (event) => {
    event.preventDefault()
    setSubmitResult('')
    setConsultaResult('')
    setFormSummaryError('')
    setRegistroInfo(null)

    const payload = normalizePayload(formData)
    const validation = validateAdmisionPayload(payload)

    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      setFormSummaryError('Revisa los campos marcados antes de enviar el formulario.')
      return
    }

    setFieldErrors({})
    setIsLoadingSubmit(true)

    try {
      const result = await submitAdmisionFormulario(payload)
      const responseData = result.data?.data || result.data || {}
      const success = Boolean(result.data?.success ?? result.data?.succes ?? result.ok)
      const backendMessage = result.data?.message || result.data?.mensaje || ''

      if (!success) {
        setSubmitResult(
          backendMessage ||
            'El backend recibio la solicitud, pero marco la operacion como no exitosa.',
        )
        return
      }

      const nextFolio = responseData.folio || result.data?.folio || ''
      const fechaExamen = responseData.fechaExamen || '-'
      const horaExamen = responseData.horaExamen || '-'
      const lugarExamen = responseData.lugarExamen || '-'

      setSubmitResult('Formulario enviado correctamente.')
      setRegistroInfo({
        folio: nextFolio,
        fechaExamen,
        horaExamen,
        lugarExamen,
      })

      if (nextFolio) {
        setFolio(nextFolio)

        const statusResult = await consultarStatusInscripcion(nextFolio)
        if (statusResult.found) {
          setConsultaResult('Integracion completa: el folio se creo y el estatus responde 200.')
          localStorage.removeItem(DRAFT_KEY)
        } else {
          setConsultaResult(`Folio creado, pero status responde 404: ${statusResult.message}`)
        }
      }
    } catch (error) {
      if (error.type === 'VALIDATION_ERROR') {
        setFieldErrors(error.fieldErrors || {})
        setFormSummaryError('Hay validaciones pendientes en el formulario.')
      } else if (error.type === 'HTTP_ERROR' && error.status >= 500) {
        setSubmitResult(
          `Status ${error.status}: error interno del backend. Revisa Supabase:Url y Supabase:Key.`,
        )
      } else {
        setSubmitResult(`Error de envio: ${error.message}`)
      }
    } finally {
      setIsLoadingSubmit(false)
    }
  }

  const handleConsultarFolio = async () => {
    if (!folio.trim()) {
      setConsultaResult('Ingresa un folio para consultar su estatus.')
      return
    }

    setIsLoadingConsulta(true)
    setConsultaResult('')

    try {
      const result = await consultarStatusInscripcion(folio.trim())
      if (!result.found) {
        setConsultaResult(`Folio no encontrado: ${result.message}`)
      } else {
        setConsultaResult('Estatus consultado correctamente (HTTP 200).')
      }
    } catch (error) {
      setConsultaResult(`No se pudo consultar estatus: ${error.message}`)
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
      setConsultaResult('No se pudo copiar automaticamente. Copia manualmente el folio mostrado.')
    }
  }

  return (
    <main className="page-main">
      <section className="page-hero page-hero--aspirantes">
        <div className="page-hero__copy">
          <p className="eyebrow">Proceso para aspirantes</p>
          <h1 className="page-hero__title">
            Tu camino a <span className="hero-highlight">NovaUniversitas</span> empieza aqui
          </h1>
          <p className="page-hero__subtitle">
            Llena tu formulario, recibe folio y consulta tu estatus en linea.
          </p>
          <Link to="/contacto" className="primary-button">
            Necesito ayuda
          </Link>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">Flujo funcional</h2>
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

      <section className="content-section aspirantes-api">
        <h2 className="section-title">Conexion API de admision</h2>
        <p className="aspirantes-api__text">
          Base URL activa: <strong>{API_BASE_URL}</strong>
        </p>
        <p className="aspirantes-api__text">
          Configura <strong>VITE_API_URL</strong> (o <strong>VITE_API_BASE_URL</strong>) para
          apuntar al backend.
        </p>
        <div className="aspirantes-api__actions">
          <button
            type="button"
            className="secondary-button"
            onClick={handleSmokeTest}
            disabled={isLoadingSmoke}
          >
            {isLoadingSmoke ? 'Probando...' : 'Smoke test de conexion'}
          </button>
        </div>
        {smokeResult ? <p className="aspirantes-api__result">{smokeResult}</p> : null}
      </section>

      <section className="content-section aspirantes-form-section">
        <h2 className="section-title">Formulario de aspirante</h2>

        {formSummaryError ? <p className="form-summary-error">{formSummaryError}</p> : null}
        {hasFieldErrors ? (
          <p className="form-summary-error">Se detectaron errores en el formulario.</p>
        ) : null}

        <form className="aspirantes-form" onSubmit={handleSubmitFormulario} noValidate>
          <div className="aspirantes-form__grid">
            <label>
              Campus ID
              <input name="campusId" value={formData.campusId} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'campusId')}
            </label>

            <label>
              Carrera ID
              <input name="carreraId" value={formData.carreraId} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'carreraId')}
            </label>

            <label>
              Nombre
              <input name="nombre" value={formData.nombre} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'nombre')}
            </label>

            <label>
              Apellido paterno
              <input
                name="apellidoPaterno"
                value={formData.apellidoPaterno}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'apellidoPaterno')}
            </label>

            <label>
              Apellido materno
              <input
                name="apellidoMaterno"
                value={formData.apellidoMaterno}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'apellidoMaterno')}
            </label>

            <label>
              Fecha de nacimiento
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'fechaNacimiento')}
            </label>

            <label>
              Sexo
              <select name="sexo" value={formData.sexo} onChange={handleFieldChange}>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="O">O</option>
              </select>
              {getFieldMessage(fieldErrors, 'sexo')}
            </label>

            <label>
              Estado civil
              <input name="estadoCivil" value={formData.estadoCivil} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'estadoCivil')}
            </label>

            <label>
              CURP
              <input name="curp" value={formData.curp} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'curp')}
            </label>

            <label>
              Telefono
              <input name="telefono" value={formData.telefono} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'telefono')}
            </label>

            <label>
              Correo
              <input name="correo" value={formData.correo} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'correo')}
            </label>

            <label>
              Calle
              <input name="calle" value={formData.calle} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'calle')}
            </label>

            <label>
              Num. exterior
              <input name="numExt" value={formData.numExt} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'numExt')}
            </label>

            <label>
              Num. interior
              <input name="numInt" value={formData.numInt} onChange={handleFieldChange} />
            </label>

            <label>
              Colonia
              <input name="colonia" value={formData.colonia} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'colonia')}
            </label>

            <label>
              Municipio
              <input name="municipio" value={formData.municipio} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'municipio')}
            </label>

            <label>
              Estado
              <input name="estado" value={formData.estado} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'estado')}
            </label>

            <label>
              Codigo postal
              <input
                name="codigoPostal"
                value={formData.codigoPostal}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'codigoPostal')}
            </label>

            <label>
              Nombre de escuela
              <input
                name="nombreEscuela"
                value={formData.nombreEscuela}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'nombreEscuela')}
            </label>

            <label>
              Tipo de escuela
              <input
                name="tipoEscuela"
                value={formData.tipoEscuela}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'tipoEscuela')}
            </label>

            <label>
              Area de conocimiento
              <input
                name="areaConocimiento"
                value={formData.areaConocimiento}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'areaConocimiento')}
            </label>

            <label>
              Anio de ingreso
              <input
                type="number"
                name="anioIngreso"
                value={formData.anioIngreso}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'anioIngreso')}
            </label>

            <label>
              Anio de egreso
              <input
                type="number"
                name="anioEgreso"
                value={formData.anioEgreso}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'anioEgreso')}
            </label>

            <label>
              Promedio final
              <input
                type="number"
                step="0.1"
                name="promedioFinal"
                value={formData.promedioFinal}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'promedioFinal')}
            </label>

            <label>
              Medio por el que te enteraste
              <input
                name="medioEnterado"
                value={formData.medioEnterado}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'medioEnterado')}
            </label>

            <label>
              Lengua indigena
              <input
                name="lenguaIndigena"
                value={formData.lenguaIndigena}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              Grupo etnico
              <input
                name="grupoEtnico"
                value={formData.grupoEtnico}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              Descendencia
              <input
                name="descendencia"
                value={formData.descendencia}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              Tipo de sangre
              <select name="tipoSangre" value={formData.tipoSangre} onChange={handleFieldChange}>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              {getFieldMessage(fieldErrors, 'tipoSangre')}
            </label>

            <label>
              Enfermedades
              <input
                name="enfermedades"
                value={formData.enfermedades}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              Alergias
              <input name="alergias" value={formData.alergias} onChange={handleFieldChange} />
            </label>

            <label>
              Medicamentos especiales
              <input
                name="medicamentosEspeciales"
                value={formData.medicamentosEspeciales}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              Servicio medico
              <input
                name="servicioMedico"
                value={formData.servicioMedico}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              Numero de afiliacion
              <input
                name="numeroAfiliacion"
                value={formData.numeroAfiliacion}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              Nombre del responsable
              <input
                name="nombreResponsable"
                value={formData.nombreResponsable}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'nombreResponsable')}
            </label>

            <label>
              Parentesco
              <input name="parentesco" value={formData.parentesco} onChange={handleFieldChange} />
              {getFieldMessage(fieldErrors, 'parentesco')}
            </label>

            <label>
              Ocupacion del responsable
              <input
                name="ocupacionResponsable"
                value={formData.ocupacionResponsable}
                onChange={handleFieldChange}
              />
            </label>

            <label>
              Telefono del responsable
              <input
                name="telefonoResponsable"
                value={formData.telefonoResponsable}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'telefonoResponsable')}
            </label>

            <label>
              Lugar de aplicacion
              <input
                name="lugarAplicacion"
                value={formData.lugarAplicacion}
                onChange={handleFieldChange}
              />
              {getFieldMessage(fieldErrors, 'lugarAplicacion')}
            </label>
          </div>

          <label className="aspirantes-form__checkbox">
            <input
              type="checkbox"
              name="esAfrodesc"
              checked={formData.esAfrodesc}
              onChange={handleFieldChange}
            />
            Soy afrodescendiente
          </label>

          <label className="aspirantes-form__checkbox">
            <input
              type="checkbox"
              name="consentimiento"
              checked={formData.consentimiento}
              onChange={handleFieldChange}
            />
            Acepto el consentimiento para el uso de datos en el proceso de admision.
          </label>
          {getFieldMessage(fieldErrors, 'consentimiento')}

          <div className="aspirantes-api__actions">
            <button type="submit" className="primary-button" disabled={isLoadingSubmit}>
              {isLoadingSubmit ? 'Guardando...' : 'Guardar y enviar formulario'}
            </button>
          </div>
        </form>

        {submitResult ? <p className="aspirantes-api__result">{submitResult}</p> : null}

        {registroInfo ? (
          <div className="folio-success">
            <p className="folio-success__label">Folio generado</p>
            <p className="folio-success__folio">{registroInfo.folio || 'Sin folio en respuesta'}</p>
            <p className="folio-success__meta">
              Fecha: {registroInfo.fechaExamen} | Hora: {registroInfo.horaExamen} | Lugar:{' '}
              {registroInfo.lugarExamen}
            </p>
            <button type="button" className="secondary-button" onClick={handleCopiarFolio}>
              Copiar folio
            </button>
          </div>
        ) : null}
      </section>

      <section className="content-section aspirantes-api">
        <h2 className="section-title">Consultar estatus por folio</h2>
        <div className="aspirantes-api__actions aspirantes-api__actions--inline">
          <input
            className="folio-input"
            placeholder="Ej. FOL-2026-000123"
            value={folio}
            onChange={(event) => setFolio(event.target.value)}
          />
          <button
            type="button"
            className="primary-button"
            onClick={handleConsultarFolio}
            disabled={isLoadingConsulta}
          >
            {isLoadingConsulta ? 'Consultando...' : 'Consultar estatus'}
          </button>
        </div>
        {consultaResult ? <p className="aspirantes-api__result">{consultaResult}</p> : null}
      </section>
    </main>
  )
}