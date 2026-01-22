
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Database
} from 'lucide-react';
import { CaseStatus } from '../types';
import Tooltip from './Tooltip';

// ALL 50 STATES FOR UNIVERSAL INTAKE
const US_STATES = [
  { id: 'AL', name: 'Alabama' }, { id: 'AK', name: 'Alaska' }, { id: 'AZ', name: 'Arizona' }, { id: 'AR', name: 'Arkansas' },
  { id: 'CA', name: 'California' }, { id: 'CO', name: 'Colorado' }, { id: 'CT', name: 'Connecticut' }, { id: 'DE', name: 'Delaware' },
  { id: 'FL', name: 'Florida' }, { id: 'GA', name: 'Georgia' }, { id: 'HI', name: 'Hawaii' }, { id: 'ID', name: 'Idaho' },
  { id: 'IL', name: 'Illinois' }, { id: 'IN', name: 'Indiana' }, { id: 'IA', name: 'Iowa' }, { id: 'KS', name: 'Kansas' },
  { id: 'KY', name: 'Kentucky' }, { id: 'LA', name: 'Louisiana' }, { id: 'ME', name: 'Maine' }, { id: 'MD', name: 'Maryland' },
  { id: 'MA', name: 'Massachusetts' }, { id: 'MI', name: 'Michigan' }, { id: 'MN', name: 'Minnesota' }, { id: 'MS', name: 'Mississippi' },
  { id: 'MO', name: 'Missouri' }, { id: 'MT', name: 'Montana' }, { id: 'NE', name: 'Nebraska' }, { id: 'NV', name: 'Nevada' },
  { id: 'NH', name: 'New Hampshire' }, { id: 'NJ', name: 'New Jersey' }, { id: 'NM', name: 'New Mexico' }, { id: 'NY', name: 'New York' },
  { id: 'NC', name: 'North Carolina' }, { id: 'ND', name: 'North Dakota' }, { id: 'OH', name: 'Ohio' }, { id: 'OK', name: 'Oklahoma' },
  { id: 'OR', name: 'Oregon' }, { id: 'PA', name: 'Pennsylvania' }, { id: 'RI', name: 'Rhode Island' }, { id: 'SC', name: 'South Carolina' },
  { id: 'SD', name: 'South Dakota' }, { id: 'TN', name: 'Tennessee' }, { id: 'TX', name: 'Texas' }, { id: 'UT', name: 'Utah' },
  { id: 'VT', name: 'Vermont' }, { id: 'VA', name: 'Virginia' }, { id: 'WA', name: 'Washington' }, { id: 'WV', name: 'West Virginia' },
  { id: 'WI', name: 'Wisconsin' }, { id: 'WY', name: 'Wyoming' }
];

