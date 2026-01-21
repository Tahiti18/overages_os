
import React, { useMemo, useState } from 'react';
import { 
  ArrowDownIcon, 
  PlusIcon, 
  Trash2Icon, 
  CalculatorIcon, 
  ShieldCheckIcon, 
  AlertTriangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InfoIcon,
  SparklesIcon,
  RefreshCwIcon,
  DollarSignIcon
} from 'lucide-react';
import { Lien, LienType, Property } from '../types';
import { discoverPropertyLiens } from '../lib/gemini';

interface LienWaterfallProps {
  initialSurplus: number;
  property?: Property;
  aiDiscoveredLiens?: Lien[];
}

const DEFAULT_PRIORITY: Record<LienType, number> = {
  [LienType.GOVERNMENT]: 1,
  [LienType.MORTGAGE_1]: 2,
  [LienType.MORTGAGE_2]: 3,
  [LienType.HOA]: 4,
  [LienType.JUDGMENT]: 5,
  [LienType.MECHANIC]: 6,
  [LienType.OTHER]: 7,
};

const LienWaterfall: React.FC<LienWaterfallProps> = ({ initialSurplus, property, aiDiscoveredLiens }) => {
  const [liens, setLiens] = useState<Lien[]>([
    { id: 'l1', type: LienType.MORTGAGE_1, description: 'First Mortgage (Chase)', amount: 45000, priority: 2 },
    { id: 'l2', type: LienType.HOA, description: 'HOA Past Due', amount: 3500, priority: 4 },
  ]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const waterfallData = useMemo(() => {
    let remaining = initialSurplus;
    const sortedLiens = [...liens].sort((a, b) => a.priority - b.priority);
    
    const calculated = sortedLiens.map(lien => {
      const satisfied = Math.min(remaining, lien.amount);
      const status = satisfied === lien.amount ? 'PAID' : satisfied > 0 ? 'PARTIAL' : 'UNPAID';
      const result = {
        ...lien,
        satisfied_amount: satisfied,
        status: status as any,
        remaining_after: Math.max(0, remaining - satisfied)
      };
      remaining = Math.max(0, remaining - satisfied);
      return result;
    });

    return {
      steps: calculated,
      finalSurplus: remaining
    };
  }, [liens, initialSurplus]);

  const addLien = () => {
    const newLien: Lien = {
      id: `l${Date.now()}`,
      type: LienType.OTHER,
      description: 'New Potential Lien',
      amount: 0,
      priority: 7
    };
    setLiens([...liens, newLien]);
  };

  const removeLien = (id: string) => {
    setLiens(liens.filter(l => l.id !== id));
  };

  const updateLien = (id: string, updates: Partial<Lien>) => {
    setLiens(liens.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const syncAiDiscovery = async () => {
    setIsSyncing(true);
    try {
      if (aiDiscoveredLiens && aiDiscoveredLiens.length > 0) {
        setLiens(prev => {
          const existingIds = new Set(prev.map(l => l.id));
          const newOnes = aiDiscoveredLiens.filter(al => !existingIds.has(al.id));
          return [...prev, ...newOnes];
        });
      } else if (property) {
        const discovered = await discoverPropertyLiens(property);
        const newLiens: Lien[] = discovered.map((d: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          type: d.type as LienType,
          description: `AI DISCOVERY: ${d.description}`,
          amount: d.amount,
          priority: d.priority
        }));
        
        setLiens(prev => {
          const currentDescriptions = new Set(prev.map(l => l.description));
          const filteredNew = newLiens.filter(nl => !currentDescriptions.has(nl.description));
          return [...prev, ...filteredNew];
        });
      }
    } catch (err) {
      console.error("AI Sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 ring-1 ring-slate-100/50">
      <div 
        className="px-10 py-8 bg-slate-50/50 border-b-2 border-slate-100 flex items-center justify-between cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform">
            <CalculatorIcon size={24} />
          </div>
          <div>
             <h3 className="font-black text-slate-900 text-sm uppercase tracking-[0.2em] italic">Lien Waterfall Engine</h3>
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Algorithm v3.0 • GA Statutory</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-6 py-2.5 bg-indigo-600 rounded-2xl text-white shadow-2xl shadow-indigo-300 border-2 border-indigo-400">
            <span className="text-[11px] font-black uppercase tracking-widest opacity-80">Recoverable</span>
            <span className="text-xl font-black">${waterfallData.finalSurplus.toLocaleString()}</span>
          </div>
          {isExpanded ? <ChevronUpIcon size={24} className="text-slate-400" /> : <ChevronDownIcon size={24} className="text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-12 space-y-12 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-xl hover:-translate-y-1 transition-all">
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">Gross Surplus</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">${initialSurplus.toLocaleString()}</p>
            </div>
            <div className="p-8 bg-rose-50 rounded-[2.5rem] border-2 border-rose-100 shadow-xl hover:-translate-y-1 transition-all">
              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2">Total Senior Debt</p>
              <p className="text-3xl font-black text-rose-700 tracking-tighter">-${(initialSurplus - waterfallData.finalSurplus).toLocaleString()}</p>
            </div>
            <div className="p-8 bg-emerald-50 rounded-[2.5rem] border-2 border-emerald-100 shadow-xl hover:-translate-y-1 transition-all">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Net Owner Recovery</p>
              <p className="text-3xl font-black text-emerald-700 tracking-tighter">${waterfallData.finalSurplus.toLocaleString()}</p>
            </div>
          </div>

          <div className="relative space-y-6 pt-6">
             <div className="flex justify-center mb-10">
               <div className="px-10 py-3 bg-slate-950 text-white rounded-full text-[11px] font-black shadow-3xl ring-8 ring-slate-50 uppercase tracking-widest border-2 border-white/10">
                 Funds Source: Tax Sale Surplus
               </div>
             </div>

             {waterfallData.steps.map((step, idx) => (
               <div key={step.id} className="relative flex flex-col items-center">
                 <div className="h-14 w-1 bg-slate-100 shadow-inner"></div>
                 
                 <div className="w-full flex items-start gap-10 group">
                   <div className="w-16 h-16 rounded-2xl bg-white border-4 border-slate-100 flex items-center justify-center font-black text-xl text-slate-400 shrink-0 group-hover:border-indigo-500 group-hover:text-indigo-600 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                     0{idx + 1}
                   </div>

                   <div className={`flex-1 p-8 rounded-[3rem] border-2 transition-all shadow-xl group-hover:shadow-2xl ${
                     step.status === 'PAID' ? 'bg-white border-emerald-100 hover:border-emerald-300' : 
                     step.status === 'PARTIAL' ? 'bg-orange-50 border-orange-200' : 
                     'bg-slate-50 border-slate-200 opacity-80'
                   }`}>
                     <div className="flex items-start justify-between mb-8">
                       <div className="flex-1">
                         <div className="flex items-center gap-4 mb-3">
                            <input 
                              type="text" 
                              value={step.description}
                              onChange={(e) => updateLien(step.id, { description: e.target.value })}
                              className="bg-transparent border-none p-0 text-xl font-black text-slate-900 focus:ring-0 w-full italic truncate"
                            />
                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border-2 uppercase tracking-widest shadow-md ${
                              step.status === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' :
                              step.status === 'PARTIAL' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                              'bg-slate-200 text-slate-600 border-slate-300'
                            }`}>
                              {step.status}
                            </span>
                         </div>
                         <div className="relative w-fit group/select">
                            <select 
                              value={step.type}
                              onChange={(e) => updateLien(step.id, { type: e.target.value as LienType, priority: DEFAULT_PRIORITY[e.target.value as LienType] })}
                              className="text-[11px] font-black text-slate-600 bg-slate-50 rounded-xl px-4 py-2 border-2 border-slate-100 focus:border-indigo-400 focus:ring-0 uppercase tracking-widest cursor-pointer hover:bg-white transition-all appearance-none pr-10 shadow-sm"
                            >
                                {Object.values(LienType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                            </select>
                            <ChevronDownIcon size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                         </div>
                       </div>
                       <div className="flex flex-col items-end gap-3">
                         <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-2xl border-2 border-slate-200 shadow-inner group-focus-within:border-indigo-500 transition-all">
                           <DollarSignIcon size={18} className="text-slate-400" />
                           <input 
                              type="number"
                              value={step.amount}
                              onChange={(e) => updateLien(step.id, { amount: Number(e.target.value) })}
                              className="w-32 text-right bg-transparent border-none rounded-lg p-0 text-lg font-black focus:ring-0 text-slate-900"
                           />
                           <button 
                             onClick={() => removeLien(step.id)}
                             className="p-2 text-slate-300 hover:text-red-500 transition-colors ml-1 bg-white rounded-lg shadow-sm border border-slate-200"
                           >
                             <Trash2Icon size={18} />
                           </button>
                         </div>
                         <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                            <p className="text-[11px] font-black text-indigo-700 uppercase tracking-widest">Satisfied: ${step.satisfied_amount.toLocaleString()}</p>
                         </div>
                       </div>
                     </div>
                     
                     <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                       <div 
                         className={`h-full transition-all duration-1000 shadow-[0_0_15px_rgba(79,70,229,0.5)] ${step.status === 'PAID' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                         style={{ width: `${(step.satisfied_amount / (step.amount || 1)) * 100}%` }}
                       ></div>
                     </div>
                   </div>
                 </div>
               </div>
             ))}

             <div className="flex flex-col items-center">
               <div className="h-16 w-1 bg-slate-100 border-dashed border-l-2 shadow-inner"></div>
               <div className="w-full flex items-center gap-10">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-900 text-white flex items-center justify-center shadow-3xl border-2 border-white/20 ring-8 ring-indigo-500/5">
                    <ShieldCheckIcon size={32} />
                 </div>
                 <div className="flex-1 p-10 bg-slate-950 text-white rounded-[3.5rem] shadow-3xl flex items-center justify-between border-2 border-white/5 relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                    <div className="relative z-10">
                      <h4 className="font-black text-2xl uppercase tracking-tighter italic">Net Yield to Claimant</h4>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2 bg-indigo-900/50 px-3 py-1 rounded-lg w-fit border border-indigo-500/30">Ready for Automated Packager</p>
                    </div>
                    <div className="text-right relative z-10">
                      <p className="text-5xl font-black text-white tracking-tighter">${waterfallData.finalSurplus.toLocaleString()}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mt-3 opacity-80">Final Authorized Distribution</p>
                    </div>
                    <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-45 group-hover:scale-150 transition-all duration-1000">
                       <CalculatorIcon size={220} fill="white" />
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-10 pt-12 border-t-2 border-slate-50">
            <div className="flex items-start gap-4 text-slate-600 text-sm font-bold bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100 shadow-inner">
              <InfoIcon size={24} className="text-indigo-600 shrink-0 mt-1" />
              <p className="leading-relaxed">
                Waterfall priority hierarchy is governed by state-specific seniority rules. AI Core v3.0 audits all discovered senior debt to ensure statutory compliance before authorizing the final distribution amount.
              </p>
            </div>
            <div className="flex items-center gap-5 w-full md:w-auto shrink-0">
               <button 
                 onClick={syncAiDiscovery}
                 disabled={isSyncing}
                 className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-3xl shadow-slate-300 active:scale-95 disabled:opacity-50 group border-2 border-white/10"
               >
                 {isSyncing ? <RefreshCwIcon size={20} className="animate-spin" /> : <SparklesIcon size={20} className="text-amber-400 group-hover:scale-125 transition-transform" />}
                 AI Discovery Sync
               </button>
               <button 
                 onClick={addLien}
                 className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all active:scale-95 shadow-xl hover:shadow-indigo-500/10"
               >
                 <PlusIcon size={20} />
                 Manual Entry
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LienWaterfall;
