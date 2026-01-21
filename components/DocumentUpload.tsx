
import React, { useState, useCallback, useRef } from 'react';
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
  ShieldCheckIcon
} from 'lucide-react';
import { Document } from '../types';
import { extractDocumentData } from '../lib/gemini';

interface DocumentUploadProps {
  propertyId: string;
}

interface ProcessingFile {
  id: string;
  name: string;
  progress: number;
  status: 'initializing' | 'uploading' | 'extracting' | 'finalizing' | 'error';
  error?: string;
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
    
    // Initial state
    setProcessingFiles(prev => [...prev, { 
      id: fileId, 
      name: file.name, 
      progress: 5, 
      status: 'initializing' 
    }]);

    try {
      // Step 1: Read File
      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 20, status: 'uploading' } : f));
      const base64 = await readFileAsBase64(file);

      // Step 2: AI Extraction
      setProcessingFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress: 45, status: 'extracting' } : f));
      const aiData = await extractDocumentData(base64, file.type);
      
      // Step 3: Finalizing
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
      
      // Success Cleanup
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
      
      // Keep error visible for a bit then remove
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
          <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`bg-white rounded-[2.5rem] border-2 border-dashed p-12 text-center group transition-all shadow-sm relative overflow-hidden ${
              isDragging ? 'bg-indigo-50 border-indigo-500 scale-[1.01] ring-4 ring-indigo-500/10' : 'border-slate-200 hover:bg-slate-50/50 hover:border-indigo-400'
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
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-5 relative z-10">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'bg-indigo-600 text-white scale-110 shadow-xl shadow-indigo-200 rotate-12' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-110'
              }`}>
                {isDragging ? <PlusIcon size={40} /> : <UploadCloudIcon size={40} />}
              </div>
              <div className="space-y-1">
                <p className="text-xl font-black text-slate-900 tracking-tight">
                  {isDragging ? 'Drop Artifacts Now' : 'Ingest Legal Artifacts'}
                </p>
                <p className="text-sm text-slate-500 font-medium">Batch upload enabled • Multi-format support (PDF, JPG, PNG)</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">AI OCR Enabled</span>
                  <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest shadow-sm">Audit Grounding</span>
                </div>
              </div>
            </label>
            {isDragging && (
              <div className="absolute inset-0 pointer-events-none border-4 border-indigo-600/20 m-2 rounded-[2rem] animate-pulse"></div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Case Artifacts</h5>
                <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-black text-slate-600">{documents.length}</span>
              </div>
              {documents.length > 0 && (
                <button 
                  onClick={clearAllDocuments}
                  className="px-4 py-2 bg-red-50 text-[10px] font-black text-red-600 rounded-xl uppercase tracking-widest hover:bg-red-600 hover:text-white flex items-center gap-2 transition-all border border-red-100 shadow-sm"
                >
                  <Trash2Icon size={14} />
                  Purge Case Inventory
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Processing Items with Progress Bars */}
              {processingFiles.map(file => (
                <div 
                  key={file.id}
                  className={`flex flex-col p-6 rounded-[2rem] shadow-sm animate-in fade-in slide-in-from-top-4 duration-300 border-2 ${
                    file.status === 'error' ? 'bg-red-50 border-red-100' : 'bg-white border-indigo-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
                        file.status === 'error' ? 'bg-red-100 text-red-500' : 'bg-indigo-50 text-indigo-500'
                      }`}>
                        {file.status === 'error' ? <AlertCircleIcon size={28} /> : <RefreshCwIcon size={28} className="animate-spin" />}
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900 tracking-tight truncate max-w-[240px]">{file.name}</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${file.status === 'error' ? 'text-red-600' : 'text-indigo-600'}`}>
                          {file.status === 'error' ? 'System Failure' : `Extraction Engine: ${file.status}...`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black ${file.status === 'error' ? 'text-red-500' : 'text-indigo-600'}`}>
                        {file.status === 'error' ? '!' : `${file.progress}%`}
                      </p>
                    </div>
                  </div>
                  
                  {file.status === 'error' ? (
                    <div className="bg-white p-3 rounded-xl border border-red-200">
                      <p className="text-[11px] font-bold text-red-700">{file.error}</p>
                    </div>
                  ) : (
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-indigo-600 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(79,70,229,0.5)]"
                        style={{ width: `${file.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}

              {/* Uploaded Documents */}
              {documents.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`flex items-center justify-between p-6 bg-white border-2 rounded-[2rem] cursor-pointer transition-all group ${
                    selectedDoc?.id === doc.id 
                      ? 'border-indigo-600 shadow-2xl shadow-indigo-100 -translate-y-1' 
                      : 'border-slate-100 hover:border-indigo-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
                      doc.verified_by_human 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                    }`}>
                      {doc.verified_by_human ? <FileCheckIcon size={32} /> : <FileIcon size={32} />}
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900 tracking-tight">{doc.filename}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        <span className="text-[9px] bg-slate-900 text-white px-2.5 py-1 rounded-lg font-black uppercase tracking-widest">{doc.doc_type.replace(/_/g, ' ')}</span>
                        {doc.tags.map(tag => (
                          <span key={tag} className="text-[9px] bg-indigo-50 text-indigo-500 px-2.5 py-1 rounded-lg font-bold uppercase border border-indigo-100">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {doc.verified_by_human && (
                      <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <ShieldCheckIcon size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                      </div>
                    )}
                    <button 
                      onClick={(e) => removeDoc(doc.id, e)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2Icon size={20} />
                    </button>
                    <div className="p-3 text-slate-300 group-hover:text-indigo-600 transition-all transform group-hover:scale-110">
                      <EyeIcon size={24} />
                    </div>
                  </div>
                </div>
              ))}

              {documents.length === 0 && processingFiles.length === 0 && (
                <div className="py-24 text-center space-y-4 border-2 border-dashed border-slate-100 rounded-[3rem]">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 border border-slate-100 shadow-inner">
                    <ArchiveIcon size={40} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No artifacts detected</p>
                    <p className="text-xs text-slate-400 font-medium">Upload deeds, tax bills, or affidavits to begin</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Intelligence Review Pane */}
        <div className="lg:w-[500px] shrink-0">
          {selectedDoc ? (
            <div className="bg-white border-2 border-slate-100 rounded-[3rem] shadow-2xl flex flex-col h-[800px] overflow-hidden animate-in slide-in-from-right-8 duration-500 sticky top-10">
              {/* Header */}
              <div className="px-10 py-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200 ring-4 ring-white">
                    <SparklesIcon size={24} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-900 text-base uppercase tracking-tight">Intelligence Inspector</h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate max-w-[240px] mt-0.5">{selectedDoc.filename}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-xl border border-slate-200 hover:shadow-md"
                >
                  <XIcon size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-100">
                <button 
                  onClick={() => setReviewTab('fields')}
                  className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${reviewTab === 'fields' ? 'text-indigo-600 border-b-4 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600 bg-slate-50/30'}`}
                >
                  <TypeIcon size={16} />
                  Structured Fields
                </button>
                <button 
                  onClick={() => setReviewTab('ocr')}
                  className={`flex-1 py-5 text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${reviewTab === 'ocr' ? 'text-indigo-600 border-b-4 border-indigo-600 bg-white' : 'text-slate-400 hover:text-slate-600 bg-slate-50/30'}`}
                >
                  <FileSearchIcon size={16} />
                  Audit Rationale
                </button>
              </div>
              
              {/* Content Area */}
              <div className="flex-1 overflow-auto p-10 space-y-8 custom-scrollbar">
                {reviewTab === 'fields' ? (
                  <div className="space-y-6">
                    {/* Confidence Score Visual */}
                    {selectedDoc.extracted_fields.confidence_score && (
                      <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Extraction Confidence</p>
                            <p className="text-3xl font-black">{(selectedDoc.extracted_fields.confidence_score * 100).toFixed(1)}%</p>
                          </div>
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${selectedDoc.extracted_fields.confidence_score > 0.9 ? 'border-emerald-500 text-emerald-500' : 'border-amber-500 text-amber-500'}`}>
                            <ShieldCheckIcon size={32} />
                          </div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                           <SparklesIcon size={100} fill="white" />
                        </div>
                      </div>
                    )}

                    {/* Tags Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <TagIcon size={14} className="text-indigo-500" /> Case Classifications
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[50px] p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                        {selectedDoc.tags.map(tag => (
                          <div key={tag} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-indigo-100 text-[10px] font-black text-indigo-600 shadow-sm">
                            {tag}
                            {!selectedDoc.verified_by_human && (
                              <button onClick={() => removeTag(tag)} className="text-slate-300 hover:text-red-500 transition-colors">
                                <XIcon size={12} />
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
                              className="w-full bg-transparent border-none p-0 text-[10px] font-black outline-none placeholder:text-slate-400"
                            />
                          </form>
                        )}
                      </div>
                    </div>

                    {!selectedDoc.verified_by_human && (
                      <div className="p-5 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4">
                        <AlertCircleIcon size={22} className="text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[12px] text-amber-900 leading-relaxed font-bold">
                          Data verification required. Compare extraction points with original artifact before authorizing final waterfall inclusion.
                        </p>
                      </div>
                    )}

                    <div className="space-y-6">
                      {Object.entries(selectedDoc.extracted_fields).map(([key, value]) => {
                        if (['tags', 'document_type', 'extraction_rationale', 'confidence_score', 'discovered_liens'].includes(key)) return null;
                        return (
                          <div key={key} className="group">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2.5 px-2 group-focus-within:text-indigo-600 transition-colors">
                              {key.replace(/_/g, ' ')}
                            </label>
                            <div className="relative">
                              <input 
                                type="text" 
                                value={value === null ? '' : String(value)}
                                onChange={(e) => updateField(key, e.target.value)}
                                className={`w-full px-6 py-4 border-2 rounded-2xl text-[13px] font-black transition-all outline-none ${
                                  selectedDoc.verified_by_human 
                                    ? 'bg-slate-50 border-slate-100 text-slate-500' 
                                    : 'bg-white border-slate-100 text-slate-800 focus:border-indigo-600 focus:ring-8 focus:ring-indigo-500/5 shadow-sm'
                                }`}
                                readOnly={selectedDoc.verified_by_human}
                              />
                              {!selectedDoc.verified_by_human && (
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-indigo-200 transition-colors">
                                  <SparklesIcon size={16} />
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                     <div className="p-8 bg-slate-900 text-indigo-100 rounded-[2.5rem] font-mono text-[12px] leading-relaxed border border-indigo-500/30 shadow-2xl min-h-[450px]">
                        {selectedDoc.ocr_text || "System logic dormant. Initiate extraction to view rationale."}
                     </div>
                     <div className="flex items-center justify-center gap-3 text-slate-400 px-4">
                        <div className="h-px flex-1 bg-slate-100"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest">Logic Trace Grounding</p>
                        <div className="h-px flex-1 bg-slate-100"></div>
                     </div>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="p-10 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-4">
                <button 
                  onClick={() => approveDoc(selectedDoc.id)}
                  disabled={selectedDoc.verified_by_human}
                  className={`w-full flex items-center justify-center gap-4 py-5 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all shadow-2xl ${
                    selectedDoc.verified_by_human 
                      ? 'bg-emerald-600 text-white cursor-default shadow-emerald-200' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200 transform hover:-translate-y-1'
                  }`}
                >
                  {selectedDoc.verified_by_human ? <ClipboardCheckIcon size={20} /> : <CheckCircle2Icon size={20} />}
                  {selectedDoc.verified_by_human ? 'Artifact Fully Audited' : 'Authorize Recovery Data'}
                </button>
                
                {!selectedDoc.verified_by_human && (
                  <button 
                    onClick={(e) => removeDoc(selectedDoc.id, e)}
                    className="flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest"
                  >
                    <Trash2Icon size={16} />
                    Reject & Delete
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border-4 border-dashed border-slate-100 rounded-[3.5rem] flex flex-col items-center justify-center p-16 text-center h-[700px] group transition-all hover:bg-slate-50/50">
              <div className="w-28 h-28 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 shadow-xl group-hover:scale-110 transition-transform duration-500">
                <FileSearchIcon size={48} className="text-slate-200 group-hover:text-indigo-200 transition-colors" />
              </div>
              <h5 className="font-black text-slate-800 uppercase text-sm tracking-[0.2em] mb-3">Intelligence Inspector Dormant</h5>
              <p className="text-sm font-medium text-slate-400 max-w-[260px] leading-relaxed">
                Select a legal artifact from the case inventory to initiate deep audit and verification protocols.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
