import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';
import { inject, observer } from 'mobx-react';
import React, { FC, useEffect, useState } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import { StudyActionContext } from '../Contexts';
import { StudyActions } from '../Store/StudyStore/StudyProvenance';
import StudyStore from '../Store/StudyStore/StudyStore';
import StudyApp from '../StudyApp';
import { TaskDescription } from './TaskList';

type Props = {
  studyStore?: StudyStore;
  tasks: TaskDescription[];
  actions: StudyActions;
};

const Tasks: FC<Props> = ({ studyStore, tasks, actions }: Props) => {
  const [taskId, setTaskId] = useState<number>(0);
  const { loading = false } = studyStore!;

  useEffect(() => {
    if (taskId !== -1) actions.startTask(tasks[taskId].id);
    else actions.nextPhase("Final Feedback");
  }, [actions, taskId, tasks]);

  function advanceTask() {
    const isLast = taskId === tasks.length - 1;
    if (isLast) setTaskId(-1);
    else setTaskId(taskId + 1);
  }

  function endTask(
    points: number[],
    graph: ProvenanceGraph<any, any, any>,
    confidenceScore: number,
    difficultyScore: number,
    feedback: string
  ) {
    actions.endTask(
      tasks[taskId].id,
      points,
      graph,
      confidenceScore,
      difficultyScore,
      feedback
    );
    advanceTask();
  }

  if (taskId === -1) return null;

  return (
    <StudyActionContext.Provider
      value={{
        endTask,
        currentTaskNumber: taskId + 1,
        totalTasks: tasks.length
      }}
    >
      <StudyApp key={taskId} task={tasks[taskId]} studyActions={actions} />
      {loading && (
        <Dimmer active>
          <Loader active size="massive">
            Loading Task
          </Loader>
        </Dimmer>
      )}
    </StudyActionContext.Provider>
  );
};

export default inject("studyStore")(observer(Tasks));
