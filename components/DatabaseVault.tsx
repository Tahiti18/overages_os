
import React, { useState } from 'react';
import { 
  DatabaseIcon, 
  SearchIcon, 
  FileTextIcon, 
  ShieldCheckIcon, 
  FilterIcon, 
  DownloadIcon, 
  EyeIcon, 
  ArchiveIcon, 
  FingerprintIcon,
  ClockIcon,
  RefreshCwIcon,
  LockIcon,
  FileSearchIcon,
  Trash2Icon,
  ChevronRightIcon,
  HardDriveIcon,
  ShieldIcon,
  ActivityIcon,
  InfoIcon
} from 'lucide-react';
import { ArtifactType, VaultArtifact } from '../types';
import Tooltip from './Tooltip';

const MOCK_ARTIFACTS: VaultArtifact[] = [
  {
    id: 'art-1',
    property_id: 'prop-123',
    type: ArtifactType.LEGAL_FORM,
    filename: 'demand_letter_ga_fulton.pdf',
    created_at: '2025-01-20 14:30',
    created_by: 'Gemini 3.0 Pro',
    version: '1.2',
    hash: '8f2e...4a1b',
    content_preview: 'Pursuant to O.C.G.A. § 48-4-5, request is hereby made...',
    is_verified: true
  },
  {
    id: 'art-2',
    property_id: 'prop-124',
    type: ArtifactType.RESEARCH_DOSSIER,
    filename: 'skip_trace_john_doe.json',
    created_at: '2025-01-19 09:15',
    created_by: 'Skip-Trace Engine v2',
    version: '1.0',
    hash: '3d9a...bc92',
    content_preview: 'Target identified at primary residence in Decatur, GA...',
    is_verified: false
  },
  {
    id: 'art-3',
    property_id: 'prop-123',
    type: ArtifactType.WATERFALL_MODEL,
    filename: 'waterfall_audit_v4.xlsx',
    created_at: '2025-01-18 16:45',
    created_by: 'Financial Engine',
    version: '4.0',
    hash: 'ef72...da31',
    is_verified: true
  },
  {
    id: 'art-4',
    property_id: 'prop-125',
    type: ArtifactType.ORR_LETTER,
    filename: 'orr_request_miami_dade.pdf',
    created_at: '2025-01-21 10:00',
    created_by: 'Legal Architect',
    version: '1.0',
    hash: 'a1b2...c3d4',
    is_verified: true
  }
];

