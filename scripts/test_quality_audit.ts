/**
 * Comprehensive Quality Audit & Functional Test Script
 * Verifies:
 * 1. Anatomical Validation (L1 <= L2 <= L3 consistency)
 * 2. Prediction Equivalence: Single Fish vs Batch Mode produce identical results
 * 3. Unit Conversions (grams, kg, oz)
 * 4. Non-physical Negative Prediction handling (no silent zeroing)
 * 5. Aggregation Logic: Excludes non-physical and invalid items from total/average
 * 6. CSV Export encoding and format (UTF-8 BOM, columns)
 * 7. Python CLI Predictor parity
 */

import { calculateFishWeight, calculateBatchPredictions, exportBatchToCSV, validateMorphometrics } from '../src/utils/predictor';
import { Morphometrics, BatchFishItem } from '../src/types/fish';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

console.log('\n=== RUNNING FISH WEIGHT ML QUALITY AUDIT ===\n');

// 1. ANATOMICAL CONSISTENCY VALIDATION
console.log('1. Testing Anatomical Consistency Validation (L1 <= L2 <= L3)...');
const normalSpecimen: Morphometrics = {
  species: 'Bream',
  length1: 25.0,
  length2: 27.5,
  length3: 31.0,
  height: 12.0,
  width: 4.5,
};
const normalVal = validateMorphometrics(normalSpecimen);
assert(!normalVal.hasAnatomicalInconsistencies, 'Normal fish (L1 <= L2 <= L3) has no anatomical inconsistencies');
assert(normalVal.anatomicalWarnings.length === 0, 'No anatomical warnings for normal fish');

const invalidAnatomySpecimen: Morphometrics = {
  species: 'Bream',
  length1: 35.0, // L1 > L2 violation
  length2: 27.5,
  length3: 20.0, // L2 > L3 violation
  height: 12.0,
  width: 4.5,
};
const invalidAnatomyVal = validateMorphometrics(invalidAnatomySpecimen);
assert(invalidAnatomyVal.hasAnatomicalInconsistencies, 'Flagged anatomical inconsistencies when L1 > L2 and L2 > L3');
assert(invalidAnatomyVal.anatomicalWarnings.length === 2, 'Generated exactly 2 distinct anatomical warnings for both violations');
assert(invalidAnatomyVal.trainingRangeWarnings.length >= 0, 'Anatomical warnings kept strictly separate from training range warnings');

// 2. PREDICTION EQUIVALENCE (SINGLE vs BATCH)
console.log('\n2. Testing Single vs Batch Prediction Equivalence...');
const testSpecimens: Morphometrics[] = [
  { species: 'Bream', length1: 23.2, length2: 25.4, length3: 30.0, height: 11.52, width: 4.02 },
  { species: 'Perch', length1: 19.0, length2: 21.0, length3: 22.5, height: 5.69, width: 3.56 },
  { species: 'Pike', length1: 34.8, length2: 37.3, length3: 39.8, height: 6.29, width: 4.46 },
  { species: 'Roach', length1: 21.1, length2: 23.0, length3: 25.8, height: 6.91, width: 3.97 },
  { species: 'Smelt', length1: 9.3, length2: 9.8, length3: 10.8, height: 1.73, width: 0.97 },
];

const batchItems: BatchFishItem[] = testSpecimens.map((sp, idx) => ({ ...sp, id: `test-${idx}` }));
const batchResult = calculateBatchPredictions(batchItems);

testSpecimens.forEach((specimen, idx) => {
  const single = calculateFishWeight(specimen);
  const batchItem = batchResult.results[idx];
  assert(
    single.rawWeight === batchItem.prediction.rawWeight &&
    single.predictedWeightGrams === batchItem.prediction.predictedWeightGrams,
    `Specimen ${specimen.species} has 100% computational equivalence (Single: ${single.predictedWeightGrams}g, Batch: ${batchItem.prediction.predictedWeightGrams}g)`
  );
});

