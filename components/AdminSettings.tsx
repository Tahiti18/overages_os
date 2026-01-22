
import React, { useState, useEffect } from 'react';
import { 
  LockIcon, 
  ShieldCheckIcon, 
  KeyIcon, 
  EyeIcon, 
  EyeOffIcon, 
  TerminalIcon, 
  ZapIcon, 
  SaveIcon, 
  Trash2Icon,
  ServerIcon,
  AlertCircleIcon,
  ArrowRightIcon
} from 'lucide-react';
import Tooltip from './Tooltip';

const AdminSettings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [envKeyDetected, setEnvKeyDetected] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('prospector_auth_key');
    if (saved) setApiKey(saved);

    // Check if environment has a key
    const hasEnv = !!(
      (window as any).process?.env?.OPENROUTER_API_KEY || 
      (window as any).process?.env?.API_KEY
    );
    setEnvKeyDetected(hasEnv);
  }, []);

  const handleSave = () => {
    if (!apiKey) {
      localStorage.removeItem('prospector_auth_key');
    } else {
      localStorage.setItem('prospector_auth_key', apiKey);
    }
    setIsSaved(true);
    // Reload the page to refresh all AI components with the new key
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleClear = () => {
    localStorage.removeItem('prospector_auth_key');
    setApiKey('');
    setIsSaved(false);
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-slate-950 text-indigo-400 rounded-3xl shadow-2xl border-2 border-white/10 ring-8 ring-indigo-500/5">
          <TerminalIcon size={32} />
        </div>
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Protocol Authorization</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px] mt-1">Manual Access Management Panel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
        <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100">
          <div className="p-12 space-y-10">
            <div className="flex items-center justify-between border-b-2 border-slate-50 pb-8">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic flex items-center gap-3">
                  <LockIcon size={22} className="text-indigo-600" />
                  Terminal Access Key
                </h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Authorize OpenRouter/Gemini Flash v2.0</p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${envKeyDetected ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                <ServerIcon size={14} />
                Env Variable: {envKeyDetected ? 'Detected' : 'Not Found'}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 shadow-inner flex items-start gap-5">
                <AlertCircleIcon size={24} className="text-indigo-500 shrink-0 mt-1" />
                <p className="text-xs text-slate-600 font-bold leading-relaxed italic">
                  "If your cloud deployment (Railway/Vercel) is not picking up the OPENROUTER_API_KEY environment variable, paste it here. This key will be stored locally in your browser to enable production protocols."
                </p>
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-4 flex items-center gap-2">
                  <KeyIcon size={16} className="text-indigo-600" />
                  API Key / Bearer Token
                </label>
                <div className="relative group">
                  <input 
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full bg-white border-2 border-slate-200 rounded-[2.5rem] py-8 pl-10 pr-24 text-lg font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all shadow-xl placeholder:text-slate-300"
                  />
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showKey ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t-2 border-slate-50 flex items-center gap-4">
               <button 
                 onClick={handleSave}
                 className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3 border-2 border-white/10"
               >
                 {isSaved ? <ShieldCheckIcon size={22} className="animate-in zoom-in" /> : <SaveIcon size={22} />}
                 {isSaved ? 'Protocol Verified' : 'Authorize Terminal'}
               </button>
               <button 
                 onClick={handleClear}
                 className="px-10 py-6 bg-white border-2 border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95"
               >
                 <Trash2Icon size={22} />
               </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white shadow-3xl relative overflow-hidden group border-2 border-white/5">
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl">
                   <ZapIcon size={24} fill="white" />
                 </div>
                 <h4 className="text-2xl font-black uppercase tracking-tight italic">How to Obtain a Key</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 <div className="space-y-4">
                    <p className="text-lg font-black text-indigo-400 uppercase tracking-tighter">1. Visit OpenRouter.ai</p>
                    <p className="text-sm text-indigo-100/70 font-medium leading-relaxed italic">
                      Navigate to the OpenRouter dashboard and generate a new key specifically for the "Prospector AI" application.
                    </p>
                    <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-widest">
                       Open Dashboard <ArrowRightIcon size={14} />
                    </a>
                 </div>
                 <div className="space-y-4">
                    <p className="text-lg font-black text-indigo-400 uppercase tracking-tighter">2. Add Gemini Flash</p>
                    <p className="text-sm text-indigo-100/70 font-medium leading-relaxed italic">
                      Ensure your account has a small credit balance. Our platform targets <strong>Google Gemini 2.0 Flash</strong> for high-speed recovery.
                    </p>
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
