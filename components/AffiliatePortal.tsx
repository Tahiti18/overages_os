
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
    { label: 'Total Referrals', value: user.affiliate?.total_referrals, icon: UsersIcon, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
    { label: 'Active Subscribers', value: user.affiliate?.active_subscriptions, icon: CheckCircleIcon, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Pending Payout', value: `$${user.affiliate?.unpaid_earnings.toFixed(2)}`, icon: DollarSignIcon, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Lifetime Earnings', value: `$${user.affiliate?.total_earned.toFixed(0)}`, icon: TrendingUpIcon, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="bg-slate-950 rounded-[3.5rem] p-14 text-white shadow-3xl relative overflow-hidden group border-2 border-white/5">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-indigo-600 rounded-2xl shadow-2xl shadow-indigo-950 border-2 border-white/20">
                <GiftIcon size={24} />
              </div>
              <h3 className="text-4xl font-black tracking-tight uppercase italic">Affiliate Hub</h3>
            </div>
            <p className="text-indigo-200 font-bold text-xl leading-relaxed">
              Earn <span className="text-white font-black underline decoration-indigo-500 decoration-4 underline-offset-8">20% Recurring Commission</span> for life on every user you bring to the Prospector AI platform.
            </p>
            <div className="pt-10">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Your Unique Referral Link</p>
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-3xl border-2 border-white/10 group-focus-within:border-indigo-500 transition-all shadow-2xl">
                <div className="px-6 py-3 font-mono text-sm text-indigo-300 select-all truncate">
                  {referralLink}
                </div>
                <Tooltip content="Copy link to clipboard">
                  <button 
                    onClick={handleCopy}
                    className="ml-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-950 hover:bg-indigo-500 active:scale-95 transition-all flex items-center gap-3 border-2 border-white/10"
                  >
                    {copied ? <CheckCircleIcon size={18} /> : <CopyIcon size={18} />}
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
          <div key={i} className={`bg-white p-10 rounded-[2.5rem] border-2 ${stat.border} shadow-2xl space-y-6 hover:-translate-y-2 transition-all group ring-1 ring-slate-100/50`}>
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-lg border border-black/5 transition-transform group-hover:rotate-6`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] border-2 border-slate-100 shadow-2xl overflow-hidden ring-1 ring-slate-100">
             <div className="p-10 border-b-2 border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3 italic">
                   <MegaphoneIcon size={24} className="text-indigo-600" />
                   Performance Insights
                </h4>
                <Tooltip content="Launch a visual breakdown of your conversion rates and traffic sources.">
                  <button className="p-4 bg-white border-2 border-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-400 transition-all shadow-md">
                    <PieChartIcon size={22} />
                  </button>
                </Tooltip>
             </div>
             <div className="p-10 space-y-10">
                <div className="flex items-center justify-between p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-100 shadow-inner">
                   <div className="space-y-2">
                      <p className="text-lg font-black text-slate-900 uppercase tracking-tight">Affiliate Level: Platinum Hunter</p>
                      <p className="text-sm text-slate-600 font-bold italic">You are in the top 5% of our growth partners.</p>
                   </div>
                   <div className="px-8 py-3 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 border-2 border-white/20">
                      25% Bonus Level
                   </div>
                </div>

                <div className="space-y-6">
                   <h5 className="text-[11px] font-black text-slate-700 uppercase tracking-widest px-2">Referral Payout Rules</h5>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 border-2 border-slate-100 rounded-[2rem] bg-white space-y-4 shadow-xl hover:-translate-y-1 transition-all">
                         <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-md">
                            <CheckCircleIcon size={20} />
                         </div>
                         <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Recurring Income</p>
                         <p className="text-xs text-slate-600 leading-relaxed font-bold">Earn every month the user stays active. No earning cap on lifetime commissions.</p>
                      </div>
                      <div className="p-8 border-2 border-slate-100 rounded-[2rem] bg-white space-y-4 shadow-xl hover:-translate-y-1 transition-all">
                         <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-md">
                            <CalendarIcon size={20} />
                         </div>
                         <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Monthly Payouts</p>
                         <p className="text-xs text-slate-600 leading-relaxed font-bold">Earnings paid on the 1st of every month via Bank Transfer or USDC/Crypto.</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-3xl relative overflow-hidden group border-2 border-indigo-500 hover:-translate-y-1.5 transition-all">
             <div className="relative z-10 space-y-8">
                <h4 className="text-2xl font-black uppercase tracking-tighter">Need Promo Assets?</h4>
                <p className="text-indigo-100 font-bold leading-relaxed italic opacity-100">
                   Download our high-fidelity brand kit, including screenshots, video walkthroughs, and swipe-copy for LinkedIn.
                </p>
                <Tooltip content="Download the complete partner promotion kit.">
                  <button className="w-full py-5 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-950/20 hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 border-2 border-white/10">
                    <DownloadIcon size={18} /> Get Brand Kit
                  </button>
                </Tooltip>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
                <MegaphoneIcon size={140} fill="white" />
             </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border-2 border-slate-100 shadow-2xl space-y-6 ring-1 ring-slate-100">
             <div className="flex items-center gap-3 pb-4 border-b-2 border-slate-50">
                <ShieldCheckIcon size={24} className="text-emerald-500" />
                <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest">Growth Terms</h5>
             </div>
             <p className="text-xs text-slate-600 font-bold leading-relaxed">
                Referral bonuses are calculated based on the net subscription price after taxes. Self-referral is strictly prohibited and results in immediate terminal closure.
             </p>
             <button className="w-full py-4 bg-slate-50 border-2 border-slate-100 text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:border-indigo-400 transition-all flex items-center justify-center gap-2">
                Full Agreement <ExternalLinkIcon size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePortal;
