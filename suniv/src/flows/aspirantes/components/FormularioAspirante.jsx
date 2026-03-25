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

const SECTION_CONFIG = [
  {
    id: 'persona',
    title: 'Persona',
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
    fields: ['telefono', 'correo', 'calle', 'numExt', 'numInt', 'colonia', 'municipio', 'estado', 'codigoPostal'],
  },
  {
    id: 'escolar',
    title: 'Escolar',
    fields: ['nombreEscuela', 'tipoEscuela', 'areaConocimiento', 'anioIngreso', 'anioEgreso', 'promedioFinal', 'medioEnterado'],
  },
  {
    id: 'salud',
    title: 'Salud',
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
      'lugarAplicacion',
      'consentimiento',
    ],
  },
]

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const FIELD_META = {
  campusId: { label: 'Campus', type: 'select', required: true },
  carreraId: { label: 'Carrera', type: 'select', required: true },
  nombre: { label: 'Nombre(s)', required: true },
  apellidoPaterno: { label: 'Apellido paterno', required: true },
  apellidoMaterno: { label: 'Apellido materno', required: true },
  fechaNacimiento: { label: 'Fecha de nacimiento', type: 'date', required: true },
  sexo: { label: 'Sexo', type: 'select' },
  estadoCivil: { label: 'Estado civil', required: true },
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
  nombreEscuela: { label: 'Nombre de escuela', required: true },
  tipoEscuela: { label: 'Tipo de escuela', required: true },
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
  nombreResponsable: { label: 'Nombre responsable', required: true },
  parentesco: { label: 'Parentesco', required: true },
  ocupacionResponsable: { label: 'Ocupacion responsable' },
  telefonoResponsable: { label: 'Telefono responsable', required: true, onlyDigits: 10 },
  calleResponsable: { label: 'Calle responsable', required: true },
  coloniaResponsable: { label: 'Colonia responsable', required: true },
  municipioResponsable: { label: 'Municipio responsable', required: true },
  estadoResponsable: { label: 'Estado responsable', required: true },
  codigoPostalResponsable: { label: 'Codigo postal responsable', required: true, onlyDigits: 5 },
  lugarAplicacion: { label: 'Lugar de aplicacion', required: true },
  consentimiento: { label: 'Acepto el tratamiento de datos', type: 'checkbox', required: true },
}

function getFieldRules(fieldName) {
  const currentYear = new Date().getFullYear()

  switch (fieldName) {
    case 'campusId':
      return {
        required: 'Selecciona un campus.',
        validate: (value) => GUID_REGEX.test(value) || 'Campus invalido.',
      }
    case 'carreraId':
      return {
        required: 'Selecciona una carrera.',
        validate: (value) => GUID_REGEX.test(value) || 'Carrera invalida.',
      }
    case 'curp':
      return {
        required: 'La CURP es obligatoria.',
        validate: (value) => CURP_REGEX.test(String(value || '').toUpperCase()) || 'CURP invalida.',
      }
    case 'correo':
      return {
        required: 'El correo es obligatorio.',
        pattern: { value: EMAIL_REGEX, message: 'Correo invalido.' },
      }
    case 'telefono':
    case 'telefonoResponsable':
      return {
        required: 'El telefono es obligatorio.',
        pattern: { value: PHONE_REGEX, message: 'Telefono invalido. Debe tener 10 digitos.' },
      }
    case 'codigoPostal':
    case 'codigoPostalResponsable':
      return {
        required: 'El codigo postal es obligatorio.',
        pattern: { value: POSTAL_CODE_REGEX, message: 'Codigo postal invalido. Debe tener 5 digitos.' },
      }
    case 'promedioFinal':
      return {
        required: 'El promedio es obligatorio.',
        min: { value: 0, message: 'El promedio minimo es 0.' },
        max: { value: 10, message: 'El promedio maximo es 10.' },
        validate: (value) => !Number.isNaN(Number(value)) || 'Promedio invalido.',
      }
    case 'anioIngreso':
    case 'anioEgreso':
      return {
        required: 'Este campo es obligatorio.',
        min: { value: 1900, message: 'Ingresa un anio valido.' },
        max: { value: currentYear, message: `El anio no puede ser mayor a ${currentYear}.` },
      }
    case 'consentimiento':
      return {
        validate: (value) => Boolean(value) || 'Debes aceptar el consentimiento.',
      }
    default:
      return FIELD_META[fieldName]?.required ? { required: 'Este campo es obligatorio.' } : {}
  }
}

