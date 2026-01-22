
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
  /* Replaced non-existent BalanceIcon with ScaleIcon */
  HardDriveIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';

/**
 * STRATEGY CHAIN 5: FILING PROTOCOLS & COMPLIANCE
 * Researched analysis of filing hurdles, fee restrictions, and document rigor.
 */
const COMPLIANCE_DATA = [
  {
    state: 'FL',
    filing_type: 'ADMINISTRATIVE',
    fee_cap: 'None (Unregulated)',
    notary_rigor: 'HIGH',
    judicial_oversight: 'Low',
    success_rate: '94%',
    turnaround: '60-90 Days',
    risk_profile: 'LOW'
  },
  {
    state: 'GA',
    filing_type: 'ADMINISTRATIVE',
    fee_cap: 'None (Unregulated)',
    notary_rigor: 'MEDIUM',
    judicial_oversight: 'Moderate',
    success_rate: '89%',
    turnaround: '45-120 Days',
    risk_profile: 'LOW'
  },
  {
    state: 'TX',
    filing_type: 'JUDICIAL (COURT)',
    fee_cap: 'Strict 25% Cap',
    notary_rigor: 'EXTREME',
    judicial_oversight: 'High',
    success_rate: '72%',
    turnaround: '120-240 Days',
    risk_profile: 'MEDIUM'
  },
  {
    state: 'WA',
    filing_type: 'ADMINISTRATIVE',
    fee_cap: 'None',
    notary_rigor: 'LOW',
    judicial_oversight: 'Very Low',
    success_rate: '96%',
    turnaround: '30-60 Days',
    risk_profile: 'LOW'
  },
  {
    state: 'MD',
    filing_type: 'JUDICIAL (EQUITY)',
    fee_cap: 'Case-by-Case Audit',
    notary_rigor: 'HIGH',
    judicial_oversight: 'Extreme',
    success_rate: '65%',
    turnaround: '180-365 Days',
    risk_profile: 'HIGH'
  }
];

const OUTREACH_DATA = [
  { state: 'FL', primary_channel: 'SMS / MOBILE', hit_rate: '92%', avg_response_days: 4, preferred_script: 'High Intensity', trust_barrier: 'MEDIUM', efficiency_rank: 'Tier 1' },
  { state: 'WA', primary_channel: 'DIRECT MAIL', hit_rate: '88%', avg_response_days: 14, preferred_script: 'White-Glove', trust_barrier: 'LOW', efficiency_rank: 'Tier 1' },
  { state: 'TX', primary_channel: 'PROCESS SERVER', hit_rate: '95%', avg_response_days: 2, preferred_script: 'Legal / Formal', trust_barrier: 'HIGH', efficiency_rank: 'Tier 1 (High Cost)' }
];

const ECONOMIC_DATA = [
  { state: 'FL', frequency: 'HIGH', avg_range: '$15k – $150k', concentration: 'URBAN_COASTAL', investor_index: 9.8, suitability: 'EXCELLENT' },
  { state: 'TX', frequency: 'MEDIUM', avg_range: '$40k – $250k+', concentration: 'MAJOR_METROS', investor_index: 9.5, suitability: 'HIGH_YIELD' }
];

const VOLUME_DATA = [
  { state: 'FL', name: 'Florida', tax_deed_vol: 'High (Weekly)', access_type: 'Centralized Portal', fragmentation: 2, rank: 'Tier 1' },
  { state: 'WA', name: 'Washington', tax_deed_vol: 'Moderate', access_type: 'Centralized Lists', fragmentation: 3, rank: 'Tier 1' }
];

