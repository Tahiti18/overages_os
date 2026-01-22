
import React from 'react';
import { 
  Bell, 
  X, 
  Zap, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  ChevronRight,
  Trash2,
  Archive,
  BellOff
} from 'lucide-react';
import { SystemNotification } from '../types';

interface NotificationHubProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SystemNotification[];
}

const NotificationHub: React.FC<NotificationHubProps> = ({ isOpen, onClose, notifications }) => {
  if (!isOpen) return null;

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'border-rose-500 bg-rose-50 text-rose-700 shadow-rose-200/50';
      case 'HIGH': return 'border-amber-500 bg-amber-50 text-amber-700 shadow-amber-200/50';
      default: return 'border-slate-100 bg-white text-slate-600 shadow-slate-200/50';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-slate-50 h-full shadow-[0_0_100px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-right duration-500 border-l-2 border-white/20">
        <div className="p-10 bg-slate-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-900/50 animate-pulse">
              <Bell size={28} fill="white" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Surveillance Hub</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">Live Intelligence Feed</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/50 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-8 rounded-[2.5rem] border-2 shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden group ${getPriorityStyles(notif.priority)}`}
              >
                <div className="relative z-10 flex items-start gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-2 border-white/20 ${notif.priority === 'URGENT' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {notif.type === 'DROP_ALERT' ? <Zap size={24} /> : <Clock size={24} />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                       <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">{notif.type.replace('_', ' ')}</span>
                       <span className="text-[9px] font-black uppercase opacity-40">{notif.timestamp}</span>
                    </div>
                    <h4 className="text-lg font-black tracking-tight leading-tight">{notif.title}</h4>
                    <p className="text-sm font-bold opacity-80 leading-relaxed italic">"{notif.message}"</p>
                    
                    {notif.type === 'DROP_ALERT' && (
                      <button className="mt-4 w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl">
                        Acknowledge & Sync <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
                {notif.priority === 'URGENT' && (
                  <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12 group-hover:scale-150 transition-transform duration-1000">
                     <ShieldAlert size={100} fill="white" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <BellOff size={64} className="text-slate-300" />
              <p className="text-sm font-black uppercase tracking-widest text-slate-400">All channels clear</p>
            </div>
          )}
        </div>

        <div className="p-10 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
           <button className="text-[10px] font-black text-slate-400 hover:text-red-600 uppercase tracking-widest transition-colors flex items-center gap-2">
              <Trash2 size={14} /> Clear Feed
           </button>
           <button className="px-8 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200">
              <Archive size={14} /> View History
           </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationHub;
