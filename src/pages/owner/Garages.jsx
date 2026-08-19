import React, { useState, useEffect } from 'react';
import { MapPin, Star, Phone, Navigation, Wrench } from 'lucide-react';
import GarageMap from '../../components/GarageMap';
import Loading from '../../components/Loading';
import ErrorState from '../../components/ErrorState';
import { garageService } from '../../services/garageService';

export default function Garages() {
  const [garages, setGarages] = useState([]);
  const [selectedGarage, setSelectedGarage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchGarages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await garageService.getGarages();
      setGarages(data);
      if (data.length > 0) setSelectedGarage(data[0]);
    } catch (err) {
      setError(err.message || 'Failed to load garage locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGarages();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Nearby Garages & Workshops</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Locate trusted local service centers, view ratings, services, and get driving directions
        </p>
      </div>

      {loading ? (
        <Loading message="Loading garage locations on map..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchGarages} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Interactive Leaflet Map */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                  Interactive OpenStreetMap Directory
                </span>
                <span className="text-xs text-slate-500 font-semibold">{garages.length} Workshops Found</span>
              </div>
              <GarageMap garages={garages} selectedGarage={selectedGarage} />
            </div>
          </div>

          {/* Right Col: Garage List Cards */}
          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Garages Directory</h3>
            {garages.map((garage) => (
              <div
                key={garage.id}
                onClick={() => setSelectedGarage(garage)}
                className={`p-5 rounded-2xl border transition cursor-pointer ${
                  selectedGarage?.id === garage.id
                    ? 'bg-brand-50/80 border-brand-300 ring-2 ring-brand-500/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-brand-200 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{garage.name}</h4>
                  <span className="flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 text-xs font-extrabold rounded-md border border-amber-200/80 shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 mr-1" />
                    {garage.rating}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mb-3 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{garage.address}</span>
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {garage.services?.map((service, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-semibold rounded-md"
                    >
                      {service}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {garage.phone}
                  </span>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${garage.latitude},${garage.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
