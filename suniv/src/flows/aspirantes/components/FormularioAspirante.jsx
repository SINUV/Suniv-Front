import { useEffect, useMemo, useState } from 'react'
import { useController, useForm, useWatch } from 'react-hook-form'
import {
  CAMPUS_OPTIONS,
  CURP_REGEX,
  EMAIL_REGEX,
  FORM_DEFAULT_VALUES,
  FORM_MODES,
  GUID_REGEX,
  PHONE_REGEX,
  POSTAL_CODE_REGEX,
  PROGRAM_OPTIONS,
  ONLY_LETTERS_REGEX,
  ONLY_NUMBERS_REGEX,
  YEAR_REGEX,
  mergeWithDefaults,
  normalizeAspirantePayload,
} from '../formModel'
import {
  cacheAspiranteSnapshot,
  getAllowedDocumentExtensions,
  submitAdmisionFormulario,
  submitInscripcionFormulario,
  uploadAdmisionDocumento,
} from '../../../services/admisionApi'
import './FormularioAspirante.css'

const MODE_UI = {
  [FORM_MODES.ASPIRANTE]: {
    title: 'Registro de aspirante',
    subtitle: 'Completa tus datos para iniciar tu proceso de admision.',
    submitLabel: 'Enviar solicitud de admision',
  },
  [FORM_MODES.INSCRIPCION]: {
    title: 'Formulario de inscripcion',
    subtitle: 'Confirma y envia nuevamente todos tus datos para completar la inscripcion.',
    submitLabel: 'Finalizar inscripcion',
  },
}

const INSCRIPCION_ONLY_FIELDS = {
  aceptoReglamento: false,
  autorizacionInformar: true,
}

const DOCUMENTS_CONFIG = [
  {
    key: 'actaNacimiento',
    title: 'Acta de nacimiento',
    envVar: 'VITE_DOC_ACTA_NACIMIENTO_ID',
    documentoId: import.meta.env.VITE_DOC_ACTA_NACIMIENTO_ID || '',
    defaultExtensions: ['.pdf'],
  },
  {
    key: 'certificadoBachillerato',
    title: 'Certificado de bachillerato',
    envVar: 'VITE_DOC_CERTIFICADO_BACHILLERATO_ID',
    documentoId: import.meta.env.VITE_DOC_CERTIFICADO_BACHILLERATO_ID || '',
    defaultExtensions: ['.pdf'],
  },
  {
    key: 'curpDocumento',
    title: 'CURP',
    envVar: 'VITE_DOC_CURP_ID',
    documentoId: import.meta.env.VITE_DOC_CURP_ID || '',
    defaultExtensions: ['.pdf', '.jpg', '.jpeg', '.png'],
  },
  {
    key: 'fotografiaAlumno',
    title: 'Fotografia del alumno',
    envVar: 'VITE_DOC_FOTOGRAFIA_ID',
    documentoId: import.meta.env.VITE_DOC_FOTOGRAFIA_ID || '',
    defaultExtensions: ['.jpg', '.jpeg', '.png'],
  },
]

const SECTION_CONFIG = [
  {
    id: 'persona',
    title: 'Persona',
    description: 'Datos personales, de identidad y contacto.',
    fields: [
      'campusId',
      'carreraId',
      'nombre',
      'apellidoPaterno',
      'apellidoMaterno',
      'fechaNacimiento',
      'sexo',
      'estadoCivil',
      'curp',
      'telefono',
      'correo',
      'calle',
      'numExt',
      'numInt',
      'colonia',
      'municipio',
      'estado',
      'codigoPostal',
    ],
  },
  {
    id: 'escolar',
    title: 'Escuela de procedencia',
    description: 'Datos de tu trayectoria academica previa.',
    fields: ['nombreEscuela', 'tipoEscuela', 'areaConocimiento', 'anioIngreso', 'anioEgreso', 'promedioFinal', 'medioEnterado'],
  },
  {
    id: 'salud',
    title: 'Salud e identidad',
    description: 'Informacion medica y de identidad sociocultural.',
    fields: [
      'tipoSangre',
      'enfermedades',
      'alergias',
      'medicamentosEspeciales',
      'servicioMedico',
      'numeroAfiliacion',
      'esIndigena',
      'lenguaIndigena',
      'grupoEtnico',
      'esAfrodesc',
      'descendencia',
    ],
  },
  {
    id: 'responsable',
    title: 'Responsable',
    description: 'Datos de contacto del responsable.',
    fields: [
      'nombreResponsable',
      'parentesco',
      'ocupacionResponsable',
      'telefonoResponsable',
      'calleResponsable',
      'coloniaResponsable',
      'municipioResponsable',
      'estadoResponsable',
      'codigoPostalResponsable',
    ],
  },
  {
    id: 'documentacion',
    title: 'Documentacion',
    description: 'Sube tus documentos obligatorios con el formato correcto.',
    fields: ['actaNacimiento', 'certificadoBachillerato', 'curpDocumento', 'fotografiaAlumno'],
  },
  {
    id: 'aplicacion',
    title: 'Consentimiento',
    description: 'Confirmacion final del proceso.',
    fields: [
      'consentimiento',
    ],
  },
]

