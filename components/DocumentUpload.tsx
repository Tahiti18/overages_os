
import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  PlusIcon,
  RefreshCwIcon,
  ArchiveIcon,
  FileCheckIcon,
  ShieldCheckIcon,
  CheckIcon,
  ChevronDownIcon,
  InfoIcon,
  SearchIcon,
  HashIcon,
  CalendarIcon,
  DollarSignIcon,
  MapPinIcon,
  GavelIcon,
  ClockIcon
} from 'lucide-react';
import { Document } from '../types';
import { extractDocumentData } from '../lib/gemini';
import Tooltip from './Tooltip';

interface DocumentUploadProps {
  propertyId: string;
  propertyState?: string;
  propertyCounty?: string;
  onVerificationChange?: (docs: Document[]) => void;
}

interface ProcessingFile {
  id: string;
  name: string;
  progress: number;
  status: 'initializing' | 'uploading' | 'extracting' | 'finalizing' | 'error';
  error?: string;
}

const DOCUMENT_TYPES = [
  { value: 'DEED', label: 'Property Deed' },
  { value: 'TAX_BILL', label: 'Tax Bill' },
  { value: 'ID', label: 'Government ID' },
  { value: 'AFFIDAVIT', label: 'Affidavit' },
  { value: 'APPLICATION', label: 'Claim Application' },
  { value: 'JUDICIAL_FILING', label: 'Judicial Filing (MD)' },
  { value: 'OTHER', label: 'Other Attachment' }
];

