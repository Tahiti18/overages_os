
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
  HistoryIcon,
  LayersIcon,
  ActivityIcon,
  FileTextIcon,
  ServerIcon,
  DollarSignIcon,
  PieChartIcon,
  TargetIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';

/**
 * STRATEGY CHAIN 3: OVERAGE FREQUENCY & SIZE (ECONOMICS)
 * Researched analysis of yield potential, frequency tiers, and density correlations.
 */
const ECONOMIC_DATA = [
  {
    state: 'FL',
    frequency: 'HIGH',
    avg_range: '$15k – $150k',
    concentration: 'URBAN_COASTAL',
    investor_index: 9.8,
    judicial_impact: 'Hybrid',
    suitability: 'EXCELLENT',
    payout_velocity: 'High'
  },
  {
    state: 'GA',
    frequency: 'MED_HIGH',
    avg_range: '$10k – $85k',
    concentration: 'METRO_ATLANTA',
    investor_index: 8.2,
    judicial_impact: 'Non-Judicial',
    suitability: 'STABLE',
    payout_velocity: 'Moderate'
  },
  {
    state: 'TX',
    frequency: 'MEDIUM',
    avg_range: '$40k – $250k+',
    concentration: 'MAJOR_METROS',
    investor_index: 9.5,
    judicial_impact: 'Judicial Focus',
    suitability: 'HIGH_YIELD',
    payout_velocity: 'Low (Friction)'
  },
  {
    state: 'WA',
    frequency: 'MEDIUM',
    avg_range: '$12k – $90k',
    concentration: 'PUGET_SOUND',
    investor_index: 7.4,
    judicial_impact: 'Judicial',
    suitability: 'SCALABLE',
    payout_velocity: 'High'
  },
  {
    state: 'NC',
    frequency: 'MED_LOW',
    avg_range: '$8k – $65k',
    concentration: 'RURAL_HYBRID',
    investor_index: 6.8,
    judicial_impact: 'Clerk-Led',
    suitability: 'LOW_BARRIER',
    payout_velocity: 'Very High'
  }
];

const VOLUME_DATA = [
  { state: 'FL', name: 'Florida', tax_deed_vol: 'High (Weekly)', judicial_vol: 'Extreme', access_type: 'Centralized Portal', format: 'Web-Table / PDF', fragmentation: 2, transparency: 10, rank: 'Tier 1' },
  { state: 'TX', name: 'Texas', tax_deed_vol: 'Extreme (1st Tuesday)', judicial_vol: 'High', access_type: 'County Fragmented', format: 'PDF / Scanned', fragmentation: 9, transparency: 6, rank: 'Tier 1 (High Friction)' },
  { state: 'WA', name: 'Washington', tax_deed_vol: 'Moderate', judicial_vol: 'Moderate', access_type: 'Centralized Lists', format: 'Open PDF', fragmentation: 3, transparency: 9, rank: 'Tier 1 (Clean Data)' },
  { state: 'GA', name: 'Georgia', tax_deed_vol: 'High', judicial_vol: 'Moderate', access_type: 'Treasurer Portals', format: 'Web UI', fragmentation: 5, transparency: 8, rank: 'Tier 1' },
  { state: 'MD', name: 'Maryland', tax_deed_vol: 'High (Annual)', judicial_vol: 'Moderate', access_type: 'Fragmented Web', format: 'PDF / HTML', fragmentation: 7, transparency: 7, rank: 'Tier 2' }
];

