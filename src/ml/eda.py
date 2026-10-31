"""
Exploratory Data Analysis (EDA) module for Fish Weight Prediction.
Generates statistical summaries, species distributions, and correlation matrices.
"""

import os
import json
import numpy as np
import pandas as pd
from data_loader import load_and_clean_data, SPECIES_ORDER, FEATURE_COLUMNS

STATS_OUTPUT_PATH = os.path.join(os.path.dirname(__file__), '../../data/processed/summary_stats.json')

def run_eda():
    """
    Computes comprehensive summary statistics and saves to summary_stats.json.
    """
    df = load_and_clean_data(save_cleaned=True)
    
    # 1. Overall dataset statistics
    numeric_cols = ['Weight'] + FEATURE_COLUMNS
    overall_stats = {}
    for col in numeric_cols:
        overall_stats[col] = {
            'mean': round(float(df[col].mean()), 2),
            'std': round(float(df[col].std()), 2),
            'min': round(float(df[col].min()), 2),
            '25%': round(float(df[col].quantile(0.25)), 2),
            '50%': round(float(df[col].median()), 2),
            '75%': round(float(df[col].quantile(0.75)), 2),
            'max': round(float(df[col].max()), 2),
        }
        
    # 2. Species-specific statistics
    species_stats = {}
    species_counts = df['Species'].value_counts().to_dict()
    
    for species in SPECIES_ORDER:
        sp_df = df[df['Species'] == species]
        if len(sp_df) == 0:
            continue
            
        sp_info = {
            'count': int(len(sp_df)),
            'weight': {
                'mean': round(float(sp_df['Weight'].mean()), 2),
                'median': round(float(sp_df['Weight'].median()), 2),
                'min': round(float(sp_df['Weight'].min()), 2),
                'max': round(float(sp_df['Weight'].max()), 2),
                'std': round(float(sp_df['Weight'].std()), 2) if len(sp_df) > 1 else 0.0,
            },
            'dimensions': {}
        }
        
        for dim in FEATURE_COLUMNS:
            sp_info['dimensions'][dim] = {
                'mean': round(float(sp_df[dim].mean()), 2),
                'min': round(float(sp_df[dim].min()), 2),
                'max': round(float(sp_df[dim].max()), 2),
                'std': round(float(sp_df[dim].std()), 2) if len(sp_df) > 1 else 0.0,
            }
        species_stats[species] = sp_info
        
    # 3. Correlation matrix
    corr_matrix = df[numeric_cols].corr().round(4).to_dict()
    
    output_payload = {
        'total_records': len(df),
        'species_list': SPECIES_ORDER,
        'species_counts': species_counts,
        'overall_stats': overall_stats,
        'species_stats': species_stats,
        'correlation_matrix': corr_matrix,
    }
    
    os.makedirs(os.path.dirname(STATS_OUTPUT_PATH), exist_ok=True)
    with open(STATS_OUTPUT_PATH, 'w') as f:
        json.dump(output_payload, f, indent=2)
        
    print(f"[EDA] Summary statistics and correlations saved to {STATS_OUTPUT_PATH}")
    print("\n--- Correlation with Target (Weight) ---")
    for col in FEATURE_COLUMNS:
        print(f"Weight vs {col:8s}: r = {corr_matrix['Weight'][col]:.4f}")
        
    return output_payload

if __name__ == "__main__":
    run_eda()
