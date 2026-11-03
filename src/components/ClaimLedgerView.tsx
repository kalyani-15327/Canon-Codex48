import React, { useState } from 'react';
import { ClaimCategory, ClaimItem, ClaimVerificationStatus } from '../types';
import {
  Scale,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  AlertOctagon,
  Clock,
  PlusCircle,
  ExternalLink,
  Search,
  UserCheck,
  Send,
  Eye,
  FileText,
  Filter,
  ClipboardList,
  FileEdit,
  Sparkles,
} from 'lucide-react';

export type ClaimLedgerFilter =
  | 'All claims'
  | 'Current content'
  | 'Verified'
  | 'Unsupported'
  | 'Needs Verification'
  | 'Expired Evidence'
  | 'Pending Review';

interface ClaimLedgerViewProps {
  claims: ClaimItem[];
  currentContentId?: string;
  currentContentTitle?: string;
  onOpenEscalateModal: (claim: ClaimItem) => void;
  onOpenAddFactModal: () => void;
  onInspectClaim: (claim: ClaimItem) => void;
  onVerifyClaimQuick: (claimId: string) => void;
  onRevokeVerification: (claimId: string, reason?: string) => void;
  onOpenEvidencePreview: (claim: ClaimItem) => void;
  onNavigateToWatch?: (factCode?: string) => void;
  onNavigateToAuditLog?: (claimId?: string) => void;
  onNavigateToSource?: (contentId?: string, claimText?: string) => void;
  onReturnToContentReview?: () => void;
}

