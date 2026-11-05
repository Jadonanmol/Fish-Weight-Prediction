import React, { useState } from 'react';
import { ExternalLink, Database, Menu, X, Calculator, LineChart, Activity, Table } from 'lucide-react';

interface HeaderProps {
  activeTab: 'predictor' | 'regression' | 'residuals' | 'dataset';
  setActiveTab: (tab: 'predictor' | 'regression' | 'residuals' | 'dataset') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'predictor' as const, label: 'Predictor & Anatomy', icon: Calculator },
    { id: 'regression' as const, label: 'Regression Curves', icon: LineChart },
    { id: 'residuals' as const, label: 'Residual Analysis', icon: Activity },
    { id: 'dataset' as const, label: 'YBI Dataset (158 rows)', icon: Table },
  ];

  return (
    <header className="border-b border-slate-800 bg-[#0d121c] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
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
            <span className="hidden sm:inline-block text-[10px] text-cyan-400 font-mono">
              Multiple Linear Regression
            </span>
          </div>
        </div>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Attribution CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/YBI-Foundation/Dataset"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title="View original YBI Foundation Dataset on GitHub"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>YBI Foundation Data</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Quick Tab Bar (Always accessible on mobile for fast 1-tap switching) */}
      <div className="md:hidden border-t border-slate-800/80 bg-[#0a0e17] px-3 py-1.5 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer (Expandable full navigation + attribution) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0e1420] px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-1 pt-1">
            Navigation Tabs
          </div>
          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <a
              href="https://github.com/YBI-Foundation/Dataset"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/60 rounded-lg hover:bg-slate-800 border border-slate-700/60"
            >
              <span className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>YBI Foundation Dataset</span>
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
