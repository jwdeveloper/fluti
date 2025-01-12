
export interface OpenMapProps
{
    zoom: number;
    markers?: OpenMapMarker[];
    onSelected: (item: OpenMapMarker) => void;
    onMouseover: (item: OpenMapMarker) => void;
}

export interface OpenMapMarker
{
    id: string;
    x: number;
    y: number;
}