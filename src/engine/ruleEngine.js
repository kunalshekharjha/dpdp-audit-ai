/* ============================================
   DPDP Audit AI – Rule Engine
   ============================================
   Deterministic legal logic layer that evaluates
   questionnaire responses against DPDP Act rules.
   AI does NOT make compliance determinations.
   ============================================ */

// Finding severity levels
export const SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  UNCERTAINTY: 'uncertainty',
  AI_RISK: 'ai_risk',
  CONSISTENCY: 'consistency',
};

// Scoring constants
const DEDUCTIONS = {
  [SEVERITY.CRITICAL]: 15,
  [SEVERITY.HIGH]: 8,
  [SEVERITY.MEDIUM]: 3,
  [SEVERITY.LOW]: 1,
};

const SCORE_CAPS = {
  [SEVERITY.CRITICAL]: 59,
  [SEVERITY.HIGH]: 79,
};

const COMPLIANCE_BANDS = [
  { min: 80, max: 100, label: 'Largely Compliant', color: 'var(--color-success)' },
  { min: 60, max: 79, label: 'Partially Compliant', color: 'var(--color-medium)' },
  { min: 40, max: 59, label: 'Significant Gaps', color: 'var(--color-high)' },
  { min: 0, max: 39, label: 'Non-Compliant', color: 'var(--color-critical)' },
];

// ---- Module 1: Entity Profile ----
function evaluateEntityProfile(responses) {
  const findings = [];

  const { dataVolume, dataCategories, industrySector } = responses;

  // SDF risk indicators
  const highRiskCategories = ['health', 'financial', 'biometric', 'children'];
  const hasHighRiskData = dataCategories?.some(c => highRiskCategories.includes(c));
  const isLargeScale = dataVolume === 'above_1m' || dataVolume === 'above_10m';

  if (isLargeScale || hasHighRiskData) {
    findings.push({
      id: 'EP-001',
      module: 'Entity Profile',
      severity: SEVERITY.MEDIUM,
      title: 'Potential Significant Data Fiduciary Risk Indicator',
      description: 'Based on the volume and nature of personal data processed, your organization may exhibit characteristics that could lead to designation as a Significant Data Fiduciary under Section 10 of the DPDP Act.',
      explanation: 'Significant Data Fiduciary designation is made by the Central Government based on factors including volume of data, risk to data principal rights, and potential impact on sovereignty and public order. This is not a compliance finding but a risk indicator.',
      section: 'Section 10 – Significant Data Fiduciary',
      remediation: 'Proactively implement enhanced compliance measures including Data Protection Impact Assessments, periodic audits, and appointment of a Data Protection Officer.',
      owner: 'Legal + Compliance',
    });
  }

  if (!responses.entityRole) {
    findings.push({
      id: 'EP-002',
      module: 'Entity Profile',
      severity: SEVERITY.LOW,
      title: 'Entity Role Not Defined',
      description: 'The organization has not clearly defined whether it operates as a Data Fiduciary, Data Processor, or both.',
      explanation: 'Understanding your role under the DPDP Act is foundational. Different obligations apply to Data Fiduciaries and Data Processors.',
      section: 'Section 2 – Definitions',
      remediation: 'Conduct a data mapping exercise to determine whether the organization acts as a Data Fiduciary, Data Processor, or both in its various operations.',
      owner: 'Legal',
    });
  }

  return findings;
}

