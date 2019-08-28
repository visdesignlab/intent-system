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
      const interactions = [...current, action.args.interaction];
      const request: PredictionRequest = {
        multiBrushBehavior: action.args.multiBrushBehavior,
        interactionHistory: interactions
      };

      axios
        .post(`/dataset/${datasetName}/predict`, request)
        .then(response => {
          VisStore.visStore().dispatch({
            type: PredictionActions.UPDATE_PREDICATION,
            args: response.data
          });
          console.log("Arguments", interactions);
          console.log("Preds", response.data);
        })
        .catch(err => {
          console.log(current, action, err);
        });
      return interactions;
    default:
      return [...current];
  }
};
