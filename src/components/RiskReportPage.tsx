import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { avatars, brandAssets } from '../data/mockData';

export interface RiskReportPageProps {}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const RiskReportPage: React.FC<RiskReportPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative flex w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        
        {/* Header Section */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-3 text-primary cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-10 flex items-center justify-center p-0 hover:scale-105 transition-transform">
              <img src={brandAssets.logo} alt="HeartGuard Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-slate-900 dark:text-white text-xl font-black leading-tight tracking-tight">HeartGuard</h2>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Medical AI</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard-results')}
              className="hidden md:flex items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <span className="material-symbols-outlined mr-2 text-lg">dashboard</span> Dashboard
            </button>
            <div className="size-10 rounded-full border-2 border-primary/20 cursor-pointer overflow-hidden">
              <img className="h-full w-full object-cover" alt="User profile avatar portrait" src={avatars.riskReportUser} />
            </div>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-8 px-4 md:px-10">
          <motion.div 
            className="layout-content-container flex flex-col max-w-[1024px] flex-1 gap-8"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            
            {/* Report Title */}
            <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black tracking-tight">Risk Assessment Report</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">calendar_today</span> 
                  Generated on Oct 24, 2023 • ID: HG-99281-X
                </p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity active:scale-95">
                  <span className="material-symbols-outlined mr-2">download</span> 
                  Download PDF
                </button>
              </div>
            </motion.div>

            {/* Main Risk Score Visual & AI Findings */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <motion.div variants={fadeUp} className="lg:col-span-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-6">Calculated Risk Score</p>
                
                <div className="relative flex items-center justify-center size-48 mb-6">
                  <svg className="size-full transform -rotate-90">
                    <circle className="text-slate-100 dark:text-slate-800" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
                    <motion.circle 
                      className="text-red-600" 
                      cx="96" 
                      cy="96" 
                      fill="transparent" 
                      r="80" 
                      stroke="currentColor" 
                      strokeDasharray="502" 
                      strokeLinecap="round" 
                      strokeWidth="12"
                      initial={{ strokeDashoffset: 502 }}
                      animate={{ strokeDashoffset: 502 - (502 * 0.68) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    ></motion.circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      className="text-5xl font-black text-slate-900 dark:text-white leading-none"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >68%</motion.span>
                    <span className="text-red-600 font-bold text-sm mt-1 uppercase">High Risk</span>
                  </div>
                </div>
                
                <div className="w-full flex flex-col gap-2">
                  <div className="h-2 w-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-400 to-red-600"></div>
                  <div className="flex w-full justify-between px-1 text-[10px] font-bold text-slate-400 uppercase">
                    <span>Low</span>
                    <span>Moderate</span>
                    <span className="text-red-600">High</span>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Analysis Findings</h3>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                  <p>Based on your clinical data, the AI has identified a <span className="font-bold text-red-600">significant elevation</span> in cardiovascular risk markers. The primary drivers are your LDL Cholesterol levels and resting heart rate combined with pulse pressure trends.</p>
                  <p>While your BMI is in the overweight category, the synergy between metabolic markers suggests a need for immediate lifestyle adjustments to prevent arterial thickening.</p>
                  <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary mt-4">
                    <p className="text-sm italic font-medium text-slate-700 dark:text-slate-200">
                      "Recommendation: Schedule a follow-up with a cardiologist within the next 14 days to discuss lipid-lowering therapy."
                    </p>
                  </div>
                </div>
              </motion.div>
              
            </section>

            {/* Metric Breakdown Grid */}
            <motion.section variants={fadeUp}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-1">Metric Breakdown</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                
                <div className="flex flex-col bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-2">Cholesterol</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">240 <span className="text-xs font-medium text-slate-500">mg/dL</span></span>
                  <span className="mt-3 px-2 py-1 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold w-fit uppercase">Elevated</span>
                </div>
                
                <div className="flex flex-col bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-2">BMI</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">28.5 <span className="text-xs font-medium text-slate-500">kg/m²</span></span>
                  <span className="mt-3 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold w-fit uppercase">Overweight</span>
                </div>
                
                <div className="flex flex-col bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-2">Heart Rate</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">82 <span className="text-xs font-medium text-slate-500">bpm</span></span>
                  <span className="mt-3 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold w-fit uppercase">Normal</span>
                </div>
                
                <div className="flex flex-col bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-2">Glucose</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">105 <span className="text-xs font-medium text-slate-500">mg/dL</span></span>
                  <span className="mt-3 px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-bold w-fit uppercase">Elevated</span>
                </div>
                
                <div className="flex flex-col bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-2">Pulse Pressure</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">55 <span className="text-xs font-medium text-slate-500">mmHg</span></span>
                  <span className="mt-3 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold w-fit uppercase">Normal</span>
                </div>
                
                <div className="flex flex-col bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-slate-400 text-xs font-bold uppercase mb-2">ECG</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white mt-1">Normal</span>
                  <span className="mt-3 px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold w-fit uppercase">Normal</span>
                </div>
                
              </div>
            </motion.section>

            {/* Personalized Recommendations */}
            <motion.section variants={fadeUp}>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 px-1">Personalized Recommendations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="flex flex-col p-6 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-red-500 mb-3 text-2xl">restaurant</span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Diet Plan</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Switch to a DASH diet. Reduce sodium intake to under 2,300mg daily.</p>
                </div>
                
                <div className="flex flex-col p-6 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-red-500 mb-3 text-2xl">fitness_center</span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Exercise</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">150 min of moderate aerobic activity weekly. Focus on Zone 2 training.</p>
                </div>
                
                <div className="flex flex-col p-6 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-red-500 mb-3 text-2xl">self_improvement</span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Lifestyle</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Ensure 7-9 hours of quality sleep. Monitor stress levels using your wearable.</p>
                </div>
                
                <div className="flex flex-col p-6 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50 hover:-translate-y-1 transition-transform">
                  <span className="material-symbols-outlined text-red-500 mb-3 text-2xl">medical_services</span>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-2">Medical</h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">Full blood lipid panel screening required. Consult GP for Statins review.</p>
                </div>
                
              </div>
            </motion.section>

            {/* Action Buttons */}
            <motion.section variants={fadeUp} className="flex flex-col md:flex-row gap-4 py-6 border-t border-slate-200 dark:border-slate-800 mt-4">
              <button 
                onClick={() => navigate('/chatbot')}
                className="flex-1 flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white font-bold text-base shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined mr-2">chat_bubble</span> Talk to AI Specialist
              </button>
              <button 
                onClick={() => navigate('/dashboard-results')}
                className="flex-1 flex items-center justify-center rounded-lg h-12 px-6 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-base hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined mr-2">arrow_back</span> Back to Dashboard
              </button>
            </motion.section>

          </motion.div>
        </main>

        {/* Footer */}
        <footer className="mt-auto flex flex-col items-center gap-4 py-10 border-t border-slate-200 dark:border-slate-800 text-center">
          <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <span className="material-symbols-outlined text-sm">lock</span>
            Your health data is encrypted using AES-256 standards. 
          </div>
          <p className="text-slate-500 dark:text-slate-500 text-[10px] max-w-2xl px-6 leading-relaxed">
            Disclaimer: This AI-powered report is for informational purposes only and does not constitute medical advice. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
          </p>
          <div className="text-slate-400 dark:text-slate-600 text-xs pt-4 w-full">
            © 2024 HeartGuard Medical Systems Inc. All rights reserved.
          </div>
        </footer>
        
      </div>
    </div>
  );
};

export default RiskReportPage;
