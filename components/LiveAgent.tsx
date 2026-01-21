
import React, { useEffect, useRef, useState } from 'react';
import { 
  XIcon, 
  MicIcon, 
  MicOffIcon, 
  Volume2Icon, 
  AlertCircleIcon,
  SparklesIcon,
  PlayIcon,
  PowerIcon
} from 'lucide-react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import { decode, encode, decodeAudioData } from '../lib/live-api-utils';

interface LiveAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveAgent: React.FC<LiveAgentProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const aiRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      aiRef.current = ai;

      // Audio contexts must be created or resumed in response to a user gesture
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      if (inputCtx.state === 'suspended') await inputCtx.resume();
      if (outputCtx.state === 'suspended') await outputCtx.resume();

      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              // Wait for session to be active before sending
              sessionPromise.then(s => {
                 try { s.sendRealtimeInput({ media: pcmBlob }); } catch(e) {}
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const s of sourcesRef.current.values()) {
                try { s.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            setError("Connection or Protocol Error");
            setIsConnecting(false);
            setIsActive(false);
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are an expert Property Tax Surplus Assistant named Prospector AI. You help professionals identify excess proceeds from tax sales, explain state-specific laws (GA, FL, TX), and manage recovery claims. Be professional, direct, and concise.',
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      const msg = err.message || "Unknown error";
      if (msg.includes("denied") || msg.includes("allowed")) {
        setError("Microphone access denied or blocked by browser settings.");
      } else {
        setError("Failed to initialize session. Check internet and API permissions.");
      }
      setIsConnecting(false);
      console.error(err);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
    }
    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch(e) {}
    }
    if (outputAudioContextRef.current) {
      try { outputAudioContextRef.current.close(); } catch(e) {}
    }
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/40 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-indigo-900 p-6 text-white relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-800 rounded-xl">
                <SparklesIcon size={20} className="text-indigo-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Prospector Live</h3>
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">Expert AI Consultant</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
              <XIcon size={24} />
            </button>
          </div>

          {/* Orb Visualization */}
          <div className="flex justify-center py-12">
            <div className="relative">
              <div className={`w-32 h-32 rounded-full border-4 border-indigo-500/30 flex items-center justify-center transition-all duration-500 ${isSpeaking ? 'scale-110' : 'scale-100'}`}>
                <div className={`w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 shadow-2xl shadow-indigo-500/50 flex items-center justify-center ${isActive && !isSpeaking ? 'animate-pulse' : ''} ${isSpeaking ? 'animate-bounce' : ''}`}>
                  {isActive ? <Volume2Icon size={32} /> : isConnecting ? <div className="animate-spin border-4 border-white/20 border-t-white w-8 h-8 rounded-full"></div> : <MicOffIcon size={32} />}
                </div>
              </div>
              {isSpeaking && (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-20"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-ping opacity-10 delay-150"></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Area */}
        <div className="p-8 text-center bg-white">
          {error ? (
             <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 mb-4 animate-in slide-in-from-top-2 text-left">
                <AlertCircleIcon size={20} className="shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-tight mb-1">Permission Required</p>
                  <p className="text-xs font-medium">{error}</p>
                </div>
             </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-800 font-bold text-xl">
                {isActive ? (isSpeaking ? 'Consultant Speaking...' : 'Listening...') : isConnecting ? 'Initializing Audio...' : 'Ready to Connect'}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                {isActive 
                  ? 'Ask about case deadlines, jurisdiction laws, or property records in real-time.' 
                  : 'Connect to your AI consultant via encrypted voice channel to discuss recovery strategies.'}
              </p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100">
             {!isActive ? (
                <button 
                  onClick={startSession}
                  disabled={isConnecting}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                  <PlayIcon size={20} fill="currentColor" />
                  {isConnecting ? 'Connecting...' : 'Connect to Live Agent'}
                </button>
             ) : (
                <div className="flex justify-center gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 rounded-full bg-indigo-50 text-indigo-600 animate-pulse">
                      <MicIcon size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Mic Active</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-4 rounded-full ${isSpeaking ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-300'} transition-colors`}>
                      <Volume2Icon size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Speaker</span>
                  </div>
               </div>
             )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Encryption Secure • Gemini 2.5 Flash Native</p>
          <button 
            onClick={isActive ? stopSession : onClose}
            className="w-full bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl hover:bg-slate-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isActive ? <PowerIcon size={16} /> : null}
            {isActive ? 'Disconnect Agent' : 'Close Assistant'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAgent;
