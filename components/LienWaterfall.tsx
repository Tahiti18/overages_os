
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
  InfoIcon
} from 'lucide-react';
import { Lien, LienType } from '../types';

interface LienWaterfallProps {
  initialSurplus: number;
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

const LienWaterfall: React.FC<LienWaterfallProps> = ({ initialSurplus }) => {
  const [liens, setLiens] = useState<Lien[]>([
    { id: 'l1', type: LienType.MORTGAGE_1, description: 'First Mortgage (Chase)', amount: 45000, priority: 2 },
    { id: 'l2', type: LienType.HOA, description: 'HOA Past Due', amount: 3500, priority: 4 },
  ]);
  const [isExpanded, setIsExpanded] = useState(true);

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div 
        className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <CalculatorIcon size={18} className="text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Automated Lien Waterfall</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-lg border border-indigo-200">
            <span className="text-[10px] font-bold text-indigo-400 uppercase">Recoverable</span>
            <span className="text-sm font-bold text-indigo-700">${waterfallData.finalSurplus.toLocaleString()}</span>
          </div>
          {isExpanded ? <ChevronUpIcon size={18} className="text-slate-400" /> : <ChevronDownIcon size={18} className="text-slate-400" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 space-y-8">
          {/* Header Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Surplus</p>
              <p className="text-lg font-bold text-slate-800">${initialSurplus.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-100">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Lien Reductions</p>
              <p className="text-lg font-bold text-red-600">-${(initialSurplus - waterfallData.finalSurplus).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">Owner Net Recovery</p>
              <p className="text-lg font-bold text-green-600">${waterfallData.finalSurplus.toLocaleString()}</p>
            </div>
          </div>

          {/* Waterfall Flow */}
          <div className="relative space-y-4 pt-4">
             {/* Initial Amount Bubble */}
             <div className="flex justify-center mb-8">
               <div className="px-6 py-2 bg-slate-900 text-white rounded-full text-xs font-bold shadow-lg ring-4 ring-slate-100">
                 Source: Surplus Sale Funds (${initialSurplus.toLocaleString()})
               </div>
             </div>

             {waterfallData.steps.map((step, idx) => (
               <div key={step.id} className="relative flex flex-col items-center">
                 {/* Connection Line */}
                 <div className="h-8 w-0.5 bg-slate-200"></div>
                 
                 <div className="w-full flex items-start gap-6 group">
                   {/* Priority Number */}
                   <div className="w-12 h-12 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center font-bold text-slate-400 shrink-0 group-hover:border-indigo-400 group-hover:text-indigo-600 transition-all">
                     {step.priority}
                   </div>

                   {/* Lien Card */}
                   <div className={`flex-1 p-5 rounded-2xl border transition-all ${
                     step.status === 'PAID' ? 'bg-white border-slate-200' : 
                     step.status === 'PARTIAL' ? 'bg-orange-50 border-orange-200' : 
                     'bg-slate-50 border-slate-100 opacity-60'
                   }`}>
                     <div className="flex items-start justify-between mb-4">
                       <div className="flex-1">
                         <div className="flex items-center gap-3 mb-1">
                            <input 
                              type="text" 
                              value={step.description}
                              onChange={(e) => updateLien(step.id, { description: e.target.value })}
                              className="bg-transparent border-none p-0 text-sm font-bold text-slate-800 focus:ring-0 w-full"
                            />
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase border ${
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
                           className="text-[10px] font-bold text-slate-400 bg-transparent border-none p-0 focus:ring-0 uppercase tracking-widest cursor-pointer hover:text-indigo-600"
                         >
                            {Object.values(LienType).map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
                         </select>
                       </div>
                       <div className="flex flex-col items-end">
                         <div className="flex items-center gap-2">
                           <span className="text-xs text-slate-400">$</span>
                           <input 
                              type="number"
                              value={step.amount}
                              onChange={(e) => updateLien(step.id, { amount: Number(e.target.value) })}
                              className="w-24 text-right bg-slate-100 border-none rounded-lg p-1 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
                           />
                           <button 
                             onClick={() => removeLien(step.id)}
                             className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                           >
                             <Trash2Icon size={14} />
                           </button>
                         </div>
                         <p className="text-[10px] font-bold text-indigo-500 mt-2">Deducted: ${step.satisfied_amount.toLocaleString()}</p>
                       </div>
                     </div>
                     
                     {/* Depletion Bar */}
                     <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div 
                         className={`h-full transition-all duration-700 ${step.status === 'PAID' ? 'bg-green-500' : 'bg-orange-400'}`}
                         style={{ width: `${(step.satisfied_amount / (step.amount || 1)) * 100}%` }}
                       ></div>
                     </div>
                   </div>
                 </div>
               </div>
             ))}

             {/* Final Residual Step */}
             <div className="flex flex-col items-center">
               <div className="h-12 w-0.5 bg-slate-200 border-dashed border-l-2"></div>
               <div className="w-full flex items-center gap-6">
                 <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                    <ShieldCheckIcon size={24} />
                 </div>
                 <div className="flex-1 p-6 bg-indigo-900 text-white rounded-2xl shadow-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-lg">Final Claimable Amount</h4>
                      <p className="text-indigo-300 text-xs">Total remaining after all senior liens satisfied.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black">${waterfallData.finalSurplus.toLocaleString()}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Net to Claimant</p>
                    </div>
                 </div>
               </div>
             </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <InfoIcon size={14} />
              Priority order follows standard judicial foreclosure hierarchy.
            </div>
            <button 
              onClick={addLien}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-all active:scale-[0.98]"
            >
              <PlusIcon size={16} />
              Add Discovery Lien
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LienWaterfall;
