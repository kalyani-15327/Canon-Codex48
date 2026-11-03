import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ApprovedFact,
  AuditFinding,
  AuditLogEntry,
  BrandGuideline,
  ClaimItem,
  ContentItem,
  CorporateDraftSample,
  CorrectionTier,
  EvidenceArtifact,
  HistoricalAsset,
  IntentCardData,
  TeamMember,
  TierCorrectionDetail,
} from './types';
import {
  INITIAL_AUDIT_LOGS,
  INITIAL_BRAND_GUIDELINES,
  INITIAL_CLAIMS,
  INITIAL_DRAFTS,
  INITIAL_HISTORICAL_ASSETS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_APPROVED_FACTS,
  INITIAL_CONTENT_ITEMS,
} from './services/seedData';
import {
  calculatePublicationReadiness,
  extractIntentProfile,
  generateCorrectionTiers,
  runBrandAudit,
} from './services/auditEngine';
import { extractAndVerifyClaims } from './services/claimExtractor';
import { exportJSONFile, exportPDFReport, exportAuditTrailPDF } from './services/exportService';
import { Header, NavTabType } from './components/Header';
import { IntentCardView } from './components/IntentCardView';
import { TrackedDiffViewer } from './components/TrackedDiffViewer';
import { AuditFindingsList } from './components/AuditFindingsList';
import { ReadinessSummaryCard } from './components/ReadinessSummaryCard';
import { ClaimLedgerView } from './components/ClaimLedgerView';
import { GuidelineHealthView } from './components/GuidelineHealthView';
import { AuditTrailView } from './components/AuditTrailView';
import { CanonGatewayView } from './components/gateway/CanonGatewayView';
import { CanonWatchView } from './components/watch/CanonWatchView';
import { FormatAdaptersView } from './components/adapters/FormatAdaptersView';

// Modals
import { OverrideModal } from './components/modals/OverrideModal';
import { EscalateModal } from './components/modals/EscalateModal';
import { AddFactModal } from './components/modals/AddFactModal';
import { ClaimInspectModal } from './components/modals/ClaimInspectModal';
import { EditGuidelineModal } from './components/modals/EditGuidelineModal';
import { ComplianceReportModal } from './components/modals/ComplianceReportModal';
import { EvidencePreviewModal } from './components/modals/EvidencePreviewModal';

