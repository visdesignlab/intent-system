import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';

import { DatasetReducer } from '../VisStore/DatasetReducers';
import { InteractionHistoryReducer } from '../VisStore/InteractionHistoryReducer';
import { MultiBrushBehaviorReducer } from '../VisStore/MultiBrushBehaviorReducer';
import { PredictionActionReducer } from '../VisStore/PredictionsReducer';
import { VisualizationReducer } from '../VisStore/VisualizationReducer';
import { VisualizationState } from '../VisStore/VisualizationState';

export function initVisStoreWithProvenance() {
  let store = initVisStore();
  return {
    visStore: () => store,
    resetStore: (state?: VisualizationState) =>
      (store = state ? initVisStore(state) : initVisStore())
  };
}

const initVisStore = (
  state?: VisualizationState
): Store<VisualizationState> => {
  if (state) return createStore(reducer(), state, applyMiddleware(thunk));
  else return createStore(reducer(), applyMiddleware(thunk));
};

const reducer = () => {
  return combineReducers<VisualizationState>({
    dataset: DatasetReducer,
    visualization: VisualizationReducer,
    interactions: InteractionHistoryReducer,
    predictionSet: PredictionActionReducer,
    mutliBrushBehavior: MultiBrushBehaviorReducer
  });
};
