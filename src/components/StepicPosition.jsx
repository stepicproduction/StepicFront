import React, { useEffect, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: -23.3518095,
  lng: 43.6737757,
};

function StepicPosition() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      // Crée un marker avancé
      new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef.current,
        position: center,
        title: "Stepic Madagascar",
      });
    }
  }, [mapRef]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyBfVShtbJhR0n31eaCjDhC4mhWbh6jaRt4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={18}
        tilt={45} // effet 3D
        onLoad={(map) => (mapRef.current = map)}
      />
    </LoadScript>
  );
}

export default StepicPosition;