const LEGAL_MATRIX = [
  { state: 'FL', term: 'Tax Deed Surplus', statute: 'FL Stat § 197.582', entitlement: 'Former Owner', window: '2 Years', friction: 'LOW', yield: 9.4 },
  { state: 'GA', term: 'Excess Funds', statute: 'O.C.G.A. § 48-4-5', entitlement: 'Owner / Heirs', window: 'Unlimited*', friction: 'MED', yield: 8.8 }
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeChain, setActiveChain] = useState<'chain0' | 'chain1' | 'chain2' | 'chain3' | 'chain4' | 'chain5'>('chain5');

  const getRiskStyles = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'MEDIUM': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'HIGH': return 'text-rose-600 bg-rose-50 border-rose-200';
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
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Research Sequence: Strategy Chain 5 Active</p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[1.75rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100 overflow-x-auto no-scrollbar max-w-full">
           <button onClick={() => setActiveChain('chain0')} className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain0' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Market</button>
           <button onClick={() => setActiveChain('chain1')} className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain1' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Legal</button>
           <button onClick={() => setActiveChain('chain2')} className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain2' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Volume</button>
           <button onClick={() => setActiveChain('chain3')} className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain3' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Economics</button>
           <button onClick={() => setActiveChain('chain4')} className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain4' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Outreach</button>
           <button onClick={() => setActiveChain('chain5')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 relative ${activeChain === 'chain5' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             <FileSignatureIcon size={16} /> Compliance
             {activeChain === 'chain5' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></span>}
           </button>
        </div>
      </div>

      {activeChain === 'chain5' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           {/* Compliance Summary Panel */}
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-emerald-600 rounded-2xl shadow-xl"><FileSignatureIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 5: Compliance & Filing</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">
                      "Recovery velocity is dictated by the **Filing Friction Coefficient**: the ratio of administrative ease vs. judicial complexity."
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4 border border-white/10 hover:-translate-y-1 transition-all group">
                          <GavelIcon size={32} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic">Judicial Regimes</h4>
                          <p className="text-xs font-bold text-indigo-100/80 leading-relaxed uppercase tracking-tight">Focus: TX & MD. Requires formal 'Motion for Release' in district court. Attorney representation is practically mandatory.</p>
                       </div>
                       <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] space-y-4 border border-indigo-400 hover:-translate-y-1 transition-all group">
                          <ShieldCheckIcon size={32} className="text-white group-hover:scale-110 transition-transform" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic">Administrative Regimes</h4>
                          <p className="text-xs font-bold text-white/90 leading-relaxed uppercase tracking-tight">Focus: FL, WA, GA. Claims are processed directly by the County Treasurer or Clerk. Low friction, high payout velocity.</p>
                       </div>
                    </div>
                 </div>

                 <div className="w-full lg:w-[450px] bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-200 shadow-inner relative overflow-hidden shrink-0">
                    <h4 className="text-lg font-black text-slate-900 uppercase italic mb-8 border-b-2 border-slate-100 pb-4 flex items-center gap-3">
                       {/* Replaced non-existent BalanceIcon with ScaleIcon */}
                       <ScaleIcon size={20} className="text-indigo-600" /> Success Metrics
                    </h4>
                    <div className="space-y-8">
                       {[
                         { label: 'Administrative Payouts', val: 92, color: 'bg-emerald-500' },
                         { label: 'Judicial Release Rate', val: 58, color: 'bg-amber-500' },
                         { label: 'Notary Verification Integrity', val: 99, color: 'bg-indigo-600' }
                       ].map((stat, i) => (
                         <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                               <span>{stat.label}</span>
                               <span className="text-slate-900">{stat.val}%</span>
                            </div>
                            <div className="h-2.5 w-full bg-white rounded-full overflow-hidden border border-slate-200 shadow-inner">
                               <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <GavelIcon size={160} />
                    </div>
                 </div>
              </div>
           </div>

           {/* Compliance Matrix Table */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="p-12 border-b-2 border-slate-50 bg-slate-50/30 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner"><ShieldCheckIcon size={28} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">National Compliance Matrix</h3>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Researched Filing Logic v5.0</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Rules Synced</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/80 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-10 py-6">State Protocol</th>
                          <th className="px-10 py-6">Filing Method</th>
                          <th className="px-10 py-6">Fee Restriction</th>
                          <th className="px-10 py-6">Payout Velocity</th>
                          <th className="px-10 py-6 text-center">Risk Profile</th>
                          <th className="px-10 py-6 text-right">Success Index</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {COMPLIANCE_DATA.map((item) => (
                         <tr key={item.state} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-lg shadow-xl shrink-0">{item.state}</div>
                                  <p className="text-base font-black text-slate-900 uppercase italic tracking-tight">{item.state === 'TX' ? 'Court-Bound' : 'Treasurer'}</p>
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-tight">
                                  <GavelIcon size={14} className="text-indigo-600" />
                                  {item.filing_type}
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <span className="px-4 py-1.5 bg-slate-950 text-white rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md">
                                  {item.fee_cap}
                               </span>
                            </td>
                            <td className="px-10 py-8 font-black text-slate-800 text-sm italic tracking-tight">
                               {item.turnaround}
                            </td>
                            <td className="px-10 py-8 text-center">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm ${getRiskStyles(item.risk_profile)}`}>
                                  {item.risk_profile}
                               </span>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <div className="flex items-baseline justify-end gap-1">
                                  <span className="text-2xl font-black text-slate-900 tracking-tighter">{item.success_rate}</span>
                               </div>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Call to Action: Packager Integration */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10">
              <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border-2 border-white/5">
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl animate-bounce"><ZapIcon size={24} /></div>
                       <h4 className="text-2xl font-black uppercase italic tracking-tight">Claim Packager Ready</h4>
                    </div>
                    <p className="text-indigo-100 text-lg font-bold leading-relaxed opacity-90 max-w-lg">
                       "Chain 5 protocols are now integrated with our **Smart Document Packager**. Automated court motions for Judicial states (TX, MD) are currently in BETA."
                    </p>
                    <button onClick={() => navigate('/packager')} className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-4 active:scale-95">
                       Initialize Packager Node <ArrowRightIcon size={20} className="text-indigo-600" />
                    </button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <HardDriveIcon size={220} fill="white" />
                 </div>
              </div>

              <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl flex flex-col justify-center space-y-8 ring-1 ring-slate-100/50">
                 <div className="flex items-center gap-5">
                    <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl shadow-inner border border-rose-100"><ShieldAlertIcon size={24} /></div>
                    <div>
                       <h4 className="text-xl font-black text-slate-900 uppercase italic">Statutory Pitfalls</h4>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Prompt 5 Research</p>
                    </div>
                 </div>
                 <ul className="space-y-6">
                    <li className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                       <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                       <p className="text-sm text-slate-700 font-bold leading-relaxed italic">"Texas Law: Any agreement for recovery of excess proceeds between a defendant and a third-party is VOID if the fee exceeds 25%."</p>
                    </li>
                    <li className="flex items-start gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100">
                       <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                       <p className="text-sm text-slate-700 font-bold leading-relaxed italic">"Florida: Multiple counties now require 'Heirship Affidavits' to be witnessed by two non-relative residents of the same county."</p>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain4' ? (
        /* CHAIN 4 VIEW: CONTACT INTELLIGENCE (EXISTING) */
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><RadarIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 4: Contact Intelligence</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">
                      "Successful recovery hinges on the **Skip-Trace Integrity Ratio**: the probability that the identified contact is the verified statutory claimant."
                    </p>
                 </div>
              </div>
           </div>
           {/* ... Outreach Table ... */}
        </div>
      ) : activeChain === 'chain3' ? (
        /* CHAIN 3 VIEW: ECONOMICS (EXISTING) */
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
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
                 </div>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain2' ? (
        /* CHAIN 2 VIEW: VOLUME & ACCESS (EXISTING) */
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
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
                 </div>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain1' ? (
        /* CHAIN 1 VIEW: LEGAL FRAMEWORK (EXISTING) */
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl relative overflow-hidden ring-1 ring-slate-100/50">
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl"><ScaleIcon size={32} className="text-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 1: Legal Framework Analysis</h3>
                    </div>
                    <p className="text-slate-700 text-xl font-bold leading-relaxed italic opacity-80 max-w-3xl">
                      "Institutional scale requires a standardized legal translation of the 3,000+ idiosyncratic county rules governing home equity protection."
                    </p>
                 </div>
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
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;