export const ClaimLedgerView: React.FC<ClaimLedgerViewProps> = ({
  claims,
  currentContentId,
  currentContentTitle,
  onOpenEscalateModal,
  onOpenAddFactModal,
  onInspectClaim,
  onVerifyClaimQuick,
  onRevokeVerification,
  onOpenEvidencePreview,
  onNavigateToWatch,
  onNavigateToAuditLog,
  onNavigateToSource,
  onReturnToContentReview,
}) => {
  const [statusFilter, setStatusFilter] = useState<ClaimLedgerFilter>('All claims');
  const [documentFilter, setDocumentFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getStatusBadge = (status: ClaimVerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Verified
          </span>
        );
      case 'Expired Evidence':
        return (
          <span className="text-[11px] font-mono font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3 text-amber-400" />
            Expired Evidence
          </span>
        );
      case 'Unsupported':
        return (
          <span className="text-[11px] font-mono font-medium text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
            <AlertOctagon className="w-3 h-3 text-rose-400" />
            Unsupported
          </span>
        );
      case 'Needs Verification':
        return (
          <span className="text-[11px] font-mono font-medium text-purple-400 bg-purple-950/60 border border-purple-800/80 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3 text-purple-400" />
            Needs Verification
          </span>
        );
      case 'Under Legal Review':
      case 'Pending Specialist Review':
        return (
          <span className="text-[11px] font-mono font-medium text-sky-400 bg-sky-950/60 border border-sky-800/80 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
            <UserCheck className="w-3 h-3 text-sky-400" />
            Pending Review
          </span>
        );
    }
  };

  const getRiskBadge = (risk: 'Critical' | 'Moderate' | 'Low') => {
    switch (risk) {
      case 'Critical':
        return <span className="text-[10px] font-mono text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-900/50">Critical Risk</span>;
      case 'Moderate':
        return <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-900/50">Moderate Risk</span>;
      case 'Low':
        return <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Low Risk</span>;
    }
  };

  // Unique document titles for document filter dropdown
  const uniqueDocTitles = Array.from(
    new Set(claims.map((c) => c.contentTitle).filter(Boolean) as string[])
  );

  // Compute counts for all 7 filters
  const currentContentCount = claims.filter(
    (c) => c.contentId === currentContentId && c.isActive !== false
  ).length;
  const verifiedCount = claims.filter((c) => c.status === 'Verified').length;
  const unsupportedCount = claims.filter((c) => c.status === 'Unsupported').length;
  const needsVerificationCount = claims.filter((c) => c.status === 'Needs Verification').length;
  const expiredCount = claims.filter((c) => c.status === 'Expired Evidence').length;
  const pendingReviewCount = claims.filter(
    (c) => c.status === 'Under Legal Review' || c.status === 'Pending Specialist Review'
  ).length;

  const filteredClaims = claims.filter((claim) => {
    // 7 Required Filters
    if (statusFilter === 'Current content') {
      if (claim.contentId !== currentContentId) return false;
      if (claim.isActive === false) return false;
    } else if (statusFilter === 'Verified') {
      if (claim.status !== 'Verified') return false;
    } else if (statusFilter === 'Unsupported') {
      if (claim.status !== 'Unsupported') return false;
    } else if (statusFilter === 'Needs Verification') {
      if (claim.status !== 'Needs Verification') return false;
    } else if (statusFilter === 'Expired Evidence') {
      if (claim.status !== 'Expired Evidence') return false;
    } else if (statusFilter === 'Pending Review') {
      if (claim.status !== 'Under Legal Review' && claim.status !== 'Pending Specialist Review')
        return false;
    }

    // Document Filter (from select dropdown)
    if (documentFilter !== 'All' && claim.contentTitle !== documentFilter) return false;

    // Category filter
    if (categoryFilter !== 'All' && claim.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        claim.claimText.toLowerCase().includes(q) ||
        claim.owner.toLowerCase().includes(q) ||
        claim.evidenceCitation.toLowerCase().includes(q) ||
        (claim.contentTitle && claim.contentTitle.toLowerCase().includes(q)) ||
        (claim.statusReason && claim.statusReason.toLowerCase().includes(q)) ||
        (claim.supportingFactCode && claim.supportingFactCode.toLowerCase().includes(q));
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Summary Stats */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-semibold text-white tracking-tight">
                Claim Ledger & Verification Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Factual & promotional claim governance with auditable cryptographic certificates and lab benchmark recency
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddFactModal}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Add Approved Fact
            </button>
          </div>
        </div>

        {/* Dynamic Context Banner for Current Content */}
        {currentContentTitle && (
          <div className="mt-4 p-3.5 bg-indigo-950/40 border border-indigo-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded bg-indigo-900/50 text-indigo-400">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-2">
                  <span>Currently Auditing: {currentContentTitle}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-300">
                    {currentContentCount} Active Claims
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Claims extracted from active working draft in Content Auditor & evaluated against approved facts
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {statusFilter !== 'Current content' && (
                <button
                  type="button"
                  onClick={() => setStatusFilter('Current content')}
                  className="px-2.5 py-1 text-xs font-medium text-indigo-300 hover:text-white bg-indigo-900/50 hover:bg-indigo-900/80 border border-indigo-800/60 rounded-lg transition-colors cursor-pointer"
                >
                  Filter to Current Content
                </button>
              )}
              {onReturnToContentReview && (
                <button
                  type="button"
                  onClick={onReturnToContentReview}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Return to Content Review</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Status Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Total Claims</span>
            <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
              {claims.length}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-indigo-400 uppercase">Current Content</span>
            <div className="text-xl font-bold font-mono text-indigo-400 tabular-nums mt-0.5">
              {currentContentCount}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Verified</span>
            <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
              {verifiedCount}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-rose-400 uppercase">Unsupported</span>
            <div className="text-xl font-bold font-mono text-rose-400 tabular-nums mt-0.5">
              {unsupportedCount}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-purple-400 uppercase">Needs Verification</span>
            <div className="text-xl font-bold font-mono text-purple-400 tabular-nums mt-0.5">
              {needsVerificationCount}
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <span className="text-[10px] font-mono text-amber-400 uppercase">Expired Evidence</span>
            <div className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-0.5">
              {expiredCount}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm space-y-3">
        {/* 7 Required Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs">
          {(
            [
              { label: 'All claims', count: claims.length },
              { label: 'Current content', count: currentContentCount },
              { label: 'Verified', count: verifiedCount },
              { label: 'Unsupported', count: unsupportedCount },
              { label: 'Needs Verification', count: needsVerificationCount },
              { label: 'Expired Evidence', count: expiredCount },
              { label: 'Pending Review', count: pendingReviewCount },
            ] as const
          ).map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatusFilter(tab.label)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                statusFilter === tab.label
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Document, Category & Search Inputs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Document Filter */}
            <select
              value={documentFilter}
              onChange={(e) => setDocumentFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 max-w-xs truncate"
            >
              <option value="All">All Associated Documents</option>
              {uniqueDocTitles.map((title) => (
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Security">Security</option>
              <option value="Performance">Performance</option>
              <option value="Financial">Financial / Regulatory</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Market Share">Market Share</option>
            </select>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search claims, owner, citations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 w-full md:w-64"
            />
          </div>
        </div>
      </div>

      {/* High-Density Claims Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-3 px-4 font-semibold">Claim Text & Context</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Verification Status</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap">Assigned Owner</th>
                <th className="py-3 px-4 font-semibold">Evidence Link / Citation</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap text-right">Expiry Date</th>
                <th className="py-3 px-4 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No claims match the selected filters or search query.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Claim Text & Context */}
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-slate-100 text-xs leading-relaxed">
                            "{claim.claimText}"
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-900/50">
                            {claim.category}
                          </span>
                          {getRiskBadge(claim.riskLevel)}

                          {/* Source Document Tag */}
                          <span className="text-[10px] font-mono text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 max-w-[200px] truncate" title={claim.contentTitle || 'Corporate Draft'}>
                            Doc: {claim.contentTitle || 'Corporate Draft'}
                          </span>

                          {/* Active vs Historical Tag */}
                          {claim.isActive === false ? (
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-800/80">
                              Historical (Removed from latest)
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-900/50">
                              Active (v{claim.auditVersion || 1})
                            </span>
                          )}

                          {/* Approved Fact Linkage */}
                          {claim.supportingFactCode && (
                            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/80">
                              Fact: {claim.supportingFactCode} {claim.supportingFactValue ? `(${claim.supportingFactValue})` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status & Verification Reason */}
                    <td className="py-3.5 px-4 align-top max-w-xs">
                      {getStatusBadge(claim.status)}
                      {claim.statusReason && (
                        <p className="text-[11px] text-slate-400 font-mono mt-1.5 leading-snug line-clamp-2">
                          {claim.statusReason}
                        </p>
                      )}
                      {claim.escalation && (
                        <div className="text-[10px] text-sky-400 font-mono mt-1 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Escalated to {claim.escalation.specialist}</span>
                        </div>
                      )}
                    </td>

                    {/* Assigned Owner */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-top text-slate-300 font-mono text-[11px]">
                      {claim.owner}
                    </td>

                    {/* Evidence Link / Citation */}
                    <td className="py-3.5 px-4 max-w-xs align-top">
                      <div className="space-y-1">
                        <div className="text-slate-300 line-clamp-2">
                          {claim.evidenceCitation}
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenEvidencePreview(claim)}
                          className="inline-flex items-center gap-1.5 text-[11px] text-indigo-400 hover:text-indigo-300 font-mono cursor-pointer transition-colors group text-left"
                          title="Open in-app evidence & certificate preview"
                        >
                          <FileText className="w-3.5 h-3.5 text-indigo-400 group-hover:text-indigo-300 shrink-0" />
                          <span className="underline decoration-indigo-500/50 group-hover:decoration-indigo-300">
                            Certificate / Artifact
                          </span>
                        </button>
                      </div>
                    </td>

                    {/* Expiry Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-top text-right font-mono text-[11px]">
                      <span
                        className={
                          claim.status === 'Expired Evidence'
                            ? 'text-amber-400 font-semibold'
                            : 'text-slate-400'
                        }
                      >
                        {claim.expiryDate}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 whitespace-nowrap align-top text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenEvidencePreview(claim)}
                          title="Open evidence artifact & certificate preview"
                          className="p-1.5 text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 rounded-md transition-colors border border-indigo-800/80 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onInspectClaim(claim)}
                          title="Inspect supporting evidence and history"
                          className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {claim.status !== 'Verified' ? (
                          <button
                            onClick={() => onVerifyClaimQuick(claim.id)}
                            title="Quick verify with latest SOC2 / FIPS certificate"
                            className="p-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 rounded-md transition-colors border border-emerald-800/80 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              let confirmed = false;
                              try {
                                if (
                                  typeof window !== 'undefined' &&
                                  typeof window.confirm === 'function'
                                ) {
                                  confirmed = window.confirm(
                                    `Are you sure you want to revoke verification for claim [${claim.id}]?\n\n"${claim.claimText}"\n\nThis will change its status to Unsupported.`
                                  );
                                }
                              } catch {
                                // sandbox restricted
                              }

                              if (confirmed) {
                                onRevokeVerification(claim.id);
                              } else {
                                // Fallback for sandboxed iframes without window.confirm modal permission:
                                // Opens the Claim Verification Matrix & Evidence Record modal to confirm in-app!
                                onInspectClaim(claim);
                              }
                            }}
                            title="Revoke Verification"
                            className="p-1.5 text-rose-400 hover:text-rose-300 bg-rose-950/60 hover:bg-rose-900/80 rounded-md transition-colors border border-rose-800/80 cursor-pointer"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onOpenEscalateModal(claim)}
                          title="Escalate to Legal or Compliance Specialist"
                          className="p-1.5 text-sky-400 hover:text-sky-300 bg-sky-950/60 hover:bg-sky-900/80 rounded-md transition-colors border border-sky-800/80 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>

                        {onNavigateToSource && (
                          <button
                            type="button"
                            onClick={() => onNavigateToSource(claim.contentId, claim.claimText)}
                            title="Navigate to Source Content in Content Auditor"
                            className="p-1.5 text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 rounded-md transition-colors border border-indigo-800/80 cursor-pointer"
                          >
                            <FileEdit className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {onNavigateToWatch && (
                          <button
                            type="button"
                            onClick={() => onNavigateToWatch(claim.id)}
                            title="View published collateral in Canon Watch"
                            className="p-1.5 text-sky-400 hover:text-sky-300 bg-sky-950/40 hover:bg-sky-900/60 rounded-md transition-colors border border-sky-800/60 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {onNavigateToAuditLog && (
                          <button
                            type="button"
                            onClick={() => onNavigateToAuditLog(claim.id)}
                            title="Inspect complete lifecycle in Audit Trail"
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700 cursor-pointer"
                          >
                            <ClipboardList className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
