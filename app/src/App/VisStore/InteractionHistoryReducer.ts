import { Interaction, InteractionHistory, MultiBrushBehavior, PredictionRequest } from '@visdesignlab/intent-contract';
import axios from 'axios';
import { Action, Reducer } from 'redux';

import { datasetName } from '../..';
import { VisStore } from './../..';
import { PredictionActions } from './PredictionsReducer';

export enum InteractionHistoryActions {
  ADD_INTERACTION = "ADD_INTERACTION"
}

export interface InteractionHistoryAction
  extends Action<InteractionHistoryActions> {
  type: InteractionHistoryActions;
  args: {
    multiBrushBehavior: MultiBrushBehavior;
    interaction: Interaction;
  };
}

export const InteractionHistoryReducer: Reducer<
  InteractionHistory,
  InteractionHistoryAction
> = (current: InteractionHistory = [], action: InteractionHistoryAction) => {
  switch (action.type) {
    case InteractionHistoryActions.ADD_INTERACTION:
      const request: PredictionRequest = {
        multiBrushBehavior: action.args.multiBrushBehavior,
        interactionHistory: [...current, action.args.interaction]
      };

      axios.post(`/dataset/${datasetName}/predict`, request).then(response => {
        VisStore.visStore().dispatch({
          type: PredictionActions.UPDATE_PREDICATION,
          args: response.data
        });
        console.log("Arguments", action.args);
        console.log("Preds", response.data);
      });
      return [...current, action.args.interaction];
    default:
      return [...current];
  }
};
