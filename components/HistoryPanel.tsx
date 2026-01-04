
import React from 'react';
import { TranslationHistory } from '../types';

interface HistoryPanelProps {
  history: TranslationHistory[];
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800">Recent History</h3>
        <button 
          onClick={onClear}
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors px-3 py-1 rounded-full hover:bg-rose-50"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.slice(0, 6).map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase">
                {item.sourceLang} → Odia
              </span>
              <span className="text-[10px] text-slate-400 ml-auto">
                {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-1 mb-1 font-medium italic">{item.sourceText}</p>
            <p className="odia-font text-indigo-700 text-base font-semibold line-clamp-1">{item.translatedText}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