// ---- Module 2: Notice and Consent ----
function evaluateNoticeConsent(responses) {
  const findings = [];

  if (responses.consentWithdrawal === 'no') {
    findings.push({
      id: 'NC-001',
      module: 'Notice & Consent',
      severity: SEVERITY.CRITICAL,
      title: 'Consent Withdrawal Mechanism Absent',
      description: 'The organization does not provide a mechanism for data principals to withdraw consent.',
      explanation: 'Section 6(4) of the DPDP Act mandates that consent withdrawal must be as easy as giving consent. The absence of such a mechanism constitutes a clear statutory violation.',
      section: 'Section 6(4) – Withdrawal of Consent',
      remediation: 'Implement a clear, accessible, and easy-to-use consent withdrawal mechanism. Ensure withdrawal is as easy as giving consent.',
      owner: 'Legal + Product',
    });
  }

  if (responses.bundledConsent === 'yes') {
    findings.push({
      id: 'NC-002',
      module: 'Notice & Consent',
      severity: SEVERITY.CRITICAL,
      title: 'Service Access Conditioned on Unrelated Consent',
      description: 'Access to services is conditioned upon consent for purposes not necessary for the service.',
      explanation: 'Section 6(3) prohibits bundling consent for additional purposes as a condition for accessing a service. Each purpose must have independent, granular consent.',
      section: 'Section 6(3) – Conditions for Valid Consent',
      remediation: 'Unbundle consent requests. Provide granular, purpose-specific consent options. Do not condition service access on consent for unrelated processing.',
      owner: 'Legal + Product',
    });
  }

  if (responses.noticeTiming === 'after' || responses.noticeTiming === 'none') {
    findings.push({
      id: 'NC-003',
      module: 'Notice & Consent',
      severity: SEVERITY.HIGH,
      title: 'Notice Timing Non-Compliant',
      description: responses.noticeTiming === 'none'
        ? 'No notice is provided to data principals.'
        : 'Notice is provided after data collection rather than at or before the time of collection.',
      explanation: 'Section 5 requires that notice be given at the time of or before requesting consent. Notice must contain an itemized description of personal data and purpose of processing.',
      section: 'Section 5 – Notice',
      remediation: 'Ensure notice is provided at or before the time of data collection, clearly describing the personal data being collected and the purpose of processing.',
      owner: 'Legal + Product',
    });
  }

  if (responses.purposeConsent === 'no') {
    findings.push({
      id: 'NC-004',
      module: 'Notice & Consent',
      severity: SEVERITY.HIGH,
      title: 'Purpose-Specific Consent Not Obtained',
      description: 'The organization does not obtain specific consent for each stated purpose of data processing.',
      explanation: 'The DPDP Act requires consent to be specific to each purpose. A blanket consent for multiple purposes does not meet statutory requirements.',
      section: 'Section 6 – Consent',
      remediation: 'Implement purpose-specific consent collection. Each purpose of data processing should have its own consent mechanism.',
      owner: 'Legal + Product',
    });
  }

  if (responses.legalBasis === 'not_identified') {
    findings.push({
      id: 'NC-005',
      module: 'Notice & Consent',
      severity: SEVERITY.MEDIUM,
      title: 'Legal Basis for Processing Not Identified',
      description: 'The organization has not identified the legal basis for its data processing activities.',
      explanation: 'Processing of personal data must be based on a lawful ground, either consent under Section 6 or legitimate uses under Section 7.',
      section: 'Sections 6, 7 – Consent and Legitimate Uses',
      remediation: 'Conduct a legal basis assessment for each category of data processing. Document whether processing relies on consent or a legitimate use ground.',
      owner: 'Legal',
    });
  }

  return findings;
}

