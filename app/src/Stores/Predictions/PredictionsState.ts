import {PredictionSet} from '../../contract';

export interface PredictionState {
  predictionSet: PredictionSet;
  hideZeroPredictions: boolean;
  isLoading: boolean;
}
