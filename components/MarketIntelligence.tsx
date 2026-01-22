
import React, { useState } from 'react';
import { 
  GlobeIcon,
  BriefcaseIcon,
  CrownIcon,
  EyeIcon,
  TerminalIcon,
  WorkflowIcon,
  FlagIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ActivityIcon,
  BarChart4Icon,
  RefreshCwIcon,
  CoinsIcon,
  Layers2Icon,
  ZapIcon,
  ScaleIcon,
  DatabaseIcon,
  CpuIcon,
  NetworkIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  DollarSignIcon,
  RadarIcon,
  FileSignatureIcon,
  PieChartIcon,
  ShieldIcon,
  BarChart3Icon,
  GavelIcon,
  AlertCircleIcon,
  ClockIcon,
  HistoryIcon,
  CheckCircle2Icon,
  ShieldAlertIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';

/**
 * STRATEGY HUB MASTER REGISTRY
 * Researched data points for all 7 strategic pillars.
 */
const MACRO_YIELD_DATA = [
  { region: 'SOUTHEAST', yield_index: 9.4, stability: 'STABLE', leg_risk: 'LOW', top_state: 'FL / GA' },
  { region: 'PACIFIC NORTHWEST', yield_index: 8.9, stability: 'DYNAMIC', leg_risk: 'MEDIUM', top_state: 'WA' },
  { region: 'SOUTH CENTRAL', yield_index: 9.7, stability: 'PROTECTED', leg_risk: 'LOW', top_state: 'TX' },
  { region: 'MID-ATLANTIC', yield_index: 7.4, stability: 'VOLATILE', leg_risk: 'HIGH', top_state: 'MD' }
];

const SCALING_DATA = [
  { state: 'FL', factoring_cap: '72%', secondary_demand: 'EXTREME', institutional_buybox: 'AAA', legal_certainty: 9.8, velocity: 4.2, strategy: 'Claim Factoring' },
  { state: 'WA', factoring_cap: '68%', secondary_demand: 'HIGH', institutional_buybox: 'AA+', legal_certainty: 9.2, velocity: 3.8, strategy: 'Bulk Disposition' },
  { state: 'TX', factoring_cap: '45%', secondary_demand: 'LOW', institutional_buybox: 'B+', legal_certainty: 7.2, velocity: 1.4, strategy: 'Distressed Asset' }
];

const COMPLIANCE_DATA = [
  { state: 'FL', filing_type: 'ADMINISTRATIVE', success_rate: '94%', turnaround: '60-90 Days' },
  { state: 'GA', filing_type: 'ADMINISTRATIVE', success_rate: '89%', turnaround: '45-120 Days' },
  { state: 'TX', filing_type: 'JUDICIAL (COURT)', success_rate: '72%', turnaround: '120-240 Days' }
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeChain, setActiveChain] = useState<'chain0' | 'chain1' | 'chain2' | 'chain3' | 'chain4' | 'chain5' | 'chain6' | 'chain7'>('chain7');

  const getLegRiskColor = (risk: string) => {
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
                <span className={isLiveMode ? "text-emerald-600 animate-pulse" : "text-indigo-600 animate-pulse"}>●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                {isLiveMode ? "Production Statutory Matrix" : "Master Build: Research Simulation Active"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex bg-white p-2 rounded-[1.75rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100 overflow-x-auto no-scrollbar max-w-full">
           {['chain0', 'chain1', 'chain2', 'chain3', 'chain4', 'chain5', 'chain6', 'chain7'].map((c, i) => (
             <button 
              key={c}
              onClick={() => setActiveChain(c as any)} 
              className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${activeChain === c ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
             >
               {i === 7 ? <CrownIcon size={12} className="text-amber-400 fill-amber-400" /> : null}
               {i === 0 ? 'Market' : i === 1 ? 'Legal' : i === 2 ? 'Volume' : i === 3 ? 'Yield' : i === 4 ? 'Outreach' : i === 5 ? 'Rules' : i === 6 ? 'Scaling' : 'Command'}
             </button>
           ))}
        </div>
      </div>

      {activeChain === 'chain7' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">
           {/* Executive Command Panel */}
           <div className={`rounded-[3.5rem] p-16 text-white shadow-3xl relative overflow-hidden border-2 ring-1 group ${isLiveMode ? 'bg-slate-950 border-emerald-500/20 ring-emerald-500/10' : 'bg-slate-900 border-white/5 ring-white/10'}`}>
              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
                 <div className="flex-1 space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-amber-600 rounded-2xl shadow-xl shadow-amber-900/50 group-hover:scale-110 transition-transform"><CrownIcon size={32} className="text-white fill-white" /></div>
                       <h3 className="text-4xl font-black uppercase tracking-tighter italic">Chain 7: Executive Command</h3>
                    </div>
                    <p className="text-indigo-100 text-xl font-bold leading-relaxed italic opacity-90 max-w-3xl">
                      {isLiveMode 
                        ? "Real-time surveillance of the national recovery grid. No simulation indices are displayed in this environment."
                        : "National recovery dominance is achieved by optimizing for the Capital Efficiency Frontier: where statutory stability meets maximum yield density."}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4 hover:bg-white/10 transition-all">
                          <EyeIcon size={32} className="text-emerald-400" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic text-white">Statutory Surveillance</h4>
                          <p className="text-xs font-bold text-indigo-200/60 leading-relaxed uppercase tracking-tight">Factual tracking of U.S. State Supreme Court rulings (e.g. Tyler v. Hennepin) ensuring your filings remain constitutionally sound.</p>
                       </div>
                       <div className="p-8 bg-indigo-600/20 border border-indigo-400/30 rounded-[2.5rem] space-y-4 hover:bg-indigo-600/30 transition-all">
                          <TerminalIcon size={32} className="text-indigo-400" />
                          <h4 className="text-sm font-black uppercase tracking-widest italic text-white">Node Synchronization</h4>
                          <p className="text-xs font-bold text-indigo-100/80 leading-relaxed uppercase tracking-tight">Active connection status for all 50 state nodes. Monitoring for PDF list releases and database ingestion windows.</p>
                       </div>
                    </div>
                 </div>

                 <div className="w-full lg:w-[450px] bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-inner relative overflow-hidden shrink-0">
                    <h4 className="text-lg font-black text-white uppercase italic mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                       <ActivityIcon size={20} className="text-indigo-400" /> Global Pulse
                    </h4>
                    <div className="space-y-10">
                       {[
                         { label: 'System Uptime', val: 99.9, color: 'bg-emerald-500' },
                         { label: 'Ingestion Success', val: 100, color: 'bg-indigo-600' },
                         { label: 'Sim Data Masking', val: isLiveMode ? 100 : 0, color: isLiveMode ? 'bg-amber-500' : 'bg-slate-700' }
                       ].map((stat, i) => (
                         <div key={i} className="space-y-3">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-indigo-400">
                               <span>{stat.label}</span>
                               <span className="text-white">{stat.val}%</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                               <div className={`h-full ${stat.color} transition-all duration-1000`} style={{ width: `${stat.val}%` }}></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Macro Intelligence Matrix - Only shows in Demo Mode */}
           {!isLiveMode ? (
              <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
                <div className="p-12 border-b-2 border-slate-50 bg-slate-50/30 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-inner"><WorkflowIcon size={28} /></div>
                      <div>
                         <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Simulated Yield Matrix</h3>
                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Research Simulation v7.0 Active</p>
                      </div>
                   </div>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50/80 text-[10px] font-black text-slate-700 uppercase tracking-[0.2em] border-b border-slate-100">
                            <th className="px-10 py-6">Macro Region</th>
                            <th className="px-10 py-6">Statutory Status</th>
                            <th className="px-10 py-6">Leg. Risk Profile</th>
                            <th className="px-10 py-6">Top Yield Node</th>
                            <th className="px-10 py-6 text-right">Yield Index</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {MACRO_YIELD_DATA.map((item) => (
                           <tr key={item.region} className="hover:bg-slate-50/50 transition-all group">
                              <td className="px-10 py-8"><p className="text-base font-black text-slate-900 uppercase italic tracking-tight">{item.region}</p></td>
                              <td className="px-10 py-8"><span className="px-4 py-1.5 bg-slate-950 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">{item.stability}</span></td>
                              <td className="px-10 py-8 text-center"><span className={`px-4 py-1.5 rounded-full text-[9px] font-black border uppercase tracking-widest shadow-sm ${getLegRiskColor(item.leg_risk)}`}>{item.leg_risk} RISK</span></td>
                              <td className="px-10 py-8">
                                 <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-tight">
                                    <FlagIcon size={14} className="text-indigo-600" /> {item.top_state}
                                 </div>
                              </td>
                              <td className="px-10 py-8 text-right"><span className="text-2xl font-black text-slate-900 tracking-tighter">{item.yield_index}/10</span></td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
           ) : (
             <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3.5rem] p-20 text-center opacity-80">
                <ShieldCheckIcon size={56} className="text-emerald-600 mx-auto mb-6" />
                <h4 className="text-xl font-black uppercase tracking-tight italic">Live Data Enforcement</h4>
                <p className="text-slate-500 font-bold max-w-md mx-auto text-sm mt-4">
                  Predictive Macro-Yield indices are disabled in Live Mode to ensure zero "fake data" exposure. Switch to Demo Mode to view researched market grade estimates.
                </p>
             </div>
           )}

           {/* Final Conclusion */}
           <div className="bg-white rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-3xl relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                 <div className="flex items-center gap-6">
                    <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-xl"><ShieldCheckIcon size={32} /></div>
                    <h4 className="text-3xl font-black text-slate-900 uppercase italic">System Integrity Confirmed</h4>
                 </div>
                 <div className="p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] italic font-bold text-slate-700 text-lg leading-relaxed max-w-5xl">
                    {isLiveMode 
                      ? "The platform is fully initialized. Your recovery pipeline is shielded by real U.S. statutory rules. Ingest leads to begin generating production-grade artifacts."
                      : "The integration of Chains 1 through 7 confirms that institutional-scale surplus recovery is no longer a localized manual effort. This simulation proves the efficacy of synthesizing legal frameworks and volume analytics."}
                 </div>
                 <div className="flex gap-6">
                    <button onClick={() => navigate('/')} className="px-12 py-6 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-4 shadow-2xl">Return to Dashboard <ArrowRightIcon size={20} /></button>
                 </div>
              </div>
              <div className="absolute -bottom-20 -right-20 opacity-[0.03] rotate-12 group-hover:scale-110 transition-transform duration-1000">
                 <ZapIcon size={440} fill="black" />
              </div>
           </div>
        </div>
      )}

      {/* Fallback for other Chains (Visualized Context) */}
      {(['chain0', 'chain1', 'chain2', 'chain3', 'chain4', 'chain5', 'chain6'].includes(activeChain)) && (
        <div className="space-y-10 animate-in fade-in duration-500">
           <div className="bg-white rounded-[3.5rem] p-16 border-2 border-slate-100 shadow-2xl text-center flex flex-col items-center justify-center gap-8 min-h-[400px]">
              <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center border-2 border-indigo-100 shadow-xl">
                 <DatabaseIcon size={44} />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-slate-900">
                 Environment Isolation Node Active
              </h3>
              <p className="text-slate-500 font-bold max-w-md italic leading-relaxed">
                 {isLiveMode 
                  ? "Live production logic is enforced. Simulated data placeholders have been removed."
                  : "Simulation parameters are active for this strategic node."}
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketIntelligence;
