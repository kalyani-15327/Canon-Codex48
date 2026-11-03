import React, { useState } from 'react';
import { BrandGuideline, CISimulationReport, HistoricalAsset } from '../types';
import { runHistoricalSimulation } from '../services/guidelineCIEngine';
import {
  Sparkles,
  Search,
  CheckCircle2,
  XCircle,
  Edit3,
  Play,
  RotateCcw,
  AlertTriangle,
  Layers,
  ArrowRight,
  TrendingDown,
  Check,
  ShieldCheck,
  FileText,
  HelpCircle,
  Activity,
  GitBranch,
} from 'lucide-react';

interface GuidelineHealthViewProps {
  guidelines: BrandGuideline[];
  historicalAssets: HistoricalAsset[];
  initialFocusedRuleCode?: string;
  onAcceptClarification: (guidelineId: string) => void;
  onRejectClarification: (guidelineId: string) => void;
  onOpenEditGuidelineModal: (guideline: BrandGuideline) => void;
  onRecordAuditLog: (action: string, category: any, details: string, relatedId?: string) => void;
  onSimulationReportUpdate?: (report: CISimulationReport) => void;
  onTestRuleInAuditor?: (sampleText: string, ruleCode: string) => void;
  onNavigateToAuditLog?: (ruleCode?: string) => void;
  onApproveProposedRule?: (ruleCode: string, newWording: string, report: CISimulationReport) => void;
}

