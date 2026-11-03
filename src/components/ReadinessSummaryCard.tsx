import React from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  FileSignature,
  FileCheck,
  Scale,
} from 'lucide-react';

interface ReadinessSummaryCardProps {
  score: number;
  status: 'Approved for Publication' | 'Requires Review' | 'Publication Blocked';
  statusColor: 'emerald' | 'amber' | 'rose';
  blockingReasons: string[];
  totalFindings: number;
  activeViolations: number;
  fixedCount: number;
  overriddenCount: number;
  criticalClaimsCount: number;
  onSignOff: () => void;
  isSignedOff: boolean;
}

export const ReadinessSummaryCard: React.FC<ReadinessSummaryCardProps> = ({
  score,
  status,
  statusColor,
  blockingReasons,
  totalFindings,
  activeViolations,
  fixedCount,
  overriddenCount,
  criticalClaimsCount,
  onSignOff,
  isSignedOff,
}) => {
  const isBlocked = status === 'Publication Blocked';
  const isApproved = status === 'Approved for Publication';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {isApproved ? (
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : isBlocked ? (
            <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertOctagon className="w-4 h-4" />
            </div>
          ) : (
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Pre-Publication Readiness</h3>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium ${
                  statusColor === 'emerald'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                    : statusColor === 'amber'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                    : 'bg-rose-950/80 text-rose-300 border border-rose-800/80'
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Governance gate requires 0 High violations and 0 unsupported claims before release
            </p>
          </div>
        </div>

        {/* Big Score Gauge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
              {score}
              <span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              Composite Score
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center font-mono text-xs font-bold transition-all shadow-inner border-slate-700">
            <span
              className={
                statusColor === 'emerald'
                  ? 'text-emerald-400'
                  : statusColor === 'amber'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }
            >
              {score}%
            </span>
          </div>
        </div>
      </div>

      {/* Metric Breakdown Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-slate-400">Active Violations</div>
          <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
            {activeViolations}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-emerald-400">Applied Fixes</div>
          <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
            {fixedCount}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-amber-400">Approved Overrides</div>
          <div className="text-lg font-bold font-mono text-amber-400 tabular-nums mt-0.5">
            {overriddenCount}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="text-[10px] uppercase font-mono text-rose-400 flex items-center gap-1">
            <Scale className="w-3 h-3 text-rose-400" />
            Claim Blockers
          </div>
          <div className="text-lg font-bold font-mono text-rose-400 tabular-nums mt-0.5">
            {criticalClaimsCount}
          </div>
        </div>
      </div>

      {/* Blocking Issues or Approval Confirmation */}
      {blockingReasons.length > 0 ? (
        <div className="p-3.5 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
            <AlertOctagon className="w-4 h-4 shrink-0" />
            <span>Publication Blockers ({blockingReasons.length})</span>
          </div>
          <ul className="text-xs text-rose-200/90 space-y-1 pl-5 list-disc">
            {blockingReasons.map((reason, idx) => (
              <li key={idx} className="leading-relaxed">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              All governance checks passed. No high-severity violations or unsupported claims remain.
            </span>
          </div>
        </div>
      )}

      {/* Sign-off Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <span className="text-xs text-slate-400">
          {isSignedOff
            ? '✓ Digitally signed off by Beatrix Holzer (Legal) & Julian Vance (Brand)'
            : 'Pre-publication sign-off creates an immutable entry in the team compliance ledger'}
        </span>

        <button
          onClick={onSignOff}
          disabled={isBlocked || isSignedOff}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer ${
            isSignedOff
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : isBlocked
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isSignedOff ? (
            <>
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Publication Certified</span>
            </>
          ) : (
            <>
              <FileSignature className="w-4 h-4" />
              <span>Certify & Sign-off Publication</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
