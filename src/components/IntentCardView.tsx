import React from 'react';
import { IntentCardData, CorrectionTier } from '../types';
import { Target, Users, Key, Award, Cpu } from 'lucide-react';

interface IntentCardViewProps {
  intent: IntentCardData;
  selectedTier: CorrectionTier;
  onSelectTier: (tier: CorrectionTier) => void;
}

export const IntentCardView: React.FC<IntentCardViewProps> = ({
  intent,
  selectedTier,
  onSelectTier,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
      {/* Intent Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">
              Pre-Correction Intent Profile
            </h3>
            <p className="text-xs text-slate-400">
              Extracted from source draft before semantic revision to prevent message drift
            </p>
          </div>
        </div>

        {/* Tier Preservations */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Preservation:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onSelectTier('minimal')}
              className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded transition-colors ${
                selectedTier === 'minimal'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Minimal {intent.intentPreservationScores.minimal}%
            </button>
            <button
              onClick={() => onSelectTier('balanced')}
              className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded transition-colors ${
                selectedTier === 'balanced'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Balanced {intent.intentPreservationScores.balanced}%
            </button>
            <button
              onClick={() => onSelectTier('reframe')}
              className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded transition-colors ${
                selectedTier === 'reframe'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Reframe {intent.intentPreservationScores.reframe}%
            </button>
          </div>
        </div>
      </div>

      {/* Grid of 4 Intent Dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Dimension 1: Primary Purpose */}
        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-400">
            <Target className="w-3.5 h-3.5" />
            <span>Primary Purpose</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {intent.primaryPurpose}
          </p>
        </div>

        {/* Dimension 2: Target Audience */}
        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-sky-400">
            <Users className="w-3.5 h-3.5" />
            <span>Target Audience</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {intent.targetAudience}
          </p>
        </div>

        {/* Dimension 3: Core Persona */}
        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
            <Award className="w-3.5 h-3.5" />
            <span>Core Persona</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {intent.corePersona}
          </p>
        </div>

        {/* Dimension 4: Must-Keep Key Terms */}
        <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
            <Key className="w-3.5 h-3.5" />
            <span>Must-Keep Key Terms ({intent.mustKeepTerms.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {intent.mustKeepTerms.map((term, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono text-slate-300 bg-slate-900 border border-slate-750 px-2 py-0.5 rounded"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
