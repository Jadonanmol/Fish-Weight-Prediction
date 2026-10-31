// Automatically generated from genuine Python ML model training artifacts
// Dataset source: YBI Foundation (https://github.com/YBI-Foundation/Dataset)

export interface ModelMetadata {
  model_name: string;
  algorithm: string;
  library: string;
  dataset_source: string;
  train_samples: number;
  test_samples: number;
  intercept: number;
  coefficients: Record<string, number>;
  evaluation: {
    test: {
      r2_score: number;
      adjusted_r2: number;
      mae_grams: number;
      rmse_grams: number;
    };
    train: {
      r2_score: number;
      mae_grams: number;
      rmse_grams: number;
    };
    cross_validation_5fold: {
      mean_r2: number;
      std_r2: number;
      fold_scores: number[];
    };
  };
  test_samples_predictions: Array<{
    actual: number;
    predicted: number;
    residual: number;
  }>;
}

export const MODEL_METADATA: ModelMetadata = {
  "model_name": "Multiple Linear Regression",
  "algorithm": "Ordinary Least Squares (OLS)",
  "library": "scikit-learn LinearRegression",
  "dataset_source": "YBI Foundation Fish Dataset (https://github.com/YBI-Foundation/Dataset)",
  "random_state": 42,
  "test_size": 0.2,
  "train_samples": 126,
  "test_samples": 32,
  "features": [
    "Length1",
    "Length2",
    "Length3",
    "Height",
    "Width",
    "Species_Bream",
    "Species_Parkki",
    "Species_Perch",
    "Species_Pike",
    "Species_Roach",
    "Species_Smelt",
    "Species_Whitefish"
  ],
  "dimension_features": [
    "Length1",
    "Length2",
    "Length3",
    "Height",
    "Width"
  ],
  "species_order": [
    "Bream",
    "Parkki",
    "Perch",
    "Pike",
    "Roach",
    "Smelt",
    "Whitefish"
  ],
  "intercept": -770.14348,
  "coefficients": {
    "Length1": -63.22929,
    "Length2": 65.949601,
    "Length3": 32.630849,
    "Height": -13.48771,
    "Width": 14.767237,
    "Species_Bream": -23.7579,
    "Species_Parkki": 109.676725,
    "Species_Perch": 14.629984,
    "Species_Pike": -386.381168,
    "Species_Roach": -14.93777,
    "Species_Smelt": 289.503048,
    "Species_Whitefish": 11.267081
  },
  "evaluation": {
    "test": {
      "r2_score": 0.9497,
      "adjusted_r2": 0.918,
      "mae_grams": 63.23,
      "rmse_grams": 82.15
    },
    "train": {
      "r2_score": 0.929,
      "mae_grams": 69.89,
      "rmse_grams": 94.08
    },
    "cross_validation_5fold": {
      "mean_r2": 0.8939,
      "std_r2": 0.0771,
      "fold_scores": [
        0.9407,
        0.923,
        0.9146,
        0.7416,
        0.9495
      ]
    }
  },
  "test_samples_predictions": [
    {
      "actual": 300.0,
      "predicted": 299.26,
      "residual": 0.74
    },
    {
      "actual": 140.0,
      "predicted": 147.5,
      "residual": -7.5
    },
    {
      "actual": 510.0,
      "predicted": 575.66,
      "residual": -65.66
    },
    {
      "actual": 19.7,
      "predicted": 115.58,
      "residual": -95.88
    },
    {
      "actual": 130.0,
      "predicted": 189.82,
      "residual": -59.82
    },
    {
      "actual": 1000.0,
      "predicted": 759.95,
      "residual": 240.05
    },
    {
      "actual": 145.0,
      "predicted": 238.82,
      "residual": -93.82
    },
    {
      "actual": 180.0,
      "predicted": 271.21,
      "residual": -91.21
    },
    {
      "actual": 225.0,
      "predicted": 224.93,
      "residual": 0.07
    },
    {
      "actual": 1250.0,
      "predicted": 1155.81,
      "residual": 94.19
    },
    {
      "actual": 650.0,
      "predicted": 607.48,
      "residual": 42.52
    },
    {
      "actual": 306.0,
      "predicted": 424.81,
      "residual": -118.81
    },
    {
      "actual": 600.0,
      "predicted": 545.59,
      "residual": 54.41
    },
    {
      "actual": 273.0,
      "predicted": 359.31,
      "residual": -86.31
    },
    {
      "actual": 700.0,
      "predicted": 682.36,
      "residual": 17.64
    },
    {
      "actual": 920.0,
      "predicted": 821.0,
      "residual": 99.0
    },
    {
      "actual": 1100.0,
      "predicted": 932.55,
      "residual": 167.45
    },
    {
      "actual": 556.0,
      "predicted": 643.43,
      "residual": -87.43
    },
    {
      "actual": 150.0,
      "predicted": 216.13,
      "residual": -66.13
    },
    {
      "actual": 140.0,
      "predicted": 193.87,
      "residual": -53.87
    },
    {
      "actual": 10.0,
      "predicted": -0.36,
      "residual": 10.36
    },
    {
      "actual": 610.0,
      "predicted": 586.13,
      "residual": 23.87
    },
    {
      "actual": 500.0,
      "predicted": 510.22,
      "residual": -10.22
    },
    {
      "actual": 500.0,
      "predicted": 491.31,
      "residual": 8.69
    },
    {
      "actual": 955.0,
      "predicted": 816.89,
      "residual": 138.11
    },
    {
      "actual": 110.0,
      "predicted": 137.98,
      "residual": -27.98
    },
    {
      "actual": 290.0,
      "predicted": 311.6,
      "residual": -21.6
    },
    {
      "actual": 950.0,
      "predicted": 967.79,
      "residual": -17.79
    },
    {
      "actual": 1000.0,
      "predicted": 1022.73,
      "residual": -22.73
    },
    {
      "actual": 7.0,
      "predicted": -48.03,
      "residual": 55.03
    },
    {
      "actual": 7.5,
      "predicted": -51.41,
      "residual": 58.91
    },
    {
      "actual": 70.0,
      "predicted": -15.46,
      "residual": 85.46
    }
  ]
};

