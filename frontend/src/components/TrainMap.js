import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TrainMap = ({ 
  vehicles = [], 
  center = [42.3601, -71.0589], 
  zoom = 12 
}) => {
  return (
    <div className="flex-1 h-[600px]">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
        />
        {vehicles.map((train) => (
          <Marker
            key={train.id}
            position={[
              train.attributes.latitude,
              train.attributes.longitude,
            ]}
          >
            <Popup>
              Train {train.attributes.label}
              <br />
              Status: {train.attributes.current_status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrainMap;
