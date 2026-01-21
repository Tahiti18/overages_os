
import React, { useState } from 'react';
import { 
  GiftIcon, 
  CopyIcon, 
  UsersIcon, 
  TrendingUpIcon, 
  DollarSignIcon, 
  ExternalLinkIcon,
  CheckCircleIcon,
  PieChartIcon,
  MegaphoneIcon,
  Share2Icon,
  // Fix: Added missing icons required by the component
  CalendarIcon,
  DownloadIcon,
  ShieldCheckIcon
} from 'lucide-react';
import { User } from '../types';
import Tooltip from './Tooltip';

interface AffiliatePortalProps {
  user: User;
}

const AffiliatePortal: React.FC<AffiliatePortalProps> = ({ user }) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `https://prospector.ai/join?ref=${user.affiliate?.referral_code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: 'Total Referrals', value: user.affiliate?.total_referrals, icon: UsersIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Subscribers', value: user.affiliate?.active_subscriptions, icon: CheckCircleIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Payout', value: `$${user.affiliate?.unpaid_earnings.toFixed(2)}`, icon: DollarSignIcon, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Lifetime Earnings', value: `$${user.affiliate?.total_earned.toFixed(0)}`, icon: TrendingUpIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="bg-slate-950 rounded-[3.5rem] p-14 text-white shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-950">
                <GiftIcon size={24} />
              </div>
              <h3 className="text-4xl font-black tracking-tight uppercase italic">Affiliate Hub</h3>
            </div>
            <p className="text-indigo-200 font-bold text-xl leading-relaxed">
              Earn <span className="text-white font-black underline decoration-indigo-500 decoration-4 underline-offset-8">20% Recurring Commission</span> for life on every user you bring to the Prospector AI platform.
            </p>
            <div className="pt-8">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Your Unique Referral Link</p>
              <div className="flex items-center gap-4 p-2 bg-white/5 rounded-3xl border border-white/10 group-focus-within:border-indigo-500 transition-all">
                <div className="px-6 py-3 font-mono text-sm text-indigo-300 select-all truncate">
                  {referralLink}
                </div>
                <Tooltip content="Copy link to clipboard">
                  <button 
                    onClick={handleCopy}
                    className="ml-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-950 hover:bg-indigo-500 active:scale-95 transition-all flex items-center gap-2"
                  >
                    {copied ? <CheckCircleIcon size={16} /> : <CopyIcon size={16} />}
                    {copied ? 'Copied' : 'Copy Link'}
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="hidden lg:block opacity-10 group-hover:scale-110 transition-transform duration-1000">
             <Share2Icon size={240} />
          </div>
        </div>
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-4 hover:border-indigo-400 transition-all group">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-sm overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                   <MegaphoneIcon size={24} className="text-indigo-600" />
                   Performance Insights
                </h4>
                <Tooltip content="Launch a visual breakdown of your conversion rates and traffic sources.">
                  <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                    <PieChartIcon size={20} />
                  </button>
                </Tooltip>
             </div>
             <div className="p-10 space-y-8">
                <div className="flex items-center justify-between p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                   <div className="space-y-1">
                      <p className="text-sm font-black text-slate-900">Affiliate Level: Platinum Hunter</p>
                      <p className="text-xs text-slate-500 font-bold">You are in the top 5% of our growth partners.</p>
                   </div>
                   <div className="px-6 py-2 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100">
                      25% Bonus Level
                   </div>
                </div>

                <div className="space-y-4">
                   <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Referral Payout Rules</h5>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-6 border-2 border-slate-100 rounded-3xl bg-white space-y-2">
                         <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <CheckCircleIcon size={18} />
                         </div>
                         <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Recurring Income</p>
                         <p className="text-xs text-slate-500 leading-relaxed font-bold">Earn every month the user stays active. No earning cap.</p>
                      </div>
                      <div className="p-6 border-2 border-slate-100 rounded-3xl bg-white space-y-2">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <CalendarIcon size={18} />
                         </div>
                         <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Monthly Payouts</p>
                         <p className="text-xs text-slate-500 leading-relaxed font-bold">Earnings paid on the 1st of every month via Bank Transfer or USDC.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 space-y-6">
                <h4 className="text-2xl font-black uppercase tracking-tight">Need Promo Assets?</h4>
                <p className="text-indigo-100 font-medium leading-relaxed">
                   Download our high-fidelity brand kit, including screenshots, video walkthroughs, and swipe-copy for LinkedIn.
                </p>
                <Tooltip content="Download the complete partner promotion kit.">
                  <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-950/20 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                    <DownloadIcon size={16} /> Get Brand Kit
                  </button>
                </Tooltip>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
                <MegaphoneIcon size={120} fill="white" />
             </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-sm space-y-6">
             <div className="flex items-center gap-3">
                <ShieldCheckIcon size={24} className="text-indigo-600" />
                <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest">Growth Terms</h5>
             </div>
             <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Referral bonuses are calculated based on the net subscription price after taxes. Self-referral is strictly prohibited and results in terminal closure.
             </p>
             <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                Full Agreement <ExternalLinkIcon size={10} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePortal;
