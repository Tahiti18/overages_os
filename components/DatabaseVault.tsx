
import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { 
  Database, 
  Search, 
  FileText, 
  ShieldCheck, 
  Filter, 
  Download, 
  Eye, 
  Archive, 
  Fingerprint,
  Clock,
  RefreshCw,
  Lock,
  FileSearch,
  Trash2,
  ChevronRight,
  HardDrive,
  Shield,
  Activity,
  Info,
  Unplug,
  Link,
  FolderOpen,
  LayoutGrid,
  CheckCircle2,
  MapPin,
  Plus,
  X,
  Zap
} from 'lucide-react';
import { ArtifactType, VaultArtifact, Property, CaseStatus } from '../types';
import Tooltip from './Tooltip';

// Shared Mock Properties for linking logic
const ACTIVE_PIPELINE: Property[] = [
  {
    id: 'prop-123',
    state: 'GA',
    county: 'Fulton',
    parcel_id: '14-0021-0004-012-0',
    address: '123 Peach Ave, Atlanta, GA 30303',
    tax_sale_date: '2024-01-15',
    sale_price: 150000,
    total_debt: 20000,
    surplus_amount: 130000,
    deadline_date: '2025-01-15',
    status: CaseStatus.NEW,
    created_at: '2024-02-01'
  },
  {
    id: 'prop-124',
    state: 'FL',
    county: 'Miami-Dade',
    parcel_id: '01-3136-009-1250',
    address: '888 Ocean Dr #4, Miami Beach, FL 33139',
    tax_sale_date: '2023-11-20',
    sale_price: 450000,
    total_debt: 50000,
    surplus_amount: 400000,
    deadline_date: '2024-05-20',
    status: CaseStatus.READY_FOR_REVIEW,
    created_at: '2023-12-05'
  }
];

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
    property_id: 'unlinked',
    type: ArtifactType.ORR_LETTER,
    filename: 'orr_request_discovery_draft.pdf',
    created_at: '2025-01-21 10:00',
    created_by: 'Legal Architect',
    version: '1.0',
    hash: 'a1b2...c3d4',
    is_verified: true
  }
];

