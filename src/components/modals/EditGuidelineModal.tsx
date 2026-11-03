import React, { useState } from 'react';
import { BrandGuideline } from '../../types';
import { Edit3, X, Check } from 'lucide-react';

interface EditGuidelineModalProps {
  guideline: BrandGuideline | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveGuideline: (
    guidelineId: string,
    newWording: string,
    newRationale: string,
    bumpVersion: boolean
  ) => void;
}

export const EditGuidelineModal: React.FC<EditGuidelineModalProps> = ({
  guideline,
  isOpen,
  onClose,
  onSaveGuideline,
}) => {
  const [wording, setWording] = useState(
    guideline?.proposedWording || guideline?.originalWording || ''
  );
  const [rationale, setRationale] = useState(guideline?.rationale || '');
  const [bumpVersion, setBumpVersion] = useState(true);

  if (!isOpen || !guideline) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wording.trim()) return;
    onSaveGuideline(guideline.id, wording.trim(), rationale.trim(), bumpVersion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Edit Corporate Brand Guideline Definition
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                {guideline.code} — {guideline.name} (Current: v{guideline.version})
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Active Guideline Directive Wording:
            </label>
            <textarea
              rows={4}
              required
              value={wording}
              onChange={(e) => setWording(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-sans resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
              Revision Rationale & Governance Notes:
            </label>
            <textarea
              rows={2}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="State why this directive was clarified (e.g. resolve dispute frequency or align with SEC/DORA rules)..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-sans resize-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              id="bump-ver"
              checked={bumpVersion}
              onChange={(e) => setBumpVersion(e.target.checked)}
              className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
            />
            <label htmlFor="bump-ver" className="cursor-pointer">
              Increment version minor index (e.g., v{guideline.version} → v
              {(parseFloat(guideline.version) + 0.1).toFixed(1)})
            </label>
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
              disabled={!wording.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Publish Version</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
