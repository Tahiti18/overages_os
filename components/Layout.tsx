
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
  ActivityIcon,
  HardDriveIcon
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
    { label: 'Artifact Vault', path: '/vault', icon: HardDriveIcon, tip: 'Centralized repository for all extracted data and generated forms.' },
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
          {/* Integrity Pulse Indicator - Fixed boolean className error on line 103 by using template literal */}
          <div className={`p-4 rounded-2xl border-2 mb-8 flex items-center justify-between transition-all duration-700 ${isLiveMode ? 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-900 border-white/5'}`}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-2.5 h-2.5 rounded-full ${isLiveMode ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-slate-600'}`}></div>
              </div>
              {!isCollapsed && (
                <div>
                  <p className={`text-[9px] font-black uppercase tracking-widest ${isLiveMode ? 'text-emerald-400' : 'text-slate-400'}`}>Integrity Pulse</p>
                  <p className="text-[10px] font-bold text-white uppercase">{isLiveMode ? 'Live Production' : 'Simulation Mode'}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
               <button 
                 onClick={() => setIsLiveMode(!isLiveMode)}
                 className={`p-1.5 rounded-lg transition-all ${isLiveMode ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
               >
                 <ActivityIcon size={14} />
               </button>
            )}
          </div>

          <nav className="space-y-1">
            {mainNav.filter(item => !item.roles || item.roles.includes(user.role)).map((item) => (
              <Tooltip key={item.path} content={item.tip} position="right">
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                    location.pathname === item.path 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={22} className={location.pathname === item.path ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                  {!isCollapsed && <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>}
                </Link>
              </Tooltip>
            ))}
          </nav>

          <div className="pt-4 pb-2 border-t border-white/5">
             {!isCollapsed && <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-4 mb-4">Intelligence Suite</p>}
             <div className="space-y-1">
                {intelligenceSuite.map((item) => (
                  <Tooltip key={item.path} content={item.tip} position="right">
                    <Link
                      to={item.path}
                      className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                        location.pathname === item.path 
                          ? 'bg-white/10 text-white shadow-lg border border-white/5' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <item.icon size={22} className={item.color} />
                      {!isCollapsed && (
                        <div className="flex flex-col">
                           <span className="text-sm font-black uppercase tracking-tight leading-none mb-1">{item.label}</span>
                           <span className="text-[9px] font-bold opacity-50 uppercase tracking-widest">{item.desc}</span>
                        </div>
                      )}
                    </Link>
                  </Tooltip>
                ))}
             </div>
          </div>

          <nav className="space-y-1 border-t border-white/5 pt-4">
            {adminNav.map((item) => (
              <Tooltip key={item.path} content={item.tip} position="right">
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group ${
                    location.pathname === item.path 
                      ? 'bg-indigo-600 text-white shadow-xl' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={22} />
                  {!isCollapsed && <span className="text-sm font-black uppercase tracking-tight">{item.label}</span>}
                </Link>
              </Tooltip>
            ))}
          </nav>
        </div>

        <div className="p-4 mt-auto">
          <div className={`bg-slate-900 rounded-[2rem] p-4 border border-white/5 flex items-center transition-all ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shrink-0 shadow-lg border-2 border-white/10">
              {user.email[0].toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-white truncate">{user.email.split('@')[0]}</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{user.role}</p>
              </div>
            )}
            {!isCollapsed && (
               <button className="p-2 text-slate-600 hover:text-white transition-colors">
                  <MenuIcon size={18} />
               </button>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white border-b-2 border-slate-100 flex items-center justify-between px-10 shrink-0 z-20">
           <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${isAiConnected ? 'bg-emerald-500' : 'bg-rose-500'} shadow-lg animate-pulse`}></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Protocol: {isAiConnected ? 'Secure' : 'Disconnected'}</span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <Tooltip content="Open the AI voice channel for real-time case consultation.">
                <button 
                  onClick={() => setIsAgentOpen(true)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-3 hover:bg-indigo-700 transition-all hover:-translate-y-1 active:scale-95 border-2 border-white/10"
                >
                   <MicIcon size={16} /> Live Agent
                </button>
              </Tooltip>
              <Tooltip content="View the comprehensive user manual and system logic guides.">
                <button 
                  onClick={() => setIsGuideOpen(true)}
                  className="p-3 bg-white text-slate-400 border-2 border-slate-100 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-md active:scale-90"
                >
                   <SearchIcon size={20} />
                </button>
              </Tooltip>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/50">
           <Outlet />
        </div>
      </main>

      <LiveAgent isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />
      <UserGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

// Fixed export default issue to resolve App.tsx import error
export default Layout;
