/**
 * Canon Enterprise Brand Governance & Pre-Publication Review Platform
 * Data Types & Contracts
 */

export type FindingCategory =
  | 'Tone & Voice'
  | 'Terminology'
  | 'Core Messaging'
  | 'Visuals'
  | 'Accessibility'
  | 'Claims';

export type SeverityLevel = 'High' | 'Medium' | 'Low';

export type FindingStatus = 'detected' | 'fixed' | 'overridden';

export interface AuditFinding {
  id: string;
  category: FindingCategory;
  title: string;
  explanation: string;
  guidelineRef: string;
  severity: SeverityLevel;
  originalSegment: string;
  suggestedFix: string;
  status: FindingStatus;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  fixedAt?: string;
}

export interface IntentCardData {
  primaryPurpose: string;
  targetAudience: string;
  corePersona: string;
  mustKeepTerms: string[];
  intentPreservationScores: {
    minimal: number;
    balanced: number;
    reframe: number;
  };
}

export type CorrectionTier = 'minimal' | 'balanced' | 'reframe';

export interface TierCorrectionDetail {
  tier: CorrectionTier;
  label: string;
  description: string;
  text: string;
  rationale: string;
  intentPreservation: number;
  wordCountDelta: number;
}

export type ClaimVerificationStatus =
  | 'Verified'
  | 'Unsupported'
  | 'Needs Verification'
  | 'Expired Evidence'
  | 'Under Legal Review'
  | 'Pending Specialist Review';

export type ClaimCategory =
  | 'Security'
  | 'Performance'
  | 'Market Share'
  | 'Sustainability'
  | 'Financial';

export interface EvidenceArtifact {
  documentTitle: string;
  documentType: string;
  issuerOrFirm: string;
  referenceCode: string;
  abstract: string;
  clausesOrExhibits?: Array<{
    title: string;
    content: string;
    highlight?: boolean;
  }>;
  supportAssessment: string;
  isContradictionOrExpired?: boolean;
  isDemoNotice: boolean;
  externalUrl?: string;
  isExternalGenuine?: boolean;
}

export interface ClaimItem {
  id: string;
  claimText: string;
  draftContext: string;
  status: ClaimVerificationStatus;
  owner: string;
  evidenceLink: string;
  evidenceCitation: string;
  evidenceDate: string;
  expiryDate: string;
  riskLevel: 'Critical' | 'Moderate' | 'Low';
  category: ClaimCategory;
  evidenceArtifact?: EvidenceArtifact;
  history: Array<{
    id: string;
    action: string;
    author: string;
    timestamp: string;
    note: string;
  }>;
  escalation?: {
    specialist: string;
    priority: 'Urgent' | 'High' | 'Normal';
    dueDate: string;
    notes: string;
    escalatedAt: string;
  };
  contentId: string;
  contentTitle?: string;
  auditVersion: number;
  isActive?: boolean;
  supportingFactCode?: string;
  supportingFactValue?: string;
  statusReason?: string;
  reviewStatus?: 'pending' | 'verified' | 'revoked' | 'rejected' | 'escalated';
  matchedFindingId?: string;
}

export type ContentItemSource =
  | 'Corporate Sample'
  | 'Canon Gateway'
  | 'Canon Watch'
  | 'Web Page URL'
  | 'HTML Email'
  | 'SRT Subtitles'
  | 'Manual Draft'
  | 'Corporate Knowledge Base'
  | 'External Ingestion'
  | string;

export interface ContentItem {
  id: string;
  title: string;
  originalText: string;
  workingText: string;
  contentType: string;
  source: ContentItemSource;
  sourceContext?: string;
  author?: string;
  intent?: IntentCardData;
  findings?: AuditFinding[];
  auditVersion: number;
  auditResults?: {
    hasAudited: boolean;
    findings: AuditFinding[];
    intent?: IntentCardData;
    auditedAt?: string;
  };
  associatedClaimIds?: string[];
  correctionHistory?: Array<{
    id?: string;
    timestamp: string;
    round?: number;
    tier?: CorrectionTier;
    previousText?: string;
    newText?: string;
    action?: string;
    text?: string;
    summary?: string;
    author?: string;
  }>;
  reviewStatus: 'draft' | 'under_human_review' | 'approved' | 'rejected' | 'returned_for_correction';
  reviewer?: string;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  publicationReadiness?: {
    score: number;
    status: 'Approved for Publication' | 'Requires Review' | 'Publication Blocked';
    statusColor: 'emerald' | 'amber' | 'rose';
    blockingReasons: string[];
  };
  createdAt?: string;
  updatedAt?: string;
  createdDate?: string;
  updatedDate?: string;
}

export interface BrandGuideline {
  id: string;
  code: string;
  name: string;
  category: FindingCategory;
  description: string;
  originalWording: string;
  proposedWording?: string;
  overrideCount: number;
  disputeFrequency: number;
  ambiguityScore: number;
  status: 'Active' | 'Under Review' | 'Deprecated';
  version: string;
  lastModified: string;
  rationale?: string;
  matchPatterns?: string[];
}

export interface HistoricalAsset {
  id: string;
  title: string;
  assetType:
    | 'Press Release'
    | 'Product Whitepaper'
    | 'Sales Pitch Deck'
    | 'ESG Report'
    | 'Technical Blog'
    | 'Executive Brief';
  date: string;
  author: string;
  baselineCompliant: boolean;
  textSample: string;
  matchedRules: string[];
}

