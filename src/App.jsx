import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AssessmentWizard from './components/AssessmentWizard';
import Dashboard from './components/Dashboard';
import useAssessmentStore from './store/assessmentStore';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'assessment' | 'dashboard'
  const isComplete = useAssessmentStore((s) => s.isComplete);
  const resetAssessment = useAssessmentStore((s) => s.resetAssessment);

  const startAssessment = () => setView('assessment');

  const handleComplete = () => setView('dashboard');

  const handleRestart = () => {
    resetAssessment();
    setView('landing');
  };

  if (view === 'landing') {
    return <LandingPage onStart={startAssessment} />;
  }

  if (view === 'assessment') {
    return <AssessmentWizard onComplete={handleComplete} onBack={() => setView('landing')} />;
  }

  if (view === 'dashboard') {
    return <Dashboard onRestart={handleRestart} />;
  }

  return null;
}

export default App;
