
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

// Tactical Data Map Expanded to Top 10 National Candidates
const JURISDICTION_INTEL = [
  {
    state: 'FL',
    name: 'Florida',
    moat: 'OPEN_PLAINS',
    color: 'emerald',
    desc: 'Public PDFs / Immediate Access',
    counties: [{ name: 'Miami-Dade', level: 'OPEN_PLAINS' }, { name: 'Broward', level: 'OPEN_PLAINS' }, { name: 'Palm Beach', level: 'TIDAL_FLATS' }]
  },
  {
    state: 'GA',
    name: 'Georgia',
    moat: 'TIDAL_FLATS',
    color: 'amber',
    desc: 'Web Portals / Search Required',
    counties: [{ name: 'Fulton', level: 'FORTIFIED_MOAT' }, { name: 'DeKalb', level: 'TIDAL_FLATS' }, { name: 'Gwinnett', level: 'TIDAL_FLATS' }]
  },
  {
    state: 'TX',
    name: 'Texas',
    moat: 'TIDAL_FLATS',
    color: 'amber',
    desc: 'Regional Variations / Portals',
    counties: [{ name: 'Harris', level: 'TIDAL_FLATS' }, { name: 'Dallas', level: 'FORTIFIED_MOAT' }, { name: 'Bexar', level: 'TIDAL_FLATS' }]
  },
  {
    state: 'NC',
    name: 'North Carolina',
    moat: 'OPEN_PLAINS',
    color: 'emerald',
    desc: 'Clerk of Court Surplus Lists',
    counties: [{ name: 'Mecklenburg', level: 'OPEN_PLAINS' }, { name: 'Wake', level: 'OPEN_PLAINS' }, { name: 'Guilford', level: 'TIDAL_FLATS' }]
  },
  {
    state: 'CA',
    name: 'California',
    moat: 'FORTIFIED_MOAT',
    color: 'rose',
    desc: 'Chapter 8 / Excess Proceeds',
    counties: [{ name: 'Los Angeles', level: 'FORTIFIED_MOAT' }, { name: 'San Diego', level: 'TIDAL_FLATS' }, { name: 'Orange', level: 'TIDAL_FLATS' }]
  },
  {
    state: 'WA',
    name: 'Washington',
    moat: 'OPEN_PLAINS',
    color: 'emerald',
    desc: 'Highly Transparent Treasury Lists',
    counties: [{ name: 'King', level: 'OPEN_PLAINS' }, { name: 'Pierce', level: 'OPEN_PLAINS' }, { name: 'Snohomish', level: 'OPEN_PLAINS' }]
  },
  {
    state: 'SC',
    name: 'South Carolina',
    moat: 'TIDAL_FLATS',
    color: 'amber',
    desc: 'Delinquent Tax Sale Results',
    counties: [{ name: 'Charleston', level: 'TIDAL_FLATS' }, { name: 'Greenville', level: 'FORTIFIED_MOAT' }]
  },
  {
    state: 'TN',
    name: 'Tennessee',
    moat: 'TIDAL_FLATS',
    color: 'amber',
    desc: 'Chancery Court Surplus',
    counties: [{ name: 'Shelby', level: 'TIDAL_FLATS' }, { name: 'Davidson', level: 'FORTIFIED_MOAT' }]
  },
  {
    state: 'OH',
    name: 'Ohio',
    moat: 'FORTIFIED_MOAT',
    color: 'rose',
    desc: 'Forfeiture & Judicial Sales',
    counties: [{ name: 'Cuyahoga', level: 'FORTIFIED_MOAT' }, { name: 'Franklin', level: 'TIDAL_FLATS' }]
  },
  {
    state: 'AZ',
    name: 'Arizona',
    moat: 'OPEN_PLAINS',
    color: 'emerald',
    desc: 'Treasurer Overages & Deeds',
    counties: [{ name: 'Maricopa', level: 'OPEN_PLAINS' }, { name: 'Pima', level: 'TIDAL_FLATS' }]
  }
];

const SIMULATION_RULES: JurisdictionRule[] = [
  { id: 'r1', state: 'GA', county: 'Fulton', claim_deadline_days: 365, required_documents: ['Govt ID', 'Deed', 'Claim Form'], filing_method: 'Mail', attorney_required: false },
  { id: 'r2', state: 'FL', county: 'Miami-Dade', claim_deadline_days: 120, required_documents: ['ID', 'Affidavit', 'Application'], filing_method: 'Online', attorney_required: false },
  { id: 'r3', state: 'WA', county: 'King', claim_deadline_days: 730, required_documents: ['ID', 'Proof of Successor'], filing_method: 'Mail', attorney_required: false }
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
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <ScaleIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                National Registry
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">
                Top 10 High-Yield Jurisdictions
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden p-1.5">
        <div className="bg-slate-50/50 rounded-[3rem] p-10 space-y-10 shadow-inner">
           <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                  <MapIcon size={22} className="text-indigo-600" />
                  Tactical State Matrix
                </h3>
              </div>
              <div className="relative group w-full md:w-96">
                <SearchIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Direct Query State or County..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-black outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all shadow-inner" 
                />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {JURISDICTION_INTEL.map((intel) => (
                <button 
                  key={intel.state}
                  onClick={() => setSelectedState(selectedState === intel.state ? null : intel.state)}
                  className={`relative p-8 rounded-[2.5rem] border-2 text-left transition-all duration-500 hover:-translate-y-2 group shadow-xl ${
                    selectedState === intel.state ? 'border-indigo-600 bg-white' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 ${
                       selectedState === intel.state ? 'bg-slate-950 text-white shadow-xl' : 'bg-slate-50 text-slate-400'
                     }`}>
                       {intel.state}
                     </div>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight italic">{intel.name}</h4>
                  <div className={`mt-3 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border-2 w-fit ${getMoatStyles(intel.moat)}`}>
                        {intel.moat.replace('_', ' ')}
                  </div>
                </button>
              ))}
           </div>

           {selectedState && (
             <div className="pt-10 border-t-2 border-slate-100 animate-in slide-in-from-top-4 duration-500">
               <div className="flex items-center justify-between mb-8">
                  <h5 className="text-[11px] font-black text-indigo-900 uppercase tracking-[0.2em] flex items-center gap-3">
                    <DatabaseIcon size={16} /> Regional Distribution: {JURISDICTION_INTEL.find(i => i.state === selectedState)?.name}
                  </h5>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {JURISDICTION_INTEL.find(i => i.state === selectedState)?.counties.map((county, idx) => (
                    <div key={idx} className={`p-6 rounded-[2rem] border-2 shadow-md flex items-center justify-between ${getMoatStyles(county.level)}`}>
                       <span className="text-xs font-black uppercase tracking-tight">{county.name}</span>
                       {getMoatIcon(county.level)}
                    </div>
                  ))}
               </div>
             </div>
           )}
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b-2 border-slate-50 bg-white flex items-center justify-between">
           <h3 className="text-sm font-black text-indigo-900 uppercase tracking-[0.15em] flex items-center gap-3">
              <ScaleIcon size={18} /> Active Rule Set
           </h3>
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
                  <tr key={rule.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
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
                      <button className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
                        <EditIcon size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-40 text-center">
             <p className="text-slate-400 font-black uppercase italic">Select a state above to see local recovery rules.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JurisdictionRules;
