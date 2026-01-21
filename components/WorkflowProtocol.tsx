
import React from 'react';
import { 
  TargetIcon, 
  SearchIcon, 
  ShieldCheckIcon, 
  MessageSquareIcon, 
  ArchiveIcon,
  ChevronDownIcon,
  ZapIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
  DatabaseIcon
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { User } from '../types';

const STAGES = [
  {
    id: 's1',
    title: 'Intelligence Gathering',
    desc: 'Ingesting raw tax sale data and identifying gross surplus opportunities.',
    icon: TargetIcon,
    color: 'bg-indigo-600',
    steps: ['Lead Acquisition', 'Statutory Deadline Calculation', 'AI Priority Scoring'],
    indicator: 'Active Processing',
    count: 124
  },
  {
    id: 's2',
    title: 'Forensic Research',
    desc: 'Performing web-grounded skip-tracing to locate owners and potential heirs.',
    icon: SearchIcon,
    color: 'bg-amber-500',
    steps: ['Public Record Grounding', 'Social Media Verification', 'Obituary Index Search'],
    indicator: '12 Search Hits',
    count: 18
  },
  {
    id: 's3',
    title: 'Human-in-the-Loop Audit',
    desc: 'Strict role-based verification of identity and lien priority seniority.',
    icon: ShieldCheckIcon,
    color: 'bg-emerald-600',
    steps: ['Reviewer Approval', 'Waterfall Modeling', 'Lien Discovery Sync'],
    indicator: 'Verification Queue',
    count: 8
  },
  {
    id: 's4',
    title: 'Personalized Outreach',
    desc: 'Multi-channel communication grounded in deep skip-trace research findings.',
    icon: MessageSquareIcon,
    color: 'bg-blue-600',
    steps: ['Direct Mail Architect', 'SMS Automation', 'Voice Consultant Sync'],
    indicator: 'Outreach Active',
    count: 42
  },
  {
    id: 's5',
    title: 'Smart Filing & Closing',
    desc: 'Assembling court-ready claim packages and tracking recovery to payout.',
    icon: ArchiveIcon,
    color: 'bg-slate-900',
    steps: ['Affidavit Assembly', 'Demand Letter Issuance', 'Payout Reconciliation'],
    indicator: 'Ready to File',
    count: 3
  }
];

const WorkflowProtocol: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ isLiveMode: boolean }>();

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className={`p-4 rounded-2xl shadow-2xl border-2 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30' : 'bg-indigo-950 text-indigo-400 border-indigo-400/20'}`}>
               {isLiveMode ? <DatabaseIcon size={24} /> : <ZapIcon size={24} />}
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
               {isLiveMode ? 'Production Protocol' : 'Mission Roadmap'}
               <span className="text-indigo-600 animate-pulse">●</span>
             </h2>
          </div>
          <p className="text-slate-600 font-bold max-w-2xl leading-relaxed text-lg">
            {isLiveMode 
              ? 'Real-time monitoring of your verified production pipeline. No simulated leads are displayed here.' 
              : 'A strategic A-to-Z command view of our surplus recovery pipeline. Simulation data active.'}
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 shadow-2xl flex items-center gap-8 ring-1 ring-slate-100">
           <div className="text-center px-6 border-r-2 border-slate-50">
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Cycle Time</p>
              <p className="text-2xl font-black text-slate-900">{isLiveMode ? 'N/A' : '128d'}</p>
           </div>
           <div className="text-center px-6">
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1">Live Loads</p>
              <p className={`text-2xl font-black ${isLiveMode ? 'text-emerald-600' : 'text-indigo-600'}`}>{isLiveMode ? '0' : '195'}</p>
           </div>
        </div>
      </div>

      <div className="relative pt-8">
        <div className="absolute left-10 top-10 bottom-10 w-1.5 bg-slate-100 rounded-full hidden lg:block shadow-inner"></div>

        <div className="space-y-12">
          {STAGES.map((stage, idx) => (
            <div key={stage.id} className="relative flex flex-col lg:flex-row gap-12 group">
              <div className={`w-20 h-20 rounded-[2rem] text-white flex items-center justify-center shrink-0 z-10 shadow-3xl transition-all group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-indigo-500/20 border-4 border-white ${isLiveMode ? 'bg-slate-950 border-emerald-500/20' : stage.color}`}>
                <stage.icon size={36} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1 bg-white rounded-[3rem] border-2 border-slate-100 p-12 shadow-2xl hover:border-indigo-400 hover:shadow-3xl hover:shadow-indigo-500/10 transition-all ring-1 ring-slate-100">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 pb-8 border-b-2 border-slate-50">
                    <div>
                       <div className="flex items-center gap-4 mb-3">
                          <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 shadow-sm">Stage 0{idx + 1}</span>
                          <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>
                          <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${isLiveMode ? 'text-emerald-600' : 'text-indigo-600'}`}>
                            {isLiveMode ? 'LIVE PRODUCTION' : stage.indicator}
                          </span>
                       </div>
                       <h3 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{stage.title}</h3>
                    </div>
                    <div className="bg-slate-50 border-2 border-slate-100 px-8 py-4 rounded-2xl flex items-center gap-6 shadow-inner">
                       <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Active Units</p>
                       <p className={`text-3xl font-black ${isLiveMode ? 'text-slate-300' : 'text-slate-950'}`}>
                         {isLiveMode ? '0' : stage.count}
                       </p>
                    </div>
                 </div>

                 <p className="text-slate-600 font-bold mb-12 leading-relaxed text-xl max-w-3xl italic">"{stage.desc}"</p>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stage.steps.map((step, i) => (
                      <div key={i} className="bg-slate-50/50 p-6 rounded-[1.5rem] border-2 border-slate-100 flex items-center gap-4 group/step transition-all hover:bg-white hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1">
                         <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 group-hover/step:text-indigo-600 group-hover/step:border-indigo-300 shadow-md transition-all">
                            <CheckCircle2Icon size={18} strokeWidth={3} />
                         </div>
                         <span className="text-xs font-black text-slate-800 uppercase tracking-tight leading-tight">{step}</span>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowProtocol;
