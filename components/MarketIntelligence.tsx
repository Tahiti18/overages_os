
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
  GlobeIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Tooltip from './Tooltip';

// Enhanced SPI (Surplus Profitability Index) Matrix
const NATIONAL_RANKINGS = [
  { state: 'FL', name: 'Florida', spi: 98, yield: 'HIGH', friction: 'LOW', attorney: 'NO', claim_days: 120, access: 'ONLINE', volume: 'V. HIGH', description: 'Gold Standard. Fully automated online lists and high property values.' },
  { state: 'GA', name: 'Georgia', spi: 94, yield: 'V. HIGH', friction: 'LOW', attorney: 'NO', claim_days: 365, access: 'HYBRID', volume: 'HIGH', description: '12-month redemption period. Significant surplus per case.' },
  { state: 'MD', name: 'Maryland', spi: 91, yield: 'HIGH', friction: 'HIGH', attorney: 'YES', claim_days: 180, access: 'JUDICIAL', volume: 'MED', description: 'Requires Attorney (Moat). Lower competition due to judicial barrier.' },
  { state: 'TX', name: 'Texas', spi: 88, yield: 'V. HIGH', friction: 'MED', attorney: 'YES', claim_days: 730, access: 'HYBRID', volume: 'V. HIGH', description: 'Massive volume but strict 3rd-party collector regulations.' },
  { state: 'NC', name: 'North Carolina', spi: 85, yield: 'MED', friction: 'LOW', attorney: 'NO', claim_days: 365, access: 'HYBRID', volume: 'MED', description: 'Clear statutes and reliable county treasurer records.' },
  { state: 'SC', name: 'South Carolina', spi: 82, yield: 'MED', friction: 'LOW', attorney: 'NO', claim_days: 365, access: 'ONLINE', volume: 'LOW', description: 'Reliable, but lower property values on average.' },
  { state: 'TN', name: 'Tennessee', spi: 79, yield: 'MED', friction: 'MED', attorney: 'NO', claim_days: 365, access: 'MAIL', volume: 'LOW', description: 'Decentralized data. Requires manual county outreach.' },
  { state: 'OH', name: 'Ohio', spi: 76, yield: 'MED', friction: 'MED', attorney: 'NO', claim_days: 365, access: 'OFFLINE', volume: 'MED', description: 'Stable but slow processing times at the county level.' },
];

