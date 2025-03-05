import {removePolishCharacters} from "$lib/fluti/utils/formatting";

export class OpenMapController {
    map: any;
    L: any

    sateliteLayer: any;
    cityLayer: any;

    isLoaded() {
        return this.map !== undefined
    }

    zoomIn() {
        if (!this.isLoaded()) return;
        this.map.zoomIn();
    }

    zoomOut() {
        if (!this.isLoaded()) return;
        this.map.zoomOut();
    }

    setZoom(zoom: number) {
        if (!this.isLoaded())
            return
        this.map.setZoom(zoom);

    }

    async showCity(regionName: any, cityName: any) {
        let country = 'poland'
        let region = removePolishCharacters(regionName)
        let city = removePolishCharacters(cityName)

        let response = await fetch(`/geojson/${country}/${region}/${city}/data.geojson`);
        let json = await response.json();

        if (this.cityLayer) {
            this.map.removeLayer(this.cityLayer);
        }

        this.cityLayer = this.L.geoJSON(json, {
            onEachFeature: (feature, layer) => {
            }
        }).addTo(this.map);
    }

    removeCity() {
        if (this.cityLayer) {
            this.map.removeLayer(this.cityLayer);
        }
    }

    async setPosition(pos: number[], zoom: number = 7): Promise<void> {
        if (!this.isLoaded()) return;

        return new Promise((resolve) => {
            this.map.once("moveend", resolve); // ✅ Resolves when animation is done
            this.map.flyTo(pos, zoom, {
                duration: 0.5,
                easeLinearity: 0.25,
            });
        });
    }


    showSatelite(shouldShow: boolean) {

        if (shouldShow)
            this.sateliteLayer = this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(this.map);
        else {
            if (this.sateliteLayer) {
                this.map.removeLayer(this.sateliteLayer); // ✅ Removes the layer from the map
                this.sateliteLayer = null; // ✅ Clears reference
            }
        }
    }
}


export function useOpenMap() {
    return new OpenMapController()
}


export function getMapMarkerHtml(item: any): string {

    let price = item.price + "";

    if (item.price >= 1_000_000) {
        // Format price in millions
        price = (item.price / 1_000_000).toFixed(1) + " mln";
    } else if (item.price >= 1_000) {
        // Format price in thousands
        price = (item.price / 1_000).toFixed(1) + "k";
    }
    return `
    <div>
        <div class="custom-icon">${price} zł<div>
    </div>
    `;
}