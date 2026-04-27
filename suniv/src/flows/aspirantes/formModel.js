export const FORM_MODES = {
  ASPIRANTE: 'ASPIRANTE',
  INSCRIPCION: 'INSCRIPCION',
}

export const CAMPUS_OPTIONS = [
  { id: '6283ba78-af47-4291-ab87-4325310e866f', nombre: 'San Jacinto' },
  { id: 'bb10faf1-f21e-46bd-ba41-10c0e18bfc37', nombre: 'Juxtlahuaca' },
  { id: '72580bdf-db9c-48ae-a7c1-586d3d3fd8b8', nombre: 'Nopala' },
]

export const PROGRAM_OPTIONS = [
  { id: 'b30269e1-326c-4958-839a-d9d85003dc9e', nombre: 'Ingenieria en Desarrollo de Software', campusId: '6283ba78-af47-4291-ab87-4325310e866f' },
  { id: '74e3fab2-09d0-41b7-9d28-df51db13e2ff', nombre: 'Ingenieria en Sistemas Agroalimentarios', campusId: '6283ba78-af47-4291-ab87-4325310e866f' },
  { id: '7849c604-b532-4a93-8ef7-08fcfbefaf63', nombre: 'Licenciatura en Emprendimiento y Desarrollo de MyPyMES', campusId: '6283ba78-af47-4291-ab87-4325310e866f' },
  { id: '3b07059b-d73f-4a33-9bdd-21a175efbfa9', nombre: 'Ingenieria en Desarrollo de Software', campusId: 'bb10faf1-f21e-46bd-ba41-10c0e18bfc37' },
  { id: '555351d5-c47a-4dcd-a65b-6f6bc213e290', nombre: 'Ingenieria en Sistemas Agroalimentarios', campusId: 'bb10faf1-f21e-46bd-ba41-10c0e18bfc37' },
  { id: '05acab48-0809-4b35-8a91-b1b56cedfb15', nombre: 'Licenciatura en Emprendimiento y Desarrollo de MyPyMES', campusId: 'bb10faf1-f21e-46bd-ba41-10c0e18bfc37' },
  { id: '40d55454-898f-4052-ba81-301691828b92', nombre: 'Ingenieria en Desarrollo de Software', campusId: '72580bdf-db9c-48ae-a7c1-586d3d3fd8b8' },
  { id: 'dabd65df-cd32-47f0-8d56-e196b418ba38', nombre: 'Ingenieria en Sistemas Agroalimentarios', campusId: '72580bdf-db9c-48ae-a7c1-586d3d3fd8b8' },
  { id: 'de497e2a-1010-4123-adce-5f6899eefcea', nombre: 'Licenciatura en Emprendimiento y Desarrollo de MyPyMES', campusId: '72580bdf-db9c-48ae-a7c1-586d3d3fd8b8' },
]

export const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export const CURP_REGEX = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE_REGEX = /^\d{10}$/
export const POSTAL_CODE_REGEX = /^\d{5}$/

export const FORM_DEFAULT_VALUES = {
  campusId: '',
  carreraId: '',
  nombre: '',
  apellidoPaterno: '',
  apellidoMaterno: '',
  fechaNacimiento: '',
  sexo: '',
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
  esIndigena: false,
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
  calleResponsable: '',
  coloniaResponsable: '',
  municipioResponsable: '',
  estadoResponsable: '',
  codigoPostalResponsable: '',
  lugarAplicacion: '',
  consentimiento: false,
}

function trimStrings(values) {
  const normalized = { ...values }
  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === 'string') {
      normalized[key] = normalized[key].trim()
    }
  })
  return normalized
}

export function mergeWithDefaults(raw) {
  const merged = { ...FORM_DEFAULT_VALUES }

  Object.keys(FORM_DEFAULT_VALUES).forEach((key) => {
    const initial = FORM_DEFAULT_VALUES[key]
    const nextValue = raw?.[key]

    if (nextValue === undefined || nextValue === null) {
      return
    }

    if (typeof initial === 'boolean') {
      merged[key] = Boolean(nextValue)
      return
    }

    merged[key] = String(nextValue)
  })

  return merged
}

export function normalizeAspirantePayload(values) {
  const trimmed = trimStrings(values)

  return {
    ...trimmed,
    curp: trimmed.curp.toUpperCase(),
    anioIngreso: Number(trimmed.anioIngreso),
    anioEgreso: Number(trimmed.anioEgreso),
    promedioFinal: Number(trimmed.promedioFinal),
  }
}
