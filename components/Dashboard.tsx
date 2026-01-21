
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUpIcon, 
  ClockIcon, 
  AlertCircleIcon, 
  CheckCircle2Icon,
  ArrowRightIcon,
  WifiIcon,
  PlusCircleIcon,
  LayoutListIcon,
  MapIcon,
  SparklesIcon,
  CalculatorIcon,
  ZapIcon,
  GlobeIcon,
  ArchiveIcon
} from 'lucide-react';
import { Property, CaseStatus } from '../types';
import PropertyMap from './PropertyMap';

const MOCK_PROPERTIES: Property[] = [
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
    created_at: '2024-02-01'
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
    created_at: '2023-12-05'
  }
];

interface DashboardProps {
  isLiveMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLiveMode }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const stats = [
    { label: 'Active Pipeline', value: isLiveMode ? '$0' : '$725,000', icon: TrendingUpIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Upcoming Deadlines', value: isLiveMode ? '0 Cases' : '4 Cases', icon: ClockIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Action Required', value: isLiveMode ? '0 Tasks' : '12 Tasks', icon: AlertCircleIcon, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Recovered YTD', value: isLiveMode ? '$0' : '$1.2M', icon: CheckCircle2Icon, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const filteredProperties = useMemo(() => {
    if (isLiveMode) return [];
    return MOCK_PROPERTIES.filter(p => filterStatus === 'ALL' || p.status === filterStatus);
  }, [filterStatus, isLiveMode]);

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.NEW: return 'bg-blue-100 text-blue-800';
      case CaseStatus.READY_FOR_REVIEW: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Massive Header with Integrated Core Actions */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
           <ZapIcon size={160} fill="white" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Intelligence Active</span>
              <h2 className="text-4xl font-black tracking-tighter">Command Dashboard</h2>
            </div>
            <p className="text-slate-400 text-lg max-w-xl font-medium leading-relaxed">
              Your AI Core is processing property records in <span className="text-indigo-400 font-bold">GA</span> and <span className="text-indigo-400 font-bold">FL</span>. Use the Skip-Trace Hub to locate claimants or assembly smart claim packages below.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-3">
               <PlusCircleIcon size={20} className="text-indigo-600" />
               Manual Intake
            </button>
            <div className="h-12 w-px bg-white/10 mx-2"></div>
            <div className="flex items-center gap-3">
               <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-3xl backdrop-blur-md">
                  <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Search Nodes</p>
                  <p className="text-xl font-black">124 <span className="text-xs text-slate-500 font-bold">Live</span></p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start justify-between group hover:border-indigo-400 transition-all hover:shadow-xl hover:-translate-y-1">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl transition-transform group-hover:scale-110 shadow-sm`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          Property Pipeline
          {isLiveMode && (
            <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-100">
              <WifiIcon size={12} className="animate-pulse" /> Live
            </span>
          )}
        </h2>
        
        <div className="flex bg-slate-200 p-1.5 rounded-2xl border border-slate-300">
          <button onClick={() => setViewMode('list')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><LayoutListIcon size={14} /> List</button>
          <button onClick={() => setViewMode('map')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><MapIcon size={14} /> Map</button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <PropertyMap properties={filteredProperties} />
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-200">
                  <th className="px-10 py-6">Property Entity</th>
                  <th className="px-10 py-6 text-center">Financials</th>
                  <th className="px-10 py-6 text-center">AI Intelligence CORE</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-indigo-50/20 transition-colors group cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:border-indigo-400 group-hover:text-indigo-600 transition-all">
                          <MapIcon size={24} />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 tracking-tight">{property.address}</p>
                          <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">{property.parcel_id} • {property.county} COUNTY, {property.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-center">
                        <p className="text-lg font-black text-indigo-700 tracking-tighter">${property.surplus_amount.toLocaleString()}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">Surplus Potential</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-center gap-3">
                         <button 
                           onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}?tab=research`); }}
                           className="flex flex-col items-center gap-1 p-2 min-w-[80px] bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                         >
                            <GlobeIcon size={16} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">Research</span>
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}?tab=overview`); }}
                           className="flex flex-col items-center gap-1 p-2 min-w-[80px] bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                         >
                            <CalculatorIcon size={16} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">Waterfall</span>
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}?tab=packager`); }}
                           className="flex flex-col items-center gap-1 p-2 min-w-[80px] bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                         >
                            <ArchiveIcon size={16} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">Packager</span>
                         </button>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.1em] border shadow-sm ${getStatusColor(property.status)}`}>
                        {property.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="inline-flex p-3 bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-xl transition-all shadow-sm">
                        <ArrowRightIcon size={20} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