const DatabaseVault: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<ArtifactType | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'stream' | 'explorer'>('stream');
  const [linkModalTarget, setLinkModalTarget] = useState<string | null>(null);

  const [artifacts, setArtifacts] = useState<VaultArtifact[]>(isLiveMode ? [] : MOCK_ARTIFACTS);

  const filtered = artifacts.filter(a => {
    const matchesSearch = a.filename.toLowerCase().includes(search.toLowerCase()) || 
                          a.property_id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || a.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const linkArtifactToCase = (artifactId: string, propertyId: string) => {
    setArtifacts(prev => prev.map(art => 
      art.id === artifactId ? { ...art, property_id: propertyId } : art
    ));
    setLinkModalTarget(null);
  };

  const getIcon = (type: ArtifactType) => {
    switch (type) {
      case ArtifactType.LEGAL_FORM: return <Archive size={20} className="text-blue-500" />;
      case ArtifactType.RESEARCH_DOSSIER: return <FileSearch size={20} className="text-amber-500" />;
      case ArtifactType.EXTRACTED_DATA: return <Database size={20} className="text-emerald-500" />;
      case ArtifactType.WATERFALL_MODEL: return <RefreshCw size={20} className="text-indigo-500" />;
      case ArtifactType.ORR_LETTER: return <FileText size={20} className="text-rose-500" />;
      default: return <FileText size={20} className="text-slate-400" />;
    }
  };

  const getPropertyForArtifact = (propertyId: string) => {
    return ACTIVE_PIPELINE.find(p => p.id === propertyId);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      {/* Linkage Modal Overlay */}
      {linkModalTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-950/40 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-3xl overflow-hidden border-2 border-slate-100 ring-1 ring-slate-100 animate-in zoom-in-95 duration-500">
              <div className="p-8 bg-slate-950 text-white flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                       <Link size={24} />
                    </div>
                    <div>
                       <h4 className="text-lg font-black uppercase tracking-tight italic">Relink to Case</h4>
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Protocol: Database Association</p>
                    </div>
                 </div>
                 <button onClick={() => setLinkModalTarget(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                    <X size={24} />
                 </button>
              </div>
              <div className="p-8 space-y-6">
                 <p className="text-sm font-bold text-slate-600 italic leading-relaxed">
                   Select an active property from the pipeline to associate this artifact with a specific claim file.
                 </p>
                 <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {ACTIVE_PIPELINE.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => linkArtifactToCase(linkModalTarget, p.id)}
                        className="w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-left hover:border-indigo-400 hover:bg-white hover:shadow-xl transition-all group flex items-center justify-between"
                      >
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                               <MapPin size={20} />
                            </div>
                            <div>
                               <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{p.address}</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{p.parcel_id} • {p.county}</p>
                            </div>
                         </div>
                         <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border-2 ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <HardDrive size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                Artifact Vault
                <span className={isLiveMode ? "text-emerald-500 animate-pulse" : "text-indigo-600 animate-pulse"}>●</span>
              </h2>
              <p className="text-slate-700 font-black uppercase tracking-widest text-[11px]">
                {isLiveMode ? 'Production Storage Grid' : 'Simulated Record Repository'}
              </p>
            </div>
          </div>
          <p className="text-slate-600 font-bold max-w-2xl leading-relaxed text-lg">
            Organization layer for claim evidence. Link AI-extracted deeds and research to active cases for court-ready packaging.
          </p>
        </div>
        
        <div className="flex bg-white p-2 rounded-[1.75rem] border-2 border-slate-100 shadow-xl ring-1 ring-slate-100">
           <button 
            onClick={() => setViewMode('stream')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 ${viewMode === 'stream' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             <LayoutGrid size={16} /> Global Stream
           </button>
           <button 
            onClick={() => setViewMode('explorer')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3 relative ${viewMode === 'explorer' ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             <FolderOpen size={16} /> Case Explorer
           </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden p-2 ring-1 ring-slate-100/50">
        <div className="bg-slate-50/50 rounded-[3.25rem] p-10 flex flex-col lg:flex-row items-center gap-8 shadow-inner">
          <div className="relative w-full lg:flex-1 group">
            <Search size={22} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
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
      {viewMode === 'stream' ? (
        <div className="bg-white rounded-[4rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100/50">
          {filtered.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-indigo-900 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-slate-100">
                    <th className="px-12 py-8">Artifact Context</th>
                    <th className="px-12 py-8">Linked Claim</th>
                    <th className="px-12 py-8 text-center">Integrity Status</th>
                    <th className="px-12 py-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((art) => {
                    const linkedProperty = getPropertyForArtifact(art.property_id);
                    return (
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
                                    <Clock size={12} /> {art.created_at}
                                </span>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 shadow-sm">
                                    <Fingerprint size={12} /> {art.hash}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-10">
                          {linkedProperty ? (
                            <div className="space-y-1">
                               <p className="text-[13px] font-black text-slate-900 uppercase truncate max-w-[200px]">{linkedProperty.address}</p>
                               <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                                 <CheckCircle2 size={12} /> Linked to Pipeline
                               </p>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setLinkModalTarget(art.id)}
                              className="flex items-center gap-3 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                            >
                               <Link size={14} /> Link Case
                            </button>
                          )}
                        </td>
                        <td className="px-12 py-10 text-center">
                          {art.is_verified ? (
                            <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 w-fit shadow-md mx-auto">
                                <ShieldCheck size={18} />
                                <span className="text-[11px] font-black uppercase tracking-widest italic">Immutable</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 text-amber-600 bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 w-fit shadow-md animate-pulse mx-auto">
                                <Clock size={18} />
                                <span className="text-[11px] font-black uppercase tracking-widest">Awaiting Review</span>
                            </div>
                          )}
                        </td>
                        <td className="px-12 py-10 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <Tooltip content="Open secure preview of artifact content.">
                              <button className="p-5 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-2xl hover:-translate-y-1 transition-all">
                                <Eye size={22} />
                              </button>
                            </Tooltip>
                            <Tooltip content="Export physical copy of legal artifact.">
                              <button className="p-5 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-2xl hover:-translate-y-1 transition-all">
                                <Download size={22} />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-48 text-center space-y-12 shadow-inner bg-slate-50/20">
               <div className="w-36 h-36 bg-white rounded-[3.5rem] flex items-center justify-center mx-auto shadow-2xl border-2 border-slate-50 group transition-all hover:scale-110">
                  {isLiveMode ? (
                    <Unplug size={72} className="text-slate-100 group-hover:text-emerald-600 transition-colors duration-500" />
                  ) : (
                    <Database size={72} className="text-slate-100 group-hover:text-indigo-600 transition-colors duration-500" />
                  )}
               </div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">
                    {isLiveMode ? 'Secure Cache Standing By' : 'Vault Inventory Dormant'}
                  </h3>
                  <p className="text-slate-600 font-bold max-w-sm mx-auto text-lg leading-relaxed">
                    {isLiveMode 
                      ? 'Your production database is synchronized. Launch a case from the intake wizard to begin populating this vault.' 
                      : 'No records match your query. Adjust filters to reveal historical simulation artifacts.'}
                  </p>
               </div>
            </div>
          )}
        </div>
      ) : (
        /* CASE EXPLORER VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
           {ACTIVE_PIPELINE.map(prop => {
              const caseArtifacts = artifacts.filter(a => a.property_id === prop.id);
              return (
                <div key={prop.id} className="bg-white rounded-[3.5rem] border-2 border-slate-100 p-10 shadow-2xl hover:border-indigo-400 hover:-translate-y-2 transition-all group ring-1 ring-slate-100">
                   <div className="flex items-center justify-between mb-8">
                      <div className="w-16 h-16 bg-slate-950 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
                         <FolderOpen size={28} />
                      </div>
                      <div className="px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm">
                         {caseArtifacts.length} Artifacts
                      </div>
                   </div>
                   
                   <div className="space-y-2 mb-10">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase truncate">{prop.address.split(',')[0]}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{prop.parcel_id} • {prop.county}</p>
                   </div>

                   <div className="space-y-3 mb-10 min-h-[120px]">
                      {caseArtifacts.length > 0 ? caseArtifacts.slice(0, 3).map(art => (
                        <div key={art.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                           <div className="p-2 bg-white rounded-lg border border-slate-200">
                              {getIcon(art.type)}
                           </div>
                           <p className="text-[11px] font-black text-slate-700 uppercase truncate">{art.filename}</p>
                        </div>
                      )) : (
                        <div className="py-10 text-center space-y-4 opacity-40">
                           <Database size={32} className="mx-auto text-slate-300" />
                           <p className="text-[10px] font-black uppercase tracking-widest">No artifacts linked</p>
                        </div>
                      )}
                      {caseArtifacts.length > 3 && (
                        <p className="text-[9px] font-black text-indigo-600 text-center uppercase tracking-widest">+ {caseArtifacts.length - 3} more files</p>
                      )}
                   </div>

                   <button 
                    onClick={() => navigate(`/properties/${prop.id}`)}
                    className="w-full py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 shadow-2xl transition-all"
                   >
                      Manage Case File <ChevronRight size={18} />
                   </button>
                </div>
              );
           })}

           <button 
             onClick={() => navigate('/properties/new')}
             className="bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3.5rem] flex flex-col items-center justify-center p-10 hover:border-indigo-400 hover:bg-white hover:shadow-2xl transition-all group"
           >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border-2 border-slate-100 group-hover:scale-110 group-hover:rotate-6 transition-all mb-6">
                 <Plus size={36} className="text-slate-300 group-hover:text-indigo-600" />
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-800">Initialize New Case</p>
           </button>
        </div>
      )}

      {/* Strategic Footer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
         <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-3xl border-2 border-white/5 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-5">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl">
                    <Lock size={24} />
                  </div>
                  <h4 className="text-2xl font-black uppercase tracking-tight italic">Cryptographic Security</h4>
               </div>
               <p className="text-base text-indigo-200/90 font-bold leading-relaxed">
                  Every commit to the Artifact Vault generates a unique digital fingerprint. Linking an artifact to a case updates its metadata trail, ensuring 100% audit accuracy for county treasury filings.
               </p>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-150 transition-transform duration-1000 rotate-12">
               <Fingerprint size={180} fill="white" />
            </div>
         </div>
         <div className="bg-white p-12 rounded-[3.5rem] border-2 border-slate-100 shadow-2xl flex items-start gap-8 hover:-translate-y-2 transition-all duration-500 ring-1 ring-slate-100/50">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner shrink-0 border border-indigo-100">
               <Zap size={40} />
            </div>
            <div className="space-y-4">
               <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Smart Association</h4>
               <p className="text-base text-slate-600 font-bold leading-relaxed">
                 Unlinked artifacts (like generic ORR requests or global research) can be promoted to specific case folders at any time. This maintains a lean inventory while keeping critical data accessible.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default DatabaseVault;