// ---- Module 3: Children's Data ----
function evaluateChildrenData(responses) {
  const findings = [];

  if (responses.processesChildrenData === 'no') return findings;

  if (responses.behavioralTracking === 'yes') {
    findings.push({
      id: 'CD-001',
      module: "Children's Data",
      severity: SEVERITY.CRITICAL,
      title: 'Behavioral Tracking of Children Enabled',
      description: 'The organization engages in behavioral tracking or monitoring of children.',
      explanation: 'Section 9(3) specifically prohibits tracking, behavioural monitoring, or targeted advertising directed at children. This is an explicit statutory prohibition.',
      section: 'Section 9(3) – Processing of Children\'s Data',
      remediation: 'Immediately cease all behavioral tracking and monitoring activities directed at children. Implement technical controls to prevent tracking of identified child users.',
      owner: 'Product + Engineering',
    });
  }

  if (responses.targetedAdvertising === 'yes') {
    findings.push({
      id: 'CD-002',
      module: "Children's Data",
      severity: SEVERITY.CRITICAL,
      title: 'Targeted Advertising Directed at Children',
      description: 'The organization conducts targeted advertising directed at children.',
      explanation: 'Section 9(3) explicitly prohibits targeted advertising directed at children.',
      section: 'Section 9(3) – Processing of Children\'s Data',
      remediation: 'Immediately cease targeted advertising to identified child users. Implement age-gating and ad-targeting exclusion for child profiles.',
      owner: 'Marketing + Product',
    });
  }

  if (responses.parentalConsent === 'no') {
    findings.push({
      id: 'CD-003',
      module: "Children's Data",
      severity: SEVERITY.CRITICAL,
      title: 'Parental Consent Mechanism Absent',
      description: 'The organization processes children\'s data without verifiable parental consent.',
      explanation: 'Section 9(1) requires verifiable consent of the parent or lawful guardian before processing any personal data of a child.',
      section: 'Section 9(1) – Parental Consent',
      remediation: 'Implement a verifiable parental consent mechanism before processing any child\'s personal data.',
      owner: 'Legal + Product',
    });
  }

  if (responses.ageVerification === 'no') {
    findings.push({
      id: 'CD-004',
      module: "Children's Data",
      severity: SEVERITY.HIGH,
      title: 'Age Verification Mechanism Absent',
      description: 'The organization does not have a mechanism to verify the age of data principals.',
      explanation: 'Without age verification, the organization cannot reliably determine whether a data principal is a child, risking non-compliance with Section 9 obligations.',
      section: 'Section 9 – Processing of Children\'s Data',
      remediation: 'Implement appropriate age verification mechanisms to identify child users and trigger enhanced protections.',
      owner: 'Product + Engineering',
    });
  }

  if (responses.profiling === 'yes') {
    findings.push({
      id: 'CD-005',
      module: "Children's Data",
      severity: SEVERITY.HIGH,
      title: 'Profiling of Children Detected',
      description: 'The organization engages in profiling activities involving children\'s data.',
      explanation: 'Profiling of children raises significant concerns under Section 9 and may conflict with the spirit of protections for children under the DPDP Act.',
      section: 'Section 9 – Processing of Children\'s Data',
      remediation: 'Review and minimize all profiling activities involving children. Where profiling cannot be avoided, ensure enhanced safeguards and parental consent.',
      owner: 'Product + Legal',
    });
  }

  return findings;
}

// ---- Module 4: Data Principal Rights ----
function evaluateDataPrincipalRights(responses) {
  const findings = [];

  if (responses.grievanceOfficer === 'no') {
    findings.push({
      id: 'DPR-001',
      module: 'Data Principal Rights',
      severity: SEVERITY.HIGH,
      title: 'Grievance Officer Not Designated',
      description: 'The organization has not designated a Grievance Officer to address data principal concerns.',
      explanation: 'Section 8(10) requires every Data Fiduciary to designate a Grievance Officer or publish contact details of a person who can respond to data principal requests.',
      section: 'Section 8(10) – Grievance Redressal',
      remediation: 'Appoint a Grievance Officer and publish their contact information. Establish a grievance resolution process with defined timelines.',
      owner: 'Legal',
    });
  }

  if (responses.accessMechanism === 'no') {
    findings.push({
      id: 'DPR-002',
      module: 'Data Principal Rights',
      severity: SEVERITY.HIGH,
      title: 'Data Access Mechanism Absent',
      description: 'No mechanism exists for data principals to access their personal data.',
      explanation: 'Section 11 grants data principals the right to obtain information about their personal data being processed, including a summary of the data and processing activities.',
      section: 'Section 11 – Right of Data Principal',
      remediation: 'Implement a self-service portal or formal process for data principals to request and receive information about their personal data.',
      owner: 'Product + Engineering',
    });
  }

  if (responses.correctionProcess === 'no') {
    findings.push({
      id: 'DPR-003',
      module: 'Data Principal Rights',
      severity: SEVERITY.HIGH,
      title: 'Data Correction Process Absent',
      description: 'No process exists for data principals to correct inaccurate or incomplete personal data.',
      explanation: 'Section 11(2)(a) provides data principals the right to correction and completion of personal data.',
      section: 'Section 11(2)(a) – Right to Correction',
      remediation: 'Implement a process for data principals to submit correction requests and receive confirmation of corrections made.',
      owner: 'Product + Engineering',
    });
  }

  if (responses.erasureProcess === 'no') {
    findings.push({
      id: 'DPR-004',
      module: 'Data Principal Rights',
      severity: SEVERITY.HIGH,
      title: 'Data Erasure Process Absent',
      description: 'No process exists for data principals to request erasure of personal data.',
      explanation: 'Section 11(2)(b) provides data principals the right to erasure of personal data that is no longer necessary for the stated purpose.',
      section: 'Section 11(2)(b) – Right to Erasure',
      remediation: 'Implement an erasure request process. Define criteria for when erasure is obligatory versus when statutory retention may override.',
      owner: 'Product + Engineering + Legal',
    });
  }

  if (responses.responseWorkflow === 'no') {
    findings.push({
      id: 'DPR-005',
      module: 'Data Principal Rights',
      severity: SEVERITY.MEDIUM,
      title: 'Internal Response Workflow Not Defined',
      description: 'No formal internal workflow exists for handling data principal requests.',
      explanation: 'An internal workflow for processing data principal requests is essential for timely compliance and demonstrating accountability.',
      section: 'Section 8 – Obligations of Data Fiduciary',
      remediation: 'Establish an internal workflow with defined timelines, escalation paths, and audit trails for processing data principal requests.',
      owner: 'Legal + Operations',
    });
  }

  return findings;
}

