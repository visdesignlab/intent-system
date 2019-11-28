import {PredictionSet} from '../../contract';

export interface PredictionState {
  predictionSet: PredictionSet;
  hideZeroPredictions: boolean;
  isLoading: boolean;
}

export enum PredictionType {
  Outlier = 'Outlier',
  Cluster = 'Cluster',
  Skyline = 'Skyline',
  Category = 'Category',
  QuadraticRegression = 'QuadraticRegression',
  LinearRegression = 'LinearRegression',
  NonOutlier = 'Non-Outlier',
  Range = 'Range',
}

export function getPredictionType(intent: string): PredictionType {
  let detectedType: PredictionType = null as any;

  Object.entries(PredictionType).forEach(entry => {
    if (detectedType) return;
    const [type, typeStr] = entry;
    if (intent.split(':').includes(typeStr)) {
      detectedType = type as any;
    }
  });

  return detectedType;
}
