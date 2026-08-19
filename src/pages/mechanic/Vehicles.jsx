import React, { useState, useEffect } from 'react';
import { Car } from 'lucide-react';
import VehicleCard from '../../components/VehicleCard';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { vehicleService } from '../../services/vehicleService';

export default function MechanicVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehicleService.getVehicles().then((data) => {
      setVehicles(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading message="Loading customer vehicles..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Assigned Customer Vehicles</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Authorized technical view of customer vehicles in workshop
        </p>
      </div>

      {vehicles.length === 0 ? (
        <EmptyState icon={Car} title="No vehicles assigned" description="No customer vehicles currently in garage." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} insuranceStatus="Active" />
          ))}
        </div>
      )}
    </div>
  );
}
