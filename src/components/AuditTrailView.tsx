import React, { useState } from 'react';
import { AuditLogEntry, TeamMember } from '../types';
import {
  ClipboardList,
  UserCheck,
  ShieldAlert,
  Sparkles,
  GitBranch,
  Scale,
  FileSignature,
  Download,
  Printer,
  Search,
  Filter,
  Plus,
  Minus,
  FileText,
  RotateCcw,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLogEntry[];
  teamMembers: TeamMember[];
  onUpdateTeamMemberReviews: (id: string, delta: number) => void;
  onOpenExportModal: () => void;
  onExportJSON: () => void;
  onExportPDF: () => void;
  isGeneratingPDF?: boolean;
  onNavigateToRelated?: (relatedId: string, category: string) => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  logs,
  teamMembers,
  onUpdateTeamMemberReviews,
  onOpenExportModal,
  onExportJSON,
  onExportPDF,
  isGeneratingPDF = false,
  onNavigateToRelated,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCategoryBadge = (category: AuditLogEntry['category']) => {
    switch (category) {
      case 'Correction':
        return (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Correction
          </span>
        );
      case 'Override':
        return (
          <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-900 px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5" /> Override
          </span>
        );
      case 'Claim Escalation':
        return (
          <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-900 px-2 py-0.5 rounded flex items-center gap-1">
            <Scale className="w-2.5 h-2.5" /> Claim Escalation
          </span>
        );
      case 'Guideline Update':
        return (
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-900 px-2 py-0.5 rounded flex items-center gap-1">
            <ClipboardList className="w-2.5 h-2.5" /> Guideline Update
          </span>
        );
      case 'CI Simulation':
        return (
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-900 px-2 py-0.5 rounded flex items-center gap-1">
            <GitBranch className="w-2.5 h-2.5" /> CI Simulation
          </span>
        );
      case 'Publication Sign-off':
        return (
          <span className="text-[10px] font-mono text-teal-400 bg-teal-950/60 border border-teal-900 px-2 py-0.5 rounded flex items-center gap-1">
            <FileSignature className="w-2.5 h-2.5" /> Sign-off
          </span>
        );
      case 'Evidence Update':
        return (
          <span className="text-[10px] font-mono text-violet-400 bg-violet-950/60 border border-violet-900 px-2 py-0.5 rounded flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" /> Evidence
          </span>
        );
      case 'Canon Gateway':
        return (
          <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-900 px-2 py-0.5 rounded flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> Canon Gateway
          </span>
        );
      case 'Canon Watch':
        return (
          <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-900 px-2 py-0.5 rounded flex items-center gap-1">
            <Eye className="w-2.5 h-2.5" /> Canon Watch
          </span>
        );
      case 'Format Adapter':
        return (
          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-900 px-2 py-0.5 rounded flex items-center gap-1">
            <FileText className="w-2.5 h-2.5" /> Format Adapter
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
            {category}
          </span>
        );
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (selectedCategory !== 'All' && log.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Team Contribution Ledger */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                Team Governance Contribution Ledger
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Departmental roles, review participation volumes, and override authorization rights
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct PDF Download button */}
            <button
              onClick={onExportPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isGeneratingPDF ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Executive Report (PDF)</span>
                </>
              )}
            </button>

            {/* Preview Certificate in modal */}
            <button
              onClick={onOpenExportModal}
              className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Preview Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-slate-950/70 rounded-lg border border-slate-800 p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-xs font-mono font-bold text-indigo-300">
                    {member.avatarInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-white truncate">
                      {member.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">
                      {member.role}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-500">
                  {member.department}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Permission:</span>
                  <span className="font-mono text-[10px] text-indigo-400 bg-indigo-950/60 border border-indigo-900/60 px-1.5 py-0.2 rounded">
                    {member.permissionLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Approved Overrides:</span>
                  <span className="font-mono tabular-nums text-slate-200">
                    {member.overridesApproved}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Reviews Completed:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateTeamMemberReviews(member.id, -1)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
                      title="Decrement"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="font-mono tabular-nums text-white font-semibold min-w-6 text-center">
                      {member.reviewsCompleted}
                    </span>
                    <button
                      onClick={() => onUpdateTeamMemberReviews(member.id, 1)}
                      className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
                      title="Increment"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological Audit Trail */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                Pre-Publication Governance Audit Trail ({logs.length})
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Immutable ledger of automated scans, applied fixes, legal overrides, escalations, and CI test executions
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Primary Action Button: Download Audit Trail (PDF) */}
            <button
              onClick={onExportJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm cursor-pointer"
              title="Download audit trail PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Audit Trail (PDF)</span>
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 w-56"
              />
            </div>
          </div>
        </div>

        {/* Category Filter bar */}
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          <span className="text-xs text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {[
            'All',
            'Correction',
            'Override',
            'Claim Escalation',
            'Guideline Update',
            'CI Simulation',
            'Publication Sign-off',
            'Canon Gateway',
            'Canon Watch',
            'Format Adapter',
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/40">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">User / Author</th>
                <th className="py-2.5 px-3">Audit Details & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-200 whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {getCategoryBadge(log.category)}
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="py-3 px-3 text-slate-300 leading-relaxed max-w-xl">
                    <div>{log.details}</div>
                    {log.relatedId && (
                      <div className="mt-1">
                        {onNavigateToRelated ? (
                          <button
                            type="button"
                            onClick={() => onNavigateToRelated(log.relatedId!, log.category)}
                            className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 px-1.5 py-0.5 rounded border border-indigo-800/60 inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Ref: {log.relatedId}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-indigo-400/80 bg-indigo-950/40 px-1.5 py-0.5 rounded border border-indigo-900/40">
                            Ref: {log.relatedId}
                          </span>
                        )}
                      </div>
                    )}
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
