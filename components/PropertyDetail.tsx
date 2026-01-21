
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useLocation, useOutletContext } from 'react-router-dom';
import { 
  Building2Icon, UserCircleIcon, FileTextIcon, HistoryIcon, ScaleIcon,
  ChevronLeftIcon, CheckCircleIcon, SearchIcon, MapPinIcon, CalendarIcon,
  InfoIcon, ArrowDownIcon, SparklesIcon, CalculatorIcon, ArchiveIcon,
  ShieldCheckIcon, UserCheckIcon, ClockIcon, MailIcon, MessageSquareIcon,
  Wand2Icon, CopyIcon, PhoneIcon, Loader2Icon, ShieldAlertIcon,
  UserXIcon, FingerprintIcon, ZapIcon, ListChecksIcon, ShieldIcon,
  GavelIcon, ClipboardCheckIcon, UserIcon, FileCheckIcon, SignatureIcon,
  CheckIcon, ChevronRightIcon,
  DollarSignIcon,
  ActivityIcon,
  // Added missing icons for line 229 and 341
  PlusCircleIcon,
  DatabaseIcon
} from 'lucide-react';
import { Property, CaseStatus, User, UserRole, Claimant, Document, AuditEvent } from '../types';
import DocumentUpload from './DocumentUpload';
import SkipTracingHub from './SkipTracingHub';
import LienWaterfall from './LienWaterfall';
import SmartDocumentPackager from './SmartDocumentPackager';
import AttorneyHub from './AttorneyHub';
import Tooltip from './Tooltip';
import { generateOutreachArchitect } from '../lib/gemini';

