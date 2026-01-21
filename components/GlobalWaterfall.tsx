
import React, { useState } from 'react';
import LienWaterfall from './LienWaterfall';
import { CalculatorIcon, DollarSignIcon, ZapIcon } from 'lucide-react';

const GlobalWaterfall: React.FC = () => {
  const [surplusAmount, setSurplusAmount] = useState(130000);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
               <CalculatorIcon size={24} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Waterfall Engine</h2>
          </div>
          <p className="text-slate-500 font-medium">Financial Modeling Sandbox: Simulate lien priority and recovery yields.</p>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl text-center space-y-6">
        <div className="max-w-md mx-auto space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Input Gross Surplus Amount</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-300">$</span>
            <input 
              type="number" 
              value={surplusAmount}
              onChange={(e) => setSurplusAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-8 pl-12 pr-6 text-5xl font-black text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all text-center outline-none"
            />
          </div>
          <div className="flex justify-center gap-2">
            {[50000, 100000, 250000, 500000].map(val => (
              <button 
                key={val}
                onClick={() => setSurplusAmount(val)}
                className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-[10px] font-black uppercase transition-all"
              >
                ${val.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-emerald-900 rounded-[2.5rem] p-1 overflow-hidden">
        <LienWaterfall initialSurplus={surplusAmount} />
      </div>
    </div>
  );
};

export default GlobalWaterfall;
