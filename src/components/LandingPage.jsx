import { Shield, ArrowRight, Building2, FileCheck, Baby, UserCheck, Clock, Globe, Brain, ShieldCheck, Handshake, Scale, AlertTriangle, Zap } from 'lucide-react';
import './LandingPage.css';

const FEATURES = [
  { icon: Scale, title: 'Deterministic Rule Engine', desc: 'Compliance determinations through predefined legal rules, not AI guesswork' },
  { icon: Shield, title: 'DPDP Act Coverage', desc: 'All 9 core compliance domains assessed against statutory requirements' },
  { icon: AlertTriangle, title: 'Risk Categorization', desc: 'Findings classified as Critical, High, Medium, and Low with statutory references' },
  { icon: Zap, title: 'Actionable Remediation', desc: 'Prioritized remediation plan with suggested owners and timelines' },
];

const MODULES = [
  { icon: Building2, title: 'Entity Profile', desc: 'Applicability & SDF indicators' },
  { icon: FileCheck, title: 'Notice & Consent', desc: 'Consent and notice compliance' },
  { icon: Baby, title: "Children's Data", desc: 'Child data protections' },
  { icon: UserCheck, title: 'Data Principal Rights', desc: 'Rights mechanisms' },
  { icon: Clock, title: 'Data Retention', desc: 'Retention & deletion' },
  { icon: Globe, title: 'Cross-Border Transfers', desc: 'International transfers' },
  { icon: Brain, title: 'AI Governance', desc: 'AI/ML privacy risks' },
  { icon: ShieldCheck, title: 'Security & Breach', desc: 'Safeguards & response' },
  { icon: Handshake, title: 'Vendor Management', desc: 'Processor compliance' },
];

export default function LandingPage({ onStart }) {
  return (
    <div className="landing">
      {/* Hero */}
      <header className="landing-hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-badge">
            <Shield size={16} />
            <span>DPDP Act, 2023 Compliance</span>
          </div>
          <h1 className="hero-title">
            <span className="text-gradient">DPDP Audit AI</span>
          </h1>
          <p className="hero-subtitle">
            AI-assisted compliance assessment platform for India's Digital Personal Data Protection Act, 2023.
            Evaluate your organization's readiness with deterministic legal rules and actionable insights.
          </p>
          <button className="btn-primary btn-lg" onClick={onStart} id="start-assessment-btn">
            Start Compliance Assessment
            <ArrowRight size={20} />
          </button>
          <p className="hero-disclaimer">
            This platform provides preliminary compliance assessment only. All outputs should be independently reviewed by qualified legal professionals.
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="landing-section">
        <h2 className="section-title">Built on Legal Precision</h2>
        <p className="section-desc">
          Compliance determinations are made through predefined legal rules — AI only assists with explanations and recommendations.
        </p>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div className="feature-card glass-card" key={i} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="feature-icon-wrap">
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="landing-section">
        <h2 className="section-title">9 Assessment Modules</h2>
        <p className="section-desc">
          Comprehensive evaluation across all key compliance domains of the DPDP Act.
        </p>
        <div className="modules-grid">
          {MODULES.map((m, i) => (
            <div className="module-card glass-card" key={i} style={{ animationDelay: `${i * 60}ms` }}>
              <div className="module-icon">
                <m.icon size={20} />
              </div>
              <div>
                <h4>{m.title}</h4>
                <p>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <div className="cta-card glass-card-strong">
          <h2>Ready to assess your DPDP compliance?</h2>
          <p>Complete the assessment in approximately 15-20 minutes to receive a comprehensive compliance report.</p>
          <button className="btn-primary btn-lg" onClick={onStart} id="cta-start-btn">
            Begin Assessment
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>DPDP Audit AI — Preliminary compliance assessment tool. Not legal advice.</p>
        <p>The DPDP regulatory framework continues to evolve. Findings are subject to future government notifications, rules, guidance, and judicial interpretation.</p>
      </footer>
    </div>
  );
}
