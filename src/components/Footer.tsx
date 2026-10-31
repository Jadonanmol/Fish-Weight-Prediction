import React from 'react';
import { ExternalLink, Heart, BookOpen, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#090d14] text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Attribution Column */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Project & Dataset Attribution</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              This project is built and organized based on the <strong>Fish Weight Prediction</strong> project and open dataset provided by{' '}
              <a
                href="https://github.com/YBI-Foundation/Dataset"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline font-medium inline-flex items-center gap-0.5"
              >
                YBI Foundation <ExternalLink className="w-2.5 h-2.5" />
              </a>
              . Originally collected by the Department of Biological Sciences at Aarhus University.
            </p>
          </div>

          {/* Machine Learning Methodology */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Machine Learning Methodology</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Trained using Ordinary Least Squares (OLS) Multiple Linear Regression via Python <code className="text-slate-300">scikit-learn</code> on 158 verified fish records. Achieves an authentic test R² of <strong className="text-slate-200 font-mono">0.9497</strong> and MAE of <strong className="text-slate-200 font-mono">63.23 g</strong>.
            </p>
          </div>

          {/* Quick Links & Local Running */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <span>Local Execution</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Run ML training locally with <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono">python src/ml/train.py</code> or evaluate via CLI using <code className="bg-slate-900 px-1 py-0.5 rounded text-cyan-300 font-mono">python src/ml/predict.py</code>.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            Fish Weight Prediction & ML Lab · Educational & Research Machine Learning Portfolio
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/YBI-Foundation/Dataset"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              YBI Foundation Repository
            </a>
            <span>·</span>
            <span>Clean Code &amp; Verified Metrics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
