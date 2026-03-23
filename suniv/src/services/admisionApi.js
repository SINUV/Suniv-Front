import { validateAdmisionPayload } from '../utils/admisionValidation'

const DEFAULT_BASE_URL = 'http://localhost:5249'
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL
).replace(/\/$/, '')

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function parseResponseBody(contentType, rawText) {
  if (!rawText) return null

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawText)
    } catch {
      return { message: rawText }
    }
  }

  return { message: rawText }
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
        `Tiempo de espera agotado al conectar con ${API_BASE_URL}. Verifica que el backend este encendido.`,
      )
      timeoutError.type = 'NETWORK_TIMEOUT'
      throw timeoutError
    }

    const networkError = new Error(
      `No se pudo conectar con ${API_BASE_URL}. Inicia el backend y valida puerto/URL.`,
    )
    networkError.type = 'NETWORK_UNREACHABLE'
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
    const error = new Error(
      result.data?.message || result.data?.mensaje || `Error HTTP ${result.status}`,
    )
    error.type = 'HTTP_ERROR'
    error.status = result.status
    error.data = result.data
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
  const validation = validateAdmisionPayload(payload)

  if (!validation.isValid) {
    const error = new Error('Payload de admision invalido')
    error.type = 'VALIDATION_ERROR'
    error.fieldErrors = validation.errors
    throw error
  }

  const data = await apiPost('/api/Admision/formulario', payload)

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
      message: result.data?.message || result.data?.mensaje || 'Folio no encontrado',
      status: 404,
    }
  }

  if (!result.ok) {
    const error = new Error(
      result.data?.message || result.data?.mensaje || `Error HTTP ${result.status}`,
    )
    error.type = 'HTTP_ERROR'
    error.status = result.status
    throw error
  }

  return {
    found: true,
    data: result.data,
    status: result.status,
  }
}

export { API_BASE_URL }