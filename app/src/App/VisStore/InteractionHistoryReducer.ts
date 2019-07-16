import { Action, Reducer } from "redux";
import { Interaction, InteractionHistory } from "@visdesignlab/intent-contract";

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
      return [...current];
    default:
      return [...current];
  }
};
