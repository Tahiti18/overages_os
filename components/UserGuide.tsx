
import React, { useState } from 'react';
import { 
  BookOpenIcon, 
  XIcon, 
  SearchIcon, 
  ZapIcon, 
  TargetIcon, 
  ScaleIcon, 
  CalculatorIcon, 
  ArchiveIcon, 
  ChevronRightIcon,
  HelpCircleIcon,
  SparklesIcon,
  ShieldCheckIcon
} from 'lucide-react';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');

  const sections = [
    {
      title: 'Discovery & Intake',
      icon: TargetIcon,
      items: [
        { label: 'Intelligence Rank', desc: 'A 0-100 score calculating yield vs. risk. 90+ scores indicate high-priority "Pulse" cases.' },
        { label: 'Lead Ingestion', desc: 'Use "New Intake" to manually add records or "AI Extraction" to parse tax sale deeds automatically.' }
      ]
    },
    {
      title: 'Research (Skip-Trace)',
      icon: SearchIcon,
      items: [
        { label: 'Grounding Search', desc: 'Powered by Gemini 3.0 Flash. Scours public records and obituary indices to verify claimant identity.' },
        { label: 'Verification Pulse', desc: 'Requires human-in-the-loop (HITL) authorization before a claimant can be added to the waterfall.' }
      ]
    },
    {
      title: 'Waterfall Logic',
      icon: CalculatorIcon,
      items: [
        { label: 'Seniority Rules', desc: 'Priority is governed by state-specific rules (e.g., GA 47-B). Government liens always take precedence.' },
        { label: 'Residual Yield', desc: 'The net amount remaining after all senior encumbrances are satisfied from the gross surplus.' }
      ]
    },
    {
      title: 'Closing & Filing',
      icon: ArchiveIcon,
      items: [
        { label: 'Document Packaging', desc: 'Automatically assembles demand letters, affidavits, and final accounting for county filing.' },
        { label: 'Compliance Tracking', desc: 'Monitor the statutory calendar to ensure no claim is barred by the statute of limitations.' }
      ]
    }
  ];

  const filteredSections = sections.map(s => ({
    ...s,
    items: s.items.filter(i => 
      i.label.toLowerCase().includes(search.toLowerCase()) || 
      i.desc.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(s => s.items.length > 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        {/* Header */}
        <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-900/50">
              <BookOpenIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Platform Guide</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-0.5">Prospector AI v3.0 Documentation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <XIcon size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search functions, logic, or rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-xs font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {filteredSections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <section.icon size={18} className="text-indigo-600" />
                <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">{section.title}</h3>
              </div>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="group p-5 bg-white border border-slate-100 rounded-[1.5rem] hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-sm text-slate-900">{item.label}</h4>
                      <ChevronRightIcon size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-20">
              <HelpCircleIcon size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase">No guide matches found</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <div className="p-5 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group">
            <div className="relative z-10 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">System Support</p>
                <p className="text-sm font-black">Join Legal Sync Live</p>
              </div>
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                Connect Now
              </button>
            </div>
            <SparklesIcon size={80} className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
