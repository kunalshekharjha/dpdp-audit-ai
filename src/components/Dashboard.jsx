import { useState, useEffect, useRef } from 'react';
import {
  Shield, RotateCcw, AlertTriangle, AlertCircle, AlertOctagon, Info,
  Brain, FileWarning, ChevronDown, ChevronUp, ExternalLink,
  Download, Gauge, TrendingDown, Target, CheckCircle2, Clock,
  FileText, Scale, ArrowRight, Activity
} from 'lucide-react';
import useAssessmentStore from '../store/assessmentStore';
import { SEVERITY } from '../engine/ruleEngine';
import './Dashboard.css';

const TAB_LIST = [
  { id: 'overview', label: 'Overview', icon: Gauge },
  { id: 'findings', label: 'Compliance Findings', icon: AlertTriangle },
  { id: 'uncertainty', label: 'Regulatory Uncertainty', icon: FileWarning },
  { id: 'ai-risks', label: 'AI Governance', icon: Brain },
  { id: 'remediation', label: 'Remediation Plan', icon: Target },
  { id: 'documents', label: 'Documents', icon: FileText },
];

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', color: 'var(--color-critical)', bg: 'var(--color-critical-bg)', border: 'var(--color-critical-border)', icon: AlertOctagon },
  high: { label: 'High', color: 'var(--color-high)', bg: 'var(--color-high-bg)', border: 'var(--color-high-border)', icon: AlertTriangle },
  medium: { label: 'Medium', color: 'var(--color-medium)', bg: 'var(--color-medium-bg)', border: 'var(--color-medium-border)', icon: AlertCircle },
  low: { label: 'Low', color: 'var(--color-low)', bg: 'var(--color-low-bg)', border: 'var(--color-low-border)', icon: Info },
  uncertainty: { label: 'Regulatory Uncertainty', color: 'var(--color-uncertainty)', bg: 'var(--color-uncertainty-bg)', border: 'var(--color-uncertainty-border)', icon: FileWarning },
  ai_risk: { label: 'AI Governance Risk', color: 'var(--color-ai-risk)', bg: 'var(--color-ai-risk-bg)', border: 'var(--color-ai-risk-border)', icon: Brain },
  consistency: { label: 'Consistency Alert', color: 'var(--color-consistency)', bg: 'var(--color-consistency-bg)', border: 'var(--color-consistency-border)', icon: FileWarning },
};

// ---- Score Gauge Component ----
function ScoreGauge({ score, band }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const gaugeRef = useRef(null);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }, [score]);

  const circumference = 2 * Math.PI * 90;
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="score-gauge">
      <svg width="220" height="220" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r="90" fill="none" stroke="var(--color-border)" strokeWidth="10" />
        <circle
          cx="110" cy="110" r="90"
          fill="none"
          stroke={band.color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 110 110)"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="score-value">
        <span className="score-number" style={{ color: band.color }}>{animatedScore}</span>
        <span className="score-label">{band.label}</span>
      </div>
    </div>
  );
}

