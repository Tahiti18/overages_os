
import React, { useState, useRef } from 'react';
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
  ShieldCheckIcon,
  Volume2Icon,
  Loader2Icon,
  PlayIcon
} from 'lucide-react';
import { generateVoiceGuide } from '../lib/gemini';
import { decode, decodeAudioData } from '../lib/live-api-utils';

interface UserGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState('');
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const sections = [
    {
      id: 'discovery',
      title: 'Discovery & Intake',
      icon: TargetIcon,
      items: [
        { label: 'Intelligence Rank', desc: 'A 0-100 score calculating yield vs. risk. High scores indicate the best recovery probability.' },
        { label: 'Lead Ingestion', desc: 'Use "New Intake" to add records or "AI Extraction" to parse tax sale deeds automatically.' }
      ]
    },
    {
      id: 'research',
      title: 'Research (Skip-Trace)',
      icon: SearchIcon,
      items: [
        { label: 'Grounding Search', desc: 'Powered by Gemini 3.0 Flash. Scours public records to verify claimant identity and location.' },
        { label: 'Verification Pulse', desc: 'Every AI output requires human-in-the-loop (HITL) authorization for compliance.' }
      ]
    },
    {
      id: 'waterfall',
      title: 'Waterfall Logic',
      icon: CalculatorIcon,
      items: [
        { label: 'Seniority Rules', desc: 'Priority hierarchy governs debt satisfaction. Government liens always take precedence over mortgages.' },
        { label: 'Residual Yield', desc: 'The final amount allocated to the claimant after all senior encumbrances are satisfied.' }
      ]
    },
    {
      id: 'closing',
      title: 'Closing & Filing',
      icon: ArchiveIcon,
      items: [
        { label: 'Document Packaging', desc: 'Automatically assembles demand letters and affidavits for county filing.' },
        { label: 'Statutory Deadlines', desc: 'Track compliance calendars to ensure claims are filed within the local window.' }
      ]
    }
  ];

  const handleSpeak = async (id: string, text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(id);
    
    try {
      // Initialize or resume AudioContext (browser requirement)
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const base64 = await generateVoiceGuide(text);
      
      // Use standardized decoder for raw PCM stream
      const buffer = await decodeAudioData(
        decode(base64),
        ctx,
        24000,
        1
      );
      
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.onended = () => setIsSpeaking(null);
      source.start();
    } catch (err) {
      console.error("Narrator System Error:", err);
      setIsSpeaking(null);
    }
  };

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
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        {/* Header - High Contrast */}
        <div className="p-10 bg-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-900/50">
              <BookOpenIcon size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">System Manual</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">V3.5 • Voice-Over Navigation</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/50 hover:text-white">
            <XIcon size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 shrink-0">
          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logic or legal rules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border-2 border-slate-200 rounded-2xl pl-12 pr-4 py-5 text-sm font-black outline-none focus:border-indigo-600 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar bg-white">
          <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center gap-5">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                <Volume2Icon size={24} className={isSpeaking ? 'animate-bounce' : ''} />
             </div>
             <div>
                <p className="text-sm font-black text-indigo-900 leading-none mb-1">Narration Active</p>
                <p className="text-xs font-bold text-indigo-600/80">Click the play icon to hear AI explain our recovery protocols.</p>
             </div>
          </div>

          {filteredSections.map((section, idx) => (
            <div key={idx} className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                 <div className="flex items-center gap-3">
                    <section.icon size={20} className="text-indigo-600" />
                    <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-800">{section.title}</h3>
                 </div>
                 <button 
                  onClick={() => handleSpeak(section.id, `Now explaining ${section.title}. ${section.items.map(i => `${i.label}: ${i.desc}`).join(' ')}`)}
                  className={`p-3 rounded-xl transition-all shadow-sm ${isSpeaking === section.id ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20' : 'bg-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100'}`}
                 >
                    {isSpeaking === section.id ? <Loader2Icon size={18} className="animate-spin" /> : <PlayIcon size={18} />}
                 </button>
              </div>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="group p-6 bg-white border-2 border-slate-100 rounded-[2rem] hover:border-indigo-400 hover:shadow-2xl transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-black text-sm text-slate-900 uppercase tracking-tight">{item.label}</h4>
                      <ChevronRightIcon size={16} className="text-slate-200 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-bold">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="text-center py-20">
              <HelpCircleIcon size={56} className="text-slate-100 mx-auto mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No documentation found</p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-10 bg-slate-50 border-t border-slate-200 shrink-0">
           <button 
            onClick={() => handleSpeak('global', 'Welcome to Prospector AI. Our platform automates the end to end property tax surplus recovery lifecycle. Start by exploring the Market Intelligence hub to identify high-yield states like Florida and Georgia, then use our Autonomous Suite to research and verify claimants.')}
            className="w-full flex items-center justify-center gap-3 py-5 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all active:scale-95"
           >
             {isSpeaking === 'global' ? <Loader2Icon size={18} className="animate-spin" /> : <SparklesIcon size={18} className="text-indigo-400" />}
             Intro Voice-Over
           </button>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
