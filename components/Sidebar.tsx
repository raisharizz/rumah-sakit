import React from 'react';
import { LayoutDashboard, Users, FileText, UserCheck, CreditCard, Database } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems: { id: ViewState; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Ops Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'patients', label: 'Patient Admin', icon: <Users size={20} /> },
    { id: 'clinical', label: 'Medical Records', icon: <FileText size={20} /> },
    { id: 'staff', label: 'Staff Schedule', icon: <UserCheck size={20} /> },
    { id: 'billing', label: 'Finance & Billing', icon: <CreditCard size={20} /> },
    { id: 'schema', label: 'System Schema', icon: <Database size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-100 flex flex-col h-full shadow-xl border-r border-slate-700">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
            <div className="bg-teal-500 p-1.5 rounded-lg">
                <Database size={24} className="text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight">MediAgent</h1>
                <p className="text-xs text-slate-400">AIS Orchestrator</p>
            </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-xs text-slate-400 font-semibold mb-1">CURRENT USER</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold">
              PF
            </div>
            <div>
              <p className="text-sm font-medium">AIS Professor</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
