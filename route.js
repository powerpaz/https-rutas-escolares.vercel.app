// API Route para calcular rutas usando OSRM
// Este archivo es opcional - el frontend ahora puede funcionar sin él

export default async function handler(req, res) {
    // Habilitar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { origin, dest, zone = 17, southern = true } = req.body || {};

        if (!origin || !dest) {
            return res.status(400).json({ error: 'Missing coordinates (origin, dest required)' });
        }

        // Validar coordenadas
        if (!origin.x || !origin.y || !dest.x || !dest.y) {
            return res.status(400).json({ error: 'Invalid coordinates format. Expected {x, y}' });
        }

        // Conversión UTM -> Lat/Lon (WGS84)
        function utmToLatLon(x, y, utmZone = 17, isSouthern = true) {
            const a = 6378137.0;
            const f = 1 / 298.257223563;
            const k0 = 0.9996;

            const e = Math.sqrt(2 * f - f * f);
            const e2 = e * e;
            const ePrime2 = e2 / (1 - e2);

            const xAdj = x - 500000;
            const yAdj = isSouthern ? y - 10000000 : y;

            const M = yAdj / k0;
            const mu = M / (a * (1 - e2/4 - 3*e2*e2/64 - 5*e2*e2*e2/256));

            const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));

            const phi1 =
                mu +
                (3*e1/2 - 27*Math.pow(e1,3)/32) * Math.sin(2*mu) +
                (21*e1*e1/16 - 55*Math.pow(e1,4)/32) * Math.sin(4*mu) +
                (151*Math.pow(e1,3)/96) * Math.sin(6*mu);

            const N1 = a / Math.sqrt(1 - e2 * Math.sin(phi1) ** 2);
            const T1 = Math.tan(phi1) ** 2;
            const C1 = ePrime2 * Math.cos(phi1) ** 2;
            const R1 = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(phi1) ** 2, 1.5);
            const D = xAdj / (N1 * k0);

            let lat =
                phi1 -
                (N1 * Math.tan(phi1) / R1) *
                (D*D/2 -
                 (5 + 3*T1 + 10*C1 - 4*C1*C1 - 9*ePrime2) * Math.pow(D,4)/24 +
                 (61 + 90*T1 + 298*C1 + 45*T1*T1 - 252*ePrime2 - 3*C1*C1) * Math.pow(D,6)/720);

            const lon0 = ((utmZone - 1) * 6 - 180 + 3) * Math.PI / 180;
            let lon =
                lon0 +
                (D -
                 (1 + 2*T1 + C1) * Math.pow(D,3)/6 +
                 (5 - 2*C1 + 28*T1 - 3*C1*C1 + 8*ePrime2 + 24*T1*T1) * Math.pow(D,5)/120) /
                Math.cos(phi1);

            lat = lat * 180 / Math.PI;
            lon = lon * 180 / Math.PI;

            return { lat, lon };
        }

        // Convertir coordenadas
        const o = utmToLatLon(origin.x, origin.y, zone, southern);
        const d = utmToLatLon(dest.x, dest.y, zone, southern);

        // Validar que las coordenadas convertidas son válidas
        if (isNaN(o.lat) || isNaN(o.lon) || isNaN(d.lat) || isNaN(d.lon)) {
            return res.status(400).json({ 
                error: 'Invalid UTM coordinates - conversion failed',
                origin: o,
                dest: d
            });
        }

        // Llamada a OSRM público
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${o.lon},${o.lat};${d.lon},${d.lat}?overview=full&geometries=geojson`;

        const osrmRes = await fetch(osrmUrl, {
            headers: {
                'User-Agent': 'MINEDUC-Ecuador-RutasEscolares/1.0'
            }
        });

        if (!osrmRes.ok) {
            throw new Error(`OSRM returned status ${osrmRes.status}`);
        }

        const osrmData = await osrmRes.json();

        if (!osrmData.routes || !osrmData.routes.length) {
            return res.status(404).json({ 
                error: 'No route found between points',
                origin: o,
                dest: d
            });
        }

        const route = osrmData.routes[0];

        return res.status(200).json({
            success: true,
            coords: route.geometry.coordinates.map(([lon, lat]) => ({ lat, lon })),
            distance_km: (route.distance / 1000).toFixed(2),
            duration_min: (route.duration / 60).toFixed(1),
            origin_latlon: o,
            dest_latlon: d
        });

    } catch (err) {
        console.error('Error in /api/route:', err);
        return res.status(500).json({ 
            error: 'Internal server error', 
            details: err.message 
        });
    }
}
