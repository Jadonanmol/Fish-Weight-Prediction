"""
Standalone CLI prediction module for Fish Weight Prediction.
Takes species and 5 morphometric dimensions and predicts fish weight in grams
using the trained Multiple Linear Regression model with input range validation
and physical feasibility handling.
"""

import os
import sys
import json
import argparse

MODEL_PKL_PATH = os.path.join(os.path.dirname(__file__), '../../src/models/fish_model.pkl')
METADATA_JSON_PATH = os.path.join(os.path.dirname(__file__), '../../src/models/model_metadata.json')
STATS_JSON_PATH = os.path.join(os.path.dirname(__file__), '../../data/processed/summary_stats.json')

SPECIES_ORDER = ['Bream', 'Parkki', 'Perch', 'Pike', 'Roach', 'Smelt', 'Whitefish']
FEATURE_COLUMNS = ['Length1', 'Length2', 'Length3', 'Height', 'Width']

def validate_inputs(species: str, l1: float, l2: float, l3: float, h: float, w: float):
    """
    Validates dimensions against species training data ranges and checks
    anatomical consistency (Length1 <= Length2 <= Length3).
    """
    training_range_warnings = []
    anatomical_warnings = []
    errors = []
    
    dims = {'Length1': l1, 'Length2': l2, 'Length3': l3, 'Height': h, 'Width': w}
    for k, v in dims.items():
        if v is None or v <= 0:
            errors.append(f"{k} must be a positive number greater than 0 cm.")
            
    # Check anatomical consistency
    if l1 > 0 and l2 > 0 and l1 > l2:
        anatomical_warnings.append(f"Length1 ({l1} cm) exceeds Length2 ({l2} cm). Expected Length1 <= Length2.")
    if l2 > 0 and l3 > 0 and l2 > l3:
        anatomical_warnings.append(f"Length2 ({l2} cm) exceeds Length3 ({l3} cm). Expected Length2 <= Length3.")
            
    if os.path.exists(STATS_JSON_PATH):
        try:
            with open(STATS_JSON_PATH, 'r') as f:
                stats = json.load(f)
            sp_dims = stats.get('species_stats', {}).get(species, {}).get('dimensions', {})
            for k, v in dims.items():
                if k in sp_dims:
                    min_v = sp_dims[k]['min']
                    max_v = sp_dims[k]['max']
                    if v < min_v:
                        training_range_warnings.append(f"{k} ({v} cm) is below training data minimum ({min_v} cm) for {species}.")
                    elif v > max_v:
                        training_range_warnings.append(f"{k} ({v} cm) exceeds training data maximum ({max_v} cm) for {species}.")
        except Exception:
            pass
            
    all_warnings = training_range_warnings + anatomical_warnings
    return {
        'status': 'invalid' if errors else ('extrapolated' if training_range_warnings else 'valid'),
        'has_anatomical_inconsistencies': len(anatomical_warnings) > 0,
        'training_range_warnings': training_range_warnings,
        'anatomical_warnings': anatomical_warnings,
        'warnings': all_warnings,
        'errors': errors
    }

def predict_weight(species: str, length1: float, length2: float, length3: float, height: float, width: float):
    """
    Predicts fish weight in grams for given species and dimensions.
    """
    species = species.strip().capitalize()
    if species not in SPECIES_ORDER:
        raise ValueError(f"Invalid species '{species}'. Must be one of: {', '.join(SPECIES_ORDER)}")
        
    validation = validate_inputs(species, length1, length2, length3, height, width)
    if validation['errors']:
        raise ValueError("; ".join(validation['errors']))

    # Load coefficients from metadata (reliable & zero-dependency)
    if os.path.exists(METADATA_JSON_PATH):
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
    elif os.path.exists(MODEL_PKL_PATH):
        import pickle
        import pandas as pd
        with open(MODEL_PKL_PATH, 'rb') as f:
            model = pickle.load(f)
            
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
    else:
        raise FileNotFoundError("Trained model metadata not found. Please run train.py first.")
        
    is_physically_meaningful = (prediction > 0)
    
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
        'is_physically_meaningful': is_physically_meaningful,
        'physical_weight_g': round(prediction, 2) if is_physically_meaningful else None,
        'weight_kg': round(prediction / 1000.0, 4) if is_physically_meaningful else None,
        'weight_oz': round(prediction * 0.035274, 2) if is_physically_meaningful else None,
        'validation': validation,
        'non_physical_explanation': (
            f"The linear model estimated an unconstrained value of {prediction:.1f} g. "
            "Because physical fish mass must be positive, this indicates the input measurements "
            "fall outside the physically valid domain of the linear model."
        ) if not is_physically_meaningful else None
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
            print("\n" + "="*55)
            print("         FISH WEIGHT PREDICTION RESULT")
            print("="*55)
            print(f"Species            : {res['species']}")
            print(f"Vertical Length L1 : {res['dimensions']['length1_cm']} cm")
            print(f"Diagonal Length L2 : {res['dimensions']['length2_cm']} cm")
            print(f"Cross Length L3    : {res['dimensions']['length3_cm']} cm")
            print(f"Body Height H      : {res['dimensions']['height_cm']} cm")
            print(f"Body Width W       : {res['dimensions']['width_cm']} cm")
            print(f"Validation Status  : {res['validation']['status'].upper()}")
            if res['validation']['warnings']:
                for w in res['validation']['warnings']:
                    print(f"  [Warning] {w}")
            print("-"*55)
            if res['is_physically_meaningful']:
                print(f"PREDICTED WEIGHT   : {res['physical_weight_g']} grams")
                print(f"Equivalent         : {res['weight_kg']} kg ({res['weight_oz']} oz)")
            else:
                print("PREDICTED WEIGHT   : NON-PHYSICAL ESTIMATE")
                print(f"Raw Output         : {res['raw_predicted_weight_g']} grams")
                print(f"Explanation        : {res['non_physical_explanation']}")
            print("="*55 + "\n")
    except Exception as e:
        print(f"Error predicting fish weight: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
