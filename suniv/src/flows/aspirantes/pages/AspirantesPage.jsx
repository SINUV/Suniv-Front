import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FormularioAspirante from '../components/FormularioAspirante'
import { FORM_MODES, mergeWithDefaults } from '../formModel'
import {
  API_BASE_URL,
  consultarStatusInscripcion,
  fetchAspiranteByFolioForInscripcion,
} from '../../../services/admisionApi'
import './AspirantesPage.css'

function getEstadoFromResponse(rawData) {
  const source = rawData?.data || rawData || {}
  return String(source.estado_aspirante || source.estado || source.status || '').trim()
}

function getMensajeFromResponse(rawData) {
  const source = rawData?.data || rawData || {}
  return source.mensaje || source.message || ''
}

export default function AspirantesPage() {
  const [activeMode, setActiveMode] = useState(FORM_MODES.ASPIRANTE)
  const [folio, setFolio] = useState('')
  const [statusInfo, setStatusInfo] = useState(null)
  const [statusError, setStatusError] = useState('')
  const [isConsultingStatus, setIsConsultingStatus] = useState(false)
  const [isLoadingInscripcionData, setIsLoadingInscripcionData] = useState(false)
  const [inscripcionInitialData, setInscripcionInitialData] = useState(null)
  const [lastSuccessMessage, setLastSuccessMessage] = useState('')

  const statusLabel = useMemo(() => {
    if (!statusInfo?.estado) return ''
    return `Estado actual: ${statusInfo.estado}`
  }, [statusInfo])

  const canContinueInscripcion =
    statusInfo?.estado?.toLowerCase() === 'aprobado' && statusInfo?.folio

  const handleConsultarStatus = async () => {
    const safeFolio = folio.trim()

    if (!safeFolio) {
      setStatusError('Ingresa un folio para consultar su estado.')
      setStatusInfo(null)
      return
    }

    setIsConsultingStatus(true)
    setStatusError('')
    setStatusInfo(null)

    try {
      const result = await consultarStatusInscripcion(safeFolio)

      if (!result.found) {
        setStatusError(result.message || 'No se encontro informacion para este folio.')
        return
      }

      const estado = getEstadoFromResponse(result.data)
      const mensaje = getMensajeFromResponse(result.data)

      setStatusInfo({
        folio: safeFolio,
        estado: estado || 'Pendiente',
        mensaje,
      })
    } catch (error) {
      setStatusError(error?.message || 'No fue posible consultar el estado del folio.')
    } finally {
      setIsConsultingStatus(false)
    }
  }

  const handleContinueInscripcion = async () => {
    if (!canContinueInscripcion) {
      return
    }

    setIsLoadingInscripcionData(true)
    setLastSuccessMessage('')

    try {
      const result = await fetchAspiranteByFolioForInscripcion(statusInfo.folio)
      const aspiranteData = result?.data?.aspirante || {}
      setInscripcionInitialData(mergeWithDefaults(aspiranteData))
      setActiveMode(FORM_MODES.INSCRIPCION)
    } catch (error) {
      setStatusError(error?.message || 'No se pudieron cargar los datos para inscripcion.')
    } finally {
      setIsLoadingInscripcionData(false)
    }
  }

  const handleSuccess = ({ mode, folio: responseFolio }) => {
    if (mode === FORM_MODES.ASPIRANTE) {
      setLastSuccessMessage(
        `Registro de aspirante enviado correctamente. Folio: ${responseFolio || 'sin folio en respuesta'}.`,
      )
      return
    }

    setLastSuccessMessage(
      `Inscripcion completada correctamente para el folio ${responseFolio || folio}.`,
    )
  }

  const handleSwitchToAspirante = () => {
    setActiveMode(FORM_MODES.ASPIRANTE)
    setStatusError('')
  }

  return (
    <main className="page-main aspirantes-flow">
      <section className="page-hero page-hero--aspirantes">
        <div className="page-hero__copy">
          <p className="eyebrow">Admision e inscripcion</p>
          <h1 className="page-hero__title">
            Flujo completo de <span className="hero-highlight">Aspirante a Estudiante</span>
          </h1>
          <p className="page-hero__subtitle">
            Registro, consulta de estado y envio final de inscripcion en un solo flujo.
          </p>
          <Link to="/contacto" className="primary-button">
            Necesito ayuda
          </Link>
        </div>
      </section>

      <section className="content-section aspirantes-flow__grid">
        <article className="aspirantes-panel aspirantes-panel--consulta">
          <h2>Consulta por folio</h2>

          <div className="aspirantes-panel__inline">
            <input
              className="folio-input"
              placeholder="Ej. FOL-2026-000123"
              value={folio}
              onChange={(event) => setFolio(event.target.value)}
              aria-label="Folio"
            />

            <button
              type="button"
              className="secondary-button"
              onClick={handleConsultarStatus}
              disabled={isConsultingStatus}
            >
              {isConsultingStatus ? 'Consultando...' : 'Consultar estado'}
            </button>
          </div>

          {statusLabel && <p className="aspirantes-panel__status">{statusLabel}</p>}
          {statusInfo?.mensaje && <p className="aspirantes-panel__hint">{statusInfo.mensaje}</p>}
          {statusError && (
            <p className="aspirantes-panel__error" role="alert">
              {statusError}
            </p>
          )}

          {canContinueInscripcion && (
            <button
              type="button"
              className="primary-button"
              onClick={handleContinueInscripcion}
              disabled={isLoadingInscripcionData}
            >
              {isLoadingInscripcionData ? 'Cargando datos...' : 'Continuar inscripcion'}
            </button>
          )}

          <div className="aspirantes-panel__api-note">
            <small>Base URL activa: {API_BASE_URL}</small>
          </div>
        </article>

        <article className="aspirantes-panel aspirantes-panel--form">
          <div className="aspirantes-panel__mode-switch">
            <button
              type="button"
              onClick={handleSwitchToAspirante}
              className={activeMode === FORM_MODES.ASPIRANTE ? 'is-active' : ''}
            >
              Registro aspirante
            </button>
            <button
              type="button"
              onClick={handleContinueInscripcion}
              className={activeMode === FORM_MODES.INSCRIPCION ? 'is-active' : ''}
              disabled={!canContinueInscripcion}
            >
              Inscripcion
            </button>
          </div>

          <FormularioAspirante
            mode={activeMode}
            folio={statusInfo?.folio || folio.trim()}
            initialData={
              activeMode === FORM_MODES.INSCRIPCION
                ? mergeWithDefaults(inscripcionInitialData || {})
                : null
            }
            isLoadingInitialData={activeMode === FORM_MODES.INSCRIPCION && isLoadingInscripcionData}
            onSuccess={handleSuccess}
          />

          {lastSuccessMessage && <p className="aspirantes-panel__ok">{lastSuccessMessage}</p>}
        </article>
      </section>
    </main>
  )
}
