# Fish Weight Prediction & ML Lab - Revised Implementation Plan

A reliable, beginner-friendly machine learning project and interactive web application for fish weight prediction based on the YBI Foundation Fish dataset. This project includes complete Python ML scripts, exploratory data analysis, Multiple Linear Regression modeling, genuine evaluation metrics, visual prediction analysis, and an interactive web interface.

***

## User Review & Confirmed Adjustments

> [!IMPORTANT]
> **All 7 User Adjustments Incorporated into this Revised Plan:**
>
> 1. **Evaluation Metric Separation**: The Mean Absolute Error ($\text{MAE}$) will **not** be labeled or presented as a confidence interval. Instead, the UI and documentation will clearly display the predicted weight in grams ($g$), while the model evaluation card will independently present the test metrics: $\text{MAE}$, $\text{RMSE}$, and $R^2$ score.
> 2. **Python ML Model Integration**: The Python training pipeline (`src/ml/train.py`) executes Multiple Linear Regression on the cleaned YBI Foundation dataset using `scikit-learn`. It serializes the exact trained parameters (intercept, species coefficients, dimension weights, and feature scaling) to `src/models/model_metadata.json` and `src/models/fish_model.pkl`. The web application directly consumes these genuine trained coefficients to compute instant predictions, with a companion Python CLI script (`src/ml/predict.py`) that executes the exact same mathematical model.
> 3. **Beginner-Friendly & Reliable Architecture**: Simple, robust, and easy to run locally without complex infrastructure or unnecessary dependencies. Python ML runs with standard `pip install -r requirements.txt && python src/ml/train.py`, and the web app runs with `npm run dev`.
> 4. **Focused Feature Set**: Strictly scoped to the required deliverables: species selection, 5 physical dimensions (Length1, Length2, Length3, Height, Width), live weight calculation in grams, prediction visualizations (regression scatter plot, actual vs. predicted, residual distribution), and dataset exploration. No bloated or fragile 3D extras.
> 5. **Genuine Dataset & Real Model Evaluation**: Zero invented numbers or unverified claims. The model will be trained on the authentic 159-row YBI Foundation dataset, and the reported $R^2$, RMSE, and MAE will reflect the genuine test results obtained from scikit-learn.
> 6. **YBI Foundation Attribution**: Prominently displayed in the web application header and footer, within the Jupyter notebook introduction, and in a dedicated section in `README.md` with links to the official YBI Foundation repository.
> 7. **Complete Repository Inclusions**: Every single file—raw and cleaned datasets, Jupyter notebook, Python source modules, trained model artifacts, web app source, `requirements.txt`, and comprehensive `README.md`—will be committed to the repository.

***

## 1. Project Directory Structure

```
Fish-Weight-Prediction/
├── .env.example                     # Port and host environment configurations
├── metadata.json                    # Applet metadata and permissions
├── requirements.txt                 # Python dependencies (scikit-learn, pandas, numpy, etc.)
├── package.json                     # Web application dependencies (React, Vite, Recharts, Tailwind)
├── vite.config.ts                   # Vite configuration
├── index.html                       # Web app entry point with proper metadata
├── README.md                        # Complete documentation, setup instructions & attribution
│
├── data/
│   ├── raw/
│   │   └── Fish.csv                 # Raw dataset fetched from YBI Foundation
│   └── processed/
│       ├── fish_cleaned.csv         # Cleaned dataset (validated records)
│       └── summary_stats.json       # Real summary stats (counts, means, min/max per species)
│
├── notebooks/
│   └── Fish_Weight_Prediction.ipynb # Step-by-step Jupyter Notebook for EDA & ML modeling
│
├── src/
│   ├── ml/                          # Core Python Machine Learning modules
│   │   ├── __init__.py
│   │   ├── data_loader.py           # Ingestion, validation, and train-test split
│   │   ├── eda.py                   # Descriptive statistics and correlation analysis
│   │   ├── train.py                 # Multiple Linear Regression training & model export
│   │   ├── evaluate.py              # Real evaluation (R², RMSE, MAE, Residual calculations)
│   │   └── predict.py               # Standalone Python CLI prediction tool
│   │
│   ├── models/                      # Trained model artifacts & metadata
│   │   ├── fish_model.pkl           # Serialized scikit-learn LinearRegression model
│   │   └── model_metadata.json      # Genuine coefficients, intercept, and test metrics
│   │
│   └── (web app source)             # Interactive React + Tailwind web interface
│       ├── App.tsx                  # Main layout (Split console with visualizer & stats)
│       ├── components/
│       │   ├── Header.tsx           # Title, YBI Foundation link, and documentation shortcuts
│       │   ├── MorphometricForm.tsx # Species selector + 5 measurement sliders with inputs
│       │   ├── PredictionCard.tsx   # Predicted weight in grams + metric summary
│       │   ├── ModelMetricsCard.tsx # R², MAE, RMSE displayed separately
│       │   ├── FishAnatomyVisualizer.tsx # Scaled SVG silhouette showing L1, L2, L3, H, W
│       │   ├── RegressionPlots.tsx  # Scatter plot with regression line & Actual vs. Predicted
│       │   ├── ResidualAnalysis.tsx # Residual distribution chart
│       │   ├── DatasetTable.tsx     # Tabular view of YBI Foundation data with species filter
│       │   └── Footer.tsx           # Attribution to YBI Foundation and license info
│       ├── types/
│       │   └── fish.ts              # TypeScript definitions for species & measurements
│       └── data/
│           └── fishDataset.ts       # Typed dataset records for instant local exploration
```

