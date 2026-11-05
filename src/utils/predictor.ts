import { MODEL_METADATA, SUMMARY_STATS } from '../data/modelData';
import {
  Morphometrics,
  PredictionResult,
  FishSpecies,
  ValidationResult,
  DimensionValidation,
  DimensionKey,
  BatchFishItem,
  BatchPredictionItem,
  BatchSummaryStats,
} from '../types/fish';

const DIMENSION_CONFIG: Array<{
  key: DimensionKey;
  statKey: 'Length1' | 'Length2' | 'Length3' | 'Height' | 'Width';
  label: string;
}> = [
  { key: 'length1', statKey: 'Length1', label: 'Length 1 (Vertical)' },
  { key: 'length2', statKey: 'Length2', label: 'Length 2 (Diagonal)' },
  { key: 'length3', statKey: 'Length3', label: 'Length 3 (Cross)' },
  { key: 'height', statKey: 'Height', label: 'Body Height' },
  { key: 'width', statKey: 'Width', label: 'Body Width' },
];

/**
 * Validates measurement inputs against:
 * 1. Positive numbers check (greater than 0 cm)
 * 2. Species individual minimum and maximum empirical training-data ranges (from SUMMARY_STATS.species_stats)
 * 3. Cross-measurement anatomical consistency: Length 1 <= Length 2 <= Length 3
 * 
 * Note: Does NOT modify user inputs. Anatomical warnings are kept strictly separate
 * from training-range extrapolation warnings.
 */
export function validateMorphometrics(input: Morphometrics): ValidationResult {
  const { species, length1, length2, length3 } = input;
  const speciesStats = (SUMMARY_STATS.species_stats as Record<string, any>)[species];
  const dims = speciesStats?.dimensions || {};

  const dimensionValidations: DimensionValidation[] = [];
  const trainingRangeWarnings: string[] = [];
  const anatomicalWarnings: string[] = [];
  const errors: string[] = [];

  // 1. Dimension-level boundary and positive validation
  for (const dim of DIMENSION_CONFIG) {
    const val = input[dim.key];
    const stat = dims[dim.statKey];

    if (val === undefined || val === null || isNaN(val) || val <= 0) {
      errors.push(`${dim.label} must be a positive number greater than 0 cm.`);
      dimensionValidations.push({
        key: dim.key,
        label: dim.label,
        value: val,
        min: stat?.min ?? 0,
        max: stat?.max ?? 0,
        isExtrapolated: false,
      });
      continue;
    }

    if (stat) {
      const minVal = stat.min;
      const maxVal = stat.max;

      if (val < minVal) {
        trainingRangeWarnings.push(
          `${dim.label} (${val} cm) is below training-data minimum (${minVal} cm) for ${species}.`
        );
        dimensionValidations.push({
          key: dim.key,
          label: dim.label,
          value: val,
          min: minVal,
          max: maxVal,
          isExtrapolated: true,
          reason: 'below_min',
        });
      } else if (val > maxVal) {
        trainingRangeWarnings.push(
          `${dim.label} (${val} cm) exceeds training-data maximum (${maxVal} cm) for ${species}.`
        );
        dimensionValidations.push({
          key: dim.key,
          label: dim.label,
          value: val,
          min: minVal,
          max: maxVal,
          isExtrapolated: true,
          reason: 'above_max',
        });
      } else {
        dimensionValidations.push({
          key: dim.key,
          label: dim.label,
          value: val,
          min: minVal,
          max: maxVal,
          isExtrapolated: false,
        });
      }
    } else {
      dimensionValidations.push({
        key: dim.key,
        label: dim.label,
        value: val,
        min: 0,
        max: 0,
        isExtrapolated: false,
      });
    }
  }

  // 2. Cross-measurement anatomical consistency validation:
  // In standard fish anatomy:
  // Length 1 (Standard / Vertical length, snout to caudal peduncle)
  // Length 2 (Fork / Diagonal length, snout to tail fork)
  // Length 3 (Total / Cross length, snout to tail tip)
  // Therefore, biologically: Length 1 <= Length 2 <= Length 3
  if (length1 > 0 && length2 > 0 && length1 > length2) {
    anatomicalWarnings.push(
      `Anatomical Inconsistency: Length 1 (Vertical / Standard: ${length1} cm) exceeds Length 2 (Diagonal / Fork: ${length2} cm). In standard morphology, Length 1 ≤ Length 2.`
    );
  }
  if (length2 > 0 && length3 > 0 && length2 > length3) {
    anatomicalWarnings.push(
      `Anatomical Inconsistency: Length 2 (Diagonal / Fork: ${length2} cm) exceeds Length 3 (Cross / Total: ${length3} cm). In standard morphology, Length 2 ≤ Length 3.`
    );
  }
  if (length1 > 0 && length3 > 0 && length1 > length3 && length1 <= length2) {
    anatomicalWarnings.push(
      `Anatomical Inconsistency: Length 1 (Vertical / Standard: ${length1} cm) exceeds Length 3 (Cross / Total: ${length3} cm). In standard morphology, Length 1 ≤ Length 3.`
    );
  }

  const hasErrors = errors.length > 0;
  const hasExtrapolations = trainingRangeWarnings.length > 0;
  const hasAnatomicalInconsistencies = anatomicalWarnings.length > 0;
  const status = hasErrors ? 'invalid' : hasExtrapolations ? 'extrapolated' : 'valid';

  return {
    status,
    dimensionValidations,
    trainingRangeWarnings,
    anatomicalWarnings,
    warnings: [...trainingRangeWarnings, ...anatomicalWarnings],
    errors,
    hasExtrapolations,
    hasAnatomicalInconsistencies,
    hasErrors,
  };
}

