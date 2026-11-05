# Fish Weight Prediction & ML Lab

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-1.2%2B-orange.svg)](https://scikit-learn.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete, production-grade machine learning project and interactive web application to predict fish weight non-destructively using **Multiple Linear Regression** and morphometric analysis, built upon the **YBI Foundation Fish Dataset**.

***

## Acknowledgments & Attribution 

This project is developed using the dataset and machine learning project structure inspired by **[YBI Foundation](https://github.com/YBI-Foundation)**.
- **YBI Foundation Dataset Repository**: [https://github.com/YBI-Foundation/Dataset](https://github.com/YBI-Foundation/Dataset)
- **Direct Dataset Link**: [https://github.com/YBI-Foundation/Dataset/raw/main/Fish.csv](https://github.com/YBI-Foundation/Dataset/raw/main/Fish.csv)
- **Original Source**: Department of Biological Sciences, Aarhus University (Fish Market Survey).

We express sincere gratitude to YBI Foundation for providing open access to educational datasets and structured machine learning training programs.

***

## Project Overview

In commercial aquaculture, ecological surveys, and fisheries management, determining fish weight is crucial for monitoring growth rates, calculating feed rations, and checking market readiness. However, physically catching and weighing live fish causes stress and potential injury.

This project delivers:
1. **A Modular Machine Learning Pipeline**: Python modules for automated data loading, cleaning, exploratory data analysis, and scikit-learn model training.
2. **Multiple Linear Regression Model**: An Ordinary Least Squares (OLS) model with One-Hot Encoded species categories, verified with strict reproducibility (`random_state=42`).
3. **Genuine Evaluation Metrics**: Real, reproducible metrics ($R^2 = 0.9497$, $\text{MAE} = 63.23\text{ g}$, $\text{RMSE} = 82.15\text{ g}$) evaluated on an unseen 20% test holdout.
4. **Interactive Web Application**: A responsive console built with React, Vite, and Tailwind CSS featuring a dynamic SVG anatomy visualizer, real-time prediction in grams, regression scatter plots, and an interactive dataset explorer.
5. **Jupyter Notebook**: A beginner-friendly, step-by-step notebook (`notebooks/Fish_Weight_Prediction.ipynb`) explaining each stage of data science workflow.
6. **CLI Predictor**: A command-line inference tool (`src/ml/predict.py`).

***

## Dataset Description

The dataset contains records of **159 fish specimens** across **7 common freshwater fish species**:

| Species | Dataset Count | Average Weight | Average Cross Length ($L_3$) |
| :--- | :---: | :---: | :---: |
| **Perch** | 56 | 382.2 g | 29.6 cm |
| **Bream** | 35 | 617.8 g | 38.3 cm |
| **Roach** | 20 | 152.1 g | 24.9 cm |
| **Pike** | 17 | 718.7 g | 45.4 cm |
| **Smelt** | 14 | 11.2 g | 11.2 cm |
| **Parkki** | 11 | 154.8 g | 20.3 cm |
| **Whitefish** | 6 | 531.0 g | 34.3 cm |

### Feature Attributes
- `Species`: Fish species (categorical: *Bream, Parkki, Perch, Pike, Roach, Smelt, Whitefish*)
- `Length1`: Vertical length (standard length, snout to caudal peduncle, in cm)
- `Length2`: Diagonal length (fork length, snout to tail fork, in cm)
- `Length3`: Cross length (total length, snout to tip of caudal fin, in cm)
- `Height`: Body depth/height measured dorso-ventrally (in cm)
- `Width`: Maximum lateral body width (in cm)
- `Weight`: Target variable (fish weight in grams)

### Data Cleaning Note
During inspection, index 40 (*Roach*) recorded a weight of `0.0 g` despite positive physical dimensions ($L_1=19.0\text{ cm}, H=6.48\text{ cm}, W=3.35\text{ cm}$). Because a fish with physical volume cannot weigh zero grams, this erroneous observation is filtered out by `src/ml/data_loader.py`, yielding **158 verified observations** used for training and evaluation.

***

## Machine Learning Methodology

### 1. Mathematical Formulation
Multiple Linear Regression models the relationship between the target weight $y$ and features $X$ using Ordinary Least Squares:

$$\hat{y} = \beta_0 + \sum_{j=1}^{5} \beta_j X_j + \sum_{k=1}^{7} \gamma_k \mathbb{I}(\text{Species} = k)$$

Where:
- $\beta_0 = -770.14$ (Model Intercept)
- $X_1 \dots X_5$ represent $L_1, L_2, L_3, \text{Height}, \text{Width}$
- $\beta_{\text{Length1}} = -63.23$, $\beta_{\text{Length2}} = +65.95$, $\beta_{\text{Length3}} = +32.63$, $\beta_{\text{Height}} = -13.49$, $\beta_{\text{Width}} = +14.77$
- $\gamma_k$ represents the species-specific adjustment (e.g. Pike: $-386.38$, Smelt: $+289.50$, Parkki: $+109.68$)

### 2. Verified Evaluation Results
The model was trained on an 80/20 train-test split (126 train, 32 test specimens) with `random_state=42`. All reported metrics reflect actual calculations performed on the test partition:

| Metric | Holdout Test Score | Description |
| :--- | :---: | :--- |
| **$R^2$ Score** | **0.9497** | 94.97% of variance in fish weight is explained by the model |
| **Adjusted $R^2$** | **0.9180** | Adjusted for number of features relative to sample size |
| **Mean Absolute Error (MAE)** | **63.23 g** | Average magnitude of absolute prediction error on test set |
| **Root Mean Squared Error (RMSE)**| **82.15 g** | Standard deviation of the prediction residuals |
| **5-Fold Cross Validation $R^2$** | **0.8939** | Mean generalization score across 5 folds ($\pm 0.0771$) |

> **Note on MAE**: Mean Absolute Error ($\text{MAE} = 63.23\text{ g}$) is an aggregate model evaluation metric quantifying the average deviation between predictions and observations. It is an overall benchmark and is displayed separately from individual predictions.

***

## Project Structure

```
Fish-Weight-Prediction/
├── .env.example                     # Port and host environment configurations
├── metadata.json                    # AI Studio metadata & capabilities
├── requirements.txt                 # Python dependencies
├── package.json                     # Node/React dependencies
├── vite.config.ts                   # Vite configuration
├── index.html                       # Web app HTML entry point
├── README.md                        # Project documentation & attribution
│
├── data/
│   ├── raw/
│   │   └── Fish.csv                 # Raw dataset fetched from YBI Foundation
│   └── processed/
│       ├── fish_cleaned.csv         # Cleaned dataset (158 verified records)
│       └── summary_stats.json       # EDA summaries, correlations, and species statistics
│
├── notebooks/
│   └── Fish_Weight_Prediction.ipynb # Documented Jupyter Notebook for EDA & model training
│
├── src/
│   ├── ml/                          # Core Python machine learning package
│   │   ├── __init__.py
│   │   ├── data_loader.py           # Ingestion, anomaly cleaning & train-test split
│   │   ├── eda.py                   # Morphometric correlations & statistics
│   │   ├── train.py                 # scikit-learn model training & metrics export
│   │   ├── evaluate.py              # Performance benchmarks (Linear, Ridge, Lasso)
│   │   └── predict.py               # Standalone command-line inference script
│   │
│   ├── models/                      # Serialized artifacts
│   │   ├── fish_model.pkl           # Trained scikit-learn model pickle
│   │   └── model_metadata.json      # Genuine parameters, coefficients & test metrics
│   │
│   ├── types/
│   │   └── fish.ts                  # TypeScript interfaces for species & measurements
│   ├── data/
│   │   └── modelData.ts             # Typed exports of metadata & 158 dataset records
│   ├── utils/
│   │   └── predictor.ts             # Exact mathematical predictor engine
│   ├── components/
│   │   ├── Header.tsx               # Top bar navigation & YBI Foundation link
│   │   ├── MorphometricForm.tsx     # Species selector & measurement sliders
│   │   ├── PredictionCard.tsx       # Weight output (grams, kg, oz)
│   │   ├── ModelMetricsCard.tsx     # Separated MAE, RMSE, R² metrics & equation
│   │   ├── FishAnatomyVisualizer.tsx# Scaled dynamic SVG fish silhouette
│   │   ├── RegressionPlots.tsx      # Scatter plots with regression line & Actual vs Pred
│   │   ├── ResidualAnalysis.tsx     # Residual distribution histogram & scatter
│   │   ├── DatasetExplorer.tsx      # Searchable/sortable table with specimen loading
│   │   └── Footer.tsx               # Comprehensive project & dataset citations
│   ├── App.tsx                      # Main dashboard layout
│   ├── main.tsx                     # React root mount
│   └── index.css                    # Tailwind CSS v4 styling
```

***

## Setup and Execution Guide

### Prerequisites
- **Python**: Version 3.10 or higher
- **Node.js**: Version 18.0 or higher
- **npm** or **bun**

### 1. Python Machine Learning Setup

Clone the repository and set up a virtual environment:
```bash
# Clone the repository
git clone https://github.com/anmoljadon2005/Fish-Weight-Prediction.git
cd Fish-Weight-Prediction

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Train the Model & Run Diagnostics
```bash
# Run Exploratory Data Analysis
python3 src/ml/eda.py

# Train Multiple Linear Regression model
python3 src/ml/train.py

# Run comparative benchmark evaluation
python3 src/ml/evaluate.py
```

### 3. Make Predictions from Command Line (CLI)
You can test the trained model directly with the standalone CLI tool:
```bash
# Predict weight for a Bream
python3 src/ml/predict.py --species Bream --length1 23.2 --length2 25.4 --length3 30.0 --height 11.52 --width 4.02

# Output prediction as JSON
python3 src/ml/predict.py --species Perch --length1 22.0 --length2 24.0 --length3 25.5 --height 6.38 --width 3.82 --json
```

### 4. Run the Jupyter Notebook
```bash
jupyter notebook notebooks/Fish_Weight_Prediction.ipynb
```

### 5. Launch the Interactive Web Application
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```
Open your browser to **`http://localhost:3000`** to interact with the laboratory interface.

***

## Web Application Features

1. **Interactive Morphometric Controls**: Precise inputs for vertical, diagonal, and cross lengths, body height, and width with individual species-specific training range validation.
2. **Input Validation & Extrapolation Detection**: Flags measurements that fall outside the minimum or maximum observed in the YBI Foundation training dataset without silently clamping or resetting user entries.
3. **Non-Physical Prediction Safeguard**: Identifies and clearly explains when extreme extrapolations yield negative regression outputs, explaining that physical mass must be positive rather than silently converting to 0 g.
4. **Batch Prediction Mode**: Switch between Single Fish and Batch Prediction modes. Add, edit, and remove multiple fish specimens across different species in a single workflow.
5. **Batch Results & Metrics Summary**: Displays total entered specimens, successfully predicted fish, extrapolation warning count, total weight ($g$ and $kg$), average weight, min, and max weights (strictly calculated from valid positive predictions).
6. **CSV Export & Prediction History**: Direct one-click CSV export of batch predictions and lightweight `localStorage`-backed history to restore past batches across sessions.
7. **Dynamic Scaled SVG Anatomy**: Real-time biological silhouette that scales its length, height, and width alongside measurement callouts ($L_1, L_2, L_3, H, W$).
8. **Separated Model Evaluation Display**: Clear presentation of test $R^2$, Adjusted $R^2$, Mean Absolute Error (MAE), Root Mean Squared Error (RMSE), and the complete mathematical regression equation.
9. **Regression Visualizer**: Interactive scatter chart with regression trendlines, species filtering, and current prediction crosshair marker.
10. **Residual Diagnostics**: Residual vs. Fitted value scatter plot and error distribution histogram.
11. **Dataset Explorer**: Searchable, sortable table of all 158 cleaned YBI Foundation records, with a **"Load"** button to inject any specimen directly into the predictor.

***

## License

This project is licensed under the [MIT License](LICENSE).
Special acknowledgment to **YBI Foundation** for providing the dataset.
