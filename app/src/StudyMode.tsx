import React, { FC, useState, useEffect } from "react";
import { TaskDescription } from "./Study/TaskList";
import StudyApp from "./StudyApp";
import {
  setupStudy,
  StudyProvenanceControl
} from "./Store/StudyStore/StudyProvenance";
import { StudyActionContext } from "./Contexts";
import { ProvenanceGraph } from "@visdesignlab/provenance-lib-core";
import { AppConfig } from "./AppConfig";
import FinalFeedback from "./Components/Study/FinalFeedback";

type Props = {
  tasks: TaskDescription[];
  config: AppConfig;
};

const StudyMode: FC<Props> = ({ tasks, config }: Props) => {
  const [currentTaskId, setCurrentTaskId] = useState<number>(0);
  const { studyActions } = useState<StudyProvenanceControl>(() =>
    setupStudy(config)
  )[0];

  const studyDone = currentTaskId === -1;

  useEffect(() => {
    if (currentTaskId !== -1) studyActions.startTask(tasks[currentTaskId].id);
    else studyActions.completeStudy();
  }, [currentTaskId, tasks, studyActions]);

  function advanceTask() {
    const isLast = currentTaskId === tasks.length - 1;
    if (isLast) setCurrentTaskId(-1);
    else setCurrentTaskId(currentTaskId + 1);
  }

  function endTask(
    points: number[],
    graph: ProvenanceGraph<any, any, any>,
    confidenceScore: number,
    difficultyScore: number,
    feedback: string
  ) {
    studyActions.endTask(
      tasks[currentTaskId].id,
      points,
      graph,
      confidenceScore,
      difficultyScore,
      feedback
    );
    advanceTask();
  }

  return (
    <StudyActionContext.Provider
      value={{
        endTask,
        currentTaskNumber: currentTaskId + 1,
        totalTasks: tasks.length
      }}
    >
      {studyDone ? (
        <FinalFeedback />
      ) : (
        <StudyApp key={currentTaskId} task={tasks[currentTaskId]} />
      )}
    </StudyActionContext.Provider>
  );
};

export default StudyMode;
