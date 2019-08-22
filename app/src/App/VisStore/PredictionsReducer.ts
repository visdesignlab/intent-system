import { PredictionSet } from '@visdesignlab/intent-contract';
import { Action, Reducer } from 'redux';

export enum PredictionActions {
  UPDATE_PREDICATION = "UPDATE_PREDICATION"
}

export interface PredictionsAction extends Action<PredictionActions> {
  type: PredictionActions;
  args: PredictionSet;
}

export const PredictionActionReducer: Reducer<
  PredictionSet,
  PredictionsAction
> = (
  current: PredictionSet = {
    dimensions: [],
    predictions: [],
    selectedIds: []
  },
  action: PredictionsAction
) => {
  switch (action.type) {
    case PredictionActions.UPDATE_PREDICATION:
      return action.args;
    default:
      return current;
  }
};
