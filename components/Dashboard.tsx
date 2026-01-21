
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUpIcon, 
  ClockIcon, 
  AlertCircleIcon, 
  CheckCircle2Icon,
  FilterIcon,
  ArrowRightIcon,
  WifiIcon,
  DatabaseIcon,
  SearchIcon as SearchIconLucide,
  PlusCircleIcon,
  LayoutListIcon,
  MapIcon,
  SparklesIcon,
  CalculatorIcon,
  GlobeIcon,
  ZapIcon
} from 'lucide-react';
import { Property, CaseStatus } from '../types';
import PropertyMap from './PropertyMap';

const SearchIcon = SearchIconLucide;

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
      case CaseStatus.FILED: return 'bg-purple-100 text-purple-800';
      case CaseStatus.PAID: return 'bg-green-100 text-green-800';
      case CaseStatus.REJECTED: return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* AI Intelligence Header Bar */}
      <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
           <ZapIcon size={120} fill="white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">v3.0 Intelligence</span>
              <h2 className="text-2xl font-black">Case Intelligence Hub</h2>
            </div>
            <p className="text-indigo-200 text-sm max-w-lg">
              Automated Skip Tracing and Lien Waterfall Analysis are active. Grounding search is connected to real-time property records.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-800/50 backdrop-blur-md px-4 py-3 rounded-2xl border border-indigo-700">
               <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Engine Status</p>
               <div className="flex items-center gap-2 text-green-400 font-bold text-sm">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 Search Grounding Active
               </div>
            </div>
            <button className="bg-white text-indigo-900 px-6 py-3 rounded-2xl font-black text-sm hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2">
               <SparklesIcon size={18} />
               Global Skip Trace
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          Surplus Pipeline
          {isLiveMode && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full border border-green-100">
              <WifiIcon size={12} className="animate-pulse" /> Live Stream
            </span>
          )}
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><LayoutListIcon size={14} /></button>
            <button onClick={() => setViewMode('map')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><MapIcon size={14} /></button>
          </div>
          <button onClick={() => navigate('/properties/new')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100">
            <PlusCircleIcon size={18} /> New Case
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between group hover:border-indigo-200 transition-all">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl transition-transform group-hover:scale-110`}>
              <stat.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {viewMode === 'map' ? (
        <PropertyMap properties={filteredProperties} />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/30">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">Active Cases <span className="text-xs text-slate-400">{filteredProperties.length} total</span></h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
                  <th className="px-8 py-4">Property Address</th>
                  <th className="px-8 py-4">Financials</th>
                  <th className="px-8 py-4">Overage Intelligence</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-indigo-50/30 transition-colors group cursor-pointer" onClick={() => navigate(`/properties/${property.id}`)}>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                          <MapIcon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{property.address}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{property.parcel_id} • {property.county} County</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-indigo-700">${property.surplus_amount.toLocaleString()}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Initial Surplus Est.</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}?tab=research`); }}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                         >
                            <SparklesIcon size={12} />
                            <span className="text-[10px] font-black uppercase">Skip Trace</span>
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); navigate(`/properties/${property.id}?tab=overview`); }}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                         >
                            <CalculatorIcon size={12} />
                            <span className="text-[10px] font-black uppercase">Waterfall</span>
                         </button>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border shadow-sm ${getStatusColor(property.status)}`}>
                        {property.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="p-2 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
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
