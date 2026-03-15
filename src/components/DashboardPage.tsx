import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { avatars, brandAssets } from '../data/mockData';

export interface DashboardPageProps {}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const DashboardPage: React.FC<DashboardPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light font-display text-slate-900 min-h-screen relative flex w-full flex-col overflow-x-hidden">
      
      {/* Header/Navigation */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
          <div className="flex items-center justify-center p-0 size-10">
            <img src={brandAssets.logo} alt="HeartGuard Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">HeartGuard</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex">
            <span className="text-primary font-semibold text-sm cursor-pointer border-b-2 border-primary py-1">Dashboard</span>
          </nav>
          
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20 cursor-pointer">
              <img className="h-full w-full object-cover" alt="User profile picture" src={avatars.dashboardUser} />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full p-6 space-y-8">
        
        {/* Welcome Section */}
        <motion.div 
          className="flex flex-col gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Welcome back, Alex</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Your health data is synced and up to date as of 9:41 AM.</p>
            </div>
            
            <div className="flex flex-wrap gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => navigate('/risk-assessment/vitals')}
                className="flex-1 min-w-[250px] flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                <span className="material-symbols-outlined text-xl">restart_alt</span>
                Take Risk Assessment
              </button>
              <button 
                onClick={() => navigate('/chatbot')}
                className="flex-1 min-w-[250px] flex items-center justify-center gap-2 bg-primary/5 dark:bg-slate-800 border-2 border-primary/20 dark:border-slate-700 text-primary px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-primary/10 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"}}>smart_toy</span> 
                Ask AI Assistant
              </button>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            {/* Top Row: Risk Score and Latest Results */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Risk Score Gauge */}
              <motion.div variants={fadeUp} className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center text-center">
                <div className="flex items-center justify-between w-full mb-8">
                  <h3 className="font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest">Heart Health Risk</h3>
                  <span className="material-symbols-outlined text-primary cursor-help" title="Risk Score based on your recent tests">info</span>
                </div>
                
                <div className="relative flex items-center justify-center mb-8">
                  <svg className="w-56 h-56 transform -rotate-90">
                    <circle className="text-slate-100 dark:text-slate-800" cx="112" cy="112" fill="transparent" r="104" stroke="currentColor" strokeWidth="12"></circle>
                    <motion.circle 
                      className="text-primary" 
                      cx="112" 
                      cy="112" 
                      fill="transparent" 
                      r="104" 
                      stroke="currentColor" 
                      strokeDasharray="653.45" 
                      strokeLinecap="round" 
                      strokeWidth="12"
                      initial={{ strokeDashoffset: 653.45 }}
                      animate={{ strokeDashoffset: 653.45 - (653.45 * 0.25) }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    ></motion.circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      className="text-6xl font-black text-primary"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >25</motion.span>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1 uppercase">Optimal</span>
                  </div>
                </div>
                
                <div className="w-full flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 px-2">
                  <span>LOW</span>
                  <span>MEDIUM</span>
                  <span>HIGH</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="h-full w-1/3 bg-green-500/30"></div>
                  <div className="h-full w-1/3 bg-yellow-500/30"></div>
                  <div className="h-full w-1/3 bg-red-500/30"></div>
                </div>
                
                <p className="mt-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Your risk score has decreased by <span className="text-primary font-bold">4 points</span> since last month. Keep up the cardio!
                </p>
              </motion.div>

              {/* Health Overview / Latest Results */}
              <motion.div variants={fadeUp} className="lg:col-span-8 flex flex-col gap-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 px-1">Latest Test Results</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  
                  {/* Cholesterol */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Cholesterol</p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">142</span>
                      <span className="text-xs text-slate-400">mg/dL</span>
                    </div>
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 w-fit px-2 py-1 rounded-full">NORMAL</div>
                  </div>
                  
                  {/* BMI */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">BMI</p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">23.4</span>
                      <span className="text-xs text-slate-400">kg/m²</span>
                    </div>
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 w-fit px-2 py-1 rounded-full">HEALTHY</div>
                  </div>
                  
                  {/* Heart Rate */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Heart Rate</p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">72</span>
                      <span className="text-xs text-slate-400">bpm</span>
                    </div>
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 w-fit px-2 py-1 rounded-full">STABLE</div>
                  </div>
                  
                  {/* Glucose */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Glucose</p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">98</span>
                      <span className="text-xs text-slate-400">mg/dL</span>
                    </div>
                    <div className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 w-fit px-2 py-1 rounded-full">OPTIMAL</div>
                  </div>
                  
                  {/* Pulse Pressure */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary/30 transition-colors">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Pulse Pressure</p>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">43</span>
                      <span className="text-xs text-slate-400">mmHg</span>
                    </div>
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 w-fit px-2 py-1 rounded-full">NORMAL</div>
                  </div>
                  
                  {/* ECG Classification */}
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between hover:border-primary/30 transition-colors">
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">ECG Classification</p>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">Normal Rhythm</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-green-600 bg-green-50 dark:bg-green-500/10 w-fit px-2 py-1 rounded-full uppercase">Normal</div>
                  </div>
                  
                </div>
              </motion.div>
            </div>

            {/* Historical Trends Graph (Full Width) */}
            <motion.div variants={fadeUp} className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
                <div>
                  <h3 className="font-bold text-xl text-slate-900 dark:text-slate-100">Historical Trends Analysis</h3>
                  <p className="text-slate-500 text-sm mt-1">Monitoring multi-metric progression over the last 6 months</p>
                </div>
                
                <div className="flex flex-wrap gap-6 items-center">
                  <div className="flex gap-4 text-[11px] font-bold">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-primary rounded-full"></span>
                      <span className="text-slate-600 dark:text-slate-400">Blood Pressure</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="text-slate-600 dark:text-slate-400">Cholesterol</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
                      <span className="text-slate-600 dark:text-slate-400">Glucose</span>
                    </div>
                  </div>
                  
                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
                    <button className="px-5 py-2 text-xs font-bold bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg shadow-sm">6 Months</button>
                    <button className="px-5 py-2 text-xs font-bold text-slate-500">1 Year</button>
                    <button className="px-5 py-2 text-xs font-bold text-slate-500">All Time</button>
                  </div>
                </div>
              </div>

              <div className="h-80 w-full relative px-2">
                {/* SVG Graph using hardcoded values based on the HTML provided */}
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
                  <line stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" x1="0" x2="800" y1="0" y2="0"></line>
                  <line stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" x1="0" x2="800" y1="50" y2="50"></line>
                  <line stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" x1="0" x2="800" y1="100" y2="100"></line>
                  <line stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" x1="0" x2="800" y1="150" y2="150"></line>
                  <line stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" x1="0" x2="800" y1="200" y2="200"></line>
                  
                  <motion.path 
                    d="M0 120 Q 150 80, 300 100 T 500 60 T 800 90" 
                    fill="none" 
                    stroke="#093FB4" 
                    strokeLinecap="round" 
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                  ></motion.path>
                  <motion.path 
                    d="M0 160 Q 200 140, 400 150 T 600 130 T 800 145" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeLinecap="round" 
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.7 }}
                  ></motion.path>
                  <motion.path 
                    d="M0 80 Q 250 110, 450 70 T 650 90 T 800 60" 
                    fill="none" 
                    stroke="#f59e0b" 
                    strokeLinecap="round" 
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.9 }}
                  ></motion.path>
                </svg>

                <div className="absolute -bottom-10 w-full flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>January</span>
                  <span>February</span>
                  <span>March</span>
                  <span>April</span>
                  <span>May</span>
                  <span>June</span>
                </div>
              </div>
              
              <div className="mt-16 flex justify-end">
                <button 
                  onClick={() => navigate('/risk-report')}
                  className="flex items-center gap-2 text-primary font-bold text-sm hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">analytics</span>
                  Detailed Analysis Report
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
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
