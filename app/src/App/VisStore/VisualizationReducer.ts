import { MultiBrushBehavior, VisualizationType } from '@visdesignlab/intent-contract';
import { Action, Reducer } from 'redux';

import { VisStore } from './../..';
import { InteractionHistoryActions } from './InteractionHistoryReducer';

export enum VisualizationChangeActions {
  CHANGE_VISUALIZATION = "CHANGE_VISUALIZATION"
}

interface VisualizationChangeActionArgument {
  visType: VisualizationType;
  multiBrushBehavior: MultiBrushBehavior;
}

export interface VisualizationChangeAction
  extends Action<VisualizationChangeActions> {
  type: VisualizationChangeActions;
  args: VisualizationChangeActionArgument;
}

export const VisualizationReducer: Reducer<
  VisualizationType,
  VisualizationChangeAction
> = (
  current: VisualizationType = VisualizationType.ParallelCoordinatePlot,
  action: VisualizationChangeAction
) => {
  switch (action.type) {
    case VisualizationChangeActions.CHANGE_VISUALIZATION:
      setTimeout(() => {
        VisStore.visStore().dispatch({
          type: InteractionHistoryActions.RESET_HISTORY,
          args: {
            multiBrushBehavior: action.args.multiBrushBehavior
          }
        });
      });
      return action.args.visType;
    default:
      return current;
  }
};
