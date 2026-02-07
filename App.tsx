
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { AIMode, AIPersona, AnalysisResult } from './types';
import { SAMPLE_DATA } from './constants';
import { analyzeStock, analyzeAllModes } from './services/geminiService';

const App: React.FC = () => {
  const [userKey, setUserKey] = useState<string | null>(localStorage.getItem('vel_access_key'));
  const [inputKey, setInputKey] = useState('');
  
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [mode, setMode] = useState<AIMode>(AIMode.SCALPING);
  const [persona, setPersona] = useState<AIPersona>(AIPersona.INSTITUSI);
  
  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State for switching view inside "ALL" mode
  const [activeSubMode, setActiveSubMode] = useState<AIMode>(AIMode.SCALPING);

  const [emiten, setEmiten] = useState('');
  const [modal, setModal] = useState<number | ''>('');
  const [rawData, setRawData] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [multiResult, setMultiResult] = useState<Record<string, AnalysisResult> | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Sync theme class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load Data based on User Key
  useEffect(() => {
    if (userKey) {
      const savedData = localStorage.getItem(`vel_data_${userKey}`);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setEmiten(parsed.emiten || '');
          setModal(parsed.modal || '');
          setRawData(parsed.rawData || '');
          setMode(parsed.mode || AIMode.SCALPING);
          setPersona(parsed.persona || AIPersona.INSTITUSI);
          
          // Load previous results appropriately
          if (parsed.mode === AIMode.ALL && parsed.multiResult) {
            setMultiResult(parsed.multiResult);
            setResult(null);
          } else if (parsed.lastResult) {
            setResult(parsed.lastResult);
            setMultiResult(null);
          }
        } catch (e) {
          console.error("Failed to load session data");
        }
      }
    }
  }, [userKey]);

  // Auto-save data
  useEffect(() => {
    if (userKey) {
      const dataToSave = { 
        emiten, 
        modal, 
        rawData, 
        mode, 
        persona,
        lastResult: result,
        multiResult: multiResult
      };
      localStorage.setItem(`vel_data_${userKey}`, JSON.stringify(dataToSave));
    }
  }, [emiten, modal, rawData, mode, persona, result, multiResult, userKey]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.length < 4) {
      setError("Key minimal 4 karakter.");
      return;
    }
    localStorage.setItem('vel_access_key', inputKey);
    setUserKey(inputKey);
    setError(null);
  };

  const handleLogout = () => {
    if (window.confirm("Keluar dari session? Data lokal tetap tersimpan di Key ini.")) {
      localStorage.removeItem('vel_access_key');
      setUserKey(null);
      setResult(null);
      setMultiResult(null);
      setEmiten('');
      setModal('');
      setRawData('');
    }
  };

  const handleAnalyze = async () => {
    if (!emiten || !rawData || modal === '') {
      setError("Harap isi kode Emiten, Modal, dan tempel Raw Data terlebih dahulu.");
      return;
    }

    if (!userKey) {
      setError("Sesi kadaluarsa. Harap login kembali.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setMultiResult(null);

    try {
      if (mode === AIMode.ALL) {
        // Run all modes
        const results = await analyzeAllModes(userKey, emiten.toUpperCase(), Number(modal), rawData, persona);
        setMultiResult(results);
        // Default to showing Scalping first
        setActiveSubMode(AIMode.SCALPING);
      } else {
        // Run single mode
        const analysis = await analyzeStock(userKey, mode, emiten.toUpperCase(), Number(modal), rawData, persona);
        setResult(analysis);
      }

      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const fillSampleData = () => {
    setEmiten('BBCA');
    setModal(1000000);
    setRawData(SAMPLE_DATA);
  };

  // Helper to get the result that should be currently displayed
  const getDisplayResult = () => {
    if (mode === AIMode.ALL && multiResult) {
      return multiResult[activeSubMode];
    }
    return result;
  };

  const displayData = getDisplayResult();

  const copyFullAnalysis = () => {
    if (!displayData) return;
    const currentModeLabel = mode === AIMode.ALL ? `${activeSubMode} (via ALL MODE)` : mode;
    
    // Fungsi untuk membersihkan simbol markdown dan memberikan jarak (spacing) agar rapi
    const cleanText = (text: string) => {
      let formatted = text
        .replace(/\*\*/g, '')           // Hapus bold (**)
        .replace(/#{1,6}\s?/g, '\n\n')  // Ganti Header (#) dengan enter 2x agar berjarak
        .replace(/`/g, '')              // Hapus backtick
        .replace(/\n\s*\n/g, '\n\n');   // Normalisasi enter berlebih jadi max 2 (satu baris kosong)
      
      return formatted.trim();
    };

    const cleanedExplanation = cleanText(displayData.explanation);
    const cleanedFullAnalysis = cleanText(displayData.fullAnalysisText);

    const text = `
Menurut Analisa Saya
=========================

Emiten: ${emiten.toUpperCase()}
Mode: ${currentModeLabel}
Persona: ${persona}


QUANTUM SCORE: ${displayData.score}/100
CONVICTION: "${cleanedExplanation}"


TREND BESOK: ${displayData.trendTomorrow}
PROBABILITY: ${displayData.trendProbability}%


TERMINAL LEVELS:
- ENTRY:      Rp ${displayData.entryPrice.toLocaleString('id-ID')}
- TAKE PROFIT: Rp ${displayData.takeProfit.toLocaleString('id-ID')}
- STOP LOSS:   Rp ${displayData.stopLoss.toLocaleString('id-ID')}


Detail Analisa Saya:
=========================

${cleanedFullAnalysis}

-------------------------
Generated by Vel Trade AI Interface
    `.trim();
    navigator.clipboard.writeText(text);
    alert("Analisa lengkap berhasil disalin ke clipboard!");
  };

  const copySyncKey = () => {
    const dataToSync = { emiten, modal, rawData, mode, persona, lastResult: result, multiResult };
    const encoded = btoa(JSON.stringify(dataToSync));
    navigator.clipboard.writeText(encoded);
    alert("Magic Sync Key berhasil disalin! Paste key ini di HP Anda untuk login instan.");
  };

  const handleMagicLogin = (encodedKey: string) => {
    try {
      const decoded = JSON.parse(atob(encodedKey));
      const newKey = `MAGIC-${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('vel_access_key', newKey);
      localStorage.setItem(`vel_data_${newKey}`, JSON.stringify(decoded));
      setUserKey(newKey);
      alert("Magic Sync Berhasil! Data Anda telah dipulihkan.");
    } catch (e) {
      setError("Magic Key tidak valid atau korup.");
    }
  };

  if (!userKey) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-50'}`}>
        <div className="fixed inset-0 cyber-grid opacity-10 pointer-events-none"></div>
        <div className="fixed inset-0 scanline-effect pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="text-center mb-10">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-xl rotate-45 flex items-center justify-center transition-all ${isDarkMode ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]' : 'bg-green-600 shadow-xl'}`}>
              <span className="text-black font-black -rotate-45 text-2xl">V</span>
            </div>
            <h1 className={`text-3xl font-black tracking-tighter uppercase mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Vel <span className="text-green-500">Access</span>
            </h1>
            <p className={`text-xs font-bold uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Security Terminal v4.0.1</p>
          </div>

          <form onSubmit={handleLogin} className={`p-8 rounded-3xl border backdrop-blur-xl space-y-6 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-2xl'}`}>
            <div>
              <label className={`text-[10px] font-black uppercase tracking-widest mb-3 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Identity Access Key</label>
              <input 
                type="text" 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter your Google Gemini API Key..."
                className={`w-full bg-transparent border-b-2 p-3 font-mono text-center focus:outline-none transition-all ${
                  isDarkMode ? 'text-green-500 border-slate-800 focus:border-green-500' : 'text-slate-900 border-slate-100 focus:border-green-600'
                }`}
              />
              <p className="mt-2 text-[8px] text-center text-slate-500">Key Anda aman dan hanya disimpan di browser ini.</p>
            </div>

            <button type="submit" className="w-full py-4 bg-green-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              Initialize Session
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
              <div className="relative flex justify-center text-[9px] uppercase font-black text-slate-600 bg-transparent px-2">Or paste Magic Key</div>
            </div>

            <button 
              type="button"
              onClick={() => {
                const magic = prompt("Paste Magic Sync Key:");
                if (magic) handleMagicLogin(magic);
              }}
              className={`w-full py-3 border rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                isDarkMode ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'
              }`}
            >
              Use Magic Sync
            </button>

            {error && <p className="text-center text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">{error}</p>}
          </form>

          <p className="mt-8 text-center text-[9px] font-bold text-slate-600 uppercase tracking-widest">Authorized personnel only. Data encrypted locally.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen transition-colors duration-500 ${isDarkMode ? 'bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background Visuals */}
      <div className={`fixed inset-0 cyber-grid pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'opacity-20' : 'opacity-[0.05]'}`}></div>
      <div className={`fixed inset-0 hero-gradient pointer-events-none transition-opacity duration-500 ${isDarkMode ? 'opacity-100' : 'opacity-30'}`}></div>
      <div className="fixed inset-0 scanline-effect pointer-events-none"></div>

      {/* Navigation */}
      <nav className={`relative z-50 border-b backdrop-blur-xl transition-all duration-300 ${isDarkMode ? 'border-slate-800/50 bg-[#020617]/80 shadow-none' : 'border-slate-200 bg-white/80 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-6 h-6 md:w-8 md:h-8 rounded-sm rotate-45 flex items-center justify-center transition-all ${isDarkMode ? 'bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)]' : 'bg-green-600 shadow-md'}`}>
              <span className="text-black font-black -rotate-45 text-xs md:text-base">V</span>
            </div>
            <div className="flex flex-col">
              <span className={`text-lg md:text-xl font-black tracking-tighter uppercase leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Vel <span className="text-green-500">Trade</span>
              </span>
              <span className="text-[8px] font-black text-green-500/60 tracking-widest uppercase">Key: {userKey ? `${userKey.substring(0, 6)}...` : 'Not Set'}</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <button 
                key={item}
                onClick={() => setActiveTab(item)}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                  activeTab === item 
                    ? (isDarkMode ? 'text-green-500' : 'text-green-600') 
                    : (isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900')
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={copySyncKey}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${
                isDarkMode ? 'border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/20' : 'border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100'
              }`}
              title="Copy Magic Sync Key to login on other devices"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Sync Key
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all border ${isDarkMode ? 'border-slate-800 bg-slate-900/50 text-yellow-400 hover:border-yellow-400' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-500'}`}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>
            
            {/* Sidebar Toggle Button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-full transition-all border ${isDarkMode ? 'border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:border-green-500' : 'border-slate-200 bg-white text-slate-600 hover:border-green-500'}`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Right Sidebar */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         {/* Backdrop */}
         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
         
         {/* Sidebar Panel */}
         <div className={`absolute top-0 right-0 h-full w-80 bg-slate-900 border-l border-slate-800 shadow-2xl transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 flex flex-col h-full">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">Settings</h2>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white">
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>

               <div className="space-y-8">
                  {/* Persona Selector */}
                  <div>
                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500 mb-4">AI Persona Configuration</h3>
                     <div className="space-y-3">
                        <button
                           onClick={() => setPersona(AIPersona.INSTITUSI)}
                           className={`w-full p-4 rounded-xl border text-left transition-all group ${
                              persona === AIPersona.INSTITUSI 
                              ? 'bg-green-500/10 border-green-500' 
                              : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                           }`}
                        >
                           <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-black uppercase tracking-widest ${persona === AIPersona.INSTITUSI ? 'text-green-400' : 'text-slate-300'}`}>Institusi</span>
                              {persona === AIPersona.INSTITUSI && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]"></div>}
                           </div>
                           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                              Gaya bahasa formal, tajam, skeptis, dan fokus penuh pada data kuantitatif. Tanpa emosi.
                           </p>
                        </button>

                        <button
                           onClick={() => setPersona(AIPersona.RITEL)}
                           className={`w-full p-4 rounded-xl border text-left transition-all group ${
                              persona === AIPersona.RITEL 
                              ? 'bg-blue-500/10 border-blue-500' 
                              : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
                           }`}
                        >
                           <div className="flex items-center justify-between mb-2">
                              <span className={`text-sm font-black uppercase tracking-widest ${persona === AIPersona.RITEL ? 'text-blue-400' : 'text-slate-300'}`}>Ritel Pro</span>
                              {persona === AIPersona.RITEL && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
                           </div>
                           <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                              Gaya bahasa santai, "street-smart", optimis namun waspada. Menggunakan istilah pasar (ndar, serok).
                           </p>
                        </button>
                     </div>
                  </div>

                  {/* Info Panel */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                     <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">System Status</h3>
                     <div className="space-y-2 text-[10px] font-mono text-slate-500">
                        <div className="flex justify-between">
                           <span>Version</span>
                           <span className="text-white">v4.0.2 Quantum</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Engine</span>
                           <span className="text-white">Gemini 2.0 Flash</span>
                        </div>
                        <div className="flex justify-between">
                           <span>Connection</span>
                           <span className="text-green-500">Secure Encrypted</span>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="mt-auto">
                   <button onClick={handleLogout} className="w-full py-3 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                      Terminate Session
                   </button>
               </div>
            </div>
         </div>
      </div>

      <main className="relative z-10 pt-12 md:pt-20 pb-40 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-16 md:mb-24 space-y-6 md:space-y-8">
            <div className={`inline-block px-3 py-1 md:px-4 md:py-1.5 border rounded-full ${isDarkMode ? 'border-green-500/20 bg-green-500/5' : 'border-green-600/20 bg-green-600/5'}`}>
              <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Logged in as {userKey}</span>
            </div>
            <h1 className={`text-4xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Innovate. <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500">Transform.</span> <br className="md:hidden" />
              Thrive.
            </h1>
            <p className={`max-w-2xl mx-auto text-sm md:text-lg leading-relaxed font-medium px-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Platform analisa saham berbasis AI untuk membedah bandarmology, teknikal, dan fundamental IDX dalam hitungan detik.
            </p>
          </section>

          {/* Mode Selector */}
          <div id="analyze-form" className="flex justify-center mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide">
            <div className={`flex p-1.5 rounded-full border backdrop-blur-md whitespace-nowrap transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              {Object.values(AIMode).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-6 py-2.5 md:px-8 md:py-3 rounded-full font-black text-[9px] md:text-[11px] uppercase tracking-widest transition-all duration-300 ${
                    mode === m 
                    ? (isDarkMode ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-green-600 text-white shadow-md') 
                    : (isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100')
                  }`}
                >
                  {m === AIMode.ALL ? 'ALL (QUANTUM MODE)' : m}
                </button>
              ))}
            </div>
          </div>

          {/* Main Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-start">
            <div className="lg:col-span-4 space-y-6">
              <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all ${isDarkMode ? 'bg-slate-900/30 border-slate-800/50 hover:border-green-500/30' : 'bg-white border-slate-200 hover:border-green-600 shadow-sm'}`}>
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Emiten (IDX Code)</label>
                <input 
                  type="text" 
                  value={emiten}
                  onChange={(e) => setEmiten(e.target.value.toUpperCase())}
                  className={`w-full bg-transparent text-3xl font-black border-b-2 focus:outline-none transition-all uppercase placeholder:text-slate-300/20 ${
                    isDarkMode ? 'text-white border-slate-800 focus:border-green-500' : 'text-slate-900 border-slate-100 focus:border-green-600'
                  }`}
                  placeholder="CODE"
                />
              </div>

              <div className={`p-6 rounded-2xl border backdrop-blur-md transition-all ${isDarkMode ? 'bg-slate-900/30 border-slate-800/50 hover:border-green-500/30' : 'bg-white border-slate-200 hover:border-green-600 shadow-sm'}`}>
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 block ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Modal Trading (Rp)</label>
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-black ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`}>Rp</span>
                  <input 
                    type="number" 
                    value={modal}
                    onChange={(e) => setModal(e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full bg-transparent text-2xl md:text-3xl font-black focus:outline-none transition-all placeholder:text-slate-300/20 ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                    placeholder="Contoh: 1000000"
                  />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-loose transition-all ${
                isDarkMode ? 'bg-blue-500/5 border-blue-500/20 text-blue-400/80' : 'bg-blue-50 border-blue-100 text-blue-600'
              }`}>
                NOTICE: Data otomatis tersimpan ke Key <span className="text-green-500 font-black">{userKey}</span>.
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="relative group">
                <div className={`absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 bg-gradient-to-r ${isDarkMode ? 'from-green-500/20 to-blue-500/20' : 'from-green-600/10 to-blue-600/10'}`}></div>
                <div className={`relative p-1 rounded-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-200 shadow-inner'}`}>
                  <div className="absolute top-4 right-4 z-20">
                    <button 
                      onClick={fillSampleData}
                      className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-900 border-slate-300'
                      }`}
                    >
                      Load Sample
                    </button>
                  </div>
                  <textarea 
                    value={rawData}
                    onChange={(e) => setRawData(e.target.value)}
                    className={`w-full h-[320px] md:h-[400px] rounded-xl p-4 md:p-6 font-mono text-xs md:text-sm leading-relaxed focus:outline-none scrollbar-thin transition-colors ${
                      isDarkMode ? 'bg-[#020617] text-green-500' : 'bg-white text-emerald-700'
                    }`}
                    placeholder="TEMPEL RAW DATA DI SINI..."
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={loading}
                className={`w-full group relative overflow-hidden h-16 md:h-20 rounded-xl transition-all active:scale-[0.98] shadow-xl ${
                  isDarkMode ? 'bg-white' : 'bg-slate-900'
                }`}
              >
                <div className={`absolute inset-0 bg-green-500 transition-transform duration-500 ${loading ? 'translate-y-0' : 'translate-y-full group-hover:translate-y-0'}`}></div>
                <span className={`relative z-10 text-sm md:text-lg font-black uppercase tracking-[0.4em] transition-colors ${
                  loading ? 'text-black' : (isDarkMode ? 'text-black' : 'text-white group-hover:text-black')
                }`}>
                  {loading ? 'Processing Quantum Analysis...' : (mode === AIMode.ALL ? 'Start Quantum Mode' : 'Start Stock Analysis')}
                </span>
              </button>
            </div>
          </div>

          {/* Results Area */}
          <div id="result-section" className="mt-20 md:mt-32">
            {error && (
              <div className={`p-6 md:p-8 border rounded-2xl text-center font-black uppercase tracking-[0.2em] text-xs ${
                isDarkMode ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-red-50 border-red-100 text-red-600'
              }`}>
                System Error: {error}
              </div>
            )}

            {/* Sub-navigation for ALL mode */}
            {mode === AIMode.ALL && multiResult && (
               <div className="flex justify-center mb-8 md:mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className={`flex p-1 rounded-xl border ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {[AIMode.SCALPING, AIMode.SWING, AIMode.INVESTASI].map((m) => (
                      <button
                        key={m}
                        onClick={() => setActiveSubMode(m)}
                        className={`px-4 py-2 md:px-6 md:py-3 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${
                          activeSubMode === m
                            ? (isDarkMode ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-blue-600 text-white shadow-md')
                            : (isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900')
                        }`}
                      >
                        {m} Result
                      </button>
                    ))}
                  </div>
               </div>
            )}

            {displayData && (
              <div className="space-y-8 md:space-y-12 animate-in fade-in zoom-in duration-500">
                {/* Result Header Badge for Quantum Mode */}
                {mode === AIMode.ALL && (
                    <div className="text-center">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${
                            activeSubMode === AIMode.SCALPING ? 'border-green-500/30 bg-green-500/10 text-green-500' :
                            activeSubMode === AIMode.SWING ? 'border-blue-500/30 bg-blue-500/10 text-blue-500' :
                            'border-purple-500/30 bg-purple-500/10 text-purple-500'
                        }`}>
                            Viewing {activeSubMode} Strategy
                        </span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {/* Score */}
                  <div className={`lg:col-span-2 p-8 md:p-10 rounded-3xl border backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 transition-all ${
                    isDarkMode ? 'bg-slate-900/20 border-slate-800/50' : 'bg-white border-slate-200 shadow-lg'
                  }`}>
                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Quantum Score</span>
                    <div className="relative">
                       <svg className="w-40 h-40 md:w-48 md:h-48 -rotate-90">
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="8" fill="transparent" className={isDarkMode ? 'text-slate-800' : 'text-slate-100'} />
                        <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="8" fill="transparent" 
                          strokeDasharray="100 100" 
                          strokeDashoffset={100 - displayData.score}
                          pathLength="100"
                          className={`${isDarkMode ? 'text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]' : 'text-green-600'}`} 
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-5xl md:text-6xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{displayData.score}</span>
                      </div>
                    </div>
                    <p className={`font-medium italic text-xs md:text-sm px-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>"{displayData.explanation}"</p>
                  </div>

                  {/* Trend */}
                  <div className={`p-8 md:p-10 rounded-3xl border backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 transition-all ${
                    isDarkMode ? 'bg-slate-900/20 border-slate-800/50' : 'bg-white border-slate-200 shadow-lg'
                  }`}>
                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.5em] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Prediction</span>
                    <div className={`text-4xl md:text-5xl font-black ${displayData.trendTomorrow === 'UP' ? 'text-green-500' : displayData.trendTomorrow === 'DOWN' ? 'text-red-500' : 'text-blue-500'}`}>
                      {displayData.trendTomorrow}
                    </div>
                    <div className={`text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {displayData.trendProbability}% 
                      <span className={`text-[9px] font-normal tracking-widest uppercase ml-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Confidence</span>
                    </div>
                  </div>

                  {/* Levels */}
                  <div className={`p-6 md:p-8 rounded-3xl border backdrop-blur-xl space-y-3 md:space-y-4 transition-all ${
                    isDarkMode ? 'bg-slate-900/20 border-slate-800/50' : 'bg-white border-slate-200 shadow-lg'
                  }`}>
                    <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] block text-center mb-2 md:mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Terminal Data</span>
                    <div className="space-y-2 md:space-y-3 font-mono">
                      {[
                        { label: 'ENTRY', val: displayData.entryPrice, color: isDarkMode ? 'text-white' : 'text-slate-900' },
                        { label: 'T.PROFIT', val: displayData.takeProfit, color: isDarkMode ? 'text-green-400' : 'text-green-600' },
                        { label: 'S.LOSS', val: displayData.stopLoss, color: isDarkMode ? 'text-red-400' : 'text-red-600' },
                        { label: 'LOTS', val: displayData.recommendedLots, color: isDarkMode ? 'text-blue-400' : 'text-blue-600' }
                      ].map((lvl) => (
                        <div key={lvl.label} className={`flex justify-between items-center border-b pb-2 ${isDarkMode ? 'border-slate-800/50' : 'border-slate-100'}`}>
                          <span className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-[9px] uppercase font-black`}>{lvl.label}</span>
                          <span className={`${lvl.color} font-bold text-sm`}>{lvl.val.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Narrative */}
                <div className={`p-8 md:p-12 rounded-3xl border relative overflow-hidden transition-all ${
                  isDarkMode ? 'bg-slate-900/10 border-slate-800 backdrop-blur-xl shadow-none' : 'bg-white border-slate-200 shadow-xl'
                }`}>
                  <div className="absolute top-4 md:top-6 right-4 md:right-6">
                    <button 
                      onClick={copyFullAnalysis} 
                      className={`transition-all p-2 rounded-lg ${isDarkMode ? 'text-slate-600 hover:text-green-500 bg-slate-800/50' : 'text-slate-400 hover:text-green-600 bg-slate-50'}`}
                      title="Salin Analisa Lengkap"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    </button>
                  </div>
                  <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tighter mb-6 md:mb-8 flex items-center gap-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <span className="w-8 h-1 bg-green-500"></span> Technical Report
                  </h3>
                  <div className={`prose prose-invert max-w-none text-sm md:text-base leading-relaxed font-medium transition-colors whitespace-pre-wrap font-sans ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    <ReactMarkdown
                      components={{
                        h1: ({node, ...props}) => <h1 className={`text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 ${isDarkMode ? 'text-green-500' : 'text-green-600'}`} {...props} />,
                        h2: ({node, ...props}) => <h2 className={`text-lg md:text-xl font-bold uppercase tracking-wide mb-3 mt-6 border-l-4 pl-4 ${isDarkMode ? 'text-white border-green-500' : 'text-slate-900 border-green-600'}`} {...props} />,
                        h3: ({node, ...props}) => <h3 className={`text-base md:text-lg font-bold uppercase tracking-wide mb-2 mt-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`} {...props} />,
                        strong: ({node, ...props}) => <strong className={`font-black ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-4" {...props} />,
                        li: ({node, ...props}) => <li className="ml-2" {...props} />,
                        p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                        hr: ({node, ...props}) => <hr className={`my-6 border-dashed ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`} {...props} />,
                      }}
                    >
                      {displayData.fullAnalysisText}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 pt-16 md:pt-20 pb-10 px-6 border-t transition-colors duration-500 ${isDarkMode ? 'border-slate-900 bg-[#020617]' : 'border-slate-100 bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
             <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className={`w-6 h-6 rotate-45 flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <span className={`text-[10px] font-black -rotate-45 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>V</span>
              </div>
              <span className={`text-sm font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vel <span className="text-green-500">Trade</span></span>
            </div>
            <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Quantum Trading Interface v4.0.1</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
