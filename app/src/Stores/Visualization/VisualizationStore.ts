import VisualizationState from './VisualizationState';
import {
  combineReducers,
  createStore,
  applyMiddleware,
  Action,
  Reducer,
} from 'redux';
import thunk from 'redux-thunk';
import {DatasetReducer} from './Setup/DatasetRedux';
import {ParticipantDetailsReducer} from './Setup/ParticipantRedux';
import {TaskReducer} from './Setup/TaskRedux';
import {MultiBrushBehaviorReducer} from './Setup/MultiBrushRedux';
import {PlotsReducer} from './Setup/PlotsRedux';
import {InteractionsReducer} from './Setup/InteractionsRedux';

export const UPDATE_REFINE = 'UPDATE_REFINE';
export type UPDATE_REFINE = typeof UPDATE_REFINE;

export interface RefinedPoints {
  original: number[];
  added: number[];
  removed: number[];
}

export enum PointAction {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  ORIGINAL = 'ORIGINAL',
}

interface UpdateRefineAction extends Action<UPDATE_REFINE> {
  type: UPDATE_REFINE;
  args: {
    points: number[];
    action: PointAction;
  };
}

export const updateRefinedSet = (points: number[], action: PointAction) => ({
  type: UPDATE_REFINE,
  args: {
    points,
    action,
  },
});

export const RefinedPointsReducer: Reducer<
  RefinedPoints,
  UpdateRefineAction
> = (
  current: RefinedPoints = {
    original: [],
    added: [],
    removed: [],
  },
  action: UpdateRefineAction,
) => {
  switch (action.type) {
    case UPDATE_REFINE:
      let {original, added, removed} = current;

      switch (action.args.action) {
        case PointAction.ADD:
          removed = removed.filter(r => !action.args.points.includes(r));
          added = [...new Set([...added, ...action.args.points])];
          break;
        case PointAction.REMOVE:
          added = added.filter(r => !action.args.points.includes(r));
          removed = [...new Set([...removed, ...action.args.points])];
          break;
        case PointAction.ORIGINAL:
          original = [...new Set([...original, ...action.args.points])];
          break;
        default:
          break;
      }

      console.log(original, added, removed);

      return {
        original: [...original],
        added: [...added],
        removed: [...removed],
      };
    default:
      return current;
  }
};

export const VisualizationReducer = combineReducers<VisualizationState>({
  dataset: DatasetReducer,
  participant: ParticipantDetailsReducer,
  task: TaskReducer,
  multiBrushBehaviour: MultiBrushBehaviorReducer,
  plots: PlotsReducer,
  interactions: InteractionsReducer,
  refinedPoints: RefinedPointsReducer,
});

function VisualizationStoreCreator(state?: Partial<VisualizationState>) {
  return createStore<VisualizationState, any, any, any>(
    VisualizationReducer,
    state,
    applyMiddleware(thunk),
  );
}
export default VisualizationStoreCreator;
