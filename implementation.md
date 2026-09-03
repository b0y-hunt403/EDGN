# Ethiopian Digital Guarantee Network (EDGN)

## Full implementation blueprint

| Item | Baseline |
|---|---|
| Document status | Proposed implementation and contract baseline |
| Version | 1.0 |
| Prepared | 31 August 2026 |
| Proposed project start | 1 September 2026 |
| Core MVP acceptance target | 29 January 2027 |
| Full production-readiness target | 10 September 2027 |
| Source 1 | Digital guarantee #1.pdf, 57 pages, master SRS |
| Source 2 | Court portal.pdf, 23 pages, Judicial & Court Integration Module 32 |

> Important: neither source PDF defines a software-project deadline. The dates 1 September 2026 and 30 September 2026 in the SRS are example guarantee issue and expiry dates, not delivery dates. The schedule in this document is a proposed implementation commitment based on the staffing and dependencies stated below.

---

## 1. Executive project picture

EDGN is a multi-bank, multi-organization digital infrastructure platform for the complete bank-guarantee lifecycle:

    Applicant request
        -> bank review and credit decision
        -> collateral or reserve confirmation
        -> approval and digital signature
        -> digital issuance and QR verification
        -> monitoring, amendment, extension, or additional guarantee
        -> claim and settlement or release
        -> dispute and evidence management
        -> authorized court referral when unresolved
        -> authenticated judicial decision
        -> authorized execution, audit, and closure

It is not only a form application or PDF generator. It is a controlled workflow, registry, evidence, integration, and audit platform.

### 1.1 Authority boundaries

These boundaries are non-negotiable:

- EDGN orchestrates workflows, stores authorized records, verifies integrity, sends notifications, and maintains audit trails.
- A participating bank retains all credit, collateral, guarantee-issuance, claim, payment, and other regulated banking decisions.
- A competent court retains all judicial power. EDGN must never issue a judgment, determine liability, reinterpret an order, or apply an unauthenticated decision.
- EDGN does not replace core banking, bank ledger, national identity, payment switch, procurement, arbitration, or court case-management systems.
- Integrations activate only after legal, institutional, security, and data-sharing approval.

### 1.2 Product surfaces

The product consists of seven role-specific surfaces:

1. Public Guarantee Verification Portal
2. Applicant Portal
3. Beneficiary Portal
4. Bank Portal
5. EDGN Administration Portal
6. Court/Judicial Portal
7. API Developer and Integration Portal

An optional mobile application is a later channel, not a separate business system. The responsive web application must cover the initial mobile use cases.

### 1.3 Recommended solution shape

Use a modular monolith for the first production release, with strict domain boundaries, asynchronous workers, an outbox, and adapter interfaces. This is faster and safer to transact consistently than starting with many distributed services, while preserving an extraction path for high-volume services later.

    Browser and approved external clients
                    |
              Web application
          Next.js + shared design system
                    |
              API gateway / WAF
                    |
           NestJS application API
                    |
      +-------------+--------------+
      |             |              |
    Domain       Workflow       Integration
    modules       workers         adapters
      |             |              |
 PostgreSQL       Redis         Banks / KYC
 + outbox         queues        Signature / SMS
      |                            Procurement
 Object storage                    Court systems
      |
 Documents, signed records, and evidence

### 1.4 Technology baseline

| Layer | Recommended baseline |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | NestJS, Node.js, TypeScript |
| Database | PostgreSQL |
| Cache, rate limits, jobs | Redis plus a durable job queue |
| Files and evidence | S3-compatible encrypted object storage with versioning |
| Identity | Standards-based OAuth 2.0/OIDC provider with MFA |
| API | Versioned REST/JSON plus authenticated webhooks |
| API contract | OpenAPI 3.1 generated and versioned with the code |
| Secrets | Vault or an equivalent managed secrets service |
| Deployment | Containers, infrastructure as code, automated CI/CD |
| Observability | Central logs, metrics, traces, alerting, and security events |

The exact cloud, hosting location, identity provider, signature provider, KYC provider, SMS/email providers, and court/bank APIs remain procurement and architecture decisions.

---

## 2. Scope baseline

### 2.1 Included capabilities

- Identity, MFA, users, organizations, roles, and permissions
- Applicant and beneficiary onboarding, KYC/KYB, and authorized representatives
- Banks, branches, bank users, product configuration, and adapter isolation
- Configurable guarantee types, templates, rules, fees, SLAs, and approval matrices
- New guarantee request, review, approval, collateral/reserve, issuance, signature, and QR
- Registry, search, status, immutable version history, and related guarantees
- Extensions, amendments, and additional guarantees as separate transaction types
- Claims, decisions, settlement tracking, release, and collateral-release confirmation
- Contract/tender relationships and active-exposure calculation
- Disputes, case room, evidence locker, legal hold, and escalation
- Court referral, court case, information requests, hearings, orders, decisions, appeals, bank instructions, execution status, and closure
- Notifications, expiry monitoring, SLA escalation, reporting, fraud/risk alerts
- Bank reconciliation, exceptions, retries, idempotency, API clients, and webhooks
- Audit, non-repudiation, secure storage, monitoring, backup, and disaster recovery
- English and Amharic localization readiness; ETB initially, currency-ready architecture

Initial configurable guarantee products:

1. Bid/Tender Guarantee
2. Performance Guarantee
3. Advance Payment Guarantee
4. Retention Guarantee
5. Payment Guarantee
6. Customs Guarantee
7. Contract Guarantee
8. Other institution-approved configurable guarantee types

Adding a product must be configuration-led through types, templates, required fields/documents, rules, approvals, fees, and SLAs rather than a new hard-coded application.

### 2.2 Explicitly excluded or externally controlled

- Replacement of bank core, credit, collateral, or ledger systems
- EDGN making a credit, claim-payment, or banking decision
- EDGN holding or transferring customer money without a separately approved regulated model
- Replacement of a court, arbitration institution, procurement platform, identity system, or payment switch
- Automatic legal interpretation or execution of an unverified court document
- Production integration where the external institution has not approved authority, data sharing, security, and interface contracts
- Native mobile applications in the first release
- Advanced AI fraud scoring; the first release uses configurable and auditable rules

### 2.3 Assumptions for contract estimation

The proposed deadline assumes:

- One cross-functional team of 13 to 16 people: product owner, delivery manager/business analyst, solution architect, three frontend engineers, four backend engineers, two QA engineers, one DevOps/SRE engineer, one UX designer, and part-time security/domain specialists.
- One bank is the reference integration and at least one second bank is validated through the adapter model before final acceptance.
- One authorized judicial institution is the reference court integration.
- English ships first; Amharic translation and layout validation are completed before production.
- ETB is the enabled currency; the schema and services remain multi-currency capable.
- External parties supply sandbox access, API specifications, certificates, test accounts, decision rules, sample documents, and named approvers on the dates in Section 3.
- Stakeholders return requirements/UAT decisions within five business days.
- The first release is a responsive web platform; no native mobile build is included.

If the team is materially smaller, or bank/court APIs and legal approvals arrive late, the deadline must be re-baselined through change control.

### 2.4 Strategic and commercial picture

EDGN is an infrastructure/network product rather than a custom application for one bank. More participating banks create access for more applicants and beneficiaries, which produces more issued guarantees, verification usage, and institutional integrations. The data and adapter model must therefore stay multi-tenant and bank-neutral.

The architecture supports, but the commercial agreement must separately authorize and price:

- Platform subscriptions
- Transaction, verification, API-usage, and bank-integration fees
- Enterprise licensing
- Premium analytics and institutional services

Future ecosystem expansion may include e-procurement, identity, payment, arbitration, mediation, enforcement, legal case-management, and government digital-service integrations. These are not automatically included merely because the architecture can support them.

---

## 3. Contract-ready delivery plan and deadline

### 3.1 Recommended milestone schedule

| Gate | Dates | Outcome and acceptance evidence |
|---|---|---|
| G0: inception and decisions | 1-18 Sep 2026 | Signed scope, authority boundaries, process maps, field dictionary, integration owners, non-functional targets, risk register, prioritized backlog |
| G1: UX, architecture, and platform foundation | 21 Sep-30 Oct 2026 | Approved prototypes, repository, environments, CI/CD, IAM/MFA/RBAC, organization model, audit skeleton, document pipeline, OpenAPI conventions |
| G2: Core MVP | 2 Nov 2026-29 Jan 2027 | Applicant and beneficiary onboarding; new guarantee; maker/checker/signatory flow; collateral; issuance; signature adapter; QR; registry; notifications; core audit; end-to-end MVP UAT |
| G3: advanced lifecycle | 1 Feb-2 Apr 2027 | Extension, amendment, additional guarantee, exposure, claim, settlement, release, expiry, SLA, fees, versioning, reconciliation |
| G4: disputes and evidence | 5 Apr-21 May 2027 | Disputes, case room, evidence locker, integrity, legal hold, escalation, fraud/exception workflows |
| G5: judicial integration | 24 May-16 Jul 2027 | Court roles and portal, referral, case linkage, information requests, evidence transfer, decisions, appeals, bank instructions, all 15 court acceptance criteria |
| G6: hardening and formal UAT | 19 Jul-27 Aug 2027 | Security and penetration testing, performance/load, DR rehearsal, accessibility, data migration rehearsal, full regression, manuals, training, signed UAT |
| G7: production cutover | 30 Aug-10 Sep 2027 | Production readiness review, controlled deployment, smoke tests, pilot support, rollback readiness, operational handover |

Proposed full production-readiness deadline: 10 September 2027.

This is approximately 54 calendar weeks from the proposed start and is appropriate for a regulated, integration-heavy platform. A reduced core MVP can be accepted on 29 January 2027, but it is not the full scope described by both PDFs.

### 3.2 External dependency dates

| Required input | Owner | Needed no later than | Effect if missed |
|---|---|---|---|
| Named product owner and institutional approvers | EDGN sponsor | 1 Sep 2026 | Work cannot receive binding acceptance |
| Approved business processes and guarantee templates | EDGN plus bank | 11 Sep 2026 | G0/G1 moves day-for-day |
| Hosting, data residency, privacy, and retention decisions | EDGN legal/security | 18 Sep 2026 | Architecture and production approval blocked |
| Bank sandbox, API contract, certificates, and test data | Reference bank | 12 Oct 2026 | Automated bank integration removed from G2 until supplied |
| Approved signature provider and test credentials | EDGN plus bank | 2 Nov 2026 | Digital issuance/signature acceptance blocked |
| KYC/KYB provider or approved manual fallback | EDGN | 2 Nov 2026 | Automated onboarding acceptance blocked |
| Court authority, data-sharing agreement, roles, and process | Court plus EDGN | 30 Apr 2027 | G5 cannot start as a production integration |
| Court sandbox/API contract/certificates | Court IT | 14 May 2027 | Court integration date moves day-for-day |
| UAT users and approved test data | All parties | Four weeks before each UAT | Relevant gate cannot close |

The contract should explicitly state that delays in third-party approvals, access, specifications, credentials, or decisions extend affected milestones through an approved re-baseline. They must not silently become development-team liability.

### 3.3 Acceptance and payment gates

Each gate should close only when all of the following exist:

- Demonstrated working software in the agreed environment
- Acceptance scenarios executed with recorded results
- Code, database migrations, API contract, and configuration committed
- Required unit, integration, security, and role tests passing
- Audit and error behavior demonstrated, not only the happy-path UI
- Documentation updated
- Known defects classified with an agreed disposition
- Written sign-off by the named product owner and affected institution

Suggested commercial milestones are G0, G2, G3, G5, G6, and G7. Percentages and payment terms belong in the commercial agreement, not in the software requirements.