const DatabaseVault: React.FC = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ArtifactType | 'ALL'>('ALL');

  const filtered = MOCK_ARTIFACTS.filter(a => {
    const matchesSearch = a.filename.toLowerCase().includes(search.toLowerCase()) || 
                          a.property_id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || a.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (type: ArtifactType) => {
    switch (type) {
      case ArtifactType.LEGAL_FORM: return <ArchiveIcon size={20} className="text-blue-500" />;
      case ArtifactType.RESEARCH_DOSSIER: return <FileSearchIcon size={20} className="text-amber-500" />;
      case ArtifactType.EXTRACTED_DATA: return <DatabaseIcon size={20} className="text-emerald-500" />;
      case ArtifactType.WATERFALL_MODEL: return <RefreshCwIcon size={20} className="text-indigo-500" />;
      case ArtifactType.ORR_LETTER: return <FileTextIcon size={20} className="text-rose-500" />;
      default: return <FileTextIcon size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-slate-950 rounded-[1.5rem] shadow-2xl border-2 border-white/10 ring-8 ring-indigo-500/5 text-indigo-400">
              <HardDriveIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                Artifact Vault
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">
                Central Enterprise Database
              </p>
            </div>
          </div>
          <p className="text-slate-600 font-bold max-w-2xl leading-relaxed text-lg">
            Automatic Archival Protocol. Every case artifact is committed to this vault with a unique SHA-256 hash to ensure legal chain-of-custody.
          </p>
        </div>
        <div className="flex items-center gap-6 bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-xl">
           <div className="flex flex-col items-end">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Database Health</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-xs font-black text-slate-900 uppercase">Synchronized</p>
              </div>
           </div>
           <div className="w-px h-10 bg-slate-100"></div>
           <ShieldIcon size={28} className="text-indigo-600" />
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden p-2 ring-1 ring-slate-100/50">
        <div className="bg-slate-50/50 rounded-[3.25rem] p-10 flex flex-col lg:flex-row items-center gap-8 shadow-inner">
          <div className="relative w-full lg:flex-1 group">
            <SearchIcon size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Query Vault by filename, hash, or property context..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-3xl pl-20 pr-8 py-6 text-base font-black outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all shadow-inner placeholder:text-slate-400"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
             {['ALL', ...Object.values(ArtifactType)].map(t => (
               <button 
                 key={t}
                 onClick={() => setActiveFilter(t as any)}
                 className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                   activeFilter === t ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl' : 'bg-white text-slate-500 border-slate-100 hover:border-indigo-200'
                 }`}
               >
                 {t.replace(/_/g, ' ')}
               </button>
             ))}
          </div>
        </div>
      </div>

      {/* Artifact Inventory */}
      <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-indigo-900 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-slate-100">
                <th className="px-12 py-8">Artifact Metadata</th>
                <th className="px-12 py-8">System Commit</th>
                <th className="px-12 py-8">Integrity Status</th>
                <th className="px-12 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/50 transition-all group cursor-default">
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-8">
                      <div className={`w-16 h-16 rounded-[1.5rem] bg-white border-2 flex items-center justify-center shadow-xl group-hover:rotate-3 transition-transform ${art.is_verified ? 'border-emerald-200' : 'border-slate-100'}`}>
                        {getIcon(art.type)}
                      </div>
                      <div>
                        <p className="text-xl font-black text-slate-900 tracking-tight uppercase italic mb-2">{art.filename}</p>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <ClockIcon size={12} /> {art.created_at}
                           </span>
                           <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 shadow-sm">
                              <FingerprintIcon size={12} /> {art.hash}
                           </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                     <p className="text-base font-black text-slate-800 uppercase leading-none mb-2">{art.created_by}</p>
                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ActivityIcon size={12} /> Revision {art.version}
                     </p>
                  </td>
                  <td className="px-12 py-10">
                    {art.is_verified ? (
                       <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 w-fit shadow-md">
                          <ShieldCheckIcon size={18} />
                          <span className="text-[11px] font-black uppercase tracking-widest italic">Immutable Lock</span>
                       </div>
                    ) : (
                       <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 w-fit shadow-md animate-pulse">
                          <ClockIcon size={18} />
                          <span className="text-[11px] font-black uppercase tracking-widest">Awaiting Review</span>
                       </div>
                    )}
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <Tooltip content="Open secure preview of artifact content.">
                        <button className="p-5 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-2xl hover:-translate-y-1 transition-all">
                          <EyeIcon size={22} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Export physical copy of legal artifact.">
                        <button className="p-5 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-1 transition-all">
                          <DownloadIcon size={22} />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="p-48 text-center space-y-12 shadow-inner bg-slate-50/20">
             <div className="w-36 h-36 bg-white rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl border-2 border-slate-50 group transition-all hover:scale-110">
                <DatabaseIcon size={72} className="text-slate-100 group-hover:text-indigo-600 transition-colors duration-500" />
             </div>
             <div className="space-y-4">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Vault Inventory Dormant</h3>
                <p className="text-slate-600 font-bold max-w-sm mx-auto text-lg leading-relaxed">No records match your query. Launch an <span className="text-indigo-600">Intake Process</span> to commit new artifacts.</p>
             </div>
          </div>
        )}
      </div>

      {/* Strategic Footer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-3xl border-2 border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-5">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl">
                    <LockIcon size={24} />
                  </div>
                  <h4 className="text-2xl font-black uppercase tracking-tight italic">Cryptographic Security</h4>
               </div>
               <p className="text-base text-indigo-200/90 font-bold leading-relaxed">
                  Every commit to the Artifact Vault generates a unique digital fingerprint. This ensures that court-filed documents are 100% consistent with the system-generated originals.
               </p>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-150 transition-transform duration-1000 rotate-12">
               <FingerprintIcon size={180} fill="white" />
            </div>
         </div>
         <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl flex items-start gap-8 hover:-translate-y-2 transition-all duration-500 ring-1 ring-slate-100/50">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shrink-0 border border-indigo-100">
               <InfoIcon size={40} />
            </div>
            <div className="space-y-4">
               <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Retention & Compliance</h4>
               <p className="text-base text-slate-600 font-bold leading-relaxed">
                 All data within the vault is mirrored across multi-regional availability zones. Statutory retention policies are applied per jurisdiction (standard 7-year audit window).
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DatabaseVault;
