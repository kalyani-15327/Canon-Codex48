**Canon — Enterprise Brand Governance Platform**

Canon is an intelligent brand governance and pre-publication review platform developed for the Inkloom AI Hackathon. It helps organisations maintain consistent brand communication, identify unsupported claims, and improve content quality before publication.

🎯 Problem Statement

Organisations create content through multiple employees, agencies, and AI tools. This can lead to inconsistent brand messaging, outdated information, unsupported promotional claims, and unclear brand guidelines.

Canon aims to address these challenges through automated content auditing, evidence tracking, and transparent human review.

✨ Core Features

 A. Intent-Preserving Corrections
- Analyses corporate drafts against configured brand guidelines.
- Builds an Intent Card containing the purpose, target audience, tone, and must-keep terms.
- Provides three correction levels: Minimal, Balanced, and Reframe.
- Displays intent preservation scores and side-by-side tracked changes.
- Allows users to apply corrections or override findings.

 B. Claim Ledger & Verification Matrix
- Extracts promotional and factual claims from content.
- Tracks verification status, responsible owners, evidence references, and expiry dates.
- Identifies unsupported claims and expired evidence.
- Supports specialist escalation and claim verification management.
- Connects claim status to publication readiness.

 C. Guideline Health & Guideline CI
- Displays brand guidelines and rule health metrics.
- Tracks rule overrides, disputes, and ambiguity.
- Suggests clearer wording for problematic rules.
- Simulates proposed guideline changes against historical sample content.
- Reports potential compliance impacts before a rule change is adopted.

 Additional Feature: Audit Trail & Team Compliance Log
- Records important review activities and decisions.
- Tracks corrections, overrides, claim reviews, and guideline changes.
- Supports team contribution tracking.
- Provides compliance report export functionality where implemented.
  
🛠️ Technology Stack

- Frontend: React and TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- Data Persistence: LocalStorage for prototype data
- Reporting: JSON and PDF export functionality, subject to implementation
  
🔍 Example Workflow

1. Select or enter a corporate content draft.
2. Run the brand and intent audit.
3. Review findings and intent-preserving corrections.
4. Inspect promotional claims and their evidence.
5. Review brand rules and simulate proposed guideline changes.
6. Inspect the audit trail and export available compliance reports.

🔐 Transparency and Human Review

Canon is designed to support human decision-making rather than replace it. Findings, recommendations, and simulation results should be reviewed before being relied upon.

Sample evidence and simulated results are not equivalent to independent external verification. Actual capabilities depend on the implemented audit logic and available data.

🔮 Future Enhancements

- Canon Gateway: Check brand rules and approved facts before or during AI content creation.
- Canon Watch: Identify published content affected by changes to approved facts or expired evidence.
- Format Adapters: Extend content ingestion and auditing to additional file formats and sources.

These are planned enhancements unless otherwise implemented and tested.

👥 Team

Developed collaboratively for the Inkloom AI Hackathon.

📄 Project Status

Canon is an interactive prototype demonstrating enterprise brand governance, claim tracking, guideline improvement, and auditability workflows.

Features should be tested before being described as production-ready.
