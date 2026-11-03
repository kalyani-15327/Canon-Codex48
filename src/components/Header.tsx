import React from 'react';
import {
  FileSearch,
  Scale,
  Sparkles,
  ClipboardList,
  Eye,
  Layers,
  ShieldCheck,
} from 'lucide-react';

export type NavTabType =
  | 'auditor'
  | 'gateway'
  | 'watch'
  | 'adapters'
  | 'claims'
  | 'guidelines'
  | 'audit-log';

interface HeaderProps {
  activeTab: NavTabType;
  setActiveTab: (tab: NavTabType) => void;
  readinessStatus?: 'Approved for Publication' | 'Requires Review' | 'Publication Blocked';
  readinessScore?: number;
  onExportReportPDF?: () => void;
  isGeneratingPDF?: boolean;
  onOpenExportModal: () => void;
  onResetData?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExportModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Official Logo */}
          <a href="#" className="flex items-center shrink-0">
            <img
              src="/assets/aistudio/WhatsApp_Image_2026-10-27_at_9.52.28_PM_5c4bff89.jpeg"
              alt="Canon — Brand Governance & CI"
              className="h-9 w-auto object-contain rounded"
            />
          </a>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden xl:flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveTab('auditor')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'auditor'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileSearch className="w-3.5 h-3.5" />
              Content Auditor & Intent
            </button>

            <button
              onClick={() => setActiveTab('gateway')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'gateway'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Canon Gateway
            </button>

            <button
              onClick={() => setActiveTab('watch')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'watch'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Canon Watch
            </button>

            <button
              onClick={() => setActiveTab('adapters')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'adapters'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Format Adapters
            </button>

            <button
              onClick={() => setActiveTab('claims')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'claims'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              Claim Ledger & Matrix
            </button>

            <button
              onClick={() => setActiveTab('guidelines')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'guidelines'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Guideline Health & CI
            </button>

            <button
              onClick={() => setActiveTab('audit-log')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'audit-log'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              Audit Trail & Team
            </button>
          </nav>

          {/* Zone 3: Spacer */}
          <div className="flex items-center gap-2 shrink-0" />
        </div>

        {/* Medium and mobile navigation tab strip */}
        <div className="flex xl:hidden items-center overflow-x-auto py-2 gap-2 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setActiveTab('auditor')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'auditor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Content Auditor & Intent
          </button>
          <button
            onClick={() => setActiveTab('gateway')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'gateway' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Canon Gateway
          </button>
          <button
            onClick={() => setActiveTab('watch')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'watch' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Canon Watch
          </button>
          <button
            onClick={() => setActiveTab('adapters')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'adapters' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Format Adapters
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'claims' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Claim Ledger & Matrix
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'guidelines' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Guideline Health & CI
          </button>
          <button
            onClick={() => setActiveTab('audit-log')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer ${
              activeTab === 'audit-log' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trail & Team
          </button>
        </div>
      </div>
    </header>
  );
};

