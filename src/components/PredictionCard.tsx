import React from 'react';
import { PredictionResult, Morphometrics } from '../types/fish';
import { Scale, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResult;
  inputs: Morphometrics;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  inputs,
}) => {
  const diffFromMean = prediction.predictedWeightGrams - prediction.speciesAverageWeight;
  const pctDiff =
    prediction.speciesAverageWeight > 0
      ? ((diffFromMean / prediction.speciesAverageWeight) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-400">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Predicted Weight
            </h3>
            <p className="text-[11px] text-slate-400">
              Multiple Linear Regression Model Output
            </p>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
          {inputs.species}
        </span>
      </div>

      {/* Main Metric Display */}
      <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 text-center">
        <div className="flex items-baseline justify-center gap-2">
          <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-cyan-300 tabular-nums">
            {prediction.predictedWeightGrams.toFixed(1)}
          </span>
          <span className="text-sm font-mono text-slate-400 font-semibold">
            grams (g)
          </span>
        </div>

        {/* Alternate Units */}
        <div className="mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-center gap-6 text-xs font-mono text-slate-400">
          <div>
            <span>Kilograms: </span>
            <strong className="text-slate-200">{prediction.weightKg.toFixed(3)} kg</strong>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span>Ounces: </span>
            <strong className="text-slate-200">{prediction.weightOz.toFixed(1)} oz</strong>
          </div>
        </div>
      </div>

      {/* Biological Comparison */}
      <div className="text-xs space-y-2 p-3 bg-slate-900/40 rounded-lg border border-slate-800/60">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Species Average in Dataset:</span>
          <span className="font-mono font-medium text-slate-200">
            {prediction.speciesAverageWeight.toFixed(1)} g
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Deviation from Average:</span>
          <span
            className={`font-mono flex items-center gap-1 ${
              diffFromMean >= 0 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {diffFromMean >= 0 ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {diffFromMean >= 0 ? `+${diffFromMean.toFixed(1)}` : diffFromMean.toFixed(1)} g ({pctDiff}%)
          </span>
        </div>
      </div>
    </div>
  );
};
