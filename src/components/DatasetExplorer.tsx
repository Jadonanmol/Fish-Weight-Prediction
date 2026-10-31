import React, { useState } from 'react';
import { CLEANED_DATASET } from '../data/modelData';
import { FishRecord } from '../data/modelData';
import { Morphometrics, FishSpecies } from '../types/fish';
import { Search, ArrowUpDown, PlayCircle } from 'lucide-react';

interface DatasetExplorerProps {
  onLoadFish: (morph: Morphometrics) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({ onLoadFish }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortField, setSortField] = useState<keyof FishRecord>('Weight');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const speciesList: FishSpecies[] = [
    'Bream',
    'Parkki',
    'Perch',
    'Pike',
    'Roach',
    'Smelt',
    'Whitefish',
  ];

  // Filtering
  const filtered = CLEANED_DATASET.filter((fish) => {
    const matchesSpecies = selectedSpecies === 'all' || fish.Species === selectedSpecies;
    const matchesSearch =
      searchQuery === '' ||
      fish.Species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fish.Weight.toString().includes(searchQuery);
    return matchesSpecies && matchesSearch;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    }
    return sortOrder === 'asc'
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  const toggleSort = (field: keyof FishRecord) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            YBI Foundation Fish Market Dataset (158 Valid Records)
          </h3>
          <p className="text-[11px] text-slate-400">
            Click &quot;Load into Predictor&quot; on any row to test the model against that physical fish specimen
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dataset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded focus:outline-none focus:border-cyan-500 w-36 sm:w-44"
            />
          </div>

          {/* Species Filter */}
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Species ({CLEANED_DATASET.length})</option>
            {speciesList.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">#</th>
              <th
                onClick={() => toggleSort('Species')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1">
                  <span>Species</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('Weight')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Weight (g)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('Length1')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>L₁ (cm)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('Length2')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>L₂ (cm)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('Length3')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>L₃ (cm)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('Height')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Height (cm)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('Width')}
                className="py-2.5 px-3 cursor-pointer hover:text-slate-200 text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Width (cm)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
            {sorted.slice(0, 100).map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                <td className="py-2 px-3 font-sans font-medium text-slate-200">
                  {row.Species}
                </td>
                <td className="py-2 px-3 text-right font-bold text-cyan-400">
                  {row.Weight}
                </td>
                <td className="py-2 px-3 text-right">{row.Length1}</td>
                <td className="py-2 px-3 text-right">{row.Length2}</td>
                <td className="py-2 px-3 text-right">{row.Length3}</td>
                <td className="py-2 px-3 text-right">{row.Height}</td>
                <td className="py-2 px-3 text-right">{row.Width}</td>
                <td className="py-2 px-3 text-center">
                  <button
                    onClick={() =>
                      onLoadFish({
                        species: row.Species as FishSpecies,
                        length1: row.Length1,
                        length2: row.Length2,
                        length3: row.Length3,
                        height: row.Height,
                        width: row.Width,
                      })
                    }
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-sans font-medium text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/60 rounded border border-cyan-900/60 transition-colors"
                    title="Load into prediction model"
                  >
                    <PlayCircle className="w-3 h-3" />
                    <span>Load</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>
          Showing {Math.min(100, sorted.length)} of {filtered.length} filtered records ({CLEANED_DATASET.length} total)
        </span>
        <span>Original data source: YBI Foundation</span>
      </div>
    </div>
  );
};
