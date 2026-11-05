import React, { useState, useEffect, useRef } from 'react';
import {
  FishSpecies,
  BatchFishItem,
  BatchPredictionItem,
  BatchSummaryStats,
  BatchHistoryEntry,
} from '../types/fish';
import {
  calculateBatchPredictions,
  exportBatchToCSV,
  getSpeciesDefaults,
} from '../utils/predictor';
import { SUMMARY_STATS } from '../data/modelData';
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  History,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Sparkles,
  Ruler,
  X,
  Save,
  RotateCcw,
} from 'lucide-react';

const SPECIES_LIST: FishSpecies[] = [
  'Bream',
  'Parkki',
  'Perch',
  'Pike',
  'Roach',
  'Smelt',
  'Whitefish',
];

const LOCAL_STORAGE_KEY = 'fish_weight_batch_history_v1';

// Sample batch representing diverse species from authentic YBI Foundation dataset
const SAMPLE_BATCH: BatchFishItem[] = [
  {
    id: 'sample-1',
    species: 'Bream',
    length1: 26.8,
    length2: 29.7,
    length3: 34.5,
    height: 14.18,
    width: 5.28,
  },
  {
    id: 'sample-2',
    species: 'Roach',
    length1: 20.5,
    length2: 22.5,
    length3: 25.3,
    height: 7.03,
    width: 3.82,
  },
  {
    id: 'sample-3',
    species: 'Perch',
    length1: 23.5,
    length2: 25.6,
    length3: 27.0,
    height: 6.56,
    width: 4.32,
  },
  {
    id: 'sample-4',
    species: 'Pike',
    length1: 37.0,
    length2: 40.0,
    length3: 42.5,
    height: 7.29,
    width: 4.57,
  },
  {
    id: 'sample-5',
    species: 'Smelt',
    length1: 11.3,
    length2: 11.8,
    length3: 13.1,
    height: 2.21,
    width: 1.28,
  },
];

