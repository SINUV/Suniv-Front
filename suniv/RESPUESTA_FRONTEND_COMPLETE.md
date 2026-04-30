# Respuesta del Backend a Consulta Frontend - 30/04/2026

**Para:** Equipo Frontend Portal de Admisiones SUNIV  
**De:** Backend (Sistema de Inscripciones)  
**Asunto:** Respuesta a preguntas sobre POST /api/Admision/formulario

---

## 1️⃣ ESTRUCTURA Y TIPOS DE DATOS - CONFIRMADO ✅

### Estructura Exacta Esperada

La estructura que envía el frontend es **CORRECTA**. El comando espera exactamente esto:

```typescript
{
  // Guías de Referencia (UUIDs)
  campusId: string (GUID format),
  carreraId: string (GUID format),
  
  // Datos Personales (strings, excepto fechas)
  nombre: string,
  apellidoPaterno: string,
  apellidoMaterno: string,
  fechaNacimiento: string (ISO 8601: YYYY-MM-DD),
  sexo: string,
  estadoCivil: string,
  curp: string,
  telefono: string,
  correo: string,
  
  // Domicilio (strings)
  calle: string,
  numExt: string,
  numInt: string (puede ser vacío ""),
  colonia: string,
  municipio: string,
  estado: string,
  codigoPostal: string,
  
  // Educación (strings + números)
  nombreEscuela: string,
  tipoEscuela: string,
  areaConocimiento: string,
  anioIngreso: number (year),
  anioEgreso: number (year),
  promedioFinal: number (0-100, decimal),
  
  // Datos Demográficos (strings + booleans)
  medioEnterado: string,
  lenguaIndigena: string,
  grupoEtnico: string,
  esAfrodesc: boolean,
  descendencia: string,
  esIndigena: boolean,
  
  // Datos Médicos (strings)
  tipoSangre: string,
  enfermedades: string,
  alergias: string,
  medicamentosEspeciales: string,
  servicioMedico: string,
  numeroAfiliacion: string,
  
  // Responsable (strings)
  nombreResponsable: string,
  parentesco: string,
  ocupacionResponsable: string,
  telefonoResponsable: string,
  
  // Domicilio Responsable (strings)
  calleResponsable: string,
  coloniaResponsable: string,
  municipioResponsable: string,
  estadoResponsable: string,
  codigoPostalResponsable: string,
  
  // Solicitud
  lugarAplicacion: string,
  consentimiento: boolean (MUST be true)
}
```

**⚠️ IMPORTANTE:** No hay campos adicionales requeridos. La estructura que envían es exactamente la esperada.

---

## 2️⃣ CAMPOS OBLIGATORIOS VS OPCIONALES

### Obligatorios (requeridos, no pueden ser null/vacío):

```
campusId ✅
carreraId ✅
nombre ✅
apellidoPaterno ✅
apellidoMaterno ✅
fechaNacimiento ✅
sexo ✅
estadoCivil ✅
curp ✅
telefono ✅
correo ✅
calle ✅
numExt ✅
colonia ✅
municipio ✅
estado ✅
codigoPostal ✅
nombreEscuela ✅
tipoEscuela ✅
areaConocimiento ✅
anioIngreso ✅
anioEgreso ✅
promedioFinal ✅
nombreResponsable ✅
parentesco ✅
telefonoResponsable ✅
calleResponsable ✅
coloniaResponsable ✅
municipioResponsable ✅
estadoResponsable ✅
codigoPostalResponsable ✅
lugarAplicacion ✅
consentimiento ✅ (DEBE ser true)
```

### Opcionales (pueden ser null/vacío):

```
numInt (puede ser "")
medioEnterado (puede ser "")
lenguaIndigena (puede ser "")
grupoEtnico (puede ser "")
descendencia (puede ser "")
tipoSangre (puede ser "")
enfermedades (puede ser "")
alergias (puede ser "")
medicamentosEspeciales (puede ser "")
servicioMedico (puede ser "")
numeroAfiliacion (puede ser "")
ocupacionResponsable (puede ser "")
```

---

## 3️⃣ VALIDACIONES POR CAMPO (AHORA IMPLEMENTADAS) ✅

Se implementó validador completo que retorna **400 con detalles por campo** en lugar de 500 genérico:

