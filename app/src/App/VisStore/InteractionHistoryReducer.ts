import { Action, Reducer } from "redux";
import { Interaction, InteractionHistory } from "@visdesignlab/intent-contract";
import axios from "axios";
import { datasetName } from "../..";

export enum InteractionHistoryActions {
  ADD_INTERACTION = "ADD_INTERACTION"
}

export interface InteractionHistoryAction
  extends Action<InteractionHistoryActions> {
  type: InteractionHistoryActions;
  args: Interaction;
}

export const InteractionHistoryReducer: Reducer<
  InteractionHistory,
  InteractionHistoryAction
> = (current: InteractionHistory = [], action: InteractionHistoryAction) => {
  switch (action.type) {
    case InteractionHistoryActions.ADD_INTERACTION:
      current = [...current, action.args];
      axios.post(`/dataset/${datasetName}/predict`, current).then(response => {
        console.log("Predictions", response.data);
      });
      return [...current];
    default:
      return [...current];
  }
};
