import type {OpenMapController} from "$lib/fluti/widgets/openMap/OpenMap";

export interface OpenMapProps {

    controller: OpenMapController

    zoom: number;
    markers?: OpenMapMarker[];
    onSelected: (item: OpenMapMarker) => void;
    onMouseover: (item: OpenMapMarker) => void;
}

export interface OpenMapMarker {
    id: string;
    x: number;
    y: number;
}