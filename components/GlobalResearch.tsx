
import React, { useState } from 'react';
import SkipTracingHub from './SkipTracingHub';
import { GlobeIcon, MapPinIcon, UserIcon, SparklesIcon } from 'lucide-react';

const GlobalResearch: React.FC = () => {
  const [targetName, setTargetName] = useState('John Doe');
  const [targetAddress, setTargetAddress] = useState('123 Peach Ave, Atlanta, GA');
  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
               <GlobeIcon size={24} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Skip-Trace Hub</h2>
          </div>
          <p className="text-slate-500 font-medium">Global Grounding Search: Locate claimants and heirs across all US jurisdictions.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name of Target</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all">
            <UserIcon size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold ml-3 w-full"
            />
          </div>
        </div>
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Last Known Address</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all">
            <MapPinIcon size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold ml-3 w-full"
            />
          </div>
        </div>
        <div className="pt-6 w-full md:w-auto">
           <button 
             onClick={() => setIsSearching(true)}
             className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
           >
              <SparklesIcon size={18} className="text-amber-400" />
              Launch Search
           </button>
        </div>
      </div>

      <div className="pt-4">
        <SkipTracingHub ownerName={targetName} address={targetAddress} />
      </div>
    </div>
  );
};

export default GlobalResearch;
