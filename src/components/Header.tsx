import React from 'react';
import { ExternalLink, Database, Activity, Github } from 'lucide-react';

interface HeaderProps {
  activeTab: 'predictor' | 'regression' | 'residuals' | 'dataset';
  setActiveTab: (tab: 'predictor' | 'regression' | 'residuals' | 'dataset') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="border-b border-slate-800 bg-[#0d121c] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
              <path d="M18 12v.5" />
              <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
              <path d="M7 10.67C7 8 5.58 5.97 2.73 4c-1 1.5-1 3.5 0 5 1.5 1 2 2 2 3s-.5 2-2 3c-1 1.5-1 3.5 0 5 2.85-1.97 4.28-4 4.27-6.67Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              Fish Weight ML Lab
            </h1>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setActiveTab('predictor')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'predictor'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Predictor & Anatomy
          </button>
          <button
            onClick={() => setActiveTab('regression')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'regression'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Regression Curves
          </button>
          <button
            onClick={() => setActiveTab('residuals')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'residuals'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            Residual Analysis
          </button>
          <button
            onClick={() => setActiveTab('dataset')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'dataset'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            YBI Dataset (158 rows)
          </button>
        </nav>

        {/* Zone 3: Attribution CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/YBI-Foundation/Dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title="View original YBI Foundation Dataset on GitHub"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>YBI Foundation Data</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
