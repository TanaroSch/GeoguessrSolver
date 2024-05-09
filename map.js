var map = L.map('map');
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([0, 0]).addTo(map);

window.addEventListener('message', function(event) {
    if (event.data.type === 'updateMap') {
        const { lat, lon, country } = event.data;
        marker.setLatLng([lat, lon]);
        map.setView([lat, lon], 5);

        fetch(`https://nominatim.openstreetmap.org/search?country=${country}&format=json&polygon_geojson=1`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const countryGeoJSON = data[0].geojson;
                    L.geoJSON(countryGeoJSON).addTo(map);
                    map.fitBounds(L.geoJSON(countryGeoJSON).getBounds());
                }
            });
    }
});