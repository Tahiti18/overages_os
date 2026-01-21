
import React, { useState } from 'react';
import { ScaleIcon, PlusIcon, EditIcon, Trash2Icon, SearchIcon } from 'lucide-react';
import { JurisdictionRule } from '../types';
import Tooltip from './Tooltip';

const JurisdictionRules: React.FC = () => {
  const [rules, setRules] = useState<JurisdictionRule[]>([
    {
      id: 'r1',
      state: 'GA',
      county: 'Fulton',
      claim_deadline_days: 365,
      required_documents: ['Govt ID', 'Proof of Ownership', 'Claim Form'],
      filing_method: 'Mail / In-Person',
      notes: 'Standard 1-year period from sale date.',
      attorney_required: false
    },
    {
      id: 'r2',
      state: 'FL',
      county: 'Miami-Dade',
      claim_deadline_days: 120,
      required_documents: ['ID', 'Affidavit', 'Surplus Application'],
      filing_method: 'Online Portal',
      notes: 'Requires notarization of application.',
      attorney_required: false
    }
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Jurisdiction Rules</h2>
          <p className="text-slate-500">Configure claim deadlines and document requirements per county.</p>
        </div>
        <Tooltip content="Define a new set of compliance rules for a specific state or county.">
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <PlusIcon size={18} />
            Create Rule
          </button>
        </Tooltip>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <Tooltip content="Search the rule database by state or county name.">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm w-full max-w-sm">
              <SearchIcon size={16} className="text-slate-400" />
              <input type="text" placeholder="Filter by State or County..." className="text-sm bg-transparent border-none focus:ring-0 w-full" />
            </div>
          </Tooltip>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-6 py-3">Jurisdiction</th>
                <th className="px-6 py-3">Deadline Days</th>
                <th className="px-6 py-3">Method</th>
                <th className="px-6 py-3">Docs Needed</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{rule.county}, {rule.state}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">
                    {rule.claim_deadline_days} Days
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {rule.filing_method}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {rule.required_documents.map((doc, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Tooltip content="Modify deadline, documentation, or filing method requirements.">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><EditIcon size={18} /></button>
                      </Tooltip>
                      <Tooltip content="Permanently remove this jurisdiction from the rules engine.">
                        <button className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2Icon size={18} /></button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JurisdictionRules;
