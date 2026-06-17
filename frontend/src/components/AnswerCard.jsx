import React from 'react';

export const AnswerCard = ({ answer }) => {
  return (
    <div className="mt-4 p-4 bg-brand-950/20 border border-brand-500/15 rounded-xl animate-fade-in-up">
      <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest block mb-1">
        Model Answer Details
      </span>
      <p className="text-xs text-gray-300 leading-relaxed font-sans">
        {answer}
      </p>
    </div>
  );
};

export default AnswerCard;
