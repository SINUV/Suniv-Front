import {
  FORM_DEFAULT_VALUES,
  mergeWithDefaults,
  normalizeAspirantePayload,
} from '../flows/aspirantes/formModel'

const DEFAULT_BASE_URL = 'http://localhost:5249'
const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || ''
const ALLOW_CROSS_ORIGIN_API = String(import.meta.env.VITE_ALLOW_CROSS_ORIGIN_API || '').toLowerCase() === 'true'
const IS_ABSOLUTE_URL = /^https?:\/\//i.test(RAW_API_BASE_URL)
const API_BASE_URL = (
  import.meta.env.PROD
    ? (ALLOW_CROSS_ORIGIN_API && IS_ABSOLUTE_URL ? RAW_API_BASE_URL : '')
    : RAW_API_BASE_URL || DEFAULT_BASE_URL
).replace(/\/$/, '')
const USE_REAL_API_IN_DEV = String(import.meta.env.VITE_USE_REAL_API || '').toLowerCase() === 'true'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function createGuidFallback() {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID()
    }
  } catch {
    // no-op
  }

  return '00000000-0000-4000-8000-000000000001'
}

function createMockSubmitResponse(prefix = 'TMP') {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
  const rand = Math.floor(Math.random() * 9000) + 1000
  const folio = `${prefix}-${stamp}-${rand}`

  return {
    success: true,
    data: {
      folio,
      aspiranteId: createGuidFallback(),
    },
    __mock: true,
  }
}