import {
  Play,
  RotateCcw,
  Sparkles,
  FileText,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  FileEdit,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  // Navigation tab state (7 sections)
  const [activeTab, setActiveTab] = useState<NavTabType>('auditor');

  // Persistence keys
  const STORAGE_KEY_PREFIX = 'canon_gov_v1_';

  // Shared Content System across all 7 tabs
  const [contentItems, setContentItems] = useState<ContentItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}content_items`);
    return saved ? JSON.parse(saved) : INITIAL_CONTENT_ITEMS;
  });

  const [selectedContentId, setSelectedContentId] = useState<string>(() => {
    return (
      localStorage.getItem(`${STORAGE_KEY_PREFIX}selected_content_id`) ||
      INITIAL_CONTENT_ITEMS[0].id
    );
  });

  const activeContentItem = useMemo(() => {
    return (
      contentItems.find((c) => c.id === selectedContentId) ||
      contentItems[0] ||
      INITIAL_CONTENT_ITEMS[0]
    );
  }, [contentItems, selectedContentId]);

  // Backward-compatible draft sample representation
  const activeDraftSample = useMemo(() => {
    return {
      id: activeContentItem.id,
      title: activeContentItem.title,
      author: activeContentItem.author,
      date: activeContentItem.createdDate,
      originalText: activeContentItem.originalText,
      intent:
        activeContentItem.intent || {
          primaryPurpose: 'Assertive, Commercial Promotional Merchant Acquisition',
          targetAudience: 'Tier-1 Retailers & High-Growth Merchants',
          corePersona: 'Fintech merchant acquirer & treasury officer',
          mustKeepTerms: ['Fernwick Pay', 'Instant Approval', 'Zero Processing Fees'],
          intentPreservationScores: {
            minimal: 96,
            balanced: 91,
            reframe: 84,
          },
        },
      category: activeContentItem.contentType,
    };
  }, [activeContentItem]);

  const [draftText, setDraftText] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}draft_text`);
    return saved || activeContentItem.workingText;
  });

  const [intentData, setIntentData] = useState<IntentCardData | null>(() => activeContentItem.intent || null);

  const [guidelines, setGuidelines] = useState<BrandGuideline[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}guidelines`);
    return saved ? JSON.parse(saved) : INITIAL_BRAND_GUIDELINES;
  });

  const [claims, setClaims] = useState<ClaimItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}claims`);
    return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
  });

  // Approved Facts Registry (shared across Gateway, Watch & Claim Ledger)
  const [approvedFacts, setApprovedFacts] = useState<ApprovedFact[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}approved_facts`);
    return saved ? JSON.parse(saved) : INITIAL_APPROVED_FACTS;
  });

  const [historicalAssets] = useState<HistoricalAsset[]>(INITIAL_HISTORICAL_ASSETS);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}team`);
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}logs`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Selected correction tier
  const [selectedTier, setSelectedTier] = useState<CorrectionTier>('balanced');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [hasAudited, setHasAudited] = useState<boolean>(false);
  const [isOutdated, setIsOutdated] = useState<boolean>(false);
  const lastAuditedDraftText = useRef<string>('');
  const [isSignedOff, setIsSignedOff] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [latestCISimulation, setLatestCISimulation] = useState<any>(null);

  // Active findings state (empty until user explicitly executes Brand & Intent Audit)
  const [findings, setFindings] = useState<AuditFinding[]>(() => activeContentItem.findings || []);

  // Transferred Draft Metadata & Telemetry from connected modules (Gateway, Adapters, Watch)
  const [customDraftMeta, setCustomDraftMeta] = useState<{
    contentId?: string;
    source: string;
    sourceTitle: string;
    sourceContext?: string;
    srtTelemetry?: {
      captionCount: number;
      avgCps: number;
      maxCps: number;
      exceededCount: number;
      threshold: number;
    };
  } | null>(() => {
    if (activeContentItem.source !== 'Corporate Knowledge Base') {
      return {
        contentId: activeContentItem.id,
        source: activeContentItem.source,
        sourceTitle: activeContentItem.title,
        sourceContext: activeContentItem.sourceContext,
      };
    }
    return null;
  });

  // Focus target guideline rule for cross-tab jump to Guideline Health & CI
  const [focusedRuleCode, setFocusedRuleCode] = useState<string | undefined>(undefined);

  // Modals state
  const [overrideModalFinding, setOverrideModalFinding] = useState<AuditFinding | null>(null);
  const [escalateModalClaim, setEscalateModalClaim] = useState<ClaimItem | null>(null);
  const [inspectModalClaim, setInspectModalClaim] = useState<ClaimItem | null>(null);
  const [evidenceModalClaim, setEvidenceModalClaim] = useState<ClaimItem | null>(null);
  const [editGuidelineTarget, setEditGuidelineTarget] = useState<BrandGuideline | null>(null);
  const [isAddFactOpen, setIsAddFactOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}content_items`, JSON.stringify(contentItems));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}selected_content_id`, selectedContentId);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}draft_text`, draftText);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}guidelines`, JSON.stringify(guidelines));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}claims`, JSON.stringify(claims));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}approved_facts`, JSON.stringify(approvedFacts));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}team`, JSON.stringify(teamMembers));
    localStorage.setItem(`${STORAGE_KEY_PREFIX}logs`, JSON.stringify(auditLogs));
  }, [contentItems, selectedContentId, draftText, guidelines, claims, approvedFacts, teamMembers, auditLogs]);

  // Update approved fact handler (synchronized across Watch, Claim Ledger & Audit Trail)
  const handleUpdateApprovedFact = (factId: string, newValue: string, notes?: string) => {
    const existingFact = approvedFacts.find((f) => f.id === factId);
    const oldValue = existingFact ? existingFact.value : '';

    setApprovedFacts((prev) =>
      prev.map((f) => {
        if (f.id === factId) {
          return {
            ...f,
            previousValue: f.value,
            value: newValue,
            status: 'Updated',
            lastUpdated: new Date().toISOString().slice(0, 10),
            notes: notes || f.notes,
          };
        }
        return f;
      })
    );

    // Invalidate dependent claims if fact value changed (e.g. Fernwick Pay price ₹50,000 -> ₹25,000)
    if (factId === 'fact-fernwick-price' || factId === 'FACT-PRICE-01') {
      setClaims((prev) =>
        prev.map((c) => {
          if (c.id === 'claim-fernwick-price' || c.claimText.includes(oldValue)) {
            return {
              ...c,
              status: 'Unsupported' as const,
              history: [
                {
                  id: `h-sync-${Date.now()}`,
                  action: 'Fact Update Drift Detected',
                  author: 'Canon Watch Daemon',
                  timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                  note: `Approved Fact ${factId} changed from ${oldValue} to ${newValue}. Claim marked Unsupported (Needs Action) pending revised evidence verification.`,
                },
                ...c.history,
              ],
            };
          }
          return c;
        })
      );
    }

    recordAuditLog(
      `Approved Fact Updated: ${factId}`,
      'Approved Fact Added',
      `Fact [${factId}] updated from "${oldValue}" to "${newValue}". Flagged dependent claims and published collateral.`,
      factId
    );
  };

  // Gateway draft registration handler
  const handleSaveContentDraft = (draft: { id: string; title: string; text: string; source: string }) => {
    setContentItems((prev) => {
      const exists = prev.some((c) => c.id === draft.id);
      if (exists) return prev;
      const newItem: ContentItem = {
        id: draft.id,
        title: draft.title,
        originalText: draft.text,
        workingText: draft.text,
        contentType: 'Digital Advertisement',
        source: 'Canon Gateway',
        author: 'Canon Gateway AI Agent',
        createdDate: new Date().toISOString().replace('T', ' ').slice(0, 10),
        updatedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reviewStatus: 'draft',
        auditVersion: 0,
        correctionHistory: [],
      };
      return [newItem, ...prev];
    });
  };

  // Transfer text from Gateway / Watch / Format Adapters into Canon Content Auditor
  const handleSendToAuditor = (
    text: string,
    meta?: {
      contentId?: string;
      source?: string;
      sourceTitle?: string;
      sourceContext?: string;
      srtTelemetry?: {
        captionCount: number;
        avgCps: number;
        maxCps: number;
        exceededCount: number;
        threshold: number;
      };
    }
  ) => {
    const targetContentId = meta?.contentId || `content-${Date.now()}`;
    const targetTitle = meta?.sourceTitle || 'Transferred Draft';
    const targetSource = (meta?.source as any) || 'External Ingestion';

    // Register or update in shared ContentItems store
    setContentItems((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === targetContentId);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          workingText: text,
          updatedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };
        return copy;
      }
      const newItem: ContentItem = {
        id: targetContentId,
        title: targetTitle,
        originalText: text,
        workingText: text,
        contentType:
          targetSource === 'SRT Subtitles Adapter'
            ? 'Video Subtitles'
            : targetSource === 'HTML Email Adapter'
            ? 'HTML Email'
            : 'Digital Advertisement',
        source: targetSource,
        sourceContext: meta?.sourceContext,
        author: 'Content Ingestion Pipeline',
        createdDate: new Date().toISOString().replace('T', ' ').slice(0, 10),
        updatedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
        reviewStatus: 'draft',
        auditVersion: 0,
        correctionHistory: [],
      };
      return [newItem, ...prev];
    });

    setSelectedContentId(targetContentId);
    setDraftText(text);
    setHasAudited(false);
    setFindings([]);
    setIntentData(null);
    setIsOutdated(false);
    lastAuditedDraftText.current = '';
    setIsSignedOff(false);

    setCustomDraftMeta(
      meta
        ? {
            contentId: targetContentId,
            source: meta.source || 'External Ingestion',
            sourceTitle: targetTitle,
            sourceContext: meta.sourceContext,
            srtTelemetry: meta.srtTelemetry,
          }
        : null
    );

    setActiveTab('auditor');
    showToast(
      `Content transferred from ${meta?.source || 'module'} into Content Auditor with ID ${targetContentId}. Ready to audit.`,
      'success'
    );
  };

  // Cross-tab: Review Claim in Ledger (matches existing claim or creates Unsupported entry)
  const handleReviewClaimInLedger = (finding: AuditFinding) => {
    const cleanSegment = finding.originalSegment.trim().toLowerCase();
    let matchingClaim = claims.find(
      (c) =>
        c.claimText.toLowerCase().includes(cleanSegment) ||
        cleanSegment.includes(c.claimText.toLowerCase())
    );

    if (!matchingClaim) {
      // Create new claim item with 'Unsupported' status
      const newClaimId = `claim-audit-${Date.now()}`;
      const newClaim: ClaimItem = {
        id: newClaimId,
        contentId: selectedContentId,
        contentTitle: customDraftMeta?.sourceTitle || activeContentItem.title,
        auditVersion: activeContentItem.auditVersion || 1,
        isActive: true,
        claimText: finding.originalSegment,
        draftContext: finding.explanation,
        category: finding.category === 'Claims' ? 'Performance' : 'Security',
        status: 'Unsupported',
        evidenceLink: 'https://governance.internal/exhibits/pending',
        evidenceCitation: 'Pending Specialist Evidence & Legal Accreditation',
        evidenceDate: new Date().toISOString().slice(0, 10),
        expiryDate: 'Pending Verification',
        riskLevel: finding.severity === 'High' ? 'Critical' : 'Moderate',
        owner: 'Elena Rostova (Marketing)',
        history: [
          {
            id: `h-audit-${Date.now()}`,
            action: 'Flagged by Content Auditor',
            author: 'Canon Audit Engine',
            timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
            note: `Detected via rule ${finding.guidelineRef}: "${finding.explanation}". Marked Unsupported until valid evidence certificate attached.`,
          },
        ],
      };

      setClaims((prev) => [newClaim, ...prev]);
      matchingClaim = newClaim;
      recordAuditLog(
        'Audit Finding Registered in Claim Ledger',
        'Correction',
        `Unverified claim segment "${finding.originalSegment}" added as Unsupported claim in Claim Ledger for specialist review.`,
        newClaimId
      );
    }

    setInspectModalClaim(matchingClaim);
    setActiveTab('claims');
    showToast(`Claim opened in Claim Ledger & Verification Matrix: ${matchingClaim.id}`);
  };

  // Cross-tab: Navigate to Guideline Health & CI
  const handleNavigateToGuideline = (guidelineRef: string) => {
    const codeMatch = guidelineRef.match(/(Rule-[A-Z0-9-]+)/i);
    const ruleCode = codeMatch ? codeMatch[1] : guidelineRef.split(':')[0].trim();
    setFocusedRuleCode(ruleCode);
    setActiveTab('guidelines');
    showToast(`Navigated to guideline rule: ${ruleCode}`);
  };

  // Cross-tab: Test rule in Content Auditor
  const handleTestRuleInAuditor = (sampleText: string, ruleCode: string) => {
    handleSendToAuditor(sampleText, {
      source: 'Guideline CI',
      sourceTitle: `Rule Verification Test: ${ruleCode}`,
      sourceContext: `Simulated excerpt testing active policy enforcement for ${ruleCode}`,
    });
  };

  // Cross-tab: Navigate to Canon Watch
  const handleNavigateToWatch = (factCode?: string) => {
    setActiveTab('watch');
    showToast(`Navigated to Canon Watch Published Content Monitor${factCode ? ` (${factCode})` : ''}`);
  };

  // Cross-tab: Navigate to Audit Trail with search/filter
  const handleNavigateToAuditLog = (relatedId?: string) => {
    setActiveTab('audit-log');
    showToast(`Opened Audit Trail & Team Compliance Log${relatedId ? ` for ${relatedId}` : ''}`);
  };

  // Toast notification helper
  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Record audit log helper
  const recordAuditLog = (
    action: string,
    category: AuditLogEntry['category'],
    details: string,
    relatedId?: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      action,
      category,
      user: 'Beatrix Holzer (Legal)',
      details,
      relatedId,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Helper: Gather complete current application state for exports
  const getComprehensiveExportData = () => ({
    appTitle: 'Canon',
    draftTitle: activeDraftSample.title,
    draftAuthor: activeDraftSample.author,
    draftText,
    readinessScore: readinessSummary.score,
    readinessStatus: readinessSummary.status,
    intent: intentData || activeDraftSample.intent,
    findings,
    claims,
    guidelines,
    historicalAssets,
    teamMembers,
    auditLogs,
    latestCISimulation,
  });

  // Export PDF Report handler
  const handleExportReportPDF = async () => {
    if (isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    showToast('Generating official PDF governance report...', 'success');
    try {
      const data = getComprehensiveExportData();
      const result = await exportPDFReport(data);
      showToast(`Report downloaded: ${result.filename}`, 'success');
      recordAuditLog(
        'Downloaded PDF Governance Report',
        'Publication Sign-off',
        `Generated and downloaded official PDF compliance certificate: ${result.filename}`
      );
    } catch (err) {
      console.error('Error generating PDF report:', err);
      showToast(
        err instanceof Error ? `PDF Export failed: ${err.message}` : 'Failed to generate PDF report.',
        'error'
      );
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Export Audit Trail PDF handler
  const handleExportJSONLog = async () => {
    try {
      const result = await exportAuditTrailPDF(auditLogs);
      showToast(`Audit trail downloaded: ${result.filename}`, 'success');
      recordAuditLog(
        'Exported Audit Trail (PDF)',
        'Publication Sign-off',
        `Exported governance audit trail PDF: ${result.filename}`
      );
    } catch (err) {
      console.error('Error exporting audit trail PDF:', err);
      showToast(
        err instanceof Error ? `Export failed: ${err.message}` : 'Failed to download audit trail PDF.',
        'error'
      );
    }
  };

  // Generate correction tiers based on active draft
  const tiers: Record<CorrectionTier, TierCorrectionDetail> = useMemo(() => {
    return generateCorrectionTiers(draftText, findings);
  }, [draftText, findings]);

  // Compute publication readiness summary
  const readinessSummary = useMemo(() => {
    return calculatePublicationReadiness(findings, claims);
  }, [findings, claims]);

  // Switch Corporate Draft
  const handleSelectDraft = (id: string) => {
    setSelectedContentId(id);
    const item = contentItems.find((d) => d.id === id);
    if (item) {
      if (item.source !== 'Corporate Knowledge Base') {
        setCustomDraftMeta({
          contentId: item.id,
          source: item.source,
          sourceTitle: item.title,
          sourceContext: item.sourceContext,
        });
      } else {
        setCustomDraftMeta(null);
      }
      setDraftText(item.workingText);
      setIntentData(item.intent || null);
      setFindings(item.findings || []);
      setHasAudited(!!item.findings && item.findings.length > 0);
      setIsOutdated(false);
      lastAuditedDraftText.current = item.workingText;
      setIsSignedOff(item.reviewStatus === 'approved');
      showToast(`Loaded draft: "${item.title.slice(0, 45)}..."`);
    }
  };

  // Run Brand & Intent Audit action
  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      // Extract intent profile first
      const updatedIntent = extractIntentProfile(draftText, activeDraftSample.intent);
      setIntentData(updatedIntent);

      // Run rule audit
      const newFindings = runBrandAudit(draftText, guidelines, claims, approvedFacts);
      setFindings(newFindings);

      // Extract & verify claims dynamically against approved facts
      const currentTitle = customDraftMeta?.sourceTitle || activeContentItem.title;
      const nextAuditVersion = (activeContentItem.auditVersion || 0) + 1;
      const { updatedClaims, activeClaimsForContent } = extractAndVerifyClaims(
        draftText,
        selectedContentId,
        currentTitle,
        nextAuditVersion,
        claims,
        approvedFacts
      );
      setClaims(updatedClaims);

      const associatedClaimIds = activeClaimsForContent.map((c: ClaimItem) => c.id);
      const currentReadiness = calculatePublicationReadiness(newFindings, updatedClaims);

      // Persist audit findings and version bump on content item
      setContentItems((prev) =>
        prev.map((item) => {
          if (item.id === selectedContentId) {
            const nextVer = (item.auditVersion || 0) + 1;
            return {
              ...item,
              workingText: draftText,
              findings: newFindings,
              intent: updatedIntent,
              associatedClaimIds,
              auditVersion: nextVer,
              publicationReadiness: currentReadiness,
              updatedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
            };
          }
          return item;
        })
      );

      setHasAudited(true);
      setIsOutdated(false);
      lastAuditedDraftText.current = draftText;
      setIsAuditing(false);

      recordAuditLog(
        'Brand & Intent Audit Executed',
        'Correction',
        `Audit v${(activeContentItem.auditVersion || 0) + 1} completed for "${currentTitle}". Analyzed text against ${guidelines.length} guidelines. Identified ${newFindings.length} findings and verified ${activeClaimsForContent.length} active claims.`,
        selectedContentId
      );
      showToast(`Audit completed. ${newFindings.length} findings, ${activeClaimsForContent.length} claims verified.`);
    }, 600);
  };

  // Apply selected tier correction to active draft
  const handleApplyTier = (tier: CorrectionTier) => {
    const tierData = tiers[tier];
    const prevText = draftText;
    setDraftText(tierData.text);
    lastAuditedDraftText.current = tierData.text;
    const newFindings = runBrandAudit(tierData.text, guidelines, claims, approvedFacts);
    setFindings(newFindings);
    setIsOutdated(false);

    // Update workingText & correctionHistory in shared ContentItem
    setContentItems((prev) =>
      prev.map((item) => {
        if (item.id === selectedContentId) {
          const history = item.correctionHistory || [];
          return {
            ...item,
            workingText: tierData.text,
            findings: newFindings,
            updatedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
            correctionHistory: [
              ...history,
              {
                id: `corr-${Date.now()}`,
                round: history.length + 1,
                tier,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                previousText: prevText,
                newText: tierData.text,
                summary: `Applied ${tierData.label}`,
                author: 'Beatrix Holzer (Legal & Brand Governance)',
              },
            ],
          };
        }
        return item;
      })
    );

    recordAuditLog(
      `Applied ${tierData.label} to Active Draft`,
      'Correction',
      `Applied ${tier} tier correction. Intent preservation: ${tierData.intentPreservation}%. Word delta: ${tierData.wordCountDelta} words.`,
      selectedContentId
    );
    showToast(`Applied ${tierData.label} to draft.`);
  };

  // Apply single finding fix directly to text
  const handleApplySingleFix = (finding: AuditFinding) => {
    if (draftText.includes(finding.originalSegment)) {
      const updatedText = draftText.replace(finding.originalSegment, finding.suggestedFix);
      setDraftText(updatedText);
      lastAuditedDraftText.current = updatedText;

      setFindings((prev) =>
        prev.map((f) =>
          f.id === finding.id ? { ...f, status: 'fixed', fixedAt: new Date().toISOString() } : f
        )
      );

      setContentItems((prev) =>
        prev.map((item) => {
          if (item.id === selectedContentId) {
            return {
              ...item,
              workingText: updatedText,
              updatedDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
            };
          }
          return item;
        })
      );

      recordAuditLog(
        `Applied Fix: ${finding.guidelineRef}`,
        'Correction',
        `Replaced "${finding.originalSegment}" with compliant formulation "${finding.suggestedFix}".`,
        finding.id
      );
      showToast(`Fixed finding ${finding.guidelineRef}`);
    } else {
      // Segment might already have been adjusted
      setFindings((prev) =>
        prev.map((f) =>
          f.id === finding.id ? { ...f, status: 'fixed', fixedAt: new Date().toISOString() } : f
        )
      );
      showToast(`Marked ${finding.guidelineRef} as resolved.`);
    }
  };

  // Confirm legal override
  const handleConfirmOverride = (findingId: string, reason: string, author: string) => {
    setFindings((prev) =>
      prev.map((f) =>
        f.id === findingId
          ? {
              ...f,
              status: 'overridden',
              overrideReason: reason,
              overriddenBy: author,
              overriddenAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            }
          : f
      )
    );

    const finding = findings.find((f) => f.id === findingId);
    recordAuditLog(
      `Authorized Override on ${finding?.guidelineRef || 'Finding'}`,
      'Override',
      `Justification: "${reason}". Authorized by ${author}.`,
      findingId
    );
    showToast(`Override authorized by ${author}.`);
  };

  // Quick verify claim
  const handleVerifyClaimQuick = (claimId: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updatedHistory = [
            ...c.history,
            {
              id: `h-${Date.now()}`,
              action: 'Verified with Active Certificate',
              author: 'Beatrix Holzer (Legal)',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
              note: 'Confirmed compliance under updated 2026 laboratory benchmark exhibit.',
            },
          ];
          return {
            ...c,
            status: 'Verified',
            expiryDate: '2027-10-26',
            history: updatedHistory,
          };
        }
        return c;
      })
    );

    recordAuditLog(
      'Claim Verified with Accredited Evidence',
      'Correction',
      `Claim ${claimId} verified by Legal Counsel with active validity horizon.`,
      claimId
    );
    showToast('Claim verified with active certificate.');
  };

  // Revoke claim verification (marks verified claim as Unsupported)
  const handleRevokeVerification = (claimId: string, reason?: string) => {
    let targetClaim = claims.find((c) => c.id === claimId);
    if (!targetClaim) return;

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const revokeReason =
      reason && reason.trim()
        ? reason.trim()
        : 'Verification revoked by reviewer. Status changed to Unsupported.';
    const historyId = `h-${Date.now()}`;

    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updatedHistory = [
            ...c.history,
            {
              id: historyId,
              action: 'Verification Revoked',
              author: 'Beatrix Holzer (Legal)',
              timestamp,
              note: revokeReason,
            },
          ];
          return {
            ...c,
            status: 'Unsupported' as const,
            history: updatedHistory,
          };
        }
        return c;
      })
    );

    // Keep inspect modal updated if open
    setInspectModalClaim((prev) => {
      if (prev && prev.id === claimId) {
        return {
          ...prev,
          status: 'Unsupported',
          history: [
            ...prev.history,
            {
              id: historyId,
              action: 'Verification Revoked',
              author: 'Beatrix Holzer (Legal)',
              timestamp,
              note: revokeReason,
            },
          ],
        };
      }
      return prev;
    });

    // Also update evidence preview modal if open for this claim
    setEvidenceModalClaim((prev) => {
      if (prev && prev.id === claimId) {
        return {
          ...prev,
          status: 'Unsupported',
        };
      }
      return prev;
    });

    recordAuditLog(
      'Claim Verification Revoked',
      'Claim Escalation',
      `Verification revoked for claim [${claimId}]: "${targetClaim.claimText.slice(0, 60)}...". Reason: "${revokeReason}". Status changed to Unsupported.`,
      claimId
    );
    showToast(`Revoked verification for claim ${claimId}.`);
  };

  // Confirm claim escalation
  const handleConfirmEscalate = (
    claimId: string,
    specialist: string,
    priority: 'Urgent' | 'High' | 'Normal',
    dueDate: string,
    notes: string
  ) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updatedHistory = [
            ...c.history,
            {
              id: `h-${Date.now()}`,
              action: `Escalated to ${specialist}`,
              author: 'Elena Rostova (Marketing)',
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
              note: `Priority: ${priority}. Due: ${dueDate}. Inquiries: ${notes}`,
            },
          ];
          return {
            ...c,
            status: 'Under Legal Review',
            escalation: {
              specialist,
              priority,
              dueDate,
              notes,
              escalatedAt: new Date().toISOString().replace('T', ' ').slice(0, 10),
            },
            history: updatedHistory,
          };
        }
        return c;
      })
    );

    recordAuditLog(
      `Claim Escalated to ${specialist}`,
      'Claim Escalation',
      `Priority: ${priority}. Due date: ${dueDate}. Notes: "${notes}".`,
      claimId
    );
    showToast(`Escalated claim to ${specialist}.`);
  };

  // Add approved fact
  const handleAddFact = (newClaimData: Omit<ClaimItem, 'id' | 'history'>) => {
    const newId = `claim-fact-${Date.now()}`;
    const newClaim: ClaimItem = {
      ...newClaimData,
      id: newId,
      history: [
        {
          id: `h-${Date.now()}`,
          action: 'Fact Registered in Matrix',
          author: newClaimData.owner,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          note: `Added approved fact backed by citation: ${newClaimData.evidenceCitation}`,
        },
      ],
    };

    setClaims((prev) => [newClaim, ...prev]);
    recordAuditLog(
      'Approved Fact Added to Registry',
      'Approved Fact Added',
      `Registered verified fact: "${newClaim.claimText.slice(0, 60)}..."`,
      newId
    );
    showToast('Added approved fact to Claim Ledger.');
  };

  // Update evidence artifact metadata (preserves existing claim verification status)
  const handleUpdateEvidence = (
    claimId: string,
    updatedArtifact: EvidenceArtifact,
    updatedCitation?: string,
    updatedDates?: { evidenceDate: string; expiryDate: string }
  ) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          const updated: ClaimItem = {
            ...c,
            evidenceArtifact: updatedArtifact,
            evidenceCitation: updatedCitation || c.evidenceCitation,
            evidenceDate: updatedDates?.evidenceDate || c.evidenceDate,
            expiryDate: updatedDates?.expiryDate || c.expiryDate,
            history: [
              {
                id: `h-${Date.now()}`,
                action: 'Evidence Metadata Updated',
                author: 'Beatrix Holzer (Legal)',
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                note: `Updated evidence artifact [${updatedArtifact.referenceCode}]: "${updatedArtifact.documentTitle}". Verification status preserved as ${c.status}.`,
              },
              ...c.history,
            ],
          };
          return updated;
        }
        return c;
      })
    );

    // Keep active evidence preview synchronized
    setEvidenceModalClaim((prev) => {
      if (prev && prev.id === claimId) {
        return {
          ...prev,
          evidenceArtifact: updatedArtifact,
          evidenceCitation: updatedCitation || prev.evidenceCitation,
          evidenceDate: updatedDates?.evidenceDate || prev.evidenceDate,
          expiryDate: updatedDates?.expiryDate || prev.expiryDate,
        };
      }
      return prev;
    });

    recordAuditLog(
      'Evidence Metadata Updated',
      'Evidence Update',
      `Updated evidence metadata for claim [${claimId}] (${updatedArtifact.referenceCode}): "${updatedArtifact.documentTitle}". Verification status remains ${claims.find((c) => c.id === claimId)?.status || 'Unchanged'}.`,
      claimId
    );
    showToast(`Updated evidence record: ${updatedArtifact.referenceCode}`);
  };

  // Accept guideline clarification
  const handleAcceptClarification = (guidelineId: string) => {
    setGuidelines((prev) =>
      prev.map((g) => {
        if (g.id === guidelineId && g.proposedWording) {
          const newVer = (parseFloat(g.version) + 0.1).toFixed(1);
          return {
            ...g,
            originalWording: g.proposedWording,
            proposedWording: undefined,
            version: newVer,
            status: 'Active',
            ambiguityScore: Math.max(8, g.ambiguityScore - 20),
            disputeFrequency: Math.max(5, g.disputeFrequency - 15),
            lastModified: new Date().toISOString().slice(0, 10),
          };
        }
        return g;
      })
    );

    const rule = guidelines.find((g) => g.id === guidelineId);
    recordAuditLog(
      `Guideline Clarification Accepted: ${rule?.code}`,
      'Guideline Update',
      `Accepted AI clarification for ${rule?.name}. Version bumped to updated standard.`,
      guidelineId
    );
    showToast(`Guideline ${rule?.code} updated.`);
  };

  // Reject guideline clarification
  const handleRejectClarification = (guidelineId: string) => {
    setGuidelines((prev) =>
      prev.map((g) => {
        if (g.id === guidelineId) {
          return {
            ...g,
            proposedWording: undefined,
          };
        }
        return g;
      })
    );
    showToast('Clarification proposal dismissed.');
  };

  // Save edited guideline
  const handleSaveGuideline = (
    guidelineId: string,
    newWording: string,
    newRationale: string,
    bumpVersion: boolean
  ) => {
    setGuidelines((prev) =>
      prev.map((g) => {
        if (g.id === guidelineId) {
          const newVer = bumpVersion ? (parseFloat(g.version) + 0.1).toFixed(1) : g.version;
          return {
            ...g,
            originalWording: newWording,
            rationale: newRationale,
            version: newVer,
            lastModified: new Date().toISOString().slice(0, 10),
          };
        }
        return g;
      })
    );

    const rule = guidelines.find((g) => g.id === guidelineId);
    recordAuditLog(
      `Guideline Manually Edited: ${rule?.code}`,
      'Guideline Update',
      `Updated directive phrasing for ${rule?.name}. Version: v${rule?.version}.`,
      guidelineId
    );
    showToast(`Saved guideline ${rule?.code}`);
  };

  // Update team member review counter
  const handleUpdateTeamMemberReviews = (id: string, delta: number) => {
    setTeamMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, reviewsCompleted: Math.max(0, m.reviewsCompleted + delta) } : m
      )
    );
  };

  // Publication sign-off
  const handleSignOffPublication = () => {
    if (readinessSummary.status === 'Publication Blocked') {
      showToast(
        'Publication is currently Blocked. Resolve critical violations and unsupported claims before sign-off.',
        'error'
      );
      return;
    }
    setIsSignedOff(true);
    setContentItems((prev) =>
      prev.map((item) =>
        item.id === selectedContentId
          ? {
              ...item,
              reviewStatus: 'approved',
              reviewer: 'Beatrix Holzer (Legal & Brand Governance)',
              reviewedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
            }
          : item
      )
    );
    recordAuditLog(
      'Pre-Publication Compliance Certified',
      'Publication Sign-off',
      `Executive governance attestation certified by Legal Counsel & Brand Council for "${activeContentItem.title}". Review Status: APPROVED. Readiness Score: ${readinessSummary.score}/100.`,
      selectedContentId
    );
    showToast(`Publication signed off and certified for "${activeContentItem.title}".`);
  };

  // Guideline CI rule approval and deployment
  const handleApproveProposedRule = (ruleCode: string, newWording: string, report: any) => {
    setGuidelines((prev) =>
      prev.map((g) => {
        if (g.code === ruleCode) {
          const newVer = (parseFloat(g.version) + 0.1).toFixed(1);
          return {
            ...g,
            originalWording: newWording,
            proposedWording: undefined,
            version: newVer,
            lastModified: new Date().toISOString().slice(0, 10),
            status: 'Active',
            ambiguityScore: Math.max(5, g.ambiguityScore - 15),
            disputeFrequency: Math.max(4, g.disputeFrequency - 12),
          };
        }
        return g;
      })
    );

    recordAuditLog(
      `Guideline Rule Deployed: ${ruleCode}`,
      'Guideline Update',
      `Approved CI proposal and deployed updated rule wording for ${ruleCode} into runtime brand governance. Historical CI simulation evaluated ${report?.totalAssetsEvaluated || 6} assets with pass rate ${report?.beforePassRate || 66}% -> ${report?.afterPassRate || 83}%.`,
      ruleCode
    );
    showToast(`Rule ${ruleCode} deployed to runtime brand governance!`);
  };

  // Interactive link handler for relatedId in Audit Trail
  const handleNavigateToRelated = (relatedId: string, category: string) => {
    if (relatedId.startsWith('RULE-') || relatedId.startsWith('Rule-')) {
      handleNavigateToGuideline(relatedId);
    } else if (relatedId.startsWith('claim-')) {
      const claim = claims.find((c) => c.id === relatedId);
      if (claim) {
        setInspectModalClaim(claim);
        setActiveTab('claims');
      } else {
        setActiveTab('claims');
      }
      showToast(`Navigated to claim: ${relatedId}`);
    } else if (relatedId.startsWith('FACT-') || relatedId.startsWith('fact-')) {
      setActiveTab('watch');
      showToast(`Navigated to Canon Watch for fact ${relatedId}`);
    } else if (
      relatedId.startsWith('content-') ||
      relatedId.startsWith('gw-') ||
      relatedId.startsWith('draft-')
    ) {
      handleSelectDraft(relatedId);
      setActiveTab('auditor');
    }
  };

  // Reset demo data to seed state
  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to clean factory seed state?')) {
      localStorage.clear();
      setContentItems(INITIAL_CONTENT_ITEMS);
      setSelectedContentId(INITIAL_CONTENT_ITEMS[0].id);
      setDraftText(INITIAL_CONTENT_ITEMS[0].workingText);
      setIntentData(null);
      setFindings([]);
      setHasAudited(false);
      setIsOutdated(false);
      lastAuditedDraftText.current = '';
      setGuidelines(INITIAL_BRAND_GUIDELINES);
      setClaims(INITIAL_CLAIMS);
      setApprovedFacts(INITIAL_APPROVED_FACTS);
      setTeamMembers(INITIAL_TEAM_MEMBERS);
      setAuditLogs(INITIAL_AUDIT_LOGS);
      setIsSignedOff(false);
      setCustomDraftMeta(null);
      showToast('Demo data reset to clean initial seed state.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-slate-900 border text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toastType === 'error' ? 'border-rose-500/80' : 'border-indigo-500/50'
          }`}
        >
          {toastType === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar adhering to Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        readinessStatus={readinessSummary.status}
        readinessScore={readinessSummary.score}
        onExportReportPDF={handleExportReportPDF}
        isGeneratingPDF={isGeneratingPDF}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* TAB 1: CONTENT AUDITOR & INTENT ENGINE (Feature A) */}
        {activeTab === 'auditor' && (
          <div className="space-y-6">
            {/* Draft Selector Strip & Run Audit Button */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-mono uppercase text-slate-400 shrink-0">
                  Content Item Registry:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {contentItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectDraft(item.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors truncate max-w-[240px] text-left cursor-pointer ${
                        selectedContentId === item.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                      }`}
                      title={`${item.title} (${item.source})`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <span className="text-xs text-slate-400 font-mono tabular-nums">
                  {draftText.trim().split(/\s+/).length} words
                </span>

                {isOutdated && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-amber-300 bg-amber-950/80 border border-amber-800 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Outdated</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('claims')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 rounded-lg transition-colors cursor-pointer"
                  title="View claims extracted for this content in Claim Ledger"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    Claim Ledger (
                    {claims.filter((c) => c.contentId === selectedContentId && c.isActive !== false).length}
                    )
                  </span>
                </button>

                <button
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isAuditing ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                      <span>Auditing Governance...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Run Brand & Intent Audit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Transferred Draft Source Banner */}
            {customDraftMeta && (
              <div className="bg-indigo-950/40 border border-indigo-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-indigo-900/60 border border-indigo-700/60 text-indigo-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">Transferred Content:</span>
                      <span className="text-indigo-300 font-mono bg-indigo-900/80 px-2 py-0.5 rounded border border-indigo-700/60">
                        {customDraftMeta.source}
                      </span>
                      <span className="text-slate-300 font-medium">{customDraftMeta.sourceTitle}</span>
                    </div>
                    {customDraftMeta.sourceContext && (
                      <p className="text-slate-400 text-[11px] mt-0.5">{customDraftMeta.sourceContext}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCustomDraftMeta(null);
                    handleSelectDraft(INITIAL_CONTENT_ITEMS[0].id);
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded border border-slate-700 self-start sm:self-auto cursor-pointer"
                >
                  Clear & Revert to Sample
                </button>
              </div>
            )}

            {/* SRT Subtitle Telemetry & Speed Readability Card if transferred from SRT adapter */}
            {customDraftMeta?.srtTelemetry && (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold text-white">
                      SRT Subtitles Telemetry & Speed Readability Compliance
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Threshold: {customDraftMeta.srtTelemetry.threshold} Characters/Second (CPS)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Captions</span>
                    <span className="text-base font-bold font-mono text-white">
                      {customDraftMeta.srtTelemetry.captionCount}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Average CPS</span>
                    <span className="text-base font-bold font-mono text-slate-200">
                      {customDraftMeta.srtTelemetry.avgCps} CPS
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Peak CPS</span>
                    <span className="text-base font-bold font-mono text-amber-300">
                      {customDraftMeta.srtTelemetry.maxCps} CPS
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Exceeding Speed Limit</span>
                    <span
                      className={`text-base font-bold font-mono ${
                        customDraftMeta.srtTelemetry.exceededCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {customDraftMeta.srtTelemetry.exceededCount} Captions
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Editable Corporate Draft Input */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-indigo-400" />
                  <span className="font-semibold text-white">
                    Corporate Pre-Publication Draft Content
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    (Editable in-place)
                  </span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">
                  {customDraftMeta ? (
                    <>Source: <strong className="text-indigo-400">{customDraftMeta.source}</strong> · {customDraftMeta.sourceTitle}</>
                  ) : (
                    <>Author: {activeDraftSample.author} · {activeDraftSample.category}</>
                  )}
                </span>
              </div>

              <textarea
                rows={5}
                value={draftText}
                onChange={(e) => {
                  const newText = e.target.value;
                  setDraftText(newText);
                  if (hasAudited) {
                    setIsOutdated(newText !== lastAuditedDraftText.current);
                  }
                }}
                placeholder="Paste corporate press release, technical whitepaper, or product marketing copy..."
                className="w-full bg-slate-950 border border-slate-800 text-sm leading-relaxed text-slate-200 p-3.5 rounded-lg focus:outline-none focus:border-indigo-500 font-sans resize-y"
              />
            </div>

            {/* Audit Results Area */}
            {!hasAudited ? (
              <div className="bg-slate-900 rounded-xl border border-dashed border-slate-800 p-8 text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-slate-950 border border-slate-800 text-indigo-400 mb-1">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-300">
                    Ready to audit. Select or enter your draft and click Run Brand & Intent Audit.
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Audit findings, pre-correction Intent Profile, and correction suggestions will be generated once the audit is executed.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Outdated Warning Notice */}
                {isOutdated && (
                  <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200 shadow-sm animate-in fade-in duration-200">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="font-semibold text-amber-300">Audit results are outdated.</span>{' '}
                        <span className="text-amber-200/90">
                          The draft content was edited after the last audit. Re-run the audit to refresh findings, Intent Profile, and correction suggestions.
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleRunAudit}
                      disabled={isAuditing}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-600/50 rounded-lg text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Re-run Audit</span>
                    </button>
                  </div>
                )}

                {/* Pre-Correction Intent Card (Feature A Requirement) */}
                {intentData && (
                  <IntentCardView
                    intent={intentData}
                    selectedTier={selectedTier}
                    onSelectTier={setSelectedTier}
                  />
                )}

                {/* Publication Readiness Summary Card */}
                <ReadinessSummaryCard
                  score={readinessSummary.score}
                  status={readinessSummary.status}
                  statusColor={readinessSummary.statusColor}
                  blockingReasons={readinessSummary.blockingReasons}
                  totalFindings={readinessSummary.totalFindings}
                  activeViolations={readinessSummary.activeViolations}
                  fixedCount={readinessSummary.fixedCount}
                  overriddenCount={readinessSummary.overriddenCount}
                  criticalClaimsCount={readinessSummary.criticalClaimsCount}
                  onSignOff={handleSignOffPublication}
                  isSignedOff={isSignedOff}
                />

                {/* Side-by-Side Tracked Diff with 3 Correction Tiers (Feature A Requirement) */}
                <TrackedDiffViewer
                  originalText={draftText}
                  tiers={tiers}
                  selectedTier={selectedTier}
                  onSelectTier={setSelectedTier}
                  onApplyTier={handleApplyTier}
                />

                {/* Interactive Audit Findings (Feature A Requirement) */}
                <AuditFindingsList
                  findings={findings}
                  onApplyFix={handleApplySingleFix}
                  onOpenOverrideModal={(finding) => setOverrideModalFinding(finding)}
                  onReviewClaim={handleReviewClaimInLedger}
                  onViewGuideline={handleNavigateToGuideline}
                  onViewAuditHistory={handleNavigateToAuditLog}
                />
              </>
            )}
          </div>
        )}

        {/* IMPROVEMENT 1: CANON GATEWAY */}
        {activeTab === 'gateway' && (
          <CanonGatewayView
            approvedFacts={approvedFacts}
            guidelines={guidelines}
            claims={claims}
            onRecordAuditLog={recordAuditLog}
            onSendToAuditor={handleSendToAuditor}
            onSaveContentDraft={handleSaveContentDraft}
            showToast={showToast}
          />
        )}

        {/* IMPROVEMENT 2: CANON WATCH */}
        {activeTab === 'watch' && (
          <CanonWatchView
            approvedFacts={approvedFacts}
            onUpdateApprovedFact={handleUpdateApprovedFact}
            onRecordAuditLog={recordAuditLog}
            showToast={showToast}
            onSendToAuditor={handleSendToAuditor}
          />
        )}

        {/* IMPROVEMENT 3: FORMAT ADAPTERS */}
        {activeTab === 'adapters' && (
          <FormatAdaptersView
            approvedFacts={approvedFacts}
            guidelines={guidelines}
            claims={claims}
            onRecordAuditLog={recordAuditLog}
            onSendToAuditor={handleSendToAuditor}
            showToast={showToast}
          />
        )}

        {/* TAB 2: CLAIM LEDGER & VERIFICATION MATRIX (Feature B) */}
        {activeTab === 'claims' && (
          <ClaimLedgerView
            claims={claims}
            currentContentId={selectedContentId}
            currentContentTitle={customDraftMeta?.sourceTitle || activeContentItem.title}
            onOpenEscalateModal={(claim) => setEscalateModalClaim(claim)}
            onOpenAddFactModal={() => setIsAddFactOpen(true)}
            onInspectClaim={(claim) => setInspectModalClaim(claim)}
            onVerifyClaimQuick={handleVerifyClaimQuick}
            onRevokeVerification={handleRevokeVerification}
            onOpenEvidencePreview={(claim) => setEvidenceModalClaim(claim)}
            onNavigateToWatch={handleNavigateToWatch}
            onNavigateToAuditLog={handleNavigateToAuditLog}
            onNavigateToSource={(contentId, claimText) => {
              if (contentId) {
                handleSelectDraft(contentId);
              }
              setActiveTab('auditor');
              showToast('Navigated to source content in Content Auditor');
            }}
            onReturnToContentReview={() => setActiveTab('auditor')}
          />
        )}

        {/* TAB 3: GUIDELINE HEALTH & GUIDELINE CI (Feature C) */}
        {activeTab === 'guidelines' && (
          <GuidelineHealthView
            guidelines={guidelines}
            historicalAssets={historicalAssets}
            initialFocusedRuleCode={focusedRuleCode}
            onAcceptClarification={handleAcceptClarification}
            onRejectClarification={handleRejectClarification}
            onOpenEditGuidelineModal={(g) => setEditGuidelineTarget(g)}
            onRecordAuditLog={recordAuditLog}
            onSimulationReportUpdate={(report) => setLatestCISimulation(report)}
            onTestRuleInAuditor={handleTestRuleInAuditor}
            onNavigateToAuditLog={handleNavigateToAuditLog}
            onApproveProposedRule={handleApproveProposedRule}
          />
        )}

        {/* TAB 4: AUDIT TRAIL & TEAM COMPLIANCE LOG */}
        {activeTab === 'audit-log' && (
          <AuditTrailView
            logs={auditLogs}
            teamMembers={teamMembers}
            onUpdateTeamMemberReviews={handleUpdateTeamMemberReviews}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onExportJSON={handleExportJSONLog}
            onExportPDF={handleExportReportPDF}
            isGeneratingPDF={isGeneratingPDF}
            onNavigateToRelated={handleNavigateToRelated}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <OverrideModal
        finding={overrideModalFinding}
        isOpen={!!overrideModalFinding}
        onClose={() => setOverrideModalFinding(null)}
        onConfirmOverride={handleConfirmOverride}
      />

      <EscalateModal
        claim={escalateModalClaim}
        isOpen={!!escalateModalClaim}
        onClose={() => setEscalateModalClaim(null)}
        onConfirmEscalate={handleConfirmEscalate}
      />

      <AddFactModal
        isOpen={isAddFactOpen}
        onClose={() => setIsAddFactOpen(false)}
        onAddFact={handleAddFact}
      />

      <ClaimInspectModal
        claim={inspectModalClaim}
        isOpen={!!inspectModalClaim}
        onClose={() => setInspectModalClaim(null)}
        onOpenEscalate={(claim) => setEscalateModalClaim(claim)}
        onVerifyQuick={handleVerifyClaimQuick}
        onRevokeVerification={handleRevokeVerification}
        onOpenEvidencePreview={(claim) => setEvidenceModalClaim(claim)}
      />

      <EvidencePreviewModal
        claim={evidenceModalClaim}
        isOpen={!!evidenceModalClaim}
        onClose={() => setEvidenceModalClaim(null)}
        onUpdateEvidence={handleUpdateEvidence}
      />

      <EditGuidelineModal
        guideline={editGuidelineTarget}
        isOpen={!!editGuidelineTarget}
        onClose={() => setEditGuidelineTarget(null)}
        onSaveGuideline={handleSaveGuideline}
      />

      <ComplianceReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        draftTitle={activeDraftSample.title}
        draftAuthor={activeDraftSample.author}
        draftText={draftText}
        readinessScore={readinessSummary.score}
        readinessStatus={readinessSummary.status}
        intent={intentData || activeDraftSample.intent}
        findings={findings}
        claims={claims}
        guidelines={guidelines}
        teamMembers={teamMembers}
        auditLogs={auditLogs}
        latestCISimulation={latestCISimulation}
        onNotify={showToast}
      />
    </div>
  );
}
