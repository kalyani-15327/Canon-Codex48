import React, { useState, useEffect } from 'react';
import { ClaimItem, EvidenceArtifact } from '../../types';
import {
  FileText,
  X,
  ShieldCheck,
  Clock,
  AlertOctagon,
  UserCheck,
  Calendar,
  ExternalLink,
  Edit3,
  Check,
  AlertTriangle,
  Lock,
  Building2,
  FileCheck2,
  Layers,
  Info,
} from 'lucide-react';

interface EvidencePreviewModalProps {
  claim: ClaimItem | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateEvidence?: (
    claimId: string,
    updatedArtifact: EvidenceArtifact,
    updatedCitation?: string,
    updatedDates?: { evidenceDate: string; expiryDate: string }
  ) => void;
}

export const EvidencePreviewModal: React.FC<EvidencePreviewModalProps> = ({
  claim,
  isOpen,
  onClose,
  onUpdateEvidence,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('');
  const [editIssuer, setEditIssuer] = useState('');
  const [editRefCode, setEditRefCode] = useState('');
  const [editCitation, setEditCitation] = useState('');
  const [editAbstract, setEditAbstract] = useState('');
  const [editAssessment, setEditAssessment] = useState('');
  const [editEvidenceDate, setEditEvidenceDate] = useState('');
  const [editExpiryDate, setEditExpiryDate] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Sync state when claim changes or editing opens
  useEffect(() => {
    if (claim) {
      setIsEditing(false);
      const art = claim.evidenceArtifact;
      setEditTitle(art?.documentTitle || claim.evidenceCitation || 'Evidence Document');
      setEditType(art?.documentType || 'Audit Certification / Agreement Rider');
      setEditIssuer(art?.issuerOrFirm || 'Canon Quality Assurance & Legal Operations');
      setEditRefCode(art?.referenceCode || `CAN-${claim.id.toUpperCase()}`);
      setEditCitation(claim.evidenceCitation || '');
      setEditAbstract(
        art?.abstract ||
          'Internal documentary artifact archived in Canon corporate governance ledger.'
      );
      setEditAssessment(
        art?.supportAssessment ||
          `Evaluation for claim: "${claim.claimText}". Current verification status is ${claim.status}.`
      );
      setEditEvidenceDate(claim.evidenceDate || new Date().toISOString().slice(0, 10));
      setEditExpiryDate(claim.expiryDate || '2027-12-31');
    }
  }, [claim]);

  if (!isOpen || !claim) return null;

  const artifact: EvidenceArtifact = claim.evidenceArtifact || {
    documentTitle: claim.evidenceCitation || 'Archived Evidence Document',
    documentType: 'Documentary Record',
    issuerOrFirm: 'Canon Governance & Quality Operations',
    referenceCode: `REF-${claim.id.toUpperCase()}`,
    abstract: 'Documentary evidence archived within Canon corporate compliance registry.',
    supportAssessment: `Evidence associated with claim "${claim.claimText}". Status: ${claim.status}.`,
    isDemoNotice: true,
  };

  const getStatusBadge = () => {
    switch (claim.status) {
      case 'Verified':
        return (
          <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Artifact
          </span>
        );
      case 'Expired Evidence':
        return (
          <span className="text-xs font-mono font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Expired Evidence (&gt;180 Days)
          </span>
        );
      case 'Unsupported':
        return (
          <span className="text-xs font-mono font-medium text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2.5 py-1 rounded flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5" />
            Unsupported / Contradiction Flag
          </span>
        );
      case 'Under Legal Review':
        return (
          <span className="text-xs font-mono font-medium text-sky-400 bg-sky-950/60 border border-sky-800/80 px-2.5 py-1 rounded flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            Under Legal Review
          </span>
        );
    }
  };

  const handleSaveMetadata = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateEvidence) return;

    const updatedArtifact: EvidenceArtifact = {
      ...artifact,
      documentTitle: editTitle.trim(),
      documentType: editType.trim(),
      issuerOrFirm: editIssuer.trim(),
      referenceCode: editRefCode.trim(),
      abstract: editAbstract.trim(),
      supportAssessment: editAssessment.trim(),
      isDemoNotice: true,
    };

    onUpdateEvidence(
      claim.id,
      updatedArtifact,
      editCitation.trim() || claim.evidenceCitation,
      {
        evidenceDate: editEvidenceDate,
        expiryDate: editExpiryDate,
      }
    );

    setIsEditing(false);
  };

  // Determine if there is a real, safe public web link
  const hasGenuineExternalUrl =
    artifact.externalUrl &&
    artifact.externalUrl.startsWith('https://') &&
    !artifact.externalUrl.includes('.internal');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-preview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-6 text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="evidence-preview-title" className="text-base font-bold text-white tracking-tight">
                Certificate & Evidence Artifact Preview
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Claim Ref: {claim.id} · Domain: {claim.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && onUpdateEvidence && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Edit evidence metadata"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                <span>Edit Metadata</span>
              </button>
            )}

            <button
              onClick={onClose}
              aria-label="Close Evidence Preview"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MANDATORY PROMINENT DEMO NOTICE */}
        <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-900/50 flex items-start gap-3 text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <div className="font-mono font-bold uppercase tracking-wider text-amber-400 text-[11px]">
              DEMO EVIDENCE — NOT AN OFFICIAL CERTIFICATE
            </div>
            <p className="text-amber-300/90 leading-relaxed text-[11px]">
              This artifact is simulated corporate demonstration material created for internal governance evaluation within Canon. It does not represent an authentic, externally accredited, or legal third-party certification.
            </p>
          </div>
        </div>

        {/* Normal Preview Mode */}
        {!isEditing ? (
          <div className="space-y-4">
            {/* Associated Claim Summary Card */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold tracking-wider">
                  Associated Corporate Claim:
                </span>
                {getStatusBadge()}
              </div>

              <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                "{claim.claimText}"
              </p>

              <div className="text-xs text-slate-400 font-mono italic pt-0.5">
                Draft Context: "{claim.draftContext}"
              </div>
            </div>

            {/* Document Header Details */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400">
                    Document Title & Classification
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    {artifact.documentTitle}
                  </h3>
                  <div className="text-xs text-indigo-400 font-mono">
                    Type: {artifact.documentType}
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono text-xs">
                  <span className="text-slate-400 text-[10px] block uppercase">Reference Code</span>
                  <span className="text-slate-200 font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded inline-block mt-0.5">
                    {artifact.referenceCode}
                  </span>
                </div>
              </div>

              {/* Issuer & Validity Horizon Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Issuing Authority / Firm
                  </span>
                  <span className="text-slate-200 font-medium">{artifact.issuerOrFirm}</span>
                </div>

                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Assigned Owner
                  </span>
                  <span className="text-slate-200 font-mono text-[11px]">{claim.owner}</span>
                </div>

                <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Validity Horizon
                  </span>
                  <span className="text-slate-200 font-mono text-[11px]">
                    Issued: {claim.evidenceDate} · Expires: {claim.expiryDate}
                  </span>
                </div>
              </div>

              {/* Citation */}
              <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Citation Reference:
                </span>
                <span className="text-slate-300 font-mono text-[11px]">{claim.evidenceCitation}</span>
              </div>
            </div>

            {/* Document Abstract & Clauses/Exhibits */}
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
              <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold tracking-wider block">
                Archived Document Summary & Exhibits
              </span>

              <p className="text-xs text-slate-300 leading-relaxed">
                {artifact.abstract}
              </p>

              {artifact.clausesOrExhibits && artifact.clausesOrExhibits.length > 0 && (
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Extracted Contractual Clauses & Benchmark Exhibits:
                  </span>
                  <div className="space-y-2">
                    {artifact.clausesOrExhibits.map((clause, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border text-xs space-y-1 ${
                          clause.highlight
                            ? 'bg-slate-900/90 border-indigo-900/60'
                            : 'bg-slate-900/50 border-slate-800'
                        }`}
                      >
                        <div className="font-mono font-semibold text-[11px] text-indigo-300">
                          {clause.title}
                        </div>
                        <p className="text-slate-300 font-sans text-[11px] leading-relaxed">
                          "{clause.content}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Support Assessment Callout (Explains how it supports or contradicts claim) */}
            <div
              className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                claim.status === 'Verified'
                  ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-200'
                  : claim.status === 'Expired Evidence'
                  ? 'bg-amber-950/20 border-amber-900/50 text-amber-200'
                  : 'bg-rose-950/20 border-rose-900/50 text-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-mono font-bold uppercase text-[11px]">
                <Info className="w-3.5 h-3.5" />
                <span>Governance Support Assessment:</span>
              </div>
              <p className="leading-relaxed text-[12px]">
                {artifact.supportAssessment}
              </p>
            </div>

            {/* Network / External URL Section */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Archive Location:
                </span>
                <span className="font-mono text-slate-400 text-[11px] truncate block max-w-md">
                  {claim.evidenceLink}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Internal enterprise reference — rendered securely in-app
                </span>
              </div>

              {hasGenuineExternalUrl && (
                <a
                  href={artifact.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shrink-0 shadow-sm"
                >
                  <span>Open Official External Standard</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ) : (
          /* Edit Metadata Mode */
          <form onSubmit={handleSaveMetadata} className="space-y-4">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
              <strong className="text-white">Editing Demo Evidence Metadata:</strong> Updates will be saved to your local session state. Saving new evidence details does not automatically change a claim's verification status.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Document Title:
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Document Type:
                </label>
                <input
                  type="text"
                  required
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Issuing Authority / Firm:
                </label>
                <input
                  type="text"
                  required
                  value={editIssuer}
                  onChange={(e) => setEditIssuer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Reference Code:
                </label>
                <input
                  type="text"
                  required
                  value={editRefCode}
                  onChange={(e) => setEditRefCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Citation Reference:
              </label>
              <input
                type="text"
                required
                value={editCitation}
                onChange={(e) => setEditCitation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Issue / Audit Date:
                </label>
                <input
                  type="date"
                  required
                  value={editEvidenceDate}
                  onChange={(e) => setEditEvidenceDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                  Expiry Date:
                </label>
                <input
                  type="date"
                  required
                  value={editExpiryDate}
                  onChange={(e) => setEditExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Document Summary & Abstract:
              </label>
              <textarea
                rows={3}
                required
                value={editAbstract}
                onChange={(e) => setEditAbstract(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                Support Assessment (How it evaluates the claim):
              </label>
              <textarea
                rows={3}
                required
                value={editAssessment}
                onChange={(e) => setEditAssessment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Evidence Metadata</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono">
            Canon Pre-Publication Review & Verification Matrix
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
