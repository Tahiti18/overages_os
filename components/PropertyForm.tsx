
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SaveIcon, 
  XIcon, 
  MapPinIcon, 
  DollarSignIcon, 
  CalendarIcon,
  InfoIcon,
  PlusCircleIcon,
  Globe,
  ChevronDown,
  ChevronRight,
  Database,
  CheckCircle2,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';
import { CaseStatus } from '../types';
import Tooltip from './Tooltip';

// ALL 50 US STATES - STRICT DOMESTIC VALIDATION
const US_STATES = [
  { id: 'AL', name: 'Alabama' }, { id: 'AK', name: 'Alaska' }, { id: 'AZ', name: 'Arizona' }, { id: 'AR', name: 'Arkansas' },
  { id: 'CA', name: 'California' }, { id: 'CO', name: 'Colorado' }, { id: 'CT', name: 'Connecticut' }, { id: 'DE', name: 'Delaware' },
  { id: 'DC', name: 'Dist. of Columbia' }, { id: 'FL', name: 'Florida' }, { id: 'GA', name: 'Georgia' }, { id: 'HI', name: 'Hawaii' },
  { id: 'ID', name: 'Idaho' }, { id: 'IL', name: 'Illinois' }, { id: 'IN', name: 'Indiana' }, { id: 'IA', name: 'Iowa' },
  { id: 'KS', name: 'Kansas' }, { id: 'KY', name: 'Kentucky' }, { id: 'LA', name: 'Louisiana' }, { id: 'ME', name: 'Maine' },
  { id: 'MD', name: 'Maryland' }, { id: 'MA', name: 'Massachusetts' }, { id: 'MI', name: 'Michigan' }, { id: 'MN', name: 'Minnesota' },
  { id: 'MS', name: 'Mississippi' }, { id: 'MO', name: 'Missouri' }, { id: 'MT', name: 'Montana' }, { id: 'NE', name: 'Nebraska' },
  { id: 'NV', name: 'Nevada' }, { id: 'NH', name: 'New Hampshire' }, { id: 'NJ', name: 'New Jersey' }, { id: 'NM', name: 'New Mexico' },
  { id: 'NY', name: 'New York' }, { id: 'NC', name: 'North Carolina' }, { id: 'ND', name: 'North Dakota' }, { id: 'OH', name: 'Ohio' },
  { id: 'OK', name: 'Oklahoma' }, { id: 'OR', name: 'Oregon' }, { id: 'PA', name: 'Pennsylvania' }, { id: 'RI', name: 'Rhode Island' },
  { id: 'SC', name: 'South Carolina' }, { id: 'SD', name: 'South Dakota' }, { id: 'TN', name: 'Tennessee' }, { id: 'TX', name: 'Texas' },
  { id: 'UT', name: 'Utah' }, { id: 'VT', name: 'Vermont' }, { id: 'VA', name: 'Virginia' }, { id: 'WA', name: 'Washington' },
  { id: 'WV', name: 'West Virginia' }, { id: 'WI', name: 'Wisconsin' }, { id: 'WY', name: 'Wyoming' }
];

const PropertyForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    state: 'GA',
    county: '',
    parcel_id: '',
    address: '',
    tax_sale_date: '',
    sale_price: 0,
    total_debt: 0,
    surplus_amount: 0
  });

  // PRE-FILL LOGIC: Handles "Promotion" from Fleet Scanner
  useEffect(() => {
    const prefill = location.state?.prefill;
    if (prefill) {
      setFormData({
        state: prefill.state || 'GA',
        county: prefill.county || '',
        parcel_id: prefill.parcelId || '',
        address: prefill.address || '',
        tax_sale_date: prefill.saleDate || '',
        sale_price: prefill.soldAmount || 0,
        total_debt: prefill.judgmentAmount || 0,
        surplus_amount: prefill.overage || 0
      });
    }
  }, [location.state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Production Case Initialized:', formData);
    navigate('/');
  };

  const calculateSurplus = () => {
    const surplus = Math.max(0, formData.sale_price - formData.total_debt);
    setFormData(prev => ({ ...prev, surplus_amount: surplus }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-32">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-2xl border-2 border-white/20">
                <FileText size={28} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Discovery Intake</h2>
          </div>
          <p className="text-slate-700 font-bold text-xl leading-relaxed italic opacity-80">"Synchronizing US discovery leads with active production pipeline."</p>
        </div>
        <Tooltip content="Cancel and return to dashboard.">
          <button 
            onClick={() => navigate('/')}
            className="p-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[1.75rem] border-2 border-transparent hover:border-rose-100 transition-all active:scale-90 shadow-sm bg-white"
          >
            <XIcon size={32} />
          </button>
        </Tooltip>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-100 rounded-[4rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.12)] overflow-hidden ring-1 ring-slate-100 ring-inset">
        <div className="p-16 space-y-16">
          <section className="space-y-10">
            <div className="flex items-center justify-between border-b-2 border-slate-50 pb-6">
              <h3 className="text-[13px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-4 italic">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-inner"><Globe size={22} /></div>
                Domestic Origin Mapping
              </h3>
              {formData.surplus_amount > 100000 && <span className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-amber-200 shadow-sm"><Zap size={12} fill="currentColor" /> High Yield Potential</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-3 group-focus-within:text-indigo-600 transition-colors flex items-center gap-3">
                  National State Target <ChevronRight size={12} className="text-indigo-300" />
                </label>
                <div className="relative group">
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.75rem] py-6 px-10 text-[16px] font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all shadow-inner appearance-none cursor-pointer"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  >
                    {US_STATES.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                  </select>
                  <ChevronDown size={24} className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600" />
                </div>
              </div>
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-3 group-focus-within:text-indigo-600 transition-colors flex items-center gap-3">
                  Jurisdictional County <ChevronRight size={12} className="text-indigo-300" />
                </label>
                <div className="relative">
                   <MapPinIcon size={20} className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
                   <input 
                    type="text" 
                    placeholder="e.g. Mecklenburg, Harris, King..."
                    value={formData.county}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.75rem] py-6 pl-16 pr-10 text-[16px] font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all shadow-inner placeholder:text-slate-300 placeholder:italic"
                    required
                    onChange={(e) => setFormData({...formData, county: e.target.value})}
                   />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-3 group-focus-within:text-indigo-600 transition-colors">Property Folio / Parcel ID (APN)</label>
                <input 
                  type="text" 
                  placeholder="XX-XXXX-XXXX-XX"
                  value={formData.parcel_id}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.75rem] py-6 px-10 text-[16px] font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all shadow-inner uppercase tracking-widest placeholder:normal-case"
                  required
                  onChange={(e) => setFormData({...formData, parcel_id: e.target.value})}
                />
              </div>
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-3 group-focus-within:text-indigo-600 transition-colors">Legal Site Address</label>
                <input 
                  type="text" 
                  placeholder="Street Address, City, Zip"
                  value={formData.address}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.75rem] py-6 px-10 text-[16px] font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all shadow-inner uppercase italic placeholder:normal-case"
                  required
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="space-y-10 pt-16 border-t-2 border-slate-50">
            <h3 className="text-[13px] font-black text-emerald-600 uppercase tracking-[0.3em] flex items-center gap-4 italic">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-inner"><DollarSignIcon size={22} /></div>
              Domestic Surplus Balance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-3 group-focus-within:text-emerald-600 transition-colors">Auction Sold Price ($)</label>
                <input 
                  type="number" 
                  value={formData.sale_price || ''}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.75rem] py-6 px-10 text-[20px] font-black focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-inner tracking-tighter"
                  onChange={(e) => setFormData({...formData, sale_price: Number(e.target.value)})}
                  onBlur={calculateSurplus}
                />
              </div>
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-3 group-focus-within:text-rose-600 transition-colors">Senior Debt / Taxes ($)</label>
                <input 
                  type="number" 
                  value={formData.total_debt || ''}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.75rem] py-6 px-10 text-[20px] font-black focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all shadow-inner text-rose-700 tracking-tighter"
                  onChange={(e) => setFormData({...formData, total_debt: Number(e.target.value)})}
                  onBlur={calculateSurplus}
                />
              </div>
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-3">Authorized Recovery Pool</label>
                <div className="w-full bg-slate-950 border-2 border-slate-900 rounded-[1.75rem] py-6 px-10 text-[24px] font-black text-emerald-400 shadow-3xl flex items-center justify-between ring-8 ring-slate-950/5 relative overflow-hidden group">
                  <div className="relative z-10 flex items-center gap-4">
                     <span className="opacity-40 text-[10px] uppercase tracking-widest font-black italic">Net:</span>
                     <span className="tracking-tighter">${formData.surplus_amount.toLocaleString()}</span>
                  </div>
                  <CheckCircle2 size={24} className="relative z-10 text-emerald-500" />
                  <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:scale-150 duration-700">
                     <TrendingUp size={80} fill="white" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-10 pt-16 border-t-2 border-slate-50">
            <h3 className="text-[13px] font-black text-amber-600 uppercase tracking-[0.3em] flex items-center gap-4 italic">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-inner"><CalendarIcon size={22} /></div>
              US Statutory Timeline
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-[0.2em] px-3 group-focus-within:text-amber-600 transition-colors">Date of Tax Auction / Sale</label>
                <input 
                  type="date" 
                  value={formData.tax_sale_date}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.75rem] py-6 px-10 text-[18px] font-black focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all shadow-inner cursor-pointer"
                  onChange={(e) => setFormData({...formData, tax_sale_date: e.target.value})}
                />
              </div>
              <div className="p-10 bg-slate-50 border-2 border-slate-100 rounded-[3rem] flex gap-8 shadow-inner items-start group hover:bg-white hover:border-indigo-100 transition-all duration-500">
                <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 shrink-0 group-hover:rotate-6 transition-transform"><InfoIcon size={28} /></div>
                <p className="text-sm text-slate-700 font-bold leading-relaxed italic group-hover:text-slate-900 transition-colors">
                  AI Compliance Pulse: Your selection of <span className="text-indigo-600 font-black">{US_STATES.find(s => s.id === formData.state)?.name || 'Target State'}</span> triggers automatic lookup of redemption periods and US escheatment rules.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-16 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-end gap-10 shadow-2xl relative z-10">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="px-12 py-5 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-rose-600 transition-all hover:bg-white rounded-2xl border-2 border-transparent hover:border-rose-100 active:scale-95"
          >
            Discard Protocol
          </button>
          <Tooltip content="Ingest this domestic discovery into the production management grid.">
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-20 py-7 rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] hover:bg-indigo-700 transition-all shadow-3xl shadow-indigo-900/40 flex items-center gap-5 active:scale-[0.98] hover:-translate-y-2 border-2 border-white/10"
            >
              <Database size={24} />
              Initialize Case Protocol
            </button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
