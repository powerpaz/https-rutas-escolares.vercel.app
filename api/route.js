export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { origin, dest } = req.body || {};
        if (!origin || !dest) {
            return res.status(400).json({ error: "Missing coordinates" });
        }

        function utmToLatLon(x, y, zone = 17) {
            const a = 6378137.0;
            const eccSquared = 0.00669438;
            const k0 = 0.9996;
            const eccPrimeSquared = eccSquared / (1 - eccSquared);

            const xAdj = x - 500000.0;
            const yAdj = y - 10000000.0;

            const M = yAdj / k0;
            const mu = M / (a * (1 - eccSquared/4 - 3*eccSquared*eccSquared/64));

            const e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));

            const phi1Rad =
                mu +
                ((3 * e1) / 2 - (27 * e1**3) / 32) * Math.sin(2 * mu) +
                ((21 * e1**2) / 16 - (55 * e1**4) / 32) * Math.sin(4 * mu);

            const N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad)**2);
            const T1 = Math.tan(phi1Rad)**2;
            const C1 = eccPrimeSquared * Math.cos(phi1Rad)**2;
            const R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad)**2, 1.5);
            const D = xAdj / (N1 * k0);

            let lat =
                phi1Rad -
                (N1 * Math.tan(phi1Rad)) /
                    R1 *
                    ((D**2) / 2 -
                        (5 + 3 * T1 + 10 * C1 - 4 * C1**2) * D**4 / 24);

            let lon =
                (D -
                    (1 + 2 * T1 + C1) * D**3 / 6) /
                Math.cos(phi1Rad);

            lon = lon * (180 / Math.PI) + (zone - 30) * 6 - 183;
            lat = lat * (180 / Math.PI);

            return { lat, lon };
        }

        const o = utmToLatLon(origin.x, origin.y);
        const d = utmToLatLon(dest.x, dest.y);

        const url = `https://router.project-osrm.org/route/v1/driving/${o.lon},${o.lat};${d.lon},${d.lat}?overview=full&geometries=geojson`;
        const osrmRes = await fetch(url);
        const osrmData = await osrmRes.json();

        if (!osrmData.routes?.length) {
            return res.status(404).json({ error: "No route found" });
        }

        const route = osrmData.routes[0];

        return res.status(200).json({
            coords: route.geometry.coordinates.map(([lon, lat]) => ({ lat, lon })),
            distance_km: route.distance / 1000,
            duration_min: (route.duration / 60).toFixed(1),
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error", details: err.message });
    }
}