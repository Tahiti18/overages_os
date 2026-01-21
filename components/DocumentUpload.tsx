
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
        parcel_id: '14-0021-0004-012-0',
        amount_due: 1250.50,
        owner_name: 'John Doe',
        jurisdiction: 'Fulton County, GA',
        confidence_score: 0.98
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

  // Synchronize with parent pipeline
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
    
    setProcessingFiles(prev => [...prev, { 
      id: fileId, 
      name: file.name, 
      progress: 5, 
      status: 'initializing' 
    }]);

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
        extracted_fields: aiData || {},
        verified_by_human: false,
        ocr_text: aiData?.extraction_rationale || `AI Insights: ${aiData?.owner_name || "Unknown Owner"} identified. Document classified as ${aiData?.document_type}. Confidence: ${((aiData?.confidence_score || 0) * 100).toFixed(1)}%.`
      };

      setDocuments(prev => [newDoc, ...prev]);
      
      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'finalizing' } : f));
      setTimeout(() => {
        setProcessingFiles(prev => prev.filter(f => f.id !== fileId));
      }, 800);

    } catch (err: any) {
      console.error(`Extraction failed for ${file.name}`, err);
      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { 
        ...f, 
        status: 'error', 
        error: err.message || "AI Extraction Engine Timeout" 
      } : f));
      
      setTimeout(() => {
        setProcessingFiles(prev => prev.filter(f => f.id !== fileId));
      }, 5000);
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
    if (e.dataTransfer.files) {
      Array.from(e.dataTransfer.files).forEach(processFile);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const clearAllDocuments = () => {
    if (window.confirm("CRITICAL ACTION: Are you sure you want to purge all legal artifacts for this case? This cannot be undone.")) {
      setDocuments([]);
      setSelectedDoc(null);
    }
  };

  const approveDoc = (id: string) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, verified_by_human: true } : d));
    if (selectedDoc?.id === id) {
      setSelectedDoc(prev => prev ? { ...prev, verified_by_human: true } : null);
    }
  };

  const removeDoc = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  const updateField = (key: string, value: string) => {
    if (!selectedDoc) return;
    const updatedFields = { ...selectedDoc.extracted_fields, [key]: value };
    const updatedDoc = { ...selectedDoc, extracted_fields: updatedFields };
    setSelectedDoc(updatedDoc);
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
  };

  const updateDocType = (newType: string) => {
    if (!selectedDoc) return;
    const updatedDoc = { ...selectedDoc, doc_type: newType };
    setSelectedDoc(updatedDoc);
    setDocuments(prev => prev.map(d => d.id === selectedDoc.id ? updatedDoc : d));
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !newTag.trim()) return;
    if (selectedDoc.tags.includes(newTag.trim())) {
      setNewTag('');
      return;
    }
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Document Inventory */}
        <div className="flex-1 space-y-6">
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`bg-white rounded-[3rem] border-2 border-dashed p-14 text-center group transition-all shadow-sm relative overflow-hidden ${
              isDragging ? 'bg-indigo-50 border-indigo-500 scale-[1.01] ring-8 ring-indigo-500/5' : 'border-slate-200 hover:bg-slate-50/50 hover:border-indigo-400'
            }`}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              multiple
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-6 relative z-10">
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${
                isDragging ? 'bg-indigo-600 text-white scale-110 shadow-2xl shadow-indigo-200 rotate-12' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-110'
              }`}>
                {isDragging ? <PlusIcon size={48} strokeWidth={2.5} /> : <UploadCloudIcon size={48} strokeWidth={2.5} />}
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  {isDragging ? 'Drop Legal Evidence' : 'Ingest Case Artifacts'}
                </p>
                <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                  Bulk upload property deeds, tax bills, and IDs. AI Core will automatically extract recovery data.
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] shadow-sm">AI OCR Enabled</span>
                  <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] shadow-sm">Grounding Filter</span>
                </div>
              </div>
            </label>
            {isDragging && (
              <div className="absolute inset-0 pointer-events-none border-4 border-indigo-600/10 m-3 rounded-[2.5rem] animate-pulse"></div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-3">
                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Artifact Repository</h5>
                <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[10px] font-black">{documents.length}</span>
              </div>
              {documents.length > 0 && (
                <button 
                  onClick={clearAllDocuments}
                  className="px-5 py-2.5 bg-red-50 text-[10px] font-black text-red-600 rounded-2xl uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm flex items-center gap-2"
                >
                  <Trash2Icon size={14} />
                  Purge Inventory
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {processingFiles.map(file => (
                <div 
                  key={file.id}
                  className={`flex flex-col p-8 rounded-[2.5rem] shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 border-2 ${
                    file.status === 'error' ? 'bg-red-50 border-red-100 shadow-red-50' : 'bg-white border-indigo-100 shadow-indigo-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner ${
                        file.status === 'error' ? 'bg-red-100 text-red-500' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {file.status === 'error' ? <AlertCircleIcon size={32} /> : <RefreshCwIcon size={32} className="animate-spin" />}
                      </div>
                      <div>
                        <p className="text-lg font-black text-slate-900 tracking-tight truncate max-w-[280px]">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${file.status === 'error' ? 'bg-red-500' : 'bg-indigo-500 animate-pulse'}`}></div>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${file.status === 'error' ? 'text-red-600' : 'text-indigo-600'}`}>
                            {file.status === 'error' ? 'Extraction Failure' : `Intelligence Stage: ${file.status.toUpperCase()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-black ${file.status === 'error' ? 'text-red-500' : 'text-indigo-600'}`}>
                        {file.status === 'error' ? '!' : `${file.progress}%`}
                      </p>
                    </div>
                  </div>
                  
                  {file.status === 'error' ? (
                    <div className="bg-white p-4 rounded-2xl border border-red-200">
                      <p className="text-[11px] font-bold text-red-700 leading-relaxed">{file.error}</p>
                    </div>
                  ) : (
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}

              {documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`flex items-center justify-between p-8 bg-white border-2 rounded-[2.5rem] cursor-pointer transition-all group ${
                    selectedDoc?.id === doc.id 
                      ? 'border-indigo-600 shadow-2xl shadow-indigo-100 -translate-y-1' 
                      : 'border-slate-100 hover:border-indigo-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-18 h-18 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ${
                      doc.verified_by_human 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:scale-105'
                    }`}>
                      {doc.verified_by_human ? <FileCheckIcon size={36} /> : <FileIcon size={36} />}
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-900 tracking-tight">{doc.filename}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[9px] bg-slate-900 text-white px-3 py-1 rounded-lg font-black uppercase tracking-widest">{doc.doc_type.replace(/_/g, ' ')}</span>
                        {doc.tags.map(tag => (
                          <span key={tag} className="text-[9px] bg-indigo-50 text-indigo-500 px-3 py-1 rounded-lg font-bold uppercase border border-indigo-100 flex items-center gap-1.5 shadow-sm">
                            <TagIcon size={10} className="opacity-60" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    {doc.verified_by_human && (
                      <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-200 shadow-sm">
                        <ShieldCheckIcon size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em]">Audited</span>
                      </div>
                    )}
                    <button 
                      onClick={(e) => removeDoc(doc.id, e)}
                      className="p-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                    >
                      <Trash2Icon size={22} />
                    </button>
                    <div className="p-4 text-slate-300 group-hover:text-indigo-600 transition-all transform group-hover:scale-125">
                      <ChevronDownIcon size={28} className="-rotate-90" />
                    </div>
                  </div>
                </div>
              ))}

              {documents.length === 0 && processingFiles.length === 0 && (
                <div className="py-32 text-center space-y-6 border-2 border-dashed border-slate-100 rounded-[3.5rem] bg-slate-50/20 shadow-inner">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-slate-200 border border-slate-100 shadow-xl">
                    <ArchiveIcon size={48} strokeWidth={1} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Repository Empty</p>
                    <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">Upload recovery evidence to initialize AI audit engine.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Intelligence Review Pane */}
        <div className="lg:w-[540px] shrink-0">
          {selectedDoc ? (
            <div className="bg-white border-2 border-slate-100 rounded-[3.5rem] shadow-2xl flex flex-col h-[850px] overflow-hidden animate-in slide-in-from-right-12 duration-500 sticky top-10 ring-1 ring-slate-100">
              {/* Header */}
              <div className="px-12 py-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-indigo-300 ring-4 ring-white">
                    <SparklesIcon size={28} />
                  </div>
                  <div className="overflow-hidden">
                    <h5 className="font-black text-slate-900 text-lg uppercase tracking-tight">Case Intelligence</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[280px] mt-1">{selectedDoc.filename}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-3 text-slate-400 hover:text-slate-900 transition-all bg-white rounded-2xl border border-slate-200 hover:shadow-lg active:scale-90"
                >
                  <XIcon size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100 bg-white">
                <button 
                  onClick={() => setReviewTab('fields')}
                  className={`flex-1 py-6 text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 relative ${reviewTab === 'fields' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:text-slate-600 bg-white'}`}
                >
                  <TypeIcon size={16} />
                  Structured Fields
                  {reviewTab === 'fields' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600"></div>}
                </button>
                <button 
                  onClick={() => setReviewTab('ocr')}
                  className={`flex-1 py-6 text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 relative ${reviewTab === 'ocr' ? 'text-indigo-600 bg-indigo-50/30' : 'text-slate-400 hover:text-slate-600 bg-white'}`}
                >
                  <FileSearchIcon size={16} />
                  Audit Rationale
                  {reviewTab === 'ocr' && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600"></div>}
                </button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-auto p-12 space-y-10 custom-scrollbar">
                {reviewTab === 'fields' ? (
                  <div className="space-y-8">
                    {/* Confidence Score Visual */}
                    {selectedDoc.extracted_fields.confidence_score && (
                      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">Extraction Reliability</p>
                            <p className="text-4xl font-black tracking-tight">{(selectedDoc.extracted_fields.confidence_score * 100).toFixed(1)}%</p>
                          </div>
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${selectedDoc.extracted_fields.confidence_score > 0.9 ? 'border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-amber-500 text-amber-500 shadow-lg shadow-amber-500/20'}`}>
                            <ShieldCheckIcon size={36} />
                          </div>
                        </div>
                        <div className="absolute -right-6 -bottom-6 opacity-5 rotate-12 group-hover:scale-125 group-hover:rotate-45 transition-all duration-1000">
                           <SparklesIcon size={120} fill="white" />
                        </div>
                      </div>
                    )}

                    {/* Document Classification Select */}
                    <div className="space-y-4">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2.5">
                        <FileIcon size={16} className="text-indigo-500" /> Statutory Classification
                      </label>
                      <div className="relative group">
                        <select 
                          value={selectedDoc.doc_type}
                          disabled={selectedDoc.verified_by_human}
                          onChange={(e) => updateDocType(e.target.value)}
                          className={`w-full px-8 py-5 border-2 rounded-3xl text-[14px] font-black transition-all outline-none appearance-none ${
                            selectedDoc.verified_by_human 
                              ? 'bg-slate-50 border-slate-100 text-slate-500 cursor-default' 
                              : 'bg-white border-slate-100 text-slate-800 focus:border-indigo-600 focus:ring-8 focus:ring-indigo-500/5 shadow-sm cursor-pointer hover:border-indigo-300'
                          }`}
                        >
                          {DOCUMENT_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        {!selectedDoc.verified_by_human && (
                          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                            <ChevronDownIcon size={20} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tags Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2.5">
                          <TagIcon size={16} className="text-indigo-500" /> Case Prioritization Tags
                        </label>
                        {!selectedDoc.verified_by_human && (
                          <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full text-[9px] font-black text-indigo-600 uppercase tracking-wider animate-pulse border border-indigo-100">
                            <SparklesIcon size={10} />
                            AI Suggesed
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-3 min-h-[60px] p-6 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-inner group/tags">
                        {selectedDoc.tags.map(tag => (
                          <div 
                            key={tag} 
                            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest shadow-sm transition-all animate-in zoom-in duration-300 ${
                              selectedDoc.verified_by_human 
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                : 'bg-white text-indigo-600 border-indigo-100 hover:border-red-200 hover:text-red-500 cursor-default'
                            }`}
                          >
                            {selectedDoc.verified_by_human ? <CheckIcon size={12} /> : <SparklesIcon size={12} className="opacity-40" />}
                            {tag}
                            {!selectedDoc.verified_by_human && (
                              <button 
                                onClick={() => removeTag(tag)} 
                                className="text-slate-300 hover:text-red-500 transition-colors ml-1 p-0.5 rounded-md hover:bg-red-50"
                              >
                                <XIcon size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                        {!selectedDoc.verified_by_human && (
                          <form onSubmit={addTag} className="flex-1 min-w-[140px]">
                            <div className="flex items-center gap-3 bg-white border-2 border-slate-100 rounded-2xl px-4 py-2 shadow-sm focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
                              <PlusIcon size={14} className="text-slate-300" />
                              <input 
                                type="text" 
                                placeholder="MANUAL TAG..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="w-full bg-transparent border-none p-0 text-[10px] font-black outline-none placeholder:text-slate-400 uppercase tracking-widest"
                              />
                            </div>
                          </form>
                        )}
                      </div>
                    </div>

                    {/* Compliance Marker */}
                    {selectedDoc.extracted_fields.jurisdiction_compliance_found && (
                      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-start gap-5 shadow-sm animate-in zoom-in duration-300">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <ShieldCheckIcon size={24} className="text-emerald-500" />
                        </div>
                        <p className="text-[13px] text-emerald-900 leading-relaxed font-bold">
                          Jurisdiction Verified: Document matches specific statutory requirements for {propertyState}.
                        </p>
                      </div>
                    )}

                    {!selectedDoc.verified_by_human && !selectedDoc.extracted_fields.jurisdiction_compliance_found && (
                      <div className="p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-5 shadow-sm">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                          <AlertCircleIcon size={24} className="text-amber-500" />
                        </div>
                        <p className="text-[13px] text-amber-900 leading-relaxed font-bold">
                          Verification Pending: Every data point must be audited for accuracy before authorizing recovery inclusion.
                        </p>
                      </div>
                    )}

                    <div className="space-y-8">
                      <div className="px-2 flex items-center justify-between">
                         <h6 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Metadata Artifacts</h6>
                         {!selectedDoc.verified_by_human && (
                            <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                               <RefreshCwIcon size={10} className="animate-spin-slow" />
                               Human Review Active
                            </div>
                         )}
                      </div>
                      <div className="grid grid-cols-1 gap-6">
                        {Object.entries(selectedDoc.extracted_fields).map(([key, value]) => {
                          if (['tags', 'document_type', 'extraction_rationale', 'confidence_score', 'discovered_liens', 'jurisdiction_compliance_found'].includes(key)) return null;
                          return (
                            <div key={key} className="group">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-3 group-focus-within:text-indigo-600 transition-colors flex items-center gap-2">
                                {getFieldIcon(key)}
                                {key.replace(/_/g, ' ')}
                              </label>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={value === null ? '' : String(value)}
                                  onChange={(e) => updateField(key, e.target.value)}
                                  className={`w-full px-8 py-5 border-2 rounded-[1.5rem] text-[15px] font-black transition-all outline-none ${
                                    selectedDoc.verified_by_human 
                                      ? 'bg-slate-50 border-slate-100 text-slate-500 cursor-default shadow-none' 
                                      : 'bg-white border-slate-100 text-slate-800 focus:border-indigo-600 focus:ring-8 focus:ring-indigo-500/5 shadow-sm'
                                  }`}
                                  readOnly={selectedDoc.verified_by_human}
                                />
                                {!selectedDoc.verified_by_human && (
                                  <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-indigo-200 transition-colors">
                                    <CheckCircle2Icon size={20} />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in duration-500">
                     <div className="p-10 bg-slate-900 text-indigo-100 rounded-[3rem] font-mono text-[13px] leading-relaxed border border-indigo-500/30 shadow-2xl min-h-[500px] selection:bg-indigo-500 selection:text-white">
                        <div className="mb-6 flex items-center justify-between border-b border-indigo-500/20 pb-4">
                           <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest">Raw OCR Stream</span>
                           <span className="text-[10px] text-indigo-600 font-black">UTF-8 / LATIN-1</span>
                        </div>
                        {selectedDoc.ocr_text || "Logic trace dormant. Extraction rationale not found."}
                     </div>
                     <div className="flex items-center justify-center gap-4 text-slate-400 px-6">
                        <div className="h-px flex-1 bg-slate-100"></div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Audit Logic Grounding Complete</p>
                        <div className="h-px flex-1 bg-slate-100"></div>
                     </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-12 bg-slate-50 border-t border-slate-100 flex flex-col gap-5">
                <button 
                  onClick={() => approveDoc(selectedDoc.id)}
                  disabled={selectedDoc.verified_by_human}
                  className={`w-full flex items-center justify-center gap-4 py-6 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.15em] transition-all shadow-2xl ${
                    selectedDoc.verified_by_human 
                      ? 'bg-emerald-600 text-white cursor-default shadow-emerald-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200 transform hover:-translate-y-1.5'
                  }`}
                >
                  {selectedDoc.verified_by_human ? <ClipboardCheckIcon size={24} /> : <CheckCircle2Icon size={24} />}
                  {selectedDoc.verified_by_human ? 'Record Fully Authorized' : 'Confirm & Authorize Data'}
                </button>
                
                {!selectedDoc.verified_by_human && (
                  <button 
                    onClick={(e) => removeDoc(selectedDoc.id, e)}
                    className="flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest"
                  >
                    <Trash2Icon size={18} />
                    Reject Artifact
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[4rem] flex flex-col items-center justify-center p-20 text-center h-[750px] group transition-all hover:bg-slate-50/50 hover:border-indigo-100">
              <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mb-10 border-2 border-slate-50 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                <FileSearchIcon size={56} className="text-slate-200 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h5 className="font-black text-slate-800 uppercase text-lg tracking-[0.2em] mb-4">Inspection Dormant</h5>
              <p className="text-sm font-medium text-slate-400 max-w-[320px] mx-auto leading-relaxed">
                Select a legal record from the inventory to initiate the Deep Audit protocol and verify extracted recovery points.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
