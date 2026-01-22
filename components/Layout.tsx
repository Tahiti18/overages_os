
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Zap,
  Mic,
  Calculator,
  Archive,
  Globe,
  Calendar,
  Layers,
  LayoutDashboard,
  BarChart,
  Scale,
  Users,
  CreditCard,
  Gift,
  Database,
  Search,
  ChevronLeft,
  Menu,
  ChevronRight,
  ShieldCheck,
  Unplug,
  Activity,
  HardDrive,
  Bell
} from 'lucide-react';
import { User, UserRole, SystemNotification } from '../types';
import LiveAgent from './LiveAgent';
import UserGuide from './UserGuide';
import Tooltip from './Tooltip';
import NotificationHub from './NotificationHub';

interface LayoutProps {
  user: User;
  isLiveMode: boolean;
  setIsLiveMode: (val: boolean) => void;
}

const SIMULATION_NOTIFICATIONS: SystemNotification[] = [
  {
    id: 'n1',
    type: 'DROP_ALERT',
    title: '[SIMULATION] Imminent PDF Drop: Miami-Dade',
    message: 'Predictive Sync indicates a surplus list release in 22 hours. Example behavior of Open Plains alerts.',
    timestamp: '1h ago',
    is_read: false,
    priority: 'URGENT'
  },
  {
    id: 'n2',
    type: 'DEADLINE',
    title: '[SIMULATION] Compliance Window Closing',
    message: 'Filing for Case #14-02 expires in 48 hours. Example of deadline tracking behavior.',
    timestamp: '4h ago',
    is_read: false,
    priority: 'HIGH'
  }
];

