import {Action, Reducer} from 'redux';
import {PredictionSet} from '../../../contract';

export const UPDATE_PREDICTION = 'UPDATE_PREDICTION';
export type UPDATE_PREDICTION = typeof UPDATE_PREDICTION;

export interface UpdatePredictionAction extends Action<UPDATE_PREDICTION> {
  type: UPDATE_PREDICTION;
  args: PredictionSet;
}

export const updatePredictions = (
  predictionSet: PredictionSet,
): UpdatePredictionAction => ({
  type: UPDATE_PREDICTION,
  args: predictionSet,
});

export const PredictionsReducer: Reducer<
  PredictionSet,
  UpdatePredictionAction
> = (current = {} as any, action: UpdatePredictionAction) => {
  switch (action.type) {
    case UPDATE_PREDICTION:
      return action.args;
    default:
      return current;
  }
};