const STEP_VISUALS = {
  persona: {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 12.75a5.25 5.25 0 1 0 0-10.5 5.25 5.25 0 0 0 0 10.5Zm0 2.25c-4.55 0-8.25 2.6-8.25 5.8 0 .52.42.95.95.95h14.6a.95.95 0 0 0 .95-.95c0-3.2-3.7-5.8-8.25-5.8Z" />
      </svg>
    ),
  },
  escolar: {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 3.6 2.7 8.25 12 12.9l7.2-3.6v5.14h1.5V8.25L12 3.6Zm-6.75 7.92v3.98c0 1.56 2.95 2.9 6.75 2.9s6.75-1.34 6.75-2.9v-3.98L12 14.9l-6.75-3.38Z" />
      </svg>
    ),
  },
  salud: {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9.5 4.5h5a1 1 0 0 1 1 1V8h2.5a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H15.5v2.5a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1V15H6a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h2.5V5.5a1 1 0 0 1 1-1Zm.5 5H6.5v4H10v3.5h4V13.5h3.5v-4H14V6h-4v3.5Z" />
      </svg>
    ),
  },
  responsable: {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M8.25 11.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Zm7.5 1.5a2.75 2.75 0 1 0 0-5.5 2.75 2.75 0 0 0 0 5.5ZM3.75 20.25c0-2.85 2.92-5.25 6.5-5.25s6.5 2.4 6.5 5.25c0 .41-.34.75-.75.75H4.5a.75.75 0 0 1-.75-.75Zm13.5.75a.75.75 0 0 1-.75-.75c0-1.55-.62-2.95-1.65-4.03 2.71.14 4.9 2 4.9 4.03a.75.75 0 0 1-.75.75h-1.75Z" />
      </svg>
    ),
  },
  documentacion: {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 3.75A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V10.5h-1.5V18a.75.75 0 0 1-.75.75H6A.75.75 0 0 1 5.25 18V6A.75.75 0 0 1 6 5.25h7.5v-1.5H6Zm9.22.53a.75.75 0 0 0-1.06 1.06l2.19 2.19H9.75a.75.75 0 0 0 0 1.5h6.6l-2.19 2.19a.75.75 0 0 0 1.06 1.06l3.47-3.47a.75.75 0 0 0 0-1.06l-3.47-3.47Z" />
      </svg>
    ),
  },
  aplicacion: {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 3.75A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V9.44a2.25 2.25 0 0 0-.66-1.59L16.4 4.66A2.25 2.25 0 0 0 14.81 4H6Zm0 1.5h8v3.5h3.5V18a.75.75 0 0 1-.75.75H6A.75.75 0 0 1 5.25 18V6A.75.75 0 0 1 6 5.25Zm7.93.31 2.01 2.01h-2.01V5.56Zm-1.5 5.44a.75.75 0 0 1 .75.75V13h1.25a.75.75 0 0 1 0 1.5h-1.25v1.25a.75.75 0 0 1-1.5 0V14.5H10.5a.75.75 0 0 1 0-1.5h1.18v-1.25a.75.75 0 0 1 .75-.75Z" />
      </svg>
    ),
  },
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const ESTADO_CIVIL_OPTIONS = ['Soltero', 'Casado', 'UnionLibre', 'Divorciado', 'Viudo']

const FIELD_META = {
  campusId: { label: 'Campus', type: 'select', required: true, asButtonGroup: true },
  carreraId: { label: 'Carrera', type: 'select', required: true, asButtonGroup: true, buttonGroupStacked: true },
  nombre: { label: 'Nombre(s)', required: true, disallowDigits: true },
  apellidoPaterno: { label: 'Apellido paterno', required: true, disallowDigits: true },
  apellidoMaterno: { label: 'Apellido materno', required: true, disallowDigits: true },
  fechaNacimiento: { label: 'Fecha de nacimiento', type: 'date', required: true },
  sexo: { label: 'Sexo', type: 'select', required: true, asButtonGroup: true },
  estadoCivil: { label: 'Estado civil', type: 'select', required: true },
  curp: { label: 'CURP', required: true, transformUppercase: true },
  telefono: { label: 'Telefono', required: true, onlyDigits: 10 },
  correo: { label: 'Correo', type: 'email', required: true },
  calle: { label: 'Calle', required: true },
  numExt: { label: 'Numero exterior', required: true },
  numInt: { label: 'Numero interior' },
  colonia: { label: 'Colonia', required: true },
  municipio: { label: 'Municipio', required: true },
  estado: { label: 'Estado', required: true },
  codigoPostal: { label: 'Codigo postal', required: true, onlyDigits: 5 },
  nombreEscuela: { label: 'Nombre escuela de procedencia', required: true },
  tipoEscuela: { label: 'Tipo de escuela', type: 'select', required: true, asButtonGroup: true },
  areaConocimiento: { label: 'Area de conocimiento', required: true },
  anioIngreso: { label: 'Año ingreso', type: 'number', required: true },
  anioEgreso: { label: 'Año egreso', type: 'number', required: true },
  promedioFinal: { label: 'Promedio final', type: 'number', required: true, step: '0.1' },
  medioEnterado: { label: 'Como se entero', required: true },
  tipoSangre: { label: 'Tipo de sangre', type: 'select', required: true, asButtonGroup: true },
  enfermedades: { label: 'Enfermedades' },
  alergias: { label: 'Alergias' },
  medicamentosEspeciales: { label: 'Medicamentos especiales' },
  servicioMedico: { label: 'Servicio medico', asButtonGroup: true },
  numeroAfiliacion: { label: 'Numero de afiliacion' },
  lenguaIndigena: { label: 'Lengua indigena' },
  grupoEtnico: { label: 'Grupo etnico' },
  esAfrodesc: { label: 'Se identifica como afrodescendiente', asButtonGroup: true },
  esIndigena: { label: 'Se identifica como persona indigena', asButtonGroup: true },
  descendencia: { label: 'Descendencia' },
  nombreResponsable: { label: 'Nombre del responsable', required: true },
  parentesco: { label: 'Parentesco', required: true },
  ocupacionResponsable: { label: 'Ocupacion del responsable' },
  telefonoResponsable: { label: 'Telefono del responsable', required: true, onlyDigits: 10 },
  calleResponsable: { label: 'Calle del responsable', required: true },
  coloniaResponsable: { label: 'Colonia del responsable', required: true },
  municipioResponsable: { label: 'Municipio del responsable', required: true },
  estadoResponsable: { label: 'Estado del responsable', required: true },
  codigoPostalResponsable: { label: 'Codigo postal del responsable', required: true, onlyDigits: 5 },
  lugarAplicacion: {
    label: 'Campus donde deseas presentar evaluacion',
    type: 'select',
    required: false,
  },
  consentimiento: { label: 'Acepto el tratamiento de datos', type: 'checkbox', required: true },
}

