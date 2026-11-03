import {
  AuditFinding,
  AuditLogEntry,
  BrandGuideline,
  ClaimItem,
  CorporateDraftSample,
  HistoricalAsset,
  TeamMember,
  ApprovedFact,
  WatchContentItem,
  GatewayWorkflowState,
  GatewayBrief,
  ContentItem,
} from '../types';

export const INITIAL_CONTENT_ITEMS: ContentItem[] = [
  {
    id: 'draft-sovereign-cloud',
    title: 'Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement',
    originalText: `Canon Corporation today announced its unrivaled, game-changing Sovereign Cloud AI infrastructure expansion across Frankfurt, Zurich, and Tokyo data hubs. The state-of-the-art platform guarantees 100% unbreachable data security and flawless 100% continuous uptime, completely blowing legacy competitors out of the water.

Built upon our revolutionary ultra-secure hypervisor technology, the infrastructure ensures that customer confidential weights are never inspected by rogue foreign intelligence services or third-party cloud vendors. In recent benchmark evaluations conducted in late 2023, Canon Sovereign Cloud outperformed rival multi-tenant hypervisors by 450% in crypto-shredding velocity and delivered a certified sub-5ms Latency SLA across all tier-1 banking transaction loops.

Furthermore, we utilize next-gen PQC and hardware HSM modules to provide unbreakable air-gapped enclaves. As noted by our visionary CEO Marcus Sterling: "Every financial institution that wants to survive the quantum threat must ditch antiquated vendor lock-in and adopt our miraculous sovereign stack immediately."

All enterprise tier customers will enjoy automated compliance filings for DORA and NIS2 regulations with zero manual audits required. For visual assets, refer to the red branding banner attached without monochrome contrast margins.`,
    workingText: `Canon Corporation today announced its unrivaled, game-changing Sovereign Cloud AI infrastructure expansion across Frankfurt, Zurich, and Tokyo data hubs. The state-of-the-art platform guarantees 100% unbreachable data security and flawless 100% continuous uptime, completely blowing legacy competitors out of the water.

Built upon our revolutionary ultra-secure hypervisor technology, the infrastructure ensures that customer confidential weights are never inspected by rogue foreign intelligence services or third-party cloud vendors. In recent benchmark evaluations conducted in late 2023, Canon Sovereign Cloud outperformed rival multi-tenant hypervisors by 450% in crypto-shredding velocity and delivered a certified sub-5ms Latency SLA across all tier-1 banking transaction loops.

Furthermore, we utilize next-gen PQC and hardware HSM modules to provide unbreakable air-gapped enclaves. As noted by our visionary CEO Marcus Sterling: "Every financial institution that wants to survive the quantum threat must ditch antiquated vendor lock-in and adopt our miraculous sovereign stack immediately."

All enterprise tier customers will enjoy automated compliance filings for DORA and NIS2 regulations with zero manual audits required. For visual assets, refer to the red branding banner attached without monochrome contrast margins.`,
    contentType: 'Press Release / Executive Comms',
    source: 'Corporate Sample',
    auditVersion: 1,
    auditResults: {
      hasAudited: false,
      findings: [],
    },
    associatedClaimIds: ['claim-1', 'claim-2', 'claim-3', 'claim-4', 'claim-5', 'claim-6'],
    correctionHistory: [],
    reviewStatus: 'draft',
    createdAt: '2026-10-24 09:00:00',
    updatedAt: '2026-10-24 09:12:00',
  },
  {
    id: 'draft-fintech-ledger',
    title: 'Global FinTech Real-Time Sovereign Ledger Compliance Whitepaper',
    originalText: `Our miraculous distributed ledger platform delivers completely bulletproof transaction settlement that absolutely eliminates counterparty default risk in high-frequency FX swaps. By leveraging proprietary zero-knowledge cryptography, Canon guarantees zero latency degradation even during extreme liquidity freezes.

Legacy core banking engines simply cannot compete with our revolutionary throughput of 1,200,000 TPS under full cryptographic auditing. All financial market participants must transition to this paradigm immediately or risk catastrophic regulatory fines under upcoming DORA Article 16 guidelines.`,
    workingText: `Our miraculous distributed ledger platform delivers completely bulletproof transaction settlement that absolutely eliminates counterparty default risk in high-frequency FX swaps. By leveraging proprietary zero-knowledge cryptography, Canon guarantees zero latency degradation even during extreme liquidity freezes.

Legacy core banking engines simply cannot compete with our revolutionary throughput of 1,200,000 TPS under full cryptographic auditing. All financial market participants must transition to this paradigm immediately or risk catastrophic regulatory fines under upcoming DORA Article 16 guidelines.`,
    contentType: 'Technical Whitepaper',
    source: 'Corporate Sample',
    auditVersion: 1,
    auditResults: {
      hasAudited: false,
      findings: [],
    },
    associatedClaimIds: [],
    correctionHistory: [],
    reviewStatus: 'draft',
    createdAt: '2026-10-18 10:00:00',
    updatedAt: '2026-10-18 10:00:00',
  },
  {
    id: 'draft-esg-sustainability',
    title: 'Net-Zero Enterprise Data Center Operations & ESG Impact Brief',
    originalText: `Canon has completely solved corporate carbon emissions across all European cloud operations, reaching true 100% zero-carbon purity through our proprietary geothermal AI clusters. We have totally eradicated Scope 2 emissions ahead of every other technology conglomerate globally.

Our PUE rating of 1.08 is the lowest ever achieved by any computing facility in human history. Every competitor still relies on toxic offset credits rather than real-time renewable matching. Our operations are fully eco-certified with zero impact on local biodiversity.`,
    workingText: `Canon has completely solved corporate carbon emissions across all European cloud operations, reaching true 100% zero-carbon purity through our proprietary geothermal AI clusters. We have totally eradicated Scope 2 emissions ahead of every other technology conglomerate globally.

Our PUE rating of 1.08 is the lowest ever achieved by any computing facility in human history. Every competitor still relies on toxic offset credits rather than real-time renewable matching. Our operations are fully eco-certified with zero impact on local biodiversity.`,
    contentType: 'Sustainability & Governance Report',
    source: 'Corporate Sample',
    auditVersion: 1,
    auditResults: {
      hasAudited: false,
      findings: [],
    },
    associatedClaimIds: [],
    correctionHistory: [],
    reviewStatus: 'draft',
    createdAt: '2026-10-12 14:00:00',
    updatedAt: '2026-10-12 14:00:00',
  },
];