***

## 2. Technical Architecture & Integration Workflow

```
┌────────────────────────────────────────────────────────┐
│               YBI Foundation Dataset                   │
│      https://github.com/YBI-Foundation/Dataset         │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             Python ML Pipeline (scikit-learn)          │
│  src/ml/data_loader.py  ──> src/ml/train.py            │
│  - One-Hot Encodes 7 Species                           │
│  - Standardizes / Fits Linear Regression Model         │
│  - Computes Genuine Test Metrics (R², RMSE, MAE)       │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│             Model Exports & Verified Metrics           │
│  - src/models/fish_model.pkl (Python pickle)           │
│  - src/models/model_metadata.json (Equation & Metrics) │
│  - src/ml/predict.py (CLI inference tool)              │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│      Interactive Web Application (Vite + React)        │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │ Species & Dimension   │  │ Predicted Weight (g)  │  │
│  │ Inputs (L1-L3, H, W)  │  │ & Separate Metrics    │  │
│  │                       │  │ (R², MAE, RMSE)       │  │
│  └───────────────────────┘  └───────────────────────┘  │
│  ┌───────────────────────┐  ┌───────────────────────┐  │
│  │ Scaled SVG Anatomy    │  │ Regression Scatter &  │  │
│  │ Visualizer            │  │ Actual vs. Predicted  │  │
│  └───────────────────────┘  └───────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

***

## 3. Machine Learning Methodology

1. **Dataset**:
   - 159 fish records across 7 species (*Bream*, *Roach*, *Whitefish*, *Parkki*, *Perch*, *Pike*, *Smelt*).
   - Features: `Species`, `Length1` (vertical, cm), `Length2` (diagonal, cm), `Length3` (cross, cm), `Height` (cm), `Width` (cm).
   - Target: `Weight` (grams).
2. **Data Cleaning & Preparation**:
   - Check for missing values and non-positive weight records (e.g. 1 observation with Weight = 0.0 g).
   - One-Hot Encode categorical variable `Species`.
   - 80/20 train-test split (`random_state=42`) to guarantee reproducible, verifiable metrics.
3. **Model Training & Real Evaluation**:
   - Multiple Linear Regression via `sklearn.linear_model.LinearRegression`.
   - Calculate genuine test metrics:
     - Coefficient of Determination: $R^2 = 1 - \frac{\sum (y_i - \hat{y}_i)^2}{\sum (y_i - \bar{y})^2}$
     - Mean Absolute Error: $\text{MAE} = \frac{1}{n} \sum |y_i - \hat{y}_i|$
     - Root Mean Squared Error: $\text{RMSE} = \sqrt{\frac{1}{n} \sum (y_i - \hat{y}_i)^2}$
   - Save the exact intercept, species weights, and dimension coefficients to `model_metadata.json`.

***

## 4. User Experience & Visual Design

- **Clinical Marine Lab Aesthetic**: Dark slate background (`#0B0F17`), crisp hairline borders (`#1E293B`), and laser cyan (`#06B6D4`) with telemetry emerald (`#10B981`) accents.
- **Top Bar**: Clean one-line header with title, YBI Foundation attribution badge/link, and GitHub repository anchor.
- **Left Parameter Console**:
  - Species dropdown with species info (average weight, sample count).
  - 5 measurement sliders with numeric inputs and biologically realistic min/max range indicators based on the actual dataset.
  - Reset to species average button.
- **Center & Right Workspaces**:
  - **Prediction Card**: Prominently displays the predicted weight in grams (e.g. `452.3 g`), with quick conversion to kilograms and ounces.
  - **Model Evaluation Card**: Distinctly presents the genuine test metrics ($\text{MAE}$, $\text{RMSE}$, $R^2$) clearly separated from the predicted weight.
  - **Dynamic Fish Anatomy**: Scaled SVG graphic showing the morphometric measurements ($L_1, L_2, L_3, H, W$) morphing in real time with the slider inputs.
  - **Interactive Visualizations**:
    - Weight vs. Length regression scatter plot with species filtering.
    - Actual vs. Predicted scatter plot demonstrating model linearity.
    - Residuals plot showing error distribution across species.
  - **Dataset Explorer**: Searchable, sortable data table showing the genuine YBI Foundation dataset records.

***

## 5. Execution Steps Upon Approval

1. **Dataset Download & Storage**: Download raw `Fish.csv` from YBI Foundation to `data/raw/Fish.csv`.
2. **Execute Python Pipeline**: Run `data_loader.py`, `eda.py`, `train.py`, and `evaluate.py`. Generate `src/models/model_metadata.json` and `src/models/fish_model.pkl` with genuine, tested metrics.
3. **Build CLI Predictor**: Create `src/ml/predict.py` for standalone command-line predictions.
4. **Create Jupyter Notebook**: Generate `notebooks/Fish_Weight_Prediction.ipynb` with clear step-by-step commentary and data visualizations.
5. **Implement Web Interface**: Build the complete React + Tailwind web application integrating the model parameters, dynamic anatomy SVG, prediction card, evaluation metric display, and regression charts.
6. **Documentation & Attribution**: Write a professional `README.md` and `requirements.txt` with clear local run instructions and prominent YBI Foundation attribution.
7. **Verification**: Compile and verify the web app and test predictions end-to-end.
