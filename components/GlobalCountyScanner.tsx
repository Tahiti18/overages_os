
import React, { useState } from 'react';
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
  CopyIcon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { scanJurisdictionForSurplus, generateORRLetter } from '../lib/gemini';
import Tooltip from './Tooltip';

const GlobalCountyScanner: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();
  const [targetState, setTargetState] = useState('GA');
  const [targetCounty, setTargetCounty] = useState('Fulton');
  const [isScanning, setIsScanning] = useState(false);
  const [isGeneratingORR, setIsGeneratingORR] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [orrLetter, setOrrLetter] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    setResults(null);
    setOrrLetter(null);

    // Simulation Data for Non-Live Mode
    if (!isLiveMode) {
      setTimeout(() => {
        setResults({
          official_url: `https://www.${targetCounty.toLowerCase()}county.gov/treasurer/excess-proceeds`,
          access_type: "MOAT_GATED",
          data_format: "Manual Portal / ORR",
          last_updated_mention: "Q1 2025",
          treasurer_contact: "treasurer-info@fultoncounty.gov",
          search_summary: `IDENTIFIED: ${targetCounty} County maintains a gatekept surplus list. Direct public URLs often return 404/Removed to discourage scraping. Access requires a formal Open Records Request (ORR) via the county centralized portal. This represents a HIGH MOAT jurisdiction.`,
          orr_instructions: "1. Visit the centralized county portal. 2. File a request for 'Current Excess Tax Funds List'. 3. Expected turnaround: 3-5 business days.",
          discovery_links: [
            { title: "County Open Records Portal", url: "https://fultoncountyga.gov/open-records" },
            { title: "Treasurer FAQ (Surplus Mention)", url: "#" }
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <DatabaseIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                {isLiveMode ? 'Live Discovery' : 'Jurisdiction Scanner'}
                <span className={`${isLiveMode ? 'text-emerald-500' : 'text-indigo-600'} animate-pulse`}>●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">
                {isLiveMode ? 'Grounding-Enabled Web Scout' : 'Autonomous List Discovery Engine'}
              </p>
            </div>
          </div>
          <p className="text-slate-500 font-medium max-w-2xl leading-relaxed text-lg">
            {isLiveMode 
              ? 'Real-time discovery of raw county data. The AI will point you directly to the Treasurer’s latest Excel or PDF surplus lists.' 
              : 'Target any county to find their buried overage records. Simulation mode active.'}
          </p>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 w-full space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <MapPinIcon size={14} className="text-indigo-500" /> Target State
          </label>
          <div className="relative group">
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
          </div>
        </div>
        
        <div className="flex-1 w-full space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2">
            <Building2Icon size={14} className="text-indigo-500" /> Target County
          </label>
          <div className="relative group">
            <SearchIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
            <input 
              type="text" 
              value={targetCounty}
              onChange={(e) => setTargetCounty(e.target.value)}
              placeholder="e.g. Fulton"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 pl-14 pr-8 text-sm font-black text-slate-900 focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        <div className="pt-8 w-full md:w-auto">
          <Tooltip content="Launch a deep web scan to identify direct links for this jurisdiction's overage data.">
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className={`w-full md:w-[240px] py-5 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50 ${isLiveMode ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-950 text-white shadow-slate-200'}`}
            >
              {isScanning ? <Loader2Icon size={20} className="animate-spin" /> : <ZapIcon size={20} fill="currentColor" />}
              {isScanning ? 'Scouting Juris...' : 'Scan Jurisdiction'}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Discovery Results */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
          <div className="lg:col-span-2 space-y-8">
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
                         This jurisdiction has removed public lists to prevent scraping. **This reduces competition by 90%.** Accessing this data requires a manual strike.
                       </p>
                    </div>
                 </div>
               )}

               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8">
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-[1.75rem] text-white flex items-center justify-center font-black text-3xl shadow-2xl relative rotate-3 transition-transform ${isLiveMode ? 'bg-emerald-950' : 'bg-slate-950'}`}>
                      {targetState}
                    </div>
                    <div>
                      <h4 className="text-3xl font-black text-slate-900 tracking-tight">{targetCounty} County</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle2Icon size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Surplus Protocol Verified</span>
                      </div>
                    </div>
                  </div>
                  <Tooltip content="Launch the official portal or instructions identified by the AI scout.">
                    <a 
                      href={results.official_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                    >
                      Official URL <ExternalLinkIcon size={14} />
                    </a>
                  </Tooltip>
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

               {results.orr_instructions && (
                 <div className="space-y-6">
                    <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <FileTextIcon size={16} className="text-indigo-600" /> ORR Strike Plan
                    </h5>
                    <div className="bg-indigo-50/50 p-8 rounded-[2rem] border-2 border-indigo-100/50 space-y-6">
                       <p className="text-xs font-bold text-indigo-900 leading-relaxed uppercase tracking-widest italic">{results.orr_instructions}</p>
                       <button 
                        onClick={handleGenerateORR}
                        disabled={isGeneratingORR}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                       >
                         {isGeneratingORR ? <Loader2Icon size={20} className="animate-spin" /> : <FileIcon size={20} />}
                         {isGeneratingORR ? 'Drafting Request...' : 'Generate Open Records Letter'}
                       </button>
                    </div>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Access Tier</p>
                    <p className={`text-lg font-black ${results.access_type === 'MOAT_GATED' ? 'text-amber-600' : 'text-emerald-600'}`}>{results.access_type.replace('_', ' ')}</p>
                  </div>
                  <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Format Type</p>
                    <p className="text-lg font-black text-slate-900">{results.data_format}</p>
                  </div>
                  <div className="p-6 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Contact</p>
                    <p className="text-xs font-black text-indigo-600 truncate">{results.treasurer_contact}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* ORR Letter Preview if generated */}
            {orrLetter && (
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden animate-in slide-in-from-right-8 duration-500">
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                       <h4 className="font-black text-xs uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                         <ShieldCheckIcon size={16} /> ORR Draft v1.0
                       </h4>
                       <button onClick={() => setOrrLetter(null)} className="p-1 hover:text-red-400 transition-colors"><XIcon size={16} /></button>
                    </div>
                    <div className="space-y-4">
                       <p className="text-[10px] font-bold text-slate-500 uppercase">Subject: {orrLetter.subject}</p>
                       <div className="text-[11px] leading-relaxed font-mono opacity-80 h-64 overflow-y-auto custom-scrollbar bg-white/5 p-4 rounded-xl">
                          {orrLetter.letter_body}
                       </div>
                       <p className="text-[9px] text-indigo-300 italic">Governed by: {orrLetter.statute_reference}</p>
                    </div>
                    <button className="w-full py-4 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-2">
                       <CopyIcon size={16} /> Copy to Clipboard
                    </button>
                 </div>
              </div>
            )}

            <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-8">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <FileTextIcon size={16} className="text-indigo-600" /> Grounding Sources
              </h4>
              <div className="space-y-4">
                {results.discovery_links?.map((link: any, i: number) => (
                  <a 
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-6 bg-slate-50 rounded-[1.75rem] border border-slate-100 group hover:border-indigo-400 hover:bg-white transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                        <DownloadIcon size={18} />
                      </div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate max-w-[140px]">{link.title}</p>
                    </div>
                    <ArrowRightIcon size={16} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                  </a>
                ))}
              </div>

              <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] space-y-3">
                <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Strike Intelligence</p>
                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                  The discovery of a 404 page for direct lists confirms that this county has <strong>high recovery potential</strong> due to data friction. 
                </p>
                <div className="pt-4 flex items-center gap-3">
                   <InfoIcon size={16} className="text-indigo-400" />
                   <p className="text-[9px] font-black uppercase text-indigo-500 tracking-widest">Filing ORR recommended</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isScanning && (
        <div className="py-24 flex flex-col items-center justify-center space-y-8 animate-in fade-in duration-500">
           <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-indigo-500/10 rounded-full animate-ping"></div>
              <div className="absolute inset-4 bg-indigo-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <GlobeIcon size={64} className="text-indigo-600 animate-bounce" />
              </div>
           </div>
           <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Bypassing Web Caches...</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">AI Scout is identifying Moats and Access Portals</p>
           </div>
        </div>
      )}

      {error && (
        <div className="p-10 bg-red-50 border-2 border-red-100 rounded-[3rem] flex items-center gap-8 text-red-700 animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-xl border border-red-100">
            <ShieldAlertIcon size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1">Scout Intelligence Error</p>
            <p className="text-lg font-bold leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalCountyScanner;