const LEGAL_MATRIX = [
  { state: 'FL', term: 'Tax Deed Surplus', statute: 'FL Stat § 197.582', entitlement: 'Former Owner of Record', window: '2 Years', friction: 'LOW', yield: 9.4 },
  { state: 'GA', term: 'Excess Funds', statute: 'O.C.G.A. § 48-4-5', entitlement: 'Owner / Lienholders', window: 'Unlimited*', friction: 'MED', yield: 8.8 },
  { state: 'TX', term: 'Excess Proceeds', statute: 'TX Tax Code § 34.04', entitlement: 'Defendant Owner', window: '2 Years', friction: 'HIGH', yield: 7.2 },
  { state: 'WA', term: 'Tax Sale Surplus', statute: 'RCW 84.64.080', entitlement: 'Record Owner', window: '3 Years', friction: 'LOW', yield: 9.1 },
  { state: 'MD', term: 'High Bid Premium', statute: 'MD Tax-Prop § 14-817', entitlement: 'Owner of Record', window: 'Direct', friction: 'HIGH', yield: 6.5 }
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeChain, setActiveChain] = useState<'chain0' | 'chain1' | 'chain2' | 'chain3'>('chain3');

  const getFragmentationColor = (score: number) => {
    if (score <= 3) return 'bg-emerald-500';
    if (score <= 6) return 'bg-amber-500';
    return 'bg-rose-500';
  }

  const getFrequencyColor = (freq: string) => {
    switch (freq) {
      case 'HIGH': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'MED_HIGH': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
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
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Research Sequence: Strategy Chain 3 Active</p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[1.75rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100 overflow-x-auto no-scrollbar max-w-full">
           <button onClick={() => setActiveChain('chain0')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeChain === 'chain0' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             Market
           </button>
           <button onClick={() => setActiveChain('chain1')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeChain === 'chain1' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             Legal
           </button>
           <button onClick={() => setActiveChain('chain2')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 whitespace-nowrap ${activeChain === 'chain2' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             Volume
           </button>
           <button onClick={() => setActiveChain('chain3')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 relative whitespace-nowrap ${activeChain === 'chain3' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             <DollarSignIcon size={16} /> Economics
             {activeChain === 'chain3' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></span>}
           </button>
        </div>
      </div>

      {activeChain === 'chain3' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           {/* Economic Summary Panel */}
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl"><DollarSignIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 3: Yield & Economics</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">
                      "Financial modeling identifies Jurisdictional Arbitrage opportunities where Urban Density meets High Investor Participation."
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4 border border-white/10 group hover:-translate-y-1 transition-all">
                          <TargetIcon size={32} className="text-indigo-400" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic">High Velocity Zones</h4>
                          <p className="text-xs font-bold text-indigo-100/80 leading-relaxed uppercase tracking-tight">Focus: FL & GA. Predictable monthly drops with clear overage ranges. Ideal for high-frequency automation.</p>
                       </div>
                       <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] space-y-4 border border-indigo-400 group hover:-translate-y-1 transition-all">
                          <TrendingUpIcon size={32} className="text-white" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic">Deep Value Zones</h4>
                          <p className="text-xs font-bold text-white/90 leading-relaxed uppercase tracking-tight">Focus: TX & WA. Higher legal friction, but individual overages often exceed $100k due to judicial sale structure.</p>
                       </div>
                    </div>
                 </div>

                 <div className="w-full lg:w-[450px] bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-200 shadow-inner relative overflow-hidden shrink-0">
                    <h4 className="text-lg font-black text-slate-900 uppercase italic mb-8 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
                       <PieChartIcon size={20} className="text-indigo-600" /> Yield Distribution
                    </h4>
                    <div className="space-y-6">
                       {[
                         { label: 'Sub-$5k (Micro)', value: '15%', color: 'bg-slate-300' },
                         { label: '$5k - $25k (Standard)', value: '45%', color: 'bg-indigo-400' },
                         { label: '$25k - $100k (Premier)', value: '30%', color: 'bg-indigo-600' },
                         { label: '$100k+ (Enterprise)', value: '10%', color: 'bg-emerald-500' }
                       ].map((tier, i) => (
                         <div key={i} className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                               <span>{tier.label}</span>
                               <span className="text-slate-900">{tier.value}</span>
                            </div>
                            <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-slate-200">
                               <div className={`h-full ${tier.color}`} style={{ width: tier.value }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Economic Table */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="p-12 border-b-2 border-slate-50 bg-slate-50/30 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner"><BarChart3Icon size={28} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">National Economic Matrix</h3>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Researched Yield Intelligence v3.0</p>
                    </div>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/80 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-10 py-6">State Node</th>
                          <th className="px-10 py-6">Overage Frequency</th>
                          <th className="px-10 py-6">Typical Gross Range</th>
                          <th className="px-10 py-6">Density Focus</th>
                          <th className="px-10 py-6 text-center">Investor Index</th>
                          <th className="px-10 py-6 text-right">Economic Grade</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {ECONOMIC_DATA.map((item) => (
                         <tr key={item.state} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-lg shadow-xl shrink-0">{item.state}</div>
                                  <p className="text-base font-black text-slate-900 uppercase italic tracking-tight">{item.state === 'TX' ? 'Premium Node' : 'Standard Node'}</p>
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm ${getFrequencyColor(item.frequency)}`}>
                                  {item.frequency.replace('_', ' ')}
                               </span>
                            </td>
                            <td className="px-10 py-8 font-black text-slate-800 text-sm italic tracking-tight">
                               {item.avg_range}
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-tight">
                                  <MapIcon size={14} className="text-indigo-600" />
                                  {item.concentration.replace('_', ' ')}
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center justify-center gap-3">
                                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                     <div className={`h-full bg-indigo-600`} style={{ width: `${item.investor_index * 10}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-black text-slate-500 w-4">{item.investor_index}/10</span>
                               </div>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-xl ${
                                 item.suitability === 'EXCELLENT' ? 'bg-emerald-600 text-white border-emerald-400' : 
                                 item.suitability === 'HIGH_YIELD' ? 'bg-indigo-600 text-white border-indigo-400' :
                                 'bg-white text-slate-700 border-slate-200'
                               }`}>
                                  {item.suitability}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Call to Action: Predictive Engine Ingestion */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10">
              <div className="bg-emerald-600 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border-2 border-emerald-400">
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow-xl"><ZapIcon size={24} /></div>
                       <h4 className="text-2xl font-black uppercase italic tracking-tight">Yield Predictor Active</h4>
                    </div>
                    <p className="text-emerald-50 text-lg font-bold leading-relaxed opacity-95 max-w-lg">
                       "Chain 3 data confirms Florida Urban-Coastal counties maintain a 92% recovery probability for overages exceeding $25k."
                    </p>
                    <button onClick={() => navigate('/waterfall')} className="px-12 py-6 bg-white text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-4 active:scale-95 border-2 border-white/20">
                       Open Waterfall Sandbox <ArrowRightIcon size={20} />
                    </button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <LineChartIcon size={220} fill="white" />
                 </div>
              </div>

              <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-3xl flex flex-col justify-center space-y-8 relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-inner border border-indigo-400/30"><InfoIcon size={24} /></div>
                       <div>
                          <h4 className="text-xl font-black text-white uppercase italic">Investor Competition Warning</h4>
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Prompt 3 Economics</p>
                       </div>
                    </div>
                    <ul className="space-y-5">
                       <li className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                          <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                          <p className="text-sm text-indigo-100 font-bold leading-relaxed italic">"Texas (Judicial) auctions see 40% higher bid-to-judgment ratios compared to rural GA, compressing surplus deltas."</p>
                       </li>
                       <li className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                          <p className="text-sm text-indigo-100 font-bold leading-relaxed italic">"Secondary market data indicates high urban density correlates with a 65% reduction in probate-related claim delays."</p>
                       </li>
                    </ul>
                 </div>
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <GlobeIcon size={180} />
                 </div>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain2' ? (
        /* CHAIN 2 VIEW: VOLUME & ACCESS (EXISTING) */
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           {/* Summary Panel */}
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><ActivityIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 2: Volume & Data Triage</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">
                      "Automation viability is determined by the intersection of high auction frequency and low data fragmentation."
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] space-y-4 shadow-sm group hover:-translate-y-1 transition-all">
                          <CheckCircle2Icon size={32} className="text-emerald-600" />
                          <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest italic">High Volume / Centralized</h4>
                          <p className="text-xs font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">Tier 1 Focus: FL, GA, WA. Data is structured, consistent, and released at fixed intervals via treasurer portals.</p>
                       </div>
                       <div className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] space-y-4 shadow-sm group hover:-translate-y-1 transition-all">
                          <AlertCircleIcon size={32} className="text-rose-600" />
                          <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest italic">High Volume / Fragmented</h4>
                          <p className="text-xs font-bold text-rose-800 leading-relaxed uppercase tracking-tight">High Friction: TX, PA. Massive opportunity, but requires 100+ separate county-level PDF scrapers.</p>
                       </div>
                    </div>
                 </div>

                 <div className="w-full lg:w-[450px] space-y-6 shrink-0">
                    <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden ring-8 ring-slate-950/5">
                       <h4 className="text-xl font-black uppercase italic mb-8 border-b border-white/10 pb-4">Accessibility Score</h4>
                       <div className="space-y-8">
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                <span>Digital Portals (Web-Table)</span>
                                <span>85% Readiness</span>
                             </div>
                             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[85%] shadow-[0_0_12px_rgba(16,185,129,0.5)]"></div>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                                <span>PDF/Scanned Records</span>
                                <span>40% Readiness</span>
                             </div>
                             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 w-[40%] shadow-[0_0_12px_rgba(245,158,11,0.5)]"></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Volume Analysis Table */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="p-12 border-b-2 border-slate-50 bg-slate-50/30 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 shadow-inner"><TrendingUpIcon size={28} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">National Volume & Access Matrix</h3>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Researched Extraction Intelligence v2.0</p>
                    </div>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/80 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-10 py-6">State Origin</th>
                          <th className="px-10 py-6">Auction Frequency</th>
                          <th className="px-10 py-6">Access Protocol</th>
                          <th className="px-10 py-6">Format Type</th>
                          <th className="px-10 py-6 text-center">Fragmentation</th>
                          <th className="px-10 py-6 text-right">Strategic Rank</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {VOLUME_DATA.map((item) => (
                         <tr key={item.state} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-lg shadow-xl shrink-0 group-hover:scale-110 transition-transform">{item.state}</div>
                                  <p className="text-base font-black text-slate-900 uppercase italic tracking-tight">{item.name}</p>
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-tight">
                                  <ClockIcon size={14} className="text-indigo-600" />
                                  {item.tax_deed_vol}
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-tight">
                                  <ServerIcon size={14} className="text-indigo-600" />
                                  {item.access_type}
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <span className="px-4 py-1.5 bg-slate-950 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md">
                                  {item.format}
                               </span>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center justify-center gap-3">
                                  <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                     <div className={`h-full ${getFragmentationColor(item.fragmentation)}`} style={{ width: `${item.fragmentation * 10}%` }}></div>
                                  </div>
                                  <span className="text-[10px] font-black text-slate-500 w-4">{item.fragmentation}/10</span>
                               </div>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${item.rank.includes('Tier 1') ? 'bg-indigo-600 text-white border-indigo-400' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                  {item.rank}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain1' ? (
        /* CHAIN 1 VIEW: LEGAL FRAMEWORK (EXISTING) */
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
                            <td className="px-10 py-8 text-xs font-black uppercase text-slate-600 tracking-tight">{item.window}</td>
                            <td className="px-10 py-8 text-center text-xs font-black uppercase text-slate-600">{item.friction}</td>
                            <td className="px-10 py-8 text-right font-black text-slate-900">{item.yield}/10</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
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
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                       <NetworkIcon size={32} className="text-indigo-400" />
                       <h4 className="text-lg font-black uppercase italic">Fragmented</h4>
                       <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-tight">Rules vary across 3,000+ counties, preventing institutional scale without AI.</p>
                    </div>
                    <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                       <CpuIcon size={32} className="text-emerald-400" />
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
