
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
  UnplugIcon
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
  },
  {
    id: '3',
    state: 'TX',
    county: 'Harris',
    parcel_id: '123-456-789-0',
    address: '1001 Main St, Houston, TX 77002',
    tax_sale_date: '2024-03-01',
    sale_price: 220000,
    total_debt: 15000,
    surplus_amount: 205000,
    deadline_date: '2024-09-01',
    status: CaseStatus.NEW,
    created_at: '2024-03-05',
    priority_score: 71,
    risk_level: 'HIGH',
    est_payout_days: 90,
    assigned_to_user_id: undefined
  }
];

interface DashboardProps {
  isLiveMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLiveMode }) => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ minSurplus: '', maxSurplus: '' });

  // FINANCIAL STATS: Zeroed in Live Mode unless real data is added
  const stats = [
    { label: 'Active Pipeline', value: isLiveMode ? '$0' : '$735,000', icon: TrendingUpIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', tip: 'Total estimated gross surplus for all active cases in the system.' },
    { label: 'High Yield (90+)', value: isLiveMode ? '0' : '12 Cases', icon: SparklesIcon, color: 'text-amber-600', bg: 'bg-amber-50', tip: 'Cases with an Intelligence Rank over 90, indicating highest recovery probability.' },
    { label: 'Action Required', value: isLiveMode ? '0' : '8 Tasks', icon: AlertCircleIcon, color: 'text-red-600', bg: 'bg-red-50', tip: 'Urgent compliance deadlines or document deficiencies requiring human review.' },
    { label: 'Predictive YTD', value: isLiveMode ? '$0' : '$1.4M', icon: CheckCircle2Icon, color: 'text-green-600', bg: 'bg-green-50', tip: 'Estimated annual recovery based on historical conversion rates and current pipeline.' },
  ];

  const filteredProperties = useMemo(() => {
    // CRITICAL: Return empty array for Live Mode until real data ingestion is implemented
    if (isLiveMode) return [];
    
    return properties.filter(p => {
      if (searchQuery && !p.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.minSurplus && p.surplus_amount < Number(filters.minSurplus)) return false;
      return true;
    }).sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
  }, [searchQuery, filters, isLiveMode, properties]);

  const handleAssignChange = (propertyId: string, userId: string) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId ? { ...p, assigned_to_user_id: userId === 'unassigned' ? undefined : userId } : p
    ));
  };

  const getUserInitials = (userId: string | undefined) => {
    if (!userId) return '?';
    const user = TEAM_MEMBERS.find(u => u.id === userId);
    if (!user) return '?';
    return user.email[0].toUpperCase();
  };

  const getUserName = (userId: string | undefined) => {
    if (!userId) return 'Unassigned';
    const user = TEAM_MEMBERS.find(u => u.id === userId);
    return user ? user.email.split('@')[0] : 'Unknown';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Top Intelligence Banner */}
      <div className={`rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group border border-white/5 transition-all duration-700 ${isLiveMode ? 'bg-slate-950 ring-2 ring-indigo-500/20' : 'bg-slate-900'}`}>
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
           {isLiveMode ? <DatabaseIcon size={160} fill="white" /> : <ZapIcon size={160} fill="white" />}
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className={`text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isLiveMode ? 'bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'bg-indigo-600'}`}>
                {isLiveMode ? 'Live Engine Synchronized' : 'AI Core v3.0 Connected'}
              </span>
              <h2 className="text-4xl font-black tracking-tighter">
                {isLiveMode ? 'Production Terminal' : 'Recovery Intelligence'}
              </h2>
            </div>
            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
              {isLiveMode 
                ? 'Standing by for live data ingestion. Connect your first County Treasurer feed or perform a Manual Intake.' 
                : 'Proprietary yielding engine active. Analyzing simulation records for jurisdictional compliance training.'}
            </p>
          </div>
          <Tooltip content="Launch the manual intake wizard for a new overage record.">
            <button onClick={() => navigate('/properties/new')} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-3 border border-slate-200 shadow-xl shadow-indigo-950/20">
              <PlusCircleIcon size={20} className="text-indigo-600" /> New Intake
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Tooltip key={i} content={stat.tip}>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start justify-between group hover:border-indigo-400 transition-all hover:shadow-xl hover:-translate-y-1 h-full cursor-default">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                  </div>
                  <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-sm`}><stat.icon size={24} /></div>
                </div>
              </Tooltip>
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight uppercase">
                {isLiveMode ? 'Active Production Feed' : 'Pipeline'} 
                <span className="text-slate-400">({filteredProperties.length})</span>
              </h2>
              <div className="flex items-center gap-4">
                 <Tooltip content="Filter the pipeline by specific address components or Parcel IDs.">
                   <div className="relative w-80">
                      <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search addresses or APNs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm" />
                   </div>
                 </Tooltip>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              {filteredProperties.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      <th className="px-8 py-6">Intelligence Rank</th>
                      <th className="px-8 py-6">Property Context</th>
                      <th className="px-8 py-6">Assignee</th>
                      <th className="px-8 py-6 text-center">Risk Level</th>
                      <th className="px-8 py-6">Est. Net Recovery</th>
                      <th className="px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProperties.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                        <td className="px-8 py-6" onClick={() => navigate(`/properties/${p.id}`)}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-inner border ${p.priority_score! > 85 ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                              {p.priority_score}
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6" onClick={() => navigate(`/properties/${p.id}`)}>
                          <div>
                            <p className="text-sm font-black text-slate-900 leading-tight">{p.address}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{p.parcel_id} • {p.county}, {p.state}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <Tooltip content="Assign this case to a team member for verification.">
                            <div className="relative group/assignee">
                              <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${p.assigned_to_user_id ? 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-sm' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                  {p.assigned_to_user_id ? getUserInitials(p.assigned_to_user_id) : <UserPlusIcon size={12} />}
                                </div>
                                <div className="flex flex-col">
                                  <p className="text-[11px] font-black text-slate-800 leading-none mb-1">{getUserName(p.assigned_to_user_id)}</p>
                                  <select 
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                    value={p.assigned_to_user_id || 'unassigned'}
                                    onChange={(e) => handleAssignChange(p.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <option value="unassigned">Unassigned</option>
                                    {TEAM_MEMBERS.map(member => (
                                      <option key={member.id} value={member.id}>{member.email.split('@')[0]}</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>
                          </Tooltip>
                        </td>
                        <td className="px-8 py-6 text-center" onClick={() => navigate(`/properties/${p.id}`)}>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${
                            p.risk_level === 'LOW' ? 'bg-green-50 text-green-700 border-green-200' :
                            p.risk_level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {p.risk_level} Risk
                          </span>
                        </td>
                        <td className="px-8 py-6" onClick={() => navigate(`/properties/${p.id}`)}>
                          <p className="text-sm font-black text-indigo-600">${p.surplus_amount.toLocaleString()}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Est. Payout: {p.est_payout_days} Days</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => navigate(`/properties/${p.id}`)}
                            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm"
                          >
                            <ArrowRightIcon size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="py-32 text-center flex flex-col items-center justify-center space-y-6">
                   <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                      <UnplugIcon size={40} />
                   </div>
                   <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No Live Records Found</h3>
                      <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto">
                        Your production pipeline is clean. Initialize a <span className="text-indigo-600 font-bold">New Intake</span> or connect a county treasurer feed to begin recovery.
                      </p>
                   </div>
                   {isLiveMode && (
                     <button onClick={() => navigate('/properties/new')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2">
                       <PlusCircleIcon size={16} /> Start First Intake
                     </button>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Intelligence & Metrics */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                <BarChart3Icon size={16} className="text-indigo-600" /> {isLiveMode ? 'Production' : 'Recovery'} Velocity
              </h4>
              <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                <TrendingUpIcon size={10} /> {isLiveMode ? '0%' : '+12%'}
              </span>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                   <span>Verification Speed</span>
                   <span className="text-slate-900">{isLiveMode ? 'N/A' : '2.4 Days'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className={`h-full bg-indigo-600 rounded-full transition-all duration-1000 ${isLiveMode ? 'w-0' : 'w-[85%]'}`}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                   <span>Conversion Rate</span>
                   <span className="text-slate-900">{isLiveMode ? '0%' : '42%'}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className={`h-full bg-emerald-500 rounded-full transition-all duration-1000 ${isLiveMode ? 'w-0' : 'w-[42%]'}`}></div>
                </div>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group transition-colors duration-700 ${isLiveMode ? 'bg-slate-900 border border-white/10' : 'bg-indigo-600'}`}>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                   <ActivityIcon size={18} className="text-indigo-200" />
                   <h4 className="font-black text-sm uppercase">Forecasting Hub</h4>
                </div>
                <p className="text-indigo-100 text-xs leading-relaxed opacity-80">
                   {isLiveMode 
                    ? 'Standing by for first live case. Once 5+ records are active, predictive modeling will activate.' 
                    : 'Based on current GA and FL trends, Q4 surplus volume is expected to rise by 18%.'}
                </p>
                <Tooltip content="Launch a predictive modeling session.">
                  <button className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}>
                    {isLiveMode ? 'Initialize Forecaster' : 'Run Full Simulation'}
                  </button>
                </Tooltip>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