function getFieldRules(fieldName, getValues) {
  const currentYear = new Date().getFullYear()

  // CAMPOS QUE NO PERMITEN NÚMEROS (solo texto)
  const textOnlyFields = [
    'nombre',
    'apellidoPaterno',
    'apellidoMaterno',
    'areaConocimiento',
    'calle',
    'colonia',
    'municipio',
    'estado',
    'medioEnterado',
    'grupoEtnico',
    'lenguaIndigena',
    'nombreResponsable',
    'parentesco',
    'ocupacionResponsable',
    'calleResponsable',
    'coloniaResponsable',
    'municipioResponsable',
    'estadoResponsable',
    'descendencia',
    'enfermedades',
    'alergias',
    'medicamentosEspeciales',
  ]

  // CAMPOS QUE SOLO PERMITEN NÚMEROS
  const numberOnlyFields = [
    'telefono',
    'telefonoResponsable',
    'codigoPostal',
    'codigoPostalResponsable',
    'anioIngreso',
    'anioEgreso',
  ]

  // Validación para campos de texto solamente
  if (textOnlyFields.includes(fieldName)) {
    if (fieldName === 'nombre' || fieldName === 'apellidoPaterno' || fieldName === 'apellidoMaterno') {
      return {
        required: 'Este campo es obligatorio.',
        validate: (value) => {
          if (!value) return true
          if (/\d/.test(String(value || ''))) return 'No se permiten números en este campo.'
          return true
        },
      }
    }
    if (fieldName === 'medioEnterado') {
      return {
        required: 'Este campo es obligatorio.',
        validate: (value) => {
          if (!value) return true
          if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.-]/.test(String(value || ''))) return 'Solo se permiten letras, espacios y puntuación básica.'
          return true
        },
      }
    }
    if (fieldName === 'descendencia') {
      return {
        required: FIELD_META[fieldName]?.required ? 'Este campo es obligatorio.' : undefined,
        validate: (value) => {
          if (!value) return true
          if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.-]/.test(String(value || ''))) return 'No se permiten caracteres extraños.'
          return true
        },
      }
    }
    if (
      fieldName === 'nombreResponsable' ||
      fieldName === 'parentesco' ||
      fieldName === 'ocupacionResponsable' ||
      fieldName === 'calleResponsable' ||
      fieldName === 'coloniaResponsable' ||
      fieldName === 'municipioResponsable' ||
      fieldName === 'estadoResponsable'
    ) {
      return {
        required: FIELD_META[fieldName]?.required ? 'Este campo es obligatorio.' : undefined,
        validate: (value) => {
          if (!value) return true
          if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.-]/.test(String(value || ''))) return 'No se permiten caracteres extraños.'
          return true
        },
      }
    }
    // Otros campos de texto
    return {
      required: FIELD_META[fieldName]?.required ? 'Este campo es obligatorio.' : undefined,
      validate: (value) => {
        if (!value) return true
        if (/\d/.test(String(value || ''))) return 'No se permiten números en este campo.'
        return true
      },
    }
  }

  // Validación para campos numéricos solamente
  if (numberOnlyFields.includes(fieldName)) {
    if (fieldName === 'telefono' || fieldName === 'telefonoResponsable') {
      return {
        required: 'El teléfono es obligatorio.',
        pattern: {
          value: PHONE_REGEX,
          message: 'Teléfono inválido. Debe tener exactamente 10 dígitos.',
        },
        validate: (value) => {
          if (!value) return true
          if (!/^\d{10}$/.test(value)) return 'Solo números permitidos (10 dígitos).'
          return true
        },
      }
    }
    if (fieldName === 'codigoPostal' || fieldName === 'codigoPostalResponsable') {
      return {
        required: 'El código postal es obligatorio.',
        pattern: {
          value: POSTAL_CODE_REGEX,
          message: 'Código postal inválido. Debe tener exactamente 5 dígitos.',
        },
        validate: (value) => {
          if (!value) return true
          if (!/^\d{5}$/.test(value)) return 'Solo números permitidos (5 dígitos).'
          return true
        },
      }
    }
    if (fieldName === 'anioIngreso') {
      return {
        required: 'Este campo es obligatorio.',
        min: { value: 1900, message: 'Ingresa un año válido (desde 1900).' },
        max: { value: currentYear, message: `El año no puede ser mayor a ${currentYear}.` },
        validate: (value) => {
          const ingreso = Number(value)
          const egresoRaw = getValues?.('anioEgreso')
          const egreso = Number(egresoRaw)

          if (!value) return true
          if (!/^\d{4}$/.test(String(value))) return 'Debe ser un año de 4 dígitos.'
          if (egresoRaw && !Number.isNaN(egreso) && ingreso > egreso) {
            return 'El año de ingreso no puede ser mayor al año de egreso.'
          }

          return true
        },
      }
    }
    if (fieldName === 'anioEgreso') {
      return {
        required: 'Este campo es obligatorio.',
        min: { value: 1900, message: 'Ingresa un año válido (desde 1900).' },
        max: { value: currentYear, message: `El año no puede ser mayor a ${currentYear}.` },
        validate: (value) => {
          const egreso = Number(value)
          const ingresoRaw = getValues?.('anioIngreso')
          const ingreso = Number(ingresoRaw)

          if (!value) return true
          if (!/^\d{4}$/.test(String(value))) return 'Debe ser un año de 4 dígitos.'
          if (ingresoRaw && !Number.isNaN(ingreso) && egreso < ingreso) {
            return 'El año de egreso no puede ser menor al año de ingreso.'
          }

          return true
        },
      }
    }
  }

  switch (fieldName) {
    case 'campusId':
      return {
        required: 'Selecciona un campus.',
        validate: (value) => GUID_REGEX.test(value) || 'Campus inválido.',
      }
    case 'carreraId':
      return {
        required: 'Selecciona una carrera.',
        validate: (value) => GUID_REGEX.test(value) || 'Carrera inválida.',
      }
    case 'fechaNacimiento':
      return {
        required: 'La fecha de nacimiento es obligatoria.',
        validate: (value) => {
          const parsedDate = new Date(value)
          if (Number.isNaN(parsedDate.getTime())) return 'Fecha de nacimiento inválida.'

          const now = new Date()
          if (parsedDate > now) return 'La fecha de nacimiento no puede ser futura.'

          let age = now.getFullYear() - parsedDate.getFullYear()
          const hasHadBirthdayThisYear =
            now.getMonth() > parsedDate.getMonth() ||
            (now.getMonth() === parsedDate.getMonth() && now.getDate() >= parsedDate.getDate())

          if (!hasHadBirthdayThisYear) age -= 1

          if (age < 14) return 'La edad mínima permitida es 14 años.'
          if (age > 80) return 'Verifica la edad: parece fuera del rango esperado.'

          return true
        },
      }
    case 'sexo':
      return {
        required: 'Selecciona una opción de sexo.',
        validate: (value) =>
          ['M', 'F', 'Masculino', 'Femenino'].includes(String(value || '').trim()) ||
          'Selecciona una opción válida de sexo.',
      }
    case 'estadoCivil':
      return {
        required: 'Selecciona una opción de estado civil.',
        validate: (value) =>
          ESTADO_CIVIL_OPTIONS.includes(String(value || '').trim()) ||
          'Selecciona una opción válida de estado civil.',
      }
    case 'curp':
      return {
        required: 'La CURP es obligatoria.',
        validate: (value) => {
          const normalizedCurp = String(value || '').toUpperCase().trim()

          if (!CURP_REGEX.test(normalizedCurp)) {
            return 'CURP inválida. Verifica el formato (18 caracteres).'
          }

          return true
        },
      }
    case 'correo':
      return {
        required: 'El correo es obligatorio.',
        pattern: { value: EMAIL_REGEX, message: 'Correo inválido.' },
      }
    case 'promedioFinal':
      return {
        required: 'El promedio es obligatorio.',
        validate: (value) => {
          if (!value) return true
          const num = parseFloat(value)
          if (isNaN(num)) return 'Debe ser un número.'
          if (num < 1 || num > 10) return 'Entre 1 y 10.'
          return true
        },
      }
    case 'consentimiento':
      return {
        validate: (value) => Boolean(value) || 'Debes aceptar el consentimiento.',
      }
    case 'aceptoReglamento':
      return {
        validate: (value) => Boolean(value) || 'Debes aceptar el reglamento para inscribirte.',
      }
    default:
      return FIELD_META[fieldName]?.required ? { required: 'Este campo es obligatorio.' } : {}
  }
}

