import React, { useState } from 'react';
import { MODEL_METADATA } from '../data/modelData';
import { Award, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const ModelMetricsCard: React.FC = () => {
  const [showEquation, setShowEquation] = useState(false);
  const { evaluation, intercept, coefficients, train_samples, test_samples } = MODEL_METADATA;

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Model Evaluation & Performance
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluated on 32 Unseen Test Specimens (scikit-learn)
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/80 text-emerald-300">
          Verified Test Results
        </span>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* R-squared */}
        <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Test R² Score</span>
          </div>
          <div className="text-xl font-mono font-bold text-white tabular-nums">
            {evaluation.test.r2_score.toFixed(4)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {Math.round(evaluation.test.r2_score * 1000) / 10}% variance explained
          </div>
        </div>

        {/* Adjusted R-squared */}
        <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Adjusted R²</span>
          </div>
          <div className="text-xl font-mono font-bold text-white tabular-nums">
            {evaluation.test.adjusted_r2.toFixed(4)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Penalized for 12 features
          </div>
        </div>

        {/* MAE (Mean Absolute Error) */}
        <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Mean Absolute Error</span>
          </div>
          <div className="text-xl font-mono font-bold text-cyan-400 tabular-nums">
            {evaluation.test.mae_grams.toFixed(2)} <span className="text-xs font-normal text-slate-400">g</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Average absolute error magnitude
          </div>
        </div>

        {/* RMSE (Root Mean Squared Error) */}
        <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Root Mean Sq Error</span>
          </div>
          <div className="text-xl font-mono font-bold text-slate-200 tabular-nums">
            {evaluation.test.rmse_grams.toFixed(2)} <span className="text-xs font-normal text-slate-400">g</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            Sensitive to large outliers
          </div>
        </div>
      </div>

      {/* Note Clarifying MAE vs Confidence Interval */}
      <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-300">Metric Interpretation:</strong> Mean Absolute Error (MAE = 63.23 g) is an aggregate model evaluation metric quantifying the average deviation between predicted and observed weights on the holdout test set. It is an overall performance benchmark, distinct from a statistical confidence interval.
        </div>
      </div>

      {/* Cross-Validation & Split Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 pt-1">
        <div>
          5-Fold Cross Validation R²: <span className="text-slate-200 font-semibold">{evaluation.cross_validation_5fold.mean_r2.toFixed(4)}</span> (±{evaluation.cross_validation_5fold.std_r2.toFixed(4)})
        </div>
        <div>
          Train: <span className="text-slate-200">{train_samples}</span> | Test: <span className="text-slate-200">{test_samples}</span> records (80/20 split)
        </div>
      </div>

      {/* Toggle Linear Equation */}
      <div className="border-t border-slate-800/80 pt-3">
        <button
          onClick={() => setShowEquation(!showEquation)}
          className="w-full flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors py-1"
        >
          <span className="font-semibold">Multiple Linear Regression Equation & Weights</span>
          {showEquation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showEquation && (
          <div className="mt-3 p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-3 font-mono text-xs">
            <div className="text-cyan-400 text-[11px] leading-relaxed break-all">
              Weight (g) = {intercept.toFixed(2)} + ({coefficients['Length1'].toFixed(2)} × L₁) + ({coefficients['Length2'].toFixed(2)} × L₂) + ({coefficients['Length3'].toFixed(2)} × L₃) + ({coefficients['Height'].toFixed(2)} × H) + ({coefficients['Width'].toFixed(2)} × W) + β_Species
            </div>

            <div className="border-t border-slate-800/80 pt-2">
              <span className="text-slate-400 text-[11px] block mb-1.5 uppercase font-sans font-semibold">
                Species Coefficients (β_Species):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                {MODEL_METADATA.species_order.map((sp) => {
                  const val = coefficients[`Species_${sp}`] || 0;
                  return (
                    <div key={sp} className="flex justify-between bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-300">{sp}:</span>
                      <span className={val >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                        {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
