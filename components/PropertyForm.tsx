
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">New Surplus Case</h2>
          <p className="text-slate-500 text-sm">Manually input property details to start the recovery workflow.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <XIcon size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Jurisdiction Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
              <MapPinIcon size={16} /> Location & Jurisdiction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">State</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                >
                  <option value="GA">Georgia (GA)</option>
                  <option value="FL">Florida (FL)</option>
                  <option value="TX">Texas (TX)</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase">County</label>
                <input 
                  type="text" 
                  placeholder="e.g. Fulton"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                  onChange={(e) => setFormData({...formData, county: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Parcel ID (APN)</label>
                <input 
                  type="text" 
                  placeholder="XX-XXXX-XXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                  onChange={(e) => setFormData({...formData, parcel_id: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Property Address</label>
                <input 
                  type="text" 
                  placeholder="123 Street Ave, City, ST"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Financials Section */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
              <DollarSignIcon size={16} /> Financial Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Sale Price ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  onChange={(e) => setFormData({...formData, sale_price: Number(e.target.value)})}
                  onBlur={calculateSurplus}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Total Debt ($)</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  onChange={(e) => setFormData({...formData, total_debt: Number(e.target.value)})}
                  onBlur={calculateSurplus}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Est. Surplus</label>
                <div className="w-full bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-sm font-bold text-indigo-700">
                  ${formData.surplus_amount.toLocaleString()}
                </div>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-2">
              <CalendarIcon size={16} /> Critical Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tax Sale Date</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-600 outline-none"
                  onChange={(e) => setFormData({...formData, tax_sale_date: e.target.value})}
                />
              </div>
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex gap-3">
                <InfoIcon size={20} className="text-orange-500 shrink-0" />
                <p className="text-xs text-orange-800 leading-relaxed">
                  Based on GA-Fulton rules, the claim deadline will be set to 12 months after the tax sale date recorded above.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <SaveIcon size={18} />
            Initialize Case
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