// ---- Module 5: Data Retention and Deletion ----
function evaluateRetentionDeletion(responses) {
  const findings = [];

  if (responses.retentionPolicy === 'no') {
    findings.push({
      id: 'RD-001',
      module: 'Data Retention & Deletion',
      severity: SEVERITY.HIGH,
      title: 'Retention Policy Absent',
      description: 'The organization does not have a documented data retention policy.',
      explanation: 'Section 8(7) requires Data Fiduciaries to erase personal data when it is no longer necessary for the stated purpose and the data principal has not approached the Data Fiduciary. A documented retention policy is essential to demonstrate compliance.',
      section: 'Section 8(7) – Data Erasure',
      remediation: 'Develop and document a comprehensive data retention policy that aligns retention periods with stated purposes and any applicable sectoral retention requirements.',
      owner: 'Legal + Compliance',
    });
  }

  if (responses.deletionMechanism === 'no') {
    findings.push({
      id: 'RD-002',
      module: 'Data Retention & Deletion',
      severity: SEVERITY.HIGH,
      title: 'Deletion Mechanism Absent',
      description: 'No automated or systematic deletion mechanism exists for personal data.',
      explanation: 'Without a deletion mechanism, the organization risks retaining personal data beyond its stated purpose, violating Section 8(7).',
      section: 'Section 8(7) – Data Erasure',
      remediation: 'Implement automated data deletion processes aligned with the retention schedule. Include audit logging to demonstrate deletion compliance.',
      owner: 'Engineering + Legal',
    });
  }

  if (responses.sectoralRetention === 'not_considered') {
    findings.push({
      id: 'RD-003',
      module: 'Data Retention & Deletion',
      severity: SEVERITY.MEDIUM,
      title: 'Sectoral Retention Obligations Not Considered',
      description: 'The organization has not assessed how sectoral retention requirements (RBI, SEBI, PMLA) interact with DPDP obligations.',
      explanation: 'Multiple sectoral laws impose mandatory retention periods that may conflict with the DPDP Act\'s data minimization principles. These must be reconciled.',
      section: 'Section 8(7) read with sectoral laws',
      remediation: 'Map applicable sectoral retention requirements and reconcile them with DPDP retention and erasure obligations.',
      owner: 'Legal + Compliance',
    });
  }

  if (responses.litigationHold === 'no') {
    findings.push({
      id: 'RD-004',
      module: 'Data Retention & Deletion',
      severity: SEVERITY.MEDIUM,
      title: 'Litigation Hold Procedures Absent',
      description: 'The organization does not have litigation hold procedures for personal data.',
      explanation: 'Litigation hold procedures are necessary to preserve relevant data during legal proceedings while maintaining compliance with retention policies.',
      section: 'Section 8(7) – Data Erasure',
      remediation: 'Implement litigation hold procedures that allow temporary suspension of deletion for specific data sets when legally required.',
      owner: 'Legal',
    });
  }

  return findings;
}

