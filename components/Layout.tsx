
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
  ActivityIcon,
  CalendarIcon,
  BookOpenIcon,
  HelpCircleIcon,
  LayersIcon,
  LayoutDashboardIcon,
  BarChartIcon,
  MapIcon,
  GavelIcon,
  CreditCardIcon,
  GiftIcon
} from 'lucide-react';
import { User, UserRole } from '../types';
import LiveAgent from './LiveAgent';
import UserGuide from './UserGuide';
import Tooltip from './Tooltip';

interface LayoutProps {
  user: User;
  isLiveMode: boolean;
  setIsLiveMode: (val: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, isLiveMode, setIsLiveMode }) => {
  const location = useLocation();
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const mainNav = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboardIcon, tip: 'Overview of all active surplus recovery cases.' },
    { label: 'Market Intelligence', path: '/intelligence', icon: BarChartIcon, tip: 'Analyze national trends and find high-yield jurisdictions.' },
    { label: 'Workflow Protocol', path: '/workflow', icon: LayersIcon, tip: 'Detailed view of the 5-stage automated recovery pipeline.' },
    { label: 'Rules Engine', path: '/admin/rules', icon: ScaleIcon, roles: [UserRole.ADMIN], tip: 'Configure jurisdiction-specific deadlines and requirements.' },
    { label: 'Team', path: '/admin/users', icon: UsersIcon, roles: [UserRole.ADMIN], tip: 'Manage team access levels and review performance metrics.' },
  ];

  const adminNav = [
    { label: 'Billing & Tiers', path: '/billing', icon: CreditCardIcon, tip: 'Manage your platform subscription and AI credits.' },
    { label: 'Affiliate Portal', path: '/affiliate', icon: GiftIcon, tip: 'Earn recurring commission by referring other recovery agents.' },
  ];

  const intelligenceSuite = [
    { label: 'Skip-Trace Hub', path: '/research', icon: GlobeIcon, color: 'text-amber-400', desc: 'Grounding Search', tip: 'Advanced AI-powered claimant locating engine.' },
    { label: 'Waterfall Engine', path: '/waterfall', icon: CalculatorIcon, color: 'text-emerald-400', desc: 'Financial Logic', tip: 'Simulate lien priority and final recovery amounts.' },
    { label: 'Counsel Hub', path: '/counsel', icon: GavelIcon, color: 'text-purple-400', desc: 'Legal Network', tip: 'Research and engage specialized surplus attorneys.' },
    { label: 'Smart Packager', path: '/packager', icon: ArchiveIcon, color: 'text-blue-400', desc: 'Auto-Assembly', tip: 'Generate court-ready claim artifacts and demand letters.' },
    { label: 'Compliance Calendar', path: '/calendar', icon: CalendarIcon, color: 'text-rose-400', desc: 'Legal Deadlines', tip: 'Track critical filing windows across all jurisdictions.' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <aside className="w-80 bg-slate-950 text-white flex flex-col hidden md:flex shadow-2xl z-30 border-r border-white/10">
        <div className="p-8">
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/40 rotate-3 transition-transform">
              <ZapIcon size={20} fill="white" />
            </div>
            PROSPECTOR
          </h1>
          <p className="text-[10px] text-indigo-400 mt-2 font-black uppercase tracking-[0.2em] px-1">Overage OS v3.5</p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 space-y-8 py-4 custom-scrollbar">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">Core Terminal</p>
            <nav className="space-y-1.5">
              {mainNav.filter(item => !item.roles || item.roles.includes(user.role)).map((item) => (
                <Tooltip key={item.path} content={item.tip} position="right">
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 border ${
                      location.pathname === item.path 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-950/60 translate-x-1' 
                        : 'text-slate-200 border-transparent hover:bg-slate-800 hover:text-white hover:border-white/5'
                    }`}
                  >
                    <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-indigo-400/80'} />
                    <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
                  </Link>
                </Tooltip>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">Account & Revenue</p>
            <nav className="space-y-1.5">
              {adminNav.map((item) => (
                <Tooltip key={item.path} content={item.tip} position="right">
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 border ${
                      location.pathname === item.path 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl shadow-indigo-950/60 translate-x-1' 
                        : 'text-slate-200 border-transparent hover:bg-slate-800 hover:text-white hover:border-white/5'
                    }`}
                  >
                    <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-indigo-400/80'} />
                    <span className="font-black text-[11px] uppercase tracking-widest">{item.label}</span>
                  </Link>
                </Tooltip>
              ))}
            </nav>
          </div>

          <div>
            <div className="flex items-center justify-between px-4 mb-4">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Autonomous Suite</p>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            </div>
            <div className="space-y-2">
              <Tooltip content="Start a real-time voice consultation with our AI legal expert." position="right">
                <button 
                  onClick={() => setIsAgentOpen(true)}
                  className="w-full flex items-center gap-4 px-4 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl hover:from-indigo-500 hover:to-indigo-700 transition-all shadow-xl shadow-indigo-950/80 group border border-indigo-400/20"
                >
                  <div className="bg-white/10 p-2 rounded-xl">
                    <MicIcon size={20} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-white">Live Voice</p>
                    <p className="text-[9px] text-indigo-200 font-bold uppercase tracking-tighter">AI Expert Consult</p>
                  </div>
                </button>
              </Tooltip>

              {intelligenceSuite.map((tool, idx) => (
                <Tooltip key={idx} content={tool.tip} position="right">
                  <Link 
                    to={tool.path}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border transition-all group ${
                      location.pathname === tool.path 
                        ? 'bg-slate-800 border-indigo-500/50 shadow-lg' 
                        : 'bg-slate-900/40 border-white/5 hover:bg-slate-800 hover:border-white/10'
                    }`}
                  >
                    <div className={`p-2 rounded-xl bg-slate-950/80 ${tool.color}`}>
                      <tool.icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${location.pathname === tool.path ? 'text-indigo-400' : 'text-slate-100'}`}>{tool.label}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{tool.desc}</p>
                    </div>
                  </Link>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 mt-auto bg-slate-950">
          <Tooltip content={`Subscription: ${user.subscription?.tier}. Credits: ${user.subscription?.ai_credits_remaining}`} position="right">
            <div className="flex items-center gap-4 px-2 cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 font-black border border-indigo-500/30 shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {user.email[0].toUpperCase()}
              </div>
              <div className="overflow-hidden text-left">
                <p className="text-xs font-black truncate text-white uppercase tracking-tight">{user.email.split('@')[0]}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{user.subscription?.tier}</p>
                </div>
              </div>
            </div>
          </Tooltip>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 z-20">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <Tooltip content="Universal search across all cases, documents, and claimants." position="bottom">
              <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 w-[500px] border border-slate-200 focus-within:bg-white focus-within:ring-8 focus-within:ring-indigo-500/5 transition-all group">
                <SearchIcon size={20} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query Overage Intelligence..." 
                  className="bg-transparent border-none focus:ring-0 text-sm font-black ml-4 w-full text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
               <Tooltip content="Work with test data for training or sandbox testing.">
                <button onClick={() => setIsLiveMode(false)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLiveMode ? 'bg-white text-indigo-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>Simulation</button>
               </Tooltip>
               <Tooltip content="Connect to live county treasurers and real-time document extraction.">
                <button onClick={() => setIsLiveMode(true)} className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Live Engine</button>
               </Tooltip>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 bg-slate-50/50">
          <Outlet context={{ user }} />
        </div>
      </main>

      <LiveAgent isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />
      <UserGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default Layout;
