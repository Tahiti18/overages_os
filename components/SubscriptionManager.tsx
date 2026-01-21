
import React, { useState } from 'react';
import { 
  CheckIcon, 
  ZapIcon, 
  CreditCardIcon, 
  BitcoinIcon, 
  ShieldCheckIcon,
  SparklesIcon,
  CrownIcon,
  RocketIcon,
  PlusIcon,
  HistoryIcon
} from 'lucide-react';
import { User, SubscriptionTier } from '../types';
import Tooltip from './Tooltip';

interface SubscriptionManagerProps {
  user: User;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ user }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: SubscriptionTier.STARTER,
      name: 'Starter Agent',
      price: billingCycle === 'monthly' ? '$99' : '$890',
      icon: RocketIcon,
      color: 'text-slate-600',
      bg: 'bg-slate-100',
      border: 'border-slate-200',
      features: [
        'Discovery Dashboard',
        'Manual Overage Intake',
        'Basic Case Lifecycle',
        'Email Support',
        '10 AI Credits / Month'
      ]
    },
    {
      id: SubscriptionTier.PROFESSIONAL,
      name: 'Professional',
      price: billingCycle === 'monthly' ? '$299' : '$2,690',
      icon: SparklesIcon,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-300',
      popular: true,
      features: [
        'AI Document Extraction',
        'Skip-Trace Web Research',
        'Waterfall Financial Engine',
        'Personalized Outreach Architect',
        '500 AI Credits / Month'
      ]
    },
    {
      id: SubscriptionTier.ENTERPRISE,
      name: 'Enterprise Legal',
      price: 'Custom',
      icon: CrownIcon,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      features: [
        'Unlimited User Seats',
        'Counsel Hub (Attorneys)',
        'Full Smart Packager',
        'Whitelabel Court Forms',
        'Priority 24/7 Concierge'
      ]
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Intelligence Tiers</h2>
        <p className="text-slate-700 font-bold text-lg leading-relaxed">
          Scale your surplus recovery operation. Choose a plan that fits your volume and jurisdictional needs.
        </p>
        
        <div className="flex items-center justify-center gap-6 mt-10">
          <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-indigo-600' : 'text-slate-500'}`}>Monthly Billing</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-16 h-9 bg-slate-200 rounded-full relative p-1 transition-all shadow-inner border-2 border-slate-300"
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-2xl transition-all border border-slate-100 ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
          </button>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-slate-500'}`}>Yearly Billing</span>
            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-3 py-1 rounded-full uppercase border border-emerald-200 shadow-sm">Save 25%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-white rounded-[3.5rem] p-12 border-2 transition-all relative flex flex-col h-full ring-1 ring-slate-100 ${
              plan.popular ? 'border-indigo-600 shadow-3xl shadow-indigo-200 scale-105 z-10' : plan.border + ' shadow-2xl hover:border-indigo-400 hover:-translate-y-2'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-8 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl border-2 border-white/20">
                Strategic Choice
              </div>
            )}

            <div className="space-y-8 flex-1">
              <div className={`w-20 h-20 ${plan.bg} ${plan.color} rounded-[2rem] flex items-center justify-center border-2 border-white/50 shadow-xl shadow-inner`}>
                <plan.icon size={36} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2 italic">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-slate-600 text-xs font-black uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>}
                </div>
              </div>

              <div className="space-y-5 pt-8 border-t-2 border-slate-50">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-lg ${plan.popular ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'} flex items-center justify-center shrink-0 shadow-md border border-white/20`}>
                      <CheckIcon size={14} strokeWidth={4} />
                    </div>
                    <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-5">
              <Tooltip content={`Subscribe to ${plan.name} using Stripe Secure Checkout.`}>
                <button 
                  className={`w-full py-5 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 shadow-2xl ${
                    plan.id === user.subscription?.tier 
                    ? 'bg-slate-50 text-slate-400 cursor-default border-2 border-slate-100' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-300 border-2 border-white/20'
                  }`}
                >
                  {plan.id === user.subscription?.tier ? <ShieldCheckIcon size={18} /> : <CreditCardIcon size={18} />}
                  {plan.id === user.subscription?.tier ? 'Current Tier' : `Checkout securely`}
                </button>
              </Tooltip>
              
              {plan.price !== 'Custom' && plan.id !== user.subscription?.tier && (
                <Tooltip content={`Pay with Bitcoin, Ethereum, or Stablecoins via Coinbase Commerce.`}>
                  <button className="w-full py-5 bg-slate-950 text-white rounded-[1.75rem] font-black text-xs uppercase tracking-[0.15em] transition-all hover:bg-slate-900 flex items-center justify-center gap-3 shadow-2xl border-2 border-white/5">
                    <BitcoinIcon size={18} className="text-amber-500" />
                    Protocol: Crypto
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-16">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-3xl relative overflow-hidden group border-2 border-white/5 hover:-translate-y-1 transition-all">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center shrink-0 shadow-3xl border-2 border-white/20">
              <ZapIcon size={48} fill="white" />
            </div>
            <div className="space-y-4">
              <h4 className="text-3xl font-black uppercase tracking-tight italic">AI Credits Pulse</h4>
              <p className="text-indigo-200 font-bold text-lg leading-relaxed opacity-100">
                Available Engine Credits: <span className="text-white font-black underline decoration-indigo-500 decoration-4 underline-offset-4">{user.subscription?.ai_credits_remaining}</span>
              </p>
            </div>
          </div>
          <div className="mt-10 flex gap-6">
             <button className="px-8 py-4 bg-white text-indigo-950 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-3 shadow-2xl">
                <PlusIcon size={16} strokeWidth={3} /> Refill Tactical Credits
             </button>
             <button className="px-8 py-4 bg-white/5 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 border-2 border-white/5">
                <HistoryIcon size={16} /> Audit Usage Logs
             </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-5 rotate-12 group-hover:scale-125 transition-transform duration-1000">
             <ZapIcon size={200} fill="white" />
          </div>
        </div>

        <div className="bg-white rounded-[3.5rem] p-12 border-2 border-slate-100 shadow-3xl flex flex-col justify-center space-y-6 hover:-translate-y-1 transition-all ring-1 ring-slate-100">
          <div className="flex items-center gap-5">
             <div className="p-3 bg-emerald-50 rounded-2xl shadow-md border border-emerald-100">
               <ShieldCheckIcon size={32} className="text-emerald-500" />
             </div>
             <h4 className="font-black text-slate-900 uppercase text-xl tracking-tight italic">Enterprise Integrity</h4>
          </div>
          <p className="text-base text-slate-700 font-bold leading-relaxed">
            Every Prospector AI plan is protected by SSL-grade document encryption. We maintain daily database snapshots and live statutory updates for all monitored jurisdictions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
