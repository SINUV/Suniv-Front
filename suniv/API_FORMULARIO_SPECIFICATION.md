# Especificación API POST /api/Admision/formulario

## INFORMACIÓN CRÍTICA PARA FRONTEND

### 1. RUTA EXACTA
```
POST /api/Admision/formulario
```
⚠️ **Nota:** La ruta comienza con **MAYÚSCULA** `Admision`, no `admision`

---

## 2. ESQUEMA EXACTO (Request Body)

### Headers Requeridos
```
Content-Type: application/json
```

### Body - Tipo: JSON

```json
{
  "campusId": "UUID",
  "carreraId": "UUID",
  
  "nombre": "string (2-100 chars)",
  "apellidoPaterno": "string (2-100 chars)",
  "apellidoMaterno": "string (2-100 chars)",
  "fechaNacimiento": "ISO 8601 date (2024-01-15)",
  "sexo": "string (M|F|Masculino|Femenino)",
  "estadoCivil": "string",
  "curp": "string (18 chars, formato CURP)",
  "telefono": "string (10+ dígitos)",
  "correo": "string (email válido)",
  
  "calle": "string",
  "numExt": "string",
  "numInt": "string (nullable)",
  "colonia": "string",
  "municipio": "string",
  "estado": "string",
  "codigoPostal": "string (5 dígitos)",
  
  "nombreEscuela": "string",
  "tipoEscuela": "string",
  "areaConocimiento": "string",
  "anioIngreso": "integer (1900-2024)",
  "anioEgreso": "integer (>= anioIngreso)",
  "promedioFinal": "decimal (0-100)",
  
  "medioEnterado": "string (optional)",
  "lenguaIndigena": "string (optional)",
  "grupoEtnico": "string (optional)",
  "esAfrodesc": "boolean (default: false)",
  "descendencia": "string (optional)",
  "esIndigena": "boolean (default: false)",
  
  "tipoSangre": "string (O+|O-|A+|A-|B+|B-|AB+|AB-, optional)",
  "enfermedades": "string (optional)",
  "alergias": "string (optional)",
  "medicamentosEspeciales": "string (optional)",
  "servicioMedico": "string (optional)",
  "numeroAfiliacion": "string (optional)",
  
  "nombreResponsable": "string",
  "parentesco": "string",
  "ocupacionResponsable": "string (optional)",
  "telefonoResponsable": "string (10+ dígitos)",
  
  "calleResponsable": "string",
  "coloniaResponsable": "string",
  "municipioResponsable": "string",
  "estadoResponsable": "string",
  "codigoPostalResponsable": "string (5 dígitos)",
  
  "lugarAplicacion": "string",
  "consentimiento": "boolean (must be true)"
}
```

---

## 3. VALIDACIONES POR CAMPO

