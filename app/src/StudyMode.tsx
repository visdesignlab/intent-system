import { ProvenanceGraph } from "@visdesignlab/provenance-lib-core";
import { Provider } from "mobx-react";
import React, { FC, useState } from "react";

import { useConfig } from ".";
import { ConfigContext } from "./Contexts";
import {
  setupStudy,
  StudyProvenanceControl,
} from "./Store/StudyStore/StudyProvenance";
import StudyStore from "./Store/StudyStore/StudyStore";
import StudyParent from "./Study/StudyParent";
import { getAllTasks } from "./Study/TaskList";

type Props = {};

function usePreventRedirection(shouldPrevent: boolean) {
  if (shouldPrevent)
    window.onbeforeunload = function() {
      return "If you go back or refresh, you will have to start the study again from the beginning. Are you sure you want to proceed?";
    };
}

export type EndTaskFunction = (
  points: number[],
  graph: ProvenanceGraph<any, any, any>,
  confidenceScore: number,
  difficultyScore: number,
  feedback: string
) => void;

const store = new StudyStore();

const StudyMode: FC<Props> = () => {
  const config = useConfig();
  usePreventRedirection(!config.debugMode);
  const { trainingCS, trainingManual, taskCS, taskManual } = getAllTasks(
    config
  );

  const { studyActions } = useState<StudyProvenanceControl>(() =>
    setupStudy(config, store)
  )[0];

  return (
    <Provider studyStore={store}>
      <ConfigContext.Provider value={config}>
        <StudyParent
          actions={studyActions}
          trainingCS={trainingCS}
          trainingManual={trainingManual}
          taskCS={taskCS}
          taskManual={taskManual}
        />
      </ConfigContext.Provider>
    </Provider>
  );
};

export default StudyMode;
