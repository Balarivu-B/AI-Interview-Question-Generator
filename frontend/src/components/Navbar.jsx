import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Cpu, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-brand-600/20 rounded-lg border border-brand-500/30 flex items-center justify-center">
          <Cpu className="w-6 h-6 text-brand-500 animate-pulse-slow" />
        </div>
        <Link to="/" className="flex flex-col">
          <span className="font-bold text-lg tracking-wider text-white font-sans flex items-center gap-1.5">
            INTERVIEW<span className="text-brand-500">AI</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Question Engine</span>
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-200">{user.email}</span>
            <span className="text-[10px] text-brand-400 font-semibold tracking-wider uppercase">Active Candidate</span>
          </div>
          
          <div className="h-9 w-px bg-white/10 hidden md:block" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/30 rounded-lg text-xs font-semibold transition-all duration-200"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
