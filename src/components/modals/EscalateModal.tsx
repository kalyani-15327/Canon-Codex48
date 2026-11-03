import React, { useState } from 'react';
import { ClaimItem } from '../../types';
import { Send, X, AlertTriangle, Calendar, UserCheck } from 'lucide-react';

interface EscalateModalProps {
  claim: ClaimItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmEscalate: (
    claimId: string,
    specialist: string,
    priority: 'Urgent' | 'High' | 'Normal',
    dueDate: string,
    notes: string
  ) => void;
}

export const EscalateModal: React.FC<EscalateModalProps> = ({
  claim,
  isOpen,
  onClose,
  onConfirmEscalate,
}) => {
  const [specialist, setSpecialist] = useState('Beatrix Holzer (Legal Counsel)');
  const [priority, setPriority] = useState<'Urgent' | 'High' | 'Normal'>('High');
  const [dueDate, setDueDate] = useState('2026-10-28');
  const [notes, setNotes] = useState('');

  if (!isOpen || !claim) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmEscalate(claim.id, specialist, priority, dueDate, notes);
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Escalate Claim to Governance Specialist
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Claim ID: {claim.id} · Current Status: {claim.status}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Claim context */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-sky-400">Target Claim:</span>
          <p className="text-slate-200 font-mono italic text-[11px]">"{claim.claimText}"</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Assignment dropdown */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Assign to Specialist / Department:
            </label>
            <select
              value={specialist}
              onChange={(e) => setSpecialist(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="Beatrix Holzer (Legal Counsel)">Beatrix Holzer — Lead Regulatory Counsel (Legal)</option>
              <option value="Julian Vance (Brand Director)">Julian Vance — Brand Architecture Director (Brand)</option>
              <option value="Dr. Aris Thorne (Chief Cryptographer)">Dr. Aris Thorne — Chief Cryptographer (Domain Specialist)</option>
              <option value="Kiran Patel (Head of Network Infra)">Kiran Patel — Latency & Telemetry Specialist (Infra)</option>
              <option value="Amina Al-Mansoor (Sustainability Lead)">Amina Al-Mansoor — Global Head of Sustainability (ESG)</option>
            </select>
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Priority Level:
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="Urgent">Urgent (24h turnaround)</option>
                <option value="High">High (48h turnaround)</option>
                <option value="Normal">Normal (5 business days)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Review Due Date:
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
          </div>

          {/* Escalation Notes */}
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Escalation Brief & Specific Inquiries:
            </label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detail what verification evidence, contract rider, or lab benchmark is needed from the specialist..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-sky-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!notes.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Escalation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
