
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
  CheckIcon, ChevronRightIcon
} from 'lucide-react';
import { Property, CaseStatus, User, UserRole, Claimant, Document, AuditEvent } from '../types';
import DocumentUpload from './DocumentUpload';
import SkipTracingHub from './SkipTracingHub';
import LienWaterfall from './LienWaterfall';
import SmartDocumentPackager from './SmartDocumentPackager';
import AttorneyHub from './AttorneyHub';
import Tooltip from './Tooltip';
import { generateOutreachArchitect } from '../lib/gemini';

// Mock Jurisdiction Rules for Auto-Transition logic
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
    
    // Check if all required types have at least one verified document
    const verifiedTypes = new Set(
      allDocs
        .filter(d => d.verified_by_human)
        .map(d => d.doc_type)
    );

    const isComplete = requiredTypes.every(type => verifiedTypes.has(type));

    if (isComplete && property.status !== CaseStatus.READY_FOR_REVIEW && property.status !== CaseStatus.APPROVED_TO_FILE && property.status !== CaseStatus.PAID) {
      setProperty(prev => ({ ...prev, status: CaseStatus.READY_FOR_REVIEW }));
      setShowStatusToast(true);
      setTimeout(() => setShowStatusToast(false), 5000);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Waterfall', icon: CalculatorIcon, tip: 'Analyze financial logic and senior lien deductions.' },
    { id: 'research', label: 'Research', icon: SparklesIcon, tip: 'AI-powered skip tracing and social verification.' },
    { id: 'claimants', label: 'Claimants', icon: UserCircleIcon, tip: 'Manage owner/heir verification and contact info.' },
    { id: 'outreach', label: 'Outreach', icon: MessageSquareIcon, tip: 'Generate personalized recovery notices and scripts.' },
    { id: 'legal', label: 'Legal Counsel', icon: GavelIcon, tip: 'Research and assign specialized attorneys for complex jurisdictions.' },
    { id: 'packager', label: 'Packager', icon: ArchiveIcon, tip: 'Assemble final claim affidavits and demand letters.' },
    { id: 'documents', label: 'Docs', icon: FileTextIcon, tip: 'Repository for deeds, IDs, and tax bill artifacts.' },
    { id: 'audit', label: 'Audit Log', icon: ListChecksIcon, tip: 'Historical trail of all system and human actions.' },
  ];

  const handleOutreachGen = async () => {
    setOutreachLoading(true);
    try {
      const data = await generateOutreachArchitect(property.claimants![0], property, "Lived at 123 Peach for 20 years, owns a small business in Atlanta.");
      setOutreachData(data);
    } catch (e) { console.error(e); } finally { setOutreachLoading(false); }
  };

  const verifyClaimant = (claimantId: string) => {
    // Role Gate: Only Admin or Reviewer
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.REVIEWER) {
      alert("UNAUTHORIZED: Explicit approval for 'Verified Owner' status requires a REVIEWER or ADMIN role.");
      return;
    }

    const claimant = property.claimants?.find(c => c.id === claimantId);
    if (!claimant) return;

    if (!window.confirm(`AUTHORIZATION REQUIRED: You are about to grant 'Verified Owner' status to ${claimant.name}. \n\nThis confirms you have audited the existing ${verifiedDocs.length} legal artifacts and confirm they match this claimant's identity. This action is permanently logged for statutory compliance.`)) {
      return;
    }

    const timestamp = new Date().toLocaleString();

    // Update Property State
    setProperty(prev => ({
      ...prev,
      claimants: prev.claimants?.map(c => c.id === claimantId ? {
        ...c, 
        is_verified: true, 
        verified_at: timestamp,
        verified_by_user_id: user.id, 
        verified_by_email: user.email
      } : c)
    }));

    // Add Audit Event
    const newAudit: AuditEvent = {
      id: `audit-${Date.now()}`,
      entity_type: 'CLAIMANT',
      entity_id: claimantId,
      action: 'CLAIMANT_VERIFIED_OWNER',
      metadata: { 
        claimant_name: claimant.name,
        approver_id: user.id,
        approver_role: user.role,
        evidence_count: verifiedDocs.length,
        evidence_files: verifiedDocs.map(d => d.filename)
      },
      created_at: timestamp,
      actor_email: user.email
    };

    setAuditEvents(prev => [newAudit, ...prev]);
  };

  const canVerify = user.role === UserRole.ADMIN || user.role === UserRole.REVIEWER;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20 relative">
      {/* Auto-Transition Toast */}
      {showStatusToast && (
        <div className="fixed top-24 right-10 z-[60] animate-in slide-in-from-right-10 duration-500">
           <div className="bg-slate-900 border border-indigo-500/30 text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-5 ring-8 ring-indigo-500/10">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
                 <ZapIcon size={24} fill="white" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Intelligence Pipeline Update</p>
                 <p className="text-sm font-black">Case Promoted: <span className="text-indigo-400">Ready for Review</span></p>
                 <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">All jurisdictional document requirements satisfied.</p>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tooltip content="Return to the main case pipeline dashboard.">
            <Link to="/" className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
              <ChevronLeftIcon size={20} />
            </Link>
          </Tooltip>
          <div>
            <h2 className="text-2xl font-black text-slate-900">{property.address}</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-400 text-sm font-mono uppercase">ID: {property.parcel_id} • Priority: {property.priority_score || 92}</p>
              <Tooltip content="The current stage of this case in the automated recovery lifecycle.">
                <div className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all cursor-help ${
                  property.status === CaseStatus.READY_FOR_REVIEW ? 'bg-indigo-50 text-indigo-600 border-indigo-200 shadow-sm animate-pulse' : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {property.status.replace(/_/g, ' ')}
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Tooltip content="Authoritatively lock in the intelligence findings for this record.">
            <button className="px-6 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center gap-2">
              <CheckCircleIcon size={18} /> Finalize Intelligence
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-8 px-8 overflow-x-auto shadow-sm">
        {tabs.map((tab) => (
          <Tooltip key={tab.id} content={tab.tip}>
            <button 
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex items-center gap-2 py-5 border-b-4 font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          </Tooltip>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'legal' && <AttorneyHub state={property.state} county={property.county} />}
        {activeTab === 'claimants' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             {/* Claimant Verification Protocol Header */}
             <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner border border-indigo-100">
                      <UserCheckIcon size={32} />
                   </div>
                   <div>
                      <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Claimant Verification Protocol</h4>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Status: {property.claimants?.every(c => c.is_verified) ? 'Fully Authorized' : 'Audit in Progress'}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Artifacts Audited</p>
                      <p className="text-lg font-black text-indigo-600">{verifiedDocs.length} Records</p>
                   </div>
                   <div className="w-px h-10 bg-slate-100 mx-2"></div>
                   <Tooltip content="Add a potential heir or owner found during skip tracing.">
                     <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2">
                       <UserCircleIcon size={14} /> Add Prospect
                     </button>
                   </Tooltip>
                </div>
             </div>

             <div className="grid grid-cols-1 gap-8">
                {property.claimants?.map(c => (
                  <div key={c.id} className={`bg-white border-2 rounded-[3.5rem] overflow-hidden transition-all duration-500 shadow-sm relative ${c.is_verified ? 'border-emerald-500/30' : 'border-slate-100 hover:border-indigo-200'}`}>
                     {c.is_verified && (
                       <div className="absolute top-10 right-10 z-20 pointer-events-none opacity-20">
                          <div className="w-40 h-40 rounded-full border-[10px] border-emerald-500 flex items-center justify-center rotate-12">
                             <span className="text-emerald-500 font-black text-2xl uppercase tracking-tighter">Verified Artifact</span>
                          </div>
                       </div>
                     )}

                     <div className="p-10 flex flex-col xl:flex-row gap-12">
                        {/* Profile Info */}
                        <div className="flex items-center gap-8 xl:w-1/3">
                           <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center font-black text-4xl border-4 transition-all duration-700 ${c.is_verified ? 'bg-emerald-50 text-emerald-600 border-emerald-500 shadow-2xl shadow-emerald-100 rotate-3' : 'bg-indigo-50 text-indigo-600 border-indigo-50 shadow-inner'}`}>
                             {c.name[0]}
                           </div>
                           <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{c.name}</h4>
                                {c.is_verified ? (
                                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full border-2 border-emerald-200 shadow-sm animate-in zoom-in duration-500 ring-4 ring-emerald-50">
                                    <ShieldCheckIcon size={16} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.1em]">Verified Owner</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full border-2 border-amber-100 animate-pulse">
                                    <ShieldAlertIcon size={16} />
                                    <span className="text-[11px] font-black uppercase tracking-[0.1em]">Authorization Pending</span>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <FingerprintIcon size={14} className="text-indigo-400" /> {c.relationship} • {c.contact_info}
                              </p>
                           </div>
                        </div>

                        {/* Evidence Summary */}
                        <div className="flex-1 bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col gap-6">
                           <div className="flex items-center justify-between">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <FileCheckIcon size={14} className="text-indigo-600" /> Statutory Evidence Linkage
                              </h5>
                              <span className="text-[9px] font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-lg">Required Docs Met</span>
                           </div>
                           <div className="flex flex-wrap gap-4">
                              {verifiedDocs.length > 0 ? verifiedDocs.map(d => (
                                <div key={d.id} className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm group/ev">
                                   <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                      <CheckIcon size={14} strokeWidth={3} />
                                   </div>
                                   <div>
                                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{d.filename}</p>
                                      <p className="text-[8px] font-bold text-slate-400 uppercase">{d.doc_type}</p>
                                   </div>
                                </div>
                              )) : (
                                <div className="text-center py-4 w-full">
                                   <p className="text-xs font-bold text-slate-400 italic">No verified artifacts currently linked to this profile.</p>
                                </div>
                              )}
                           </div>
                        </div>

                        {/* Action Area */}
                        <div className="xl:w-1/4 flex flex-col justify-center items-end gap-4">
                           {!c.is_verified ? (
                             <Tooltip content={canVerify ? "Grant explicit 'Verified Owner' status. This requires auditing all linked documents." : "Requires REVIEWER or ADMIN role to authorize."}>
                               <button 
                                 onClick={() => verifyClaimant(c.id)} 
                                 disabled={!canVerify}
                                 className={`w-full group py-5 px-8 rounded-3xl text-xs font-black uppercase tracking-[0.15em] shadow-2xl flex items-center justify-center gap-3 transition-all duration-300 ${canVerify ? 'bg-indigo-600 text-white shadow-indigo-200 hover:scale-[1.02] hover:-translate-y-1 active:scale-95' : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed opacity-60'}`}
                               >
                                 <SignatureIcon size={20} className="group-hover:rotate-12 transition-transform" />
                                 Authorize Claim
                               </button>
                             </Tooltip>
                           ) : (
                             <div className="bg-emerald-600 text-white rounded-3xl p-8 w-full flex flex-col gap-4 shadow-2xl shadow-emerald-100 animate-in slide-in-from-right-4 duration-700 relative overflow-hidden group">
                                <div className="relative z-10">
                                  <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.2em] mb-3">Verification Authorized By</p>
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-black border border-white/30 shadow-lg">
                                      {c.verified_by_email ? c.verified_by_email[0].toUpperCase() : 'A'}
                                    </div>
                                    <div className="overflow-hidden">
                                      <p className="text-sm font-black truncate">{c.verified_by_email?.split('@')[0]}</p>
                                      <p className="text-[10px] font-bold text-emerald-100 opacity-80 uppercase tracking-widest">Lvl 4 Reviewer</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-[10px] font-black text-emerald-200 mt-5 pt-4 border-t border-white/10">
                                    <ClockIcon size={12} />
                                    {c.verified_at}
                                  </div>
                                </div>
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                                   <ShieldCheckIcon size={120} fill="white" />
                                </div>
                             </div>
                           )}
                        </div>
                     </div>

                     {/* Audit Rationale Drawer */}
                     <div className={`p-10 border-t-2 border-slate-100 transition-all duration-700 ${c.is_verified ? 'bg-emerald-50/30' : 'bg-slate-50/50'}`}>
                        <div className="flex items-center gap-4 mb-6">
                           <div className={`p-2 rounded-xl shadow-sm ${c.is_verified ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                              <SparklesIcon size={18} />
                           </div>
                           <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Audit Logic Rationale</h5>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                           <div className="space-y-4">
                              <p className="text-xs text-slate-600 leading-relaxed font-bold border-l-4 border-indigo-500 pl-6 py-2 italic bg-white/40 rounded-r-2xl">
                                 "{c.verification_rationale}"
                              </p>
                              <div className="flex items-center gap-3">
                                 <Tooltip content="The statistical probability that this claimant is the true legal owner based on artifact matching.">
                                   <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm cursor-help">
                                      <span className="text-[10px] font-black text-slate-400 uppercase">Match Score</span>
                                      <span className="text-sm font-black text-indigo-600">{(c.confidence_score || 0) * 100}%</span>
                                   </div>
                                 </Tooltip>
                                 <Tooltip content="Overall risk profile based on jurisdictional complexity and document clarity.">
                                   <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm cursor-help">
                                      <span className="text-[10px] font-black text-slate-400 uppercase">Risk Index</span>
                                      <span className="text-sm font-black text-emerald-600 uppercase tracking-tighter">Low-Friction</span>
                                   </div>
                                 </Tooltip>
                              </div>
                           </div>
                           
                           {/* Compliance Checklist */}
                           <div className="bg-white/60 rounded-[2rem] border border-slate-200 p-8 space-y-4">
                              <h6 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Compliance Checklist</h6>
                              <div className="space-y-3">
                                 {[
                                   { l: 'Identity Document Authenticated', s: true },
                                   { l: 'Tax Sale Deed Link Confirmed', s: true },
                                   { l: 'Senior Lienholder Exhaustion Audited', s: true },
                                   { l: 'No Competing Heirs Identified', s: true }
                                 ].map((check, i) => (
                                   <div key={i} className="flex items-center justify-between px-2">
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">{check.l}</span>
                                      <CheckIcon size={14} className="text-emerald-500" />
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                   <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                     <ListChecksIcon size={20} className="text-indigo-600" /> Compliance Audit Trail
                   </h4>
                   <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-widest">Case Activity</span>
                </div>
                <div className="divide-y divide-slate-100">
                   {auditEvents.map((event) => (
                     <div key={event.id} className="p-8 hover:bg-slate-50/50 transition-colors flex items-start gap-6">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                          event.action === 'CLAIMANT_VERIFIED_OWNER' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                        }`}>
                          {event.action === 'CLAIMANT_VERIFIED_OWNER' ? <ShieldCheckIcon size={20} /> : <ClockIcon size={20} />}
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{event.action.replace(/_/g, ' ')}</p>
                              <span className="text-[10px] font-bold text-slate-400">{event.created_at}</span>
                           </div>
                           <div className="flex flex-wrap gap-4 mt-1">
                              <div className="flex items-center gap-2">
                                 <UserCircleIcon size={14} className="text-slate-400" />
                                 <span className="text-xs font-bold text-slate-600">{event.actor_email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <ShieldIcon size={14} className="text-slate-400" />
                                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{event.entity_type} ID: {event.entity_id}</span>
                              </div>
                           </div>
                           {event.metadata && (
                              <div className="mt-4 p-4 bg-slate-100/50 rounded-xl border border-slate-200/50">
                                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Metadata Log</p>
                                 <pre className="text-[11px] font-mono text-slate-700">{JSON.stringify(event.metadata, null, 2)}</pre>
                              </div>
                           )}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'outreach' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="max-w-xl">
                      <div className="flex items-center gap-3 mb-4">
                         <MessageSquareIcon size={24} className="text-indigo-400" />
                         <h3 className="text-2xl font-black">Outreach Architect</h3>
                      </div>
                      <p className="text-indigo-200 text-sm leading-relaxed mb-8">Generate high-conversion, legally compliant outreach materials grounded in deep skip-tracing findings.</p>
                      {!outreachData && (
                        <Tooltip content="Ask Gemini to draft personalized recovery notices based on skip-trace dossier findings.">
                          <button onClick={handleOutreachGen} disabled={outreachLoading} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-950 flex items-center gap-2">
                            {outreachLoading ? <Loader2Icon className="animate-spin" size={16}/> : <Wand2Icon size={16}/>} Generate Personalized Copy
                          </button>
                        </Tooltip>
                      )}
                   </div>
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
             </div>

             {outreachData && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-700">
                  <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                     <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h5 className="font-black text-slate-800 flex items-center gap-2 uppercase text-[10px] tracking-widest"><MailIcon size={14} className="text-indigo-600"/> Direct Mail Artifact</h5>
                        <Tooltip content="Copy drafted letter content to clipboard.">
                          <button className="p-2 text-slate-400 hover:text-indigo-600"><CopyIcon size={16}/></button>
                        </Tooltip>
                     </div>
                     <div className="font-serif text-sm text-slate-700 leading-relaxed whitespace-pre-wrap p-4 bg-slate-50 rounded-2xl border border-slate-100">{outreachData.direct_mail}</div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
                       <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                          <h5 className="font-black text-slate-800 flex items-center gap-2 uppercase text-[10px] tracking-widest"><MessageSquareIcon size={14} className="text-indigo-600"/> SMS Protocol</h5>
                          <Tooltip content="Copy drafted SMS script.">
                            <button className="p-2 text-slate-400 hover:text-indigo-600"><CopyIcon size={16}/></button>
                          </Tooltip>
                       </div>
                       <div className="text-xs font-bold text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">"{outreachData.sms_script}"</div>
                    </div>
                    <div className="bg-indigo-900 rounded-3xl p-8 text-white space-y-4 shadow-2xl">
                       <h5 className="font-black flex items-center gap-2 uppercase text-[10px] tracking-widest text-indigo-300"><PhoneIcon size={14}/> Phone Consultant Script</h5>
                       <div className="text-xs font-medium leading-relaxed opacity-80 whitespace-pre-wrap">{outreachData.phone_script}</div>
                    </div>
                  </div>
               </div>
             )}
          </div>
        )}

        {activeTab === 'overview' && <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 space-y-8"><div className="grid grid-cols-1 md:grid-cols-3 gap-4"><div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sale Price</p><p className="text-2xl font-black text-slate-900">${property.sale_price.toLocaleString()}</p></div><div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Debt</p><p className="text-2xl font-black text-red-600">${property.total_debt.toLocaleString()}</p></div><div className="bg-indigo-600 p-6 rounded-3xl border border-indigo-500 shadow-2xl shadow-indigo-200"><p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Gross Surplus</p><p className="text-2xl font-black text-white">${property.surplus_amount.toLocaleString()}</p></div></div><LienWaterfall property={property} initialSurplus={property.surplus_amount} /></div></div>}
        {activeTab === 'research' && <SkipTracingHub ownerName="John Doe" address={property.address} />}
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
