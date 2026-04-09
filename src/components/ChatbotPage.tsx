import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { brandAssets } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

export interface ChatbotPageProps {}

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
}

interface LatestAssessment {
  heart_rate: number;
  pulse_pressure: number;
  risk_score: number;
  risk_level: string;
  cholesterol: number;
  glucose: number;
  bmi: number;
}

const suggestedPrompts = [
  'Show me a heart-healthy meal plan',
  'Explain my risk score',
  'Can I exercise with high cholesterol?',
  'What does high glucose mean?',
];

function formatTime(iso?: string): string {
  if (!iso) return 'Just now';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const ChatbotPage: React.FC<ChatbotPageProps> = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAssessment, setLatestAssessment] = useState<LatestAssessment | null>(null);
  const [clearError, setClearError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : user?.email?.split('@')[0] ?? 'User';
  const initial = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?';

  useEffect(() => {
    Promise.all([
      fetch('/api/chat/messages', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/assessment/latest', { credentials: 'include' }).then(r => r.json()),
    ]).then(([chatData, assessmentData]) => {
      setMessages(chatData.messages || []);
      if (assessmentData.assessment) {
        const raw = assessmentData.assessment;
        setLatestAssessment({
          ...raw,
          heart_rate: Math.round(Number(raw.heart_rate)),
          pulse_pressure: Math.round(Number(raw.pulse_pressure)),
          glucose: Math.round(Number(raw.glucose)),
          cholesterol: Math.round(Number(raw.cholesterol)),
          bmi: Math.round(Number(raw.bmi) * 10) / 10,
          risk_score: Math.round(Number(raw.risk_score)),
        });
      }
    }).catch(() => {}).finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = (text ?? inputText).trim();
    if (!content || isSending) return;

    const optimisticMsg: Message = { role: 'user', content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(prev => [...prev, data.message]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I was unable to process your message. Please try again.' }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Start a new consultation? This will clear your current chat history.')) return;
    try {
      await fetch('/api/chat/messages', { method: 'DELETE', credentials: 'include' });
      setMessages([]);
      setClearError('');
    } catch {
      setClearError('Failed to clear chat.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen relative flex w-full overflow-hidden" style={{ height: '100dvh' }}>

      {/* Left Sidebar */}
      <aside className="w-80 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden md:flex flex-col">
        <div className="p-6 border-b border-primary/5">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="size-10 flex items-center justify-center">
              <img src={brandAssets.logo} alt="HeartGuard Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-primary text-xl font-bold leading-tight">HeartGuard</h1>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Digital Health AI</p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="mt-8 w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 px-4 font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Consultation</span>
          </button>
          {clearError && <p className="text-xs text-red-500 mt-2 text-center">{clearError}</p>}
        </div>

        {/* Latest Vitals Panel */}
        {latestAssessment && (
          <div className="px-4 pt-5 pb-3">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Latest Vitals</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-rose-500 text-lg">favorite</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Heart Rate</span>
                </div>
                <span className="text-xs font-bold">{latestAssessment.heart_rate} BPM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-500 text-lg">water_drop</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pulse Pressure</span>
                </div>
                <span className="text-xs font-bold">{latestAssessment.pulse_pressure} mmHg</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-500 text-lg">glucose</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Glucose</span>
                </div>
                <span className="text-xs font-bold">{latestAssessment.glucose} mg/dL</span>
              </div>
            </div>
          </div>
        )}

        {/* Risk Score Mini Panel */}
        {latestAssessment && (
          <div className="px-4 pb-4">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Risk Score</p>
            <div className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-4 border border-primary/10 flex flex-col items-center">
              <div className="relative size-24 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle className="stroke-slate-200 dark:stroke-slate-700" cx="18" cy="18" fill="none" r="16" strokeWidth="2" />
                  <circle
                    className="stroke-primary"
                    cx="18" cy="18" fill="none" r="16"
                    strokeDasharray={`${latestAssessment.risk_score}, 100`}
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-primary">{latestAssessment.risk_score}</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase">{latestAssessment.risk_level}</span>
                </div>
              </div>
              <p className="text-[11px] text-center text-slate-500 mt-3 font-medium">Your latest cardiovascular risk score</p>
            </div>
          </div>
        )}

        {/* Profile */}
        <div className="mt-auto p-4 border-t border-primary/5 bg-slate-50/50 dark:bg-transparent">
          <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={async () => { await logout(); navigate('/login'); }}
          >
            <div className="relative">
              <div className="size-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">
                {initial}
              </div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{firstName}</p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 hover:text-red-500 transition-colors" title="Sign out">logout</span>
          </div>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col bg-background-light dark:bg-background-dark relative overflow-hidden">

        {/* Chat Header */}
        <header className="h-20 shrink-0 border-b border-primary/5 px-4 md:px-8 flex items-center justify-between bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="size-10 md:size-12 rounded-full bg-red-100 flex items-center justify-center overflow-hidden shrink-0">
              <span className="material-symbols-outlined text-red-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm md:text-base font-bold text-primary">HeartGuard AI Assistant</h2>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] md:text-[10px] font-bold uppercase shrink-0">Online</span>
              </div>
              <p className="text-[11px] md:text-xs text-slate-500 font-medium">Clinical Health Intelligence</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1 md:gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <span className="material-symbols-outlined text-sm">chevron_left</span>
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">

          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!isLoading && messages.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-16 text-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Hello, {firstName}! How can I help?
              </h3>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                Ask me anything about your heart health, your risk score, or general cardiovascular wellness.
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 md:gap-4 max-w-[90%] md:max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}
              >
                <div className={`size-8 md:size-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm overflow-hidden ${msg.role === 'assistant' ? 'bg-red-100' : 'bg-primary'}`}>
                  {msg.role === 'assistant' ? (
                    <span className="material-symbols-outlined text-red-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  ) : (
                    <span className="text-white font-bold text-xs">{initial}</span>
                  )}
                </div>

                <div className={`flex flex-col gap-1 md:gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-3 md:p-4 rounded-xl shadow-sm ${msg.role === 'assistant' ? 'bg-white dark:bg-slate-800 rounded-tl-none border border-primary/5' : 'bg-primary text-white rounded-tr-none shadow-primary/20'}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className={`text-[9px] md:text-[10px] text-slate-400 font-medium ${msg.role === 'user' ? 'mr-1' : 'ml-1'}`}>
                    {msg.role === 'assistant' ? 'HeartGuard AI' : 'You'} · {formatTime(msg.created_at)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Sending indicator */}
          {isSending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%]"
            >
              <div className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-500 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl rounded-tl-none border border-primary/5 p-4 shadow-sm flex items-center gap-1">
                {[0, 0.2, 0.4].map(d => (
                  <motion.div key={d} className="w-2 h-2 bg-primary/40 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Suggested prompts — show when empty */}
          {!isLoading && messages.length === 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {suggestedPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  className="px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-primary/20 bg-white dark:bg-slate-800 text-primary text-[10px] md:text-xs font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 md:px-8 pb-6 md:pb-8 pt-2 md:pt-4 max-w-4xl mx-auto w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm z-20">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 p-1.5 md:p-2 flex items-center gap-1 md:gap-2 group focus-within:ring-2 ring-primary/20 transition-all">
            <input
              className="flex-1 border-none focus:ring-0 text-sm md:text-base bg-transparent placeholder:text-slate-400 py-3 md:py-4 px-2 outline-none"
              placeholder="Describe your symptoms or ask a heart-health question..."
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputText.trim() || isSending}
              className={`size-10 md:size-12 rounded-xl flex items-center justify-center transition-all shadow-lg ${inputText.trim() && !isSending ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:scale-105 active:scale-95' : 'bg-slate-200 dark:bg-slate-700 text-slate-400 shadow-none'}`}
            >
              <span className="material-symbols-outlined text-xl md:text-2xl ml-1">send</span>
            </button>
          </div>
          <p className="text-center text-[9px] md:text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest hidden sm:block">
            HeartGuard AI is for informational purposes. Always consult a doctor for medical emergencies.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChatbotPage;
