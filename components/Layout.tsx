
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ScaleIcon, 
  UsersIcon, 
  PlusCircleIcon,
  SearchIcon,
  MenuIcon,
  BellIcon,
  ZapIcon,
  MicIcon
} from 'lucide-react';
import { User, UserRole } from '../types';
import LiveAgent from './LiveAgent';

interface LayoutProps {
  user: User;
  isLiveMode: boolean;
  setIsLiveMode: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, isLiveMode, setIsLiveMode }) => {
  const location = useLocation();
  const [isAgentOpen, setIsAgentOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: HomeIcon },
    { label: 'New Case', path: '/properties/new', icon: PlusCircleIcon },
    { label: 'Rules Engine', path: '/admin/rules', icon: ScaleIcon, roles: [UserRole.ADMIN] },
    { label: 'User Management', path: '/admin/users', icon: UsersIcon, roles: [UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex shadow-xl">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="bg-white text-indigo-900 rounded-md px-2 py-0.5 shadow-lg shadow-indigo-500/20">P</span> Prospector
          </h1>
          <p className="text-xs text-indigo-300 mt-1 font-medium tracking-wide">Property Surplus Manager</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-indigo-800 text-white shadow-lg shadow-indigo-950/20' 
                  : 'text-indigo-200 hover:bg-indigo-800/50 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800 mt-auto bg-indigo-950/30">
          <button 
            onClick={() => setIsAgentOpen(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 mb-4 group"
          >
            <div className="bg-white/20 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <MicIcon size={16} className="text-white" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest">Live Agent</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-indigo-100 font-bold border-2 border-indigo-600">
              {user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{user.email.split('@')[0]}</p>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{user.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center bg-slate-100 rounded-xl px-4 py-2 w-full max-w-md border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <SearchIcon size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search live cases..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-6">
            {/* Live Toggle */}
            <div className="flex items-center gap-3">
               <span className={`text-[11px] font-bold uppercase tracking-wider ${isLiveMode ? 'text-slate-400' : 'text-indigo-600'}`}>Demo</span>
               <button 
                 onClick={() => setIsLiveMode(!isLiveMode)}
                 className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isLiveMode ? 'bg-green-500' : 'bg-slate-200'}`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${isLiveMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
               </button>
               <span className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${isLiveMode ? 'text-green-600' : 'text-slate-400'}`}>
                 {isLiveMode && <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>}
                 Live
               </span>
            </div>

            <div className="h-6 w-px bg-slate-200"></div>

            <button className="p-2 text-slate-500 hover:text-indigo-600 transition-colors relative hover:bg-slate-50 rounded-lg">
              <BellIcon size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="md:hidden">
               <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg"><MenuIcon size={24} /></button>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-auto p-8 bg-slate-50/50">
          <Outlet />
        </div>
      </main>

      <LiveAgent isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />
    </div>
  );
};

export default Layout;