// ---- Module 6: Cross-Border Transfers ----
function evaluateCrossBorderTransfers(responses) {
  const findings = [];

  if (responses.transfersOutside === 'yes') {
    findings.push({
      id: 'CBT-001',
      module: 'Cross-Border Transfers',
      severity: SEVERITY.UNCERTAINTY,
      title: 'Cross-Border Transfer – Regulatory Uncertainty',
      description: `Personal data is transferred to: ${responses.destinationCountries || 'unspecified countries'}. The regulatory framework for cross-border transfers remains evolving.`,
      explanation: 'Section 16(1) permits transfer of personal data to countries or territories notified by the Central Government. However, the Central Government has not yet issued the notification specifying permitted destinations. Until such notification, there is regulatory uncertainty regarding the lawfulness of cross-border transfers.',
      section: 'Section 16 – Transfer of Personal Data Outside India',
      remediation: 'Monitor government notifications under Section 16. Implement contractual safeguards with foreign processors. Consider data localization where feasible.',
      owner: 'Legal + Engineering',
    });

    if (responses.transferSafeguards === 'no') {
      findings.push({
        id: 'CBT-002',
        module: 'Cross-Border Transfers',
        severity: SEVERITY.MEDIUM,
        title: 'Transfer Safeguards Not Implemented',
        description: 'No contractual or technical safeguards are in place for cross-border data transfers.',
        explanation: 'Even in the absence of specific government notifications, implementing transfer safeguards demonstrates responsible data governance and may mitigate future compliance risks.',
        section: 'Section 16 – Transfer of Personal Data Outside India',
        remediation: 'Implement Standard Contractual Clauses or equivalent contractual safeguards with foreign data recipients. Conduct transfer impact assessments.',
        owner: 'Legal',
      });
    }
  }

  return findings;
}

// ---- Module 7: AI and Machine Learning Governance ----
function evaluateAIGovernance(responses) {
  const findings = [];

  if (responses.aiTraining === 'yes') {
    findings.push({
      id: 'AI-001',
      module: 'AI & ML Governance',
      severity: SEVERITY.AI_RISK,
      title: 'Personal Data Used for AI/ML Training',
      description: 'Personal data is used for training AI or machine learning models.',
      explanation: 'Using personal data for AI training raises purpose limitation concerns under Section 4. The original consent may not cover secondary use for model training.',
      section: 'Section 4 – Purpose Limitation',
      remediation: 'Assess whether existing consent covers AI training purposes. Consider anonymization or synthetic data alternatives. Implement data governance controls for AI training datasets.',
      owner: 'AI/ML + Legal',
    });
  }

  if (responses.aiProfiling === 'yes') {
    findings.push({
      id: 'AI-002',
      module: 'AI & ML Governance',
      severity: SEVERITY.AI_RISK,
      title: 'AI-Driven Profiling Activities',
      description: 'The organization uses AI systems for profiling individuals.',
      explanation: 'AI-driven profiling may exceed the scope of original consent and raises significant data principal rights concerns, especially regarding transparency and fairness.',
      section: 'Section 6 – Consent / Section 4 – Purpose Limitation',
      remediation: 'Conduct a profiling impact assessment. Ensure consent covers profiling purposes. Provide opt-out mechanisms. Implement human oversight for consequential profiling decisions.',
      owner: 'AI/ML + Legal',
    });
  }

  if (responses.derivedData === 'yes') {
    findings.push({
      id: 'AI-003',
      module: 'AI & ML Governance',
      severity: SEVERITY.AI_RISK,
      title: 'Derived or Inferred Data Generation',
      description: 'AI systems generate derived or inferred data about individuals.',
      explanation: 'Derived data may constitute new personal data that was not part of the original collection purpose. This raises questions about legal basis, accuracy, and data principal rights.',
      section: 'Section 2 – Definition of Personal Data',
      remediation: 'Classify derived data and assess whether it constitutes personal data. Implement governance controls for derived data, including accuracy checks and data principal notification.',
      owner: 'AI/ML + Legal',
    });
  }

  if (responses.automatedDecisions === 'yes') {
    findings.push({
      id: 'AI-004',
      module: 'AI & ML Governance',
      severity: SEVERITY.AI_RISK,
      title: 'Automated Decision-Making',
      description: 'The organization uses automated decision-making systems that affect data principals.',
      explanation: 'Automated decisions that have significant effects on individuals raise concerns about fairness, transparency, and accountability. While the DPDP Act does not specifically regulate automated decision-making, emerging best practices require human oversight.',
      section: 'General – Accountability Principle',
      remediation: 'Implement human oversight mechanisms for consequential automated decisions. Provide data principals with explanations of automated decisions. Establish appeal mechanisms.',
      owner: 'AI/ML + Product + Legal',
    });
  }

  if (responses.creditScoring === 'yes' || responses.hiringAI === 'yes') {
    findings.push({
      id: 'AI-005',
      module: 'AI & ML Governance',
      severity: SEVERITY.AI_RISK,
      title: 'High-Stakes AI Systems',
      description: `The organization uses AI for ${[responses.creditScoring === 'yes' ? 'credit scoring' : '', responses.hiringAI === 'yes' ? 'hiring/employment decisions' : ''].filter(Boolean).join(' and ')}.`,
      explanation: 'High-stakes AI applications like credit scoring and hiring decisions have direct, significant impacts on data principals and require enhanced governance controls.',
      section: 'General – Accountability and Purpose Limitation',
      remediation: 'Implement enhanced governance for high-stakes AI: bias audits, explainability requirements, human-in-the-loop processes, and regular fairness assessments.',
      owner: 'AI/ML + Legal + HR/Finance',
    });
  }

  if (responses.syntheticData === 'yes') {
    findings.push({
      id: 'AI-006',
      module: 'AI & ML Governance',
      severity: SEVERITY.LOW,
      title: 'Synthetic Data Generation',
      description: 'The organization generates synthetic data from personal data.',
      explanation: 'Synthetic data generation may mitigate privacy risks but requires assessment of re-identification risks and governance of the generation process.',
      section: 'General – Data Protection',
      remediation: 'Implement re-identification risk assessments for synthetic datasets. Document the synthetic data generation process and maintain audit trails.',
      owner: 'AI/ML + Legal',
    });
  }

  return findings;
}

