
import React, { useState } from 'react';
import { 
  FileIcon, 
  UploadCloudIcon, 
  Trash2Icon, 
  EyeIcon, 
  CheckCircle2Icon,
  Loader2Icon,
  AlertCircleIcon,
  SparklesIcon
} from 'lucide-react';
import { Document } from '../types';
import { extractDocumentData } from '../lib/gemini';

interface DocumentUploadProps {
  propertyId: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ propertyId }) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'd1',
      property_id: propertyId,
      filename: 'tax_bill_2023.pdf',
      doc_type: 'Tax Record',
      extraction_status: 'READY_FOR_REVIEW',
      extracted_fields: {
        parcel_id: '14-0021-0004-012-0',
        amount_due: 1250.50,
        owner_name: 'John Doe'
      },
      verified_by_human: true,
      ocr_text: "TAX YEAR 2023 ... FULTON COUNTY ... OWNER: JOHN DOE ... PARCEL 14-0021-0004-012-0 ... TOTAL TAX: $1,250.50"
    }
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);

      try {
        // Convert file to base64 for Gemini
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
        });
        reader.readAsDataURL(file);
        const base64 = await base64Promise;

        // Call Gemini AI for real-time extraction
        const aiData = await extractDocumentData(base64, file.type);
        
        const newDoc: Document = {
          id: `d${Date.now()}`,
          property_id: propertyId,
          filename: file.name,
          doc_type: aiData?.document_type || 'OTHER',
          extraction_status: 'READY_FOR_REVIEW',
          extracted_fields: aiData || {},
          verified_by_human: false
        };

        setDocuments(prev => [newDoc, ...prev]);
        setSelectedDoc(newDoc);
      } catch (err) {
        console.error("Extraction failed", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const approveDoc = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, verified_by_human: true } : d));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Doc List */}
        <div className="flex-1 space-y-4">
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 group hover:bg-slate-50 hover:border-indigo-300 transition-all">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
              {isUploading ? (
                <div className="relative">
                  <Loader2Icon size={40} className="text-indigo-600 animate-spin" />
                  <SparklesIcon size={16} className="absolute -top-1 -right-1 text-amber-500 animate-pulse" />
                </div>
              ) : (
                <UploadCloudIcon size={40} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              )}
              <div>
                <p className="font-bold text-slate-700">{isUploading ? 'AI Analyzing Document...' : 'Upload Case Document'}</p>
                <p className="text-sm text-slate-500">Fast extraction powered by Gemini 3.0</p>
              </div>
            </label>
            {isUploading && (
              <div className="mt-4 max-w-xs mx-auto">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 animate-[loading_2s_infinite]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Case Files</h5>
            {documents.map(doc => (
              <div 
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`flex items-center justify-between p-4 bg-white border rounded-xl cursor-pointer transition-all ${
                  selectedDoc?.id === doc.id ? 'border-indigo-600 ring-1 ring-indigo-600 shadow-md' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${doc.verified_by_human ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                    <FileIcon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{doc.filename}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">{doc.doc_type}</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className={`text-[10px] font-bold uppercase ${
                        doc.extraction_status === 'READY_FOR_REVIEW' ? 'text-amber-600' : 'text-green-600'
                      }`}>
                        {doc.extraction_status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                {doc.verified_by_human && (
                  <div className="bg-green-500 text-white rounded-full p-0.5 shadow-sm">
                    <CheckCircle2Icon size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Review Pane */}
        {selectedDoc ? (
          <div className="w-full md:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right-4 duration-300">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SparklesIcon size={16} className="text-indigo-600" />
                <h5 className="font-bold text-slate-800 text-sm">AI Extraction Results</h5>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="text-slate-400 hover:text-slate-600 transition-colors">&times;</button>
            </div>
            
            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div className="space-y-4">
                {!selectedDoc.verified_by_human && (
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start gap-3">
                    <AlertCircleIcon size={18} className="text-indigo-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                      Gemini identified <strong>{Object.keys(selectedDoc.extracted_fields).length} fields</strong>. Confirm accuracy before proceeding.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {Object.entries(selectedDoc.extracted_fields).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">{key.replace(/_/g, ' ')}</label>
                      <input 
                        type="text" 
                        defaultValue={value === null ? '' : String(value)}
                        className={`w-full px-3 py-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-600 outline-none transition-all ${
                          selectedDoc.verified_by_human ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white border-slate-200 text-slate-800'
                        }`}
                        readOnly={selectedDoc.verified_by_human}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
              <button 
                onClick={() => approveDoc(selectedDoc.id)}
                disabled={selectedDoc.verified_by_human}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-md ${
                  selectedDoc.verified_by_human 
                    ? 'bg-green-100 text-green-700 cursor-default border border-green-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                }`}
              >
                {selectedDoc.verified_by_human ? <CheckCircle2Icon size={18} /> : null}
                {selectedDoc.verified_by_human ? 'Verified' : 'Verify & Approve'}
              </button>
              {!selectedDoc.verified_by_human && (
                <button className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-transparent hover:border-red-100">
                  <Trash2Icon size={18} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden md:flex w-96 border-2 border-dashed border-slate-200 rounded-2xl items-center justify-center p-8 text-center text-slate-400 bg-white/50">
            <div>
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <EyeIcon size={32} className="opacity-30" />
              </div>
              <p className="text-sm font-bold text-slate-500">Inspection Pane</p>
              <p className="text-xs text-slate-400 mt-1">Select a document to review extracted data points</p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default DocumentUpload;
