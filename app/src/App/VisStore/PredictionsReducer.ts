import { Reducer, Action } from "redux";

export enum PredictionActions {
  UPDATE_PREDICATION = "UPDATE_PREDICATION"
}

export interface PredictionsAction extends Action<PredictionActions> {
  type: PredictionActions;
  args: any[];
}

export const PredictionActionReducer: Reducer<any[], PredictionsAction> = (
  current: any[] = [],
  action: PredictionsAction
) => {
  switch (action.type) {
    case PredictionActions.UPDATE_PREDICATION:
      return action.args;
    default:
      return current;
  }
};
