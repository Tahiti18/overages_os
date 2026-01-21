
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ScaleIcon, 
  UsersIcon, 
  PlusCircleIcon,
  SearchIcon,
  BellIcon,
  ZapIcon,
  MicIcon,
  SparklesIcon,
  CalculatorIcon,
  ArchiveIcon,
  GlobeIcon,
  ActivityIcon
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

  const mainNav = [
    { label: 'Dashboard', path: '/', icon: HomeIcon },
    { label: 'Rules Engine', path: '/admin/rules', icon: ScaleIcon, roles: [UserRole.ADMIN] },
    { label: 'Team', path: '/admin/users', icon: UsersIcon, roles: [UserRole.ADMIN] },
  ];

  const intelligenceSuite = [
    { label: 'Skip-Trace Hub', icon: GlobeIcon, color: 'text-amber-400', desc: 'Grounding Search' },
    { label: 'Waterfall Engine', icon: CalculatorIcon, color: 'text-emerald-400', desc: 'Financial Logic' },
    { label: 'Smart Packager', icon: ArchiveIcon, color: 'text-blue-400', desc: 'Auto-Assembly' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 text-white flex flex-col hidden md:flex shadow-2xl z-30 border-r border-white/5">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 rotate-3 group-hover:rotate-0 transition-transform">
              <ZapIcon size={20} fill="white" />
            </div>
            PROSPECTOR
          </h1>
          <p className="text-[10px] text-indigo-400 mt-2 font-black uppercase tracking-[0.2em] px-1">Overage OS v3.0</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-8 py-4 custom-scrollbar">
          {/* Main Navigation */}
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">Navigation</p>
            <nav className="space-y-1">
              {mainNav.filter(item => !item.roles || item.roles.includes(user.role)).map((item) => (
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
              <Link to="/properties/new" className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
                <PlusCircleIcon size={18} className="text-slate-500" />
                <span className="font-bold text-xs uppercase tracking-widest">New Case File</span>
              </Link>
            </nav>
          </div>

          {/* AI CORE V3.0 - FRONT AND CENTER */}
          <div>
            <div className="flex items-center justify-between px-4 mb-4">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">AI CORE V3.0</p>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <button 
                onClick={() => setIsAgentOpen(true)}
                className="w-full flex items-center gap-4 px-4 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl hover:from-indigo-500 hover:to-indigo-600 transition-all shadow-xl shadow-indigo-950/50 group relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-xl">
                    <MicIcon size={18} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Live Agent</p>
                    <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-tighter">Voice Consultant</p>
                  </div>
                </div>
              </button>

              {intelligenceSuite.map((tool, idx) => (
                <button 
                  key={idx}
                  className="w-full flex items-center gap-4 px-4 py-4 bg-slate-800/50 rounded-2xl border border-white/5 hover:bg-slate-800 hover:border-white/10 transition-all group"
                >
                  <div className={`p-2 rounded-xl bg-slate-900 ${tool.color}`}>
                    <tool.icon size={18} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-white">{tool.label}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{tool.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 mt-auto bg-slate-950/40">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 font-black border border-slate-700 shadow-inner">
              {user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black truncate text-white uppercase">{user.email.split('@')[0]}</p>
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
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-20">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <div className="flex items-center bg-slate-100 rounded-2xl px-6 py-4 w-full border border-slate-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all group">
              <div className="relative">
                <SearchIcon size={20} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <SparklesIcon size={12} className="absolute -top-2 -right-2 text-indigo-500 animate-pulse" />
              </div>
              <input 
                type="text" 
                placeholder="Query Intelligence Engine..." 
                className="bg-transparent border-none focus:ring-0 text-xs font-bold ml-4 w-full text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden lg:flex flex-col items-end">
               <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                 <ActivityIcon size={12} className="text-green-500" />
                 Engine Latency: <span className="text-slate-900">42ms</span>
               </div>
               <div className="flex items-center gap-2 text-[9px] font-bold text-indigo-500 mt-1">
                 GEMINI 3.0 FLASH CONNECTED
               </div>
            </div>

            <div className="h-10 w-px bg-slate-200"></div>

            <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
               <button 
                 onClick={() => setIsLiveMode(false)}
                 className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLiveMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Simulation
               </button>
               <button 
                 onClick={() => setIsLiveMode(true)}
                 className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 Live Engine
               </button>
            </div>
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