export const INITIAL_DRAFTS: CorporateDraftSample[] = [
  {
    id: 'draft-sovereign-cloud',
    title: 'Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement',
    category: 'Press Release / Executive Comms',
    author: 'Elena Rostova (VP Product Marketing)',
    date: '2026-10-24',
    intent: {
      primaryPurpose:
        'Announce Canon Sovereign Cloud expansion into European and APAC regions while validating zero-trust security for Fortune 500 banks.',
      targetAudience:
        'Enterprise Chief Information Security Officers (CISOs), Chief Compliance Officers, and Infrastructure Architects.',
      corePersona: 'Cautious Enterprise Risk Architect seeking verifiable sovereignty and low latency.',
      mustKeepTerms: [
        'Sovereign Cloud',
        'FedRAMP High',
        'Zero-Knowledge Attestation',
        'PQC Encryption',
        'Sub-5ms Latency SLA',
        'Air-Gapped Enclaves',
      ],
      intentPreservationScores: {
        minimal: 97,
        balanced: 92,
        reframe: 84,
      },
    },
    originalText: `Canon Corporation today announced its unrivaled, game-changing Sovereign Cloud AI infrastructure expansion across Frankfurt, Zurich, and Tokyo data hubs. The state-of-the-art platform guarantees 100% unbreachable data security and flawless 100% continuous uptime, completely blowing legacy competitors out of the water.

Built upon our revolutionary ultra-secure hypervisor technology, the infrastructure ensures that customer confidential weights are never inspected by rogue foreign intelligence services or third-party cloud vendors. In recent benchmark evaluations conducted in late 2023, Canon Sovereign Cloud outperformed rival multi-tenant hypervisors by 450% in crypto-shredding velocity and delivered a certified sub-5ms Latency SLA across all tier-1 banking transaction loops.

Furthermore, we utilize next-gen PQC and hardware HSM modules to provide unbreakable air-gapped enclaves. As noted by our visionary CEO Marcus Sterling: "Every financial institution that wants to survive the quantum threat must ditch antiquated vendor lock-in and adopt our miraculous sovereign stack immediately."

All enterprise tier customers will enjoy automated compliance filings for DORA and NIS2 regulations with zero manual audits required. For visual assets, refer to the red branding banner attached without monochrome contrast margins.`,
  },
  {
    id: 'draft-fintech-ledger',
    title: 'Global FinTech Real-Time Sovereign Ledger Compliance Whitepaper',
    category: 'Technical Whitepaper',
    author: 'Devon Vance (Chief Security Architect)',
    date: '2026-10-18',
    intent: {
      primaryPurpose:
        'Demonstrate verifiable algorithmic compliance under Basel IV and DORA standards for tier-1 clearinghouses.',
      targetAudience: 'Banking Regulators, Quant Risk Analysts, and Treasury Compliance Officers.',
      corePersona: 'Quantitative Compliance Auditor requiring rigorous mathematical proofs.',
      mustKeepTerms: [
        'Deterministic Finality',
        'Zero-Knowledge Ledger',
        'Basel IV Capital Buffers',
        'DORA Article 16',
        'Multi-Party Computation',
      ],
      intentPreservationScores: {
        minimal: 96,
        balanced: 91,
        reframe: 83,
      },
    },
    originalText: `Our miraculous distributed ledger platform delivers completely bulletproof transaction settlement that absolutely eliminates counterparty default risk in high-frequency FX swaps. By leveraging proprietary zero-knowledge cryptography, Canon guarantees zero latency degradation even during extreme liquidity freezes.

Legacy core banking engines simply cannot compete with our revolutionary throughput of 1,200,000 TPS under full cryptographic auditing. All financial market participants must transition to this paradigm immediately or risk catastrophic regulatory fines under upcoming DORA Article 16 guidelines.`,
  },
  {
    id: 'draft-esg-sustainability',
    title: 'Net-Zero Enterprise Data Center Operations & ESG Impact Brief',
    category: 'Sustainability & Governance Report',
    author: 'Amina Al-Mansoor (Global Head of Sustainability)',
    date: '2026-10-12',
    intent: {
      primaryPurpose:
        'Communicate verified PUE improvements and 24/7 carbon-free energy matching across Nordic and Alpine facilities.',
      targetAudience: 'Institutional Investors, ESG Rating Agencies, and Board Sustainability Committees.',
      corePersona: 'Skeptical ESG Due Diligence Analyst inspecting scope 1-3 disclosures.',
      mustKeepTerms: [
        'Power Usage Effectiveness (PUE) 1.08',
        '24/7 Carbon-Free Energy (CFE)',
        'Scope 3 Upstream Embodied Carbon',
        'ISO 14064-3',
      ],
      intentPreservationScores: {
        minimal: 98,
        balanced: 94,
        reframe: 86,
      },
    },
    originalText: `Canon has completely solved corporate carbon emissions across all European cloud operations, reaching true 100% zero-carbon purity through our proprietary geothermal AI clusters. We have totally eradicated Scope 2 emissions ahead of every other technology conglomerate globally.

Our PUE rating of 1.08 is the lowest ever achieved by any computing facility in human history. Every competitor still relies on toxic offset credits rather than real-time renewable matching. Our operations are fully eco-certified with zero impact on local biodiversity.`,
  },
];

export const INITIAL_BRAND_GUIDELINES: BrandGuideline[] = [
  {
    id: 'rule-sec-04',
    code: 'RULE-SEC-04',
    name: 'Absolute Reliability & Zero-Downtime Assertions',
    category: 'Claims',
    description:
      'Prohibits absolute guarantees of 100% uptime, zero vulnerability, or unbreachable security without contractually defined SLA exclusions and disclaimers.',
    originalWording:
      'Content must never assert "100% uptime", "unbreachable security", "bulletproof protection", or "zero default risk" without qualifying SLA exclusions (force majeure, maintenance windows) and standard liability caps.',
    proposedWording:
      'Replace absolute superlatives ("100% unbreachable", "bulletproof", "guaranteed zero downtime") with verifiable commitments, e.g., "architected for 99.999% availability with cryptographically attested memory protection under defined SLA terms".',
    overrideCount: 19,
    disputeFrequency: 24.2,
    ambiguityScore: 38,
    status: 'Active',
    version: '1.2',
    lastModified: '2026-09-14',
    rationale:
      'Marketing teams repeatedly requested exceptions for customer executive decks. A refined standard clarifies that high-availability percentages (e.g. 99.999%) are acceptable when tied to published SLA exhibits.',
    matchPatterns: ['100% unbreachable', '100% continuous uptime', 'flawless 100%', 'bulletproof', 'unbreakable'],
  },
  {
    id: 'rule-term-02',
    code: 'RULE-TERM-02',
    name: 'Marketing Hyperbole & Buzzword Prohibition',
    category: 'Terminology',
    description:
      'Restricts vacuous promotional jargon including "miraculous", "game-changing", "blowing out of the water", and undefined "next-gen".',
    originalWording:
      'Do not employ unsubstantiated hyperbole, slang, or theatrical buzzwords ("game-changing", "miraculous", "revolutionary", "blows away"). Use sober, engineering-grounded product terminology.',
    proposedWording:
      'Eliminate hyperbolic adjectives and adversarial phrasing. State the concrete architectural mechanism (e.g. "hardware-enforced memory isolation" instead of "revolutionary game-changing protection").',
    overrideCount: 32,
    disputeFrequency: 31.8,
    ambiguityScore: 52,
    status: 'Under Review',
    version: '2.0-draft',
    lastModified: '2026-10-02',
    rationale:
      'Writers frequently dispute whether terms like "state-of-the-art" or "next-generation" are permissible when referring to third-party standards such as Post-Quantum Cryptography (PQC). Proposed update provides an explicit permitted terminology whitelist.',
    matchPatterns: [
      'unrivaled',
      'game-changing',
      'blowing legacy competitors out of the water',
      'revolutionary',
      'miraculous',
      'ditch antiquated',
      'state-of-the-art',
    ],
  },
  {
    id: 'rule-voice-01',
    code: 'RULE-VOICE-01',
    name: 'Objective Enterprise Voice vs Coercive Urgency',
    category: 'Tone & Voice',
    description:
      'Mandates a calm, consultative, and authoritative tone. Forbids fear-uncertainty-doubt (FUD) tactics and coercive language ("must survive", "ditch now").',
    originalWording:
      'Brand messaging must maintain an authoritative, consultative, and peer-to-peer tone. Coercive pressure, apocalyptic phrasing ("must ditch or fail"), or patronizing imperatives are strictly disallowed.',
    proposedWording:
      'Maintain an objective risk-management posture. Frame industry shifts around regulatory timelines, operational resilience, and quantifiable ROI rather than existential urgency or threat intimidation.',
    overrideCount: 8,
    disputeFrequency: 11.4,
    ambiguityScore: 21,
    status: 'Active',
    version: '1.4',
    lastModified: '2026-08-19',
    rationale:
      'Clear consensus between Legal and Brand Council; low ambiguity score with steady compliance compliance across all regional PR desks.',
    matchPatterns: ['must survive the quantum threat', 'ditch antiquated vendor lock-in', 'risk catastrophic'],
  },
  {
    id: 'rule-clm-05',
    code: 'RULE-CLM-05',
    name: 'Benchmark Evidence Recency & Third-Party Grounding',
    category: 'Claims',
    description:
      'Empirical performance, latency, or comparative throughput claims must reference an audit or benchmark dated within the preceding 180 days.',
    originalWording:
      'Any quantitative benchmark or comparative throughput claim must cite verified internal testing or accredited third-party lab results generated within the last 180 calendar days.',
    proposedWording:
      'All quantitative comparative claims (e.g. "+450% crypto-shredding", "sub-5ms") must reference a verifiable evaluation methodology and artifact dated within the past 180 days; benchmarks exceeding 180 days must be explicitly noted as historical baselines or re-certified.',
    overrideCount: 27,
    disputeFrequency: 28.6,
    ambiguityScore: 46,
    status: 'Active',
    version: '1.1',
    lastModified: '2026-07-11',
    rationale:
      'Many drafts carry forward 2023 or 2024 performance figures into 2026 communications without updating lab certifications.',
    matchPatterns: ['late 2023', 'outperformed rival multi-tenant hypervisors by 450%'],
  },
  {
    id: 'rule-a11y-03',
    code: 'RULE-A11Y-03',
    name: 'Acronym Expansion & WCAG 3.1.4 Readability',
    category: 'Accessibility',
    description:
      'Technical acronyms (PQC, HSM, DORA, NIS2, PUE) must be expanded on first occurrence in public releases to ensure cognitive readability for diverse stakeholders.',
    originalWording:
      'Public-facing releases must expand specialized abbreviations on initial mention (e.g., Post-Quantum Cryptography [PQC], Hardware Security Module [HSM]). Reading complexity must target Grade 11-13.',
    proposedWording:
      'Expand domain-specific acronyms at first mention with parenthetical abbreviations. For executive releases, include a brief contextual definition on first use.',
    overrideCount: 5,
    disputeFrequency: 7.2,
    ambiguityScore: 14,
    status: 'Active',
    version: '1.0',
    lastModified: '2026-04-12',
    rationale:
      'Highly objective mechanical rule. Low dispute rate, easily automated in authoring pipelines.',
    matchPatterns: ['PQC', 'HSM', 'DORA', 'NIS2'],
  },
  {
    id: 'rule-vis-01',
    code: 'RULE-VIS-01',
    name: 'Sovereign Brand Marks & Clearspace Standards',
    category: 'Visuals',
    description:
      'Requires full clearspace padding (minimum 1.5x mark height) around corporate emblem and forbids raw high-contrast red banners without dark theme margins.',
    originalWording:
      'All imagery and header banners accompanying corporate announcements must adhere to the 1.5x clearspace margin guidelines and avoid saturated crimson fills on digital displays.',
    proposedWording:
      'Digital banners must maintain minimum 24px clearspace perimeter, utilize approved corporate dark slate (#0B0F19) backgrounds with subtle accent gradients, and provide descriptive alt text for WCAG 1.1.1.',
    overrideCount: 14,
    disputeFrequency: 19.3,
    ambiguityScore: 33,
    status: 'Active',
    version: '1.3',
    lastModified: '2026-09-01',
    rationale:
      'Regional agencies frequently used non-standard colored banners to make press releases "pop", degrading corporate trust markers.',
    matchPatterns: ['red branding banner attached without monochrome contrast margins'],
  },
  {
    id: 'rule-legal-01',
    code: 'RULE-LEGAL-01',
    name: 'Regulatory Compliance Exemption Disclaimers',
    category: 'Core Messaging',
    description:
      'Forbids claims that software products offer "zero manual audits" or automatic guarantee of compliance with EU or US financial regulations.',
    originalWording:
      'Products cannot be described as providing "automatic compliance" or "zero manual audits" for NIS2, DORA, or GDPR. Marketing must state that tools assist compliance and customer remains the regulated entity.',
    proposedWording:
      'Clarify that Canon provides automated technical controls and audit telemetry to accelerate customer adherence to DORA and NIS2, while explicit customer governance remains necessary.',
    overrideCount: 22,
    disputeFrequency: 26.0,
    ambiguityScore: 39,
    status: 'Active',
    version: '1.2',
    lastModified: '2026-08-30',
    rationale:
      'High legal liability risk if an enterprise client is penalized by ESMA or BaFin and claims Canon promised "zero manual audits".',
    matchPatterns: ['automated compliance filings for DORA and NIS2 regulations with zero manual audits required'],
  },
  {
    id: 'rule-msg-02',
    code: 'RULE-MSG-02',
    name: 'Third-Party Competitor Denigration Prohibition',
    category: 'Core Messaging',
    description:
      'Forbids disparaging unnamed or named competitors ("rogue foreign intelligence", "legacy competitors blown away"). Focus on positive Canon value.',
    originalWording:
      'Communications must focus strictly on Canon merits and verified architecture. Attacking or disparaging competitors, foreign nation-states, or industry peers is barred.',
    proposedWording:
      'Emphasize sovereign data residency and multi-jurisdictional isolation without invoking inflammatory accusations regarding rival services or foreign surveillance agencies.',
    overrideCount: 11,
    disputeFrequency: 15.8,
    ambiguityScore: 29,
    status: 'Active',
    version: '1.1',
    lastModified: '2026-07-28',
    rationale:
      'General Counsel requires professional distance to avoid diplomatic and commercial defamation friction.',
    matchPatterns: ['rogue foreign intelligence services or third-party cloud vendors'],
  },
];

