
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
  DatabaseIcon,
  LockIcon,
  FileTextIcon,
  LayoutGridIcon,
  InfoIcon,
  DownloadIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  LayersIcon,
  ShieldIcon,
  FileSearchIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { User, WatchedJurisdiction } from '../types';
import Tooltip from './Tooltip';

const NATIONAL_RANKINGS = [
  { state: 'FL', name: 'Florida', spi: 98, level: 'OPEN_PLAINS', friction: 'LOW', attorney: 'NO', access: 'OPEN_PDF', description: 'Lowest barrier. Weekly PDF drops of surplus records.' },
  { state: 'GA', name: 'Georgia', spi: 94, level: 'TIDAL_FLATS', friction: 'MED', attorney: 'NO', access: 'HYBRID_WEB', description: 'Portal navigation required. High yield per case.' },
  { state: 'TX', name: 'Texas', spi: 88, level: 'TIDAL_FLATS', friction: 'MED', attorney: 'YES', access: 'HYBRID_WEB', description: 'Requires portal search. Massive volume.' },
  { state: 'MD', name: 'Maryland', spi: 91, level: 'FORTIFIED_MOAT', friction: 'HIGH', attorney: 'YES', access: 'MOAT_GATED', description: 'Data hidden. Requires formal ORR/FOIA filings.' },
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'triage' | 'schedules' | 'bridge'>('triage');
  const [isSearchingSchedules, setIsSearchingSchedules] = useState(false);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const fetchUpcomingSchedules = async () => {
    setIsSearchingSchedules(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "List specific upcoming tax sale auction dates or surplus list release dates for FL, GA, MD, and TX.",
        config: { tools: [{ googleSearch: {} }] }
      });
      setAiInsights(response.text);
    } catch (e) {
      setAiInsights("Tactical Feed Offline. Retrying global sync...");
    } finally {
      setIsSearchingSchedules(false);
    }
  };

  const getBarrierColor = (level: string) => {
    switch (level) {
      case 'OPEN_PLAINS': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'TIDAL_FLATS': return 'text-indigo-500 bg-indigo-50 border-indigo-100';
      case 'FORTIFIED_MOAT': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24">
      {/* Tactical Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <MapIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                Strategic Triage
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                {isLiveMode ? 'Live Asset Visibility' : 'Jurisdictional Barrier Analysis'}
              </p>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
            Where should you hunt? We categorize jurisdictions by **Entry Friction** so you can match your workflow to the terrain.
          </p>
        </div>
      </div>

      {/* Primary Tabs */}
      <div className="flex bg-white rounded-[2rem] border-2 border-slate-100 p-2 shadow-sm">
        <button 
          onClick={() => setActiveTab('triage')}
          className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'triage' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <FilterIcon size={18} /> Tactical Triage
        </button>
        <button 
          onClick={() => setActiveTab('bridge')}
          className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'bridge' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <LayersIcon size={18} /> Ingestion Bridge
        </button>
        <button 
          onClick={() => setActiveTab('schedules')}
          className={`flex-1 py-5 px-6 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'schedules' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <CalendarIcon size={18} /> Global Sync
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          {activeTab === 'triage' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-500">
               {/* Barrier Definitions */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border-2 border-emerald-100 space-y-4">
                     <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <DownloadIcon size={24} />
                     </div>
                     <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight">Open Plains</h4>
                     <p className="text-xs text-emerald-800 font-bold leading-relaxed opacity-70">
                       Low-barrier jurisdictions with downloadable PDF/Excel lists. High competition, requires maximum speed to market.
                     </p>
                  </div>
                  <div className="bg-indigo-50/50 p-8 rounded-[2.5rem] border-2 border-indigo-100 space-y-4">
                     <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                        <SearchIcon size={24} />
                     </div>
                     <h4 className="text-sm font-black text-indigo-900 uppercase tracking-tight">Tidal Flats</h4>
                     <p className="text-xs text-indigo-800 font-bold leading-relaxed opacity-70">
                       Medium-barrier. Data is public but buried in searchable web portals. Requires persistent monitoring and manual clicks.
                     </p>
                  </div>
                  <div className="bg-amber-50/50 p-8 rounded-[2.5rem] border-2 border-amber-100 space-y-4">
                     <div className={`w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-sm`}>
                        <LockIcon size={24} />
                     </div>
                     <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Fortified Moats</h4>
                     <p className="text-xs text-amber-800 font-bold leading-relaxed opacity-70">
                       High-barrier. No public list exists. Requires formal Open Records Requests (ORR). Low competition, high-yield territory.
                     </p>
                  </div>
               </div>

               {/* Triage Leaderboard */}
               <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">National Barrier Index</h3>
                    <Tooltip content="Launch the global scanner to find specific county links.">
                      <button onClick={() => navigate('/scanner')} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2">
                         Scanner Engine <ArrowRightIcon size={14} />
                      </button>
                    </Tooltip>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {NATIONAL_RANKINGS.map((item) => (
                      <div key={item.state} className="p-10 hover:bg-slate-50/50 transition-all group flex flex-col xl:flex-row xl:items-center gap-12">
                        <div className="flex items-center gap-8 shrink-0 min-w-[280px]">
                           <div className={`w-16 h-16 rounded-[1.25rem] text-white flex items-center justify-center font-black text-2xl shadow-xl relative ${item.level === 'FORTIFIED_MOAT' ? 'bg-slate-900' : 'bg-indigo-900'}`}>
                             {item.state}
                           </div>
                           <div>
                             <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">{item.name}</h4>
                             <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getBarrierColor(item.level)}`}>
                               {item.level.replace('_', ' ')}
                             </span>
                           </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">List Access</p>
                              <p className="text-sm font-black text-slate-800 uppercase">{item.access.replace('_', ' ')}</p>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Statutory Friction</p>
                              <p className="text-sm font-black text-slate-800 uppercase">{item.friction}</p>
                           </div>
                           <div className="flex items-center justify-between">
                              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">{item.description}</p>
                              <button onClick={() => navigate('/scanner')} className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                                 <FileSearchIcon size={18} />
                              </button>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'bridge' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-slate-950 rounded-[3.5rem] p-12 text-white relative overflow-hidden group shadow-2xl border border-white/5">
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-500/20">
                        <LayersIcon size={24} />
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter uppercase italic text-white">The Ingestion Bridge</h3>
                    </div>
                    <p className="text-indigo-200 font-bold text-xl max-w-3xl leading-relaxed">
                      How do you turn a raw PDF into a live recovery case? Follow the <strong>Protocol of 3</strong>.
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                    <ZapIcon size={180} fill="white" />
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-6 flex flex-col">
                     <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">01</div>
                     <h5 className="font-black text-slate-900 uppercase tracking-tight text-lg">Step 1: Raw Acquire</h5>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">
                       Use the <strong>County Scanner</strong> to find the direct list URL. Download the PDF, CSV, or HTML table to your local device.
                     </p>
                     <button onClick={() => navigate('/scanner')} className="w-full py-4 bg-slate-100 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">Go to Scanner</button>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-6 flex flex-col border-indigo-400 ring-4 ring-indigo-50">
                     <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">02</div>
                     <h5 className="font-black text-slate-900 uppercase tracking-tight text-lg">Step 2: AI Bulk Ingest</h5>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">
                       Upload your PDF to the <strong>Document Repository</strong>. AI Core will extract owner names, parcel IDs, and surplus amounts instantly.
                     </p>
                     <button onClick={() => navigate('/properties/new')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all">Start Intake</button>
                  </div>

                  <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-6 flex flex-col">
                     <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-xl">03</div>
                     <h5 className="font-black text-slate-900 uppercase tracking-tight text-lg">Step 3: Protocol Pulse</h5>
                     <p className="text-sm text-slate-500 font-medium leading-relaxed flex-1">
                       Once ingested, the system fires off the <strong>Workflow Protocol</strong>: automated skip-tracing, waterfall modeling, and outreach drafting.
                     </p>
                     <button onClick={() => navigate('/workflow')} className="w-full py-4 bg-slate-100 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">View Protocol</button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className={`rounded-[3.5rem] p-14 text-white relative overflow-hidden group shadow-2xl bg-indigo-600 shadow-indigo-500/10`}>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4">
                      <SparklesIcon size={32} className="text-amber-400 animate-pulse" />
                      <h3 className="text-3xl font-black tracking-tight uppercase italic">Live Auction Pulse</h3>
                    </div>
                    <p className="text-indigo-100 font-bold text-lg max-w-2xl leading-relaxed">
                      Scouting national treasurers for the next batch of overage lists. Live Grounding Search is sync-ready.
                    </p>
                    <button 
                      onClick={fetchUpcomingSchedules}
                      disabled={isSearchingSchedules}
                      className="px-12 py-5 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                    >
                      {isSearchingSchedules ? <RefreshCwIcon size={20} className="animate-spin" /> : <ZapIcon size={20} fill="currentColor" />}
                      Sync Global Feeds
                    </button>
                  </div>
               </div>

               {aiInsights ? (
                 <div className="bg-white rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-50">
                       <ShieldCheckIcon size={24} className="text-indigo-600" />
                       <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sync Feed: National Grounding</h4>
                    </div>
                    <div className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap italic bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                       {aiInsights}
                    </div>
                 </div>
               ) : (
                 <div className="p-32 text-center border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/30">
                    <ClockIcon size={40} className="text-slate-200 mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest">Global Feed Idle</p>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Tactical Strategy Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-8">
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <ShieldAlertIcon size={16} className="text-indigo-600" /> Tactical Moat Logic
            </h4>
            <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                   <h5 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Why Target Moats?</h5>
                   <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                     Moated jurisdictions (Level 3) hide their lists. To win here, you use our <strong>ORR Letter Generator</strong> to force the county to release data.
                   </p>
                   <div className="pt-2">
                     <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">Low Competition</span>
                   </div>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                   <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Why Target Plains?</h5>
                   <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
                     Open jurisdictions (Level 1) have the most data. To win here, you use our <strong>AI Extraction</strong> to process thousands of records before anyone else.
                   </p>
                   <div className="pt-2">
                     <span className="text-[9px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase">High Velocity</span>
                   </div>
                </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100">
               <div className="p-6 bg-indigo-50/50 rounded-2xl flex items-start gap-4 border border-indigo-100">
                  <InfoIcon size={18} className="text-indigo-600 shrink-0" />
                  <p className="text-[9px] font-black text-indigo-700 uppercase tracking-widest leading-relaxed">
                    Once data is released by a county, use the <strong>Ingestion Bridge</strong> to start the automated recovery lifecycle.
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-6 relative overflow-hidden">
             <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon size={18} className="text-indigo-400" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Agent Proficiency</h4>
                </div>
                <p className="text-[10px] text-indigo-100 font-bold leading-relaxed opacity-80">
                  Your team is currently focused on <strong>GA (Tidal Flat)</strong> and <strong>FL (Open Plain)</strong>. Expand to <strong>MD</strong> to increase margins.
                </p>
                <button onClick={() => setActiveTab('triage')} className="text-[9px] font-black text-indigo-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                   Analyze MD Moat <ChevronRightIcon size={12} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
