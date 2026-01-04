
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Odia<span className="text-indigo-600">AI</span></h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Language Bridge</p>
          </div>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Translator</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Dictionary</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Learning</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