// ---- Module 8: Security and Breach Response ----
function evaluateSecurityBreach(responses) {
  const findings = [];

  if (responses.breachSOP === 'no') {
    findings.push({
      id: 'SB-001',
      module: 'Security & Breach Response',
      severity: SEVERITY.HIGH,
      title: 'Breach Response SOP Absent',
      description: 'The organization does not have a documented data breach response standard operating procedure.',
      explanation: 'Section 8(6) requires Data Fiduciaries to notify the Data Protection Board and affected data principals in the event of a personal data breach. Without an SOP, timely notification cannot be assured.',
      section: 'Section 8(6) – Breach Notification',
      remediation: 'Develop and implement a data breach response SOP that includes detection, assessment, containment, notification procedures, and post-incident review.',
      owner: 'Security + Legal',
    });
  }

  if (responses.securitySafeguards === 'undocumented') {
    findings.push({
      id: 'SB-002',
      module: 'Security & Breach Response',
      severity: SEVERITY.HIGH,
      title: 'Security Safeguards Undocumented',
      description: 'The organization\'s security safeguards are not formally documented.',
      explanation: 'Section 8(4) requires reasonable security safeguards to protect personal data. Undocumented safeguards cannot be audited or demonstrated to regulators.',
      section: 'Section 8(4) – Security Safeguards',
      remediation: 'Document all technical and organizational security measures. Implement a security policy aligned with industry standards (e.g., ISO 27001) and DPDP Act requirements.',
      owner: 'Security + Compliance',
    });
  }

  if (responses.encryption === 'no') {
    findings.push({
      id: 'SB-003',
      module: 'Security & Breach Response',
      severity: SEVERITY.MEDIUM,
      title: 'Encryption Not Implemented',
      description: 'The organization does not implement encryption for personal data at rest and/or in transit.',
      explanation: 'While the DPDP Act does not prescribe specific security measures, encryption is a widely accepted reasonable safeguard.',
      section: 'Section 8(4) – Security Safeguards',
      remediation: 'Implement encryption for personal data at rest (AES-256 or equivalent) and in transit (TLS 1.2+).',
      owner: 'Engineering + Security',
    });
  }

  if (responses.accessControl === 'no') {
    findings.push({
      id: 'SB-004',
      module: 'Security & Breach Response',
      severity: SEVERITY.MEDIUM,
      title: 'Access Control Measures Insufficient',
      description: 'The organization lacks formal access control measures for personal data.',
      explanation: 'Proper access controls are fundamental to protecting personal data and demonstrating reasonable security safeguards under Section 8(4).',
      section: 'Section 8(4) – Security Safeguards',
      remediation: 'Implement role-based access controls, principle of least privilege, and multi-factor authentication for systems processing personal data.',
      owner: 'Engineering + Security',
    });
  }

  if (responses.vendorSecurity === 'no') {
    findings.push({
      id: 'SB-005',
      module: 'Security & Breach Response',
      severity: SEVERITY.MEDIUM,
      title: 'Vendor Security Assessments Not Conducted',
      description: 'The organization does not conduct security assessments of its vendors and service providers.',
      explanation: 'Data Fiduciaries remain responsible for the security of personal data even when processed by third-party vendors.',
      section: 'Section 8(2) – Processor Obligations',
      remediation: 'Establish a vendor security assessment program. Require vendors to demonstrate adequate security measures before onboarding.',
      owner: 'Security + Procurement',
    });
  }

  if (responses.breachNotification === 'no') {
    findings.push({
      id: 'SB-006',
      module: 'Security & Breach Response',
      severity: SEVERITY.HIGH,
      title: 'Breach Notification Procedures Absent',
      description: 'No formal procedures exist for notifying the Data Protection Board and affected data principals of data breaches.',
      explanation: 'Section 8(6) mandates notification to the Board and affected data principals in the event of a personal data breach, in the prescribed form and manner.',
      section: 'Section 8(6) – Breach Notification',
      remediation: 'Establish breach notification procedures including templates, timelines, and escalation paths for notifying the Data Protection Board and affected individuals.',
      owner: 'Legal + Security',
    });
  }

  return findings;
}

