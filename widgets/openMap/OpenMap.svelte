<script lang="ts">
    import type {OpenMapMarker, OpenMapProps} from "./OpenMap.types";
    import 'leaflet/dist/leaflet.css'
    import RBush from 'rbush';
    import {getMapMarkerHtml, useOpenMap} from "./OpenMap";
    import {flutiTheme} from "$lib/fluti/themes/themeProperties";

    let {
        controller = useOpenMap(),
        zoom = $bindable(1),
        viewPos = [53, 18],
        markers = $bindable([]),
        onClick = (m, e) => {
        },
        onMouseHover = (a, b) => {
        },
        style,
        onMouseover = () => {
        },
        onSelected
    }: OpenMapProps = $props()

    let map: any;
    let markersCluster: any;
    let L: any;
    let mapContainer: HTMLElement;
    const rBush = new RBush();
    let displayedMarkers = $derived.by(() => markers)

    let previousZoom = zoom;

    $effect(() => {
        zoom

        let difference = zoom - previousZoom;
        previousZoom = zoom;
        if (map) {
            let mapZoom = map.getZoom();
            if (difference > 0)
                map.setZoom(mapZoom + 1)
            else
                map.setZoom(mapZoom - 1)
        }
    })

    $effect(() => {
        displayedMarkers
        loadMap();
    })

    $effect(() => {
        markers
        if (!map)
            return
        if (!markersCluster)
            return;
        markersCluster.clearLayers();


        map.flyTo([markers[0].y, markers[0].x], 12, {
            duration: 3,
            easeLinearity: 0.25,
        });
    })

    let mapMoveEnabled = false;

    function handleMapMove() {
        if (!map)
            return

        if (map.getZoom() <= 15) {
            if (mapMoveEnabled) {
                mapMoveEnabled = false;
                let all = rBush.all();
                all.forEach(item => {
                    markersCluster.addLayer(item.marker);
                })
            }
            return;
        }
        mapMoveEnabled = true;
        const mapCenter = map.getCenter(); // Assuming `map` is your Leaflet map instance
        const bounds = map.getBounds();

        const proportion = 1.4;
        const halfLatDiff = (bounds.getNorth() - bounds.getSouth()) / proportion;
        const halfLngDiff = (bounds.getEast() - bounds.getWest()) / proportion;
        const searchRadius = Math.min(halfLatDiff, halfLngDiff);

        const minX = mapCenter.lng - searchRadius;
        const minY = mapCenter.lat - searchRadius;
        const maxX = mapCenter.lng + searchRadius;
        const maxY = mapCenter.lat + searchRadius;

        const nearbyItems = rBush.search({minX, minY, maxX, maxY});
        markersCluster.clearLayers();
        nearbyItems.forEach(item => {
            markersCluster.addLayer(item.marker);
        });

    }


    async function loadMap() {
        L = await import('leaflet');
        await import('leaflet.markercluster');
        controller.L = L;
        if (map === undefined) {
            map = L.map(mapContainer, {
                zoomControl: false,
                minZoom: zoom
            }).setView(viewPos, Number(zoom));
            controller.map = map;
            map.on('zoomend', function () {
            });
            let themes =
                [
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",  // 0
                    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",  // 1
                    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",  // 2
                    "https://stamen-tiles.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",  //3
                    "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",  //4
                    "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",  //5
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",  //6
                    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",  //7
                    "https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=YOUR_API_KEY",  //8
                    "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=YOUR_GOOGLE_API_KEY"  //9
                ];

            L.tileLayer(themes[3], {
                keepBuffer: 6,
                updateWhenZooming: false,
                updateWhenIdle: true,
                reuseTiles: true,
                zoomAnimation: true,
                fadeAnimation: false,
                edgeBufferTiles: 5,
                continuousWorld: true,
                tileSize: 128,
                attribution: '',
            }).addTo(map);

            const defaultStyle = {
                color: flutiTheme.background.accent,
                weight: 2,
                opacity: 0.4,
                fillColor: flutiTheme.background.accent,
                fillOpacity: 0.2
            };

            const hoverStyle = {
                fillOpacity: 0.4 // Make it lighter on hover
            };


            fetch('/poland.geojson')
                .then(response => response.json())
                .then(data => {
                    L.geoJSON(data, {
                        style: defaultStyle,
                        onEachFeature: (feature, layer) => {
                            layer.on({
                                click: (e) => onClick(map, e),
                                mouseover: (e) => {
                                    if (onMouseHover(e) === false)
                                        return
                                    e.target.setStyle(hoverStyle)
                                },
                                mouseout: (e) => e.target.setStyle(defaultStyle)
                            });
                        }
                    }).addTo(map);
                });
            // L.control.zoom({
            //     position: 'bottomright'
            // }).addTo(map);
            // L.control.scale({position: "bottomright"}).addTo(map);
            map.on('zoomend moveend', handleMapMove);
        }

        if (L.MarkerClusterGroup) {

            markersCluster = new L.MarkerClusterGroup(
                {
                    maxClusterRadius: 30,
                    showCoverageOnHover: false,
                    disableClusteringAtZoom: 15,
                    // iconCreateFunction: function (cluster) {
                    //     // Get the number of markers in this cluster
                    //     const count = cluster.getChildCount();
                    //
                    //     // Check if the zoom level is less than 15 and cluster size is less than or equal to 10
                    //     if (map.getZoom() > 15 && count <= 10) {
                    //         const markers = cluster.getAllChildMarkers();
                    //         cluster.remove(); // Remove this cluster from the map
                    //         markers.forEach(marker => {
                    //             markersCluster.addLayer(marker);
                    //         });
                    //         return null; // No icon, we handle manually unclustering
                    //     }
                    //
                    //     // Default behavior for clusters
                    //     return L.divIcon({
                    //         html: `<div class="my-cluster-icon">${count}</div>`,
                    //         className: 'my-custom-cluster-icon',
                    //         iconSize: [40, 40]
                    //     });
                    // }
                    // iconCreateFunction: function (cluster) {
                    //     // Customize the cluster icon
                    //     const count = cluster.getChildCount();
                    //     return L.divIcon({
                    //         html: `<div class="my-cluster-icon">${count}</div>`,
                    //         className: 'my-custom-cluster-icon',
                    //         iconSize: [40, 40] // size of the icon
                    //     });
                    // },
                }
            );
            await updatePointser(markersCluster);
        }

    }

    async function updatePointser(markersCluster: any) {

        let brushItems = []
        for (let item of displayedMarkers) {
            let icon = L.divIcon({
                html: getMapMarkerHtml(item),
                className: 'custom-icon-wrapper',
                iconSize: [100, 50]
            })
            let marker = L.marker([item.y, item.x],
                {
                    icon: icon
                })
            // marker.bindPopup(getMapMarkerHtml(item));
            // marker.openPopup();
            marker.on('click', function (e) {
                onSelected(item)
            });
            marker.on('mouseover', function (e) {
                onMouseover(item);
            });
            markersCluster.addLayer(marker);
            const latlng = marker.getLatLng();
            let brushItem = {
                minX: latlng.lng,
                minY: latlng.lat,
                maxX: latlng.lng,
                maxY: latlng.lat,
                marker: marker,
            };
            brushItems.push(brushItem)
        }
        rBush.load(brushItems);
        map.addLayer(markersCluster);
    }

</script>


<div id="map" style={style} bind:this={mapContainer}></div>

<style>
    :global(.custom-icon) {
        background: var(--bg-100);
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-weight: 600;
        font-size: 1.3em;
        padding: 0.2em;
        border-radius: 0.5em;
        background: var(--bg-accent);
        color: var(--bg-100);

        border: 2px solid var(--bg-accent);
        position: absolute;
        transition: scale, 0.2s ease;

    }

    :global(.custom-icon-wrapper) {
        height: 100%;
        width: 100%;
    }

    :global(.custom-icon:hover) {
        font-size: 1.8em;
        scale: 1.2;
        background: var(--bg-100);
        color: var(--bg-accent);
    }


    #map {
        height: 100%;
        width: 100%;
        z-index: 1;
        background: var(--bg-primary);
    }
</style>

<!-- Map container -->
