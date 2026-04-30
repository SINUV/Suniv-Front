import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import FormularioAspirante from '../components/FormularioAspirante'
import { CAMPUS_OPTIONS, FORM_MODES, PROGRAM_OPTIONS, mergeWithDefaults } from '../formModel'
import {
  consultarStatusInscripcion,
  fetchAspiranteByFolioForInscripcion,
} from '../../../services/admisionApi'
import './AspirantesPage.css'

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function extractAspiranteId(source) {
  const candidates = [
    source?.id,
    source?.aspiranteId,
    source?.aspirante_id,
    source?.data?.id,
    source?.data?.aspiranteId,
    source?.data?.aspirante_id,
    source?.data?.aspirante?.id,
    source?.aspirante?.id,
  ]

  return candidates.find((candidate) => GUID_REGEX.test(String(candidate || '').trim())) || ''
}

function generarFolioPDF(folio, statusData) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const asp = statusData?.aspirante || {}
  const W = doc.internal.pageSize.getWidth()

  const campusNombre =
    CAMPUS_OPTIONS.find((c) => c.id === (asp.campusId || statusData?.campus_id))?.nombre ||
    asp.lugarAplicacion ||
    ''
  const carreraNombre =
    PROGRAM_OPTIONS.find((p) => p.id === (asp.carreraId || statusData?.carrera_id))?.nombre || ''

  // — Encabezado institucional —
  doc.setFillColor(34, 80, 149)
  doc.rect(0, 0, W, 32, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text('SUNIV', 14, 13)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Sistema Unico de Inscripciones y Vinculacion', 14, 20)
  doc.text('Constancia de Registro de Aspirante', 14, 27)

  // — Folio destacado —
  doc.setFillColor(240, 244, 255)
  doc.roundedRect(14, 38, W - 28, 18, 3, 3, 'F')
  doc.setTextColor(34, 80, 149)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text(`Folio: ${folio}`, 20, 47)
  const estado = statusData?.estado_aspirante || 'Pendiente'
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  doc.text(`Estado: ${estado}`, 20, 53)
  doc.text(`Fecha de emision: ${new Date().toLocaleDateString('es-MX')}`, W - 80, 53)

  // — Secciones de datos —
  let y = 68

  function seccion(titulo) {
    doc.setFillColor(34, 80, 149)
    doc.rect(14, y, W - 28, 7, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(titulo.toUpperCase(), 17, y + 5)
    y += 10
    doc.setTextColor(40, 40, 40)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
  }

  function fila(label, valor, x2 = null, label2 = null, valor2 = null) {
    doc.setFont('helvetica', 'bold')
    doc.text(`${label}:`, 16, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(valor ?? '—'), 60, y)
    if (x2 && label2) {
      doc.setFont('helvetica', 'bold')
      doc.text(`${label2}:`, x2, y)
      doc.setFont('helvetica', 'normal')
      doc.text(String(valor2 ?? '—'), x2 + 44, y)
    }
    y += 6
  }

  seccion('Datos personales')
  fila('Nombre', `${asp.nombre || ''} ${asp.apellidoPaterno || ''} ${asp.apellidoMaterno || ''}`)
  fila('Fecha de nacimiento', asp.fechaNacimiento || '', W / 2, 'Sexo', asp.sexo === 'M' ? 'Masculino' : asp.sexo === 'F' ? 'Femenino' : asp.sexo || '')
  fila('CURP', asp.curp || '', W / 2, 'Estado civil', asp.estadoCivil || '')
  y += 2

  seccion('Contacto')
  fila('Correo', asp.correo || '', W / 2, 'Telefono', asp.telefono || '')
  fila('Domicilio', `${asp.calle || ''} ${asp.numExt || ''}, ${asp.colonia || ''}, ${asp.municipio || ''}, ${asp.estado || ''} ${asp.codigoPostal || ''}`)
  y += 2

  seccion('Formacion academica')
  fila('Escuela de procedencia', asp.nombreEscuela || '', W / 2, 'Tipo', asp.tipoEscuela || '')
  fila('Area de conocimiento', asp.areaConocimiento || '')
  fila('Anio ingreso', asp.anioIngreso || '', W / 2, 'Anio egreso', asp.anioEgreso || '')
  fila('Promedio final', asp.promedioFinal ?? '')
  y += 2

  seccion('Admision')
  fila('Campus', campusNombre)
  fila('Carrera solicitada', carreraNombre)
  fila('Lugar de evaluacion', asp.lugarAplicacion || campusNombre)
  y += 2

  // — Pie de página —
  doc.setDrawColor(200, 200, 200)
  doc.line(14, y + 4, W - 14, y + 4)
  doc.setFontSize(8)
  doc.setTextColor(120, 120, 120)
  doc.text(
    'Este documento es una constancia de registro. No garantiza la admision. Conserva tu folio para dar seguimiento a tu proceso.',
    14,
    y + 10,
    { maxWidth: W - 28 },
  )
  doc.text(`SUNIV • ${new Date().getFullYear()}`, W / 2, y + 18, { align: 'center' })

  doc.save(`SUNIV_Folio_${folio}.pdf`)
}

function getEstadoFromResponse(rawData) {
  const source = rawData?.data || rawData || {}
  return String(source.estado_aspirante || source.estado || source.status || '').trim()
}

function getMensajeFromResponse(rawData) {
  const source = rawData?.data || rawData || {}
  return source.mensaje || source.message || ''
}

function isTemporaryDevFolio(value) {
  return String(value || '').trim().toUpperCase().startsWith('TMP-')
}

export default function AspirantesPage() {
  const [activeMode, setActiveMode] = useState(FORM_MODES.ASPIRANTE)
  const [folio, setFolio] = useState('')
  const [aspiranteId, setAspiranteId] = useState('')
  const [statusInfo, setStatusInfo] = useState(null)
  const [isConsultingStatus, setIsConsultingStatus] = useState(false)
  const [isLoadingInscripcionData, setIsLoadingInscripcionData] = useState(false)
  const [inscripcionInitialData, setInscripcionInitialData] = useState(null)

  const statusLabel = useMemo(() => {
    if (!statusInfo?.estado) return ''
    return `Estado actual: ${statusInfo.estado}`
  }, [statusInfo])

  const canContinueInscripcion =
    statusInfo?.estado?.toLowerCase() === 'aprobado' && statusInfo?.folio

  const handleConsultarStatus = async () => {
    const safeFolio = folio.trim()

    if (!safeFolio) {
      setStatusInfo(null)
      return
    }

    setIsConsultingStatus(true)
    setStatusInfo(null)

    try {
      const result = await consultarStatusInscripcion(safeFolio)

      if (!result.found) {
        return
      }

      const estado = getEstadoFromResponse(result.data)
      const mensaje = getMensajeFromResponse(result.data)

      setStatusInfo({
        folio: safeFolio,
        estado: estado || 'Pendiente',
        mensaje,
        rawData: result.data,
      })
    } catch {
      // Errores ocultos en UI por requerimiento; se mantiene la vista limpia.
    } finally {
      setIsConsultingStatus(false)
    }
  }

  const handleContinueInscripcion = async () => {
    if (!canContinueInscripcion) {
      return
    }

    setIsLoadingInscripcionData(true)

    try {
      const result = await fetchAspiranteByFolioForInscripcion(statusInfo.folio)
      const aspiranteData = result?.data?.aspirante || {}
      setAspiranteId(extractAspiranteId(aspiranteData) || extractAspiranteId(result?.data))
      setInscripcionInitialData(mergeWithDefaults(aspiranteData))
      setActiveMode(FORM_MODES.INSCRIPCION)
    } catch {
      // Errores ocultos en UI por requerimiento; se mantiene la vista limpia.
    } finally {
      setIsLoadingInscripcionData(false)
    }
  }

  const handleSuccess = async ({ mode, folio: responseFolio, backend }) => {
    const normalizedFolio = String(responseFolio || folio || '').trim()
    if (!normalizedFolio) return

    setFolio(normalizedFolio)
    setAspiranteId(extractAspiranteId(backend?.data?.data) || extractAspiranteId(backend?.data))

    if (isTemporaryDevFolio(normalizedFolio)) {
      setStatusInfo({
        folio: normalizedFolio,
        estado: mode === FORM_MODES.ASPIRANTE ? 'Pendiente' : '',
        mensaje: '',
        rawData: backend?.data?.data || backend?.data || null,
      })
      return
    }

    try {
      const result = await consultarStatusInscripcion(normalizedFolio)
      if (result.found) {
        const estado = getEstadoFromResponse(result.data)
        const mensaje = getMensajeFromResponse(result.data)

        setStatusInfo({
          folio: normalizedFolio,
          estado: estado || (mode === FORM_MODES.ASPIRANTE ? 'Pendiente' : ''),
          mensaje,
          rawData: result.data,
        })
        return
      }
    } catch {
      // Keep fallback info so user can still download PDF right after submit.
    }

    setStatusInfo({
      folio: normalizedFolio,
      estado: mode === FORM_MODES.ASPIRANTE ? 'Pendiente' : '',
      mensaje: '',
      rawData: backend?.data?.data || backend?.data || null,
    })
  }

  const handleSwitchToAspirante = () => {
    setActiveMode(FORM_MODES.ASPIRANTE)
  }

  return (
    <main className="page-main aspirantes-flow">
      <section className="page-hero page-hero--aspirantes">
        <div className="page-hero__copy">
          <p className="eyebrow">Ficha de aspirante</p>
          <h1 className="page-hero__title">
            Genera tu <span className="hero-highlight">ficha de admision</span>
          </h1>
          <p className="page-hero__subtitle">
            Completa tu registro, obten tu folio y da seguimiento a tu proceso.
          </p>
        </div>
      </section>

      <section className="content-section aspirantes-flow__grid">
        <article className="aspirantes-panel aspirantes-panel--form aspirantes-panel--form-wide">
          

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
            aspiranteId={aspiranteId}
            folio={statusInfo?.folio || folio.trim()}
            initialData={
              activeMode === FORM_MODES.INSCRIPCION
                ? mergeWithDefaults(inscripcionInitialData || {})
                : null
            }
            isLoadingInitialData={activeMode === FORM_MODES.INSCRIPCION && isLoadingInscripcionData}
            onSuccess={handleSuccess}
          />
        </article>

        <article className="aspirantes-panel aspirantes-panel--consulta aspirantes-panel--consulta-bottom">
          <h2 className="aspirantes-panel__title">Consulta tu folio</h2>
          <p className="aspirantes-panel__lead">
            Si ya realizaste tu registro, ingresa tu folio para revisar estatus y continuar
            el proceso de inscripcion cuando corresponda.
          </p>

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
          {statusInfo?.folio && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => generarFolioPDF(statusInfo.folio, statusInfo.rawData)}
            >
              Descargar constancia PDF
            </button>
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
        </article>
      </section>
    </main>
  )
}
