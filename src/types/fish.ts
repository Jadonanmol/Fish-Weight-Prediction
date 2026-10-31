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
  length1: number; // Vertical length in cm
  length2: number; // Diagonal length in cm
  length3: number; // Cross length in cm
  height: number;  // Height in cm
  width: number;   // Width in cm
}

export interface PredictionResult {
  predictedWeightGrams: number;
  weightKg: number;
  weightOz: number;
  speciesMedianWeight: number;
  speciesAverageWeight: number;
}