// ---- Module 9: Processor and Vendor Management ----
function evaluateProcessorVendor(responses) {
  const findings = [];

  if (responses.usesProcessors === 'no') return findings;

  if (responses.processorAgreements === 'no') {
    findings.push({
      id: 'PV-001',
      module: 'Processor & Vendor Management',
      severity: SEVERITY.HIGH,
      title: 'Processor Agreements Absent',
      description: 'The organization does not have formal agreements with its data processors.',
      explanation: 'Section 8(2) requires processing to be done under a valid contract. Without formal agreements, there is no legal basis for processor activities and no contractual accountability.',
      section: 'Section 8(2) – Data Processing by Processor',
      remediation: 'Execute Data Processing Agreements with all processors covering scope, purpose, security obligations, sub-processing restrictions, and breach notification requirements.',
      owner: 'Legal + Procurement',
    });
  }

  if (responses.vendorDueDiligence === 'no') {
    findings.push({
      id: 'PV-002',
      module: 'Processor & Vendor Management',
      severity: SEVERITY.MEDIUM,
      title: 'Vendor Due Diligence Process Absent',
      description: 'The organization does not conduct due diligence on its data processing vendors.',
      explanation: 'As a Data Fiduciary, the organization is accountable for personal data processed by its vendors. Due diligence is essential to ensure processors meet DPDP Act requirements.',
      section: 'Section 8 – Obligations of Data Fiduciary',
      remediation: 'Implement a vendor due diligence program that assesses data processing capabilities, security posture, and DPDP compliance readiness before engagement.',
      owner: 'Procurement + Legal',
    });
  }

  if (responses.auditRights === 'no') {
    findings.push({
      id: 'PV-003',
      module: 'Processor & Vendor Management',
      severity: SEVERITY.MEDIUM,
      title: 'Audit Rights Not Established',
      description: 'Contracts with processors do not include audit rights.',
      explanation: 'Without audit rights, the organization cannot verify processor compliance with contractual and statutory obligations.',
      section: 'Section 8 – Obligations of Data Fiduciary',
      remediation: 'Include audit rights clauses in all processor agreements. Establish a periodic audit schedule for critical data processors.',
      owner: 'Legal + Compliance',
    });
  }

  if (responses.subProcessors === 'uncontrolled') {
    findings.push({
      id: 'PV-004',
      module: 'Processor & Vendor Management',
      severity: SEVERITY.MEDIUM,
      title: 'Sub-Processor Oversight Absent',
      description: 'Sub-processors are engaged without oversight or approval requirements.',
      explanation: 'The chain of data processing must be controlled. Uncontrolled sub-processing increases risk and reduces accountability.',
      section: 'Section 8(2) – Data Processing by Processor',
      remediation: 'Require prior written approval for sub-processor engagement. Flow down contractual obligations to sub-processors.',
      owner: 'Legal + Procurement',
    });
  }

  return findings;
}


