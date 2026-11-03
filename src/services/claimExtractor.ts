import {
  ApprovedFact,
  ClaimCategory,
  ClaimItem,
  ClaimVerificationStatus,
  EvidenceArtifact,
} from '../types';

export interface ExtractionResult {
  updatedClaims: ClaimItem[];
  activeClaimsForContent: ClaimItem[];
  deactivatedCount: number;
  newClaimsCount: number;
  extractedCount: number;
}

/**
 * Known claim signatures and their governance metadata & accredited evidence
 */
interface ClaimSignature {
  pattern: RegExp;
  canonicalText: string;
  category: ClaimCategory;
  riskLevel: 'Critical' | 'Moderate' | 'Low';
  owner: string;
  supportingFactCode?: string;
  evidenceCitation: string;
  evidenceLink: string;
  evidenceDate: string;
  expiryDate: string;
  verify: (text: string, approvedFacts: ApprovedFact[]) => {
    status: ClaimVerificationStatus;
    statusReason: string;
    artifact?: EvidenceArtifact;
  };
}

const KNOWN_CLAIM_SIGNATURES: ClaimSignature[] = [
  // 1. 100% unbreachable & 100% continuous uptime
  {
    pattern: /100%\s+unbreachable|flawless\s+100%\s+continuous\s+uptime|guarantees\s+100%\s+unbreachable/i,
    canonicalText: '100% unbreachable data security and flawless 100% continuous uptime',
    category: 'Security',
    riskLevel: 'Critical',
    owner: 'Elena Rostova (VP Marketing)',
    evidenceCitation: 'Internal SLA Master Agreement v4.2 §7.1 (Uptime commitment: 99.995%)',
    evidenceLink: 'https://internal-trust.canon.internal/sla-contracts/sovereign-cloud-q3',
    evidenceDate: '2026-09-15',
    expiryDate: '2027-09-15',
    verify: () => ({
      status: 'Unsupported',
      statusReason:
        'Contradicts Master SLA §7.1: Canon commits to 99.995% availability excluding maintenance. Absolute 100% guarantees are legally unsupportable.',
      artifact: {
        documentTitle: 'Master Enterprise Cloud SLA & High-Availability Schedule §7.1',
        documentType: 'Contractual SLA Agreement Rider & Service Terms',
        issuerOrFirm: 'Canon Global Infrastructure & Cloud Legal Operations',
        referenceCode: 'SLA-CANON-2026-v4.2-SEC7',
        abstract:
          'Corporate standard service level agreement defining infrastructure availability commitments and exclusion clauses.',
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
              'Availability calculations strictly exclude scheduled maintenance patch windows and unforeseen force majeure events.',
            highlight: true,
          },
        ],
        supportAssessment:
          'CONTRADICTION DETECTED: Master SLA explicitly disclaims 100% continuous uptime.',
        isContradictionOrExpired: true,
        isDemoNotice: true,
      },
    }),
  },

  // 2. 450% crypto-shredding velocity (Late 2023 benchmark)
  {
    pattern: /450%\s+in\s+crypto-shredding|outperformed\s+rival\s+multi-tenant\s+hypervisors\s+by\s+450%/i,
    canonicalText: 'Outperformed rival multi-tenant hypervisors by 450% in crypto-shredding velocity',
    category: 'Performance',
    riskLevel: 'Moderate',
    owner: 'Dr. Aris Thorne (Chief Cryptographer)',
    evidenceCitation: 'Performance Lab Whitepaper #CAN-2023-882 (Dated Nov 14, 2023)',
    evidenceLink: 'https://benchmarks.canon.internal/reports/hypervisor-perf-2023-q4.pdf',
    evidenceDate: '2023-11-14',
    expiryDate: '2024-05-14',
    verify: () => ({
      status: 'Expired Evidence',
      statusReason:
        'Benchmark is from November 2023 (>180 calendar days old). Brand Rule RULE-CLM-05 mandates empirical test evidence produced within the preceding 180 days.',
      artifact: {
        documentTitle: 'Hypervisor Crypto-Shredding Performance Lab Whitepaper',
        documentType: 'Laboratory Benchmark Technical Whitepaper',
        issuerOrFirm: 'Canon Cryptographic Systems Evaluation Group',
        referenceCode: 'CAN-2023-882-PERF',
        abstract: 'Empirical comparative throughput analysis measuring multi-tenant hypervisor isolation.',
        clausesOrExhibits: [
          {
            title: '§5.1 Recency Horizon & Validity Window',
            content:
              'Laboratory evaluation results are certified valid for 180 calendar days from publication (Expired: May 14, 2024).',
            highlight: true,
          },
        ],
        supportAssessment:
          'EXPIRED EVIDENCE: Testing was conducted in late 2023. Validity expired on May 14, 2024.',
        isContradictionOrExpired: true,
        isDemoNotice: true,
      },
    }),
  },

  // 3. Certified sub-5ms Latency SLA
  {
    pattern: /sub-5ms\s+Latency\s+SLA|certified\s+sub-5ms/i,
    canonicalText: 'Certified sub-5ms Latency SLA across all tier-1 banking transaction loops',
    category: 'Performance',
    riskLevel: 'Low',
    owner: 'Kiran Patel (Head of Network Infrastructure)',
    evidenceCitation: 'Accredited Latency Audit by EuroFinTel Labs #EFT-2026-10 (Verified Oct 8, 2026)',
    evidenceLink: 'https://telemetry.canon.internal/certifications/fintech-latency-oct2026.pdf',
    evidenceDate: '2026-10-08',
    expiryDate: '2027-04-08',
    verify: () => ({
      status: 'Verified',
      statusReason:
        'Independent laboratory measurements confirm p99 roundtrip transaction times of 3.82ms, satisfying the certified sub-5ms commitment (Valid through April 8, 2027).',
      artifact: {
        documentTitle: 'EuroFinTel Accredited High-Speed Banking Latency Audit',
        documentType: 'Accredited Lab Telemetry & Latency Attestation',
        issuerOrFirm: 'EuroFinTel Independent Telecommunications Testing Consortium',
        referenceCode: 'EFT-2026-10-LAT',
        abstract:
          'Packet-trace telemetry measuring cross-border banking settlement latency across Frankfurt, Zurich, and Tokyo fiber routing matrices.',
        clausesOrExhibits: [
          {
            title: '§2.4 Transaction Latency SLA Verification',
            content:
              'Tested under sustained 200Gbps simulated banking transaction load; p99 network latency registered at 3.82ms across tier-1 nodes, satisfying sub-5ms SLA.',
            highlight: true,
          },
        ],
        supportAssessment:
          'VERIFIED: Telemetry confirms sub-5ms transaction speed across tier-1 banking nodes.',
        isContradictionOrExpired: false,
        isDemoNotice: true,
      },
    }),
  },

  // 4. Confidential model weights never inspected by foreign intelligence
  {
    pattern: /customer\s+confidential\s+weights\s+are\s+never\s+inspected|never\s+inspected\s+by\s+rogue\s+foreign\s+intelligence/i,
    canonicalText: 'Customer confidential weights are never inspected by foreign intelligence services or third parties',
    category: 'Security',
    riskLevel: 'Low',
    owner: 'Devon Vance (Chief Security Architect)',
    evidenceCitation: 'SOC2 Type II & BSI C5 Sovereignty Attestation Certificate #BSI-C5-2026-09',
    evidenceLink: 'https://security.canon.internal/attestation/zero-knowledge-2026-audit.pdf',
    evidenceDate: '2026-09-02',
    expiryDate: '2027-09-02',
    verify: () => ({
      status: 'Verified',
      statusReason:
        'Certified hardware and administrative isolation guarantees that confidential customer model weights cannot be inspected by external entities (BSI C5 validated).',
      artifact: {
        documentTitle: 'Sovereign Enclave Isolation & BSI C5 Criteria Compliance Report',
        documentType: 'SOC2 Type II & BSI C5 Sovereignty Attestation Certificate',
        issuerOrFirm: 'CyberTrust European Attestation Services GmbH',
        referenceCode: 'BSI-C5-2026-09-SOV',
        abstract:
          'Cryptographic and physical enclave audit examining administrative boundary isolation and hardware memory protection.',
        clausesOrExhibits: [
          {
            title: '§3.4 Administrative Access Protection',
            content:
              'Zero-knowledge attestation logs confirm zero unauthorized external administrative or foreign intelligence interception pathways.',
            highlight: true,
          },
        ],
        supportAssessment: 'VERIFIED: Certified hardware isolation preserves sovereign data residency.',
        isContradictionOrExpired: false,
        isDemoNotice: true,
      },
    }),
  },

  // 5. Automated compliance filings for DORA and NIS2 with zero manual audits
  {
    pattern: /zero\s+manual\s+audits\s+required|automated\s+compliance\s+filings\s+for\s+dora/i,
    canonicalText: 'Automated compliance filings for DORA and NIS2 regulations with zero manual audits required',
    category: 'Financial',
    riskLevel: 'Critical',
    owner: 'Beatrix Holzer (Senior Regulatory Counsel)',
    evidenceCitation: 'Legal Review Memo: Customer Responsibility Model for EU DORA (Ref #LG-2026-44)',
    evidenceLink: 'https://compliance.canon.internal/legal-memos/dora-article-16-scoping',
    evidenceDate: '2026-08-15',
    expiryDate: '2027-08-15',
    verify: () => ({
      status: 'Unsupported',
      statusReason:
        'Contradicts EU DORA Article 16: Technology vendors cannot legally assume or eliminate the customer’s internal audit duty. Promising "zero manual audits" creates severe regulatory liability.',
      artifact: {
        documentTitle: 'Legal Advisory: Customer Responsibility Model under EU DORA Article 16',
        documentType: 'Regulatory Compliance Legal Memorandum',
        issuerOrFirm: 'Canon Regulatory & Corporate Legal Advisory Practice',
        referenceCode: 'MEMO-LG-2026-44-DORA',
        abstract: 'Legal analysis of European Union DORA and NIS2 directive requirements.',
        clausesOrExhibits: [
          {
            title: '§2.1 Non-Delegable Compliance Obligations',
            content:
              'DORA Article 16 strictly assigns operational resilience responsibility to the regulated financial entity. A technology vendor cannot legally assume or eliminate the customer’s internal audit duty.',
            highlight: true,
          },
        ],
        supportAssessment:
          'CONTRADICTION DETECTED: "Zero manual audits" assertion violates EU DORA regulatory rules.',
        isContradictionOrExpired: true,
        isDemoNotice: true,
      },
    }),
  },

  // 6. Hardware HSM modules and Post-Quantum Cryptography air-gapped enclaves
  {
    pattern: /hardware\s+HSM\s+modules\s+and\s+Post-Quantum\s+Cryptography|PQC\s+and\s+hardware\s+HSM\s+modules|air-gapped\s+enclaves/i,
    canonicalText: 'Hardware HSM modules and Post-Quantum Cryptography provide air-gapped enclaves',
    category: 'Security',
    riskLevel: 'Low',
    owner: 'Devon Vance (Chief Security Architect)',
    evidenceCitation: 'NIST FIPS 140-3 Level 4 Validation Certificate #4412 & ML-KEM Implementation Sheet',
    evidenceLink: 'https://trust.canon.internal/hardware/fips-140-3-enclaves',
    evidenceDate: '2026-07-20',
    expiryDate: '2028-07-20',
    verify: () => ({
      status: 'Verified',
      statusReason:
        'Module certification confirms hardware-enforced air-gapped enclaves utilizing certified Post-Quantum Cryptography (NIST FIPS 140-3 Level 4 active).',
      artifact: {
        documentTitle: 'NIST FIPS 140-3 Level 4 Cryptographic Module & PQC Validation Record',
        documentType: 'Cryptographic Module Validation Program (CMVP) Certificate',
        issuerOrFirm: 'NIST Cryptographic Module Validation Program (CMVP)',
        referenceCode: 'NIST-FIPS-140-3-CERT-4412',
        abstract: 'Hardware security module cryptographic validation record.',
        clausesOrExhibits: [
          {
            title: '§1.0 Physical Security Envelope',
            content:
              'Tested to FIPS 140-3 Level 4 physical security envelope with automatic zeroization on tamper detection.',
            highlight: true,
          },
        ],
        supportAssessment: 'VERIFIED: Module certification confirms hardware-enforced air-gapped enclaves.',
        isContradictionOrExpired: false,
        isDemoNotice: true,
      },
    }),
  },

  // 7. Fernwick Pay Enterprise Annual License starting at ₹50,000 (Dynamic Approved Fact)
  {
    pattern: /₹50,000|₹25,000|annual\s+license\s+starting\s+at\s+₹/i,
    canonicalText: 'Fernwick Pay Enterprise Annual License starting at ₹50,000',
    category: 'Financial',
    riskLevel: 'Moderate',
    owner: 'Marcus Sterling (Chief Executive)',
    supportingFactCode: 'FACT-PRICE-01',
    evidenceCitation: 'Fernwick Commercial Schedule Q3-2026 §4.1 (Enterprise Tier License)',
    evidenceLink: 'https://commercial.fernwickpay.internal/schedules/pricing-q3-2026',
    evidenceDate: '2026-10-15',
    expiryDate: '2027-06-30',
    verify: (text: string, approvedFacts: ApprovedFact[]) => {
      const priceFact = approvedFacts.find((f) => f.code === 'FACT-PRICE-01');
      const activePrice = priceFact?.value || '₹50,000';
      const isPriceMentioned = text.includes(activePrice);
      const isOldPriceMentioned = text.includes('₹50,000') && activePrice !== '₹50,000';

      if (isOldPriceMentioned) {
        return {
          status: 'Unsupported',
          statusReason: `Contradicts active approved fact FACT-PRICE-01: Price has been updated to ${activePrice}, but content specifies ₹50,000.`,
        };
      }

      if (isPriceMentioned && priceFact?.status === 'Active') {
        return {
          status: 'Verified',
          statusReason: `Verified against active approved fact FACT-PRICE-01 (${activePrice}). Validated under Fernwick Commercial Schedule.`,
        };
      }

      return {
        status: 'Needs Verification',
        statusReason: `Referenced price requires verification against current commercial rate schedule (${activePrice}).`,
      };
    },
  },

  // 8. Guaranteed instant approval for all merchant payment gateways
  {
    pattern: /guaranteed\s+instant\s+approval|instant\s+approval\s+for\s+all\s+merchant|instant\s+approval/i,
    canonicalText: 'Guaranteed instant approval for all merchant payment gateways',
    category: 'Financial',
    riskLevel: 'Critical',
    owner: 'Elena Rostova (VP Marketing)',
    supportingFactCode: 'FACT-SETTLE-01',
    evidenceCitation: 'Banking Clearinghouse Integration Spec FWP-2026-V2 & KYC Underwriting Policy',
    evidenceLink: 'https://compliance.fernwickpay.internal/banking/clearinghouse-spec-2026',
    evidenceDate: '2026-08-20',
    expiryDate: '2027-05-01',
    verify: () => ({
      status: 'Unsupported',
      statusReason:
        'Contradicts Fact FACT-SETTLE-01 & Clearinghouse Spec: Instant approval is legally barred by KYC regulations. Mandatory risk review SLA is T+1.',
      artifact: {
        documentTitle: 'Banking Clearinghouse Integration Spec & KYC Underwriting Protocol',
        documentType: 'Regulatory Operating Specification',
        issuerOrFirm: 'Fernwick Pay Compliance & Banking Operations Consortium',
        referenceCode: 'FWP-2026-SPEC-V2',
        abstract: 'Mandatory merchant onboarding, biometric verification, and anti-money laundering underwriting criteria.',
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
    }),
  },

  // 9. Certified 99.98% payment gateway availability SLA
  {
    pattern: /99\.98%\s+gateway\s+availability|99\.98%\s+availability\s+SLA/i,
    canonicalText: 'Certified 99.98% payment gateway availability SLA',
    category: 'Performance',
    riskLevel: 'Low',
    owner: 'Kiran Patel (Head of Network Infra)',
    supportingFactCode: 'FACT-UPTIME-01',
    evidenceCitation: 'Fernwick Core Gateway SLA Contract §2.3 & EuroFinTel Independent Telemetry Audit',
    evidenceLink: 'https://telemetry.fernwickpay.internal/sla/gateway-q3-2026.pdf',
    evidenceDate: '2026-09-01',
    expiryDate: '2027-08-15',
    verify: (_text: string, approvedFacts: ApprovedFact[]) => {
      const fact = approvedFacts.find((f) => f.code === 'FACT-UPTIME-01');
      if (fact && fact.status === 'Active') {
        return {
          status: 'Verified',
          statusReason:
            'Supported by active Fact FACT-UPTIME-01 and EuroFinTel quarterly telemetry audit (99.982% certified).',
          artifact: {
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
        };
      }
      return {
        status: 'Needs Verification',
        statusReason: 'Gateway availability SLA requires active quarterly telemetry certificate.',
      };
    },
  },

  // 10. Cashback reward (Expired Promo Fact: 5% or ₹5,000)
  {
    pattern: /₹5,000\s+cashback\s+reward|5,000\s+cashback\s+reward|₹5,000\s+cashback|5%\s+unlimited\s+cashback|5%\s+cashback|cashback\s+reward/i,
    canonicalText: '₹5,000 cashback reward / 5% unlimited promotional cashback',
    category: 'Financial',
    riskLevel: 'Critical',
    owner: 'Elena Rostova (Marketing)',
    supportingFactCode: 'FACT-EXP-01',
    evidenceCitation: 'Promo Campaign Q4-2024 Archival Filing (Expired Jan 31, 2025)',
    evidenceLink: 'https://archive.fernwickpay.internal/promotions/cashback-2024-q4',
    evidenceDate: '2024-11-01',
    expiryDate: '2025-01-31',
    verify: () => ({
      status: 'Expired Evidence',
      statusReason:
        'Fact FACT-EXP-01 expired on 2025-01-31. Promotional cashback incentives have concluded and are unauthorized for active publication.',
      artifact: {
        documentTitle: 'Promotional Cashback Program Filing Q4-2024',
        documentType: 'Promotional Incentive Filing',
        issuerOrFirm: 'Fernwick Marketing Operations',
        referenceCode: 'PROMO-2024-CASHBACK-5',
        abstract: 'Introductory rebate promotion offering merchant onboarding cashback for Q4 2024 onboarding.',
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
    }),
  },

  // 11. Zero fees forever / zero processing fees forever
  {
    pattern: /zero\s+processing\s+fees\s+forever|zero\s+fees\s+forever|completely\s+free\s+processing|zero\s+processing\s+fees/i,
    canonicalText: 'Zero processing fees forever on commercial transactions',
    category: 'Financial',
    riskLevel: 'Critical',
    owner: 'Elena Rostova (Marketing)',
    supportingFactCode: 'FACT-FEE-01',
    evidenceCitation: 'Merchant Fee Schedule FWP-2026-08 (Standard: 1.2% + ₹2)',
    evidenceLink: 'https://commercial.fernwickpay.internal/fees/schedule-2026',
    evidenceDate: '2026-09-10',
    expiryDate: '2027-09-01',
    verify: () => ({
      status: 'Unsupported',
      statusReason:
        'Contradicts Fact FACT-FEE-01: Approved standard commercial rate is 1.2% + ₹2. Promising "zero fees forever" creates regulatory liability.',
      artifact: {
        documentTitle: 'Merchant Commercial Fee Schedule FWP-2026-08',
        documentType: 'Corporate Commercial Fee Schedule',
        issuerOrFirm: 'Fernwick Commercial Operations & Regulatory Compliance',
        referenceCode: 'FWP-FEE-2026-08',
        abstract: 'Mandatory standard domestic pricing terms for card and UPI transactions.',
        clausesOrExhibits: [
          {
            title: '§1.1 Standard Domestic Merchant Rate',
            content: 'Approved commercial processing rate is 1.2% + ₹2 per transaction. Free processing or zero fee commitments are disallowed.',
            highlight: true,
          },
        ],
        supportAssessment: 'CONTRADICTION DETECTED: Master schedule specifies 1.2% + ₹2 per transaction. Zero-fee assertion violates commercial policy.',
        isContradictionOrExpired: true,
        isDemoNotice: true,
      },
    }),
  },

  // 12. FinTech Ledger 1,200,000 TPS
  {
    pattern: /1,200,000\s+TPS|revolutionary\s+throughput\s+of\s+1,200,000/i,
    canonicalText: 'Revolutionary throughput of 1,200,000 TPS under full cryptographic auditing',
    category: 'Performance',
    riskLevel: 'Moderate',
    owner: 'Devon Vance (Chief Security Architect)',
    evidenceCitation: 'Laboratory Stress Test #FT-2026-992 (Synthetic Local Cluster Only)',
    evidenceLink: 'https://benchmarks.canon.internal/reports/fintech-tps-2026.pdf',
    evidenceDate: '2026-08-10',
    expiryDate: '2027-02-10',
    verify: () => ({
      status: 'Needs Verification',
      statusReason:
        '1,200,000 TPS measured in synthetic isolated laboratory cluster. Third-party multi-region network verification is pending.',
    }),
  },

  // 13. Bulletproof transaction settlement / zero default risk
  {
    pattern: /bulletproof\s+transaction\s+settlement|absolutely\s+eliminates\s+counterparty\s+default\s+risk/i,
    canonicalText: 'Bulletproof transaction settlement that absolutely eliminates counterparty default risk',
    category: 'Security',
    riskLevel: 'Critical',
    owner: 'Beatrix Holzer (Legal Counsel)',
    evidenceCitation: 'Legal Memorandum: Settlement Finality & Insolvency Law (Ref #LG-2026-78)',
    evidenceLink: 'https://compliance.canon.internal/legal/settlement-finality',
    evidenceDate: '2026-07-01',
    expiryDate: '2027-07-01',
    verify: () => ({
      status: 'Unsupported',
      statusReason:
        'Corporate legal policy bars promising absolute elimination of counterparty or market default risk without statutory insolvency carve-outs.',
    }),
  },

  // 14. Net-Zero PUE rating 1.08
  {
    pattern: /PUE\s+rating\s+of\s+1\.08|PUE\s+1\.08/i,
    canonicalText: 'Power Usage Effectiveness (PUE) rating of 1.08 across European facilities',
    category: 'Sustainability',
    riskLevel: 'Moderate',
    owner: 'Amina Al-Mansoor (Global Head of Sustainability)',
    evidenceCitation: 'ISO 14064-3 Nordic & Alpine Facility Verification Certificate #ISO-2026-08',
    evidenceLink: 'https://sustainability.canon.internal/audits/pue-iso14064-2026.pdf',
    evidenceDate: '2026-08-30',
    expiryDate: '2027-08-30',
    verify: () => ({
      status: 'Verified',
      statusReason:
        'Audited and verified under ISO 14064-3 standards for continuous 24/7 carbon-free energy matching across Nordic and Alpine facilities.',
    }),
  },

  // 15. Lowest PUE ever achieved in human history (Absolute Superlative)
  {
    pattern: /lowest\s+ever\s+achieved\s+by\s+any\s+computing\s+facility\s+in\s+human\s+history/i,
    canonicalText: 'Lowest PUE ever achieved by any computing facility in human history',
    category: 'Sustainability',
    riskLevel: 'Critical',
    owner: 'Amina Al-Mansoor (Global Head of Sustainability)',
    evidenceCitation: 'Pending Worldwide Comparative Data Center Energy Survey',
    evidenceLink: 'https://sustainability.canon.internal/pending-survey',
    evidenceDate: '2026-09-01',
    expiryDate: '2027-09-01',
    verify: () => ({
      status: 'Unsupported',
      statusReason:
        'Unsubstantiated global historical superlative. Brand Rule RULE-SEC-04 forbids declaring historical absolutes without universal comparative data.',
    }),
  },
];

/**
 * Extract sentences or clauses with quantitative or promissory assertions from arbitrary text
 */
function extractGenericQuantitativeClauses(text: string): string[] {
  const clauses: string[] = [];
  // Split into sentences
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const metricRegex = /(\b\d+(\.\d+)?%|\b\d+ms\b|\b\d+(\.\d+)?x\b|₹\d+[\d,]*|\$\d+[\d,]*|\bSLA\b|\bguarantees\b|\bcertified\b|\beradicated\b|\bunbreachable\b|\bunrivaled\b|\bzero\s+(downtime|manual|default|latency|fees)\b)/i;

  for (const sentence of sentences) {
    if (metricRegex.test(sentence)) {
      // Clean up sentence for claim proposition text (limit to 120 chars if too long)
      const claimText = sentence.length > 130 ? sentence.slice(0, 125) + '...' : sentence;
      clauses.push(claimText);
    }
  }

  return clauses;
}

/**
 * Main Engine: Extract claims from audited content, verify against approved facts & evidence,
 * and synchronize with the Claim Ledger while preserving history and non-target content claims.
 */
export function extractAndVerifyClaims(
  draftText: string,
  contentId: string,
  contentTitle: string,
  auditVersion: number,
  existingClaims: ClaimItem[],
  approvedFacts: ApprovedFact[]
): ExtractionResult {
  const nowTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const nowDate = new Date().toISOString().slice(0, 10);

  // Separate claims belonging to other content items (these must remain unchanged)
  const otherContentClaims = existingClaims.filter(
    (c) => c.contentId && c.contentId !== contentId
  );

  // Existing claims for this contentId
  const currentContentClaims = existingClaims.filter(
    (c) => !c.contentId || c.contentId === contentId
  );

  // Map to hold updated/extracted claims for this content
  const activeClaimsForContent: ClaimItem[] = [];
  const processedClaimTexts = new Set<string>();

  let newClaimsCount = 0;

  // 1. Check known signatures against draftText
  for (const sig of KNOWN_CLAIM_SIGNATURES) {
    if (sig.pattern.test(draftText)) {
      processedClaimTexts.add(sig.canonicalText.toLowerCase());

      // Match against existing claims for this content item
      const existing = currentContentClaims.find(
        (c) =>
          c.claimText.toLowerCase() === sig.canonicalText.toLowerCase() ||
          sig.pattern.test(c.claimText)
      );

      // Run verification logic
      const verification = sig.verify(draftText, approvedFacts);

      if (existing) {
        // Preserve user revocations and escalations unless re-verified
        let finalStatus = verification.status;
        let finalHistory = [...existing.history];

        // If the claim was previously marked 'Unsupported' via 'Verification Revoked' and verification would be 'Verified',
        // keep it Unsupported unless explicitly re-verified!
        const hasRevokeRecord = existing.history.some(
          (h) => h.action.toLowerCase().includes('revoked')
        );
        if (hasRevokeRecord && existing.status === 'Unsupported' && verification.status === 'Verified') {
          finalStatus = 'Unsupported';
        } else if (existing.status === 'Under Legal Review' || existing.status === 'Pending Specialist Review') {
          finalStatus = existing.status;
        } else if (existing.status !== verification.status) {
          // Status shifted due to updated facts or audit
          finalHistory = [
            {
              id: `h-shift-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
              action: `Status Evaluated: ${verification.status}`,
              author: 'Canon Audit Engine',
              timestamp: nowTimestamp,
              note: `Audit v${auditVersion}: ${verification.statusReason}`,
            },
            ...finalHistory,
          ];
        }

        const supportingFact = sig.supportingFactCode
          ? approvedFacts.find((f) => f.code === sig.supportingFactCode)
          : undefined;

        activeClaimsForContent.push({
          ...existing,
          contentId,
          contentTitle,
          auditVersion,
          isActive: true,
          status: finalStatus,
          statusReason: verification.statusReason,
          supportingFactCode: sig.supportingFactCode,
          supportingFactValue: supportingFact?.value,
          evidenceArtifact: verification.artifact || existing.evidenceArtifact,
          history: finalHistory,
        });
      } else {
        // Newly extracted claim
        newClaimsCount++;
        const newClaimId = `claim-${contentId.slice(0, 12)}-${Date.now()}-${newClaimsCount}`;
        const supportingFact = sig.supportingFactCode
          ? approvedFacts.find((f) => f.code === sig.supportingFactCode)
          : undefined;

        activeClaimsForContent.push({
          id: newClaimId,
          claimText: sig.canonicalText,
          draftContext: draftText.slice(0, 160) + '...',
          status: verification.status,
          statusReason: verification.statusReason,
          owner: sig.owner,
          evidenceLink: sig.evidenceLink,
          evidenceCitation: sig.evidenceCitation,
          evidenceDate: sig.evidenceDate,
          expiryDate: sig.expiryDate,
          riskLevel: sig.riskLevel,
          category: sig.category,
          supportingFactCode: sig.supportingFactCode,
          supportingFactValue: supportingFact?.value,
          evidenceArtifact: verification.artifact,
          contentId,
          contentTitle,
          auditVersion,
          isActive: true,
          history: [
            {
              id: `h-extract-${Date.now()}-${newClaimsCount}`,
              action: 'Claim Extracted & Verified',
              author: 'Canon Audit Engine',
              timestamp: nowTimestamp,
              note: `Extracted in Audit v${auditVersion}. ${verification.statusReason}`,
            },
          ],
        });
      }
    }
  }

  // 2. Extract any generic quantitative clauses in custom user text not covered by known signatures
  const genericClauses = extractGenericQuantitativeClauses(draftText);
  for (const clause of genericClauses) {
    const clauseNorm = clause.toLowerCase();
    // Skip if already covered by a known signature
    const isCovered = Array.from(processedClaimTexts).some(
      (known) => known.includes(clauseNorm) || clauseNorm.includes(known)
    );

    if (!isCovered && !processedClaimTexts.has(clauseNorm)) {
      processedClaimTexts.add(clauseNorm);

      const existing = currentContentClaims.find(
        (c) => c.claimText.toLowerCase() === clauseNorm
      );

      if (existing) {
        activeClaimsForContent.push({
          ...existing,
          contentId,
          contentTitle,
          auditVersion,
          isActive: true,
        });
      } else {
        newClaimsCount++;
        const newClaimId = `claim-gen-${Date.now()}-${newClaimsCount}`;
        const isSuperlative = /100%|guarantees|bulletproof|unbreachable|zero\s+/i.test(clause);
        const status: ClaimVerificationStatus = isSuperlative ? 'Unsupported' : 'Needs Verification';
        const riskLevel = isSuperlative ? 'Critical' : 'Moderate';
        const reason = isSuperlative
          ? 'Unqualified absolute assertion requires contractually defined exclusions and SLA master schedule.'
          : 'Quantitative assertion extracted from draft content. Requires specialist review and accredited exhibit attachment.';

        activeClaimsForContent.push({
          id: newClaimId,
          claimText: clause,
          draftContext: clause,
          status,
          statusReason: reason,
          owner: 'Elena Rostova (Marketing)',
          evidenceLink: 'https://governance.internal/exhibits/pending',
          evidenceCitation: 'Pending Specialist Evidence & Legal Accreditation',
          evidenceDate: nowDate,
          expiryDate: 'Pending Verification',
          riskLevel,
          category: /security|encrypt|pqc|hsm/i.test(clause)
            ? 'Security'
            : /speed|latency|throughput|tps|perf/i.test(clause)
            ? 'Performance'
            : /esg|carbon|pue|energy/i.test(clause)
            ? 'Sustainability'
            : 'Financial',
          contentId,
          contentTitle,
          auditVersion,
          isActive: true,
          history: [
            {
              id: `h-gen-${Date.now()}-${newClaimsCount}`,
              action: 'Claim Extracted from Content',
              author: 'Canon Audit Engine',
              timestamp: nowTimestamp,
              note: `Extracted in Audit v${auditVersion}. Assigned ${status}: ${reason}`,
            },
          ],
        });
      }
    }
  }

  // 3. Mark previously present claims for this content that are NO LONGER in draftText as isActive: false
  let deactivatedCount = 0;
  const deactivatedClaims: ClaimItem[] = [];

  for (const prevClaim of currentContentClaims) {
    const isStillPresent = activeClaimsForContent.some(
      (c) => c.id === prevClaim.id || c.claimText.toLowerCase() === prevClaim.claimText.toLowerCase()
    );

    if (!isStillPresent) {
      deactivatedCount++;
      const wasAlreadyInactive = prevClaim.isActive === false;
      const updatedHistory = wasAlreadyInactive
        ? prevClaim.history
        : [
            {
              id: `h-deact-${Date.now()}-${deactivatedCount}`,
              action: 'Claim Removed from Latest Content',
              author: 'Canon Audit Engine',
              timestamp: nowTimestamp,
              note: `Claim proposition was edited out or removed in Content Audit v${auditVersion}. Record preserved in historical audit log.`,
            },
            ...prevClaim.history,
          ];

      deactivatedClaims.push({
        ...prevClaim,
        contentId,
        contentTitle,
        isActive: false,
        history: updatedHistory,
      });
    }
  }

  // Combine other content claims + active claims for this content + deactivated historical claims
  const updatedClaims = [...otherContentClaims, ...activeClaimsForContent, ...deactivatedClaims];

  return {
    updatedClaims,
    activeClaimsForContent,
    deactivatedCount,
    newClaimsCount,
    extractedCount: activeClaimsForContent.length,
  };
}
