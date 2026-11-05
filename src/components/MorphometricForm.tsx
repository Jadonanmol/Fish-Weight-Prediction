import React from 'react';
import { FishSpecies, Morphometrics, DimensionKey } from '../types/fish';
import { SUMMARY_STATS } from '../data/modelData';
import { RotateCcw, AlertTriangle, CheckCircle2, Ruler } from 'lucide-react';

interface MorphometricFormProps {
  values: Morphometrics;
  onChange: (newValues: Morphometrics) => void;
  onReset: () => void;
}

const SPECIES_LIST: FishSpecies[] = [
  'Bream',
  'Parkki',
  'Perch',
  'Pike',
  'Roach',
  'Smelt',
  'Whitefish',
];

interface DimensionConfig {
  key: DimensionKey;
  statKey: 'Length1' | 'Length2' | 'Length3' | 'Height' | 'Width';
  label: string;
  scientificName: string;
  sliderMin: number;
  sliderMax: number;
  step: number;
  description: string;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'length1',
    statKey: 'Length1',
    label: 'Length 1 (Vertical)',
    scientificName: 'Standard Length (snout to caudal peduncle)',
    sliderMin: 1.0,
    sliderMax: 70.0,
    step: 0.1,
    description: 'Distance from snout tip to the end of the vertebral column.',
  },
  {
    key: 'length2',
    statKey: 'Length2',
    label: 'Length 2 (Diagonal)',
    scientificName: 'Fork Length (snout to tail notch)',
    sliderMin: 1.0,
    sliderMax: 75.0,
    step: 0.1,
    description: 'Distance from snout to the center notch of the caudal fin.',
  },
  {
    key: 'length3',
    statKey: 'Length3',
    label: 'Length 3 (Cross)',
    scientificName: 'Total Length (snout to fin tip)',
    sliderMin: 1.0,
    sliderMax: 80.0,
    step: 0.1,
    description: 'Greatest dimension along body axis from snout to fin tip.',
  },
  {
    key: 'height',
    statKey: 'Height',
    label: 'Body Height',
    scientificName: 'Dorso-Ventral Height',
    sliderMin: 0.5,
    sliderMax: 30.0,
    step: 0.1,
    description: 'Maximum vertical body depth perpendicular to long axis.',
  },
  {
    key: 'width',
    statKey: 'Width',
    label: 'Body Width',
    scientificName: 'Lateral Thickness',
    sliderMin: 0.2,
    sliderMax: 16.0,
    step: 0.1,
    description: 'Maximum body breadth across dorsal flanks.',
  },
];