function sanitizeInputValue(event, field, fieldName) {
  // CAMPOS QUE NO PERMITEN NÚMEROS (solo texto)
  const textOnlyFields = [
    'nombre',
    'apellidoPaterno',
    'apellidoMaterno',
    'areaConocimiento',
    'calle',
    'colonia',
    'municipio',
    'estado',
    'medioEnterado',
    'grupoEtnico',
    'lenguaIndigena',
    'nombreResponsable',
    'parentesco',
    'ocupacionResponsable',
    'calleResponsable',
    'coloniaResponsable',
    'municipioResponsable',
    'estadoResponsable',
    'descendencia',
    'enfermedades',
    'alergias',
    'medicamentosEspeciales',
  ]

  // CAMPOS QUE SOLO PERMITEN NÚMEROS
  const numberOnlyFields = [
    'telefono',
    'telefonoResponsable',
    'codigoPostal',
    'codigoPostalResponsable',
    'numExt',
  ]

  // Remover números en campos de texto
  if (textOnlyFields.includes(fieldName)) {
    event.target.value = event.target.value.replace(/\d/g, '')
  }

  // medioEnterado: solo letras, espacios y puntuacion basica (sin caracteres especiales)
  if (fieldName === 'medioEnterado') {
    event.target.value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.-]/g, '')
  }

  // descendencia: solo letras, espacios y puntuacion basica (sin caracteres especiales)
  if (fieldName === 'descendencia') {
    event.target.value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.-]/g, '')
  }

  // Campos del responsable: sin caracteres extraños
  if (
    fieldName === 'nombreResponsable' ||
    fieldName === 'parentesco' ||
    fieldName === 'ocupacionResponsable' ||
    fieldName === 'calleResponsable' ||
    fieldName === 'coloniaResponsable' ||
    fieldName === 'municipioResponsable' ||
    fieldName === 'estadoResponsable'
  ) {
    event.target.value = event.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s,.-]/g, '')
  }

  // Remover caracteres no numéricos en campos de números
  if (numberOnlyFields.includes(fieldName)) {
    event.target.value = event.target.value.replace(/\D/g, '')
    
    // Aplicar límites de dígitos
    if (fieldName === 'telefono' || fieldName === 'telefonoResponsable') {
      event.target.value = event.target.value.slice(0, 10)
    }
    if (fieldName === 'codigoPostal' || fieldName === 'codigoPostalResponsable') {
      event.target.value = event.target.value.slice(0, 5)
    }
  }

  // Transformar CURP a mayúsculas
  if (fieldName === 'curp') {
    event.target.value = event.target.value.toUpperCase().replace(/\s+/g, '')
  }

  // Años: solo números, máximo 4 dígitos
  if (fieldName === 'anioIngreso' || fieldName === 'anioEgreso') {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, 4)
  }

  // Promedio: solo números y punto decimal
  if (fieldName === 'promedioFinal') {
    // Permite dígitos y punto
    let value = event.target.value.replace(/[^\d.]/g, '')
    
    // Si hay múltiples puntos, mantén solo el primero
    const dotIndex = value.indexOf('.')
    if (dotIndex !== -1) {
      value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/\./g, '')
    }
    
    event.target.value = value
  }
}

function SelectField({ fieldName, register, campusId, getValues, inputClassName, ariaInvalid }) {
  if (fieldName === 'campusId') {
    return (
      <select
        id={fieldName}
        className={inputClassName}
        aria-invalid={ariaInvalid}
        {...register(fieldName, getFieldRules(fieldName, getValues))}
      >
        <option value="">Selecciona una opcion</option>
        {CAMPUS_OPTIONS.map((campus) => (
          <option key={campus.id} value={campus.id}>
            {campus.nombre}
          </option>
        ))}
      </select>
    )
  }

  if (fieldName === 'carreraId') {
    const programOptions = PROGRAM_OPTIONS.filter((program) => campusId && program.campusId === campusId)

    return (
      <select
        id={fieldName}
        className={inputClassName}
        aria-invalid={ariaInvalid}
        disabled={!campusId}
        {...register(fieldName, getFieldRules(fieldName, getValues))}
      >
        <option value="">{campusId ? 'Selecciona una opcion' : 'Primero selecciona un campus'}</option>
        {programOptions.map((program) => (
          <option key={program.id} value={program.id}>
            {program.nombre}
          </option>
        ))}
      </select>
    )
  }

  if (fieldName === 'sexo') {
    return (
      <select
        id={fieldName}
        className={inputClassName}
        aria-invalid={ariaInvalid}
        {...register(fieldName, getFieldRules(fieldName, getValues))}
      >
        <option value="">Selecciona una opcion</option>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
      </select>
    )
  }

  if (fieldName === 'estadoCivil') {
    return (
      <select
        id={fieldName}
        className={inputClassName}
        aria-invalid={ariaInvalid}
        {...register(fieldName, getFieldRules(fieldName, getValues))}
      >
        <option value="">Selecciona una opcion</option>
        <option value="Soltero">Soltero(a)</option>
        <option value="Casado">Casado(a)</option>
        <option value="UnionLibre">Union libre</option>
        <option value="Divorciado">Divorciado(a)</option>
        <option value="Viudo">Viudo(a)</option>
      </select>
    )
  }

  if (fieldName === 'tipoEscuela') {
    return (
      <select
        id={fieldName}
        className={inputClassName}
        aria-invalid={ariaInvalid}
        {...register(fieldName, getFieldRules(fieldName, getValues))}
      >
        <option value="">Selecciona una opcion</option>
        <option value="Publica">Publica</option>
        <option value="Privada">Privada</option>
      </select>
    )
  }

  if (fieldName === 'lugarAplicacion') {
    return (
      <select
        id={fieldName}
        className={inputClassName}
        aria-invalid={ariaInvalid}
        {...register(fieldName, getFieldRules(fieldName, getValues))}
      >
        <option value="">Selecciona un campus</option>
        {CAMPUS_OPTIONS.map((campus) => (
          <option key={campus.id} value={campus.nombre}>
            {campus.nombre}
          </option>
        ))}
      </select>
    )
  }

  return (
    <select
      id={fieldName}
      className={inputClassName}
      aria-invalid={ariaInvalid}
      {...register(fieldName, getFieldRules(fieldName, getValues))}
    >
      {BLOOD_TYPES.map((blood) => (
        <option key={blood} value={blood}>
          {blood}
        </option>
      ))}
    </select>
  )
}