| Campo | Validación | Error si falla |
|-------|-----------|---|
| campusId | UUID no vacío | "CampusId es requerido" |
| carreraId | UUID no vacío | "CarreraId es requerido" |
| nombre | 2-100 chars | "Nombre debe tener entre 2-100 caracteres" |
| apellidoPaterno | 2-100 chars | "ApellidoPaterno debe tener entre 2-100 caracteres" |
| apellidoMaterno | 2-100 chars | "ApellidoMaterno debe tener entre 2-100 caracteres" |
| fechaNacimiento | Pasada (< hoy) | "FechaNacimiento no puede ser mayor a hoy" |
| sexo | M, F, Masculino, Femenino | "Sexo debe ser: M, F, Masculino o Femenino" |
| estadoCivil | No vacío | "EstadoCivil es requerido" |
| curp | 18 chars + formato CURP válido | "Curp debe tener 18 caracteres y formato válido" |
| telefono | 10+ dígitos | "Telefono debe tener al menos 10 dígitos" |
| correo | Email válido | "Correo no válido" |
| calle | No vacío | "Calle es requerida" |
| numExt | No vacío | "NumExt es requerido" |
| colonia | No vacío | "Colonia es requerida" |
| municipio | No vacío | "Municipio es requerido" |
| estado | No vacío | "Estado es requerido" |
| codigoPostal | Exactamente 5 dígitos | "CodigoPostal debe ser 5 dígitos" |
| nombreEscuela | No vacío | "NombreEscuela es requerido" |
| tipoEscuela | No vacío | "TipoEscuela es requerido" |
| areaConocimiento | No vacío | "AreaConocimiento es requerida" |
| anioIngreso | 1900-2024 | "AnioIngreso debe estar entre 1900 y año actual" |
| anioEgreso | >= anioIngreso | "AnioEgreso debe ser >= AnioIngreso" |
| promedioFinal | 0-100 decimal | "PromedioFinal debe estar entre 0 y 100" |
| tipoSangre | O+, O-, A+, A-, B+, B-, AB+, AB- (o vacío) | "TipoSangre no válido" |
| nombreResponsable | No vacío | "NombreResponsable es requerido" |
| parentesco | No vacío | "Parentesco es requerido" |
| telefonoResponsable | 10+ dígitos | "TelefonoResponsable debe tener al menos 10 dígitos" |
| calleResponsable | No vacío | "CalleResponsable es requerida" |
| coloniaResponsable | No vacío | "ColoniaResponsable es requerida" |
| municipioResponsable | No vacío | "MunicipioResponsable es requerido" |
| estadoResponsable | No vacío | "EstadoResponsable es requerido" |
| codigoPostalResponsable | Exactamente 5 dígitos | "CodigoPostalResponsable debe ser 5 dígitos" |
| lugarAplicacion | No vacío | "LugarAplicacion es requerido" |
| consentimiento | true | "Consentimiento debe ser true" |

---

## 4️⃣ VALORES VÁLIDOS PARA CAMPOS ESPECIALES ✅

### sexo
```
Valores válidos: "M", "F", "Masculino", "Femenino"
```
✅ Lo que envía el frontend es correcto

### estadoCivil
```
Valores válidos: cualquier string (no hay enum, es libre)
Ejemplos: "Soltero", "Casado", "Divorciado", "Viudo", "Unión Libre"
```
✅ Lo que envía el frontend es correcto

### tipoSangre
```
Valores válidos: "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-" (o vacío)
```
✅ Lo que envía el frontend es correcto

### Otros campos "enum"
```
- servicioMedico: Libre (cualquier string)
- medioEnterado: Libre (cualquier string)
- lenguaIndigena: Libre (cualquier string)
- grupoEtnico: Libre (cualquier string)
- etc.
```

---

## 5️⃣ 🔴 CRÍTICO: FLUJO DE DOCUMENTOS - PROBLEMA ENCONTRADO

### ⚠️ PROBLEMA

**El frontend espera `aspiranteId` en la respuesta de `/api/Admision/formulario`, pero el endpoint NO lo retorna.**

#### Respuesta Actual (INCOMPLETA)

```json
{
  "success": true,
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

❌ **Falta:** `aspiranteId` (necesario para subir documentos después)

### Flujo Actual en Backend

```
1. POST /api/Admision/formulario (recibe todo el formulario)
   ↓
2. Crea: Persona, Domicilio, DatosMedicos, etc.
   ↓
3. Crea: Aspirante → genera folio → ⭐ GUARDA aspiranteId aquí
   ↓
4. Crea: Solicitud
   ↓
5. Crea: FichaExamen
   ↓
6. Retorna SOLO: folio, nombre, carrera, campus, fechaExamen, horaExamen, lugarExamen
   ❌ NO retorna: aspiranteId
```

### Flujo que el Frontend Necesita

```
1. POST /api/Admision/formulario → recibe folio + aspiranteId
   ↓
2. POST /api/Admision/subir-documento (aspiranteId, documentoId, archivo)
   ↓
3. Repite para cada uno de los 4 documentos:
   - Acta de Nacimiento
   - Constancia de Bachillerato
   - CURP
   - Fotografía
   ↓
