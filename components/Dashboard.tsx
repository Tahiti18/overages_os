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
  ZapIcon,
  FilterIcon,
  XIcon,
  CalendarIcon,
  DollarSignIcon,
  ChevronDownIcon,
  RotateCcwIcon,
  SearchIcon,
  MapPinIcon
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
    created_at: '2024-03-05'
  }
];

interface DashboardProps {
  isLiveMode?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isLiveMode }) => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<CaseStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Advanced Filter State
  const [filters, setFilters] = useState({
    minSurplus: '',
    maxSurplus: '',
    startDate: '',
    endDate: '',
    deadlineWithinDays: ''
  });

  const stats = [
    { label: 'Active Pipeline', value: isLiveMode ? '$0' : '$735,000', icon: TrendingUpIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Upcoming Deadlines', value: isLiveMode ? '0 Cases' : '4 Cases', icon: ClockIcon, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Action Required', value: isLiveMode ? '0 Tasks' : '12 Tasks', icon: AlertCircleIcon, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Recovered YTD', value: isLiveMode ? '$0' : '$1.2M', icon: CheckCircle2Icon, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const resetFilters = () => {
    setFilters({
      minSurplus: '',
      maxSurplus: '',
      startDate: '',
      endDate: '',
      deadlineWithinDays: ''
    });
    setFilterStatus('ALL');
    setSearchQuery('');
  };

  const filteredProperties = useMemo(() => {
    if (isLiveMode) return [];
    return MOCK_PROPERTIES.filter(p => {
      // Status Filter
      if (filterStatus !== 'ALL' && p.status !== filterStatus) return false;
      
      // Search Query
      if (searchQuery && !p.address.toLowerCase().includes(searchQuery.toLowerCase()) && !p.parcel_id.toLowerCase().includes(searchQuery.toLowerCase())) return false;

      // Surplus Amount Range
      if (filters.minSurplus && p.surplus_amount < Number(filters.minSurplus)) return false;
      if (filters.maxSurplus && p.surplus_amount > Number(filters.maxSurplus)) return false;
      
      // Tax Sale Date Range
      if (filters.startDate && p.tax_sale_date < filters.startDate) return false;
      if (filters.endDate && p.tax_sale_date > filters.endDate) return false;
      
      // Deadline Proximity
      if (filters.deadlineWithinDays) {
        const today = new Date();
        const deadline = new Date(p.deadline_date);
        const diffTime = deadline.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0 || diffDays > Number(filters.deadlineWithinDays)) return false;
      }
      
      return true;
    });
  }, [filterStatus, filters, searchQuery, isLiveMode]);

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.NEW: return 'bg-blue-100 text-blue-800';
      case CaseStatus.READY_FOR_REVIEW: return 'bg-yellow-100 text-yellow-800';
      case CaseStatus.APPROVED_TO_FILE: return 'bg-indigo-100 text-indigo-800';
      case CaseStatus.FILED: return 'bg-purple-100 text-purple-800';
      case CaseStatus.PAID: return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const hasActiveFilters = filterStatus !== 'ALL' || searchQuery !== '' || Object.values(filters).some(v => v !== '');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Massive Header */}
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
              Your AI Core is processing property records in <span className="text-indigo-400 font-bold">GA</span>, <span className="text-indigo-400 font-bold">FL</span>, and <span className="text-indigo-400 font-bold">TX</span>. Use the Filter Intelligence to prioritize high-value recoveries.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => navigate('/properties/new')}
              className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center gap-3"
            >
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

      {/* Toolbar */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 tracking-tight whitespace-nowrap">
              Property Pipeline
              {isLiveMode && (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-100">
                  <WifiIcon size={12} className="animate-pulse" /> Live
                </span>
              )}
            </h2>
            <div className="relative flex-1 md:w-80">
              <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search address or parcel ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                isFilterOpen || hasActiveFilters 
                  ? 'bg-indigo-600 text-white border-indigo-600' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
              }`}
            >
              <FilterIcon size={14} />
              {isFilterOpen ? 'Hide Filters' : 'Filter Intelligence'}
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-white rounded-full ml-1 animate-pulse"></span>
              )}
            </button>

            <div className="flex bg-slate-200 p-1.5 rounded-2xl border border-slate-300">
              <button onClick={() => setViewMode('list')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><LayoutListIcon size={14} /> List</button>
              <button onClick={() => setViewMode('map')} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}><MapIcon size={14} /> Map</button>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        {isFilterOpen && (
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-xl animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Surplus Amount Range */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <DollarSignIcon size={12} className="text-indigo-500" /> Surplus Amount Range
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.minSurplus}
                    onChange={(e) => setFilters({...filters, minSurplus: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-300">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.maxSurplus}
                    onChange={(e) => setFilters({...filters, maxSurplus: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Tax Sale Date Range */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CalendarIcon size={12} className="text-indigo-500" /> Tax Sale Date Range
                </label>
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none focus:border-indigo-500"
                  />
                  <span className="text-slate-300">-</span>
                  <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-bold outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Deadline Proximity */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <ClockIcon size={12} className="text-indigo-500" /> Deadline Proximity
                </label>
                <div className="relative">
                  <select 
                    value={filters.deadlineWithinDays}
                    onChange={(e) => setFilters({...filters, deadlineWithinDays: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none appearance-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="">Any Timeframe</option>
                    <option value="30">Within 30 Days</option>
                    <option value="90">Within 90 Days</option>
                    <option value="180">Within 180 Days</option>
                  </select>
                  <ChevronDownIcon size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Status & Reset */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  Workflow Status
                </label>
                <div className="relative">
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold outline-none appearance-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    {Object.values(CaseStatus).map(s => (
                      <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  <ChevronDownIcon size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 Results: <span className="text-indigo-600">{filteredProperties.length} active cases found</span>
               </p>
               <button 
                 onClick={resetFilters}
                 className="flex items-center gap-2 px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
               >
                 <RotateCcwIcon size={14} />
                 Reset Engine
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Property Display View */}
      {viewMode === 'map' ? (
        <PropertyMap properties={filteredProperties} />
      ) : (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Property Context</th>
                <th className="px-8 py-6">Financials</th>
                <th className="px-8 py-6">Timeline</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProperties.map((p) => (
                <tr 
                  key={p.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/properties/${p.id}`)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:border-indigo-200 border border-transparent transition-all">
                        <MapPinIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-tight">{p.address}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{p.parcel_id} • {p.county}, {p.state}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-black text-indigo-600">${p.surplus_amount.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">Gross Surplus</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-xs font-black text-slate-800">{p.deadline_date}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <ClockIcon size={12} className="text-orange-500" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Statutory Deadline</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${getStatusColor(p.status)}`}>
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-all shadow-sm">
                      <ArrowRightIcon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <FilterIcon size={32} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-800 font-black uppercase text-xs tracking-widest">No Intelligence Matching</p>
                        <p className="text-slate-400 text-xs font-medium">No cases match your current filter parameters.</p>
                      </div>
                      <button 
                        onClick={resetFilters}
                        className="mt-4 text-indigo-600 text-[10px] font-black uppercase tracking-widest border-b-2 border-indigo-600 pb-0.5 hover:text-indigo-700 hover:border-indigo-700 transition-all"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;