const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\d{10}$/
const POSTAL_CODE_REGEX = /^\d{5}$/
const CURP_REGEX = /^[A-Z0-9]{18}$/

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
const ALLOWED_ESTADO_CIVIL = new Set(['Soltero', 'Casado', 'Divorciado', 'Viudo'])
const ALLOWED_TIPO_ESCUELA = new Set(['Publica', 'Privada'])
const ALLOWED_AREA = new Set(['STEM', 'Humanidades', 'Sociales', 'Otra'])
const ALLOWED_PARENTESCO = new Set(['Madre', 'Padre', 'Tutor', 'Otro'])
const ALLOWED_SERVICIO_MEDICO = new Set(['IMSS', 'ISSSTE', 'Privado', 'Ninguno'])

function isValidDate(value) {
  if (!DATE_REGEX.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

function isNonEmpty(value) {
  return String(value || '').trim().length > 0
}

function minLength(value, min) {
  return String(value || '').trim().length >= min
}

function normalizeStringFields(payload) {
  const normalized = { ...payload }
  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === 'string') {
      normalized[key] = normalized[key].trim()
    }
  })
  return normalized
}

export function validateAdmisionPayload(payload) {
  const normalized = normalizeStringFields(payload)
  const errors = {}
  const currentYear = new Date().getFullYear()
  const today = new Date()

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
    'calleResponsable',
    'coloniaResponsable',
    'municipioResponsable',
    'estadoResponsable',
    'codigoPostalResponsable',
    'lugarAplicacion',
  ]

  requiredFields.forEach((fieldName) => {
    if (!isNonEmpty(normalized[fieldName])) {
      errors[fieldName] = 'Este campo es obligatorio'
    }
  })

  if (!UUID_REGEX.test(normalized.campusId || '')) {
    errors.campusId = 'CampusId debe ser Guid valido'
  }

  if (!UUID_REGEX.test(normalized.carreraId || '')) {
    errors.carreraId = 'CarreraId debe ser Guid valido'
  }

  if (!isValidDate(normalized.fechaNacimiento || '')) {
    errors.fechaNacimiento = 'fechaNacimiento debe usar formato YYYY-MM-DD'
  } else {
    const birthDate = new Date(`${normalized.fechaNacimiento}T00:00:00`)
    if (birthDate > today) {
      errors.fechaNacimiento = 'fechaNacimiento no puede ser futura'
    } else {
      const adultDate = new Date(today)
      adultDate.setFullYear(adultDate.getFullYear() - 18)
      if (birthDate > adultDate) {
        errors.fechaNacimiento = 'Debes tener al menos 18 años'
      }
    }
  }

  if (!EMAIL_REGEX.test(normalized.correo || '')) {
    errors.correo = 'correo debe tener formato valido'
  }

  if (!CURP_REGEX.test((normalized.curp || '').toUpperCase())) {
    errors.curp = 'curp debe tener exactamente 18 caracteres alfanumericos en mayusculas'
  }

  if (!minLength(normalized.nombre, 2) || normalized.nombre.length > 100) {
    errors.nombre = 'nombre debe tener entre 2 y 100 caracteres'
  }
  if (!minLength(normalized.apellidoPaterno, 2) || normalized.apellidoPaterno.length > 100) {
    errors.apellidoPaterno = 'apellidoPaterno debe tener entre 2 y 100 caracteres'
  }
  if (!minLength(normalized.apellidoMaterno, 2) || normalized.apellidoMaterno.length > 100) {
    errors.apellidoMaterno = 'apellidoMaterno debe tener entre 2 y 100 caracteres'
  }

  if (!ALLOWED_ESTADO_CIVIL.has(normalized.estadoCivil || '')) {
    errors.estadoCivil = 'estadoCivil invalido'
  }

  if (!PHONE_REGEX.test(normalized.telefono || '')) {
    errors.telefono = 'telefono debe tener 10 digitos'
  }

  if (!PHONE_REGEX.test(normalized.telefonoResponsable || '')) {
    errors.telefonoResponsable = 'telefonoResponsable debe tener 10 digitos'
  }

  if (!POSTAL_CODE_REGEX.test(normalized.codigoPostal || '')) {
    errors.codigoPostal = 'codigoPostal debe tener 5 digitos'
  }

  if (!POSTAL_CODE_REGEX.test(normalized.codigoPostalResponsable || '')) {
    errors.codigoPostalResponsable = 'codigoPostalResponsable debe tener 5 digitos'
  }

  if (!ALLOWED_SEXO.has(normalized.sexo || '')) {
    errors.sexo = 'sexo debe ser M, F u O'
  }

  if (!ALLOWED_TIPO_SANGRE.has(normalized.tipoSangre || '')) {
    errors.tipoSangre = 'tipoSangre debe ser A+, A-, B+, B-, AB+, AB-, O+ u O-'
  }

  const promedio = Number(normalized.promedioFinal)
  if (Number.isNaN(promedio) || promedio < 0 || promedio > 10) {
    errors.promedioFinal = 'promedioFinal debe estar entre 0 y 10'
  }

  const anioIngreso = Number(normalized.anioIngreso)
  if (!Number.isInteger(anioIngreso) || anioIngreso < 2000 || anioIngreso > currentYear) {
    errors.anioIngreso = `anioIngreso debe estar entre 2000 y ${currentYear}`
  }

  const anioEgreso = Number(normalized.anioEgreso)
  if (!Number.isInteger(anioEgreso) || anioEgreso < 1900 || anioEgreso > currentYear) {
    errors.anioEgreso = `anioEgreso debe estar entre 1900 y ${currentYear}`
  } else if (Number.isInteger(anioIngreso) && anioEgreso <= anioIngreso) {
    errors.anioEgreso = 'anioEgreso debe ser mayor a anioIngreso'
  }

  if (!ALLOWED_TIPO_ESCUELA.has(normalized.tipoEscuela || '')) {
    errors.tipoEscuela = 'tipoEscuela invalido'
  }

  if (!ALLOWED_AREA.has(normalized.areaConocimiento || '')) {
    errors.areaConocimiento = 'areaConocimiento invalido'
  }

  if (!ALLOWED_PARENTESCO.has(normalized.parentesco || '')) {
    errors.parentesco = 'parentesco invalido'
  }

  if (!ALLOWED_SERVICIO_MEDICO.has(normalized.servicioMedico || '')) {
    errors.servicioMedico = 'servicioMedico invalido'
  }

  if (normalized.servicioMedico !== 'Ninguno' && !isNonEmpty(normalized.numeroAfiliacion)) {
    errors.numeroAfiliacion = 'numeroAfiliacion es requerido cuando hay servicio medico'
  }

  if (!minLength(normalized.calle, 5)) {
    errors.calle = 'calle debe tener al menos 5 caracteres'
  }

  if (!minLength(normalized.colonia, 3)) {
    errors.colonia = 'colonia debe tener al menos 3 caracteres'
  }

  if (!minLength(normalized.municipio, 3)) {
    errors.municipio = 'municipio debe tener al menos 3 caracteres'
  }

  if (!minLength(normalized.calleResponsable, 5)) {
    errors.calleResponsable = 'calleResponsable debe tener al menos 5 caracteres'
  }

  if (!minLength(normalized.coloniaResponsable, 3)) {
    errors.coloniaResponsable = 'coloniaResponsable debe tener al menos 3 caracteres'
  }

  if (!minLength(normalized.municipioResponsable, 3)) {
    errors.municipioResponsable = 'municipioResponsable debe tener al menos 3 caracteres'
  }

  if (!minLength(normalized.lugarAplicacion, 3)) {
    errors.lugarAplicacion = 'lugarAplicacion debe tener al menos 3 caracteres'
  }

  if (normalized.esAfrodesc === true && !isNonEmpty(normalized.descendencia)) {
    errors.descendencia = 'descendencia es obligatoria cuando esAfrodesc es true'
  }

  if (normalized.esIndigena === true && !isNonEmpty(normalized.grupoEtnico)) {
    errors.grupoEtnico = 'grupoEtnico es obligatorio cuando esIndigena es true'
  }

  if (typeof normalized.esAfrodesc !== 'boolean') {
    errors.esAfrodesc = 'esAfrodesc debe ser booleano'
  }

  if (typeof normalized.esIndigena !== 'boolean') {
    errors.esIndigena = 'esIndigena debe ser booleano'
  }

  if (typeof normalized.consentimiento !== 'boolean') {
    errors.consentimiento = 'consentimiento debe ser booleano'
  } else if (normalized.consentimiento !== true) {
    errors.consentimiento = 'Debes aceptar el consentimiento para continuar'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}