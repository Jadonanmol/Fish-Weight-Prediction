export type FishSpecies =
  | 'Bream'
  | 'Parkki'
  | 'Perch'
  | 'Pike'
  | 'Roach'
  | 'Smelt'
  | 'Whitefish';

export interface Morphometrics {
  species: FishSpecies;
  length1: number; // Vertical length in cm (standard length)
  length2: number; // Diagonal length in cm (fork length)
  length3: number; // Cross length in cm (total length)
  height: number;  // Height in cm
  width: number;   // Width in cm
}

export type DimensionKey = 'length1' | 'length2' | 'length3' | 'height' | 'width';

export interface DimensionValidation {
  key: DimensionKey;
  label: string;
  value: number;
  min: number;
  max: number;
  isExtrapolated: boolean;
  reason?: 'below_min' | 'above_max';
}

export type ValidationStatus = 'valid' | 'extrapolated' | 'invalid';

export interface ValidationResult {
  status: ValidationStatus;
  dimensionValidations: DimensionValidation[];
  trainingRangeWarnings: string[];
  anatomicalWarnings: string[];
  warnings: string[]; // combined list for compatibility
  errors: string[];
  hasExtrapolations: boolean;
  hasAnatomicalInconsistencies: boolean;
  hasErrors: boolean;
}

export interface PredictionResult {
  rawWeight: number;
  predictedWeightGrams: number | null;
  weightKg: number | null;
  weightOz: number | null;
  isPhysicallyMeaningful: boolean;
  nonPhysicalExplanation?: string;
  validation: ValidationResult;
  speciesMedianWeight: number;
  speciesAverageWeight: number;
}

export interface BatchFishItem {
  id: string;
  species: FishSpecies;
  length1: number;
  length2: number;
  length3: number;
  height: number;
  width: number;
}

export interface BatchPredictionItem {
  item: BatchFishItem;
  prediction: PredictionResult;
}

export interface BatchSummaryStats {
  totalCount: number;
  successCount: number;
  warningCount: number; // records with training range extrapolations
  anatomicalWarningCount: number; // records with anatomical inconsistencies
  excludedCount: number;
  excludedReasons: {
    nonPhysicalCount: number;
    invalidCount: number;
  };
  totalWeightGrams: number;
  totalWeightKg: number;
  averageWeightGrams: number;
  minWeightGrams: number;
  maxWeightGrams: number;
}

export interface BatchHistoryEntry {
  id: string;
  timestamp: string;
  name: string;
  items: BatchFishItem[];
  summary: BatchSummaryStats;
}
