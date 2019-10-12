import './index.css';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import {initProvenanceRedux} from '@visdesignlab/provenance-lib-core/lib/src';
import React from 'react';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import * as serviceWorker from './serviceWorker';
import App from './App';
import {
  loadDataset,
  DatasetReducer,
} from './Stores/Visualization/Dataset/Types';
import {combineReducers, createStore, applyMiddleware} from 'redux';
import VisualizationState from './Stores/Visualization/VisualizationState';

export const VisualizationReducer = combineReducers<VisualizationState>({
  dataset: DatasetReducer as any,
});

export const VisualizationStore = createStore<
  VisualizationState,
  any,
  any,
  any
>(VisualizationReducer, applyMiddleware(thunk));

export const datasets = [
  'draft_combine',
  'slc_housing',
  'nba_players',
  'gapminder_world',
];

export let datasetName = 'gapminder_world';

export const getDatasetUrl = (datasetName: string) => `/dataset/${datasetName}`;

axios
  .get('/dataset')
  .then(response => {
    const datasets = response.data;

    const defaultDataset = datasets.filter((d: string) =>
      d.includes('gapminder'),
    )[0];
    console.log(defaultDataset);
    VisualizationStore.dispatch(loadDataset(getDatasetUrl(defaultDataset)));
  })
  .catch(err => console.log(err));

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
