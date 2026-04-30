# Consulta al Backend - Problema 500 en /api/Admision/formulario

## Resumen del Problema
El frontend envía un formulario de admisión a `POST /api/Admision/formulario` y recibe **500 con cuerpo null** (sin mensaje de error).

- El mismo error persiste después de múltiples ajustes en el frontend
- Sospechamos inconsistencia en:
  1. La estructura/tipos de datos esperados vs. lo que enviamos
  2. Valores válidos para campos enum
  3. Cómo funciona la integración de documentos

---

## Estructura Exacta que Envía el Frontend

```json
{
  "campusId": "UUID-string",
  "carreraId": "UUID-string",
  "nombre": "string",
  "apellidoPaterno": "string",
  "apellidoMaterno": "string",
  "fechaNacimiento": "YYYY-MM-DD",
  "sexo": "M" | "F",
  "estadoCivil": "Soltero" | "Casado" | "Divorciado" | "Viudo" | "Unión Libre",
  "curp": "UPPERCASE-string (4 letras + 6 dígitos + HM + 5 letras + letra/número + dígito)",
  "telefono": "10 dígitos",
  "correo": "email-válido",
  "calle": "string",
  "numExt": "string",
  "numInt": "string | '0'",
  "colonia": "string",
  "municipio": "string",
  "estado": "string",
  "codigoPostal": "5 dígitos",
  "nombreEscuela": "string",
  "tipoEscuela": "string",
  "areaConocimiento": "string",
  "anioIngreso": "number (año)",
  "anioEgreso": "number (año)",
  "promedioFinal": "number (0-100)",
  "medioEnterado": "string",
  "lenguaIndigena": "Ninguna" | "string",
  "grupoEtnico": "Ninguno" | "string",
  "esAfrodesc": "boolean",
  "esIndigena": "boolean",
  "descendencia": "Ninguna" | "No especificada" | "string",
  "tipoSangre": "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-",
  "enfermedades": "Ninguna" | "string",
  "alergias": "Ninguna" | "string",
  "medicamentosEspeciales": "Ninguno" | "string",
  "servicioMedico": "Ninguno" | "string",
  "numeroAfiliacion": "string | '0'",
  "nombreResponsable": "string",
  "parentesco": "string",
  "ocupacionResponsable": "No especificada" | "string",
  "telefonoResponsable": "string",
  "calleResponsable": "string",
  "coloniaResponsable": "string",
  "municipioResponsable": "string",
  "estadoResponsable": "string",
  "codigoPostalResponsable": "string",
  "lugarAplicacion": "string (auto-completado del campus si no viene)",
  "consentimiento": "boolean"
}
```

---

## Preguntas Específicas para el Backend

### 1. Estructura y Tipos de Datos

**¿Cuál es exactamente la estructura que espera el endpoint `POST /api/Admision/formulario`?**

Específicamente:
- ¿Algún campo tiene un tipo diferente al indicado arriba? (ej: algunos números como string?)
- ¿Hay campos que no estamos enviando que sean obligatorios?
- ¿Hay campos que estamos enviando que deberían eliminarse?

### 2. Valores Válidos para Enums

Los campos que **parece** que podrían ser enums en el backend:

| Campo | Valores que Enviamos | ¿Son Correctos? |
|-------|----------------------|-----------------|
| `sexo` | `"M"` `"F"` | ✓ Necesita confirmación |
| `estadoCivil` | `"Soltero"` `"Casado"` `"Divorciado"` `"Viudo"` `"Unión Libre"` | ✓ Necesita confirmación |
| `servicioMedico` | `"Ninguno"` o nombre del servicio | ✓ Necesita confirmación |
| `tipoSangre` | `"O+"` `"O-"` `"A+"` `"A-"` `"B+"` `"B-"` `"AB+"` `"AB-"` | ✓ Necesita confirmación |

**¿Todos estos valores enum son exactamente así en la base de datos? ¿O tienen otros valores válidos?**

### 3. Campos Obligatorios vs Opcionales

**¿Cuáles son realmente obligatorios?** El frontend valida estos como requeridos:
- campusId, carreraId, nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo, curp, telefono, correo
- dirección completa (calle, numExt, colonia, municipio, estado, codigoPostal)
- info escuela (nombreEscuela, tipoEscuela, areaConocimiento, años, promedio)
- responsable info (nombre, parentesco, teléfono, dirección)

¿Otros campos pueden ser null/vacío si no se llenan? (ej: numeroAfiliacion, medicamentosEspeciales, etc.)

### 4. **CRÍTICO: Integración de Documentos**

Esta es nuestra mayor incógnita. El frontend:
1. Recopila datos del formulario → valida → **envía al endpoint /api/Admision/formulario**
2. Espera recibir un `aspiranteId` en la respuesta
3. **Luego** sube documentos a `/api/Admision/documento` con ese `aspiranteId`

**Preguntas:**

- ¿Es este flow correcto? ¿Form primero, documentos después?
- ¿O se supone que el documento debe ir en el **mismo request** que el formulario?
- ¿O debería subirse **antes** del formulario?
- ¿Cuál es exactamente la estructura esperada para `/api/Admision/documento`? (FormData con file, aspiranteId, tipo de documento, etc.)
- ¿Los documentos son **obligatorios** para que el formulario se acepte, o **opcionales**?
- ¿Si falta un documento, debería fallar el POST /formulario o se acepta sin documentos?

---

## Logs del Frontend

Si necesitan ver exactamente qué está llegando, el frontend registra:

```
[SUNIV] Payload enviado al backend: { ...todo el JSON de arriba... }
[SUNIV] Respuesta del backend: 500 null
```

**¿Podrían revisar los logs del backend para ese timestamp y compartir:**
- ¿Qué datos recibió exactamente?
- ¿Dónde falló? (validación, query DB, Guid generation, etc.)
- Stack trace si hay excepción interna

---

## Acción Solicitada

Por favor confirmar:

1. ✅ Estructura JSON esperada (tipos, campos obligatorios)
2. ✅ Valores válidos para cada enum
3. ✅ Flow de documentos (cuándo, endpoint, estructura)
4. ✅ Si hay error de validación interna en el backend, compartir el error
5. ✅ Si hay límites de tamaño, encoding, headers especiales que necesitemos saber

Una vez tengamos esta información, podemos verificar qué hay en el frontend que no coincida y ajustar.

---

**Enviado por:** Frontend del Portal de Admisiones SUNIV  
**Fecha:** 2026-04-30  
**Stack:** React + Vite | Deployment: Vercel → Render (proxy /api/*)
