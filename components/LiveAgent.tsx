
import React, { useEffect, useRef, useState } from 'react';
import { 
  XIcon, 
  MicIcon, 
  MicOffIcon, 
  Volume2Icon, 
  AlertCircleIcon,
  SparklesIcon
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
  const [error, setError] = useState<string | null>(null);
  
  const aiRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);
  const sessionRef = useRef<any>(null);

  const startSession = async () => {
    try {
      setError(null);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      aiRef.current = ai;

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
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
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
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
              for (const s of sourcesRef.current.values()) s.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => setError("Connection Error"),
          onclose: () => setIsActive(false),
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
    } catch (err) {
      setError("Failed to initialize audio devices.");
      console.error(err);
    }
  };

  const stopSession = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setIsActive(false);
  };

  useEffect(() => {
    if (isOpen) startSession();
    else stopSession();
    return () => stopSession();
  }, [isOpen]);

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
                  {isActive ? <Volume2Icon size={32} /> : <MicOffIcon size={32} />}
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
             <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 mb-4 animate-in slide-in-from-top-2">
                <AlertCircleIcon size={20} className="shrink-0" />
                <p className="text-xs font-medium text-left">{error}</p>
             </div>
          ) : (
            <div className="space-y-2">
              <p className="text-slate-800 font-bold text-xl">
                {isActive ? (isSpeaking ? 'Consultant Speaking...' : 'Listening...') : 'Connecting...'}
              </p>
              <p className="text-slate-500 text-sm leading-relaxed px-4">
                Ask about case deadlines, jurisdiction laws, or property records in real-time.
              </p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-100">
             <div className="flex justify-center gap-4">
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-4 rounded-full ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-300'} transition-colors`}>
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
          </div>
        </div>

        <div className="p-6 bg-slate-50 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Encryption Secure • Gemini 3.0 Flash</p>
          <button 
            onClick={onClose}
            className="w-full bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl hover:bg-slate-300 transition-all active:scale-[0.98]"
          >
            End Live Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveAgent;