export const MorphometricForm: React.FC<MorphometricFormProps> = ({
  values,
  onChange,
  onReset,
}) => {
  const currentSpeciesStats = (SUMMARY_STATS.species_stats as Record<string, any>)[values.species];

  const handleSpeciesChange = (species: FishSpecies) => {
    const stats = (SUMMARY_STATS.species_stats as Record<string, any>)[species];
    const dims = stats?.dimensions;
    onChange({
      species,
      length1: dims?.Length1?.mean ?? 25.0,
      length2: dims?.Length2?.mean ?? 27.0,
      length3: dims?.Length3?.mean ?? 30.0,
      height: dims?.Height?.mean ?? 10.0,
      width: dims?.Width?.mean ?? 4.5,
    });
  };

  const handleDimensionChange = (key: DimensionKey, val: number) => {
    // Never silently clamp or reset user-entered values
    onChange({
      ...values,
      [key]: isNaN(val) ? 0 : Math.round(val * 10) / 10,
    });
  };

  // Anatomical check: L1 <= L2 <= L3
  const hasL1GtL2 = values.length1 > 0 && values.length2 > 0 && values.length1 > values.length2;
  const hasL2GtL3 = values.length2 > 0 && values.length3 > 0 && values.length2 > values.length3;
  const hasAnatomyInconsistency = hasL1GtL2 || hasL2GtL3;

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-6">
      {/* Species Selector Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Fish Species
          </label>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
            title="Reset measurements to species average from dataset"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Averages</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SPECIES_LIST.map((sp) => {
            const count = (SUMMARY_STATS.species_counts as Record<string, number>)[sp] || 0;
            const isSelected = values.species === sp;
            return (
              <button
                key={sp}
                type="button"
                onClick={() => handleSpeciesChange(sp)}
                className={`flex flex-col text-left px-3 py-2 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-sm shadow-cyan-900/30'
                    : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold text-slate-200">{sp}</span>
                <span className="text-[11px] text-slate-400">{count} specimens</span>
              </button>
            );
          })}
        </div>

        {currentSpeciesStats && (
          <div className="mt-3 p-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>
              Species Median Weight: <strong className="text-slate-200 font-mono">{currentSpeciesStats.weight.median} g</strong>
            </span>
            <span>
              Dataset Range: <span className="font-mono">{currentSpeciesStats.weight.min}g – {currentSpeciesStats.weight.max}g</span>
            </span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-800/80 pt-4 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Physical Measurements
          </span>
          <span className="text-[11px] text-slate-400 font-mono">Precision: 0.1 cm</span>
        </div>

        {/* Anatomical Inconsistency Alert in Form */}
        {hasAnatomyInconsistency && (
          <div className="p-2.5 rounded-lg bg-orange-950/30 border border-orange-800/60 text-xs text-orange-300 flex items-start gap-2">
            <Ruler className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-[11px]">Anatomical Ordering Warning:</span>
              <span className="text-[11px] text-orange-200/90 leading-tight block">
                {hasL1GtL2 && `Length 1 (${values.length1} cm) > Length 2 (${values.length2} cm). `}
                {hasL2GtL3 && `Length 2 (${values.length2} cm) > Length 3 (${values.length3} cm). `}
                Normally, standard fish morphology requires L₁ ≤ L₂ ≤ L₃.
              </span>
            </div>
          </div>
        )}

        {DIMENSIONS.map((dim) => {
          const val = values[dim.key];
          const spDimStats = currentSpeciesStats?.dimensions?.[dim.statKey];
          const minRange = spDimStats?.min ?? 0;
          const maxRange = spDimStats?.max ?? 0;
          const isBelow = val < minRange;
          const isAbove = val > maxRange;
          const isExtrapolated = isBelow || isAbove;

          return (
            <div key={dim.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-200">{dim.label}</span>
                    {isExtrapolated && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/70 px-1.5 py-0.2 rounded font-mono">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        <span>{isBelow ? 'Below Min' : 'Above Max'}</span>
                      </span>
                    )}
                    {!isExtrapolated && val > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-400 font-mono">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">{dim.scientificName}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step={dim.step}
                    value={val === 0 ? '' : val}
                    onChange={(e) => {
                      const parsed = parseFloat(e.target.value);
                      handleDimensionChange(dim.key, isNaN(parsed) ? 0 : parsed);
                    }}
                    className={`w-20 px-2 py-1 text-right text-xs font-mono font-semibold bg-slate-900 border rounded focus:outline-none transition-colors ${
                      isExtrapolated
                        ? 'border-amber-600/80 text-amber-300 focus:border-amber-500'
                        : val <= 0
                        ? 'border-rose-600/80 text-rose-300 focus:border-rose-500'
                        : 'border-slate-700 text-cyan-300 focus:border-cyan-500'
                    }`}
                  />
                  <span className="text-xs font-mono text-slate-400">cm</span>
                </div>
              </div>

              {/* Slider (Purely visual scrub, does not clamp input) */}
              <input
                type="range"
                min={dim.sliderMin}
                max={dim.sliderMax}
                step={dim.step}
                value={Math.min(dim.sliderMax, Math.max(dim.sliderMin, val))}
                onChange={(e) =>
                  handleDimensionChange(dim.key, parseFloat(e.target.value))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />

              {/* Biological Reference Bounds & Status */}
              {spDimStats && (
                <div className="flex justify-between text-[10px] font-mono">
                  <span className={isBelow ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                    Training Min: {minRange} cm
                  </span>
                  <span className="text-slate-400">Avg: {spDimStats.mean} cm</span>
                  <span className={isAbove ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                    Training Max: {maxRange} cm
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
