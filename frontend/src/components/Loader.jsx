import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

export const Loader = ({ message = "Analyzing criteria & generating questions..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full p-8 text-center animate-fade-in-up">
      <div className="relative mb-8 flex items-center justify-center">
        {/* Glowing background halo */}
        <div className="absolute w-32 h-32 bg-brand-600/30 rounded-full blur-2xl animate-pulse-slow" />
        
        {/* Double orbit spinner rings */}
        <div className="w-24 h-24 rounded-full border-4 border-dashed border-brand-500/30 animate-spin-slow" />
        <div className="absolute w-20 h-20 rounded-full border-4 border-dotted border-indigo-400/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
        
        {/* Core icon */}
        <div className="absolute p-4 bg-brand-950/80 rounded-full border border-brand-500/40 flex items-center justify-center shadow-lg shadow-brand-500/10">
          <Cpu className="w-8 h-8 text-brand-400 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold font-sans tracking-wide text-white mb-2 flex items-center justify-center gap-2">
        Consulting AI Interviewer
        <Sparkles className="w-5 h-5 text-indigo-400 animate-bounce" />
      </h3>
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
        {message}
      </p>
      
      <div className="mt-6 flex items-center gap-1.5 justify-center">
        <span className="w-2.5 h-2.5 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2.5 h-2.5 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

export default Loader;
