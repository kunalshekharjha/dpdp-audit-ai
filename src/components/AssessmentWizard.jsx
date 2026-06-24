import { useState, useCallback, useMemo } from 'react';
import { 
  ArrowLeft, ArrowRight, CheckCircle, Shield, ChevronRight,
  Building2, FileCheck, Baby, UserCheck, Clock, Globe, Brain, ShieldCheck, Handshake,
  Info, Upload, X, FileText
} from 'lucide-react';
import { MODULES } from '../data/questionnaire';
import useAssessmentStore from '../store/assessmentStore';
import './AssessmentWizard.css';

const ICON_MAP = {
  Building2, FileCheck, Baby, UserCheck, Clock, Globe, Brain, ShieldCheck, Handshake,
};

export default function AssessmentWizard({ onComplete, onBack }) {
  const {
    currentModule, responses, setModuleResponse,
    nextModule, prevModule, goToModule, completeAssessment,
    uploadedDocuments, addDocument, removeDocument,
  } = useAssessmentStore();

  const module = MODULES[currentModule];
  const moduleResponses = responses[module.key] || {};
  const IconComponent = ICON_MAP[module.icon] || Shield;
  const progress = ((currentModule + 1) / MODULES.length) * 100;

  // Check if a question should be visible based on conditional logic
  const isQuestionVisible = useCallback((question) => {
    if (!question.conditional) return true;
    return moduleResponses[question.conditional.field] === question.conditional.value;
  }, [moduleResponses]);

  const visibleQuestions = useMemo(
    () => module.questions.filter(isQuestionVisible),
    [module.questions, isQuestionVisible]
  );

  // Check module completeness
  const isModuleComplete = useMemo(() => {
    return visibleQuestions.every((q) => {
      const val = moduleResponses[q.id];
      if (q.type === 'multi-select') return val && val.length > 0;
      if (q.type === 'text') return val && val.trim().length > 0;
      return val !== undefined && val !== '';
    });
  }, [visibleQuestions, moduleResponses]);

  const handleNext = () => {
    if (currentModule < MODULES.length - 1) {
      nextModule();
    } else {
      completeAssessment();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentModule > 0) {
      prevModule();
    } else {
      onBack();
    }
  };

  const handleSelectChange = (questionId, value) => {
    setModuleResponse(module.key, questionId, value);
  };

  const handleMultiSelect = (questionId, value) => {
    const current = moduleResponses[questionId] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setModuleResponse(module.key, questionId, updated);
  };

  const handleTextChange = (questionId, value) => {
    setModuleResponse(module.key, questionId, value);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      addDocument({
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      });
    });
    e.target.value = '';
  };

  return (
    <div className="wizard">
      {/* Sidebar */}
      <aside className="wizard-sidebar">
        <div className="sidebar-header">
          <Shield size={24} className="sidebar-logo-icon" />
          <span className="sidebar-title">DPDP Audit</span>
        </div>

        <nav className="sidebar-nav">
          {MODULES.map((m, i) => {
            const MIcon = ICON_MAP[m.icon] || Shield;
            const moduleResp = responses[m.key] || {};
            const hasResponses = Object.keys(moduleResp).length > 0;
            const isActive = i === currentModule;
            const isPast = i < currentModule;

            return (
              <button
                key={m.key}
                className={`sidebar-item ${isActive ? 'active' : ''} ${isPast ? 'completed' : ''}`}
                onClick={() => goToModule(i)}
                id={`module-nav-${m.key}`}
              >
                <div className="sidebar-item-icon">
                  {isPast && hasResponses ? (
                    <CheckCircle size={18} />
                  ) : (
                    <MIcon size={18} />
                  )}
                </div>
                <span className="sidebar-item-label">{m.title}</span>
                {isActive && <ChevronRight size={16} className="sidebar-item-arrow" />}
              </button>
            );
          })}
        </nav>

        {/* Document Upload */}
        <div className="sidebar-uploads">
          <h4>
            <Upload size={16} />
            Documents
          </h4>
          <label className="upload-btn" id="upload-documents-btn">
            <input type="file" multiple accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} hidden />
            Upload Files
          </label>
          {uploadedDocuments.length > 0 && (
            <div className="uploaded-list">
              {uploadedDocuments.map((doc, i) => (
                <div key={i} className="uploaded-item">
                  <FileText size={14} />
                  <span>{doc.name}</span>
                  <button onClick={() => removeDocument(i)} className="remove-doc">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="wizard-main">
        {/* Progress Bar */}
        <div className="wizard-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-text">
            Module {currentModule + 1} of {MODULES.length}
          </span>
        </div>

        {/* Module Header */}
        <div className="module-header" key={module.key}>
          <div className="module-header-icon">
            <IconComponent size={28} />
          </div>
          <div>
            <h1 className="module-title">{module.title}</h1>
            <p className="module-desc">{module.description}</p>
          </div>
        </div>

        {/* Questions */}
        <div className="questions-container" key={`q-${module.key}`}>
          {visibleQuestions.map((question, qIdx) => (
            <div
              className="question-card glass-card"
              key={question.id}
              style={{ animationDelay: `${qIdx * 60}ms` }}
            >
              <label className="question-label">
                {question.label}
                {question.hint && (
                  <span className="question-hint">
                    <Info size={14} />
                    {question.hint}
                  </span>
                )}
              </label>

              {question.type === 'select' && (
                <div className="options-list">
                  {question.options.map((opt) => (
                    <button
                      key={opt.value}
                      className={`option-btn ${moduleResponses[question.id] === opt.value ? 'selected' : ''}`}
                      onClick={() => handleSelectChange(question.id, opt.value)}
                      id={`opt-${question.id}-${opt.value}`}
                    >
                      <span className="option-radio" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}

              {question.type === 'multi-select' && (
                <div className="options-list">
                  {question.options.map((opt) => {
                    const isChecked = (moduleResponses[question.id] || []).includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        className={`option-btn ${isChecked ? 'selected' : ''}`}
                        onClick={() => handleMultiSelect(question.id, opt.value)}
                        id={`opt-${question.id}-${opt.value}`}
                      >
                        <span className="option-checkbox">
                          {isChecked && <CheckCircle size={14} />}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {question.type === 'text' && (
                <input
                  type="text"
                  className="text-input"
                  value={moduleResponses[question.id] || ''}
                  onChange={(e) => handleTextChange(question.id, e.target.value)}
                  placeholder={question.placeholder || 'Enter your response...'}
                  id={`input-${question.id}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="wizard-nav">
          <button className="btn-secondary" onClick={handlePrev} id="wizard-prev-btn">
            <ArrowLeft size={18} />
            {currentModule === 0 ? 'Back' : 'Previous'}
          </button>
          <button className="btn-primary" onClick={handleNext} id="wizard-next-btn">
            {currentModule === MODULES.length - 1 ? 'Complete Assessment' : 'Next Module'}
            {currentModule === MODULES.length - 1 ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
          </button>
        </div>
      </main>
    </div>
  );
}
