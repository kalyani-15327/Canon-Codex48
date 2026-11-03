import React, { useState } from 'react';
import { AuditFinding } from '../../types';
import { ShieldAlert, X, Check } from 'lucide-react';

interface OverrideModalProps {
  finding: AuditFinding | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmOverride: (findingId: string, reason: string, author: string) => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  finding,
  isOpen,
  onClose,
  onConfirmOverride,
}) => {
  const [reason, setReason] = useState('');
  const [author, setAuthor] = useState('Beatrix Holzer (Legal Counsel)');

  if (!isOpen || !finding) return null;

  const presetReasons = [
    'Approved by General Counsel in addendum #882 for sovereign institutional release.',
    'Cryptographic exception confirmed: terminology standardized under NIST FIPS 203.',
    'Customer bespoke SLA contract explicitly waives standard availability disclaimers.',
    'Executive quote authorized by Chief Executive Officer for Q4 investor day.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmOverride(finding.id, reason, author);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Override Guideline Finding with Legal Reason
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Rule: {finding.guidelineRef} ({finding.category})
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

        {/* Finding summary */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
          <span className="text-[10px] font-mono uppercase text-rose-400">Flagged Segment:</span>
          <p className="text-slate-300 font-mono italic text-[11px]">"{finding.originalSegment}"</p>
        </div>

        {/* Presets */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-slate-400 uppercase">
            Quick Preset Justifications:
          </label>
          <div className="space-y-1">
            {presetReasons.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setReason(preset)}
                className="w-full text-left text-[11px] text-slate-300 hover:text-indigo-200 bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800/80 p-2 rounded transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Required Legal or Commercial Justification:
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the formal business or compliance reason for overriding this rule..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Approving Official:
            </label>
            <select
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-amber-500 font-mono"
            >
              <option value="Beatrix Holzer (Legal Counsel)">Beatrix Holzer (Lead Regulatory Counsel)</option>
              <option value="Julian Vance (Brand Director)">Julian Vance (Global Brand Governance Director)</option>
              <option value="Elena Rostova (VP Comms)">Elena Rostova (VP Corporate Communications)</option>
              <option value="Dr. Aris Thorne (Chief Cryptographer)">Dr. Aris Thorne (Chief Cryptographer)</option>
            </select>
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
              disabled={!reason.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Record Justified Override</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
