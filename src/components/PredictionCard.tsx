import React from 'react';
import { PredictionResult, Morphometrics } from '../types/fish';
import { Scale, TrendingUp, TrendingDown, AlertTriangle, AlertCircle, CheckCircle2, Ruler } from 'lucide-react';

interface PredictionCardProps {
  prediction: PredictionResult;
  inputs: Morphometrics;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  prediction,
  inputs,
}) => {
  const { validation, isPhysicallyMeaningful, predictedWeightGrams } = prediction;

  const diffFromMean =
    predictedWeightGrams !== null
      ? predictedWeightGrams - prediction.speciesAverageWeight
      : null;

  const pctDiff =
    diffFromMean !== null && prediction.speciesAverageWeight > 0
      ? ((diffFromMean / prediction.speciesAverageWeight) * 100).toFixed(1)
      : null;

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
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

        {/* Validation Status Badges */}
        <div className="flex items-center flex-wrap gap-1.5">
          {validation.status === 'valid' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              <CheckCircle2 className="w-3 h-3" />
              <span>Training Range</span>
            </span>
          )}
          {validation.status === 'extrapolated' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded">
              <AlertTriangle className="w-3 h-3" />
              <span>Extrapolation</span>
            </span>
          )}
          {validation.status === 'invalid' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-950/60 border border-rose-800/80 px-2 py-0.5 rounded">
              <AlertCircle className="w-3 h-3" />
              <span>Invalid Input</span>
            </span>
          )}

          {/* Anatomical Status Badge */}
          {validation.hasAnatomicalInconsistencies ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-orange-400 bg-orange-950/60 border border-orange-800/80 px-2 py-0.5 rounded">
              <Ruler className="w-3 h-3" />
              <span>Anatomy Flag</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
              <span>L₁ ≤ L₂ ≤ L₃</span>
            </span>
          )}

          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            {inputs.species}
          </span>
        </div>
      </div>

      {/* Main Metric Display or Non-Physical Error Box */}
      {isPhysicallyMeaningful && predictedWeightGrams !== null ? (
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl sm:text-5xl font-mono font-bold tracking-tight text-cyan-300 tabular-nums">
              {predictedWeightGrams.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400 font-semibold">
              grams (g)
            </span>
          </div>

          {/* Alternate Units */}
          <div className="mt-3 pt-3 border-t border-slate-800/70 flex items-center justify-center gap-6 text-xs font-mono text-slate-400">
            <div>
              <span>Kilograms: </span>
              <strong className="text-slate-200">
                {prediction.weightKg !== null ? prediction.weightKg.toFixed(3) : '0.000'} kg
              </strong>
            </div>
            <span className="text-slate-700">|</span>
            <div>
              <span>Ounces: </span>
              <strong className="text-slate-200">
                {prediction.weightOz !== null ? prediction.weightOz.toFixed(1) : '0.0'} oz
              </strong>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-rose-950/30 border border-rose-900/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-rose-300 font-semibold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Non-Physical Prediction</span>
            <span className="ml-auto font-mono text-[11px] text-rose-400/90 font-normal">
              Raw Equation: {prediction.rawWeight.toFixed(1)} g
            </span>
          </div>
          <p className="text-xs text-rose-200/90 leading-relaxed">
            {prediction.nonPhysicalExplanation}
          </p>
          <div className="text-[11px] text-rose-300/70 font-mono pt-1 border-t border-rose-900/40">
            Note: The model intentionally does not coerce negative outputs to 0 g. Adjust physical inputs toward the species empirical training space.
          </div>
        </div>
      )}

      {/* 1. SEPARATE Anatomical Consistency Warnings Box */}
      {validation.anatomicalWarnings.length > 0 && (
        <div className="p-3 bg-orange-950/30 border border-orange-900/50 rounded-lg space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-300">
            <Ruler className="w-3.5 h-3.5 text-orange-400" />
            <span>Anatomical Measurement Warning ({validation.anatomicalWarnings.length})</span>
          </div>
          <ul className="text-[11px] text-orange-200/90 space-y-1 list-disc list-inside">
            {validation.anatomicalWarnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
          <p className="text-[10px] text-orange-300/70 pt-1 font-mono">
            Normally, Standard Length (L₁) ≤ Fork Length (L₂) ≤ Total Length (L₃). The model calculates a prediction using your exact inputs without modification, but results may reflect an anatomically atypical fish.
          </p>
        </div>
      )}

      {/* 2. SEPARATE Training-Data Range Extrapolation Box */}
      {validation.trainingRangeWarnings.length > 0 && (
        <div className="p-3 bg-amber-950/30 border border-amber-900/50 rounded-lg space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Training-Data Range Extrapolation ({validation.trainingRangeWarnings.length})</span>
          </div>
          <ul className="text-[11px] text-amber-200/90 space-y-1 list-disc list-inside">
            {validation.trainingRangeWarnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
          <p className="text-[10px] text-amber-300/70 pt-1 font-mono">
            Model variance and prediction error may increase when extrapolating beyond training boundaries.
          </p>
        </div>
      )}

      {/* Biological Comparison (when physical prediction is valid) */}
      {isPhysicallyMeaningful && diffFromMean !== null && pctDiff !== null && (
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
      )}
    </div>
  );
};
