
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useOutletContext } from 'react-router-dom';
import { 
  Building2Icon, 
  UserCircleIcon, 
  FileTextIcon, 
  HistoryIcon, 
  ScaleIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  InfoIcon,
  ArrowDownIcon,
  SparklesIcon,
  CalculatorIcon,
  ArchiveIcon,
  ShieldCheckIcon,
  UserCheckIcon,
  ClockIcon,
  MailIcon
} from 'lucide-react';
import { Property, CaseStatus, User, UserRole, Claimant } from '../types';
import DocumentUpload from './DocumentUpload';
import SkipTracingHub from './SkipTracingHub';
import LienWaterfall from './LienWaterfall';
import SmartDocumentPackager from './SmartDocumentPackager';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { user } = useOutletContext<{ user: User }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'claimants' | 'research' | 'documents' | 'audit' | 'packager'>('overview');
  
  const [property, setProperty] = useState<Property>({
    id: id || '1',
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
    created_at: '2024-02-01',
    claimants: [
      {
        id: 'c1',
        name: 'John Doe',
        relationship: 'OWNER',
        is_verified: false,
        contact_info: 'john.doe@example.com'
      }
    ]
  });

  // Sync tab with URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['overview', 'claimants', 'research', 'documents', 'audit', 'packager'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location]);

  const tabs = [
    { id: 'overview', label: 'Waterfall', icon: CalculatorIcon },
    { id: 'research', label: 'Research', icon: SparklesIcon },
    { id: 'packager', label: 'Packager', icon: ArchiveIcon },
    { id: 'claimants', label: 'Claimants', icon: UserCircleIcon },
    { id: 'documents', label: 'Docs', icon: FileTextIcon },
    { id: 'audit', label: 'History', icon: HistoryIcon },
  ];

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.NEW: return 'bg-blue-100 text-blue-800 border-blue-200';
      case CaseStatus.READY_FOR_REVIEW: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const verifyClaimant = (claimantId: string) => {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.REVIEWER) {
      alert("Insufficient permissions. Manual verification requires REVIEWER role.");
      return;
    }

    setProperty(prev => ({
      ...prev,
      claimants: prev.claimants?.map(c => c.id === claimantId ? {
        ...c,
        is_verified: true,
        verified_at: new Date().toISOString().split('T')[0],
        verified_by_user_id: user.id,
        verified_by_email: user.email
      } : c)
    }));
  };

  const isReviewer = user.role === UserRole.ADMIN || user.role === UserRole.REVIEWER;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-3 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all text-slate-400 hover:text-indigo-600 shadow-sm">
            <ChevronLeftIcon size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900">{property.address}</h2>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border shadow-sm ${getStatusColor(property.status)}`}>
                {property.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-mono mt-1">APN: {property.parcel_id} • Fulton County, GA</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-200 transition-all flex items-center gap-2">
            <CheckCircleIcon size={18} />
            Finalize Intelligence
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 flex items-center gap-8 px-8 overflow-x-auto shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-5 border-b-4 font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sale Price</p>
                  <p className="text-2xl font-black text-slate-900">${property.sale_price.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Debt</p>
                  <p className="text-2xl font-black text-red-600">${property.total_debt.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-600 p-6 rounded-3xl border border-indigo-500 shadow-2xl shadow-indigo-200">
                  <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Gross Surplus</p>
                  <p className="text-2xl font-black text-white">${property.surplus_amount.toLocaleString()}</p>
                </div>
              </div>

              <LienWaterfall initialSurplus={property.surplus_amount} />

              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
                 <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
                   <Building2Icon size={18} className="text-indigo-600" />
                   Property Summary
                 </h3>
                 <div className="grid grid-cols-2 gap-8">
                   <div className="p-4 bg-slate-50 rounded-2xl">
                     <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Jurisdiction</label>
                     <p className="text-sm font-black text-slate-800">{property.county}, {property.state}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl">
                     <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Tax Sale Date</label>
                     <p className="text-sm font-black text-slate-800">{property.tax_sale_date}</p>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon size={20} className="text-indigo-400" />
                    <h4 className="font-black text-xl">Next Milestone</h4>
                  </div>
                  <p className="text-indigo-200 text-xs leading-relaxed mb-8">
                    Skip tracing and lien analysis are pending. Once verified, use the Smart Packager to generate final claim forms.
                  </p>
                  <button 
                    onClick={() => setActiveTab('research')}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-950"
                  >
                    Go To Research
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'claimants' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                <UserCircleIcon className="text-indigo-600" />
                Case Claimants
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                Add New Heir
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {property.claimants && property.claimants.length > 0 ? (
                property.claimants.map(claimant => (
                  <div key={claimant.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-indigo-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border shadow-inner ${claimant.is_verified ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                        {claimant.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <p className="text-lg font-black text-slate-900">{claimant.name}</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${claimant.is_verified ? 'bg-green-100 text-green-800 border-green-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                            {claimant.is_verified ? 'Verified' : 'Pending Verification'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{claimant.relationship}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                            <MailIcon size={12} className="text-slate-400" />
                            {claimant.contact_info}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-end gap-3 w-full md:w-auto">
                      {claimant.is_verified ? (
                        <div className="text-right space-y-1">
                          <div className="flex items-center justify-end gap-2 text-green-600">
                            <ShieldCheckIcon size={16} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Authorized by {claimant.verified_by_email}</p>
                          </div>
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            <ClockIcon size={12} />
                            <p className="text-[9px] font-bold uppercase tracking-tighter">Verified on {claimant.verified_at}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="hidden md:flex flex-col items-end mr-2">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reviewer Action Req.</p>
                             <p className="text-[9px] text-slate-500 font-bold">Requires manual doc validation</p>
                          </div>
                          <button 
                            onClick={() => verifyClaimant(claimant.id)}
                            disabled={!isReviewer}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg ${isReviewer ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                          >
                            <UserCheckIcon size={16} />
                            Authorize Claimant
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-32 bg-white rounded-3xl border border-slate-200">
                  <UserCircleIcon size={64} className="mx-auto text-slate-100 mb-4" />
                  <h4 className="font-black text-slate-800">No Claimants Found</h4>
                  <p className="text-slate-400 text-sm">Research the owner to find eligible heirs.</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
              <InfoIcon size={24} className="text-amber-500 shrink-0 mt-1" />
              <div className="space-y-1">
                <h5 className="font-black text-amber-900 text-sm uppercase tracking-tight">Manual Verification Protocols</h5>
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Under GA Rule 47-B, surplus recovery claims must be authorized by a certified legal reviewer. 
                  Please ensure you have physically reviewed the <span className="font-black">Owner Affidavit</span> and <span className="font-black">Mailing Proof</span> in the Docs tab before clicking Authorize.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <SkipTracingHub ownerName="John Doe" address={property.address} />
        )}

        {activeTab === 'packager' && (
          <SmartDocumentPackager property={property} waterfallData={{ finalSurplus: 81500 }} />
        )}

        {activeTab === 'documents' && (
          <DocumentUpload propertyId={property.id} />
        )}

        {activeTab === 'audit' && (
           <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
                  <HistoryIcon size={18} className="text-indigo-600" />
                  Case Audit Log
                </h3>
             </div>
             <div className="divide-y divide-slate-100">
                {property.claimants?.filter(c => c.is_verified).map(c => (
                  <div key={c.id} className="p-6 flex items-start gap-4">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <ShieldCheckIcon size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Claimant Authorized</p>
                      <p className="text-xs text-slate-500 mt-0.5">User <span className="font-black text-slate-700">{c.verified_by_email}</span> manually verified <span className="font-black text-slate-700">{c.name}</span> as the rightful recovery agent.</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{c.verified_at}</p>
                    </div>
                  </div>
                ))}
                <div className="p-6 flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <HistoryIcon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Case Initialized</p>
                    <p className="text-xs text-slate-500 mt-0.5">Property record imported into the recovery pipeline.</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{property.created_at}</p>
                  </div>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