### 3.4 Change control

Any request that changes scope, architecture, integrations, security, timeline, cost, or acceptance is a change request. It must record:

- Requested change and business reason
- Functional, data, UI, security, integration, and operational impact
- Dependencies, effort, cost, and schedule impact
- Backward-compatibility and migration impact
- Named approver and approval date

No oral request should alter the baseline.

---

## 4. Actors, permissions, and segregation

| Actor | Permitted responsibility | Must not do |
|---|---|---|
| Applicant | Register/KYB, request guarantees, provide documents, track, request amendment/extension/additional guarantee/release, respond to claims/disputes | Approve or issue guarantees; see unrelated organizations |
| Beneficiary | Receive and verify guarantees, request extension/release, submit claims, open/respond to disputes, view authorized history | Make a bank decision; view confidential bank/customer data |
| Bank Maker | Review applications, validate customer/documents, request information, prepare guarantee record | Give final checker/signatory approval for the same controlled action |
| Bank Checker | Review terms, collateral and maker work; approve, reject, or return | Sign as authorized signatory unless the approved matrix and segregation policy explicitly permit it |
| Bank Authorized Signatory | Approve issuance and authorized lifecycle decisions; digitally sign | Alter signed content without a new version and approval |
| Bank Operations/Settlement | Record payment, settlement, release, acknowledgement, and execution evidence | Change the judicial decision or historical signed record |
| EDGN Administrator | Configure platform, organizations, banks, roles, integrations, reports, monitoring | Override bank decisions, rewrite guarantee history, or issue court outcomes |
| EDGN Dispute Officer | Triage cases, coordinate evidence and responses, propose internal resolution/escalation | Act as a court or apply an unverified judicial decision |
| Auditor/Read-only | View authorized audit, evidence, and reports | Mutate operational records |
| Court Administrator | Court users, access, configuration, case routing | Issue a judgment without judicial authority |
| Judge/Authorized Officer | Review authorized case/evidence and issue signed orders/decisions | Access unrelated cases or modify source evidence |
| Court Clerk | Intake, files, documents, hearing administration, case preparation | Approve/apply a judicial decision as a judge |
| Court IT/Integration Officer | Monitor judicial APIs, certificates, errors, and connectivity | Read case substance unless separately authorized |
| External API Client | Perform only explicitly granted machine scopes | Obtain interactive-user or cross-tenant permissions |

Authorization must combine tenant/organization scope, role permissions, record relationship, case assignment, and action/state rules. UI hiding alone is never authorization.

---

## 5. Frontend implementation

### 5.1 Shared frontend foundation

- One Next.js workspace with deployable portal shells and a shared design system
- Server-enforced session handling with OIDC, MFA, inactivity timeout, and secure logout
- Role-aware navigation and route guards backed by API authorization
- English and Amharic localization, bidirectional-safe components, local date/number formatting, and no hard-coded user text
- Responsive layouts at phone, tablet, and desktop sizes
- WCAG 2.2 AA target: keyboard navigation, labels, focus, contrast, validation summaries, and screen-reader announcements
- Reusable form engine for schema validation, conditional fields, drafts, file uploads, autosave, and review pages
- Standard status badges, timelines, task inboxes, audit panels, document viewers, and confirmation dialogs
- All long operations show a correlation/reference ID and safe retry behavior
- Sensitive fields are masked by permission; public verification has a deliberately restricted view model

### 5.2 Public Verification Portal

Routes and screens:

- /verify: enter or scan verification reference
- /verify/[reference]: limited guarantee authenticity result
- /verify/help: verification guidance and fraud-reporting route

The result may show guarantee ID/reference, status, bank, amount/currency where approved, issue date, expiry date, guarantee type, and verification timestamp. It must not expose applicant banking data, collateral, internal notes, signatures/certificates beyond a safe status, evidence, or unrelated guarantees.

### 5.3 Applicant Portal

- Registration, login, MFA, password/account recovery
- Organization/KYB profile and authorized representatives
- Dashboard: tasks, drafts, pending information, active/expiring guarantees, claims, disputes
- New guarantee wizard
- Document center
- Bank selection and request review
- Application tracking and timeline
- Guarantee details, signed document, QR, and versions
- Extension request
- Amendment request
- Additional guarantee request
- Claim visibility and response
- Release request
- Dispute creation, evidence, case room, and response
- Notifications, preferences, profile, sessions, and authorized downloads

### 5.4 Beneficiary Portal

- Registration, organization verification, representatives, login, and MFA
- Dashboard: received guarantees, expiries, pending actions, claims, disputes
- Guarantee search/receipt and authorized detail/history
- QR scan or reference verification
- Extension request
- Claim submission and tracking
- Release request
- Dispute creation/response, evidence, and case room
- Notifications, profile, sessions, and authorized downloads

### 5.5 Bank Portal

- Role-specific dashboard and work queues
- Application assignment and maker review
- Applicant/KYC/KYB and document review
- Credit/eligibility and exposure review
- Terms, templates, and guarantee preparation
- Collateral/reserve request and confirmation
- Checker approval queue
- Signatory queue and signature ceremony
- Issuance, amendment, extension, additional-guarantee processing
- Claim decision and settlement tracking
- Release and collateral-release confirmation
- Dispute response, evidence, and court-instruction acknowledgement
- Reconciliation, exceptions, retries, and operational reports
- Branch, product, user, and delegated approval views where permitted

### 5.6 EDGN Administration Portal

- Platform health and operational dashboard
- Organizations, users, roles, permissions, and assignments
- Banks, branches, adapters, credentials metadata, and connection health
- Guarantee types, templates, rule versions, approval matrices, fees, SLAs
- Registry and authorized record inspection
- KYC/signature/notification provider configuration
- Fraud rules, alerts, and investigations
- Integration transactions, webhook deliveries, exceptions, and reconciliation
- Notification templates and localization
- Retention policies, legal holds, audit search/export, reports
- API clients, scopes, rate limits, webhook subscriptions, sandbox access
- Court institutions, judicial roles, routes, and integration configuration
- Feature flags and system parameters with four-eyes approval for sensitive changes

### 5.7 Court/Judicial Portal

This portal is logically separated from all other portals and enabled only after institutional authorization.

- Judicial login, MFA, case assignment, and scoped dashboard
- New referrals, accepted/returned intake, and court case-number linkage
- Case summary: parties, guarantee, contract/tender, claim, status, jurisdiction
- Immutable timeline
- Authorized guarantee versions and signature verification
- Evidence viewer with hash/integrity, access, and download logging
- Applicant, beneficiary, and bank submissions
- Information requests, due dates, responses, and attachments
- Hearing/proceeding administration
- Orders and decisions with signing/authentication status
- Appeals and officially provided finality status
- Bank instructions, acknowledgements, execution status, and returned evidence
- Case closure and retention/legal-hold status
- Court administration and technical integration monitoring

### 5.8 API Developer Portal

- Approved client onboarding
- Sandbox credentials and rotation
- OpenAPI reference and authentication examples
- Webhook event catalog, signing verification, delivery logs, and replay
- Usage, quota, rate-limit, API-version, and deprecation views
- Bank- and institution-specific field mappings visible only to authorized administrators

---

## 6. Complete form catalogue

The PDFs name the business records and many required fields, but they do not provide pixel-level form designs or complete KYC field definitions. The catalogue below includes:

- Source-required fields: explicitly stated in one or both PDFs.
- Operational fields: identifiers, consent, routing, and validation data necessary to make the stated workflow secure and usable.
- Provider fields: fields finalized only after the selected bank, KYC, signature, payment, procurement, or court interface contract is approved.

### 6.1 Rules shared by every form

- Every mutable request has a UUID, human-readable reference, tenant/organization, status, version, created/updated timestamps, and actor.
- Server-side validation is authoritative; client validation is for usability.
- Dates use ISO 8601 in APIs and a clearly labeled local display in the UI. Store instants in UTC and retain the originating time zone when legally relevant.
- Money uses decimal values, ISO currency codes, and no floating-point arithmetic.
- Required conditional fields appear from the selected guarantee type, template, rule, institution, and workflow state.
- Drafts can be saved where permitted. Submission requires a review page and explicit declaration.
- Files require category, file, original filename, media type, size, hash, uploader, timestamp, malware status, and version. The hash and technical metadata are system-generated.
- A reject, return, override, cancellation, manual retry, or privileged change always requires a reason.
- The UI displays field-level errors plus an accessible error summary.
- Duplicate submission protection uses a client operation ID and server idempotency key.
- Submitted and signed records are not overwritten. Corrections create a new request or version.
- All select options are configuration-backed and effective-dated where business meaning may change.

### 6.2 Identity, organization, and access forms

| ID | Form | Fields and controls |
|---|---|---|
| AUTH-01 | Account registration | Account type; organization type; legal organization name; TIN/tax reference; registration or license number; country; region/city/address; primary email; mobile number; representative first/middle/last name; representative title; representative identity reference; preferred language; password or identity-provider enrollment; terms/privacy consent; consent timestamp; CAPTCHA/risk check |
| AUTH-02 | OTP and MFA verification | Masked destination; OTP; resend; expiry countdown; trusted-device choice if policy permits; recovery method |
| AUTH-03 | Login | Email/username; password or OIDC action; remember-session choice if policy permits; CAPTCHA after risk threshold; MFA challenge |
| AUTH-04 | Account recovery | Email/mobile/user reference; verification challenge; new credential; session-revocation confirmation |
| ORG-01 | KYC/KYB profile | Legal name; trading name; organization type; TIN; business-license number, issue/expiry dates and issuer; registration number/date; sector; registered and operating addresses; phone/email; ownership/authorized-representative details; identity and license documents; bank/customer reference where authorized; verification provider references; declarations |
| ORG-02 | Authorized representative | Name; title; identity reference; email; phone; authority type; authority start/end; authorization document; allowed roles; status |
| USR-01 | User invitation | Organization; name; email/mobile; role(s); branch/court assignment; case or portfolio scope; start/end date; approver |
| USR-02 | Role/permission assignment | User; organization; role; permission additions/removals; scope; effective dates; reason; second approver for privileged roles |
| USR-03 | Profile/security preferences | Name/contact; preferred language; notification channels; MFA method; active sessions; revoke-session action |

KYC provider results, raw identity attributes, and bank-only customer details must be access-separated. Verification response, provider reference, result, reason codes, request/response timestamps, and correlation ID are logged.

### 6.3 New guarantee and issuance forms

#### GAR-01 — New Guarantee Request wizard

Step 1, request context:

- Guarantee type: bid/tender, performance, advance payment, retention, payment, customs, contract, or configured type
- Applicant organization and authorized representative
- Request date and request reference, generated by the system
- Existing draft/template to copy, if permitted

Step 2, beneficiary:

- Existing beneficiary organization or new beneficiary details
- Legal name, TIN/registration reference where required
- Contact name, email, phone, and address
- Procurement organization reference where applicable

Step 3, contract/tender:

- Contract or tender reference
- Contract/tender title and description
- Contract/tender value and currency
- Contract award/effective date where applicable
- Procurement-system reference where available
- Supporting contract/tender document

Step 4, guarantee terms:

- Requested guarantee amount and currency
- Requested effective/issue date
- Requested expiry date
- Guarantee purpose
- Template and template version, selected by rule
- Configurable terms/conditions and type-specific fields
- Calculated required percentage and calculated amount where a rule applies
- Override request, reason, and attachment; shown only with permission

Step 5, bank:

- Selected bank and branch, if branch routing applies
- Applicant bank-customer/account reference when authorized
- Preferred contact or relationship reference, optional

Step 6, documents and declaration:

