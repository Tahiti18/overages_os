
import React, { useState } from 'react';
import { 
  Gavel, 
  Search, 
  ShieldCheck, 
  ExternalLink, 
  Loader2, 
  UserPlus, 
  Scale, 
  Globe, 
  Phone, 
  Mail, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Send, 
  Briefcase, 
  Home, 
  Users, 
  FileSearch, 
  Filter,
  AlertCircle
} from 'lucide-react';
import { researchSpecializedCounsel } from '../lib/gemini';
import Tooltip from './Tooltip';

interface AttorneyHubProps {
  state: string;
  county: string;
}

const SPECIALIZATIONS = [
  { id: 'surplus', label: 'Surplus Recovery', icon: Scale, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'probate', label: 'Probate Law', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'tax', label: 'Tax Law', icon: FileSearch, color: 'text-rose-600', bg: 'bg-rose-50' },
  { id: 'litigation', label: 'Real Estate Litigation', icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50' }
];

const AttorneyHub: React.FC<AttorneyHubProps> = ({ state, county }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [retaining, setRetaining] = useState<string | null>(null);
  const [activeSpecialization, setActiveSpecialization] = useState(SPECIALIZATIONS[0].label);

  const handleResearch = async () => {
    setLoading(true);
    setError(null);
    setResults([]); 
    try {
      const data = await researchSpecializedCounsel(state, county, activeSpecialization);
      if (Array.isArray(data) && data.length > 0) {
        setResults(data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Handle case where model might return a single object instead of array
        setResults([data]);
      } else {
        setError(`The discovery engine could not find verified ${activeSpecialization} practitioners in ${county}. Try broadening your search or checking the regional Bar association.`);
        setResults([]);
      }
    } catch (err) {
      console.error(err);
      setError("AI Intelligence Hub Timeout. Please ensure your API Key is active and authorized for search grounding.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetain = (id: string) => {
    setRetaining(id);
    setTimeout(() => setRetaining(null), 2000); 
  };

  const handleContact = (attorney: any) => {
    const subject = `New Case Referral: ${activeSpecialization} - ${county}, ${state}`;
    const body = `Hello ${attorney.name},

I am reaching out from the Prospector AI platform regarding a potential ${activeSpecialization} case in ${county}, ${state}.

We have identified a recovery opportunity that matches your firm's expertise. We would like to confirm your current capacity for a formal referral in this jurisdiction.

Please let us know your standard fee structure for ${activeSpecialization} matters and the best time for a brief consultation.

Best regards,
Lead Recovery Agent
Prospector AI Platform`;

    const mailtoUrl = `mailto:${attorney.contact_info}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl border-2 border-white/5">
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-12">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-indigo-600 rounded-[1.5rem] shadow-2xl shadow-indigo-950/40">
                  <Gavel size={32} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-4xl font-black tracking-tight uppercase italic leading-none">Counsel Terminal</h3>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-2">Active Research: {county}, {state}</p>
                </div>
              </div>
              <p className="text-indigo-100 font-bold text-xl leading-relaxed italic opacity-90">
                Strategic Legal Discovery. Identify specialized partners for complex surplus recovery, probate issues, or senior lien litigation.
              </p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-3">
                  <Filter size={14} className="text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Set Specialization Filter</span>
               </div>
               <div className="flex flex-wrap gap-3">
                  {SPECIALIZATIONS.map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => setActiveSpecialization(spec.label)}
                      className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all border-2 shadow-xl ${
                        activeSpecialization === spec.label 
                          ? 'bg-white text-indigo-950 border-indigo-500 scale-105 shadow-indigo-500/20' 
                          : 'bg-white/5 text-indigo-200 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <spec.icon size={16} className={activeSpecialization === spec.label ? spec.color : 'text-indigo-400'} />
                      {spec.label}
                    </button>
                  ))}
               </div>
            </div>

            <Tooltip content={`Research the legal registry specifically for ${activeSpecialization} attorneys.`}>
              <button 
                onClick={handleResearch} 
                disabled={loading}
                className="px-12 py-6 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-3xl shadow-indigo-950/40 hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50 border-2 border-white/10 w-full md:w-auto"
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Sparkles size={24} className="text-amber-400" />}
                {loading ? 'Accessing Legal Registry...' : `Scan for ${activeSpecialization} Counsel`}
              </button>
            </Tooltip>
          </div>
          <div className="hidden xl:block opacity-10 group-hover:opacity-20 transition-all duration-1000 rotate-12 group-hover:rotate-0">
             <Scale size={260} />
          </div>
        </div>
        <div className="absolute -right-40 -bottom-40 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px]"></div>
      </div>

      {error && (
        <div className="p-8 bg-rose-50 border-2 border-rose-100 rounded-[2.5rem] flex items-start gap-6 animate-in slide-in-from-top-4">
           <div className="p-4 bg-rose-600 text-white rounded-2xl shadow-xl">
             <AlertCircle size={28} />
           </div>
           <div className="space-y-1">
             <p className="text-lg font-black text-rose-900 uppercase tracking-tight italic">Discovery Friction Detected</p>
             <p className="text-sm text-rose-800 font-bold leading-relaxed">{error}</p>
           </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
          {results.map((attorney, idx) => (
            <div key={idx} className="bg-white border-2 border-slate-100 rounded-[3.5rem] p-10 hover:border-indigo-400 hover:shadow-3xl transition-all group flex flex-col h-full shadow-2xl relative overflow-hidden ring-1 ring-slate-100">
              <div className="flex items-start justify-between mb-8">
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl border-2 transition-all group-hover:rotate-3 ${attorney.expertise_score > 85 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-indigo-50 text-indigo-600 border-indigo-200'}`}>
                  {attorney.name[0]}
                </div>
                <div className="flex flex-col items-end">
                   <div className="px-4 py-1.5 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/10 mb-2">
                     {attorney.expertise_score} RANK
                   </div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{activeSpecialization}</span>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-1">{attorney.name}</h4>
                  <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.15em] italic">{attorney.firm}</p>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-4 text-slate-600 p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-white transition-colors">
                      <Mail size={16} className="text-indigo-500" />
                      <span className="text-xs font-bold truncate tracking-tight">{attorney.contact_info}</span>
                   </div>
                   <div className="p-6 bg-indigo-50/30 rounded-[2rem] border-2 border-indigo-100/50 italic text-[13px] text-slate-600 leading-relaxed font-bold shadow-sm relative">
                      <div className="absolute -top-3 -left-2 bg-white p-1.5 rounded-lg border border-indigo-100">
                         {/* Fix: Replaced undefined SparklesIcon with imported Sparkles component */}
                         <Sparkles size={14} className="text-indigo-500" />
                      </div>
                      "{attorney.rationale}"
                   </div>
                </div>
              </div>

              <div className="pt-10 mt-8 border-t-2 border-slate-50 space-y-4">
                 <div className="flex items-center gap-4">
                    <Tooltip content="Assign this counsel to the case file for final filing.">
                        <button 
                          onClick={() => handleRetain(attorney.name)}
                          className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${retaining === attorney.name ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-white hover:bg-indigo-600 shadow-indigo-950/20'}`}
                        >
                          {retaining === attorney.name ? <Check size={20} strokeWidth={3} /> : <UserPlus size={20} />}
                          {retaining === attorney.name ? 'Assigned' : 'Retain Counsel'}
                        </button>
                    </Tooltip>
                    <a href={attorney.website} target="_blank" rel="noreferrer" className="p-5 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl hover:text-indigo-600 hover:border-indigo-400 transition-all shadow-lg hover:scale-110 active:scale-95">
                        <ExternalLink size={22} />
                    </a>
                 </div>
                 
                 <Tooltip content={`Generate a referral email to ${attorney.name}.`}>
                    <button 
                      onClick={() => handleContact(attorney)}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 border-transparent hover:border-indigo-400 shadow-sm"
                    >
                      <Send size={14} />
                      Contact Attorney
                    </button>
                 </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && !error && (
        <div className="py-40 text-center border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/20 shadow-inner flex flex-col items-center justify-center space-y-10 group hover:bg-white hover:border-indigo-200 transition-all duration-700">
           <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-3xl border-2 border-slate-50 text-slate-100 group-hover:text-indigo-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
              <Scale size={64} />
           </div>
           <div className="space-y-4">
              <p className="text-slate-400 font-black uppercase text-xl tracking-[0.2em] italic">Counsel Hub Standing By</p>
              <p className="text-sm text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                Select a legal domain and execute the <span className="text-indigo-600">Deep Search Protocol</span> to populate the regional counselor grid.
              </p>
           </div>
        </div>
      )}
    </div>
  );
};

export default AttorneyHub;
