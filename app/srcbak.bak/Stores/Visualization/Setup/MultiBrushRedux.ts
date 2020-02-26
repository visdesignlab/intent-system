import {Action, Reducer} from 'redux';
import {MultiBrushBehavior} from '../../../contract';
import {getPredictionAfterBrushSwitch} from './InteractionsRedux';

export const CHANGE_BRUSH_BEHAVIOR = 'CHANGE_BRUSH_BEHAVIOR';
export type CHANGE_BRUSH_BEHAVIOR = typeof CHANGE_BRUSH_BEHAVIOR;

interface MultiBrushBehaviorChangeAction extends Action<CHANGE_BRUSH_BEHAVIOR> {
  type: CHANGE_BRUSH_BEHAVIOR;
  args: MultiBrushBehavior;
}

export const updateBrushBehavior = (brushBehavior: MultiBrushBehavior) => ({
  type: CHANGE_BRUSH_BEHAVIOR,
  args: brushBehavior,
});

export const MultiBrushBehaviorReducer: Reducer<
  MultiBrushBehavior,
  MultiBrushBehaviorChangeAction
> = (
  current: MultiBrushBehavior = MultiBrushBehavior.UNION,
  action: MultiBrushBehaviorChangeAction,
) => {
  switch (action.type) {
    case CHANGE_BRUSH_BEHAVIOR:
      getPredictionAfterBrushSwitch(action.args);
      return action.args;
    default:
      return current;
  }
};