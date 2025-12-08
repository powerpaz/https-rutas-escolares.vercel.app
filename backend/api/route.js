
const { utmToLatLon } = require("../utils/utm");

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const { origin, dest } = req.body || {};

        if (!origin || !dest) {
            res.status(400).json({ error: "Faltan coordenadas origen/destino" });
            return;
        }

        const o = utmToLatLon(origin.x, origin.y, 17, "S");
        const d = utmToLatLon(dest.x, dest.y, 17, "S");

        const url = `https://router.project-osrm.org/route/v1/driving/${o.lon},${o.lat};${d.lon},${d.lat}?overview=full&geometries=geojson`;

        const resp = await fetch(url);
        const data = await resp.json();

        if (!data.routes || data.routes.length === 0) {
            res.status(404).json({ error: "No se encontró ruta OSRM" });
            return;
        }

        const route = data.routes[0];

        res.status(200).json({
            coords: route.geometry.coordinates.map(([lon, lat]) => ({ lat, lon })),
            distance_m: route.distance,
            distance_km: (route.distance / 1000).toFixed(3),
            duration_min: (route.duration / 60).toFixed(1),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error interno en cálculo de ruta" });
    }
};