function getButtonGroupOptions(fieldName, campusId) {
  if (fieldName === 'campusId') {
    return CAMPUS_OPTIONS.map((c) => ({ value: c.id, label: c.nombre }))
  }
  if (fieldName === 'carreraId') {
    return PROGRAM_OPTIONS
      .filter((p) => campusId && p.campusId === campusId)
      .map((p) => ({ value: p.id, label: p.nombre }))
  }
  if (fieldName === 'sexo') {
    return [
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Femenino' },
    ]
  }
  if (fieldName === 'tipoEscuela') {
    return [
      { value: 'Publica', label: 'Pública' },
      { value: 'Privada', label: 'Privada' },
    ]
  }
  if (fieldName === 'tipoSangre') {
    return BLOOD_TYPES.map((blood) => ({ value: blood, label: blood }))
  }
  if (fieldName === 'servicioMedico') {
    return [
      { value: 'IMSS', label: 'IMSS' },
      { value: 'ISSSTE', label: 'ISSSTE' },
      { value: 'INSABI', label: 'INSABI' },
      { value: 'Privado', label: 'Privado' },
      { value: 'Ninguno', label: 'Ninguno' },
    ]
  }
  if (fieldName === 'esAfrodesc' || fieldName === 'esIndigena') {
    return [
      { value: true, label: 'Sí' },
      { value: false, label: 'No' },
    ]
  }
  return []
}

