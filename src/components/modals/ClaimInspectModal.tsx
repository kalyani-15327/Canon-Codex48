import React, { useState, useEffect } from 'react';
import { ClaimItem } from '../../types';
import {
  Scale,
  X,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Clock,
  AlertOctagon,
  AlertTriangle,
  UserCheck,
  Send,
  Calendar,
  History,
  FileText,
  FileEdit,
} from 'lucide-react';

interface ClaimInspectModalProps {
  claim: ClaimItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEscalate: (claim: ClaimItem) => void;
  onVerifyQuick: (claimId: string) => void;
  onRevokeVerification?: (claimId: string, reason?: string) => void;
  onOpenEvidencePreview?: (claim: ClaimItem) => void;
  onNavigateToSource?: (contentId?: string, claimText?: string) => void;
}

export const ClaimInspectModal: React.FC<ClaimInspectModalProps> = ({
  claim,
  isOpen,
  onClose,
  onOpenEscalate,
  onVerifyQuick,
  onRevokeVerification,
  onOpenEvidencePreview,
  onNavigateToSource,
}) => {
  const [isConfirmingRevoke, setIsConfirmingRevoke] = useState(false);
  const [revokeReason, setRevokeReason] = useState('');

  useEffect(() => {
    setIsConfirmingRevoke(false);
    setRevokeReason('');
  }, [claim?.id, isOpen]);

  if (!isOpen || !claim) return null;

  const getStatusBadge = () => {
    switch (claim.status) {
      case 'Verified':
        return (
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified
          </span>
        );
      case 'Expired Evidence':
        return (
          <span className="text-xs font-mono font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Expired Evidence
          </span>
        );
      case 'Unsupported':
        return (
          <span className="text-xs font-mono font-medium text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <AlertOctagon className="w-3.5 h-3.5" /> Unsupported
          </span>
        );
      case 'Needs Verification':
        return (
          <span className="text-xs font-mono font-medium text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Needs Verification
          </span>
        );
      case 'Under Legal Review':
      case 'Pending Specialist Review':
        return (
          <span className="text-xs font-mono font-medium text-sky-400 bg-sky-950/60 border border-sky-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5" /> {claim.status}
          </span>
        );
      default:
        return (
          <span className="text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
            {claim.status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Claim Verification Matrix & Evidence Record
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Identifier: {claim.id} · Domain: {claim.category}
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

        {/* Claim Statement & Context */}
        <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">
              Claim Proposition Statement:
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                Risk: {claim.riskLevel}
              </span>
              {getStatusBadge()}
            </div>
          </div>
          <p className="text-sm text-slate-100 font-medium leading-relaxed">
            "{claim.claimText}"
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-900 text-[11px] font-mono">
            <span className="text-slate-400">
              Source Document: <strong className="text-slate-200">{claim.contentTitle || 'Corporate Draft'}</strong> (v{claim.auditVersion || 1})
            </span>
            {claim.isActive === false ? (
              <span className="text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-800/60 text-[10px]">
                Historical (Removed in latest draft)
              </span>
            ) : (
              <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60 text-[10px]">
                Active Content Claim
              </span>
            )}
          </div>
          {claim.statusReason && (
            <div className="text-[11px] text-amber-300/90 font-mono bg-amber-950/30 border border-amber-900/50 p-2 rounded leading-snug">
              <strong className="text-amber-400 font-semibold uppercase text-[10px] block mb-0.5">Status Verification Reason:</strong>
              {claim.statusReason}
            </div>
          )}
          <div className="text-[11px] text-slate-400 font-mono italic">
            Draft context: "{claim.draftContext}"
          </div>
        </div>

        {/* Evidence & Ownership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Assigned Owner:</span>
            <p className="font-mono text-slate-200">{claim.owner}</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Validity Horizon:</span>
            <p className="font-mono text-slate-200">
              Audited: {claim.evidenceDate} · Expires: {claim.expiryDate}
            </p>
          </div>

          {claim.supportingFactCode && (
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1 md:col-span-2">
              <span className="text-[10px] font-mono uppercase text-indigo-400">
                Supporting Approved Fact:
              </span>
              <p className="font-mono text-slate-200">
                Code: <strong className="text-indigo-300">{claim.supportingFactCode}</strong>
                {claim.supportingFactValue ? ` · Approved Value: ${claim.supportingFactValue}` : ''}
              </p>
            </div>
          )}

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1 md:col-span-2">
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Supporting Evidence Citation:
            </span>
            <p className="text-slate-200">{claim.evidenceCitation}</p>
            <div className="pt-2 flex flex-wrap items-center gap-2">
              {onOpenEvidencePreview && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenEvidencePreview(claim);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 px-3 py-1.5 rounded transition-colors font-mono cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Inspect Certificate / Evidence Preview</span>
                </button>
              )}
              {claim.evidenceArtifact?.externalUrl && claim.evidenceArtifact.isExternalGenuine && (
                <a
                  href={claim.evidenceArtifact.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 underline font-mono"
                >
                  <span>Official Standard Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Verification History Timeline */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 uppercase">
            <History className="w-3.5 h-3.5" />
            <span>Verification Audit History ({claim.history.length})</span>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {claim.history.map((h) => (
              <div
                key={h.id}
                className="p-2.5 bg-slate-950/80 rounded border border-slate-800/80 text-xs space-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">{h.action}</span>
                  <span className="font-mono text-[10px] text-slate-500">{h.timestamp}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{h.note}</p>
                <span className="text-[10px] font-mono text-indigo-400">By {h.author}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inline Revoke Confirmation Dialog */}
        {isConfirmingRevoke && claim.status === 'Verified' && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-800/80 rounded-lg space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Confirm Revoke Verification</span>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmingRevoke(false)}
                className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to revoke verification for claim <span className="font-mono text-rose-300 font-semibold">[{claim.id}]</span>?
              This will update its status from <strong className="text-emerald-400">Verified</strong> to <strong className="text-rose-400">Unsupported</strong> and record an entry in the Audit Trail.
            </p>
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-slate-400 block">
                Reason for revocation (optional):
              </label>
              <input
                type="text"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                placeholder="e.g. Expired audit horizon, challenged benchmark, or manual re-audit required"
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsConfirmingRevoke(false)}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onRevokeVerification) {
                    onRevokeVerification(claim.id, revokeReason.trim() || undefined);
                  }
                  setIsConfirmingRevoke(false);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors cursor-pointer shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Confirm Revoke Verification</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {claim.status !== 'Verified' ? (
              <button
                type="button"
                onClick={() => onVerifyQuick(claim.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800 rounded-lg transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Mark Verified with Active Certificate</span>
              </button>
            ) : (
              onRevokeVerification && (
                <button
                  type="button"
                  onClick={() => {
                    let confirmedByWindow = false;
                    try {
                      if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
                        confirmedByWindow = window.confirm(
                          `Are you sure you want to revoke verification for claim [${claim.id}]?\n\n"${claim.claimText}"\n\nThis will change its status to Unsupported.`
                        );
                      }
                    } catch {
                      // ignore iframe security error
                    }

                    if (confirmedByWindow) {
                      onRevokeVerification(claim.id, revokeReason.trim() || undefined);
                    } else {
                      setIsConfirmingRevoke(true);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-300 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 rounded-lg transition-colors cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Revoke Verification</span>
                </button>
              )
            )}

            <button
              onClick={() => {
                onClose();
                onOpenEscalate(claim);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-sky-300 bg-sky-950/60 hover:bg-sky-900 border border-sky-800 rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Escalate to Specialist</span>
            </button>

            {onNavigateToSource && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToSource(claim.contentId, claim.claimText);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800 rounded-lg transition-colors cursor-pointer"
              >
                <FileEdit className="w-3.5 h-3.5 text-indigo-400" />
                <span>View in Content Auditor</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
