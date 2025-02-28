export class OpenMapController {
    map: any;
    L: any

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

    setPosition(pos: number[], zoom: number = 7) {
        if (!this.isLoaded())
            return
        this.map.flyTo(pos, zoom, {
            duration: 0.5,
            easeLinearity: 0.25,
        });

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