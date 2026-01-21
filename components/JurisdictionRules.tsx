
import React, { useState, useMemo } from 'react';
import { 
  ScaleIcon, 
  PlusIcon, 
  EditIcon, 
  Trash2Icon, 
  SearchIcon, 
  ChevronDownIcon, 
  ShieldCheckIcon,
  InfoIcon,
  Settings2Icon,
  DatabaseIcon,
  GavelIcon,
  FileTextIcon,
  AlertCircleIcon,
  MapIcon,
  ChevronRightIcon,
  LockIcon,
  GlobeIcon,
  ZapIcon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { JurisdictionRule, User } from '../types';
import Tooltip from './Tooltip';

// Tactical Data Map
const JURISDICTION_INTEL = [
  {
    state: 'FL',
    name: 'Florida',
    moat: 'OPEN_PLAINS',
    color: 'emerald',
    desc: 'Public PDFs / Immediate Access',
    counties: [
      { name: 'Miami-Dade', level: 'OPEN_PLAINS' },
      { name: 'Broward', level: 'OPEN_PLAINS' },
      { name: 'Palm Beach', level: 'TIDAL_FLATS' },
      { name: 'Orange', level: 'OPEN_PLAINS' }
    ]
  },
  {
    state: 'GA',
    name: 'Georgia',
    moat: 'TIDAL_FLATS',
    color: 'amber',
    desc: 'Web Portals / Search Required',
    counties: [
      { name: 'Fulton', level: 'FORTIFIED_MOAT' },
      { name: 'DeKalb', level: 'TIDAL_FLATS' },
      { name: 'Gwinnett', level: 'TIDAL_FLATS' },
      { name: 'Cobb', level: 'TIDAL_FLATS' }
    ]
  },
  {
    state: 'MD',
    name: 'Maryland',
    moat: 'FORTIFIED_MOAT',
    color: 'rose',
    desc: 'Gated / FOIA Required',
    counties: [
      { name: 'Baltimore City', level: 'FORTIFIED_MOAT' },
      { name: 'Montgomery', level: 'FORTIFIED_MOAT' },
      { name: 'Prince George\'s', level: 'TIDAL_FLATS' }
    ]
  },
  {
    state: 'TX',
    name: 'Texas',
    moat: 'TIDAL_FLATS',
    color: 'amber',
    desc: 'Regional Variations / Portals',
    counties: [
      { name: 'Harris', level: 'TIDAL_FLATS' },
      { name: 'Dallas', level: 'FORTIFIED_MOAT' },
      { name: 'Bexar', level: 'TIDAL_FLATS' }
    ]
  }
];

const SIMULATION_RULES: JurisdictionRule[] = [
  {
    id: 'r1',
    state: 'GA',
    county: 'Fulton',
    claim_deadline_days: 365,
    required_documents: ['Govt ID', 'Proof of Ownership', 'Claim Form'],
    filing_method: 'Mail / In-Person',
    notes: 'Standard 1-year period from sale date.',
    attorney_required: false
  },
  {
    id: 'r2',
    state: 'FL',
    county: 'Miami-Dade',
    claim_deadline_days: 120,
    required_documents: ['ID', 'Affidavit', 'Surplus Application'],
    filing_method: 'Online Portal',
    notes: 'Requires notarization of application.',
    attorney_required: false
  }
];

const JurisdictionRules: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const rules = useMemo(() => isLiveMode ? [] : SIMULATION_RULES, [isLiveMode]);

  const filteredRules = rules.filter(r => {
    const matchesSearch = r.county.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesState = selectedState ? r.state === selectedState : true;
    return matchesSearch && matchesState;
  });

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
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <ScaleIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                {isLiveMode ? 'Production Rules' : 'Jurisdiction Sandbox'}
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">
                {isLiveMode ? 'Enterprise Compliance Configuration' : 'Simulated Regional logic'}
              </p>
            </div>
          </div>
          <p className="text-slate-600 font-bold max-w-2xl leading-relaxed text-lg">
            Tactical discovery layer. Browse states and counties to identify high-conversion recovery zones.
          </p>
        </div>
        <Tooltip content="Add a new county-specific rule set to your production environment.">
          <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-100 transition-all flex items-center gap-3 active:scale-95 border-2 border-white/10">
            <PlusIcon size={20} />
            Initialize New Rule
          </button>
        </Tooltip>
      </div>

      {/* TACTICAL BROWSER BOX */}
      <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50 p-1.5">
        <div className="bg-slate-50/50 rounded-[3rem] p-10 space-y-10 shadow-inner">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                  <MapIcon size={22} className="text-indigo-600" />
                  Tactical Ingestion Browser
                </h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1 px-1">Select state to reveal county-level friction ranks</p>
              </div>
              <div className="relative group w-full md:w-96">
                <SearchIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Direct Query: APN or County..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-black outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all shadow-inner placeholder:text-slate-400" 
                />
              </div>
           </div>

           {/* State Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {JURISDICTION_INTEL.map((intel) => (
                <button 
                  key={intel.state}
                  onClick={() => setSelectedState(selectedState === intel.state ? null : intel.state)}
                  className={`relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 hover:-translate-y-2 group shadow-xl ${
                    selectedState === intel.state 
                      ? 'border-indigo-600 ring-8 ring-indigo-500/5 bg-white shadow-2xl' 
                      : 'border-slate-100 bg-white hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 transition-all ${
                       selectedState === intel.state ? 'bg-slate-950 text-white border-white/10 shadow-xl rotate-3' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:text-indigo-600'
                     }`}>
                       {intel.state}
                     </div>
                     <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 shadow-sm ${getMoatStyles(intel.moat)}`}>
                        {intel.moat.replace('_', ' ')}
                     </div>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight italic">{intel.name}</h4>
                  <p className="text-[10px] font-bold text-slate-500 mt-2 leading-relaxed uppercase tracking-widest">{intel.desc}</p>
                  
                  {selectedState === intel.state && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                      <ChevronDownIcon size={20} />
                    </div>
                  )}
                </button>
              ))}
           </div>

           {/* Expanded County Menu */}
           {selectedState && (
             <div className="pt-10 border-t-2 border-slate-100 animate-in slide-in-from-top-4 duration-500">
               <div className="flex items-center justify-between mb-8">
                  <h5 className="text-[11px] font-black text-indigo-900 uppercase tracking-[0.2em] flex items-center gap-3">
                    <DatabaseIcon size={16} /> Regional Distribution: {JURISDICTION_INTEL.find(i => i.state === selectedState)?.name}
                  </h5>
                  <button onClick={() => setSelectedState(null)} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Clear Selection</button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {JURISDICTION_INTEL.find(i => i.state === selectedState)?.counties.map((county, idx) => (
                    <div 
                      key={idx} 
                      className={`p-6 rounded-[2rem] border-2 shadow-md hover:shadow-xl transition-all cursor-pointer group flex items-center justify-between hover:-translate-y-1 ${getMoatStyles(county.level)}`}
                    >
                       <span className="text-xs font-black uppercase tracking-tight">{county.name}</span>
                       <div className="p-2 bg-white/50 rounded-lg group-hover:scale-110 transition-transform">
                         {getMoatIcon(county.level)}
                       </div>
                    </div>
                  ))}
               </div>
             </div>
           )}
        </div>
      </div>

      {/* Main Table Result Container */}
      <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
        <div className="px-10 py-8 border-b-2 border-slate-50 bg-white flex items-center justify-between">
           <h3 className="text-sm font-black text-indigo-900 uppercase tracking-[0.15em] flex items-center gap-3">
              <ScaleIcon size={18} /> Logical Result Set
           </h3>
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Rules: {filteredRules.length}</span>
        </div>

        {filteredRules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/80 text-indigo-900 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-slate-100">
                  <th className="px-10 py-6">Jurisdiction</th>
                  <th className="px-10 py-6">Statutory Window</th>
                  <th className="px-10 py-6">Filing Method</th>
                  <th className="px-10 py-6">Required Artifacts</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50 transition-all group cursor-default">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-lg group-hover:rotate-3 transition-transform">
                          {rule.state}
                        </div>
                        <p className="text-base font-black text-slate-900 uppercase tracking-tight">{rule.county}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2 text-slate-800 font-black">
                         <Settings2Icon size={14} className="text-indigo-600" />
                         <span>{rule.claim_deadline_days} Days</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Post-Sale Deadline</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className="text-sm font-black text-slate-700 uppercase italic">{rule.filing_method}</span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-wrap gap-2">
                        {rule.required_documents.map((doc, idx) => (
                          <span key={idx} className="text-[9px] px-3 py-1 bg-white text-indigo-700 rounded-lg font-black uppercase tracking-widest border-2 border-indigo-100 shadow-sm">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all">
                          <EditIcon size={20} />
                        </button>
                        <button className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 hover:border-red-300 hover:shadow-xl hover:-translate-y-1 transition-all">
                          <Trash2Icon size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 space-y-10 bg-white shadow-inner">
             <div className="w-32 h-32 bg-white rounded-[3.5rem] flex items-center justify-center border-2 border-slate-50 shadow-2xl group hover:scale-110 hover:rotate-6 transition-all duration-700">
                <DatabaseIcon size={64} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
             </div>
             <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">Production Matrix Empty</h3>
                <p className="text-slate-600 font-bold max-w-sm mx-auto text-base leading-relaxed">
                  Your <span className="text-indigo-600">Live Engine</span> is waiting for jurisdictional configuration. Use the tactical browser above to find your target territory.
                </p>
             </div>
             <button className="px-10 py-5 bg-slate-900 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl flex items-center gap-3 active:scale-95 hover:-translate-y-1">
                <GavelIcon size={18} /> Start Custom Configuration
             </button>
          </div>
        )}
      </div>

      {/* Strategic Legend Footer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <ZapIcon size={20} className="text-emerald-500 fill-emerald-500" />
               <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight italic">Low Friction: Green</h4>
            </div>
            <p className="text-xs text-emerald-800/80 font-bold leading-relaxed italic">"Lists are public and downloadable. Strategy: Speed to lead. Automate skip-tracing immediately."</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border-2 border-amber-200 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <GlobeIcon size={20} className="text-amber-500" />
               <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight italic">Med Friction: Amber</h4>
            </div>
            <p className="text-xs text-amber-800/80 font-bold leading-relaxed italic">"Data is buried in web portals. Strategy: Persistent manual clicks or bridge scrapers."</p>
         </div>
         <div className="bg-white p-8 rounded-[2.5rem] border-2 border-rose-200 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3">
               <LockIcon size={20} className="text-rose-600" />
               <h4 className="text-sm font-black text-rose-900 uppercase tracking-tight italic">High Friction: Red</h4>
            </div>
            <p className="text-xs text-rose-800/80 font-bold leading-relaxed italic">"Moated territory. Strategy: Formal ORR/FOIA filings. Higher yield, zero competition."</p>
         </div>
      </div>
    </div>
  );
};

export default JurisdictionRules;