/**
 * Predicts fish weight using the exact trained Multiple Linear Regression model
 * and checks physical feasibility without silently converting negative values to 0.
 */
export function calculateFishWeight(input: Morphometrics): PredictionResult {
  const validation = validateMorphometrics(input);
  const { species, length1, length2, length3, height, width } = input;
  const coefs = MODEL_METADATA.coefficients;
  const intercept = MODEL_METADATA.intercept;

  const speciesStats = (SUMMARY_STATS.species_stats as Record<string, any>)[species];
  const speciesMedian = speciesStats?.weight?.median || 0;
  const speciesMean = speciesStats?.weight?.mean || 0;

  // If input has critical errors (NaN or non-positive values), do not compute
  if (validation.hasErrors) {
    return {
      rawWeight: 0,
      predictedWeightGrams: null,
      weightKg: null,
      weightOz: null,
      isPhysicallyMeaningful: false,
      nonPhysicalExplanation: 'Cannot calculate prediction: physical measurements must be valid positive numbers greater than 0 cm.',
      validation,
      speciesMedianWeight: speciesMedian,
      speciesAverageWeight: speciesMean,
    };
  }

  // Exact Multiple Linear Regression Equation (UNMODIFIED)
  let rawWeight = intercept;
  rawWeight += (coefs['Length1'] || 0) * length1;
  rawWeight += (coefs['Length2'] || 0) * length2;
  rawWeight += (coefs['Length3'] || 0) * length3;
  rawWeight += (coefs['Height'] || 0) * height;
  rawWeight += (coefs['Width'] || 0) * width;

  // Species One-Hot Term
  const speciesKey = `Species_${species}`;
  rawWeight += (coefs[speciesKey] || 0);

  // Requirement: Handle negative model predictions properly.
  // Do not display a negative physical weight or silently convert it to 0 g.
  if (rawWeight <= 0) {
    return {
      rawWeight: Math.round(rawWeight * 10) / 10,
      predictedWeightGrams: null,
      weightKg: null,
      weightOz: null,
      isPhysicallyMeaningful: false,
      nonPhysicalExplanation: `The multiple linear regression equation calculated an unconstrained value of ${rawWeight.toFixed(1)} g. Because physical fish mass must be positive, this indicates the input measurements fall outside the physically valid domain of the linear model. The model cannot provide a physically meaningful estimate for this combination of inputs.`,
      validation,
      speciesMedianWeight: speciesMedian,
      speciesAverageWeight: speciesMean,
    };
  }

  const roundedWeight = Math.round(rawWeight * 10) / 10;
  const weightKg = Math.round((roundedWeight / 1000) * 1000) / 1000;
  const weightOz = Math.round(roundedWeight * 0.035274 * 10) / 10;

  return {
    rawWeight: roundedWeight,
    predictedWeightGrams: roundedWeight,
    weightKg,
    weightOz,
    isPhysicallyMeaningful: true,
    validation,
    speciesMedianWeight: speciesMedian,
    speciesAverageWeight: speciesMean,
  };
}

/**
 * Calculates predictions and summary statistics for a batch of fish items.
 */
