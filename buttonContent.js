var url = "";

var addButton = function(){
	a = document.getElementsByClassName("header__items")[0];
	if(a){
		b = document.createElement("button");
		b.id = "google-maps-button";
		b.innerText = "Show on map";
		b.addEventListener("click", () => {
			window.open(url);
		});
		b.style = "position:relative; top:12px; font-weight: 600;";
		a.appendChild(b);
		setInterval(
			() => chrome.runtime.sendMessage({action: "getUrl"}, function(response) {
				url = response.url;
			}), 100
		);
	}
}

window.onload = addButton;

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if(request.action === "setUrl"){
			url = request.url;
		}
	}
);