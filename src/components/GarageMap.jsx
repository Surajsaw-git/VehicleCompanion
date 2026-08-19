import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Phone, Star, Navigation } from 'lucide-react';

// Fix Leaflet marker icon paths in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function GarageMap({ garages = [], selectedGarage = null }) {
  const defaultCenter = [20.5937, 78.9629]; // India center fallback
  const firstGarageCoords = garages.length > 0 ? [garages[0].latitude, garages[0].longitude] : defaultCenter;
  const center = selectedGarage 
    ? [selectedGarage.latitude, selectedGarage.longitude] 
    : firstGarageCoords;

  return (
    <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
      <MapContainer
        center={center}
        zoom={selectedGarage ? 13 : 5}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {garages.map((garage) => (
          <Marker
            key={garage.id}
            position={[garage.latitude, garage.longitude]}
          >
            <Popup>
              <div className="p-1 min-w-[200px]">
                <h4 className="font-bold text-slate-900 text-sm mb-1">{garage.name}</h4>
                <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500 inline" />
                  {garage.address}
                </p>
                <div className="flex items-center space-x-2 text-xs mb-2">
                  <span className="flex items-center text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                    {garage.rating}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">{garage.phone}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {garage.services?.slice(0, 3).map((s, idx) => (
                    <span key={idx} className="bg-brand-50 text-brand-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {s}
                    </span>
                  ))}
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${garage.latitude},${garage.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center space-x-1.5 w-full py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Get Directions</span>
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
