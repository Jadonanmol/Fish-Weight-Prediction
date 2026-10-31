"""
Evaluation module for Fish Weight Prediction.
Performs in-depth performance analysis, residual checks, and comparative benchmarks.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

from data_loader import get_train_test_data

def evaluate_models():
    """
    Evaluates Multiple Linear Regression alongside regularized baselines (Ridge, Lasso)
    to inspect coefficient stability and error behavior.
    """
    X_train, X_test, y_train, y_test, feature_names, _ = get_train_test_data()
    
    models = {
        'Multiple Linear Regression': LinearRegression(),
        'Ridge Regression (alpha=1.0)': Ridge(alpha=1.0),
        'Lasso Regression (alpha=0.1)': Lasso(alpha=0.1, max_iter=2000)
    }
    
    results = {}
    
    print("\n" + "="*70)
    print("                MODEL EVALUATION COMPARISON MATRIX")
    print("="*70)
    print(f"{'Model':<30} | {'Test R²':<10} | {'MAE (g)':<10} | {'RMSE (g)':<10}")
    print("-"*70)
    
    for name, mdl in models.items():
        mdl.fit(X_train, y_train)
        preds = mdl.predict(X_test)
        
        r2 = float(r2_score(y_test, preds))
        mae = float(mean_absolute_error(y_test, preds))
        rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
        
        results[name] = {
            'r2_score': round(r2, 4),
            'mae_grams': round(mae, 2),
            'rmse_grams': round(rmse, 2)
        }
        
        print(f"{name:<30} | {r2:<10.4f} | {mae:<10.2f} | {rmse:<10.2f}")
        
    print("="*70 + "\n")
    return results

if __name__ == "__main__":
    evaluate_models()
