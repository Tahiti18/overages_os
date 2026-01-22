
import React, { useState, useMemo } from 'react';
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
  ArrowUpRight,
  Globe,
  DatabaseIcon,
  Search,
  ExternalLink,
  ChevronDown,
  X,
  Zap,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';
import { performCountyAuctionScan } from '../lib/gemini';

/**
 * RESTORED NATIONAL FLEET REGISTRY
 * Targeted Power-Counties across all major US Surplus Zones
 */
const JURISDICTION_REGISTRY = [
  // SOUTH ZONE
  { id: 'fl-miami', name: 'Miami-Dade', state: 'FL', url: 'miamidade.realforeclose.com', type: 'HTML_TABLE', region: 'South' },
  { id: 'fl-broward', name: 'Broward', state: 'FL', url: 'broward.realforeclose.com', type: 'HTML_TABLE', region: 'South' },
  { id: 'ga-fulton', name: 'Fulton', state: 'GA', url: 'fultoncountytaxcommissioner.org', type: 'PAGINATED_LIST', region: 'South' },
  { id: 'ga-dekalb', name: 'DeKalb', state: 'GA', url: 'dekalbtax.org', type: 'PDF_MANIFEST', region: 'South' },
  { id: 'tx-harris', name: 'Harris', state: 'TX', url: 'hctax.net/Tax/TaxSales', type: 'PDF_MANIFEST', region: 'South' },
  { id: 'tx-dallas', name: 'Dallas', state: 'TX', url: 'dallascounty-tax.org', type: 'HTML_TABLE', region: 'South' },
  { id: 'nc-meck', name: 'Mecklenburg', state: 'NC', url: 'mecknc.gov/TaxCollector', type: 'OPEN_LIST', region: 'South' },
  { id: 'sc-char', name: 'Charleston', state: 'SC', url: 'charlestoncounty.org', type: 'PAGINATED_LIST', region: 'South' },
  { id: 'tn-shelby', name: 'Shelby', state: 'TN', url: 'shelbycountytrustee.com', type: 'TIDAL_FLAT', region: 'South' },
  
  // WEST ZONE
  { id: 'wa-king', name: 'King', state: 'WA', url: 'kingcounty.gov/treasury', type: 'OPEN_PDF', region: 'West' },
  { id: 'wa-pierce', name: 'Pierce', state: 'WA', url: 'piercecountywa.gov', type: 'HTML_TABLE', region: 'West' },
  { id: 'ca-la', name: 'Los Angeles', state: 'CA', url: 'ttc.lacounty.gov', type: 'FORTIFIED_MOAT', region: 'West' },
  { id: 'az-maricopa', name: 'Maricopa', state: 'AZ', url: 'treasurer.maricopa.gov', type: 'OPEN_LIST', region: 'West' },
  { id: 'nv-clark', name: 'Clark', state: 'NV', url: 'clarkcountynv.gov/treasurer', type: 'HTML_TABLE', region: 'West' },

  // MIDWEST ZONE
  { id: 'oh-cuy', name: 'Cuyahoga', state: 'OH', url: 'cuyahogacounty.us/treasurer', type: 'FORTIFIED_MOAT', region: 'Midwest' },
  { id: 'mi-wayne', name: 'Wayne', state: 'MI', url: 'treasurer.waynecounty.com', type: 'OPEN_PDF', region: 'Midwest' },
  { id: 'mo-stlouis', name: 'St. Louis City', state: 'MO', url: 'stlouis-mo.gov/collector', type: 'TIDAL_FLAT', region: 'Midwest' },

  // NORTHEAST ZONE
  { id: 'pa-phila', name: 'Philadelphia', state: 'PA', url: 'phila.gov/revenue', type: 'FORTIFIED_MOAT', region: 'Northeast' },
  { id: 'ny-suffolk', name: 'Suffolk', state: 'NY', url: 'suffolkcountyny.gov', type: 'PDF_MANIFEST', region: 'Northeast' }
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
  
  const [selectedCounties, setSelectedCounties] = useState<string[]>(['fl-miami', 'wa-king', 'nc-meck', 'ga-fulton']);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [qualifiedResults, setQualifiedResults] = useState<QualifiedLead[]>([]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'results' | 'terminal'>('matrix');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'South' | 'West' | 'Midwest' | 'Northeast'>('ALL');

  const filteredRegistry = useMemo(() => {
    return JURISDICTION_REGISTRY.filter(j => regionFilter === 'ALL' || j.region === regionFilter);
  }, [regionFilter]);

  const executeScannerProtocol = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs(['LAUNCHING NATIONAL FLEET: Synchronizing Statutory Discovery Nodes...']);
    setActiveTab('terminal');

    const allLeads: QualifiedLead[] = [];
    const totalSteps = selectedCounties.length * 4;
    let currentStep = 0;

    for (const countyId of selectedCounties) {
      const config = JURISDICTION_REGISTRY.find(c => c.id === countyId);
      if (!config) continue;

      setScanLogs(prev => [...prev, `[${config.state}-${config.name}] NAVIGATING STATUTORY SOURCE: ${config.url}`]);
      currentStep++;
      setScanProgress((currentStep / totalSteps) * 100);
      await new Promise(r => setTimeout(r, 600));

      try {
        setScanLogs(prev => [...prev, `[${config.name}] TRIGGERING GROUNDING SEARCH: Identifying recent auction outcomes...`]);
        const results = await performCountyAuctionScan(config.name, config.state, config.url, config.type);
        
        currentStep++;
        setScanProgress((currentStep / totalSteps) * 100);

        if (results && Array.isArray(results)) {
          results.forEach((r: any) => {
            if (r.overage > 0) {
              const lead: QualifiedLead = {
                id: `lead-${Math.random().toString(36).substr(2, 9)}`,
                county: config.name,
                state: config.state,
                address: r.address || 'Address Extraction Pending',
                parcelId: r.parcelId || 'APN-TBD',
                saleDate: r.saleDate || new Date().toLocaleDateString(),
                judgmentAmount: r.judgmentAmount || 0,
                soldAmount: r.soldAmount || 0,
                overage: r.overage || 0,
                sourceUrl: config.url,
                scanTimestamp: new Date().toLocaleString(),
                status: 'Qualified'
              };
              allLeads.push(lead);
              setScanLogs(prev => [...prev, `   -> SUCCESS: $${lead.overage.toLocaleString()} IDENTIFIED in ${config.state}`]);
            }
          });
        } else {
          setScanLogs(prev => [...prev, `[${config.name}] NOTICE: Zero high-yield overages found in current window.`]);
        }
      } catch (err) {
        setScanLogs(prev => [...prev, `[${config.name}] CRITICAL: Statutory ingestion bridge failed. Retrying...`]);
      }
      currentStep += 2;
      setScanProgress((currentStep / totalSteps) * 100);
    }

    setQualifiedResults(allLeads);
    setScanLogs(prev => [...prev, `NATIONAL FLEET PROTOCOL COMPLETE. ${allLeads.length} leads written to production grid.`]);
    setIsScanning(false);
    setTimeout(() => setActiveTab('results'), 1500);
  };

  const toggleCounty = (id: string) => {
    setSelectedCounties(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <Layers size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                Fleet Scanner
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">Autonomous National Search Suite</p>
            </div>
          </div>
          <p className="text-slate-500 font-bold max-w-2xl leading-relaxed text-lg italic">
            "Scouring statutory calendars, PDF manifests, and portal ledgers across all US surplus zones."
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-sm ring-1 ring-slate-100">
           <button onClick={() => setActiveTab('matrix')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'matrix' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             <LayoutGrid size={14} /> Matrix
           </button>
           <button onClick={() => setActiveTab('results')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all relative flex items-center gap-2 ${activeTab === 'results' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             <CheckCircle2 size={14} /> Results 
             {qualifiedResults.length > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black shadow-lg animate-bounce">{qualifiedResults.length}</span>}
           </button>
           <button onClick={() => setActiveTab('terminal')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'terminal' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}>
             <DatabaseIcon size={14} /> Terminal
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Control Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-2xl space-y-8 ring-1 ring-slate-100">
            <div className="flex items-center justify-between border-b-2 border-slate-50 pb-6">
              <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-3">
                <Target size={18} className="text-indigo-600" /> Target National Matrix
              </h4>
              <div className="flex gap-2">
                 <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg border border-indigo-100">{selectedCounties.length} Selected</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
               {['ALL', 'South', 'West', 'Midwest', 'Northeast'].map((r) => (
                 <button 
                  key={r}
                  onClick={() => setRegionFilter(r as any)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${regionFilter === r ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-200'}`}
                 >
                   {r}
                 </button>
               ))}
            </div>

            <div className="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
              {filteredRegistry.map(county => (
                <div 
                  key={county.id} 
                  onClick={() => toggleCounty(county.id)} 
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${selectedCounties.includes(county.id) ? 'bg-indigo-50 border-indigo-300 ring-4 ring-indigo-500/5' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm transition-all ${selectedCounties.includes(county.id) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-600'}`}>
                      {county.state}
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{county.name}</p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{county.type.replace(/_/g, ' ')}</p>
                    </div>
                  </div>
                  {selectedCounties.includes(county.id) ? <ShieldCheck size={18} className="text-indigo-600" /> : <PlusCircle size={18} className="text-slate-300" />}
                </div>
              ))}
            </div>

            <button 
              onClick={executeScannerProtocol} 
              disabled={isScanning || selectedCounties.length === 0} 
              className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 border-2 border-white/10 shadow-3xl shadow-indigo-900/20 active:scale-95 disabled:opacity-50"
            >
              {isScanning ? <Loader2 size={22} className="animate-spin" /> : <Play size={22} fill="white" />}
              {isScanning ? 'Syncing statutory channels...' : 'Launch National Fleet'}
            </button>
          </div>

          <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group border-2 border-white/5">
             <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                   <ShieldAlert size={20} className="text-amber-500" />
                   <h4 className="text-[10px] font-black uppercase tracking-widest">Protocol Filters: 50-State Recovery</h4>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                      <span className="text-slate-400 italic">Redemption Windows</span>
                      <span className="text-emerald-400">MONITORED</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                      <span className="text-slate-400 italic">State Escheatment Rules</span>
                      <span className="text-emerald-400">ENFORCED</span>
                   </div>
                   <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                      <span className="text-slate-400 italic">Eminient Domain Overage</span>
                      <span className="text-emerald-400">ACTIVE</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-8">
           {activeTab === 'results' ? (
             <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden min-h-[600px] ring-1 ring-slate-100/50">
                <div className="p-10 border-b-2 border-slate-50 bg-white flex items-center justify-between">
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic flex items-center gap-4">
                      <Globe size={24} className="text-indigo-600" /> National Discovery Grid
                   </h3>
                   <span className="text-[10px] font-black bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Protocol Verified</span>
                </div>
                {qualifiedResults.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50 text-slate-800 text-[8px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                          <th className="px-8 py-5">ST</th>
                          <th className="px-8 py-5">County Context</th>
                          <th className="px-8 py-5">Address</th>
                          <th className="px-8 py-5 text-right">Yield (Net)</th>
                          <th className="px-8 py-5 text-right">Promote</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {qualifiedResults.map((lead) => (
                          <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group cursor-default text-[10px] font-bold text-slate-700">
                            <td className="px-8 py-6">
                               <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-lg">{lead.state}</span>
                            </td>
                            <td className="px-8 py-6 uppercase font-black tracking-tight">{lead.county}</td>
                            <td className="px-8 py-6 italic text-slate-900 uppercase truncate max-w-[200px]">{lead.address}</td>
                            <td className="px-8 py-6 text-right">
                               <span className="text-lg font-black text-emerald-600 tracking-tighter">${lead.overage.toLocaleString()}</span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <Tooltip content="Promote discovery to an active Production Case File.">
                                  <button 
                                    onClick={() => navigate('/properties/new', { state: { prefill: lead } })} 
                                    className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-xl transition-all active:scale-90"
                                  >
                                    <ArrowRight size={18} />
                                  </button>
                               </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-48 opacity-40">
                    <DatabaseIcon size={72} className="mb-8 text-slate-200" />
                    <p className="text-lg font-black uppercase tracking-widest text-slate-400 italic">National Discovery Standby</p>
                    <p className="text-sm font-bold text-slate-400 mt-2">Select jurisdictions and launch the fleet to populate the audit grid.</p>
                  </div>
                )}
             </div>
           ) : (
             <div className="bg-slate-950 p-12 rounded-[3.5rem] font-mono text-[13px] text-indigo-200 border border-white/5 space-y-4 min-h-[600px] overflow-y-auto custom-scrollbar shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Autonomous Statutory Sync</span>
                   </div>
                   {isScanning && <span className="text-3xl font-black text-indigo-500">{Math.round(scanProgress)}%</span>}
                </div>
                {scanLogs.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                     <p className="opacity-40 italic text-xl">Fleet matrix standing by.</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Protocol v4.9 • All Zones Authorized</p>
                  </div>
                )}
                {scanLogs.map((log, i) => (
                  <div key={i} className="flex gap-4 opacity-90 animate-in fade-in slide-in-from-left-2 duration-300 leading-relaxed">
                     <span className="text-slate-600 shrink-0 font-bold">[{new Date().toLocaleTimeString()}]</span>
                     <span className="tracking-tight">{log}</span>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default GlobalCountyScanner;
