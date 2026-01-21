
import React, { useState, useEffect } from 'react';
import { 
  DatabaseIcon, 
  MapPinIcon, 
  SearchIcon, 
  SparklesIcon, 
  Loader2Icon, 
  ExternalLinkIcon,
  CheckCircle2Icon,
  ShieldAlertIcon,
  GlobeIcon,
  Building2Icon,
  FileTextIcon,
  ArrowRightIcon,
  DownloadIcon,
  ZapIcon,
  LockIcon,
  ShieldCheckIcon,
  InfoIcon,
  XIcon,
  FileIcon,
  CopyIcon,
  EyeIcon,
  ActivityIcon,
  ClockIcon,
  CalendarIcon,
  BellIcon,
  TargetIcon,
  ChevronDownIcon,
  LinkIcon,
  ShieldIcon,
  LayersIcon
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
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  const saveWatchlist = (newWatch: WatchedJurisdiction[]) => {
    setWatchlist(newWatch);
    localStorage.setItem('juris_watchlist', JSON.stringify(newWatch));
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
      status: 'FRESH'
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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <DatabaseIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                County Scanner
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Autonomous List Discovery Engine</p>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
            Scan any county in the US to find direct surplus links or generate formal records requests.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Watchlist Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-sm space-y-6 flex flex-col min-h-[600px]">
             <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <TargetIcon size={16} className="text-indigo-600" /> Active Watchlist
                </h4>
             </div>
             <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
                {watchlist.map((watch, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group relative">
                     <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-md bg-slate-900 text-white text-[10px] font-black flex items-center justify-center">{watch.state}</div>
                           <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[100px]">{watch.county}</p>
                        </div>
                        <button onClick={() => removeWatched(watch.state, watch.county)} className="text-slate-300 hover:text-red-500 transition-colors"><XIcon size={14}/></button>
                     </div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Drop: {watch.next_expected}</p>
                  </div>
                ))}
                {watchlist.length === 0 && (
                  <div className="py-20 text-center space-y-3">
                     <BellIcon size={24} className="text-slate-200 mx-auto" />
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Watched Counties</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Scanner Panel */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target State</label>
              <select 
                value={targetState}
                onChange={(e) => setTargetState(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 text-sm font-black focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none appearance-none cursor-pointer"
              >
                {Object.keys(COUNTIES_BY_STATE).map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>
            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target County</label>
              <select 
                value={targetCounty}
                onChange={(e) => setTargetCounty(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 text-sm font-black focus:ring-8 focus:ring-indigo-500/5 transition-all outline-none appearance-none cursor-pointer"
              >
                {(COUNTIES_BY_STATE[targetState] || []).map(county => (
                  <option key={county} value={county}>{county}</option>
                ))}
              </select>
            </div>
            <div className="pt-8">
              <button 
                onClick={handleScan}
                disabled={isScanning}
                className="w-full md:w-[240px] py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all bg-slate-950 text-white shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isScanning ? <Loader2Icon size={20} className="animate-spin" /> : <ZapIcon size={20} fill="currentColor" />}
                Scan County
              </button>
            </div>
          </div>

          {results && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="xl:col-span-3 space-y-8">
                <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 p-12 shadow-sm space-y-10 relative overflow-hidden">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-50 pb-10">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-950 rounded-[1.75rem] text-white flex items-center justify-center font-black text-3xl shadow-2xl rotate-3">
                          {targetState}
                        </div>
                        <div>
                          <h4 className="text-3xl font-black text-slate-900 tracking-tight">{targetCounty} County</h4>
                          <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest mt-2 block w-fit ${
                            results.barrier_level === 'FORTIFIED_MOAT' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                            (results.barrier_level === 'OPEN_PLAINS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100')
                          }`}>
                            {results.barrier_level?.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={handleWatch} className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg">
                          <EyeIcon size={14} /> Watch Pulse
                        </button>
                        <a href={results.official_url} target="_blank" rel="noopener noreferrer" className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg">
                          Official URL <ExternalLinkIcon size={14} />
                        </a>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <SparklesIcon size={16} className="text-indigo-600" /> Discovery Logic
                      </h5>
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                        <p className="text-slate-700 font-medium leading-relaxed italic text-lg whitespace-pre-wrap">"{results.search_summary}"</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                      <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm space-y-2">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Update Cadence</p>
                         <p className="text-2xl font-black text-slate-900">{results.cadence}</p>
                      </div>
                      <div className="p-8 bg-slate-950 rounded-[2.5rem] shadow-2xl space-y-2">
                         <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Next Drop Prediction</p>
                         <p className="text-2xl font-black text-white">{results.next_expected_drop}</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="xl:col-span-2 space-y-8">
                {results.barrier_level === 'FORTIFIED_MOAT' ? (
                  <div className="bg-amber-600 p-10 rounded-[3rem] text-white shadow-2xl space-y-6 relative overflow-hidden">
                      <h4 className="text-[11px] font-black text-amber-200 uppercase tracking-widest flex items-center gap-3">
                        <LockIcon size={16} /> Moat Strategic Strike
                      </h4>
                      <p className="text-xs font-bold leading-relaxed opacity-90 italic">This county hides its list. You must file a records request to unlock the data.</p>
                      <button 
                        onClick={handleGenerateORR}
                        disabled={isGeneratingORR}
                        className="w-full py-4 bg-white text-amber-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95"
                      >
                        {isGeneratingORR ? <Loader2Icon size={20} className="animate-spin" /> : <FileIcon size={20} />}
                        Draft ORR Letter
                      </button>
                  </div>
                ) : (
                  <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-2xl space-y-6 relative overflow-hidden">
                      <h4 className="text-[11px] font-black text-emerald-200 uppercase tracking-widest flex items-center gap-3">
                        <LayersIcon size={16} /> Ingestion Bridge
                      </h4>
                      <p className="text-xs font-bold leading-relaxed opacity-90 italic">Data is accessible. Download the PDF and use our AI Bridge to ingest in bulk.</p>
                      <button 
                        onClick={() => navigate('/properties/new')}
                        className="w-full py-4 bg-white text-emerald-700 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95"
                      >
                        <ZapIcon size={20} /> Bulk Ingest PDF
                      </button>
                  </div>
                )}

                <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl space-y-8">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                    <LinkIcon size={16} className="text-indigo-600" /> Discovery Vault
                  </h4>
                  <div className="grid grid-cols-1 gap-5">
                    {results.discovery_links?.map((link: any, i: number) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-400 hover:bg-white transition-all duration-300">
                        <div className="flex items-center gap-6 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-inner transition-all duration-300 shrink-0 ${link.reliability === 'VERIFIED_GOV' ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
                            <ShieldIcon size={20} />
                          </div>
                          <div className="min-w-0">
                             <p className="text-sm font-black text-slate-900 truncate uppercase">{link.title}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Official Portal</p>
                          </div>
                        </div>
                        <ArrowRightIcon size={16} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
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
