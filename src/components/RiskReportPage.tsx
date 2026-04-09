import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { brandAssets } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export interface RiskReportPageProps {}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

interface Assessment {
  id: string;
  cholesterol: number;
  bmi: number;
  heart_rate: number;
  glucose: number;
  pulse_pressure: number;
  ecg_file_url: string | null;
  risk_score: number;
  risk_level: 'low' | 'moderate' | 'high';
  created_at: string;
}

function parseAssessment(raw: Record<string, unknown>): Assessment {
  return {
    ...raw,
    cholesterol: Math.round(Number(raw.cholesterol)),
    bmi: Math.round(Number(raw.bmi) * 10) / 10,
    heart_rate: Math.round(Number(raw.heart_rate)),
    glucose: Math.round(Number(raw.glucose)),
    pulse_pressure: Math.round(Number(raw.pulse_pressure)),
    risk_score: Math.round(Number(raw.risk_score)),
  } as Assessment;
}

function getMetricStatus(type: string, value: number) {
  switch (type) {
    case 'cholesterol':
      if (value >= 240) return { label: 'Elevated', color: 'red' };
      if (value >= 200) return { label: 'Borderline', color: 'amber' };
      return { label: 'Normal', color: 'green' };
    case 'bmi':
      if (value >= 30) return { label: 'Obese', color: 'red' };
      if (value >= 25) return { label: 'Overweight', color: 'amber' };
      if (value < 18.5) return { label: 'Underweight', color: 'amber' };
      return { label: 'Healthy', color: 'green' };
    case 'heart_rate':
      if (value > 100) return { label: 'Elevated', color: 'red' };
      if (value < 60) return { label: 'Low', color: 'amber' };
      return { label: 'Normal', color: 'green' };
    case 'glucose':
      if (value >= 126) return { label: 'Diabetic Range', color: 'red' };
      if (value >= 100) return { label: 'Pre-diabetic', color: 'amber' };
      if (value < 70) return { label: 'Low', color: 'amber' };
      return { label: 'Normal', color: 'green' };
    case 'pulse_pressure':
      if (value > 80) return { label: 'Elevated', color: 'red' };
      if (value > 60) return { label: 'High', color: 'amber' };
      if (value < 25) return { label: 'Low', color: 'amber' };
      return { label: 'Normal', color: 'green' };
    default:
      return { label: 'Normal', color: 'green' };
  }
}

function badgeClass(color: string) {
  if (color === 'red') return 'bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400';
  if (color === 'amber') return 'bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500';
  return 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
}

function riskColor(level: string) {
  if (level === 'high') return '#dc2626';
  if (level === 'moderate') return '#f59e0b';
  return '#16a34a';
}

function riskTextClass(level: string) {
  if (level === 'high') return 'text-red-600';
  if (level === 'moderate') return 'text-amber-500';
  return 'text-green-600';
}

function riskLabel(level: string) {
  if (level === 'high') return 'High Risk';
  if (level === 'moderate') return 'Moderate Risk';
  return 'Low Risk';
}

function generateAnalysis(a: Assessment): string[] {
  const lines: string[] = [];
  const elevated: string[] = [];

  if (a.cholesterol >= 240) elevated.push('cholesterol (Elevated)');
  else if (a.cholesterol >= 200) elevated.push('cholesterol (Borderline)');
  if (a.bmi >= 30) elevated.push('BMI (Obese)');
  else if (a.bmi >= 25) elevated.push('BMI (Overweight)');
  if (a.heart_rate > 100) elevated.push('heart rate (Elevated)');
  if (a.glucose >= 126) elevated.push('blood glucose (Diabetic Range)');
  else if (a.glucose >= 100) elevated.push('blood glucose (Pre-diabetic)');
  if (a.pulse_pressure > 80) elevated.push('pulse pressure (Elevated)');
  else if (a.pulse_pressure > 60) elevated.push('pulse pressure (High)');

  if (a.risk_level === 'high') {
    lines.push(
      `Based on your clinical data, the AI has identified a significant elevation in cardiovascular risk markers. ${elevated.length > 0 ? `The primary drivers are: ${elevated.join(', ')}.` : ''}`
    );
    lines.push(
      'The combination of these metabolic markers suggests an increased risk of arterial stress. Immediate lifestyle adjustments and medical consultation are strongly recommended.'
    );
  } else if (a.risk_level === 'moderate') {
    lines.push(
      `Your assessment shows a moderate cardiovascular risk profile. ${elevated.length > 0 ? `The following metrics are outside the optimal range: ${elevated.join(', ')}.` : 'Most metrics are within acceptable range.'}`
    );
    lines.push(
      'Proactive lifestyle changes — including dietary adjustments and regular aerobic exercise — can meaningfully reduce your risk score over the coming months.'
    );
  } else {
    lines.push(
      `Your cardiovascular markers are predominantly within healthy ranges. ${elevated.length > 0 ? `Minor concerns noted for: ${elevated.join(', ')}. ` : ''}This is an excellent baseline to maintain.`
    );
    lines.push(
      'Continue your current healthy habits and schedule routine check-ins every 6–12 months to keep your risk profile in the optimal range.'
    );
  }
  return lines;
}

