"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon issue for Next.js SSR
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapComponentProps {
  lat: number;
  lon: number;
  setLat: (lat: number) => void;
  setLon: (lon: number) => void;
}

function LocationMarker({ lat, lon, setLat, setLon }: MapComponentProps) {
  useMapEvents({
    click(e) {
      setLat(parseFloat(e.latlng.lat.toFixed(2)));
      let lng = e.latlng.lng;
      lng = (lng + 180) % 360 - 180; // Wrap longitude
      setLon(parseFloat(lng.toFixed(2)));
    },
  });

  return lat !== null ? <Marker position={[lat, lon]} icon={icon} /> : null;
}

export default function MapComponent({ lat, lon, setLat, setLon }: MapComponentProps) {
  // Enforce client-side rendering protection
  if (typeof window === "undefined") return null;

  return (
    <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-slate-700/50 shadow-inner z-0">
      <MapContainer
        center={[lat || 33.00, lon || 162.50]}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="Source: Esri et al"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <LocationMarker lat={lat} lon={lon} setLat={setLat} setLon={setLon} />
      </MapContainer>
    </div>
  );
}