4. GET /api/Admision/ficha/{folio} → valida que tenga documentos
```

### Problema: Documentos Obligatorios vs Opcionales

**Situación Actual:**
- El formulario se completa y se aceptan sin validar si hay documentos
- El aspirante puede obtener ficha sin haber subido NINGÚN documento
- Los documentos se suben **después** del formulario de forma independiente

**Lo que parece debería ser:**
- Documentos son **OPCIONALES** al momento de registrar formulario
- Pero probablemente **OBLIGATORIOS** para descargar ficha
- El flujo es: formulario → luego subir documentos → luego descargar ficha

---

## 6️⃣ SOLUCIÓN: CAMBIOS NECESARIOS

### Opción A: Retornar aspiranteId (RECOMENDADO)

Actualizar `FormularioResponseDto`:

```csharp
public class FormularioResponseDto
{
    public string Folio { get; set; } = string.Empty;
    public Guid AspiranteId { get; set; }  // ✅ AGREGADO
    public string Nombre { get; set; } = string.Empty;
    public string Carrera { get; set; } = string.Empty;
    public string Campus { get; set; } = string.Empty;
    public DateTime? FechaExamen { get; set; }
    public string HoraExamen { get; set; } = string.Empty;
    public string LugarExamen { get; set; } = string.Empty;
}
```

### Actualizar Handler

En `RegistrarFormularioHandler.cs`, retornar `aspiranteId`:

```csharp
return new FormularioResponseDto
{
    Folio = folio,
    AspiranteId = aspiranteId.Value,  // ✅ AGREGAR ESTA LÍNEA
    Nombre = $"{request.Nombre} {request.ApellidoPaterno} {request.ApellidoMaterno}",
    // ... resto
};
```

### Respuesta Actualizada

```json
{
  "success": true,
  "data": {
    "folio": "ASP-1234567",
    "aspiranteId": "550e8400-e29b-41d4-a716-446655440000",
    "nombre": "Juan García López",
    "carrera": "Licenciatura en Informática",
    "campus": "Campus Central",
    "fechaExamen": "2024-05-15T10:00:00",
    "horaExamen": "10:00:00",
    "lugarExamen": "Aula 101"
  }
}
```

---

## 7️⃣ ENDPOINT PARA SUBIR DOCUMENTOS - CONFIRMADO ✅

### POST /api/Admision/subir-documento

```
Content-Type: multipart/form-data

Query Parameters:
  - aspiranteId (GUID - obtenido del formulario)
  - documentoId (GUID - ID del tipo de documento en BD)

Body:
  - archivo (IFormFile - PDF, JPG, JPEG, PNG)
```

### Documentos Soportados

Necesitan obtener los IDs de documento desde BD o API:

```
- Acta de Nacimiento (documentoId = ?)
- Constancia de Bachillerato (documentoId = ?)
- CURP (documentoId = ?)
- Fotografía (documentoId = ?)
```

**Endpoint para listar documentos:**
```
GET /api/Campus  (para ver qué documentos requiere cada programa)
```

O si existe:
```
GET /api/Documento (listar todos los documentos disponibles)
```

---

## 8️⃣ ERRORES 500 ESPERADOS Y CAUSAS

Si aún llegan errores 500, las causas son:

### a) CampusId o CarreraId no existen en BD
```
⚠️ Validar que existan estos registros:
GET /api/Campus
GET /api/Carrera
```

### b) CURP o Correo duplicados
```
⚠️ Backend intenta insertar pero ya existen
Solución: Verificar en BD si el usuario ya se registró
```

### c) Errores de Supabase (conexión, permisos)
```
⚠️ Variables de entorno mal configuradas
Contactar admin para revisar:
- SUPABASE_URL
- SUPABASE_KEY
- Permisos de tabla en BD
```

---

## CHECKLIST PARA FRONTEND

Antes de enviar el formulario:

- [ ] Ruta correcta: `POST /api/Admision/formulario` (A mayúscula)
- [ ] Todas las validaciones locales pasen (verificar contra tabla de validaciones)
- [ ] campusId y carreraId son UUIDs válidos (obtener de GET /api/Campus, GET /api/Carrera)
- [ ] consentimiento es `true`
- [ ] Respuesta 200 incluye `folio` y `aspiranteId`
- [ ] Guardar `aspiranteId` para subir documentos después
- [ ] Usar el `aspiranteId` en POST `/api/Admision/subir-documento`

---

## PRÓXIMAS ACCIONES

### Backend (Inmediato)
1. ✅ Validador implementado
2. ⏳ Actualizar `FormularioResponseDto` para retornar `aspiranteId`
3. ⏳ Actualizar `RegistrarFormularioHandler` para retornar `aspiranteId`
4. ⏳ Verificar que validador retorna 400 (no 500) con detalles por campo
5. ⏳ Test con payload que el frontend envía

### Frontend
1. Esperar confirmación de que `aspiranteId` se retorna
2. Ajustar parsing de respuesta para obtener `aspiranteId`
3. Probar flujo completo: formulario → documentos → ficha
4. Reportar si aún hay errores con timestamp exacto

---

## CONTACTO Y SOPORTE

**Si persisten errores 500:**
- Timestamp exacto del error
- Campo que causa el problema
- Valor que se está enviando
- Stack trace del log del servidor

**Archivo de especificación completa:**
- `API_FORMULARIO_SPECIFICATION.md`