function sanitizeErrorMessage(msg) {
  if (!msg || typeof msg !== 'string') return 'Ocurrio un error. Por favor intenta de nuevo.'

  // Ocultar URLs
  let clean = msg.replace(/https?:\/\/[^\s"']+/g, '[servidor]')
  // Ocultar rutas internas /api/...
  clean = clean.replace(/\/api\/[^\s"']+/g, '[ruta interna]')
  // Ocultar localhost
  clean = clean.replace(/localhost:\d+/g, '[servidor local]')
  // Ocultar detalles JSON complejos
  clean = clean.replace(/Path: \$\.[^|]+\|/g, '')
  clean = clean.replace(/LineNumber: \d+/g, '')
  clean = clean.replace(/BytePositionInLine: \d+/g, '')
  // Limpiar espacios dobles
  clean = clean.replace(/\s{2,}/g, ' ').trim()

  return clean || 'Ocurrio un error. Por favor intenta de nuevo.'
}

function mapBackendErrorToUserMessage(error) {
  const msg = error?.message || error?.mensaje || String(error)
  const status = error?.status
  const validationErrors = error?.errors || error?.data?.errors

  if (validationErrors && typeof validationErrors === 'object') {
    const firstField = Object.keys(validationErrors)[0]
    const firstMessages = firstField ? validationErrors[firstField] : null
    const firstMessage = Array.isArray(firstMessages) ? firstMessages[0] : firstMessages

    if (firstMessage) {
      return sanitizeErrorMessage(String(firstMessage))
    }
  }

  // Mapear errores comunes del backend
  if (msg.includes('CURP') || msg.includes('curp')) {
    return 'Verifica tu CURP. Debe cumplir el formato correcto.'
  }
  if (msg.includes('validation') || msg.includes('validacion') || msg.includes('One or more validation')) {
    return 'Hay errores en los datos ingresados. Revisa que todos los campos esten completos y sean validos.'
  }
  if (msg.includes('Guid') || msg.includes('guid')) {
    return 'Selecciona un campus y carrera validos.'
  }
  if (msg.includes('JSON') || msg.includes('json')) {
    return 'Hay un problema con los datos enviados. Intenta de nuevo.'
  }
  if (status === 400) {
    return 'Uno o mas campos tienen datos invalidos. Revisa y vuelve a intentar.'
  }
  if (status === 404) {
    return 'El recurso no fue encontrado. Intenta de nuevo.'
  }
  if (status === 500) {
    return 'Error en el servidor. Por favor intenta mas tarde.'
  }

  return sanitizeErrorMessage(msg)
}

function parseResponseBody(contentType, rawText) {
  if (!rawText) return null

  // application/problem+json es el formato de errores de validación de .NET
  if (contentType.includes('application/json') || contentType.includes('application/problem+json')) {
    try {
      return JSON.parse(rawText)
    } catch {
      return { message: rawText }
    }
  }

  // Intentar parsear como JSON igualmente (por si el Content-Type viene mal configurado)
  if (rawText.trimStart().startsWith('{') || rawText.trimStart().startsWith('[')) {
    try {
      return JSON.parse(rawText)
    } catch {
      // No era JSON válido, continúa
    }
  }

  return { message: rawText }
}

const ASPIRANTE_SNAPSHOT_PREFIX = 'suniv_aspirante_snapshot_'
const ASPIRANTE_SNAPSHOT_LAST_KEY = 'suniv_aspirante_snapshot_last'

function getSnapshotKey(folio) {
  return `${ASPIRANTE_SNAPSHOT_PREFIX}${String(folio || '').trim().toUpperCase()}`
}

function hasFormFields(value) {
  if (!value || typeof value !== 'object') return false
  const fields = Object.keys(FORM_DEFAULT_VALUES)
  return fields.some((field) => value[field] !== undefined && value[field] !== null)
}

function extractAspiranteFromStatusPayload(payload) {
  const source = payload?.data || payload || {}
  const candidates = [
    source.aspirante,
    source.formulario,
    source.registro,
    source.detalle,
    source.data?.aspirante,
    source.data?.formulario,
    source.data?.registro,
    source.data?.detalle,
    source,
  ]

  return candidates.find((candidate) => hasFormFields(candidate)) || null
}

function readSnapshot(folio) {
  if (typeof localStorage === 'undefined') return null

  const byFolio = localStorage.getItem(getSnapshotKey(folio))
  if (byFolio) {
    try {
      return JSON.parse(byFolio)
    } catch {
      localStorage.removeItem(getSnapshotKey(folio))
    }
  }

  const last = localStorage.getItem(ASPIRANTE_SNAPSHOT_LAST_KEY)
  if (!last) return null

  try {
    return JSON.parse(last)
  } catch {
    localStorage.removeItem(ASPIRANTE_SNAPSHOT_LAST_KEY)
    return null
  }
}

export function cacheAspiranteSnapshot(folio, payload) {
  if (typeof localStorage === 'undefined' || !payload) return

  const normalizedFolio = String(folio || '').trim().toUpperCase()
  const snapshot = mergeWithDefaults(payload)

  if (normalizedFolio) {
    localStorage.setItem(getSnapshotKey(normalizedFolio), JSON.stringify(snapshot))
  }

  localStorage.setItem(ASPIRANTE_SNAPSHOT_LAST_KEY, JSON.stringify(snapshot))
}

async function requestJson(path, options = {}, retryCount = 1) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
      signal: controller.signal,
    })

    const rawText = await response.text()
    const contentType = response.headers.get('content-type') || ''
    const parsedBody = parseResponseBody(contentType, rawText)

    return {
      ok: response.ok,
      status: response.status,
      data: parsedBody,
    }
  } catch (error) {
    if (retryCount > 0) {
      await sleep(450)
      return requestJson(path, options, retryCount - 1)
    }

    if (error.name === 'AbortError') {
      const timeoutError = new Error(
        'La conexion esta tardando mucho. Intenta de nuevo en unos momentos.',
      )
      timeoutError.type = 'NETWORK_TIMEOUT'
      timeoutError.userFriendly = true
      throw timeoutError
    }

    const networkError = new Error(
      'No se pudo conectar con el servidor. Por favor intenta de nuevo.',
    )
    networkError.type = 'NETWORK_UNREACHABLE'
    networkError.userFriendly = true
    throw networkError
  } finally {
    clearTimeout(timeoutId)
  }
}

