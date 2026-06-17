import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, User2, BookOpen } from 'lucide-react';

export const Sidebar = () => {
  const links = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/history', label: 'History', icon: History },
    { to: '/profile', label: 'My Profile', icon: User2 },
  ];

  return (
    <aside className="w-full md:w-64 glass-panel border-r border-white/5 md:min-h-[calc(100vh-73px)] p-4 flex flex-row md:flex-col gap-2 shrink-0 md:justify-start justify-around">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full md:w-auto ${
                isActive
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="md:inline hidden">{link.label}</span>
          </NavLink>
        );
      })}
      
      <div className="mt-auto hidden md:block w-full">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-brand-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Preparation Tip</h4>
          </div>
          <p className="text-[11px] leading-normal text-gray-400">
            For technical questions, always practice explaining your thought process out loud before reading the model answer.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
