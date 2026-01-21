
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
  SparklesIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Profitability Matrix (SPI: Surplus Profitability Index)
const STATE_RANKINGS = [
  { state: 'FL', name: 'Florida', spi: 98, yield: 'HIGH', ease: 'EXCELLENT', attorney_req: 'NO', claim_days: 120, trend: '+14%', hot_counties: ['Miami-Dade', 'Hillsborough', 'Palm Beach'] },
  { state: 'GA', name: 'Georgia', spi: 94, yield: 'VERY HIGH', ease: 'GOOD', attorney_req: 'NO', claim_days: 365, trend: '+8%', hot_counties: ['Fulton', 'Gwinnett', 'DeKalb'] },
  { state: 'MD', name: 'Maryland', spi: 89, yield: 'HIGH', ease: 'MODERATE', attorney_req: 'YES', claim_days: 180, trend: '+22%', hot_counties: ['Baltimore City', 'Prince Georges'] },
  { state: 'TX', name: 'Texas', spi: 87, yield: 'VERY HIGH', ease: 'STRICT', attorney_req: 'YES', claim_days: 730, trend: '+5%', hot_counties: ['Harris', 'Dallas', 'Bexar'] },
  { state: 'NC', name: 'North Carolina', spi: 82, yield: 'MODERATE', ease: 'GOOD', attorney_req: 'NO', claim_days: 365, trend: '+12%', hot_counties: ['Wake', 'Mecklenburg'] },
  { state: 'OH', name: 'Ohio', spi: 76, yield: 'MODERATE', ease: 'MODERATE', attorney_req: 'NO', claim_days: 365, trend: '-2%', hot_counties: ['Cuyahoga', 'Franklin'] },
];

const MarketIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'heatmap' | 'ranking' | 'schedules'>('ranking');
  const [isSearchingSchedules, setIsSearchingSchedules] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const fetchUpcomingSchedules = async () => {
    setIsSearchingSchedules(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Find and summarize upcoming property tax surplus list releases or auction dates for Florida (Miami-Dade), Georgia (Fulton), and Maryland (Baltimore) for the next 60 days.",
        config: {
          tools: [{ googleSearch: {} }],
        }
      });
      setAiInsights(response.text);
    } catch (e) {
      console.error(e);
      setAiInsights("Intelligence Engine Timeout. Please retry research pulse.");
    } finally {
      setIsSearchingSchedules(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-950 text-indigo-400 rounded-2xl shadow-xl border border-indigo-500/30">
              <BarChart3Icon size={24} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Market Intelligence</h2>
          </div>
          <p className="text-slate-500 font-bold max-w-2xl leading-relaxed text-lg">
            Real-time <span className="text-indigo-600">Surplus Profitability Index (SPI)</span>. We analyze jurisdictional ease, average yields, and statutory friction to rank the best markets in the US.
          </p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-xl flex items-center gap-8">
           <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">States Tracked</p>
              <p className="text-2xl font-black text-slate-900">48</p>
           </div>
           <div className="w-px h-10 bg-slate-100"></div>
           <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Pipeline</p>
              <p className="text-2xl font-black text-indigo-600">$12.4M</p>
           </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-[2rem] border-2 border-slate-100 p-2 shadow-sm">
        <button 
          onClick={() => setActiveTab('ranking')}
          className={`flex-1 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'ranking' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <TrendingUpIcon size={18} />
          Profitability Ranking
        </button>
        <button 
          onClick={() => setActiveTab('schedules')}
          className={`flex-1 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'schedules' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <CalendarIcon size={18} />
          AI Tactical Schedules
        </button>
        <button 
          onClick={() => setActiveTab('heatmap')}
          className={`flex-1 py-4 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'heatmap' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <MapIcon size={18} />
          Market Heatmap
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Intelligence View */}
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'ranking' && (
            <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">State Opportunity Matrix</h3>
                   <p className="text-sm font-bold text-slate-400 mt-1">Refined every 24h by AI Core V3.5 Logic</p>
                 </div>
                 <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl">
                   <FilterIcon size={14} /> Adjust Weights
                 </button>
              </div>
              <div className="divide-y divide-slate-100">
                {STATE_RANKINGS.map((item, idx) => (
                  <div key={item.state} className="p-10 hover:bg-slate-50/50 transition-all group flex flex-col md:flex-row md:items-center gap-10">
                    <div className="flex items-center gap-6 shrink-0">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-2xl relative">
                        {item.state}
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white">
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.trend} Growth</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center md:text-left">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Surplus Rank</p>
                        <p className={`text-sm font-black ${item.spi > 90 ? 'text-indigo-600' : 'text-slate-700'}`}>{item.spi}/100 SPI</p>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Legal Ease</p>
                        <p className="text-sm font-black text-slate-700">{item.ease}</p>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Claim Window</p>
                        <p className="text-sm font-black text-slate-700">{item.claim_days} Days</p>
                      </div>
                      <div className="text-center md:text-left">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Yield Level</p>
                        <span className={`text-[9px] font-black px-2 py-1 rounded-md ${item.yield === 'VERY HIGH' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                          {item.yield}
                        </span>
                      </div>
                    </div>

                    <button className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-xl transition-all">
                      <ArrowUpRightIcon size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <SparklesIcon size={28} className="text-amber-400" />
                      <h3 className="text-3xl font-black tracking-tight">Tactical Schedule Scraper</h3>
                    </div>
                    <p className="text-slate-400 font-bold text-lg max-w-2xl leading-relaxed">
                      Using <span className="text-indigo-400">Gemini 3.0 Flash Grounding</span>, we scour official Treasurer calendars to find exact dates for list releases.
                    </p>
                    <button 
                      onClick={fetchUpcomingSchedules}
                      disabled={isSearchingSchedules}
                      className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/40 hover:bg-indigo-500 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {isSearchingSchedules ? <RefreshCwIcon size={20} className="animate-spin" /> : <ZapIcon size={20} fill="white" />}
                      {isSearchingSchedules ? 'Syncing Global Calendars...' : 'Scan Upcoming Releases'}
                    </button>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12 group-hover:rotate-45 transition-all duration-1000">
                    <CalendarIcon size={200} />
                  </div>
               </div>

               {aiInsights ? (
                 <div className="bg-white rounded-[3rem] p-12 border-2 border-slate-100 shadow-sm prose prose-slate max-w-none">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                       <ShieldCheckIcon size={24} className="text-indigo-600" />
                       <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Intelligence Briefing: Next 60 Days</h4>
                    </div>
                    <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap italic">
                       {aiInsights}
                    </div>
                 </div>
               ) : !isSearchingSchedules && (
                 <div className="p-20 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/30">
                    <ClockIcon size={48} className="text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-black uppercase tracking-widest">Awaiting Tactical Scan</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'heatmap' && (
            <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-12 shadow-sm text-center py-40">
               <MapIcon size={64} className="text-slate-100 mx-auto mb-6" />
               <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Interactive Visual Heatmap</h3>
               <p className="text-slate-400 font-bold max-w-md mx-auto mt-4 leading-relaxed">
                 Integrating High-Contrast Leaflet Layer... Highlighting Green states (MD, GA, FL) as priority deployment zones.
               </p>
            </div>
          )}
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-8">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <ZapIcon size={16} className="text-amber-500" /> Hot County Alerts
            </h4>
            <div className="space-y-4">
              {STATE_RANKINGS.slice(0, 3).map(st => (
                <div key={st.state} className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">{st.name}</span>
                    <span className="text-[9px] font-black text-indigo-600 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">SPI {st.spi}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {st.hot_counties.map(c => (
                      <span key={c} className="text-[9px] font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-100">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <AlertCircleIcon size={24} className="text-indigo-200" />
                   <h4 className="font-black text-lg uppercase tracking-tight italic">Compliance Warning</h4>
                </div>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
                   Maryland (MD) and Texas (TX) have updated their <span className="text-white font-black underline">Attorney-Req Filing Status</span>. 
                   Ensure your Smart Packager logic is set to "Legal Counsel Signature" mode before submission.
                </p>
                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-950/50 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                   View Compliance Bulletin <ArrowUpRightIcon size={14} />
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                <ShieldCheckIcon size={140} />
             </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 text-center space-y-4">
             <Building2Icon size={32} className="text-slate-300 mx-auto" />
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">AI Market Pulse</p>
             <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
               "Forecasting a 15% surge in Georgia surplus volume for Fulton County following the Q1 Tax Sale cycle."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
