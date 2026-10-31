"""
Model training module for Fish Weight Prediction.
Trains a Multiple Linear Regression model using scikit-learn on the cleaned YBI Foundation dataset,
evaluates real metrics, and saves the trained artifacts and metadata.
"""

import os
import json
import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.model_selection import cross_val_score

from data_loader import get_train_test_data, SPECIES_ORDER, FEATURE_COLUMNS

MODEL_PKL_PATH = os.path.join(os.path.dirname(__file__), '../../src/models/fish_model.pkl')
METADATA_JSON_PATH = os.path.join(os.path.dirname(__file__), '../../src/models/model_metadata.json')

def train_and_evaluate(test_size=0.2, random_state=42):
    """
    Trains Multiple Linear Regression model and records genuine evaluation results.
    """
    X_train, X_test, y_train, y_test, feature_names, df_cleaned = get_train_test_data(
        test_size=test_size, random_state=random_state
    )
    
    # 1. Initialize and fit Multiple Linear Regression model
    model = LinearRegression(fit_intercept=True)
    model.fit(X_train, y_train)
    
    # 2. Compute predictions on train and test sets
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)
    
    # 3. Calculate genuine metrics
    # Training metrics
    train_r2 = float(r2_score(y_train, y_train_pred))
    train_mae = float(mean_absolute_error(y_train, y_train_pred))
    train_rmse = float(np.sqrt(mean_squared_error(y_train, y_train_pred)))
    
    # Test metrics (Genuine, unadjusted)
    test_r2 = float(r2_score(y_test, y_test_pred))
    test_mae = float(mean_absolute_error(y_test, y_test_pred))
    test_rmse = float(np.sqrt(mean_squared_error(y_test, y_test_pred)))
    
    n_test = len(y_test)
    p = X_test.shape[1]
    adj_r2 = 1.0 - ((1.0 - test_r2) * (n_test - 1.0) / (n_test - p - 1.0)) if (n_test - p - 1) > 0 else test_r2
    
    # 4. 5-Fold Cross Validation
    cv_scores = cross_val_score(LinearRegression(), pd.concat([X_train, X_test]), pd.concat([y_train, y_test]), cv=5, scoring='r2')
    cv_mean_r2 = float(np.mean(cv_scores))
    cv_std_r2 = float(np.std(cv_scores))
    
    # 5. Extract coefficients
    coefficients = {feat: round(float(coef), 6) for feat, coef in zip(feature_names, model.coef_)}
    intercept = round(float(model.intercept_), 6)
    
    # 6. Save serialized pickle
    os.makedirs(os.path.dirname(MODEL_PKL_PATH), exist_ok=True)
    with open(MODEL_PKL_PATH, 'wb') as f:
        pickle.dump(model, f)
    print(f"[Train] Serialized model saved to {MODEL_PKL_PATH}")
    
    # 7. Collect test residuals and predictions for visualization
    test_results_sample = []
    for idx, (actual, pred) in enumerate(zip(y_test, y_test_pred)):
        test_results_sample.append({
            'actual': round(float(actual), 2),
            'predicted': round(float(pred), 2),
            'residual': round(float(actual - pred), 2)
        })
        
    metadata = {
        'model_name': 'Multiple Linear Regression',
        'algorithm': 'Ordinary Least Squares (OLS)',
        'library': 'scikit-learn LinearRegression',
        'dataset_source': 'YBI Foundation Fish Dataset (https://github.com/YBI-Foundation/Dataset)',
        'random_state': random_state,
        'test_size': test_size,
        'train_samples': int(len(X_train)),
        'test_samples': int(len(X_test)),
        'features': feature_names,
        'dimension_features': FEATURE_COLUMNS,
        'species_order': SPECIES_ORDER,
        'intercept': intercept,
        'coefficients': coefficients,
        'evaluation': {
            'test': {
                'r2_score': round(test_r2, 4),
                'adjusted_r2': round(adj_r2, 4),
                'mae_grams': round(test_mae, 2),
                'rmse_grams': round(test_rmse, 2)
            },
            'train': {
                'r2_score': round(train_r2, 4),
                'mae_grams': round(train_mae, 2),
                'rmse_grams': round(train_rmse, 2)
            },
            'cross_validation_5fold': {
                'mean_r2': round(cv_mean_r2, 4),
                'std_r2': round(cv_std_r2, 4),
                'fold_scores': [round(float(s), 4) for s in cv_scores]
            }
        },
        'test_samples_predictions': test_results_sample
    }
    
    with open(METADATA_JSON_PATH, 'w') as f:
        json.dump(metadata, f, indent=2)
    print(f"[Train] Model metadata and verified evaluation results saved to {METADATA_JSON_PATH}")
    
    print("\n================ REAL MODEL EVALUATION RESULTS ================")
    print(f"Test R² Score    : {test_r2:.4f}")
    print(f"Adjusted R²      : {adj_r2:.4f}")
    print(f"Test MAE (grams) : {test_mae:.2f} g")
    print(f"Test RMSE (grams): {test_rmse:.2f} g")
    print(f"5-Fold CV Mean R²: {cv_mean_r2:.4f} (±{cv_std_r2:.4f})")
    print(f"Intercept        : {intercept:.4f}")
    print("===============================================================\n")
    
    return model, metadata

if __name__ == "__main__":
    train_and_evaluate()
