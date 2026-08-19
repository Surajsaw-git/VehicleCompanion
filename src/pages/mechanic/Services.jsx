import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import ServiceCard from '../../components/ServiceCard';
import Loading from '../../components/Loading';
import EmptyState from '../../components/EmptyState';
import { serviceRecordService } from '../../services/serviceRecordService';

export default function MechanicServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceRecordService.getServiceRecords().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <Loading message="Loading garage service history..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Garage Service Logs</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Archive of all completed service jobs</p>
      </div>

      {services.length === 0 ? (
        <EmptyState icon={FileText} title="No service records" description="No service records logged by garage yet." />
      ) : (
        <div className="space-y-4">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      )}
    </div>
  );
}