export const INITIAL_CLAIMS: ClaimItem[] = [
  {
    id: 'claim-1',
    claimText: '100% unbreachable data security and flawless 100% continuous uptime',
    draftContext:
      'The state-of-the-art platform guarantees 100% unbreachable data security and flawless 100% continuous uptime...',
    status: 'Unsupported',
    owner: 'Elena Rostova (VP Marketing)',
    evidenceLink: 'https://internal-trust.canon.internal/sla-contracts/sovereign-cloud-q3',
    evidenceCitation: 'Internal SLA Master Agreement v4.2 §7.1 (Uptime commitment: 99.995%)',
    evidenceDate: '2026-09-15',
    expiryDate: '2027-09-15',
    riskLevel: 'Critical',
    category: 'Security',
    contentId: 'draft-sovereign-cloud',
    contentTitle: 'Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement',
    auditVersion: 1,
    isActive: true,
    statusReason: 'Contradicts Master SLA §7.1: Canon commits to 99.995% availability excluding maintenance. Absolute 100% guarantees are legally unsupportable.',
    evidenceArtifact: {
      documentTitle: 'Master Enterprise Cloud SLA & High-Availability Schedule §7.1',
      documentType: 'Contractual SLA Agreement Rider & Service Terms',
      issuerOrFirm: 'Canon Global Infrastructure & Cloud Legal Operations',
      referenceCode: 'SLA-CANON-2026-v4.2-SEC7',
      abstract:
        'Corporate standard service level agreement defining infrastructure availability commitments, planned maintenance exclusions, and force majeure liabilities.',
      clausesOrExhibits: [
        {
          title: '§7.1.1 Target Monthly Availability',
          content:
            'Canon provides a 99.995% monthly service availability commitment across Sovereign Cloud hypervisor clusters.',
          highlight: true,
        },
        {
          title: '§7.1.4 Scheduled Maintenance Exclusions',
          content:
            'Availability calculations strictly exclude scheduled maintenance patch windows (up to 4 hours per calendar quarter) and unforeseen force majeure events.',
          highlight: true,
        },
        {
          title: '§7.2 Warranty Limitations & Disclaimers',
          content:
            'Canon disclaims absolute or unbreachable protection warranties; liability is capped at 12 months recurring contract fees.',
        },
      ],
      supportAssessment:
        'CONTRADICTION DETECTED: The contractual agreement commits to 99.995% availability with explicit exclusion clauses. It does not warrant "100% unbreachable" protection or "flawless 100% continuous uptime".',
      isContradictionOrExpired: true,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-1',
        action: 'Claim Extracted',
        author: 'Canon Audit Engine',
        timestamp: '2026-10-24 09:12:00',
        note: 'Extracted automatically from active corporate draft. Flagged as unsupported absolute guarantee.',
      },
      {
        id: 'h-2',
        action: 'Legal Review Requested',
        author: 'Elena Rostova',
        timestamp: '2026-10-24 10:45:00',
        note: 'Marketing requested confirmation whether contract terms allow "100% unbreachable" in promotional copy.',
      },
    ],
  },
  {
    id: 'claim-2',
    claimText: 'Outperformed rival multi-tenant hypervisors by 450% in crypto-shredding velocity',
    draftContext:
      'In recent benchmark evaluations conducted in late 2023, Canon Sovereign Cloud outperformed rival multi-tenant hypervisors by 450%...',
    status: 'Expired Evidence',
    owner: 'Dr. Aris Thorne (Chief Cryptographer)',
    evidenceLink: 'https://benchmarks.canon.internal/reports/hypervisor-perf-2023-q4.pdf',
    evidenceCitation: 'Performance Lab Whitepaper #CAN-2023-882 (Dated Nov 14, 2023)',
    evidenceDate: '2023-11-14',
    expiryDate: '2024-05-14',
    riskLevel: 'Moderate',
    category: 'Performance',
    contentId: 'draft-sovereign-cloud',
    contentTitle: 'Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'Hypervisor Crypto-Shredding Performance Lab Whitepaper',
      documentType: 'Laboratory Benchmark Technical Whitepaper',
      issuerOrFirm: 'Canon Cryptographic Systems Evaluation Group',
      referenceCode: 'CAN-2023-882-PERF',
      abstract:
        'Empirical comparative throughput analysis measuring multi-tenant hypervisor isolation and hardware-assisted cryptographic memory destruction under synthetic loads.',
      clausesOrExhibits: [
        {
          title: '§3.2 Comparative Velocity Benchmark',
          content:
            'In laboratory micro-benchmarks conducted on November 14, 2023, Canon hypervisor memory crypto-shredding achieved a 450% higher throughput over standard multi-tenant baselines.',
          highlight: true,
        },
        {
          title: '§5.1 Recency Horizon & Validity Window',
          content:
            'Laboratory evaluation results are certified valid for 180 calendar days from publication (Expired: May 14, 2024 under Brand Rule RULE-CLM-05).',
          highlight: true,
        },
      ],
      supportAssessment:
        'EXPIRED EVIDENCE (>1,000 Days Old): While laboratory trials from late 2023 showed a 450% throughput gain, the artifact expired on May 14, 2024. Brand Rule RULE-CLM-05 requires quantitative benchmark evidence within the preceding 180 days.',
      isContradictionOrExpired: true,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-3',
        action: 'Claim Extracted',
        author: 'Canon Audit Engine',
        timestamp: '2026-10-24 09:12:00',
        note: 'Evidence is 1,075 days old. Exceeds 180-day recency window mandated by RULE-CLM-05.',
      },
    ],
  },
  {
    id: 'claim-3',
    claimText: 'Certified sub-5ms Latency SLA across all tier-1 banking transaction loops',
    draftContext:
      '...and delivered a certified sub-5ms Latency SLA across all tier-1 banking transaction loops.',
    status: 'Verified',
    owner: 'Kiran Patel (Head of Network Infrastructure)',
    evidenceLink: 'https://telemetry.canon.internal/certifications/fintech-latency-oct2026.pdf',
    evidenceCitation: 'Accredited Latency Audit by EuroFinTel Labs #EFT-2026-10 (Verified Oct 8, 2026)',
    evidenceDate: '2026-10-08',
    expiryDate: '2027-04-08',
    riskLevel: 'Low',
    category: 'Performance',
    contentId: 'draft-sovereign-cloud',
    contentTitle: 'Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'EuroFinTel Accredited High-Speed Banking Latency Audit',
      documentType: 'Accredited Lab Telemetry & Latency Attestation',
      issuerOrFirm: 'EuroFinTel Independent Telecommunications Testing Consortium',
      referenceCode: 'EFT-2026-10-LAT',
      abstract:
        'Packet-trace telemetry measuring cross-border banking settlement latency across Frankfurt, Zurich, and Tokyo fiber routing matrices under continuous 200Gbps synthetic load.',
      clausesOrExhibits: [
        {
          title: '§2.4 Transaction Latency SLA Verification',
          content:
            'Tested under sustained 200Gbps simulated banking transaction load; p99 network latency registered at 3.82ms across tier-1 nodes, satisfying sub-5ms SLA.',
          highlight: true,
        },
        {
          title: '§4.1 Testing Period & Recency',
          content: 'Audit conducted October 6-8, 2026. Certified valid through April 8, 2027.',
          highlight: true,
        },
      ],
      supportAssessment:
        'VERIFIED: Independent laboratory measurements confirm p99 roundtrip transaction times of 3.82ms, well within the certified sub-5ms commitment.',
      isContradictionOrExpired: false,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-4',
        action: 'Evidence Verified',
        author: 'Kiran Patel',
        timestamp: '2026-10-10 14:20:00',
        note: 'EuroFinTel accredited test results attached. Tested under 200Gbps cross-border packet loads.',
      },
    ],
  },
  {
    id: 'claim-4',
    claimText: 'Customer confidential weights are never inspected by foreign intelligence services or third parties',
    draftContext:
      'The infrastructure ensures that customer confidential weights are never inspected by rogue foreign intelligence services...',
    status: 'Verified',
    owner: 'Devon Vance (Chief Security Architect)',
    evidenceLink: 'https://security.canon.internal/attestation/zero-knowledge-2026-audit.pdf',
    evidenceCitation: 'SOC2 Type II & BSI C5 Sovereignty Attestation Certificate #BSI-C5-2026-09',
    evidenceDate: '2026-09-02',
    expiryDate: '2027-09-02',
    riskLevel: 'Low',
    category: 'Security',
    contentId: 'draft-sovereign-cloud',
    contentTitle: 'Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'Sovereign Enclave Isolation & BSI C5 Criteria Compliance Report',
      documentType: 'SOC2 Type II & BSI C5 Sovereignty Attestation Certificate',
      issuerOrFirm: 'CyberTrust European Attestation Services GmbH',
      referenceCode: 'BSI-C5-2026-09-SOV',
      abstract:
        'Cryptographic and physical enclave audit examining administrative boundary isolation, hardware memory protection, and sovereign key residency.',
      clausesOrExhibits: [
        {
          title: '§1.2 Sovereign Key Residency',
          content:
            'Customer model weights are stored in cryptographic air-gapped enclaves with master key material remaining within sovereign European jurisdictions.',
          highlight: true,
        },
        {
          title: '§3.4 Administrative Access Protection',
          content:
            'Zero-knowledge attestation logs confirm zero unauthorized external administrative or foreign intelligence interception pathways.',
          highlight: true,
        },
      ],
      supportAssessment:
        'VERIFIED: Certified hardware and administrative isolation guarantees that confidential customer model weights cannot be inspected by external entities.',
      isContradictionOrExpired: false,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-5',
        action: 'Attestation Linked',
        author: 'Devon Vance',
        timestamp: '2026-09-05 11:00:00',
        note: 'BSI C5 sovereignty report uploaded. Hardware enclave keys held in sovereign jurisdiction.',
      },
    ],
  },
  {
    id: 'claim-5',
    claimText: 'Automated compliance filings for DORA and NIS2 regulations with zero manual audits required',
    draftContext:
      'All enterprise tier customers will enjoy automated compliance filings for DORA and NIS2 regulations with zero manual audits required.',
    status: 'Unsupported',
    owner: 'Beatrix Holzer (Senior Regulatory Counsel)',
    evidenceLink: 'https://compliance.canon.internal/legal-memos/dora-article-16-scoping',
    evidenceCitation: 'Legal Review Memo: Customer Responsibility Model for EU DORA (Ref #LG-2026-44)',
    evidenceDate: '2026-08-15',
    expiryDate: '2027-08-15',
    riskLevel: 'Critical',
    category: 'Financial',
    contentId: 'draft-sovereign-cloud',
    contentTitle: 'Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'Legal Advisory: Customer Responsibility Model under EU DORA Article 16',
      documentType: 'Regulatory Compliance Legal Memorandum',
      issuerOrFirm: 'Canon Regulatory & Corporate Legal Advisory Practice',
      referenceCode: 'MEMO-LG-2026-44-DORA',
      abstract:
        'Legal analysis of European Union Digital Operational Resilience Act (DORA) and NIS2 directive requirements concerning ICT third-party risk management.',
      clausesOrExhibits: [
        {
          title: '§2.1 Non-Delegable Compliance Obligations',
          content:
            'DORA Article 16 strictly assigns operational resilience responsibility to the regulated financial entity. A technology vendor cannot legally assume or eliminate the customer’s internal audit duty.',
          highlight: true,
        },
        {
          title: '§4.3 Permissible Product Phrasing',
          content:
            'Marketing may state that Canon automated telemetry accelerates audit readiness, but must never claim "zero manual audits" or automatic regulatory exemption.',
          highlight: true,
        },
      ],
      supportAssessment:
        'CONTRADICTION DETECTED: The legal memorandum explicitly rules that claiming "zero manual audits" violates EU regulatory frameworks and creates corporate liability.',
      isContradictionOrExpired: true,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-6',
        action: 'Regulatory Flag Raised',
        author: 'Canon Audit Engine',
        timestamp: '2026-10-24 09:12:00',
        note: 'Contradicts Legal Policy Memo #LG-2026-44: Canon provides control telemetry, but customer internal audit is legally non-delegable.',
      },
    ],
  },
  {
    id: 'claim-6',
    claimText: 'Hardware HSM modules and Post-Quantum Cryptography provide air-gapped enclaves',
    draftContext:
      'Furthermore, we utilize next-gen PQC and hardware HSM modules to provide unbreakable air-gapped enclaves.',
    status: 'Verified',
    owner: 'Devon Vance (Chief Security Architect)',
    evidenceLink: 'https://trust.canon.internal/hardware/fips-140-3-enclaves',
    evidenceCitation: 'NIST FIPS 140-3 Level 4 Validation Certificate #4412 & ML-KEM/FIPS 203 Implementation Sheet',
    evidenceDate: '2026-07-20',
    expiryDate: '2028-07-20',
    riskLevel: 'Low',
    category: 'Security',
    contentId: 'draft-sovereign-cloud',
    contentTitle: 'Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'NIST FIPS 140-3 Level 4 Cryptographic Module & PQC Validation Record',
      documentType: 'Cryptographic Module Validation Program (CMVP) Certificate',
      issuerOrFirm: 'NIST Cryptographic Module Validation Program (CMVP)',
      referenceCode: 'NIST-FIPS-140-3-CERT-4412',
      abstract:
        'Hardware security module cryptographic validation record verifying physical tamper resistance and NIST Post-Quantum Cryptography (PQC) ML-KEM/FIPS 203 primitives.',
      clausesOrExhibits: [
        {
          title: '§1.0 Physical Security Envelope',
          content:
            'Tested to FIPS 140-3 Level 4 physical security envelope with automatic zeroization on tamper detection.',
          highlight: true,
        },
        {
          title: '§2.1 Cryptographic Algorithm Suite',
          content:
            'Incorporates ML-KEM and ML-DSA post-quantum key encapsulation mechanisms, certified for air-gapped secure enclaves.',
          highlight: true,
        },
      ],
      supportAssessment:
        'VERIFIED: Module certification confirms hardware-enforced air-gapped enclaves utilizing certified Post-Quantum Cryptography.',
      isContradictionOrExpired: false,
      isDemoNotice: true,
      externalUrl: 'https://csrc.nist.gov/projects/cryptographic-module-validation-program',
      isExternalGenuine: true,
    },
    history: [
      {
        id: 'h-7',
        action: 'Evidence Approved',
        author: 'Devon Vance',
        timestamp: '2026-07-22 09:30:00',
        note: 'FIPS 140-3 validation active and audited by NIST CST laboratory.',
      },
    ],
  },
  {
    id: 'claim-fernwick-instant',
    claimText: 'Guaranteed instant approval for all merchant payment gateways',
    draftContext: 'Experience our revolutionary payment gateway with guaranteed instant approval for all merchant accounts...',
    status: 'Unsupported',
    owner: 'Elena Rostova (VP Marketing)',
    evidenceLink: 'https://compliance.fernwickpay.internal/banking/clearinghouse-spec-2026',
    evidenceCitation: 'Banking Clearinghouse Integration Spec FWP-2026-V2 & KYC Underwriting Policy',
    evidenceDate: '2026-08-20',
    expiryDate: '2027-05-01',
    riskLevel: 'Critical',
    category: 'Financial',
    contentId: 'draft-fernwick-ad',
    contentTitle: 'Fernwick Pay Retail & Merchant Payment Gateway Ad',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'Banking Clearinghouse Integration Spec & Risk Verification Protocol',
      documentType: 'Regulatory Operating Specification',
      issuerOrFirm: 'Fernwick Pay Compliance & Banking Operations Consortium',
      referenceCode: 'FWP-2026-SPEC-V2',
      abstract: 'Defines mandatory merchant onboarding, biometric verification, and anti-money laundering underwriting criteria.',
      clausesOrExhibits: [
        {
          title: '§3.1 Mandatory Underwriting SLA',
          content: 'Merchant account approval requires risk review (T+1 SLA). Instant approval is legally prohibited without biometric Tier-1 identity attestation.',
          highlight: true,
        },
      ],
      supportAssessment: 'CONTRADICTION DETECTED: Instant approval is legally prohibited by KYC banking regulations. Standard review window is T+1.',
      isContradictionOrExpired: true,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-f1',
        action: 'Claim Extracted',
        author: 'Canon Audit Engine',
        timestamp: '2026-10-24 11:20:00',
        note: 'Flagged as unsupported financial claim. Violates Banking Clearinghouse Spec FWP-2026-V2.',
      },
    ],
  },
  {
    id: 'claim-fernwick-price',
    claimText: 'Fernwick Pay Enterprise Annual License starting at ₹50,000',
    draftContext: 'Get started for only ₹50,000 annual license with 99.98% availability...',
    status: 'Verified',
    owner: 'Marcus Sterling (Chief Executive)',
    evidenceLink: 'https://commercial.fernwickpay.internal/schedules/pricing-q3-2026',
    evidenceCitation: 'Fernwick Commercial Schedule Q3-2026 §4.1 (Enterprise Tier License)',
    evidenceDate: '2026-10-15',
    expiryDate: '2027-06-30',
    riskLevel: 'Moderate',
    category: 'Financial',
    supportingFactCode: 'FACT-PRICE-01',
    contentId: 'draft-fernwick-ad',
    contentTitle: 'Fernwick Pay Retail & Merchant Payment Gateway Ad',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'Fernwick Pay Enterprise Commercial Schedule & Licensing Terms',
      documentType: 'Corporate Commercial Schedule',
      issuerOrFirm: 'Fernwick Pay Commercial Pricing Committee',
      referenceCode: 'FWP-COMM-2026-Q3',
      abstract: 'Defines standard annual subscription fees for high-volume enterprise payment gateways and multi-acquirer integrations.',
      clausesOrExhibits: [
        {
          title: '§4.1 Enterprise License Fee',
          content: 'Annual enterprise gateway license is priced at ₹50,000 (referenced in Fact FACT-PRICE-01). Subject to revision during authorized pricing resets.',
          highlight: true,
        },
      ],
      supportAssessment: 'VERIFIED: Standard active commercial rate per Q3-2026 commercial filing.',
      isContradictionOrExpired: false,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-f2',
        action: 'Evidence Verified',
        author: 'Marcus Sterling',
        timestamp: '2026-10-15 10:00:00',
        note: 'Commercial schedule ratified for enterprise accounts.',
      },
    ],
  },
  {
    id: 'claim-fernwick-uptime',
    claimText: 'Certified 99.98% payment gateway availability SLA',
    draftContext: 'Enjoy certified 99.98% gateway availability with transparent settlement directly into your bank...',
    status: 'Verified',
    owner: 'Kiran Patel (Head of Network Infra)',
    evidenceLink: 'https://telemetry.fernwickpay.internal/sla/gateway-q3-2026.pdf',
    evidenceCitation: 'Fernwick Core Gateway SLA Contract §2.3 & EuroFinTel Independent Telemetry Audit',
    evidenceDate: '2026-09-01',
    expiryDate: '2027-08-15',
    riskLevel: 'Low',
    category: 'Performance',
    supportingFactCode: 'FACT-UPTIME-01',
    contentId: 'draft-fernwick-ad',
    contentTitle: 'Fernwick Pay Retail & Merchant Payment Gateway Ad',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'Fernwick Core Gateway Availability Attestation',
      documentType: 'Independent Telemetry Latency & Availability Attestation',
      issuerOrFirm: 'EuroFinTel Testing Consortium',
      referenceCode: 'EFT-2026-FWP-9998',
      abstract: 'Telemetry audit measuring uptime across multi-region gateway clusters.',
      clausesOrExhibits: [
        {
          title: '§2.3 Monthly Service Availability',
          content: 'Certified monthly availability verified at 99.982% across high-volume transaction switches.',
          highlight: true,
        },
      ],
      supportAssessment: 'VERIFIED: Independent telemetry logs confirm 99.98% availability.',
      isContradictionOrExpired: false,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-f3',
        action: 'Evidence Verified',
        author: 'Kiran Patel',
        timestamp: '2026-09-02 14:00:00',
        note: 'EuroFinTel quarterly availability certification validated.',
      },
    ],
  },
  {
    id: 'claim-fernwick-cashback',
    claimText: '5% unlimited cashback on merchant transfers',
    draftContext: 'Claim your 5% unlimited cashback on merchant transfers before program expiry...',
    status: 'Expired Evidence',
    owner: 'Elena Rostova (Marketing)',
    evidenceLink: 'https://archive.fernwickpay.internal/promotions/cashback-2024-q4',
    evidenceCitation: 'Promo Campaign Q4-2024 Archival Filing (Expired Jan 31, 2025)',
    evidenceDate: '2024-11-01',
    expiryDate: '2025-01-31',
    riskLevel: 'Critical',
    category: 'Financial',
    supportingFactCode: 'FACT-EXP-01',
    contentId: 'draft-fernwick-ad',
    contentTitle: 'Fernwick Pay Retail & Merchant Payment Gateway Ad',
    auditVersion: 1,
    isActive: true,
    evidenceArtifact: {
      documentTitle: 'Promotional Cashback Program Filing Q4-2024',
      documentType: 'Promotional Incentive Filing',
      issuerOrFirm: 'Fernwick Marketing Operations',
      referenceCode: 'PROMO-2024-CASHBACK-5',
      abstract: 'Introductory rebate promotion offering 5% merchant transfer cashback for Q4 2024 onboarding.',
      clausesOrExhibits: [
        {
          title: '§5.0 Promotional Program Expiry',
          content: 'Program expired on January 31, 2025. Continued public promotion is unauthorized.',
          highlight: true,
        },
      ],
      supportAssessment: 'EXPIRED EVIDENCE (> 1 Year Old): Campaign was decommissioned on 2025-01-31. Prohibited in active marketing.',
      isContradictionOrExpired: true,
      isDemoNotice: true,
    },
    history: [
      {
        id: 'h-f4',
        action: 'Evidence Expired',
        author: 'Canon Audit Engine',
        timestamp: '2026-10-24 11:20:00',
        note: 'Expired on 2025-01-31. Flagged as expired commercial incentive.',
      },
    ],
  },
];

