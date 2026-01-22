
import React, { useState } from 'react';
import { 
  XIcon, 
  MicOffIcon, 
  AlertCircleIcon,
  SparklesIcon,
  PowerIcon,
} from 'lucide-react';

interface LiveAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveAgent: React.FC<LiveAgentProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-900 p-6 text-white relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-800 rounded-xl">
                <SparklesIcon size={20} className="text-indigo-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Prospector Live</h3>
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">Protocol Conflict</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
              <XIcon size={24} />
            </button>
          </div>

          <div className="flex justify-center py-12">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center border-4 border-slate-700">
               <MicOffIcon size={32} className="text-slate-500" />
            </div>
          </div>
        </div>

        <div className="p-8 text-center bg-white space-y-6">
          <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 text-left">
            <AlertCircleIcon size={24} className="shrink-0" />
            <div>
              <p className="text-xs font-black uppercase tracking-tight mb-1">Configuration Required</p>
              <p className="text-xs font-medium">The <strong>Live Voice Agent</strong> requires a native Google Gemini API Key to access real-time multimodal protocols.</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-slate-900 font-black text-xl italic">Incompatible Provider</p>
            <p className="text-slate-500 text-sm leading-relaxed px-4 font-medium">
              OpenRouter does not currently support the real-time WebSocket protocol required for low-latency voice interaction.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100">
             <button 
              onClick={onClose}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
             >
               Dismiss & Return to Portal
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAgent;