const DocumentUpload: React.FC<DocumentUploadProps> = ({ propertyId, propertyState, propertyCounty, onVerificationChange }) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'd1',
      property_id: propertyId,
      filename: 'tax_bill_2023.pdf',
      doc_type: 'TAX_BILL',
      tags: ['Primary Record', 'Current Year', 'Verified'],
      extraction_status: 'READY_FOR_REVIEW',
      extracted_fields: {
        overall_confidence: 0.98,
        fields: {
          parcel_id: { value: '14-0021-0004-012-0', confidence: 0.99 },
          amount_due: { value: 1250.50, confidence: 0.95 },
          owner_name: { value: 'John Doe', confidence: 0.97 },
          jurisdiction: { value: 'Fulton County, GA', confidence: 0.88 }
        }
      },
      verified_by_human: true,
      ocr_text: "TAX YEAR 2023 ... FULTON COUNTY GOVERNMENT ... PROPERTY TAX BILL ... OWNER: JOHN DOE ... PARCEL ID: 14-0021-0004-012-0 ... TOTAL TAX DUE: $1,250.50 ... BILLING DATE: 09/01/2023"
    }
  ]);
  
  const [processingFiles, setProcessingFiles] = useState<ProcessingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [reviewTab, setReviewTab] = useState<'fields' | 'ocr'>('fields');
  const [newTag, setNewTag] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onVerificationChange?.(documents);
  }, [documents]);

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const processFile = async (file: File) => {
    const fileId = Math.random().toString(36).substr(2, 9);
    setProcessingFiles(prev => [...prev, { id: fileId, name: file.name, progress: 5, status: 'initializing' }]);

    try {
      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 20, status: 'uploading' } : f));
      const base64 = await readFileAsBase64(file);

      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 45, status: 'extracting' } : f));
      const aiData = await extractDocumentData(base64, file.type, { 
        state: propertyState || 'Unknown', 
        county: propertyCounty || 'Unknown' 
      });
      
      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 85, status: 'finalizing' } : f));

      const newDoc: Document = {
        id: `d${Date.now()}-${fileId}`,
        property_id: propertyId,
        filename: file.name,
        doc_type: aiData?.document_type || 'OTHER',
        tags: aiData?.tags || [],
        extraction_status: 'READY_FOR_REVIEW',
        extracted_fields: aiData,
        verified_by_human: false,
        ocr_text: aiData?.extraction_rationale || `AI Insights: Extraction rationale not provided.`
      };

      setDocuments(prev => [newDoc, ...prev]);
      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'finalizing' } : f));
      setTimeout(() => setProcessingFiles(prev => prev.filter(f => f.id !== fileId)), 800);
    } catch (err: any) {
      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', error: err.message || "AI Engine Timeout" } : f));
      setTimeout(() => setProcessingFiles(prev => prev.filter(f => f.id !== fileId)), 5000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach(processFile);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) Array.from(e.dataTransfer.files).forEach(processFile);
  }, []);

  const approveDoc = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, verified_by_human: true } : d));
    if (selectedDoc?.id === id) setSelectedDoc(prev => prev ? { ...prev, verified_by_human: true } : null);
  };

  const removeDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const updateField = (key: string, newValue: string) => {
    if (!selectedDoc) return;
    const currentFields = selectedDoc.extracted_fields.fields || {};
    const fieldData = currentFields[key] || { value: '', confidence: 1.0 };
    
    const updatedFields = { 
      ...currentFields, 
      [key]: { ...fieldData, value: newValue } 
    };
    
    const updatedDoc = { 
      ...selectedDoc, 
      extracted_fields: { ...selectedDoc.extracted_fields, fields: updatedFields } 
    };
    
    setSelectedDoc(updatedDoc);
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
  };

  const getFieldIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('court') || k.includes('case')) return <GavelIcon size={14} />;
    if (k.includes('redemption') || k.includes('expiry')) return <ClockIcon size={14} />;
    if (k.includes('id') || k.includes('parcel')) return <HashIcon size={14} />;
    if (k.includes('date')) return <CalendarIcon size={14} />;
    if (k.includes('amount') || k.includes('price')) return <DollarSignIcon size={14} />;
    if (k.includes('owner') || k.includes('name')) return <TypeIcon size={14} />;
    if (k.includes('address') || k.includes('jurisdiction')) return <MapPinIcon size={14} />;
    return <SparklesIcon size={14} />;
  };

  const getConfidenceColor = (score: number) => {
    if (score > 0.9) return 'bg-emerald-500';
    if (score > 0.7) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div 
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`bg-white rounded-[3rem] border-2 border-dashed p-14 text-center group transition-all shadow-xl relative overflow-hidden ${
              isDragging ? 'bg-indigo-50 border-indigo-500 scale-[1.01] ring-8 ring-indigo-500/5' : 'border-slate-200 hover:bg-slate-50/50 hover:border-indigo-400'
            }`}
          >
            <input type="file" id="file-upload" className="hidden" multiple ref={fileInputRef} onChange={handleFileUpload} />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-6 relative z-10">
              <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 ${
                isDragging ? 'bg-indigo-600 text-white scale-110 shadow-3xl rotate-12' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-110'
              }`}>
                <UploadCloudIcon size={48} strokeWidth={2.5} />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-slate-900 tracking-tight italic">Ingest Case Artifacts</p>
                <p className="text-sm text-slate-700 font-bold max-w-sm mx-auto leading-relaxed">
                  Bulk upload property deeds, tax bills, and IDs. AI Core will automatically extract recovery data.
                </p>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-6">Artifact Repository</h5>
            <div className="grid grid-cols-1 gap-4">
              {processingFiles.map(file => (
                <div key={file.id} className="p-8 bg-white border-2 border-indigo-100 rounded-[2.5rem] shadow-2xl animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                        <RefreshCwIcon size={32} className="animate-spin" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900 tracking-tight">{file.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mt-1">Intelligence Stage: {file.status.toUpperCase()}</p>
                      </div>
                    </div>
                    <p className="text-2xl font-black text-indigo-600">{file.progress}%</p>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                    <div className="h-full bg-indigo-600 transition-all duration-700 shadow-[0_0_12px_rgba(79,70,229,0.5)]" style={{ width: `${file.progress}%` }}></div>
                  </div>
                </div>
              ))}

              {documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`flex items-center justify-between p-8 bg-white border-2 rounded-[2.5rem] cursor-pointer transition-all hover:-translate-y-1 ${
                    selectedDoc?.id === doc.id ? 'border-indigo-600 shadow-3xl' : 'border-slate-100 shadow-xl'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all ${
                      doc.verified_by_human ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-200 shadow-inner'
                    }`}>
                      {doc.verified_by_human ? <FileCheckIcon size={32} /> : <FileIcon size={32} />}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 tracking-tight uppercase italic">{doc.filename}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[9px] bg-slate-900 text-white px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-white/10 shadow-md">
                          {doc.doc_type.replace(/_/g, ' ')}
                        </span>
                        {doc.verified_by_human && (
                           <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100 shadow-sm">
                             <ShieldCheckIcon size={12} /> Audited
                           </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <button onClick={(e) => removeDoc(doc.id, e)} className="p-4 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl border-2 border-transparent transition-all">
                        <Trash2Icon size={22} />
                     </button>
                     <ChevronDownIcon size={24} className={`text-slate-400 transition-transform ${selectedDoc?.id === doc.id ? '-rotate-180' : '-rotate-90'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[540px] shrink-0">
          {selectedDoc ? (
            <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] shadow-3xl flex flex-col h-[850px] overflow-hidden sticky top-10 ring-1 ring-slate-100 animate-in slide-in-from-right-12 duration-500">
              <div className="px-12 py-10 border-b-2 border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <SparklesIcon size={28} />
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="font-black text-slate-900 text-lg uppercase tracking-tight italic">Case Intelligence</h5>
                    <p className="text-[10px] text-slate-700 font-black uppercase tracking-widest truncate max-w-[240px] mt-1">{selectedDoc.filename}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedDoc(null)} className="p-3 text-slate-400 hover:text-slate-950 transition-all bg-white rounded-2xl border-2 border-slate-100 shadow-lg hover:scale-110 active:scale-90">
                  <XIcon size={24} />
                </button>
              </div>

              <div className="flex border-b-2 border-slate-100 bg-white">
                <button onClick={() => setReviewTab('fields')} className={`flex-1 py-6 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative ${reviewTab === 'fields' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400'}`}>
                  <TypeIcon size={16} /> Structured Fields
                  {reviewTab === 'fields' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 shadow-[0_-4px_12px_rgba(79,70,229,0.3)]"></div>}
                </button>
                <button onClick={() => setReviewTab('ocr')} className={`flex-1 py-6 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 relative ${reviewTab === 'ocr' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400'}`}>
                  <FileSearchIcon size={16} /> Audit Logic
                  {reviewTab === 'ocr' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 shadow-[0_-4px_12px_rgba(79,70,229,0.3)]"></div>}
                </button>
              </div>
              
              <div className="flex-1 overflow-auto p-12 space-y-10 custom-scrollbar">
                {reviewTab === 'fields' ? (
                  <div className="space-y-10">
                    {selectedDoc.extracted_fields.overall_confidence && (
                      <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white relative overflow-hidden shadow-3xl border-2 border-white/5 group">
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Extraction Reliability</p>
                            <p className="text-5xl font-black tracking-tighter">{(selectedDoc.extracted_fields.overall_confidence * 100).toFixed(1)}%</p>
                          </div>
                          <div className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center border-2 transition-all duration-700 ${selectedDoc.extracted_fields.overall_confidence > 0.9 ? 'border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-amber-500/50 text-amber-400'}`}>
                            <ShieldCheckIcon size={44} />
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000 rotate-12">
                           <SparklesIcon size={160} fill="white" />
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-3 flex items-center gap-2.5">
                        <FileIcon size={16} className="text-indigo-600" /> Artifact Classification
                      </label>
                      <div className="relative group">
                        <select 
                          value={selectedDoc.doc_type}
                          disabled={selectedDoc.verified_by_human}
                          onChange={(e) => approveDoc(selectedDoc.id)}
                          className={`w-full px-8 py-5 border-2 rounded-3xl text-[14px] font-black transition-all outline-none appearance-none cursor-pointer shadow-inner ${
                            selectedDoc.verified_by_human ? 'bg-slate-50 border-slate-100 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-indigo-600'
                          }`}
                        >
                          {DOCUMENT_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                        </select>
                        <ChevronDownIcon size={20} className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="px-3 flex items-center justify-between">
                         <h6 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Metadata Artifacts</h6>
                         <Tooltip content="Color indicators represent the AI's certainty for each specific field.">
                           <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div><span className="text-[8px] font-black uppercase text-slate-400">High</span></div>
                              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></div><span className="text-[8px] font-black uppercase text-slate-400">Med</span></div>
                              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-lg shadow-rose-500/50"></div><span className="text-[8px] font-black uppercase text-slate-400">Low</span></div>
                           </div>
                         </Tooltip>
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {Object.entries(selectedDoc.extracted_fields.fields || {}).map(([key, data]: [string, any]) => (
                          <div key={key} className="group animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center justify-between mb-3 px-3">
                              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2 group-focus-within:text-indigo-600 transition-colors">
                                {getFieldIcon(key)}
                                {key.replace(/_/g, ' ')}
                              </label>
                              <Tooltip content={`Confidence: ${(data.confidence * 100).toFixed(0)}%`}>
                                <div className={`w-3 h-3 rounded-full shadow-lg transition-all transform group-hover:scale-125 ${getConfidenceColor(data.confidence)}`}></div>
                              </Tooltip>
                            </div>
                            <div className="relative">
                              <input 
                                type="text" 
                                value={String(data.value || '')}
                                onChange={(e) => updateField(key, e.target.value)}
                                className={`w-full px-8 py-5 border-2 rounded-[1.5rem] text-[15px] font-black transition-all outline-none shadow-inner ${
                                  selectedDoc.verified_by_human 
                                    ? 'bg-slate-50 border-slate-100 text-slate-600 cursor-default' 
                                    : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-600 focus:ring-8 focus:ring-indigo-500/5 hover:border-indigo-300'
                                }`}
                                readOnly={selectedDoc.verified_by_human}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in duration-500">
                     <div className="p-10 bg-slate-950 text-indigo-200 rounded-[3.5rem] font-mono text-[13px] leading-relaxed border-2 border-white/5 shadow-inner min-h-[500px]">
                        <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
                           <span className="text-indigo-500 font-black uppercase text-[10px] tracking-widest">Logic Trail Stream</span>
                           <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">UTF-8 • Secure</span>
                        </div>
                        <p className="opacity-90 italic">"{selectedDoc.ocr_text || "Logic trace dormant."}"</p>
                     </div>
                  </div>
                )}
              </div>

              <div className="p-12 bg-slate-50 border-t-2 border-slate-100 flex flex-col gap-5 shadow-2xl">
                <button 
                  onClick={() => approveDoc(selectedDoc.id)}
                  disabled={selectedDoc.verified_by_human}
                  className={`w-full flex items-center justify-center gap-4 py-6 rounded-[2.5rem] text-sm font-black uppercase tracking-widest transition-all shadow-3xl hover:-translate-y-1 active:scale-95 ${
                    selectedDoc.verified_by_human 
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                      : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700 border-2 border-white/10'
                  }`}
                >
                  {selectedDoc.verified_by_human ? <ClipboardCheckIcon size={24} /> : <CheckCircle2Icon size={24} />}
                  {selectedDoc.verified_by_human ? 'Case Data Authorized' : 'Confirm & Authorize Data'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-4 border-dashed border-slate-200 rounded-[4rem] flex flex-col items-center justify-center p-20 text-center h-[750px] group transition-all hover:bg-slate-50/50 hover:border-indigo-100 shadow-inner">
              <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mb-10 border-2 border-slate-50 shadow-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                <FileSearchIcon size={56} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h5 className="font-black text-slate-800 uppercase text-lg tracking-[0.2em] mb-4 italic">Deep Audit Dormant</h5>
              <p className="text-sm font-bold text-slate-500 max-w-[320px] mx-auto leading-relaxed">
                Select a legal record from the inventory to initiate the granular field verification protocol.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