export const INITIAL_HISTORICAL_ASSETS: HistoricalAsset[] = [
  {
    id: 'asset-h1',
    title: 'Q2 2026 Enterprise Security & Cloud Keynote Deck',
    assetType: 'Sales Pitch Deck',
    date: '2026-05-18',
    author: 'Elena Rostova',
    baselineCompliant: false,
    textSample:
      'Our next-gen Sovereign Cloud delivers 100% unbreachable data security for financial services. We blow existing legacy cloud vendors out of the water with guaranteed zero downtime.',
    matchedRules: ['RULE-SEC-04', 'RULE-TERM-02', 'RULE-MSG-02'],
  },
  {
    id: 'asset-h2',
    title: '2025 Annual Corporate ESG & Sustainability Disclosures',
    assetType: 'ESG Report',
    date: '2025-12-10',
    author: 'Amina Al-Mansoor',
    baselineCompliant: true,
    textSample:
      'Canon achieved an annual average PUE of 1.12 across European hyper-density facilities, verified under ISO 14064-3 standards with 24/7 matching of regional wind and hydro power contracts.',
    matchedRules: ['RULE-CLM-05'],
  },
  {
    id: 'asset-h3',
    title: 'Post-Quantum Cryptography Migration Guide for Architects',
    assetType: 'Technical Blog',
    date: '2026-02-14',
    author: 'Dr. Aris Thorne',
    baselineCompliant: true,
    textSample:
      'Adopting Post-Quantum Cryptography (PQC) using NIST ML-KEM and ML-DSA primitives ensures confidentiality against harvest-now, decrypt-later threats. Hardware Security Modules (HSM) safeguard root keys.',
    matchedRules: ['RULE-A11Y-03'],
  },
  {
    id: 'asset-h4',
    title: 'Global Clearinghouse Latency Benchmark Brief (Frankfurt - Zurich)',
    assetType: 'Product Whitepaper',
    date: '2024-04-20',
    author: 'Kiran Patel',
    baselineCompliant: false,
    textSample:
      'In laboratory trials, Canon outperformed rival multi-tenant hypervisors by 450% in crypto-shredding velocity and delivered a certified sub-5ms Latency SLA under synthetic load.',
    matchedRules: ['RULE-CLM-05', 'RULE-TERM-02'],
  },
  {
    id: 'asset-h5',
    title: 'Executive Advisory: DORA Resilience Readiness for Board Members',
    assetType: 'Executive Brief',
    date: '2026-03-30',
    author: 'Beatrix Holzer',
    baselineCompliant: true,
    textSample:
      'Article 16 of EU DORA requires regulated financial entities to maintain continuous digital operational testing. Canon sovereign telemetry provides audit artifacts to accelerate customer compliance workflows.',
    matchedRules: ['RULE-LEGAL-01'],
  },
  {
    id: 'asset-h6',
    title: 'APAC Regional Sovereign AI Hub Launch Announcement',
    assetType: 'Press Release',
    date: '2025-11-05',
    author: 'Elena Rostova',
    baselineCompliant: false,
    textSample:
      'Canon today unveiled its miraculous sovereign infrastructure in Singapore, ensuring customer data is never accessed by rogue foreign intelligence services or legacy competitor systems.',
    matchedRules: ['RULE-TERM-02', 'RULE-MSG-02', 'RULE-VOICE-01'],
  },
];

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Beatrix Holzer',
    role: 'Lead Regulatory & Compliance Counsel',
    department: 'Legal & Risk Oversight',
    avatarInitials: 'BH',
    reviewsCompleted: 48,
    overridesApproved: 14,
    permissionLevel: 'Approver',
  },
  {
    id: 'tm-2',
    name: 'Julian Vance',
    role: 'Global Brand Governance Director',
    department: 'Brand Architecture',
    avatarInitials: 'JV',
    reviewsCompleted: 62,
    overridesApproved: 29,
    permissionLevel: 'Owner',
  },
  {
    id: 'tm-3',
    name: 'Dr. Aris Thorne',
    role: 'Chief Cryptographer & Hardware Specialist',
    department: 'Systems Engineering',
    avatarInitials: 'AT',
    reviewsCompleted: 35,
    overridesApproved: 6,
    permissionLevel: 'Specialist',
  },
  {
    id: 'tm-4',
    name: 'Elena Rostova',
    role: 'VP Corporate Comms & Product Marketing',
    department: 'Global Communications',
    avatarInitials: 'ER',
    reviewsCompleted: 83,
    overridesApproved: 41,
    permissionLevel: 'Editor',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-10-24 09:12:00',
    action: 'Brand & Intent Audit Completed',
    category: 'Correction',
    user: 'Canon Audit Engine',
    details:
      'Automated audit executed on "Canon Sovereign AI Infrastructure & Enterprise Cloud Expansion Announcement". 7 findings detected across 5 categories.',
  },
  {
    id: 'log-2',
    timestamp: '2026-10-24 09:35:12',
    action: 'Finding Override Approved',
    category: 'Override',
    user: 'Beatrix Holzer',
    details:
      'Override recorded on RULE-A11Y-03 (Acronym PQC in technical header): Justified as approved industry standard in enterprise cryptographic literature.',
    relatedId: 'rule-a11y-03',
  },
  {
    id: 'log-3',
    timestamp: '2026-10-24 10:48:40',
    action: 'Claim Escalated to Legal Counsel',
    category: 'Claim Escalation',
    user: 'Elena Rostova',
    details:
      'Escalated Claim #claim-1 ("100% unbreachable data security") to Beatrix Holzer with High priority for SLA disclaimer reconciliation.',
    relatedId: 'claim-1',
  },
  {
    id: 'log-4',
    timestamp: '2026-10-23 16:15:00',
    action: 'Guideline CI Simulation Run',
    category: 'CI Simulation',
    user: 'Julian Vance',
    details:
      'Historical CI test executed for RULE-SEC-04 update across 6 historical corporate assets. Impact: 2 resolved past failures, 0 regressions introduced.',
    relatedId: 'rule-sec-04',
  },
  {
    id: 'log-5',
    timestamp: '2026-10-22 14:02:18',
    action: 'Approved Fact Added to Registry',
    category: 'Approved Fact Added',
    user: 'Dr. Aris Thorne',
    details:
      'Registered new approved benchmark fact: "Certified sub-5ms Latency SLA across all tier-1 banking transaction loops" backed by EuroFinTel Labs #EFT-2026-10.',
    relatedId: 'claim-3',
  },
];

