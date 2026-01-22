
import React, { useState, useEffect } from 'react';
import { 
  Database, 
  MapPin, 
  Search, 
  Sparkles, 
  Loader2, 
  ExternalLink,
  CheckCircle2,
  ShieldAlert,
  Globe,
  Building2,
  FileText,
  ArrowRight,
  Download,
  Zap,
  Lock,
  ShieldCheck,
  Info,
  X,
  File,
  Copy,
  Eye,
  Activity,
  Clock,
  Calendar,
  Bell,
  Target,
  ChevronDown,
  Link,
  Shield,
  Layers,
  AlertTriangle,
  BellOff
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { scanJurisdictionForSurplus, generateORRLetter } from '../lib/gemini';
import { WatchedJurisdiction } from '../types';
import Tooltip from './Tooltip';

const COUNTIES_BY_STATE: Record<string, string[]> = {
  GA: ['Fulton', 'DeKalb', 'Gwinnett', 'Cobb', 'Clayton', 'Chatham', 'Forsyth', 'Hall', 'Henry', 'Richmond', 'Muscogee', 'Douglas', 'Bibb'],
  FL: ['Miami-Dade', 'Broward', 'Palm Beach', 'Hillsborough', 'Orange', 'Duval', 'Pinellas', 'Lee', 'Polk', 'Brevard', 'Volusia', 'Pasco'],
  TX: ['Harris', 'Dallas', 'Tarrant', 'Bexar', 'Travis', 'Collin', 'Denton', 'Hidalgo', 'El Paso', 'Fort Bend', 'Montgomery', 'Williamson'],
  MD: ['Baltimore City', 'Montgomery', 'Prince George\'s', 'Baltimore County', 'Anne Arundel', 'Howard', 'Harford', 'Frederick', 'Carroll'],
  AL: ['Jefferson', 'Mobile', 'Madison', 'Montgomery', 'Shelby', 'Tuscaloosa', 'Baldwin', 'Lee', 'Morgan', 'Calhoun'],
  NC: ['Wake', 'Mecklenburg', 'Guilford', 'Forsyth', 'Cumberland', 'Durham', 'Buncombe', 'Gaston', 'New Hanover', 'Union']
};

const COUNTY_RESOURCES: Record<string, { portal: string, faq: string }> = {
  'Fulton': { 
    portal: 'https://fultoncountyga.gov/services/tax-and-real-estate/excess-proceeds', 
    faq: 'https://fultoncountyga.gov/services/tax-and-real-estate/excess-proceeds-frequently-asked-questions' 
  },
  'Miami-Dade': { 
    portal: 'https://www.miamidade.gov/global/service.page?Mduid_service=ser1492543160875245', 
    faq: 'https://www.miamidade.gov/taxcollector/faq-tax-sale.asp' 
  },
  'Harris': { 
    portal: 'https://www.hctax.net/Property/TaxSales', 
    faq: 'https://www.hctax.net/Property/TaxSalesFAQ' 
  },
  'Baltimore City': { 
    portal: 'https://propertytaxcard.baltimorecity.gov/', 
    faq: 'https://finance.baltimorecity.gov/tax-sale' 
  },
};

const GlobalCountyScanner: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [targetState, setTargetState] = useState('GA');
  const [targetCounty, setTargetCounty] = useState('Fulton');
  const [isScanning, setIsScanning] = useState(false);
  const [isGeneratingORR, setIsGeneratingORR] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<WatchedJurisdiction[]>([]);

  useEffect(() => {
    const available = COUNTIES_BY_STATE[targetState] || [];
    if (available.length > 0 && !available.includes(targetCounty)) {
      setTargetCounty(available[0]);
    }
  }, [targetState]);

  useEffect(() => {
    const saved = localStorage.getItem('juris_watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    } else {
      // Demo watchlist with an imminent alert
      const demoWatch: WatchedJurisdiction[] = [
        { state: 'FL', county: 'Miami-Dade', access_type: 'OPEN_PDF', cadence: 'Weekly', last_updated: '2025-01-15', next_expected: '2025-01-22', status: 'IMMINENT', alerts_enabled: true },
        { state: 'GA', county: 'Fulton', access_type: 'MOAT_GATED', cadence: 'Quarterly', last_updated: '2025-01-01', next_expected: '2025-04-01', status: 'FRESH', alerts_enabled: false }
      ];
      saveWatchlist(demoWatch);
    }
  }, []);

  const saveWatchlist = (newWatch: WatchedJurisdiction[]) => {
    setWatchlist(newWatch);
    localStorage.setItem('juris_watchlist', JSON.stringify(newWatch));
  };

  const toggleAlerts = (st: string, co: string) => {
    saveWatchlist(watchlist.map(w => (w.state === st && w.county === co) ? { ...w, alerts_enabled: !w.alerts_enabled } : w));
  };

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    setResults(null);

    if (!isLiveMode) {
      setTimeout(() => {
        const resources = COUNTY_RESOURCES[targetCounty] || { 
          portal: `https://www.google.com/search?q=site%3A*.gov+${targetCounty}+${targetState}+"excess+proceeds"+list`,
          faq: `https://www.google.com/search?q=site%3A*.gov+${targetCounty}+${targetState}+tax+sale+rules+faq`
        };

        const barrierLevel = targetCounty === 'Fulton' || targetCounty === 'Baltimore City' ? "FORTIFIED_MOAT" : 
                             (targetState === 'FL' ? "OPEN_PLAINS" : "TIDAL_FLATS");

        setResults({
          official_url: resources.portal,
          access_type: targetCounty === 'Fulton' || targetCounty === 'Baltimore City' ? "MOAT_GATED" : "OPEN_PDF",
          barrier_level: barrierLevel,
          cadence: "Quarterly",
          last_updated: "2025-01-10",
          next_expected_drop: "2025-04-10",
          cadence_rationale: `${targetCounty} typically refreshes records post-Tax Sale cycle.`,
          search_summary: `IDENTIFIED: ${targetCounty} County maintains its records via ${barrierLevel.replace('_', ' ')} protocol. Access strategy optimized for ${targetState} statutory timelines.`,
          orr_instructions: targetCounty === 'Fulton' || targetCounty === 'Baltimore City' ? "1. File a formal ORR via the portal. 2. Request 'Current Excess Funds List'. 3. Wait 3-5 days." : "No ORR needed. Download latest PDF and move to Ingestion Bridge.",
          discovery_links: [
            { title: "County Records Portal", url: resources.portal, reliability: "VERIFIED_GOV" },
            { title: "Treasurer FAQ & Info", url: resources.faq, reliability: "VERIFIED_GOV" }
          ]
        });
        setIsScanning(false);
      }, 2000);
      return;
    }

    try {
      const data = await scanJurisdictionForSurplus(targetState, targetCounty);
      setResults(data);
    } catch (err) {
      setError("AI Discovery Engine Timeout.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleWatch = () => {
    if (!results) return;
    const isAlreadyWatched = watchlist.find(w => w.state === targetState && w.county === targetCounty);
    if (isAlreadyWatched) return;
    const newEntry: WatchedJurisdiction = {
      state: targetState,
      county: targetCounty,
      access_type: results.access_type,
      cadence: results.cadence,
      last_updated: results.last_updated,
      next_expected: results.next_expected_drop,
      status: targetState === 'FL' ? 'APPROACHING' : 'FRESH',
      alerts_enabled: true
    };
    saveWatchlist([newEntry, ...watchlist]);
  };

  const removeWatched = (st: string, co: string) => {
    saveWatchlist(watchlist.filter(w => !(w.state === st && w.county === co)));
  };

  const handleGenerateORR = async () => {
    setIsGeneratingORR(true);
    try {
      await generateORRLetter(targetState, targetCounty, "County Treasurer");
      alert("ORR Tactical Letter Generated. View in Documents.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingORR(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <Database size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                County Scanner
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">Autonomous List Discovery Engine</p>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
            Scan any county in the US to find direct surplus links. Watch jurisdictions to receive **24-Hour Imminent Drop Alerts**.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Watchlist Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-2xl space-y-6 flex flex-col min-h-[600px] ring-1 ring-slate-100">
             <div className="flex items-center justify-between border-b-2 border-slate-50 pb-4">
                <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                   <Target size={16} className="text-indigo-600" /> Surveillance Watch
                </h4>
             </div>
             <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                {watchlist.map((watch, i) => (
                  <div 
                    key={i} 
                    className={`p-6 rounded-[2rem] border-2 transition-all relative shadow-xl overflow-hidden group ${
                      watch.status === 'IMMINENT' ? 'bg-rose-50 border-rose-200 shadow-rose-200/50 animate-pulse' : 'bg-slate-50 border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                     <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center shadow-lg ${watch.status === 'IMMINENT' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>
                                {watch.state}
                              </div>
                              <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[100px]">{watch.county}</p>
                           </div>
                           <button onClick={() => removeWatched(watch.state, watch.county)} className="text-slate-400 hover:text-red-600 transition-colors p-1"><X size={16}/></button>
                        </div>
                        
                        <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Expected Drop</p>
                          <p className={`text-sm font-black ${watch.status === 'IMMINENT' ? 'text-rose-600' : 'text-slate-900'}`}>{watch.next_expected}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                           <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                             watch.status === 'IMMINENT' ? 'bg-rose-600 text-white border-rose-500 shadow-lg' : 'bg-white text-slate-500 border-slate-200'
                           }`}>
                             {watch.status}
                           </div>
                           <Tooltip content={watch.alerts_enabled ? "Alerts enabled for this jurisdiction." : "Enable 24h drop alerts."}>
                             <button 
                               onClick={() => toggleAlerts(watch.state, watch.county)}
                               className={`p-2.5 rounded-xl transition-all ${watch.alerts_enabled ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200 hover:bg-slate-100'}`}
                             >
                               {watch.alerts_enabled ? <Bell size={14} /> : <BellOff size={14} />}
                             </button>
                           </Tooltip>
                        </div>
                     </div>
                  </div>
                ))}
                {watchlist.length === 0 && (
                  <div className="py-20 text-center space-y-3">
                     <Bell size={24} className="text-slate-200 mx-auto" />
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Watch Jurisdictions to track drops</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Scanner Panel */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl flex flex-col md:flex-row items-center gap-8 ring-1 ring-slate-100">
            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1">Target State</label>
              <div className="relative">
                <select 
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 text-sm font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none appearance-none cursor-pointer shadow-inner"
                >
                  {Object.keys(COUNTIES_BY_STATE).map(st => <option key={st} value={st}>{st}</option>)}
                </select>
                <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1">Target County</label>
              <div className="relative">
                <select 
                  value={targetCounty}
                  onChange={(e) => setTargetCounty(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 text-sm font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-400 transition-all outline-none appearance-none cursor-pointer shadow-inner"
                >
                  {(COUNTIES_BY_STATE[targetState] || []).map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="pt-8">
              <button 
                onClick={handleScan}
                disabled={isScanning}
                className="w-full md:w-[240px] py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all bg-slate-950 text-white shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-slate-900 hover:scale-[1.02] active:scale-95 border-2 border-white/10"
              >
                {isScanning ? <Loader2 size={22} className="animate-spin" /> : <Zap size={22} fill="currentColor" />}
                Scan County
              </button>
            </div>
          </div>

          {results && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="xl:col-span-3 space-y-8">
                <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 p-12 shadow-2xl space-y-10 relative overflow-hidden ring-1 ring-slate-100">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b-2 border-slate-50 pb-10">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-950 rounded-[1.75rem] text-white flex items-center justify-center font-black text-3xl shadow-2xl rotate-3 border-2 border-white/10">
                          {targetState}
                        </div>
                        <div>
                          <h4 className="text-3xl font-black text-slate-900 tracking-tight italic">{targetCounty} County</h4>
                          <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border-2 uppercase tracking-widest mt-2 block w-fit shadow-sm ${
                            results.barrier_level === 'FORTIFIED_MOAT' ? 'bg-amber-50 text-amber-600 border-amber-300' : 
                            (results.barrier_level === 'OPEN_PLAINS' ? 'bg-emerald-50 text-emerald-600 border-emerald-300' : 'bg-indigo-50 text-indigo-600 border-indigo-300')
                          }`}>
                            {results.barrier_level?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={handleWatch} className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl border border-white/10 group">
                          <Eye size={16} className="group-hover:animate-pulse" /> Watch Pulse
                        </button>
                        <a href={results.official_url} target="_blank" rel="noopener noreferrer" className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-xl border border-white/10">
                          Official URL <ExternalLink size={16} />
                        </a>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-3">
                        <Sparkles size={18} className="text-indigo-600" /> Discovery Logic
                      </h5>
                      <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-inner">
                        <p className="text-slate-800 font-bold leading-relaxed italic text-lg whitespace-pre-wrap">"{results.search_summary}"</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-xl space-y-3 hover:-translate-y-1 transition-all">
                         <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Update Cadence</p>
                         <p className="text-2xl font-black text-slate-900">{results.cadence}</p>
                      </div>
                      <div className="p-8 bg-slate-950 rounded-[2.5rem] shadow-2xl space-y-3 border-2 border-white/5 hover:-translate-y-1 transition-all relative group">
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Drop Prediction</p>
                         <p className="text-2xl font-black text-white">{results.next_expected_drop}</p>
                         <div className="absolute right-6 top-1/2 -translate-y-1/2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                           <AlertTriangle size={16} />
                           <span className="text-[9px] font-black uppercase">24h Warning System Active</span>
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="xl:col-span-2 space-y-8">
                {results.barrier_level === 'FORTIFIED_MOAT' ? (
                  <div className="bg-amber-600 p-10 rounded-[3rem] text-white shadow-3xl space-y-6 relative overflow-hidden border-2 border-amber-500 hover:-translate-y-1.5 transition-all">
                      <h4 className="text-[11px] font-black text-amber-100 uppercase tracking-widest flex items-center gap-3">
                        <Lock size={18} /> Moat Strategic Strike
                      </h4>
                      <p className="text-sm font-black leading-relaxed opacity-100 italic">This county hides its list. You must file a records request to unlock the data.</p>
                      <button 
                        onClick={handleGenerateORR}
                        disabled={isGeneratingORR}
                        className="w-full py-5 bg-white text-amber-800 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 hover:bg-amber-50"
                      >
                        {isGeneratingORR ? <Loader2 size={22} className="animate-spin" /> : <File size={22} />}
                        Draft ORR Letter
                      </button>
                  </div>
                ) : (
                  <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-3xl space-y-6 relative overflow-hidden border-2 border-emerald-500 hover:-translate-y-1.5 transition-all">
                      <h4 className="text-[11px] font-black text-emerald-100 uppercase tracking-widest flex items-center gap-3">
                        <Layers size={18} /> Ingestion Bridge
                      </h4>
                      <p className="text-sm font-black leading-relaxed opacity-100 italic">Data is accessible. Download the PDF and use our AI Bridge to ingest in bulk.</p>
                      <button 
                        onClick={() => navigate('/properties/new')}
                        className="w-full py-5 bg-white text-emerald-800 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 active:scale-95 hover:bg-emerald-50"
                      >
                        <Zap size={22} /> Bulk Ingest PDF
                      </button>
                  </div>
                )}

                <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl space-y-8 ring-1 ring-slate-100">
                  <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-3">
                    <Link size={18} className="text-indigo-600" /> Discovery Vault
                  </h4>
                  <div className="grid grid-cols-1 gap-5">
                    {results.discovery_links?.map((link: any, i: number) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 hover:border-indigo-400 hover:bg-white transition-all duration-300 shadow-md hover:shadow-xl">
                        <div className="flex items-center gap-6 min-w-0">
                          <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-inner transition-all duration-300 shrink-0 border-2 ${link.reliability === 'VERIFIED_GOV' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-slate-400 border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500'}`}>
                            <Shield size={22} />
                          </div>
                          <div className="min-w-0">
                             <p className="text-sm font-black text-slate-900 truncate uppercase tracking-tight">{link.title}</p>
                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Official Portal</p>
                          </div>
                        </div>
                        <ArrowRight size={20} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalCountyScanner;
