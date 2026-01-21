
import React, { useState } from 'react';
import AttorneyHub from './AttorneyHub';
import { GavelIcon, MapPinIcon, ShieldCheckIcon } from 'lucide-react';

const GlobalCounsel: React.FC = () => {
  const [selectedState, setSelectedState] = useState('MD');
  const [selectedCounty, setSelectedCounty] = useState('Baltimore City');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
               <GavelIcon size={24} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Counsel Hub</h2>
          </div>
          <p className="text-slate-500 font-medium">Attorney Network: Research and engage specialized surplus legal partners.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Jurisdiction (State)</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
            <MapPinIcon size={18} className="text-slate-400" />
            <select 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm font-bold ml-3 w-full"
            >
              <option value="MD">Maryland (MD)</option>
              <option value="GA">Georgia (GA)</option>
              <option value="FL">Florida (FL)</option>
              <option value="TX">Texas (TX)</option>
            </select>
          </div>
        </div>
        <div className="flex-1 w-full space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">County / Circuit</label>
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
            <ShieldCheckIcon size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              placeholder="e.g. Baltimore City"
              className="bg-transparent border-none focus:ring-0 text-sm font-bold ml-3 w-full"
            />
          </div>
        </div>
      </div>

      <AttorneyHub state={selectedState} county={selectedCounty} />
    </div>
  );
};

export default GlobalCounsel;