// ---- Finding Card ----
function FindingCard({ finding }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = SEVERITY_CONFIG[finding.severity] || SEVERITY_CONFIG.medium;
  const SevIcon = config.icon;

  return (
    <div className="finding-card" style={{ '--finding-color': config.color, '--finding-bg': config.bg, '--finding-border': config.border }}>
      <button className="finding-header" onClick={() => setIsExpanded(!isExpanded)} id={`finding-${finding.id}`}>
        <div className="finding-severity-badge" style={{ background: config.bg, color: config.color, borderColor: config.border }}>
          <SevIcon size={14} />
          {config.label}
        </div>
        <div className="finding-title-row">
          <span className="finding-id">{finding.id}</span>
          <h4 className="finding-title">{finding.title}</h4>
        </div>
        <p className="finding-description">{finding.description}</p>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isExpanded && (
        <div className="finding-details">
          <div className="finding-detail-section">
            <h5><Scale size={14} /> Legal Basis</h5>
            <p>{finding.section}</p>
          </div>
          <div className="finding-detail-section">
            <h5><Info size={14} /> Explanation</h5>
            <p>{finding.explanation}</p>
          </div>
          <div className="finding-detail-section">
            <h5><Target size={14} /> Remediation</h5>
            <p>{finding.remediation}</p>
          </div>
          <div className="finding-detail-section">
            <h5><Activity size={14} /> Suggested Owner</h5>
            <p>{finding.owner}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Main Dashboard ----
export default function Dashboard({ onRestart }) {
  const [activeTab, setActiveTab] = useState('overview');
  const results = useAssessmentStore((s) => s.results);
  const uploadedDocuments = useAssessmentStore((s) => s.uploadedDocuments);

  if (!results) return null;

  const { score, band, findings, sdfRisk, remediationPlan, totalFindings, allFindings } = results;

  return (
    <div className="dashboard">
      {/* Top Bar */}
      <header className="dash-header">
        <div className="dash-header-left">
          <Shield size={24} className="dash-logo" />
          <h1 className="dash-title">DPDP Audit AI</h1>
          <span className="dash-subtitle">Compliance Assessment Report</span>
        </div>
        <div className="dash-header-right">
          <button className="btn-secondary" onClick={onRestart} id="restart-assessment-btn">
            <RotateCcw size={16} />
            New Assessment
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="dash-tabs">
        {TAB_LIST.map((tab) => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`dash-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              id={`tab-${tab.id}`}
            >
              <TabIcon size={16} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Content */}
      <div className="dash-content">
        {activeTab === 'overview' && (
          <OverviewTab score={score} band={band} findings={findings} sdfRisk={sdfRisk} totalFindings={totalFindings} allFindings={allFindings} />
        )}
        {activeTab === 'findings' && (
          <FindingsTab findings={findings} />
        )}
        {activeTab === 'uncertainty' && (
          <UncertaintyTab findings={findings.uncertainty} />
        )}
        {activeTab === 'ai-risks' && (
          <AIRisksTab findings={findings.aiRisks} />
        )}
        {activeTab === 'remediation' && (
          <RemediationTab plan={remediationPlan} />
        )}
        {activeTab === 'documents' && (
          <DocumentsTab documents={uploadedDocuments} />
        )}
      </div>

      {/* Disclaimer */}
      <footer className="dash-disclaimer">
        <AlertTriangle size={14} />
        <p>
          This platform provides a preliminary compliance assessment based on user-provided information and uploaded documents.
          It does not constitute legal advice. All outputs should be independently reviewed by qualified legal professionals.
          The DPDP regulatory framework continues to evolve. Findings categorized as Regulatory Uncertainty are subject to future government notifications, rules, guidance, and judicial interpretation.
        </p>
      </footer>
    </div>
  );
}

// ---- Overview Tab ----
function OverviewTab({ score, band, findings, sdfRisk, totalFindings, allFindings }) {
  const hasAIRisks = findings.aiRisks.length > 0;

  return (
    <div className="tab-content animate-fadeIn">
      {/* Score + Summary Row */}
      <div className="overview-top">
        <div className="score-section glass-card">
          <h3>Compliance Score</h3>
          <ScoreGauge score={score} band={band} />
        </div>

        <div className="summary-section">
          {/* Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card" style={{ '--stat-color': 'var(--color-critical)' }}>
              <AlertOctagon size={20} />
              <div>
                <span className="stat-value">{findings.critical.length}</span>
                <span className="stat-label">Critical</span>
              </div>
            </div>
            <div className="stat-card" style={{ '--stat-color': 'var(--color-high)' }}>
              <AlertTriangle size={20} />
              <div>
                <span className="stat-value">{findings.high.length}</span>
                <span className="stat-label">High</span>
              </div>
            </div>
            <div className="stat-card" style={{ '--stat-color': 'var(--color-medium)' }}>
              <AlertCircle size={20} />
              <div>
                <span className="stat-value">{findings.medium.length}</span>
                <span className="stat-label">Medium</span>
              </div>
            </div>
            <div className="stat-card" style={{ '--stat-color': 'var(--color-low)' }}>
              <Info size={20} />
              <div>
                <span className="stat-value">{findings.low.length}</span>
                <span className="stat-label">Low</span>
              </div>
            </div>
          </div>

          {/* Risk Indicators */}
          <div className="risk-indicators">
            {sdfRisk && (
              <div className="risk-badge sdf-risk">
                <AlertTriangle size={16} />
                <span>Potential Significant Data Fiduciary Risk Indicator</span>
              </div>
            )}
            {hasAIRisks && (
              <div className="risk-badge ai-risk">
                <Brain size={16} />
                <span>{findings.aiRisks.length} AI Governance Risk{findings.aiRisks.length > 1 ? 's' : ''} Identified</span>
              </div>
            )}
            {findings.uncertainty.length > 0 && (
              <div className="risk-badge uncertainty-risk">
                <FileWarning size={16} />
                <span>{findings.uncertainty.length} Regulatory Uncertainty Flag{findings.uncertainty.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="exec-summary glass-card">
        <h3>Executive Summary</h3>
        <p>
          Based on the assessment of {totalFindings} compliance area{totalFindings !== 1 ? 's' : ''}, your organization has
          achieved a compliance score of <strong style={{ color: band.color }}>{score}/100</strong>, classified
          as <strong style={{ color: band.color }}>{band.label}</strong>.
        </p>
        {findings.critical.length > 0 && (
          <p className="exec-alert critical">
            <AlertOctagon size={16} />
            <strong>{findings.critical.length} critical finding{findings.critical.length > 1 ? 's' : ''}</strong> require immediate attention.
            These represent clear statutory violations under the DPDP Act.
          </p>
        )}
        {findings.high.length > 0 && (
          <p className="exec-alert high">
            <AlertTriangle size={16} />
            <strong>{findings.high.length} high-severity finding{findings.high.length > 1 ? 's' : ''}</strong> indicate likely non-compliance
            requiring immediate remediation.
          </p>
        )}
        {findings.critical.length === 0 && findings.high.length === 0 && (
          <p className="exec-alert success">
            <CheckCircle2 size={16} />
            No critical or high-severity findings were identified. Continue to strengthen your compliance posture with the medium and low findings listed.
          </p>
        )}
      </div>

      {/* Module Breakdown */}
      <div className="module-breakdown glass-card">
        <h3>Finding Distribution by Module</h3>
        <div className="module-bars">
          {(() => {
            const modules = {};
            allFindings.forEach((f) => {
              if (!modules[f.module]) modules[f.module] = { critical: 0, high: 0, medium: 0, low: 0 };
              if (f.severity === 'critical') modules[f.module].critical++;
              else if (f.severity === 'high') modules[f.module].high++;
              else if (f.severity === 'medium') modules[f.module].medium++;
              else if (f.severity === 'low') modules[f.module].low++;
            });
            return Object.entries(modules).map(([mod, counts]) => (
              <div key={mod} className="module-bar-row">
                <span className="module-bar-label">{mod}</span>
                <div className="module-bar-track">
                  {counts.critical > 0 && (
                    <div className="module-bar-seg critical" style={{ flex: counts.critical }}>
                      {counts.critical}
                    </div>
                  )}
                  {counts.high > 0 && (
                    <div className="module-bar-seg high" style={{ flex: counts.high }}>
                      {counts.high}
                    </div>
                  )}
                  {counts.medium > 0 && (
                    <div className="module-bar-seg medium" style={{ flex: counts.medium }}>
                      {counts.medium}
                    </div>
                  )}
                  {counts.low > 0 && (
                    <div className="module-bar-seg low" style={{ flex: counts.low }}>
                      {counts.low}
                    </div>
                  )}
                </div>
              </div>
            ));
          })()}
        </div>
      </div>
    </div>
  );
}

// ---- Findings Tab ----
function FindingsTab({ findings }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? [...findings.critical, ...findings.high, ...findings.medium, ...findings.low]
    : findings[filter] || [];

  return (
    <div className="tab-content animate-fadeIn">
      <div className="findings-toolbar">
        <h2>Compliance Findings</h2>
        <div className="filter-btns">
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
              id={`filter-${f}`}
            >
              {f === 'all' ? 'All' : SEVERITY_CONFIG[f]?.label || f}
              <span className="filter-count">
                {f === 'all'
                  ? findings.critical.length + findings.high.length + findings.medium.length + findings.low.length
                  : (findings[f] || []).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state glass-card">
          <CheckCircle2 size={48} className="empty-icon" />
          <h3>No findings in this category</h3>
          <p>No compliance issues were identified for the selected severity level.</p>
        </div>
      ) : (
        <div className="findings-list">
          {filtered.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Uncertainty Tab ----
function UncertaintyTab({ findings }) {
  return (
    <div className="tab-content animate-fadeIn">
      <div className="tab-header">
        <h2>Regulatory Uncertainty</h2>
        <p>Areas dependent upon future government notifications, rules, or guidance. These are not compliance findings.</p>
      </div>

      <div className="info-banner glass-card" style={{ '--banner-color': 'var(--color-uncertainty)' }}>
        <FileWarning size={20} />
        <div>
          <strong>Important:</strong> Regulatory uncertainty flags indicate areas where the DPDP Act framework is still evolving.
          These should not be treated as non-compliance but require monitoring and preparedness.
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="empty-state glass-card">
          <CheckCircle2 size={48} className="empty-icon" />
          <h3>No regulatory uncertainty flags</h3>
          <p>Based on your responses, no areas of regulatory uncertainty were identified.</p>
        </div>
      ) : (
        <div className="findings-list">
          {findings.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- AI Risks Tab ----
function AIRisksTab({ findings }) {
  return (
    <div className="tab-content animate-fadeIn">
      <div className="tab-header">
        <h2>AI Governance Risks</h2>
        <p>Emerging AI-related privacy and governance concerns. These are not classified as statutory violations.</p>
      </div>

      <div className="info-banner glass-card" style={{ '--banner-color': 'var(--color-ai-risk)' }}>
        <Brain size={20} />
        <div>
          <strong>AI Governance Advisory:</strong> These findings highlight areas where AI and machine learning systems
          may pose risks to personal data protection. While not currently classified as statutory violations under the DPDP Act,
          they represent emerging best practices and potential future regulatory requirements.
        </div>
      </div>

      {findings.length === 0 ? (
        <div className="empty-state glass-card">
          <CheckCircle2 size={48} className="empty-icon" />
          <h3>No AI governance risks identified</h3>
          <p>Based on your responses, no AI-related governance risks were identified.</p>
        </div>
      ) : (
        <div className="findings-list">
          {findings.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Remediation Tab ----
function RemediationTab({ plan }) {
  return (
    <div className="tab-content animate-fadeIn">
      <div className="tab-header">
        <h2>Prioritized Remediation Plan</h2>
        <p>Actions ordered by severity and priority, with suggested ownership.</p>
      </div>

      {plan.length === 0 ? (
        <div className="empty-state glass-card">
          <CheckCircle2 size={48} className="empty-icon" />
          <h3>No remediation actions required</h3>
          <p>No compliance findings were generated from the assessment.</p>
        </div>
      ) : (
        <div className="remediation-table-wrap glass-card">
          <table className="remediation-table">
            <thead>
              <tr>
                <th>Priority</th>
                <th>Severity</th>
                <th>Action</th>
                <th>Owner</th>
                <th>Section</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((item, i) => {
                const config = SEVERITY_CONFIG[item.severity];
                return (
                  <tr key={i} style={{ animationDelay: `${i * 40}ms` }}>
                    <td>
                      <span className="priority-badge">{item.priority}</span>
                    </td>
                    <td>
                      <span className="severity-pill" style={{ background: config?.bg, color: config?.color, borderColor: config?.border }}>
                        {config?.label}
                      </span>
                    </td>
                    <td className="action-cell">{item.action}</td>
                    <td className="owner-cell">{item.owner}</td>
                    <td className="section-cell">{item.section}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---- Documents Tab ----
function DocumentsTab({ documents }) {
  return (
    <div className="tab-content animate-fadeIn">
      <div className="tab-header">
        <h2>Documents Reviewed</h2>
        <p>Uploaded documents and consistency alerts.</p>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state glass-card">
          <FileText size={48} className="empty-icon" />
          <h3>No documents uploaded</h3>
          <p>No documents were uploaded for cross-referencing during this assessment. Document upload is optional and can be used to generate consistency alerts.</p>
        </div>
      ) : (
        <div className="documents-grid">
          {documents.map((doc, i) => (
            <div key={i} className="document-card glass-card">
              <FileText size={24} />
              <div>
                <h4>{doc.name}</h4>
                <p>{(doc.size / 1024).toFixed(1)} KB • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-banner glass-card" style={{ '--banner-color': 'var(--color-consistency)', marginTop: 'var(--space-8)' }}>
        <FileWarning size={20} />
        <div>
          <strong>Consistency Alerts:</strong> In a full implementation, uploaded documents would be analyzed by AI to
          cross-check questionnaire responses against actual documentation, generating Consistency Alerts for any discrepancies found.
        </div>
      </div>
    </div>
  );
}
