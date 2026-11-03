import React, { useState } from 'react';
import { AuditFinding, FindingCategory, SeverityLevel } from '../types';
import {
  AlertTriangle,
  CheckCircle,
  FileCheck2,
  Filter,
  ShieldAlert,
  Sparkles,
  Volume2,
  BookOpen,
  Eye,
  Accessibility,
  Scale,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface AuditFindingsListProps {
  findings: AuditFinding[];
  onApplyFix: (finding: AuditFinding) => void;
  onOpenOverrideModal: (finding: AuditFinding) => void;
  onReviewClaim?: (finding: AuditFinding) => void;
  onViewGuideline?: (guidelineRef: string) => void;
  onViewAuditHistory?: () => void;
}

export const AuditFindingsList: React.FC<AuditFindingsListProps> = ({
  findings,
  onApplyFix,
  onOpenOverrideModal,
  onReviewClaim,
  onViewGuideline,
  onViewAuditHistory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'detected' | 'fixed' | 'overridden'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories: FindingCategory[] = [
    'Tone & Voice',
    'Terminology',
    'Core Messaging',
    'Visuals',
    'Accessibility',
    'Claims',
  ];

  const getCategoryIcon = (category: FindingCategory) => {
    switch (category) {
      case 'Tone & Voice':
        return <Volume2 className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Terminology':
        return <BookOpen className="w-3.5 h-3.5 text-sky-400" />;
      case 'Core Messaging':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
      case 'Visuals':
        return <Eye className="w-3.5 h-3.5 text-amber-400" />;
      case 'Accessibility':
        return <Accessibility className="w-3.5 h-3.5 text-teal-400" />;
      case 'Claims':
        return <Scale className="w-3.5 h-3.5 text-rose-400" />;
    }
  };

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'High':
        return (
          <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="text-[11px] font-mono text-slate-300 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">
            Low
          </span>
        );
    }
  };

  const filteredFindings = findings.filter((f) => {
    if (selectedCategory !== 'all' && f.category !== selectedCategory) return false;
    if (selectedSeverity !== 'all' && f.severity !== selectedSeverity) return false;
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 space-y-4 shadow-sm">
      {/* Header and filter bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Brand Governance Findings ({findings.length})
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Automated compliance evaluation against active corporate guidelines & legal standards
          </p>
        </div>

        {/* Category & Status Filter segmented buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'all' ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({findings.length})
            </button>
            <button
              onClick={() => setStatusFilter('detected')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'detected'
                  ? 'bg-rose-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active ({findings.filter((f) => f.status === 'detected').length})
            </button>
            <button
              onClick={() => setStatusFilter('fixed')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'fixed'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Fixed ({findings.filter((f) => f.status === 'fixed').length})
            </button>
            <button
              onClick={() => setStatusFilter('overridden')}
              className={`px-2.5 py-1 rounded transition-colors ${
                statusFilter === 'overridden'
                  ? 'bg-amber-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overridden ({findings.filter((f) => f.status === 'overridden').length})
            </button>
          </div>
        </div>
      </div>

      {/* Category Pills / Filter Strip */}
      <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Filter:
        </span>
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {getCategoryIcon(cat)}
            <span>{cat}</span>
            <span className="font-mono text-[10px] text-slate-500">
              ({findings.filter((f) => f.category === cat).length})
            </span>
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="space-y-3 pt-1">
        {filteredFindings.length === 0 ? (
          <div className="p-8 text-center bg-slate-950/40 rounded-lg border border-slate-800/60">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-medium text-slate-300">No matching findings in this view</p>
            <p className="text-xs text-slate-500 mt-1">
              All rules in this category have either been resolved, overridden, or conform to governance policies.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => {
            const isExpanded = expandedId === finding.id;
            const isResolved = finding.status === 'fixed';
            const isOverridden = finding.status === 'overridden';

            return (
              <div
                key={finding.id}
                className={`rounded-lg border transition-all ${
                  isResolved
                    ? 'bg-slate-950/30 border-emerald-900/30 opacity-75'
                    : isOverridden
                    ? 'bg-slate-950/40 border-amber-900/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Finding Header */}
                <div
                  onClick={() => toggleExpand(finding.id)}
                  className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="p-1 rounded bg-slate-900 border border-slate-800 mt-0.5">
                      {getCategoryIcon(finding.category)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-white tracking-tight">
                          {finding.title}
                        </span>
                        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-1.5 py-0.2 rounded">
                          {finding.guidelineRef}
                        </span>
                        {getSeverityBadge(finding.severity)}

                        {isResolved && (
                          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Fixed
                          </span>
                        )}

                        {isOverridden && (
                          <span className="text-[11px] font-mono text-amber-400 bg-amber-950/50 border border-amber-800/60 px-2 py-0.5 rounded flex items-center gap-1">
                            Overridden
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        {finding.explanation}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {finding.status === 'detected' && (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onApplyFix(finding)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-800/70 rounded-md transition-colors shadow-sm"
                        >
                          <Sparkles className="w-3 h-3" />
                          Apply Fix
                        </button>
                        <button
                          onClick={() => onOpenOverrideModal(finding)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                        >
                          Override
                        </button>
                      </div>
                    )}

                    <button className="text-slate-400 hover:text-slate-200 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 space-y-3 border-t border-slate-800/60 text-xs">
                    {/* Detected segment vs Suggested replacement */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded bg-rose-950/20 border border-rose-900/30 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold">
                          Detected Non-Compliant Segment:
                        </span>
                        <p className="text-slate-300 font-mono text-[12px] leading-relaxed">
                          "{finding.originalSegment}"
                        </p>
                      </div>

                      <div className="p-3 rounded bg-emerald-950/20 border border-emerald-900/30 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold">
                          Recommended Compliant Replacement:
                        </span>
                        <p className="text-slate-200 font-mono text-[12px] leading-relaxed">
                          "{finding.suggestedFix}"
                        </p>
                      </div>
                    </div>

                    {/* Policy Explanation */}
                    <div className="bg-slate-900 p-3 rounded border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-indigo-400 font-semibold">
                        Guideline & Legal Policy Rationale:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {finding.explanation}
                      </p>
                    </div>

                    {/* Override detail if present */}
                    {isOverridden && finding.overrideReason && (
                      <div className="bg-amber-950/20 p-3 rounded border border-amber-900/40 text-amber-300 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold">
                          Override Justification:
                        </span>
                        <p className="text-amber-200">
                          {finding.overrideReason}
                        </p>
                        <div className="text-[11px] text-amber-400/80 font-mono pt-1">
                          Approved by {finding.overriddenBy || 'Beatrix Holzer (Legal)'} at{' '}
                          {finding.overriddenAt || '2026-10-24 09:35'}
                        </div>
                      </div>
                    )}

                    {/* Contextual Cross-Tab Navigation Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60">
                      <div className="flex flex-wrap items-center gap-2">
                        {onViewGuideline && finding.guidelineRef && (
                          <button
                            type="button"
                            onClick={() => onViewGuideline(finding.guidelineRef)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900 border border-indigo-800/70 rounded-md transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>View Rule in Guideline Health & CI &rarr;</span>
                          </button>
                        )}

                        {(finding.category === 'Claims' ||
                          finding.guidelineRef.startsWith('RULE-CLM') ||
                          finding.guidelineRef.startsWith('RULE-FIN') ||
                          finding.guidelineRef.startsWith('RULE-FEE') ||
                          finding.guidelineRef.startsWith('RULE-SEC')) &&
                          onReviewClaim && (
                            <button
                              type="button"
                              onClick={() => onReviewClaim(finding)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-sky-300 hover:text-white bg-sky-950/60 hover:bg-sky-900 border border-sky-800/70 rounded-md transition-colors cursor-pointer"
                            >
                              <Scale className="w-3 h-3" />
                              <span>Review in Claim Ledger &rarr;</span>
                            </button>
                          )}
                      </div>

                      {onViewAuditHistory && (
                        <button
                          type="button"
                          onClick={onViewAuditHistory}
                          className="text-[11px] font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer"
                        >
                          View in Audit Trail &rarr;
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
