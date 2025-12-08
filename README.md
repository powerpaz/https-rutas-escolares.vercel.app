# https-rutas-escolares.vercel.app

Estructura base para usar **el mismo repositorio** como:

- Frontend en GitHub Pages
- Backend (OSRM) en Vercel

## 1. Frontend (GitHub Pages)

1. Abre el archivo `index.html` que viene en este ZIP.
2. Borra TODO su contenido.
3. Pega tu `index.html` COMPLETO del sistema de rutas de transporte escolar
   (el que ya tiene:
   - Leaflet
   - carga de Excel
   - exportar PDF/JPG
   - conversión UTM
   - dibujado de rutas, etc.).
4. Haz commit y push a tu repo:

   https://github.com/powerpaz/https-rutas-escolares.vercel.app

5. En GitHub → Settings → Pages:
   - Source: `Deploy from branch`
   - Branch: `main`
   - Folder: `/ (root)`

Tu app quedará publicada en:

https://powerpaz.github.io/https-rutas-escolares.vercel.app/

## 2. Backend (Vercel)

Este mismo repo tiene:

- `api/route.js`  → endpoint para calcular rutas con OSRM
- `package.json`
- `vercel.json`

Pasos:

1. En https://vercel.com crea un nuevo proyecto.
2. Importa este mismo repositorio de GitHub:
   `powerpaz/https-rutas-escolares.vercel.app`
3. Vercel detectará automáticamente la función serverless en `api/route.js`.

El endpoint quedará así (ejemplo):

https://rutas-escolares.vercel.app/api/route

Asegúrate de que en tu `index.html` (frontend) tengas algo como:

```js
const BACKEND_URL = "https://rutas-escolares.vercel.app/api/route";
```

Con eso:

- El frontend en GitHub Pages dibuja el mapa y manda coordenadas.
- El backend en Vercel convierte UTM→WGS84, llama a OSRM y devuelve la ruta.
