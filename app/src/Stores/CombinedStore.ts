import {combineReducers, createStore, applyMiddleware} from 'redux';
import {PredictionState} from './Predictions/PredictionsState';
import VisualizationState from './Visualization/VisualizationState';
import thunk from 'redux-thunk';
import {DatasetReducer} from './Visualization/Setup/DatasetRedux';
import {ParticipantDetailsReducer} from './Visualization/Setup/ParticipantRedux';
import {TaskReducer} from './Visualization/Setup/TaskRedux';
import {MultiBrushBehaviorReducer} from './Visualization/Setup/MultiBrushRedux';
import {PlotsReducer} from './Visualization/Setup/PlotsRedux';
import {InteractionsReducer} from './Visualization/Setup/InteractionsRedux';
import {PredictionsReducer} from './Predictions/Setup/PredictionRedux';
import {HideZeroPredictionsReducer} from './Predictions/Setup/HideZeroPredictionsReducer';
import {PredictionLoadingReducer} from './Predictions/Setup/PredictionLoadingRedux';
import {RefinedPointsReducer} from './Visualization/VisualizationStore';

export type AppState = VisualizationState & PredictionState;

const combinedReducer = combineReducers<AppState>({
  dataset: DatasetReducer,
  participant: ParticipantDetailsReducer,
  task: TaskReducer,
  multiBrushBehaviour: MultiBrushBehaviorReducer,
  plots: PlotsReducer,
  interactions: InteractionsReducer,
  predictionSet: PredictionsReducer,
  hideZeroPredictions: HideZeroPredictionsReducer,
  isLoading: PredictionLoadingReducer,
  refinedPoints: RefinedPointsReducer,
});

export function combinedVisPredStore(state?: any) {
  return createStore<AppState, any, any, any>(
    combinedReducer,
    state,
    applyMiddleware(thunk),
  );
}
