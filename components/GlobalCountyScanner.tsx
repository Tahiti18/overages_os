
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
  ArrowUpRight,
  Globe,
  DatabaseIcon,
  Search,
  ExternalLink
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { User } from '../types';
import Tooltip from './Tooltip';
import { performCountyAuctionScan } from '../lib/gemini';

/**
 * JURISDICTION REGISTRY - NATIONAL TOP 10
 */
const JURISDICTION_REGISTRY = [
  { id: 'fl-miami', name: 'Miami-Dade', state: 'FL', url: 'miamidade.realforeclose.com', type: 'HTML_TABLE' },
  { id: 'ga-fulton', name: 'Fulton', state: 'GA', url: 'fultoncountytaxcommissioner.org', type: 'PAGINATED_LIST' },
  { id: 'tx-harris', name: 'Harris', state: 'TX', url: 'hctax.net/Tax/TaxSales', type: 'PDF_MANIFEST' },
  { id: 'nc-meck', name: 'Mecklenburg', state: 'NC', url: 'mecknc.gov/TaxCollector', type: 'OPEN_LIST' },
  { id: 'ca-la', name: 'Los Angeles', state: 'CA', url: 'ttc.lacounty.gov', type: 'FORTIFIED_MOAT' },
  { id: 'wa-king', name: 'King', state: 'WA', url: 'kingcounty.gov/treasury', type: 'OPEN_PDF' },
  { id: 'sc-char', name: 'Charleston', state: 'SC', url: 'charlestoncounty.org', type: 'PAGINATED_LIST' },
  { id: 'tn-shelby', name: 'Shelby', state: 'TN', url: 'shelbycountytrustee.com', type: 'TIDAL_FLAT' },
  { id: 'oh-cuy', name: 'Cuyahoga', state: 'OH', url: 'cuyahogacounty.us/treasurer', type: 'FORTIFIED_MOAT' },
  { id: 'az-maricopa', name: 'Maricopa', state: 'AZ', url: 'treasurer.maricopa.gov', type: 'OPEN_LIST' }
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
  
  const [selectedCounties, setSelectedCounties] = useState<string[]>(['fl-miami', 'wa-king', 'nc-meck']);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [qualifiedResults, setQualifiedResults] = useState<QualifiedLead[]>([]);
  const [activeTab, setActiveTab] = useState<'matrix' | 'results' | 'terminal'>('matrix');

  const executeScannerProtocol = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs(['LAUNCHING NATIONAL FLEET: Synchronizing Statutory Channels...']);
    setActiveTab('terminal');

    const allLeads: QualifiedLead[] = [];
    const totalSteps = selectedCounties.length * 4;
    let currentStep = 0;

    for (const countyId of selectedCounties) {
      const config = JURISDICTION_REGISTRY.find(c => c.id === countyId);
      if (!config) continue;

      setScanLogs(prev => [...prev, `[${config.state}-${config.name}] NAVIGATING: ${config.url}`]);
      currentStep++;
      setScanProgress((currentStep / totalSteps) * 100);
      await new Promise(r => setTimeout(r, 600));

      try {
        setScanLogs(prev => [...prev, `[${config.name}] ANALYZING: Extraction logic for ${config.type}...`]);
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
                address: r.address || 'Address Hidden',
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
              setScanLogs(prev => [...prev, `   -> SUCCESS: Overage Identified in ${config.state}`]);
            }
          });
        }
      } catch (err) {
        setScanLogs(prev => [...prev, `[${config.name}] CRITICAL: Ingestion bridge failed.`]);
      }
      currentStep += 2;
      setScanProgress((currentStep / totalSteps) * 100);
    }

    setQualifiedResults(allLeads);
    setScanLogs(prev => [...prev, `NATIONAL SCAN COMPLETE. ${allLeads.length} leads written to production grid.`]);
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
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">Autonomous Discovery Suite</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border-2 border-slate-100 shadow-sm">
           <button onClick={() => setActiveTab('matrix')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'matrix' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Target Matrix</button>
           <button onClick={() => setActiveTab('results')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all relative ${activeTab === 'results' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Results {qualifiedResults.length > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[8px]">{qualifiedResults.length}</span>}</button>
           <button onClick={() => setActiveTab('terminal')} className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'terminal' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Terminal</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 shadow-2xl space-y-8 ring-1 ring-slate-100">
            <h4 className="text-[11px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-3">
              <Target size={18} className="text-indigo-600" /> Target National Matrix
            </h4>

            <div className="space-y-3 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
              {JURISDICTION_REGISTRY.map(county => (
                <div key={county.id} onClick={() => toggleCounty(county.id)} className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${selectedCounties.includes(county.id) ? 'bg-indigo-50 border-indigo-300' : 'bg-slate-50 border-slate-100 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${selectedCounties.includes(county.id) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                      {county.state}
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-800 uppercase leading-none mb-1">{county.name}</p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{county.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {selectedCounties.includes(county.id) && <ShieldCheck size={18} className="text-indigo-600" />}
                </div>
              ))}
            </div>

            <button onClick={executeScannerProtocol} disabled={isScanning || selectedCounties.length === 0} className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-4 border-2 border-white/10 shadow-3xl shadow-indigo-900/20">
              {isScanning ? <Loader2 size={22} className="animate-spin" /> : <Play size={22} fill="white" />}
              {isScanning ? 'Synchronizing...' : 'Launch National Fleet'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8">
           {activeTab === 'results' ? (
             <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden min-h-[600px]">
                {qualifiedResults.length > 0 ? (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 text-slate-800 text-[8px] font-black uppercase tracking-[0.2em] border-b border-slate-100">
                        <th className="px-5 py-5">ST</th>
                        <th className="px-5 py-5">County</th>
                        <th className="px-5 py-5">Address</th>
                        <th className="px-5 py-5 text-right">Overage</th>
                        <th className="px-5 py-5 text-right">Promote</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {qualifiedResults.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors group cursor-default text-[10px] font-bold text-slate-700">
                          <td className="px-5 py-6">
                             <span className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-[8px] font-black">{lead.state}</span>
                          </td>
                          <td className="px-5 py-6 uppercase">{lead.county}</td>
                          <td className="px-5 py-6 italic text-slate-900">{lead.address}</td>
                          <td className="px-5 py-6 text-right text-emerald-600 font-black">${lead.overage.toLocaleString()}</td>
                          <td className="px-5 py-6 text-right">
                             <button onClick={() => navigate('/properties/new', { state: { prefill: lead } })} className="p-3 bg-white border-2 border-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all">
                               <ArrowRight size={14} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-40 opacity-40">
                    <DatabaseIcon size={56} className="mb-6" />
                    <p className="text-sm font-black uppercase tracking-widest">National Scan Standby</p>
                  </div>
                )}
             </div>
           ) : (
             <div className="bg-slate-950 p-10 rounded-[3.5rem] font-mono text-[12px] text-indigo-200 border border-white/5 space-y-3 min-h-[600px] overflow-y-auto">
                {scanLogs.length === 0 && <p className="opacity-40 italic text-center py-40">Fleet standing by. Initiate protocol to begin discovery.</p>}
                {scanLogs.map((log, i) => (
                  <div key={i} className="flex gap-4 opacity-90 animate-in fade-in slide-in-from-left-2 duration-300">
                     <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                     <span>{log}</span>
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
