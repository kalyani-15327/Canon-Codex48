import React, { useState } from 'react';
import { ClaimCategory, ClaimItem } from '../../types';
import { PlusCircle, X, Check, ShieldCheck } from 'lucide-react';

interface AddFactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFact: (newClaim: Omit<ClaimItem, 'id' | 'history'>) => void;
}

export const AddFactModal: React.FC<AddFactModalProps> = ({
  isOpen,
  onClose,
  onAddFact,
}) => {
  const [claimText, setClaimText] = useState('');
  const [category, setCategory] = useState<ClaimCategory>('Security');
  const [evidenceCitation, setEvidenceCitation] = useState('');
  const [evidenceLink, setEvidenceLink] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-10-26');
  const [owner, setOwner] = useState('Beatrix Holzer (Legal Counsel)');
  const [riskLevel, setRiskLevel] = useState<'Critical' | 'Moderate' | 'Low'>('Low');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimText.trim() || !evidenceCitation.trim()) return;

    onAddFact({
      contentId: 'fact-global',
      auditVersion: 1,
      isActive: true,
      claimText: claimText.trim(),
      draftContext: `Approved Fact Library: "${claimText.trim()}"`,
      status: 'Verified',
      owner,
      evidenceCitation: evidenceCitation.trim(),
      evidenceLink: evidenceLink.trim() || 'https://trust.canon.internal/certificates/verified-fact',
      evidenceDate: new Date().toISOString().slice(0, 10),
      expiryDate,
      riskLevel,
      category,
    });

    setClaimText('');
    setEvidenceCitation('');
    setEvidenceLink('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Add Approved Fact to Verification Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Register a verified factual proposition with accredited certification and validity period
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Verified Claim / Proposition Statement:
            </label>
            <textarea
              rows={2}
              required
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="e.g. Certified sub-2ms network roundtrip time between Frankfurt and Zurich data centers"
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-emerald-500 font-sans resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Security">Security</option>
                <option value="Performance">Performance</option>
                <option value="Financial">Financial / Regulatory</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Market Share">Market Share</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Assigned Approver / Owner:
              </label>
              <select
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="Beatrix Holzer (Legal Counsel)">Beatrix Holzer (Legal)</option>
                <option value="Julian Vance (Brand Director)">Julian Vance (Brand Lead)</option>
                <option value="Dr. Aris Thorne (Chief Cryptographer)">Dr. Aris Thorne (Cryptographer)</option>
                <option value="Kiran Patel (Head of Network Infra)">Kiran Patel (Network Infra)</option>
                <option value="Amina Al-Mansoor (Sustainability)">Amina Al-Mansoor (ESG)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Evidence Citation & Certificate Reference:
            </label>
            <input
              type="text"
              required
              value={evidenceCitation}
              onChange={(e) => setEvidenceCitation(e.target.value)}
              placeholder="e.g. ISO/IEC 27001:2022 Certificate #BSI-IS-99201 (Valid thru Q4 2027)"
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Evidence Artifact URL:
              </label>
              <input
                type="text"
                value={evidenceLink}
                onChange={(e) => setEvidenceLink(e.target.value)}
                placeholder="https://trust.canon.internal/certs/..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Evidence Expiry Date:
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
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
              disabled={!claimText.trim() || !evidenceCitation.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Register Verified Fact</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
