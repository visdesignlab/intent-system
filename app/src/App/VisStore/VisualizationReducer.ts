import { Action, Reducer } from "redux";

import { VisualizationType } from "@visdesignlab/intent-contract/";

export enum VisualizationChangeActions {
  CHANGE_VISUALIZATION = "CHANGE_VISUALIZATION"
}

export interface VisualizationChangeAction
  extends Action<VisualizationChangeActions> {
  type: VisualizationChangeActions;
  args: VisualizationType;
}

export const VisualizationReducer: Reducer<
  VisualizationType,
  VisualizationChangeAction
> = (
  current: VisualizationType = VisualizationType.ScatterPlot,
  action: VisualizationChangeAction
) => {
  switch (action.type) {
    case VisualizationChangeActions.CHANGE_VISUALIZATION:
      return action.args;
    default:
      return current;
  }
};
