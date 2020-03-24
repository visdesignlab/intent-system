import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';
import { Provider } from 'mobx-react';
import React, { FC, useState } from 'react';

import { AppConfig } from './AppConfig';
import { ConfigContext } from './Contexts';
import { setupStudy, StudyProvenanceControl } from './Store/StudyStore/StudyProvenance';
import StudyStore from './Store/StudyStore/StudyStore';
import StudyParent from './Study/StudyParent';
import { TaskDescription } from './Study/TaskList';

type Props = {
  trainingTasks: TaskDescription[];
  tasks: TaskDescription[];
  config: AppConfig;
};

export type EndTaskFunction = (
  points: number[],
  graph: ProvenanceGraph<any, any, any>,
  confidenceScore: number,
  difficultyScore: number,
  feedback: string
) => void;

const store = new StudyStore();

const StudyMode: FC<Props> = ({ trainingTasks, tasks, config }: Props) => {
  const { studyActions } = useState<StudyProvenanceControl>(() =>
    setupStudy(config, store)
  )[0];

  return (
    <Provider studyStore={store}>
      <ConfigContext.Provider value={config}>
        <StudyParent
          actions={studyActions}
          trainingTasks={trainingTasks}
          tasks={tasks}
        />
      </ConfigContext.Provider>
    </Provider>
  );
};

export default StudyMode;
