import VisualizationState from './VisualizationState';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {DatasetReducer} from './Setup/DatasetRedux';
import {ParticipantDetailsReducer} from './Setup/ParticipantRedux';
import {TaskReducer} from './Setup/TaskRedux';
import {MultiBrushBehaviorReducer} from './Setup/MultiBrushRedux';
import {PlotsReducer} from './Setup/PlotsRedux';
import {InteractionsReducer} from './Setup/InteractionsRedux';

export const VisualizationReducer = combineReducers<VisualizationState>({
  dataset: DatasetReducer,
  participant: ParticipantDetailsReducer,
  task: TaskReducer,
  multiBrushBehaviour: MultiBrushBehaviorReducer,
  plots: PlotsReducer,
  interactions: InteractionsReducer,
});

function VisualizationStoreCreator(state?: Partial<VisualizationState>) {
  return createStore<VisualizationState, any, any, any>(
    VisualizationReducer,
    state,
    applyMiddleware(thunk),
  );
}
export default VisualizationStoreCreator;
