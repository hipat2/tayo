
import React from 'react';
import { User, UserRole } from '../types';
import { ADMIN_SIDEBAR_ITEMS, TEACHER_SIDEBAR_ITEMS, STUDENT_SIDEBAR_ITEMS } from '../constants';
import { School, ChevronRight, LogOut } from 'lucide-react';

interface SidebarProps {
  user: User;
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onTabChange, onLogout }) => {
  const items = user.role === 'ADMIN' ? ADMIN_SIDEBAR_ITEMS :
                user.role === 'TEACHER' ? TEACHER_SIDEBAR_ITEMS :
                STUDENT_SIDEBAR_ITEMS;

  return (
    <div className="w-64 bg-slate-900 h-screen sticky top-0 flex flex-col text-slate-300">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <School size={24} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">
          .tayo <span className="text-indigo-400">School</span>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scroll">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-4">Main Menu</p>
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
              : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {activeTab === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 mb-4 px-2">
          <img src={user.avatar} className="w-10 h-10 rounded-full border border-slate-700" alt={user.name} />
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] uppercase text-slate-500 font-bold">{user.role}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-900/10 rounded-xl transition-all font-medium text-sm"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};