const Layout: React.FC<LayoutProps> = ({ user, isLiveMode, setIsLiveMode }) => {
  const location = useLocation();
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAiConnected, setIsAiConnected] = useState(false);

  useEffect(() => {
    setIsAiConnected(!!process.env.API_KEY);
  }, []);

  const GavelIcon = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-gavel"><path d="m14.5 12.5-8 8a2.11 2.11 0 0 1-3-3l8-8"/><path d="m16 16 2 2"/><path d="m19 13 2 2"/><path d="m5 5 3 3"/><path d="m2 11 3 3"/><path d="m15.5 15.5 3-3a2.11 2.11 0 0 0-3-3l-3 3a2.11 2.11 0 0 0 3 3Z"/></svg>
  );

  const mainNav = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, tip: 'Overview of all active surplus recovery cases.' },
    { label: 'Artifact Vault', path: '/vault', icon: HardDrive, tip: 'Centralized repository for all extracted data and generated forms.' },
    { label: 'Market Intelligence', path: '/intelligence', icon: BarChart, tip: 'Analyze national trends and find high-yield jurisdictions.' },
    { label: 'Workflow Protocol', path: '/workflow', icon: Layers, tip: 'Detailed view of the 5-stage automated recovery pipeline.' },
    { label: 'Rules Engine', path: '/admin/rules', icon: Scale, roles: [UserRole.ADMIN], tip: 'Configure jurisdiction-specific deadlines and requirements.' },
    { label: 'Team', path: '/admin/users', icon: Users, roles: [UserRole.ADMIN], tip: 'Manage team access levels and review performance metrics.' },
  ];

  const adminNav = [
    { label: 'Billing & Tiers', path: '/billing', icon: CreditCard, tip: 'Manage your platform subscription and AI credits.' },
    { label: 'Affiliate Portal', path: '/affiliate', icon: Gift, tip: 'Earn recurring commission by referring other recovery agents.' },
  ];

  const intelligenceSuite = [
    { label: 'County Scanner', path: '/scanner', icon: Database, color: 'text-emerald-400', desc: 'Raw List Discovery', tip: 'Scan entire counties for buried surplus and excess proceeds lists.' },
    { label: 'Skip-Trace Hub', path: '/research', icon: Globe, color: 'text-amber-400', desc: 'Grounding Search', tip: 'Advanced AI-powered claimant locating engine.' },
    { label: 'Waterfall Engine', path: '/waterfall', icon: Calculator, color: 'text-emerald-400', desc: 'Financial Logic', tip: 'Simulate lien priority and final recovery amounts.' },
    { label: 'Counsel Hub', path: '/counsel', icon: GavelIcon, color: 'text-purple-400', desc: 'Legal Network', tip: 'Research and engage specialized surplus attorneys.' },
    { label: 'Smart Packager', path: '/packager', icon: Archive, color: 'text-blue-400', desc: 'Auto-Assembly', tip: 'Generate court-ready claim artifacts and demand letters.' },
    { label: 'Compliance Calendar', path: '/calendar', icon: Calendar, color: 'text-rose-400', desc: 'Legal Deadlines', tip: 'Track critical filing windows across all jurisdictions.' },
  ];

  const currentNotifications = isLiveMode ? [] : SIMULATION_NOTIFICATIONS;

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden">
      <aside 
        className={`bg-slate-950 text-white flex flex-col hidden md:flex shadow-3xl z-30 border-r-2 border-white/5 transition-all duration-500 ease-in-out ${isCollapsed ? 'w-24' : 'w-80'}`}
      >
        <div className="p-8 flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-all duration-500 ${isCollapsed ? 'opacity-0 scale-0 w-0 overflow-hidden' : 'opacity-100 scale-100'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl rotate-3 shrink-0 border-2 border-white/20 transition-colors ${isLiveMode ? 'bg-emerald-600 shadow-emerald-500/40' : 'bg-indigo-600 shadow-indigo-500/40'}`}>
              <Zap size={20} fill="white" />
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
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-8 py-4 custom-scrollbar overflow-x-hidden">
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
                 <Activity size={14} />
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
                      ? (isLiveMode ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20')
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
                      ? (isLiveMode ? 'bg-emerald-600 text-white shadow-xl' : 'bg-indigo-600 text-white shadow-xl')
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 shadow-lg border-2 border-white/10 ${isLiveMode ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
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
                  <Menu size={18} />
               </button>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-24 bg-white border-b-2 border-slate-100 flex items-center justify-between px-10 shrink-0 z-20">
           <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-3">
                 <div className={`w-3 h-3 rounded-full ${isAiConnected ? (isLiveMode ? 'bg-emerald-500' : 'bg-indigo-500') : 'bg-rose-500'} shadow-lg animate-pulse`}></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">AI Protocol: {isAiConnected ? 'Secure' : 'Disconnected'}</span>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <Tooltip content="Predictive Drop Alerts & Statutory Deadlines.">
                <button 
                  onClick={() => setIsNotifOpen(true)}
                  className="relative p-3 bg-white text-slate-400 border-2 border-slate-100 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-md active:scale-90"
                >
                   <Bell size={20} />
                   {currentNotifications.length > 0 && (
                     <span className="absolute top-0 right-0 w-5 h-5 bg-rose-600 text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-bounce">
                       {currentNotifications.length}
                     </span>
                   )}
                </button>
              </Tooltip>

              <Tooltip content="Open the AI voice channel for real-time case consultation.">
                <button 
                  onClick={() => setIsAgentOpen(true)}
                  className={`${isLiveMode ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95 border-2 border-white/10`}
                >
                   <Mic size={16} /> Live Agent
                </button>
              </Tooltip>
              
              <Tooltip content="View the comprehensive user manual and system logic guides.">
                <button 
                  onClick={() => setIsGuideOpen(true)}
                  className="p-3 bg-white text-slate-400 border-2 border-slate-100 rounded-2xl hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-md active:scale-90"
                >
                   <Search size={20} />
                </button>
              </Tooltip>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/50">
           <Outlet context={{ user, isLiveMode, setIsLiveMode }} />
        </div>
      </main>

      <LiveAgent isOpen={isAgentOpen} onClose={() => setIsAgentOpen(false)} />
      <UserGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <NotificationHub isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} notifications={currentNotifications} />
    </div>
  );
};

export default Layout;
