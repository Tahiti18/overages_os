
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUpIcon, 
  AlertCircleIcon, 
  CheckCircle2Icon,
  ArrowRightIcon,
  PlusCircleIcon,
  SparklesIcon,
  ZapIcon,
  FilterIcon,
  BarChart3Icon,
  ActivityIcon,
  InfoIcon,
  UserPlusIcon,
  SearchIcon,
  ChevronDownIcon,
  DatabaseIcon,
  UnplugIcon,
  ServerIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { Property, CaseStatus, User, UserRole } from '../types';
import Tooltip from './Tooltip';

const TEAM_MEMBERS: User[] = [
  { id: 'u1', email: 'admin@prospector.ai', role: UserRole.ADMIN, is_active: true },
  { id: 'u2', email: 'reviewer_jane@prospector.ai', role: UserRole.REVIEWER, is_active: true },
  { id: 'u3', email: 'agent_bob@prospector.ai', role: UserRole.FILING_AGENT, is_active: true },
  { id: 'u4', email: 'audit_steve@prospector.ai', role: UserRole.VIEWER, is_active: false },
];

const INITIAL_PROPERTIES: Property[] = [
  {
    id: '1',
    state: 'GA',
    county: 'Fulton',
    parcel_id: '14-0021-0004-012-0',
    address: '123 Peach Ave, Atlanta, GA 30303',
    tax_sale_date: '2024-01-15',
    sale_price: 150000,
    total_debt: 20000,
    surplus_amount: 130000,
    deadline_date: '2025-01-15',
    status: CaseStatus.NEW,
    created_at: '2024-02-01',
    priority_score: 92,
    risk_level: 'LOW',
    est_payout_days: 120,
    assigned_to_user_id: 'u2'
  },
  {
    id: '2',
    state: 'FL',
    county: 'Miami-Dade',
    parcel_id: '01-3136-009-1250',
    address: '888 Ocean Dr #4, Miami Beach, FL 33139',
    tax_sale_date: '2023-11-20',
    sale_price: 450000,
    total_debt: 50000,
    surplus_amount: 400000,
    deadline_date: '2024-05-20',
    status: CaseStatus.READY_FOR_REVIEW,
    created_at: '2023-12-05',
    priority_score: 84,
    risk_level: 'MEDIUM',
    est_payout_days: 180,
    assigned_to_user_id: 'u3'
  }
];

