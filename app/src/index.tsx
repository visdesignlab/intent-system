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
import ParticipantDetails from './Stores/Types/ParticipantDetails';

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

export const predictionStore = PredictionStoreCreator();

export let datasetName = 'gapminder_world';

export const getDatasetUrl = (datasetName: string) => `/dataset/${datasetName}`;

export const {config, app: firebaseApp, firestore} = setupFirebase();

export const participant: ParticipantDetails = {
  uniqueId: getRandomUserCode(),
};

const logToFirebase = () => {
  console.log('Logged');
  const masterList = firestore.collection('master').doc('list');

  masterList
    .get()
    .then(doc => {
      let list: {[key: string]: number} = {};
      if (doc.exists) {
        list = (doc.data() as any).list;
      }

      list[participant.uniqueId] = list[participant.uniqueId]
        ? list[participant.uniqueId] + 1
        : 1;

      firestore
        .collection('master')
        .doc('list')
        .set({
          list: list,
        });

      firestore
        .collection(participant.uniqueId)
        .doc('studyData')
        .set(studyProvenance.graph(), {merge: true});
    })
    .catch(err => {
      console.error(err);
      throw new Error('Cannot log!');
    });
};

studyProvenance.addObserver('interactions', () => {
  logToFirebase();
});

studyProvenance.addObserver('task', ((state: any) => {
  logToFirebase();
  startRender(state.task);
}) as any);

export function initializeTaskManager() {
  let currentTask = 4;

  const startTask = (taskOrder: number = currentTask) => {
    const t = new Date();
    studyProvenance.applyAction({
      label: Events.SET_TASK,
      action: () => {
        let currentState = studyProvenance.graph().current.state;
        if (currentState) {
          currentState = {
            ...currentState,
            task: TaskList.find(t => t.order === currentTask) || {
              taskId: -1,
              order: -1,
              text: 'Something went wrong!',
            },
            event: Events.SET_TASK,
            startTime: t,
            eventTime: t,
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
              uniqueId: participant.uniqueId,
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
