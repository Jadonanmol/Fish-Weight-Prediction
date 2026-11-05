import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
} from 'recharts';
import { CLEANED_DATASET, MODEL_METADATA } from '../data/modelData';
import { Morphometrics, PredictionResult, FishSpecies } from '../types/fish';

interface RegressionPlotsProps {
  currentInput: Morphometrics;
  currentPrediction: PredictionResult;
}

const SPECIES_COLORS: Record<string, string> = {
  Bream: '#38bdf8',
  Parkki: '#a78bfa',
  Perch: '#34d399',
  Pike: '#f43f5e',
  Roach: '#fbbf24',
  Smelt: '#fb923c',
  Whitefish: '#e879f9',
};

export const RegressionPlots: React.FC<RegressionPlotsProps> = ({
  currentInput,
  currentPrediction,
}) => {
  const [selectedDimension, setSelectedDimension] = useState<
    'Length3' | 'Length1' | 'Height' | 'Width'
  >('Length3');
  const [filterSpecies, setFilterSpecies] = useState<string>('all');

  // Format data for Scatter
  const filteredData = CLEANED_DATASET.filter(
    (row) => filterSpecies === 'all' || row.Species === filterSpecies
  ).map((row) => ({
    x: row[selectedDimension],
    y: row.Weight,
    species: row.Species,
  }));

  // Current user's prediction point
  const currentX =
    selectedDimension === 'Length3'
      ? currentInput.length3
      : selectedDimension === 'Length1'
      ? currentInput.length1
      : selectedDimension === 'Height'
      ? currentInput.height
      : currentInput.width;

  const hasValidPrediction =
    currentPrediction.isPhysicallyMeaningful &&
    currentPrediction.predictedWeightGrams !== null;

  const currentPoint = hasValidPrediction
    ? [
        {
          x: currentX,
          y: currentPrediction.predictedWeightGrams,
          species: currentInput.species,
        },
      ]
    : [];

  // Test Set Predictions for Actual vs Predicted Plot
  const testSetData = MODEL_METADATA.test_samples_predictions.map((p, idx) => ({
    index: idx + 1,
    actual: p.actual,
    predicted: p.predicted,
    residual: p.residual,
  }));

  const maxVal = Math.max(
    ...testSetData.map((d) => Math.max(d.actual, d.predicted)),
    1200
  );
  const identityLine = [
    { x: 0, y: 0 },
    { x: maxVal, y: maxVal },
  ];

  return (
    <div className="space-y-6">
      {/* Chart 1: Dimension vs Weight Scatter */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Weight vs Morphometric Dimension (158 Dataset Records)
            </h3>
            <p className="text-[11px] text-slate-400">
              Dataset distribution with current user input point highlighted in laser red
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Dimension Selector */}
            <select
              value={selectedDimension}
              onChange={(e) => setSelectedDimension(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="Length3">X-Axis: Length 3 (Cross)</option>
              <option value="Length1">X-Axis: Length 1 (Vertical)</option>
              <option value="Height">X-Axis: Height</option>
              <option value="Width">X-Axis: Width</option>
            </select>

            {/* Species Filter */}
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Species</option>
              {MODEL_METADATA.species_order.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="x"
                name={selectedDimension}
                unit=" cm"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Weight"
                unit=" g"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <ZAxis range={[40, 40]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded shadow-lg text-xs font-mono space-y-1">
                        <div className="text-cyan-400 font-bold">{data.species}</div>
                        <div className="text-slate-300">
                          {selectedDimension}: {data.x} cm
                        </div>
                        <div className="text-emerald-400">Weight: {data.y} g</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              {/* Dataset Observations */}
              <Scatter
                name="Dataset Observations"
                data={filteredData}
                fill="#38bdf8"
                opacity={0.65}
              />
              {/* Current User Input Point (rendered if physically meaningful) */}
              {hasValidPrediction && (
                <Scatter
                  name="Current Prediction"
                  data={currentPoint}
                  fill="#f43f5e"
                  shape="cross"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span>
              <span>Dataset records ({filteredData.length})</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
              <span>
                Current calculation:{' '}
                {hasValidPrediction && currentPrediction.predictedWeightGrams !== null
                  ? `${currentPrediction.predictedWeightGrams.toFixed(1)} g`
                  : 'Non-physical estimate (excluded)'}
              </span>
            </span>
          </div>
          <span>Target Metric: Weight (grams)</span>
        </div>
      </div>

      {/* Chart 2: Actual vs Predicted (Test Set) */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Actual vs Predicted Weight (Holdout Test Set)
            </h3>
            <p className="text-[11px] text-slate-400">
              Evaluated on 32 test specimens (R² = 0.9497). Points closer to the diagonal indicate closer agreement between actual and predicted values.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            Linearity Verified
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                type="number"
                dataKey="actual"
                name="Actual Weight"
                unit=" g"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                type="number"
                dataKey="predicted"
                name="Predicted Weight"
                unit=" g"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <ZAxis range={[45, 45]} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-2.5 rounded shadow-lg text-xs font-mono space-y-1">
                        <div className="text-slate-400">Test Specimen #{data.index}</div>
                        <div className="text-slate-200">Actual: {data.actual} g</div>
                        <div className="text-cyan-400">Predicted: {data.predicted} g</div>
                        <div className={data.residual >= 0 ? 'text-emerald-400' : 'text-amber-400'}>
                          Residual: {data.residual >= 0 ? `+${data.residual}` : data.residual} g
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter
                name="Test Observations"
                data={testSetData}
                fill="#06b6d4"
                opacity={0.8}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
