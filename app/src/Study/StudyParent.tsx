import { inject, observer } from 'mobx-react';
import React, { FC } from 'react';

import FinalFeedback from '../Components/Study/FinalFeedback';
import { StudyActions } from '../Store/StudyStore/StudyProvenance';
import StudyStore from '../Store/StudyStore/StudyStore';
import { TaskDescription } from './TaskList';
import Tasks from './Tasks';
import Training from './Training';

type Props = {
  actions: StudyActions;
  studyStore?: StudyStore;
  trainingTasks: TaskDescription[];
  tasks: TaskDescription[];
};

const StudyParent: FC<Props> = ({
  actions,
  studyStore,
  tasks,
  trainingTasks
}: Props) => {
  const { phase } = studyStore!;

  return (function() {
    switch (phase) {
      case "Passive Training":
      case "Training Tasks":
        return <Training actions={actions} tasks={trainingTasks} />;
      case "Tasks":
        return <Tasks actions={actions} tasks={tasks} />;
      case "Final Feedback":
        return <FinalFeedback />;
      default:
        return <div>Test</div>;
    }
  })();
};

export default inject("studyStore")(observer(StudyParent));
