
import React, { useState, useEffect } from 'react';
import { 
  BarChart3Icon, 
  MapIcon, 
  ZapIcon, 
  SearchIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  ArrowUpRightIcon, 
  CalendarIcon, 
  ClockIcon,
  FilterIcon,
  AlertCircleIcon,
  Building2Icon,
  RefreshCwIcon,
  SparklesIcon,
  ScaleIcon,
  GavelIcon,
  ShieldAlertIcon,
  GlobeIcon,
  DatabaseIcon,
  LockIcon,
  FileTextIcon,
  LayoutGridIcon,
  InfoIcon,
  DownloadIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  LayersIcon,
  ShieldIcon,
  FileSearchIcon
} from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { User, WatchedJurisdiction } from '../types';
import Tooltip from './Tooltip';

const NATIONAL_RANKINGS = [
  { state: 'FL', name: 'Florida', spi: 98, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_PDF', description: 'Highest volume of weekly surplus list drops.' },
  { state: 'WA', name: 'Washington', spi: 95, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_LIST', description: 'Exceptional transparency and long claim windows.' },
  { state: 'GA', name: 'Georgia', spi: 94, level: 'TIDAL_FLATS', friction: 'MED', access: 'HYBRID_WEB', description: 'High yields but requires portal navigation.' },
  { state: 'NC', name: 'North Carolina', spi: 92, level: 'OPEN_PLAINS', friction: 'LOW', access: 'CLERK_LIST', description: 'Clerk of Court publishes clear overage ledgers.' },
  { state: 'AZ', name: 'Arizona', spi: 90, level: 'OPEN_PLAINS', friction: 'LOW', access: 'OPEN_PDF', description: 'Reliable monthly drops from county treasurers.' },
  { state: 'MD', name: 'Maryland', spi: 89, level: 'FORTIFIED_MOAT', friction: 'HIGH', access: 'MOAT_GATED', description: 'Hidden data requires formal ORR filings.' },
  { state: 'SC', name: 'South Carolina', spi: 87, level: 'TIDAL_FLATS', friction: 'MED', access: 'HYBRID_WEB', description: 'Strong post-auction discovery potential.' },
  { state: 'TX', name: 'Texas', spi: 85, level: 'TIDAL_FLATS', friction: 'MED', access: 'HYBRID_WEB', description: 'Massive volume but decentralized portal search.' },
  { state: 'TN', name: 'Tennessee', spi: 84, level: 'TIDAL_FLATS', friction: 'MED', access: 'CHANCERY', description: 'Chancery Court lists are valuable but fragmented.' },
  { state: 'OH', name: 'Ohio', spi: 82, level: 'FORTIFIED_MOAT', friction: 'HIGH', access: 'MOAT_GATED', description: 'Forfeiture lists are often guarded by local statutes.' }
];

const MarketIntelligence: React.FC = () => {
  const { isLiveMode } = useOutletContext<{ user: User, isLiveMode: boolean }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'triage' | 'schedules' | 'bridge'>('triage');

  const getBarrierColor = (level: string) => {
    switch (level) {
      case 'OPEN_PLAINS': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'TIDAL_FLATS': return 'text-indigo-500 bg-indigo-50 border-indigo-100';
      case 'FORTIFIED_MOAT': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-[1.5rem] shadow-2xl border ring-8 ${isLiveMode ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30 ring-emerald-500/5' : 'bg-slate-950 text-indigo-400 border-white/10 ring-indigo-500/5'}`}>
              <MapIcon size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
                National Triage
                <span className="text-indigo-600 animate-pulse">●</span>
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">National Top 10 Profitability Ranking</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] border-2 border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight italic">Profitability Index (SPI)</h3>
          <button onClick={() => navigate('/scanner')} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg">
             Scanner Engine <ArrowRightIcon size={14} />
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {NATIONAL_RANKINGS.map((item) => (
            <div key={item.state} className="p-10 hover:bg-slate-50/50 transition-all group flex flex-col xl:flex-row xl:items-center gap-12">
              <div className="flex items-center gap-8 shrink-0 min-w-[280px]">
                 <div className={`w-16 h-16 rounded-[1.25rem] text-white flex items-center justify-center font-black text-2xl shadow-xl relative ${item.level === 'FORTIFIED_MOAT' ? 'bg-slate-900' : 'bg-indigo-900'}`}>
                   {item.state}
                 </div>
                 <div>
                   <h4 className="text-xl font-black text-slate-900 tracking-tight mb-1">{item.name}</h4>
                   <span className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getBarrierColor(item.level)}`}>
                     {item.level.replace('_', ' ')}
                   </span>
                 </div>
              </div>
              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Index Score</p>
                    <p className="text-lg font-black text-indigo-600">{item.spi}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">List Access</p>
                    <p className="text-sm font-black text-slate-800 uppercase">{item.access.replace('_', ' ')}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Statutory Friction</p>
                    <p className="text-sm font-black text-slate-800 uppercase">{item.friction}</p>
                 </div>
                 <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.description}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligence;
