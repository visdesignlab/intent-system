import { inject, observer } from 'mobx-react';
import React, { FC, useEffect, useState } from 'react';
import { MemoryRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Form } from 'semantic-ui-react';
import { style } from 'typestyle';

import { currTime } from '..';
import Consent from '../Components/Study/Consent';
import FinalFeedback from '../Components/Study/FinalFeedback/FinalFeedback';
import { StudyActions } from '../Store/StudyStore/StudyProvenance';
import { Phase } from '../Store/StudyStore/StudyState';
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

  const manualFirst = (currTime % 10) % 2 === 0;

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

  const manual = {
    phase: "Tasks - Manual" as Phase,
    url: "/taskm"
  };

  const supported = {
    phase: "Tasks - CS" as Phase,
    url: "/taskcs"
  };

  return (
    <MemoryRouter initialEntries={["/taskm"]}>
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
            nextPhase={manualFirst ? manual.phase : supported.phase}
            nextUrl={manualFirst ? manual.url : supported.url}
          />
        </Route>
        <Route path={"/taskm"}>
          <Tasks
            key={"Manual"}
            actions={actions}
            tasks={taskManual}
            nextPhase={manualFirst ? supported.phase : "Final Feedback"}
            nextUrl={manualFirst ? supported.url : "/finalfeedback"}
          />
        </Route>
        <Route path={"/taskcs"}>
          <Tasks
            key={"Supported"}
            actions={actions}
            tasks={taskCS}
            nextPhase={manualFirst ? "Final Feedback" : manual.phase}
            nextUrl={manualFirst ? "/finalfeedback" : manual.url}
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
