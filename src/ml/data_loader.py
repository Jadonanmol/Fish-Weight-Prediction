"""
Data loader and preprocessing module for Fish Weight Prediction.
Loads data from YBI Foundation Fish dataset, performs cleaning, and returns split datasets.
"""

import os
import pandas as pd
from sklearn.model_selection import train_test_split

DATA_RAW_PATH = os.path.join(os.path.dirname(__file__), '../../data/raw/Fish.csv')
DATA_PROCESSED_PATH = os.path.join(os.path.dirname(__file__), '../../data/processed/fish_cleaned.csv')

SPECIES_ORDER = ['Bream', 'Parkki', 'Perch', 'Pike', 'Roach', 'Smelt', 'Whitefish']
FEATURE_COLUMNS = ['Length1', 'Length2', 'Length3', 'Height', 'Width']

def load_and_clean_data(raw_path=DATA_RAW_PATH, save_cleaned=True):
    """
    Loads raw fish dataset, cleans invalid entries (e.g., zero weight anomaly),
    and saves the cleaned version.
    
    Returns:
        pd.DataFrame: Cleaned dataframe.
    """
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Raw data file not found at {raw_path}")
        
    df = pd.read_csv(raw_path)
    
    # Strip any potential BOM or whitespace from column names
    df.columns = [c.strip().replace('\ufeff', '') for c in df.columns]
    
    initial_count = len(df)
    
    # Filter out invalid entries: fish weight must be strictly positive
    # Specifically index 40 where Roach had Weight == 0.0
    cleaned_df = df[df['Weight'] > 0].copy()
    dropped_count = initial_count - len(cleaned_df)
    
    if dropped_count > 0:
        print(f"[DataLoader] Filtered out {dropped_count} invalid record(s) where Weight <= 0.")
        
    # Standardize column order
    expected_cols = ['Species', 'Weight', 'Length1', 'Length2', 'Length3', 'Height', 'Width']
    cleaned_df = cleaned_df[[c for c in expected_cols if c in cleaned_df.columns]]
    
    if save_cleaned:
        os.makedirs(os.path.dirname(DATA_PROCESSED_PATH), exist_ok=True)
        cleaned_df.to_csv(DATA_PROCESSED_PATH, index=False)
        print(f"[DataLoader] Cleaned dataset saved to {DATA_PROCESSED_PATH} ({len(cleaned_df)} records)")
        
    return cleaned_df

def prepare_features_and_target(df):
    """
    Prepares X (features with One-Hot Encoded Species) and y (Weight).
    Uses drop_first=False or standard one-hot encoding for transparent species attribution.
    
    Returns:
        X (pd.DataFrame), y (pd.Series)
    """
    # Create one-hot encoding for Species with fixed categories
    species_dummies = pd.get_dummies(df['Species'], prefix='Species', drop_first=False)
    
    # Ensure all 7 species columns exist
    for sp in SPECIES_ORDER:
        col = f"Species_{sp}"
        if col not in species_dummies.columns:
            species_dummies[col] = 0
            
    # Order species columns deterministically
    ordered_species_cols = [f"Species_{sp}" for sp in SPECIES_ORDER]
    species_dummies = species_dummies[ordered_species_cols]
    
    # Numerical dimensions
    dimensions = df[FEATURE_COLUMNS].copy()
    
    # Combine dimensions and species dummies
    X = pd.concat([dimensions, species_dummies], axis=1)
    y = df['Weight'].copy()
    
    return X, y

def get_train_test_data(test_size=0.2, random_state=42):
    """
    Returns reproducible train-test split for model training and evaluation.
    
    Returns:
        X_train, X_test, y_train, y_test, feature_names, df_cleaned
    """
    df = load_and_clean_data()
    X, y = prepare_features_and_target(df)
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
    
    print(f"[DataLoader] Train-test split completed: {len(X_train)} train, {len(X_test)} test.")
    return X_train, X_test, y_train, y_test, list(X.columns), df

if __name__ == "__main__":
    X_train, X_test, y_train, y_test, feature_names, df = get_train_test_data()
    print("Feature columns:", feature_names)
    print("Train shape:", X_train.shape, "Test shape:", X_test.shape)
