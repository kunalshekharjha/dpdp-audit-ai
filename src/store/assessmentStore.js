/* ============================================
   DPDP Audit AI – Assessment Store (Zustand)
   ============================================ */
import { create } from 'zustand';
import { evaluateAssessment } from '../engine/ruleEngine';

const useAssessmentStore = create((set, get) => ({
  // Current step in the questionnaire (0-indexed module)
  currentModule: 0,

  // Assessment completion status
  isComplete: false,

  // Questionnaire responses per module
  responses: {
    entityProfile: {},
    noticeConsent: {},
    childrenData: {},
    dataPrincipalRights: {},
    retentionDeletion: {},
    crossBorderTransfers: {},
    aiGovernance: {},
    securityBreach: {},
    processorVendor: {},
  },

  // Assessment results (populated after evaluation)
  results: null,

  // Uploaded documents (metadata only)
  uploadedDocuments: [],

  // Actions
  setModuleResponse: (moduleKey, questionId, value) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [moduleKey]: {
          ...state.responses[moduleKey],
          [questionId]: value,
        },
      },
    })),

  setModuleResponses: (moduleKey, responses) =>
    set((state) => ({
      responses: {
        ...state.responses,
        [moduleKey]: {
          ...state.responses[moduleKey],
          ...responses,
        },
      },
    })),

  nextModule: () =>
    set((state) => ({
      currentModule: Math.min(state.currentModule + 1, 8),
    })),

  prevModule: () =>
    set((state) => ({
      currentModule: Math.max(state.currentModule - 1, 0),
    })),

  goToModule: (index) =>
    set({ currentModule: index }),

  completeAssessment: () => {
    const { responses } = get();
    const results = evaluateAssessment(responses);
    set({ isComplete: true, results });
  },

  addDocument: (doc) =>
    set((state) => ({
      uploadedDocuments: [...state.uploadedDocuments, doc],
    })),

  removeDocument: (index) =>
    set((state) => ({
      uploadedDocuments: state.uploadedDocuments.filter((_, i) => i !== index),
    })),

  resetAssessment: () =>
    set({
      currentModule: 0,
      isComplete: false,
      responses: {
        entityProfile: {},
        noticeConsent: {},
        childrenData: {},
        dataPrincipalRights: {},
        retentionDeletion: {},
        crossBorderTransfers: {},
        aiGovernance: {},
        securityBreach: {},
        processorVendor: {},
      },
      results: null,
      uploadedDocuments: [],
    }),
}));

export default useAssessmentStore;
