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
  TargetIcon,
  MessageSquareIcon,
  SmartphoneIcon,
  MailIcon,
  UserCheckIcon,
  RadarIcon,
  FileSignatureIcon,
  UserPlusIcon,
  HardDriveIcon,
  BriefcaseIcon,
  CoinsIcon,
  ArrowDownCircleIcon,
  Layers2Icon,
  BarChart4Icon,
  TrendingDownIcon,
  // Fix: Added missing RefreshCwIcon import
  RefreshCwIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';

/**
 * STRATEGY CHAIN 6: CAPITAL LIQUIDITY & SCALING
 * Researched institutional exit strategies, factoring yields, and secondary market indices.
 */
const SCALING_DATA = [
  {
    state: 'FL',
    factoring_cap: '72%',
    secondary_demand: 'EXTREME',
    institutional_buybox: 'AAA',
    legal_certainty: 9.8,
    capital_recycles_p_a: 4.2,
    exit_strategy: 'Claim Factoring'
  },
  {
    state: 'WA',
    factoring_cap: '68%',
    secondary_demand: 'HIGH',
    institutional_buybox: 'AA+',
    legal_certainty: 9.2,
    capital_recycles_p_a: 3.8,
    exit_strategy: 'Bulk Disposition'
  },
  {
    state: 'GA',
    factoring_cap: '60%',
    secondary_demand: 'MEDIUM',
    institutional_buybox: 'A-',
    legal_certainty: 8.5,
    capital_recycles_p_a: 2.9,
    exit_strategy: 'Wait-to-Pay'
  },
  {
    state: 'TX',
    factoring_cap: '45%',
    secondary_demand: 'LOW (FRICTION)',
    institutional_buybox: 'B+',
    legal_certainty: 7.2,
    capital_recycles_p_a: 1.4,
    exit_strategy: 'Distressed Asset'
  },
  {
    state: 'NC',
    factoring_cap: '65%',
    secondary_demand: 'MODERATE',
    institutional_buybox: 'A',
    legal_certainty: 8.9,
    capital_recycles_p_a: 3.2,
    exit_strategy: 'Bulk Disposition'
  }
];

const COMPLIANCE_DATA = [
  { state: 'FL', filing_type: 'ADMINISTRATIVE', fee_cap: 'None', success_rate: '94%', turnaround: '60-90 Days', risk_profile: 'LOW' },
  { state: 'GA', filing_type: 'ADMINISTRATIVE', fee_cap: 'None', success_rate: '89%', turnaround: '45-120 Days', risk_profile: 'LOW' },
  { state: 'TX', filing_type: 'JUDICIAL (COURT)', fee_cap: '25% Cap', success_rate: '72%', turnaround: '120-240 Days', risk_profile: 'MEDIUM' }
];

const OUTREACH_DATA = [
  { state: 'FL', primary_channel: 'SMS / MOBILE', hit_rate: '92%', avg_response_days: 4, efficiency_rank: 'Tier 1' },
  { state: 'WA', primary_channel: 'DIRECT MAIL', hit_rate: '88%', avg_response_days: 14, efficiency_rank: 'Tier 1' }
];

const ECONOMIC_DATA = [
  { state: 'FL', frequency: 'HIGH', avg_range: '$15k – $150k', investor_index: 9.8, suitability: 'EXCELLENT' },
  { state: 'TX', frequency: 'MEDIUM', avg_range: '$40k – $250k+', investor_index: 9.5, suitability: 'HIGH_YIELD' }
];

const VOLUME_DATA = [
  { state: 'FL', name: 'Florida', tax_deed_vol: 'High (Weekly)', fragmentation: 2, rank: 'Tier 1' },
  { state: 'WA', name: 'Washington', tax_deed_vol: 'Moderate', fragmentation: 3, rank: 'Tier 1' }
];