const JURISDICTION_REQUIREMENTS: Record<string, string[]> = {
  'GA-Fulton': ['ID', 'DEED', 'TAX_BILL'],
  'FL-Miami-Dade': ['ID', 'AFFIDAVIT', 'APPLICATION'],
  'TX-Harris': ['ID', 'DEED', 'AFFIDAVIT']
};

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useOutletContext<{ user: User }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'claimants' | 'research' | 'documents' | 'audit' | 'packager' | 'outreach' | 'legal'>('overview');
  const [outreachLoading, setOutreachLoading] = useState(false);
  const [outreachData, setOutreachData] = useState<any>(null);
  const [showStatusToast, setShowStatusToast] = useState(false);
  const [verifiedDocs, setVerifiedDocs] = useState<Document[]>([]);
  
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    {
      id: 'a1',
      entity_type: 'PROPERTY',
      entity_id: id || '1',
      action: 'CASE_INITIALIZED',
      metadata: { source: 'GA_TAX_COMMISSIONER' },
      created_at: '2024-02-01 09:00:00',
      actor_email: 'system@prospector.ai'
    }
  ]);

  const [property, setProperty] = useState<Property>({
    id: id || '1',
    state: 'GA', county: 'Fulton', parcel_id: '14-0021-0004-012-0',
    address: '123 Peach Ave, Atlanta, GA 30303', tax_sale_date: '2024-01-15',
    sale_price: 150000, total_debt: 20000, surplus_amount: 130000,
    deadline_date: '2025-01-15', status: CaseStatus.NEW, created_at: '2024-02-01',
    claimants: [{ 
      id: 'c1', 
      name: 'John Doe', 
      relationship: 'OWNER', 
      is_verified: false, 
      contact_info: 'john.doe@example.com', 
      confidence_score: 0.95, 
      verification_rationale: "Name on Tax Deed matches skip-tracing record. Secondary social media verification confirmed address history for the last 10 years." 
    }]
  });

  const handleDocumentVerificationChange = (allDocs: Document[]) => {
    setVerifiedDocs(allDocs.filter(d => d.verified_by_human));
    const key = `${property.state}-${property.county}`;
    const requiredTypes = JURISDICTION_REQUIREMENTS[key] || JURISDICTION_REQUIREMENTS['GA-Fulton'];
    
    const verifiedTypes = new Set(allDocs.filter(d => d.verified_by_human).map(d => d.doc_type));
    const isComplete = requiredTypes.every(type => verifiedTypes.has(type));

    if (isComplete && property.status === CaseStatus.NEW) {
      setProperty(prev => ({ ...prev, status: CaseStatus.READY_FOR_REVIEW }));
      setShowStatusToast(true);
      setTimeout(() => setShowStatusToast(false), 5000);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Financials', icon: CalculatorIcon, tip: 'Analyze financial logic and senior lien deductions.' },
    { id: 'research', label: 'Skip-Trace', icon: SparklesIcon, tip: 'AI-powered skip tracing and social verification.' },
    { id: 'claimants', label: 'Claimants', icon: UserCircleIcon, tip: 'Manage owner/heir verification and contact info.' },
    { id: 'outreach', label: 'Outreach', icon: MessageSquareIcon, tip: 'Generate personalized recovery notices and scripts.' },
    { id: 'legal', label: 'Counsel', icon: GavelIcon, tip: 'Research and assign specialized attorneys.' },
    { id: 'packager', label: 'Packager', icon: ArchiveIcon, tip: 'Assemble final claim affidavits and demand letters.' },
    { id: 'documents', label: 'Artifacts', icon: FileTextIcon, tip: 'Repository for deeds, IDs, and tax bill artifacts.' },
    { id: 'audit', label: 'Audit Log', icon: ListChecksIcon, tip: 'Historical trail of all system and human actions.' },
  ];

  const handleOutreachGen = async () => {
    setOutreachLoading(true);
    try {
      const data = await generateOutreachArchitect(property.claimants![0], property, "Lived at 123 Peach for 20 years.");
      setOutreachData(data);
    } catch (e) { console.error(e); } finally { setOutreachLoading(false); }
  };

  const verifyClaimant = (claimantId: string) => {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.REVIEWER) {
      alert("UNAUTHORIZED: Reviewer or Admin credentials required.");
      return;
    }

    const claimant = property.claimants?.find(c => c.id === claimantId);
    if (!claimant) return;

    if (!window.confirm(`AUTHORIZE CLAIMANT: Confirm that all evidence matches ${claimant.name}?`)) return;

    const timestamp = new Date().toLocaleString();
    setProperty(prev => ({
      ...prev,
      claimants: prev.claimants?.map(c => c.id === claimantId ? {
        ...c, is_verified: true, verified_at: timestamp, verified_by_user_id: user.id, verified_by_email: user.email
      } : c)
    }));

    setAuditEvents(prev => [{
      id: `audit-${Date.now()}`,
      entity_type: 'CLAIMANT',
      entity_id: claimantId,
      action: 'CLAIMANT_VERIFIED_OWNER',
      metadata: { claimant_name: claimant.name, approver: user.email },
      created_at: timestamp,
      actor_email: user.email
    }, ...prev]);
  };

  const canVerify = user.role === UserRole.ADMIN || user.role === UserRole.REVIEWER;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32 relative">
      {/* Promotion Toast */}
      {showStatusToast && (
        <div className="fixed bottom-10 right-10 z-[60] animate-in slide-in-from-right-10 duration-500">
           <div className="bg-slate-900 border border-indigo-500/30 text-white p-6 rounded-[2.5rem] shadow-2xl flex items-center gap-6 ring-8 ring-indigo-500/10">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
                 <ZapIcon size={28} fill="white" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Intelligence Sync</p>
                 <p className="text-sm font-black italic">Case Promoted to Review Status.</p>
                 <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Document requirements satisfied.</p>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="p-4 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all text-slate-400 hover:text-indigo-600 shadow-sm active:scale-95">
            <ChevronLeftIcon size={20} />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic">{property.address}</h2>
            <div className="flex items-center gap-4 mt-1">
              <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">APN: {property.parcel_id} • Score: {property.priority_score}</p>
              <div className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                property.status === CaseStatus.READY_FOR_REVIEW ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {property.status.replace(/_/g, ' ')}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-8 py-4 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-2xl shadow-indigo-100 transition-all flex items-center gap-3 active:scale-95">
            <CheckCircleIcon size={20} /> Finalize Audit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 flex items-center gap-10 px-10 overflow-x-auto shadow-sm no-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`flex items-center gap-3 py-6 border-b-4 font-black text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2Icon size={14} /> Sale Gross
                  </p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">${property.sale_price.toLocaleString()}</p>
               </div>
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40">
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest flex items-center gap-2">
                    <ArrowDownIcon size={14} /> Senior Liens
                  </p>
                  <p className="text-3xl font-black text-red-600 tracking-tighter">-${property.total_debt.toLocaleString()}</p>
               </div>
               <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between h-40">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest flex items-center gap-2">
                    <DollarSignIcon size={14} /> Recovery Pool
                  </p>
                  <p className="text-3xl font-black text-white tracking-tighter">${property.surplus_amount.toLocaleString()}</p>
               </div>
            </div>
            <LienWaterfall property={property} initialSurplus={property.surplus_amount} />
          </div>
        )}

        {activeTab === 'claimants' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-indigo-50 rounded-[1.75rem] flex items-center justify-center text-indigo-600 shadow-inner">
                      <UserCheckIcon size={40} />
                   </div>
                   <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Verification Protocol</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Status: {property.claimants?.every(c => c.is_verified) ? 'Fully Authorized' : 'Audit In-Progress'}</p>
                   </div>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                  <PlusCircleIcon size={16} className="inline mr-2" /> Add Potential Heir
                </button>
             </div>

             <div className="grid grid-cols-1 gap-8">
                {property.claimants?.map(c => (
                  <div key={c.id} className={`bg-white border-2 rounded-[4rem] overflow-hidden transition-all duration-500 shadow-sm relative ${c.is_verified ? 'border-emerald-500/30' : 'border-slate-100'}`}>
                     <div className="p-12 flex flex-col xl:flex-row gap-12">
                        <div className="flex items-center gap-8 xl:w-1/3">
                           <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center font-black text-5xl border-4 transition-all duration-700 ${c.is_verified ? 'bg-emerald-50 text-emerald-600 border-emerald-500 shadow-xl' : 'bg-slate-50 text-slate-300 border-slate-100'}`}>
                             {c.name[0]}
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{c.name}</h4>
                              <div className="flex flex-wrap items-center gap-3 mt-2">
                                {c.is_verified ? (
                                  <span className="flex items-center gap-2 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    <ShieldCheckIcon size={14} /> Verified Owner
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    <ShieldAlertIcon size={14} /> Pending Review
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{c.relationship} • {c.contact_info}</p>
                           </div>
                        </div>

                        <div className="flex-1 bg-slate-50/50 rounded-[3rem] p-10 border border-slate-100 space-y-6">
                           <div className="flex items-center justify-between">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                <FileCheckIcon size={16} className="text-indigo-600" /> Linked Evidence
                              </h5>
                           </div>
                           <div className="flex flex-wrap gap-4">
                              {verifiedDocs.length > 0 ? verifiedDocs.map(d => (
                                <div key={d.id} className="bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                      <CheckIcon size={18} strokeWidth={3} />
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black text-slate-800 uppercase leading-none mb-1">{d.filename}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{d.doc_type}</p>
                                   </div>
                                </div>
                              )) : <p className="text-xs font-bold text-slate-400 italic">No verified artifacts currently linked.</p>}
                           </div>
                        </div>

                        <div className="xl:w-1/4 flex flex-col justify-center items-end">
                           {!c.is_verified ? (
                             <button 
                               onClick={() => verifyClaimant(c.id)} 
                               disabled={!canVerify}
                               className={`w-full py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all flex items-center justify-center gap-3 ${canVerify ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] active:scale-95' : 'bg-slate-200 text-slate-400 opacity-60 cursor-not-allowed'}`}
                             >
                               <SignatureIcon size={20} /> Verify Identity
                             </button>
                           ) : (
                             <div className="bg-emerald-600 text-white rounded-[2rem] p-8 w-full shadow-2xl shadow-emerald-100 border border-emerald-500">
                                <p className="text-[9px] font-black text-emerald-200 uppercase tracking-widest mb-4">Authorized Agent</p>
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black">
                                    {c.verified_by_email?.[0].toUpperCase()}
                                  </div>
                                  <div className="overflow-hidden">
                                    <p className="text-xs font-black truncate">{c.verified_by_email?.split('@')[0]}</p>
                                    <p className="text-[9px] font-bold text-emerald-100 opacity-80 uppercase tracking-widest">Compliance Reviewer</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-100">
                                  <ClockIcon size={12} /> {c.verified_at}
                                </div>
                             </div>
                           )}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white border border-slate-200 rounded-[3rem] shadow-sm overflow-hidden">
                <div className="p-10 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                   <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-4 italic">
                     <ListChecksIcon size={24} className="text-indigo-600" /> Statutory Audit Log
                   </h4>
                   <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">Case Genesis</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar">
                   {auditEvents.map((event) => (
                     <div key={event.id} className="p-10 hover:bg-slate-50/50 transition-colors flex items-start gap-8">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                          event.action === 'CLAIMANT_VERIFIED_OWNER' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-inner' : 'bg-slate-50 text-slate-300 border-slate-100'
                        }`}>
                          {event.action === 'CLAIMANT_VERIFIED_OWNER' ? <ShieldCheckIcon size={24} /> : <ActivityIcon size={24} />}
                        </div>
                        <div className="flex-1 space-y-4">
                           <div className="flex items-center justify-between">
                              <p className="text-lg font-black text-slate-900 uppercase tracking-tight">{event.action.replace(/_/g, ' ')}</p>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{event.created_at}</span>
                           </div>
                           <div className="flex flex-wrap gap-6">
                              <div className="flex items-center gap-2">
                                 <UserIcon size={14} className="text-slate-400" />
                                 <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{event.actor_email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <DatabaseIcon size={14} className="text-slate-400" />
                                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{event.entity_type} {event.entity_id}</span>
                              </div>
                           </div>
                           {event.metadata && (
                              <div className="p-6 bg-slate-950 text-indigo-100 rounded-2xl font-mono text-[11px] border border-white/5 shadow-inner">
                                 <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">Audit Snapshot</p>
                                 <pre className="opacity-80 leading-relaxed">{JSON.stringify(event.metadata, null, 2)}</pre>
                              </div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'research' && <SkipTracingHub ownerName="John Doe" address={property.address} />}
        {activeTab === 'legal' && <AttorneyHub state={property.state} county={property.county} />}
        {activeTab === 'outreach' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-white/5">
                <div className="relative z-10 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-600 rounded-2xl">
                         <MessageSquareIcon size={24} />
                      </div>
                      <h3 className="text-4xl font-black tracking-tighter uppercase italic">Outreach Architect</h3>
                   </div>
                   <p className="text-indigo-200 text-lg font-medium max-w-2xl leading-relaxed">
                     Generate high-fidelity, legally-grounded outreach scripts optimized for {property.county} claimants.
                   </p>
                   {!outreachData && (
                     <button onClick={handleOutreachGen} disabled={outreachLoading} className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-3">
                       {outreachLoading ? <Loader2Icon className="animate-spin" size={20}/> : <Wand2Icon size={20}/>}
                       {outreachLoading ? 'Architecting Copy...' : 'Draft Recovery Notice'}
                     </button>
                   )}
                </div>
                <div className="absolute top-0 right-0 p-16 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-1000">
                   <SparklesIcon size={140} fill="white" />
                </div>
             </div>
             {outreachData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                   <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-10 space-y-6 shadow-sm">
                      <h5 className="font-black text-slate-900 uppercase text-[11px] tracking-widest flex items-center gap-3 border-b border-slate-50 pb-4"><MailIcon size={18} className="text-indigo-600"/> Recovery Letter</h5>
                      <div className="font-serif text-sm text-slate-700 leading-relaxed whitespace-pre-wrap p-8 bg-slate-50 rounded-2xl border border-slate-100">{outreachData.direct_mail}</div>
                   </div>
                   <div className="space-y-8">
                      <div className="bg-white rounded-[3rem] border-2 border-slate-100 p-10 space-y-6 shadow-sm">
                         <h5 className="font-black text-slate-900 uppercase text-[11px] tracking-widest flex items-center gap-3 border-b border-slate-50 pb-4"><MessageSquareIcon size={18} className="text-indigo-600"/> SMS Protocol</h5>
                         <div className="text-sm font-bold text-slate-800 italic bg-slate-50 p-6 rounded-2xl border border-slate-100 leading-relaxed">"{outreachData.sms_script}"</div>
                      </div>
                      <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-2xl space-y-6">
                         <h5 className="font-black flex items-center gap-3 uppercase text-[11px] tracking-widest text-indigo-300"><PhoneIcon size={18}/> Scripted Consultation</h5>
                         <div className="text-sm font-medium leading-relaxed opacity-80 whitespace-pre-wrap">{outreachData.phone_script}</div>
                      </div>
                   </div>
                </div>
             )}
          </div>
        )}

        {activeTab === 'packager' && <SmartDocumentPackager property={property} waterfallData={{ finalSurplus: 81500 }} />}
        {activeTab === 'documents' && (
          <DocumentUpload 
            propertyId={property.id} 
            propertyState={property.state} 
            propertyCounty={property.county} 
            onVerificationChange={handleDocumentVerificationChange} 
          />
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
