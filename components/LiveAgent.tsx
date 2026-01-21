
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import { decode, encode, decodeAudioData } from '../lib/live-api-utils';
import { 
  XIcon, 
  MicIcon, 
  MicOffIcon, 
  Volume2Icon, 
  AlertCircleIcon,
  SparklesIcon,
  PlayIcon,
  PowerIcon,
  ActivityIcon
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface LiveAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveAgent: React.FC<LiveAgentProps> = ({ isOpen, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputVolume, setInputVolume] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      if (inputCtx.state === 'suspended') await inputCtx.resume();
      if (outputCtx.state === 'suspended') await outputCtx.resume();

      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);
      
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      outputNodeRef.current = outputNode;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setIsConnecting(false);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            source.connect(analyser);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              
              // Visualizing volume level
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) {
                sum += inputData[i] * inputData[i];
              }
              const rms = Math.sqrt(sum / inputData.length);
              setInputVolume(rms);

              sessionPromise.then(s => {
                try { 
                  s.sendRealtimeInput({ media: pcmBlob }); 
                } catch(err) {
                  console.warn("Failed to send realtime input", err);
                }
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
              source.connect(outputNode);
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
            console.error("Live session error", e);
            setError("Active session encountered an unexpected protocol error.");
            setIsConnecting(false);
            setIsActive(false);
          },
          onclose: (e) => {
            console.log("Live session closed", e);
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
        setError("Microphone access denied. Please allow microphone permissions in your browser.");
      } else {
        setError("Failed to initialize intelligence stream. Check your network or API key.");
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
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsActive(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setInputVolume(0);
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
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-bold">Voice Recovery Intelligence</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white">
              <XIcon size={24} />
            </button>
          </div>

          {/* Orb Visualization */}
          <div className="flex justify-center py-12">
            <div className="relative">
              <div 
                className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'border-indigo-400/50' : 'border-slate-700'
                }`}
                style={{
                  transform: `scale(${1 + inputVolume * 2})`,
                  boxShadow: isActive ? `0 0 ${20 + inputVolume * 100}px rgba(99, 102, 241, 0.4)` : 'none'
                }}
              >
                <div 
                  className={`w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-blue-500 shadow-2xl flex items-center justify-center transition-all duration-300 ${
                    isSpeaking ? 'scale-110 rotate-12' : 'scale-100'
                  }`}
                >
                  {isActive ? (
                    isSpeaking ? <Volume2Icon size={32} /> : <MicIcon size={32} />
                  ) : isConnecting ? (
                    <div className="animate-spin border-4 border-white/20 border-t-white w-8 h-8 rounded-full"></div>
                  ) : (
                    <MicOffIcon size={32} />
                  )}
                </div>
              </div>
              
              {/* Dynamic Aura */}
              {isActive && (
                <div 
                  className="absolute inset-0 rounded-full bg-indigo-500/10 animate-ping"
                  style={{ animationDuration: isSpeaking ? '1.5s' : '3s' }}
                ></div>
              )}
            </div>
          </div>
          
          {/* Waveform Meter */}
          {isActive && (
            <div className="absolute bottom-4 left-0 right-0 px-10">
              <div className="flex items-end justify-center gap-1 h-8">
                {Array.from({ length: 20 }).map((_, i) => {
                  const height = Math.random() * (inputVolume * 100) + 2;
                  return (
                    <div 
                      key={i} 
                      className="w-1 bg-indigo-400/40 rounded-full transition-all duration-75"
                      style={{ height: `${Math.max(2, height)}%` }}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Status Area */}
        <div className="p-8 text-center bg-white">
          {error ? (
             <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 mb-4 animate-in slide-in-from-top-2 text-left">
                <AlertCircleIcon size={20} className="shrink-0" />
                <div>
                  <p className="text-xs font-black uppercase tracking-tight mb-1">Session Alert</p>
                  <p className="text-xs font-medium">{error}</p>
                </div>
             </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-900 font-black text-xl">
                {isActive ? (isSpeaking ? 'AI is explaining...' : 'Listening to you...') : isConnecting ? 'Establishing Link...' : 'Recovery Expert Offline'}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed px-4 font-medium">
                {isActive 
                  ? 'Ask about surplus case deadlines, state laws, or specific parcel research.' 
                  : 'Start a high-fidelity voice session to discuss recovery strategies with Prospector AI.'}
              </p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100">
             {!isActive ? (
                <button 
                  onClick={startSession}
                  disabled={isConnecting}
                  className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                >
                  <ActivityIcon size={20} className={isConnecting ? 'animate-pulse' : ''} />
                  {isConnecting ? 'Syncing...' : 'Initiate Live Voice'}
                </button>
             ) : (
                <div className="flex justify-center gap-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                      <MicIcon size={24} className={inputVolume > 0.01 ? 'animate-bounce' : ''} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mic Live</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                      isSpeaking ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-lg shadow-emerald-100' : 'bg-slate-50 text-slate-300 border-slate-100'
                    }`}>
                      <Volume2Icon size={24} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Output</span>
                  </div>
               </div>
             )}
          </div>
        </div>

        <div className="p-6 bg-slate-50 text-center border-t border-slate-100">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gemini 2.5 Flash • Secure P2P</p>
          </div>
          <button 
            onClick={isActive ? stopSession : onClose}
            className="w-full bg-white border border-slate-200 text-slate-600 font-black py-3 rounded-2xl hover:bg-slate-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            {isActive ? <PowerIcon size={14} /> : null}
            {isActive ? 'Terminate Channel' : 'Dismiss Agent'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAgent;
