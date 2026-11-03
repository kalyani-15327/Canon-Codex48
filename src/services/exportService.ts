/**
 * Canon - Enterprise Export Service
 * High-fidelity PDF generation via jsPDF & jspdf-autotable, and JSON state exporter.
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  AuditFinding,
  AuditLogEntry,
  BrandGuideline,
  ClaimItem,
  CISimulationReport,
  HistoricalAsset,
  IntentCardData,
  TeamMember,
} from '../types';

export interface ComprehensiveExportData {
  appTitle?: string;
  draftTitle: string;
  draftAuthor?: string;
  draftText?: string;
  readinessScore: number;
  readinessStatus: string;
  intent: IntentCardData;
  findings: AuditFinding[];
  claims: ClaimItem[];
  guidelines: BrandGuideline[];
  historicalAssets?: HistoricalAsset[];
  teamMembers: TeamMember[];
  auditLogs: AuditLogEntry[];
  latestCISimulation?: CISimulationReport | null;
}

/**
 * Downloads valid JSON file to the user's local device
 */
export function exportJSONFile(data: ComprehensiveExportData): { success: boolean; filename: string } {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const filename = `Canon_Audit_Log_${today}.json`;

    // Construct comprehensive, structured payload of current application state
    const payload = {
      application: 'Canon',
      reportTitle: 'Enterprise Brand Governance & Pre-Publication Compliance Log',
      exportTimestamp: new Date().toISOString(),
      currentDraft: {
        title: data.draftTitle,
        author: data.draftAuthor || 'Corporate Communications',
        wordCount: data.draftText ? data.draftText.trim().split(/\s+/).length : 0,
        textSample: data.draftText || '',
        intentProfile: data.intent,
      },
      publicationReadiness: {
        score: data.readinessScore,
        status: data.readinessStatus,
        activeViolationsCount: data.findings.filter((f) => f.status === 'detected').length,
        fixedFindingsCount: data.findings.filter((f) => f.status === 'fixed').length,
        overriddenFindingsCount: data.findings.filter((f) => f.status === 'overridden').length,
        unsupportedClaimsCount: data.claims.filter((c) => c.status === 'Unsupported').length,
        expiredClaimsCount: data.claims.filter((c) => c.status === 'Expired Evidence').length,
      },
      contentAuditFindings: data.findings,
      claimVerificationLedger: data.claims,
      brandGuidelinesRegistry: data.guidelines,
      latestCISimulationResults: data.latestCISimulation || null,
      teamContributionLedger: data.teamMembers,
      auditTrailLog: data.auditLogs,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);

    return { success: true, filename };
  } catch (error) {
    console.error('Failed to export JSON log:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown JSON export failure');
  }
}

/**
 * Generates and downloads a multi-page, formatted PDF governance certificate
 */
