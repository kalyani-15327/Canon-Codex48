import React, { useState } from 'react';
import { CorrectionTier, TierCorrectionDetail } from '../types';
import { generateWordDiff, DiffToken } from '../services/auditEngine';
import {
  Columns2,
  FileCode,
  Check,
  Copy,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

interface TrackedDiffViewerProps {
  originalText: string;
  tiers: Record<CorrectionTier, TierCorrectionDetail>;
  selectedTier: CorrectionTier;
  onSelectTier: (tier: CorrectionTier) => void;
  onApplyTier: (tier: CorrectionTier) => void;
}

export const TrackedDiffViewer: React.FC<TrackedDiffViewerProps> = ({
  originalText,
  tiers,
  selectedTier,
  onSelectTier,
  onApplyTier,
}) => {
  const [viewMode, setViewMode] = useState<'inline' | 'split'>('split');
  const [copied, setCopied] = useState(false);

  const activeTierDetail = tiers[selectedTier];
  const diffTokens: DiffToken[] = generateWordDiff(originalText, activeTierDetail.text);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTierDetail.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
      {/* Tier selector bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tier Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['minimal', 'balanced', 'reframe'] as CorrectionTier[]).map((tierKey) => {
            const detail = tiers[tierKey];
            const isSelected = selectedTier === tierKey;
            return (
              <button
                key={tierKey}
                onClick={() => onSelectTier(tierKey)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{detail.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {detail.intentPreservation}% Intent
                </span>
              </button>
            );
          })}
        </div>

        {/* View mode toggle & Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'split' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Side-by-side comparison"
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewMode('inline')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                viewMode === 'inline' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Inline diff view"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Inline Diff</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Corrected'}</span>
          </button>

          <button
            onClick={() => onApplyTier(selectedTier)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Apply {activeTierDetail.label.split(' ')[0]} Fix</span>
          </button>
        </div>
      </div>

      {/* Rationale explanation banner */}
      <div className="px-5 py-2.5 bg-indigo-950/20 border-b border-indigo-900/30 flex items-start gap-2.5 text-xs text-indigo-300">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-indigo-200">{activeTierDetail.label}: </span>
          <span>{activeTierDetail.rationale}</span>
          <span className="ml-2 font-mono text-[11px] text-slate-400">
            (Word count delta: {activeTierDetail.wordCountDelta > 0 ? `+${activeTierDetail.wordCountDelta}` : activeTierDetail.wordCountDelta} words)
          </span>
        </div>
      </div>

      {/* Diff Content Body */}
      {viewMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 min-h-[380px]">
          {/* Left Column: Original Draft */}
          <div className="p-5 space-y-2 bg-slate-950/40">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Original Draft (With Detected Infractions)
              </span>
              <span className="text-xs text-rose-400/90 font-mono">Red strikethrough = flagged segments</span>
            </div>
            <div className="text-sm leading-relaxed text-slate-300 font-sans whitespace-pre-wrap select-text">
              {diffTokens.map((token, idx) => {
                if (token.type === 'removed') {
                  return (
                    <del
                      key={idx}
                      className="bg-rose-950/80 text-rose-300 px-1 py-0.5 rounded border border-rose-800/60 line-through decoration-rose-400 decoration-2 font-mono text-[13px]"
                    >
                      {token.value}
                    </del>
                  );
                } else if (token.type === 'unchanged') {
                  return <span key={idx}>{token.value}</span>;
                }
                return null;
              })}
            </div>
          </div>

          {/* Right Column: Corrected Version */}
          <div className="p-5 space-y-2 bg-slate-900/60">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
                {activeTierDetail.label} (Audit Compliant)
              </span>
              <span className="text-xs text-emerald-400/90 font-mono">Green = compliant replacement</span>
            </div>
            <div className="text-sm leading-relaxed text-slate-200 font-sans whitespace-pre-wrap select-text">
              {diffTokens.map((token, idx) => {
                if (token.type === 'added') {
                  return (
                    <ins
                      key={idx}
                      className="bg-emerald-950/80 text-emerald-300 px-1 py-0.5 rounded border border-emerald-800/60 no-underline font-mono text-[13px] font-medium"
                    >
                      {token.value}
                    </ins>
                  );
                } else if (token.type === 'unchanged') {
                  return <span key={idx}>{token.value}</span>;
                }
                return null;
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Inline Unified Diff */
        <div className="p-5 bg-slate-950/50 min-h-[380px] space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Unified Inline Tracked Changes
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-rose-400">Deletions (Strikethrough)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-emerald-400">Additions (Green)</span>
            </div>
          </div>
          <div className="text-sm leading-relaxed text-slate-200 font-sans whitespace-pre-wrap select-text p-2">
            {diffTokens.map((token, idx) => {
              if (token.type === 'removed') {
                return (
                  <del
                    key={idx}
                    className="bg-rose-950/80 text-rose-300 px-1 py-0.5 rounded border border-rose-800/60 line-through decoration-rose-400 decoration-2 font-mono text-[13px] mx-0.5"
                  >
                    {token.value}
                  </del>
                );
              } else if (token.type === 'added') {
                return (
                  <ins
                    key={idx}
                    className="bg-emerald-950/80 text-emerald-300 px-1 py-0.5 rounded border border-emerald-800/60 no-underline font-mono text-[13px] font-medium mx-0.5"
                  >
                    {token.value}
                  </ins>
                );
              }
              return <span key={idx}>{token.value}</span>;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
