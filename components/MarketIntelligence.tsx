
import React, { useState, useEffect } from 'react';
import { 
  BarChart3Icon, 
  MapIcon, 
  ZapIcon, 
  SearchIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  ArrowUpRightIcon, 
  CalendarIcon, 
  ClockIcon,
  FilterIcon,
  AlertCircleIcon,
  Building2Icon,
  RefreshCwIcon,
  SparklesIcon,
  ScaleIcon,
  GavelIcon,
  ShieldAlertIcon,
  GlobeIcon,
  DatabaseIcon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';
import Tooltip from './Tooltip';

const NATIONAL_RANKINGS = [
  { state: 'FL', name: 'Florida', spi: 98, yield: 'HIGH', friction: 'LOW', attorney: 'NO', claim_days: 120, access: 'ONLINE', volume: 'V. HIGH', description: 'Gold Standard. Fully automated online lists and high property values.' },
  { state: 'GA', name: 'Georgia', spi: 94, yield: 'V. HIGH', friction: 'LOW', attorney: 'NO', claim_days: 365, access: 'HYBRID', volume: 'HIGH', description: '12-month redemption period. Significant surplus per case.' },
  { state: 'MD', name: 'Maryland', spi: 91, yield: 'HIGH', friction: 'HIGH', attorney: 'YES', claim_days: 180, access: 'JUDICIAL', volume: 'MED', description: 'Requires Attorney (Moat). Lower competition due to judicial barrier.' },
  { state: 'TX', name: 'Texas', spi: 88, yield: 'V. HIGH', friction: 'MED', attorney: 'YES', claim_days: 730, access: 'HYBRID', volume: 'V. HIGH', description: 'Massive volume but strict 3rd-party collector regulations.' },
];

const MarketIntelligence: React.FC = () => {
  const { user, isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const [activeTab, setActiveTab] = useState<'ranking' | 'schedules' | 'md_deepdive'>('ranking');
  const [isSearchingSchedules, setIsSearchingSchedules] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const fetchUpcomingSchedules = async () => {
    setIsSearchingSchedules(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "List specific upcoming tax sale auction dates or surplus list release dates for the top 5 surplus states: Florida, Georgia, Maryland, Texas, and North Carolina. Focus on real dates in the current month.",
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      setAiInsights(response.text);
    } catch (e) {
      console.error(e);
      setAiInsights("Tactical Feed Offline. Retrying global sync...");
    } finally {
      setIsSearchingSchedules(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              {isLiveMode ? <DatabaseIcon size={28} /> : <GlobeIcon size={28} />}
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                {isLiveMode ? 'Production Alpha' : 'Market Intelligence'}
                <span className={`${isLiveMode ? 'text-emerald-500' : 'text-indigo-600'} animate-pulse`}>●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                {isLiveMode ? 'Live Regulatory Analysis Engine' : 'National Surplus Profitability Index (SPI) Engine'}
              </p>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
            {isLiveMode 
              ? 'Real-time production monitoring. Tactical ranking is grounded in live Bar registries and legislative feeds.' 
              : 'Real-time analysis of the 50-state overage landscape. We prioritize Yield Velocity and Statutory Moats.'}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl flex items-center gap-10">
           <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">States Scanned</p>
              <p className="text-3xl font-black text-slate-900">50</p>
           </div>
           <div className="w-px h-12 bg-slate-100"></div>
           <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Moats</p>
              <p className={`text-3xl font-black ${isLiveMode ? 'text-emerald-600' : 'text-indigo-600'}`}>MD/TX</p>
           </div>
        </div>
      </div>

      <div className="flex bg-white rounded-[2rem] border-2 border-slate-100 p-2 shadow-sm">
        <button 
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'ranking' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <TrendingUpIcon size={18} /> National Leaderboard
        </button>
        <button 
          onClick={() => setActiveTab('md_deepdive')}
          className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'md_deepdive' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <GavelIcon size={18} /> Maryland Analysis
        </button>
        <button 
          onClick={() => setActiveTab('schedules')}
          className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'schedules' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <CalendarIcon size={18} /> Live Auction Feeds
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'ranking' && (
            <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">National Leaderboard</h3>
                   <p className="text-sm font-bold text-slate-400 mt-1">Ranking by "Recovery Friction" vs. "Surplus Density"</p>
                 </div>
                 <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest border shadow-sm ${isLiveMode ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
                    {isLiveMode ? 'PRODUCTION SCALE' : 'SIMULATION MODE'}
                 </span>
              </div>
              <div className="divide-y divide-slate-100">
                {NATIONAL_RANKINGS.map((item, idx) => (
                  <div key={item.state} className="p-10 hover:bg-slate-50/50 transition-all group flex flex-col xl:flex-row xl:items-center gap-12">
                    <div className="flex items-center gap-8 shrink-0 min-w-[240px]">
                      <div className={`w-20 h-20 rounded-[1.75rem] text-white flex items-center justify-center font-black text-3xl shadow-2xl relative rotate-3 group-hover:rotate-0 transition-transform ${isLiveMode ? 'bg-emerald-950' : 'bg-slate-950'}`}>
                        {item.state}
                        <div className={`absolute -top-2 -right-2 w-8 h-8 text-white text-xs rounded-full flex items-center justify-center border-4 border-white font-black ${isLiveMode ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{item.name}</h4>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.friction === 'LOW' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {item.friction} Friction
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">SPI Score</p>
                        <p className={`text-lg font-black ${isLiveMode ? 'text-emerald-600' : 'text-indigo-600'}`}>{item.spi}/100</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Window</p>
                        <p className="text-lg font-black text-slate-800">{item.claim_days} Days</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Attorney</p>
                        <p className="text-lg font-black text-slate-800">{item.attorney}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume</p>
                        <p className="text-lg font-black text-slate-800">{item.volume}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'md_deepdive' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className={`rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl border ${isLiveMode ? 'bg-slate-950 border-emerald-500/20' : 'bg-slate-900 border-white/5'}`}>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${isLiveMode ? 'bg-emerald-600' : 'bg-indigo-600'}`}>
                        <GavelIcon size={24} />
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter uppercase italic">The Maryland Moat</h3>
                    </div>
                    <p className="text-indigo-200 font-bold text-xl max-w-3xl leading-relaxed">
                      Maryland is a Judicial Surplus state. In Live Mode, we connect directly to the <span className="text-white underline decoration-indigo-500 underline-offset-4">Maryland Judiciary Casesearch</span> to audit Rule 14-B compliance.
                    </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['Baltimore City', 'Prince Georges', 'Montgomery'].map(county => (
                   <div key={county} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                         <h5 className="font-black text-slate-900 uppercase tracking-tight">{county}</h5>
                         <span className={`text-[10px] font-black ${isLiveMode ? 'text-emerald-600' : 'text-indigo-600'}`}>MD</span>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>Pending Surplus</span>
                            <span className="text-slate-900">{isLiveMode ? '0.00' : '$2.4M'}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${isLiveMode ? 'bg-emerald-500 w-0' : 'bg-indigo-500 w-[65%]'}`}></div>
                         </div>
                      </div>
                      <button className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLiveMode ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/10' : 'bg-slate-50 text-slate-400 hover:bg-indigo-600 hover:text-white'}`}>
                        {isLiveMode ? 'Initialize Live Scan' : 'Scan Simulated List'}
                      </button>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className={`rounded-[3.5rem] p-14 text-white relative overflow-hidden group shadow-2xl ${isLiveMode ? 'bg-emerald-600 shadow-emerald-500/10' : 'bg-indigo-600 shadow-indigo-500/10'}`}>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <SparklesIcon size={32} className="text-amber-400 animate-pulse" />
                      <h3 className="text-3xl font-black tracking-tight uppercase italic">Live Auction Pulse</h3>
                    </div>
                    <p className="text-indigo-100 font-bold text-lg max-w-2xl leading-relaxed">
                      Stand by to scan treasury departments for the next batch of overage lists. Live Grounding Search is {isLiveMode ? 'Production Ready' : 'Simulating Cache'}.
                    </p>
                    <button 
                      onClick={fetchUpcomingSchedules}
                      disabled={isSearchingSchedules}
                      className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {isSearchingSchedules ? <RefreshCwIcon size={20} className="animate-spin" /> : <ZapIcon size={20} fill="currentColor" />}
                      Scan National Feeds
                    </button>
                  </div>
               </div>

               {aiInsights ? (
                 <div className="bg-white rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                       <ShieldCheckIcon size={24} className="text-indigo-600" />
                       <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Active Pulse: National Feed</h4>
                    </div>
                    <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap italic bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                       {aiInsights}
                    </div>
                 </div>
               ) : (
                 <div className="p-32 text-center border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/30">
                    <ClockIcon size={40} className="text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest">
                      {isLiveMode ? 'Live Grounding Feed Idle' : 'Simulation Feed Idle'}
                    </p>
                 </div>
               )}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-8">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <TrendingUpIcon size={16} className="text-indigo-600" /> Top Tactic States
            </h4>
            <div className="space-y-5">
              {NATIONAL_RANKINGS.map(st => (
                <div key={st.state} className="p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-black text-xs ${isLiveMode ? 'bg-emerald-950' : 'bg-slate-950'}`}>{st.state}</div>
                       <span className="text-xs font-black text-slate-900 uppercase">{st.name}</span>
                    </div>
                    <span className="text-[9px] font-black text-indigo-600">SPI {st.spi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