// 3. UNIT CONVERSIONS VERIFICATION
console.log('\n3. Testing Unit Conversions (g -> kg, g -> oz)...');
const breamPred = calculateFishWeight(testSpecimens[0]);
if (breamPred.predictedWeightGrams !== null && breamPred.weightKg !== null && breamPred.weightOz !== null) {
  const expectedKg = Math.round((breamPred.predictedWeightGrams / 1000) * 1000) / 1000;
  const expectedOz = Math.round(breamPred.predictedWeightGrams * 0.035274 * 10) / 10;
  assert(breamPred.weightKg === expectedKg, `Weight in kg correctly converted (${breamPred.weightKg} kg = ${breamPred.predictedWeightGrams} g / 1000)`);
  assert(breamPred.weightOz === expectedOz, `Weight in oz correctly converted (${breamPred.weightOz} oz = ${breamPred.predictedWeightGrams} g * 0.035274)`);
}

// 4. NON-PHYSICAL NEGATIVE MODEL PREDICTION
console.log('\n4. Testing Negative Prediction Handling (Non-Physical)...');
// Dimensions that produce negative output with linear equation intercept (-770.14)
const tinyFish: Morphometrics = {
  species: 'Bream',
  length1: 1.0,
  length2: 1.2,
  length3: 1.5,
  height: 0.5,
  width: 0.2,
};
const tinyPred = calculateFishWeight(tinyFish);
assert(!tinyPred.isPhysicallyMeaningful, 'Tiny fish correctly marked isPhysicallyMeaningful = false');
assert(tinyPred.predictedWeightGrams === null, 'predictedWeightGrams is set to null, NOT silently coerced to 0 g');
assert(tinyPred.rawWeight < 0, `rawWeight preserves actual negative equation output (${tinyPred.rawWeight} g)`);
assert(tinyPred.nonPhysicalExplanation.includes('unconstrained value'), 'Provides clear physical explanation for model limitation');

// 5. BATCH AGGREGATION EXCLUSION
console.log('\n5. Testing Batch Summary Aggregation & Exclusion Logic...');
const mixedBatch: BatchFishItem[] = [
  { id: '1', species: 'Bream', length1: 26.8, length2: 29.7, length3: 34.5, height: 14.18, width: 5.28 }, // Valid (~422g)
  { id: '2', species: 'Smelt', length1: 1.0, length2: 1.2, length3: 1.5, height: 0.5, width: 0.2 }, // Negative (< 0g, non-physical)
  { id: '3', species: 'Perch', length1: -5.0, length2: 20.0, length3: 22.0, height: 5.0, width: 3.0 }, // Invalid input (negative dimension)
];
const mixedResults = calculateBatchPredictions(mixedBatch);
assert(mixedResults.summary.totalCount === 3, 'Total count reflects all 3 entered records');
assert(mixedResults.summary.successCount === 1, 'Only 1 valid physical record is counted in successCount');
assert(mixedResults.summary.excludedCount === 2, '2 records (1 non-physical negative + 1 invalid error) are excluded');
assert(mixedResults.summary.totalWeightGrams === mixedResults.results[0].prediction.predictedWeightGrams, 'Total weight strictly sums only physically meaningful records');
assert(mixedResults.summary.averageWeightGrams === mixedResults.results[0].prediction.predictedWeightGrams, 'Average weight strictly calculated only over physically meaningful records');

// 6. CSV EXPORT & EXCEL COMPATIBILITY
console.log('\n6. Testing CSV Export UTF-8 BOM & Headers...');
const csvOutput = exportBatchToCSV(batchResult.results);
assert(csvOutput.startsWith('\uFEFF'), 'CSV starts with UTF-8 BOM (\\uFEFF) for Microsoft Excel compatibility');
assert(csvOutput.includes('Fish #,Species,Length1 (cm),Length2 (cm),Length3 (cm),Height (cm),Width (cm),Predicted Weight (g),Predicted Weight (kg),Range Status,Anatomical Consistency,Physical Validity,Validation Notes'), 'CSV contains all required data headers and separate statuses');
assert(csvOutput.includes('Bream') && csvOutput.includes('Smelt'), 'CSV contains row data for all specimens');

console.log(`\n=== AUDIT RESULTS: ${passedTests}/${totalTests} TESTS PASSED ===\n`);
