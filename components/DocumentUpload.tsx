
import React, { useState } from 'react';
import { 
  FileIcon, 
  UploadCloudIcon, 
  Trash2Icon, 
  EyeIcon, 
  CheckCircle2Icon,
  Loader2Icon,
  AlertCircleIcon,
  SparklesIcon,
  FileSearchIcon,
  TypeIcon,
  ClipboardCheckIcon,
  XIcon,
  TagIcon,
  PlusIcon
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
      doc_type: 'TAX_BILL',
      tags: ['Primary Record', 'Current Year', 'Verified'],
      extraction_status: 'READY_FOR_REVIEW',
      extracted_fields: {
        parcel_id: '14-0021-0004-012-0',
        amount_due: 1250.50,
        owner_name: 'John Doe',
        jurisdiction: 'Fulton County, GA'
      },
      verified_by_human: true,
      ocr_text: "TAX YEAR 2023 ... FULTON COUNTY GOVERNMENT ... PROPERTY TAX BILL ... OWNER: JOHN DOE ... PARCEL ID: 14-0021-0004-012-0 ... TOTAL TAX DUE: $1,250.50 ... BILLING DATE: 09/01/2023"
    }
  ]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [reviewTab, setReviewTab] = useState<'fields' | 'ocr'>('fields');
  const [newTag, setNewTag] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setIsUploading(true);

      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
        });
        reader.readAsDataURL(file);
        const base64 = await base64Promise;

        // Call Gemini AI for real-time extraction and tagging
        const aiData = await extractDocumentData(base64, file.type);
        
        const newDoc: Document = {
          id: `d${Date.now()}`,
          property_id: propertyId,
          filename: file.name,
          doc_type: aiData?.document_type || 'OTHER',
          tags: aiData?.tags || [],
          extraction_status: 'READY_FOR_REVIEW',
          extracted_fields: aiData || {},
          verified_by_human: false,
          ocr_text: "AI Processed Content: " + (aiData?.owner_name || "Unknown Owner") + " found in document."
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
    if (selectedDoc?.id === id) {
      setSelectedDoc(prev => prev ? { ...prev, verified_by_human: true } : null);
    }
  };

  const updateField = (key: string, value: string) => {
    if (!selectedDoc) return;
    const updatedFields = { ...selectedDoc.extracted_fields, [key]: value };
    const updatedDoc = { ...selectedDoc, extracted_fields: updatedFields };
    setSelectedDoc(updatedDoc);
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !newTag.trim()) return;
    const updatedTags = [...selectedDoc.tags, newTag.trim()];
    const updatedDoc = { ...selectedDoc, tags: updatedTags };
    setSelectedDoc(updatedDoc);
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    if (!selectedDoc) return;
    const updatedTags = selectedDoc.tags.filter(t => t !== tagToRemove);
    const updatedDoc = { ...selectedDoc, tags: updatedTags };
    setSelectedDoc(updatedDoc);
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Document Inventory */}
        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-dashed border-slate-200 p-10 text-center group hover:bg-slate-50 hover:border-indigo-400 transition-all shadow-sm">
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
              {isUploading ? (
                <div className="relative">
                  <Loader2Icon size={48} className="text-indigo-600 animate-spin" />
                  <SparklesIcon size={20} className="absolute -top-1 -right-1 text-amber-500 animate-pulse" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UploadCloudIcon size={32} />
                </div>
              )}
              <div>
                <p className="text-lg font-black text-slate-900">{isUploading ? 'AI Extraction in Progress...' : 'Drop Legal Artifact'}</p>
                <p className="text-sm text-slate-500 font-medium">Auto-tagging & extraction powered by Gemini 3.0 Core</p>
              </div>
            </label>
            {isUploading && (
              <div className="mt-6 max-w-xs mx-auto">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-indigo-600 animate-[loading_2s_infinite] shadow-[0_0_10px_rgba(79,70,229,0.5)]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Case Inventory</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
              {documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`flex items-center justify-between p-5 bg-white border-2 rounded-[1.5rem] cursor-pointer transition-all ${
                    selectedDoc?.id === doc.id 
                      ? 'border-indigo-600 shadow-xl shadow-indigo-100 -translate-y-0.5' 
                      : 'border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.verified_by_human ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                      <FileIcon size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 tracking-tight">{doc.filename}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{doc.doc_type.replace(/_/g, ' ')}</span>
                        {doc.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded-full font-bold uppercase border border-indigo-100">{tag}</span>
                        ))}
                        {doc.tags.length > 2 && <span className="text-[9px] text-slate-400 font-bold">+{doc.tags.length - 2}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.verified_by_human && <CheckCircle2Icon size={18} className="text-green-500" />}
                    <div className="p-2 text-slate-300 group-hover:text-indigo-600">
                      <EyeIcon size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Intelligence Review Pane */}
        <div className="lg:w-[450px] shrink-0">
          {selectedDoc ? (
            <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] shadow-2xl flex flex-col h-[750px] overflow-hidden animate-in slide-in-from-right-8 duration-500 sticky top-8">
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                    <SparklesIcon size={20} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-sm uppercase tracking-tight">Intelligence Inspector</h5>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{selectedDoc.filename}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setReviewTab('fields')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${reviewTab === 'fields' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600 bg-slate-50/30'}`}
                >
                  <TypeIcon size={14} />
                  Extracted Fields
                </button>
                <button 
                  onClick={() => setReviewTab('ocr')}
                  className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${reviewTab === 'ocr' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600 bg-slate-50/30'}`}
                >
                  <FileSearchIcon size={14} />
                  Raw OCR Text
                </button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-auto p-8 space-y-6">
                {reviewTab === 'fields' ? (
                  <div className="space-y-5">
                    {/* Tags Section */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-1.5">
                          <TagIcon size={12} /> AI Suggested Tags
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 bg-slate-50 rounded-2xl border border-slate-100">
                        {selectedDoc.tags.map(tag => (
                          <div key={tag} className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-indigo-100 text-[10px] font-black text-indigo-600 group/tag">
                            {tag}
                            {!selectedDoc.verified_by_human && (
                              <button onClick={() => removeTag(tag)} className="text-slate-300 hover:text-red-500">
                                <XIcon size={10} />
                              </button>
                            )}
                          </div>
                        ))}
                        {!selectedDoc.verified_by_human && (
                          <form onSubmit={addTag} className="flex-1">
                            <input 
                              type="text" 
                              placeholder="Add tag..."
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              className="w-full bg-transparent border-none p-0 text-[10px] font-bold outline-none placeholder:text-slate-400"
                            />
                          </form>
                        )}
                      </div>
                    </div>

                    {!selectedDoc.verified_by_human && (
                      <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
                        <AlertCircleIcon size={18} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-900 leading-relaxed font-bold">
                          Gemini identified these data points. Please verify each field against the original document before finalizing.
                        </p>
                      </div>
                    )}

                    <div className="space-y-4">
                      {Object.entries(selectedDoc.extracted_fields).map(([key, value]) => {
                        if (key === 'tags' || key === 'document_type') return null;
                        return (
                          <div key={key} className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1 group-focus-within:text-indigo-600 transition-colors">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <div className="relative">
                              <input 
                                type="text" 
                                value={value === null ? '' : String(value)}
                                onChange={(e) => updateField(key, e.target.value)}
                                className={`w-full px-5 py-3.5 border-2 rounded-2xl text-xs font-black transition-all outline-none ${
                                  selectedDoc.verified_by_human 
                                    ? 'bg-slate-50 border-slate-100 text-slate-500' 
                                    : 'bg-white border-slate-100 text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/5'
                                }`}
                                readOnly={selectedDoc.verified_by_human}
                              />
                              {!selectedDoc.verified_by_human && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200">
                                  <SparklesIcon size={12} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className="p-6 bg-slate-900 text-indigo-300 rounded-[2rem] font-mono text-[11px] leading-relaxed border border-indigo-500/20 shadow-inner min-h-[400px]">
                        {selectedDoc.ocr_text || "No OCR text generated for this artifact."}
                     </div>
                     <p className="text-[10px] font-bold text-slate-400 italic text-center uppercase tracking-tighter">Raw text extraction used for field grounding</p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-3">
                <button 
                  onClick={() => approveDoc(selectedDoc.id)}
                  disabled={selectedDoc.verified_by_human}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all shadow-xl ${
                    selectedDoc.verified_by_human 
                      ? 'bg-green-600 text-white cursor-default shadow-green-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200'
                  }`}
                >
                  {selectedDoc.verified_by_human ? <ClipboardCheckIcon size={18} /> : <CheckCircle2Icon size={18} />}
                  {selectedDoc.verified_by_human ? 'Case Verified' : 'Verify & Approve Field Data'}
                </button>
                
                {!selectedDoc.verified_by_human && (
                  <button className="flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest">
                    <Trash2Icon size={14} />
                    Reject Extraction
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-12 text-center text-slate-400 h-[600px]">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <FileSearchIcon size={40} className="text-slate-200" />
              </div>
              <h5 className="font-black text-slate-800 uppercase text-xs tracking-[0.2em] mb-2">Review Pending</h5>
              <p className="text-xs font-medium text-slate-400 max-w-[200px] leading-relaxed">Select a document from the inventory to launch the Intelligence Inspector.</p>
            </div>
          )}
        </div>
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
