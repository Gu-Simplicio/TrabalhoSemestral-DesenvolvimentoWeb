import { FACULDADES } from "./FACULDADES.js";

const MAP_ERROR_MESSAGE = "erro ao carregar mapa";
const MAP_API_TIMEOUT = 5000;
const mapContainer = document.querySelector("#map-container");

let hasFinished = false;

function showMapError() {
    if (hasFinished) {
        return;
    }

    hasFinished = true;
    mapContainer.replaceChildren();

    const errorHeading = document.createElement("h1");
    errorHeading.className = "map-error";
    errorHeading.textContent = MAP_ERROR_MESSAGE;
    mapContainer.append(errorHeading);
}

function initializeMap() {
    if (hasFinished) {
        return;
    }

    try {
        if (!window.google?.maps || FACULDADES.length === 0) {
            throw new Error("A API do mapa ou os dados das faculdades não estão disponíveis.");
        }

        const firstFaculty = FACULDADES[0];
        const mapElement = document.createElement("div");
        mapElement.id = "map";
        mapContainer.replaceChildren(mapElement);

        const map = new window.google.maps.Map(mapElement, {
            center: firstFaculty.localizacao,
            zoom: 15,
        });

        for (const faculdade of FACULDADES) {
            new window.google.maps.Marker({
                map,
                position: faculdade.localizacao,
                title: faculdade.nome,
            });
        }

        hasFinished = true;
    } catch (error) {
        console.error("Falha ao inicializar o mapa:", error);
        showMapError();
    }
}

function startTimeout() {
    const elapsedTime = Date.now() - window.mapApiLoadStartedAt;
    const remainingTime = Math.max(0, MAP_API_TIMEOUT - elapsedTime);

    window.setTimeout(() => {
        if (!window.mapApiLoaded) {
            showMapError();
        }
    }, remainingTime);
}

window.addEventListener("map-api-loaded", initializeMap, { once: true });
window.addEventListener("map-api-error", showMapError, { once: true });

startTimeout();

if (window.mapApiFailed) {
    showMapError();
} else if (window.mapApiLoaded) {
    initializeMap();
}
