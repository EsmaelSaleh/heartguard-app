import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { avatars, brandAssets } from '../data/mockData';

export interface ChatbotPageProps {}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const initialMessages = [
  {
    role: "assistant",
    time: "10:25 AM",
    avatar: avatars.chatbotAiMsg1,
    content: (
      <>
        <p className="text-sm leading-relaxed">Hello Alex! I've analyzed your recent lab results from yesterday. I noticed your LDL cholesterol is slightly above the target range (142 mg/dL).</p>
        <p className="text-sm leading-relaxed mt-3">Would you like to discuss dietary changes, or should I explain what these numbers mean for your overall risk score?</p>
      </>
    )
  },
  {
    role: "user",
    time: "10:27 AM",
    avatar: avatars.chatbotUserMsg,
    content: (
      <p className="text-sm leading-relaxed">I'm a bit concerned about that LDL number. How can I reduce my cholesterol through my diet before my next checkup?</p>
    )
  },
  {
    role: "assistant",
    time: "Just now",
    avatar: avatars.chatbotAiMsg2,
    content: (
      <>
        <p className="text-sm leading-relaxed">That's a great proactive approach. Based on your profile, here are three key dietary adjustments recommended by the AHA:</p>
        <ul className="mt-4 space-y-3">
          <li className="flex gap-3 text-sm">
            <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
            <span>Increase soluble fiber (oats, beans, lentils)</span>
          </li>
          <li className="flex gap-3 text-sm">
            <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
            <span>Swap saturated fats for unsaturated fats (olive oil, avocados)</span>
          </li>
          <li className="flex gap-3 text-sm">
            <span className="material-symbols-outlined text-green-500 text-lg">check_circle</span>
            <span>Incorporate fatty fish twice a week</span>
          </li>
        </ul>
      </>
    )
  }
];

const suggestedPrompts = [
  "Show me a heart-healthy meal plan",
  "Explain my risk score",
  "Can I exercise with high LDL?"
];

