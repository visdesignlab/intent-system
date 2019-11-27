import {combineReducers, createStore, applyMiddleware} from 'redux';
import {VisualizationReducer} from './Visualization/VisualizationStore';
import {PredictionReducer} from './Predictions/Setup/PredictionStore';
import {PredictionState} from './Predictions/PredictionsState';
import VisualizationState from './Visualization/VisualizationState';
import thunk from 'redux-thunk';

export interface AppState {
  visualization: VisualizationState;
  prediction: PredictionState;
}

export type AppStore = AppState;

const combinedReducer = combineReducers<AppState>({
  visualization: VisualizationReducer,
  prediction: PredictionReducer,
});

export function combinedVisPredStore(state?: any) {
  return createStore<AppStore, any, any, any>(
    combinedReducer,
    state,
    applyMiddleware(thunk),
  );
}