- Required document checklist derived from type/template/rule
- File category, description, issue/expiry date where relevant, and file
- Applicant declaration of completeness/accuracy
- Authority-to-submit confirmation
- Review of all entered information and submit action

Validation:

- Amount is positive, currency is enabled, expiry is after effective date, and referenced entities are active.
- Required documents and type-specific fields must be present.
- Rules calculate expected amount; any deviation follows the audited override path.
- Duplicate contract/type/amount/beneficiary requests trigger a warning or fraud review but are not silently rejected.

#### DOC-01 — Document upload

- Related record type and reference
- Document category and description
- File
- Document date, issuer, reference, and expiry where applicable
- Confidentiality/access classification
- Declaration that the uploader is authorized

The system adds file ID, object version, hash, scan result, uploader, source, timestamps, access policy, and retention/legal-hold status.

#### REQ-INFO-01 — Additional-information response

- Information-request ID
- Request text and requesting party
- Due date
- Structured response
- Attachments
- Responding representative
- Declaration and submit

#### BANK-01 — Maker review

- Application and applicant summary, read-only
- Customer/KYC/KYB verification status and provider/bank reference
- Document checklist with verified, deficient, or not-applicable result
- Credit/eligibility assessment result and bank reference
- Existing exposure value and review result
- Guarantee terms review
- Risk observations
- Requested additional information and due date, when returning
- Proposed decision: prepare, return for information, reject recommendation, or submit to checker
- Reason/comments and next queue

Only bank-authored results are editable by authorized bank roles. EDGN does not calculate or substitute the bank credit decision.

#### COL-01 — Collateral/reserve record

- Guarantee/request reference
- Requirement: not required or required
- Collateral/reserve type
- Required amount and currency
- Requested amount and request date
- Bank/core-system request reference
- Status: pending, requested, reserved, partially reserved, fully reserved, released, blocked, or rejected
- Confirmed amount and confirmation date
- Expiry/review date where applicable
- Notes and authorized evidence

Bank integration responses populate immutable transaction references. Manual confirmation requires privileged permission, reason, evidence, and second approval.

#### APR-01 — Checker/approval action

- Request and prepared guarantee summary
- Approval level and matrix rule
- Terms, amount, currency, dates, collateral, KYC, documents, and exposure, read-only
- Decision: approve, reject, or return for correction/information
- Approved amount/conditions where permitted
- Reason/comments
- Next approval level or signatory
- Explicit confirmation and MFA/step-up authentication for high-risk thresholds

#### ISSUE-01 — Final issuance and signature

- Guarantee ID, generated
- Bank guarantee number
- Bank and branch
- Applicant and beneficiary
- Guarantee type
- Amount/currency
- issue/effective/expiry dates
- Contract/tender reference
- Final template/version and rendered wording
- Approval-chain summary
- Collateral status
- Authorized signatory
- Signature method/provider
- Confirmation that displayed content is final

The system generates the document, canonical representation, document hash, signature transaction, signature/certificate reference, timestamp, verification reference, and QR code. Any material change after signing creates a new version and requires reapproval/re-signing.

### 6.4 Lifecycle, claim, settlement, and release forms

| ID | Form | Fields and controls |
|---|---|---|
| EXT-01 | Extension request | Existing Guarantee ID; current expiry, amount, status, and version, read-only; requested new expiry; reason; initiator; applicant notification contact; supporting documents; declaration |
| EXT-02 | Bank extension review | Extension request; rule/template effect; exposure and collateral impact; additional fee; KYC/document checks if required; decision approve/reject/return; reason; approval route; revised wording |
| AMD-01 | Amendment request | Guarantee ID/current version; amendment type; fields requested to change; old values, read-only; proposed values; reason; requested effective date; supporting documents; declaration |
| AMD-02 | Amendment review | Structured before/after comparison; rule and exposure impact; collateral impact; decision; reason; approval route; re-sign requirement |
| ADD-01 | Additional guarantee request | Parent/related Guarantee ID; contract/tender reference; guarantee type; beneficiary; bank; additional amount/currency; effective/expiry dates; reason; documents; declaration |
| ADD-02 | Exposure review | Original and related guarantees; active amounts; proposed additional amount; resulting exposure; currency basis; bank result/reference; reviewer decision and notes |
| CLM-01 | Beneficiary claim | Guarantee ID; beneficiary identity, read-only; claim amount/currency; claim reason; claim date; supporting documents; declaration; authorized contact |
| CLM-02 | Bank claim review | Claim/reference; guarantee terms and available amount; document review; applicant response where allowed; decision approve/reject/return; approved amount; reason codes/comments; signatory route |
| SET-01 | Settlement record | Claim ID; transaction ID; bank reference; approved/paid amount; currency; beneficiary; payment status; settlement date; fees/taxes where applicable; evidence; reconciliation status |
| REL-01 | Release request | Guarantee ID; requester/beneficiary; requested release/effective date; reason; supporting documents; declaration |
| REL-02 | Release authorization | Guarantee and claim/dispute status; release decision; reason; authorized officer; effective date; collateral-release instruction/reference |
| REL-03 | Collateral release confirmation | Guarantee; collateral record; instruction reference; released amount/date; bank response; completion status; evidence; notes |

Lifecycle rules:

- Extension retains the Guarantee ID and creates a new guarantee version after approval.
- Amendment retains the Guarantee ID and creates a new version.
- Additional guarantee creates a new Guarantee ID, independent lifecycle/document/audit, and a parent/related relationship.
- Claim amount cannot exceed the permitted available amount without an explicit controlled bank outcome.
- Expired is not the same as claimed; release, claim, dispute, and expiry interactions are resolved by configured rules and bank authority.

### 6.5 Dispute, evidence, case-room, and operations forms

#### DSP-01 — Create dispute

- Dispute type: authenticity, claim, payment, amount, expiry, amendment, beneficiary, applicant, bank processing, duplicate guarantee, fraud suspicion, technical/integration, or configured type
- Related Guarantee ID
- Related claim, extension, amendment, additional guarantee, settlement, or release reference
- Subject
- Detailed description
- Event/discovery date
- Other parties
- Requested outcome
- Supporting documents/evidence
- Contact and declaration

The system creates the EDGN Dispute ID/case number, initial status, assignments, SLA, notifications, and audit event.

#### EVD-01 — Add evidence

- Dispute/court case
- Evidence category: guarantee, applicant, beneficiary, bank, technical, communication, payment, or other approved category
- Source and source reference
- Title and description
- Original creation date where available
- File or authorized linked immutable record
- Confidentiality/access classification
- Related party
- Declaration/custody note

The system adds unique Evidence ID, version, document hash, upload timestamp/uploader, signature status, access policy, access/download/view history, and legal-hold status. A replacement creates a new version and never overwrites the original.

#### MSG-01 — Case-room message

- Case ID
- Sender, generated
- Authorized recipients
- Subject
- Message
- Attachments
- Reply-to message
- Confidentiality classification

Every message stores sender, recipients, timestamp, case, attachment hashes, delivery/read state, and audit history.

| ID | Form | Fields and controls |
|---|---|---|
| DSP-02 | Party response | Case; request/allegation being answered; response; position; supporting evidence; representative; declaration |
| DSP-03 | Internal review/resolution | Case summary; findings; reconciliation result; proposed resolution; party responses; action items; decision to resolve or escalate; reason; required approvals |
| DSP-04 | Escalation | Case; unresolved issues; escalation route: mediation, arbitration, legal/court, or configured path; authority/approval; reason; evidence-package readiness |
| EXC-01 | Exception case | Exception ID, generated; related transaction; source; error code/description; retry status/count; responsible team; resolution status; resolution notes; manual action reason |
| REC-01 | Reconciliation review | EDGN record; external bank record; comparison fields; mismatch type/value; investigation owner; resolution; evidence; approval |
| FRD-01 | Fraud alert review | Alert/rule; related records; severity; facts; analyst assessment; disposition; actions; escalation; evidence |

### 6.6 Judicial forms

#### CRT-01 — Authorized court referral

- EDGN Dispute ID
- Target court/institution
- Jurisdiction, where applicable
- Referral date
- Referral reason and unresolved issues
- Applicant, beneficiary, and bank
- Guarantee ID and related Guarantee IDs
- Contract/tender reference
- Claim reference
- Evidence-package manifest
- Legal-authority/approval reference
- Data-sharing basis and access-expiry date where required
- Referring officer and approving officer

Court Case Number is initially empty and linked when returned by the court. Submission requires evidence-integrity validation and segregation-of-duties approval.

#### CRT-02 — Court intake/case registration

- EDGN Dispute ID and referral reference
- Court/institution
- Court Case Number
- Jurisdiction/division
- Filing/acceptance date
- Assigned clerk
- Assigned judge/officer where permitted
- Case status
- Intake decision: accept, return, or reject
- Reason and requested correction
- Access scope and case-team assignments

#### CRT-03 — Court request for information

- Request ID, generated
- Court Case Number
- Request date
- Requested information
- Responsible party
- Due date
- Allowed response/document types
- Priority
- Judicial/clerk authority reference
- Status

#### CRT-04 — Information response

- Request ID and request text, read-only
- Responsible party
- Response
- Supporting documents/evidence
- Representative and authority
- Submission date, generated
- Declaration

#### CRT-05 — Hearing/proceeding administration

- Court Case Number
- Event type
- Scheduled start/end and time zone
- Location or approved remote reference
- Participants
- Purpose/agenda
- Status
- Administrative notes and authorized documents

This is scheduling/record administration only; EDGN does not conduct or decide the proceeding.

#### CRT-06 — Judicial order/decision

- Court Case Number
- Decision/order number
- Decision date
- Type: case resolved, claim allowed, claim rejected, payment ordered, release ordered, guarantee-status determination, amendment-related order, preservation order, information-disclosure order, or configured judicial type
- Decision status
- Authorized judicial officer
- Decision document
- Effective date where applicable
- Related guarantee and dispute
- Explicit operational instructions, each separately structured
- Enforcement/instruction reference where applicable
- Digital signature or court-system reference
- Finality status only where officially communicated

The system calculates the document hash and records signature/certificate, source transaction, and timestamps. The receive flow must show authentication status. An invalid/unverified decision cannot expose an Apply action.

#### CRT-07 — Appeal update

- Court Case Number
- Appeal filed
- Appeal case number
- Appeal date
- Appeal status
- Appeal decision/document
- Official finality status and source
- Authorized submitter/reference

EDGN records but never independently determines legal finality.

#### CRT-08 — Bank instruction

- Court Case Number
- Decision/order number
- Target bank
- Guarantee ID
- Exact authorized instruction
- Required response/action
- due date
- Instruction/enforcement reference
- Authorized decision linkage
- Transmission approval

#### CRT-09 — Bank acknowledgement and execution

- Instruction reference
- Bank acknowledgement status/time/reference
- Accept-for-processing or authorized exception
- Action/response
- Completion status and date
- Bank transaction/reference
- Evidence returned
- Notes

Judicial decision status and operational execution status must remain separate fields.

#### CRT-10 — Court case closure

- Court Case Number
- Closure status/date
- Closure basis and authenticated decision linkage
- Appeal/finality information received from court
- Outstanding operational actions
- Retention start/end or policy
- Legal-hold continuation/release authorization
- Closing officer and approval

### 6.7 Configuration and integration forms

