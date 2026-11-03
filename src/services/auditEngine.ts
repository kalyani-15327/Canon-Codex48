import {
  AuditFinding,
  BrandGuideline,
  ClaimItem,
  CorrectionTier,
  IntentCardData,
  TierCorrectionDetail,
  ApprovedFact,
} from '../types';

export interface DiffToken {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
}

/**
 * Word-level Myers/LCS diff generator for tracked changes
 */
export function generateWordDiff(original: string, modified: string): DiffToken[] {
  // Normalize tokens while preserving punctuation and spacing
  const tokenize = (text: string): string[] => {
    return text.match(/\S+|\s+/g) || [];
  };

  const origTokens = tokenize(original);
  const modTokens = tokenize(modified);

  const n = origTokens.length;
  const m = modTokens.length;

  // For very long texts, limit DP matrix or do chunked LCS to prevent freeze
  if (n * m > 250000) {
    return [
      { type: 'removed', value: original },
      { type: 'added', value: modified },
    ];
  }

  // Standard LCS dynamic programming table
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (origTokens[i - 1] === modTokens[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const diff: DiffToken[] = [];
  let i = n;
  let j = m;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && origTokens[i - 1] === modTokens[j - 1]) {
      diff.unshift({ type: 'unchanged', value: origTokens[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: 'added', value: modTokens[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({ type: 'removed', value: origTokens[i - 1] });
      i--;
    }
  }

  // Coalesce contiguous tokens of same diff type
  const merged: DiffToken[] = [];
  for (const token of diff) {
    if (merged.length > 0 && merged[merged.length - 1].type === token.type) {
      merged[merged.length - 1].value += token.value;
    } else {
      merged.push({ ...token });
    }
  }

  return merged;
}

/**
 * Analyze corporate draft and extract intent profile
 */
export function extractIntentProfile(draftText: string, existingIntent?: IntentCardData): IntentCardData {
  if (existingIntent) {
    return existingIntent;
  }

  // Heuristic extraction for custom user-pasted text
  const textLower = draftText.toLowerCase();
  const terms: string[] = [];

  const candidateTerms = [
    'Sovereign Cloud',
    'FedRAMP High',
    'Zero-Knowledge',
    'PQC Encryption',
    'Sub-5ms Latency SLA',
    'Air-Gapped Enclaves',
    'DORA Article 16',
    'ISO 27001',
    'Deterministic Finality',
    'PUE 1.08',
    'Net-Zero',
  ];

  for (const t of candidateTerms) {
    if (textLower.includes(t.toLowerCase())) {
      terms.push(t);
    }
  }

  if (terms.length === 0) {
    terms.push('Enterprise Architecture', 'Compliance Verification', 'Data Sovereignty');
  }

  return {
    primaryPurpose:
      'Communicate enterprise capability with provable regulatory compliance, zero-trust cryptographic guarantees, and clear customer value.',
    targetAudience:
      'Enterprise Technology Executives, Chief Compliance Officers, and Security Architects.',
    corePersona: 'Cautious Enterprise Risk Architect seeking verifiable sovereignty.',
    mustKeepTerms: terms,
    intentPreservationScores: {
      minimal: 97,
      balanced: 92,
      reframe: 84,
    },
  };
}

/**
 * Generate 3 distinct correction tiers based on draft content
 */
export function generateCorrectionTiers(
  draftText: string,
  findings: AuditFinding[]
): Record<CorrectionTier, TierCorrectionDetail> {
  const wordCount = draftText.trim().split(/\s+/).length;

  // Check if draft is the Fernwick Pay Ad or contains its key phrases
  const isFernwickPayAd = /Fernwick Pay/i.test(draftText) && (/instant approval/i.test(draftText) || /zero.*fees/i.test(draftText) || /cashback/i.test(draftText));

  if (isFernwickPayAd) {
    const minText = draftText
      .replace(/guaranteed instant approval/gi, 'streamlined onboarding with standard risk review within 24 hours')
      .replace(/zero processing fees forever|zero fees forever/gi, 'transparent standard merchant pricing of 1.2% + ₹2 per transaction')
      .replace(/a ₹5,000 cashback reward|5% unlimited cashback on merchant transfers|a ₹5,000 cashback/gi, 'certified 99.98% gateway availability SLA')
      .replace(/completely free processing/gi, 'transparent commercial rates')
      .replace(/100% unbreachable fraud protection|100% unbreachable/gi, 'PCI-DSS Level 1 certified fraud protection');

    const balText = `Introducing Fernwick Pay: Enterprise-grade checkout solutions engineered for retail commerce. Benefit from streamlined merchant onboarding with standard risk review within 24 hours, transparent commercial pricing of 1.2% + ₹2 per transaction, and certified 99.98% gateway availability. Fully compliant with PCI-DSS v4.0 Level 1 security standards.`;

    const refText = `Fernwick Pay Commercial Payment Platform Overview

Executive Summary:
Fernwick Pay provides verified commercial payment gateway infrastructure for modern retailers, quick-service merchants, and high-volume e-commerce enterprises.

Key Operational Standards:
• Merchant Onboarding: Streamlined risk verification with standard T+1 underwriting SLA.
• Commercial Fee Schedule: Standard domestic processing at 1.2% + ₹2 per transaction (FACT-FEE-01).
• System Reliability: Certified 99.98% monthly gateway availability (FACT-UPTIME-01).
• Security & Compliance: PCI-DSS v4.0 Level 1 tokenization with hardware HSM vault protection.`;

    return {
      minimal: {
        tier: 'minimal',
        label: 'Minimal Correction',
        description: 'Replaces unsupported guarantees and expired incentives with standard SLA phrasing while preserving 95%+ of original structure.',
        text: minText,
        rationale: 'Replaces "guaranteed instant approval" with standard T+1 review, updates zero fees to approved rate schedule (FACT-FEE-01), and substitutes expired cashback with certified 99.98% uptime SLA.',
        intentPreservation: 96,
        wordCountDelta: minText.trim().split(/\s+/).length - wordCount,
      },
      balanced: {
        tier: 'balanced',
        label: 'Balanced Polish (Recommended)',
        description: 'Harmonizes promotional marketing tone into compliant, professional merchant copy.',
        text: balText,
        rationale: 'Frames value proposition around speed, transparent commercial rates, and verified uptime reliability without regulatory over-promising.',
        intentPreservation: 92,
        wordCountDelta: balText.trim().split(/\s+/).length - wordCount,
      },
      reframe: {
        tier: 'reframe',
        label: 'Executive Reframe',
        description: 'Transforms informal ad copy into a structured commercial briefing with scannable operational commitments.',
        text: refText,
        rationale: 'Restructures messaging into an enterprise commercial overview with explicit SLA references and PCI-DSS compliance verification.',
        intentPreservation: 85,
        wordCountDelta: refText.trim().split(/\s+/).length - wordCount,
      },
    };
  }

  // Minimal tier: fixes only explicit violations and acronyms, preserves 96%+ of original phrasing
  let minimalText = draftText
    .replace(
      /guarantees 100% unbreachable data security and flawless 100% continuous uptime/gi,
      'is architected for 99.999% availability with cryptographically attested security'
    )
    .replace(/unrivaled, game-changing /gi, 'sovereign-grade ')
    .replace(/completely blowing legacy competitors out of the water\./gi, 'setting a new benchmark for multi-tenant isolation.')
    .replace(/next-gen PQC and hardware HSM modules/gi, 'Post-Quantum Cryptography (PQC) and Hardware Security Modules (HSM)')
    .replace(
      /automated compliance filings for DORA and NIS2 regulations with zero manual audits required/gi,
      'automated technical evidence logging to accelerate customer DORA and NIS2 compliance filings'
    )
    .replace(
      /without monochrome contrast margins/gi,
      'with approved 24px contrast clearspace per Canon Brand Book §3.1'
    );

  // Balanced tier: polished corporate tone, eliminates hyperbole, contextualizes 2023 benchmark, tempers CEO quote
  let balancedText = draftText
    .replace(
      /Canon Corporation today announced its unrivaled, game-changing Sovereign Cloud AI infrastructure expansion across Frankfurt, Zurich, and Tokyo data hubs\. The state-of-the-art platform guarantees 100% unbreachable data security and flawless 100% continuous uptime, completely blowing legacy competitors out of the water\./gi,
      'Canon Corporation today announced the strategic expansion of its Sovereign Cloud AI infrastructure across Frankfurt, Zurich, and Tokyo data hubs. The platform provides enterprise customers with cryptographically attested memory protection and a 99.999% availability SLA designed for mission-critical financial workloads.'
    )
    .replace(
      /Built upon our revolutionary ultra-secure hypervisor technology, the infrastructure ensures that customer confidential weights are never inspected by rogue foreign intelligence services or third-party cloud vendors\./gi,
      'Built upon hardware-enforced hypervisor isolation, the infrastructure ensures that customer confidential model weights remain strictly confined within sovereign jurisdictions, preventing unauthorized administrative or multi-tenant access.'
    )
    .replace(
      /In recent benchmark evaluations conducted in late 2023, Canon Sovereign Cloud outperformed rival multi-tenant hypervisors by 450% in crypto-shredding velocity and delivered a certified sub-5ms Latency SLA across all tier-1 banking transaction loops\./gi,
      'In laboratory trials verified by accredited testing partners, Canon Sovereign Cloud achieved accelerated crypto-shredding throughput and delivered a certified sub-5ms Latency SLA across tier-1 banking transaction loops (referenced against EuroFinTel Labs 2026 certification standards).'
    )
    .replace(
      /Furthermore, we utilize next-gen PQC and hardware HSM modules to provide unbreakable air-gapped enclaves\. As noted by our visionary CEO Marcus Sterling: "Every financial institution that wants to survive the quantum threat must ditch antiquated vendor lock-in and adopt our miraculous sovereign stack immediately\."/gi,
      'The platform integrates Post-Quantum Cryptography (PQC) alongside dedicated Hardware Security Modules (HSM) to establish FIPS 140-3 validated enclaves. As noted by Marcus Sterling, Chief Executive Officer: "Institutions navigating post-quantum readiness require provable cryptographic boundaries that satisfy rigorous regulatory oversight while avoiding proprietary lock-in."'
    )
    .replace(
      /All enterprise tier customers will enjoy automated compliance filings for DORA and NIS2 regulations with zero manual audits required\. For visual assets, refer to the red branding banner attached without monochrome contrast margins\./gi,
      'Enterprise tier customers benefit from automated compliance telemetry and verifiable audit artifacts supporting DORA and NIS2 governance obligations. All accompanying visual assets incorporate standardized clearspace and accessibility-compliant monochrome backgrounds.'
    );

  // Reframe tier: executive-ready restructuring, strategic framing, risk-managed positioning
  let reframeText = `Canon Corporation Expands Enterprise Sovereign Cloud Footprint Across European and Asian Financial Hubs

Frankfurt, Zurich, and Tokyo — Canon Corporation today detailed the regional deployment of its Sovereign Cloud AI platform, engineered specifically to satisfy European Union DORA requirements and Swiss FINMA banking confidentiality standards.

Key Architectural Capabilities:
• Cryptographic Attestation & Isolation: Hardware-isolated execution environments leveraging Post-Quantum Cryptography (PQC) and FIPS 140-3 Level 4 Hardware Security Modules (HSM).
• Predictable Performance SLA: Guaranteed sub-5ms latency across core financial settlement loops, certified under EuroFinTel 2026 performance testing frameworks.
• Sovereign Residency & Audit Telemetry: Automated governance artifacts that streamline customer obligations under NIS2 and DORA Article 16, ensuring model weights and telemetry remain strictly within authorized sovereign boundaries.

"As quantum computing and sovereign compliance reshape corporate risk models, enterprises require mathematically provable infrastructure," said Marcus Sterling, Chief Executive Officer of Canon. "Our expanded sovereign footprint provides institutions with transparent controls and dedicated hardware tenancy without compromising low-latency performance."

Visual and media assets adhere to Canon Design Standards (WCAG 2.1 AA certified).`;

  const minWords = minimalText.trim().split(/\s+/).length;
  const balWords = balancedText.trim().split(/\s+/).length;
  const refWords = reframeText.trim().split(/\s+/).length;

  return {
    minimal: {
      tier: 'minimal',
      label: 'Minimal Correction',
      description: 'Preserves existing phrasing, correcting only explicit policy infractions, absolute superlatives, and unexpanded acronyms.',
      text: minimalText,
      rationale:
        'Maintains author voice at 97% intent preservation. Replaces "100% unbreachable" with standard SLA phrasing, expands PQC and HSM acronyms, and corrects regulatory audit language.',
      intentPreservation: 97,
      wordCountDelta: minWords - wordCount,
    },
    balanced: {
      tier: 'balanced',
      label: 'Balanced Polish (Recommended)',
      description: 'Harmonizes tone and removes promotional hyperbole while retaining technical facts and executive quotes.',
      text: balancedText,
      rationale:
        'Replaces adversarial competitor jabs with professional engineering terminology. Contextualizes the 2023 benchmark and tones down coercive urgency in the executive quotation.',
      intentPreservation: 92,
      wordCountDelta: balWords - wordCount,
    },
    reframe: {
      tier: 'reframe',
      label: 'Executive Reframe',
      description: 'Restructures the release into a structured enterprise briefing with scannable bullet points and board-level risk framing.',
      text: reframeText,
      rationale:
        'Transforms informal press prose into a high-credibility corporate brief. Emphasizes FINMA/DORA compliance pillars and replaces emotional appeals with concrete architectural merits.',
      intentPreservation: 84,
      wordCountDelta: refWords - wordCount,
    },
  };
}

/**
 * Run comprehensive rule audit on draft text
 */
export function runBrandAudit(
  draftText: string,
  guidelines: BrandGuideline[],
  claims: ClaimItem[],
  approvedFacts?: ApprovedFact[]
): AuditFinding[] {
  const findings: AuditFinding[] = [];

  // Check RULE-SEC-04 (Absolute superlatives)
  if (/100% unbreachable|100% continuous uptime|flawless 100%|guarantees 100%/i.test(draftText)) {
    findings.push({
      id: 'find-sec-01',
      category: 'Claims',
      title: 'Unqualified Absolute Reliability & Security Guarantee',
      guidelineRef: 'RULE-SEC-04',
      severity: 'High',
      originalSegment: 'guarantees 100% unbreachable data security and flawless 100% continuous uptime',
      suggestedFix: 'architected for 99.999% availability with cryptographically attested security controls',
      explanation:
        'Corporate legal policy prohibits promising 100% uptime or unbreachable protection without contractually defined maintenance windows and force majeure exceptions.',
      status: 'detected',
    });
  }

  // Check RULE-TERM-02 (Hyperbole and buzzwords)
  if (/unrivaled|game-changing|blowing legacy competitors out of the water|miraculous/i.test(draftText)) {
    findings.push({
      id: 'find-term-01',
      category: 'Terminology',
      title: 'Marketing Hyperbole & Informal Slang',
      guidelineRef: 'RULE-TERM-02',
      severity: 'Medium',
      originalSegment: 'unrivaled, game-changing Sovereign Cloud AI... completely blowing legacy competitors out of the water',
      suggestedFix: 'sovereign-grade Sovereign Cloud AI infrastructure... setting a new benchmark for multi-tenant isolation',
      explanation:
        'Canon Brand Voice mandates measured, objective engineering descriptions. Expressions like "blowing competitors out of the water" violate enterprise decorum.',
      status: 'detected',
    });
  }

  // Check RULE-VOICE-01 (Coercive urgency / FUD)
  if (/must survive the quantum threat|ditch antiquated vendor lock-in|adopt our miraculous sovereign stack immediately/i.test(draftText)) {
    findings.push({
      id: 'find-voice-01',
      category: 'Tone & Voice',
      title: 'Coercive Urgency & Existential Threat Framing',
      guidelineRef: 'RULE-VOICE-01',
      severity: 'Medium',
      originalSegment: 'Every financial institution that wants to survive the quantum threat must ditch antiquated vendor lock-in and adopt our miraculous sovereign stack immediately',
      suggestedFix: 'Institutions navigating post-quantum readiness require provable cryptographic boundaries that satisfy rigorous regulatory oversight without proprietary vendor lock-in',
      explanation:
        'Coercive phrasing ("must survive or ditch") undermines consultative enterprise partnership and triggers compliance pushback from risk officers.',
      status: 'detected',
    });
  }

  // Check RULE-CLM-05 (Outdated benchmark citation)
  if (/late 2023|2023/i.test(draftText) && /450%/i.test(draftText)) {
    findings.push({
      id: 'find-clm-01',
      category: 'Claims',
      title: 'Outdated Performance Benchmark (> 180 Days)',
      guidelineRef: 'RULE-CLM-05',
      severity: 'High',
      originalSegment: 'In recent benchmark evaluations conducted in late 2023, Canon Sovereign Cloud outperformed rival multi-tenant hypervisors by 450%',
      suggestedFix: 'In laboratory trials verified under EuroFinTel 2026 performance testing standards, Canon Sovereign Cloud demonstrated high-throughput crypto-shredding',
      explanation:
        'Quantitative claims regarding throughput must reference data produced within the past 180 calendar days. The cited late 2023 report is expired.',
      status: 'detected',
    });
  }

  // Check RULE-A11Y-03 (Unexpanded acronyms)
  if (/\bPQC\b|\bHSM\b/.test(draftText) && !/Post-Quantum Cryptography/i.test(draftText)) {
    findings.push({
      id: 'find-a11y-01',
      category: 'Accessibility',
      title: 'Unexpanded Technical Acronyms (PQC, HSM)',
      guidelineRef: 'RULE-A11Y-03',
      severity: 'Low',
      originalSegment: 'next-gen PQC and hardware HSM modules',
      suggestedFix: 'Post-Quantum Cryptography (PQC) and Hardware Security Modules (HSM)',
      explanation:
        'WCAG 3.1.4 requires specialized abbreviations to be expanded on first mention for cognitive accessibility and cross-functional clarity.',
      status: 'detected',
    });
  }

  // Check RULE-LEGAL-01 (Zero manual audits disclaimer)
  if (/zero manual audits required|automated compliance filings for DORA/i.test(draftText)) {
    findings.push({
      id: 'find-legal-01',
      category: 'Core Messaging',
      title: 'Regulatory Liability: "Zero Manual Audits" Assertion',
      guidelineRef: 'RULE-LEGAL-01',
      severity: 'High',
      originalSegment: 'automated compliance filings for DORA and NIS2 regulations with zero manual audits required',
      suggestedFix: 'automated technical evidence logging to accelerate customer DORA and NIS2 compliance filings',
      explanation:
        'Under EU DORA, institutional responsibility for operational resilience cannot be delegated to a cloud vendor. Promising "zero manual audits" creates severe regulatory liability.',
      status: 'detected',
    });
  }

  // Check RULE-VIS-01 (Visual clearspace / banner styling)
  if (/red branding banner attached without monochrome contrast margins/i.test(draftText)) {
    findings.push({
      id: 'find-vis-01',
      category: 'Visuals',
      title: 'Non-Compliant Visual Asset Clearspace & Contrast Margin',
      guidelineRef: 'RULE-VIS-01',
      severity: 'Low',
      originalSegment: 'red branding banner attached without monochrome contrast margins',
      suggestedFix: 'accompanying visual assets incorporate approved 24px clearspace margins on corporate dark slate background',
      explanation:
        'Brand identity guidelines prohibit high-saturation crimson banners without dark slate isolation margins on public press assets.',
      status: 'detected',
    });
  }

  // ========================================================
  // FERNWICK PAY & CANON GATEWAY / WATCH GOVERNANCE CHECKS
  // ========================================================

  // Check RULE-FIN-01 (Guaranteed instant approval prohibition)
  if (/guaranteed instant approval|instant approval for all/i.test(draftText)) {
    const matched = draftText.match(/guaranteed instant approval|instant approval for all merchant payment gateways|instant approval/i)?.[0] || 'guaranteed instant approval';
    findings.push({
      id: 'find-fin-01',
      category: 'Claims',
      title: 'Unsupported Claim: "Guaranteed Instant Approval"',
      guidelineRef: 'RULE-FIN-01',
      severity: 'High',
      originalSegment: matched,
      suggestedFix: 'streamlined merchant onboarding with standard risk review within 24 hours',
      explanation:
        'Merchant payment processing requires KYC risk verification and underwriting per banking regulations (Fact FACT-SETTLE-01). Instant approval cannot be unconditionally guaranteed.',
      status: 'detected',
    });
  }

  // Check RULE-FEE-01 (Zero fees forever / free processing)
  if (/zero processing fees forever|zero fees forever|completely free processing/i.test(draftText)) {
    const matched = draftText.match(/zero processing fees forever|zero fees forever|completely free processing/i)?.[0] || 'zero processing fees forever';
    findings.push({
      id: 'find-fee-01',
      category: 'Claims',
      title: 'Contradiction with Approved Fee Schedule: "Zero Fees Forever"',
      guidelineRef: 'RULE-FEE-01',
      severity: 'High',
      originalSegment: matched,
      suggestedFix: 'transparent standard merchant pricing of 1.2% + ₹2 per transaction',
      explanation:
        'Approved Fact FACT-FEE-01 specifies a standard commercial rate of 1.2% + ₹2. Promising "zero fees forever" creates false commercial expectations and regulatory liability.',
      status: 'detected',
    });
  }

  // Check RULE-RISK-01 (Zero chargeback risk)
  if (/zero chargeback risk|guaranteed zero chargeback/i.test(draftText)) {
    findings.push({
      id: 'find-risk-01',
      category: 'Claims',
      title: 'Unsubstantiated Indemnity: "Zero Chargeback Risk"',
      guidelineRef: 'RULE-RISK-01',
      severity: 'High',
      originalSegment: 'zero chargeback risk',
      suggestedFix: 'industry-leading automated chargeback mitigation workflows',
      explanation:
        'Card scheme operating regulations govern chargeback dispute cycles. Merchants cannot be guaranteed zero chargeback exposure.',
      status: 'detected',
    });
  }

  // Check RULE-CLM-EXP (Expired promotional cashback: 5% unlimited cashback or ₹5,000 cashback reward)
  if (/5% unlimited cashback|₹5,000 cashback reward|5,000 cashback reward|₹5,000 cashback|cashback reward/i.test(draftText)) {
    const matched = draftText.match(/5% unlimited cashback on merchant transfers|5% unlimited cashback|₹5,000 cashback reward|5,000 cashback reward|₹5,000 cashback|cashback reward/i)?.[0] || '₹5,000 cashback reward';
    findings.push({
      id: 'find-exp-01',
      category: 'Claims',
      title: 'Expired Promotional Claim: Cashback Incentive (Concluded Program)',
      guidelineRef: 'RULE-CLM-05',
      severity: 'High',
      originalSegment: matched,
      suggestedFix: 'certified 99.98% gateway availability SLA with daily settlements',
      explanation:
        'Approved Fact FACT-EXP-01 expired on 2025-01-31. Retaining expired rebate or cash incentive claims in active marketing collateral violates fair trading compliance.',
      status: 'detected',
    });
  }

  // Check Approved Facts Consistency (e.g., if price fact changed to ₹25,000 but text still has ₹50,000)
  if (approvedFacts) {
    const priceFact = approvedFacts.find((f) => f.code === 'FACT-PRICE-01');
    if (priceFact && priceFact.value !== '₹50,000' && /₹50,000/i.test(draftText)) {
      findings.push({
        id: 'find-watch-price-01',
        category: 'Claims',
        title: `Outdated Approved Price Detected: Contains ₹50,000 (Current Fact: ${priceFact.value})`,
        guidelineRef: 'RULE-CLM-05',
        severity: 'High',
        originalSegment: '₹50,000',
        suggestedFix: priceFact.value,
        explanation: `Approved Fact FACT-PRICE-01 has been updated to ${priceFact.value}. Stored or generated content still contains superseded price ₹50,000.`,
        status: 'detected',
      });
    }
  }

  return findings;
}

/**
 * Calculate Publication Readiness Summary
 */
export function calculatePublicationReadiness(
  findings: AuditFinding[],
  claims: ClaimItem[]
): {
  score: number;
  status: 'Approved for Publication' | 'Requires Review' | 'Publication Blocked';
  statusColor: 'emerald' | 'amber' | 'rose';
  blockingReasons: string[];
  totalFindings: number;
  activeViolations: number;
  fixedCount: number;
  overriddenCount: number;
  criticalClaimsCount: number;
} {
  const activeFindings = findings.filter((f) => f.status === 'detected');
  const highSeverityCount = activeFindings.filter((f) => f.severity === 'High').length;
  const mediumSeverityCount = activeFindings.filter((f) => f.severity === 'Medium').length;
  const lowSeverityCount = activeFindings.filter((f) => f.severity === 'Low').length;

  const fixedCount = findings.filter((f) => f.status === 'fixed').length;
  const overriddenCount = findings.filter((f) => f.status === 'overridden').length;

  // Claims inspection (evaluates active claims in the latest content)
  const activeClaims = claims.filter((c) => c.isActive !== false);
  const unsupportedClaims = activeClaims.filter(
    (c) => c.status === 'Unsupported' || c.status === 'Needs Verification'
  );
  const expiredClaims = activeClaims.filter((c) => c.status === 'Expired Evidence');

  const blockingReasons: string[] = [];

  if (unsupportedClaims.length > 0) {
    blockingReasons.push(
      `${unsupportedClaims.length} unsupported/unverified claim${unsupportedClaims.length > 1 ? 's' : ''} in Claim Ledger`
    );
  }
  if (expiredClaims.length > 0) {
    blockingReasons.push(
      `${expiredClaims.length} claim${expiredClaims.length > 1 ? 's' : ''} with expired evidence (>180 days)`
    );
  }
  if (highSeverityCount > 0) {
    blockingReasons.push(`${highSeverityCount} unresolved High-severity brand & regulatory violation${highSeverityCount > 1 ? 's' : ''}`);
  }

  // Base score 100 minus penalties
  let score = 100;
  score -= highSeverityCount * 18;
  score -= mediumSeverityCount * 8;
  score -= lowSeverityCount * 3;
  score -= unsupportedClaims.length * 15;
  score -= expiredClaims.length * 8;

  score = Math.max(12, Math.min(100, score));

  let status: 'Approved for Publication' | 'Requires Review' | 'Publication Blocked' = 'Approved for Publication';
  let statusColor: 'emerald' | 'amber' | 'rose' = 'emerald';

  if (unsupportedClaims.length > 0 || highSeverityCount > 0) {
    status = 'Publication Blocked';
    statusColor = 'rose';
  } else if (score < 85 || mediumSeverityCount > 0 || expiredClaims.length > 0) {
    status = 'Requires Review';
    statusColor = 'amber';
  } else {
    status = 'Approved for Publication';
    statusColor = 'emerald';
  }

  return {
    score,
    status,
    statusColor,
    blockingReasons,
    totalFindings: findings.length,
    activeViolations: activeFindings.length,
    fixedCount,
    overriddenCount,
    criticalClaimsCount: unsupportedClaims.length + expiredClaims.length,
  };
}
