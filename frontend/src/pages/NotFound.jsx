import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6 max-w-md mx-auto min-h-[500px]">
      <div className="p-4 bg-amber-500/10 rounded-full border border-amber-500/20 text-amber-400">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-white">Page Not Found</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          The dashboard link or results pack you are seeking could not be located.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold border border-brand-500/30 transition shadow-lg shadow-brand-500/10"
      >
        Return to Dashboard
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default NotFound;
