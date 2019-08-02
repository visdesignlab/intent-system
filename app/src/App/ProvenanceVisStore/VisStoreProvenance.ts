import { Store, applyMiddleware, createStore } from "redux";

import { DatasetReducer } from "../VisStore/DatasetReducers";
import { InteractionHistoryReducer } from "../VisStore/InteractionHistoryReducer";
import { VisualizationReducer } from "../VisStore/VisualizationReducer";
import { VisualizationState } from "../VisStore/VisualizationState";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { PredictionActionReducer } from "../VisStore/PredictionsReducer";

export function initVisStoreWithProvenance() {
  let store = initVisStore();
  return {
    visStore: () => store,
    resetStore: (state: VisualizationState) => (store = initVisStore(state))
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
    predictions: PredictionActionReducer
  });
};
