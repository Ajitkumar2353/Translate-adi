
import React, { useState, useEffect, useRef } from 'react';
import { Language, TranslationHistory } from '../types';
import { translateText } from '../services/geminiService';

interface TranslatorUIProps {
  onHistoryAdd: (item: TranslationHistory) => void;
}

const TranslatorUI: React.FC<TranslatorUIProps> = ({ onHistoryAdd }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState<Language>(Language.AUTO);
  const [targetLang] = useState<Language>(Language.ODIA);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const timeoutRef = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus the input on mount so the user can type immediately
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const performTranslation = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setTranslatedText('');
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsTranslating(true);
    try {
      const result = await translateText(trimmed, sourceLang, targetLang);
      setTranslatedText(result.translatedText);
      
      const historyItem: TranslationHistory = {
        id: Date.now().toString(),
        sourceText: trimmed,
        translatedText: result.translatedText,
        sourceLang: sourceLang,
        targetLang: targetLang,
        timestamp: Date.now()
      };
      onHistoryAdd(historyItem);
    } catch (error) {
      console.error("UI Translation Error:", error);
      setTranslatedText("Error connecting to AI. Please check your connection.");
    } finally {
      setIsTranslating(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (sourceText.trim().length > 0) {
      timeoutRef.current = setTimeout(() => {
        performTranslation(sourceText);
      }, 400);
    } else {
      setTranslatedText('');
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [sourceText, sourceLang]);

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    const btn = document.getElementById('copy-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Copied!';
      setTimeout(() => btn.innerHTML = originalText, 2000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Section (Input) */}
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-50/50 overflow-hidden flex flex-col min-h-[350px] transition-all duration-200">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex gap-1 md:gap-2">
              {[Language.AUTO, Language.ENGLISH, Language.HINDI].map((lang) => (
                <button 
                  key={lang}
                  onClick={() => setSourceLang(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sourceLang === lang ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}
                >
                  {lang === Language.AUTO ? 'Auto-Detect' : lang}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5M15.182 5.182a1.5 1.5 0 112.121 2.121L12 12.586l-4.293 4.293a1 1 0 01-1.414-1.414L10.586 11l4.596-4.596z" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Input</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col relative">
            <textarea
              ref={inputRef}
              className="flex-1 w-full p-6 text-xl focus:outline-none resize-none bg-transparent text-slate-800 placeholder:text-slate-300 cursor-text"
              placeholder="Start typing Hindi or English here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              autoFocus
            />
            {sourceText && (
              <button 
                onClick={() => {
                  setSourceText('');
                  inputRef.current?.focus();
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 transition-colors z-10"
                title="Clear text"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>

          <div className="px-4 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[11px] font-bold text-slate-400">{sourceText.length} characters</span>
            <button 
              onClick={() => performTranslation(sourceText)}
              disabled={!sourceText.trim() || isTranslating}
              className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isTranslating ? 'Wait...' : 'Translate'}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Target Section (Output) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[350px]">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Odia Translation
            </span>
            <div className="flex items-center gap-2 text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Result</span>
            </div>
          </div>
          
          <div className="relative flex-1 bg-indigo-50/5">
            <div className={`odia-font w-full h-full p-6 text-2xl leading-relaxed ${isTranslating ? 'opacity-30 blur-[1px]' : 'opacity-100'} text-slate-900 transition-all duration-300`}>
              {translatedText || (
                <span className="text-slate-300 italic font-sans text-lg">Translation appears here...</span>
              )}
            </div>
            {isTranslating && (
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-[3px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-bold text-indigo-600 animate-pulse">AI Thinking...</span>
                 </div>
              </div>
            )}
          </div>

          <div className="px-4 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-2">
            <button 
              id="copy-btn"
              onClick={() => copyToClipboard(translatedText)}
              disabled={!translatedText || isTranslating}
              className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-xl transition-all disabled:opacity-30 text-sm font-bold border border-slate-200 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Result
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatorUI;
