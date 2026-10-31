import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { MorphometricForm } from './components/MorphometricForm';
import { PredictionCard } from './components/PredictionCard';
import { ModelMetricsCard } from './components/ModelMetricsCard';
import { FishAnatomyVisualizer } from './components/FishAnatomyVisualizer';
import { RegressionPlots } from './components/RegressionPlots';
import { ResidualAnalysis } from './components/ResidualAnalysis';
import { DatasetExplorer } from './components/DatasetExplorer';
import { Footer } from './components/Footer';
import { Morphometrics } from './types/fish';
import { calculateFishWeight, getSpeciesDefaults } from './utils/predictor';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'predictor' | 'regression' | 'residuals' | 'dataset'
  >('predictor');

  const [morphometrics, setMorphometrics] = useState<Morphometrics>(() =>
    getSpeciesDefaults('Bream')
  );

  // Compute prediction synchronously using verified ML model equation
  const prediction = useMemo(
    () => calculateFishWeight(morphometrics),
    [morphometrics]
  );

  const handleReset = () => {
    setMorphometrics(getSpeciesDefaults(morphometrics.species));
  };

  const handleLoadSpecimen = (loadedMorphometrics: Morphometrics) => {
    setMorphometrics(loadedMorphometrics);
    setActiveTab('predictor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Sub-Header Banner with Context & Verified Benchmark */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">
              Multiple Linear Regression Fish Weight Prediction
            </h2>
            <p className="text-xs text-slate-400">
              Trained on 158 physical specimens across 7 species from the YBI Foundation dataset.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
              Holdout R²: <strong className="text-cyan-400">0.9497</strong>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
              Holdout MAE: <strong className="text-cyan-400">63.23 g</strong>
            </span>
          </div>
        </div>

        {/* Tab 1: Interactive Predictor & Anatomy */}
        {activeTab === 'predictor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Morphometric Form Controls (5 columns on desktop) */}
            <div className="lg:col-span-5 space-y-6">
              <MorphometricForm
                values={morphometrics}
                onChange={setMorphometrics}
                onReset={handleReset}
              />
            </div>

            {/* Right Column: Visualization, Prediction & Model Evaluation (7 columns on desktop) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Dynamic SVG Fish Anatomy Visualization */}
              <FishAnatomyVisualizer morphometrics={morphometrics} />

              {/* Weight Prediction Output */}
              <PredictionCard
                prediction={prediction}
                inputs={morphometrics}
              />

              {/* Separated Model Performance & Metrics Card */}
              <ModelMetricsCard />
            </div>
          </div>
        )}

        {/* Tab 2: Regression Curves */}
        {activeTab === 'regression' && (
          <div className="space-y-6">
            <RegressionPlots
              currentInput={morphometrics}
              currentPrediction={prediction}
            />
          </div>
        )}

        {/* Tab 3: Residual Analysis */}
        {activeTab === 'residuals' && (
          <div className="space-y-6">
            <ResidualAnalysis />
          </div>
        )}

        {/* Tab 4: YBI Dataset Explorer */}
        {activeTab === 'dataset' && (
          <div className="space-y-6">
            <DatasetExplorer onLoadFish={handleLoadSpecimen} />
          </div>
        )}
      </main>

      {/* Attribution Footer */}
      <Footer />
    </div>
  );
}
