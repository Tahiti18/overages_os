
import React, { useState } from 'react';
import { 
  SearchIcon, 
  UserPlusIcon, 
  ExternalLinkIcon, 
  Loader2Icon, 
  ShieldAlertIcon,
  GlobeIcon,
  LinkIcon,
  FileTextIcon,
  UsersIcon,
  MailIcon
} from 'lucide-react';
import { performSkipTracing } from '../lib/gemini';

interface SkipTracingHubProps {
  ownerName: string;
  address: string;
}

const SkipTracingHub: React.FC<SkipTracingHubProps> = ({ ownerName, address }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; sources: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await performSkipTracing(ownerName, address);
      setResults(data);
    } catch (err) {
      setError("Failed to reach research intelligence. Please check your network or API configuration.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <GlobeIcon size={20} className="text-white" />
            </div>
            <h3 className="text-xl font-bold">AI Research Hub</h3>
          </div>
          <p className="text-indigo-200 text-sm max-w-xl leading-relaxed mb-6">
            Leverage Gemini 3.0 Pro with Google Search Grounding to scour public records, social profiles, and obituary data for <strong>{ownerName}</strong>. 
          </p>
          {!results && !loading && (
            <button 
              onClick={handleResearch}
              className="bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              <SearchIcon size={18} />
              Start Web Research
            </button>
          )}
        </div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px]"></div>
      </div>

      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Loader2Icon size={48} className="text-indigo-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <SearchIcon size={16} className="text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-800 font-bold">Scanning Web Records...</p>
            <p className="text-slate-400 text-sm">Cross-referencing property deeds with public directories</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <ShieldAlertIcon size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-700">
          {/* Main Findings */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm prose prose-slate max-w-none">
              <h4 className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                <FileTextIcon size={18} className="text-indigo-600" />
                Dossier Summary
              </h4>
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {results.text}
              </div>
            </div>

            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h4 className="flex items-center gap-2 text-indigo-900 font-bold mb-3 text-sm">
                <LinkIcon size={16} />
                Grounding Sources
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.sources.map((source: any, i: number) => {
                  const webInfo = source.web;
                  if (!webInfo) return null;
                  return (
                    <a 
                      key={i}
                      href={webInfo.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white px-3 py-1.5 rounded-lg border border-indigo-200 text-[11px] font-bold text-indigo-700 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 shadow-sm"
                    >
                      {webInfo.title || 'Source'} <ExternalLinkIcon size={10} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-widest">Next Steps</h4>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <UserPlusIcon size={18} className="text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-bold text-slate-700">Add to Claimants</span>
                  </div>
                  <ExternalLinkIcon size={14} className="text-slate-300" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 transition-all group">
                  <div className="flex items-center gap-3">
                    <MailIcon size={18} className="text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-bold text-slate-700">Send Outreach Mail</span>
                  </div>
                  <ExternalLinkIcon size={14} className="text-slate-300" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <UsersIcon size={18} className="text-slate-400" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Team Notes</h4>
              </div>
              <textarea 
                placeholder="Notes about findings..."
                className="w-full h-32 bg-white border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-indigo-600 outline-none"
              ></textarea>
              <button className="mt-3 w-full bg-slate-800 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-lg hover:bg-slate-700 transition-colors">
                Save Observations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkipTracingHub;