export async function apiPost(path, payload) {
  const result = await requestJson(path, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!result.ok) {
    console.error('[SUNIV] Error backend:', result.status, result.data)
    const rawMsg =
      result.data?.message ||
      result.data?.mensaje ||
      result.data?.title ||
      `Error HTTP ${result.status}`
    const error = new Error(
      mapBackendErrorToUserMessage({
        message: rawMsg,
        status: result.status,
        data: result.data,
        errors: result.data?.errors,
      }),
    )
    error.type = 'HTTP_ERROR'
    error.status = result.status
    error.data = result.data
    error.userFriendly = true
    throw error
  }

  return result.data
}

export async function apiGet(path) {
  return requestJson(path, { method: 'GET' })
}

export async function smokeTestInscripcionStatus(folio = 'TEST-000001') {
  return apiGet(`/api/Inscripciones/consulta/status/${encodeURIComponent(folio)}`)
}

export async function submitAdmisionFormulario(payload) {
  if (import.meta.env.DEV && !USE_REAL_API_IN_DEV) {
    return {
      ok: true,
      status: 200,
      data: createMockSubmitResponse('TMP-ADM'),
    }
  }

  let data
  try {
    data = await apiPost('/api/Admision/formulario', payload)
  } catch (error) {
    if (import.meta.env.DEV && error?.type === 'NETWORK_UNREACHABLE') {
      console.warn('[MockSubmitAdmision] Backend no disponible, usando respuesta local temporal.')
      data = createMockSubmitResponse('TMP-ADM')
    } else {
      throw error
    }
  }

  return {
    ok: Boolean(data?.success ?? data?.succes ?? true),
    status: 200,
    data,
  }
}

export async function consultarStatusInscripcion(folio) {
  const result = await apiGet(`/api/Inscripciones/consulta/status/${encodeURIComponent(folio)}`)

  if (result.status === 404) {
    return {
      found: false,
      message: 'Folio no encontrado. Verifica que este correcto.',
      status: 404,
    }
  }

  if (!result.ok) {
    const rawMsg = result.data?.message || result.data?.mensaje || `Error HTTP ${result.status}`
    const error = new Error(mapBackendErrorToUserMessage({ message: rawMsg, status: result.status }))
    error.type = 'HTTP_ERROR'
    error.status = result.status
    error.userFriendly = true
    throw error
  }

  return {
    found: true,
    data: result.data,
    status: result.status,
  }
}

export async function submitInscripcionFormulario(payload) {
  if (import.meta.env.DEV && !USE_REAL_API_IN_DEV) {
    return {
      ok: true,
      status: 200,
      data: createMockSubmitResponse('TMP-INS'),
    }
  }

  let data
  try {
    data = await apiPost('/api/Inscripciones/formulario', payload)
  } catch (error) {
    if (import.meta.env.DEV && error?.type === 'NETWORK_UNREACHABLE') {
      console.warn('[MockSubmitInscripcion] Backend no disponible, usando respuesta local temporal.')
      data = createMockSubmitResponse('TMP-INS')
    } else {
      throw error
    }
  }

  return {
    ok: Boolean(data?.success ?? data?.succes ?? true),
    status: 200,
    data,
  }
}

export async function getAllowedDocumentExtensions(documentoId) {
  const safeId = String(documentoId || '').trim()
  if (!safeId) {
    throw new Error('No se encontro el identificador del documento.')
  }

  const result = await apiGet(`/api/admision/documentos/extensiones/${encodeURIComponent(safeId)}`)

  if (!result.ok) {
    const rawMsg = result.data?.message || result.data?.mensaje || `Error HTTP ${result.status}`
    throw new Error(sanitizeErrorMessage(rawMsg))
  }

  const extensions = result.data?.extensions
  if (!Array.isArray(extensions)) return []

  return extensions
    .map((ext) => String(ext || '').trim().toLowerCase())
    .filter(Boolean)
}

