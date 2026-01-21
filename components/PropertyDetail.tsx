
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
  MoreVerticalIcon
} from 'lucide-react';
import { Property, CaseStatus, Document } from '../types';
import DocumentUpload from './DocumentUpload';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'claimants' | 'documents' | 'audit'>('overview');
  
  // Mocking data retrieval
  const property: Property = {
    id: '1',
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
    { id: 'claimants', label: 'Claimants', icon: UserCircleIcon },
    { id: 'documents', label: 'Documents', icon: FileTextIcon },
    { id: 'audit', label: 'History & Audit', icon: HistoryIcon },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <ChevronLeftIcon size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-800">{property.address}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wider">
                {property.status.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <span className="font-mono font-medium">{property.parcel_id}</span>
              <span>•</span>
              <span>{property.county}, {property.state}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            Assign Case
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            Advance to Review
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Dynamic Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-white border-b border-slate-200 px-2 flex gap-1 rounded-t-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? 'border-indigo-600 text-indigo-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-200'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white border border-slate-200 border-t-0 p-8 rounded-b-xl shadow-sm min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Surplus Amount</p>
                    <p className="text-3xl font-bold text-indigo-600">${property.surplus_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Claim Deadline</p>
                    <p className="text-lg font-bold text-slate-800">{property.deadline_date}</p>
                    <p className="text-xs text-orange-600 font-bold">~32 days remaining</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Tax Sale Date</p>
                    <p className="text-lg font-bold text-slate-800">{property.tax_sale_date}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ScaleIcon size={18} className="text-indigo-600" />
                    Jurisdiction Rules Applied
                  </h4>
                  <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700 flex justify-between">
                        <span>Filing Method:</span>
                        <span className="font-bold text-slate-900">Mail / In-Person</span>
                      </p>
                      <p className="text-sm font-medium text-slate-700 flex justify-between">
                        <span>Processing Time:</span>
                        <span className="font-bold text-slate-900">90-120 Days</span>
                      </p>
                    </div>
                    <div>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Required Items</p>
                       <ul className="text-xs space-y-1 text-slate-600">
                          <li className="flex items-center gap-2"><CheckCircleIcon size={12} className="text-green-500"/> Valid Govt ID</li>
                          <li className="flex items-center gap-2"><CheckCircleIcon size={12} className="text-green-500"/> Certified Deed</li>
                          <li className="flex items-center gap-2"><div className="w-3 h-3 border-2 border-slate-300 rounded-full"></div> Claim Affidavit</li>
                       </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'claimants' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">Potential Claimants</h4>
                  <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">+ Add Claimant</button>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Verification</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-4 font-semibold text-slate-800">John Doe Estate</td>
                        <td className="px-4 py-4 text-sm text-slate-600">Heir / Probate</td>
                        <td className="px-4 py-4">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase">UNVERIFIED</span>
                        </td>
                        <td className="px-4 py-4">
                          <button className="text-indigo-600 font-bold text-xs">View Docs</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="animate-in fade-in duration-300">
                <DocumentUpload propertyId={property.id} />
              </div>
            )}

            {activeTab === 'audit' && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="relative pl-8 space-y-8 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-100">
                      <div className="relative">
                        <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-green-50 border-2 border-green-500 flex items-center justify-center">
                          <CheckCircleIcon size={12} className="text-green-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">Case Created</p>
                        <p className="text-xs text-slate-500">System • Feb 01, 2024 at 10:22 AM</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-8 top-1.5 w-6 h-6 rounded-full bg-indigo-50 border-2 border-indigo-500 flex items-center justify-center">
                          <UploadIcon size={12} className="text-indigo-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-800">Document Uploaded (Proof of Service)</p>
                        <p className="text-xs text-slate-500">Admin User • Feb 05, 2024 at 02:15 PM</p>
                      </div>
                  </div>
               </div>
            )}
          </div>
        </div>

        {/* Right Col: Property Stats/Links */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ExternalLinkIcon size={18} className="text-indigo-600" />
              Source Information
            </h4>
            <div className="space-y-3">
              <a href="#" className="block p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">County Ledger</p>
                <p className="text-sm font-medium text-indigo-600 truncate underline">fultoncountyga.gov/tax/surplus_records_2024</p>
              </a>
              <a href="#" className="block p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Deed Records (APN)</p>
                <p className="text-sm font-medium text-indigo-600 truncate underline">deeds.fultoncounty.gov?parcel=14-0021-...</p>
              </a>
            </div>
          </div>

          <div className="bg-indigo-900 p-6 rounded-xl text-white shadow-lg relative overflow-hidden">
             <div className="relative z-10">
                <h4 className="font-bold mb-2">Internal Notes</h4>
                <textarea 
                  className="w-full bg-indigo-800/50 border border-indigo-700 rounded-lg p-3 text-sm focus:ring-0 placeholder:text-indigo-400 h-32"
                  placeholder="Add case notes here... only visible to internal staff."
                ></textarea>
                <button className="mt-4 w-full bg-white text-indigo-900 font-bold py-2 rounded-lg text-sm hover:bg-indigo-50 transition-colors">
                  Save Notes
                </button>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-800/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