export const GuidelineHealthView: React.FC<GuidelineHealthViewProps> = ({
  guidelines,
  historicalAssets,
  initialFocusedRuleCode,
  onAcceptClarification,
  onRejectClarification,
  onOpenEditGuidelineModal,
  onRecordAuditLog,
  onSimulationReportUpdate,
  onTestRuleInAuditor,
  onNavigateToAuditLog,
  onApproveProposedRule,
}) => {
  const [deployedRuleCode, setDeployedRuleCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialFocusedRuleCode || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSimRuleId, setSelectedSimRuleId] = useState<string>(guidelines[0]?.id || '');
  const [customProposedWording, setCustomProposedWording] = useState<string>(
    guidelines[0]?.proposedWording || ''
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationReport, setSimulationReport] = useState<CISimulationReport | null>(null);

  React.useEffect(() => {
    if (initialFocusedRuleCode) {
      setSearchQuery(initialFocusedRuleCode);
      const match = guidelines.find(
        (g) => g.code.toLowerCase() === initialFocusedRuleCode.toLowerCase()
      );
      if (match) {
        setSelectedSimRuleId(match.id);
        setCustomProposedWording(match.proposedWording || match.originalWording);
      }
    }
  }, [initialFocusedRuleCode, guidelines]);

  // Compute Dashboard Metrics
  const activeRulesCount = guidelines.filter((g) => g.status === 'Active').length;
  const avgDisputeRate = Math.round(
    guidelines.reduce((acc, g) => acc + g.disputeFrequency, 0) / (guidelines.length || 1)
  );
  const avgAmbiguity = Math.round(
    guidelines.reduce((acc, g) => acc + g.ambiguityScore, 0) / (guidelines.length || 1)
  );
  const conflictingDirectivesCount = 2; // e.g. Rule-SEC-04 vs regional marketing freedom, Rule-TERM-02 vs PQC technical terms

  // Filtered Guidelines
  const filteredGuidelines = guidelines.filter((g) => {
    if (selectedCategory !== 'All' && g.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        g.code.toLowerCase().includes(q) ||
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // AI-suggested clarifications (guidelines with proposedWording)
  const suggestions = guidelines.filter((g) => g.proposedWording);

  const handleSelectRuleForSim = (ruleId: string) => {
    setSelectedSimRuleId(ruleId);
    const rule = guidelines.find((g) => g.id === ruleId);
    if (rule) {
      setCustomProposedWording(rule.proposedWording || rule.originalWording);
    }
  };

  const handleRunSimulation = () => {
    const targetGuideline = guidelines.find((g) => g.id === selectedSimRuleId) || guidelines[0];
    setIsSimulating(true);

    setTimeout(() => {
      const report = runHistoricalSimulation(
        targetGuideline,
        customProposedWording,
        historicalAssets
      );
      setSimulationReport(report);
      onSimulationReportUpdate?.(report);
      setIsSimulating(false);

      onRecordAuditLog(
        `Guideline CI Simulation: ${targetGuideline.code}`,
        'CI Simulation',
        `Simulated proposed change across ${historicalAssets.length} historical corporate assets. Pass rate: ${report.beforePassRate}% -> ${report.afterPassRate}%. Regressions: ${report.newlyIntroducedFailures}.`,
        targetGuideline.code
      );
    }, 750);
  };

  return (
    <div className="space-y-6">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Total Active Rules</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {activeRulesCount}
            <span className="text-xs font-normal text-slate-400 ml-1">/ {guidelines.length} total</span>
          </div>
          <p className="text-[11px] text-slate-400">Governance policies enforced across all channels</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Dispute / Override Rate</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {avgDisputeRate}%
          </div>
          <p className="text-[11px] text-slate-400">Frequency of author overrides against guidelines</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Ambiguity Index</span>
            <HelpCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400 tabular-nums">
            {avgAmbiguity}%
          </div>
          <p className="text-[11px] text-slate-400">Heuristic semantic vagueness score across directives</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono uppercase">
            <span>Conflicting Directives</span>
            <GitBranch className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
            {conflictingDirectivesCount}
          </div>
          <p className="text-[11px] text-slate-400">Cross-departmental policy collisions identified</p>
        </div>
      </div>

      {/* AI-Suggested Guideline Clarifications */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                AI-Suggested Guideline Clarifications ({suggestions.length})
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Heuristic refinements designed to resolve ambiguity and eliminate recurring author disputes
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Model: Heuristic Syntactic Clarifier v2.4
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {suggestions.map((guideline) => (
            <div
              key={guideline.id}
              className="bg-slate-950/70 rounded-lg border border-slate-800 p-4 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-indigo-400 bg-indigo-950/60 border border-indigo-900/60 px-1.5 py-0.2 rounded">
                      {guideline.code}
                    </span>
                    <span className="text-xs font-medium text-white truncate max-w-[200px]">
                      {guideline.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400">
                    Dispute: {guideline.disputeFrequency}%
                  </span>
                </div>

                {/* Original vs Proposed Wording Box */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800/80 space-y-0.5">
                    <span className="text-[10px] uppercase font-mono text-slate-500 font-semibold">
                      Current Wording (v{guideline.version}):
                    </span>
                    <p className="text-slate-300 italic text-[11px] leading-relaxed">
                      "{guideline.originalWording}"
                    </p>
                  </div>

                  <div className="p-2.5 rounded bg-indigo-950/20 border border-indigo-900/40 space-y-0.5">
                    <span className="text-[10px] uppercase font-mono text-indigo-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Proposed Refinement:
                    </span>
                    <p className="text-indigo-200 text-[11px] leading-relaxed">
                      "{guideline.proposedWording}"
                    </p>
                  </div>
                </div>

                {guideline.rationale && (
                  <p className="text-[11px] text-slate-400 leading-normal">
                    <strong className="text-slate-300">Rationale: </strong>
                    {guideline.rationale}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    handleSelectRuleForSim(guideline.id);
                    const el = document.getElementById('guideline-ci-suite');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-mono transition-colors"
                >
                  <Play className="w-3 h-3" />
                  Simulate in CI
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onRejectClarification(guideline.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
                  >
                    <XCircle className="w-3 h-3" />
                    Reject
                  </button>

                  <button
                    onClick={() => onOpenEditGuidelineModal(guideline)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>

                  <button
                    onClick={() => onAcceptClarification(guideline.id)}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-sm"
                  >
                    <Check className="w-3 h-3" />
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Searchable Guideline Table */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-semibold text-white">Brand Governance Registry</h3>
            <p className="text-xs text-slate-400">
              Active corporate directives, override volumes, dispute frequencies, and semantic ambiguity ratings
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rule code, name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 w-60"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Tone & Voice">Tone & Voice</option>
              <option value="Terminology">Terminology</option>
              <option value="Core Messaging">Core Messaging</option>
              <option value="Visuals">Visuals</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Claims">Claims</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Rule Code</th>
                <th className="py-2.5 px-3 font-semibold">Rule Name & Scope</th>
                <th className="py-2.5 px-3 font-semibold whitespace-nowrap">Category</th>
                <th className="py-2.5 px-3 font-semibold text-right">Overrides</th>
                <th className="py-2.5 px-3 font-semibold text-right">Dispute Rate</th>
                <th className="py-2.5 px-3 font-semibold text-right">Ambiguity</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredGuidelines.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono text-[11px] text-indigo-400 whitespace-nowrap font-medium">
                    {rule.code}
                  </td>
                  <td className="py-3 px-3 max-w-sm">
                    <div className="font-medium text-slate-200">{rule.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {rule.description}
                    </div>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap text-slate-300 text-[11px]">
                    {rule.category}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                    {rule.overrideCount}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <span
                      className={
                        rule.disputeFrequency > 25
                          ? 'text-rose-400 font-semibold'
                          : rule.disputeFrequency > 15
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }
                    >
                      {rule.disputeFrequency}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                    {rule.ambiguityScore}%
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        rule.status === 'Active'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      {rule.status} (v{rule.version})
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {onTestRuleInAuditor && (
                        <button
                          onClick={() => onTestRuleInAuditor(rule.description, rule.code)}
                          title="Test this guideline rule in Content Auditor"
                          className="px-2 py-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/80 rounded border border-cyan-800/70 flex items-center gap-1"
                        >
                          <ArrowRight className="w-3 h-3" />
                          <span className="hidden md:inline">Test in Auditor</span>
                        </button>
                      )}
                      {onNavigateToAuditLog && (
                        <button
                          onClick={() => onNavigateToAuditLog(rule.code)}
                          title="View complete audit & CI log for this rule"
                          className="p-1 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded border border-slate-700"
                        >
                          <Activity className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          handleSelectRuleForSim(rule.id);
                          const el = document.getElementById('guideline-ci-suite');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        title="Simulate rule impact in CI"
                        className="p-1 text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/80 rounded border border-indigo-800/70"
                      >
                        <Play className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onOpenEditGuidelineModal(rule)}
                        title="Edit guideline wording"
                        className="p-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guideline CI Simulation Suite */}
      <div id="guideline-ci-suite" className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-semibold text-white">
                Guideline CI: Historical Impact & Regression Simulation
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates proposed guideline wording against corporate asset archives (2024–2026) to prevent policy regressions
            </p>
          </div>

          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-900 px-2 py-0.5 rounded">
            Seeded Archive: {historicalAssets.length} Corporate Assets
          </span>
        </div>

        {/* Simulation Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Rule Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
              Target Rule for CI Evaluation:
            </label>
            <select
              value={selectedSimRuleId}
              onChange={(e) => handleSelectRuleForSim(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
            >
              {guidelines.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.code} — {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Proposed Wording Textarea */}
          <div className="lg:col-span-2">
            <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
              Proposed Rule Definition / Wording Modification:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                rows={2}
                value={customProposedWording}
                onChange={(e) => setCustomProposedWording(e.target.value)}
                placeholder="Enter proposed guideline phrasing..."
                className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 p-2.5 rounded-lg focus:outline-none focus:border-indigo-500 font-sans resize-none"
              />
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors shadow-sm shrink-0 disabled:opacity-50 cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Historical CI Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Simulation Report Display */}
        {simulationReport ? (
          <div className="space-y-4 pt-2">
            {/* Deploy / Status Action Banner */}
            <div className="p-4 rounded-xl border border-indigo-900/60 bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/60">
                    {simulationReport.ruleCode}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {deployedRuleCode === simulationReport.ruleCode
                      ? 'Rule Successfully Deployed & Version Bumped'
                      : 'Historical CI Impact Evaluated — Rule Pending Approval'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {deployedRuleCode === simulationReport.ruleCode ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active brand rule has been updated in runtime governance with this proposed wording.
                    </span>
                  ) : (
                    <span>
                      The active guideline rule remains unchanged until explicitly deployed. Verify the pass rate delta and regression risk below before applying to runtime governance.
                    </span>
                  )}
                </p>
              </div>

              {onApproveProposedRule && deployedRuleCode !== simulationReport.ruleCode && (
                <button
                  onClick={() => {
                    onApproveProposedRule(simulationReport.ruleCode, customProposedWording, simulationReport);
                    setDeployedRuleCode(simulationReport.ruleCode);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-md hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 shrink-0"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approve & Deploy Rule Change</span>
                </button>
              )}
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-400">Assets Evaluated</span>
                <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5">
                  {simulationReport.totalAssetsEvaluated}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-indigo-400">Assets Affected</span>
                <div className="text-lg font-bold font-mono text-indigo-400 tabular-nums mt-0.5">
                  {simulationReport.assetsAffectedCount} ({simulationReport.assetsAffectedPercentage}%)
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-rose-400">Newly Failed</span>
                <div className="text-lg font-bold font-mono text-rose-400 tabular-nums mt-0.5">
                  {simulationReport.newlyIntroducedFailures}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-emerald-400">Resolved Failures</span>
                <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                  {simulationReport.resolvedFailures}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-sky-400">Pass Rate Delta</span>
                <div className="text-lg font-bold font-mono text-white tabular-nums mt-0.5 flex items-center gap-1">
                  <span className="text-slate-400">{simulationReport.beforePassRate}%</span>
                  <ArrowRight className="w-3 h-3 text-slate-500" />
                  <span
                    className={
                      simulationReport.afterPassRate >= simulationReport.beforePassRate
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }
                  >
                    {simulationReport.afterPassRate}%
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                <span className="text-[10px] uppercase font-mono text-amber-400">Regression Risk</span>
                <div
                  className={`text-lg font-bold font-mono tabular-nums mt-0.5 ${
                    simulationReport.riskScore === 'High'
                      ? 'text-rose-400'
                      : simulationReport.riskScore === 'Moderate'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {simulationReport.riskScore}
                </div>
              </div>
            </div>

            {/* Methodology Note */}
            <div className="px-4 py-2 bg-slate-950/50 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <div>
                <strong className="text-slate-300">CI Methodology: </strong>
                {simulationReport.methodology}
              </div>
              <span className="font-mono text-slate-500 text-[10px]">
                Executed {simulationReport.timestamp}
              </span>
            </div>

            {/* Asset-by-Asset Simulation Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/40">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                    <th className="py-2.5 px-3">Historical Corporate Asset</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-center">Status Before</th>
                    <th className="py-2.5 px-3 text-center">Status After</th>
                    <th className="py-2.5 px-3">Impact Classification</th>
                    <th className="py-2.5 px-3">Matched Excerpt & Impact Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {simulationReport.assetResults.map((result) => (
                    <tr key={result.assetId} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-200">
                        {result.assetTitle}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        {result.assetType}
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            result.statusBefore === 'Pass'
                              ? 'bg-emerald-950/60 text-emerald-400'
                              : 'bg-rose-950/60 text-rose-400'
                          }`}
                        >
                          {result.statusBefore}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            result.statusAfter === 'Pass'
                              ? 'bg-emerald-950/60 text-emerald-400'
                              : 'bg-rose-950/60 text-rose-400'
                          }`}
                        >
                          {result.statusAfter}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                            result.impactType === 'Resolved'
                              ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-900'
                              : result.impactType === 'Newly Failed'
                              ? 'text-rose-300 bg-rose-950/60 border border-rose-900'
                              : result.impactType === 'Manual Review Required'
                              ? 'text-amber-300 bg-amber-950/60 border border-amber-900'
                              : 'text-slate-400'
                          }`}
                        >
                          {result.impactType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-md">
                        <p className="text-[11px] text-slate-300 font-mono italic">
                          "{result.matchedExcerpt}"
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {result.changeDetail}
                        </p>
                        {onTestRuleInAuditor && result.matchedExcerpt && (
                          <button
                            onClick={() =>
                              onTestRuleInAuditor(
                                result.matchedExcerpt,
                                simulationReport?.ruleCode || ''
                              )
                            }
                            className="mt-1.5 text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono hover:underline"
                          >
                            <ArrowRight className="w-2.5 h-2.5" /> Test Excerpt in Content Auditor
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center bg-slate-950/50 rounded-lg border border-slate-800 text-xs text-slate-400">
            Click <strong>"Run Historical CI Simulation"</strong> to evaluate the proposed rule wording against the 6 seeded corporate assets (press releases, whitepapers, investor ESG reports, pitch decks) to calculate pass rate shifts and potential policy regressions.
          </div>
        )}
      </div>
    </div>
  );
};
