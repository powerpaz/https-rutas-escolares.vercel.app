# 🚌 Sistema de Rutas de Transporte Escolar - MINEDUC Ecuador

## Descripción

Sistema web para visualizar y gestionar rutas de transporte escolar en Ecuador. Permite cargar datos desde Excel, calcular rutas automáticamente usando OSRM, dibujar rutas manualmente y exportar informes en JPG y PDF.

## ✨ Características

- 📊 **Carga de Excel**: Lee archivos Excel con coordenadas UTM
- 🗺️ **Mapas interactivos**: Visualización con Leaflet y OpenStreetMap
- 🛣️ **Cálculo automático de rutas**: Usa OSRM para encontrar el camino real por carreteras
- ✏️ **Dibujo manual**: Permite trazar rutas manualmente con snap a carreteras
- 📷 **Exportar JPG**: Captura del mapa como imagen
- 📄 **Exportar PDF**: Informe completo con mapa y tabla de rutas
- 🔧 **Panel de debug**: Para diagnóstico de problemas

## 📋 Formato del Excel

El sistema espera un archivo Excel con la siguiente estructura:

### Cabecera (primeras 20 filas)
La información de la **IE Eje (Destino)** debe estar en la parte superior:

| Campo | Valor |
|-------|-------|
| AMIE IE EJE | [código AMIE] |
| NOMBRE UNIDAD EDUCATIVA EJE | [nombre de la IE] |
| NOMBRE DISTRITO | [distrito] |
| COORDENADA X | [valor UTM X] |
| COORDENADA Y | [valor UTM Y] |

### Tabla de Rutas
A continuación, la tabla con las rutas:

| RUTA | AMIE FUSIONADA/COMUNIDAD | BENEFICIARIOS | DISTANCIA RUTA | COORDENADA X | COORDENADA Y |
|------|--------------------------|---------------|----------------|--------------|--------------|
| 1 | 17D01C001 | 25 | 5.5 | 765432.12 | 9876543.21 |
| 2 | 17D01C002 | 18 | 3.2 | 764321.45 | 9875432.10 |
| ... | ... | ... | ... | ... | ... |

### Notas sobre coordenadas
- Las coordenadas deben estar en **UTM Zona 17S** (Ecuador)
- X debe estar entre 100,000 y 1,000,000
- Y debe estar entre 9,000,000 y 11,000,000
- El sistema convierte automáticamente a Lat/Lon

## 🚀 Cómo usar

### Opción 1: Abrir directamente
1. Abre `index.html` en tu navegador
2. Carga tu archivo Excel
3. Las rutas se dibujarán automáticamente

### Opción 2: Servidor local
```bash
npx serve .
# Abre http://localhost:3000
```

### Opción 3: Desplegar en Vercel
```bash
vercel deploy
```

## 🛠️ Flujo de trabajo

1. **Cargar Excel**: Arrastra o selecciona tu archivo
2. **Verificar IE Eje**: Se muestra en la tarjeta verde
3. **Ver rutas**: Se dibujan automáticamente en el mapa
4. **Editar rutas**: Usa ✏️ para dibujar manualmente si OSRM falla
5. **Agregar más rutas**: Usa "Nueva Ruta de Transporte"
6. **Exportar**: JPG o PDF con el informe

## 🔧 Solución de problemas

### "No se encontró encabezado de rutas"
- Verifica que tu Excel tenga una fila con "RUTA" y "COORDENADA"
- Las coordenadas X/Y deben ser números válidos

### "No se encontró información de IE Eje"
- Asegúrate de que exista "AMIE IE EJE" en la cabecera
- Las coordenadas de destino son necesarias para calcular rutas

### Las rutas aparecen como líneas rectas
- OSRM no encontró una ruta por carretera
- Usa ✏️ Dibujar para trazar la ruta manualmente
- Verifica la conexión a internet

### Debug
- Haz clic en 🔧 Debug para ver el log de procesamiento
- Muestra las columnas detectadas y errores

## 📁 Estructura del proyecto

```
rutas-escolares/
├── index.html          # Aplicación principal
├── api/
│   └── route.js        # API para OSRM (opcional)
├── package.json
├── vercel.json         # Configuración Vercel
└── README.md
```

## 🔌 Dependencias (CDN)

- Leaflet 1.9.4 - Mapas
- SheetJS (xlsx) 0.18.5 - Lectura de Excel
- html2canvas 1.4.1 - Captura de pantalla
- jsPDF 2.5.1 - Generación de PDF

## 📄 Licencia

MIT - MINEDUC Ecuador

---

Desarrollado para el Ministerio de Educación de Ecuador 🇪🇨