| ID | Form | Required configuration |
|---|---|---|
| CFG-01 | Guarantee type | Code/name; active dates; required fields/documents; allowed currencies; lifecycle capabilities; template/rule links |
| CFG-02 | Guarantee template | Type; version; effective dates; language; wording; merge fields; conditions; required fields; signature and approval requirements; preview; approval |
| CFG-03 | Guarantee rule | Type; bank; customer category; contract/tender amount bands; percentage/duration; calculated amount logic; priority; effective dates; override permission/approval |
| CFG-04 | Approval matrix | Bank/branch/product/risk; amount bands/currency; sequence; maker/checker/signatory roles; quorum; escalation; effective dates |
| CFG-05 | SLA rule | Record/event; start/stop/pause conditions; duration/calendar; warning thresholds; escalation chain; effective dates |
| CFG-06 | Fee rule | Fee type; bank/platform owner; basis; rate/fixed value; currency; tax; applicability; effective dates |
| CFG-07 | Fraud rule | Event/data scope; condition; threshold; severity; action; recipients; effective dates; testing mode |
| CFG-08 | Notification template | Event; channel; audience; language; subject/body; variables; retry/fallback; active version |
| INT-01 | Bank adapter | Bank; environment; base URL; auth method; certificate/secret references; timeouts/retries; field mappings; enabled capabilities; webhook settings; IP policy |
| INT-02 | Court adapter | Institution; authority/agreement references; environment; API/webhook URLs; mTLS/OAuth settings; certificate/secret references; mappings; enabled events; access rules |
| INT-03 | External provider | KYC/signature/payment/procurement/notification provider; endpoints; capabilities; credential references; timeout/retry; data classification |
| API-01 | API client | Organization; client name; environment; scopes; rate limit; IP/network restrictions; certificate/public key; secret rotation; expiry; approvers |
| WH-01 | Webhook subscription | Client; callback URL; event types; signing key reference; status; retry policy; test action |
| RET-01 | Retention policy | Record/evidence category; tenant/jurisdiction; retention period; archive/delete behavior; legal-hold precedence; approval/effective dates |
| RPT-01 | Report/export request | Report type; filters; date range; organization/case scope; columns; format; reason; approval for sensitive export |

Sensitive configuration changes use versioning, before/after audit, step-up authentication, and four-eyes approval. Secret values are never displayed or stored in application configuration; only secret-manager references are retained.

---

## 7. Workflow and status design

### 7.1 Do not implement one overloaded status field

The SRS lists all required user-visible statuses, but a guarantee, extension, claim, dispute, and court case can progress independently. Implement:

- Guarantee lifecycle status
- Application/review status
- Collateral status
- Amendment request status
- Extension request status
- Claim status
- Release status
- Dispute status
- Court case status
- Judicial decision authentication/status
- Operational execution status

A read model produces the required user-facing status labels, including DRAFT, SUBMITTED, UNDER_REVIEW, MORE_INFORMATION_REQUIRED, APPROVED, REJECTED, COLLATERAL_PENDING, COLLATERAL_RESERVED, ISSUED, ACTIVE, AMENDMENT_PENDING, AMENDED, EXTENSION_PENDING, EXTENDED, CLAIM_PENDING, CLAIMED, CLAIM_REJECTED, CLAIM_PAID, RELEASE_REQUESTED, RELEASED, EXPIRED, CANCELLED, DISPUTED, and CLOSED.

This preserves truth. For example, an active guarantee can simultaneously have a pending extension and an open dispute without corrupting its primary lifecycle state.

### 7.2 Main guarantee flow

    DRAFT
      -> SUBMITTED
      -> UNDER_REVIEW
      -> MORE_INFORMATION_REQUIRED -> SUBMITTED
      -> APPROVED
      -> COLLATERAL_PENDING
      -> COLLATERAL_RESERVED
      -> ISSUED
      -> ACTIVE
      -> RELEASED or EXPIRED or CLAIMED
      -> CLOSED

Alternative transitions:

- UNDER_REVIEW to REJECTED
- DRAFT or eligible pre-issuance state to CANCELLED with authority
- APPROVED directly to ISSUED only when collateral is explicitly Not Required
- ISSUED to ACTIVE when its effective date is reached
- ACTIVE to EXPIRED through a scheduled, idempotent transition
- No signed/issued record may return to an editable pre-issuance state

Each transition is a command with current-state precondition, permission, validation, idempotency key, actor, reason where required, audit event, and notification/event outcome.

### 7.3 Versioning model

- Guarantee is the stable identity and retains the same Guarantee ID through amendments and extensions.
- GuaranteeVersion is immutable after finalization and stores version number, kind, effective date, reason, previous/new values, document, hash, signature state, creator, approvers, and timestamps.
- Original issuance creates Version 1.
- Approved amendment or extension creates the next version and triggers re-rendering/re-signing where applicable.
- Additional guarantee creates a separate Guarantee and Version 1, linked through GuaranteeRelationship and the shared contract/tender.
- A signed version is never updated in place. Metadata corrections that affect legal meaning also create a version.

### 7.4 Extension flow

    request submitted
      -> applicant notified when beneficiary initiated
      -> bank review
      -> information requested, rejected, or approved
      -> required approval/signature
      -> new guarantee version
      -> expiry scheduler updated
      -> beneficiary/applicant notified

The new expiry must be later than the current effective expiry unless an explicitly configured legal process permits otherwise.

### 7.5 Amendment flow

    request submitted
      -> structured before/after change set
      -> bank/rule/collateral/exposure review
      -> approval or rejection
      -> new version and re-signing
      -> registry/timeline/notifications updated

The system must classify material versus non-material changes through approved configuration. It must not let administrators bypass bank approval by editing the guarantee table.

### 7.6 Additional guarantee flow

    parent guarantee or contract selected
      -> additional request
      -> normal bank review and approval
      -> new Guarantee ID
      -> independent Version 1 and signed document
      -> relationship recorded
      -> contract exposure recalculated

The original and additional guarantees can expire, be claimed, disputed, or released independently.

### 7.7 Claim, settlement, and release

Claim:

    CLAIM_SUBMITTED
      -> BANK_REVIEW
      -> MORE_INFORMATION_REQUIRED
      -> APPROVED or REJECTED
      -> PAYMENT_PENDING when approved
      -> PAID or authorized payment exception
      -> CLOSED

Release:

    RELEASE_REQUESTED
      -> BANK_REVIEW
      -> AUTHORIZED or REJECTED
      -> GUARANTEE_RELEASED
      -> COLLATERAL_RELEASE_REQUESTED
      -> COLLATERAL_RELEASE_CONFIRMED
      -> CLOSED

Settlement is a tracking and reconciliation record. EDGN never posts bank-ledger entries as if it were the system of record.

### 7.8 Dispute and court flow

    DISPUTE_CREATED
      -> EVIDENCE_COLLECTION
      -> PARTIES_NOTIFIED
      -> RESPONSES_PENDING
      -> INTERNAL_REVIEW
      -> NEGOTIATION_OR_RECONCILIATION
      -> RESOLVED
         or
      -> ESCALATION_AUTHORIZED
      -> COURT_REFERRAL_PREPARED
      -> COURT_REFERRAL_SENT
      -> COURT_CASE_LINKED
      -> JUDICIAL_REVIEW
      -> INFORMATION_REQUESTED and RESPONSE_RETURNED as needed
      -> ORDER_OR_DECISION_RECEIVED
      -> AUTHENTICATION_VERIFIED
      -> DECISION_RECORDED
      -> AUTHORIZED_OPERATIONAL_INSTRUCTIONS
      -> BANK_ACKNOWLEDGEMENT
      -> EXECUTION_TRACKED
      -> APPEAL_OR_FINAL_STATUS_RECORDED
      -> CLOSED

On court referral, legal hold is activated before evidence transfer. If decision authentication fails, the flow moves to an integration exception/manual review and no EDGN workflow consequence is applied.

### 7.9 Judicial decision application rule

Only a verified decision and its explicit structured operational instruction may cause an automated state change. The decision-receipt transaction must:

1. Authenticate the channel/client.
2. Enforce idempotency.
3. Validate schema, court authority, case relationship, and allowed decision type.
4. Verify signature/certificate/reference, document hash, and timestamp as configured.
5. Store the original immutable payload and decision document.
6. Record verification evidence and result.
7. Require human review when the instruction is ambiguous or configured for manual application.
8. Apply only explicitly mapped operational consequences.
9. Record before/after states and send authorized notifications.

No free-text legal interpretation should drive an automated command.

---

## 8. Backend modules

| Module | Responsibilities | Main records |
|---|---|---|
| Identity and Access | OIDC integration, MFA policy, sessions, service clients, roles, permissions, scopes, step-up auth | User, Role, Permission, Session, APIClient |
| Organizations | Multi-tenant organizations, representatives, applicant/beneficiary/bank/court relationships | Organization, ApplicantProfile, BeneficiaryProfile, Representative |
| KYC/KYB | Verification requests, provider adapters, status, evidence, expiry/recheck | KYCProfile, VerificationTransaction |
| Documents | Secure upload, scan, encryption metadata, versions, hashes, access policies, download authorization | Document, DocumentVersion, DocumentAccess |
| Contracts and Tenders | Contract/tender master, procurement references, linked guarantees and exposure | Contract, Tender, ProcurementReference |
| Guarantee Configuration | Types, templates, rules, effective dating, controlled publishing | GuaranteeType, Template, TemplateVersion, Rule, RuleVersion |
| Guarantee Requests | Draft/submission, field validation, document checklist, bank selection, information requests | GuaranteeApplication, ApplicationDocument, InformationRequest |
| Bank Review and Approval | Assignment, maker/checker/signatory tasks, approval matrices, reasons, delegation | Review, ApprovalTask, ApprovalDecision |
| Collateral and Reserve | Request/confirmation/release orchestration and external references | Collateral, CollateralReservation |
| Guarantee Registry | Stable guarantee identity, status, search, relationships, contract exposure | Guarantee, GuaranteeRelationship, StatusHistory |
| Version and Document Generation | Immutable versions, deterministic rendering, hashes, PDFs, comparison | GuaranteeVersion, GeneratedDocument |
| Digital Signature | Provider abstraction, signing ceremony, callback verification, certificate/reference state | DigitalSignature, SigningTransaction |
| Verification and QR | Opaque verification references, QR generation, safe public projection, scan analytics | QRCode, VerificationEvent |
| Amendments | Change set, review, approval, new-version orchestration | GuaranteeAmendment |
| Extensions | Requested expiry, notification, review, approval, new-version orchestration | GuaranteeExtension |
| Additional Guarantees | Parent/contract link, new guarantee orchestration, exposure update | AdditionalGuaranteeRequest |
| Claims | Submission, documents, bank review/decision, available-amount rules | Claim, ClaimDocument, ClaimDecision |
| Settlement | Bank payment references, payment states, fees, reconciliation | Settlement, PaymentTransaction |
| Release | Request, authorization, guarantee release, collateral-release confirmation | ReleaseRequest, ReleaseDecision |
| Exposure | Contract-level active exposure and auditable calculation snapshots | ExposureSnapshot |
| Disputes | Case creation, parties, workflow, internal resolution, escalation | Dispute, DisputeParty, DisputeAction |
| Case Room | Scoped messages, recipients, attachments, delivery/read state | DisputeMessage |
| Evidence and Legal Hold | Evidence manifest, hashes, chain/access history, preservation, retention overrides | DisputeEvidence, EvidenceVersion, LegalHold |
| Judicial Cases | Referral, case linkage, access, information requests, hearings, decisions, appeals, closure | CourtReferral, CourtCase, CourtInformationRequest, Hearing, JudicialDecision, Appeal |
| Judicial Execution | Structured bank instruction, acknowledgement, action, execution evidence | JudicialInstruction, BankAcknowledgement, ExecutionStatus |
| Bank Integrations | Per-bank adapters, credentials references, mappings, capability negotiation | Bank, BankBranch, BankAdapterConfig |
| Court Integrations | Per-institution API/webhook adapters, mTLS/signature verification, mappings | CourtInstitution, CourtAdapterConfig |
| External Integrations | KYC, signature, notification, procurement, and future payment adapters | ProviderConfig, IntegrationTransaction |
| Reconciliation | EDGN-to-bank comparison, mismatch detection, resolution | ReconciliationRun, ReconciliationItem |
| Exceptions and Idempotency | Operation keys, retry policy, dead-letter handling, manual resolution | IdempotencyRecord, ExceptionCase |
| Notifications | Event templates, locale/channel selection, delivery, retry, preferences | Notification, NotificationDelivery |
| SLA and Expiry | Business timers, working calendars, warnings, breaches, expiry transitions | SLA, SLATimer, ExpirySchedule |
| Fees and Commissions | Configured fee calculation and separation of bank/platform/tax amounts | FeeRule, FeeTransaction |
| Fraud and Risk | Configurable deterministic rules, alerts, cases, analyst disposition | FraudRule, FraudAlert |
| Audit and Non-repudiation | Append-only business/security audit, before/after references, exports | AuditLog |
| Reporting | Operational, regulatory-ready, bank, court, management, and audit projections | ReportDefinition, ExportJob |
| Administration | Safe configuration, feature flags, reference data, dual approval | SystemParameter, ConfigurationChange |

