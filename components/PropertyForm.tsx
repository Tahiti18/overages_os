
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SaveIcon, 
  XIcon, 
  MapPinIcon, 
  DollarSignIcon, 
  CalendarIcon,
  InfoIcon,
  PlusCircleIcon
} from 'lucide-react';
import { CaseStatus } from '../types';
import Tooltip from './Tooltip';

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
    // Simulate API call
    console.log('Saving property...', formData);
    navigate('/');
  };

  const calculateSurplus = () => {
    const surplus = Math.max(0, formData.sale_price - formData.total_debt);
    setFormData(prev => ({ ...prev, surplus_amount: surplus }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">New Surplus Case</h2>
          <p className="text-slate-700 font-bold text-sm">Manually input property details to start the recovery workflow.</p>
        </div>
        <Tooltip content="Discard changes and return to the main dashboard.">
          <button 
            onClick={() => navigate('/')}
            className="p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl border-2 border-transparent hover:border-red-100 transition-all active:scale-90"
          >
            <XIcon size={28} />
          </button>
        </Tooltip>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-100 rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-slate-100">
        <div className="p-10 space-y-12">
          {/* Jurisdiction Section */}
          <section className="space-y-6">
            <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-sm"><MapPinIcon size={14} /></div>
              Location & Jurisdiction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">State</label>
                <select 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                >
                  <option value="GA">Georgia (GA)</option>
                  <option value="FL">Florida (FL)</option>
                  <option value="TX">Texas (TX)</option>
                </select>
              </div>
              <div className="space-y-3 md:col-span-2 group">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">County</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fulton"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-400"
                  required
                  onChange={(e) => setFormData({...formData, county: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">Parcel ID (APN)</label>
                <input 
                  type="text" 
                  placeholder="XX-XXXX-XXXX"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-400"
                  required
                  onChange={(e) => setFormData({...formData, parcel_id: e.target.value})}
                />
              </div>
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">Property Address</label>
                <input 
                  type="text" 
                  placeholder="123 Street Ave, City, ST"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-inner placeholder:text-slate-400"
                  required
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Financials Section */}
          <section className="space-y-6 pt-10 border-t-2 border-slate-50">
            <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm"><DollarSignIcon size={14} /></div>
              Financial Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-emerald-600 transition-colors">Sale Price ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all shadow-inner"
                  onChange={(e) => setFormData({...formData, sale_price: Number(e.target.value)})}
                  onBlur={calculateSurplus}
                />
              </div>
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-rose-600 transition-colors">Total Debt ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black focus:ring-8 focus:ring-rose-500/5 focus:border-rose-500 outline-none transition-all shadow-inner"
                  onChange={(e) => setFormData({...formData, total_debt: Number(e.target.value)})}
                  onBlur={calculateSurplus}
                />
              </div>
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1">Est. Surplus</label>
                <div className="w-full bg-indigo-950 border-2 border-indigo-800 rounded-2xl py-4 px-5 text-sm font-black text-indigo-400 shadow-2xl flex items-center justify-between">
                  <span>Authorized Pool:</span>
                  <span className="text-white text-lg">${formData.surplus_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="space-y-6 pt-10 border-t-2 border-slate-50">
            <h3 className="text-[11px] font-black text-amber-600 uppercase tracking-[0.2em] flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-100 shadow-sm"><CalendarIcon size={14} /></div>
              Critical Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 group">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest px-1 group-focus-within:text-amber-600 transition-colors">Tax Sale Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 px-5 text-sm font-black focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 outline-none transition-all shadow-inner"
                  onChange={(e) => setFormData({...formData, tax_sale_date: e.target.value})}
                />
              </div>
              <div className="p-6 bg-amber-50 border-2 border-amber-100 rounded-[2rem] flex gap-5 shadow-inner">
                <InfoIcon size={24} className="text-amber-600 shrink-0 mt-1" />
                <p className="text-xs text-amber-900 font-bold leading-relaxed">
                  Based on <span className="text-indigo-600 font-black">GA-Fulton</span> rules, the claim deadline will be set to 12 months after the tax sale date recorded above. AI Core will calculate the exact timestamp once the case is initialized.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-10 bg-slate-50 border-t-2 border-slate-100 flex items-center justify-end gap-6">
          <Tooltip content="Cancel and return to the dashboard. No data will be saved.">
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="px-8 py-3 text-xs font-black text-slate-700 uppercase tracking-widest hover:text-red-600 transition-all hover:-translate-x-1"
            >
              Cancel
            </button>
          </Tooltip>
          <Tooltip content="Commit this property record to the database and initiate the discovery pipeline.">
            <button 
              type="submit"
              className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-slate-300 flex items-center gap-3 active:scale-95 hover:-translate-y-1.5 border-2 border-white/10"
            >
              <SaveIcon size={20} />
              Initialize Case
            </button>
          </Tooltip>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
