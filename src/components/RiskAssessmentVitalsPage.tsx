import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { avatars, brandAssets } from '../data/mockData';

export interface RiskAssessmentVitalsPageProps {}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const RiskAssessmentVitalsPage: React.FC<RiskAssessmentVitalsPageProps> = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cholesterol: '',
    bmi: '',
    heartRate: '',
    glucose: '',
    pulsePressure: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    navigate('/risk-assessment/ecg');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display relative flex h-auto w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        
        {/* Header Section */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-10 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4 text-primary cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-10 flex items-center justify-center p-0">
              <img src={brandAssets.logo} alt="HeartGuard Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">HeartGuard</h2>
          </div>
          <div className="flex flex-1 justify-end gap-4 items-center">
            <div className="hidden md:block text-right">
              <p className="text-xs text-slate-500 font-medium">Clinically Verified</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Assessment Portal</p>
            </div>
            <div className="bg-slate-200 dark:bg-slate-700 rounded-full size-10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
              <img className="w-full h-full object-cover" alt="User profile avatar" src={avatars.riskAssessmentUser} />
            </div>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-8 px-4 md:px-0">
          <div className="layout-content-container flex flex-col max-w-[640px] flex-1">
            
            {/* Progress Section */}
            <motion.div 
              className="mb-8 flex flex-col gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Step 1 of 2</span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Health Metrics</h3>
                </div>
                <span className="text-sm font-semibold text-slate-500">50% Complete</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full" 
                  initial={{ width: "25%" }}
                  animate={{ width: "50%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>

            {/* Main Form Card */}
            <motion.div 
              className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <motion.div variants={fadeUp} className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-bold mb-2">Heart Risk Assessment</h1>
                <p className="text-slate-500 text-base">Enter your current health metrics below to receive an updated heart disease risk prediction.</p>
              </motion.div>
              
              <div className="p-6 md:p-8 flex flex-col gap-6">
                
                {/* Input: Cholesterol */}
                <motion.div variants={fadeUp} className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold uppercase tracking-wide">Total Cholesterol</label>
                    <span className="material-symbols-outlined text-slate-400 cursor-help text-[20px]" title="Standard range: 125 to 200 mg/dL">info</span>
                  </div>
                  <div className="relative">
                    <input 
                      name="cholesterol" 
                      value={formData.cholesterol}
                      onChange={handleChange}
                      className="w-full h-14 pl-4 pr-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" 
                      placeholder="e.g. 180" 
                      type="number"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">mg/dL</span>
                  </div>
                </motion.div>

                {/* Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* BMI */}
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold uppercase tracking-wide">BMI</label>
                      <span className="material-symbols-outlined text-slate-400 cursor-help text-[20px]" title="Body Mass Index (Normal: 18.5–24.9)">info</span>
                    </div>
                    <div className="relative">
                      <input 
                        name="bmi" 
                        value={formData.bmi}
                        onChange={handleChange}
                        className="w-full h-14 pl-4 pr-12 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" 
                        placeholder="24.5" 
                        step="0.1" 
                        type="number"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kg/m²</span>
                    </div>
                  </motion.div>

                  {/* Heart Rate */}
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold uppercase tracking-wide">Heart Rate</label>
                      <span className="material-symbols-outlined text-slate-400 cursor-help text-[20px]" title="Resting heart rate in beats per minute">info</span>
                    </div>
                    <div className="relative">
                      <input 
                        name="heartRate" 
                        value={formData.heartRate}
                        onChange={handleChange}
                        className="w-full h-14 pl-4 pr-14 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" 
                        placeholder="72" 
                        type="number"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">BPM</span>
                    </div>
                  </motion.div>

                  {/* Glucose */}
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold uppercase tracking-wide">Glucose</label>
                      <span className="material-symbols-outlined text-slate-400 cursor-help text-[20px]" title="Fasting blood sugar level">info</span>
                    </div>
                    <div className="relative">
                      <input 
                        name="glucose" 
                        value={formData.glucose}
                        onChange={handleChange}
                        className="w-full h-14 pl-4 pr-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" 
                        placeholder="95" 
                        type="number"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">mg/dL</span>
                    </div>
                  </motion.div>

                  {/* Pulse Pressure */}
                  <motion.div variants={fadeUp} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-slate-700 dark:text-slate-300 text-sm font-semibold uppercase tracking-wide">Pulse Pressure</label>
                      <span className="material-symbols-outlined text-slate-400 cursor-help text-[20px]" title="Difference between systolic and diastolic blood pressure">info</span>
                    </div>
                    <div className="relative">
                      <input 
                        name="pulsePressure" 
                        value={formData.pulsePressure}
                        onChange={handleChange}
                        className="w-full h-14 pl-4 pr-18 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-lg font-medium" 
                        placeholder="40" 
                        type="number"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">mmHg</span>
                    </div>
                  </motion.div>
                </div>

                {/* Form Footer / Actions */}
                <motion.div variants={fadeUp} className="mt-4 flex flex-col gap-4">
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <span>Next: Upload ECG</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <button 
                    onClick={() => navigate('/dashboard')}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span> 
                    <span>Back to Dashboard</span>
                  </button>
                </motion.div>
                
              </div>
            </motion.div>

            {/* Bottom Info */}
            <motion.div 
              className="mt-8 px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-slate-400 text-xs leading-relaxed">
                Disclaimer: HeartGuard is a screening tool and does not provide medical diagnosis. Always consult with a qualified healthcare professional for medical advice, diagnosis, or treatment. 
                <a className="text-primary hover:underline font-medium ml-1 cursor-pointer">Learn more about our methodology.</a>
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RiskAssessmentVitalsPage;
