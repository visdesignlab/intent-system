import './index.css';
import 'semantic-ui-css/semantic.min.css';

import { initProvenanceRedux } from '@visdesignlab/provenance-lib-core/lib/src';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App';
import setupFirebase from './Firebase/firebaseConfig';
import * as serviceWorker from './serviceWorker';
import PredictionStoreCreator from './Stores/Predictions/Setup/PredictionStore';
import { loadDataset } from './Stores/Visualization/Setup/DatasetRedux';
import VisualizationState from './Stores/Visualization/VisualizationState';
import VisualizationStoreCreator from './Stores/Visualization/VisualizationStore';

test();

export const VisualizationStore = VisualizationStoreCreator();
export const VisualizationProvenance = initProvenanceRedux<VisualizationState>(
  VisualizationStore,
  (_: any) => {}
);
export const datasets = [
  "draft_combine",
  "slc_housing",
  "nba_players",
  "gapminder_world"
];

export const predictionStore = PredictionStoreCreator();

export let datasetName = "gapminder_world";

export const getDatasetUrl = (datasetName: string) => `/dataset/${datasetName}`;

export const { config, app: firebaseApp, firestore } = setupFirebase();

firestore
  .collection("test")
  .doc("Hello")
  .set(config, { merge: true });

axios
  .get("/dataset")
  .then(async response => {
    const datasets = response.data;
    datasetName = datasets.filter((d: string) => d.includes("gapminder"))[0];
    await loadDataset(getDatasetUrl(datasetName));
    startRender();
  })
  .catch(err => console.log(err));

function startRender() {
  ReactDOM.render(
    <Provider store={predictionStore}>
      <Provider store={VisualizationStore}>
        <App />
      </Provider>
    </Provider>,
    document.getElementById("root")
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
