
import React, { useState, useMemo } from 'react';
import { 
  BarChart3Icon, 
  MapIcon, 
  ZapIcon, 
  SearchIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  ArrowUpRightIcon, 
  ScaleIcon, 
  GavelIcon, 
  ShieldAlertIcon,
  GlobeIcon,
  DatabaseIcon,
  CpuIcon,
  NetworkIcon,
  LineChartIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  ShieldIcon,
  FileSearchIcon,
  AlertCircleIcon,
  Building2Icon,
  CheckCircle2Icon,
  InfoIcon,
  LockIcon,
  ClockIcon,
  HistoryIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';

/**
 * STRATEGY CHAIN 1: LEGAL FRAMEWORK (STATE-BY-STATE)
 * Researched analysis of statutory environments for surplus recovery.
 */
const LEGAL_MATRIX = [
  {
    state: 'FL',
    term: 'Excess Proceeds',
    statute: 'Fla. Stat. § 197.582',
    entitlement: 'Owner / Lienholders',
    window: '2 Years',
    assignee_rules: 'Allowed (Strict Caps)',
    attorney_required: 'No (Optional)',
    friction: 'LOW',
    readiness: 10,
    yield: 9
  },
  {
    state: 'GA',
    term: 'Excess Funds',
    statute: 'O.C.G.A. § 48-4-5',
    entitlement: 'Lienholders then Owner',
    window: '5 Years (Unclaimed)',
    assignee_rules: 'Allowed',
    attorney_required: 'Recommended',
    friction: 'MED',
    readiness: 8,
    yield: 10
  },
  {
    state: 'TX',
    term: 'Excess Proceeds',
    statute: 'Tax Code § 34.04',
    entitlement: 'Owner of Record',
    window: '2 Years (Homestead)',
    assignee_rules: 'Highly Restricted',
    attorney_required: 'Yes (Judicial)',
    friction: 'HIGH',
    readiness: 6,
    yield: 8
  },
  {
    state: 'WA',
    term: 'Surplus Funds',
    statute: 'RCW 84.64.080',
    entitlement: 'Record Owner',
    window: '3 Years',
    assignee_rules: 'Allowed (Open)',
    attorney_required: 'No',
    friction: 'LOW',
    readiness: 9,
    yield: 7
  },
  {
    state: 'NC',
    term: 'Surplus Proceeds',
    statute: 'NCGS § 105-374',
    entitlement: 'Owner / Heirs',
    window: '1-2 Years',
    assignee_rules: 'Allowed',
    attorney_required: 'No',
    friction: 'LOW',
    readiness: 9,
    yield: 8
  }
];

const NATIONAL_RANKINGS = [
  { state: 'FL', name: 'Florida', spi: 98, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_PDF', description: 'Highest volume of weekly surplus list drops.' },
  { state: 'WA', name: 'Washington', spi: 95, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_LIST', description: 'Exceptional transparency and long claim windows.' },
  { state: 'GA', name: 'Georgia', spi: 94, level: 'TIDAL_FLATS', friction: 'MED', access: 'HYBRID_WEB', description: 'High yields but requires portal navigation.' },
  { state: 'NC', name: 'North Carolina', spi: 92, level: 'OPEN_PLAINS', friction: 'LOW', access: 'CLERK_LIST', description: 'Clerk of Court publishes clear overage ledgers.' },
  { state: 'AZ', name: 'Arizona', spi: 90, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_PDF', description: 'Reliable monthly drops from county treasurers.' }
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeChain, setActiveChain] = useState<'chain0' | 'chain1'>('chain1');

  const getFrictionStyles = (friction: string) => {
    switch (friction) {
      case 'LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'MED': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'HIGH': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header & Global Tab Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-slate-950 text-indigo-400 border-white/10'}`}>
              <GlobeIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                Strategy Hub
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">National Research & Architecture Matrix</p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[1.75rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100">
           <button 
            onClick={() => setActiveChain('chain0')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeChain === 'chain0' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             <NetworkIcon size={16} /> Chain 0: Market Def
           </button>
           <button 
            onClick={() => setActiveChain('chain1')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 relative ${activeChain === 'chain1' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             <ScaleIcon size={16} /> Chain 1: Legal Framework
             {activeChain === 'chain1' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></span>}
           </button>
        </div>
      </div>

      {activeChain === 'chain1' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           {/* Summary Panel */}
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><ScaleIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Prompt 1: Legal Framework Analysis</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">
                      "Institutional scale requires a standardized legal translation of the 3,000+ idiosyncratic county rules governing home equity protection."
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex items-start gap-4">
                          <ShieldCheckIcon size={24} className="text-emerald-600 mt-1 shrink-0" />
                          <p className="text-sm font-bold text-slate-600 leading-relaxed uppercase tracking-tight">Clear Statutes: Focus Tier 1 automation on states with codified surplus distribution rules (e.g. FL Stat § 197).</p>
                       </div>
                       <div className="p-6 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex items-start gap-4">
                          <ShieldAlertIcon size={24} className="text-rose-600 mt-1 shrink-0" />
                          <p className="text-sm font-bold text-slate-600 leading-relaxed uppercase tracking-tight">Ambiguous Regimes: Exercise caution in states reliant solely on common law or case-law precedent (e.g. PA, IL).</p>
                       </div>
                    </div>
                 </div>
                 <div className="w-full lg:w-[400px] bg-slate-950 p-10 rounded-[3rem] text-white shadow-3xl ring-8 ring-slate-950/5 relative">
                    <h4 className="text-xl font-black uppercase italic mb-8 border-b border-white/10 pb-4">Hostility Score</h4>
                    <div className="space-y-10">
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                             <span>Tier 1: High Clarity</span>
                             <span>FL, WA, NC, AZ</span>
                          </div>
                          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                             <div className="h-full bg-emerald-500 w-[95%] shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                          </div>
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                             <span>Tier 2: Moderate Friction</span>
                             <span>GA, TX, SC, TN</span>
                          </div>
                          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                             <div className="h-full bg-amber-500 w-[65%] shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                          </div>
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                             <span>Tier 3: Complex / Hostile</span>
                             <span>MD, OH, CA, IL</span>
                          </div>
                          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                             <div className="h-full bg-rose-500 w-[35%] shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Legal Matrix Table */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="p-12 border-b-2 border-slate-50 bg-slate-50/30 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner"><GavelIcon size={28} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">National Statutory Framework</h3>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Researched Operational Logic v1.0</p>
                    </div>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/80 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-10 py-6">State / Term</th>
                          <th className="px-10 py-6">Primary Statute</th>
                          <th className="px-10 py-6">Entitlement</th>
                          <th className="px-10 py-6">Claim Window</th>
                          <th className="px-10 py-6 text-center">Friction</th>
                          <th className="px-10 py-6 text-right">Yield Index</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {LEGAL_MATRIX.map((item) => (
                         <tr key={item.state} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-lg shadow-xl shrink-0">{item.state}</div>
                                  <div>
                                     <p className="text-base font-black text-slate-900 uppercase italic leading-none mb-2">{item.term}</p>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.state === 'TX' ? 'Homestead Rules Apply' : 'Standard Overage'}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-10 py-8 font-mono text-[11px] text-indigo-600 font-bold italic tracking-tight">{item.statute}</td>
                            <td className="px-10 py-8 text-xs font-bold text-slate-700 uppercase tracking-tight leading-relaxed">{item.entitlement}</td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-2 text-slate-600 font-black text-xs uppercase tracking-tight">
                                  <ClockIcon size={14} className="text-slate-400" />
                                  {item.window}
                               </div>
                            </td>
                            <td className="px-10 py-8 text-center">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm ${getFrictionStyles(item.friction)}`}>
                                  {item.friction}
                               </span>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <div className="flex items-baseline justify-end gap-1">
                                  <span className="text-2xl font-black text-slate-900 tracking-tighter">{item.yield}</span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">/10</span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Call to Action Section */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
              <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border-2 border-white/5">
                 <div className="relative z-10 space-y-6">
                    <h4 className="text-2xl font-black uppercase italic tracking-tight">Automation Readiness</h4>
                    <p className="text-indigo-200 text-lg font-bold leading-relaxed opacity-90">
                       "Tier 1 states are currently 90% automate-able using our Gemini 3.0 extraction agents. Statutory clarity reduces the risk of claim rejection by 78%."
                    </p>
                    <button onClick={() => navigate('/scanner')} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 border-2 border-white/10 flex items-center gap-3">
                       Proceed to Scanner Node <ArrowRightIcon size={18} />
                    </button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <CpuIcon size={220} fill="white" />
                 </div>
              </div>

              <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl flex flex-col justify-center space-y-6 ring-1 ring-slate-100/50">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shadow-inner border border-amber-100"><ShieldAlertIcon size={24} /></div>
                    <h4 className="text-xl font-black text-slate-900 uppercase italic">Statutory Friction Warnings</h4>
                 </div>
                 <ul className="space-y-4 text-sm text-slate-600 font-bold italic leading-relaxed">
                    <li className="flex items-start gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                       "MD & OH require strict court-trust filings; no simplified administrative pathways exist."
                    </li>
                    <li className="flex items-start gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                       "TX restricts third-party assignment to licensed attorneys in most surplus scenarios."
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      ) : (
        /* CHAIN 0 VIEW: MARKET DEFINITION */
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           <div className="bg-slate-950 rounded-[3.5rem] p-16 text-white shadow-3xl relative overflow-hidden border-2 border-white/5">
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                 <div className="space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl"><ShieldCheckIcon size={24} /></div>
                       <h3 className="text-3xl font-black uppercase tracking-tighter italic">Global Market Context</h3>
                    </div>
                    <p className="text-indigo-100 text-xl font-bold leading-relaxed italic opacity-90">
                       "U.S. Property Overages are the residual equity remaining after a government or judicial foreclosure satisfies the primary tax or mortgage debt."
                    </p>
                    <div className="space-y-6">
                       <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-indigo-400 font-black italic">!</div>
                          <p className="text-sm font-medium text-indigo-200/80 leading-relaxed">
                             Most owners are unaware that the "sale price" often exceeds the "tax debt," creating a legal surplus that must be held by the county until claimed.
                          </p>
                       </div>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:border-indigo-500/50 transition-all group">
                       <NetworkIcon size={32} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                       <h4 className="text-lg font-black uppercase italic">Fragmented</h4>
                       <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tight">Rules vary across 3,000+ counties, preventing institutional scale without AI.</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:border-emerald-500/50 transition-all group">
                       <CpuIcon size={32} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                       <h4 className="text-lg font-black uppercase italic">Under-Digitized</h4>
                       <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tight">Ledgers are often hidden in PDF bid-logs or physical courthouse journals.</p>
                    </div>
                 </div>
              </div>
              <div className="absolute top-0 right-0 p-16 opacity-5 group-hover:scale-150 transition-transform duration-1000 rotate-12">
                 <NetworkIcon size={260} fill="white" />
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { id: 'tax-deed', title: 'Tax Deed Sales', logic: 'Bid - (Taxes + Fees)' },
                { id: 'tax-lien', title: 'Tax Lien Foreclosures', logic: 'Market Price - Liens' },
                { id: 'judicial', title: 'Judicial / Mortgage', logic: 'Winning Bid - Mortgage' }
              ].map(type => (
                <div key={type.id} className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 shadow-2xl hover:border-indigo-400 hover:-translate-y-2 transition-all ring-1 ring-slate-100 group">
                   <div className="flex items-center justify-between mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl shadow-inner border border-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <Building2Icon size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic: {type.id}</span>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic mb-4">{type.title}</h4>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ScaleIcon size={12}/> Overage Formula</p>
                   <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{type.logic}</p>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;
