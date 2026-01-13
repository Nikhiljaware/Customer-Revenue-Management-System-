
import React from 'react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (view: ViewType) => void;
  onProfileClick?: () => void;
  user: {
    name: string;
    role: string;
    avatar: string;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onProfileClick, user }) => {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Overview', icon: '📊' },
    { id: 'customers' as ViewType, label: 'Customers', icon: '👥' },
    { id: 'revenue' as ViewType, label: 'Finance', icon: '💰' },
    { id: 'insights' as ViewType, label: 'AI Insights', icon: '✨' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen sticky top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-blue-400">RevGenius</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Revenue CRM</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              currentView === item.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onProfileClick}
          className="w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-800 transition-all text-left group"
        >
          <img 
            src={user.avatar} 
            className="w-10 h-10 rounded-full border border-slate-700 group-hover:border-blue-500 transition-colors object-cover" 
            alt="Admin" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate group-hover:text-blue-400 transition-colors">{user.name}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">{user.role}</p>
          </div>
          <span className="text-slate-600 group-hover:text-slate-400">⚙️</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
