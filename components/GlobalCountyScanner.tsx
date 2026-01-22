import React, { useState } from 'react';
import { 
  Database, 
  Loader2, 
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Target,
  PlusCircle,
  Clock,
  Play,
  FileSpreadsheet,
  ShieldAlert,
  Calculator,
  Gavel,
  FileText,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';
import { performCountyAuctionScan } from '../lib/gemini';

/**
 * JURISDICTION REGISTRY
 * Standard source definitions for discovery.
 */
const JURISDICTION_REGISTRY = [
  { id: 'fl-miami', name: 'Miami-Dade', state: 'FL', url: 'miamidade.realforeclose.com', type: 'HTML_TABLE' },
  { id: 'fl-broward', name: 'Broward', state: 'FL', url: 'broward.realforeclose.com', type: 'HTML_TABLE' },
  { id: 'ga-fulton', name: 'Fulton', state: 'GA', url: 'fultoncountytaxcommissioner.org', type: 'PAGINATED_LIST' },
  { id: 'tx-harris', name: 'Harris', state: 'TX', url: 'hctax.net/Tax/TaxSales', type: 'PDF_MANIFEST' },
  { id: 'ga-dekalb', name: 'DeKalb', state: 'GA', url: 'dekalbtax.org/tax-sale', type: 'PDF_MANIFEST' },
  { id: 'fl-palm', name: 'Palm Beach', state: 'FL', url: 'mypalmbeach.realtaxdeed.com', type: 'HTML_TABLE' },
];

interface QualifiedLead {
  id: string;
  county: string;
  state: string;
  address: string;
  parcelId: string;
  saleDate: string;
  judgmentAmount: number;
  soldAmount: number;
  overage: number;
  sourceUrl: string;
  scanTimestamp: string;
  status: string;
}

const GlobalCountyScanner: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  
  const [selectedCounties, setSelectedCounties] = useState<string[]>(['fl-miami', 'tx-harris']);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [qualifiedResults, setQualifiedResults] = useState<QualifiedLead[]>([]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'results' | 'terminal'>('matrix');

  /**
   * COUNTY SCANNER PROTOCOL EXECUTION
   * Automated loop through statutory sources.
   */
  const executeScannerProtocol = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs(['INITIATING GLOBAL FLEET: Syncing Statutory Sources...']);
    setActiveTab('terminal');

    const allLeads: QualifiedLead[] = [];
    const totalSteps = selectedCounties.length * 3;
    let currentStep = 0;

    for (const countyId of selectedCounties) {
      const config = JURISDICTION_REGISTRY.find(c => c.id === countyId);
      if (!config) continue;

      setScanLogs(prev => [...prev, `[${config.name}] NAVIGATING: ${config.url} (${config.type})`]);
      currentStep++;
      setScanProgress((currentStep / totalSteps) * 100);
      
      try {
        const results = await performCountyAuctionScan(config.name, config.state, config.url, config.type);
        
        setScanLogs(prev => [...prev, `[${config.name}] ${config.type === 'PDF_MANIFEST' ? 'PARSING PDF LAYERS' : 'TRAVERSING HTML ROWS'}...`]);
        currentStep++;
        setScanProgress((currentStep / totalSteps) * 100);

        if (results && Array.isArray(results) && results.length > 0) {
          results.forEach((r: any) => {
            if (r.overage > 0) {
              const lead: QualifiedLead = {
                id: `lead-${Math.random().toString(36).substr(2, 9)}`,
                county: config.name,
                state: config.state,
                address: r.address,
                parcelId: r.parcelId,
                saleDate: r.saleDate || new Date().toLocaleDateString(),
                judgmentAmount: r.judgmentAmount,
                soldAmount: r.soldAmount,
                overage: r.overage,
                sourceUrl: r.sourceUrl || config.url,
                scanTimestamp: new Date().toLocaleString(),
                status: 'Qualified'
              };
              allLeads.push(lead);
              setScanLogs(prev => [...prev, `   -> QUALIFIED: ${r.address.substring(0, 15)}... ($${r.overage.toLocaleString()})`]);
            }
          });
        } else {
          setScanLogs(prev => [...prev, `[${config.name}] No new qualified surplus identified.`]);
        }
      } catch (err) {
        setScanLogs(prev => [...prev, `[${config.name}] CRITICAL: Ingestion failed.`]);
      }

      currentStep++;
      setScanProgress((currentStep / totalSteps) * 100);
      await new Promise(r => setTimeout(r, 400));
    }

    setQualifiedResults(allLeads);
    setScanLogs(prev => [...prev, `PROTOCOL COMPLETE. ${allLeads.length} leads written to table.`]);
    setIsScanning(false);
    
    setTimeout(() => setActiveTab('results'), 1500);
  };

  const toggleCounty = (id: string) => {
    setSelectedCounties(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const promoteToWorkflow = (lead: QualifiedLead) => {
    navigate('/properties/new', { state: { prefill: lead } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5">
              <Database size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                Fleet Scanner
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">Auction Discovery Protocol</p>
            </div>
          </div>
          <p className="text-slate-500 font-bold max-w-2xl leading-relaxed text-lg">
            Navigate calendars, extract from PDF manifests, and verify overages with zero human friction.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-sm">
           <button 
            onClick={() => setActiveTab('matrix')}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'matrix' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             Target Matrix
           </button>
           <button 
            onClick={() => setActiveTab('results')}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'results' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             Qualified Table
             {qualifiedResults.length > 0 && (
               <span className="absolute -top-2 -right-2 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[8px] animate-bounce shadow-lg">
                 {qualifiedResults.length}
               </span>
             )}
           </button>
           <button 
            onClick={() => setActiveTab('terminal')}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'terminal' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             Logic Stream
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-2xl space-y-8 ring-1 ring-slate-100">
            <div className="flex items-center justify-between border-b-2 border-slate-50 pb-6">
              <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-3">
                <Target size={18} className="text-indigo-600" /> Target Jurisdictions
              </h4>
              <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100">
                {selectedCounties.length} Active
              </span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {JURISDICTION_REGISTRY.map(county => (
                <div 
                  key={county.id}
                  onClick={() => toggleCounty(county.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${selectedCounties.includes(county.id) ? 'bg-indigo-50 border-indigo-300 shadow-md ring-4 ring-indigo-500/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm transition-all ${selectedCounties.includes(county.id) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-600'}`}>
                      {county.state}
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{county.name}</p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{county.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {selectedCounties.includes(county.id) ? <ShieldCheck size={18} className="text-indigo-600" /> : <PlusCircle size={18} className="text-slate-300" />}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t-2 border-slate-50">
              <Tooltip content="Launch the Multi-County Scanner Protocol.">
                <button 
                  onClick={executeScannerProtocol}
                  disabled={isScanning || selectedCounties.length === 0}
                  className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-3xl shadow-indigo-900/20 hover:bg-indigo-500 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 border-2 border-white/10"
                >
                  {isScanning ? <Loader2 size={22} className="animate-spin" /> : <Play size={22} fill="white" />}
                  {isScanning ? 'Syncing...' : 'Launch Global Fleet'}
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-2 border-white/5">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                   <ShieldAlert size={20} className="text-rose-500" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Filters</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                      <span className="text-slate-400 italic">Excluded: Bankruptcy</span>
                      <span className="text-emerald-400">ENFORCED</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                      <span className="text-slate-400 italic">Inclusion: Sold Only</span>
                      <span className="text-emerald-400">ACTIVE</span>
                   </div>
                </div>
             </div>
             <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform rotate-12">
                <Calculator size={140} fill="white" />
             </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'terminal' || isScanning ? (
            <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-10 shadow-2xl space-y-8 h-full flex flex-col ring-1 ring-slate-100">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Logic Stream</h3>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Fleet Operations...</p>
                  </div>
                  {isScanning && <p className="text-3xl font-black text-indigo-600">{Math.round(scanProgress)}%</p>}
               </div>
               
               {isScanning && (
                 <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
                    <div className="h-full bg-indigo-600 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.5)]" style={{ width: `${scanProgress}%` }}></div>
                 </div>
               )}

               <div className="flex-1 bg-slate-950 p-8 rounded-[2.5rem] font-mono text-[12px] text-indigo-200 border border-white/5 space-y-3 overflow-y-auto custom-scrollbar shadow-inner min-h-[400px]">
                  {scanLogs.length === 0 && <p className="opacity-40 italic text-center py-20 uppercase tracking-widest">Fleet standing by.</p>}
                  {scanLogs.map((log, i) => (
                    <div key={i} className="flex gap-4 opacity-90 animate-in fade-in slide-in-from-left-2 duration-300">
                       <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                       <span className="leading-relaxed">{log}</span>
                    </div>
                  ))}
               </div>
            </div>
          ) : activeTab === 'results' ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {qualifiedResults.length > 0 ? (
                <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
                  <div className="px-10 py-8 border-b-2 border-slate-50 bg-white flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-4 italic">
                      <ShieldCheck size={24} className="text-emerald-600" />
                      Qualified - Overage Identified
                    </h3>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm">
                      <FileSpreadsheet size={18} />
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-800 text-[8px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-5 py-5">Jurisdiction</th>
                          <th className="px-5 py-5">Property Address</th>
                          <th className="px-5 py-5">Parcel ID</th>
                          <th className="px-5 py-5">Sale Date</th>
                          <th className="px-5 py-5 text-right">Judgment</th>
                          <th className="px-5 py-5 text-right">Sold</th>
                          <th className="px-5 py-5 text-center">Net Yield</th>
                          <th className="px-5 py-5 text-center">Status</th>
                          <th className="px-5 py-5 text-right">Promote</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {qualifiedResults.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50 transition-colors group cursor-default text-[10px] font-bold text-slate-700">
                            <td className="px-5 py-6">
                               <div className="flex items-center gap-2">
                                  <span className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-[8px] font-black">{lead.state}</span>
                                  <span className="uppercase truncate max-w-[80px]">{lead.county}</span>
                               </div>
                            </td>
                            <td className="px-5 py-6 uppercase italic text-slate-900 truncate max-w-[120px]">{lead.address}</td>
                            <td className="px-5 py-6 font-mono text-[9px] opacity-60">{lead.parcelId}</td>
                            <td className="px-5 py-6 whitespace-nowrap opacity-60">{lead.saleDate}</td>
                            <td className="px-5 py-6 text-right text-rose-600 font-black">${lead.judgmentAmount.toLocaleString()}</td>
                            <td className="px-5 py-6 text-right font-black">${lead.soldAmount.toLocaleString()}</td>
                            <td className="px-5 py-6 text-center">
                               <span className="text-[12px] font-black text-emerald-600">${lead.overage.toLocaleString()}</span>
                            </td>
                            <td className="px-5 py-6 text-center">
                               <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded text-[8px] uppercase tracking-widest">Qualified</span>
                            </td>
                            <td className="px-5 py-6 text-right">
                               <button 
                                  onClick={() => promoteToWorkflow(lead)}
                                  className="p-3 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg transition-all active:scale-90"
                               >
                                 <ArrowRight size={14} />
                               </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                       <Clock size={12} /> Scan Sync: {new Date().toLocaleTimeString()}
                     </p>
                     <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Protocol v4.6 Active</span>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 space-y-10 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 shadow-inner">
                   <Target size={56} className="text-slate-100" />
                   <div className="text-center space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 uppercase italic">Standby</h3>
                      <p className="text-slate-600 font-bold max-w-sm mx-auto text-lg leading-relaxed">
                        Select your target matrix and launch the protocol to populate the table.
                      </p>
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 p-12 shadow-2xl text-center space-y-10 h-full flex flex-col justify-center">
               <Gavel size={48} className="text-slate-200 mx-auto" />
               <div className="space-y-4">
                 <h4 className="text-xl font-black text-slate-900 uppercase italic">Configure Matrix</h4>
                 <p className="text-sm text-slate-500 font-bold max-w-xs mx-auto leading-relaxed">
                   Select jurisdictions from the side panel to scan.
                 </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalCountyScanner;
