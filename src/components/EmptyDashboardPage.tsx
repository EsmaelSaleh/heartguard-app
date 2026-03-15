import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { avatars, brandAssets } from '../data/mockData';

export interface EmptyDashboardPageProps {}

const EmptyDashboardPage: React.FC<EmptyDashboardPageProps> = () => {
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
            <span className="text-primary font-semibold text-sm cursor-pointer">Dashboard</span>
          </nav>
          
          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-6">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
              <img className="h-full w-full object-cover" alt="User profile picture" src={avatars.dashboardUser} />
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 max-w-[1280px] mx-auto w-full p-6 space-y-8">
        
        {/* Welcome Section */}
        <motion.div 
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Welcome back, Alex</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Your health data is synced and up to date as of 9:41 AM.</p>
            </div>
          </div>
        </motion.div>
        
        {/* Empty State Card */}
        <motion.div 
          className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-5xl text-primary" style={{fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 48"}}>monitor_heart</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">No Health Data Yet</h2>
          <p className="max-w-md text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
            Complete your baseline heart health assessment to unlock personalized insights, trend tracking, and risk analysis powered by AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
            <button 
              onClick={() => navigate('/risk-assessment/vitals')}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
              Start Assessment
            </button>
            <button 
              onClick={() => navigate('/chatbot')}
              className="flex-1 flex items-center justify-center gap-2 bg-primary/5 border-2 border-primary/20 text-primary px-8 py-4 rounded-xl font-bold text-sm hover:bg-primary/10 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-xl" style={{fontVariationSettings: "'FILL' 1"}}>smart_toy</span>
              Ask AI Assistant
            </button>
          </div>
        </motion.div>
        
      </main>
      
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 px-6 py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
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

export default EmptyDashboardPage;
