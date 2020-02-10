import {PredictionState} from '../PredictionsState';
import {PredictionsReducer} from './PredictionRedux';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {HideZeroPredictionsReducer} from './HideZeroPredictionsReducer';
import {PredictionLoadingReducer} from './PredictionLoadingRedux';

export const PredictionReducer = combineReducers<PredictionState>({
  predictionSet: PredictionsReducer,
  hideZeroPredictions: HideZeroPredictionsReducer,
  isLoading: PredictionLoadingReducer,
});

function PredictionStoreCreator(state?: PredictionState) {
  return createStore<PredictionState, any, any, any>(
    PredictionReducer,
    state,
    applyMiddleware(thunk),
  );
}

export default PredictionStoreCreator;