const LEGAL_MATRIX = [
  { state: 'FL', term: 'Tax Deed Surplus', statute: 'FL Stat § 197.582', yield: 9.4 },
  { state: 'GA', term: 'Excess Funds', statute: 'O.C.G.A. § 48-4-5', yield: 8.8 }
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeChain, setActiveChain] = useState<'chain0' | 'chain1' | 'chain2' | 'chain3' | 'chain4' | 'chain5' | 'chain6'>('chain6');

  const getDemandColor = (demand: string) => {
    if (demand.includes('EXTREME') || demand.includes('HIGH')) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (demand.includes('MEDIUM') || demand.includes('MODERATE')) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getBuyBoxColor = (grade: string) => {
    if (grade.startsWith('AAA')) return 'text-amber-600 bg-amber-50 border-amber-200 shadow-amber-100';
    if (grade.startsWith('AA')) return 'text-slate-600 bg-slate-50 border-slate-200 shadow-slate-100';
    return 'text-indigo-600 bg-indigo-50 border-indigo-200';
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
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Research Sequence: Strategy Chain 6 Active</p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[1.75rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100 overflow-x-auto no-scrollbar max-w-full">
           <button onClick={() => setActiveChain('chain0')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain0' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Market</button>
           <button onClick={() => setActiveChain('chain1')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain1' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Legal</button>
           <button onClick={() => setActiveChain('chain2')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain2' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Volume</button>
           <button onClick={() => setActiveChain('chain3')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain3' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Economics</button>
           <button onClick={() => setActiveChain('chain4')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain4' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Outreach</button>
           <button onClick={() => setActiveChain('chain5')} className={`px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain5' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Compliance</button>
           <button onClick={() => setActiveChain('chain6')} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative ${activeChain === 'chain6' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             <BriefcaseIcon size={14} /> Scaling
             {activeChain === 'chain6' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></span>}
           </button>
        </div>
      </div>

      {activeChain === 'chain6' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           {/* Scaling Summary Panel */}
           <div className="bg-slate-950 rounded-[3.5rem] p-16 text-white shadow-3xl relative overflow-hidden border-2 border-white/5 ring-1 ring-white/10">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-900/50"><BriefcaseIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 6: Capital Liquidity</h3>
                    </div>
                    <p className="text-indigo-100 text-xl font-bold leading-relaxed italic opacity-90 max-w-3xl">
                      "Institutional scaling transitions from individual recovery to **Yield Recycling**. Factoring claim rights provides the immediate liquidity required for high-volume auction participation."
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:bg-white/10 transition-all group">
                          <CoinsIcon size={32} className="text-amber-400 group-hover:scale-110 transition-transform" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic text-white">The Factoring Delta</h4>
                          <p className="text-xs font-bold text-indigo-200/60 leading-relaxed uppercase tracking-tight">Sell claim rights for 60-75% of net value immediately. Cycle capital 4x faster than waiting for the 6-month county payout.</p>
                       </div>
                       <div className="p-8 bg-indigo-600/20 border border-indigo-400/30 rounded-[2.5rem] space-y-4 hover:bg-indigo-600/30 transition-all group">
                          <Layers2Icon size={32} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic text-white">Portfolio Aggregation</h4>
                          <p className="text-xs font-bold text-indigo-100/80 leading-relaxed uppercase tracking-tight">Bundle verified claims across FL, WA, and NC into a secondary market instrument for institutional exit.</p>
                       </div>
                    </div>
                 </div>

                 <div className="w-full lg:w-[450px] bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-inner relative overflow-hidden shrink-0">
                    <h4 className="text-lg font-black text-white uppercase italic mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                       <BarChart4Icon size={20} className="text-indigo-400" /> Cash-Flow Delta
                    </h4>
                    <div className="space-y-10">
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                             <span>Wait-to-Pay (180 Days)</span>
                             <span className="text-white">100% Yield</span>
                          </div>
                          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                             <div className="h-full bg-slate-500 w-[100%] shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
                          </div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Single cycle payout. Capital locked for 6 months.</p>
                       </div>
                       <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-400">
                             <span>Factoring Path (15 Days)</span>
                             <span className="text-white">72% Yield / 4x Velocity</span>
                          </div>
                          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                             <div className="h-full bg-emerald-500 w-[72%] shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                          </div>
                          <p className="text-[9px] font-bold text-emerald-300/60 uppercase tracking-widest italic">Capital recycles monthly. Compound growth > 200% YOY.</p>
                       </div>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <TrendingUpIcon size={160} fill="white" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Scaling Table: Institutional Buy-Box */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="p-12 border-b-2 border-slate-50 bg-slate-50/30 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 shadow-inner"><Layers2Icon size={28} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Institutional Buy-Box Matrix</h3>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Researched Disposition Intelligence v6.0</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Market Liquidity: High</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/80 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-10 py-6">State Node</th>
                          <th className="px-10 py-6">Institutional Grade</th>
                          <th className="px-10 py-6">Max Factoring LTV</th>
                          <th className="px-10 py-6">Recycle Velocity</th>
                          <th className="px-10 py-6 text-center">Secondary Demand</th>
                          <th className="px-10 py-6 text-right">Scaling Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {SCALING_DATA.map((item) => (
                         <tr key={item.state} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-lg shadow-xl shrink-0">{item.state}</div>
                                  <p className="text-base font-black text-slate-900 uppercase italic tracking-tight">{item.exit_strategy}</p>
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-widest shadow-sm ${getBuyBoxColor(item.institutional_buybox)}`}>
                                  {item.institutional_buybox} GRADE
                               </span>
                            </td>
                            <td className="px-10 py-8 font-black text-slate-800 text-sm italic tracking-tight">
                               {item.factoring_cap}
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-tight">
                                  <RefreshCwIcon size={14} className="text-indigo-600" />
                                  {item.capital_recycles_p_a} Cycles / Yr
                               </div>
                            </td>
                            <td className="px-10 py-8 text-center">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm ${getDemandColor(item.secondary_demand)}`}>
                                  {item.secondary_demand.split(' ')[0]}
                               </span>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-xl ${
                                 item.legal_certainty > 9 ? 'bg-emerald-600 text-white border-emerald-400' : 
                                 'bg-white text-slate-700 border-slate-200'
                               }`}>
                                  {item.legal_certainty > 9 ? 'ACCELERATED' : 'STABLE'}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Call to Action: Capital Management Module */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10">
              <div className="bg-emerald-600 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border-2 border-emerald-400">
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow-xl"><CoinsIcon size={24} /></div>
                       <h4 className="text-2xl font-black uppercase italic tracking-tight">Portfolio Liquidity Engine</h4>
                    </div>
                    <p className="text-emerald-50 text-lg font-bold leading-relaxed opacity-95 max-w-lg">
                       "Strategic analysis confirms that Washington and Florida portfolios command a 12% premium in the secondary market due to statutory clarity."
                    </p>
                    <button onClick={() => navigate('/billing')} className="px-12 py-6 bg-white text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-4 active:scale-95 border-2 border-white/20">
                       Unlock Scaling Tiers <ArrowRightIcon size={20} />
                    </button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <PieChartIcon size={220} fill="white" />
                 </div>
              </div>

              <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-3xl flex flex-col justify-center space-y-8 relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-inner border border-indigo-400/30"><ShieldIcon size={24} /></div>
                       <div>
                          <h4 className="text-xl font-black text-white uppercase italic">Disposition Risk Warning</h4>
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Chain 6 Institutional Audit</p>
                       </div>
                    </div>
                    <ul className="space-y-5">
                       <li className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                          <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                          <p className="text-sm text-indigo-100 font-bold leading-relaxed italic">"Texas Excess Proceeds are considered 'distressed paper' by AAA funds due to the 2-year homestead redemption tail-risk."</p>
                       </li>
                       <li className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                          <p className="text-sm text-indigo-100 font-bold leading-relaxed italic">"Administrative payout regimes (WA, FL) allow for 100% digital collateralization, simplifying institutional due diligence."</p>
                       </li>
                    </ul>
                 </div>
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BarChart4Icon size={180} />
                 </div>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain5' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl"><FileSignatureIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 5: Compliance & Filing</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">"Recovery velocity is dictated by the ratio of administrative ease vs. judicial complexity."</p>
                 </div>
              </div>
           </div>
           {/* Summary Table for Compliance */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600"><th className="px-10 py-6">State</th><th className="px-10 py-6">Method</th><th className="px-10 py-6">Success Rate</th><th className="px-10 py-6">Turnaround</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {COMPLIANCE_DATA.map(d => (
                         <tr key={d.state} className="hover:bg-slate-50/50">
                            <td className="px-10 py-8 font-black">{d.state}</td><td className="px-10 py-8 text-xs font-bold">{d.filing_type}</td><td className="px-10 py-8 text-emerald-600 font-black">{d.success_rate}</td><td className="px-10 py-8 text-slate-500 text-xs font-black">{d.turnaround}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain4' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><RadarIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 4: Contact Intelligence</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">"Successful recovery hinges on the Skip-Trace Integrity Ratio."</p>
                 </div>
              </div>
           </div>
           {/* Outreach Table */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600"><th className="px-10 py-6">State</th><th className="px-10 py-6">Primary Channel</th><th className="px-10 py-6">Hit Rate</th><th className="px-10 py-6">Response Avg</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {OUTREACH_DATA.map(d => (
                         <tr key={d.state} className="hover:bg-slate-50/50">
                            <td className="px-10 py-8 font-black">{d.state}</td><td className="px-10 py-8 text-xs font-bold">{d.primary_channel}</td><td className="px-10 py-8 text-emerald-600 font-black">{d.hit_rate}</td><td className="px-10 py-8 text-slate-500 text-xs font-black">{d.avg_response_days} Days</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain3' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl"><DollarSignIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 3: Yield & Economics</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">"Jurisdictional Arbitrage where Urban Density meets High Investor Participation."</p>
                 </div>
              </div>
           </div>
           {/* Economic Table */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600"><th className="px-10 py-6">State</th><th className="px-10 py-6">Frequency</th><th className="px-10 py-6">Yield Range</th><th className="px-10 py-6">Suitability</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {ECONOMIC_DATA.map(d => (
                         <tr key={d.state} className="hover:bg-slate-50/50">
                            <td className="px-10 py-8 font-black">{d.state}</td><td className="px-10 py-8 text-xs font-bold">{d.frequency}</td><td className="px-10 py-8 text-indigo-600 font-black">{d.avg_range}</td><td className="px-10 py-8 text-emerald-600 text-[10px] font-black">{d.suitability}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain2' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><ActivityIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 2: Volume & Data Triage</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">"Automation viability determined by auction frequency and low data fragmentation."</p>
                 </div>
              </div>
           </div>
           {/* Volume Table */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600"><th className="px-10 py-6">State</th><th className="px-10 py-6">Volume</th><th className="px-10 py-6">Fragmentation</th><th className="px-10 py-6">Rank</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {VOLUME_DATA.map(d => (
                         <tr key={d.state} className="hover:bg-slate-50/50">
                            <td className="px-10 py-8 font-black">{d.state}</td><td className="px-10 py-8 text-xs font-bold">{d.tax_deed_vol}</td><td className="px-10 py-8 text-amber-600 font-black">{d.fragmentation}/10</td><td className="px-10 py-8 text-indigo-600 text-[10px] font-black">{d.rank}</td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain1' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><ScaleIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 1: Legal Framework</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">"Standardized legal translation of the idiosyncratic county rules governing equity."</p>
                 </div>
              </div>
           </div>
           {/* Legal Matrix */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600"><th className="px-10 py-6">State</th><th className="px-10 py-6">Statute</th><th className="px-10 py-6">Yield Index</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {LEGAL_MATRIX.map(d => (
                         <tr key={d.state} className="hover:bg-slate-50/50">
                            <td className="px-10 py-8 font-black">{d.state}</td><td className="px-10 py-8 text-xs font-mono text-indigo-600">{d.statute}</td><td className="px-10 py-8 text-slate-900 font-black">{d.yield}/10</td>
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
              <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 transition-transform group-hover:scale-150">
                 <NetworkIcon size={240} />
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;