| Campo | Requerido | Validación | Mensaje Error |
|-------|-----------|-----------|--------------|
| campusId | ✅ | UUID no vacío | "CampusId es requerido" |
| carreraId | ✅ | UUID no vacío | "CarreraId es requerido" |
| nombre | ✅ | 2-100 chars | "Nombre debe tener entre 2-100 caracteres" |
| apellidoPaterno | ✅ | 2-100 chars | "ApellidoPaterno debe tener entre 2-100 caracteres" |
| apellidoMaterno | ✅ | 2-100 chars | "ApellidoMaterno debe tener entre 2-100 caracteres" |
| fechaNacimiento | ✅ | Pasada, ISO 8601 | "FechaNacimiento no puede ser mayor a hoy" |
| sexo | ✅ | M\|F\|Masculino\|Femenino | "Sexo debe ser: M, F, Masculino o Femenino" |
| estadoCivil | ✅ | No vacío | "EstadoCivil es requerido" |
| curp | ✅ | Exactamente 18 chars, formato CURP | "Curp debe tener 18 caracteres y formato válido" |
| telefono | ✅ | 10+ dígitos | "Telefono debe tener al menos 10 dígitos" |
| correo | ✅ | Email válido | "Correo no válido" |
| calle | ✅ | No vacío | "Calle es requerida" |
| numExt | ✅ | No vacío | "NumExt es requerido" |
| numInt | ❌ | Opcional | - |
| colonia | ✅ | No vacío | "Colonia es requerida" |
| municipio | ✅ | No vacío | "Municipio es requerido" |
| estado | ✅ | No vacío | "Estado es requerido" |
| codigoPostal | ✅ | Exactamente 5 dígitos | "CodigoPostal debe ser 5 dígitos" |
| nombreEscuela | ✅ | No vacío | "NombreEscuela es requerido" |
| tipoEscuela | ✅ | No vacío | "TipoEscuela es requerido" |
| areaConocimiento | ✅ | No vacío | "AreaConocimiento es requerida" |
| anioIngreso | ✅ | 1900-2024 | "AnioIngreso debe estar entre 1900 y año actual" |
| anioEgreso | ✅ | >= anioIngreso | "AnioEgreso debe ser >= AnioIngreso" |
| promedioFinal | ✅ | 0-100 decimal | "PromedioFinal debe estar entre 0 y 100" |
| medioEnterado | ❌ | Opcional | - |
| lenguaIndigena | ❌ | Opcional | - |
| grupoEtnico | ❌ | Opcional | - |
| esAfrodesc | ❌ | Boolean (default: false) | - |
| descendencia | ❌ | Opcional | - |
| esIndigena | ❌ | Boolean (default: false) | - |
| tipoSangre | ❌ | O+\|O-\|A+\|A-\|B+\|B-\|AB+\|AB- o vacío | "TipoSangre no válido" |
| enfermedades | ❌ | Opcional | - |
| alergias | ❌ | Opcional | - |
| medicamentosEspeciales | ❌ | Opcional | - |
| servicioMedico | ❌ | Opcional | - |
| numeroAfiliacion | ❌ | Opcional | - |
| nombreResponsable | ✅ | No vacío | "NombreResponsable es requerido" |
| parentesco | ✅ | No vacío | "Parentesco es requerido" |
| ocupacionResponsable | ❌ | Opcional | - |
| telefonoResponsable | ✅ | 10+ dígitos | "TelefonoResponsable debe tener al menos 10 dígitos" |
| calleResponsable | ✅ | No vacío | "CalleResponsable es requerida" |
| coloniaResponsable | ✅ | No vacío | "ColoniaResponsable es requerida" |
| municipioResponsable | ✅ | No vacío | "MunicipioResponsable es requerido" |
| estadoResponsable | ✅ | No vacío | "EstadoResponsable es requerido" |
| codigoPostalResponsable | ✅ | Exactamente 5 dígitos | "CodigoPostalResponsable debe ser 5 dígitos" |
| lugarAplicacion | ✅ | No vacío | "LugarAplicacion es requerido" |
| consentimiento | ✅ | true | "Consentimiento debe ser true" |

---

## 4. RESPUESTA EXITOSA (200 OK)

```json
{
  "succes": true,
  "data": {
    "folio": "ASP-1234567",
    "nombre": "Juan García López",
    "carrera": "Licenciatura en Informática",
    "campus": "Campus Central",
    "fechaExamen": "2024-05-15T10:00:00",
    "horaExamen": "10:00:00",
    "lugarExamen": "Aula 101"
  }
}
```

⚠️ **NOTA:** Hay typo en respuesta: `"succes"` debería ser `"success"` (se corregirá)

---

## 5. RESPUESTA ERROR - VALIDACIÓN (400 Bad Request)

```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "traceId": "00-abc123-def456-00",
  "errors": {
    "Correo": [
      "Correo no válido"
    ],
    "Curp": [
      "Curp formato inválido"
    ],
    "FechaNacimiento": [
      "FechaNacimiento no puede ser mayor a hoy"
    ]
  }
}
```

---

## 6. RESPUESTA ERROR - SERVIDOR (500)

Si llega un 500, las causas comunes son:

### a) Datos Duplicados
- CURP ya existe en BD
- Correo ya existe en BD

**Solución:** Validar en frontend antes de enviar

