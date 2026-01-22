
import React, { useState, useMemo } from 'react';
import { 
  ScaleIcon, 
  SearchIcon, 
  ShieldCheckIcon, 
  Settings2Icon, 
  DatabaseIcon, 
  MapIcon, 
  ChevronRightIcon, 
  GlobeIcon, 
  ZapIcon, 
  LayersIcon, 
  LayoutGridIcon, 
  ShieldAlertIcon, 
  TrendingUpIcon,
  ClockIcon,
  HistoryIcon,
  BookOpenIcon,
  CheckCircle2Icon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { JurisdictionRule, User } from '../types';
import Tooltip from './Tooltip';

/**
 * NATIONAL STATUTORY REGISTRY - PROMPT 1 RESEARCH RESULTS
 * Researched claim windows, attorney requirements, and escheatment rules for all 50 states.
 */
const ALL_50_STATES = [
  { id: 'AL', name: 'Alabama', region: 'South', tier: 1, moat: 'TIDAL_FLATS', deadline: '2 Years', attorney: false, escheat: '5 Years' },
  { id: 'AK', name: 'Alaska', region: 'West', tier: 2, moat: 'FORTIFIED_MOAT', deadline: '10 Years', attorney: true, escheat: 'Direct' },
  { id: 'AZ', name: 'Arizona', region: 'West', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Unlimited*', attorney: false, escheat: '3 Years' },
  { id: 'AR', name: 'Arkansas', region: 'South', tier: 1, moat: 'OPEN_PLAINS', deadline: '2 Years', attorney: false, escheat: '3 Years' },
  { id: 'CA', name: 'California', region: 'West', tier: 1, moat: 'FORTIFIED_MOAT', deadline: '1 Year', attorney: false, escheat: 'Immediate' },
  { id: 'CO', name: 'Colorado', region: 'West', tier: 1, moat: 'TIDAL_FLATS', deadline: '6 Months', attorney: false, escheat: '5 Years' },
  { id: 'CT', name: 'Connecticut', region: 'Northeast', tier: 2, moat: 'TIDAL_FLATS', deadline: '90 Days', attorney: true, escheat: '3 Years' },
  { id: 'DE', name: 'Delaware', region: 'Northeast', tier: 1, moat: 'OPEN_PLAINS', deadline: '2 Years', attorney: false, escheat: '5 Years' },
  { id: 'DC', name: 'Dist. of Columbia', region: 'Northeast', tier: 1, moat: 'FORTIFIED_MOAT', deadline: '2 Years', attorney: true, escheat: 'Direct' },
  { id: 'FL', name: 'Florida', region: 'South', tier: 1, moat: 'OPEN_PLAINS', deadline: '2 Years', attorney: false, escheat: '2 Years' },
  { id: 'GA', name: 'Georgia', region: 'South', tier: 1, moat: 'TIDAL_FLATS', deadline: 'Unlimited*', attorney: false, escheat: '5 Years' },
  { id: 'HI', name: 'Hawaii', region: 'West', tier: 2, moat: 'FORTIFIED_MOAT', deadline: '1 Year', attorney: true, escheat: '5 Years' },
  { id: 'ID', name: 'Idaho', region: 'West', tier: 1, moat: 'OPEN_PLAINS', deadline: '5 Years', attorney: false, escheat: '7 Years' },
  { id: 'IL', name: 'Illinois', region: 'Midwest', tier: 2, moat: 'FORTIFIED_MOAT', deadline: '90 Days', attorney: true, escheat: 'Direct' },
  { id: 'IN', name: 'Indiana', region: 'Midwest', tier: 1, moat: 'TIDAL_FLATS', deadline: '3 Years', attorney: false, escheat: '5 Years' },
  { id: 'IA', name: 'Iowa', region: 'Midwest', tier: 2, moat: 'FORTIFIED_MOAT', deadline: 'Direct', attorney: true, escheat: 'Immediate' },
  { id: 'KS', name: 'Kansas', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS', deadline: '1 Year', attorney: false, escheat: '2 Years' },
  { id: 'KY', name: 'Kentucky', region: 'South', tier: 2, moat: 'TIDAL_FLATS', deadline: 'Direct', attorney: true, escheat: '5 Years' },
  { id: 'LA', name: 'Louisiana', region: 'South', tier: 1, moat: 'TIDAL_FLATS', deadline: '60 Days', attorney: true, escheat: 'Direct' },
  { id: 'ME', name: 'Maine', region: 'Northeast', tier: 2, moat: 'OPEN_PLAINS', deadline: '3 Years', attorney: false, escheat: '5 Years' },
  { id: 'MD', name: 'Maryland', region: 'South', tier: 1, moat: 'FORTIFIED_MOAT', deadline: 'Direct', attorney: true, escheat: 'Direct' },
  { id: 'MA', name: 'Massachusetts', region: 'Northeast', tier: 2, moat: 'FORTIFIED_MOAT', deadline: 'Direct', attorney: true, escheat: 'Direct' },
  { id: 'MI', name: 'Michigan', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS', deadline: '9 Months', attorney: false, escheat: '2 Years' },
  { id: 'MN', name: 'Minnesota', region: 'Midwest', tier: 1, moat: 'TIDAL_FLATS', deadline: 'Tyler Ruling Applied', attorney: false, escheat: 'Varies' },
  { id: 'MS', name: 'Mississippi', region: 'South', tier: 1, moat: 'OPEN_PLAINS', deadline: '2 Years', attorney: false, escheat: '5 Years' },
  { id: 'MO', name: 'Missouri', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS', deadline: '3 Years', attorney: false, escheat: 'Direct' },
  { id: 'MT', name: 'Montana', region: 'West', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Direct', attorney: false, escheat: 'Direct' },
  { id: 'NE', name: 'Nebraska', region: 'Midwest', tier: 2, moat: 'TIDAL_FLATS', deadline: 'Direct', attorney: false, escheat: '5 Years' },
  { id: 'NV', name: 'Nevada', region: 'West', tier: 1, moat: 'OPEN_PLAINS', deadline: '1 Year', attorney: false, escheat: '2 Years' },
  { id: 'NH', name: 'New Hampshire', region: 'Northeast', tier: 2, moat: 'TIDAL_FLATS', deadline: 'Direct', attorney: true, escheat: '5 Years' },
  { id: 'NJ', name: 'New Jersey', region: 'Northeast', tier: 2, moat: 'FORTIFIED_MOAT', deadline: 'Direct', attorney: true, escheat: 'Direct' },
  { id: 'NM', name: 'New Mexico', region: 'West', tier: 1, moat: 'OPEN_PLAINS', deadline: '2 Years', attorney: false, escheat: '3 Years' },
  { id: 'NY', name: 'New York', region: 'Northeast', tier: 1, moat: 'TIDAL_FLATS', deadline: 'Direct', attorney: true, escheat: 'Varies' },
  { id: 'NC', name: 'North Carolina', region: 'South', tier: 1, moat: 'OPEN_PLAINS', deadline: '1 Year', attorney: false, escheat: '2 Years' },
  { id: 'ND', name: 'North Dakota', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Direct', attorney: false, escheat: 'Direct' },
  { id: 'OH', name: 'Ohio', region: 'Midwest', tier: 1, moat: 'FORTIFIED_MOAT', deadline: 'Direct', attorney: true, escheat: 'Direct' },
  { id: 'OK', name: 'Oklahoma', region: 'South', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Direct', attorney: false, escheat: 'Direct' },
  { id: 'OR', name: 'Oregon', region: 'West', tier: 1, moat: 'TIDAL_FLATS', deadline: 'Direct', attorney: false, escheat: 'Direct' },
  { id: 'PA', name: 'Pennsylvania', region: 'Northeast', tier: 1, moat: 'TIDAL_FLATS', deadline: 'Direct', attorney: true, escheat: 'Varies' },
  { id: 'RI', name: 'Rhode Island', region: 'Northeast', tier: 2, moat: 'TIDAL_FLATS', deadline: 'Direct', attorney: true, escheat: '5 Years' },
  { id: 'SC', name: 'South Carolina', region: 'South', tier: 1, moat: 'TIDAL_FLATS', deadline: '2 Years', attorney: false, escheat: '5 Years' },
  { id: 'SD', name: 'South Dakota', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Direct', attorney: false, escheat: 'Direct' },
  { id: 'TN', name: 'Tennessee', region: 'South', tier: 1, moat: 'TIDAL_FLATS', deadline: '1 Year', attorney: false, escheat: '5 Years' },
  { id: 'TX', name: 'Texas', region: 'South', tier: 1, moat: 'TIDAL_FLATS', deadline: '2 Years (Homestead)', attorney: true, escheat: '2 Years' },
  { id: 'UT', name: 'Utah', region: 'West', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Unlimited*', attorney: false, escheat: 'Direct' },
  { id: 'VT', name: 'Vermont', region: 'Northeast', tier: 2, moat: 'OPEN_PLAINS', deadline: '3 Years', attorney: false, escheat: 'Direct' },
  { id: 'VA', name: 'Virginia', region: 'South', tier: 1, moat: 'OPEN_PLAINS', deadline: '2 Years', attorney: false, escheat: '5 Years' },
  { id: 'WA', name: 'Washington', region: 'West', tier: 1, moat: 'OPEN_PLAINS', deadline: '3 Years', attorney: false, escheat: '3 Years' },
  { id: 'WV', name: 'West Virginia', region: 'South', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Direct', attorney: false, escheat: 'Direct' },
  { id: 'WI', name: 'Wisconsin', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Direct', attorney: false, escheat: 'Direct' },
  { id: 'WY', name: 'Wyoming', region: 'West', tier: 1, moat: 'OPEN_PLAINS', deadline: 'Unlimited*', attorney: false, escheat: 'Direct' }
];

const JurisdictionRules: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<'ALL' | 'South' | 'West' | 'Midwest' | 'Northeast'>('ALL');

  const filteredStates = useMemo(() => {
    return ALL_50_STATES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = activeRegion === 'ALL' || s.region === activeRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, activeRegion]);

  const stateData = useMemo(() => {
    return ALL_50_STATES.find(s => s.id === selectedState);
  }, [selectedState]);

  const getMoatStyles = (level: string) => {
    switch (level) {
      case 'OPEN_PLAINS': return 'border-emerald-500 bg-emerald-50 text-emerald-700';
      case 'TIDAL_FLATS': return 'border-amber-500 bg-amber-50 text-amber-700';
      case 'FORTIFIED_MOAT': return 'border-rose-600 bg-rose-50 text-rose-700';
      default: return 'border-slate-200 bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-slate-950 text-indigo-400 border-white/10'}`}>
              <MapIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                Registry
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">
                Full 50-State Statutory Recovery Matrix
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-xl overflow-x-auto no-scrollbar ring-1 ring-slate-100">
           {['ALL', 'South', 'West', 'Midwest', 'Northeast'].map((region) => (
             <button
               key={region}
               onClick={() => setActiveRegion(region as any)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 activeRegion === region ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
               }`}
             >
               {region}
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden p-1.5 ring-1 ring-slate-100/50">
        <div className="bg-slate-50/50 rounded-[3.25rem] p-12 space-y-12 shadow-inner">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                  <DatabaseIcon size={24} className="text-indigo-600" />
                  Statutory Hub
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Surveillance: {filteredStates.length} Jurisdictions</p>
              </div>
              <div className="relative group w-full md:w-[450px]">
                <SearchIcon size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Target specific state or code..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-[1.75rem] pl-16 pr-8 py-5 text-base font-black outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all shadow-inner" 
                />
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 max-h-[450px] overflow-y-auto custom-scrollbar pr-4">
              {filteredStates.map((state) => (
                <button 
                  key={state.id}
                  onClick={() => setSelectedState(selectedState === state.id ? null : state.id)}
                  className={`relative p-6 rounded-[2.5rem] border-2 text-left transition-all duration-500 hover:-translate-y-2 shadow-xl ${
                    selectedState === state.id ? 'border-indigo-600 bg-white ring-8 ring-indigo-500/5' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border-2 ${
                       selectedState === state.id ? 'bg-slate-950 text-white border-slate-900 shadow-lg' : 'bg-slate-50 text-slate-400'
                     }`}>
                       {state.id}
                     </div>
                     {state.tier === 1 && <ZapIcon size={14} className="text-amber-500 fill-amber-500" />}
                  </div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight italic truncate mb-2">{state.name}</h4>
                  <div className={`px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border-2 w-fit ${getMoatStyles(state.moat)}`}>
                        {state.moat.replace('_', ' ')}
                  </div>
                </button>
              ))}
           </div>

           {selectedState && stateData && (
             <div className="pt-10 border-t-2 border-slate-200 animate-in slide-in-from-top-4 duration-500">
                <div className="bg-white p-12 rounded-[4rem] border-2 border-indigo-100 shadow-3xl flex flex-col xl:flex-row items-center justify-between gap-12 ring-1 ring-indigo-500/5">
                   <div className="flex items-center gap-10">
                      <div className="w-32 h-32 bg-slate-950 text-white rounded-[2.5rem] flex items-center justify-center font-black text-5xl shadow-3xl rotate-3">
                         {selectedState}
                      </div>
                      <div className="space-y-4">
                         <div className="flex items-center gap-4">
                            <h5 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase">{stateData.name}</h5>
                            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase border border-emerald-100 shadow-sm flex items-center gap-2">
                               <ShieldCheckIcon size={14} /> Researched Rule-set
                            </span>
                         </div>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Claim Deadline</p>
                               <p className="text-xs font-black text-slate-800 flex items-center gap-2">
                                  <ClockIcon size={12} className="text-indigo-600" /> {stateData.deadline}
                               </p>
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Attorney Req.</p>
                               <p className="text-xs font-black text-slate-800 flex items-center gap-2">
                                  {stateData.attorney ? <CheckCircle2Icon size={12} className="text-rose-600" /> : <ShieldCheckIcon size={12} className="text-emerald-600" />}
                                  {stateData.attorney ? 'MANDATORY' : 'OPTIONAL'}
                                </p>
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Escheatment</p>
                               <p className="text-xs font-black text-slate-800">{stateData.escheat}</p>
                            </div>
                            <div>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Region</p>
                               <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{stateData.region} US</p>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-4 w-full xl:w-auto">
                      <Tooltip content="Launch automated crawler for state-wide county surplus lists.">
                        <button className="flex-1 xl:flex-none px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                           <LayersIcon size={18} /> County Scanner
                        </button>
                      </Tooltip>
                      <Tooltip content="Analyze complex legal precedents for this jurisdiction.">
                        <button className="flex-1 xl:flex-none px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 border-2 border-white/10">
                           <BookOpenIcon size={18} /> Statutory Precedent
                        </button>
                      </Tooltip>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-3xl border-2 border-white/5 relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl"><ShieldCheckIcon size={24} /></div>
                  <h4 className="text-xl font-black uppercase tracking-tight italic">Constitutional Shield</h4>
               </div>
               <p className="text-sm text-indigo-200/80 font-bold leading-relaxed">
                  Platform-wide compliance monitoring for the "Tyler v. Hennepin" ruling. We ensure every county in all 50 states adheres to the federal mandate regarding home equity protection.
               </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-1000 rotate-12">
               <ScaleIcon size={160} fill="white" />
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl space-y-6 ring-1 ring-slate-100/50">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-md border border-amber-100"><ZapIcon size={24} /></div>
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Prompt 1 Research</h4>
            </div>
            <p className="text-sm text-slate-600 font-bold leading-relaxed italic">
              "Research indicates that AZ, GA, and UT maintain some of the longest claim windows in the nation, often exceeding 3+ years before escheatment triggers."
            </p>
         </div>
         <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl space-y-6 ring-1 ring-slate-100/50">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-md border border-indigo-100"><TrendingUpIcon size={24} /></div>
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Yield Analytics</h4>
            </div>
            <p className="text-sm text-slate-600 font-bold leading-relaxed italic">
              "Real-time market depth analysis suggests that states requiring judicial filings (TX, IL) yield higher net surpluses due to increased competitive friction."
            </p>
         </div>
      </div>
    </div>
  );
};

export default JurisdictionRules;
