document.addEventListener('DOMContentLoaded', function() {
    var mapLink = document.getElementById('mapLink');
    var locationDetails = document.getElementById('locationDetails');
    var mapImage = document.getElementById('mapImage');

    function updatePopup() {
        chrome.storage.local.get(['url', 'location'], function(data) {
            if (data.url) {
                mapLink.href = data.url;
            }
            if (data.location) {
                const { town, district, state, region, country, lat, lon } = data.location;
                locationDetails.innerHTML = `Town: ${town || 'N/A'}<br>District: ${district || 'N/A'}<br>State: ${state || 'N/A'}<br>Region: ${region || 'N/A'}<br>Country: ${country || 'N/A'}`;

                if (lat && lon) {
                    const mapUrl = `https://maps.wikimedia.org/osm-intl/${lat}/${lon}/300x200.png`;
                    mapImage.src = mapUrl;
                }
            }
        });
    }

    updatePopup();

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        updatePopup();
    });
});