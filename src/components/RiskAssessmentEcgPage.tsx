import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { brandAssets, avatars } from '../data/mockData';

export interface RiskAssessmentEcgPageProps {}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const guidelines = [
  { title: "Ensure good lighting", desc: "Avoid shadows or glare on the paper surface." },
  { title: "Capture the full strip", desc: "All wave patterns and text must be visible." },
  { title: "Lay paper flat", desc: "Avoid folds or creases that distort the lines." },
  { title: "High resolution", desc: "Use a minimum of 12MP camera for clear details." }
];

const RiskAssessmentEcgPage: React.FC<RiskAssessmentEcgPageProps> = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleNext = () => {
    navigate('/risk-report');
  };

  const handleBack = () => {
    navigate('/risk-assessment/vitals');
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
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Step 2 of 2</span>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">ECG Analysis</h3>
                </div>
                <span className="text-sm font-semibold text-slate-500">100% Complete</span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full" 
                  initial={{ width: "50%" }}
                  animate={{ width: "100%" }}
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
                <h1 className="text-slate-900 dark:text-slate-100 text-2xl font-bold mb-2">Upload ECG Report</h1>
                <p className="text-slate-500 text-base">Our AI analysis requires a clear image of your most recent Electrocardiogram (ECG) strip or digital report to identify potential irregularities.</p>
              </motion.div>
              
              <div className="p-6 md:p-8 flex flex-col gap-6">
                
                {/* Upload Area */}
                <motion.div variants={fadeUp} className="flex flex-col mb-4">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept="image/jpeg,image/png,application/pdf"
                  />
                  <div 
                    className={`flex flex-col items-center gap-6 rounded-xl border-2 border-dashed bg-slate-50 dark:bg-slate-800/50 px-6 py-10 md:py-16 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group ${selectedFile ? 'border-primary bg-primary/5' : 'border-slate-300 dark:border-slate-700'}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-4xl">{selectedFile ? 'check_circle' : 'cloud_upload'}</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-slate-900 dark:text-slate-100 text-lg font-bold text-center">
                        {selectedFile ? selectedFile.name : 'Tap to upload or drag image here'}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                        {selectedFile ? `Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Supported formats: JPG, PNG, PDF (Max 10MB)'}
                      </p>
                    </div>
                    {!selectedFile && (
                      <button className="flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-white text-sm font-bold shadow-md hover:bg-primary/90 transition-colors">
                        Select File
                      </button>
                    )}
                  </div>
                </motion.div>

                {/* Guidelines Section */}
                <motion.div variants={fadeUp} className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                  <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">info</span> 
                    Scanning Guidelines
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guidelines.map((guide, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                        <span className="material-symbols-outlined text-green-600 mt-0.5 text-lg">check_circle</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{guide.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{guide.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Form Footer / Actions */}
                <motion.div variants={fadeUp} className="mt-4 flex flex-col gap-4 pt-4">
                  <button 
                    onClick={handleNext}
                    disabled={!selectedFile}
                    className={`w-full h-16 flex items-center justify-center gap-2 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98] ${selectedFile ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none'}`}
                  >
                    <span>Predict Risk</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                  <button 
                    onClick={handleBack}
                    className="w-full h-12 flex items-center justify-center gap-2 bg-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span> 
                    <span>Back to Vitals</span>
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

export default RiskAssessmentEcgPage;
