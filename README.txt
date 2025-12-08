
# Sistema de Rutas de Transporte Escolar

## Estructura

- frontend/index.html
  - Usa tu interfaz original (`sistema_rutas_transporte.html`)
  - Incluye un script que sobreescribe `drawRoute(route)` para llamar al backend en:
    https://rutas-escolares.vercel.app/api/route

- backend/
  - api/route.js  → Función serverless para Vercel
  - utils/utm.js  → Conversión UTM (EPSG:32717, zona 17S) a WGS84
  - package.json  → Configuración mínima para Vercel

## Despliegue recomendado

1. **Frontend (GitHub Pages)**
   - Sube la carpeta `frontend` a un repositorio de GitHub.
   - Configura GitHub Pages apuntando a la rama principal o carpeta `/frontend`.
   - Accede a tu app en: `https://TU-USUARIO.github.io/TU-REPO/`

2. **Backend (Vercel)**
   - Crea un nuevo proyecto en Vercel apuntando a la carpeta `backend`.
   - Asegúrate de que la ruta `api/route.js` se despliegue como función serverless.
   - La URL final de la API debe ser:
     https://rutas-escolares.vercel.app/api/route

3. **Conexión**
   - `index.html` ya está configurado para llamar a ese endpoint.
   - Cuando selecciones una ruta, el sistema leerá las coordenadas UTM (zona 17S),
     las enviará al backend, y dibujará la ruta según la red vial de OSM.

