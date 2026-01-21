
import React, { useState } from 'react';
import { 
  FileTextIcon, 
  DownloadIcon, 
  PrinterIcon, 
  CheckCircle2Icon, 
  Loader2Icon, 
  MailIcon,
  ArchiveIcon,
  CopyIcon,
  PenToolIcon,
  Wand2Icon,
  ChevronRightIcon
} from 'lucide-react';
import { generateClaimPackage } from '../lib/gemini';
import { Property } from '../types';

interface SmartDocumentPackagerProps {
  property: Property;
  waterfallData: any;
}

const SmartDocumentPackager: React.FC<SmartDocumentPackagerProps> = ({ property, waterfallData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [packageData, setPackageData] = useState<any>(null);
  const [selectedDoc, setSelectedDoc] = useState<string>('demand_letter');

  const handleAssemble = async () => {
    setIsGenerating(true);
    try {
      const data = await generateClaimPackage(property, waterfallData);
      setPackageData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const docTitles: Record<string, string> = {
    demand_letter: "Letter of Demand",
    affidavit: "Claimant Affidavit",
    accounting_statement: "Final Accounting"
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <ArchiveIcon size={24} className="text-indigo-300" />
              <h3 className="text-2xl font-black">Smart Packager</h3>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Auto-generate all necessary legal filings, affidavits, and demand letters using case intelligence. 
              Our engine ensures jurisdictional compliance for {property.county} County.
            </p>
            {!packageData && !isGenerating && (
              <button 
                onClick={handleAssemble}
                className="bg-white text-indigo-900 px-8 py-3.5 rounded-2xl font-black text-sm hover:shadow-2xl transition-all flex items-center gap-2 active:scale-[0.98]"
              >
                <Wand2Icon size={18} />
                Assemble Claim Package
              </button>
            )}
          </div>
          
          <div className="flex gap-4">
             <div className="bg-indigo-800/40 backdrop-blur-md p-6 rounded-3xl border border-indigo-500/30 text-center min-w-[140px]">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Claim Status</p>
                <p className="text-lg font-black uppercase tracking-tighter">Drafting</p>
             </div>
             <div className="bg-indigo-800/40 backdrop-blur-md p-6 rounded-3xl border border-indigo-500/30 text-center min-w-[140px]">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-2">Form Count</p>
                <p className="text-lg font-black uppercase tracking-tighter">3 Artifacts</p>
             </div>
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-1000"></div>
      </div>

      {isGenerating && (
        <div className="py-24 text-center space-y-4">
          <div className="relative flex justify-center">
            <Loader2Icon size={48} className="text-indigo-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <ArchiveIcon size={16} className="text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="text-slate-800 font-black text-lg">Drafting Legal Artifacts...</p>
            <p className="text-slate-400 text-sm">Applying state-specific legal formatting and waterfall accounting.</p>
          </div>
        </div>
      )}

      {packageData && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-bottom-4 duration-700">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-4">Package Contents</h4>
            {Object.keys(docTitles).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedDoc(key)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  selectedDoc === key 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileTextIcon size={18} />
                  <span className="text-[11px] font-black uppercase tracking-widest">{docTitles[key]}</span>
                </div>
                <ChevronRightIcon size={16} />
              </button>
            ))}

            <div className="pt-8 space-y-3">
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">
                <DownloadIcon size={16} />
                Download PDF Pack
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                <PrinterIcon size={16} />
                Send to Notary
              </button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl min-h-[600px] flex flex-col">
              <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <PenToolIcon size={16} />
                  </div>
                  <h5 className="font-black text-slate-800 text-sm">{docTitles[selectedDoc]}</h5>
                </div>
                <div className="flex items-center gap-2">
                   <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-slate-100">
                      <CopyIcon size={18} />
                   </button>
                </div>
              </div>
              <div className="p-12 flex-1 overflow-auto max-h-[700px]">
                <div className="max-w-2xl mx-auto font-serif text-slate-800 leading-relaxed whitespace-pre-wrap text-sm">
                  {packageData[selectedDoc]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartDocumentPackager;
