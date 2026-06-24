/* ============================================
   DPDP Audit AI – Questionnaire Data
   ============================================
   Defines all 9 assessment modules with their
   questions, options, and metadata.
   ============================================ */

export const MODULES = [
  {
    key: 'entityProfile',
    title: 'Entity Profile',
    description: 'Determine applicability of the DPDP Act and identify potential Significant Data Fiduciary risk indicators.',
    icon: 'Building2',
    questions: [
      {
        id: 'orgType',
        label: 'What type of organization are you?',
        type: 'select',
        options: [
          { value: 'private_company', label: 'Private Limited Company' },
          { value: 'public_company', label: 'Public Limited Company' },
          { value: 'llp', label: 'Limited Liability Partnership' },
          { value: 'partnership', label: 'Partnership Firm' },
          { value: 'sole_proprietor', label: 'Sole Proprietorship' },
          { value: 'trust', label: 'Trust / NGO / Society' },
          { value: 'government', label: 'Government Entity' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'entityRole',
        label: 'What is your role under the DPDP Act?',
        type: 'select',
        hint: 'A Data Fiduciary determines the purpose and means of processing. A Data Processor processes on behalf of a Fiduciary.',
        options: [
          { value: 'fiduciary', label: 'Data Fiduciary' },
          { value: 'processor', label: 'Data Processor' },
          { value: 'both', label: 'Both (Fiduciary and Processor)' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'dataVolume',
        label: 'Approximately how many data principals\' data do you process?',
        type: 'select',
        options: [
          { value: 'below_10k', label: 'Below 10,000' },
          { value: '10k_100k', label: '10,000 – 100,000' },
          { value: '100k_1m', label: '100,000 – 1,000,000' },
          { value: 'above_1m', label: '1,000,000 – 10,000,000' },
          { value: 'above_10m', label: 'Above 10,000,000' },
        ],
      },
      {
        id: 'geoScope',
        label: 'What is the geographic scope of your operations?',
        type: 'select',
        options: [
          { value: 'india_only', label: 'India only' },
          { value: 'india_primary', label: 'Primarily India with some international' },
          { value: 'multinational', label: 'Multinational' },
        ],
      },
      {
        id: 'dataCategories',
        label: 'What categories of personal data do you process?',
        type: 'multi-select',
        options: [
          { value: 'identity', label: 'Identity data (name, address, ID numbers)' },
          { value: 'contact', label: 'Contact data (email, phone)' },
          { value: 'financial', label: 'Financial data (bank, payments, credit)' },
          { value: 'health', label: 'Health data' },
          { value: 'biometric', label: 'Biometric data' },
          { value: 'location', label: 'Location data' },
          { value: 'behavioral', label: 'Behavioral / usage data' },
          { value: 'children', label: 'Children\'s data' },
          { value: 'employment', label: 'Employment data' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'industrySector',
        label: 'Which industry sector does your organization belong to?',
        type: 'select',
        options: [
          { value: 'fintech', label: 'FinTech' },
          { value: 'healthtech', label: 'HealthTech' },
          { value: 'ecommerce', label: 'E-Commerce' },
          { value: 'edtech', label: 'EdTech' },
          { value: 'saas', label: 'SaaS' },
          { value: 'social_media', label: 'Social Media' },
          { value: 'enterprise', label: 'Enterprise Software' },
          { value: 'other', label: 'Other' },
        ],
      },
    ],
  },
  {
    key: 'noticeConsent',
    title: 'Notice & Consent',
    description: 'Assess compliance with consent and notice requirements under the DPDP Act.',
    icon: 'FileCheck',
    questions: [
      {
        id: 'collectionMethod',
        label: 'How do you primarily collect personal data?',
        type: 'multi-select',
        options: [
          { value: 'direct_online', label: 'Direct collection – online forms' },
          { value: 'direct_offline', label: 'Direct collection – offline / in-person' },
          { value: 'third_party', label: 'From third parties / partners' },
          { value: 'public_sources', label: 'From publicly available sources' },
          { value: 'automated', label: 'Automated collection (cookies, tracking)' },
        ],
      },
      {
        id: 'legalBasis',
        label: 'What is the legal basis for your data processing?',
        type: 'select',
        options: [
          { value: 'consent', label: 'Consent (Section 6)' },
          { value: 'legitimate_use', label: 'Legitimate Uses (Section 7)' },
          { value: 'both', label: 'Both consent and legitimate uses' },
          { value: 'not_identified', label: 'Not clearly identified' },
        ],
      },
      {
        id: 'noticeTiming',
        label: 'When is the privacy notice provided to data principals?',
        type: 'select',
        options: [
          { value: 'before', label: 'Before or at the time of data collection' },
          { value: 'after', label: 'After data collection' },
          { value: 'none', label: 'No formal notice is provided' },
        ],
      },
      {
        id: 'purposeConsent',
        label: 'Do you obtain specific consent for each stated purpose of processing?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – purpose-specific consent is collected' },
          { value: 'partial', label: 'Partially – some purposes are bundled' },
          { value: 'no', label: 'No – blanket consent is used' },
        ],
      },
      {
        id: 'bundledConsent',
        label: 'Is access to your service conditioned upon consent for purposes not necessary for the service?',
        type: 'select',
        hint: 'For example: requiring consent for marketing as a condition for using the core service.',
        options: [
          { value: 'no', label: 'No – consent for non-essential purposes is optional' },
          { value: 'yes', label: 'Yes – service access requires consent for all purposes' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'consentWithdrawal',
        label: 'Can data principals easily withdraw their consent?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – clear and easy withdrawal mechanism exists' },
          { value: 'difficult', label: 'Withdrawal is possible but not easy' },
          { value: 'no', label: 'No withdrawal mechanism exists' },
        ],
      },
    ],
  },
  {
    key: 'childrenData',
    title: "Children's Data",
    description: "Assess compliance with obligations relating to children's personal data under the DPDP Act.",
    icon: 'Baby',
    questions: [
      {
        id: 'processesChildrenData',
        label: "Does your organization process children's personal data?",
        type: 'select',
        hint: 'Under the DPDP Act, a child is a person below the age of 18 years.',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'ageVerification',
        label: 'Do you have a mechanism to verify the age of data principals?',
        type: 'select',
        conditional: { field: 'processesChildrenData', value: 'yes' },
        options: [
          { value: 'yes', label: 'Yes – age verification is in place' },
          { value: 'partial', label: 'Partial – self-declaration only' },
          { value: 'no', label: 'No age verification mechanism' },
        ],
      },
      {
        id: 'parentalConsent',
        label: "Do you obtain verifiable parental consent before processing a child's data?",
        type: 'select',
        conditional: { field: 'processesChildrenData', value: 'yes' },
        options: [
          { value: 'yes', label: 'Yes – verifiable parental consent is obtained' },
          { value: 'partial', label: 'Partially implemented' },
          { value: 'no', label: 'No parental consent mechanism' },
        ],
      },
      {
        id: 'behavioralTracking',
        label: 'Do you engage in behavioral tracking or monitoring of children?',
        type: 'select',
        conditional: { field: 'processesChildrenData', value: 'yes' },
        options: [
          { value: 'no', label: 'No – no tracking of children' },
          { value: 'yes', label: 'Yes' },
        ],
      },
      {
        id: 'profiling',
        label: "Do you conduct profiling activities involving children's data?",
        type: 'select',
        conditional: { field: 'processesChildrenData', value: 'yes' },
        options: [
          { value: 'no', label: 'No' },
          { value: 'yes', label: 'Yes' },
        ],
      },
      {
        id: 'targetedAdvertising',
        label: 'Do you engage in targeted advertising directed at children?',
        type: 'select',
        conditional: { field: 'processesChildrenData', value: 'yes' },
        options: [
          { value: 'no', label: 'No' },
          { value: 'yes', label: 'Yes' },
        ],
      },
    ],
  },
  {
    key: 'dataPrincipalRights',
    title: 'Data Principal Rights',
    description: 'Assess mechanisms available to data principals to exercise their rights under the DPDP Act.',
    icon: 'UserCheck',
    questions: [
      {
        id: 'accessMechanism',
        label: 'Do data principals have a mechanism to access their personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – self-service portal or formal process' },
          { value: 'partial', label: 'Partially – informal or ad-hoc process' },
          { value: 'no', label: 'No access mechanism exists' },
        ],
      },
      {
        id: 'correctionProcess',
        label: 'Can data principals correct inaccurate or incomplete personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – formal correction process exists' },
          { value: 'partial', label: 'Partially – ad-hoc corrections possible' },
          { value: 'no', label: 'No correction process exists' },
        ],
      },
      {
        id: 'erasureProcess',
        label: 'Can data principals request erasure of their personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – formal erasure process exists' },
          { value: 'partial', label: 'Partially – case-by-case basis' },
          { value: 'no', label: 'No erasure process exists' },
        ],
      },
      {
        id: 'retentionConflict',
        label: 'How do you handle conflicts between erasure requests and statutory retention obligations?',
        type: 'select',
        options: [
          { value: 'documented', label: 'Documented policy for handling conflicts' },
          { value: 'case_by_case', label: 'Handled on a case-by-case basis' },
          { value: 'not_addressed', label: 'Not addressed' },
        ],
      },
      {
        id: 'grievanceOfficer',
        label: 'Has the organization designated a Grievance Officer?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – with published contact details' },
          { value: 'partial', label: 'Designated but details not published' },
          { value: 'no', label: 'No Grievance Officer designated' },
        ],
      },
      {
        id: 'responseWorkflow',
        label: 'Do you have a formal internal workflow for handling data principal requests?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – documented with defined timelines' },
          { value: 'informal', label: 'Informal process exists' },
          { value: 'no', label: 'No internal workflow' },
        ],
      },
    ],
  },
  {
    key: 'retentionDeletion',
    title: 'Data Retention & Deletion',
    description: 'Assess compliance with retention and deletion obligations and interaction with sectoral laws.',
    icon: 'Clock',
    questions: [
      {
        id: 'retentionPolicy',
        label: 'Does your organization have a documented data retention policy?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – comprehensive and documented' },
          { value: 'partial', label: 'Partial – exists for some data categories' },
          { value: 'no', label: 'No retention policy exists' },
        ],
      },
      {
        id: 'deletionMechanism',
        label: 'Do you have automated or systematic deletion processes for personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – automated deletion aligned with retention schedule' },
          { value: 'manual', label: 'Manual deletion processes' },
          { value: 'no', label: 'No deletion mechanism exists' },
        ],
      },
      {
        id: 'sectoralRetention',
        label: 'Have you assessed sectoral retention requirements (RBI, SEBI, PMLA)?',
        type: 'select',
        hint: 'Multiple sectoral laws impose mandatory retention periods that may conflict with DPDP obligations.',
        options: [
          { value: 'yes', label: 'Yes – assessed and documented' },
          { value: 'partial', label: 'Partially assessed' },
          { value: 'not_considered', label: 'Not considered' },
          { value: 'not_applicable', label: 'Not applicable to our sector' },
        ],
      },
      {
        id: 'litigationHold',
        label: 'Do you have litigation hold procedures for personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – formal procedures exist' },
          { value: 'informal', label: 'Informal – case-by-case basis' },
          { value: 'no', label: 'No litigation hold procedures' },
        ],
      },
    ],
  },
  {
    key: 'crossBorderTransfers',
    title: 'Cross-Border Transfers',
    description: 'Assess international data transfer practices and compliance readiness.',
    icon: 'Globe',
    questions: [
      {
        id: 'transfersOutside',
        label: 'Is personal data transferred outside India?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No – all data stays in India' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'destinationCountries',
        label: 'To which countries is personal data transferred?',
        type: 'text',
        conditional: { field: 'transfersOutside', value: 'yes' },
        placeholder: 'e.g., United States, Singapore, EU countries',
      },
      {
        id: 'transferSafeguards',
        label: 'Are contractual or technical safeguards in place for cross-border transfers?',
        type: 'select',
        conditional: { field: 'transfersOutside', value: 'yes' },
        options: [
          { value: 'yes', label: 'Yes – contractual and technical safeguards' },
          { value: 'partial', label: 'Partial – some safeguards in place' },
          { value: 'no', label: 'No safeguards in place' },
        ],
      },
      {
        id: 'cloudLocations',
        label: 'Where are your cloud services hosted?',
        type: 'multi-select',
        options: [
          { value: 'india', label: 'India' },
          { value: 'us', label: 'United States' },
          { value: 'eu', label: 'European Union' },
          { value: 'singapore', label: 'Singapore' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'vendorLocations',
        label: 'Are any of your data processing vendors located outside India?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
    ],
  },
  {
    key: 'aiGovernance',
    title: 'AI & ML Governance',
    description: 'Assess risks arising from AI and machine learning systems that process personal data.',
    icon: 'Brain',
    questions: [
      {
        id: 'aiTraining',
        label: 'Do you use personal data for AI or machine learning model training?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'anonymized', label: 'Only anonymized / de-identified data' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'aiProfiling',
        label: 'Do you use AI systems for profiling individuals?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'limited', label: 'Limited profiling' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'derivedData',
        label: 'Do your AI systems generate derived or inferred data about individuals?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'automatedDecisions',
        label: 'Do you use automated decision-making that affects data principals?',
        type: 'select',
        hint: 'e.g., credit decisions, content moderation, access control decisions',
        options: [
          { value: 'yes', label: 'Yes – decisions with significant effects' },
          { value: 'limited', label: 'Yes – but with human oversight' },
          { value: 'no', label: 'No automated decision-making' },
        ],
      },
      {
        id: 'syntheticData',
        label: 'Do you generate synthetic data from personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'recommendationSystems',
        label: 'Do you operate recommendation systems based on personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'creditScoring',
        label: 'Do you use AI for credit scoring?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'na', label: 'Not applicable' },
        ],
      },
      {
        id: 'hiringAI',
        label: 'Do you use AI for hiring or employment-related decisions?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
          { value: 'na', label: 'Not applicable' },
        ],
      },
    ],
  },
  {
    key: 'securityBreach',
    title: 'Security & Breach Response',
    description: 'Assess organizational and technical safeguards for personal data protection.',
    icon: 'ShieldCheck',
    questions: [
      {
        id: 'securitySafeguards',
        label: 'What is the status of your security safeguards?',
        type: 'select',
        options: [
          { value: 'documented', label: 'Documented and formally implemented' },
          { value: 'partial', label: 'Partially documented' },
          { value: 'undocumented', label: 'Exist but undocumented' },
          { value: 'none', label: 'No formal security safeguards' },
        ],
      },
      {
        id: 'encryption',
        label: 'Do you implement encryption for personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – at rest and in transit' },
          { value: 'partial', label: 'Partial – only in transit or only at rest' },
          { value: 'no', label: 'No encryption' },
        ],
      },
      {
        id: 'accessControl',
        label: 'Do you have formal access control measures for personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – RBAC with least privilege' },
          { value: 'partial', label: 'Partial access controls' },
          { value: 'no', label: 'No formal access controls' },
        ],
      },
      {
        id: 'breachSOP',
        label: 'Do you have a documented data breach response procedure (SOP)?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – documented and tested' },
          { value: 'draft', label: 'Draft or untested SOP' },
          { value: 'no', label: 'No breach response SOP' },
        ],
      },
      {
        id: 'vendorSecurity',
        label: 'Do you conduct security assessments of vendors processing personal data?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – regular assessments' },
          { value: 'initial', label: 'Only during initial onboarding' },
          { value: 'no', label: 'No vendor security assessments' },
        ],
      },
      {
        id: 'breachNotification',
        label: 'Do you have procedures for notifying the Data Protection Board and affected individuals of breaches?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes – documented notification procedures' },
          { value: 'partial', label: 'Partial procedures' },
          { value: 'no', label: 'No notification procedures' },
        ],
      },
    ],
  },
  {
    key: 'processorVendor',
    title: 'Processor & Vendor Management',
    description: 'Assess third-party processor compliance and vendor management practices.',
    icon: 'Handshake',
    questions: [
      {
        id: 'usesProcessors',
        label: 'Does your organization use third-party data processors?',
        type: 'select',
        options: [
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ],
      },
      {
        id: 'processorAgreements',
        label: 'Do you have formal Data Processing Agreements with all processors?',
        type: 'select',
        conditional: { field: 'usesProcessors', value: 'yes' },
        options: [
          { value: 'yes', label: 'Yes – with all processors' },
          { value: 'partial', label: 'With some processors' },
          { value: 'no', label: 'No formal agreements' },
        ],
      },
      {
        id: 'subProcessors',
        label: 'How are sub-processors managed?',
        type: 'select',
        conditional: { field: 'usesProcessors', value: 'yes' },
        options: [
          { value: 'controlled', label: 'Prior approval required for sub-processors' },
          { value: 'notified', label: 'Sub-processors notified but no approval needed' },
          { value: 'uncontrolled', label: 'No oversight of sub-processors' },
          { value: 'unsure', label: 'Not sure' },
        ],
      },
      {
        id: 'vendorDueDiligence',
        label: 'Do you conduct due diligence on data processing vendors before engagement?',
        type: 'select',
        conditional: { field: 'usesProcessors', value: 'yes' },
        options: [
          { value: 'yes', label: 'Yes – formal due diligence process' },
          { value: 'informal', label: 'Informal assessment' },
          { value: 'no', label: 'No due diligence conducted' },
        ],
      },
      {
        id: 'auditRights',
        label: 'Do your processor agreements include audit rights?',
        type: 'select',
        conditional: { field: 'usesProcessors', value: 'yes' },
        options: [
          { value: 'yes', label: 'Yes – with periodic audit schedule' },
          { value: 'contractual', label: 'Contractual right but not exercised' },
          { value: 'no', label: 'No audit rights' },
        ],
      },
    ],
  },
];
