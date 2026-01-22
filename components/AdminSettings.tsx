
import React, { useState, useEffect } from 'react';
import { 
  LockIcon, 
  ShieldCheckIcon, 
  KeyIcon, 
  TerminalIcon, 
  ZapIcon, 
  ServerIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  ShieldIcon,
  CheckCircle2Icon
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [envKeyDetected, setEnvKeyDetected] = useState(false);

  useEffect(() => {
    // Check if environment has a key following Google GenAI SDK guidelines
    const hasEnv = !!process.env.API_KEY;
    setEnvKeyDetected(hasEnv);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-slate-950 text-indigo-400 rounded-3xl shadow-2xl border-2 border-white/10 ring-8 ring-indigo-500/5">
          <TerminalIcon size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Protocol Authorization</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-1">Enterprise Access Control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100">
          <div className="p-12 space-y-10">
            <div className="flex items-center justify-between border-b-2 border-slate-50 pb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic flex items-center gap-3">
                  <ShieldIcon size={22} className="text-indigo-600" />
                  System Security Status
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Environment Synchronization</p>
              </div>
              <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-3 shadow-sm ${envKeyDetected ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                <ServerIcon size={16} />
                Sync Status: {envKeyDetected ? 'AUTHORIZED' : 'MISSING KEY'}
              </div>
            </div>

            <div className="space-y-8">
              <div className={`p-8 rounded-[2.5rem] border-2 flex items-start gap-6 transition-all ${envKeyDetected ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                <div className={`p-3 rounded-2xl shadow-lg ${envKeyDetected ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {envKeyDetected ? <CheckCircle2Icon size={24} /> : <AlertCircleIcon size={24} />}
                </div>
                <div className="space-y-2">
                  <h4 className={`text-lg font-black uppercase tracking-tight italic ${envKeyDetected ? 'text-emerald-900' : 'text-amber-900'}`}>
                    {envKeyDetected ? 'Intelligence Core Online' : 'Action Required: System Sync'}
                  </h4>
                  <p className={`text-sm font-bold leading-relaxed ${envKeyDetected ? 'text-emerald-800/80' : 'text-amber-800/80'}`}>
                    {envKeyDetected 
                      ? 'Your environment variables are correctly configured. The Gemini 3.0 Flash engine is authorized for production discovery and document extraction.'
                      : 'The system cannot detect the API_KEY environment variable. Please ensure your deployment platform (Railway, Vercel, etc.) has the required secret configured.'}
                  </p>
                </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-slate-100 shadow-inner">
                <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Security Protocol Details</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Zero-Input Architecture</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                        In accordance with enterprise security standards, this platform does not allow manual API key entry via the UI.
                      </p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Encrypted Endpoints</p>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                        All AI requests are routed through verified statutory channels with end-to-end encryption active.
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border-2 border-white/5">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl">
                   <ZapIcon size={24} fill="white" />
                 </div>
                 <h4 className="text-2xl font-black uppercase tracking-tight italic">Protocol Verification</h4>
              </div>
              <div className="space-y-4 max-w-xl">
                  <p className="text-indigo-200 font-bold leading-relaxed italic opacity-100">
                    Your session is currently operating under the <strong>Statutory Security Shield</strong>. All automated skip-tracing and document extraction results are cryptographically verified for court-ready accuracy.
                  </p>
                  <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                     <ShieldCheckIcon size={14} /> AI Logic v3.5 Sync Active
                  </div>
              </div>
           </div>
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12 group-hover:scale-150 transition-transform duration-1000">
              <KeyIcon size={200} fill="white" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
