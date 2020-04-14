import { inject, observer } from 'mobx-react';
import React, { FC, useEffect, useState } from 'react';
import { MemoryRouter, Redirect, Route, Switch } from 'react-router-dom';
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
  trainingCS: TaskDescription[];
  trainingManual: TaskDescription[];
  taskManual: TaskDescription[];
  taskCS: TaskDescription[];
};

const StudyParent: FC<Props> = ({
  actions,
  studyStore,
  taskCS,
  taskManual,
  trainingCS,
  trainingManual
}: Props) => {
  const { hintUsedForTasks } = studyStore!;
  const [stopStudy, setStopStudy] = useState(false);

  const hintCount = hintUsedForTasks.length;

  useEffect(() => {
    if (hintCount > 4) setStopStudy(true);
  }, [hintCount]);

  if (stopStudy) {
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

  return (
    <MemoryRouter initialEntries={["/finalfeedback"]}>
      <Switch>
        <Route path={`/consent`}>
          <Consent actions={actions} />
        </Route>
        <Route path={`/video`}>
          <Video actions={actions} />
        </Route>
        <Route path={"/trainingm"}>
          <Training
            key={"Manual"}
            actions={actions}
            tasks={trainingManual}
            nextPhase="Training - CS"
            nextUrl="/trainingcs"
          />
        </Route>
        <Route path={"/trainingcs"}>
          <Training
            key={"Supported"}
            actions={actions}
            tasks={trainingCS}
            nextPhase="Tasks - Manual"
            nextUrl="/taskm"
          />
        </Route>
        <Route path={"/taskm"}>
          <Tasks
            key={"Manual"}
            actions={actions}
            tasks={taskManual}
            nextPhase="Final Feedback"
            nextUrl="/taskcs"
          />
        </Route>
        <Route path={"/taskcs"}>
          <Tasks
            key={"Supported"}
            actions={actions}
            tasks={taskCS}
            nextPhase="Tasks - CS"
            nextUrl="/finalfeedback"
          />
        </Route>
        <Route path="/finalfeedback">
          <FinalFeedback actions={actions} />;
        </Route>
        <Route exact path="/">
          <Redirect to="/consent" />
        </Route>
      </Switch>
    </MemoryRouter>
  );
};

export default inject("studyStore")(observer(StudyParent));

const finalFeedbackStyle = style({
  height: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});
