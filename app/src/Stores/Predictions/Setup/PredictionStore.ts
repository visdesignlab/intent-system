import {PredictionState} from '../PredictionsState';
import {PredictionsReducer} from './PredictionRedux';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {HideZeroPredictionsReducer} from './HideZeroPredictionsReducer';
import {PredictionLoadingReducer} from './PredictionLoadingRedux';

function PredictionStoreCreator(state?: PredictionState) {
  const PredictionReducer = combineReducers<PredictionState>({
    predictionSet: PredictionsReducer,
    hideZeroPredictions: HideZeroPredictionsReducer,
    isLoading: PredictionLoadingReducer,
  });

  return createStore<PredictionState, any, any, any>(
    PredictionReducer,
    state,
    applyMiddleware(thunk),
  );
}

export default PredictionStoreCreator;
