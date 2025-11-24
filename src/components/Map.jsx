import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

function Map() {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // éviter réinitialisation
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://api.maptiler.com/maps/streets/style.json?key=c07uRKBhBpU3cPlwLKmw", 
      center: [-23.3518095, 43.6737757], // Tuléar, Madagascar
      zoom: 14,
      pitch: 0,
      bearing: 0,
    });

    // Ajouter un bouton de navigation (zoom, rotation)
    mapRef.current.addControl(new maplibregl.NavigationControl(), "top-right");

    // Quand on clique → bascule en 3D et place un marqueur
    mapRef.current.on("click", (e) => {
      mapRef.current.easeTo({
        pitch: 60,
        bearing: 30,
        zoom: 16,
        center: e.lngLat,
        duration: 2000,
      });

      new maplibregl.Marker({ color: "red" })
        .setLngLat(e.lngLat)
        .addTo(mapRef.current);
    });

    // Ajouter couche 3D bâtiments quand le style est chargé
    mapRef.current.on("load", () => {
      mapRef.current.addLayer({
        id: "3d-buildings",
        source: "openmaptiles",
        "source-layer": "building",
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            16, ["get", "render_height"]
          ],
          "fill-extrusion-base": ["get", "render_min_height"],
          "fill-extrusion-opacity": 0.6
        }
      });
    });
  }, []);

  return (
    <div
      ref={mapContainer}
      className="w-full h-screen"
    />
  );
}

export default Map;