function sanitizeInputValue(event, field) {
  if (field.onlyDigits) {
    event.target.value = event.target.value.replace(/\D/g, '').slice(0, field.onlyDigits)
  }

  if (field.transformUppercase) {
    event.target.value = event.target.value.toUpperCase().replace(/\s+/g, '')
  }
}

function SelectField({ fieldName, register, campusId }) {
  if (fieldName === 'campusId') {
    return (
      <select id={fieldName} {...register(fieldName, getFieldRules(fieldName))}>
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
    const programOptions = PROGRAM_OPTIONS.filter((program) => !campusId || program.campusId === campusId)

    return (
      <select id={fieldName} {...register(fieldName, getFieldRules(fieldName))}>
        <option value="">Selecciona una opcion</option>
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
      <select id={fieldName} {...register(fieldName, getFieldRules(fieldName))}>
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
        <option value="O">Prefiero no especificar</option>
      </select>
    )
  }

  return (
    <select id={fieldName} {...register(fieldName, getFieldRules(fieldName))}>
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
  const defaultValues = useMemo(() => mergeWithDefaults(initialData || FORM_DEFAULT_VALUES), [initialData])

  const {
    register,
    reset,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues })

  const campusId = useWatch({ control, name: 'campusId' })
  const selectedCareer = useWatch({ control, name: 'carreraId' })

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
  }, [campusId, selectedCareer, setValue])

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError('')
    setSubmitOkMessage('')

    try {
      const payload = normalizeAspirantePayload(values)
      const result =
        mode === FORM_MODES.ASPIRANTE
          ? await submitAdmisionFormulario(payload)
          : await submitInscripcionFormulario({ folio, ...payload })

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
      setSubmitError(error?.message || 'No se pudo enviar la informacion al backend.')
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

      <form className="asp-form__body" onSubmit={onSubmit} noValidate>
        {SECTION_CONFIG.map((section) => (
          <fieldset key={section.id} className="asp-form__section">
            <legend>{section.title}</legend>

            <div className="asp-form__grid">
              {section.fields.map((fieldName) => {
                const field = FIELD_META[fieldName]
                const error = errors[fieldName]?.message

                if (field.type === 'checkbox') {
                  return (
                    <label key={fieldName} className="asp-form__checkbox">
                      <input type="checkbox" {...register(fieldName, getFieldRules(fieldName))} />
                      <span>{field.label}</span>
                      {error && <small>{error}</small>}
                    </label>
                  )
                }

                return (
                  <div key={fieldName} className="asp-form__field">
                    <label htmlFor={fieldName}>
                      {field.label}
                      {field.required && <span> *</span>}
                    </label>

                    {field.type === 'select' ? (
                      <SelectField fieldName={fieldName} register={register} campusId={campusId} />
                    ) : (
                      <input
                        id={fieldName}
                        type={field.type || 'text'}
                        step={field.step}
                        {...register(fieldName, getFieldRules(fieldName))}
                        onInput={(event) => sanitizeInputValue(event, field)}
                      />
                    )}

                    {error && <small>{error}</small>}
                  </div>
                )
              })}
            </div>
          </fieldset>
        ))}

        <div className="asp-form__actions">
          <button className="primary-button" type="submit" disabled={isSubmitting || isLoadingInitialData}>
            {isSubmitting ? 'Enviando...' : ui.submitLabel}
          </button>
        </div>

        {submitError && (
          <p className="asp-form__result asp-form__result--error" role="alert">
            {submitError}
          </p>
        )}

        {submitOkMessage && <p className="asp-form__result asp-form__result--ok">{submitOkMessage}</p>}
      </form>
    </section>
  )
}