const PropertyForm: React.FC = () => {
  const navigate = useNavigate();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Production Ingestion Started:', formData);
    navigate('/');
  };

  const calculateSurplus = () => {
    const surplus = Math.max(0, formData.sale_price - formData.total_debt);
    setFormData(prev => ({ ...prev, surplus_amount: surplus }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-xl">
                <Database size={24} />
             </div>
             <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Case Intake Wizard</h2>
          </div>
          <p className="text-slate-700 font-bold text-lg leading-relaxed italic opacity-80">"Restoring the National Recovery Pipeline: All 50 Jurisdictions Authorized."</p>
        </div>
        <Tooltip content="Abort and return to command center.">
          <button 
            onClick={() => navigate('/')}
            className="p-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-[1.5rem] border-2 border-transparent hover:border-rose-100 transition-all active:scale-90 shadow-sm bg-white"
          >
            {/* Fix: Changed 'X' to 'XIcon' to match imported component name */}
            <XIcon size={32} />
          </button>
        </Tooltip>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-100 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden ring-1 ring-slate-100">
        <div className="p-14 space-y-14">
          {/* Jurisdiction Section */}
          <section className="space-y-8">
            <h3 className="text-[12px] font-black text-indigo-600 uppercase tracking-[0.25em] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-md"><Globe size={18} /></div>
              Regional Discovery Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors flex items-center gap-2">
                  Target State <ChevronRight size={12} className="text-indigo-300" />
                </label>
                <div className="relative group">
                  <select 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] py-5 px-8 text-[15px] font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner appearance-none cursor-pointer"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                  >
                    {US_STATES.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                  </select>
                  <ChevronDown size={22} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600" />
                </div>
              </div>
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors flex items-center gap-2">
                  Jurisdictional County <ChevronRight size={12} className="text-indigo-300" />
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. King, Mecklenburg, Harris..."
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] py-5 px-8 text-[15px] font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-400 placeholder:italic"
                  required
                  onChange={(e) => setFormData({...formData, county: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">Parcel ID (APN)</label>
                <input 
                  type="text" 
                  placeholder="XX-XXXX-XXXX"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] py-5 px-8 text-[15px] font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner"
                  required
                  onChange={(e) => setFormData({...formData, parcel_id: e.target.value})}
                />
              </div>
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">Property Legal Address</label>
                <input 
                  type="text" 
                  placeholder="Street, City, Zip"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] py-5 px-8 text-[15px] font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner"
                  required
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Financial Breakdown Section */}
          <section className="space-y-8 pt-14 border-t-2 border-slate-50">
            <h3 className="text-[12px] font-black text-emerald-600 uppercase tracking-[0.25em] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-md"><DollarSignIcon size={18} /></div>
              Statutory Financial Balance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-emerald-600 transition-colors">Auction Sold Price ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] py-5 px-8 text-[15px] font-black focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-inner"
                  onChange={(e) => setFormData({...formData, sale_price: Number(e.target.value)})}
                  onBlur={calculateSurplus}
                />
              </div>
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-rose-600 transition-colors">Senior Tax Debt ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] py-5 px-8 text-[15px] font-black focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all shadow-inner"
                  onChange={(e) => setFormData({...formData, total_debt: Number(e.target.value)})}
                  onBlur={calculateSurplus}
                />
              </div>
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-1">Authorized Surplus Pool</label>
                <div className="w-full bg-slate-950 border-2 border-slate-900 rounded-[1.5rem] py-5 px-8 text-[15px] font-black text-emerald-400 shadow-2xl flex items-center justify-between ring-8 ring-slate-950/5">
                  <span className="opacity-60 text-[10px] uppercase tracking-widest font-black">Net:</span>
                  <span className="text-xl tracking-tighter italic">${formData.surplus_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="space-y-8 pt-14 border-t-2 border-slate-50">
            <h3 className="text-[12px] font-black text-amber-600 uppercase tracking-[0.25em] flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shadow-md"><CalendarIcon size={18} /></div>
              Statutory Deadline Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4 group">
                <label className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-amber-600 transition-colors">Auction/Tax Sale Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-[1.5rem] py-5 px-8 text-[15px] font-black focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all shadow-inner"
                  onChange={(e) => setFormData({...formData, tax_sale_date: e.target.value})}
                />
              </div>
              <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] flex gap-6 shadow-inner items-start group">
                <InfoIcon size={28} className="text-indigo-600 shrink-0 mt-1" />
                <p className="text-xs text-slate-600 font-bold leading-relaxed italic group-hover:text-slate-900 transition-colors">
                  AI Protocol: Based on your selection of <span className="text-indigo-600 font-black">{formData.state || 'Selected State'}</span>, the filing window will be automatically calculated against local statutes upon case initialization.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-12 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-end gap-8 shadow-2xl">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="px-10 py-4 text-xs font-black text-slate-500 uppercase tracking-widest hover:text-rose-600 transition-all hover:bg-white rounded-2xl border-2 border-transparent hover:border-rose-100"
          >
            Discard
          </button>
          <Tooltip content="Synchronize this record with the national discovery grid.">
            <button 
              type="submit"
              className="bg-indigo-600 text-white px-14 py-6 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-3xl shadow-indigo-900/20 flex items-center gap-4 active:scale-95 hover:-translate-y-1.5 border-2 border-white/10"
            >
              <SaveIcon size={20} />
              Initialize Case Protocol
            </button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
