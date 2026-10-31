import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { MODEL_METADATA } from '../data/modelData';

export const ResidualAnalysis: React.FC = () => {
  const predictions = MODEL_METADATA.test_samples_predictions;

  // Build histogram bins for residuals
  // Range is approx -120 to +240
  const binSize = 40;
  const bins: Record<string, { range: string; count: number; minVal: number }> = {};

  for (let min = -160; min <= 240; min += binSize) {
    const max = min + binSize;
    const label = `${min} to ${max}g`;
    bins[label] = { range: label, count: 0, minVal: min };
  }

  predictions.forEach((p) => {
    for (const key in bins) {
      const b = bins[key];
      if (p.residual >= b.minVal && p.residual < b.minVal + binSize) {
        b.count += 1;
        break;
      }
    }
  });

  const histogramData = Object.values(bins);

  // Scatter data for Residual vs Predicted
  const residualScatter = predictions.map((p, idx) => ({
    index: idx + 1,
    predicted: p.predicted,
    residual: p.residual,
    actual: p.actual,
  }));

  const residualsArray = predictions.map((p) => p.residual);
  const maxUnderpredict = Math.max(...residualsArray);
  const maxOverpredict = Math.min(...residualsArray);

  return (
    <div className="space-y-6">
      {/* Intro and Metrics */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Residual Diagnostics & Error Distribution
            </h3>
            <p className="text-[11px] text-slate-400">
              Residual = Actual Weight - Predicted Weight across holdout test specimens
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
            MAE = 63.23 g
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Mean Absolute Error</span>
            <span className="text-lg font-mono font-bold text-cyan-400">63.23 g</span>
            <p className="text-[10px] text-slate-400 mt-0.5">Average magnitude of deviation</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Largest Underprediction</span>
            <span className="text-lg font-mono font-bold text-emerald-400">+{maxUnderpredict.toFixed(1)} g</span>
            <p className="text-[10px] text-slate-400 mt-0.5">1000g specimen predicted at 760g</p>
          </div>
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
            <span className="text-[11px] text-slate-400 block mb-1">Largest Overprediction</span>
            <span className="text-lg font-mono font-bold text-amber-400">{maxOverpredict.toFixed(1)} g</span>
            <p className="text-[10px] text-slate-400 mt-0.5">306g specimen predicted at 425g</p>
          </div>
        </div>
      </div>

      {/* Chart 1: Residual vs Predicted Plot */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Residual vs Predicted Value (Homoscedasticity Inspection)
        </h4>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="predicted"
                name="Fitted Weight"
                unit=" g"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="residual"
                name="Residual"
                unit=" g"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <ZAxis range={[40, 40]} />
              <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded shadow-lg text-xs font-mono space-y-1">
                        <div className="text-slate-400">Observation #{data.index}</div>
                        <div className="text-slate-200">Predicted: {data.predicted} g</div>
                        <div className="text-slate-200">Actual: {data.actual} g</div>
                        <div className="text-cyan-400 font-bold">
                          Residual: {data.residual > 0 ? `+${data.residual}` : data.residual} g
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Residuals"
                data={residualScatter}
                fill="#38bdf8"
                opacity={0.8}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Residual Error Bins Histogram */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Residual Frequency Bins (Error Histogram)
        </h4>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="range"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-2 rounded text-xs font-mono">
                        <div className="text-cyan-400">{data.range}</div>
                        <div className="text-slate-200 font-bold">{data.count} test specimens</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