export async function uploadAdmisionDocumento({ aspiranteId, documentoId, file }) {
  const safeAspiranteId = String(aspiranteId || '').trim()
  const safeDocumentoId = String(documentoId || '').trim()

  if (!safeAspiranteId || !safeDocumentoId) {
    throw new Error('No se encontraron los IDs para subir el documento.')
  }

  if (!(file instanceof File)) {
    throw new Error('Selecciona un archivo valido para continuar.')
  }

  const formData = new FormData()
  formData.append('archivo', file)

  const response = await fetch(
    `${API_BASE_URL}/api/admision/subir-documento?aspiranteId=${encodeURIComponent(safeAspiranteId)}&documentoId=${encodeURIComponent(safeDocumentoId)}`,
    {
      method: 'POST',
      body: formData,
    },
  )

  const rawText = await response.text()
  let data = null
  try {
    data = rawText ? JSON.parse(rawText) : null
  } catch {
    data = { message: rawText }
  }

  if (!response.ok || data?.success === false) {
    const rawMsg = data?.message || data?.mensaje || `Error HTTP ${response.status}`
    throw new Error(sanitizeErrorMessage(rawMsg))
  }

  return data?.url || ''
}

const MOCK_INSCRIPCION_BY_FOLIO = {
  'FOL-2026-000123': {
    estado: 'Aprobado',
    aspirante: normalizeAspirantePayload(
      mergeWithDefaults({
        campusId: '6283ba78-af47-4291-ab87-4325310e866f',
        carreraId: 'b30269e1-326c-4958-839a-d9d85003dc9e',
        nombre: 'Andrea',
        apellidoPaterno: 'Santiago',
        apellidoMaterno: 'Perez',
        fechaNacimiento: '2006-06-19',
        sexo: 'F',
        estadoCivil: 'Soltera',
        curp: 'SAPA060619MOCRRN06',
        telefono: '9512013402',
        correo: 'andrea.santiago@demo.com',
        calle: 'Avenida Reforma',
        numExt: '120',
        colonia: 'Centro',
        municipio: 'Oaxaca de Juarez',
        estado: 'Oaxaca',
        codigoPostal: '68000',
        nombreEscuela: 'CBTIS 26',
        tipoEscuela: 'Publica',
        areaConocimiento: 'Fisico-Matematicas',
        anioIngreso: '2021',
        anioEgreso: '2024',
        promedioFinal: '9.2',
        medioEnterado: 'Facebook',
        tipoSangre: 'O+',
        nombreResponsable: 'Rogelio Santiago',
        parentesco: 'Padre',
        telefonoResponsable: '9513987450',
        calleResponsable: 'Avenida Reforma',
        coloniaResponsable: 'Centro',
        municipioResponsable: 'Oaxaca de Juarez',
        estadoResponsable: 'Oaxaca',
        codigoPostalResponsable: '68000',
        lugarAplicacion: 'Campus San Jacinto',
        consentimiento: true,
      }),
    ),
  },
}

export async function fetchAspiranteByFolioForInscripcion(folio) {
  await sleep(900)

  const fallback = {
    estado: 'Aprobado',
    aspirante: normalizeAspirantePayload(FORM_DEFAULT_VALUES),
  }

  const normalizedFolio = String(folio || '').trim().toUpperCase()

  const statusResult = await apiGet(
    `/api/Inscripciones/consulta/status/${encodeURIComponent(normalizedFolio)}`,
  )

  const fromBackend = statusResult.ok ? extractAspiranteFromStatusPayload(statusResult.data) : null

  if (fromBackend) {
    const aspirante = mergeWithDefaults(fromBackend)
    cacheAspiranteSnapshot(normalizedFolio, aspirante)

    return {
      found: true,
      folio: normalizedFolio,
      data: {
        estado: statusResult.data?.estado_aspirante || statusResult.data?.estado || 'Aprobado',
        aspirante,
      },
    }
  }

  const fromSnapshot = readSnapshot(normalizedFolio)
  if (fromSnapshot) {
    return {
      found: true,
      folio: normalizedFolio,
      data: {
        estado: 'Aprobado',
        aspirante: mergeWithDefaults(fromSnapshot),
      },
    }
  }

  const data = MOCK_INSCRIPCION_BY_FOLIO[normalizedFolio] || fallback

  return {
    found: Boolean(MOCK_INSCRIPCION_BY_FOLIO[normalizedFolio]),
    folio: normalizedFolio,
    data,
  }
}

export { API_BASE_URL }