export interface CIAssetResult {
  assetId: string;
  assetTitle: string;
  assetType: string;
  statusBefore: 'Pass' | 'Fail';
  statusAfter: 'Pass' | 'Fail';
  impactType: 'Unchanged' | 'Newly Failed' | 'Resolved' | 'Manual Review Required';
  matchedExcerpt: string;
  changeDetail: string;
}

export interface CISimulationReport {
  id: string;
  timestamp: string;
  ruleCode: string;
  ruleName: string;
  proposedChangeSummary: string;
  totalAssetsEvaluated: number;
  assetsAffectedCount: number;
  assetsAffectedPercentage: number;
  newlyIntroducedFailures: number;
  resolvedFailures: number;
  beforePassRate: number;
  afterPassRate: number;
  riskScore: 'Low' | 'Moderate' | 'High';
  methodology: string;
  assetResults: CIAssetResult[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category:
    | 'Correction'
    | 'Override'
    | 'Claim Escalation'
    | 'Guideline Update'
    | 'CI Simulation'
    | 'Publication Sign-off'
    | 'Approved Fact Added'
    | 'Evidence Update'
    | 'Canon Gateway'
    | 'Canon Watch'
    | 'Format Adapter';
  user: string;
  details: string;
  relatedId?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  avatarInitials: string;
  reviewsCompleted: number;
  overridesApproved: number;
  permissionLevel: 'Owner' | 'Approver' | 'Editor' | 'Specialist';
}

export interface CorporateDraftSample {
  id: string;
  title: string;
  category: string;
  originalText: string;
  author: string;
  date: string;
  intent: IntentCardData;
}

// ==========================================
// CANON APPROVED FACTS REGISTRY (SHARED)
// ==========================================
export interface ApprovedFact {
  id: string;
  code: string; // e.g. 'FACT-PRICE-01'
  title: string; // e.g. 'Fernwick Pay Annual Enterprise License'
  value: string; // e.g. '₹25,000' or '₹50,000'
  previousValue?: string;
  category: 'Pricing' | 'SLA & Uptime' | 'Security & Compliance' | 'Product Features';
  status: 'Active' | 'Updated' | 'Expired';
  expiryDate: string; // YYYY-MM-DD
  lastUpdated: string;
  citation: string;
  notes: string;
}

// ==========================================
// IMPROVEMENT 1: CANON GATEWAY TYPES
// ==========================================
export type GatewayContentType =
  | 'Digital Advertisement'
  | 'Landing Page Hero & Copy'
  | 'Email Campaign'
  | 'Social Media Announcement';

export interface GatewayBrief {
  brief: string;
  targetAudience: string;
  contentType: GatewayContentType;
  campaignName: string;
}

export interface GatewayDraftVersion {
  round: number; // 0 = initial generation, 1 = round 1, 2 = round 2
  label: string;
  text: string;
  timestamp: string;
  findings: AuditFinding[];
  correctionSummary?: string;
}

export type GatewayReviewStatus =
  | 'draft'
  | 'under_human_review'
  | 'approved'
  | 'rejected'
  | 'returned_for_correction';

export interface GatewayWorkflowState {
  id: string;
  brief: GatewayBrief;
  currentRound: number; // 0, 1, 2 (max 2)
  maxRounds: number; // strictly 2
  history: GatewayDraftVersion[];
  activeText: string;
  reviewStatus: GatewayReviewStatus;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// ==========================================
// IMPROVEMENT 2: CANON WATCH TYPES
// ==========================================
export type WatchChannel =
  | 'Digital Ad'
  | 'Landing Page'
  | 'Email Campaign'
  | 'Product Sheet';

export type WatchContentStatus =
  | 'Active / Published'
  | 'Flagged: Outdated Content'
  | 'Correction Proposed'
  | 'Approved Update';

export interface WatchContentItem {
  id: string;
  title: string;
  channel: WatchChannel;
  content: string;
  linkedFactCodes: string[]; // e.g. ['FACT-PRICE-01']
  status: WatchContentStatus;
  lastReviewDate: string;
  reviewer: string;
  severity: SeverityLevel;
  flagReason?: string;
  suggestedCorrection?: {
    updatedText: string;
    explanation: string;
    targetFactCode: string;
    oldValue: string;
    newValue: string;
    appliedAt?: string;
  };
}

// ==========================================
// IMPROVEMENT 3: FORMAT ADAPTERS TYPES
// ==========================================
export interface WebPageExtraction {
  url: string;
  isValidUrl: boolean;
  isSimulated: boolean;
  pageTitle: string;
  extractedText: string;
  extractedAt: string;
  wordCount: number;
}

export interface HtmlEmailExtraction {
  rawHtml: string;
  extractedText: string;
  subject?: string;
  strippedTagsCount: number;
  strippedScriptsCount: number;
  wordCount: number;
}

export interface SrtCaption {
  index: number;
  startTime: string; // "00:00:01,200"
  endTime: string; // "00:00:04,500"
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  text: string;
  charCount: number;
  cps: number; // Characters per second: chars / duration
  isExceedingCPS: boolean;
  hasTimingError: boolean;
  timingErrorReason?: string;
  brandViolations: string[];
}

export interface SrtAnalysisResult {
  fileName?: string;
  rawSrtText: string;
  captions: SrtCaption[];
  totalCaptions: number;
  thresholdCPS: number; // default 20
  exceedingCPSCount: number;
  timingErrorsCount: number;
  brandViolationsCount: number;
  avgCPS: number;
  maxCPS: number;
  extractedFullText: string;
}