### 8.1 Internal module rules

- Modules communicate through explicit application services and domain events, not direct cross-module table writes.
- The database transaction includes the domain change, audit reference, and outbox event.
- Asynchronous consumers are idempotent and record their processing result.
- All external calls are wrapped as IntegrationTransaction records with correlation IDs, attempts, sanitized request/response metadata, and final state.
- Credentials and private keys remain in the secrets/key service.
- Large report/export and document-generation work runs asynchronously.
- The audit module receives authoritative events but cannot be used to mutate domain state.

---

## 9. Data architecture

### 9.1 Core relational model

| Aggregate | Principal tables |
|---|---|
| Tenant and access | organizations, organization_relationships, users, memberships, roles, permissions, role_permissions, user_role_assignments, sessions, api_clients |
| Identity/KYC | applicant_profiles, beneficiary_profiles, authorized_representatives, kyc_profiles, verification_transactions |
| Bank/court | banks, bank_branches, bank_adapter_configs, court_institutions, court_adapter_configs, institution_users |
| Commercial references | contracts, tenders, procurement_references |
| Configuration | guarantee_types, guarantee_templates, guarantee_template_versions, guarantee_rules, rule_versions, approval_matrices, fee_rules, sla_rules |
| Applications | guarantee_applications, application_documents, application_reviews, information_requests, approval_tasks, approval_decisions |
| Guarantees | guarantees, guarantee_versions, guarantee_relationships, guarantee_status_history, generated_documents, digital_signatures, qr_codes |
| Collateral | collaterals, collateral_reservations, collateral_events |
| Lifecycle | guarantee_extensions, guarantee_amendments, additional_guarantee_requests, exposure_snapshots |
| Claims/payment/release | claims, claim_documents, claim_decisions, settlements, payment_transactions, release_requests, release_decisions |
| Disputes | disputes, dispute_parties, dispute_actions, dispute_messages, dispute_evidence, evidence_versions, legal_holds |
| Judicial | court_referrals, court_cases, court_case_assignments, court_information_requests, court_information_responses, hearings, judicial_decisions, appeals, judicial_instructions, bank_acknowledgements, execution_events |
| Operations | notifications, notification_deliveries, integration_transactions, webhook_subscriptions, webhook_deliveries, reconciliation_runs, reconciliation_items, exception_cases, idempotency_records |
| Risk/audit | fraud_rules, fraud_alerts, audit_logs, verification_events, document_access_logs |
| Platform | outbox_events, inbox_events, scheduled_jobs, configuration_changes, export_jobs |

### 9.2 Standard columns

Most business tables include:

- id as UUID
- tenant_id or owning organization scope
- public/reference number where users need one
- status and status_reason
- version for optimistic concurrency
- created_at, created_by, updated_at, updated_by
- source_system and external_reference when integrated
- correlation_id and causation_id for traceability

Immutable and append-only tables omit ordinary update behavior. Personally identifiable data is classified at column/field level and minimized in projections.

### 9.3 Key constraints

- Guarantee ID and bank guarantee number uniqueness follow the agreed bank/tenant namespace; a Guarantee ID is globally unique and never reused.
- GuaranteeVersion has unique guarantee_id plus version_number.
- Additional guarantees cannot point to themselves and must share an authorized contract or explicit relationship.
- Money fields are non-negative decimal with currency.
- Effective/expiry and version effective dates have database check constraints where possible.
- One active idempotency result exists for operation scope plus key.
- External event IDs are unique per source to suppress webhook duplicates.
- A court case number is unique within its court institution.
- Judicial decision number is unique within the court/case policy.
- Evidence versions are append-only; hashes and object version references cannot be changed.
- Critical records use soft lifecycle closure, not ordinary physical deletion.
- Legal hold overrides scheduled archive/deletion.
- Cross-tenant foreign keys and queries are blocked by service rules and, where practical, PostgreSQL row-level security as defense in depth.

### 9.4 Document and evidence storage

- PostgreSQL stores metadata, relationships, access policy, object key/version, hash, and signature result.
- Encrypted object storage stores content with versioning and lifecycle policy.
- Upload enters quarantine, is size/type checked and malware scanned, then promoted.
- Hash is calculated from the preserved bytes; rendered previews do not replace the original.
- Download uses short-lived authorized URLs or streamed access, never a public bucket.
- Every court evidence view/download is logged.
- Evidence-package export contains a manifest with IDs, versions, hashes, source, timestamps, signature state, and included files.
- Legal hold prevents storage lifecycle deletion as well as application deletion.

An authorized judicial evidence package can include:

- Original guarantee, every version, amendments, extensions, additional guarantees, and status history
- Application, applicant documents, and applicant submissions
- Beneficiary claim, extension/release requests, documents, and submissions
- Bank responses, approvals, authorized collateral/reserve references, issuance, claim decisions, and release decisions
- Digital signatures, QR verification records, timestamps, document hashes, audit logs, communications, payment records, and API/integration transactions

The package builder must apply the case disclosure policy item by item. Being present in EDGN does not automatically authorize inclusion.

### 9.5 Audit model

Audit records are append-only and contain at minimum:

- Event ID
- actor user/system and role
- tenant/institution
- action and object type/ID
- case and court case number when applicable
- timestamp
- permitted IP/device/session metadata
- previous and new status or references to protected before/after snapshots
- related document/evidence
- transaction/correlation ID
- result and failure reason

Privileged audit access and export are themselves audited. Use cryptographic integrity controls and storage protection appropriate to the approved compliance design.

### 9.6 Data ownership and portability

The signed agreement must identify ownership/controller rights for applicant data, beneficiary data, guarantee records, documents, audit logs, configuration, API records, and analytics. EDGN must support authorized, scoped export in documented non-proprietary formats together with file manifests and hashes.

Database schema, mappings, APIs, deployment/infrastructure code, and configuration are documented so no critical business capability depends on undocumented vendor behavior. Export does not bypass retention, legal hold, confidentiality, bank ownership, or court disclosure restrictions.

---

## 10. API design

### 10.1 Conventions

- Base path: /api/v1
- REST/JSON with OpenAPI 3.1
- OIDC bearer tokens for users/services as appropriate; mTLS for approved institutional links
- Authorization by scopes plus server-side resource and workflow policy
- Idempotency-Key required on critical POST commands
- X-Correlation-ID accepted/generated and returned
- ETag or expected version on concurrency-sensitive updates
- Cursor pagination for large collections
- ISO 8601 times, decimal money serialized as strings, ISO currency
- Standard problem response containing type, title, status, code, detail safe for the caller, field errors, correlation ID, and retryability
- No secrets or sensitive raw provider payloads in API errors/logs
- API version deprecation communicated through documentation and headers

### 10.2 Authentication and organization APIs

    POST   /auth/register
    POST   /auth/login
    POST   /auth/otp/verify
    POST   /auth/refresh
    POST   /auth/logout
    POST   /auth/recovery
    GET    /me
    GET    /organizations/{id}
    PATCH  /organizations/{id}
    POST   /organizations/{id}/representatives
    POST   /organizations/{id}/kyc-submissions
    GET    /organizations/{id}/kyc-status

### 10.3 Guarantee APIs

    POST   /guarantee-applications
    GET    /guarantee-applications
    GET    /guarantee-applications/{id}
    PATCH  /guarantee-applications/{id}
    POST   /guarantee-applications/{id}/documents
    POST   /guarantee-applications/{id}/submit
    POST   /guarantee-applications/{id}/information-requests
    POST   /information-requests/{id}/responses
    POST   /guarantee-applications/{id}/reviews
    POST   /guarantee-applications/{id}/approval-decisions
    POST   /guarantee-applications/{id}/collateral-requests
    POST   /guarantee-applications/{id}/issue

    GET    /guarantees
    GET    /guarantees/{id}
    GET    /guarantees/{id}/versions
    GET    /guarantees/{id}/related
    GET    /guarantees/{id}/timeline
    GET    /guarantees/{id}/documents/{documentId}
    GET    /verify/{verificationReference}

Approve, reject, return, issue, sign, release, and similar actions are commands, not generic status PATCH operations.

### 10.4 Lifecycle APIs

    POST   /guarantees/{id}/extensions
    GET    /guarantees/{id}/extensions
    GET    /extensions/{id}
    POST   /extensions/{id}/approve
    POST   /extensions/{id}/reject
    POST   /extensions/{id}/return

    POST   /guarantees/{id}/amendments
    GET    /guarantees/{id}/amendments
    GET    /amendments/{id}
    POST   /amendments/{id}/approve
    POST   /amendments/{id}/reject

    POST   /guarantees/{id}/additional-guarantees
    GET    /contracts/{id}/guarantees
    GET    /contracts/{id}/exposure

    POST   /guarantees/{id}/claims
    GET    /claims/{id}
    POST   /claims/{id}/documents
    POST   /claims/{id}/information-requests
    POST   /claims/{id}/approve
    POST   /claims/{id}/reject
    POST   /claims/{id}/settlements

    POST   /guarantees/{id}/release-requests
    GET    /release-requests/{id}
    POST   /release-requests/{id}/approve
    POST   /release-requests/{id}/reject
    POST   /release-requests/{id}/collateral-release-confirmation

### 10.5 Dispute and evidence APIs

    POST   /disputes
    GET    /disputes
    GET    /disputes/{id}
    POST   /disputes/{id}/responses
    POST   /disputes/{id}/evidence
    GET    /disputes/{id}/evidence
    POST   /disputes/{id}/messages
    GET    /disputes/{id}/messages
    POST   /disputes/{id}/resolve
    POST   /disputes/{id}/escalate
    POST   /disputes/{id}/legal-holds
    GET    /evidence/{id}/integrity
    POST   /evidence/{id}/access-grants

### 10.6 Judicial APIs

The final names and payloads require court approval. The product-facing baseline is:

    POST   /judicial/cases/referrals
    GET    /judicial/cases/{caseId}
    POST   /judicial/cases/{caseId}/acceptance
    POST   /judicial/cases/{caseId}/evidence
    GET    /judicial/cases/{caseId}/evidence
    POST   /judicial/cases/{caseId}/information-requests
    POST   /judicial/information-requests/{id}/responses
    POST   /judicial/cases/{caseId}/hearings
    POST   /judicial/cases/{caseId}/decisions
    GET    /judicial/cases/{caseId}/decisions
    POST   /judicial/cases/{caseId}/status
    POST   /judicial/cases/{caseId}/appeals
    POST   /judicial/cases/{caseId}/bank-instructions
    POST   /judicial/bank-instructions/{id}/acknowledgements
    POST   /judicial/bank-instructions/{id}/execution-events

