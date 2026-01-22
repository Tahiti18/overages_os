
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
  RadarIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';

/**
 * STRATEGY CHAIN 4: OUTREACH & SKIP-TRACE INTELLIGENCE
 * Researched analysis of channel effectiveness and contact reliability.
 */
const OUTREACH_DATA = [
  {
    state: 'FL',
    primary_channel: 'SMS / MOBILE',
    hit_rate: '92%',
    avg_response_days: 4,
    preferred_script: 'High Intensity / Urgency',
    trust_barrier: 'MEDIUM',
    social_index: 8.8,
    efficiency_rank: 'Tier 1'
  },
  {
    state: 'WA',
    primary_channel: 'DIRECT MAIL',
    hit_rate: '88%',
    avg_response_days: 14,
    preferred_script: 'White-Glove / Professional',
    trust_barrier: 'LOW',
    social_index: 6.5,
    efficiency_rank: 'Tier 1'
  },
  {
    state: 'GA',
    primary_channel: 'HYBRID (MAIL+PHONE)',
    hit_rate: '85%',
    avg_response_days: 9,
    preferred_script: 'Relational / Localized',
    trust_barrier: 'LOW',
    social_index: 7.2,
    efficiency_rank: 'Tier 2'
  },
  {
    state: 'TX',
    primary_channel: 'PROCESS SERVER',
    hit_rate: '95%',
    avg_response_days: 2,
    preferred_script: 'Legal / Formal',
    trust_barrier: 'HIGH',
    social_index: 9.1,
    efficiency_rank: 'Tier 1 (High Cost)'
  },
  {
    state: 'NC',
    primary_channel: 'DIRECT MAIL',
    hit_rate: '82%',
    avg_response_days: 18,
    preferred_script: 'Educational / Helper',
    trust_barrier: 'VERY LOW',
    social_index: 5.8,
    efficiency_rank: 'Tier 3'
  }
];

const ECONOMIC_DATA = [
  { state: 'FL', frequency: 'HIGH', avg_range: '$15k – $150k', concentration: 'URBAN_COASTAL', investor_index: 9.8, suitability: 'EXCELLENT' },
  { state: 'GA', frequency: 'MED_HIGH', avg_range: '$10k – $85k', concentration: 'METRO_ATLANTA', investor_index: 8.2, suitability: 'STABLE' },
  { state: 'TX', frequency: 'MEDIUM', avg_range: '$40k – $250k+', concentration: 'MAJOR_METROS', investor_index: 9.5, suitability: 'HIGH_YIELD' },
  { state: 'WA', frequency: 'MEDIUM', avg_range: '$12k – $90k', concentration: 'PUGET_SOUND', investor_index: 7.4, suitability: 'SCALABLE' }
];

const VOLUME_DATA = [
  { state: 'FL', name: 'Florida', tax_deed_vol: 'High (Weekly)', access_type: 'Centralized Portal', fragmentation: 2, rank: 'Tier 1' },
  { state: 'TX', name: 'Texas', tax_deed_vol: 'Extreme (1st Tuesday)', access_type: 'County Fragmented', fragmentation: 9, rank: 'Tier 1' },
  { state: 'WA', name: 'Washington', tax_deed_vol: 'Moderate', access_type: 'Centralized Lists', fragmentation: 3, rank: 'Tier 1' }
];