export const BatchPredictor: React.FC = () => {
  const [items, setItems] = useState<BatchFishItem[]>(() => [...SAMPLE_BATCH]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<BatchHistoryEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  // Form state for adding/editing a fish
  const [formData, setFormData] = useState<Omit<BatchFishItem, 'id'>>({
    species: 'Bream',
    length1: 25.0,
    length2: 27.0,
    length3: 30.0,
    height: 10.0,
    width: 4.5,
  });

  // Load history from localStorage with strict schema validation
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Schema validation: ensure each entry has items array and summary
          const validEntries = parsed.filter(
            (e: any) =>
              e &&
              typeof e.id === 'string' &&
              Array.isArray(e.items) &&
              e.summary &&
              typeof e.summary.totalCount === 'number'
          );
          setHistory(validEntries);
        }
      }
    } catch (e) {
      console.warn('Failed to parse batch history from localStorage', e);
      setHistory([]);
    }
  }, []);

  // Save history helper (isolated to LOCAL_STORAGE_KEY)
  const saveHistoryToStorage = (updatedHistory: BatchHistoryEntry[]) => {
    setHistory(updatedHistory);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.warn('Failed to save batch history to localStorage', e);
    }
  };

  // Run predictions on current batch
  const { results, summary } = calculateBatchPredictions(items);

  // Form species change
  const handleSpeciesChange = (species: FishSpecies) => {
    const defaults = getSpeciesDefaults(species);
    setFormData({
      species,
      length1: defaults.length1,
      length2: defaults.length2,
      length3: defaults.length3,
      height: defaults.height,
      width: defaults.width,
    });
  };

  // Save Add/Edit Fish
  const handleSaveFish = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? { ...formData, id: editingId } : it))
      );
      setEditingId(null);
    } else {
      const newItem: BatchFishItem = {
        ...formData,
        id: `fish-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      };
      setItems((prev) => [...prev, newItem]);
    }
    setShowAddForm(false);
  };

  // Open Edit Form
  const handleStartEdit = (item: BatchFishItem) => {
    setEditingId(item.id);
    setFormData({
      species: item.species,
      length1: item.length1,
      length2: item.length2,
      length3: item.length3,
      height: item.height,
      width: item.width,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Fish
  const handleDeleteFish = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Clear All
  const handleClearAll = () => {
    if (items.length === 0) return;
    setItems([]);
    showToast('Cleared all fish records from current batch.');
  };

  // Load Sample Batch
  const handleLoadSample = () => {
    setItems([...SAMPLE_BATCH]);
    showToast('Loaded sample batch with 5 authentic specimens.');
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (results.length === 0) return;
    const csvContent = exportBatchToCSV(results);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `fish_batch_predictions_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported predictions to Excel-compatible CSV.');
  };

  // Save current batch to History
  const handleSaveToHistory = () => {
    if (items.length === 0) return;
    const newEntry: BatchHistoryEntry = {
      id: `hist-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      name: `Batch (${items.length} fish) - ${new Date().toLocaleTimeString()}`,
      items: [...items],
      summary,
    };
    const updated = [newEntry, ...history].slice(0, 20); // keep last 20
    saveHistoryToStorage(updated);
    showToast('Batch successfully saved to prediction history!');
  };

  // Restore history entry into current workspace
  const handleRestoreHistory = (entry: BatchHistoryEntry) => {
    setItems([...entry.items]);
    setShowHistory(false);
    showToast(`Restored batch: "${entry.name}"`);
  };

  // Delete single history entry
  const handleDeleteHistoryEntry = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistoryToStorage(updated);
    showToast('Deleted history entry.');
  };

  // Clear all history
  const handleClearHistory = () => {
    saveHistoryToStorage([]);
    showToast('Cleared prediction history.');
  };

  // Intelligent CSV Parser (Supports file upload & pasted text)
  const parseCSVContent = (content: string) => {
    const lines = content.trim().split(/\r?\n/);
    if (lines.length === 0) return;

    const newItems: BatchFishItem[] = [];
    let skippedCount = 0;
    const skipReasons: string[] = [];

    // Header index mapping if headers exist
    let headerMap: Record<string, number> | null = null;
    const firstLineParts = lines[0].split(/[,\t]/).map((p) => p.trim().toLowerCase());

    const isHeader =
      firstLineParts.some((p) => p.includes('species') || p.includes('length') || p.includes('weight'));

    if (isHeader) {
      headerMap = {};
      firstLineParts.forEach((col, idx) => {
        if (col.includes('species')) headerMap!['species'] = idx;
        else if (col.includes('length1') || col === 'l1') headerMap!['length1'] = idx;
        else if (col.includes('length2') || col === 'l2') headerMap!['length2'] = idx;
        else if (col.includes('length3') || col === 'l3') headerMap!['length3'] = idx;
        else if (col.includes('height') || col === 'h') headerMap!['height'] = idx;
        else if (col.includes('width') || col === 'w') headerMap!['width'] = idx;
      });
    }

    const startIndex = isHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(/[,\t]/).map((p) => p.trim());

      let spStr = '';
      let l1 = NaN;
      let l2 = NaN;
      let l3 = NaN;
      let h = NaN;
      let w = NaN;

      if (headerMap && headerMap['species'] !== undefined) {
        spStr = parts[headerMap['species']] || '';
        l1 = parseFloat(parts[headerMap['length1']]);
        l2 = parseFloat(parts[headerMap['length2']]);
        l3 = parseFloat(parts[headerMap['length3']]);
        h = parseFloat(parts[headerMap['height']]);
        w = parseFloat(parts[headerMap['width']]);
      } else {
        // Positional parsing fallbacks
        // Case A: Species, L1, L2, L3, Height, Width
        if (isNaN(parseFloat(parts[0])) && parts.length >= 6) {
          spStr = parts[0];
          l1 = parseFloat(parts[1]);
          l2 = parseFloat(parts[2]);
          l3 = parseFloat(parts[3]);
          h = parseFloat(parts[4]);
          w = parseFloat(parts[5]);
        }
        // Case B: Fish#, Species, L1, L2, L3, Height, Width
        else if (!isNaN(parseFloat(parts[0])) && parts.length >= 7 && isNaN(parseFloat(parts[1]))) {
          spStr = parts[1];
          l1 = parseFloat(parts[2]);
          l2 = parseFloat(parts[3]);
          l3 = parseFloat(parts[4]);
          h = parseFloat(parts[5]);
          w = parseFloat(parts[6]);
        }
        // Case C: Raw YBI Fish.csv format: Category, Species, Weight, Height, Width, Length1, Length2, Length3
        else if (parts.length >= 8 && isNaN(parseFloat(parts[1]))) {
          spStr = parts[1];
          h = parseFloat(parts[3]);
          w = parseFloat(parts[4]);
          l1 = parseFloat(parts[5]);
          l2 = parseFloat(parts[6]);
          l3 = parseFloat(parts[7]);
        }
      }

      const matchedSpecies = SPECIES_LIST.find(
        (s) => s.toLowerCase() === (spStr || '').toLowerCase()
      );

      if (!matchedSpecies) {
        skippedCount++;
        skipReasons.push(`Line ${i + 1}: Unrecognized species "${spStr}"`);
        continue;
      }

      if (isNaN(l1) || isNaN(l2) || isNaN(l3) || isNaN(h) || isNaN(w)) {
        skippedCount++;
        skipReasons.push(`Line ${i + 1}: Incomplete or non-numeric measurements`);
        continue;
      }

      newItems.push({
        id: `import-${Date.now()}-${i}`,
        species: matchedSpecies,
        length1: Math.round(l1 * 10) / 10,
        length2: Math.round(l2 * 10) / 10,
        length3: Math.round(l3 * 10) / 10,
        height: Math.round(h * 10) / 10,
        width: Math.round(w * 10) / 10,
      });
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setShowImportModal(false);
      setImportText('');
      setImportFeedback(
        `Imported ${newItems.length} records successfully.${
          skippedCount > 0 ? ` ${skippedCount} rows skipped due to format issues.` : ''
        }`
      );
    } else {
      setImportFeedback(`Failed to import records. ${skipReasons.slice(0, 3).join('; ')}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setImportText(text);
        parseCSVContent(text);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formSpeciesStats = (SUMMARY_STATS.species_stats as Record<string, any>)[formData.species];

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3 bg-cyan-950/90 border border-cyan-500/80 rounded-xl text-xs text-cyan-200 flex items-center justify-between shadow-lg backdrop-blur-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-cyan-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                species: 'Bream',
                ...getSpeciesDefaults('Bream'),
              });
              setShowAddForm(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Fish Record</span>
          </button>

          <button
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            title="Load 5 authentic specimens of diverse species"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Batch</span>
          </button>

          <button
            onClick={() => {
              setShowImportModal(true);
              setImportFeedback(null);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={results.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Export results to Excel-compatible CSV file"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveToHistory}
            disabled={items.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Save current batch to local history"
          >
            <Save className="w-3.5 h-3.5 text-slate-400" />
            <span>Save Batch</span>
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              showHistory
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>History ({history.length})</span>
          </button>

          <button
            onClick={handleClearAll}
            disabled={items.length === 0}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg border border-transparent hover:border-rose-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Clear all records in current batch"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Import Feedback Banner */}
      {importFeedback && (
        <div className="p-3 bg-slate-900/90 border border-cyan-800 rounded-xl text-xs text-cyan-300 flex items-center justify-between">
          <span>{importFeedback}</span>
          <button
            onClick={() => setImportFeedback(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* History Drawer / Panel */}
      {showHistory && (
        <div className="bg-[#111722] border border-cyan-800/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Prediction Batch History (Saved in LocalStorage)
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Clear History
                </button>
              )}
              <button
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">
              No saved batches found. Click &quot;Save Batch&quot; above to preserve your predictions across sessions.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-900/90 rounded-lg border border-slate-800 hover:border-slate-700 text-xs gap-2 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-slate-200">{entry.name}</span>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      <span>Saved: {entry.timestamp}</span>
                      <span className="mx-2">·</span>
                      <span>Total: {entry.summary.totalWeightGrams} g ({entry.summary.totalWeightKg} kg)</span>
                      <span className="mx-2">·</span>
                      <span>Avg: {entry.summary.averageWeightGrams} g</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleRestoreHistory(entry)}
                      className="px-2.5 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 rounded transition-colors whitespace-nowrap"
                    >
                      Restore Batch
                    </button>
                    <button
                      onClick={() => handleDeleteHistoryEntry(entry.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete this history entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Fish Form Modal / Card */}
      {showAddForm && (
        <form
          onSubmit={handleSaveFish}
          className="bg-[#151b26] border border-cyan-800/80 rounded-xl p-5 shadow-lg space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              {editingId ? 'Edit Fish Record' : 'Add New Fish Record to Batch'}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
              }}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Species */}
            <div className="space-y-1 sm:col-span-1">
              <label className="text-xs font-medium text-slate-300">Species</label>
              <select
                value={formData.species}
                onChange={(e) => handleSpeciesChange(e.target.value as FishSpecies)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded focus:outline-none focus:border-cyan-500"
              >
                {SPECIES_LIST.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
              {formSpeciesStats && (
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Median Weight: {formSpeciesStats.weight.median} g
                </p>
              )}
            </div>

            {/* Length 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Length 1 (Vertical)</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  [{formSpeciesStats?.dimensions?.Length1?.min} - {formSpeciesStats?.dimensions?.Length1?.max} cm]
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.length1}
                onChange={(e) =>
                  setFormData({ ...formData, length1: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 rounded focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Length 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Length 2 (Diagonal)</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  [{formSpeciesStats?.dimensions?.Length2?.min} - {formSpeciesStats?.dimensions?.Length2?.max} cm]
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.length2}
                onChange={(e) =>
                  setFormData({ ...formData, length2: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 rounded focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Length 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Length 3 (Cross)</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  [{formSpeciesStats?.dimensions?.Length3?.min} - {formSpeciesStats?.dimensions?.Length3?.max} cm]
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.length3}
                onChange={(e) =>
                  setFormData({ ...formData, length3: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 rounded focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Height */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Body Height</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  [{formSpeciesStats?.dimensions?.Height?.min} - {formSpeciesStats?.dimensions?.Height?.max} cm]
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 rounded focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Width */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Body Width</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  [{formSpeciesStats?.dimensions?.Width?.min} - {formSpeciesStats?.dimensions?.Width?.max} cm]
                </span>
              </div>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.width}
                onChange={(e) =>
                  setFormData({ ...formData, width: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 rounded focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Inline anatomical warning in form */}
          {formData.length1 > formData.length2 || formData.length2 > formData.length3 ? (
            <div className="p-2.5 rounded bg-orange-950/40 border border-orange-900/60 text-xs text-orange-300 flex items-center gap-2">
              <Ruler className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                Anatomical ordering warning: In typical fish morphology, Length 1 ≤ Length 2 ≤ Length 3.
              </span>
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
            >
              {editingId ? 'Update Fish' : 'Add to Batch'}
            </button>
          </div>
        </form>
      )}

      {/* CSV Import Modal (Upload file or Paste Text) */}
      {showImportModal && (
        <div className="bg-[#151b26] border border-cyan-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                Import Fish Records from CSV / Spreadsheet
              </h3>
            </div>
            <button
              onClick={() => setShowImportModal(false)}
              className="text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {/* File Upload Option */}
            <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-lg">
              <Upload className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="flex-1 text-xs text-slate-300">
                <span>Upload a .csv file:</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv,text/plain"
                  onChange={handleFileUpload}
                  className="block mt-1 text-xs text-slate-400 file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-medium file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 file:cursor-pointer"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400">
              Or paste CSV text below. Accepts both standard format (<code className="text-cyan-300 font-mono">Species, L1, L2, L3, Height, Width</code>) and raw YBI Foundation <code className="text-cyan-300 font-mono">Fish.csv</code> format:
            </div>

            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Species,Length1,Length2,Length3,Height,Width\nBream,23.2,25.4,30.0,11.52,4.02\nPerch,22.0,24.0,25.5,6.38,3.82`}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
            <button
              onClick={() => setShowImportModal(false)}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => parseCSVContent(importText)}
              disabled={!importText.trim()}
              className="px-4 py-1.5 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Parse Text &amp; Append
            </button>
          </div>
        </div>
      )}

      {/* PART 3: Batch Results & Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Fish */}
        <div className="p-3.5 bg-[#111722] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Total Entered
          </span>
          <span className="text-2xl font-mono font-bold text-white tabular-nums">
            {summary.totalCount}
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            specimens in batch
          </span>
        </div>

        {/* Successfully Predicted */}
        <div className="p-3.5 bg-[#111722] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Predicted Fish
          </span>
          <span className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
            {summary.successCount}
          </span>
          <span className="text-[10px] text-emerald-400/80 block font-mono">
            {summary.totalCount > 0
              ? `${Math.round((summary.successCount / summary.totalCount) * 100)}% valid physical`
              : '0%'}
          </span>
        </div>

        {/* Range Warnings & Anatomical Warnings */}
        <div className="p-3.5 bg-[#111722] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Validation Flags
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-amber-400 tabular-nums">
              {summary.warningCount}
            </span>
            <span className="text-xs font-mono text-orange-400">
              (+{summary.anatomicalWarningCount} anat.)
            </span>
          </div>
          <span className="text-[10px] text-amber-400/80 block font-mono">
            extrapolations &amp; checks
          </span>
        </div>

        {/* Total Weight */}
        <div className="p-3.5 bg-[#111722] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Total Weight
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-cyan-300 tabular-nums">
              {summary.totalWeightGrams.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">g</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            {summary.totalWeightKg.toFixed(3)} kg
          </span>
        </div>

        {/* Average Weight */}
        <div className="p-3.5 bg-[#111722] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Average Weight
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-mono font-bold text-slate-200 tabular-nums">
              {summary.averageWeightGrams.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">g</span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">
            per valid specimen
          </span>
        </div>

        {/* Min / Max Weight */}
        <div className="p-3.5 bg-[#111722] border border-slate-800 rounded-xl space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Weight Range
          </span>
          <div className="text-xs font-mono text-slate-200 pt-1 space-y-0.5">
            <div>
              Min: <strong className="text-cyan-400">{summary.minWeightGrams.toFixed(1)} g</strong>
            </div>
            <div>
              Max: <strong className="text-cyan-400">{summary.maxWeightGrams.toFixed(1)} g</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Exclusion Explanation Banner */}
      {summary.excludedCount > 0 && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-900/60 rounded-xl text-xs space-y-1">
          <div className="flex items-center gap-2 text-rose-300 font-semibold uppercase tracking-wider text-[11px]">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>
              {summary.excludedCount} Record(s) Excluded from Total &amp; Average Calculations
            </span>
          </div>
          <p className="text-rose-200/90 leading-relaxed text-[11px]">
            {summary.excludedReasons.nonPhysicalCount > 0 && (
              <span>
                • {summary.excludedReasons.nonPhysicalCount} record(s) calculated negative unconstrained weights. In accordance with physical reality, negative estimates are excluded rather than coerced to 0 g.{' '}
              </span>
            )}
            {summary.excludedReasons.invalidCount > 0 && (
              <span>
                • {summary.excludedReasons.invalidCount} record(s) contained non-positive or missing dimensions.
              </span>
            )}
          </p>
        </div>
      )}

      {/* PART 3: Batch Results Table */}
      <div className="bg-[#111722] border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Individual Fish Results ({results.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Each fish predicted individually using Multiple Linear Regression with species range and anatomical checks
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {summary.successCount} of {summary.totalCount} physically valid
          </span>
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <p className="text-sm">No fish records in current batch.</p>
            <button
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load 5 Sample Fish Records</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Fish #</th>
                  <th className="py-2.5 px-3">Species</th>
                  <th className="py-2.5 px-3 text-right">L₁ (cm)</th>
                  <th className="py-2.5 px-3 text-right">L₂ (cm)</th>
                  <th className="py-2.5 px-3 text-right">L₃ (cm)</th>
                  <th className="py-2.5 px-3 text-right">Height (cm)</th>
                  <th className="py-2.5 px-3 text-right">Width (cm)</th>
                  <th className="py-2.5 px-3 text-right">Predicted Weight</th>
                  <th className="py-2.5 px-3 text-center">Validation Status</th>
                  <th className="py-2.5 px-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
                {results.map((res, index) => {
                  const { item, prediction } = res;
                  const isPhysical = prediction.isPhysicallyMeaningful;
                  const status = prediction.validation.status;
                  const hasAnatomyWarning = prediction.validation.hasAnatomicalInconsistencies;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-slate-400 font-bold">
                        #{index + 1}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-200">
                        {item.species}
                      </td>
                      <td className="py-2.5 px-3 text-right">{item.length1}</td>
                      <td className="py-2.5 px-3 text-right">{item.length2}</td>
                      <td className="py-2.5 px-3 text-right">{item.length3}</td>
                      <td className="py-2.5 px-3 text-right">{item.height}</td>
                      <td className="py-2.5 px-3 text-right">{item.width}</td>

                      {/* Predicted Weight Column */}
                      <td className="py-2.5 px-3 text-right">
                        {isPhysical && prediction.predictedWeightGrams !== null ? (
                          <div>
                            <span className="font-bold text-cyan-400">
                              {prediction.predictedWeightGrams.toFixed(1)} g
                            </span>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {prediction.weightKg?.toFixed(3)} kg
                            </span>
                          </div>
                        ) : (
                          <div className="text-rose-400">
                            <span className="font-bold">Non-Physical</span>
                            <span className="text-[10px] text-rose-300/70 block">
                              ({prediction.rawWeight.toFixed(1)} g)
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Validation Status Badges */}
                      <td className="py-2.5 px-3 text-center font-sans">
                        <div className="flex items-center justify-center gap-1 flex-wrap">
                          {status === 'valid' && isPhysical && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/70 px-1.5 py-0.5 rounded">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>In Range</span>
                            </span>
                          )}
                          {status === 'extrapolated' && isPhysical && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 border border-amber-800/70 px-1.5 py-0.5 rounded cursor-help"
                              title={prediction.validation.trainingRangeWarnings.join('\n')}
                            >
                              <AlertTriangle className="w-2.5 h-2.5" />
                              <span>Extrapolated</span>
                            </span>
                          )}
                          {hasAnatomyWarning && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] text-orange-400 bg-orange-950/60 border border-orange-800/70 px-1.5 py-0.5 rounded cursor-help"
                              title={prediction.validation.anatomicalWarnings.join('\n')}
                            >
                              <Ruler className="w-2.5 h-2.5" />
                              <span>Anatomy</span>
                            </span>
                          )}
                          {!isPhysical && (
                            <span
                              className="inline-flex items-center gap-1 text-[10px] text-rose-400 bg-rose-950/60 border border-rose-800/70 px-1.5 py-0.5 rounded cursor-help"
                              title={prediction.nonPhysicalExplanation}
                            >
                              <AlertCircle className="w-2.5 h-2.5" />
                              <span>Excluded</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStartEdit(item)}
                            className="text-slate-400 hover:text-cyan-300 p-1 transition-colors"
                            title="Edit measurements"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteFish(item.id)}
                            className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                            title="Remove fish from batch"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