export function calculateBatchPredictions(items: BatchFishItem[]): {
  results: BatchPredictionItem[];
  summary: BatchSummaryStats;
} {
  const results: BatchPredictionItem[] = items.map((item) => ({
    item,
    prediction: calculateFishWeight({
      species: item.species,
      length1: item.length1,
      length2: item.length2,
      length3: item.length3,
      height: item.height,
      width: item.width,
    }),
  }));

  const totalCount = items.length;
  let successCount = 0;
  let warningCount = 0;
  let anatomicalWarningCount = 0;
  let nonPhysicalCount = 0;
  let invalidCount = 0;

  const validWeights: number[] = [];

  for (const res of results) {
    if (res.prediction.validation.hasErrors) {
      invalidCount++;
    } else if (!res.prediction.isPhysicallyMeaningful) {
      nonPhysicalCount++;
    } else {
      successCount++;
      validWeights.push(res.prediction.predictedWeightGrams!);
    }

    // Warnings tracking
    if (res.prediction.validation.hasExtrapolations) {
      warningCount++;
    }
    if (res.prediction.validation.hasAnatomicalInconsistencies) {
      anatomicalWarningCount++;
    }
  }

  const excludedCount = nonPhysicalCount + invalidCount;
  const totalWeightGrams = validWeights.reduce((acc, w) => acc + w, 0);
  const roundedTotalGrams = Math.round(totalWeightGrams * 10) / 10;
  const totalWeightKg = Math.round((roundedTotalGrams / 1000) * 1000) / 1000;
  const averageWeightGrams =
    validWeights.length > 0
      ? Math.round((totalWeightGrams / validWeights.length) * 10) / 10
      : 0;
  const minWeightGrams =
    validWeights.length > 0 ? Math.min(...validWeights) : 0;
  const maxWeightGrams =
    validWeights.length > 0 ? Math.max(...validWeights) : 0;

  const summary: BatchSummaryStats = {
    totalCount,
    successCount,
    warningCount,
    anatomicalWarningCount,
    excludedCount,
    excludedReasons: {
      nonPhysicalCount,
      invalidCount,
    },
    totalWeightGrams: roundedTotalGrams,
    totalWeightKg,
    averageWeightGrams,
    minWeightGrams,
    maxWeightGrams,
  };

  return { results, summary };
}

/**
 * Generates CSV string for exporting batch prediction results.
 * Includes UTF-8 BOM (\uFEFF) for immediate compatibility with Microsoft Excel.
 */
export function exportBatchToCSV(items: BatchPredictionItem[]): string {
  const headers = [
    'Fish #',
    'Species',
    'Length1 (cm)',
    'Length2 (cm)',
    'Length3 (cm)',
    'Height (cm)',
    'Width (cm)',
    'Predicted Weight (g)',
    'Predicted Weight (kg)',
    'Range Status',
    'Anatomical Consistency',
    'Physical Validity',
    'Validation Notes',
  ];

  const rows = items.map((res, index) => {
    const { item, prediction } = res;
    const status = prediction.validation.status;
    const isPhysical = prediction.isPhysicallyMeaningful;
    const weightG = isPhysical && prediction.predictedWeightGrams !== null
      ? prediction.predictedWeightGrams.toFixed(1)
      : 'N/A';
    const weightKg = isPhysical && prediction.weightKg !== null
      ? prediction.weightKg.toFixed(3)
      : 'N/A';

    const anatomicalStatus = prediction.validation.hasAnatomicalInconsistencies
      ? 'Inconsistent (L1 > L2 or L2 > L3)'
      : 'Consistent (L1 <= L2 <= L3)';

    const notesList: string[] = [];
    if (prediction.validation.hasErrors) {
      notesList.push(...prediction.validation.errors);
    }
    if (!isPhysical) {
      notesList.push(prediction.nonPhysicalExplanation || 'Non-physical negative prediction');
    }
    if (prediction.validation.trainingRangeWarnings.length > 0) {
      notesList.push(...prediction.validation.trainingRangeWarnings);
    }
    if (prediction.validation.anatomicalWarnings.length > 0) {
      notesList.push(...prediction.validation.anatomicalWarnings);
    }
    if (notesList.length === 0) {
      notesList.push('Within empirical training range & anatomically consistent');
    }

    const notesStr = notesList.join('; ').replace(/"/g, '""');

    return [
      index + 1,
      item.species,
      item.length1,
      item.length2,
      item.length3,
      item.height,
      item.width,
      weightG,
      weightKg,
      status === 'valid' ? 'Valid (In Range)' : status === 'extrapolated' ? 'Extrapolated' : 'Invalid',
      anatomicalStatus,
      isPhysical ? 'Valid (Positive)' : 'Non-Physical',
      `"${notesStr}"`,
    ].join(',');
  });

  // \uFEFF ensures UTF-8 BOM for Microsoft Excel on Windows/macOS
  return '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
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