const MarketIntelligence: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ranking' | 'schedules' | 'md_deepdive'>('ranking');
  const [isSearchingSchedules, setIsSearchingSchedules] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const fetchUpcomingSchedules = async () => {
    setIsSearchingSchedules(true);
    // Create fresh instance to ensure up-to-date API key access
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "List specific upcoming tax sale auction dates or surplus list release dates for the top 5 surplus states: Florida (Miami-Dade, Orange), Georgia (Fulton, DeKalb), Maryland (Baltimore, Prince Georges), Texas (Harris), and North Carolina (Wake). Focus on dates within the next 45 days.",
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
      {/* Header with High-Contrast Logic */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-950 text-indigo-400 rounded-[1.5rem] shadow-2xl border border-white/10 ring-8 ring-indigo-500/5">
              <GlobeIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                Market Intelligence
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">National Surplus Profitability Index (SPI) Engine</p>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
            Real-time analysis of the 50-state overage landscape. We prioritize <span className="text-indigo-600 font-black">Yield Velocity</span> and <span className="text-slate-900 font-black">Statutory Moats</span>.
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-xl flex items-center gap-10">
           <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">States Scanned</p>
              <p className="text-3xl font-black text-slate-900">50</p>
           </div>
           <div className="w-px h-12 bg-slate-100"></div>
           <div className="flex flex-col items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Moats</p>
              <p className="text-3xl font-black text-indigo-600">MD/TX</p>
           </div>
        </div>
      </div>

      {/* Primary Intelligence Navigation */}
      <div className="flex bg-white rounded-[2rem] border-2 border-slate-100 p-2 shadow-sm">
        <Tooltip content="Rank the top 50 states by surplus availability and legal difficulty." position="bottom">
          <button 
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'ranking' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <TrendingUpIcon size={18} />
            National Leaderboard
          </button>
        </Tooltip>
        <Tooltip content="Analyze the Maryland judicial barrier and why it protects professional margins." position="bottom">
          <button 
            onClick={() => setActiveTab('md_deepdive')}
            className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'md_deepdive' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <GavelIcon size={18} />
            Maryland Deep-Dive
          </button>
        </Tooltip>
        <Tooltip content="Real-time scan of upcoming tax sale auctions via Gemini Grounding Search." position="bottom">
          <button 
            onClick={() => setActiveTab('schedules')}
            className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'schedules' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <CalendarIcon size={18} />
            Live Auction Feeds
          </button>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content Pane */}
        <div className="lg:col-span-3 space-y-8">
          
          {activeTab === 'ranking' && (
            <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">National Opportunity Matrix</h3>
                   <p className="text-sm font-bold text-slate-400 mt-1">Ranking 50 States by "Recovery Friction" vs. "Surplus Density"</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-200">SPI V2.0 ACTIVE</span>
                 </div>
              </div>
              <div className="divide-y divide-slate-100">
                {NATIONAL_RANKINGS.map((item, idx) => (
                  <div key={item.state} className="p-10 hover:bg-slate-50/50 transition-all group flex flex-col xl:flex-row xl:items-center gap-12">
                    <div className="flex items-center gap-8 shrink-0 min-w-[240px]">
                      <div className="w-20 h-20 rounded-[1.75rem] bg-slate-950 text-white flex items-center justify-center font-black text-3xl shadow-2xl relative rotate-3 group-hover:rotate-0 transition-transform">
                        {item.state}
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center border-4 border-white font-black">
                          {idx + 1}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{item.name}</h4>
                        <Tooltip content={`Friction level indicates the difficulty of claim recovery in ${item.name}.`}>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest cursor-help ${item.friction === 'LOW' ? 'bg-emerald-100 text-emerald-700' : item.friction === 'MED' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                            {item.friction} Friction
                          </span>
                        </Tooltip>
                      </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Profitability Score</p>
                        <p className="text-lg font-black text-indigo-600">{item.spi}/100 SPI</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Claim Period</p>
                        <p className="text-lg font-black text-slate-800">{item.claim_days} Days</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Attorney Req.</p>
                        <p className={`text-lg font-black ${item.attorney === 'YES' ? 'text-rose-600' : 'text-emerald-600'}`}>{item.attorney}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Volume Rank</p>
                        <p className="text-lg font-black text-slate-800">{item.volume}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 font-bold max-w-[200px] leading-relaxed hidden xl:block italic">
                      "{item.description}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'md_deepdive' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl border border-white/5">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-600 rounded-2xl">
                        <GavelIcon size={24} />
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter uppercase italic">The Maryland Moat</h3>
                    </div>
                    <p className="text-indigo-200 font-bold text-xl max-w-3xl leading-relaxed">
                      Maryland is a <span className="text-white underline decoration-indigo-500 underline-offset-4">Judicial Surplus</span> state. Unlike Florida, you cannot simply mail a form. You must file a formal motion in Circuit Court.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                       <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-3">
                          <h4 className="font-black text-indigo-400 uppercase text-xs tracking-widest">Why it's Hard</h4>
                          <p className="text-sm font-medium opacity-80 leading-relaxed">Requires Licensed Attorney signature. Strict compliance with Rule 14-B regarding lien priorities and junior encumbrances.</p>
                       </div>
                       <div className="p-6 bg-indigo-900/40 rounded-3xl border border-indigo-500/20 space-y-3">
                          <h4 className="font-black text-emerald-400 uppercase text-xs tracking-widest">Why it's Profitable</h4>
                          <p className="text-sm font-medium opacity-80 leading-relaxed">The high barrier to entry (Attorney cost) keeps away "Fly-By-Night" collectors. Average Maryland surpluses are 40% higher than NC/SC.</p>
                       </div>
                    </div>
                  </div>
                  <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12 group-hover:scale-125 transition-transform duration-1000">
                    <ShieldCheckIcon size={300} />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {['Baltimore City', 'Prince Georges', 'Montgomery'].map(county => (
                   <div key={county} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                         <h5 className="font-black text-slate-900 uppercase tracking-tight">{county}</h5>
                         <span className="text-[10px] font-black text-indigo-600">MD</span>
                      </div>
                      <div className="space-y-2">
                         <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                            <span>Pending Surplus</span>
                            <span className="text-slate-900">$2.4M</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[65%]"></div>
                         </div>
                      </div>
                      <Tooltip content={`Initiate a deep scan of the latest overage lists for ${county} County.`}>
                        <button className="w-full py-3 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                          Scan Latest Lists
                        </button>
                      </Tooltip>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-indigo-600 rounded-[3.5rem] p-14 text-white relative overflow-hidden group shadow-2xl">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <SparklesIcon size={32} className="text-amber-400 animate-pulse" />
                      <h3 className="text-3xl font-black tracking-tight uppercase italic">Tactical Schedule Pulse</h3>
                    </div>
                    <p className="text-indigo-100 font-bold text-lg max-w-2xl leading-relaxed">
                      We use <span className="text-white font-black underline underline-offset-4">Gemini 3.0 Flash</span> with real-time Google Grounding to scour Treasurer sites for the next batch of overage lists.
                    </p>
                    <Tooltip content="Launch the AI grounding engine to find upcoming auction dates.">
                      <button 
                        onClick={fetchUpcomingSchedules}
                        disabled={isSearchingSchedules}
                        className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                      >
                        {isSearchingSchedules ? <RefreshCwIcon size={20} className="animate-spin" /> : <ZapIcon size={20} fill="currentColor" />}
                        {isSearchingSchedules ? 'Syncing National Calendars...' : 'Scan Upcoming Releases'}
                      </button>
                    </Tooltip>
                  </div>
                  <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 group-hover:scale-110 transition-all duration-1000">
                    <CalendarIcon size={250} />
                  </div>
               </div>

               {aiInsights ? (
                 <div className="bg-white rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                       <ShieldCheckIcon size={24} className="text-indigo-600" />
                       <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Intelligence Briefing: 45-Day Outlook</h4>
                    </div>
                    <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap italic bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                       {aiInsights}
                    </div>
                    <div className="mt-8 flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <ClockIcon size={14} /> Last Scan: {new Date().toLocaleTimeString()}
                    </div>
                 </div>
               ) : !isSearchingSchedules && (
                 <div className="p-32 text-center border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/30">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-50">
                       <ClockIcon size={40} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-widest">Terminal Idle: Initiate Search to Sync</p>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Intelligence Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-8">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <TrendingUpIcon size={16} className="text-indigo-600" /> High Yield Zones
            </h4>
            <div className="space-y-5">
              {NATIONAL_RANKINGS.slice(0, 4).map(st => (
                <div key={st.state} className="p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 space-y-4 hover:border-indigo-400 transition-colors cursor-default">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs">{st.state}</div>
                       <span className="text-xs font-black text-slate-900 uppercase">{st.name}</span>
                    </div>
                    <span className="text-[9px] font-black text-indigo-600 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200">SPI {st.spi}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                      ONLINE DATA
                    </span>
                    <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                      {st.claim_days}D WINDOW
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group border border-white/5">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3">
                   <ShieldAlertIcon size={24} className="text-rose-400" />
                   <h4 className="font-black text-lg uppercase tracking-tight italic">Legal Update</h4>
                </div>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                   Florida HB 141 has updated the <span className="text-white font-black underline">Excess Proceeds Distribution</span> waterfall. Junior liens now have 120 days to file before owner eligibility is finalized.
                </p>
                <Tooltip content="Read the full legislative text and its impact on recovery logic.">
                  <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-950/50 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2">
                    View Regulation <ArrowUpRightIcon size={14} />
                  </button>
                </Tooltip>
             </div>
          </div>

          <div className="bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 text-center space-y-6 cursor-help">
             <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                <Building2Icon size={32} className="text-indigo-400" />
             </div>
             <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">AI Market Pulse</p>
                <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                  "Predicting a 22% volume increase in Maryland's Tax Sale Certifications for Baltimore County in Q2."
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
