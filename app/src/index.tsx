import './index.css';
import 'semantic-ui-css/semantic.min.css';

import {
  initProvenanceRedux,
  initProvenance,
} from '@visdesignlab/provenance-lib-core/lib/src';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './App';
import setupFirebase from './Firebase/firebaseConfig';
import * as serviceWorker from './serviceWorker';
import PredictionStoreCreator from './Stores/Predictions/Setup/PredictionStore';
import {loadDataset} from './Stores/Visualization/Setup/DatasetRedux';
import VisualizationState from './Stores/Visualization/VisualizationState';
import VisualizationStoreCreator from './Stores/Visualization/VisualizationStore';
import {defaultStudyState, StudyState} from './Stores/Study/StudyState';
import Events from './Stores/Types/EventEnum';
import {getRandomUserCode} from './Utils';
import TaskList from './Stores/Study/TaskList';
import TaskDetails from './Stores/Types/TaskDetails';

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

export const studyProvenance = initProvenance(defaultStudyState);

// studyProvenance.addGlobalObserver(() => {
//   const currentState = studyProvenance.graph().current.state;
//   if (currentState && currentState.participant) {
//     console.log('Adding to firebase', currentState);

// });

studyProvenance.addObserver('task', ((state: any) => {
  console.log('Logged');
  const {participant} = state;
  firestore
    .collection(participant.uniqueId)
    .doc('studyData')
    .set(studyProvenance.graph(), {merge: true});

  startRender(state.task);
}) as any);

export const predictionStore = PredictionStoreCreator();

export let datasetName = 'gapminder_world';

export const getDatasetUrl = (datasetName: string) => `/dataset/${datasetName}`;

export const {config, app: firebaseApp, firestore} = setupFirebase();

export function initializeTaskManager() {
  let currentTask = 0;

  const startTask = (taskOrder: number = currentTask) => {
    studyProvenance.applyAction({
      label: Events.SET_TASK,
      action: () => {
        let currentState = studyProvenance.graph().current.state;
        if (currentState) {
          currentState = {
            ...currentState,
            task: TaskList[taskOrder],
            event: Events.SET_PARTICIPANT,
            eventTime: new Date(),
          };
        }

        return currentState as StudyState;
      },
      args: [],
    });
  };

  return {
    task: () => TaskList[currentTask],
    startCurrentTask: startTask,
    advanceTask: () => {
      if (currentTask + 1 < TaskList.length) {
        currentTask++;
        startTask();
      } else {
        console.log('Done');
      }
    },
  };
}

export const taskManager = initializeTaskManager();

axios
  .get('/dataset')
  .then(async response => {
    const datasets = response.data;
    datasetName = datasets.filter((d: string) => d.includes('gapminder'))[0];
    await loadDataset(getDatasetUrl(datasetName));

    studyProvenance.applyAction({
      label: Events.SET_PARTICIPANT,
      action: () => {
        let currentState = studyProvenance.graph().current.state;
        if (currentState) {
          currentState = {
            ...currentState,
            participant: {
              uniqueId: getRandomUserCode(),
            },
            event: Events.SET_PARTICIPANT,
            eventTime: new Date(),
          };
        }

        return currentState as StudyState;
      },
      args: [],
    });

    taskManager.startCurrentTask();
  })
  .catch(err => console.log(err));

function startRender(task: TaskDetails = null as any) {
  ReactDOM.render(
    <Provider store={predictionStore}>
      <Provider store={VisualizationStore}>
        <App task={task} />
      </Provider>
    </Provider>,
    document.getElementById('root'),
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