function ButtonGroupField({ fieldName, options, control, rules, disabled = false, stacked = false }) {
  const { field } = useController({ name: fieldName, control, rules })
  return (
    <div
      className={`asp-form__btn-group${stacked ? ' asp-form__btn-group--stacked' : ''}`}
      role="group"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`asp-form__btn-opt${field.value === opt.value ? ' is-selected' : ''}`}
          onClick={() => field.onChange(opt.value)}
          aria-pressed={field.value === opt.value}
          disabled={disabled}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

function getFileExtension(fileName) {
  const parts = String(fileName || '').toLowerCase().split('.')
  if (parts.length < 2) return ''
  return `.${parts.pop()}`
}

function formatExtensions(extensions) {
  return extensions.map((ext) => ext.replace('.', '').toUpperCase()).join(', ')
}

function getDraftStorageKey(mode, folio) {
  const safeFolio = String(folio || '').trim() || 'sin-folio'
  return `suniv_form_draft_${mode}_${safeFolio}`
}

export default function FormularioAspirante({
  mode = FORM_MODES.ASPIRANTE,
  aspiranteId = '',
  folio = '',
  initialData,
  isLoadingInitialData = false,
  onSuccess,
}) {
  const [submitError, setSubmitError] = useState('')
  const [submitOkMessage, setSubmitOkMessage] = useState('')
  const [documentRules, setDocumentRules] = useState(() => {
    return DOCUMENTS_CONFIG.reduce((acc, doc) => {
      acc[doc.key] = {
        ...doc,
        isConfigured: GUID_REGEX.test(String(doc.documentoId || '').trim()),
        allowedExtensions: doc.defaultExtensions,
      }
      return acc
    }, {})
  })
  const [uploadedDocuments, setUploadedDocuments] = useState({})
  const safeAspiranteId = String(aspiranteId || '').trim()
  const canUploadDocuments = GUID_REGEX.test(safeAspiranteId)

  const ui = MODE_UI[mode]
  const defaultValues = useMemo(() => {
    const merged = mergeWithDefaults(initialData || FORM_DEFAULT_VALUES)

    if (mode === FORM_MODES.INSCRIPCION) {
      return {
        ...merged,
        ...INSCRIPCION_ONLY_FIELDS,
        aceptoReglamento: Boolean(initialData?.aceptoReglamento),
        autorizacionInformar:
          initialData?.autorizacionInformar === undefined
            ? INSCRIPCION_ONLY_FIELDS.autorizacionInformar
            : Boolean(initialData.autorizacionInformar),
      }
    }

    return merged
  }, [initialData, mode])

  const {
    register,
    reset,
    handleSubmit,
    control,
    watch,
    trigger,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues })

  const [currentStep, setCurrentStep] = useState(0)
  const stepCount = SECTION_CONFIG.length
  const isLastStep = currentStep === stepCount - 1
  const progressPercent = stepCount > 1 ? Math.round((currentStep / (stepCount - 1)) * 100) : 100

  const campusId = useWatch({ control, name: 'campusId' })
  const selectedCareer = useWatch({ control, name: 'carreraId' })
  const watchedCurp = useWatch({ control, name: 'curp' })
  const watchedFechaNacimiento = useWatch({ control, name: 'fechaNacimiento' })
  const draftStorageKey = useMemo(() => getDraftStorageKey(mode, folio), [mode, folio])
  const watchedFormValues = watch()

  function extractAspiranteIdFromResponse(source) {
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

  useEffect(() => {
    let nextValues = defaultValues

    try {
      const raw = localStorage.getItem(draftStorageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          nextValues = {
            ...defaultValues,
            ...parsed,
          }
        }
      }
    } catch (error) {
      console.warn('[FormDraftRestoreError]', { draftStorageKey, error })
    }

    reset(nextValues)
  }, [defaultValues, draftStorageKey, reset])

  useEffect(() => {
    try {
      localStorage.setItem(draftStorageKey, JSON.stringify(watchedFormValues || {}))
    } catch (error) {
      console.warn('[FormDraftSaveError]', { draftStorageKey, error })
    }
  }, [watchedFormValues, draftStorageKey])

  useEffect(() => {
    if (!campusId) {
      return
    }

    const isCareerValid = PROGRAM_OPTIONS.some(
      (program) => program.id === selectedCareer && program.campusId === campusId,
    )

    if (!isCareerValid) {
      setValue('carreraId', '')
    }

    const campusSeleccionado = CAMPUS_OPTIONS.find((c) => c.id === campusId)
    if (campusSeleccionado) {
      setValue('lugarAplicacion', campusSeleccionado.nombre, { shouldValidate: false })
    }
  }, [campusId, selectedCareer, setValue])

  useEffect(() => {
    if (!watchedCurp && !watchedFechaNacimiento) return
    trigger(['curp', 'fechaNacimiento'])
  }, [watchedCurp, watchedFechaNacimiento, trigger])

  useEffect(() => {
    let alive = true

    async function loadExtensions() {
      const entries = await Promise.all(
        DOCUMENTS_CONFIG.map(async (doc) => {
          const isConfigured = GUID_REGEX.test(String(doc.documentoId || '').trim())
          if (!isConfigured) {
            return [doc.key, { ...doc, isConfigured, allowedExtensions: doc.defaultExtensions }]
          }

          try {
            const backendExtensions = await getAllowedDocumentExtensions(doc.documentoId)
            return [
              doc.key,
              {
                ...doc,
                isConfigured,
                allowedExtensions: backendExtensions.length ? backendExtensions : doc.defaultExtensions,
              },
            ]
          } catch {
            return [doc.key, { ...doc, isConfigured, allowedExtensions: doc.defaultExtensions }]
          }
        }),
      )

      if (!alive) return
      setDocumentRules(Object.fromEntries(entries))
    }

    loadExtensions()

    return () => {
      alive = false
    }
  }, [])

  const uploadDocumentNow = async (docKey, file, aspiranteIdToUse = safeAspiranteId) => {
    const rule = documentRules[docKey]
    if (!rule || !file) return { ok: false }

    if (!rule.isConfigured) {
      return { ok: false, reason: 'missing-doc-config' }
    }

    if (!GUID_REGEX.test(String(aspiranteIdToUse || '').trim())) {
      setSubmitError('No pudimos subir tus documentos en este momento. Intenta de nuevo.')
      return { ok: false, reason: 'missing-aspirante-id' }
    }

    const extension = getFileExtension(file.name)
    const allowed = rule.allowedExtensions.map((ext) => String(ext || '').toLowerCase())
    if (!allowed.includes(extension)) {
      setUploadedDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'error',
          name: file.name,
          message: `Archivo no permitido. Extensiones validas: ${formatExtensions(rule.allowedExtensions)}.`,
          url: '',
        },
      }))
      return { ok: false, reason: 'invalid-extension' }
    }

    setUploadedDocuments((prev) => ({
      ...prev,
      [docKey]: { status: 'uploading', name: file.name, message: '', url: '' },
    }))

    try {
      const url = await uploadAdmisionDocumento({
        aspiranteId: aspiranteIdToUse,
        documentoId: rule.documentoId,
        file,
      })

      setUploadedDocuments((prev) => ({
        ...prev,
        [docKey]: { status: 'uploaded', name: file.name, message: 'Documento cargado correctamente.', url },
      }))
      return { ok: true }
    } catch (error) {
      setUploadedDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'error',
          name: file.name,
          message: 'No se pudo subir el documento. Intenta nuevamente.',
          url: '',
        },
      }))
      setSubmitError('No pudimos subir uno de tus documentos. Intenta nuevamente.')
      return { ok: false, reason: 'upload-failed' }
    }
  }

  const handleDocumentSelection = async (docKey, file) => {
    const rule = documentRules[docKey]
    if (!rule || !file) return

    const extension = getFileExtension(file.name)
    const allowed = rule.allowedExtensions.map((ext) => String(ext || '').toLowerCase())
    if (!allowed.includes(extension)) {
      setUploadedDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'error',
          name: file.name,
          file,
          message: `Archivo no permitido. Extensiones validas: ${formatExtensions(rule.allowedExtensions)}.`,
          url: '',
        },
      }))
      return
    }

    if (!rule.isConfigured) {
      setUploadedDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'ready',
          name: file.name,
          file,
          message: 'Archivo seleccionado. Se intentara subir al enviar.',
          url: '',
        },
      }))
      return
    }

    if (!canUploadDocuments) {
      setUploadedDocuments((prev) => ({
        ...prev,
        [docKey]: {
          status: 'ready',
          name: file.name,
          file,
          message: 'Archivo seleccionado. Se subira automaticamente al enviar tu solicitud.',
          url: '',
        },
      }))
      return
    }

    await uploadDocumentNow(docKey, file)
  }

  const validateDocumentStep = () => {
    const missingDocs = DOCUMENTS_CONFIG.filter((doc) => {
      const current = uploadedDocuments[doc.key]
      return !current?.url && !current?.file
    })
    if (missingDocs.length > 0) {
      setSubmitError('Sube los cuatro documentos obligatorios antes de continuar.')
      return false
    }

    return true
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')
    setSubmitOkMessage('')

    try {
      const payload = normalizeAspirantePayload(values)
      console.log('[SUNIV] Payload enviado al backend:', JSON.stringify(payload, null, 2))
      const result =
        mode === FORM_MODES.ASPIRANTE
          ? await submitAdmisionFormulario(payload)
          : await submitInscripcionFormulario({
              folio,
              ...payload,
              aceptoReglamento: Boolean(values.aceptoReglamento),
              autorizacionInformar: Boolean(values.autorizacionInformar),
            })

      const backendData = result?.data?.data || result?.data || {}
      const responseFolio = backendData.folio || folio
      const responseAspiranteId = extractAspiranteIdFromResponse(backendData) || safeAspiranteId
      console.log('[SUNIV] AspiranteId extraído de respuesta:', responseAspiranteId, 'BackendData:', backendData)

      if (!GUID_REGEX.test(String(responseAspiranteId || '').trim())) {
        console.error('[SUNIV] AspiranteId inválido o no encontrado:', responseAspiranteId)
        setSubmitError('No se pudo obtener un ID de aspirante valido para subir tus documentos.')
        return
      }
      console.log('[SUNIV] AspiranteId válido. Iniciando subida de documentos:', responseAspiranteId)

      const pendingDocs = DOCUMENTS_CONFIG
        .map((doc) => ({ key: doc.key, file: uploadedDocuments[doc.key]?.file, hasUrl: Boolean(uploadedDocuments[doc.key]?.url) }))
        .filter((doc) => doc.file && !doc.hasUrl)

      for (const doc of pendingDocs) {
        const uploadResult = await uploadDocumentNow(doc.key, doc.file, responseAspiranteId)
        if (!uploadResult?.ok) {
          if (uploadResult?.reason === 'missing-doc-config') {
            continue
          }
          return
        }
      }

      const message =
        mode === FORM_MODES.ASPIRANTE
          ? `Registro enviado correctamente. Folio: ${responseFolio || 'sin folio en respuesta'}.`
          : `Inscripcion enviada correctamente para folio ${responseFolio}.`

      if (mode === FORM_MODES.ASPIRANTE && responseFolio) {
        cacheAspiranteSnapshot(responseFolio, payload)
      }

      // Evita mostrar error y exito a la vez si hubo documentos pendientes sin configuracion.
      setSubmitError('')

      try {
        localStorage.removeItem(draftStorageKey)
      } catch (error) {
        console.warn('[FormDraftClearError]', { draftStorageKey, error })
      }

      setSubmitOkMessage(message)
      onSuccess?.({ mode, folio: responseFolio, backend: result })
    } catch (error) {
      const errorMsg = error?.message || 'Ocurrio un error al enviar el formulario. Por favor intenta de nuevo.'
      setSubmitError(errorMsg)
    }
  })

  return (
    <section className="asp-form" aria-label={ui.title}>
      <header className="asp-form__header">
        <p className="eyebrow">{mode === FORM_MODES.ASPIRANTE ? 'Modo aspirante' : 'Modo inscripcion'}</p>
        <h2>{ui.title}</h2>
        <p>{ui.subtitle}</p>
        {mode === FORM_MODES.INSCRIPCION && <p className="asp-form__folio">Folio: {folio}</p>}
      </header>

      {isLoadingInitialData && mode === FORM_MODES.INSCRIPCION && (
        <p className="asp-form__loading">Cargando datos del aspirante...</p>
      )}

      {/* Stepper */}
      <div className="asp-form__stepper" role="tablist" aria-label="Progreso del formulario">
        <div className="asp-form__progress" aria-hidden="true">
          <span className="asp-form__progress-track" />
          <span className="asp-form__progress-value" style={{ width: `${progressPercent}%` }} />
          <span className="asp-form__progress-text">Progreso: {progressPercent}%</span>
        </div>
        {SECTION_CONFIG.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            className={`asp-form__stepper-item ${idx === currentStep ? 'is-active' : ''} ${idx < currentStep ? 'is-complete' : ''}`}
            onClick={() => setCurrentStep(idx)}
            aria-current={idx === currentStep ? 'step' : undefined}
          >
            <span className="step-index">{String(idx + 1).padStart(2, '0')}</span>
            <span className="step-icon" aria-hidden="true">{STEP_VISUALS[s.id]?.icon}</span>
            <span className="step-meta">
              <span className="step-title">{s.title}</span>
              <span className="step-state">{idx < currentStep ? 'Completado' : idx === currentStep ? 'En curso' : 'Pendiente'}</span>
            </span>
          </button>
        ))}
      </div>

      <form className="asp-form__body" onSubmit={(e) => e.preventDefault()} noValidate>
        {SECTION_CONFIG.map((section, idx) => (
          <fieldset
            key={section.id}
            className="asp-form__section"
            style={{ display: idx === currentStep ? 'block' : 'none' }}
            aria-hidden={idx === currentStep ? 'false' : 'true'}
          >
            <legend>{section.title}</legend>
            <p className="asp-form__section-help">
              Paso {String(idx + 1).padStart(2, '0')} de {String(stepCount).padStart(2, '0')} - {section.description}
            </p>

            {section.id === 'documentacion' ? (
              <div className="asp-form__docs-grid">
                {DOCUMENTS_CONFIG.map((doc) => {
                  const rule = documentRules[doc.key] || doc
                  const upload = uploadedDocuments[doc.key]
                  const accept = (rule.allowedExtensions || doc.defaultExtensions || []).join(',')
                  const status = upload?.status || 'idle'

                  return (
                    <article key={doc.key} className={`asp-form__doc-card is-${status}`}>
                      <header className="asp-form__doc-card-head">
                        <h4>{doc.title}</h4>
                        <span className={`asp-form__doc-chip is-${status}`}>
                          {status === 'uploaded' ? 'Cargado' : status === 'uploading' ? 'Subiendo...' : status === 'error' ? 'Error' : 'Pendiente'}
                        </span>
                      </header>

                      <p className="asp-form__doc-accept">Acepta: {formatExtensions(rule.allowedExtensions || doc.defaultExtensions)}</p>

                      <input
                        type="file"
                        className="asp-form__doc-input"
                        accept={accept}
                        disabled={isSubmitting || isLoadingInitialData}
                        onChange={async (event) => {
                          const file = event.target.files?.[0]
                          if (!file) return
                          handleDocumentSelection(doc.key, file)
                        }}
                      />

                      {upload?.name && <p className="asp-form__doc-name">Archivo: {upload.name}</p>}
                      {upload?.message && <p className="asp-form__doc-message">{upload.message}</p>}
                    </article>
                  )
                })}

                {!canUploadDocuments && mode === FORM_MODES.ASPIRANTE && (
                  <p className="asp-form__doc-note">
                    Puedes seleccionar tus documentos ahora. Se subiran automaticamente al enviar tu solicitud.
                  </p>
                )}
              </div>
            ) : (
              <div className="asp-form__grid">
                {section.fields.map((fieldName) => {
                  const field = FIELD_META[fieldName]
                  const error = errors[fieldName]?.message
                  const currentValue = getValues(fieldName)
                  const hasValue =
                    field.type === 'checkbox'
                      ? Boolean(currentValue)
                      : String(currentValue ?? '').trim().length > 0

                  if (field.asButtonGroup) {
                    const btnOptions = getButtonGroupOptions(fieldName, campusId)
                    const isDisabled = fieldName === 'carreraId' && !campusId
                    return (
                      <div key={fieldName} className={`asp-form__field asp-form__field--btn-group${error ? ' is-error' : ''}`}>
                        <label>
                          {field.label}
                          {field.required && <span> *</span>}
                        </label>
                        {fieldName === 'carreraId' && !campusId && (
                          <small className="asp-form__hint">Primero selecciona un campus para ver las carreras disponibles.</small>
                        )}
                        <ButtonGroupField
                          fieldName={fieldName}
                          options={btnOptions}
                          control={control}
                          rules={getFieldRules(fieldName, getValues)}
                          disabled={isDisabled}
                          stacked={field.buttonGroupStacked}
                        />
                        {error && <small>{error}</small>}
                      </div>
                    )
                  }

                  if (field.type === 'checkbox') {
                    return (
                      <label key={fieldName} className={`asp-form__checkbox ${error ? 'is-error' : ''} ${hasValue ? 'is-checked' : ''}`}>
                        <input type="checkbox" {...register(fieldName, getFieldRules(fieldName, getValues))} />
                        <span>{field.label}</span>
                        {error && <small>{error}</small>}
                      </label>
                    )
                  }

                  return (
                    <div key={fieldName} className={`asp-form__field ${error ? 'is-error' : ''} ${!error && hasValue ? 'is-valid' : ''}`}>
                      <label htmlFor={fieldName}>
                        {field.label}
                        {field.required && <span> *</span>}
                        {!field.required && <small className="asp-form__optional">opcional</small>}
                      </label>

                      {field.type === 'select' ? (
                        <SelectField
                          fieldName={fieldName}
                          register={register}
                          campusId={campusId}
                          getValues={getValues}
                          inputClassName={`${error ? 'is-error' : ''} ${!error && hasValue ? 'is-valid' : ''}`.trim()}
                          ariaInvalid={Boolean(error)}
                        />
                      ) : (
                        <input
                          id={fieldName}
                          type={field.type || 'text'}
                          step={field.step}
                          className={`${error ? 'is-error' : ''} ${!error && hasValue ? 'is-valid' : ''}`.trim()}
                          aria-invalid={Boolean(error)}
                          {...register(fieldName, getFieldRules(fieldName, getValues))}
                          onInput={(event) => sanitizeInputValue(event, field, fieldName)}
                        />
                      )}

                      {field.hint && <small className="asp-form__hint">{field.hint}</small>}

                      {error && <small>{error}</small>}
                    </div>
                  )
                })}
              </div>
            )}
          </fieldset>
        ))}

        {mode === FORM_MODES.INSCRIPCION && (
          <fieldset
            className="asp-form__section"
            style={{ display: isLastStep ? 'block' : 'none' }}
            aria-hidden={isLastStep ? 'false' : 'true'}
          >
            <legend>Validaciones de inscripcion</legend>
            <div className="asp-form__grid">
              <label className="asp-form__checkbox">
                <input type="checkbox" {...register('aceptoReglamento', getFieldRules('aceptoReglamento', getValues))} />
                <span>Acepto el reglamento institucional</span>
                {errors.aceptoReglamento?.message && <small>{errors.aceptoReglamento.message}</small>}
              </label>

              <label className="asp-form__checkbox">
                <input type="checkbox" {...register('autorizacionInformar', getFieldRules('autorizacionInformar', getValues))} />
                <span>Autorizo informar avances academicos al responsable</span>
                {errors.autorizacionInformar?.message && <small>{errors.autorizacionInformar.message}</small>}
              </label>
            </div>
          </fieldset>
        )}

        <div className="asp-form__actions asp-form__actions--wizard">
          <div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0 || isSubmitting || isLoadingInitialData}
            >
              Anterior
            </button>
          </div>

          <div>
            {!isLastStep ? (
              <button
                type="button"
                className="primary-button"
                onClick={async () => {
                  const section = SECTION_CONFIG[currentStep]
                  if (section.id === 'documentacion') {
                    const okDocs = validateDocumentStep()
                    if (okDocs) setCurrentStep((s) => Math.min(stepCount - 1, s + 1))
                    return
                  }
                  const ok = await trigger(section.fields)
                  if (ok) setCurrentStep((s) => Math.min(stepCount - 1, s + 1))
                }}
                disabled={isSubmitting || isLoadingInitialData}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="primary-button"
                type="button"
                onClick={async () => {
                  const allFields = SECTION_CONFIG.flatMap((s) => s.fields).filter((field) => Boolean(FIELD_META[field]))
                  const ok = await trigger(allFields)
                  if (ok) {
                    const okDocs = validateDocumentStep()
                    if (!okDocs) return
                    // if inscripcion, also validate aceptoReglamento
                    if (mode === FORM_MODES.INSCRIPCION) {
                      const validIns = await trigger(['aceptoReglamento', 'autorizacionInformar'])
                      if (!validIns) return
                    }
                    await onSubmit()
                  }
                }}
                disabled={isSubmitting || isLoadingInitialData}
              >
                {isSubmitting ? 'Enviando...' : ui.submitLabel}
              </button>
            )}
          </div>
        </div>

        {submitError && (
          <div className="asp-form__alert asp-form__alert--error" role="alert" aria-live="assertive">
            <div className="asp-form__alert-copy">
              <strong>Revisa tu solicitud</strong>
              <p>{submitError}</p>
            </div>
            <button
              type="button"
              className="asp-form__alert-close"
              onClick={() => setSubmitError('')}
              aria-label="Cerrar alerta"
            >
              ✕
            </button>
          </div>
        )}

        {submitOkMessage && (
          <div className="asp-form__alert asp-form__alert--success" role="status" aria-live="polite">
            <strong>Exito:</strong> {submitOkMessage}
          </div>
        )}
      </form>
    </section>
  )
}
