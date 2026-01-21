
import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import LienWaterfall from './LienWaterfall';
import { 
  CalculatorIcon, 
  DollarSignIcon, 
  ZapIcon, 
  DatabaseIcon, 
  UnplugIcon,
  PlusCircleIcon,
  ActivityIcon,
  SparklesIcon
} from 'lucide-react';
import Tooltip from './Tooltip';

const GlobalWaterfall: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();
  // Default to 130k in Simulation, but 0 in Live Mode
  const [surplusAmount, setSurplusAmount] = useState(isLiveMode ? 0 : 130000);

  // Sync state if mode toggles
  useEffect(() => {
    setSurplusAmount(isLiveMode ? 0 : 130000);
  }, [isLiveMode]);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
             <div className={`p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-indigo-400/20 ring-indigo-500/5'}`}>
               <CalculatorIcon size={28} />
             </div>
             <div>
               <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                 Waterfall Engine
                 <span className="text-indigo-600 animate-pulse">●</span>
               </h2>
               <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">
                 {isLiveMode ? 'Production Modeling Environment' : 'Financial Logic Sandbox'}
               </p>
             </div>
          </div>
          <p className="text-slate-700 font-bold max-w-2xl leading-relaxed text-lg">
            {isLiveMode 
              ? 'Real-time financial prioritization. Input live gross proceeds to calculate recovery yields based on statutory seniority.' 
              : 'Simulate lien priority and recovery yields using baseline GA/FL jurisdictional rules.'}
          </p>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl text-center space-y-10 ring-1 ring-slate-100/50 hover:-translate-y-1 transition-all">
        <div className="max-w-xl mx-auto space-y-6">
          <label className="text-[11px] font-black text-indigo-900 uppercase tracking-[0.2em] block">Input Gross Surplus Amount</label>
          <div className="relative group">
            <span className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-300 group-focus-within:text-indigo-600 transition-colors">$</span>
            <input 
              type="number" 
              value={surplusAmount === 0 ? '' : surplusAmount}
              onChange={(e) => setSurplusAmount(Number(e.target.value))}
              placeholder="0.00"
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-[2.5rem] py-10 pl-16 pr-8 text-6xl font-black text-slate-900 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-center outline-none shadow-inner"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {[50000, 100000, 250000, 500000].map(val => (
              <Tooltip key={val} content={`Model a $${val.toLocaleString()} surplus scenario.`}>
                <button 
                  onClick={() => setSurplusAmount(val)}
                  className="px-6 py-3 bg-white border-2 border-slate-200 hover:border-indigo-400 hover:text-indigo-600 rounded-2xl text-[11px] font-black uppercase transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95"
                >
                  ${val.toLocaleString()}
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {isLiveMode && surplusAmount === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center p-24 text-center group transition-all hover:bg-slate-50/50 hover:border-emerald-200 shadow-inner">
          <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mb-10 border-2 border-slate-50 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
            <UnplugIcon size={56} className="text-slate-200 group-hover:text-emerald-500 transition-colors" />
          </div>
          <h5 className="font-black text-slate-800 uppercase text-xl tracking-[0.2em] mb-4 italic">Production Cache Empty</h5>
          <p className="text-slate-700 font-bold max-w-[400px] mx-auto leading-relaxed text-lg mb-10">
            Your live environment is synchronized. Enter a surplus amount above or ingest a lead from the <span className="text-indigo-600 font-black">County Scanner</span> to activate the waterfall logic.
          </p>
          <div className="flex gap-4">
             <button onClick={() => setSurplusAmount(130000)} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95 hover:-translate-y-1">
                <PlusCircleIcon size={18} /> Manual Intake
             </button>
             <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-95 hover:-translate-y-1">
                <ActivityIcon size={18} /> Ingest From Scanner
             </button>
          </div>
        </div>
      ) : (
        <div className="bg-indigo-950 rounded-[4rem] p-2 shadow-[0_40px_80px_-20px_rgba(30,27,75,0.6)] overflow-hidden animate-in zoom-in-95 duration-500 ring-2 ring-indigo-800">
          <LienWaterfall initialSurplus={surplusAmount} />
        </div>
      )}

      {/* Predictive Logic Banner */}
      {surplusAmount > 0 && (
        <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-200 shadow-2xl ring-1 ring-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 hover:-translate-y-1.5 transition-all">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner border border-indigo-100">
                 <SparklesIcon size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">AI Prediction Layer</h4>
                 <p className="text-sm text-slate-700 font-black uppercase tracking-widest mt-1">Status: Calculation Complete</p>
              </div>
           </div>
           <p className="text-slate-800 font-black text-sm max-w-sm text-center md:text-right leading-relaxed italic opacity-80">
             "Based on GA statutory rules, a senior debt ratio over 30% triggers an automatic audit for document validity."
           </p>
        </div>
      )}
    </div>
  );
};

export default GlobalWaterfall;