// ========================================================
// APPROVED FACTS REGISTRY (SHARED ACROSS GATEWAY, WATCH & LEDGER)
// Fictional Fernwick Pay enterprise financial infrastructure data
// ========================================================
export const INITIAL_APPROVED_FACTS: ApprovedFact[] = [
  {
    id: 'fact-1',
    code: 'FACT-PRICE-01',
    title: 'Fernwick Pay Enterprise Annual License Fee',
    value: '₹50,000',
    previousValue: undefined,
    category: 'Pricing',
    status: 'Active',
    expiryDate: '2027-06-30',
    lastUpdated: '2026-10-15',
    citation: 'Fernwick Commercial Schedule Q3-2026 §4.1',
    notes: 'Standard annual subscription for high-volume enterprise payment gateways. Can be revised during promotional pricing resets.',
  },
  {
    id: 'fact-2',
    code: 'FACT-UPTIME-01',
    title: 'Merchant Payment Gateway Availability SLA',
    value: '99.98% availability',
    category: 'SLA & Uptime',
    status: 'Active',
    expiryDate: '2027-08-15',
    lastUpdated: '2026-09-01',
    citation: 'Fernwick Core Gateway SLA Contract §2.3',
    notes: 'Excludes scheduled zero-downtime micro-patching windows.',
  },
  {
    id: 'fact-3',
    code: 'FACT-SETTLE-01',
    title: 'Standard Settlement Window SLA',
    value: 'T+1 Business Day (Instant Approval Not Supported)',
    category: 'SLA & Uptime',
    status: 'Active',
    expiryDate: '2027-05-01',
    lastUpdated: '2026-08-20',
    citation: 'Banking Clearinghouse Integration Spec FWP-2026-V2',
    notes: 'Instant merchant account approval is legally prohibited without biometric KYC risk verification.',
  },
  {
    id: 'fact-4',
    code: 'FACT-FEE-01',
    title: 'Standard Domestic Merchant Transaction Rate',
    value: '1.2% + ₹2 per transaction',
    category: 'Pricing',
    status: 'Active',
    expiryDate: '2027-09-01',
    lastUpdated: '2026-09-10',
    citation: 'Merchant Fee Schedule FWP-2026-08',
    notes: 'Zero fee claims or "completely free" assertions are strictly prohibited by RBI & Fair Commercial standards.',
  },
  {
    id: 'fact-5',
    code: 'FACT-SEC-01',
    title: 'Security & Tokenization Compliance Attestation',
    value: 'PCI-DSS v4.0 Level 1 & ISO 27001 Certified',
    category: 'Security & Compliance',
    status: 'Active',
    expiryDate: '2027-03-31',
    lastUpdated: '2026-09-02',
    citation: 'CyberAttest Global Audit Certificate #CAG-2026-11',
    notes: 'Covers cloud tokenization vaults and hardware HSM encryption.',
  },
  {
    id: 'fact-6',
    code: 'FACT-EXP-01',
    title: 'Legacy Introductory Merchant Cashback Offer',
    value: '5% Unlimited Cashback on Merchant Transfers',
    category: 'Pricing',
    status: 'Expired',
    expiryDate: '2025-01-31',
    lastUpdated: '2024-11-01',
    citation: 'Promo Campaign Q4-2024 Archival Filing',
    notes: 'Expired promotional rebate program. Must not be referenced in active 2026 collateral.',
  },
];