Inbound court decisions use a dedicated institutional client, mTLS where required, signed requests/documents, strict replay protection, source event ID, and idempotency. Interactive court portal endpoints use the same domain services but separate user authentication and case-scoped permissions.

### 10.7 Administration and operations APIs

    GET/POST/PATCH  /admin/guarantee-types
    GET/POST/PATCH  /admin/templates
    POST            /admin/templates/{id}/publish
    GET/POST/PATCH  /admin/rules
    GET/POST/PATCH  /admin/approval-matrices
    GET/POST/PATCH  /admin/sla-rules
    GET/POST/PATCH  /admin/fee-rules
    GET/POST/PATCH  /admin/fraud-rules
    GET/POST/PATCH  /admin/banks
    GET/POST/PATCH  /admin/court-institutions
    GET              /admin/integration-transactions
    POST             /admin/integration-transactions/{id}/retry
    GET              /admin/exceptions
    POST             /admin/exceptions/{id}/resolve
    GET              /admin/reconciliations
    POST             /admin/reconciliations/{id}/resolve
    GET              /admin/audit-logs
    POST             /admin/reports

All manual retry, resolve, publish, permission, institution, and security configuration actions require specific privileged permissions and full auditing.

---

## 11. Events, jobs, and integrations

### 11.1 Domain and webhook events

Minimum guarantee events:

- guarantee.created
- guarantee.submitted
- guarantee.approved
- guarantee.rejected
- guarantee.issued
- guarantee.amended
- guarantee.extended
- guarantee.expired
- guarantee.released
- claim.created
- claim.approved
- claim.rejected
- claim.paid
- dispute.created
- dispute.updated
- dispute.resolved

Minimum judicial events:

- court.case.created
- court.case.accepted
- court.information.requested
- court.hearing.updated
- court.order.issued
- court.decision.issued
- court.decision.updated
- court.appeal.registered
- court.case.closed

Add internal events for document scan completion, signature completion/failure, collateral updates, settlement, legal hold, reconciliation mismatch, exception, SLA warning/breach, notification delivery, and fraud alerts.

Every event envelope includes event ID, type, version, occurred time, tenant/source, subject ID, correlation/causation IDs, and a minimal authorized payload. Event schemas are versioned.

Notification channels are SMS, email, push, in-app, and webhook as enabled per audience and institution. Required trigger coverage includes application submitted/approved/rejected/more-information-required; guarantee issued/expiring; extension requested/approved; additional guarantee requested; claim submitted/decided; release requested/completed; and dispute opened/updated/resolved. Delivery preferences never suppress a legally or operationally mandatory notice; those rules are configured separately.

### 11.2 Reliable delivery

- Transactional outbox publishes events only after the business transaction commits.
- Consumer inbox/deduplication prevents duplicate processing.
- Webhook delivery is signed, timestamped, retried with exponential backoff and jitter, and moved to a visible dead-letter/exception state after the retry limit.
- Receivers can replay only through authorized, audited action.
- A 2xx response plus valid institutional acknowledgement defines success when the contract requires it; a local send attempt does not.
- Critical workflows never silently mark an external operation successful.

### 11.3 Scheduled jobs

- Expiry alerts at configurable 30, 15, 7, 3, and 1 day thresholds
- Effective-date activation and expiry transitions
- SLA warnings, breaches, and escalations
- Notification retry
- Webhook retry and certificate-expiry alerts
- KYC/business-license re-verification reminders
- Reconciliation imports/comparisons
- Evidence/document retention evaluation, always respecting legal hold
- Stale draft and abandoned-signature handling under approved rules
- Daily exposure snapshots or event-triggered recalculation
- Backup verification and operational health checks

All scheduled commands are idempotent, lease/lock protected, observable, and safe to rerun.

### 11.4 Bank adapter contract

Each bank adapter exposes only supported capabilities:

- customer/account verification
- eligibility/credit-decision reference
- guarantee application/status
- collateral reserve/release
- issuance/reference
- signature where bank-hosted
- claim decision and payment confirmation
- release
- reconciliation

Adapter configuration isolates credentials, endpoints, certificates, mappings, timeouts, retry rules, error mapping, and webhooks by bank and environment. Unsupported capability must be explicit and routed to an approved controlled manual process, never simulated as an API success.

### 11.5 Court adapter contract

- Referral and evidence manifest transfer
- Court case acceptance and number linkage
- Information requests and responses
- Hearing/status notifications
- Order/decision receipt
- Appeal updates
- Bank instruction or EDGN status consequences explicitly authorized
- Closure

The adapter is enabled only for an approved court, agreement, environment, certificate, and data scope. Case-based authorization applies even to authenticated court clients.

### 11.6 Reconciliation

Reconciliation compares EDGN and bank records for:

- Guarantee identity, number, amount, currency, dates, version, and status
- Collateral/reserve references and status
- Claim decision and amount
- Payment/settlement reference, amount, currency, and date
- Release and collateral release
- Fees where included

A mismatch creates a ReconciliationItem and ExceptionCase with owner, severity, evidence, resolution, and audit trail. Resolution never rewrites signed historical versions.

---

## 12. Security, privacy, and non-repudiation

### 12.1 Identity and authorization

- OIDC/OAuth 2.0 with short-lived access tokens and secure refresh/session handling
- MFA for all bank, EDGN admin, court, auditor, and privileged users; risk-based MFA for other sensitive actions
- Step-up authentication for issuance, signing, high-value approval, court decision, privileged configuration, and sensitive export
- Deny-by-default RBAC plus organization, branch, case, assignment, and state-based policy
- Periodic access review and immediate revocation
- Service clients have narrow scopes, environment binding, rotation, rate limits, and network/certificate restrictions
- Court Portal has a separate client/security boundary and no shared broad admin role

### 12.2 Segregation of duties

Enforce configurable maker/checker/signatory separation. For judicial work, no single user should be able to create the referral/case, alter critical evidence, approve a decision, and apply its operational consequence without the competent institution's approved separation.

The system prevents conflicting action based on actor history, not merely current role name. Emergency access is time-limited, approved, and separately audited.

### 12.3 Encryption and keys

- TLS 1.2 or newer, with current approved cipher policy
- mTLS for bank/court links where required
- Encryption at rest for database, storage, backups, and relevant queues
- Field-level protection/tokenization for selected sensitive identifiers after threat/data review
- Managed key lifecycle, separation of duties, rotation, revocation, and access logging
- Private signing keys never enter application code, logs, or ordinary database columns
- Secrets are references to Vault/equivalent and never committed to source

### 12.4 File and evidence safety

- Allow-listed types and size limits
- MIME/content inspection, malware scan, decompression-bomb protection, and quarantine
- Random object keys; original filenames treated as untrusted display data
- Active content disabled/sanitized for preview
- Hashing, versioning, access control, short-lived downloads, and download/view logging
- Signed guarantees and judicial decisions displayed with verification state and source
- Legal hold applies to metadata, original bytes, versions, audit, and evidence-package manifests

### 12.5 Judicial decision trust

Decision verification policy is institution-specific and may combine:

- mTLS client identity
- OAuth client and scope
- request/webhook signature with timestamp and replay window
- judicial document digital signature and certificate chain
- document hash
- court transaction/reference lookup
- case/decision number and authority mapping

Failed or indeterminate verification creates a security/integration exception. It never updates the dispute, guarantee, claim, release, or bank instruction as if authenticated.

### 12.6 Privacy and minimum disclosure

- Define controller/processor roles and lawful/data-sharing basis before production.
- Collect only fields necessary for the workflow.
- Mask and partition applicant, beneficiary, bank, and court data by purpose.
- Court access is case-based, least privilege, and optionally time-limited.
- Do not disclose unrelated customers, guarantees, internal bank notes, security configuration, credentials, or non-authorized evidence.
- Public QR verification uses a dedicated safe projection and opaque, non-sequential reference.
- Data export requires authorization, scope validation, watermarking where appropriate, and audit.
- Retention and deletion behavior is policy-driven, with no ordinary hard deletion of critical guarantee/financial records.

### 12.7 Application and infrastructure controls

- WAF/API gateway, schema validation, rate limiting, bot/abuse controls
- CSRF protection where cookie sessions are used; strict CORS and security headers
- Parameterized database access and output encoding
- SSRF controls around webhooks and external URLs
- Dependency, secret, container, infrastructure, and source scanning in CI
- Threat modeling and secure design review for issuance, signature, verification, evidence, court, and admin flows
- Central security monitoring for authentication, authorization, abnormal API, suspicious QR, repeated verification, data export, configuration, and integration failures
- Independent penetration test before production and remediation of release-blocking findings

Legal and regulatory compliance must be confirmed by qualified Ethiopian legal, banking, privacy, and judicial stakeholders. The PDFs describe readiness requirements but do not themselves establish legal authorization.

---

## 13. Non-functional requirements

| Area | Acceptance target |
|---|---|
| Availability | 99.9% monthly, excluding agreed maintenance and formally defined exceptional events |
| Standard API response | 95th percentile at or below 2 seconds under the agreed load profile, excluding long external/provider operations |
| Standard dashboard | 95th percentile at or below 3 seconds under the agreed data/load profile |
| Public QR verification | 95th percentile at or below 2 seconds under agreed load |
| Recovery Point Objective | 15 minutes or less, subject to final infrastructure approval |
| Recovery Time Objective | 1 hour or less, subject to final infrastructure approval |
| Accessibility | WCAG 2.2 AA target for supported web flows |
| Localization | English and Amharic ready; no hard-coded UI messages |
| Currency | ETB enabled initially; ISO currency and decimal architecture |
| Audit | Critical lifecycle, permission, evidence, judicial, integration, and configuration events captured |
| Data integrity | Unique IDs, referential integrity, transactions, optimistic concurrency, versioning, controlled deletion |
| Scalability | Load profile and capacity numbers fixed in G0; horizontal web/worker scaling and indexed/paginated queries |

Performance contracts must name dataset size, concurrency, request mix, external-service simulation, percentile, test environment, and excluded operations. Average response time alone is not an acceptance measure.

---

## 14. Environments, delivery, and operations

### 14.1 Environments

Minimum isolated environments:

1. Local development
2. Shared development
3. Automated test/integration
4. Staging/UAT
5. Production
6. Disaster-recovery environment or approved recoverable capacity

External provider credentials, databases, storage, domains, and encryption keys are environment-specific. Production data is not copied to lower environments without an approved masking process.

### 14.2 Repository structure

Recommended monorepo:

    apps/
      web/
      api/
      worker/
    packages/
      ui/
      api-client/
      contracts/
      config/
      testing/
    infrastructure/
      environments/
      modules/
    docs/
      architecture/
      api/
      operations/
      security/
      user-guides/

Keep domain modules inside the API/worker applications with explicit boundaries. Database migrations are forward-reviewed, repeatably tested, and shipped with rollback/roll-forward instructions.

### 14.3 CI/CD quality gates

- Formatting, lint, type-check, unit tests
- API/schema compatibility checks
- Database migration test on a production-like snapshot shape
- Integration and contract tests
- Software composition, secret, static security, container, and infrastructure scan
- Build signed immutable artifacts and software bill of materials
- Deploy automatically to development/test; approval gates for UAT/production
- Post-deploy smoke test and observable rollback
- Production changes linked to a release, approver, migration, and audit record

### 14.4 Monitoring and alerting

Dashboards and alerts cover:

