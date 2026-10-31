import { MODEL_METADATA, SUMMARY_STATS } from '../data/modelData';
import { Morphometrics, PredictionResult, FishSpecies } from '../types/fish';

export function calculateFishWeight(input: Morphometrics): PredictionResult {
  const { species, length1, length2, length3, height, width } = input;
  const coefs = MODEL_METADATA.coefficients;
  const intercept = MODEL_METADATA.intercept;

  // Multiple Linear Regression Equation
  let rawWeight = intercept;
  rawWeight += (coefs['Length1'] || 0) * length1;
  rawWeight += (coefs['Length2'] || 0) * length2;
  rawWeight += (coefs['Length3'] || 0) * length3;
  rawWeight += (coefs['Height'] || 0) * height;
  rawWeight += (coefs['Width'] || 0) * width;

  // Species One-Hot Term
  const speciesKey = `Species_${species}`;
  rawWeight += (coefs[speciesKey] || 0);

  // In biological reality, physical fish weight is non-negative
  const physicalWeight = Math.max(0, Math.round(rawWeight * 10) / 10);
  const weightKg = Math.round((physicalWeight / 1000) * 1000) / 1000;
  const weightOz = Math.round(physicalWeight * 0.035274 * 10) / 10;

  const speciesStats = (SUMMARY_STATS.species_stats as Record<string, any>)[species];
  const speciesMedian = speciesStats?.weight?.median || 0;
  const speciesMean = speciesStats?.weight?.mean || 0;

  return {
    predictedWeightGrams: physicalWeight,
    weightKg,
    weightOz,
    speciesMedianWeight: speciesMedian,
    speciesAverageWeight: speciesMean,
  };
}

export function getSpeciesDefaults(species: FishSpecies): Morphometrics {
  const speciesStats = (SUMMARY_STATS.species_stats as Record<string, any>)[species];
  const dims = speciesStats?.dimensions;

  return {
    species,
    length1: dims?.Length1?.mean ?? 25.0,
    length2: dims?.Length2?.mean ?? 27.0,
    length3: dims?.Length3?.mean ?? 30.0,
    height: dims?.Height?.mean ?? 10.0,
    width: dims?.Width?.mean ?? 4.5,
  };
}
