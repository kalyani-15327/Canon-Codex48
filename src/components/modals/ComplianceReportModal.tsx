import React, { useState } from 'react';
import {
  AuditFinding,
  AuditLogEntry,
  BrandGuideline,
  ClaimItem,
  CISimulationReport,
  IntentCardData,
  TeamMember,
} from '../../types';
import { exportJSONFile, exportPDFReport } from '../../services/exportService';
import {
  ShieldCheck,
  Printer,
  Download,
  X,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileCheck2,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface ComplianceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftTitle: string;
  draftAuthor?: string;
  draftText?: string;
  readinessScore: number;
  readinessStatus: string;
  intent: IntentCardData;
  findings: AuditFinding[];
  claims: ClaimItem[];
  guidelines: BrandGuideline[];
  teamMembers: TeamMember[];
  auditLogs: AuditLogEntry[];
  latestCISimulation?: CISimulationReport | null;
  onNotify?: (msg: string, type?: 'success' | 'error') => void;
}

export const ComplianceReportModal: React.FC<ComplianceReportModalProps> = ({
  isOpen,
  onClose,
  draftTitle,
  draftAuthor,
  draftText,
  readinessScore,
  readinessStatus,
  intent,
  findings,
  claims,
  guidelines,
  teamMembers,
  auditLogs,
  latestCISimulation,
  onNotify,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingJSON, setIsExportingJSON] = useState(false);

  if (!isOpen) return null;

  const exportPayload = {
    appTitle: 'Canon',
    draftTitle,
    draftAuthor,
    draftText,
    readinessScore,
    readinessStatus,
    intent,
    findings,
    claims,
    guidelines,
    teamMembers,
    auditLogs,
    latestCISimulation,
  };

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    try {
      const res = await exportPDFReport(exportPayload);
      onNotify?.(`Successfully downloaded ${res.filename}`, 'success');
    } catch (err) {
      console.error(err);
      onNotify?.('Failed to generate PDF report. Please try again.', 'error');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleDownloadJSON = () => {
    setIsExportingJSON(true);
    try {
      const res = exportJSONFile(exportPayload);
      onNotify?.(`Successfully exported ${res.filename}`, 'success');
    } catch (err) {
      console.error(err);
      onNotify?.('Failed to export JSON log. Please try again.', 'error');
    } finally {
      setIsExportingJSON(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const activeViolations = findings.filter((f) => f.status === 'detected');
  const fixedFindings = findings.filter((f) => f.status === 'fixed');
  const overriddenFindings = findings.filter((f) => f.status === 'overridden');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Modal Top Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-inner">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Pre-Publication Governance Certificate & Executive Review
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Document Ref: CANON-GOV-{new Date().getFullYear()}-0994 · Canon
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isExportingPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isExportingPDF ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>

            {/* Export JSON Button */}
            <button
              onClick={handleDownloadJSON}
              disabled={isExportingJSON}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export JSON Log</span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Print document"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Container */}
        <div className="space-y-6 bg-slate-950 p-6 rounded-xl border border-slate-800">
          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="text-xl font-bold tracking-tight text-white font-serif">
                Canon
              </div>
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mt-0.5">
                Executive Brand Governance & Compliance Review
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono text-slate-400">Date of Attestation</div>
              <div className="text-sm font-semibold text-white font-mono">
                {new Date().toISOString().slice(0, 10)}
              </div>
            </div>
          </div>

          {/* Draft Subject */}
          <div className="p-4 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">
              Subject Publication Under Audit:
            </span>
            <div className="text-sm font-semibold text-white">{draftTitle}</div>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400 font-mono">
              <span>Readiness Score: <strong className="text-emerald-400">{readinessScore}%</strong></span>
              <span>·</span>
              <span>Status: <strong className="text-indigo-400">{readinessStatus}</strong></span>
              <span>·</span>
              <span>Intent Preservation: <strong className="text-emerald-400">{intent.intentPreservationScores.balanced}%</strong></span>
            </div>
          </div>

          {/* Intent & Strategy Profile */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              1. Semantic Intent & Persona Alignment
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Purpose:</span>
                <span className="text-slate-200">{intent.primaryPurpose}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Target Audience:</span>
                <span className="text-slate-200">{intent.targetAudience}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Must-Keep Key Terms:</span>
                <span className="text-slate-200 font-mono text-[11px]">
                  {intent.mustKeepTerms.join(' · ')}
                </span>
              </div>
            </div>
          </div>

          {/* Claim Ledger Verification Matrix Summary */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
                2. Factual Claim Verification Matrix ({claims.length} Claims Tracked)
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Verified: {claims.filter((c) => c.status === 'Verified').length} / {claims.length}
              </span>
            </div>

            <div className="overflow-x-auto rounded border border-slate-800 text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Claim Proposition</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Supporting Evidence / Lab Certification</th>
                    <th className="py-2 px-3 text-right">Valid Thru</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {claims.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2 px-3 font-medium text-slate-200 max-w-xs truncate">
                        "{c.claimText}"
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px]">
                        <span
                          className={
                            c.status === 'Verified'
                              ? 'text-emerald-400 font-semibold'
                              : c.status === 'Expired Evidence'
                              ? 'text-amber-400 font-semibold'
                              : 'text-rose-400 font-semibold'
                          }
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-300 text-[11px] max-w-sm truncate">
                        {c.evidenceCitation}
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-[11px] text-slate-400">
                        {c.expiryDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Governance Findings Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              3. Brand Policy Findings & Override Register
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                <span className="text-slate-400 text-[10px] uppercase font-mono">Unresolved Infractions</span>
                <div className="text-base font-bold font-mono text-white tabular-nums mt-0.5">
                  {activeViolations.length}
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                <span className="text-emerald-400 text-[10px] uppercase font-mono">Applied Corrections</span>
                <div className="text-base font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                  {fixedFindings.length}
                </div>
              </div>
              <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                <span className="text-amber-400 text-[10px] uppercase font-mono">Authorized Legal Overrides</span>
                <div className="text-base font-bold font-mono text-amber-400 tabular-nums mt-0.5">
                  {overriddenFindings.length}
                </div>
              </div>
            </div>
          </div>

          {/* Legal Signatures / Council Attestation */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              4. Digital Governance Sign-offs
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Beatrix Holzer</span>
                  <span className="text-[10px] font-mono text-emerald-400">✓ Digitally Signed</span>
                </div>
                <div className="text-[11px] text-slate-400">Lead Regulatory & Compliance Counsel</div>
                <div className="text-[10px] font-mono text-slate-500">
                  SHA-256 Hash: 4f82...b39a · Signed {new Date().toISOString().slice(0, 10)}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Julian Vance</span>
                  <span className="text-[10px] font-mono text-emerald-400">✓ Digitally Signed</span>
                </div>
                <div className="text-[11px] text-slate-400">Global Brand Governance Director</div>
                <div className="text-[10px] font-mono text-slate-500">
                  SHA-256 Hash: 99c1...e420 · Signed {new Date().toISOString().slice(0, 10)}
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-[10px] text-slate-500 leading-relaxed pt-2 border-t border-slate-800/60">
            <strong>Regulatory & Demonstration Disclosure:</strong> This document certifies simulated pre-publication compliance testing conducted on the Canon Enterprise Brand Governance Platform.
          </div>
        </div>
      </div>
    </div>
  );
};
