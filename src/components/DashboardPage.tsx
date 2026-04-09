import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { brandAssets } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

interface Assessment {
  id: string;
  user_id: string;
  cholesterol: number;
  bmi: number;
  heart_rate: number;
  glucose: number;
  pulse_pressure: number;
  ecg_file_url: string | null;
  ecg_classification: string | null;
  risk_score: number;
  risk_level: 'low' | 'moderate' | 'high';
  created_at: string;
}

function shortEcgLabel(cls: string | null): { short: string; detail: string } | null {
  if (!cls) return null;
  const c = cls.toLowerCase();
  if (c.includes('history') || c.includes('hist')) return { short: 'MI History', detail: cls };
  if (c.includes('infarction') || (c.includes('mi') && !c.includes('history'))) return { short: 'Infarction', detail: cls };
  if (c.includes('abnormal') || c.includes('arrhythmia')) return { short: 'Arrhythmia', detail: cls };
  if (c.includes('normal')) return { short: 'Normal', detail: cls };
  return { short: cls, detail: cls };
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

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
      return { label: 'Stable', color: 'green' };
    case 'glucose':
      if (value >= 126) return { label: 'High', color: 'red' };
      if (value >= 100) return { label: 'Pre-diabetic', color: 'amber' };
      if (value < 70) return { label: 'Low', color: 'amber' };
      return { label: 'Optimal', color: 'green' };
    case 'pulse_pressure':
      if (value > 80) return { label: 'Elevated', color: 'red' };
      if (value > 60) return { label: 'High', color: 'amber' };
      if (value < 25) return { label: 'Low', color: 'amber' };
      return { label: 'Normal', color: 'green' };
    default:
      return { label: 'Normal', color: 'green' };
  }
}

function statusBadgeClass(color: string) {
  if (color === 'red') return 'text-red-600 bg-red-50 dark:bg-red-500/10';
  if (color === 'amber') return 'text-amber-600 bg-amber-50 dark:bg-amber-500/10';
  return 'text-green-600 bg-green-50 dark:bg-green-500/10';
}

function riskColor(level: string) {
  if (level === 'high') return 'text-red-600';
  if (level === 'moderate') return 'text-amber-500';
  return 'text-green-600';
}

function riskStrokeClass(level: string) {
  if (level === 'high') return '#dc2626';
  if (level === 'moderate') return '#f59e0b';
  return '#16a34a';
}

function riskLabel(level: string) {
  if (level === 'high') return 'High Risk';
  if (level === 'moderate') return 'Moderate';
  return 'Optimal';
}

