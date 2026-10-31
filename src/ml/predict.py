"""
Standalone CLI prediction module for Fish Weight Prediction.
Takes species and 5 morphometric dimensions and predicts fish weight in grams
using the trained Multiple Linear Regression model.
"""

import os
import sys
import json
import argparse
import pickle
import pandas as pd

MODEL_PKL_PATH = os.path.join(os.path.dirname(__file__), '../../src/models/fish_model.pkl')
METADATA_JSON_PATH = os.path.join(os.path.dirname(__file__), '../../src/models/model_metadata.json')

SPECIES_ORDER = ['Bream', 'Parkki', 'Perch', 'Pike', 'Roach', 'Smelt', 'Whitefish']
FEATURE_COLUMNS = ['Length1', 'Length2', 'Length3', 'Height', 'Width']

def predict_weight(species: str, length1: float, length2: float, length3: float, height: float, width: float):
    """
    Predicts fish weight in grams for given species and dimensions.
    """
    species = species.strip().capitalize()
    if species not in SPECIES_ORDER:
        raise ValueError(f"Invalid species '{species}'. Must be one of: {', '.join(SPECIES_ORDER)}")
        
    # Check if pickled model exists
    if os.path.exists(MODEL_PKL_PATH):
        with open(MODEL_PKL_PATH, 'rb') as f:
            model = pickle.load(f)
            
        # Construct feature DataFrame
        data = {
            'Length1': [float(length1)],
            'Length2': [float(length2)],
            'Length3': [float(length3)],
            'Height': [float(height)],
            'Width': [float(width)]
        }
        for sp in SPECIES_ORDER:
            data[f'Species_{sp}'] = [1.0 if sp == species else 0.0]
            
        feature_order = FEATURE_COLUMNS + [f'Species_{sp}' for sp in SPECIES_ORDER]
        input_df = pd.DataFrame(data)[feature_order]
        prediction = float(model.predict(input_df)[0])
    elif os.path.exists(METADATA_JSON_PATH):
        # Fallback to direct linear combination using saved metadata coefficients
        with open(METADATA_JSON_PATH, 'r') as f:
            meta = json.load(f)
        coefs = meta['coefficients']
        intercept = meta['intercept']
        
        val = intercept
        val += coefs['Length1'] * float(length1)
        val += coefs['Length2'] * float(length2)
        val += coefs['Length3'] * float(length3)
        val += coefs['Height'] * float(height)
        val += coefs['Width'] * float(width)
        val += coefs.get(f'Species_{species}', 0.0)
        prediction = float(val)
    else:
        raise FileNotFoundError("Trained model artifact not found. Please run train.py first.")
        
    # In physical reality, a fish cannot weigh less than 0 grams
    physical_weight = max(0.0, prediction)
    
    return {
        'species': species,
        'dimensions': {
            'length1_cm': length1,
            'length2_cm': length2,
            'length3_cm': length3,
            'height_cm': height,
            'width_cm': width
        },
        'raw_predicted_weight_g': round(prediction, 2),
        'physical_weight_g': round(physical_weight, 2),
        'weight_kg': round(physical_weight / 1000.0, 4),
        'weight_oz': round(physical_weight * 0.035274, 2)
    }

def main():
    parser = argparse.ArgumentParser(description="Predict Fish Weight using trained Multiple Linear Regression")
    parser.add_argument("--species", type=str, default="Bream", help=f"Species: {', '.join(SPECIES_ORDER)}")
    parser.add_argument("--length1", type=float, default=23.2, help="Vertical length in cm")
    parser.add_argument("--length2", type=float, default=25.4, help="Diagonal length in cm")
    parser.add_argument("--length3", type=float, default=30.0, help="Cross length in cm")
    parser.add_argument("--height", type=float, default=11.52, help="Height in cm")
    parser.add_argument("--width", type=float, default=4.02, help="Width in cm")
    parser.add_argument("--json", action="store_true", help="Output results as JSON")
    
    args = parser.parse_args()
    
    try:
        res = predict_weight(args.species, args.length1, args.length2, args.length3, args.height, args.width)
        if args.json:
            print(json.dumps(res, indent=2))
        else:
            print("\n" + "="*50)
            print("         FISH WEIGHT PREDICTION RESULT")
            print("="*50)
            print(f"Species            : {res['species']}")
            print(f"Vertical Length L1 : {res['dimensions']['length1_cm']} cm")
            print(f"Diagonal Length L2 : {res['dimensions']['length2_cm']} cm")
            print(f"Cross Length L3    : {res['dimensions']['length3_cm']} cm")
            print(f"Body Height H      : {res['dimensions']['height_cm']} cm")
            print(f"Body Width W       : {res['dimensions']['width_cm']} cm")
            print("-"*50)
            print(f"PREDICTED WEIGHT   : {res['physical_weight_g']} grams")
            print(f"Equivalent         : {res['weight_kg']} kg ({res['weight_oz']} oz)")
            print("="*50 + "\n")
    except Exception as e:
        print(f"Error predicting fish weight: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
