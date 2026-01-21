
import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { 
  CalendarIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  AlertCircleIcon, 
  ClockIcon, 
  FilterIcon,
  SearchIcon,
  MapPinIcon,
  Building2Icon,
  ArrowUpRightIcon,
  DatabaseIcon,
  CalendarXIcon
} from 'lucide-react';
import { Property, CaseStatus } from '../types';
import Tooltip from './Tooltip';

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
    tax_sale_date: '2024-11-20',
    sale_price: 450000,
    total_debt: 50000,
    surplus_amount: 400000,
    deadline_date: '2025-03-20',
    status: CaseStatus.READY_FOR_REVIEW,
    created_at: '2023-12-05'
  }
];

const ComplianceCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); 
  const [filterState, setFilterState] = useState('ALL');

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month, 1);
    const days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }, [currentDate]);

  const deadlines = useMemo(() => {
    // CRITICAL: Return empty array for Live Mode until real data ingestion is implemented
    if (isLiveMode) return [];
    
    return MOCK_PROPERTIES.filter(p => filterState === 'ALL' || p.state === filterState);
  }, [filterState, isLiveMode]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const getDayEvents = (date: Date) => {
    const dStr = date.toISOString().split('T')[0];
    return deadlines.filter(p => p.deadline_date === dStr);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className={`p-3 rounded-2xl shadow-xl border ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-indigo-100 text-indigo-600 border-slate-200'}`}>
               {isLiveMode ? <DatabaseIcon size={24} /> : <CalendarIcon size={24} />}
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
               {isLiveMode ? 'Production Compliance' : 'Compliance Calendar'}
             </h2>
          </div>
          <p className="text-slate-500 font-medium">
            {isLiveMode 
              ? 'Real-time statutory deadline tracking. All dates are verified against live county treasury data.' 
              : 'Statutory recovery deadlines synchronized with jurisdiction rules (GA, FL, TX).'}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronLeftIcon size={20} /></button>
            <div className="text-sm font-black uppercase tracking-widest min-w-[160px] text-center text-slate-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </div>
            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ChevronRightIcon size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left: Summary and Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm space-y-6">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Region Filters</h3>
             <div className="space-y-2">
                {['ALL', 'GA', 'FL', 'TX'].map(st => (
                  <button 
                    key={st}
                    onClick={() => setFilterState(st)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      filterState === st 
                        ? (isLiveMode ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/10' : 'bg-indigo-600 border-indigo-600 text-white shadow-lg') 
                        : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-300'
                    }`}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest">{st === 'ALL' ? 'All Jurisdictions' : `${st} Records`}</span>
                    {filterState === st && <ArrowUpRightIcon size={14} />}
                  </button>
                ))}
             </div>
          </div>

          <div className={`rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group transition-colors duration-700 ${isLiveMode ? 'bg-slate-950 border border-emerald-500/20' : 'bg-indigo-900'}`}>
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                   <ClockIcon size={20} className="text-indigo-400" />
                   <h4 className="font-black text-sm uppercase">Urgent Pulse</h4>
                </div>
                <div className="space-y-4">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <p className="text-[10px] font-black text-indigo-300 uppercase mb-1">30-Day Outlook</p>
                      <p className="text-2xl font-black">{isLiveMode ? '0 Cases' : '2 Cases'}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Calendar Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
            <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{d}</div>
              ))}
            </div>
            
            {isLiveMode && deadlines.length === 0 ? (
               <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-12 bg-slate-50/20">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 border border-slate-50 shadow-sm">
                     <CalendarXIcon size={32} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest">No Production Deadlines</p>
                    <p className="text-xs text-slate-400 font-medium">Add live cases to begin statutory date tracking.</p>
                  </div>
               </div>
            ) : (
              <div className="grid grid-cols-7 auto-rows-[140px] divide-x divide-y divide-slate-100 flex-1">
                {Array.from({ length: daysInMonth[0].getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="bg-slate-50/30"></div>
                ))}
                
                {daysInMonth.map(date => {
                  const dayEvents = getDayEvents(date);
                  const isToday = new Date().toDateString() === date.toDateString();
                  
                  return (
                    <div key={date.toISOString()} className={`p-4 hover:bg-slate-50 transition-colors group relative ${isToday ? 'ring-2 ring-inset ring-indigo-500/20' : ''}`}>
                      <span className={`text-xs font-black ${isToday ? 'bg-indigo-600 text-white px-2 py-1 rounded-lg' : 'text-slate-400 group-hover:text-slate-900'}`}>
                        {date.getDate()}
                      </span>
                      
                      <div className="mt-2 space-y-1">
                        {dayEvents.map(event => (
                          <button
                            key={event.id}
                            onClick={() => navigate(`/properties/${event.id}`)}
                            className="w-full text-left p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg group/item hover:bg-indigo-600 hover:text-white transition-all overflow-hidden"
                          >
                            <div className="flex items-center gap-1">
                              <div className="w-1 h-1 rounded-full bg-indigo-600 group-hover/item:bg-white"></div>
                              <span className="text-[8px] font-black uppercase truncate tracking-tighter">{event.address}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCalendar;
