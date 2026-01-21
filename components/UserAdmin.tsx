
import React, { useState } from 'react';
import { 
  UsersIcon, 
  ShieldIcon, 
  MoreVerticalIcon, 
  MailIcon, 
  CheckCircle2Icon,
  PlusIcon
} from 'lucide-react';
import { User, UserRole } from '../types';

const UserAdmin: React.FC = () => {
  const [users] = useState<User[]>([
    { id: 'u1', email: 'admin@prospector.ai', role: UserRole.ADMIN, is_active: true },
    { id: 'u2', email: 'reviewer_jane@prospector.ai', role: UserRole.REVIEWER, is_active: true },
    { id: 'u3', email: 'agent_bob@prospector.ai', role: UserRole.FILING_AGENT, is_active: true },
    { id: 'u4', email: 'audit_steve@prospector.ai', role: UserRole.VIEWER, is_active: false },
  ]);

  const getRoleBadge = (role: UserRole) => {
    switch(role) {
      case UserRole.ADMIN: return 'bg-purple-100 text-purple-700 border-purple-200';
      case UserRole.REVIEWER: return 'bg-blue-100 text-blue-700 border-blue-200';
      case UserRole.FILING_AGENT: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
          <p className="text-slate-500">Manage your team's access levels and active accounts.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
          <PlusIcon size={18} />
          Invite Member
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200">
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4">Last Active</th>
              <th className="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200 group-hover:bg-white group-hover:border-indigo-200 transition-colors">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{user.email.split('@')[0]}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MailIcon size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5">
                  {user.is_active ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                      Disabled
                    </span>
                  )}
                </td>
                <td className="px-8 py-5 text-sm text-slate-500">
                  Today, 9:14 AM
                </td>
                <td className="px-8 py-5 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-all">
                    <MoreVerticalIcon size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permissions Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
          <ShieldIcon className="text-indigo-600 mb-4" size={24} />
          <h4 className="font-bold text-indigo-900 mb-2">Role Permissions</h4>
          <p className="text-sm text-indigo-800/70 leading-relaxed">
            Prospector AI uses strict role isolation. Only Admins can edit Jurisdiction Rules, while Filing Agents are restricted to document preparation.
          </p>
        </div>
        <div className="p-6 bg-green-50/50 rounded-2xl border border-green-100">
          <CheckCircle2Icon className="text-green-600 mb-4" size={24} />
          <h4 className="font-bold text-green-900 mb-2">Audit-Ready</h4>
          <p className="text-sm text-green-800/70 leading-relaxed">
            Every status change is logged with a timestamp and the actor's ID to maintain compliance with county filing requirements.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserAdmin;