interface DashboardProps {
  isLiveMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLiveMode }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Active Pipeline', value: isLiveMode ? '$0' : '$735,000', icon: TrendingUpIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', tip: 'Total estimated gross surplus for all active cases.' },
    { label: 'High Yield (90+)', value: isLiveMode ? '0' : '12 Cases', icon: SparklesIcon, color: 'text-amber-600', bg: 'bg-amber-50', tip: 'Cases with an Intelligence Rank over 90.' },
    { label: 'Action Required', value: isLiveMode ? '0' : '8 Tasks', icon: AlertCircleIcon, color: 'text-red-600', bg: 'bg-red-50', tip: 'Urgent compliance deadlines or document deficiencies.' },
    { label: 'Predictive YTD', value: isLiveMode ? '$0' : '$1.4M', icon: CheckCircle2Icon, color: 'text-green-600', bg: 'bg-green-50', tip: 'Estimated annual recovery based on conversion rates.' },
  ];

  const filteredProperties = useMemo(() => {
    if (isLiveMode) return [];
    return properties.filter(p => searchQuery ? p.address.toLowerCase().includes(searchQuery.toLowerCase()) : true)
      .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
  }, [searchQuery, isLiveMode, properties]);

  const handleAssignChange = (propertyId: string, userId: string) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, assigned_to_user_id: userId === 'unassigned' ? undefined : userId } : p
    ));
  };

  const getUserInitials = (userId: string | undefined) => {
    if (!userId) return '?';
    const user = TEAM_MEMBERS.find(u => u.id === userId);
    return user ? user.email[0].toUpperCase() : '?';
  };

  const getUserName = (userId: string | undefined) => {
    if (!userId) return 'Unassigned';
    const user = TEAM_MEMBERS.find(u => u.id === userId);
    return user ? user.email.split('@')[0] : 'Unknown';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Production Banner */}
      <div className={`rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5 transition-all duration-700 ${isLiveMode ? 'bg-slate-950 ring-1 ring-emerald-500/20' : 'bg-slate-900'}`}>
        <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-110 transition-transform duration-1000">
           {isLiveMode ? <ServerIcon size={180} fill="white" /> : <ZapIcon size={180} fill="white" />}
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${isLiveMode ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30' : 'bg-indigo-600 text-white'}`}>
                <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-white'}`}></div>
                {isLiveMode ? 'Production Environment Active' : 'AI Core v3.0 Connected'}
              </div>
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Deployment ID: RAILWAY-PRD-92</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter max-w-2xl leading-tight">
              {isLiveMode ? 'Standing by for Live Case Ingestion.' : 'Enterprise Recovery Intelligence.'}
            </h2>
            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
              {isLiveMode 
                ? 'Your deployment is synchronized with Google Gemini 3.0 clusters. Connect a County Treasurer feed to populate your production pipeline.' 
                : 'Proprietary yielding engine active. Simulation records are ready for jurisdictional compliance training.'}
            </p>
          </div>
          <Tooltip content="Initialize a new overage record in the production database.">
            <button onClick={() => navigate('/properties/new')} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-4 border border-slate-200 shadow-2xl shadow-indigo-950/20">
              <PlusCircleIcon size={22} className="text-indigo-600" /> New Intake Wizard
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Tooltip key={i} content={stat.tip}>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-start justify-between group hover:border-indigo-400 transition-all hover:shadow-xl h-full cursor-default">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-sm`}><stat.icon size={24} /></div>
                </div>
              </Tooltip>
            ))}
          </div>

          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 tracking-tight uppercase italic">
                {isLiveMode ? 'Production Feed' : 'Recovery Pipeline'} 
                <span className="text-slate-300 font-normal">/ {filteredProperties.length} Records</span>
              </h2>
              <div className="relative w-80 group">
                <SearchIcon size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Query addresses or APNs..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)} 
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-6 py-4 text-xs font-bold outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all shadow-sm" 
                />
              </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
              {filteredProperties.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-10 py-6">Intelligence</th>
                      <th className="px-10 py-6">Property Context</th>
                      <th className="px-10 py-6">Assignee</th>
                      <th className="px-10 py-6 text-center">Risk</th>
                      <th className="px-10 py-6">Est. Net</th>
                      <th className="px-10 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProperties.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                        <td className="px-10 py-8" onClick={() => navigate(`/properties/${p.id}`)}>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border transition-all ${p.priority_score! > 85 ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-inner' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                            {p.priority_score}
                          </div>
                        </td>
                        <td className="px-10 py-8" onClick={() => navigate(`/properties/${p.id}`)}>
                          <div>
                            <p className="text-base font-black text-slate-900 leading-tight mb-1">{p.address}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.parcel_id} • {p.county}, {p.state}</p>
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all relative group/assign">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black border transition-all ${p.assigned_to_user_id ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-300 border-slate-200'}`}>
                              {p.assigned_to_user_id ? getUserInitials(p.assigned_to_user_id) : <UserPlusIcon size={16} />}
                            </div>
                            <div className="flex flex-col">
                              <p className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">{getUserName(p.assigned_to_user_id)}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lead Agent</p>
                            </div>
                            <select 
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              value={p.assigned_to_user_id || 'unassigned'}
                              onChange={(e) => handleAssignChange(p.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="unassigned">Unassigned</option>
                              {TEAM_MEMBERS.map(m => <option key={m.id} value={m.id}>{m.email.split('@')[0]}</option>)}
                            </select>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-center" onClick={() => navigate(`/properties/${p.id}`)}>
                          <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                            p.risk_level === 'LOW' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            p.risk_level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {p.risk_level}
                          </span>
                        </td>
                        <td className="px-10 py-8" onClick={() => navigate(`/properties/${p.id}`)}>
                          <p className="text-base font-black text-indigo-600">${p.surplus_amount.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.est_payout_days} Day Est.</p>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm">
                            <ArrowRightIcon size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 space-y-8">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-slate-100 shadow-inner group">
                    <UnplugIcon size={48} className="text-slate-200 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Production Cache Empty</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium">
                      Your production environment is live, but no assets have been ingested yet. Start by performing a <span className="text-indigo-600 font-bold">Manual Intake</span> or scanning a county.
                    </p>
                  </div>
                  <button onClick={() => navigate('/properties/new')} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all flex items-center gap-3 active:scale-95">
                    <PlusCircleIcon size={18} /> Initialize First Case
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
            <div className="flex items-center justify-between border-b border-slate-50 pb-6">
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-widest flex items-center gap-3">
                <BarChart3Icon size={18} className="text-indigo-600" /> System Velocity
              </h4>
              <span className="text-[10px] font-black text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                <TrendingUpIcon size={12} /> {isLiveMode ? '0%' : '+12%'}
              </span>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Filing Speed</span>
                   <span className="text-slate-900">{isLiveMode ? 'N/A' : '2.4 Days'}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                   <div className={`h-full bg-indigo-600 rounded-full transition-all duration-1000 ${isLiveMode ? 'w-0' : 'w-[85%]'}`}></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Payout Accuracy</span>
                   <span className="text-slate-900">{isLiveMode ? '0%' : '99.2%'}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                   <div className={`h-full bg-emerald-500 rounded-full transition-all duration-1000 ${isLiveMode ? 'w-0' : 'w-[99.2%]'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/5 transition-all duration-700 ${isLiveMode ? 'bg-slate-900' : 'bg-indigo-600'}`}>
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <ActivityIcon size={20} className="text-indigo-400" />
                   <h4 className="font-black text-sm uppercase italic">Predictive Hub</h4>
                </div>
                <p className="text-indigo-100 text-xs leading-relaxed font-bold opacity-80">
                   {isLiveMode 
                    ? 'Standing by for live data ingestion. Once 5+ records are active, predictive modeling will activate based on local market trends.' 
                    : 'Based on current GA and FL trends, Q4 surplus volume is expected to rise by 18%.'}
                </p>
                <button className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${isLiveMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}>
                  {isLiveMode ? 'Initialize Forecaster' : 'Generate Market Report'}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
