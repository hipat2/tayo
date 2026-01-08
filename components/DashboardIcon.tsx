
import React from 'react';

interface DashboardIconProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

export const DashboardIcon: React.FC<DashboardIconProps> = ({ label, icon, color, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className={`${color} p-4 rounded-xl text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      <span className="text-sm font-semibold text-slate-700 text-center">{label}</span>
    </button>
  );
};
