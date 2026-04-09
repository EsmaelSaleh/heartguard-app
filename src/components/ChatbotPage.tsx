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

const suggestedPrompts = [
  'What foods are good for my heart?',
  'How much exercise do I need weekly?',
  'What are early signs of heart disease?',
  'How does stress affect the heart?',
  'Is high blood pressure dangerous?',
  'Can I reverse heart disease with diet?',
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
  const [clearError, setClearError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const firstName = user?.full_name ? user.full_name.split(' ')[0] : user?.email?.split('@')[0] ?? 'User';
  const initial = user?.full_name
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?';

  useEffect(() => {
    fetch('/api/chat/messages', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setMessages(data.messages || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
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
    if (!window.confirm('Start a new chat? This will clear your current conversation history.')) return;
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
      <aside className="w-72 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-background-dark/50 hidden md:flex flex-col">

        {/* Logo */}
        <div className="p-6 border-b border-primary/5">
          <div className="flex items-center gap-3 cursor-pointer mb-6" onClick={() => navigate('/dashboard')}>
            <div className="size-10 flex items-center justify-center">
              <img src={brandAssets.logo} alt="HeartGuard Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-primary text-xl font-bold leading-tight">HeartGuard</h1>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Heart Health AI</p>
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-3 px-4 font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Conversation</span>
          </button>
          {clearError && <p className="text-xs text-red-500 mt-2 text-center">{clearError}</p>}
        </div>

        {/* Topics */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Common Topics</p>
          <div className="space-y-1">
            {[
              { icon: 'restaurant', label: 'Diet & Nutrition' },
              { icon: 'fitness_center', label: 'Exercise & Activity' },
              { icon: 'monitor_heart', label: 'Heart Conditions' },
              { icon: 'medication', label: 'Medications' },
              { icon: 'self_improvement', label: 'Stress & Mental Health' },
              { icon: 'smoking_rooms', label: 'Smoking & Lifestyle' },
            ].map(({ icon, label }) => (
              <button
                key={label}
                onClick={() => handleSend(`Tell me about ${label.toLowerCase()} and heart health`)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium text-left"
              >
                <span className="material-symbols-outlined text-lg shrink-0">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile */}
        <div className="p-4 border-t border-primary/5 bg-slate-50/50 dark:bg-transparent">
          <div
            className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
                <h2 className="text-sm md:text-base font-bold text-primary">Heart Health Assistant</h2>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] md:text-[10px] font-bold uppercase shrink-0">Online</span>
              </div>
              <p className="text-[11px] md:text-xs text-slate-500 font-medium">Ask me anything about cardiovascular health</p>
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
              className="flex flex-col items-center justify-center py-12 text-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Hello, {firstName}! How can I help?
              </h3>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                Ask me anything about heart health — diet, exercise, symptoms, medications, or how to reduce your cardiovascular risk.
              </p>

              <div className="flex flex-wrap justify-center gap-2 pt-4 max-w-xl">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="px-4 py-2 rounded-full border border-primary/20 bg-white dark:bg-slate-800 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
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
                <div className={`size-8 md:size-10 rounded-full flex-shrink-0 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm ${msg.role === 'assistant' ? 'bg-red-100' : 'bg-primary'}`}>
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
                    {msg.role === 'assistant' ? 'Heart Health AI' : 'You'} · {formatTime(msg.created_at)}
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

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 px-4 md:px-8 pb-6 md:pb-8 pt-2 md:pt-4 max-w-4xl mx-auto w-full bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm z-20">
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl md:rounded-3xl border border-primary/10 shadow-xl shadow-primary/5 p-1.5 md:p-2 flex items-center gap-1 md:gap-2 group focus-within:ring-2 ring-primary/20 transition-all">
            <input
              className="flex-1 border-none focus:ring-0 text-sm md:text-base bg-transparent placeholder:text-slate-400 py-3 md:py-4 px-2 outline-none"
              placeholder="Ask a heart health question..."
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
            For informational purposes only — always consult a doctor for medical advice.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ChatbotPage;
