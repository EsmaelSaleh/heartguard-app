import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import OnboardingWelcomePage from './components/OnboardingWelcomePage';
import OnboardingBasicInfoPage from './components/OnboardingBasicInfoPage';
import OnboardingLifestylePage from './components/OnboardingLifestylePage';
import OnboardingMedicalHistoryPage from './components/OnboardingMedicalHistoryPage';
import RiskAssessmentVitalsPage from './components/RiskAssessmentVitalsPage';
import RiskAssessmentEcgPage from './components/RiskAssessmentEcgPage';
import EmptyDashboardPage from './components/EmptyDashboardPage';
import DashboardPage from './components/DashboardPage';
import RiskReportPage from './components/RiskReportPage';
import ChatbotPage from './components/ChatbotPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding/welcome" element={<OnboardingWelcomePage />} />
        <Route path="/onboarding/basic-info" element={<OnboardingBasicInfoPage />} />
        <Route path="/onboarding/lifestyle" element={<OnboardingLifestylePage />} />
        <Route path="/onboarding/medical-history" element={<OnboardingMedicalHistoryPage />} />
        <Route path="/risk-assessment/vitals" element={<RiskAssessmentVitalsPage />} />
        <Route path="/risk-assessment/ecg" element={<RiskAssessmentEcgPage />} />
        <Route path="/dashboard" element={<EmptyDashboardPage />} />
        <Route path="/dashboard-results" element={<DashboardPage />} />
        <Route path="/risk-report" element={<RiskReportPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        {/* We will add more routes here as we build them */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
