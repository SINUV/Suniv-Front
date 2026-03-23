const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ALLOWED_SEXO = new Set(['M', 'F', 'O'])
const ALLOWED_TIPO_SANGRE = new Set([
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
])

function isValidDate(value) {
  if (!DATE_REGEX.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

function isNonEmpty(value) {
  return String(value || '').trim().length > 0
}

export function validateAdmisionPayload(payload) {
  const errors = {}
  const currentYear = new Date().getFullYear()

  const requiredFields = [
    'nombre',
    'apellidoPaterno',
    'apellidoMaterno',
    'estadoCivil',
    'curp',
    'telefono',
    'correo',
    'calle',
    'numExt',
    'colonia',
    'municipio',
    'estado',
    'codigoPostal',
    'nombreEscuela',
    'tipoEscuela',
    'areaConocimiento',
    'medioEnterado',
    'nombreResponsable',
    'parentesco',
    'telefonoResponsable',
    'lugarAplicacion',
  ]

  requiredFields.forEach((fieldName) => {
    if (!isNonEmpty(payload[fieldName])) {
      errors[fieldName] = 'Este campo es obligatorio'
    }
  })

  if (!UUID_REGEX.test(payload.campusId || '')) {
    errors.campusId = 'campusId debe ser UUID valido'
  }

  if (!UUID_REGEX.test(payload.carreraId || '')) {
    errors.carreraId = 'carreraId debe ser UUID valido'
  }

  if (!isValidDate(payload.fechaNacimiento || '')) {
    errors.fechaNacimiento = 'fechaNacimiento debe usar formato YYYY-MM-DD'
  }

  if (!EMAIL_REGEX.test(payload.correo || '')) {
    errors.correo = 'correo debe tener formato valido'
  }

  if (String(payload.curp || '').trim().length < 10) {
    errors.curp = 'curp debe tener al menos 10 caracteres'
  }

  if (!ALLOWED_SEXO.has(payload.sexo || '')) {
    errors.sexo = 'sexo debe ser M, F u O'
  }

  if (!ALLOWED_TIPO_SANGRE.has(payload.tipoSangre || '')) {
    errors.tipoSangre = 'tipoSangre debe ser A+, A-, B+, B-, AB+, AB-, O+ u O-'
  }

  const promedio = Number(payload.promedioFinal)
  if (Number.isNaN(promedio) || promedio < 0 || promedio > 10) {
    errors.promedioFinal = 'promedioFinal debe estar entre 0 y 10'
  }

  const anioIngreso = Number(payload.anioIngreso)
  if (Number.isNaN(anioIngreso) || anioIngreso < 1900 || anioIngreso > currentYear) {
    errors.anioIngreso = `anioIngreso debe estar entre 1900 y ${currentYear}`
  }

  const anioEgreso = Number(payload.anioEgreso)
  if (Number.isNaN(anioEgreso) || anioEgreso < 1900 || anioEgreso > currentYear) {
    errors.anioEgreso = `anioEgreso debe estar entre 1900 y ${currentYear}`
  }

  if (payload.consentimiento !== true) {
    errors.consentimiento = 'Debes aceptar el consentimiento para continuar'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}