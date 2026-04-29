import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
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
  submitAdmisionFormulario,
  submitInscripcionFormulario,
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

const SECTION_CONFIG = [
  {
    id: 'persona',
    title: 'Persona',
    description: 'Datos personales y de identidad.',
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
    ],
  },
  {
    id: 'contacto',
    title: 'Contacto',
    description: 'Medios de contacto y domicilio.',
    fields: ['telefono', 'correo', 'calle', 'numExt', 'numInt', 'colonia', 'municipio', 'estado', 'codigoPostal'],
  },
  {
    id: 'escolar',
    title: 'Escolar',
    description: 'Trayectoria academica previa.',
    fields: ['nombreEscuela', 'tipoEscuela', 'areaConocimiento', 'anioIngreso', 'anioEgreso', 'promedioFinal', 'medioEnterado'],
  },
  {
    id: 'salud',
    title: 'Salud',
    description: 'Informacion medica relevante.',
    fields: [
      'tipoSangre',
      'enfermedades',
      'alergias',
      'medicamentosEspeciales',
      'servicioMedico',
      'numeroAfiliacion',
      'lenguaIndigena',
      'grupoEtnico',
      'esAfrodesc',
      'esIndigena',
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
    id: 'aplicacion',
    title: 'Aplicacion y consentimiento',
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
  contacto: {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.5 4.5h15A1.5 1.5 0 0 1 21 6v12a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18V6a1.5 1.5 0 0 1 1.5-1.5Zm.7 2.2 6.8 5.48 6.8-5.48H5.2Zm14.3 10.6V8.7l-7 5.64a.75.75 0 0 1-.94 0l-7-5.64v8.6h14.9Z" />
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
  aplicacion: {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 3.75A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25h12A2.25 2.25 0 0 0 20.25 18V9.44a2.25 2.25 0 0 0-.66-1.59L16.4 4.66A2.25 2.25 0 0 0 14.81 4H6Zm0 1.5h8v3.5h3.5V18a.75.75 0 0 1-.75.75H6A.75.75 0 0 1 5.25 18V6A.75.75 0 0 1 6 5.25Zm7.93.31 2.01 2.01h-2.01V5.56Zm-1.5 5.44a.75.75 0 0 1 .75.75V13h1.25a.75.75 0 0 1 0 1.5h-1.25v1.25a.75.75 0 0 1-1.5 0V14.5H10.5a.75.75 0 0 1 0-1.5h1.18v-1.25a.75.75 0 0 1 .75-.75Z" />
      </svg>
    ),
  },
}

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const FIELD_META = {
  campusId: { label: 'Campus', type: 'select', required: true },
  carreraId: { label: 'Carrera', type: 'select', required: true },
  nombre: { label: 'Nombre(s)', required: true, disallowDigits: true },
  apellidoPaterno: { label: 'Apellido paterno', required: true, disallowDigits: true },
  apellidoMaterno: { label: 'Apellido materno', required: true, disallowDigits: true },
  fechaNacimiento: { label: 'Fecha de nacimiento', type: 'date', required: true },
  sexo: { label: 'Sexo', type: 'select', required: true },
  estadoCivil: { label: 'Estado civil', required: true, disallowDigits: true },
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
  tipoEscuela: { label: 'Tipo de escuela', type: 'select', required: true },
  areaConocimiento: { label: 'Area de conocimiento', required: true },
  anioIngreso: { label: 'Anio ingreso', type: 'number', required: true },
  anioEgreso: { label: 'Anio egreso', type: 'number', required: true },
  promedioFinal: { label: 'Promedio final', type: 'number', required: true, step: '0.1' },
  medioEnterado: { label: 'Como se entero', required: true },
  tipoSangre: { label: 'Tipo de sangre', type: 'select', required: true },
  enfermedades: { label: 'Enfermedades' },
  alergias: { label: 'Alergias' },
  medicamentosEspeciales: { label: 'Medicamentos especiales' },
  servicioMedico: { label: 'Servicio medico' },
  numeroAfiliacion: { label: 'Numero de afiliacion' },
  lenguaIndigena: { label: 'Lengua indigena' },
  grupoEtnico: { label: 'Grupo etnico' },
  esAfrodesc: { label: 'Se identifica como afrodescendiente', type: 'checkbox' },
  esIndigena: { label: 'Se identifica como persona indigena', type: 'checkbox' },
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

function getFechaNacimientoFromCurp(curpValue) {
  const normalizedCurp = String(curpValue || '').toUpperCase().trim()
  if (!CURP_REGEX.test(normalizedCurp)) return null

  const yy = Number(normalizedCurp.slice(4, 6))
  const mm = Number(normalizedCurp.slice(6, 8))
  const dd = Number(normalizedCurp.slice(8, 10))

  const now = new Date()
  const currentTwoDigits = now.getFullYear() % 100
  const fullYear = yy <= currentTwoDigits ? 2000 + yy : 1900 + yy

  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null

  const parsedDate = new Date(fullYear, mm - 1, dd)
  if (
    parsedDate.getFullYear() !== fullYear ||
    parsedDate.getMonth() !== mm - 1 ||
    parsedDate.getDate() !== dd
  ) {
    return null
  }

  return `${fullYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
}

function getFieldRules(fieldName, getValues) {
  const currentYear = new Date().getFullYear()

  // CAMPOS QUE NO PERMITEN NÚMEROS (solo texto)
  const textOnlyFields = [
    'nombre',
    'apellidoPaterno',
    'apellidoMaterno',
    'estadoCivil',
    'nombreEscuela',
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
    'servicioMedico',
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

          const curpValue = getValues?.('curp')
          const curpDate = getFechaNacimientoFromCurp(curpValue)
          if (curpDate && value !== curpDate) {
            return 'La fecha de nacimiento no coincide con la CURP.'
          }

          return true
        },
      }
    case 'sexo':
      return {
        required: 'Selecciona una opción de sexo.',
      }
    case 'curp':
      return {
        required: 'La CURP es obligatoria.',
        validate: (value) => {
          const normalizedCurp = String(value || '').toUpperCase().trim()

          if (!CURP_REGEX.test(normalizedCurp)) {
            return 'CURP inválida. Verifica el formato.'
          }

          const fechaNacimiento = getValues?.('fechaNacimiento')
          const curpDate = getFechaNacimientoFromCurp(normalizedCurp)
          if (fechaNacimiento && curpDate && fechaNacimiento !== curpDate) {
            return 'La CURP no coincide con la fecha de nacimiento.'
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
        min: { value: 0, message: 'El promedio mínimo es 0.' },
        max: { value: 10, message: 'El promedio máximo es 10.' },
        validate: (value) => {
          const num = Number(value)
          if (!value) return true
          if (Number.isNaN(num)) return 'Promedio inválido. Debe ser un número.'
          if (num < 0 || num > 10) return 'El promedio debe estar entre 0 y 10.'
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
    'estadoCivil',
    'nombreEscuela',
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
    'servicioMedico',
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

  // Promedio: permite números y un punto decimal
  if (fieldName === 'promedioFinal') {
    const current = event.target.value
    if (current.includes('.')) {
      const parts = current.split('.')
      event.target.value = parts[0].replace(/\D/g, '') + '.' + parts[1].replace(/\D/g, '').slice(0, 1)
    } else {
      event.target.value = current.replace(/[^\d.]/g, '')
    }
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
        <option value="O">Prefiero no especificar</option>
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

export default function FormularioAspirante({
  mode = FORM_MODES.ASPIRANTE,
  folio = '',
  initialData,
  isLoadingInitialData = false,
  onSuccess,
}) {
  const [submitError, setSubmitError] = useState('')
  const [submitOkMessage, setSubmitOkMessage] = useState('')

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

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues, reset])

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

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')
    setSubmitOkMessage('')

    try {
      const payload = normalizeAspirantePayload(values)
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
      const message =
        mode === FORM_MODES.ASPIRANTE
          ? `Registro enviado correctamente. Folio: ${responseFolio || 'sin folio en respuesta'}.`
          : `Inscripcion enviada correctamente para folio ${responseFolio}.`

      if (mode === FORM_MODES.ASPIRANTE && responseFolio) {
        cacheAspiranteSnapshot(responseFolio, payload)
      }

      setSubmitOkMessage(message)
      onSuccess?.({ mode, folio: responseFolio, backend: result })
    } catch (error) {
      const errorMsg = error?.message || 'Ocurrio un error al enviar el formulario. Por favor intenta de nuevo.'
      setSubmitError(errorMsg)
      // Console.log mantiene info tecnica solo en consola para debug
      console.error('[FormError]', error)
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

            <div className="asp-form__grid">
              {section.fields.map((fieldName) => {
                const field = FIELD_META[fieldName]
                const error = errors[fieldName]?.message
                const currentValue = getValues(fieldName)
                const hasValue =
                  field.type === 'checkbox'
                    ? Boolean(currentValue)
                    : String(currentValue ?? '').trim().length > 0

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
                  const allFields = SECTION_CONFIG.flatMap((s) => s.fields)
                  const ok = await trigger(allFields)
                  if (ok) {
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
            <strong>Error:</strong> {submitError}
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