// ========================================================
// RESTRICTED TERMS & PROHIBITED CLAIMS CATALOG
// ========================================================
export const RESTRICTED_TERMS_CATALOG = [
  {
    term: 'guaranteed instant approval',
    category: 'Regulatory & Legal',
    reason: 'Prohibited financial assertion. Merchant underwriting requires risk review (T+1 SLA).',
    suggestion: 'streamlined merchant onboarding with standard risk review within 24 hours',
    severity: 'High' as const,
  },
  {
    term: '100% unbreachable',
    category: 'Security Superlatives',
    reason: 'Violates RULE-SEC-04. Absolute security promises trigger legal liability.',
    suggestion: 'PCI-DSS Level 1 certified multi-layered fraud protection',
    severity: 'High' as const,
  },
  {
    term: 'zero fees forever',
    category: 'Pricing Transparency',
    reason: 'Contradicts FACT-FEE-01. Commercial rate is 1.2% + ₹2 per transaction.',
    suggestion: 'transparent standard merchant pricing of 1.2% + ₹2 per transaction',
    severity: 'High' as const,
  },
  {
    term: 'completely free',
    category: 'Pricing Transparency',
    reason: 'Misleading pricing claim. Hidden transaction fees apply.',
    suggestion: 'competitive transparent pricing with no hidden charges',
    severity: 'Medium' as const,
  },
  {
    term: 'zero chargeback risk',
    category: 'Financial Guarantees',
    reason: 'Chargeback disputes are governed by card network arbitration rules.',
    suggestion: 'industry-leading automated chargeback mitigation workflows',
    severity: 'High' as const,
  },
  {
    term: 'miraculous',
    category: 'Tone & Voice',
    reason: 'Unprofessional hyperbole violating Canon Brand Decorum §2.1.',
    suggestion: 'robust and verified',
    severity: 'Low' as const,
  },
  {
    term: 'blowing legacy competitors out of the water',
    category: 'Tone & Voice',
    reason: 'Violates enterprise decorum and comparative advertising guidelines.',
    suggestion: 'establishing a new benchmark for gateway reliability',
    severity: 'Medium' as const,
  },
];