export const SUMMARY_STATS = {
  "total_records": 158,
  "species_list": [
    "Bream",
    "Parkki",
    "Perch",
    "Pike",
    "Roach",
    "Smelt",
    "Whitefish"
  ],
  "species_counts": {
    "Perch": 56,
    "Bream": 35,
    "Roach": 19,
    "Pike": 17,
    "Smelt": 14,
    "Parkki": 11,
    "Whitefish": 6
  },
  "overall_stats": {
    "Weight": {
      "mean": 400.85,
      "std": 357.7,
      "min": 5.9,
      "25%": 121.25,
      "50%": 281.5,
      "75%": 650.0,
      "max": 1650.0
    },
    "Length1": {
      "mean": 26.29,
      "std": 10.01,
      "min": 7.5,
      "25%": 19.15,
      "50%": 25.3,
      "75%": 32.7,
      "max": 59.0
    },
    "Length2": {
      "mean": 28.47,
      "std": 10.73,
      "min": 8.4,
      "25%": 21.0,
      "50%": 27.4,
      "75%": 35.75,
      "max": 63.4
    },
    "Length3": {
      "mean": 31.28,
      "std": 11.63,
      "min": 8.8,
      "25%": 23.2,
      "50%": 29.7,
      "75%": 39.68,
      "max": 68.0
    },
    "Height": {
      "mean": 8.99,
      "std": 4.3,
      "min": 1.73,
      "25%": 5.94,
      "50%": 7.79,
      "75%": 12.37,
      "max": 18.96
    },
    "Width": {
      "mean": 4.42,
      "std": 1.69,
      "min": 1.05,
      "25%": 3.4,
      "50%": 4.28,
      "75%": 5.59,
      "max": 8.14
    }
  },
  "species_stats": {
    "Bream": {
      "count": 35,
      "weight": {
        "mean": 617.83,
        "median": 610.0,
        "min": 242.0,
        "max": 1000.0,
        "std": 209.21
      },
      "dimensions": {
        "Length1": {
          "mean": 30.31,
          "min": 23.2,
          "max": 38.0,
          "std": 3.59
        },
        "Length2": {
          "mean": 33.11,
          "min": 25.4,
          "max": 41.0,
          "std": 3.91
        },
        "Length3": {
          "mean": 38.35,
          "min": 30.0,
          "max": 46.5,
          "std": 4.16
        },
        "Height": {
          "mean": 15.18,
          "min": 11.52,
          "max": 18.96,
          "std": 1.96
        },
        "Width": {
          "mean": 5.43,
          "min": 4.02,
          "max": 6.75,
          "std": 0.72
        }
      }
    },
    "Parkki": {
      "count": 11,
      "weight": {
        "mean": 154.82,
        "median": 145.0,
        "min": 55.0,
        "max": 300.0,
        "std": 78.76
      },
      "dimensions": {
        "Length1": {
          "mean": 18.73,
          "min": 13.5,
          "max": 24.0,
          "std": 3.28
        },
        "Length2": {
          "mean": 20.35,
          "min": 14.7,
          "max": 26.0,
          "std": 3.56
        },
        "Length3": {
          "mean": 22.79,
          "min": 16.5,
          "max": 29.0,
          "std": 3.96
        },
        "Height": {
          "mean": 8.96,
          "min": 6.58,
          "max": 11.37,
          "std": 1.62
        },
        "Width": {
          "mean": 3.22,
          "min": 2.31,
          "max": 4.23,
          "std": 0.64
        }
      }
    },
    "Perch": {
      "count": 56,
      "weight": {
        "mean": 382.24,
        "median": 207.5,
        "min": 5.9,
        "max": 1100.0,
        "std": 347.62
      },
      "dimensions": {
        "Length1": {
          "mean": 25.74,
          "min": 7.5,
          "max": 41.1,
          "std": 8.56
        },
        "Length2": {
          "mean": 27.89,
          "min": 8.4,
          "max": 44.0,
          "std": 9.02
        },
        "Length3": {
          "mean": 29.57,
          "min": 8.8,
          "max": 46.6,
          "std": 9.53
        },
        "Height": {
          "mean": 7.86,
          "min": 2.11,
          "max": 12.8,
          "std": 2.88
        },
        "Width": {
          "mean": 4.75,
          "min": 1.41,
          "max": 8.14,
          "std": 1.77
        }
      }
    },
    "Pike": {
      "count": 17,
      "weight": {
        "mean": 718.71,
        "median": 510.0,
        "min": 200.0,
        "max": 1650.0,
        "std": 494.14
      },
      "dimensions": {
        "Length1": {
          "mean": 42.48,
          "min": 30.0,
          "max": 59.0,
          "std": 9.03
        },
        "Length2": {
          "mean": 45.48,
          "min": 32.3,
          "max": 63.4,
          "std": 9.71
        },
        "Length3": {
          "mean": 48.72,
          "min": 34.8,
          "max": 68.0,
          "std": 10.17
        },
        "Height": {
          "mean": 7.71,
          "min": 5.57,
          "max": 10.81,
          "std": 1.66
        },
        "Width": {
          "mean": 5.09,
          "min": 3.38,
          "max": 7.48,
          "std": 1.14
        }
      }
    },
    "Roach": {
      "count": 19,
      "weight": {
        "mean": 160.05,
        "median": 150.0,
        "min": 40.0,
        "max": 390.0,
        "std": 83.53
      },
      "dimensions": {
        "Length1": {
          "mean": 20.73,
          "min": 12.9,
          "max": 29.5,
          "std": 3.53
        },
        "Length2": {
          "mean": 22.37,
          "min": 14.1,
          "max": 31.7,
          "std": 3.73
        },
        "Length3": {
          "mean": 25.08,
          "min": 16.2,
          "max": 35.0,
          "std": 4.11
        },
        "Height": {
          "mean": 6.71,
          "min": 4.15,
          "max": 9.48,
          "std": 1.29
        },
        "Width": {
          "mean": 3.67,
          "min": 2.27,
          "max": 5.36,
          "std": 0.71
        }
      }
    },
    "Smelt": {
      "count": 14,
      "weight": {
        "mean": 11.18,
        "median": 9.85,
        "min": 6.7,
        "max": 19.9,
        "std": 4.13
      },
      "dimensions": {
        "Length1": {
          "mean": 11.26,
          "min": 9.3,
          "max": 13.8,
          "std": 1.22
        },
        "Length2": {
          "mean": 11.92,
          "min": 9.8,
          "max": 15.0,
          "std": 1.43
        },
        "Length3": {
          "mean": 13.04,
          "min": 10.8,
          "max": 16.2,
          "std": 1.43
        },
        "Height": {
          "mean": 2.21,
          "min": 1.73,
          "max": 2.93,
          "std": 0.35
        },
        "Width": {
          "mean": 1.34,
          "min": 1.05,
          "max": 2.07,
          "std": 0.29
        }
      }
    },
    "Whitefish": {
      "count": 6,
      "weight": {
        "mean": 531.0,
        "median": 423.0,
        "min": 270.0,
        "max": 1000.0,
        "std": 309.6
      },
      "dimensions": {
        "Length1": {
          "mean": 28.8,
          "min": 23.6,
          "max": 37.3,
          "std": 5.58
        },
        "Length2": {
          "mean": 31.32,
          "min": 26.0,
          "max": 40.0,
          "std": 5.72
        },
        "Length3": {
          "mean": 34.32,
          "min": 28.7,
          "max": 43.5,
          "std": 6.02
        },
        "Height": {
          "mean": 10.03,
          "min": 8.15,
          "max": 12.35,
          "std": 1.83
        },
        "Width": {
          "mean": 5.47,
          "min": 4.25,
          "max": 6.57,
          "std": 1.19
        }
      }
    }
  },
  "correlation_matrix": {
    "Weight": {
      "Weight": 1.0,
      "Length1": 0.9157,
      "Length2": 0.9186,
      "Length3": 0.9231,
      "Height": 0.7239,
      "Width": 0.8867
    },
    "Length1": {
      "Weight": 0.9157,
      "Length1": 1.0,
      "Length2": 0.9995,
      "Length3": 0.992,
      "Height": 0.6244,
      "Width": 0.8667
    },
    "Length2": {
      "Weight": 0.9186,
      "Length1": 0.9995,
      "Length2": 1.0,
      "Length3": 0.9941,
      "Height": 0.6395,
      "Width": 0.8732
    },
    "Length3": {
      "Weight": 0.9231,
      "Length1": 0.992,
      "Length2": 0.9941,
      "Length3": 1.0,
      "Height": 0.7027,
      "Width": 0.8782
    },
    "Height": {
      "Weight": 0.7239,
      "Length1": 0.6244,
      "Length2": 0.6395,
      "Length3": 0.7027,
      "Height": 1.0,
      "Width": 0.7924
    },
    "Width": {
      "Weight": 0.8867,
      "Length1": 0.8667,
      "Length2": 0.8732,
      "Length3": 0.8782,
      "Height": 0.7924,
      "Width": 1.0
    }
  }
};