- Availability, latency, errors, saturation
- Authentication/authorization failures
- Database connections, slow queries, replication/backup
- Queue backlog, failed jobs, dead letters
- Bank, court, KYC, signature, procurement, SMS, and email health
- Webhook success/retry/exhaustion
- Signature and QR verification failures
- Reconciliation mismatches
- SLA breaches and expiry job health
- Suspicious activity and privileged changes

Logs use correlation IDs and structured fields with sensitive-data redaction. Metrics must not contain personal or secret values.

### 14.5 Backup and disaster recovery

- Automated encrypted PostgreSQL point-in-time recovery
- Versioned/replicated object storage according to approved architecture
- Configuration, secrets-recovery process, and infrastructure code included in continuity planning
- Backup success monitored; restore tested regularly
- At least one full DR exercise before production acceptance
- Runbooks name incident commander, recovery sequence, verification, communication, and return-to-primary process

---

## 15. Test and acceptance strategy

### 15.1 Automated test pyramid

- Unit tests for rules, amounts, dates, permissions, transitions, exposure, and decision mapping
- Property/boundary tests for money, time, idempotency, and version sequences
- API tests for validation, authorization, errors, pagination, concurrency, and idempotency
- Database tests for constraints, migrations, tenant isolation, legal hold, and append-only behavior
- Contract tests for every bank/court/provider adapter
- Integration tests using realistic sandbox/stub behavior, timeouts, retries, duplicates, and malformed callbacks
- UI component/accessibility tests and portal end-to-end tests by role
- Security tests for privilege escalation, IDOR/cross-tenant access, upload abuse, replay, webhook forgery, and public-verification disclosure
- Load, soak, failover, backup/restore, and DR tests

### 15.2 Mandatory master-SRS UAT scenarios

1. New bid guarantee
2. Performance guarantee
3. Beneficiary extension
4. Additional performance guarantee
5. Guarantee amendment
6. QR verification
7. Claim
8. Claim rejection
9. Guarantee release
10. Dispute
11. Dispute evidence
12. Dispute escalation
13. Settlement
14. Expiry notification
15. Bank API failure
16. Reconciliation mismatch

### 15.3 Mandatory court acceptance criteria

1. AC-001: Secure authorized dispute referral to the judicial system
2. AC-002: EDGN Dispute ID linked to Court Case Number
3. AC-003: Authorized court users access only permitted case information
4. AC-004: Secure evidence transfer
5. AC-005: Evidence integrity verification
6. AC-006: Court information request and response
7. AC-007: Authenticated judicial decision receipt
8. AC-008: Invalid/unauthenticated decision rejected and logged
9. AC-009: Authenticated decision updates only the relevant authorized EDGN state
10. AC-010: Authorized bank instruction securely transmitted
11. AC-011: Bank acknowledgement recorded
12. AC-012: Appeal status recorded when supplied
13. AC-013: Legal hold prevents unauthorized deletion
14. AC-014: Every judicial integration event auditable
15. AC-015: Unauthorized users blocked from judicial cases

### 15.4 Critical full end-to-end acceptance

The final demonstration must cover:

    Performance guarantee request
      -> applicant verification
      -> bank selection, maker/checker review
      -> collateral/reserve
      -> approval and digital signature
      -> issuance and public-safe QR verification
      -> beneficiary extension request
      -> approval and Version 2
      -> additional performance guarantee
      -> new Guarantee ID and updated exposure
      -> beneficiary claim
      -> disputed claim
      -> evidence from applicant, beneficiary, and bank
      -> unresolved internal process
      -> authorized court referral and case number
      -> evidence package/integrity validation
      -> court information request and response
      -> authenticated judicial decision
      -> permitted EDGN status consequence
      -> authorized bank instruction and acknowledgement
      -> settlement or release as applicable
      -> appeal/finality information when supplied
      -> legal-hold/retention handling
      -> closure with complete audit trail

### 15.5 Release defect policy

Production is blocked by:

- Any unauthorized cross-tenant, bank, court, case, or role access
- Any ability to modify signed versions/evidence/audit history improperly
- Duplicate guarantee, claim, settlement, or decision application caused by retry
- Application of an unauthenticated judicial decision
- Incorrect money/exposure calculation with material business effect
- Loss of audit, evidence, signature, or legal-hold integrity
- Unresolved critical/high security finding
- Failure of the agreed RPO/RTO rehearsal

Lower-severity defects require documented owner, workaround, risk acceptance, and target release.

---

## 16. Implementation backlog and module order

| Epic | Scope | Primary gate |
|---|---|---|
| E01 | Repository, architecture, environments, CI/CD, observability baseline | G1 |
| E02 | Identity, MFA, RBAC/ABAC, organizations, users, sessions | G1 |
| E03 | Applicant/beneficiary onboarding and KYC/KYB | G2 |
| E04 | Guarantee types, templates, rules, approval matrix, document requirements | G1-G2 |
| E05 | New guarantee wizard, documents, bank selection, submission | G2 |
| E06 | Bank maker/checker/signatory queues, information requests, decisions | G2 |
| E07 | Collateral/reserve adapter and workflow | G2 |
| E08 | Document generation, signature adapter, immutable Version 1, QR | G2 |
| E09 | Registry, public verification, search, timeline, notifications, audit | G2 |
| E10 | Extension and amendment with versioning/re-signing | G3 |
| E11 | Additional guarantee, relationships, and contract exposure | G3 |
| E12 | Claims, settlement, release, and collateral release | G3 |
| E13 | SLA, expiry, fees, reconciliation, exceptions, idempotency | G3 |
| E14 | Disputes, case room, evidence, internal resolution, legal hold | G4 |
| E15 | Fraud/risk rules and investigation | G4 |
| E16 | Court institution, roles, portal, referral, and case linkage | G5 |
| E17 | Court information requests, hearings, evidence access | G5 |
| E18 | Judicial decision trust, appeals, bank instruction/execution | G5 |
| E19 | API developer portal, webhooks, second-bank adapter validation | G3-G5 |
| E20 | Reports, audit export, admin configuration, localization | G2-G6 |
| E21 | Security, performance, accessibility, DR, manuals, training, cutover | Every gate; final G6-G7 |

Every epic is vertically sliced: UI, API, domain logic, database, authorization, audit, validation, errors, tests, telemetry, and documentation ship together.

### 16.1 Product roadmap alignment

- Phase 1, Core MVP: applicant, beneficiary, bank, new request/review/issuance, QR, basic audit, and notifications.
- Phase 2, Advanced Lifecycle: extensions, amendments, additional guarantees, claims, release, settlement, and exposure.
- Phase 3, Ecosystem: multiple banks, approved e-procurement/KYC/payment integrations, developer portal, and webhooks.
- Phase 4, Intelligence: advanced fraud/risk analytics, operational analytics, SLA intelligence, and optimization.

The contract schedule brings basic configurable fraud rules and the supplemental court module into the initial full program. Advanced predictive intelligence remains later-roadmap scope unless added through change control.

---

## 17. Reports and dashboards

### 17.1 Applicant and beneficiary

- Requests by status and age
- Active/expiring guarantees
- Pending information/actions
- Extensions, amendments, claims, releases, and disputes
- Authorized documents and timeline

### 17.2 Bank

- Work queue by maker/checker/signatory, branch, product, amount, and SLA
- Issued/active/expiring/released guarantees
- Collateral/reserve status
- Contract/customer exposure where authorized
- Claims, decisions, settlement, and release
- Reconciliation mismatch and integration exception
- Processing time and SLA breach

### 17.3 EDGN administration

- Organizations, banks, guarantee volumes and value by safe aggregate
- Application funnel and turnaround
- Registry status and expiry
- Integration/webhook/provider health
- Exceptions, retries, reconciliation, fraud alerts
- Notification delivery
- Audit and privileged activity
- Data export and legal-hold inventory

### 17.4 Court

- Total, new, active, pending-information, decision-issued, closed, and appealed cases
- Case parties, guarantee, contract, claim, evidence, communications, orders, decisions, and timeline
- Integration delivery/authentication failures
- Outstanding bank acknowledgements/execution

Report queries are permission- and tenant-scoped. Sensitive exports run asynchronously, expire, and are audited.

---

## 18. Team, governance, and responsibility

### 18.1 Delivery roles

| Role | Expected responsibility |
|---|---|
| Executive sponsor | Funding, authority, institutional escalation, final business sign-off |
| Product owner | Scope priority, decisions, acceptance, change control |
| Banking domain lead | Guarantee rules, templates, approval, collateral, claims, settlement |
| Judicial/legal lead | Court authority boundary, process, decision types, data sharing, retention |
| Delivery manager/business analyst | Plan, risks, workshops, traceability, UAT coordination |
| Solution architect/security lead | Architecture, threat model, integration/security approval |
| UX lead | Research, journey/form prototypes, design system, accessibility |
| Engineering leads/team | Frontend, backend, workers, adapters, data, quality |
| QA lead/team | Test strategy, automation, integration, performance, UAT evidence |
| DevOps/SRE | Environments, CI/CD, monitoring, backup, DR, operations |
| Bank/court/provider owners | API, sandbox, test data, certificates, technical acceptance |

### 18.2 Business responsibility matrix

R = responsible, C = consulted, I = informed.

| Activity | EDGN | Bank | Applicant | Beneficiary | Court |
|---|---:|---:|---:|---:|---:|
| Platform operation | R | C | I | I | I |
| KYC/KYB data and decision | C | R | R | R | I |
| Credit decision | I | R | I | I | I |
| Guarantee approval/issuance | C/I | R | I | I | I |
| Digital workflow and registry | R | C | C | C | I |
| QR verification | R | C | C | C | I |
| Claim submission | C | C | I | R | I |
| Claim decision and bank payment | I | R | I | C | I |
| Release request | C | C | C | R | I |
| Internal dispute management | R | C | C | C | I |
| Judicial determination | I | C | C | C | R |
| Audit trail | R | C | I | I | C |

Final contractual allocation must be signed by the relevant institutions.

### 18.3 Governance cadence

- Daily engineering coordination
- Weekly product demonstration and backlog decision
- Weekly integration clinic with active bank/provider/court owners
- Fortnightly risk, security, and architecture review
- Monthly steering committee for scope, dependency, budget, and milestone status
- Formal gate review and sign-off at G0-G7
- Decision log with owner, deadline, outcome, and affected requirements

---

## 19. How to start: first ten business days

### Day 1

- Name the executive sponsor, product owner, banking lead, judicial/legal lead, technical lead, and sign-off authorities.
- Approve these two PDFs plus this implementation plan as the initial baseline.
- Confirm that the Court Portal document supplements the master SRS; it does not replace the master SRS section also numbered 32.
- Open the decision, risk, assumption, dependency, and change logs.

### Days 2-3

- Run lifecycle workshops for new guarantee, extension, amendment, additional guarantee, claim, settlement, release, dispute, and court referral.
- Confirm exact actors, maker/checker/signatory rules, branches, approval limits, guarantee types, documents, templates, and bank responsibilities.
- Convert each workshop into a signed BPMN/process map and example record.

### Days 4-5

- Run data/security/legal workshops: tenant model, data owner/controller, hosting/residency, KYC, signatures, evidence admissibility/integrity, retention/legal hold, public QR fields, and judicial authority.
- Send formal integration questionnaires to the reference bank, KYC/signature/notification providers, procurement owner, and court.
- Request sandbox endpoints, OpenAPI/WSDL/specifications, certificates, IP rules, sample payloads, error codes, rate limits, test users, and support contacts.

### Days 6-7

- Prototype and review the Applicant New Guarantee, Bank Review, Guarantee Detail/QR, Claim, Dispute, and Court Case/Decision flows.
- Approve the shared field dictionary and form catalogue.
- Define the load model, RPO/RTO, availability, severity policy, and supported browser/device matrix.

