# Guía de Subida de Documentos - Frontend

## Resumen

El backend ahora **valida automáticamente** que los archivos sean PDF, JPG, JPEG o PNG.

## Endpoint de Subida

```
POST /api/admision/subir-documento
Content-Type: multipart/form-data

Query Parameters:
  - aspiranteId (GUID)
  - documentoId (GUID)

Body:
  - archivo (IFormFile)
```

### Respuesta Exitosa:
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/dlap2nwgb/raw/upload/..."
}
```

### Respuesta Error:
```json
{
  "success": false,
  "message": "Extensión no permitida. Usa: PDF, JPG, JPEG o PNG"
}
```

## Documentos Soportados

| Documento | Extensiones |
|-----------|------------|
| Acta de Nacimiento | `.pdf` |
| Constancia de Bachillerato | `.pdf` |
| CURP | `.pdf`, `.jpg`, `.jpeg`, `.png` |
| Fotografía | `.jpg`, `.jpeg`, `.png` |

## Ejemplo JavaScript

```javascript
async function uploadDocument(aspiranteId, documentoId, file) {
  const formData = new FormData();
  formData.append("archivo", file);

  const response = await fetch(
    `/api/admision/subir-documento?aspiranteId=${aspiranteId}&documentoId=${documentoId}`,
    {
      method: "POST",
      body: formData
    }
  );

  const data = await response.json();
  
  if (data.success) {
    console.log("Documento subido:", data.url);
    return data.url;
  } else {
    console.error("Error:", data.message);
    throw new Error(data.message);
  }
}
```

## Input HTML

```html
<!-- Acta de Nacimiento -->
<input type="file" accept=".pdf" id="acta" />

<!-- Constancia de Bachillerato -->
<input type="file" accept=".pdf" id="bachillerato" />

<!-- CURP -->
<input type="file" accept=".pdf,.jpg,.jpeg,.png" id="curp" />

<!-- Fotografía -->
<input type="file" accept=".jpg,.jpeg,.png" id="foto" />
```

## Cambios en el Backend

✅ **Archivos Modificados:**
- `AdmisionController.cs` - Validación agregada en `POST /subir-documento`
- `Program.cs` - Registrado servicio de validación
- `DocumentValidationService.cs` - Servicio de validación (simplificado)

✅ **Compilación:** Exitosa - sin errores

✅ **Sin cambios a código existente** de obtención de ficha o solicitud