// ---- Main Evaluation Function ----
export function evaluateAssessment(allResponses) {
  const moduleResults = {
    entityProfile: evaluateEntityProfile(allResponses.entityProfile || {}),
    noticeConsent: evaluateNoticeConsent(allResponses.noticeConsent || {}),
    childrenData: evaluateChildrenData(allResponses.childrenData || {}),
    dataPrincipalRights: evaluateDataPrincipalRights(allResponses.dataPrincipalRights || {}),
    retentionDeletion: evaluateRetentionDeletion(allResponses.retentionDeletion || {}),
    crossBorderTransfers: evaluateCrossBorderTransfers(allResponses.crossBorderTransfers || {}),
    aiGovernance: evaluateAIGovernance(allResponses.aiGovernance || {}),
    securityBreach: evaluateSecurityBreach(allResponses.securityBreach || {}),
    processorVendor: evaluateProcessorVendor(allResponses.processorVendor || {}),
  };

  // Flatten all findings
  const allFindings = Object.values(moduleResults).flat();

  // Categorize findings
  const critical = allFindings.filter(f => f.severity === SEVERITY.CRITICAL);
  const high = allFindings.filter(f => f.severity === SEVERITY.HIGH);
  const medium = allFindings.filter(f => f.severity === SEVERITY.MEDIUM);
  const low = allFindings.filter(f => f.severity === SEVERITY.LOW);
  const uncertainty = allFindings.filter(f => f.severity === SEVERITY.UNCERTAINTY);
  const aiRisks = allFindings.filter(f => f.severity === SEVERITY.AI_RISK);
  const consistency = allFindings.filter(f => f.severity === SEVERITY.CONSISTENCY);

  // Calculate score
  let score = 100;
  score -= critical.length * DEDUCTIONS[SEVERITY.CRITICAL];
  score -= high.length * DEDUCTIONS[SEVERITY.HIGH];
  score -= medium.length * DEDUCTIONS[SEVERITY.MEDIUM];
  score -= low.length * DEDUCTIONS[SEVERITY.LOW];
  score = Math.max(0, score);

  // Apply caps
  if (critical.length > 0) {
    score = Math.min(score, SCORE_CAPS[SEVERITY.CRITICAL]);
  }
  if (high.length > 0) {
    score = Math.min(score, SCORE_CAPS[SEVERITY.HIGH]);
  }

  // Determine compliance band
  const band = COMPLIANCE_BANDS.find(b => score >= b.min && score <= b.max) || COMPLIANCE_BANDS[COMPLIANCE_BANDS.length - 1];

  // SDF risk indicator
  const sdfRisk = allFindings.some(f => f.id === 'EP-001');

  // Build prioritized remediation plan
  const remediationPlan = buildRemediationPlan(allFindings);

  return {
    score,
    band,
    sdfRisk,
    findings: {
      critical,
      high,
      medium,
      low,
      uncertainty,
      aiRisks,
      consistency,
    },
    allFindings,
    remediationPlan,
    moduleResults,
    totalFindings: critical.length + high.length + medium.length + low.length,
  };
}

function buildRemediationPlan(findings) {
  const priorityOrder = [SEVERITY.CRITICAL, SEVERITY.HIGH, SEVERITY.MEDIUM, SEVERITY.LOW];
  const plan = [];
  let priority = 1;

  for (const severity of priorityOrder) {
    const sevFindings = findings.filter(f => f.severity === severity);
    for (const finding of sevFindings) {
      plan.push({
        priority,
        finding: finding.title,
        action: finding.remediation,
        owner: finding.owner,
        severity: finding.severity,
        section: finding.section,
      });
      priority++;
    }
  }

  return plan;
}

export function getComplianceBand(score) {
  return COMPLIANCE_BANDS.find(b => score >= b.min && score <= b.max) || COMPLIANCE_BANDS[COMPLIANCE_BANDS.length - 1];
}

export { COMPLIANCE_BANDS };
