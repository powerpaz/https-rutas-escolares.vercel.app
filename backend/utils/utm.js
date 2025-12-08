
// Conversión UTM → Lat/Lon WGS84 (EPSG:32717 zona 17S)
function utmToLatLon(x, y, zone = 17, hemisphere = "S") {
    const a = 6378137.0;
    const eccSquared = 0.00669438;
    const k0 = 0.9996;

    const eccPrimeSquared = eccSquared / (1 - eccSquared);

    let e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
    let xAdj = x - 500000.0;
    let yAdj = hemisphere === "S" ? y - 10000000.0 : y;

    let m = yAdj / k0;
    let mu = m / (
        a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * Math.pow(eccSquared, 3) / 256)
    );

    let phi1Rad = mu
        + (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32) * Math.sin(2 * mu)
        + (21 * e1 * e1 / 16 - 55 * Math.pow(e1, 4) / 32) * Math.sin(4 * mu)
        + (151 * Math.pow(e1, 3) / 96) * Math.sin(6 * mu);

    let n1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
    let t1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
    let c1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
    let r1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
    let d = xAdj / (n1 * k0);

    let lat = phi1Rad
        - (n1 * Math.tan(phi1Rad) / r1) * (
            d * d / 2
            - (5 + 3 * t1 + 10 * c1 - 4 * c1 * c1 - 9 * eccPrimeSquared) * Math.pow(d, 4) / 24
            + (61 + 90 * t1 + 298 * c1 + 45 * t1 * t1 - 252 * eccPrimeSquared - 3 * c1 * c1) * Math.pow(d, 6) / 720
        );

    lat = lat * 180 / Math.PI;

    let lon = (d
        - (1 + 2 * t1 + c1) * Math.pow(d, 3) / 6
        + (5 - 2 * c1 + 28 * t1 - 3 * c1 * c1 + 8 * eccPrimeSquared + 24 * t1 * t1) * Math.pow(d, 5) / 120
    ) / Math.cos(phi1Rad);
    lon = lon * 180 / Math.PI;

    let lonOrigin = (zone - 1) * 6 - 180 + 3;
    lon = lonOrigin + lon;

    return { lat, lon };
}

module.exports = { utmToLatLon };