// ========================================================
// CANON GATEWAY PRESET SAMPLES & WORKFLOWS
// ========================================================
export const SAMPLE_GATEWAY_BRIEFS: GatewayBrief[] = [
  {
    campaignName: 'Fernwick Pay Instant Merchant Settlement Ad',
    contentType: 'Digital Advertisement',
    targetAudience: 'Retail Merchants, Quick-Service Restaurants & E-Commerce Owners',
    brief:
      'Create a Fernwick Pay advertisement containing: "Introducing Fernwick Pay! Get guaranteed instant approval, zero processing fees forever, and a ₹5,000 cashback reward."',
  },
  {
    campaignName: 'Fernwick Pay Enterprise Gateway Launch',
    contentType: 'Landing Page Hero & Copy',
    targetAudience: 'Chief Financial Officers and Head of Payments at Tier-1 Retailers',
    brief:
      'Draft hero copy and value proposition for Fernwick Pay Enterprise Gateway. Emphasize 99.98% uptime, PCI-DSS Level 1 tokenization, annual license pricing, and automated treasury settlement.',
  },
  {
    campaignName: 'Fernwick Pay SME Holiday Onboarding Campaign',
    contentType: 'Email Campaign',
    targetAudience: 'Independent SME Business Owners',
    brief:
      'Write an email inviting retail merchants to switch payment providers ahead of the festive season rush. Explain transparent 1.2% transaction pricing, zero hidden charges, and robust fraud prevention.',
  },
];

export const INITIAL_GATEWAY_WORKFLOW: GatewayWorkflowState = {
  id: 'gw-initial-01',
  brief: SAMPLE_GATEWAY_BRIEFS[0],
  currentRound: 0,
  maxRounds: 2,
  history: [],
  activeText: '',
  reviewStatus: 'draft',
};

