import React from 'react';
import { FishSpecies, Morphometrics } from '../types/fish';
import { SUMMARY_STATS } from '../data/modelData';
import { RotateCcw, Info } from 'lucide-react';

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
  key: keyof Omit<Morphometrics, 'species'>;
  label: string;
  scientificName: string;
  unit: string;
  step: number;
  min: number;
  max: number;
  description: string;
}

const DIMENSIONS: DimensionConfig[] = [
  {
    key: 'length1',
    label: 'Length 1 (Vertical)',
    scientificName: 'Standard / Vertical Length (snout to caudal peduncle)',
    unit: 'cm',
    step: 0.1,
    min: 5.0,
    max: 65.0,
    description: 'Distance from snout tip to the end of the vertebral column.',
  },
  {
    key: 'length2',
    label: 'Length 2 (Diagonal)',
    scientificName: 'Fork / Diagonal Length (snout to tail notch)',
    unit: 'cm',
    step: 0.1,
    min: 5.0,
    max: 70.0,
    description: 'Distance from snout to the center notch of the caudal fin.',
  },
  {
    key: 'length3',
    label: 'Length 3 (Cross)',
    scientificName: 'Total / Cross Length (snout to fin tip)',
    unit: 'cm',
    step: 0.1,
    min: 5.0,
    max: 75.0,
    description: 'Greatest dimension along body axis from snout to fin tip.',
  },
  {
    key: 'height',
    label: 'Body Height',
    scientificName: 'Dorso-Ventral Height',
    unit: 'cm',
    step: 0.1,
    min: 1.0,
    max: 25.0,
    description: 'Maximum vertical body depth perpendicular to long axis.',
  },
  {
    key: 'width',
    label: 'Body Width',
    scientificName: 'Lateral Thickness',
    unit: 'cm',
    step: 0.1,
    min: 0.5,
    max: 12.0,
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

  const handleDimensionChange = (key: keyof Omit<Morphometrics, 'species'>, val: number) => {
    onChange({
      ...values,
      [key]: Math.round(val * 10) / 10,
    });
  };

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

        {DIMENSIONS.map((dim) => {
          const val = values[dim.key];
          const spDimStats = currentSpeciesStats?.dimensions?.[dim.key === 'length1' ? 'Length1' : dim.key === 'length2' ? 'Length2' : dim.key === 'length3' ? 'Length3' : dim.key === 'height' ? 'Height' : 'Width'];

          return (
            <div key={dim.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-200">{dim.label}</span>
                  <p className="text-[10px] text-slate-400">{dim.scientificName}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    step={dim.step}
                    min={dim.min}
                    max={dim.max}
                    value={val}
                    onChange={(e) =>
                      handleDimensionChange(dim.key, parseFloat(e.target.value) || 0)
                    }
                    className="w-18 px-2 py-1 text-right text-xs font-mono font-semibold bg-slate-900 border border-slate-700 rounded text-cyan-300 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-xs font-mono text-slate-400">cm</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={dim.min}
                max={dim.max}
                step={dim.step}
                value={val}
                onChange={(e) =>
                  handleDimensionChange(dim.key, parseFloat(e.target.value))
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />

              {/* Biological Reference Bounds */}
              {spDimStats && (
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Species min: {spDimStats.min} cm</span>
                  <span className="text-slate-400">Avg: {spDimStats.mean} cm</span>
                  <span>Species max: {spDimStats.max} cm</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
