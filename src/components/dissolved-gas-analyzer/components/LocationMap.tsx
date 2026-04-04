"use client";

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet icon paths in Next.js environment
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapUpdater({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 2);
  }, [lat, lng, map]);
  return null;
}

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationMap({ lat, lng, onLocationSelect }: { lat: number, lng: number, onLocationSelect?: (lat: number, lng: number) => void }) {
  return (
    <div className="w-[300px] h-[200px] mt-4 border border-gray-700 z-0">
      <MapContainer 
        center={[lat, lng]} 
        zoom={2} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='Source: Esri et al'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
        <Marker position={[lat, lng]} />
        <MapUpdater lat={lat} lng={lng} />
        {onLocationSelect && <MapEvents onLocationSelect={onLocationSelect} />}
      </MapContainer>
    </div>
  );
}
