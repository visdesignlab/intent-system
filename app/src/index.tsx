import './index.css';
import 'semantic-ui-css/semantic.min.css';

import {
  initProvenanceRedux,
  initProvenance,
} from '@visdesignlab/provenance-lib-core/lib/src';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import App from './App';
import setupFirebase from './Firebase/firebaseConfig';
import * as serviceWorker from './serviceWorker';

import {loadDataset} from './Stores/Visualization/Setup/DatasetRedux';
import {defaultStudyState, StudyState} from './Stores/Study/StudyState';
import Events from './Stores/Types/EventEnum';
import {getRandomUserCode} from './Utils';
import TaskList from './Stores/Study/TaskList';
import TaskDetails from './Stores/Types/TaskDetails';
import ParticipantDetails from './Stores/Types/ParticipantDetails';
import {combinedVisPredStore, AppState} from './Stores/CombinedStore';

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');

  whyDidYouRender(React, {
    // exclude: [],
    exclude: [/^Switch/, /^Router/, /^Route/, /^Connect/],
  });
}

export let AppStore = combinedVisPredStore();

export let AppProvenance = initProvenanceRedux<AppState>(AppStore, _ => {});

export const studyProvenance = initProvenance(defaultStudyState);

export const getDatasetUrl = (datasetName: string) => `/dataset/${datasetName}`;

export const {config, app: firebaseApp, firestore} = setupFirebase();

export let participant: ParticipantDetails = {
  uniqueId: getRandomUserCode(),
};

console.log(participant.uniqueId);

let isExploreMode = true;

if (window.location.href.includes('#')) {
  const uniqueId = window.location.href.split('#')[1];
  if (uniqueId === 'explorer') isExploreMode = true;
  participant.uniqueId = `${participant.uniqueId}-${uniqueId}`;
}

const logToFirebase = () => {
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
          list,
        });

      firestore
        .collection(participant.uniqueId)
        .doc('studyData')
        .set(
          {graphString: JSON.stringify(studyProvenance.graph())},
          {merge: true},
        );
    })
    .catch(err => {
      console.error(err);
      // throw new Error('Cannot log!');
    });
};

studyProvenance.addObserver('interactions', () => {
  logToFirebase();
});

studyProvenance.addObserver('task', ((state: any) => {
  logToFirebase();
  startRender(state.task);
}) as any);

studyProvenance.addObserver('selectedPrediction', (() => {
  logToFirebase();
}) as any);

export function initializeTaskManager() {
  let currentTask = 1;

  const startTask = (taskOrder: number = currentTask) => {
    const t = new Date();
    studyProvenance.applyAction({
      label: Events.SET_TASK,
      action: () => {
        let currentState = studyProvenance.graph().current.state;
        if (currentState) {
          currentState = {
            ...currentState,
            task: TaskList.find(t => t.order === taskOrder) || {
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
        startTask(currentTask);
      } else {
        console.log('Done');
      }
    },
  };
}

export const taskManager = initializeTaskManager();

export let datasetName = 'depression_dataset';

export async function loadDatasetByName(ds: string = datasetName) {
  if (datasetName !== ds) datasetName = ds;
  startRender();
}

startRender();

async function startRender(task: TaskDetails = TaskList[0]) {
  AppStore = combinedVisPredStore();
  AppProvenance = initProvenanceRedux<AppState>(AppStore, _ => {});

  await loadDataset(getDatasetUrl(datasetName));

  ReactDOM.render(
    <Provider store={AppStore}>
      <App key={task.order} task={task} isExploreMode={isExploreMode} />
    </Provider>,
    document.getElementById('root'),
  );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
