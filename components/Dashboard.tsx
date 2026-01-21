
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
  MapIcon
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Case Dashboard
            {isLiveMode && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded-full border border-green-100">
                <WifiIcon size={12} className="animate-pulse" /> Live Data Stream
              </span>
            )}
          </h2>
          <p className="text-slate-500">
            {isLiveMode ? 'Waiting for real-time surplus events from connected county records.' : 'Monitoring demo property surplus opportunities.'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex bg-slate-200 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutListIcon size={14} />
              List View
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <MapIcon size={14} />
              Map Explorer
            </button>
          </div>

          <button 
            onClick={() => navigate('/properties/new')}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 active:scale-[0.98]"
          >
            <PlusCircleIcon size={18} />
            Create New Case
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between group hover:border-indigo-200 transition-colors cursor-default">
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

      {/* Conditional Rendering based on View Mode */}
      {viewMode === 'map' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <PropertyMap properties={filteredProperties} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              Active Properties
              <span className="text-xs font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-md">{filteredProperties.length}</span>
            </h3>
            <div className="flex items-center gap-3">
              {!isLiveMode && (
                 <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                   <FilterIcon size={14} className="text-slate-400" />
                   <select 
                     value={filterStatus}
                     onChange={(e) => setFilterStatus(e.target.value as any)}
                     className="text-xs font-bold border-none focus:ring-0 p-0 text-slate-600 cursor-pointer bg-transparent"
                   >
                     <option value="ALL">All Statuses</option>
                     {Object.values(CaseStatus).map(s => (
                       <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                     ))}
                   </select>
                 </div>
              )}
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/30 text-slate-400 text-[10px] uppercase tracking-widest font-bold border-b border-slate-200">
                    <th className="px-8 py-4">Property / APN</th>
                    <th className="px-8 py-4">Jurisdiction</th>
                    <th className="px-8 py-4">Surplus Amount</th>
                    <th className="px-8 py-4">Deadline</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProperties.map((property) => (
                    <tr 
                      key={property.id} 
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => navigate(`/properties/${property.id}`)}
                    >
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-800">{property.address}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{property.parcel_id}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-medium text-slate-700">{property.county} County</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{property.state}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-indigo-700">${property.surplus_amount.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">{property.deadline_date}</span>
                          <span className="text-[10px] text-orange-600 font-bold uppercase tracking-tight">Immediate Action</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border ${getStatusColor(property.status)}`}>
                          {property.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-slate-300 group-hover:text-indigo-600 transition-colors p-2">
                          <ArrowRightIcon size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-32 text-center animate-in zoom-in-95 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 text-slate-300 mb-6 border-4 border-white shadow-inner">
                {isLiveMode ? <DatabaseIcon size={32} className="animate-pulse text-indigo-400" /> : <SearchIcon size={32} />}
              </div>
              <h4 className="text-lg font-bold text-slate-800">
                {isLiveMode ? 'Active Data Connection' : 'No Results Found'}
              </h4>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mt-1 leading-relaxed">
                {isLiveMode 
                  ? 'Prospector AI is listening for live tax sale events. New surplus records will appear here as they are processed.'
                  : 'No properties currently match your filters.'}
              </p>
              {isLiveMode && (
                <div className="mt-8 flex justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500/50"></span>
                  <span className="w-2 h-2 rounded-full bg-green-500/20"></span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
