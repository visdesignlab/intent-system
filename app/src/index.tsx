import './index.css';
import 'semantic-ui-css/semantic.min.css';

import { initProvenanceRedux } from '@visdesignlab/provenance-lib-core/lib/src';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from './App/App';
import { initVisStoreWithProvenance } from './App/ProvenanceVisStore/VisStoreProvenance';
import { loadDataset } from './App/VisStore/DatasetReducers';
import { InteractionHistoryActions } from './App/VisStore/InteractionHistoryReducer';
import * as serviceWorker from './serviceWorker';
import { initStudyStore, StudyState } from './StudyStore/StudyStore';

// import { VisualizationType } from "@visdesignlab/intent-contract";
function initAppStore() {
  let store = initStudyStore();
  return {
    store: () => store,
    resetStore: (state?: StudyState) =>
      (store = state ? initStudyStore(state) : initStudyStore())
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

export const datasets = ["draft_combine", "slc_housing", "nba_players"];

// export const datasetName = "draft_combine";
export let datasetName = "draft_combine";
// export const datasetName = "nba_players";

VisStore.visStore().dispatch(loadDataset(`/dataset/${datasetName}`) as any);

export function changeDataset(dsName: string) {
  if (datasetName === dsName) return;
  datasetName = dsName;
  VisStore.visStore().dispatch({
    type: InteractionHistoryActions.RESET_HISTORY,
    args: {
      multiBrushBehavior: VisStore.visStore().getState().mutliBrushBehavior
    }
  });
  VisStore.visStore().dispatch(loadDataset(`/dataset/${datasetName}`) as any);
}

function renderApp() {
  ReactDOM.render(
    <Provider store={studyStore.store()}>
      <Provider store={VisStore.visStore()}>
        <App />
      </Provider>
    </Provider>,
    document.getElementById("root")
  );
}

renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
