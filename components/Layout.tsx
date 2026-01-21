
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  ZapIcon,
  MicIcon,
  CalculatorIcon,
  ArchiveIcon,
  GlobeIcon,
  CalendarIcon,
  LayersIcon,
  LayoutDashboardIcon,
  BarChartIcon,
  ScaleIcon,
  UsersIcon,
  CreditCardIcon,
  GiftIcon,
  DatabaseIcon,
  SearchIcon,
  ChevronLeftIcon,
  MenuIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  UnplugIcon,
  ActivityIcon
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAiConnected, setIsAiConnected] = useState(false);

  useEffect(() => {
    // Check if API key is present in environment
    setIsAiConnected(!!process.env.API_KEY);
  }, []);

  const GavelIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gavel"><path d="m14.5 12.5-8 8a2.11 2.11 0 0 1-3-3l8-8"/><path d="m16 16 2 2"/><path d="m19 13 2 2"/><path d="m5 5 3 3"/><path d="m2 11 3 3"/><path d="m15.5 15.5 3-3a2.11 2.11 0 0 0-3-3l-3 3a2.11 2.11 0 0 0 3 3Z"/></svg>
  );

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
    { label: 'County Scanner', path: '/scanner', icon: DatabaseIcon, color: 'text-emerald-400', desc: 'Raw List Discovery', tip: 'Scan entire counties for buried surplus and excess proceeds lists.' },
    { label: 'Skip-Trace Hub', path: '/research', icon: GlobeIcon, color: 'text-amber-400', desc: 'Grounding Search', tip: 'Advanced AI-powered claimant locating engine.' },
    { label: 'Waterfall Engine', path: '/waterfall', icon: CalculatorIcon, color: 'text-emerald-400', desc: 'Financial Logic', tip: 'Simulate lien priority and final recovery amounts.' },
    { label: 'Counsel Hub', path: '/counsel', icon: GavelIcon, color: 'text-purple-400', desc: 'Legal Network', tip: 'Research and engage specialized surplus attorneys.' },
    { label: 'Smart Packager', path: '/packager', icon: ArchiveIcon, color: 'text-blue-400', desc: 'Auto-Assembly', tip: 'Generate court-ready claim artifacts and demand letters.' },
    { label: 'Compliance Calendar', path: '/calendar', icon: CalendarIcon, color: 'text-rose-400', desc: 'Legal Deadlines', tip: 'Track critical filing windows across all jurisdictions.' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      <aside 
        className={`bg-slate-950 text-white flex flex-col hidden md:flex shadow-3xl z-30 border-r-2 border-white/5 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-24' : 'w-80'}`}
      >
        <div className="p-8 flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-0 w-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 rotate-3 shrink-0 border-2 border-white/20">
              <ZapIcon size={20} fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">PROSPECTOR</h1>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Overage OS</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-2.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-all shadow-lg ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <ChevronRightIcon size={24} /> : <ChevronLeftIcon size={24} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-8 py-4 custom-scrollbar overflow-x-hidden">
          {/* Integrity Pulse Indicator */}
          <div className={`mx-2 p-4 rounded-2xl border-2 flex items-center gap-4 transition-all duration-500 shadow-2xl ${isAiConnected ? 'bg-emerald-500/10 border-emerald-500/30 shadow-emerald-950/60' : 'bg-red-500/10 border-red-500/30 shadow-red-950/60'}`}>
            <div className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAiConnected ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isAiConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden animate-in fade-in slide-in-from-left-2">
                <p className={`text-[9px] font-black uppercase tracking-[0.15em] leading-none mb-1 ${isAiConnected ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isAiConnected ? 'Neural Link: Active' : 'Neural Link: Offline'}
                </p>
                <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest truncate opacity-80">
                  {isAiConnected ? 'Gemini 3.0 Cluster Connected' : 'Waiting for Authentication'}
                </p>
              </div>
            )}
          </div>

          <div>
            {!isCollapsed && <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4 animate-in fade-in">Core Terminal</p>}
            <nav className="space-y-2">
              {mainNav.filter(item => !item.roles || item.roles.includes(user.role)).map((item) => (
                <Tooltip key={item.path} content={item.tip} position="right">
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 border-2 ${
                      location.pathname === item.path 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-2xl shadow-indigo-950/60 translate-x-1.5' 
                        : 'text-slate-100 border-transparent hover:bg-slate-800 hover:text-white hover:border-white/10 shadow-lg'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-indigo-400'} />
                    {!isCollapsed && <span className="font-black text-[11px] uppercase tracking-widest whitespace-nowrap animate-in slide-in-from-left-2">{item.label}</span>}
                  </Link>
                </Tooltip>
              ))}
            </nav>
          </div>

          <div>
            {!isCollapsed && <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4 mb-4 animate-in fade-in">Account & Revenue</p>}
            <nav className="space-y-2">
              {adminNav.map((item) => (
                <Tooltip key={item.path} content={item.tip} position="right">
                  <Link
                    to={item.path}
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 border-2 ${
                      location.pathname === item.path 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-2xl shadow-indigo-950/60 translate-x-1.5' 
                        : 'text-slate-100 border-transparent hover:bg-slate-800 hover:text-white hover:border-white/10 shadow-lg'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'text-indigo-400'} />
                    {!isCollapsed && <span className="font-black text-[11px] uppercase tracking-widest whitespace-nowrap animate-in slide-in-from-left-2">{item.label}</span>}
                  </Link>
                </Tooltip>
              ))}
            </nav>
          </div>

          <div>
            {!isCollapsed && (
              <div className="flex items-center justify-between px-4 mb-4 animate-in fade-in">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Autonomous Suite</p>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.8)] border-2 border-white/20"></div>
              </div>
            )}
            <div className="space-y-3">
              <Tooltip content="Start a real-time voice consultation with our AI legal expert." position="right">
                <button 
                  onClick={() => setIsAgentOpen(true)}
                  className={`w-full flex items-center gap-4 px-4 py-5 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-2xl hover:from-indigo-500 hover:to-indigo-700 transition-all shadow-2xl shadow-indigo-950/80 group border-2 border-white/10 hover:scale-[1.02] active:scale-95 ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <div className="bg-white/10 p-2.5 rounded-xl shrink-0 shadow-lg ring-1 ring-white/20">
                    <MicIcon size={20} className="text-white" />
                  </div>
                  {!isCollapsed && (
                    <div className="text-left animate-in slide-in-from-left-2">
                      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 text-white">Live Voice</p>
                      <p className="text-[9px] text-indigo-200 font-black uppercase tracking-tighter opacity-80">AI Expert Consult</p>
                    </div>
                  )}
                </button>
              </Tooltip>

              {intelligenceSuite.map((tool, idx) => (
                <Tooltip key={idx} content={tool.tip} position="right">
                  <Link 
                    to={tool.path}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl border-2 transition-all group hover:-translate-y-1 ${
                      location.pathname === tool.path 
                        ? 'bg-slate-800 border-indigo-500/60 shadow-2xl shadow-indigo-500/10' 
                        : 'bg-slate-900/40 border-white/5 hover:bg-slate-800 hover:border-white/10 shadow-xl'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                  >
                    <div className={`p-2.5 rounded-xl bg-slate-950/80 shrink-0 border border-white/5 shadow-inner ${tool.color}`}>
                      <tool.icon size={18} />
                    </div>
                    {!isCollapsed && (
                      <div className="text-left animate-in slide-in-from-left-2">
                        <p className={`text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${location.pathname === tool.path ? 'text-indigo-400' : 'text-slate-100'}`}>{tool.label}</p>
                        <p className="text-[9px] text-slate-300 font-black uppercase tracking-tighter">{tool.desc}</p>
                      </div>
                    )}
                  </Link>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t-2 border-white/5 mt-auto bg-slate-950 shrink-0 shadow-2xl">
          <Tooltip content={`Subscription: ${user.subscription?.tier}. Credits: ${user.subscription?.ai_credits_remaining}`} position="right">
            <div className={`flex items-center gap-4 px-2 cursor-pointer group ${isCollapsed ? 'justify-center px-0' : ''}`}>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black border-2 border-white/10 shadow-2xl group-hover:scale-105 transition-all shrink-0">
                {user.email[0].toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden text-left animate-in slide-in-from-left-2">
                  <p className="text-xs font-black truncate text-white uppercase tracking-tight">{user.email.split('@')[0]}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">{user.subscription?.tier}</p>
                  </div>
                </div>
              )}
            </div>
          </Tooltip>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white border-b-2 border-slate-100 flex items-center justify-between px-10 shrink-0 z-20 shadow-lg">
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <Tooltip content="Universal search across all cases, documents, and claimants." position="bottom">
              <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 w-full md:w-[500px] border-2 border-slate-200 focus-within:bg-white focus-within:ring-8 focus-within:ring-indigo-500/5 focus-within:border-indigo-500 transition-all group shadow-xl shadow-inner">
                <SearchIcon size={20} className="text-slate-500 group-focus-within:text-indigo-600 transition-colors shrink-0" />
                <input 
                  type="text" 
                  placeholder="Query Overage Intelligence..." 
                  className="bg-transparent border-none focus:ring-0 text-sm font-black ml-4 w-full text-slate-800 placeholder:text-slate-600"
                />
              </div>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-2xl border-2 border-slate-200 hidden sm:flex shadow-2xl ring-1 ring-white/50">
               <Tooltip content="Work with test data for training or sandbox testing.">
                <button onClick={() => setIsLiveMode(false)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLiveMode ? 'bg-white text-indigo-600 shadow-xl border-2 border-indigo-100' : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'}`}>Simulation</button>
               </Tooltip>
               <Tooltip content="Connect to live county treasurers and real-time document extraction.">
                <button onClick={() => setIsLiveMode(true)} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-indigo-600 text-white shadow-2xl border-2 border-indigo-400' : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'}`}>Live Engine</button>
               </Tooltip>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-10 bg-slate-50/50 custom-scrollbar">
          <Outlet context={{ user, isLiveMode }} />
        </div>
      </main>

      <LiveAgent isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />
      <UserGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default Layout;
