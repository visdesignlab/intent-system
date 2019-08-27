import { InteractionHistory, MultiBrushBehavior, PredictionRequest } from '@visdesignlab/intent-contract';
import axios from 'axios';
import { Action, Reducer } from 'redux';

import { datasetName } from '../..';
import { VisStore } from './../..';
import { PredictionActions } from './PredictionsReducer';

export enum MultiBrushBehaviorActions {
  SWITCH = "SWITCH"
}

export interface MultiBrushBehaviorAction
  extends Action<MultiBrushBehaviorActions> {
  type: MultiBrushBehaviorActions;
  args: {
    multiBrushBehavior: MultiBrushBehavior;
    interactions: InteractionHistory;
  };
}

export const MultiBrushBehaviorReducer: Reducer<
  MultiBrushBehavior,
  MultiBrushBehaviorAction
> = (
  current: MultiBrushBehavior = MultiBrushBehavior.INTERSECTION,
  action: MultiBrushBehaviorAction
) => {
  switch (action.type) {
    case MultiBrushBehaviorActions.SWITCH:
      const request: PredictionRequest = {
        multiBrushBehavior: action.args.multiBrushBehavior,
        interactionHistory: action.args.interactions
      };
      axios.post(`/dataset/${datasetName}/predict`, request).then(response => {
        VisStore.visStore().dispatch({
          type: PredictionActions.UPDATE_PREDICATION,
          args: response.data
        });
        console.log("Arguments", action.args);
        console.log("Preds", response.data);
      });
      return action.args.multiBrushBehavior;
    default:
      return current;
  }
};
