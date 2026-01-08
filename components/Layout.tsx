
import React from 'react';
import { User } from '../types';
import { Sidebar } from './Sidebar';
import { Bell, Search } from 'lucide-react';

interface LayoutProps {
  user: User;
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ user, activeTab, onTabChange, onLogout, children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex-shrink-0 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-xl w-96">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search for students, grades, or files..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Server Online
            </div>
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};