export async function exportPDFReport(data: ComprehensiveExportData): Promise<{ success: boolean; filename: string }> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const filename = `Canon_Governance_Report_${today}.pdf`;

    // Initialize portrait A4 document (210 x 297 mm)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;

    // Helper: Draw section title banner
    const drawSectionHeader = (title: string, yPos: number): number => {
      // Check if near page boundary
      if (yPos > pageHeight - 35) {
        doc.addPage();
        yPos = margin + 10;
      }
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(margin, yPos, contentWidth, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text(title.toUpperCase(), margin + 3, yPos + 4.8);
      return yPos + 10;
    };

    // ==========================================
    // PAGE 1: HEADER & EXECUTIVE SUMMARY
    // ==========================================

    // Top Brand Accent Stripe
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Brand Title & Meta
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text('Canon', margin, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text('Enterprise Brand Governance & Pre-Publication Compliance Certificate', margin, 19);

    // Right-aligned Document Meta
    doc.setFontSize(8);
    doc.text(`Attestation Date: ${today}`, pageWidth - margin, 14, { align: 'right' });
    doc.text(`Ref: CANON-GOV-${today.replace(/-/g, '')}`, pageWidth - margin, 19, { align: 'right' });

    // Hairline divider
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.4);
    doc.line(margin, 22, pageWidth - margin, 22);

    let currentY = 26;

    // Draft Title & Overall Readiness Box
    doc.setFillColor(248, 250, 252); // Slate 50
    doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');
    doc.setDrawColor(203, 213, 225); // Slate 300
    doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('PUBLICATION UNDER AUDIT:', margin + 3, currentY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    const splitTitle = doc.splitTextToSize(data.draftTitle, contentWidth - 45);
    doc.text(splitTitle, margin + 3, currentY + 10);

    // Score Circle / Badge on the right
    const scoreX = pageWidth - margin - 22;
    const scoreY = currentY + 12;

    const isApproved = data.readinessStatus === 'Approved for Publication';
    const isBlocked = data.readinessStatus === 'Publication Blocked';

    if (isApproved) {
      doc.setFillColor(16, 185, 129); // emerald
    } else if (isBlocked) {
      doc.setFillColor(239, 68, 68); // rose
    } else {
      doc.setFillColor(245, 158, 11); // amber
    }
    doc.circle(scoreX, scoreY, 8.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(`${data.readinessScore}%`, scoreX, scoreY + 2.5, { align: 'center' });

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isApproved ? 16 : isBlocked ? 220 : 180, isApproved ? 140 : 38, isApproved ? 80 : 38);
    doc.text(data.readinessStatus.toUpperCase(), scoreX, currentY + 23, { align: 'center' });

    currentY += 28;

    // Executive Metrics Grid
    const activeFindingsCount = data.findings.filter((f) => f.status === 'detected').length;
    const fixedFindingsCount = data.findings.filter((f) => f.status === 'fixed').length;
    const overriddenCount = data.findings.filter((f) => f.status === 'overridden').length;
    const unsupportedClaimsCount = data.claims.filter((c) => c.status === 'Unsupported').length;
    const expiredClaimsCount = data.claims.filter((c) => c.status === 'Expired Evidence').length;

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      head: [
        [
          'Active Violations',
          'Applied Fixes',
          'Legal Overrides',
          'Unsupported Claims',
          'Expired Benchmarks',
          'Intent Preservation',
        ],
      ],
      body: [
        [
          `${activeFindingsCount}`,
          `${fixedFindingsCount}`,
          `${overriddenCount}`,
          `${unsupportedClaimsCount}`,
          `${expiredClaimsCount}`,
          `Balanced: ${data.intent.intentPreservationScores.balanced}%`,
        ],
      ],
      headStyles: {
        fillColor: [30, 41, 59], // Slate 800
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        fontSize: 8,
        halign: 'center',
        fontStyle: 'bold',
        textColor: [15, 23, 42],
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 7;

    // SECTION 1: INTENT ENGINE PROFILE
    currentY = drawSectionHeader('1. Intent Profile & Strategic Alignment (Pre-Correction)', currentY);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'striped',
      head: [['Dimension', 'Extracted Specification & Brand Parameters']],
      body: [
        ['Primary Purpose', data.intent.primaryPurpose],
        ['Target Audience', data.intent.targetAudience],
        ['Core Persona', data.intent.corePersona],
        ['Must-Keep Key Terms', data.intent.mustKeepTerms.join(' · ')],
        [
          'Intent Scores by Tier',
          `Minimal: ${data.intent.intentPreservationScores.minimal}%  |  Balanced (Recommended): ${data.intent.intentPreservationScores.balanced}%  |  Executive Reframe: ${data.intent.intentPreservationScores.reframe}%`,
        ],
      ],
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 42, fontStyle: 'bold', textColor: [30, 41, 59] },
        1: { cellWidth: contentWidth - 42, textColor: [51, 65, 85] },
      },
      bodyStyles: { fontSize: 7.5 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    // SECTION 2: AUDIT FINDINGS TABLE
    currentY = drawSectionHeader(`2. Brand Policy & Regulatory Audit Findings (${data.findings.length} Evaluated)`, currentY);

    const findingsTableRows = data.findings.map((f) => [
      f.guidelineRef,
      f.category,
      f.severity,
      f.status.toUpperCase(),
      f.title,
      f.status === 'overridden' && f.overrideReason
        ? `OVERRIDE: ${f.overrideReason}`
        : f.status === 'fixed'
        ? `FIXED: Replaced with "${f.suggestedFix}"`
        : `FLAGGED: "${f.originalSegment.slice(0, 90)}..."`,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      head: [['Rule Code', 'Category', 'Severity', 'Status', 'Finding Summary', 'Resolution / Context']],
      body: findingsTableRows.length > 0 ? findingsTableRows : [['-', 'All Rules', 'None', 'PASS', 'No non-compliant findings detected in current draft.', '-']],
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 24, fontStyle: 'bold' },
        1: { cellWidth: 26 },
        2: { cellWidth: 18, halign: 'center' },
        3: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 38 },
        5: { cellWidth: contentWidth - (24 + 26 + 18 + 22 + 38) },
      },
      bodyStyles: { fontSize: 7 },
      didParseCell: (hookData) => {
        if (hookData.section === 'body') {
          if (hookData.column.index === 2) {
            // Severity column styling
            const val = hookData.cell.raw;
            if (val === 'High') hookData.cell.styles.textColor = [220, 38, 38];
            if (val === 'Medium') hookData.cell.styles.textColor = [217, 119, 6];
          }
          if (hookData.column.index === 3) {
            const val = hookData.cell.raw;
            if (val === 'DETECTED') hookData.cell.styles.textColor = [220, 38, 38];
            if (val === 'FIXED') hookData.cell.styles.textColor = [16, 185, 129];
            if (val === 'OVERRIDDEN') hookData.cell.styles.textColor = [217, 119, 6];
          }
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    // SECTION 3: CLAIM LEDGER & VERIFICATION MATRIX
    currentY = drawSectionHeader(`3. Claim Ledger & Verification Matrix (${data.claims.length} Claims Tracked)`, currentY);

    const claimsTableRows = data.claims.map((c) => [
      `"${c.claimText.slice(0, 80)}${c.claimText.length > 80 ? '...' : ''}"`,
      c.status.toUpperCase(),
      c.riskLevel,
      c.owner,
      c.evidenceCitation.slice(0, 85),
      c.expiryDate,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      head: [['Claim Proposition Statement', 'Status', 'Risk', 'Assigned Owner', 'Supporting Citation / Lab Artifact', 'Expiry']],
      body: claimsTableRows,
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
        2: { cellWidth: 16, halign: 'center' },
        3: { cellWidth: 26 },
        4: { cellWidth: contentWidth - (50 + 26 + 16 + 26 + 20) },
        5: { cellWidth: 20, halign: 'right' },
      },
      bodyStyles: { fontSize: 7 },
      didParseCell: (hookData) => {
        if (hookData.section === 'body' && hookData.column.index === 1) {
          const val = hookData.cell.raw;
          if (val === 'VERIFIED') hookData.cell.styles.textColor = [16, 185, 129];
          if (val === 'UNSUPPORTED') hookData.cell.styles.textColor = [220, 38, 38];
          if (val === 'EXPIRED EVIDENCE') hookData.cell.styles.textColor = [217, 119, 6];
          if (val === 'UNDER LEGAL REVIEW') hookData.cell.styles.textColor = [2, 132, 199];
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    // SECTION 4: GUIDELINE HEALTH & HISTORICAL CI SIMULATION
    currentY = drawSectionHeader('4. Guideline Health & Historical CI Simulation', currentY);

    const avgDispute = Math.round(
      data.guidelines.reduce((acc, g) => acc + g.disputeFrequency, 0) / (data.guidelines.length || 1)
    );
    const avgAmbiguity = Math.round(
      data.guidelines.reduce((acc, g) => acc + g.ambiguityScore, 0) / (data.guidelines.length || 1)
    );

    const ciSummaryText = data.latestCISimulation
      ? `Simulated Rule: ${data.latestCISimulation.ruleCode} (${data.latestCISimulation.ruleName})\n` +
        `Pass Rate Delta: ${data.latestCISimulation.beforePassRate}% -> ${data.latestCISimulation.afterPassRate}%\n` +
        `Newly Failed (Regressions): ${data.latestCISimulation.newlyIntroducedFailures}  |  Resolved Past Failures: ${data.latestCISimulation.resolvedFailures}  |  Risk Rating: ${data.latestCISimulation.riskScore}`
      : 'Historical CI Suite Status: Seeded baseline across 6 corporate assets (2024–2026). Ready for simulated rule evaluation.';

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      head: [['Active Rules', 'Avg Dispute Rate', 'Ambiguity Index', 'Conflicting Directives', 'Historical CI Simulation Summary']],
      body: [
        [
          `${data.guidelines.filter((g) => g.status === 'Active').length} Active`,
          `${avgDispute}%`,
          `${avgAmbiguity}%`,
          '2 Directives',
          ciSummaryText,
        ],
      ],
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 24, halign: 'center' },
        1: { cellWidth: 24, halign: 'center' },
        2: { cellWidth: 24, halign: 'center' },
        3: { cellWidth: 28, halign: 'center' },
        4: { cellWidth: contentWidth - (24 + 24 + 24 + 28) },
      },
      bodyStyles: { fontSize: 7 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    // SECTION 5: AUDIT TRAIL LOG
    currentY = drawSectionHeader(`5. Governance Audit Trail (${data.auditLogs.length} Recorded Actions)`, currentY);

    const auditTrailRows = data.auditLogs.slice(0, 15).map((log) => [
      log.timestamp,
      log.action,
      log.category,
      log.user,
      log.details.slice(0, 110),
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'grid',
      head: [['Timestamp', 'Action Executed', 'Category', 'Author / User', 'Details & Context']],
      body: auditTrailRows,
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 32, fontStyle: 'bold' },
        1: { cellWidth: 36 },
        2: { cellWidth: 26 },
        3: { cellWidth: 26 },
        4: { cellWidth: contentWidth - (32 + 36 + 26 + 26) },
      },
      bodyStyles: { fontSize: 6.8 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;

    // SECTION 6: DIGITAL SIGNATORIES & ATTESTATION
    currentY = drawSectionHeader('6. Digital Signatories & Governance Attestation', currentY);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      theme: 'plain',
      body: [
        [
          'Beatrix Holzer\nLead Regulatory & Compliance Counsel\nStatus: Digitally Signed\nSHA-256: 4f82a901...b39e24',
          'Julian Vance\nGlobal Brand Governance Director\nStatus: Digitally Signed\nSHA-256: 99c15fe8...e42008',
        ],
        [
          'Legal Disclaimer: This certificate attests to simulated pre-publication compliance checks performed on the Canon Enterprise Platform.',
          `Generated: ${new Date().toISOString()} | Canon Build Engine`,
        ],
      ],
      columnStyles: {
        0: { cellWidth: contentWidth / 2, fontStyle: 'bold', fontSize: 7, textColor: [30, 41, 59] },
        1: { cellWidth: contentWidth / 2, fontStyle: 'bold', fontSize: 7, textColor: [30, 41, 59] },
      },
    });

    // ==========================================
    // FOOTER ON EVERY PAGE (Page X of Y)
    // ==========================================
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Bottom hairline
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184); // Slate 400
      doc.text(
        'Canon  ·  Enterprise Brand Governance Platform  ·  Strictly Confidential',
        margin,
        pageHeight - 7
      );
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin,
        pageHeight - 7,
        { align: 'right' }
      );
    }

    // Output as Blob and trigger standard browser download
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1500);

    return { success: true, filename };
  } catch (error) {
    console.error('Failed to generate and download PDF report:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown PDF generation error');
  }
}