const LEGAL_MATRIX = [
  { state: 'FL', term: 'Tax Deed Surplus', statute: 'FL Stat § 197.582', entitlement: 'Former Owner', window: '2 Years', friction: 'LOW', yield: 9.4 },
  { state: 'GA', term: 'Excess Funds', statute: 'O.C.G.A. § 48-4-5', entitlement: 'Owner / Heirs', window: 'Unlimited*', friction: 'MED', yield: 8.8 },
  { state: 'TX', term: 'Excess Proceeds', statute: 'TX Tax Code § 34.04', entitlement: 'Defendant', window: '2 Years', friction: 'HIGH', yield: 7.2 }
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeChain, setActiveChain] = useState<'chain0' | 'chain1' | 'chain2' | 'chain3' | 'chain4'>('chain4');

  const getRankStyles = (rank: string) => {
    if (rank.includes('Tier 1')) return 'bg-emerald-600 text-white border-emerald-400';
    if (rank.includes('Tier 2')) return 'bg-indigo-600 text-white border-indigo-400';
    return 'bg-slate-50 text-slate-500 border-slate-200';
  };

  const getBarrierStyles = (barrier: string) => {
    switch (barrier) {
      case 'LOW':
      case 'VERY LOW': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
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
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Research Sequence: Strategy Chain 4 Active</p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[1.75rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100 overflow-x-auto no-scrollbar max-w-full">
           <button onClick={() => setActiveChain('chain0')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain0' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Market</button>
           <button onClick={() => setActiveChain('chain1')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain1' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Legal</button>
           <button onClick={() => setActiveChain('chain2')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain2' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Volume</button>
           <button onClick={() => setActiveChain('chain3')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeChain === 'chain3' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}>Economics</button>
           <button onClick={() => setActiveChain('chain4')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 relative ${activeChain === 'chain4' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             <RadarIcon size={16} /> Outreach
             {activeChain === 'chain4' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full animate-ping"></span>}
           </button>
        </div>
      </div>

      {activeChain === 'chain4' ? (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           {/* Outreach Summary Panel */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] space-y-4 hover:bg-white hover:border-indigo-400 transition-all group">
                          <SmartphoneIcon size={32} className="text-indigo-600 group-hover:scale-110 transition-transform" />
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Digital-First Nodes</h4>
                          <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-tight">Focus: FL & TX Major Metros. 78% of claimants respond within 48 hours to SMS-based recovery notifications.</p>
                       </div>
                       <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] space-y-4 hover:bg-white hover:border-emerald-400 transition-all group">
                          <MailIcon size={32} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Analog/Trust Nodes</h4>
                          <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase tracking-tight">Focus: WA & NC. High Direct Mail efficacy (82%+). Claimants in these zones require physical 'proof of legitimacy' before engagement.</p>
                       </div>
                    </div>
                 </div>

                 <div className="w-full lg:w-[450px] bg-slate-950 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden shrink-0">
                    <h4 className="text-xl font-black uppercase italic mb-8 border-b border-white/10 pb-4">Skip-Trace Hit Rate</h4>
                    <div className="space-y-10">
                       {[
                         { label: 'Public Records (Deed-Match)', val: 95, color: 'bg-emerald-500' },
                         { label: 'Social Graph (Relative Trace)', val: 68, color: 'bg-indigo-500' },
                         { label: 'Obituary / Probate Sync', val: 42, color: 'bg-amber-500' }
                       ].map((stat, i) => (
                         <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                               <span>{stat.label}</span>
                               <span>{stat.val}% Accuracy</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 shadow-inner">
                               <div className={`h-full ${stat.color} transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.1)]`} style={{ width: `${stat.val}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <SearchIcon size={160} fill="white" />
                    </div>
                 </div>
              </div>
           </div>

           {/* Outreach Table */}
           <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
              <div className="p-12 border-b-2 border-slate-50 bg-slate-50/30 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner"><MessageSquareIcon size={28} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">National Outreach Matrix</h3>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Researched Contact Intelligence v4.0</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">Multi-Channel Active</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50/80 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-10 py-6">Jurisdiction Node</th>
                          <th className="px-10 py-6">Primary Channel</th>
                          <th className="px-10 py-6">Skip-Trace Hit Rate</th>
                          <th className="px-10 py-6">Response Velocity</th>
                          <th className="px-10 py-6 text-center">Trust Barrier</th>
                          <th className="px-10 py-6 text-right">Strategic Grade</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {OUTREACH_DATA.map((item) => (
                         <tr key={item.state} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-6">
                                  <div className="w-12 h-12 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-lg shadow-xl shrink-0">{item.state}</div>
                                  <p className="text-base font-black text-slate-900 uppercase italic tracking-tight">{item.state === 'TX' ? 'Hard Trace' : 'Standard Trace'}</p>
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-3 text-xs font-bold text-slate-700 uppercase tracking-tight">
                                  {item.primary_channel.includes('MAIL') ? <MailIcon size={14} className="text-indigo-600" /> : <SmartphoneIcon size={14} className="text-indigo-600" />}
                                  {item.primary_channel}
                               </div>
                            </td>
                            <td className="px-10 py-8">
                               <div className="flex items-center gap-3">
                                  <div className="w-12 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                     <div className="h-full bg-emerald-500" style={{ width: item.hit_rate }}></div>
                                  </div>
                                  <span className="text-sm font-black text-slate-900">{item.hit_rate}</span>
                               </div>
                            </td>
                            <td className="px-10 py-8 font-black text-slate-800 text-sm italic tracking-tight">
                               {item.avg_response_days} Day Avg.
                            </td>
                            <td className="px-10 py-8 text-center">
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm ${getBarrierStyles(item.trust_barrier)}`}>
                                  {item.trust_barrier}
                               </span>
                            </td>
                            <td className="px-10 py-8 text-right">
                               <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-xl transition-all group-hover:scale-105 ${getRankStyles(item.efficiency_rank)}`}>
                                  {item.efficiency_rank}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Call to Action: Outreach Architect Promotion */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-10">
              <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border-2 border-indigo-400">
                 <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-xl"><SmartphoneIcon size={24} /></div>
                       <h4 className="text-2xl font-black uppercase italic tracking-tight">Multi-Channel Engine</h4>
                    </div>
                    <p className="text-indigo-50 text-lg font-bold leading-relaxed opacity-95 max-w-lg">
                       "Chain 4 data optimizes outreach sequencing. In Florida, SMS triggers a response 3.5x faster than Direct Mail, shortening the claim-to-payout cycle by 12 days."
                    </p>
                    <button onClick={() => navigate('/properties/new')} className="px-12 py-6 bg-white text-indigo-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-50 transition-all flex items-center gap-4 active:scale-95 border-2 border-white/20">
                       Architect Outreach Script <ArrowRightIcon size={20} />
                    </button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                    <MessageSquareIcon size={220} fill="white" />
                 </div>
              </div>

              <div className="bg-slate-950 p-12 rounded-[3.5rem] border-2 border-white/5 shadow-3xl flex flex-col justify-center space-y-8 relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-inner border border-emerald-400/30"><UserCheckIcon size={24} /></div>
                       <div>
                          <h4 className="text-xl font-black text-white uppercase italic">Verification Warning</h4>
                          <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">Prompt 4 Research</p>
                       </div>
                    </div>
                    <ul className="space-y-5">
                       <li className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                          <div className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0"></div>
                          <p className="text-sm text-indigo-100 font-bold leading-relaxed italic">"Texas claimant data is highly protected; skip-trace integrity requires manual verification of the 'Notice of Sale' return-receipt log."</p>
                       </li>
                       <li className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-2xl transition-all border border-transparent hover:border-white/10">
                          <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0"></div>
                          <p className="text-sm text-indigo-100 font-bold leading-relaxed italic">"WA & GA show a 40% increase in response rates when outreach materials mention the specific 'Overage ID' rather than generic surplus terms."</p>
                       </li>
                    </ul>
                 </div>
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <RadarIcon size={180} />
                 </div>
              </div>
           </div>
        </div>
      ) : activeChain === 'chain3' ? (
        /* CHAIN 3 VIEW: ECONOMICS (EXISTING) */
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
                       <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] space-y-4 border border-white/10">
                          <TargetIcon size={32} className="text-indigo-400" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic">High Velocity Zones</h4>
                          <p className="text-xs font-bold text-indigo-100/80 leading-relaxed uppercase tracking-tight">Focus: FL & GA. Predictable monthly drops with clear overage ranges. Ideal for high-frequency automation.</p>
                       </div>
                       <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] space-y-4 border border-indigo-400">
                          <TrendingUpIcon size={32} className="text-white" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic">Deep Value Zones</h4>
                          <p className="text-xs font-bold text-white/90 leading-relaxed uppercase tracking-tight">Focus: TX & WA. Higher legal friction, but individual overages often exceed $100k due to judicial sale structure.</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           {/* ... Rest of Economic Chain ... */}
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
                 </div>
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
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 1: Legal Framework Analysis</h3>
                    </div>
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
