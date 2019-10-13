import './index.css';
import 'semantic-ui-css/semantic.min.css';
import axios from 'axios';
import {initProvenanceRedux} from '@visdesignlab/provenance-lib-core/lib/src';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import * as serviceWorker from './serviceWorker';
import App from './App';
import {loadDataset2} from './Stores/Visualization/Setup/DatasetRedux';
import VisualizationStoreCreator from './Stores/Visualization/VisualizationStore';
import VisualizationState from './Stores/Visualization/VisualizationState';

export const VisualizationStore = VisualizationStoreCreator();
export const VisualizationProvenance = initProvenanceRedux<VisualizationState>(
  VisualizationStore,
  (_: any) => {},
);
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
    datasetName = datasets.filter((d: string) => d.includes('gapminder'))[0];
    loadDataset2(getDatasetUrl(datasetName));
    //VisualizationStore.dispatch(loadDataset(getDatasetUrl(datasetName)));
  })
  .catch(err => console.log(err));

ReactDOM.render(
  <Provider store={VisualizationStore}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