export interface FishRecord {
  Species: string;
  Weight: number;
  Length1: number;
  Length2: number;
  Length3: number;
  Height: number;
  Width: number;
}

export const CLEANED_DATASET: FishRecord[] = [
  {
    "Species": "Bream",
    "Weight": 242.0,
    "Length1": 23.2,
    "Length2": 25.4,
    "Length3": 30.0,
    "Height": 11.52,
    "Width": 4.02
  },
  {
    "Species": "Bream",
    "Weight": 290.0,
    "Length1": 24.0,
    "Length2": 26.3,
    "Length3": 31.2,
    "Height": 12.48,
    "Width": 4.3056
  },
  {
    "Species": "Bream",
    "Weight": 340.0,
    "Length1": 23.9,
    "Length2": 26.5,
    "Length3": 31.1,
    "Height": 12.3778,
    "Width": 4.6961
  },
  {
    "Species": "Bream",
    "Weight": 363.0,
    "Length1": 26.3,
    "Length2": 29.0,
    "Length3": 33.5,
    "Height": 12.73,
    "Width": 4.4555
  },
  {
    "Species": "Bream",
    "Weight": 430.0,
    "Length1": 26.5,
    "Length2": 29.0,
    "Length3": 34.0,
    "Height": 12.444,
    "Width": 5.134
  },
  {
    "Species": "Bream",
    "Weight": 450.0,
    "Length1": 26.8,
    "Length2": 29.7,
    "Length3": 34.7,
    "Height": 13.6024,
    "Width": 4.9274
  },
  {
    "Species": "Bream",
    "Weight": 500.0,
    "Length1": 26.8,
    "Length2": 29.7,
    "Length3": 34.5,
    "Height": 14.1795,
    "Width": 5.2785
  },
  {
    "Species": "Bream",
    "Weight": 390.0,
    "Length1": 27.6,
    "Length2": 30.0,
    "Length3": 35.0,
    "Height": 12.67,
    "Width": 4.69
  },
  {
    "Species": "Bream",
    "Weight": 450.0,
    "Length1": 27.6,
    "Length2": 30.0,
    "Length3": 35.1,
    "Height": 14.0049,
    "Width": 4.8438
  },
  {
    "Species": "Bream",
    "Weight": 500.0,
    "Length1": 28.5,
    "Length2": 30.7,
    "Length3": 36.2,
    "Height": 14.2266,
    "Width": 4.9594
  },
  {
    "Species": "Bream",
    "Weight": 475.0,
    "Length1": 28.4,
    "Length2": 31.0,
    "Length3": 36.2,
    "Height": 14.2628,
    "Width": 5.1042
  },
  {
    "Species": "Bream",
    "Weight": 500.0,
    "Length1": 28.7,
    "Length2": 31.0,
    "Length3": 36.2,
    "Height": 14.3714,
    "Width": 4.8146
  },
  {
    "Species": "Bream",
    "Weight": 500.0,
    "Length1": 29.1,
    "Length2": 31.5,
    "Length3": 36.4,
    "Height": 13.7592,
    "Width": 4.368
  },
  {
    "Species": "Bream",
    "Weight": 340.0,
    "Length1": 29.5,
    "Length2": 32.0,
    "Length3": 37.3,
    "Height": 13.9129,
    "Width": 5.0728
  },
  {
    "Species": "Bream",
    "Weight": 600.0,
    "Length1": 29.4,
    "Length2": 32.0,
    "Length3": 37.2,
    "Height": 14.9544,
    "Width": 5.1708
  },
  {
    "Species": "Bream",
    "Weight": 600.0,
    "Length1": 29.4,
    "Length2": 32.0,
    "Length3": 37.2,
    "Height": 15.438,
    "Width": 5.58
  },
  {
    "Species": "Bream",
    "Weight": 700.0,
    "Length1": 30.4,
    "Length2": 33.0,
    "Length3": 38.3,
    "Height": 14.8604,
    "Width": 5.2854
  },
  {
    "Species": "Bream",
    "Weight": 700.0,
    "Length1": 30.4,
    "Length2": 33.0,
    "Length3": 38.5,
    "Height": 14.938,
    "Width": 5.1975
  },
  {
    "Species": "Bream",
    "Weight": 610.0,
    "Length1": 30.9,
    "Length2": 33.5,
    "Length3": 38.6,
    "Height": 15.633,
    "Width": 5.1338
  },
  {
    "Species": "Bream",
    "Weight": 650.0,
    "Length1": 31.0,
    "Length2": 33.5,
    "Length3": 38.7,
    "Height": 14.4738,
    "Width": 5.7276
  },
  {
    "Species": "Bream",
    "Weight": 575.0,
    "Length1": 31.3,
    "Length2": 34.0,
    "Length3": 39.5,
    "Height": 15.1285,
    "Width": 5.5695
  },
  {
    "Species": "Bream",
    "Weight": 685.0,
    "Length1": 31.4,
    "Length2": 34.0,
    "Length3": 39.2,
    "Height": 15.9936,
    "Width": 5.3704
  },
  {
    "Species": "Bream",
    "Weight": 620.0,
    "Length1": 31.5,
    "Length2": 34.5,
    "Length3": 39.7,
    "Height": 15.5227,
    "Width": 5.2801
  },
  {
    "Species": "Bream",
    "Weight": 680.0,
    "Length1": 31.8,
    "Length2": 35.0,
    "Length3": 40.6,
    "Height": 15.4686,
    "Width": 6.1306
  },
  {
    "Species": "Bream",
    "Weight": 700.0,
    "Length1": 31.9,
    "Length2": 35.0,
    "Length3": 40.5,
    "Height": 16.2405,
    "Width": 5.589
  },
  {
    "Species": "Bream",
    "Weight": 725.0,
    "Length1": 31.8,
    "Length2": 35.0,
    "Length3": 40.9,
    "Height": 16.36,
    "Width": 6.0532
  },
  {
    "Species": "Bream",
    "Weight": 720.0,
    "Length1": 32.0,
    "Length2": 35.0,
    "Length3": 40.6,
    "Height": 16.3618,
    "Width": 6.09
  },
  {
    "Species": "Bream",
    "Weight": 714.0,
    "Length1": 32.7,
    "Length2": 36.0,
    "Length3": 41.5,
    "Height": 16.517,
    "Width": 5.8515
  },
  {
    "Species": "Bream",
    "Weight": 850.0,
    "Length1": 32.8,
    "Length2": 36.0,
    "Length3": 41.6,
    "Height": 16.8896,
    "Width": 6.1984
  },
  {
    "Species": "Bream",
    "Weight": 1000.0,
    "Length1": 33.5,
    "Length2": 37.0,
    "Length3": 42.6,
    "Height": 18.957,
    "Width": 6.603
  },
  {
    "Species": "Bream",
    "Weight": 920.0,
    "Length1": 35.0,
    "Length2": 38.5,
    "Length3": 44.1,
    "Height": 18.0369,
    "Width": 6.3063
  },
  {
    "Species": "Bream",
    "Weight": 955.0,
    "Length1": 35.0,
    "Length2": 38.5,
    "Length3": 44.0,
    "Height": 18.084,
    "Width": 6.292
  },
  {
    "Species": "Bream",
    "Weight": 925.0,
    "Length1": 36.2,
    "Length2": 39.5,
    "Length3": 45.3,
    "Height": 18.7542,
    "Width": 6.7497
  },
  {
    "Species": "Bream",
    "Weight": 975.0,
    "Length1": 37.4,
    "Length2": 41.0,
    "Length3": 45.9,
    "Height": 18.6354,
    "Width": 6.7473
  },
  {
    "Species": "Bream",
    "Weight": 950.0,
    "Length1": 38.0,
    "Length2": 41.0,
    "Length3": 46.5,
    "Height": 17.6235,
    "Width": 6.3705
  },
  {
    "Species": "Roach",
    "Weight": 40.0,
    "Length1": 12.9,
    "Length2": 14.1,
    "Length3": 16.2,
    "Height": 4.1472,
    "Width": 2.268
  },
  {
    "Species": "Roach",
    "Weight": 69.0,
    "Length1": 16.5,
    "Length2": 18.2,
    "Length3": 20.3,
    "Height": 5.2983,
    "Width": 2.8217
  },
  {
    "Species": "Roach",
    "Weight": 78.0,
    "Length1": 17.5,
    "Length2": 18.8,
    "Length3": 21.2,
    "Height": 5.5756,
    "Width": 2.9044
  },
  {
    "Species": "Roach",
    "Weight": 87.0,
    "Length1": 18.2,
    "Length2": 19.8,
    "Length3": 22.2,
    "Height": 5.6166,
    "Width": 3.1746
  },
  {
    "Species": "Roach",
    "Weight": 120.0,
    "Length1": 18.6,
    "Length2": 20.0,
    "Length3": 22.2,
    "Height": 6.216,
    "Width": 3.5742
  },
  {
    "Species": "Roach",
    "Weight": 110.0,
    "Length1": 19.1,
    "Length2": 20.8,
    "Length3": 23.1,
    "Height": 6.1677,
    "Width": 3.3957
  },
  {
    "Species": "Roach",
    "Weight": 120.0,
    "Length1": 19.4,
    "Length2": 21.0,
    "Length3": 23.7,
    "Height": 6.1146,
    "Width": 3.2943
  },
  {
    "Species": "Roach",
    "Weight": 150.0,
    "Length1": 20.4,
    "Length2": 22.0,
    "Length3": 24.7,
    "Height": 5.8045,
    "Width": 3.7544
  },
  {
    "Species": "Roach",
    "Weight": 145.0,
    "Length1": 20.5,
    "Length2": 22.0,
    "Length3": 24.3,
    "Height": 6.6339,
    "Width": 3.5478
  },
  {
    "Species": "Roach",
    "Weight": 160.0,
    "Length1": 20.5,
    "Length2": 22.5,
    "Length3": 25.3,
    "Height": 7.0334,
    "Width": 3.8203
  },
  {
    "Species": "Roach",
    "Weight": 140.0,
    "Length1": 21.0,
    "Length2": 22.5,
    "Length3": 25.0,
    "Height": 6.55,
    "Width": 3.325
  },
  {
    "Species": "Roach",
    "Weight": 160.0,
    "Length1": 21.1,
    "Length2": 22.5,
    "Length3": 25.0,
    "Height": 6.4,
    "Width": 3.8
  },
  {
    "Species": "Roach",
    "Weight": 169.0,
    "Length1": 22.0,
    "Length2": 24.0,
    "Length3": 27.2,
    "Height": 7.5344,
    "Width": 3.8352
  },
  {
    "Species": "Roach",
    "Weight": 161.0,
    "Length1": 22.0,
    "Length2": 23.4,
    "Length3": 26.7,
    "Height": 6.9153,
    "Width": 3.6312
  },
  {
    "Species": "Roach",
    "Weight": 200.0,
    "Length1": 22.1,
    "Length2": 23.5,
    "Length3": 26.8,
    "Height": 7.3968,
    "Width": 4.1272
  },
  {
    "Species": "Roach",
    "Weight": 180.0,
    "Length1": 23.6,
    "Length2": 25.2,
    "Length3": 27.9,
    "Height": 7.0866,
    "Width": 3.906
  },
  {
    "Species": "Roach",
    "Weight": 290.0,
    "Length1": 24.0,
    "Length2": 26.0,
    "Length3": 29.2,
    "Height": 8.8768,
    "Width": 4.4968
  },
  {
    "Species": "Roach",
    "Weight": 272.0,
    "Length1": 25.0,
    "Length2": 27.0,
    "Length3": 30.6,
    "Height": 8.568,
    "Width": 4.7736
  },
  {
    "Species": "Roach",
    "Weight": 390.0,
    "Length1": 29.5,
    "Length2": 31.7,
    "Length3": 35.0,
    "Height": 9.485,
    "Width": 5.355
  },
  {
    "Species": "Whitefish",
    "Weight": 270.0,
    "Length1": 23.6,
    "Length2": 26.0,
    "Length3": 28.7,
    "Height": 8.3804,
    "Width": 4.2476
  },
  {
    "Species": "Whitefish",
    "Weight": 270.0,
    "Length1": 24.1,
    "Length2": 26.5,
    "Length3": 29.3,
    "Height": 8.1454,
    "Width": 4.2485
  },
  {
    "Species": "Whitefish",
    "Weight": 306.0,
    "Length1": 25.6,
    "Length2": 28.0,
    "Length3": 30.8,
    "Height": 8.778,
    "Width": 4.6816
  },
  {
    "Species": "Whitefish",
    "Weight": 540.0,
    "Length1": 28.5,
    "Length2": 31.0,
    "Length3": 34.0,
    "Height": 10.744,
    "Width": 6.562
  },
  {
    "Species": "Whitefish",
    "Weight": 800.0,
    "Length1": 33.7,
    "Length2": 36.4,
    "Length3": 39.6,
    "Height": 11.7612,
    "Width": 6.5736
  },
  {
    "Species": "Whitefish",
    "Weight": 1000.0,
    "Length1": 37.3,
    "Length2": 40.0,
    "Length3": 43.5,
    "Height": 12.354,
    "Width": 6.525
  },
  {
    "Species": "Parkki",
    "Weight": 55.0,
    "Length1": 13.5,
    "Length2": 14.7,
    "Length3": 16.5,
    "Height": 6.8475,
    "Width": 2.3265
  },
  {
    "Species": "Parkki",
    "Weight": 60.0,
    "Length1": 14.3,
    "Length2": 15.5,
    "Length3": 17.4,
    "Height": 6.5772,
    "Width": 2.3142
  },
  {
    "Species": "Parkki",
    "Weight": 90.0,
    "Length1": 16.3,
    "Length2": 17.7,
    "Length3": 19.8,
    "Height": 7.4052,
    "Width": 2.673
  },
  {
    "Species": "Parkki",
    "Weight": 120.0,
    "Length1": 17.5,
    "Length2": 19.0,
    "Length3": 21.3,
    "Height": 8.3922,
    "Width": 2.9181
  },
  {
    "Species": "Parkki",
    "Weight": 150.0,
    "Length1": 18.4,
    "Length2": 20.0,
    "Length3": 22.4,
    "Height": 8.8928,
    "Width": 3.2928
  },
  {
    "Species": "Parkki",
    "Weight": 140.0,
    "Length1": 19.0,
    "Length2": 20.7,
    "Length3": 23.2,
    "Height": 8.5376,
    "Width": 3.2944
  },
  {
    "Species": "Parkki",
    "Weight": 170.0,
    "Length1": 19.0,
    "Length2": 20.7,
    "Length3": 23.2,
    "Height": 9.396,
    "Width": 3.4104
  },
  {
    "Species": "Parkki",
    "Weight": 145.0,
    "Length1": 19.8,
    "Length2": 21.5,
    "Length3": 24.1,
    "Height": 9.7364,
    "Width": 3.1571
  },
  {
    "Species": "Parkki",
    "Weight": 200.0,
    "Length1": 21.2,
    "Length2": 23.0,
    "Length3": 25.8,
    "Height": 10.3458,
    "Width": 3.6636
  },
  {
    "Species": "Parkki",
    "Weight": 273.0,
    "Length1": 23.0,
    "Length2": 25.0,
    "Length3": 28.0,
    "Height": 11.088,
    "Width": 4.144
  },
  {
    "Species": "Parkki",
    "Weight": 300.0,
    "Length1": 24.0,
    "Length2": 26.0,
    "Length3": 29.0,
    "Height": 11.368,
    "Width": 4.234
  },
  {
    "Species": "Perch",
    "Weight": 5.9,
    "Length1": 7.5,
    "Length2": 8.4,
    "Length3": 8.8,
    "Height": 2.112,
    "Width": 1.408
  },
  {
    "Species": "Perch",
    "Weight": 32.0,
    "Length1": 12.5,
    "Length2": 13.7,
    "Length3": 14.7,
    "Height": 3.528,
    "Width": 1.9992
  },
  {
    "Species": "Perch",
    "Weight": 40.0,
    "Length1": 13.8,
    "Length2": 15.0,
    "Length3": 16.0,
    "Height": 3.824,
    "Width": 2.432
  },
  {
    "Species": "Perch",
    "Weight": 51.5,
    "Length1": 15.0,
    "Length2": 16.2,
    "Length3": 17.2,
    "Height": 4.5924,
    "Width": 2.6316
  },
  {
    "Species": "Perch",
    "Weight": 70.0,
    "Length1": 15.7,
    "Length2": 17.4,
    "Length3": 18.5,
    "Height": 4.588,
    "Width": 2.9415
  },
  {
    "Species": "Perch",
    "Weight": 100.0,
    "Length1": 16.2,
    "Length2": 18.0,
    "Length3": 19.2,
    "Height": 5.2224,
    "Width": 3.3216
  },
  {
    "Species": "Perch",
    "Weight": 78.0,
    "Length1": 16.8,
    "Length2": 18.7,
    "Length3": 19.4,
    "Height": 5.1992,
    "Width": 3.1234
  },
  {
    "Species": "Perch",
    "Weight": 80.0,
    "Length1": 17.2,
    "Length2": 19.0,
    "Length3": 20.2,
    "Height": 5.6358,
    "Width": 3.0502
  },
  {
    "Species": "Perch",
    "Weight": 85.0,
    "Length1": 17.8,
    "Length2": 19.6,
    "Length3": 20.8,
    "Height": 5.1376,
    "Width": 3.0368
  },
  {
    "Species": "Perch",
    "Weight": 85.0,
    "Length1": 18.2,
    "Length2": 20.0,
    "Length3": 21.0,
    "Height": 5.082,
    "Width": 2.772
  },
  {
    "Species": "Perch",
    "Weight": 110.0,
    "Length1": 19.0,
    "Length2": 21.0,
    "Length3": 22.5,
    "Height": 5.6925,
    "Width": 3.555
  },
  {
    "Species": "Perch",
    "Weight": 115.0,
    "Length1": 19.0,
    "Length2": 21.0,
    "Length3": 22.5,
    "Height": 5.9175,
    "Width": 3.3075
  },
  {
    "Species": "Perch",
    "Weight": 125.0,
    "Length1": 19.0,
    "Length2": 21.0,
    "Length3": 22.5,
    "Height": 5.6925,
    "Width": 3.6675
  },
  {
    "Species": "Perch",
    "Weight": 130.0,
    "Length1": 19.3,
    "Length2": 21.3,
    "Length3": 22.8,
    "Height": 6.384,
    "Width": 3.534
  },
  {
    "Species": "Perch",
    "Weight": 120.0,
    "Length1": 20.0,
    "Length2": 22.0,
    "Length3": 23.5,
    "Height": 6.11,
    "Width": 3.4075
  },
  {
    "Species": "Perch",
    "Weight": 120.0,
    "Length1": 20.0,
    "Length2": 22.0,
    "Length3": 23.5,
    "Height": 5.64,
    "Width": 3.525
  },
  {
    "Species": "Perch",
    "Weight": 130.0,
    "Length1": 20.0,
    "Length2": 22.0,
    "Length3": 23.5,
    "Height": 6.11,
    "Width": 3.525
  },
  {
    "Species": "Perch",
    "Weight": 135.0,
    "Length1": 20.0,
    "Length2": 22.0,
    "Length3": 23.5,
    "Height": 5.875,
    "Width": 3.525
  },
  {
    "Species": "Perch",
    "Weight": 110.0,
    "Length1": 20.0,
    "Length2": 22.0,
    "Length3": 23.5,
    "Height": 5.5225,
    "Width": 3.995
  },
  {
    "Species": "Perch",
    "Weight": 130.0,
    "Length1": 20.5,
    "Length2": 22.5,
    "Length3": 24.0,
    "Height": 5.856,
    "Width": 3.624
  },
  {
    "Species": "Perch",
    "Weight": 150.0,
    "Length1": 20.5,
    "Length2": 22.5,
    "Length3": 24.0,
    "Height": 6.792,
    "Width": 3.624
  },
  {
    "Species": "Perch",
    "Weight": 145.0,
    "Length1": 20.7,
    "Length2": 22.7,
    "Length3": 24.2,
    "Height": 5.9532,
    "Width": 3.63
  },
  {
    "Species": "Perch",
    "Weight": 150.0,
    "Length1": 21.0,
    "Length2": 23.0,
    "Length3": 24.5,
    "Height": 5.2185,
    "Width": 3.626
  },
  {
    "Species": "Perch",
    "Weight": 170.0,
    "Length1": 21.5,
    "Length2": 23.5,
    "Length3": 25.0,
    "Height": 6.275,
    "Width": 3.725
  },
  {
    "Species": "Perch",
    "Weight": 225.0,
    "Length1": 22.0,
    "Length2": 24.0,
    "Length3": 25.5,
    "Height": 7.293,
    "Width": 3.723
  },
  {
    "Species": "Perch",
    "Weight": 145.0,
    "Length1": 22.0,
    "Length2": 24.0,
    "Length3": 25.5,
    "Height": 6.375,
    "Width": 3.825
  },
  {
    "Species": "Perch",
    "Weight": 188.0,
    "Length1": 22.6,
    "Length2": 24.6,
    "Length3": 26.2,
    "Height": 6.7334,
    "Width": 4.1658
  },
  {
    "Species": "Perch",
    "Weight": 180.0,
    "Length1": 23.0,
    "Length2": 25.0,
    "Length3": 26.5,
    "Height": 6.4395,
    "Width": 3.6835
  },
  {
    "Species": "Perch",
    "Weight": 197.0,
    "Length1": 23.5,
    "Length2": 25.6,
    "Length3": 27.0,
    "Height": 6.561,
    "Width": 4.239
  },
  {
    "Species": "Perch",
    "Weight": 218.0,
    "Length1": 25.0,
    "Length2": 26.5,
    "Length3": 28.0,
    "Height": 7.168,
    "Width": 4.144
  },
  {
    "Species": "Perch",
    "Weight": 300.0,
    "Length1": 25.2,
    "Length2": 27.3,
    "Length3": 28.7,
    "Height": 8.323,
    "Width": 5.1373
  },
  {
    "Species": "Perch",
    "Weight": 260.0,
    "Length1": 25.4,
    "Length2": 27.5,
    "Length3": 28.9,
    "Height": 7.1672,
    "Width": 4.335
  },
  {
    "Species": "Perch",
    "Weight": 265.0,
    "Length1": 25.4,
    "Length2": 27.5,
    "Length3": 28.9,
    "Height": 7.0516,
    "Width": 4.335
  },
  {
    "Species": "Perch",
    "Weight": 250.0,
    "Length1": 25.4,
    "Length2": 27.5,
    "Length3": 28.9,
    "Height": 7.2828,
    "Width": 4.5662
  },
  {
    "Species": "Perch",
    "Weight": 250.0,
    "Length1": 25.9,
    "Length2": 28.0,
    "Length3": 29.4,
    "Height": 7.8204,
    "Width": 4.2042
  },
  {
    "Species": "Perch",
    "Weight": 300.0,
    "Length1": 26.9,
    "Length2": 28.7,
    "Length3": 30.1,
    "Height": 7.5852,
    "Width": 4.6354
  },
  {
    "Species": "Perch",
    "Weight": 320.0,
    "Length1": 27.8,
    "Length2": 30.0,
    "Length3": 31.6,
    "Height": 7.6156,
    "Width": 4.7716
  },
  {
    "Species": "Perch",
    "Weight": 514.0,
    "Length1": 30.5,
    "Length2": 32.8,
    "Length3": 34.0,
    "Height": 10.03,
    "Width": 6.018
  },
  {
    "Species": "Perch",
    "Weight": 556.0,
    "Length1": 32.0,
    "Length2": 34.5,
    "Length3": 36.5,
    "Height": 10.2565,
    "Width": 6.3875
  },
  {
    "Species": "Perch",
    "Weight": 840.0,
    "Length1": 32.5,
    "Length2": 35.0,
    "Length3": 37.3,
    "Height": 11.4884,
    "Width": 7.7957
  },
  {
    "Species": "Perch",
    "Weight": 685.0,
    "Length1": 34.0,
    "Length2": 36.5,
    "Length3": 39.0,
    "Height": 10.881,
    "Width": 6.864
  },
  {
    "Species": "Perch",
    "Weight": 700.0,
    "Length1": 34.0,
    "Length2": 36.0,
    "Length3": 38.3,
    "Height": 10.6091,
    "Width": 6.7408
  },
  {
    "Species": "Perch",
    "Weight": 700.0,
    "Length1": 34.5,
    "Length2": 37.0,
    "Length3": 39.4,
    "Height": 10.835,
    "Width": 6.2646
  },
  {
    "Species": "Perch",
    "Weight": 690.0,
    "Length1": 34.6,
    "Length2": 37.0,
    "Length3": 39.3,
    "Height": 10.5717,
    "Width": 6.3666
  },
  {
    "Species": "Perch",
    "Weight": 900.0,
    "Length1": 36.5,
    "Length2": 39.0,
    "Length3": 41.4,
    "Height": 11.1366,
    "Width": 7.4934
  },
  {
    "Species": "Perch",
    "Weight": 650.0,
    "Length1": 36.5,
    "Length2": 39.0,
    "Length3": 41.4,
    "Height": 11.1366,
    "Width": 6.003
  },
  {
    "Species": "Perch",
    "Weight": 820.0,
    "Length1": 36.6,
    "Length2": 39.0,
    "Length3": 41.3,
    "Height": 12.4313,
    "Width": 7.3514
  },
  {
    "Species": "Perch",
    "Weight": 850.0,
    "Length1": 36.9,
    "Length2": 40.0,
    "Length3": 42.3,
    "Height": 11.9286,
    "Width": 7.1064
  },
  {
    "Species": "Perch",
    "Weight": 900.0,
    "Length1": 37.0,
    "Length2": 40.0,
    "Length3": 42.5,
    "Height": 11.73,
    "Width": 7.225
  },
  {
    "Species": "Perch",
    "Weight": 1015.0,
    "Length1": 37.0,
    "Length2": 40.0,
    "Length3": 42.4,
    "Height": 12.3808,
    "Width": 7.4624
  },
  {
    "Species": "Perch",
    "Weight": 820.0,
    "Length1": 37.1,
    "Length2": 40.0,
    "Length3": 42.5,
    "Height": 11.135,
    "Width": 6.63
  },
  {
    "Species": "Perch",
    "Weight": 1100.0,
    "Length1": 39.0,
    "Length2": 42.0,
    "Length3": 44.6,
    "Height": 12.8002,
    "Width": 6.8684
  },
  {
    "Species": "Perch",
    "Weight": 1000.0,
    "Length1": 39.8,
    "Length2": 43.0,
    "Length3": 45.2,
    "Height": 11.9328,
    "Width": 7.2772
  },
  {
    "Species": "Perch",
    "Weight": 1100.0,
    "Length1": 40.1,
    "Length2": 43.0,
    "Length3": 45.5,
    "Height": 12.5125,
    "Width": 7.4165
  },
  {
    "Species": "Perch",
    "Weight": 1000.0,
    "Length1": 40.2,
    "Length2": 43.5,
    "Length3": 46.0,
    "Height": 12.604,
    "Width": 8.142
  },
  {
    "Species": "Perch",
    "Weight": 1000.0,
    "Length1": 41.1,
    "Length2": 44.0,
    "Length3": 46.6,
    "Height": 12.4888,
    "Width": 7.5958
  },
  {
    "Species": "Pike",
    "Weight": 200.0,
    "Length1": 30.0,
    "Length2": 32.3,
    "Length3": 34.8,
    "Height": 5.568,
    "Width": 3.3756
  },
  {
    "Species": "Pike",
    "Weight": 300.0,
    "Length1": 31.7,
    "Length2": 34.0,
    "Length3": 37.8,
    "Height": 5.7078,
    "Width": 4.158
  },
  {
    "Species": "Pike",
    "Weight": 300.0,
    "Length1": 32.7,
    "Length2": 35.0,
    "Length3": 38.8,
    "Height": 5.9364,
    "Width": 4.3844
  },
  {
    "Species": "Pike",
    "Weight": 300.0,
    "Length1": 34.8,
    "Length2": 37.3,
    "Length3": 39.8,
    "Height": 6.2884,
    "Width": 4.0198
  },
  {
    "Species": "Pike",
    "Weight": 430.0,
    "Length1": 35.5,
    "Length2": 38.0,
    "Length3": 40.5,
    "Height": 7.29,
    "Width": 4.5765
  },
  {
    "Species": "Pike",
    "Weight": 345.0,
    "Length1": 36.0,
    "Length2": 38.5,
    "Length3": 41.0,
    "Height": 6.396,
    "Width": 3.977
  },
  {
    "Species": "Pike",
    "Weight": 456.0,
    "Length1": 40.0,
    "Length2": 42.5,
    "Length3": 45.5,
    "Height": 7.28,
    "Width": 4.3225
  },
  {
    "Species": "Pike",
    "Weight": 510.0,
    "Length1": 40.0,
    "Length2": 42.5,
    "Length3": 45.5,
    "Height": 6.825,
    "Width": 4.459
  },
  {
    "Species": "Pike",
    "Weight": 540.0,
    "Length1": 40.1,
    "Length2": 43.0,
    "Length3": 45.8,
    "Height": 7.786,
    "Width": 5.1296
  },
  {
    "Species": "Pike",
    "Weight": 500.0,
    "Length1": 42.0,
    "Length2": 45.0,
    "Length3": 48.0,
    "Height": 6.96,
    "Width": 4.896
  },
  {
    "Species": "Pike",
    "Weight": 567.0,
    "Length1": 43.2,
    "Length2": 46.0,
    "Length3": 48.7,
    "Height": 7.792,
    "Width": 4.87
  },
  {
    "Species": "Pike",
    "Weight": 770.0,
    "Length1": 44.8,
    "Length2": 48.0,
    "Length3": 51.2,
    "Height": 7.68,
    "Width": 5.376
  },
  {
    "Species": "Pike",
    "Weight": 950.0,
    "Length1": 48.3,
    "Length2": 51.7,
    "Length3": 55.1,
    "Height": 8.9262,
    "Width": 6.1712
  },
  {
    "Species": "Pike",
    "Weight": 1250.0,
    "Length1": 52.0,
    "Length2": 56.0,
    "Length3": 59.7,
    "Height": 10.6863,
    "Width": 6.9849
  },
  {
    "Species": "Pike",
    "Weight": 1600.0,
    "Length1": 56.0,
    "Length2": 60.0,
    "Length3": 64.0,
    "Height": 9.6,
    "Width": 6.144
  },
  {
    "Species": "Pike",
    "Weight": 1550.0,
    "Length1": 56.0,
    "Length2": 60.0,
    "Length3": 64.0,
    "Height": 9.6,
    "Width": 6.144
  },
  {
    "Species": "Pike",
    "Weight": 1650.0,
    "Length1": 59.0,
    "Length2": 63.4,
    "Length3": 68.0,
    "Height": 10.812,
    "Width": 7.48
  },
  {
    "Species": "Smelt",
    "Weight": 6.7,
    "Length1": 9.3,
    "Length2": 9.8,
    "Length3": 10.8,
    "Height": 1.7388,
    "Width": 1.0476
  },
  {
    "Species": "Smelt",
    "Weight": 7.5,
    "Length1": 10.0,
    "Length2": 10.5,
    "Length3": 11.6,
    "Height": 1.972,
    "Width": 1.16
  },
  {
    "Species": "Smelt",
    "Weight": 7.0,
    "Length1": 10.1,
    "Length2": 10.6,
    "Length3": 11.6,
    "Height": 1.7284,
    "Width": 1.1484
  },
  {
    "Species": "Smelt",
    "Weight": 9.7,
    "Length1": 10.4,
    "Length2": 11.0,
    "Length3": 12.0,
    "Height": 2.196,
    "Width": 1.38
  },
  {
    "Species": "Smelt",
    "Weight": 9.8,
    "Length1": 10.7,
    "Length2": 11.2,
    "Length3": 12.4,
    "Height": 2.0832,
    "Width": 1.2772
  },
  {
    "Species": "Smelt",
    "Weight": 8.7,
    "Length1": 10.8,
    "Length2": 11.3,
    "Length3": 12.6,
    "Height": 1.9782,
    "Width": 1.2852
  },
  {
    "Species": "Smelt",
    "Weight": 10.0,
    "Length1": 11.3,
    "Length2": 11.8,
    "Length3": 13.1,
    "Height": 2.2139,
    "Width": 1.2838
  },
  {
    "Species": "Smelt",
    "Weight": 9.9,
    "Length1": 11.3,
    "Length2": 11.8,
    "Length3": 13.1,
    "Height": 2.2139,
    "Width": 1.1659
  },
  {
    "Species": "Smelt",
    "Weight": 9.8,
    "Length1": 11.4,
    "Length2": 12.0,
    "Length3": 13.2,
    "Height": 2.2044,
    "Width": 1.1484
  },
  {
    "Species": "Smelt",
    "Weight": 12.2,
    "Length1": 11.5,
    "Length2": 12.2,
    "Length3": 13.4,
    "Height": 2.0904,
    "Width": 1.3936
  },
  {
    "Species": "Smelt",
    "Weight": 13.4,
    "Length1": 11.7,
    "Length2": 12.4,
    "Length3": 13.5,
    "Height": 2.43,
    "Width": 1.269
  },
  {
    "Species": "Smelt",
    "Weight": 12.2,
    "Length1": 12.1,
    "Length2": 13.0,
    "Length3": 13.8,
    "Height": 2.277,
    "Width": 1.2558
  },
  {
    "Species": "Smelt",
    "Weight": 19.7,
    "Length1": 13.2,
    "Length2": 14.3,
    "Length3": 15.2,
    "Height": 2.8728,
    "Width": 2.0672
  },
  {
    "Species": "Smelt",
    "Weight": 19.9,
    "Length1": 13.8,
    "Length2": 15.0,
    "Length3": 16.2,
    "Height": 2.9322,
    "Width": 1.8792
  }
];
