import "./index.css";
import "semantic-ui-css/semantic.min.css";

import * as serviceWorker from "./serviceWorker";

import { StudyState, initStudyStore } from "./StudyStore/StudyStore";

import App from "./App/App";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom";
import { VisualizationType } from "@visdesignlab/intent-contract";
import { initProvenanceRedux } from "@visdesignlab/provenance-lib-core/lib/src";
import { initVisStoreWithProvenance } from "./App/ProvenanceVisStore/VisStoreProvenance";
import { loadDataset } from "./App/VisStore/DatasetReducers";

function initAppStore() {
  let store = initStudyStore();
  return {
    store: () => store,
    resetStore: (state: StudyState) => (store = initStudyStore(state))
  };
}

const studyStore = initAppStore();

export const StudyProvenance = initProvenanceRedux(
  studyStore.store(),
  studyStore.resetStore
);

export const VisStore = initVisStoreWithProvenance();

export const VisProvenance = initProvenanceRedux(
  VisStore.visStore(),
  VisStore.resetStore
);

export const datasetName = "draft_combine";
// export const datasetName = "slc_housing";
// export const datasetName = "nba_players";

VisStore.visStore().dispatch(loadDataset(`/dataset/${datasetName}`) as any);

ReactDOM.render(
  <Provider store={studyStore.store()}>
    <Provider store={VisStore.visStore()}>
      <App />
    </Provider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
