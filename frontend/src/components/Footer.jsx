import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full mt-auto py-6 border-t border-white/5 text-center text-xs text-gray-500">
      <p>© {new Date().getFullYear()} InterviewAI. Powered by FastAPI, Supabase, and OpenAI.</p>
    </footer>
  );
};

export default Footer;
