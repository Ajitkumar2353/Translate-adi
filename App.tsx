
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TranslatorUI from './components/TranslatorUI';
import HistoryPanel from './components/HistoryPanel';
import { TranslationHistory } from './types';

const App: React.FC = () => {
  const [history, setHistory] = useState<TranslationHistory[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('odia_translator_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history");
      }
    }
  }, []);

  const addHistoryItem = (item: TranslationHistory) => {
    setHistory(prev => {
      // Don't add if the source text is identical to the last one (prevents spam from auto-debounce)
      if (prev.length > 0 && prev[0].sourceText === item.sourceText) return prev;
      
      const newHistory = [item, ...prev].slice(0, 50); // Keep last 50
      localStorage.setItem('odia_translator_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('odia_translator_history');
  };

  return (
    <div className="min-h-screen flex flex-col pb-12">
      <Header />
      
      <main className="flex-1 mt-8 space-y-8">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Translate English & Hindi to <span className="text-indigo-600">Odia</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Harness the power of Gemini AI for natural, context-aware translations. 
            Perfect for students, travelers, and professionals.
          </p>
        </div>

        <TranslatorUI onHistoryAdd={addHistoryItem} />
        
        <HistoryPanel history={history} onClear={clearHistory} />

        {/* Benefits Section */}
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Instant Detection</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Automatically identifies Hindi or English as you type, streamlining your workflow.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">AI Precision</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Goes beyond literal dictionary meaning to provide culturally nuanced Odia phrasing.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Local History</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Access your previous translations instantly without a cloud account. Private and fast.</p>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-8 border-t border-slate-200 text-center text-slate-400">
        <p className="text-sm">© 2024 OdiaAI Translator • Built with Gemini 3 Pro</p>
      </footer>
    </div>
  );
};

export default App;
