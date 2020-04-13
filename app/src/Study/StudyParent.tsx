import { inject, observer } from 'mobx-react';
import React, { FC } from 'react';
import { Form } from 'semantic-ui-react';
import { style } from 'typestyle';

import Consent from '../Components/Study/Consent';
import FinalFeedback from '../Components/Study/FinalFeedback/FinalFeedback';
import { StudyActions } from '../Store/StudyStore/StudyProvenance';
import StudyStore from '../Store/StudyStore/StudyStore';
import { TaskDescription } from './TaskList';
import Tasks from './Tasks';
import Training from './Training';
import Video from './Video';

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
  const { phase, hintUsedForTasks } = studyStore!;

  if (phase === "Tasks - CS" && hintUsedForTasks.length > 3) {
    return (
      <div className={finalFeedbackStyle}>
        <Form>
          <Form.Field>
            Thank you for participating. However you do not qualify for the
            study.
          </Form.Field>
        </Form>
      </div>
    );
  }

  const component = function() {
    switch (phase) {
      case "Consent":
        return <Consent actions={actions} />;
      case "Video":
        return <Video actions={actions} />;
      case "Training - CS":
        return <Training actions={actions} tasks={trainingTasks} />;
      case "Training - Manual":
        return <Training actions={actions} tasks={trainingTasks} />;
      case "Tasks - CS":
        return <Tasks actions={actions} tasks={tasks} />;
      case "Tasks - Manual":
        return <Tasks actions={actions} tasks={tasks} />;
      case "Final Feedback":
        return <FinalFeedback actions={actions} />;
      default:
        return <div>Test</div>;
    }
  };

  return component();
};

export default inject("studyStore")(observer(StudyParent));

const finalFeedbackStyle = style({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});
