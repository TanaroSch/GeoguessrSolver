url = "";

chrome.webRequest.onCompleted.addListener(
    function(details) {
        if (details.url.includes("GeoPhotoService.GetMetadata") && details.initiator == "https://www.geoguessr.com") {
            fetch(details.url)
                .then(response => response.text())
                .then(text => {
                    const matches = [...text.matchAll(/null,null,-?\d{1,3}\.\d{11,14},-?\d{1,3}\.\d{11,14}/g)];
                    if (matches.length !== 0) {
                        const coordinates = matches[0][0].substring(10);
                        const [lat, lon] = coordinates.split(',');
                        const url = `http://maps.google.com/?q=${coordinates}`;
                        console.log(url);
                        chrome.storage.local.set({ url: url });

                        // Make a reverse geocoding request using OpenStreetMap Nominatim API
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
            .then(response => response.json())
            .then(data => {
                if (data.address) {
                    const { city, county, state, country } = data.address;
                    const stateValue = state || (data.address.state_district || '');
                    const regionValue = data.address.state || data.address.province || '';
                    chrome.storage.local.set({ location: { town: city, district: county, state: stateValue, region: regionValue, country, lat, lon } });
                }
            });
                    }
                });
        }
    },
    {
        urls: ["*://maps.googleapis.com/*"]
    }
);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.action === "getUrl"){
			sendResponse({url: url});
	  	}
	}
); 