const ChatbotPage: React.FC<ChatbotPageProps> = () => {
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(initialMessages);

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      time: 'Just now',
      avatar: avatars.chatbotUserMsg,
      content: <p className="text-sm leading-relaxed">{inputText}</p>
    }]);
    
    setInputText('');
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        time: 'Just now',
        avatar: avatars.chatbotAiMsg2,
        content: <p className="text-sm leading-relaxed">I have noted your question. As an AI assistant, I can help you find relevant health information based on clinical guidelines. Would you like me to elaborate further on this topic?</p>
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInputText(prompt);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative flex w-full overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className="w-80 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-primary/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="size-10 rounded-xl flex items-center justify-center p-0">
              <img src={brandAssets.logo} alt="HeartGuard Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-primary text-xl font-bold leading-tight">HeartGuard</h1>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Digital Health AI</p>
            </div>
          </div>
          <button className="mt-8 w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 px-4 font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Consultation</span>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Recent History</p>
          
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/5 border border-primary/10 cursor-pointer">
            <span className="material-symbols-outlined text-primary">chat_bubble</span>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold truncate text-primary">Cholesterol Management</p>
              <p className="text-[11px] text-primary/70">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">history</span>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">Risk Assessment Result</p>
              <p className="text-[11px] text-slate-500">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">history</span>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">Daily Exercise Routine</p>
              <p className="text-[11px] text-slate-500">3 days ago</p>
            </div>
          </div>
        </div>
        
        {/* Sidebar Bottom Profile */}
        <div className="p-4 border-t border-primary/5 bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <div className="relative">
              <img className="size-10 rounded-full object-cover" alt="User profile" src={avatars.chatbotSidebarUser} />
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Alex Johnson</p>
              <p className="text-[11px] text-slate-500">Premium Member</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">settings</span>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark relative h-full">
        
        {/* Header */}
        <header className="h-20 shrink-0 border-b border-primary/5 px-4 md:px-8 flex items-center justify-between bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10 w-full">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="size-10 md:size-12 rounded-full bg-red-100 flex items-center justify-center relative overflow-hidden shrink-0">
              <img className="w-full h-full object-cover opacity-90" alt="Medical professional avatar icon" src={avatars.chatbotAiHeader} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-bold text-primary">HeartGuard AI Assistant</h2>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] md:text-[10px] font-bold uppercase shrink-0">Online</span>
              </div>
              <p className="text-[11px] md:text-xs text-slate-500 font-medium">Verified Medical Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-3">
            <button className="hidden sm:block p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">info</span>
            </button>
            <div className="hidden sm:block h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 md:mx-2"></div>
            <button 
              onClick={() => navigate('/dashboard-results')}
              className="flex items-center gap-1 md:gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              <span className="material-symbols-outlined text-sm md:text-base">chevron_left</span>
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </header>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto w-full">
          
          {/* System Time */}
          <div className="flex justify-center">
            <span className="text-[10px] md:text-[11px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-tighter">
              Today, 10:24 AM
            </span>
          </div>

          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}
            >
              <div className={`size-8 md:size-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm overflow-hidden ${msg.role === 'assistant' ? 'bg-red-100 text-primary' : 'bg-primary/10'}`}>
                <img 
                  className="w-full h-full object-cover" 
                  alt={msg.role === 'assistant' ? 'AI assistant avatar' : 'User avatar'} 
                  src={msg.avatar} 
                />
              </div>
              
              <div className={`flex flex-col gap-1 md:gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div 
                  className={`p-3 md:p-4 rounded-xl shadow-sm ${
                    msg.role === 'assistant' 
                      ? 'bg-white dark:bg-slate-800 rounded-tl-none border border-primary/5' 
                      : 'bg-primary text-white rounded-tr-none shadow-primary/20'
                  }`}
                >
                  {msg.content}
                </div>
                <p className={`text-[9px] md:text-[10px] text-slate-400 font-medium ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                  {msg.role === 'assistant' ? 'HeartGuard AI' : 'Read'} • {msg.time}
                </p>
              </div>
            </motion.div>
          ))}

          {/* Suggested Prompts */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 pt-4"
          >
            {suggestedPrompts.map((prompt, idx) => (
              <button 
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-primary/20 bg-white dark:bg-slate-800 text-primary dark:text-primary text-[10px] md:text-xs font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </motion.div>
          
        </div>

        {/* Input Area */}
        <div className="shrink-0 px-4 md:px-8 pb-6 md:pb-8 pt-2 md:pt-4 max-w-4xl mx-auto w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm relative z-20">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 p-1.5 md:p-2 flex items-center gap-1 md:gap-2 group focus-within:ring-2 ring-primary/20 transition-all">
            <button className="p-2 md:p-3 text-slate-400 hover:text-primary transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined text-xl md:text-2xl">attach_file</span>
            </button>
            
            <input 
              className="flex-1 border-none focus:ring-0 text-sm md:text-base bg-transparent placeholder:text-slate-400 py-3 md:py-4 px-2 outline-none" 
              placeholder="Describe your symptoms or ask a heart-health question..." 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            
            <button className="hidden sm:block p-2 md:p-3 text-slate-400 hover:text-primary transition-colors rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined text-xl md:text-2xl">mic</span>
            </button>
            
            <button 
              onClick={handleSend}
              className={`size-10 md:size-12 rounded-xl flex items-center justify-center transition-all shadow-lg ${inputText.trim() ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:scale-105 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 shadow-none'}`}
            >
              <span className="material-symbols-outlined text-xl md:text-2xl ml-1">send</span>
            </button>
          </div>
          
          <p className="text-center text-[9px] md:text-[10px] text-slate-400 mt-3 md:mt-4 font-medium uppercase tracking-widest hidden sm:block">
            HeartGuard AI is for informational purposes. Always consult with a doctor for medical emergencies.
          </p>
        </div>
        
      </main>

      {/* Right Insights Sidebar (Optional but adds to medical aesthetic) */}
      <aside className="w-72 border-l border-primary/10 bg-white dark:bg-background-dark/50 p-6 flex-col gap-6 hidden xl:flex shrink-0">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Current Health Score</h3>
          <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 border border-primary/10 flex flex-col items-center">
            <div className="relative size-24 flex items-center justify-center">
              <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <circle className="stroke-slate-200 dark:stroke-slate-700" cx="18" cy="18" fill="none" r="16" strokeWidth="2"></circle>
                <circle className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="78, 100" strokeLinecap="round" strokeWidth="2"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-primary">78</span>
                <span className="text-[8px] text-slate-500 font-bold uppercase">Fair</span>
              </div>
            </div>
            <p className="text-[11px] text-center text-slate-500 mt-3 font-medium">Your score increased by 4% this month</p>
          </div>
        </motion.div>
        
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Vital Signs</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-500 text-lg">favorite</span>
                <span className="text-xs font-semibold">BPM</span>
              </div>
              <span className="text-xs font-bold">72</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-blue-500 text-lg">water_drop</span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Blood Pressure</span>
              </div>
              <span className="text-xs font-bold">118/79</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div className="mt-auto" variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50 hover:-translate-y-1 transition-transform cursor-pointer shadow-sm shadow-red-500/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-slate-700 dark:text-slate-300 text-sm">tips_and_updates</span>
              <h4 className="text-[11px] font-bold text-slate-900 dark:text-slate-100 uppercase">Pro Tip</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">Take a 10-minute walk after lunch to help regulate your blood sugar and cardiovascular flow.</p>
          </div>
        </motion.div>
      </aside>
      
    </div>
  );
};

export default ChatbotPage;