// ========================================================
// CANON WATCH: SIMULATED POST-PUBLICATION CONTENT REGISTRY
// ========================================================
export const INITIAL_WATCH_ITEMS: WatchContentItem[] = [
  {
    id: 'cw-101',
    title: 'Fernwick Pay Q3 Retail Display Banner Ad',
    channel: 'Digital Ad',
    content:
      'Modernize your business checkout with Fernwick Pay. Get started for only ₹50,000 annual license with 99.98% availability and multi-layered fraud protection. Seamless integration for retail stores.',
    linkedFactCodes: ['FACT-PRICE-01', 'FACT-UPTIME-01'],
    status: 'Active / Published',
    lastReviewDate: '2026-09-15',
    reviewer: 'Beatrix Holzer (Legal)',
    severity: 'Low',
  },
  {
    id: 'cw-102',
    title: 'Fernwick Pay Merchant Onboarding Landing Page Hero',
    channel: 'Landing Page',
    content:
      'Enterprise payment processing engineered for scale. Annual platform license starting at ₹50,000 with sub-5ms settlement and 24/7 dedicated account support. Trusted by over 10,000 retailers.',
    linkedFactCodes: ['FACT-PRICE-01'],
    status: 'Active / Published',
    lastReviewDate: '2026-09-10',
    reviewer: 'Devon Vance (Security)',
    severity: 'Low',
  },
  {
    id: 'cw-103',
    title: 'Fernwick Pay Direct Merchant Outreach Email',
    channel: 'Email Campaign',
    content:
      'Dear Merchant Partner, Switch your payment stack to Fernwick Pay today. Lock in our premier enterprise tier for ₹50,000 with PCI-DSS Level 1 protection and guaranteed zero downtime.',
    linkedFactCodes: ['FACT-PRICE-01', 'FACT-SEC-01'],
    status: 'Active / Published',
    lastReviewDate: '2026-09-01',
    reviewer: 'Amina Al-Mansoor (Brand)',
    severity: 'Low',
  },
  {
    id: 'cw-104',
    title: 'Fernwick Pay Festive Promotion Collateral',
    channel: 'Product Sheet',
    content:
      'Boost retail margins during the holiday rush! Activate Fernwick Pay today and receive 5% unlimited cashback on merchant transfers before program expiry.',
    linkedFactCodes: ['FACT-EXP-01'],
    status: 'Flagged: Outdated Content',
    lastReviewDate: '2026-07-20',
    reviewer: 'Elena Rostova (Marketing)',
    severity: 'High',
    flagReason:
      'Linked Fact FACT-EXP-01 (5% Unlimited Cashback) expired on 2025-01-31. Promotional claim is no longer legally authorized in active marketing collateral.',
    suggestedCorrection: {
      targetFactCode: 'FACT-EXP-01',
      oldValue: '5% unlimited cashback on merchant transfers',
      newValue: 'transparent merchant rates of 1.2% + ₹2 with automated daily settlements',
      updatedText:
        'Boost retail margins during the holiday rush! Activate Fernwick Pay today and benefit from transparent merchant rates of 1.2% + ₹2 with automated daily settlements.',
      explanation:
        'Removes expired 2024 cashback incentive and replaces with active approved merchant commercial pricing.',
    },
  },
  {
    id: 'cw-105',
    title: 'Fernwick Pay Global Checkout Technical Overview',
    channel: 'Product Sheet',
    content:
      'High-throughput payment gateway delivering certified 99.98% availability, PCI-DSS v4.0 Level 1 compliance, and standard T+1 settlement cycles for high-volume enterprises.',
    linkedFactCodes: ['FACT-UPTIME-01', 'FACT-SEC-01', 'FACT-SETTLE-01'],
    status: 'Active / Published',
    lastReviewDate: '2026-10-02',
    reviewer: 'Kiran Patel (Infrastructure)',
    severity: 'Low',
  },
];

// ========================================================
// FORMAT ADAPTERS PRESET SAMPLES (WEB URL, HTML EMAIL, SRT)
// ========================================================
export const SAMPLE_FORMAT_ADAPTER_DATA = {
  webUrls: [
    {
      url: 'https://fernwickpay.com/merchant-gateway',
      title: 'Fernwick Pay — Enterprise Payment Gateway & Smart Checkout',
      extractedText:
        'Fernwick Pay delivers seamless checkout solutions for modern commerce. Our revolutionary payment infrastructure guarantees 100% unbreachable data security and flawless 100% continuous uptime. Get started for ₹50,000 annual license with guaranteed instant approval for all merchant categories. Compliant with PCI-DSS and DORA regulations with zero manual audits required.',
    },
    {
      url: 'https://fernwickpay.com/pricing',
      title: 'Fernwick Pay — Transparent Commercial Pricing & SLAs',
      extractedText:
        'Fernwick Pay offers simple, predictable transaction processing fees. Standard domestic rate: 1.2% + ₹2 per transaction with guaranteed sub-5ms settlement. Annual enterprise gateway platform tier is priced at ₹50,000. Enjoy air-gapped security enclaves and 24/7 dedicated support.',
    },
  ],
  htmlEmails: [
    {
      name: 'Fernwick Pay Merchant Promotion Email (With Script & Style)',
      subject: 'Switch to Fernwick Pay: Elevate Your Store Checkout Experience',
      rawHtml: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
    .hero { background: #1e3a8a; color: white; padding: 24px; text-align: center; }
    .cta-btn { background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; }
  </style>
  <script>
    // Embedded telemetry tracker (should be stripped during governance extraction)
    console.log("Email tracker executed");
  </script>
</head>
<body>
  <div class="hero">
    <h1>Transform Your Retail Payment Experience</h1>
    <p>Fernwick Pay delivers unrivaled, game-changing checkout speed for forward-thinking merchants.</p>
  </div>
  <div style="padding: 20px;">
    <h2>Why Leading Merchants Choose Fernwick Pay</h2>
    <p>Our payment gateway guarantees 100% unbreachable data security and delivers guaranteed instant approval for all registered SME businesses.</p>
    <p>Enjoy our special promotional package with zero fees forever and automated compliance filings with zero manual audits required.</p>
    <p>Backed by PCI-DSS Level 1 compliance and 99.98% availability SLA.</p>
    <p><a href="https://fernwickpay.com/onboard" class="cta-btn">Claim Your Merchant Account Today</a></p>
  </div>
</body>
</html>`,
    },
    {
      name: 'Fernwick Pay Security & Infrastructure Newsletter',
      subject: 'Quarterly Infrastructure Update: 99.98% Uptime & PCI-DSS Attestation',
      rawHtml: `<div style="font-family: sans-serif; padding: 16px;">
  <h2>Quarterly Platform Reliability Report</h2>
  <p>During Q3 2026, Fernwick Pay maintained a certified 99.98% availability SLA across all transaction clusters.</p>
  <p>Our team successfully concluded our annual PCI-DSS v4.0 Level 1 attestation alongside EuroFinTel certified sub-5ms latency tests.</p>
  <p>Enterprise license fee remains stable at ₹50,000 per annum with standard T+1 settlement windows.</p>
</div>`,
    },
  ],
  srtSubtitles: [
    {
      name: 'Fernwick Pay 30-Second Commercial Video (Contains Fast Speech & Superlatives)',
      rawSrt: `1
00:00:00,500 --> 00:00:03,000
Welcome to Fernwick Pay, the enterprise checkout solution for modern retail.

2
00:00:03,200 --> 00:00:05,000
Get started today with guaranteed instant approval for all merchant accounts!

3
00:00:05,200 --> 00:00:06,100
Our revolutionary cloud infrastructure guarantees 100% unbreachable transaction security at zero fees forever.

4
00:00:06,400 --> 00:00:09,500
Enjoy certified 99.98% gateway availability with transparent settlement directly into your bank.

5
00:00:09,800 --> 00:00:12,200
Fernwick Pay: Secure, compliant, and built for your business.`,
    },
    {
      name: 'Fernwick Pay Product Walkthrough Video (Contains Invalid Timestamp & High CPS)',
      rawSrt: `1
00:00:01,000 --> 00:00:03,500
In this walkthrough, we configure the Fernwick Pay merchant dashboard.

2
00:00:03,800 --> 00:00:04,500
We offer ultra-fast setup with sub-5ms latency across all tier-1 banking loops, blowing legacy competitors completely out of the water!

3
00:00:07,000 --> 00:00:05,000
[TIMING ERROR: End timestamp is earlier than start timestamp]

4
00:00:08,000 --> 00:00:11,200
Standard domestic merchant rate is 1.2% plus ₹2 with PCI-DSS Level 1 encryption.`,
    },
  ],
};
