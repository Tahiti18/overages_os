
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
      color: 'text-slate-400',
      bg: 'bg-slate-50',
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
      border: 'border-indigo-200',
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
      border: 'border-amber-200',
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
        <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">Intelligence Tiers</h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed">
          Scale your surplus recovery operation. Choose a plan that fits your volume and jurisdictional needs.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-indigo-600' : 'text-slate-400'}`}>Monthly</span>
          <button 
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-all"
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-indigo-600' : 'text-slate-400'}`}>Yearly</span>
            <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">Save 25%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`bg-white rounded-[3rem] p-10 border-2 transition-all relative flex flex-col h-full ${
              plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-100 scale-105 z-10' : plan.border + ' shadow-sm hover:border-indigo-400'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                Most Popular
              </div>
            )}

            <div className="space-y-6 flex-1">
              <div className={`w-16 h-16 ${plan.bg} ${plan.color} rounded-3xl flex items-center justify-center`}>
                <plan.icon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-none mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-slate-400 text-xs font-bold">/ {billingCycle === 'monthly' ? 'month' : 'year'}</span>}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full ${plan.popular ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'} flex items-center justify-center shrink-0`}>
                      <CheckIcon size={12} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <Tooltip content={`Subscribe to ${plan.name} using Stripe Secure Checkout.`}>
                <button 
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    plan.id === user.subscription?.tier 
                    ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100 active:scale-95'
                  }`}
                >
                  {plan.id === user.subscription?.tier ? <ShieldCheckIcon size={16} /> : <CreditCardIcon size={16} />}
                  {plan.id === user.subscription?.tier ? 'Current Plan' : `Checkout Fiat`}
                </button>
              </Tooltip>
              
              {plan.price !== 'Custom' && plan.id !== user.subscription?.tier && (
                <Tooltip content={`Pay with Bitcoin, Ethereum, or Stablecoins via Coinbase Commerce.`}>
                  <button className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-800 flex items-center justify-center gap-2">
                    <BitcoinIcon size={16} className="text-amber-500" />
                    Pay with Crypto
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shrink-0 shadow-2xl">
              <ZapIcon size={40} fill="white" />
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-black uppercase tracking-tight">AI Credits Balance</h4>
              <p className="text-indigo-200 font-bold leading-relaxed opacity-80">
                You have <span className="text-white font-black">{user.subscription?.ai_credits_remaining}</span> processing credits remaining for skip-tracing and extraction.
              </p>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
             <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center gap-2">
                <PlusIcon size={14} /> Refill Credits
             </button>
             <button className="px-6 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2">
                <HistoryIcon size={14} /> Usage Log
             </button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-200 shadow-sm flex flex-col justify-center space-y-4">
          <div className="flex items-center gap-3">
             <ShieldCheckIcon size={24} className="text-emerald-500" />
             <h4 className="font-black text-slate-900 uppercase tracking-widest">Enterprise Compliance</h4>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            All plans include SSL-grade document encryption, daily database backups, and statutory compliance updates for GA, FL, and TX jurisdictions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