function buildTrendPath(assessments: Assessment[], width: number, height: number): string {
  if (assessments.length < 2) return '';
  const pts = [...assessments].reverse().slice(0, 6);
  const n = pts.length;
  return pts
    .map((a, i) => {
      const x = (i / (n - 1)) * width;
      const y = height - (a.risk_score / 100) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [latest, setLatest] = useState<Assessment | null | undefined>(undefined);
  const [history, setHistory] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : user?.email?.split('@')[0] ?? 'there';

  useEffect(() => {
    Promise.all([
      fetch('/api/assessment/latest', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/assessment/history', { credentials: 'include' }).then(r => r.json()),
    ])
      .then(([latestData, historyData]) => {
        setLatest(latestData.assessment ? parseAssessment(latestData.assessment) : null);
        setHistory((historyData.assessments ?? []).map(parseAssessment));
      })
      .catch(() => setError('Failed to load your health data. Please refresh.'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const circumference = 653.45;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
          <p className="text-slate-500 text-sm">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen relative flex w-full flex-col overflow-x-hidden dark:bg-background-dark dark:text-slate-100">

      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="flex items-center justify-center p-0 size-10">
            <img src={brandAssets.logo} alt="HeartGuard Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">HeartGuard</h2>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden md:flex">
            <span className="text-primary font-semibold text-sm border-b-2 border-primary py-1">Dashboard</span>
          </nav>

          <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{firstName}</span>
              <span className="text-xs text-slate-400">{user?.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Sign out"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="mx-6 mt-4 flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <main className="flex-1 max-w-[1280px] mx-auto w-full p-6 space-y-8">

        {/* Welcome Row */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Welcome back, {firstName}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {latest
                ? `Last assessment: ${formatDate(latest.created_at)}`
                : 'Complete your first assessment to see your heart health insights.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <button
              onClick={() => navigate('/risk-assessment/vitals')}
              className="flex-1 min-w-[220px] flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-xl">restart_alt</span>
              {latest ? 'Retake Assessment' : 'Start Assessment'}
            </button>
            <button
              onClick={() => navigate('/chatbot')}
              className="flex-1 min-w-[220px] flex items-center justify-center gap-2 bg-primary/5 dark:bg-slate-800 border-2 border-primary/20 dark:border-slate-700 text-primary px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-primary/10 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              Ask AI Assistant
            </button>
          </div>
        </motion.div>

        {/* No assessment empty state */}
        {!latest && !error && (
          <motion.div
            className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}>monitor_heart</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">No Health Data Yet</h2>
            <p className="max-w-md text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
              Complete your baseline heart health assessment to unlock personalised insights, trend tracking, and AI-powered risk analysis.
            </p>
            <button
              onClick={() => navigate('/risk-assessment/vitals')}
              className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
              Start Your First Assessment
            </button>
          </motion.div>
        )}

        {/* Full dashboard — only when assessment exists */}
        {latest && (
          <motion.div
            className="flex flex-col gap-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {/* Row: Gauge + Metric Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Risk Score Gauge */}
              <motion.div variants={fadeUp} className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-between w-full mb-8">
                  <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest">Heart Health Risk</h3>
                  <span className="material-symbols-outlined text-primary cursor-help" title="Risk score based on clinical thresholds">info</span>
                </div>

                <div className="relative flex items-center justify-center mb-8">
                  <svg className="w-56 h-56 transform -rotate-90" ref={svgRef}>
                    <circle className="text-slate-100 dark:text-slate-800" cx="112" cy="112" fill="transparent" r="104" stroke="currentColor" strokeWidth="12" />
                    <motion.circle
                      cx="112"
                      cy="112"
                      fill="transparent"
                      r="104"
                      stroke={riskStrokeClass(latest.risk_level)}
                      strokeDasharray={circumference}
                      strokeLinecap="round"
                      strokeWidth="12"
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: circumference - (circumference * latest.risk_score / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className={`text-6xl font-black ${riskColor(latest.risk_level)}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      {latest.risk_score}
                    </motion.span>
                    <span className={`text-sm font-bold mt-1 uppercase ${riskColor(latest.risk_level)}`}>
                      {riskLabel(latest.risk_level)}
                    </span>
                  </div>
                </div>

                <div className="w-full flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 px-2">
                  <span>LOW</span><span>MEDIUM</span><span>HIGH</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full w-1/3 bg-green-500/40" />
                  <div className="h-full w-1/3 bg-amber-400/40" />
                  <div className="h-full w-1/3 bg-red-500/40" />
                </div>

                <p className="mt-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {history.length >= 2
                    ? (() => {
                        const prev = history[1]?.risk_score;
                        const diff = latest.risk_score - prev;
                        if (diff < 0) return `Score improved by ${Math.abs(diff)} points since last assessment.`;
                        if (diff > 0) return `Score increased by ${diff} points since last assessment.`;
                        return 'Score unchanged since your last assessment.';
                      })()
                    : 'Complete another assessment to track your progress over time.'}
                </p>
              </motion.div>

              {/* Metric Cards */}
              <motion.div variants={fadeUp} className="lg:col-span-8 flex flex-col gap-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 px-1">Latest Test Results</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'cholesterol', label: 'Cholesterol', value: latest.cholesterol, unit: 'mg/dL', type: 'cholesterol' },
                    { key: 'bmi', label: 'BMI', value: latest.bmi, unit: 'kg/m²', type: 'bmi' },
                    { key: 'heart_rate', label: 'Heart Rate', value: latest.heart_rate, unit: 'bpm', type: 'heart_rate' },
                    { key: 'glucose', label: 'Glucose', value: latest.glucose, unit: 'mg/dL', type: 'glucose' },
                    { key: 'pulse_pressure', label: 'Pulse Pressure', value: latest.pulse_pressure, unit: 'mmHg', type: 'pulse_pressure' },
                  ].map(m => {
                    const status = getMetricStatus(m.type, m.value);
                    return (
                      <div key={m.key} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">{m.label}</p>
                        <div className="flex items-baseline gap-1 mb-3">
                          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{m.value}</span>
                          <span className="text-xs text-slate-400">{m.unit}</span>
                        </div>
                        <div className={`text-[10px] font-bold w-fit px-2 py-1 rounded-full ${statusBadgeClass(status.color)}`}>
                          {status.label.toUpperCase()}
                        </div>
                      </div>
                    );
                  })}

                  {/* ECG Card */}
                  {(() => {
                    const ecg = shortEcgLabel(latest.ecg_classification);
                    return (
                      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-primary/30 transition-colors">
                        <div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">ECG Status</p>
                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">
                              {ecg ? ecg.short : 'On File'}
                            </span>
                          </div>
                          {ecg && ecg.short !== ecg.detail && (
                            <p className="text-[10px] text-slate-400 leading-snug mb-2">{ecg.detail}</p>
                          )}
                        </div>
                        <div className="text-[10px] font-bold w-fit px-2 py-1 rounded-full uppercase text-green-600 bg-green-50 dark:bg-green-500/10">
                          On File
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            </div>

            {/* Historical Trends Chart */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
                <div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">Risk Score Trend</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {history.length >= 2
                      ? `Tracking your risk score across ${Math.min(history.length, 6)} assessments`
                      : 'Take more assessments to track your progress over time'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="w-3 h-3 rounded-full" style={{ background: riskStrokeClass(latest.risk_level) }} />
                    <span className="text-slate-600 dark:text-slate-400">Risk Score</span>
                  </div>
                </div>
              </div>

              {history.length >= 2 ? (
                <div className="h-64 w-full relative px-2">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                    {/* Grid lines */}
                    {[0, 50, 100, 150, 200].map(y => (
                      <line key={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" x1="0" x2="800" y1={y} y2={y} />
                    ))}
                    {/* Y-axis labels */}
                    {[100, 66, 33, 0].map(v => (
                      <text key={v} x="-8" y={200 - v * 2} className="text-[9px] fill-slate-400" textAnchor="end" dominantBaseline="middle">{v}</text>
                    ))}

                    {/* Risk zone bands */}
                    <rect x="0" y="0" width="800" height={200 - 66 * 2} fill="#fef2f2" fillOpacity="0.4" />
                    <rect x="0" y={200 - 66 * 2} width="800" height={(66 - 33) * 2} fill="#fffbeb" fillOpacity="0.4" />
                    <rect x="0" y={200 - 33 * 2} width="800" height={33 * 2} fill="#f0fdf4" fillOpacity="0.4" />

                    {/* Trend line */}
                    <motion.path
                      d={buildTrendPath(history, 800, 200)}
                      fill="none"
                      stroke={riskStrokeClass(latest.risk_level)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                    />

                    {/* Data points */}
                    {[...history].reverse().slice(0, 6).map((a, i, arr) => {
                      const x = arr.length === 1 ? 400 : (i / (arr.length - 1)) * 800;
                      const y = 200 - (a.risk_score / 100) * 200;
                      return (
                        <circle key={a.id} cx={x} cy={y} r="6" fill="white" stroke={riskStrokeClass(latest.risk_level)} strokeWidth="3">
                          <title>{`${formatDate(a.created_at)}: ${a.risk_score}`}</title>
                        </circle>
                      );
                    })}
                  </svg>

                  {/* X-axis dates */}
                  <div className="absolute -bottom-8 w-full flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    {[...history].reverse().slice(0, 6).map(a => (
                      <span key={a.id}>{formatDate(a.created_at)}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center gap-3 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-200 dark:text-slate-700">show_chart</span>
                  <p className="text-sm text-slate-400">Take another assessment to see your risk trend over time.</p>
                </div>
              )}

              <div className="mt-16 flex justify-end">
                <button
                  onClick={() => navigate('/risk-report')}
                  className="flex items-center gap-2 text-primary font-bold text-sm hover:underline"
                >
                  <span className="material-symbols-outlined text-lg">analytics</span>
                  View Full Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800 px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
        <p>© 2024 HeartGuard AI Health Monitoring. Not a substitute for professional medical advice.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</a>
          <a className="hover:text-primary transition-colors cursor-pointer">Terms of Service</a>
          <a className="hover:text-primary transition-colors cursor-pointer">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default DashboardPage;
