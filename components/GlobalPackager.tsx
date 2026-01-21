
import React from 'react';
import SmartDocumentPackager from './SmartDocumentPackager';
import { ArchiveIcon, FileTextIcon, SearchIcon } from 'lucide-react';

const GlobalPackager: React.FC = () => {
  const mockProperty = {
    id: 'global',
    address: 'DEMO PROPERTY CONTEXT',
    county: 'Fulton',
    state: 'GA',
    parcel_id: 'XX-XXXX-XXXX',
    surplus_amount: 100000
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
               <ArchiveIcon size={24} />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Smart Packager</h2>
          </div>
          <p className="text-slate-500 font-medium">Document Assembly Suite: Generate legal affidavits and demand letters.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl flex items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
            <FileTextIcon size={28} />
          </div>
          <div>
            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">Selected Context</h4>
            <p className="text-xl font-black text-blue-600">Active Pipeline Template</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 transition-all">
          <SearchIcon size={16} />
          Change Property Case
        </button>
      </div>

      <SmartDocumentPackager 
        property={mockProperty as any} 
        waterfallData={{ finalSurplus: 85000 }} 
      />
    </div>
  );
};

export default GlobalPackager;
