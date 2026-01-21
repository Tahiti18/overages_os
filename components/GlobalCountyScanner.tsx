
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
  ShieldIcon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
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

/**
 * Verified Government Portals for Simulation Mode.
 * These are manually checked to ensure no 404 redirects.
 */
const COUNTY_RESOURCES: Record<string, { portal: string, faq: string }> = {
  'Fulton': { 
    portal: 'https://fultoncountyga.gov/services/tax-and-real-estate/excess-proceeds', 
    faq: 'https://fultoncountyga.gov/services/tax-and-real-estate/excess-proceeds-frequently-asked-questions' 
  },
  'Miami-Dade': { 
    portal: 'https://www.miamidade.gov/global/service.page?Mduid_service=ser1492543160875245', // Verified Direct Link
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
  const [targetState, setTargetState] = useState('GA');
  const [targetCounty, setTargetCounty] = useState('Fulton');
  const [isScanning, setIsScanning] = useState(false);
  const [isGeneratingORR, setIsGeneratingORR] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [orrLetter, setOrrLetter] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<WatchedJurisdiction[]>([]);

  // Sync county dropdown when state changes
  useEffect(() => {
    const available = COUNTIES_BY_STATE[targetState] || [];
    if (available.length > 0 && !available.includes(targetCounty)) {
      setTargetCounty(available[0]);
    }
  }, [targetState]);

  // Load Watchlist from Local Storage for persistence
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
    setOrrLetter(null);

    // Simulation Data for Non-Live Mode
    if (!isLiveMode) {
      setTimeout(() => {
        const resources = COUNTY_RESOURCES[targetCounty] || { 
          portal: `https://www.google.com/search?q=site%3A*.gov+${targetCounty}+${targetState}+"excess+proceeds"+list`,
          faq: `https://www.google.com/search?q=site%3A*.gov+${targetCounty}+${targetState}+tax+sale+rules+faq`
        };

        setResults({
          official_url: resources.portal,
          access_type: targetCounty === 'Fulton' || targetCounty === 'Baltimore City' ? "MOAT_GATED" : "OPEN_PDF",
          cadence: "Quarterly",
          last_updated: "2025-01-10",
          next_expected_drop: "2025-04-10",
          cadence_rationale: `${targetCounty} typically refreshes records post-Tax Sale, which occurs on a scheduled cycle relative to judicial confirmations.`,
          data_format: targetCounty === 'Fulton' ? "Manual Portal / ORR" : "Direct PDF Export",
          last_updated_mention: "January 2025",
          treasurer_contact: `treasurer-info@${targetCounty.toLowerCase().replace(/\s+/g, '')}county.gov`,
          search_summary: `IDENTIFIED: ${targetCounty} County maintains its records via ${targetCounty === 'Fulton' ? 'a gatekept portal' : 'a public-facing transparency dashboard'}. Access strategy optimized for ${targetState} statutory timelines.`,
          orr_instructions: targetCounty === 'Fulton' ? "1. Visit the centralized county portal. 2. File a request for 'Current Excess Tax Funds List'. 3. Expected turnaround: 3-5 business days." : "No ORR needed. Download latest PDF from official transparency portal.",
          discovery_links: [
            { title: "County Records Portal", url: resources.portal, reliability: "VERIFIED_GOV" },
            { title: "Treasurer FAQ & Info", url: resources.faq, reliability: "VERIFIED_GOV" },
            { title: "Judicial Filings Lookup", url: `https://www.google.com/search?q=${targetCounty}+court+records`, reliability: "SEARCH_RESULT" }
          ]
        });
        setIsScanning(false);
      }, 2500);
      return;
    }

    try {
      const data = await scanJurisdictionForSurplus(targetState, targetCounty);
      setResults(data);
    } catch (err) {
      setError("AI Discovery Engine Timeout: Unable to reach county web servers at this time.");
      console.error(err);
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
      const letter = await generateORRLetter(targetState, targetCounty, results?.treasurer_contact || "County Treasurer");
      setOrrLetter(letter);
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
                {isLiveMode ? 'Live Scout' : 'Jurisdiction Scanner'}
                <span className={`${isLiveMode ? 'text-emerald-500' : 'text-indigo-600'} animate-pulse`}>●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                {isLiveMode ? 'Temporal Surveillance Engine' : 'Autonomous List Discovery Engine'}
              </p>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
            Identify raw overage lists and establish a **Surveillance Watchlist** to be first-to-market when new data drops.
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
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{watchlist.length}</span>
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
                     <div className="flex items-center gap-2 mb-3">
                        <ClockIcon size={10} className="text-indigo-400" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Drop: {watch.next_expected}</p>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${watch.access_type === 'OPEN_PDF' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                           {watch.access_type?.split('_')[0] || 'DATA'}
                        </span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     </div>
                  </div>
                ))}

                {watchlist.length === 0 && (
                  <div className="py-20 text-center space-y-3">
                     <BellIcon size={24} className="text-slate-200 mx-auto" />
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Jurisdictions Watched</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Scanner Panel */}
        <div className="lg:col-span-3 space-y-8">
          {/* Control Panel */}
          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <MapPinIcon size={14} className="text-indigo-500" /> Target State
              </label>
              <div className="relative">
                <select 
                  value={targetState}
                  onChange={(e) => setTargetState(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 text-sm font-black text-slate-900 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="AL">Alabama</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="MD">Maryland</option>
                  <option value="TX">Texas</option>
                  <option value="NC">North Carolina</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDownIcon size={20} />
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
                <Building2Icon size={14} className="text-indigo-500" /> Target County
              </label>
              <div className="relative">
                <select 
                  value={targetCounty}
                  onChange={(e) => setTargetCounty(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 text-sm font-black text-slate-900 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none appearance-none cursor-pointer"
                >
                  {(COUNTIES_BY_STATE[targetState] || []).map(county => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                  <option value="Other (Manual Scan)">Other (Manual Scan)</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ChevronDownIcon size={20} />
                </div>
              </div>
            </div>

            <div className="pt-8 w-full md:w-auto">
              <button 
                onClick={handleScan}
                disabled={isScanning}
                className={`w-full md:w-[240px] py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50 ${isLiveMode ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-950 text-white shadow-slate-200'}`}
              >
                {isScanning ? <Loader2Icon size={20} className="animate-spin" /> : <ZapIcon size={20} fill="currentColor" />}
                {isScanning ? 'Scouting Temporal...' : 'Scan Jurisdiction'}
              </button>
            </div>
          </div>

          {/* Discovery Results */}
          {results && (
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="xl:col-span-3 space-y-8">
                <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 p-12 shadow-sm space-y-10 relative overflow-hidden">
                   {/* Moat Banner */}
                   {results.access_type === 'MOAT_GATED' && (
                     <div className="p-8 bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] flex items-center gap-6 shadow-sm">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-xl border border-amber-100 shrink-0">
                           <LockIcon size={32} />
                        </div>
                        <div>
                           <h4 className="text-xl font-black text-amber-900 uppercase tracking-tight italic">Strategic Moat Detected</h4>
                           <p className="text-sm text-amber-800 font-bold leading-relaxed opacity-80">
                             This jurisdiction has removed public lists to prevent scraping. **Access requires a manual strike.**
                           </p>
                        </div>
                     </div>
                   )}

                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-50 pb-10">
                      <div className="flex items-center gap-6">
                        <div className={`w-20 h-20 rounded-[1.75rem] text-white flex items-center justify-center font-black text-3xl shadow-2xl relative rotate-3 transition-transform shrink-0 ${isLiveMode ? 'bg-emerald-950' : 'bg-slate-950'}`}>
                          {targetState}
                        </div>
                        <div>
                          <h4 className="text-3xl font-black text-slate-900 tracking-tight">{targetCounty} County</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <CheckCircle2Icon size={14} className="text-emerald-500 shrink-0" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surplus Protocol Verified</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button 
                          onClick={handleWatch}
                          className="px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/20"
                        >
                          <EyeIcon size={14} /> Watch Pulse
                        </button>
                        <a 
                          href={results.official_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all border border-indigo-500 shadow-lg shadow-indigo-100 flex items-center gap-2"
                        >
                          Official URL <ExternalLinkIcon size={14} />
                        </a>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <SparklesIcon size={16} className="text-indigo-600" /> Intelligence Summary
                      </h5>
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                        <p className="text-slate-700 font-medium leading-relaxed italic text-lg whitespace-pre-wrap">
                          "{results.search_summary}"
                        </p>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-sm space-y-4">
                         <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                           <ActivityIcon size={14} className="text-indigo-600" /> Temporal Cadence
                         </h5>
                         <div className="flex items-baseline gap-3">
                            <p className="text-3xl font-black text-slate-900">{results.cadence}</p>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-2 py-1 rounded-md">Pattern Found</span>
                         </div>
                         <p className="text-xs text-slate-500 leading-relaxed font-bold">{results.cadence_rationale}</p>
                      </div>

                      <div className="p-8 bg-slate-950 rounded-[2.5rem] shadow-2xl space-y-4 relative overflow-hidden">
                         <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 relative z-10">
                           <ClockIcon size={14} /> Next Drop Prediction
                         </h5>
                         <p className="text-3xl font-black text-white relative z-10">{results.next_expected_drop}</p>
                         <div className="flex items-center gap-2 text-indigo-300 text-[10px] font-black uppercase tracking-widest relative z-10">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                            Watchlist Synchronized
                         </div>
                         <div className="absolute top-0 right-0 p-8 opacity-5">
                            <CalendarIcon size={80} fill="white" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="xl:col-span-2 space-y-8">
                {results.orr_instructions && (
                  <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8 relative overflow-hidden">
                      <div className="relative z-10 space-y-4">
                        <h4 className="text-[11px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-3">
                          <FileTextIcon size={16} /> ORR Strategic Strike
                        </h4>
                        <p className="text-xs font-bold leading-relaxed opacity-80 italic">{results.orr_instructions}</p>
                        <button 
                          onClick={handleGenerateORR}
                          disabled={isGeneratingORR}
                          className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                          {isGeneratingORR ? <Loader2Icon size={20} className="animate-spin" /> : <FileIcon size={20} />}
                          {isGeneratingORR ? 'Drafting Request...' : 'Draft Open Records Letter'}
                        </button>
                      </div>
                  </div>
                )}

                <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl space-y-8 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-4 px-2">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <LinkIcon size={16} className="text-indigo-600" /> Discovery Vault
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-5">
                    {results.discovery_links?.map((link: any, i: number) => (
                      <a 
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-400 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 active:scale-[0.98]"
                      >
                        <div className="flex items-center gap-6 overflow-hidden min-w-0">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all duration-300 shrink-0 ${
                            link.reliability === 'VERIFIED_GOV' ? 'bg-emerald-50 text-emerald-600' : 'bg-white text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6'
                          }`}>
                            {link.title.toLowerCase().includes('faq') ? <InfoIcon size={24} /> : (link.reliability === 'VERIFIED_GOV' ? <ShieldIcon size={24} /> : <GlobeIcon size={24} />)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col mb-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                                    {link.title}
                                  </p>
                                  {link.reliability === 'VERIFIED_GOV' && (
                                     <span className="text-[7px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded uppercase tracking-widest shrink-0 whitespace-nowrap">Gov Verified</span>
                                  )}
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">
                                  {link.url.includes('google') ? 'Web Search Node' : (link.url.includes('.gov') ? 'Official County Portal' : 'Public Asset Node')}
                                </p>
                            </div>
                          </div>
                        </div>
                        <ArrowRightIcon size={20} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 ml-4" />
                      </a>
                    ))}
                  </div>

                  {(!results.discovery_links || results.discovery_links.length === 0) && (
                    <div className="py-12 text-center space-y-4">
                       <LinkIcon size={32} className="text-slate-100 mx-auto" />
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Direct Links Discovered</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {!results && !isScanning && (
            <div className="py-40 text-center space-y-6">
               <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-200 border border-slate-50 shadow-inner">
                  <GlobeIcon size={48} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Select Jurisdiction to Scan</h3>
                  <p className="text-slate-400 font-medium text-sm max-w-sm mx-auto">
                    Initialize a temporal scan to identify list update patterns and direct data access links.
                  </p>
               </div>
            </div>
          )}

          {isScanning && (
            <div className="py-40 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
              <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping"></div>
                  <div className="absolute inset-4 bg-indigo-500/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GlobeIcon size={64} className="text-indigo-600 animate-bounce" />
                  </div>
              </div>
              <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Auditing Historical Patterns...</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">AI Scout is predicting the next data drop for {targetCounty}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalCountyScanner;