### b) IDs Inválidos
- CampusId no existe
- CarreraId no existe

**Solución:** Obtener IDs válidos de:
```
GET /api/Campus
GET /api/Carrera
```

### c) Errores de Conexión Supabase
- Variables de entorno mal configuradas
- BD no disponible

**Contactar:** Admin para revisar configuración

---

## 7. EJEMPLO COMPLETO - FRONTEND

### TypeScript/JavaScript

```typescript
async function registrarFormulario() {
  const datos = {
    campusId: "550e8400-e29b-41d4-a716-446655440000",
    carreraId: "550e8400-e29b-41d4-a716-446655440001",
    nombre: "Juan",
    apellidoPaterno: "García",
    apellidoMaterno: "López",
    fechaNacimiento: "1995-05-15",
    sexo: "M",
    estadoCivil: "Soltero",
    curp: "GAUL950515HDFRRN09",
    telefono: "5512345678",
    correo: "juan@example.com",
    calle: "Calle Principal 123",
    numExt: "100",
    numInt: "A",
    colonia: "Centro",
    municipio: "México",
    estado: "CDMX",
    codigoPostal: "06500",
    nombreEscuela: "Preparatoria X",
    tipoEscuela: "Pública",
    areaConocimiento: "Físico-Matemática",
    anioIngreso: 2013,
    anioEgreso: 2016,
    promedioFinal: 85.5,
    medioEnterado: "Redes Sociales",
    lenguaIndigena: "Ninguna",
    grupoEtnico: "No aplica",
    esAfrodesc: false,
    descendencia: "",
    esIndigena: false,
    tipoSangre: "O+",
    enfermedades: "Ninguna",
    alergias: "Ninguna",
    medicamentosEspeciales: "",
    servicioMedico: "IMSS",
    numeroAfiliacion: "123456789",
    nombreResponsable: "María López",
    parentesco: "Madre",
    ocupacionResponsable: "Empleada",
    telefonoResponsable: "5512345678",
    calleResponsable: "Calle Principal 123",
    coloniaResponsable: "Centro",
    municipioResponsable: "México",
    estadoResponsable: "CDMX",
    codigoPostalResponsable: "06500",
    lugarAplicacion: "Campus Central",
    consentimiento: true
  };

  try {
    const response = await fetch("/api/Admision/formulario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (response.status === 400) {
      const errors = await response.json();
      console.error("Validación fallida:", errors.errors);
      // Mostrar errores por campo
      return;
    }

    if (!response.ok) {
      console.error("Error:", response.status);
      return;
    }

    const result = await response.json();
    console.log("Folio:", result.data.folio);
    console.log("Fecha examen:", result.data.fechaExamen);
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}
```

---

## 8. CAMBIOS REALIZADOS EN BACKEND

✅ Creado: `RegistrarFormularioCommandValidator.cs`
- Valida todos los campos requeridos
- Retorna errores detallados por campo
- Automáticamente retorna 400 si validación falla

✅ Validaciones registradas en Program.cs (automáticamente via FluentValidation)

✅ Próximo: Corregir typo "succes" → "success" en respuesta

---

## 9. CHECKLIST PARA FRONTEND

Antes de enviar, validar:

- [ ] campusId y carreraId son UUIDs válidos
- [ ] Todos los campos requeridos no están vacíos
- [ ] CURP tiene 18 caracteres (formato: GAUL950515HDFRRN09)
- [ ] Correo es válido
- [ ] Teléfono tiene 10+ dígitos
- [ ] Códigos postales tienen 5 dígitos
- [ ] Años están en rango válido
- [ ] Promedio está entre 0-100
- [ ] TipoSangre es válido (O+, O-, A+, A-, B+, B-, AB+, AB-) o vacío
- [ ] Consentimiento es true

---

## PRÓXIMOS PASOS

1. Esperar confirmación de que validaciones funcionan correctamente (400 con detalles)
2. Reportar si aún hay errores 500 con timestamp
3. Validar que folio se genera correctamente
4. Confirmar que ficha de examen se crea

