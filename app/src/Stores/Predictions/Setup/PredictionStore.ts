import {PredictionState} from '../PredictionsState';
import {PredictionsReducer} from './PredictionRedux';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

function PredictionStoreCreator(state?: PredictionState) {
  const PredictionReducer = combineReducers<PredictionState>({
    predictionSet: PredictionsReducer,
  });

  return createStore<PredictionState, any, any, any>(
    PredictionReducer,
    state,
    applyMiddleware(thunk),
  );
}

export default PredictionStoreCreator;
