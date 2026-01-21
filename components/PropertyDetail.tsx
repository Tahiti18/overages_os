
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2Icon, 
  UserCircleIcon, 
  FileTextIcon, 
  HistoryIcon, 
  ScaleIcon,
  ChevronLeftIcon,
  CheckCircleIcon,
  ExternalLinkIcon,
  UploadIcon,
  MoreVerticalIcon,
  SearchIcon,
  MapPinIcon,
  DollarSignIcon,
  CalendarIcon,
  InfoIcon
} from 'lucide-react';
import { Property, CaseStatus } from '../types';
import DocumentUpload from './DocumentUpload';
import SkipTracingHub from './SkipTracingHub';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'claimants' | 'research' | 'documents' | 'audit'>('overview');
  
  // Mocking data retrieval
  const property: Property = {
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
    created_at: '2024-02-01'
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2Icon },
    { id: 'research', label: 'Research Hub', icon: SearchIcon },
    { id: 'claimants', label: 'Claimants', icon: UserCircleIcon },
    { id: 'documents', label: 'Documents', icon: FileTextIcon },
    { id: 'audit', label: 'History & Audit', icon: HistoryIcon },
  ];

  const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case CaseStatus.NEW: return 'bg-blue-100 text-blue-800 border-blue-200';
      case CaseStatus.READY_FOR_REVIEW: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case CaseStatus.APPROVED_TO_FILE: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case CaseStatus.FILED: return 'bg-purple-100 text-purple-800 border-purple-200';
      case CaseStatus.PAID: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
      {/* Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all text-slate-400 hover:text-slate-600">
            <ChevronLeftIcon size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">{property.address}</h2>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest border ${getStatusColor(property.status)}`}>
                {property.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-mono mt-1">Parcel ID: {property.parcel_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-xl transition-all">
            Edit Details
          </button>
          <button className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
            <CheckCircleIcon size={18} />
            Mark Ready
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="bg-white border-b border-slate-200 flex items-center gap-8 px-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 py-4 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-8">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sale Price</p>
                  <p className="text-xl font-bold text-slate-800">${property.sale_price.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Debt</p>
                  <p className="text-xl font-bold text-red-600">${property.total_debt.toLocaleString()}</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Estimated Surplus</p>
                  <p className="text-xl font-bold text-indigo-700">${property.surplus_amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Case Details Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">Case Specification</h3>
                  <button className="text-indigo-600 text-xs font-bold hover:underline">View Public Record</button>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                      <MapPinIcon size={14} /> Jurisdiction
                    </label>
                    <p className="text-sm font-semibold text-slate-700">{property.county} County, {property.state}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                      <CalendarIcon size={14} /> Tax Sale Date
                    </label>
                    <p className="text-sm font-semibold text-slate-700">{property.tax_sale_date}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                      <ScaleIcon size={14} /> Claim Deadline
                    </label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-orange-600">{property.deadline_date}</p>
                      <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded border border-orange-100 font-bold uppercase">Expiring Soon</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                      <InfoIcon size={14} /> Assigned Agent
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-bold">JD</div>
                      <p className="text-sm font-semibold text-slate-700">John Doe (Recovery Team)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-bold text-lg mb-2">Next Step</h4>
                  <p className="text-indigo-200 text-xs leading-relaxed mb-4">
                    Verify owner identity and perform skip tracing to locate contact information for the claimant.
                  </p>
                  <button 
                    onClick={() => setActiveTab('research')}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                  >
                    Go to Research Hub
                  </button>
                </div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-400/30 transition-all"></div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Case Statistics</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Days Active</span>
                    <span className="text-xs font-bold text-slate-800">14 Days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Docs Verified</span>
                    <span className="text-xs font-bold text-slate-800">1 / 4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Confidence Score</span>
                    <span className="text-xs font-bold text-green-600">88%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'research' && (
          <SkipTracingHub ownerName="John Doe" address={property.address} />
        )}

        {activeTab === 'documents' && (
          <DocumentUpload propertyId={property.id} />
        )}

        {activeTab === 'claimants' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center animate-in fade-in duration-300">
            <UserCircleIcon size={48} className="text-slate-200 mx-auto mb-4" />
            <h4 className="font-bold text-slate-800">No Claimants Identified</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
              Run skip tracing in the Research Hub to identify potential heirs or former owners who may be eligible for these funds.
            </p>
            <button 
              onClick={() => setActiveTab('research')}
              className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all uppercase tracking-widest"
            >
              Start Discovery
            </button>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">System Audit Trail</h4>
              <button className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest hover:underline">Download Log</button>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { action: 'Case Initialized', user: 'admin@prospector.ai', time: 'Feb 01, 2024 • 09:12 AM' },
                { action: 'Document Uploaded (tax_bill_2023.pdf)', user: 'admin@prospector.ai', time: 'Feb 01, 2024 • 09:14 AM' },
                { action: 'AI Extraction Completed', user: 'Prospector AI Core', time: 'Feb 01, 2024 • 09:14 AM' },
              ].map((event, i) => (
                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      <HistoryIcon size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{event.action}</p>
                      <p className="text-[10px] text-slate-400 font-medium">By {event.user}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{event.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