/**
 * Generates and directly downloads a multi-page PDF containing the Governance Audit Trail records
 */
export async function exportAuditTrailPDF(
  logs: AuditLogEntry[]
): Promise<{ success: boolean; filename: string }> {
  try {
    const filename = 'Canon_Governance_Audit_Trail.pdf';
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;
    const contentWidth = pageWidth - margin * 2;
    const today = new Date().toISOString().slice(0, 10);

    // Top Brand Accent Stripe
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Brand Title & Meta
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42); // Slate 900
    doc.text('Canon', margin, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text('Pre-Publication Governance Audit Trail — Immutable Record Log', margin, 19);

    // Right-aligned Document Meta
    doc.setFontSize(8);
    doc.text(`Generated: ${today}`, pageWidth - margin, 14, { align: 'right' });
    doc.text(`Records: ${logs.length}`, pageWidth - margin, 19, { align: 'right' });

    // Hairline divider
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.4);
    doc.line(margin, 22, pageWidth - margin, 22);

    let currentY = 28;

    // Overview summary box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, contentWidth, 14, 2, 2, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('AUDIT TRAIL OVERVIEW', margin + 4, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      `Official immutable log of ${logs.length} recorded brand governance actions, claim verifications, legal overrides, and CI test executions.`,
      margin + 4,
      currentY + 10
    );

    currentY += 19;

    // Map all audit log entries to table rows
    const rows = logs.map((log) => [
      log.timestamp,
      log.action,
      log.category,
      log.user,
      log.details,
    ]);

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin, bottom: 16 },
      theme: 'grid',
      head: [['Timestamp', 'Action Executed', 'Category', 'User / Author', 'Audit Details & Context']],
      body: rows,
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 32, fontStyle: 'bold' },
        1: { cellWidth: 36 },
        2: { cellWidth: 26 },
        3: { cellWidth: 26 },
        4: { cellWidth: contentWidth - (32 + 36 + 26 + 26) },
      },
      bodyStyles: {
        fontSize: 6.8,
        textColor: [30, 41, 59],
        overflow: 'linebreak',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    // Page numbering and footer on every page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        'Canon · Enterprise Brand Governance & Pre-Publication Review Platform',
        margin,
        pageHeight - 7
      );
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 7, { align: 'right' });
    }

    // Trigger direct browser download
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1500);

    return { success: true, filename };
  } catch (error) {
    console.error('Failed to export Audit Trail PDF:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown Audit Trail PDF export failure');
  }
}