function generateRecommendation(level: string): string {
  if (level === 'high') return 'Schedule a follow-up with a cardiologist within the next 14 days to discuss lipid-lowering therapy and lifestyle intervention.';
  if (level === 'moderate') return 'Review your diet and exercise plan with your GP. Consider a lipid panel retest in 3 months to track progress.';
  return 'Maintain your current routine. Schedule a routine check-up annually and retake this assessment in 6 months.';
}

function getRecommendationCards(a: Assessment) {
  const cards = [];
  const isHighRisk = a.risk_level === 'high';
  const isMod = a.risk_level === 'moderate';
  const bgClass = isHighRisk
    ? 'bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50'
    : isMod
    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/50'
    : 'bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900/50';
  const iconClass = isHighRisk ? 'text-red-500' : isMod ? 'text-amber-500' : 'text-green-600';

  if (a.cholesterol >= 200 || a.bmi >= 25 || a.glucose >= 100) {
    cards.push({
      icon: 'restaurant', title: 'Diet Plan',
      desc: a.cholesterol >= 200
        ? 'Adopt a low-saturated-fat diet. Increase soluble fibre (oats, legumes) and omega-3 fatty acids to help reduce LDL cholesterol.'
        : 'Maintain a heart-healthy diet rich in vegetables, whole grains, and lean proteins.',
    });
  } else {
    cards.push({
      icon: 'restaurant', title: 'Diet', desc: 'Your dietary markers are healthy. Continue a balanced diet with plenty of fruits, vegetables, and whole grains.'
    });
  }

  cards.push({
    icon: 'fitness_center', title: 'Exercise',
    desc: a.bmi >= 25 || a.risk_level !== 'low'
      ? '150 min of moderate aerobic activity per week. Focus on Zone 2 training to improve cardiovascular efficiency and metabolic health.'
      : 'Maintain your active lifestyle. 150 min/week of moderate exercise is excellent for long-term heart health.',
  });

  cards.push({
    icon: 'self_improvement', title: 'Lifestyle',
    desc: 'Ensure 7–9 hours of quality sleep per night. Manage stress through mindfulness or relaxation techniques — chronic stress significantly raises cardiovascular risk.',
  });

  cards.push({
    icon: 'medical_services', title: 'Medical',
    desc: generateRecommendation(a.risk_level),
  });

  return cards.map(c => ({ ...c, bgClass, iconClass }));
}

