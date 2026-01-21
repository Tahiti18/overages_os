
import React, { useState } from 'react';
import { 
  GavelIcon, 
  SearchIcon, 
  ShieldCheckIcon, 
  ExternalLinkIcon, 
  Loader2Icon, 
  UserPlusIcon, 
  ScaleIcon, 
  GlobeIcon,
  PhoneIcon,
  MailIcon,
  SparklesIcon,
  RefreshCwIcon,
  CheckIcon,
  SendIcon
} from 'lucide-react';
import { researchSpecializedCounsel } from '../lib/gemini';
import Tooltip from './Tooltip';

interface AttorneyHubProps {
  state: string;
  county: string;
}

const AttorneyHub: React.FC<AttorneyHubProps> = ({ state, county }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [retaining, setRetaining] = useState<string | null>(null);

  const handleResearch = async () => {
    setLoading(true);
    try {
      const data = await researchSpecializedCounsel(state, county);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetain = (id: string) => {
    setRetaining(id);
    setTimeout(() => setRetaining(null), 2000); // Simulate retention
  };

  const handleContact = (attorney: any) => {
    const subject = `Case Referral: Property Tax Surplus Recovery - ${county}, ${state}`;
    const body = `Hello ${attorney.name},

I am contacting you regarding a potential property tax surplus recovery case in ${county}, ${state}. 

Our platform has identified significant excess proceeds associated with a recent tax sale, and we are looking for specialized legal counsel with expertise in this jurisdiction to assist with the motion for distribution and judicial oversight.

Could you please confirm your current capacity for new case referrals and your standard fee structure for surplus recovery litigation?

Best regards,
Prospector AI Platform Agent`;

    const mailtoUrl = `mailto:${attorney.contact_info}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl border border-white/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-indigo-600 rounded-2xl">
                <GavelIcon size={24} />
              </div>
              <h3 className="text-3xl font-black tracking-tight uppercase italic">Counsel Terminal</h3>
            </div>
            <p className="text-indigo-200 font-bold text-lg leading-relaxed mb-8">
              Analyze specialized legal networks for <span className="text-white underline decoration-indigo-500 underline-offset-4">{county}, {state}</span>. AI scours local filings to find high-conversion surplus counsel.
            </p>
            <Tooltip content="Launch a deep scan of local legal registries and judicial filings for surplus experts.">
              <button 
                onClick={handleResearch} 
                disabled={loading}
                className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-950/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2Icon size={20} className="animate-spin" /> : <SparklesIcon size={20} className="text-indigo-600" />}
                {loading ? 'Analyzing Legal Networks...' : 'Discover Specialized Counsel'}
              </button>
            </Tooltip>
          </div>
          <div className="hidden lg:block opacity-20 group-hover:opacity-30 transition-opacity">
             <ScaleIcon size={180} />
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
          {results.map((attorney, idx) => (
            <div key={idx} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 hover:border-indigo-400 hover:shadow-2xl transition-all group flex flex-col h-full shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border transition-all ${attorney.expertise_score > 85 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                  {attorney.name[0]}
                </div>
                <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                  {attorney.expertise_score} XP
                </div>
              </div>

              <div className="flex-1">
                <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{attorney.name}</h4>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{attorney.firm}</p>
                
                <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-slate-600">
                      <MailIcon size={14} className="text-indigo-500" />
                      <span className="text-xs font-bold truncate">{attorney.contact_info}</span>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 italic text-xs text-slate-500 leading-relaxed font-medium">
                      "{attorney.rationale}"
                   </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-3">
                 <div className="flex items-center gap-3">
                    <Tooltip content="Initiate a case referral and propose a fee-sharing agreement.">
                        <button 
                          onClick={() => handleRetain(attorney.name)}
                          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${retaining === attorney.name ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'}`}
                        >
                          {retaining === attorney.name ? <CheckIcon size={14} /> : <UserPlusIcon size={14} />}
                          {retaining === attorney.name ? 'Referral Sent' : 'Assign Counsel'}
                        </button>
                    </Tooltip>
                    <a href={attorney.website} target="_blank" rel="noreferrer" className="p-4 bg-white border-2 border-slate-200 text-slate-400 rounded-xl hover:text-indigo-600 hover:border-indigo-200 transition-all">
                        <ExternalLinkIcon size={16} />
                    </a>
                 </div>
                 
                 <Tooltip content="Open an email draft with pre-filled case data for this attorney.">
                    <button 
                      onClick={() => handleContact(attorney)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] transition-all border border-slate-100"
                    >
                      <SendIcon size={12} />
                      Direct Outreach
                    </button>
                 </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && (
        <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[4rem] bg-slate-50/30">
           <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl border border-slate-50 text-slate-200">
              <ScaleIcon size={48} />
           </div>
           <p className="text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Registry Idle</p>
           <p className="text-xs text-slate-400 font-bold">Initiate search to identify specialized counsel for this jurisdiction.</p>
        </div>
      )}
    </div>
  );
};

export default AttorneyHub;
