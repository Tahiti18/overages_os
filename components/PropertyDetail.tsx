
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
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
  CalculatorIcon
} from 'lucide-react';
import { Property, CaseStatus } from '../types';
import DocumentUpload from './DocumentUpload';
import SkipTracingHub from './SkipTracingHub';
import LienWaterfall from './LienWaterfall';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'claimants' | 'research' | 'documents' | 'audit'>('overview');
  
  // Sync tab with URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['overview', 'claimants', 'research', 'documents', 'audit'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [location]);

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
    { id: 'overview', label: 'Waterfall & Overview', icon: CalculatorIcon },
    { id: 'research', label: 'Research Hub', icon: SparklesIcon },
    { id: 'claimants', label: 'Claimants', icon: UserCircleIcon },
    { id: 'documents', label: 'Documents', icon: FileTextIcon },
    { id: 'audit', label: 'History', icon: HistoryIcon },
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
            Approve Intelligence
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

              {/* Lien Waterfall Component */}
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
                    <h4 className="font-black text-xl">Intelligence</h4>
                  </div>
                  <p className="text-indigo-200 text-xs leading-relaxed mb-8">
                    Gemini 3.0 Flash is ready to perform skip tracing on the owner of record using Google Search Grounding.
                  </p>
                  <button 
                    onClick={() => setActiveTab('research')}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-950"
                  >
                    Launch Research Hub
                  </button>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl"></div>
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
          <div className="text-center py-32 bg-white rounded-3xl border border-slate-200">
            <UserCircleIcon size={64} className="mx-auto text-slate-100 mb-4" />
            <h4 className="font-black text-slate-800">No Claimants Found</h4>
            <p className="text-slate-400 text-sm">Perform skip tracing to identify eligible heirs and relatives.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetail;