### Days 8-10

- Create the repository and CODEOWNERS/branch rules.
- Scaffold web, API, worker, shared contracts/UI, infrastructure, and documentation.
- Bring up development/test PostgreSQL, Redis, object storage, OIDC, secrets, monitoring, and CI.
- Implement the first walking skeleton:

      authenticated user
        -> organization-scoped API
        -> create draft guarantee application
        -> save database transaction
        -> append audit event
        -> publish outbox event
        -> display it in the applicant dashboard

- Demonstrate tenant isolation, permission denial, validation error, idempotent retry, audit, and telemetry in the same skeleton.

### G0 exit checklist, 18 September 2026

- Scope and exclusions signed
- All authority boundaries signed
- Forms/fields and workflow maps approved
- Reference bank and court owners named
- Integration inventory and due dates accepted
- Architecture, hosting, privacy, retention, language, and currency decisions recorded
- Milestones, acceptance, dependency relief, and change-control clauses in the contract
- Prioritized backlog and test/UAT strategy ready

Do not start dozens of disconnected screens before G0. Start with the walking skeleton and then deliver vertical end-to-end slices.

---

## 20. Required decisions and unresolved gaps

| Decision | Owner | Due | Default planning assumption |
|---|---|---|---|
| Legal operating entity and data-controller/processor roles | Sponsor/legal | G0 | No production personal-data processing until approved |
| Hosting country/provider and data residency | Sponsor/security/legal | G0 | Containerized, provider-neutral design |
| Tenant isolation: shared database with RLS or stronger physical isolation | Architecture/security | G0 | Shared PostgreSQL with tenant keys and RLS defense-in-depth; reassess high-risk institutions |
| Supported languages at launch | Product owner | G0 | English and Amharic |
| Enabled currencies at launch | Product/banks | G0 | ETB only |
| KYC/KYB provider and manual fallback | Product/banks | Before G1 close | Provider adapter plus controlled manual-review path |
| Digital-signature legal/provider model | Banks/legal/security | Before G2 starts | Provider abstraction; no fake/local production signature |
| QR public fields and verification privacy | Product/legal/banks | G1 | Minimum safe projection |
| Guarantee templates and bank-specific wording | Banks | G1 | Versioned per bank/type/language |
| Approval matrices and delegation | Each bank | G1 | Configurable maker/checker/signatory |
| Collateral integration vs controlled manual confirmation | Reference bank | Before G2 | Adapter preferred; audited manual fallback only if approved |
| Fee/tax rules and payment collection | Commercial/banks | Before G3 | Calculate/record only; no EDGN fund handling |
| Procurement integration institution/API | Sponsor/institution | Before G3 | Architecture only until a separate spec is approved |
| Court authority and participating institution | Sponsor/court/legal | 30 Apr 2027 | Judicial module feature-disabled without authorization |
| Court integration style: portal, API, or both | Court IT/product | Before G5 | Shared domain, both channels supported; activate approved channel |
| Judicial decision types and operational mappings | Court/legal/banks | Before G5 | No automatic mapping until signed |
| Evidence retention, appeal period, and legal-hold release | Legal/court/banks | Before G5 | Preserve; no ordinary deletion |
| Final load/capacity targets | Product/architecture | G0 | Must be quantified before performance acceptance |
| Final RPO/RTO and availability | Sponsor/operations | G0 | SRS proposed targets: 15 min, 1 hour, 99.9% |
| Native mobile application | Product | Roadmap | Excluded from first release |

### 20.1 Source-document issues to resolve

1. Numbering collision: the master SRS uses Section 32 for Legal Hold, while Court portal.pdf calls Judicial & Court Integration Module 32. Assign the court specification a unique contract ID such as JUD-01 without changing its content.
2. The documents contain no contractual deadline or budget. Section 3 is a proposed estimate, not a source requirement.
3. Exact KYC data, bank APIs, court APIs, approved digital-signature trust model, procurement interface, and payment interface are not specified.
4. Actual SLA values are configurable and absent.
5. RPO/RTO are proposed in the SRS and require infrastructure approval.
6. The public QR example shows amount, but the confidentiality rule requires institutions to approve the exact public projection.
7. The PDFs provide logical screen/form needs, not final UI designs. Prototypes and a signed field dictionary are a G0/G1 deliverable.
8. Applicable Ethiopian retention, privacy, evidence, banking, digital-signature, and court rules require qualified institutional/legal confirmation.

---

## 21. Risks and mitigations

| Risk | Probability/impact | Mitigation |
|---|---|---|
| Bank/court APIs or approvals arrive late | High/High | Contract dependency dates; adapter stubs; early sandbox contract tests; re-baseline clause |
| Scope is treated as simple forms/PDFs | High/High | Gate acceptance includes backend, data, authorization, audit, errors, tests, and integration |
| One status field corrupts lifecycle truth | Medium/High | Separate aggregate state machines and projected display status |
| Duplicate issuance/claim/payment/decision through retry | Medium/Critical | Idempotency keys, unique source events, transactional outbox/inbox, concurrency controls |
| EDGN exceeds bank/court authority | Medium/Critical | Explicit commands/permissions, no free-text automation, legal approval, decision authentication |
| Sensitive QR or court disclosure | Medium/High | Minimal projections, case access, field classification, privacy tests |
| Evidence or signed record can be overwritten | Medium/Critical | Immutable versions, object versioning, hashes, protected audit, legal hold |
| Bank-specific logic fragments the core | High/Medium | Capability-based adapters and effective-dated configuration, no bank forks |
| Translation causes late redesign | Medium/Medium | Localization from G1; Amharic test data and layout review |
| Manual fallback bypasses controls | Medium/High | Explicit fallback status, evidence, reason, second approval, reconciliation |
| Performance is judged without a load model | High/Medium | Quantified G0 workload and percentile-based tests |
| Operational handover is postponed | Medium/High | Runbooks, monitoring, restore tests, training, and production-readiness checklist are gate deliverables |

---

## 22. Definition of Ready and Definition of Done

### 22.1 Ready for implementation

A story is ready when it has:

- Business actor, purpose, source requirement, and acceptance examples
- Form fields, validation, states, permissions, audit events, and error behavior
- Data and API contract
- Integration/provider dependency or an approved fallback
- UX design for changed screens
- Security/privacy classification
- Test data and acceptance owner

### 22.2 Done

A requirement is done only when:

- Requirement and UI implemented
- Backend/domain behavior implemented
- Database/migration implemented
- API and OpenAPI implemented
- Authorization and segregation rules implemented
- Audit and telemetry implemented
- Validation, concurrency, idempotency, and error handling implemented as applicable
- Unit, integration, API, UI, role, and security tests pass
- External contract tests and UAT pass where applicable
- Accessibility/localization checked
- Documentation and runbooks updated
- Product owner accepts it in the target environment

A screen without its workflow, security, persistence, audit, error handling, and tests is not complete.

---

## 23. Required project deliverables

The development contract should require:

1. Complete source code and buildable Git repository
2. Repository ownership/access and protected release history
3. Database schema, migrations, ERD, and data dictionary
4. Versioned OpenAPI specification and API documentation
5. UI/UX designs, design system, and implemented portals
6. Architecture and architecture-decision records
7. Security architecture, threat models, and test/remediation reports
8. Bank, court, KYC, signature, notification, procurement, and other integration documentation
9. Test strategy, cases, automated suites, UAT scripts, and reports
10. Performance/load and DR test results
11. Infrastructure-as-code and environment configuration documentation
12. CI/CD pipelines and artifact/SBOM process
13. Deployment, rollback, backup, restore, DR, monitoring, and incident runbooks
14. Configuration/reference-data catalogue
15. Admin, applicant, beneficiary, bank, court, auditor, and operations manuals
16. Developer documentation and local-environment instructions
17. Third-party dependency/license inventory
18. Credential, certificate, domain, provider, repository, and account handover checklist
19. Knowledge-transfer and training sessions with recordings/materials where authorized
20. Production deployment, pilot, and agreed hypercare support

Intellectual-property ownership, third-party licenses, source/repository access, deployment scripts, infrastructure configuration, UI/UX, schemas, APIs, credentials, and knowledge transfer must be explicit in the signed commercial contract.

---

## 24. Requirements traceability

| Source requirement group | Covered here |
|---|---|
| Master SRS 1-8: vision, objectives, scope, boundaries, operating model, stakeholders | Sections 1-3 |
| Master SRS 9-12: roles, guarantee types, lifecycle, request architecture | Sections 4, 6, 7 |
| Master SRS 13-25: new request through registry/QR/signature | Sections 5-10 |
| Master SRS 26-34: claims, settlement, release, disputes, evidence, legal hold, case room, reconciliation | Sections 6-11 |
| Master SRS 35-42: exception, idempotency, fraud, fees, notifications, SLA, expiry, exposure | Sections 6-11, 17 |
| Master SRS 43-49: APIs, bank adapters, events, developer portal, procurement, identity/KYC | Sections 5, 8, 10, 11 |
| Master SRS 50-61: security, technology, data, ownership/IP, monitoring, DR, performance, currency/language | Sections 1, 9, 12-14, 20, 23 |
| Master SRS 62-66: interfaces, screens, business rules, status, exceptions | Sections 5-7, 10 |
| Master SRS 67-70: testing, UAT, end-to-end acceptance, done | Sections 15, 22 |
| Master SRS 71-74: deliverables, environments, change control, responsibility | Sections 3, 14, 18, 23 |
| Master SRS 75-83: commercial/institutional readiness, positioning, roadmap, architecture, acceptance | Sections 1-3, 16, 20, 25 |
| Court 32.1-32.7: purpose, authority, architecture, portal, roles, referral | Sections 1, 4-7 |
| Court 32.8-32.12: case, evidence, integrity/access, information requests | Sections 6-9, 12 |
| Court 32.13-32.20: decisions, authentication/application, bank communication, appeal/execution | Sections 6-12 |
| Court 32.21-32.25: APIs, webhooks, security, segregation, audit | Sections 10-12 |
| Court 32.26-32.31: legal hold, privacy, dashboard, timeline, non-repudiation, failure | Sections 5-14, 17 |
| Court 32.32-32.36: acceptance, scenario, governance, future ecosystem, completion | Sections 1, 3, 15, 20, 25 |

---

## 25. Final acceptance and production decision

The platform is ready for controlled production only after:

- Core and advanced workflows are implemented and integrated
- Bank, signature, KYC, notification, and any included external integrations pass contract tests
- Court requirements, authority, security, data sharing, integration, and users are approved before that module is enabled
- All required role and segregation tests pass
- Audit, versioning, QR, reconciliation, exceptions, legal hold, and evidence integrity are operational
- Security, performance, accessibility, backup/restore, and DR acceptance pass
- All master-SRS and court UAT scenarios applicable to the contracted release pass
- Documentation, training, source, infrastructure, credentials, and operations are handed over
- Authorized EDGN, bank, and judicial stakeholders sign their respective acceptance

If judicial authority or integration approval is not available, the rest of EDGN may be considered for a separately authorized release, but the Judicial Integration Module must remain disabled and cannot be represented as production-ready.

The delivery objective is:

    Request
      -> Review
      -> Approval
      -> Collateral
      -> Issue
      -> Sign
      -> Verify
      -> Monitor
      -> Extend / Amend / Add Guarantee
      -> Claim
      -> Dispute
      -> Authorized judicial referral when required
      -> Settle / Release
      -> Close

with secure access, immutable history, authenticated integrations, evidence integrity, complete auditability, and the bank/court authority boundaries preserved throughout.
