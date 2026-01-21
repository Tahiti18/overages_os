
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
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  InfoIcon
} from 'lucide-react';
import { Property, CaseStatus } from '../types';
import DocumentUpload from './DocumentUpload';
import SkipTracingHub from './SkipTracingHub';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'claimants' | 'research' | 'documents' | 'audit'>('overview');
  
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
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
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
          <button className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
            <CheckCircleIcon size={18} />
            Mark Ready
          </button>
        </div>
      </div>

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

      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-8">
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
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                 <h3 className="font-bold text-slate-800 mb-6">Case Summary</h3>
                 <div className="grid grid-cols-2 gap-8">
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Jurisdiction</label>
                     <p className="text-sm font-semibold">{property.county}, {property.state}</p>
                   </div>
                   <div>
                     <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Tax Sale Date</label>
                     <p className="text-sm font-semibold">{property.tax_sale_date}</p>
                   </div>
                 </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                <h4 className="font-bold text-lg mb-2">Next Step</h4>
                <p className="text-indigo-200 text-xs leading-relaxed mb-4">
                  Run skip tracing to locate contact information for the owner of record.
                </p>
                <button 
                  onClick={() => setActiveTab('research')}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                  Open Research Hub
                </button>
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
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <UserCircleIcon size={48} className="mx-auto text-slate-200 mb-4" />
            <h4 className="font-bold">No Claimants Found</h4>
            <p className="text-slate-500 text-sm">Perform skip tracing to identify eligible heirs.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
