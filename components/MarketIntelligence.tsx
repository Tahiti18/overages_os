
import React, { useState, useMemo } from 'react';
import { 
  BarChart3Icon, 
  MapIcon, 
  ZapIcon, 
  SearchIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  ArrowUpRightIcon, 
  CalendarIcon, 
  ClockIcon,
  FilterIcon,
  AlertCircleIcon,
  Building2Icon,
  RefreshCwIcon,
  SparklesIcon,
  ScaleIcon,
  GavelIcon,
  ShieldAlertIcon,
  GlobeIcon,
  DatabaseIcon,
  LockIcon,
  FileTextIcon,
  LayoutGridIcon,
  InfoIcon,
  DownloadIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  LayersIcon,
  ShieldIcon,
  FileSearchIcon,
  CpuIcon,
  NetworkIcon,
  LineChartIcon,
  HistoryIcon,
  ExternalLinkIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';

const NATIONAL_RANKINGS = [
  { state: 'FL', name: 'Florida', spi: 98, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_PDF', description: 'Highest volume of weekly surplus list drops.' },
  { state: 'WA', name: 'Washington', spi: 95, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_LIST', description: 'Exceptional transparency and long claim windows.' },
  { state: 'GA', name: 'Georgia', spi: 94, level: 'TIDAL_FLATS', friction: 'MED', access: 'HYBRID_WEB', description: 'High yields but requires portal navigation.' },
  { state: 'NC', name: 'North Carolina', spi: 92, level: 'OPEN_PLAINS', friction: 'LOW', access: 'CLERK_LIST', description: 'Clerk of Court publishes clear overage ledgers.' },
  { state: 'AZ', name: 'Arizona', spi: 90, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_PDF', description: 'Reliable monthly drops from county treasurers.' },
  { state: 'MD', name: 'Maryland', spi: 89, level: 'FORTIFIED_MOAT', friction: 'HIGH', access: 'MOAT_GATED', description: 'Hidden data requires formal ORR filings.' },
  { state: 'SC', name: 'South Carolina', spi: 87, level: 'TIDAL_FLATS', friction: 'MED', access: 'HYBRID_WEB', description: 'Strong post-auction discovery potential.' },
  { state: 'TX', name: 'Texas', spi: 85, level: 'TIDAL_FLATS', friction: 'MED', access: 'HYBRID_WEB', description: 'Massive volume but decentralized portal search.' },
  { state: 'TN', name: 'Tennessee', spi: 84, level: 'TIDAL_FLATS', friction: 'MED', access: 'CHANCERY', description: 'Chancery Court lists are valuable but fragmented.' },
  { state: 'OH', name: 'Ohio', spi: 82, level: 'FORTIFIED_MOAT', friction: 'HIGH', access: 'MOAT_GATED', description: 'Forfeiture lists are often guarded by local statutes.' }
];

const FORECLOSURE_TYPES = [
  {
    id: 'tax-deed',
    title: 'Tax Deed Sales',
    mechanic: 'Auction of property title for delinquent taxes.',
    overage_logic: 'Bid Amount - (Taxes + Interest + Admin Fees)',
    persistence: 'Counties often hold funds in "Clerk Trust" for 1-5 years.',
    ai_vector: 'Automated scraping of Treasurer PDF bid-logs.'
  },
  {
    id: 'tax-lien',
    title: 'Tax Lien Foreclosures',
    mechanic: 'Investor forecloses on a tax certificate.',
    overage_logic: 'Market Price (Auction) - Certificate Value + Liens',
    persistence: 'Varies wildly by state (e.g., AZ vs NJ).',
    ai_vector: 'Cross-referencing Certificate IDs with GIS valuation.'
  },
  {
    id: 'judicial',
    title: 'Judicial / Mortgage',
    mechanic: 'Court-ordered sale due to loan default.',
    overage_logic: 'Winning Bid - (Mortgage Balance + Legal Costs)',
    persistence: 'Funds deposited in Court Registry; heirs rarely notified.',
    ai_vector: 'Dockets monitoring for "Final Judgment" deltas.'
  }
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'triage' | 'architecture'>('triage');

  const getBarrierColor = (level: string) => {
    switch (level) {
      case 'OPEN_PLAINS': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'TIDAL_FLATS': return 'text-indigo-500 bg-indigo-50 border-indigo-100';
      case 'FORTIFIED_MOAT': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header & Global Tab Control */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <MapIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                National Triage
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Strategy Chain 0: Market Definition & Intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[1.75rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100">
           <button 
            onClick={() => setActiveTab('triage')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'triage' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             <LayoutGridIcon size={16} /> Market Ranking
           </button>
           <button 
            onClick={() => setActiveTab('architecture')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'architecture' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             <CpuIcon size={16} /> System Architecture
           </button>
        </div>
      </div>

      {activeTab === 'triage' ? (
        <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
          <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner border border-indigo-200"><TrendingUpIcon size={20} /></div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Profitability Index (SPI)</h3>
            </div>
            <button onClick={() => navigate('/scanner')} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.15em] hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl active:scale-95">
               Launch Discovery Fleet <ArrowRightIcon size={16} />
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {NATIONAL_RANKINGS.map((item) => (
              <div key={item.state} className="p-10 hover:bg-slate-50/50 transition-all group flex flex-col xl:flex-row xl:items-center gap-12">
                <div className="flex items-center gap-8 shrink-0 min-w-[280px]">
                   <div className={`w-16 h-16 rounded-[1.25rem] text-white flex items-center justify-center font-black text-2xl shadow-xl relative ${item.level === 'FORTIFIED_MOAT' ? 'bg-slate-900' : 'bg-indigo-900'}`}>
                     {item.state}
                   </div>
                   <div>
                     <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">{item.name}</h4>
                     <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getBarrierColor(item.level)}`}>
                       {item.level.replace('_', ' ')}
                     </span>
                   </div>
                </div>
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Index Score</p>
                      <p className="text-lg font-black text-indigo-600">{item.spi}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">List Access</p>
                      <p className="text-sm font-black text-slate-800 uppercase">{item.access.replace('_', ' ')}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Statutory Friction</p>
                      <p className="text-sm font-black text-slate-800 uppercase">{item.friction}</p>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-500 font-bold leading-relaxed italic">"{item.description}"</p>
                      <button className="p-3 rounded-xl hover:bg-white hover:shadow-xl transition-all text-slate-300 hover:text-indigo-600 border border-transparent hover:border-indigo-100">
                        <ChevronRightIcon size={20} />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ARCHITECTURE VIEW (CHAIN 0 CONTENT) */
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           {/* Section: Market Definition */}
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

           {/* Section: Typology Matrix */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FORECLOSURE_TYPES.map(type => (
                <div key={type.id} className="bg-white border-2 border-slate-100 rounded-[3rem] p-10 shadow-2xl hover:border-indigo-400 hover:-translate-y-2 transition-all ring-1 ring-slate-100 group">
                   <div className="flex items-center justify-between mb-8">
                      <div className="p-4 bg-slate-50 rounded-2xl shadow-inner border border-slate-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                         <Building2Icon size={24} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic: {type.id.replace('-', ' ')}</span>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic mb-4">{type.title}</h4>
                   <p className="text-sm font-bold text-slate-600 leading-relaxed mb-8 opacity-80 italic">"{type.mechanic}"</p>
                   
                   <div className="space-y-6 pt-6 border-t-2 border-slate-50">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><ScaleIcon size={12}/> Overage Formula</p>
                         <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{type.overage_logic}</p>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2"><CpuIcon size={12}/> AI Vector</p>
                         <p className="text-xs font-black text-indigo-600 uppercase tracking-tight">{type.ai_vector}</p>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           {/* Section: Strategic Inefficiency Audit */}
           <div className="bg-white border-2 border-slate-100 rounded-[4rem] p-16 shadow-3xl ring-1 ring-slate-100/50">
              <div className="flex flex-col xl:flex-row items-center justify-between gap-16">
                 <div className="flex-1 space-y-10">
                    <div className="space-y-4">
                       <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shadow-inner border border-amber-200"><LineChartIcon size={28} /></div>
                          <h3 className="text-3xl font-black uppercase tracking-tighter italic">Inefficiency Audit</h3>
                       </div>
                       <p className="text-slate-700 font-bold text-xl leading-relaxed italic opacity-80">
                         "The market persists in a state of entropy because the cost of discovery for human agents is higher than the reward for small-to-mid sized overages."
                       </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] space-y-3">
                          <h5 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest">Structural Barrier: Escheatment</h5>
                          <p className="text-sm font-bold text-slate-600 leading-relaxed italic">Funds not claimed within statutory windows revert to the State or County General Fund. Officials have minimal incentive to notify heirs.</p>
                       </div>
                       <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] space-y-3">
                          <h5 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">AI Solution: Bulk OCR</h5>
                          <p className="text-sm font-bold text-slate-600 leading-relaxed italic">By scanning 1,000+ PDFs per hour, the platform identifies surpluses that are economically invisible to traditional manual researchers.</p>
                       </div>
                    </div>
                 </div>
                 
                 <div className="w-full xl:w-[450px] bg-slate-950 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden ring-8 ring-slate-950/5">
                    <h4 className="text-xl font-black uppercase italic mb-8 border-b border-white/10 pb-4">Strategy Implications</h4>
                    <div className="space-y-8">
                       <div className="flex items-start gap-5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg text-[10px] font-black italic">01</div>
                          <p className="text-xs font-bold text-indigo-100 leading-relaxed uppercase tracking-tight">Onboard states with centralized Clerk ledgers (FL, WA) for immediate automation.</p>
                       </div>
                       <div className="flex items-start gap-5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg text-[10px] font-black italic">02</div>
                          <p className="text-xs font-bold text-indigo-100 leading-relaxed uppercase tracking-tight">Deploy LLM agents to monitor judicial dockets for "Order of Distribution" events.</p>
                       </div>
                       <div className="flex items-start gap-5">
                          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg text-[10px] font-black italic">03</div>
                          <p className="text-xs font-bold text-indigo-100 leading-relaxed uppercase tracking-tight">Exclude "Limited Discovery" states (IL, PA) until ORR automation is stable.</p>
                       </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 opacity-5 rotate-45">
                       <CpuIcon size={200} fill="white" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;
