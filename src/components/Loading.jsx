import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[250px] w-full">
      <Loader2 className="w-9 h-9 text-brand-600 animate-spin mb-3" />
      <p className="text-sm text-slate-500 font-medium">{message}</p>
    </div>
  );
}
