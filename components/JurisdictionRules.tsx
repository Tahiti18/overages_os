
import React, { useState, useMemo } from 'react';
import { 
  ScaleIcon, 
  SearchIcon, 
  ShieldCheckIcon,
  InfoIcon,
  Settings2Icon,
  DatabaseIcon,
  MapIcon,
  ChevronRightIcon,
  LockIcon,
  GlobeIcon,
  ZapIcon,
  FilterIcon,
  LayersIcon,
  LayoutGridIcon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { JurisdictionRule, User } from '../types';
import Tooltip from './Tooltip';

// THE NATIONAL DIRECTORY: All 50 States mapped by statutory recovery logic
const US_STATES_DATA = [
  { id: 'AL', name: 'Alabama', region: 'South', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'AK', name: 'Alaska', region: 'West', tier: 2, moat: 'FORTIFIED_MOAT' },
  { id: 'AZ', name: 'Arizona', region: 'West', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'AR', name: 'Arkansas', region: 'South', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'CA', name: 'California', region: 'West', tier: 1, moat: 'FORTIFIED_MOAT' },
  { id: 'CO', name: 'Colorado', region: 'West', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'CT', name: 'Connecticut', region: 'Northeast', tier: 2, moat: 'TIDAL_FLATS' },
  { id: 'DE', name: 'Delaware', region: 'Northeast', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'FL', name: 'Florida', region: 'South', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'GA', name: 'Georgia', region: 'South', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'HI', name: 'Hawaii', region: 'West', tier: 2, moat: 'FORTIFIED_MOAT' },
  { id: 'ID', name: 'Idaho', region: 'West', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'IL', name: 'Illinois', region: 'Midwest', tier: 2, moat: 'FORTIFIED_MOAT' },
  { id: 'IN', name: 'Indiana', region: 'Midwest', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'IA', name: 'Iowa', region: 'Midwest', tier: 2, moat: 'FORTIFIED_MOAT' },
  { id: 'KS', name: 'Kansas', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'KY', name: 'Kentucky', region: 'South', tier: 2, moat: 'TIDAL_FLATS' },
  { id: 'LA', name: 'Louisiana', region: 'South', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'ME', name: 'Maine', region: 'Northeast', tier: 2, moat: 'OPEN_PLAINS' },
  { id: 'MD', name: 'Maryland', region: 'South', tier: 1, moat: 'FORTIFIED_MOAT' },
  { id: 'MA', name: 'Massachusetts', region: 'Northeast', tier: 2, moat: 'FORTIFIED_MOAT' },
  { id: 'MI', name: 'Michigan', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'MN', name: 'Minnesota', region: 'Midwest', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'MS', name: 'Mississippi', region: 'South', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'MO', name: 'Missouri', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'MT', name: 'Montana', region: 'West', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'NE', name: 'Nebraska', region: 'Midwest', tier: 2, moat: 'TIDAL_FLATS' },
  { id: 'NV', name: 'Nevada', region: 'West', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'NH', name: 'New Hampshire', region: 'Northeast', tier: 2, moat: 'TIDAL_FLATS' },
  { id: 'NJ', name: 'New Jersey', region: 'Northeast', tier: 2, moat: 'FORTIFIED_MOAT' },
  { id: 'NM', name: 'New Mexico', region: 'West', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'NY', name: 'New York', region: 'Northeast', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'NC', name: 'North Carolina', region: 'South', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'ND', name: 'North Dakota', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'OH', name: 'Ohio', region: 'Midwest', tier: 1, moat: 'FORTIFIED_MOAT' },
  { id: 'OK', name: 'Oklahoma', region: 'South', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'OR', name: 'Oregon', region: 'West', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'PA', name: 'Pennsylvania', region: 'Northeast', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'RI', name: 'Rhode Island', region: 'Northeast', tier: 2, moat: 'TIDAL_FLATS' },
  { id: 'SC', name: 'South Carolina', region: 'South', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'SD', name: 'South Dakota', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'TN', name: 'Tennessee', region: 'South', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'TX', name: 'Texas', region: 'South', tier: 1, moat: 'TIDAL_FLATS' },
  { id: 'UT', name: 'Utah', region: 'West', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'VT', name: 'Vermont', region: 'Northeast', tier: 2, moat: 'OPEN_PLAINS' },
  { id: 'VA', name: 'Virginia', region: 'South', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'WA', name: 'Washington', region: 'West', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'WV', name: 'West Virginia', region: 'South', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'WI', name: 'Wisconsin', region: 'Midwest', tier: 1, moat: 'OPEN_PLAINS' },
  { id: 'WY', name: 'Wyoming', region: 'West', tier: 1, moat: 'OPEN_PLAINS' }
];

const JurisdictionRules: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<'ALL' | 'South' | 'West' | 'Midwest' | 'Northeast'>('ALL');

  const filteredStates = useMemo(() => {
    return US_STATES_DATA.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRegion = activeRegion === 'ALL' || s.region === activeRegion;
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, activeRegion]);

  const getMoatStyles = (level: string) => {
    switch (level) {
      case 'OPEN_PLAINS': return 'border-emerald-500 bg-emerald-50 text-emerald-700';
      case 'TIDAL_FLATS': return 'border-amber-500 bg-amber-50 text-amber-700';
      case 'FORTIFIED_MOAT': return 'border-rose-600 bg-rose-50 text-rose-700';
      default: return 'border-slate-200 bg-slate-50 text-slate-500';
    }
  };

  const getMoatIcon = (level: string) => {
    switch (level) {
      case 'OPEN_PLAINS': return <ZapIcon size={14} className="fill-emerald-500" />;
      case 'TIDAL_FLATS': return <GlobeIcon size={14} />;
      case 'FORTIFIED_MOAT': return <LockIcon size={14} />;
      default: return <InfoIcon size={14} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <MapIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                National Map
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">
                Comprehensive 50-State Statutory Matrix
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[1.5rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100 overflow-x-auto no-scrollbar">
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
        <div className="bg-slate-50/50 rounded-[3rem] p-10 space-y-10 shadow-inner">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                  <DatabaseIcon size={22} className="text-indigo-600" />
                  Tactical Discovery Matrix
                </h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Filtering {filteredStates.length} Active Jurisdictions</p>
              </div>
              <div className="relative group w-full md:w-96">
                <SearchIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Quick-Jump to State..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-black outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all shadow-inner" 
                />
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
              {filteredStates.map((intel) => (
                <button 
                  key={intel.id}
                  onClick={() => setSelectedState(selectedState === intel.id ? null : intel.id)}
                  className={`relative p-6 rounded-[2.25rem] border-2 text-left transition-all duration-500 hover:-translate-y-1.5 group shadow-xl ${
                    selectedState === intel.id ? 'border-indigo-600 bg-white ring-8 ring-indigo-500/5' : 'border-slate-100 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl border-2 transition-colors ${
                       selectedState === intel.id ? 'bg-slate-950 text-white border-slate-900' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:border-indigo-100'
                     }`}>
                       {intel.id}
                     </div>
                     {intel.tier === 1 && (
                       <Tooltip content="High Volume Surplus State">
                          <ZapIcon size={14} className="text-amber-500 fill-amber-500" />
                       </Tooltip>
                     )}
                  </div>
                  <h4 className="text-lg font-black text-slate-900 tracking-tight italic truncate">{intel.name}</h4>
                  <div className={`mt-3 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 w-fit ${getMoatStyles(intel.moat)}`}>
                        {intel.moat.replace('_', ' ')}
                  </div>
                </button>
              ))}
           </div>

           {selectedState && (
             <div className="pt-10 border-t-2 border-slate-200 animate-in slide-in-from-top-4 duration-500">
               <div className="bg-white p-10 rounded-[2.5rem] border-2 border-indigo-100 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 ring-1 ring-indigo-500/5">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 bg-slate-950 text-white rounded-[1.5rem] flex items-center justify-center font-black text-3xl shadow-3xl rotate-3">
                        {selectedState}
                     </div>
                     <div>
                        <h5 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">{US_STATES_DATA.find(s => s.id === selectedState)?.name} Recovery Profile</h5>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Tier {US_STATES_DATA.find(s => s.id === selectedState)?.tier} • {US_STATES_DATA.find(s => s.id === selectedState)?.region} Region</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3">
                        <Settings2Icon size={16} /> Configure Rules
                     </button>
                     <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3">
                        <LayersIcon size={16} /> Fleet Discovery
                     </button>
                  </div>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Strategic Footer metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-3xl border-2 border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl">
                    <ShieldCheckIcon size={24} />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight italic">Constitutional Integrity</h4>
               </div>
               <p className="text-sm text-indigo-200/90 font-bold leading-relaxed">
                  All 50 states are monitored for statutory changes following the Tyler v. Hennepin County Supreme Court ruling, ensuring 100% compliant claim filings.
               </p>
            </div>
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-1000 rotate-12">
               <ScaleIcon size={140} fill="white" />
            </div>
         </div>
         <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl space-y-6 hover:-translate-y-1 transition-all ring-1 ring-slate-100/50">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-md border border-emerald-100">
                 <ZapIcon size={24} />
               </div>
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Tier 1 Rapid-Discovery</h4>
            </div>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
               States flagged with a gold lightning bolt are "Direct Deed" jurisdictions. These provide the highest monthly surplus volume and the shortest recovery cycles.
            </p>
         </div>
         <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl space-y-6 hover:-translate-y-1 transition-all ring-1 ring-slate-100/50">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-md border border-amber-100">
                 <GlobeIcon size={24} />
               </div>
               <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Regional Fleet Sync</h4>
            </div>
            <p className="text-sm text-slate-600 font-bold leading-relaxed">
               Each region (South, Midwest, etc.) uses localized extraction bots tuned to the specific PDF and portal layouts used by county treasurers in those zones.
            </p>
         </div>
      </div>
    </div>
  );
};

export default JurisdictionRules;
