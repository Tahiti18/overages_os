
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
  MicIcon,
  SparklesIcon
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
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col hidden md:flex shadow-2xl z-30">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 group-hover:rotate-0 transition-transform">
              <ZapIcon size={20} fill="white" />
            </div>
            PROSPECTOR
          </h1>
          <p className="text-[10px] text-indigo-400 mt-2 font-black uppercase tracking-[0.2em] px-1">Overage OS v3.0</p>
        </div>

        <nav className="flex-1 px-6 py-4 space-y-1.5">
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${
                location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/40 translate-x-1' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={18} className={location.pathname === item.path ? 'text-white' : 'text-slate-500'} />
              <span className="font-bold text-xs uppercase tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 mt-auto bg-slate-950/40">
          <button 
            onClick={() => setIsAgentOpen(true)}
            className="w-full flex items-center gap-4 px-5 py-4 bg-indigo-600 rounded-3xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-500/10 mb-6 group relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-xl">
                <MicIcon size={16} className="text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Connect Live Agent</span>
            </div>
            <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12 group-hover:rotate-0 transition-transform">
              <MicIcon size={60} />
            </div>
          </button>

          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 font-black border border-slate-700 shadow-inner">
              {user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate text-white">{user.email.split('@')[0].toUpperCase()}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-20">
          <div className="flex items-center bg-slate-100 rounded-[1.25rem] px-6 py-3 w-full max-w-xl border border-slate-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all group">
            <div className="relative">
              <SearchIcon size={18} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <SparklesIcon size={10} className="absolute -top-1 -right-1 text-indigo-500 animate-pulse" />
            </div>
            <input 
              type="text" 
              placeholder="Query surplus intelligence (e.g. 'Show GA high value cases')..." 
              className="bg-transparent border-none focus:ring-0 text-xs font-bold ml-3 w-full text-slate-800 placeholder:text-slate-400 placeholder:font-medium"
            />
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               <button 
                 onClick={() => setIsLiveMode(!isLiveMode)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLiveMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Simulation
               </button>
               <button 
                 onClick={() => setIsLiveMode(!isLiveMode)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 {isLiveMode && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                 Live Engine
               </button>
            </div>

            <div className="h-8 w-px bg-slate-200"></div>

            <button className="p-3 text-slate-400 hover:text-indigo-600 transition-all relative hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100">
              <BellIcon size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-white"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-auto p-10 bg-slate-50/30">
          <Outlet />
        </div>
      </main>

      <LiveAgent isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />
    </div>
  );
};

export default Layout;
