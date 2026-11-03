import React, { useState, useEffect } from 'react';
import {
  ApprovedFact,
  AuditFinding,
  AuditLogEntry,
  BrandGuideline,
  ClaimItem,
  GatewayBrief,
  GatewayContentType,
  GatewayDraftVersion,
  GatewayWorkflowState,
} from '../../types';
import {
  INITIAL_GATEWAY_WORKFLOW,
  RESTRICTED_TERMS_CATALOG,
  SAMPLE_GATEWAY_BRIEFS,
} from '../../services/seedData';
import { generateWordDiff, runBrandAudit } from '../../services/auditEngine';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  FileText,
  RotateCcw,
  Send,
  UserCheck,
  XCircle,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Info,
  History,
  FileEdit,
} from 'lucide-react';

interface CanonGatewayViewProps {
  approvedFacts: ApprovedFact[];
  guidelines: BrandGuideline[];
  claims: ClaimItem[];
  onRecordAuditLog: (
    action: string,
    category: AuditLogEntry['category'],
    details: string,
    relatedId?: string
  ) => void;
  onSendToAuditor?: (
    text: string,
    meta?: { contentId?: string; source?: string; sourceTitle?: string; sourceContext?: string }
  ) => void;
  onSaveContentDraft?: (draft: { id: string; title: string; text: string; source: string }) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const CanonGatewayView: React.FC<CanonGatewayViewProps> = ({
  approvedFacts,
  guidelines,
  claims,
  onRecordAuditLog,
  onSendToAuditor,
  onSaveContentDraft,
  showToast,
}) => {
  const STORAGE_KEY = 'canon_gateway_state_v1';

  // State initialization
  const [workflow, setWorkflow] = useState<GatewayWorkflowState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_GATEWAY_WORKFLOW;
  });

  const [selectedBriefPresetIndex, setSelectedBriefPresetIndex] = useState<number>(0);
  const [briefInput, setBriefInput] = useState<string>(workflow.brief.brief);
  const [audienceInput, setAudienceInput] = useState<string>(workflow.brief.targetAudience);
  const [contentTypeInput, setContentTypeInput] = useState<GatewayContentType>(
    workflow.brief.contentType
  );
  const [campaignNameInput, setCampaignNameInput] = useState<string>(workflow.brief.campaignName);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isApplyingFixes, setIsApplyingFixes] = useState<boolean>(false);
  const [selectedHistoryViewIndex, setSelectedHistoryViewIndex] = useState<number>(-1);
  const [showReviewModal, setShowReviewModal] = useState<'approve' | 'reject' | 'return' | null>(
    null
  );
  const [reviewNoteInput, setReviewNoteInput] = useState<string>('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
  }, [workflow]);

  // Current active draft findings
  const activeFindings: AuditFinding[] = React.useMemo(() => {
    if (!workflow.activeText) return [];
    return runBrandAudit(workflow.activeText, guidelines, claims, approvedFacts);
  }, [workflow.activeText, guidelines, claims, approvedFacts]);

  // Handle Preset Brief Selection
  const handleSelectPreset = (index: number) => {
    const preset = SAMPLE_GATEWAY_BRIEFS[index];
    setSelectedBriefPresetIndex(index);
    setCampaignNameInput(preset.campaignName);
    setContentTypeInput(preset.contentType);
    setAudienceInput(preset.targetAudience);
    setBriefInput(preset.brief);
  };

  // Generate Draft (Simulated AI generation engine with pre-governance check)
  const handleGenerateDraft = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let generatedContent = '';
      if (
        selectedBriefPresetIndex === 0 ||
        briefInput.toLowerCase().includes('cashback') ||
        briefInput.toLowerCase().includes('guaranteed instant') ||
        campaignNameInput.toLowerCase().includes('fernwick pay') ||
        campaignNameInput.toLowerCase().includes('instant')
      ) {
        // Preset 1: Acceptance Test Ad: Guaranteed instant approval, zero fees, cashback
        generatedContent = `Introducing Fernwick Pay! Get guaranteed instant approval, zero processing fees forever, and a ₹5,000 cashback reward.`;
      } else if (selectedBriefPresetIndex === 1) {
        // Preset 2: Fernwick Pay Enterprise Gateway Launch
        const currentPrice = approvedFacts.find((f) => f.code === 'FACT-PRICE-01')?.value || '₹50,000';
        generatedContent = `Fernwick Pay announces its Enterprise Gateway for tier-1 merchants. Operating with a certified 99.98% availability SLA and PCI-DSS Level 1 tokenization, the platform is available for ${currentPrice} annual license. Experience seamless multi-acquirer routing without hidden charges.`;
      } else {
        // Preset 3 or Custom
        generatedContent = `Switch to Fernwick Pay today. Experience transparent 1.2% + ₹2 merchant rates, certified 99.98% gateway availability, and PCI-DSS v4.0 Level 1 security. Streamlined onboarding with standard risk review within 24 hours.`;
      }

      // Initial compliance check on newly generated draft
      const initialFindings = runBrandAudit(generatedContent, guidelines, claims, approvedFacts);

      const generatedId = `content-gw-${Date.now()}`;

      const initialVersion: GatewayDraftVersion = {
        round: 0,
        label: 'Initial Generation (Round 0)',
        text: generatedContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        findings: initialFindings,
        correctionSummary: 'Initial raw generation from prompt brief.',
      };

      const updatedWorkflow: GatewayWorkflowState = {
        id: generatedId,
        brief: {
          campaignName: campaignNameInput,
          contentType: contentTypeInput,
          targetAudience: audienceInput,
          brief: briefInput,
        },
        currentRound: 0,
        maxRounds: 2,
        history: [initialVersion],
        activeText: generatedContent,
        reviewStatus: 'draft',
        reviewerNotes: undefined,
        reviewedBy: undefined,
        reviewedAt: undefined,
      };

      setWorkflow(updatedWorkflow);
      setSelectedHistoryViewIndex(-1);
      setIsGenerating(false);

      // Save to shared content store
      onSaveContentDraft?.({
        id: generatedId,
        title: campaignNameInput || 'Fernwick Pay Gateway Ad',
        text: generatedContent,
        source: 'Canon Gateway',
      });

      showToast('Generated initial draft with Canon Gateway!', 'success');
      onRecordAuditLog(
        'Generated Draft via Canon Gateway',
        'Canon Gateway',
        `Generated draft for "${campaignNameInput}" (${contentTypeInput}). Detected ${initialFindings.length} compliance findings. Saved with ID ${generatedId}.`,
        updatedWorkflow.id
      );
    }, 600);
  };

  // Request AI Corrections (Max 2 Rounds)
  const handleRequestCorrections = () => {
    if (workflow.currentRound >= workflow.maxRounds) {
      showToast('Maximum of 2 correction rounds reached. Mandatory human review required.', 'error');
      return;
    }

    setIsApplyingFixes(true);

    setTimeout(() => {
      const nextRound = workflow.currentRound + 1;
      let correctedText = workflow.activeText;

      // Apply targeted corrections to the active text
      if (/guaranteed instant approval/i.test(correctedText)) {
        correctedText = correctedText.replace(
          /guaranteed instant approval(\s+for all merchant accounts)?/gi,
          'streamlined merchant onboarding with standard risk review within 24 hours'
        );
      }
      if (/zero(\s+processing)?\s+fees forever/i.test(correctedText)) {
        correctedText = correctedText.replace(
          /zero(\s+processing)?\s+fees forever/gi,
          'transparent standard merchant pricing of 1.2% + ₹2 per transaction'
        );
      }
      if (/₹5,000 cashback reward/i.test(correctedText)) {
        correctedText = correctedText.replace(
          /(,\s*)?and a ₹5,000 cashback reward/gi,
          ' and eligible ₹500 welcome credit under campaign terms'
        );
        correctedText = correctedText.replace(
          /₹5,000 cashback reward/gi,
          'eligible ₹500 welcome credit under campaign terms'
        );
      }
      if (/100% unbreachable/i.test(correctedText)) {
        correctedText = correctedText.replace(
          /100% unbreachable fraud protection/gi,
          'PCI-DSS Level 1 certified multi-layered fraud protection'
        );
      }
      if (/completely free processing/i.test(correctedText)) {
        correctedText = correctedText.replace(
          /completely free processing/gi,
          'competitive commercial rates with no hidden fees'
        );
      }
      if (/blowing legacy competitors out of the water/i.test(correctedText)) {
        correctedText = correctedText.replace(
          /blowing legacy competitors out of the water/gi,
          'setting a new standard for gateway reliability'
        );
      }

      // Check the new corrected text
      const newFindings = runBrandAudit(correctedText, guidelines, claims, approvedFacts);

      const newVersion: GatewayDraftVersion = {
        round: nextRound,
        label: `Correction (Round ${nextRound} of 2)`,
        text: correctedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        findings: newFindings,
        correctionSummary:
          nextRound === 1
            ? 'Corrected unsupported instant approval claim, unbacked zero-fee claim, and absolute security superlatives.'
            : 'Polished residual terminology and validated approved SLA parameters.',
      };

      const updatedWorkflow: GatewayWorkflowState = {
        ...workflow,
        currentRound: nextRound,
        activeText: correctedText,
        history: [...workflow.history, newVersion],
        reviewStatus: 'draft',
      };

      setWorkflow(updatedWorkflow);
      setSelectedHistoryViewIndex(-1);
      setIsApplyingFixes(false);

      showToast(`Applied Canon corrections for Round ${nextRound} of 2!`, 'success');
      onRecordAuditLog(
        `Applied AI Corrections (Round ${nextRound}/2)`,
        'Canon Gateway',
        `Applied Canon brand and claim corrections for "${workflow.brief.campaignName}". Active violations reduced to ${newFindings.length}.`,
        workflow.id
      );
    }, 500);
  };

  // Submit Draft for Human Review
  const handleSubmitForReview = () => {
    const updatedWorkflow: GatewayWorkflowState = {
      ...workflow,
      reviewStatus: 'under_human_review',
    };
    setWorkflow(updatedWorkflow);
    showToast('Draft submitted for mandatory human review!', 'success');
    onRecordAuditLog(
      'Draft Submitted for Human Review',
      'Canon Gateway',
      `Draft "${workflow.brief.campaignName}" submitted for legal & brand governance review. Current round: ${workflow.currentRound}/2.`,
      workflow.id
    );
  };

  // Human Review Decision
  const handleExecuteReviewDecision = (decision: 'approved' | 'rejected' | 'returned_for_correction') => {
    const reviewerName = 'Beatrix Holzer (Legal & Brand Governance)';
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const updatedWorkflow: GatewayWorkflowState = {
      ...workflow,
      reviewStatus: decision,
      reviewerNotes: reviewNoteInput.trim() || undefined,
      reviewedBy: reviewerName,
      reviewedAt: timestamp,
    };

    setWorkflow(updatedWorkflow);
    setShowReviewModal(null);
    setReviewNoteInput('');

    let actionLabel = '';
    if (decision === 'approved') actionLabel = 'Human Review: Approved';
    else if (decision === 'rejected') actionLabel = 'Human Review: Rejected';
    else actionLabel = 'Human Review: Returned for Correction';

    showToast(`Draft review decision: ${decision.toUpperCase()}`, 'success');
    onRecordAuditLog(
      actionLabel,
      'Canon Gateway',
      `Reviewer ${reviewerName} marked draft "${workflow.brief.campaignName}" as ${decision.toUpperCase()}.${
        reviewNoteInput ? ` Notes: "${reviewNoteInput}"` : ''
      }`,
      workflow.id
    );
  };

  // Word-level diff calculation between versions
  const diffComparisonTokens = React.useMemo(() => {
    if (selectedHistoryViewIndex < 0 || !workflow.history[selectedHistoryViewIndex]) {
      return null;
    }
    const compareVersion = workflow.history[selectedHistoryViewIndex];
    return generateWordDiff(compareVersion.text, workflow.activeText);
  }, [selectedHistoryViewIndex, workflow.history, workflow.activeText]);

  // Reset Gateway State
  const handleResetWorkflow = () => {
    setWorkflow(INITIAL_GATEWAY_WORKFLOW);
    handleSelectPreset(0);
    showToast('Reset Canon Gateway workflow.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Description */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-tight">
                Canon Gateway — Brand Governance Before AI Content Generation
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                Simulated AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Enforce enterprise brand voice, verify claims against the live Claim Ledger, inject approved
              facts, and restrict prohibited terms <em>before</em> content is generated. Limit AI corrections to a
              maximum of two rounds with mandatory human approval.
            </p>
          </div>
          <button
            onClick={handleResetWorkflow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors self-start md:self-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Form & Right Governance Context */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Brief Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">1. Content Brief & Parameters</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Fictional Fernwick Pay Data</span>
            </div>

            {/* Preset Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Quick-Load Demo Campaign Preset:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SAMPLE_GATEWAY_BRIEFS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(idx)}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedBriefPresetIndex === idx
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="text-[11px] font-semibold line-clamp-1">{preset.campaignName}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{preset.contentType}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Name & Content Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Campaign / Content Title</label>
                <input
                  type="text"
                  value={campaignNameInput}
                  onChange={(e) => setCampaignNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-sans"
                  placeholder="e.g. Fernwick Pay Retail Ad"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Content Type</label>
                <select
                  value={contentTypeInput}
                  onChange={(e) => setContentTypeInput(e.target.value as GatewayContentType)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-sans"
                >
                  <option value="Digital Advertisement">Digital Advertisement</option>
                  <option value="Landing Page Hero & Copy">Landing Page Hero & Copy</option>
                  <option value="Email Campaign">Email Campaign</option>
                  <option value="Social Media Announcement">Social Media Announcement</option>
                </select>
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Target Audience & Core Persona</label>
              <input
                type="text"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-sans"
                placeholder="e.g. Retail Merchants, Quick-Service Restaurants & E-Commerce Owners"
              />
            </div>

            {/* Brief Instructions */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Content Brief & Key Message Directives</label>
              <textarea
                rows={3}
                value={briefInput}
                onChange={(e) => setBriefInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-3 rounded-lg focus:outline-none focus:border-indigo-500 font-sans resize-y"
                placeholder="Describe what the draft should convey, value props, key offers..."
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Preset 1 includes intentional unsupported claims to test governance checks.</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateDraft}
                disabled={isGenerating || !briefInput.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Draft...' : 'Generate Draft (Canon AI)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Pre-Generation Governance Context (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Pre-Generation Brand Governance</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded">
                Active Policy
              </span>
            </div>

            {/* Brand Tone Guidelines */}
            <div className="space-y-1.5 bg-slate-950/70 border border-slate-800 p-3 rounded-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                <span>Brand Tone & Voice Directives</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Confident, measured, and authoritative. Avoid colloquial marketing hyperbole (e.g., &ldquo;blowing
                competitors away&rdquo;) and unbacked existential urgency.
              </p>
            </div>

            {/* Active Approved Facts from Canon Knowledge Base */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">Approved Facts & Expiry Dates</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {approvedFacts.length} Registered
                </span>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {approvedFacts.map((fact) => (
                  <div
                    key={fact.id}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-2 text-[11px]"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] text-indigo-400 bg-indigo-950 px-1 rounded">
                          {fact.code}
                        </span>
                        <span className="text-slate-200 font-medium">{fact.title}</span>
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        Value:{' '}
                        <span className="text-emerald-400 font-semibold">{fact.value}</span> · Expires:{' '}
                        <span
                          className={
                            new Date(fact.expiryDate) < new Date('2026-10-31')
                              ? 'text-rose-400 font-semibold'
                              : 'text-slate-300'
                          }
                        >
                          {fact.expiryDate}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.2 rounded border shrink-0 ${
                        fact.status === 'Active'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : fact.status === 'Updated'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}
                    >
                      {fact.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Restricted Terms Chips */}
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-slate-300">Restricted Terms (Prohibited Claims)</span>
              <div className="flex flex-wrap gap-1.5">
                {RESTRICTED_TERMS_CATALOG.map((item, idx) => (
                  <span
                    key={idx}
                    title={`${item.category}: ${item.reason}`}
                    className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-900/60"
                  >
                    <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                    <span>&ldquo;{item.term}&rdquo;</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Draft & Governance Validation Workspace */}
      {workflow.activeText ? (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-5">
          {/* Section Header with Correction Round Badge & Review Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                2. Generated Draft & Governance Matrix
              </h3>
              {/* Round Badge */}
              <span
                className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded border ${
                  workflow.currentRound === 0
                    ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                    : workflow.currentRound === 1
                    ? 'bg-sky-950/80 text-sky-300 border-sky-800'
                    : 'bg-purple-950/80 text-purple-300 border-purple-800'
                }`}
              >
                Round {workflow.currentRound} of {workflow.maxRounds}
                {workflow.currentRound >= workflow.maxRounds && ' (Limit Reached)'}
              </span>
            </div>

            {/* Review Status Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Review Status:</span>
              {workflow.reviewStatus === 'draft' && (
                <span className="text-xs font-medium text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                  Pre-Publication Draft
                </span>
              )}
              {workflow.reviewStatus === 'under_human_review' && (
                <span className="text-xs font-semibold text-amber-300 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-800 animate-pulse flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Under Human Review
                </span>
              )}
              {workflow.reviewStatus === 'approved' && (
                <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Approved by Governance
                </span>
              )}
              {workflow.reviewStatus === 'rejected' && (
                <span className="text-xs font-semibold text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-800 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> Rejected by Reviewer
                </span>
              )}
              {workflow.reviewStatus === 'returned_for_correction' && (
                <span className="text-xs font-semibold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Returned for Manual Correction
                </span>
              )}
            </div>
          </div>

          {/* Review Notes Banner if Present */}
          {workflow.reviewerNotes && (
            <div className="p-3 bg-slate-950 rounded-lg border border-indigo-900/50 text-xs text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-indigo-300">
                  Reviewer Feedback ({workflow.reviewedBy}):
                </span>{' '}
                {workflow.reviewerNotes}
              </div>
            </div>
          )}

          {/* Draft Comparison & History Selector */}
          {workflow.history.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1 ml-1">
                <History className="w-3.5 h-3.5" /> Version History:
              </span>
              <button
                type="button"
                onClick={() => setSelectedHistoryViewIndex(-1)}
                className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  selectedHistoryViewIndex === -1
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Active (Round {workflow.currentRound})
              </button>
              {workflow.history.map((ver, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedHistoryViewIndex(idx)}
                  className={`text-xs px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    selectedHistoryViewIndex === idx
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Round {ver.round} ({ver.timestamp})
                </button>
              ))}
            </div>
          )}

          {/* Active Draft Textarea / Diff Viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                {selectedHistoryViewIndex >= 0
                  ? `Comparing Round ${workflow.history[selectedHistoryViewIndex].round} with Active Round ${workflow.currentRound}`
                  : `Active Pre-Publication Draft Content (Round ${workflow.currentRound})`}
              </span>
              <span className="font-mono text-[11px]">
                {workflow.activeText.trim().split(/\s+/).length} words ·{' '}
                {workflow.activeText.length} characters
              </span>
            </div>

            {selectedHistoryViewIndex >= 0 && diffComparisonTokens ? (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg text-sm leading-relaxed text-slate-200 font-sans">
                {diffComparisonTokens.map((tok, i) => {
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
            ) : (
              <textarea
                rows={4}
                value={workflow.activeText}
                onChange={(e) => {
                  setWorkflow({ ...workflow, activeText: e.target.value });
                }}
                className="w-full bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-200 p-3.5 rounded-lg focus:outline-none focus:border-indigo-500 font-sans resize-y"
              />
            )}
          </div>

          {/* Governance Findings Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert
                  className={`w-4 h-4 ${
                    activeFindings.length > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                />
                <span className="text-xs font-semibold text-white">
                  Compliance Check Findings:
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    activeFindings.length > 0
                      ? 'bg-rose-950/70 text-rose-300 border-rose-800'
                      : 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {activeFindings.length === 0
                    ? '0 Violations (Fully Compliant)'
                    : `${activeFindings.length} Violations / Unbacked Claims`}
                </span>
              </div>
            </div>

            {activeFindings.length === 0 ? (
              <div className="p-4 bg-emerald-950/20 border border-emerald-900/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  All restricted terms, claims, and price values comply with Canon brand rules and active
                  approved facts. Mandatory human review is still required before publication.
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {activeFindings.map((finding) => (
                  <div
                    key={finding.id}
                    className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            finding.severity === 'High'
                              ? 'bg-rose-950 text-rose-300 border-rose-800'
                              : finding.severity === 'Medium'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {finding.severity} Severity
                        </span>
                        <span className="font-semibold text-slate-200">{finding.title}</span>
                        <span className="text-[10px] font-mono text-slate-400">
                          [{finding.guidelineRef}]
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{finding.explanation}</p>
                      <div className="text-[11px] text-slate-300 pt-1">
                        <span className="text-rose-400 line-through mr-2">
                          &ldquo;{finding.originalSegment}&rdquo;
                        </span>
                        <ArrowRight className="w-3 h-3 inline text-slate-500 mx-1" />
                        <span className="text-emerald-400 font-medium">
                          Suggested Fix: &ldquo;{finding.suggestedFix}&rdquo;
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Workflow Controls: Request Correction (Max 2 Rounds) & Submit for Human Review */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Correction Rounds:</span>
                <span className="text-indigo-400 font-mono">
                  {workflow.currentRound} of {workflow.maxRounds} rounds used
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {workflow.currentRound < workflow.maxRounds
                  ? `You can request up to ${workflow.maxRounds - workflow.currentRound} more AI correction round(s).`
                  : 'Correction limit reached. Human sign-off is mandatory; auto-publishing is strictly prohibited.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Correction Request Button */}
              <button
                type="button"
                onClick={handleRequestCorrections}
                disabled={
                  isApplyingFixes ||
                  workflow.currentRound >= workflow.maxRounds ||
                  activeFindings.length === 0
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isApplyingFixes
                    ? 'Applying Fixes...'
                    : workflow.currentRound >= workflow.maxRounds
                    ? 'Correction Limit Reached (2/2)'
                    : `Request AI Corrections (Round ${workflow.currentRound + 1} of 2)`}
                </span>
              </button>

              {/* Submit for Human Review */}
              {workflow.reviewStatus === 'draft' && (
                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Human Review</span>
                </button>
              )}

              {/* Review Actions (When submitted or under review) */}
              {(workflow.reviewStatus === 'under_human_review' ||
                workflow.reviewStatus === 'draft') && (
                <div className="flex items-center gap-1.5 border-l border-slate-800 pl-2.5">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal('approve')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal('return')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Return</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal('reject')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              )}

              {/* Send to Main Auditor Tab */}
              {onSendToAuditor && (
                <button
                  type="button"
                  onClick={() =>
                    onSendToAuditor(workflow.activeText, {
                      contentId: workflow.id,
                      source: 'Canon Gateway',
                      sourceTitle: workflow.brief.campaignName || 'Fernwick Pay Gateway Ad',
                      sourceContext: `Campaign: ${workflow.brief.campaignName} · Type: ${workflow.brief.contentType} · Audience: ${workflow.brief.targetAudience}`,
                    })
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/60 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Send to Content Auditor</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-3">
          <div className="inline-flex p-3 rounded-full bg-slate-950 border border-slate-800 text-indigo-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-slate-300">
              Ready to generate brand-governed content with Canon Gateway
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Select or customize the content brief above and click &ldquo;Generate Draft&rdquo;. Canon
              will validate tone, check against the Claim Ledger, and restrict claims before human review.
            </p>
          </div>
        </div>
      )}

      {/* Human Review Decision Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-semibold text-white capitalize">
                  Human Review: {showReviewModal} Draft
                </h4>
              </div>
              <button
                onClick={() => setShowReviewModal(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                {showReviewModal === 'approve'
                  ? 'Confirm legal & brand sign-off for this draft. This records an approved governance attestation.'
                  : showReviewModal === 'reject'
                  ? 'Provide a rejection reason. The draft will be archived with rejection logs.'
                  : 'Provide instructions for the author to manually revise this draft.'}
              </p>
              <textarea
                rows={3}
                value={reviewNoteInput}
                onChange={(e) => setReviewNoteInput(e.target.value)}
                placeholder="Enter reviewer feedback / justification..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowReviewModal(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleExecuteReviewDecision(
                    showReviewModal === 'approve'
                      ? 'approved'
                      : showReviewModal === 'reject'
                      ? 'rejected'
                      : 'returned_for_correction'
                  )
                }
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg cursor-pointer text-white ${
                  showReviewModal === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : showReviewModal === 'reject'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                Confirm {showReviewModal.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
