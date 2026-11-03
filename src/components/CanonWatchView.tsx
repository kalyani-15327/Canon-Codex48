import React, { useState, useEffect, useMemo } from 'react';
import {
  ApprovedFact,
  AuditLogEntry,
  WatchContentItem,
  WatchContentStatus,
  SeverityLevel,
} from '../../types';
import { INITIAL_WATCH_ITEMS } from '../../services/seedData';
import { generateWordDiff } from '../../services/auditEngine';
import {
  Eye,
  AlertTriangle,
  CheckCircle,
  FileText,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
  Filter,
  Layers,
  Edit3,
  XCircle,
  Check,
  Tag,
  DollarSign,
  TrendingDown,
  Info,
} from 'lucide-react';

interface CanonWatchViewProps {
  approvedFacts: ApprovedFact[];
  onUpdateApprovedFact: (factId: string, newValue: string, notes?: string) => void;
  onRecordAuditLog: (
    action: string,
    category: AuditLogEntry['category'],
    details: string,
    relatedId?: string
  ) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
  onSendToAuditor?: (
    text: string,
    meta?: { contentId?: string; source?: string; sourceTitle?: string; sourceContext?: string }
  ) => void;
}

export const CanonWatchView: React.FC<CanonWatchViewProps> = ({
  approvedFacts,
  onUpdateApprovedFact,
  onRecordAuditLog,
  showToast,
  onSendToAuditor,
}) => {
  const STORAGE_KEY = 'canon_watch_registry_v1';

  // Stored registry items
  const [contentItems, setContentItems] = useState<WatchContentItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_WATCH_ITEMS;
  });

  // Selected item for Suggest Correction / Comparison Modal
  const [inspectingItem, setInspectingItem] = useState<WatchContentItem | null>(null);
  const [editingCorrectionText, setEditingCorrectionText] = useState<string>('');
  const [isEditingCorrection, setIsEditingCorrection] = useState<boolean>(false);
  const [rejectReasonInput, setRejectReasonInput] = useState<string>('');
  const [showRejectDialog, setShowRejectDialog] = useState<boolean>(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist registry
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentItems));
  }, [contentItems]);

  // Price Fact Helper
  const priceFact = useMemo(() => {
    return approvedFacts.find((f) => f.code === 'FACT-PRICE-01');
  }, [approvedFacts]);

  // Re-evaluate registry content when approved facts change
  useEffect(() => {
    if (!priceFact) return;

    setContentItems((prevItems) => {
      let hasChanges = false;
      const updated = prevItems.map((item) => {
        // Check if item contains superseded price (e.g. ₹50,000 when fact is ₹25,000)
        if (priceFact.value === '₹25,000' && item.content.includes('₹50,000')) {
          if (item.status !== 'Approved Update') {
            hasChanges = true;
            const updatedCorrection = item.content.replace(/₹50,000/g, '₹25,000');
            return {
              ...item,
              status: 'Flagged: Outdated Content' as WatchContentStatus,
              severity: 'High' as SeverityLevel,
              flagReason:
                'Linked Fact FACT-PRICE-01 updated from ₹50,000 to ₹25,000. Content contains superseded price "₹50,000".',
              suggestedCorrection: {
                targetFactCode: 'FACT-PRICE-01',
                oldValue: '₹50,000',
                newValue: '₹25,000',
                updatedText: updatedCorrection,
                explanation:
                  'Updates commercial enterprise license price from ₹50,000 to active approved rate of ₹25,000.',
              },
            };
          }
        } else if (priceFact.value === '₹50,000' && item.suggestedCorrection?.oldValue === '₹50,000') {
          // If fact reverted to ₹50,000, clear flag if not expired
          if (!item.linkedFactCodes.includes('FACT-EXP-01')) {
            hasChanges = true;
            return {
              ...item,
              status: 'Active / Published' as WatchContentStatus,
              severity: 'Low' as SeverityLevel,
              flagReason: undefined,
              suggestedCorrection: undefined,
            };
          }
        }
        return item;
      });

      return hasChanges ? updated : prevItems;
    });
  }, [priceFact]);

  // Toggle Price Simulation (₹50,000 <-> ₹25,000)
  const handleTogglePriceFact = () => {
    if (!priceFact) return;
    const isCurrently50k = priceFact.value === '₹50,000';
    const targetValue = isCurrently50k ? '₹25,000' : '₹50,000';

    onUpdateApprovedFact(
      priceFact.id,
      targetValue,
      `Price updated from ${priceFact.value} to ${targetValue} in commercial schedule.`
    );

    showToast(
      `Fact FACT-PRICE-01 updated to ${targetValue}! Canon Watch is scanning stored content...`,
      'success'
    );

    onRecordAuditLog(
      'Approved Fact Value Changed',
      'Canon Watch',
      `Fact FACT-PRICE-01 (Enterprise Annual License) updated from ${priceFact.value} to ${targetValue}. Canon Watch detected affected post-publication assets.`,
      priceFact.id
    );
  };

  // Open Suggest Correction Modal
  const handleOpenSuggestCorrection = (item: WatchContentItem) => {
    setInspectingItem(item);
    setEditingCorrectionText(item.suggestedCorrection?.updatedText || item.content);
    setIsEditingCorrection(false);
    setShowRejectDialog(false);
    setRejectReasonInput('');
  };

  // Accept Proposed Correction
  const handleAcceptCorrection = (item: WatchContentItem) => {
    const textToApply = isEditingCorrection
      ? editingCorrectionText
      : item.suggestedCorrection?.updatedText || item.content;

    const reviewerName = 'Beatrix Holzer (Legal & Brand Governance)';
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 10);

    const updatedItems = contentItems.map((ci) => {
      if (ci.id === item.id) {
        return {
          ...ci,
          content: textToApply,
          status: 'Approved Update' as WatchContentStatus,
          severity: 'Low' as SeverityLevel,
          lastReviewDate: timestamp,
          reviewer: reviewerName,
          flagReason: undefined,
          suggestedCorrection: undefined,
        };
      }
      return ci;
    });

    setContentItems(updatedItems);
    setInspectingItem(null);

    showToast(`Correction accepted and updated for "${item.title.slice(0, 35)}..."!`, 'success');
    onRecordAuditLog(
      'Canon Watch: Correction Accepted & Approved',
      'Canon Watch',
      `Reviewer approved updated copy for "${item.title}". Superseded content replaced with current approved facts.`,
      item.id
    );
  };

  // Reject Proposed Correction
  const handleRejectCorrection = (item: WatchContentItem) => {
    const reason = rejectReasonInput.trim() || 'Dismissed by reviewer (legacy archived material)';
    const reviewerName = 'Beatrix Holzer (Legal)';

    const updatedItems = contentItems.map((ci) => {
      if (ci.id === item.id) {
        return {
          ...ci,
          status: 'Active / Published' as WatchContentStatus,
          severity: 'Low' as SeverityLevel,
          flagReason: `Flag dismissed: ${reason}`,
          suggestedCorrection: undefined,
        };
      }
      return ci;
    });

    setContentItems(updatedItems);
    setInspectingItem(null);
    setShowRejectDialog(false);

    showToast(`Correction dismissed for "${item.title.slice(0, 35)}..."`, 'success');
    onRecordAuditLog(
      'Canon Watch: Correction Rejected / Dismissed',
      'Canon Watch',
      `Reviewer ${reviewerName} dismissed flag for "${item.title}". Reason: "${reason}".`,
      item.id
    );
  };

  // Reset Watch Demo Registry
  const handleResetRegistry = () => {
    setContentItems(INITIAL_WATCH_ITEMS);
    if (priceFact && priceFact.value !== '₹50,000') {
      onUpdateApprovedFact(priceFact.id, '₹50,000');
    }
    showToast('Reset Canon Watch content registry.', 'success');
  };

  // Computed prioritized items
  const flaggedItems = useMemo(() => {
    return contentItems.filter((i) => i.status === 'Flagged: Outdated Content');
  }, [contentItems]);

  const filteredItems = useMemo(() => {
    return contentItems.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (channelFilter !== 'All' && item.channel !== channelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.linkedFactCodes.some((code) => code.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [contentItems, statusFilter, channelFilter, searchQuery]);

  // Diff tokens for inspecting item
  const inspectDiffTokens = useMemo(() => {
    if (!inspectingItem || !inspectingItem.suggestedCorrection) return null;
    const targetText = isEditingCorrection
      ? editingCorrectionText
      : inspectingItem.suggestedCorrection.updatedText;
    return generateWordDiff(inspectingItem.content, targetText);
  }, [inspectingItem, isEditingCorrection, editingCorrectionText]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30">
                <Eye className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Canon Watch — Detect Outdated Content After Publication
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                Simulated Registry & Monitoring
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Continuous brand governance across published advertisements, landing pages, and email
              sequences. When an approved fact (such as pricing or SLA availability) changes or expires,
              Canon Watch identifies affected content, prioritizes risk, and suggests corrections before human
              approval.
            </p>
          </div>
          <button
            onClick={handleResetRegistry}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors self-start md:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Watch Data</span>
          </button>
        </div>
      </div>

      {/* Interactive Fact Simulator Card (Demonstration of price change ₹50,000 -> ₹25,000) */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">
              Approved Facts Control & Outdated Content Trigger
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Simulated Fact Mutation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Price Fact Interactive Box */}
          <div className="md:col-span-2 p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-indigo-400 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-900">
                  FACT-PRICE-01
                </span>
                <span className="text-xs font-bold text-white">
                  Fernwick Pay Enterprise Annual License
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Current Approved Value:{' '}
                <span className="text-emerald-400 font-bold font-mono text-xs">
                  {priceFact?.value || '₹50,000'}
                </span>{' '}
                · Expiry: <span className="text-slate-300 font-mono">2027-06-30</span>
              </p>
            </div>

            <button
              onClick={handleTogglePriceFact}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all shadow-sm shrink-0 ${
                priceFact?.value === '₹50,000'
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>
                {priceFact?.value === '₹50,000'
                  ? 'Update Price: ₹50,000 → ₹25,000'
                  : 'Revert Price: ₹25,000 → ₹50,000'}
              </span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400">Flagged Outdated Content</div>
              <div className="text-xl font-bold text-rose-400 mt-0.5">{flaggedItems.length}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-slate-400">Total Monitored</div>
              <div className="text-xl font-bold text-slate-200 mt-0.5">{contentItems.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Prioritized List of Affected Content (When facts change or expire) */}
      {flaggedItems.length > 0 && (
        <div className="bg-rose-950/20 border border-rose-900/60 rounded-xl p-5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-sm font-bold text-rose-200">
                Action Required: {flaggedItems.length} Content Item(s) Affected by Fact Updates
              </h3>
            </div>
            <span className="text-xs font-mono text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">
              High Priority
            </span>
          </div>
          <p className="text-xs text-rose-300/80">
            The following stored promotional materials contain outdated values or expired factual
            claims. Original content remains live and unchanged until human review approves the proposed correction.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {flaggedItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-lg bg-slate-950 border border-rose-900/70 space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-white line-clamp-1">{item.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 shrink-0">
                      {item.channel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2 italic bg-slate-900/60 p-2 rounded border border-slate-800/80">
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <div className="text-[11px] text-rose-300 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                    <span>{item.flagReason}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Last reviewed: {item.lastReviewDate} ({item.reviewer})
                  </span>
                  <button
                    onClick={() => handleOpenSuggestCorrection(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Suggest Correction</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Registry Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">Published Content Registry</h3>
            <span className="text-xs font-mono text-slate-400">
              ({filteredItems.length} of {contentItems.length} items)
            </span>
          </div>

          {/* Search & Channel Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search title, content, facts..."
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 w-44"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Flagged: Outdated Content">Flagged: Outdated</option>
              <option value="Active / Published">Active / Compliant</option>
              <option value="Approved Update">Approved Update</option>
            </select>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Channels</option>
              <option value="Digital Ad">Digital Ad</option>
              <option value="Landing Page">Landing Page</option>
              <option value="Email Campaign">Email Campaign</option>
              <option value="Product Sheet">Product Sheet</option>
            </select>
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">Title & Channel</th>
                <th className="py-2.5 px-3">Content Excerpt</th>
                <th className="py-2.5 px-3">Linked Approved Facts</th>
                <th className="py-2.5 px-3">Status & Severity</th>
                <th className="py-2.5 px-3">Last Review</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-950/40 transition-colors">
                  <td className="py-3 px-3 align-top font-medium text-white max-w-[200px]">
                    <div className="font-semibold line-clamp-1">{item.title}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.channel}</span>
                  </td>
                  <td className="py-3 px-3 align-top text-slate-300 max-w-[320px]">
                    <p className="line-clamp-2 leading-relaxed">{item.content}</p>
                    {item.flagReason && (
                      <div className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>{item.flagReason}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 align-top font-mono">
                    <div className="flex flex-wrap gap-1">
                      {item.linkedFactCodes.map((code) => {
                        const fact = approvedFacts.find((f) => f.code === code);
                        return (
                          <span
                            key={code}
                            title={fact ? `${fact.title}: ${fact.value}` : code}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-indigo-300 border border-slate-800"
                          >
                            {code}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  <td className="py-3 px-3 align-top font-mono">
                    <div className="space-y-1">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${
                          item.status === 'Flagged: Outdated Content'
                            ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                            : item.status === 'Approved Update'
                            ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                      <div className="text-[9px] text-slate-400">Severity: {item.severity}</div>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-top text-slate-400 text-[11px]">
                    <div>{item.lastReviewDate}</div>
                    <div className="text-[10px] text-slate-500">{item.reviewer}</div>
                  </td>
                  <td className="py-3 px-3 align-top text-right space-x-1.5 whitespace-nowrap">
                    {item.suggestedCorrection || item.status === 'Flagged: Outdated Content' ? (
                      <button
                        onClick={() => handleOpenSuggestCorrection(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold cursor-pointer shadow-sm"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Review Correction</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (onSendToAuditor) {
                            onSendToAuditor(item.content, {
                              contentId: item.id,
                              source: 'Canon Watch',
                              sourceTitle: item.title,
                              sourceContext: `Published Asset (${item.channel}) · Status: ${item.status}`,
                            });
                          }
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Audit</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggest Correction & Side-by-Side Before/After Comparison Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">
                    Suggested Correction & Before/After Comparison
                  </h4>
                </div>
                <p className="text-xs text-slate-400">{inspectingItem.title}</p>
              </div>
              <button
                onClick={() => setInspectingItem(null)}
                className="text-slate-400 hover:text-white text-base cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Explanation of Detected Issue */}
            {inspectingItem.flagReason && (
              <div className="p-3 bg-rose-950/30 border border-rose-900/60 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-rose-200">Issue Detected:</span>{' '}
                  {inspectingItem.flagReason}
                </div>
              </div>
            )}

            {/* Side-by-Side Before and After Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before: Original Published Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-300">Original Published Content</span>
                  <span className="text-[10px] font-mono text-slate-500">Unchanged until approved</span>
                </div>
                <div className="p-3.5 bg-slate-950 border border-rose-900/40 rounded-lg text-xs text-slate-300 leading-relaxed font-sans min-h-[120px]">
                  {inspectingItem.content}
                </div>
              </div>

              {/* After: Suggested / Edited Updated Draft */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-300">
                    Suggested Updated Draft (Active Facts)
                  </span>
                  <button
                    onClick={() => setIsEditingCorrection(!isEditingCorrection)}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
                  >
                    {isEditingCorrection ? 'Preview Comparison' : 'Edit Suggestion'}
                  </button>
                </div>
                {isEditingCorrection ? (
                  <textarea
                    rows={4}
                    value={editingCorrectionText}
                    onChange={(e) => setEditingCorrectionText(e.target.value)}
                    className="w-full p-3 bg-slate-950 border border-indigo-500/70 rounded-lg text-xs text-slate-200 leading-relaxed font-sans focus:outline-none min-h-[120px]"
                  />
                ) : (
                  <div className="p-3.5 bg-slate-950 border border-emerald-900/40 rounded-lg text-xs text-slate-200 leading-relaxed font-sans min-h-[120px]">
                    {editingCorrectionText}
                  </div>
                )}
              </div>
            </div>

            {/* Word Diff Highlight */}
            {inspectDiffTokens && (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-300">Tracked Differences</span>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300">
                  {inspectDiffTokens.map((tok, i) => {
                    if (tok.type === 'added') {
                      return (
                        <span key={i} className="bg-emerald-950 text-emerald-300 font-semibold px-1 rounded">
                          {tok.value}
                        </span>
                      );
                    }
                    if (tok.type === 'removed') {
                      return (
                        <span key={i} className="bg-rose-950/60 text-rose-400 line-through px-1 rounded">
                          {tok.value}
                        </span>
                      );
                    }
                    return <span key={i}>{tok.value}</span>;
                  })}
                </div>
              </div>
            )}

            {/* Rejection input area if toggled */}
            {showRejectDialog && (
              <div className="p-3 bg-slate-950 rounded-lg border border-rose-900/50 space-y-2 text-xs">
                <span className="font-semibold text-rose-300">Rejection / Dismissal Justification:</span>
                <input
                  type="text"
                  value={rejectReasonInput}
                  onChange={(e) => setRejectReasonInput(e.target.value)}
                  placeholder="e.g. Campaign ended in Q3; asset slated for archiving."
                  className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 p-2 rounded focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                <span>Human governance approval is mandatory to deploy content corrections.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInspectingItem(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>

                {onSendToAuditor && (
                  <button
                    onClick={() => {
                      onSendToAuditor(editingCorrectionText || inspectingItem.content, {
                        source: 'Canon Watch',
                        sourceTitle: inspectingItem.title,
                        sourceContext: `Correction Candidate for ${inspectingItem.title} (${inspectingItem.channel})`,
                      });
                      setInspectingItem(null);
                    }}
                    className="px-3 py-1.5 text-xs text-indigo-300 hover:text-white bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 rounded-lg cursor-pointer flex items-center gap-1 font-mono"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Audit in Content Auditor</span>
                  </button>
                )}

                {!showRejectDialog ? (
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    className="px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-950 hover:bg-rose-900 border border-rose-800 rounded-lg cursor-pointer"
                  >
                    Reject Correction
                  </button>
                ) : (
                  <button
                    onClick={() => handleRejectCorrection(inspectingItem)}
                    className="px-3 py-1.5 text-xs text-white bg-rose-600 hover:bg-rose-500 rounded-lg cursor-pointer font-semibold"
                  >
                    Confirm Rejection
                  </button>
                )}

                <button
                  onClick={() => handleAcceptCorrection(inspectingItem)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept & Approve Correction</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
