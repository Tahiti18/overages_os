
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
  AlertCircleIcon
} from 'lucide-react';

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
  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-950 text-indigo-400 rounded-2xl shadow-xl border border-indigo-500/30">
               <ZapIcon size={24} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Mission Roadmap</h2>
          </div>
          <p className="text-slate-500 font-bold max-w-2xl leading-relaxed text-lg">
            A strategic A-to-Z command view of our surplus recovery pipeline. Every stage is optimized by AI and verified by humans.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-xl flex items-center gap-6">
           <div className="text-center px-4 border-r border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Cycle</p>
              <p className="text-xl font-black text-slate-900">128d</p>
           </div>
           <div className="text-center px-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
              <p className="text-xl font-black text-emerald-600">+18%</p>
           </div>
        </div>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-10 top-10 bottom-10 w-1 bg-slate-200 rounded-full hidden lg:block"></div>

        <div className="space-y-8">
          {STAGES.map((stage, idx) => (
            <div key={stage.id} className="relative flex flex-col lg:flex-row gap-10 group">
              <div className={`w-20 h-20 rounded-[2rem] ${stage.color} text-white flex items-center justify-center shrink-0 z-10 shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6`}>
                <stage.icon size={32} strokeWidth={2.5} />
              </div>
              
              <div className="flex-1 bg-white rounded-[2.5rem] border-2 border-slate-100 p-10 shadow-sm hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                       <div className="flex items-center gap-3 mb-2">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stage 0{idx + 1}</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                          <span className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">{stage.indicator}</span>
                       </div>
                       <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stage.title}</h3>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-4">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Leads</p>
                       <p className="text-2xl font-black text-slate-900">{stage.count}</p>
                    </div>
                 </div>

                 <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg max-w-2xl">{stage.desc}</p>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stage.steps.map((step, i) => (
                      <div key={i} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3 group/step transition-all hover:bg-white hover:border-indigo-200">
                         <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover/step:text-indigo-600 group-hover/step:border-indigo-200 shadow-sm">
                            <CheckCircle2Icon size={14} />
                         </div>
                         <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-tight">{step}</span>
                      </div>
                    ))}
                 </div>

                 <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <AlertCircleIcon size={16} className="text-indigo-400" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliant Protocol active</span>
                    </div>
                    <button className="flex items-center gap-2 text-indigo-600 font-black text-[11px] uppercase tracking-widest hover:translate-x-2 transition-all">
                       Examine Tactical View <ArrowRightIcon size={16} />
                    </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Simulation Mode */}
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
         <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h4 className="text-2xl font-black uppercase tracking-tight">Need a Strategy Drill?</h4>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
               Launch the "Live Voice Agent" to walk through this workflow with an AI specialist who can explain the A-to-Z legal logic of any jurisdiction.
            </p>
            <div className="pt-4">
               <button className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:bg-indigo-500 transition-all active:scale-95 flex items-center gap-3 mx-auto">
                 <ZapIcon size={20} fill="white" /> Launch AI Command Consult
               </button>
            </div>
         </div>
         <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="grid grid-cols-12 h-full">
               {Array.from({ length: 48 }).map((_, i) => (
                 <div key={i} className="border border-white/20 aspect-square"></div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default WorkflowProtocol;