const RiskReportPage: React.FC<RiskReportPageProps> = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const initial = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?';

  useEffect(() => {
    fetch('/api/assessment/latest', { credentials: 'include' })
      .then(r => r.json())
      .then(data => {
        if (!data.assessment) navigate('/dashboard');
        else setAssessment(parseAssessment(data.assessment));
      })
      .catch(() => setError('Failed to load your report. Please refresh.'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!assessment) return null;

  const circumference = 502;
  const analysisLines = generateAnalysis(assessment);
  const recommendations = getRecommendationCards(assessment);

  const metrics = [
    { key: 'cholesterol', label: 'Cholesterol', value: assessment.cholesterol, unit: 'mg/dL', type: 'cholesterol' },
    { key: 'bmi', label: 'BMI', value: assessment.bmi, unit: 'kg/m²', type: 'bmi' },
    { key: 'heart_rate', label: 'Heart Rate', value: assessment.heart_rate, unit: 'bpm', type: 'heart_rate' },
    { key: 'glucose', label: 'Glucose', value: assessment.glucose, unit: 'mg/dL', type: 'glucose' },
    { key: 'pulse_pressure', label: 'Pulse Pressure', value: assessment.pulse_pressure, unit: 'mmHg', type: 'pulse_pressure' },
    { key: 'ecg', label: 'ECG', value: null, unit: '', type: 'ecg' },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="size-10 flex items-center justify-center hover:scale-105 transition-transform">
            <img src={brandAssets.logo} alt="HeartGuard Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-slate-900 dark:text-white text-xl font-black leading-tight tracking-tight">HeartGuard</h2>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Medical AI</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="hidden md:flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined mr-2 text-lg">dashboard</span>Dashboard
          </button>
          <div className="size-10 rounded-full border-2 border-primary/20 cursor-pointer overflow-hidden bg-primary flex items-center justify-center text-white font-bold text-sm">
            {initial}
          </div>
        </div>
      </header>

      <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
        {error ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 max-w-lg mx-auto mt-8">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : (
          <motion.div
            className="flex flex-col max-w-[1024px] flex-1 gap-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >

            {/* Title Row */}
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Risk Assessment Report</h1>
                <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  Generated on {new Date(assessment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} · ID: HG-{assessment.id.slice(0, 6).toUpperCase()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined mr-2">download</span>Download PDF
                </button>
              </div>
            </motion.div>

            {/* Risk Score + AI Findings */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Gauge */}
              <motion.div variants={fadeUp} className="lg:col-span-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-6">Calculated Risk Score</p>

                <div className="relative flex items-center justify-center size-48 mb-6">
                  <svg className="size-full transform -rotate-90">
                    <circle className="text-slate-100 dark:text-slate-800" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12" />
                    <motion.circle
                      cx="96" cy="96" fill="transparent" r="80"
                      stroke={riskColor(assessment.risk_level)}
                      strokeDasharray={circumference}
                      strokeLinecap="round"
                      strokeWidth="12"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (circumference * assessment.risk_score / 100) }}
                      transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className={`text-5xl font-black leading-none ${riskTextClass(assessment.risk_level)}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      {assessment.risk_score}%
                    </motion.span>
                    <span className={`font-bold text-sm mt-1 uppercase ${riskTextClass(assessment.risk_level)}`}>
                      {riskLabel(assessment.risk_level)}
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-2">
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-600" />
                  <div className="flex w-full justify-between px-1 text-[10px] font-bold text-slate-400 uppercase">
                    <span>Low</span><span>Moderate</span><span className={riskTextClass(assessment.risk_level)}>High</span>
                  </div>
                </div>
              </motion.div>

              {/* AI Findings */}
              <motion.div variants={fadeUp} className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Analysis Findings</h3>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  {analysisLines.map((line, i) => <p key={i}>{line}</p>)}
                  <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary mt-4">
                    <p className="text-sm italic font-medium text-slate-700 dark:text-slate-200">
                      "{generateRecommendation(assessment.risk_level)}"
                    </p>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Metric Breakdown */}
            <motion.section variants={fadeUp}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-1">Metric Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {metrics.map(m => {
                  if (m.key === 'ecg') {
                    const hasEcg = !!assessment.ecg_file_url;
                    return (
                      <div key="ecg" className="flex flex-col bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                        <span className="text-slate-400 text-xs font-bold uppercase mb-2">ECG</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white mt-1">{hasEcg ? 'On file' : 'N/A'}</span>
                        <span className={`mt-3 px-2 py-1 rounded-full text-[10px] font-bold w-fit uppercase ${hasEcg ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          {hasEcg ? 'Uploaded' : 'Not provided'}
                        </span>
                      </div>
                    );
                  }
                  const status = getMetricStatus(m.type, m.value as number);
                  return (
                    <div key={m.key} className="flex flex-col bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-slate-400 text-xs font-bold uppercase mb-2">{m.label}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {m.value} <span className="text-xs font-medium text-slate-500">{m.unit}</span>
                      </span>
                      <span className={`mt-3 px-2 py-1 rounded-full text-[10px] font-bold w-fit uppercase ${badgeClass(status.color)}`}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* Recommendations */}
            <motion.section variants={fadeUp}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-1">Personalised Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendations.map((r, i) => (
                  <div key={i} className={`flex flex-col p-6 rounded-xl border hover:-translate-y-1 transition-transform ${r.bgClass}`}>
                    <span className={`material-symbols-outlined mb-3 text-2xl ${r.iconClass}`}>{r.icon}</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">{r.title}</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{r.desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Action Buttons */}
            <motion.section variants={fadeUp} className="flex flex-col md:flex-row gap-4 py-6 border-t border-slate-200 dark:border-slate-800 mt-4">
              <button
                onClick={() => navigate('/chatbot')}
                className="flex-1 flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined mr-2">chat_bubble</span>Talk to AI Specialist
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex items-center justify-center rounded-lg h-12 px-6 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-base hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">arrow_back</span>Back to Dashboard
              </button>
            </motion.section>

          </motion.div>
        )}
      </main>

      <footer className="mt-auto flex flex-col items-center gap-4 py-10 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
          <span className="material-symbols-outlined text-sm">lock</span>
          Your health data is encrypted using AES-256 standards.
        </div>
        <p className="text-slate-500 text-[10px] max-w-2xl px-6 leading-relaxed">
          Disclaimer: This AI-powered report is for informational purposes only and does not constitute medical advice. Always seek the advice of your physician or other qualified health provider.
        </p>
        <div className="text-slate-400 text-xs pt-4">© 2024 HeartGuard Medical Systems Inc. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default RiskReportPage;
