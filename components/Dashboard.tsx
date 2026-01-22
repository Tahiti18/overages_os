
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
  BarChart3Icon,
  ActivityIcon,
  SearchIcon,
  ServerIcon,
  UnplugIcon,
  UserPlusIcon
} from 'lucide-react';
import { Property, CaseStatus, User, UserRole } from '../types';
import Tooltip from './Tooltip';

const TEAM_MEMBERS: User[] = [
  { id: 'u1', email: 'admin@prospector.ai', role: UserRole.ADMIN, is_active: true },
  { id: 'u2', email: 'reviewer_jane@prospector.ai', role: UserRole.REVIEWER, is_active: true },
  { id: 'u3', email: 'agent_bob@prospector.ai', role: UserRole.FILING_AGENT, is_active: true },
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
    { label: 'Active Pipeline', value: isLiveMode ? '$0' : '$735,000', icon: TrendingUpIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', tip: 'Total estimated gross surplus.' },
    { label: 'High Yield (90+)', value: isLiveMode ? '0' : '12 Cases', icon: SparklesIcon, color: 'text-amber-600', bg: 'bg-amber-50', tip: 'Intelligence Rank over 90.' },
    { label: 'Action Required', value: isLiveMode ? '0' : '8 Tasks', icon: AlertCircleIcon, color: 'text-rose-600', bg: 'bg-rose-50', tip: 'Urgent compliance deadlines.' },
    { label: 'Predictive YTD', value: isLiveMode ? '$0' : '$1.4M', icon: CheckCircle2Icon, color: 'text-emerald-600', bg: 'bg-emerald-50', tip: 'Estimated annual recovery.' },
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className={`rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group border-2 transition-all duration-700 ${isLiveMode ? 'bg-slate-950 border-emerald-500/20 shadow-emerald-500/10' : 'bg-slate-900 border-indigo-500/10 shadow-indigo-500/10'}`}>
        <div className="absolute top-0 right-0 p-16 opacity-10 group-hover:scale-110 transition-transform duration-1000">
           {isLiveMode ? <ServerIcon size={180} fill="white" /> : <ZapIcon size={180} fill="white" />}
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-lg ${isLiveMode ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' : 'bg-indigo-600 text-white border-indigo-400/30'}`}>
                <div className={`w-2 h-2 rounded-full ${isLiveMode ? 'bg-emerald-400 animate-pulse' : 'bg-white'}`}></div>
                {isLiveMode ? 'Production Environment Active' : 'AI Core v3.0 Connected'}
              </div>
              <span className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em]">Deployment ID: RAILWAY-PRD-92</span>
            </div>
            <h2 className="text-5xl font-black tracking-tighter max-w-2xl leading-tight">
              {isLiveMode ? 'Standing by for Live Case Ingestion.' : 'Enterprise Recovery Intelligence.'}
            </h2>
            <p className="text-slate-300 text-lg max-w-xl font-medium leading-relaxed">
              {isLiveMode 
                ? 'Your deployment is synchronized with Google Gemini 3.0 clusters. Connect a County Treasurer feed to populate your production pipeline.' 
                : 'Proprietary yielding engine active. Simulation records are ready for jurisdictional compliance training.'}
            </p>
          </div>
          <button onClick={() => navigate('/properties/new')} className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl transition-all flex items-center gap-4 border-2 border-slate-100 shadow-2xl">
            <PlusCircleIcon size={22} className="text-indigo-600" /> New Intake Wizard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Tooltip key={i} content={stat.tip}>
                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl flex items-start justify-between group hover:-translate-y-2 transition-all h-full cursor-default">
                  <div>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-md`}><stat.icon size={24} /></div>
                </div>
              </Tooltip>
            ))}
          </div>

          <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden min-h-[400px]">
            {filteredProperties.length > 0 ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-100 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em]">
                    <th className="px-10 py-6">Rank</th>
                    <th className="px-10 py-6">Property Context</th>
                    <th className="px-10 py-6 text-center">Risk</th>
                    <th className="px-10 py-6">Est. Net</th>
                    <th className="px-10 py-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProperties.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="px-10 py-8" onClick={() => navigate(`/properties/${p.id}`)}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 ${p.priority_score! > 85 ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                          {p.priority_score}
                        </div>
                      </td>
                      <td className="px-10 py-8" onClick={() => navigate(`/properties/${p.id}`)}>
                        <div>
                          <p className="text-base font-black text-slate-900 leading-tight mb-1">{p.address}</p>
                          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{p.parcel_id} • {p.county}, {p.state}</p>
                        </div>
                      </td>
                      <td className="px-10 py-8 text-center" onClick={() => navigate(`/properties/${p.id}`)}>
                        <span className={`text-[9px] font-black px-4 py-2 rounded-full uppercase border-2 ${
                          p.risk_level === 'LOW' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                          p.risk_level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-red-50 text-red-700 border-red-300'
                        }`}>
                          {p.risk_level}
                        </span>
                      </td>
                      <td className="px-10 py-8" onClick={() => navigate(`/properties/${p.id}`)}>
                        <p className="text-base font-black text-indigo-600">${p.surplus_amount.toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{p.est_payout_days} Day Est.</p>
                      </td>
                      <td className="px-10 py-8 text-right">
                        <button className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-300 group-hover:text-indigo-600 transition-all shadow-lg">
                          <ArrowRightIcon size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 space-y-8">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border-2 border-slate-100 shadow-2xl group">
                  <UnplugIcon size={48} className="text-slate-300 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Production Cache Empty</h3>
                  <p className="text-slate-600 text-sm max-w-sm mx-auto font-medium">Your production environment is live, but no cases have been ingested.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl space-y-10">
            <div className="flex items-center justify-between border-b-2 border-slate-50 pb-6">
              <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-widest flex items-center gap-3">
                <BarChart3Icon size={18} className="text-indigo-600" /> System Velocity
              </h4>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-700 uppercase tracking-widest">
                   <span>Filing Speed</span>
                   <span className="text-slate-900 font-black">{isLiveMode ? 'N/A' : '2.4 Days'}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                   <div className={`h-full bg-indigo-600 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(79,70,229,0.5)] ${isLiveMode ? 'w-0' : 'w-[85%]'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
