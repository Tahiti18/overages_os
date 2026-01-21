
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
          // Prevent duplicates by description
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div 
        className="px-8 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <CalculatorIcon size={20} className="text-indigo-600" />
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest">Lien Waterfall Engine</h3>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Recoverable</span>
            <span className="text-sm font-black">${waterfallData.finalSurplus.toLocaleString()}</span>
          </div>
          {isExpanded ? <ChevronUpIcon size={18} className="text-slate-400" /> : <ChevronDownIcon size={18} className="text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Surplus</p>
              <p className="text-2xl font-black text-slate-900">${initialSurplus.toLocaleString()}</p>
            </div>
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Total Senior Debt</p>
              <p className="text-2xl font-black text-red-600">-${(initialSurplus - waterfallData.finalSurplus).toLocaleString()}</p>
            </div>
            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Net Owner Recovery</p>
              <p className="text-2xl font-black text-emerald-700">${waterfallData.finalSurplus.toLocaleString()}</p>
            </div>
          </div>

          <div className="relative space-y-4 pt-4">
             <div className="flex justify-center mb-8">
               <div className="px-8 py-2.5 bg-slate-900 text-white rounded-full text-xs font-black shadow-xl ring-8 ring-slate-50 uppercase tracking-widest">
                 Funds Source: Tax Sale Surplus
               </div>
             </div>

             {waterfallData.steps.map((step, idx) => (
               <div key={step.id} className="relative flex flex-col items-center">
                 <div className="h-10 w-0.5 bg-slate-200"></div>
                 
                 <div className="w-full flex items-start gap-8 group">
                   <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-200 flex items-center justify-center font-black text-slate-400 shrink-0 group-hover:border-indigo-400 group-hover:text-indigo-600 group-hover:shadow-lg transition-all">
                     {step.priority}
                   </div>

                   <div className={`flex-1 p-6 rounded-[1.5rem] border-2 transition-all ${
                     step.status === 'PAID' ? 'bg-white border-slate-100 hover:border-indigo-200 shadow-sm' : 
                     step.status === 'PARTIAL' ? 'bg-orange-50 border-orange-200' : 
                     'bg-slate-50 border-slate-100 opacity-60'
                   }`}>
                     <div className="flex items-start justify-between mb-6">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                            <input 
                              type="text" 
                              value={step.description}
                              onChange={(e) => updateLien(step.id, { description: e.target.value })}
                              className="bg-transparent border-none p-0 text-base font-black text-slate-900 focus:ring-0 w-full"
                            />
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border shadow-sm ${
                              step.status === 'PAID' ? 'bg-green-100 text-green-700 border-green-200' :
                              step.status === 'PARTIAL' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                              'bg-slate-200 text-slate-500 border-slate-300'
                            }`}>
                              {step.status}
                            </span>
                         </div>
                         <select 
                           value={step.type}
                           onChange={(e) => updateLien(step.id, { type: e.target.value as LienType, priority: DEFAULT_PRIORITY[e.target.value as LienType] })}
                           className="text-[10px] font-black text-slate-400 bg-transparent border-none p-0 focus:ring-0 uppercase tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                         >
                            {Object.values(LienType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                         </select>
                       </div>
                       <div className="flex flex-col items-end gap-2">
                         <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                           <DollarSignIcon size={14} className="text-slate-400" />
                           <input 
                              type="number"
                              value={step.amount}
                              onChange={(e) => updateLien(step.id, { amount: Number(e.target.value) })}
                              className="w-24 text-right bg-transparent border-none rounded-lg p-0 text-sm font-black focus:ring-0"
                           />
                           <button 
                             onClick={() => removeLien(step.id)}
                             className="p-1.5 text-slate-300 hover:text-red-500 transition-colors ml-1"
                           >
                             <Trash2Icon size={16} />
                           </button>
                         </div>
                         <p className="text-[11px] font-black text-indigo-600 uppercase tracking-tighter">Satisfied: ${step.satisfied_amount.toLocaleString()}</p>
                       </div>
                     </div>
                     
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                       <div 
                         className={`h-full transition-all duration-1000 ${step.status === 'PAID' ? 'bg-indigo-600' : 'bg-amber-400'}`}
                         style={{ width: `${(step.satisfied_amount / (step.amount || 1)) * 100}%` }}
                       ></div>
                     </div>
                   </div>
                 </div>
               </div>
             ))}

             <div className="flex flex-col items-center">
               <div className="h-14 w-0.5 bg-slate-200 border-dashed border-l-2"></div>
               <div className="w-full flex items-center gap-8">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shadow-2xl shadow-indigo-200">
                    <ShieldCheckIcon size={28} />
                 </div>
                 <div className="flex-1 p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl flex items-center justify-between border border-white/5 relative overflow-hidden group">
                    <div className="relative z-10">
                      <h4 className="font-black text-xl uppercase tracking-tighter">Net Yield to Claimant</h4>
                      <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mt-1">Ready for Automated Packager</p>
                    </div>
                    <div className="text-right relative z-10">
                      <p className="text-4xl font-black text-white">${waterfallData.finalSurplus.toLocaleString()}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-2">Final Authorized Amount</p>
                    </div>
                    <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                       <CalculatorIcon size={100} fill="white" />
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-3 text-slate-400 text-xs font-medium">
              <InfoIcon size={18} className="text-indigo-400" />
              Priority hierarchy governed by jurisdiction rules. Seniority is audited by AI Core v3.0.
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
               <button 
                 onClick={syncAiDiscovery}
                 disabled={isSyncing}
                 className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50 group"
               >
                 {isSyncing ? <RefreshCwIcon size={18} className="animate-spin" /> : <SparklesIcon size={18} className="text-amber-400 group-hover:scale-110 transition-transform" />}
                 AI Discovery Sync
               </button>
               <button 
                 onClick={addLien}
                 className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-white border-2 border-slate-200 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-400 hover:text-indigo-600 transition-all active:scale-95 shadow-sm"
               >
                 <PlusIcon size={18} />
                 Manual Discovery
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LienWaterfall;
