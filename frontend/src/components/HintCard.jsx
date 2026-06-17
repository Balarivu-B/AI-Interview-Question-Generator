import React from 'react';

export const HintCard = ({ hint }) => {
  return (
    <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl animate-fade-in-up">
      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block mb-1">
        Learning Hint
      </span>
      <p className="text-xs text-gray-300 leading-relaxed italic">
        "{hint}"
      </p>
    </div>
  );
};

export default HintCard;
