import { selectAll } from 'd3';
import { inject, observer } from 'mobx-react';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Subject } from 'rxjs';
import { Card, Message, Progress } from 'semantic-ui-react';
import { style } from 'typestyle';

import { DataContext, StudyActionContext, TaskConfigContext } from '../../../Contexts';
import IntentStore from '../../../Store/IntentStore';
import { TaskDescription, TaskTypeDescription } from '../../../Study/TaskList';
import { getAllSelections, UserSelections } from '../../Predictions/PredictionRowType';
import { FADE_OUT, REFERENCE_MARK } from '../../Styles/MarkStyle';
import ButtonCoding from './ButtonCoding';
import ButtonTask from './ButtonTask';

type Props = {
  store?: IntentStore;

  taskDesc: TaskDescription;
};

export const $hideError = new Subject();
export const $showHint = new Subject<boolean>();

const TaskComponent: FC<Props> = ({ taskDesc, store }: Props) => {
  const { plots, multiBrushBehaviour } = store!;
  const { reference = [], ground = [] } = taskDesc;
  const { isManual = false, isTraining, isCoding } = useContext(
    TaskConfigContext
  );
  const [selections, setSelections] = useState<UserSelections | null>(null);
  const [trainingSubmitted, setTrainingSubmitted] = useState(false);
  const [messageSubmitted, setMessageSubmitted] = useState<
    "success" | "error" | "none"
  >("none");

  const { actions } = useContext(StudyActionContext);
  const data = useContext(DataContext);

  const successMessage = (selected: number = 0, actual: number = 0) =>
    `Well done, we have highlighted the ideal solution.`;

  const failMessage =
    "You have wrongly selected or have missed a lot of points. Please refine your selection and try again.";

  const computedSelections = getAllSelections(
    plots,
    multiBrushBehaviour === "Union"
  );

  let marks = "";
  if (reference.length > 0) marks = reference.map(d => `#mark-${d}`).join(",");
  else if (ground.length > 0) marks = ground.map(d => `#mark-${d}`).join(",");

  useEffect(() => {
    const sub2 = $hideError.subscribe(() => setMessageSubmitted("none"));
    const hintSub = $showHint.subscribe(show => {
      if (show) {
        actions.addHintLookedAt(taskDesc.id);
        selectAll(".base-mark").classed(FADE_OUT, true);
        selectAll(marks).classed(REFERENCE_MARK, true);
      } else {
        selectAll(".base-mark").classed(FADE_OUT, false);
        selectAll(marks).classed(REFERENCE_MARK, false);
      }
    });
    return () => {
      sub2.unsubscribe();
      hintSub.unsubscribe();
    };
  }, [marks]);

  if (JSON.stringify(selections) !== JSON.stringify(computedSelections))
    setSelections(computedSelections);

  const { currentTaskNumber, totalTasks, endTask } = useContext(
    StudyActionContext
  );

  function highlightMissing() {
    selectAll(".base-mark").classed(FADE_OUT, true);
    selectAll(marks)
      .classed(FADE_OUT, false)
      .classed(REFERENCE_MARK, true);
    setTrainingSubmitted(true);
  }

  function isSelectionAcceptable(): boolean {
    const base = reference.length > 0 ? reference : ground;
    const selectedPoints = selections?.values || [];

    if (selectedPoints.length === 0) return false;

    const selArr = data.values.map((_, i) =>
      selectedPoints.includes(i) ? 1 : 0
    );
    const refArr = data.values.map((_, i) => (base.includes(i) ? 1 : 0));

    if (selArr.length === 0 && refArr.length === 0) return false;

    const intersection = selArr.filter((s, i) => s === refArr[i]);

    const ji =
      intersection.length /
      (selArr.length + refArr.length - intersection.length);

    return ji >= 0.7;
  }

  function formatTask(taskDesc: TaskDescription) {
    if (taskDesc.type !== "skyline") return taskDesc.task;
    const taskList = taskDesc.task.split("||");
    return (
      <>
        {taskList.map((d, i) => (
          <p key={i}>{d}</p>
        ))}
      </>
    );
  }

  const taskTypeDesc: TaskTypeDescription = isManual
    ? "User Driven"
    : "Computer Supported";

  return (
    <div className={taskStyle}>
      <Card>
        <Card.Content textAlign="left" className={headerStyle}>
          <Card.Header className={whiteText}>{taskTypeDesc}</Card.Header>
          <Card.Meta className={`${whiteText} ${metaSize}`}>
            Task {currentTaskNumber} {isTraining && "(Training)"}
          </Card.Meta>
        </Card.Content>
        <Card.Content className={questionTextSize}>
          {formatTask(taskDesc)}
        </Card.Content>
        {messageSubmitted !== "none" && (
          <Card.Content>
            <Message
              positive={messageSubmitted === "success"}
              negative={messageSubmitted === "error"}
            >
              {messageSubmitted === "success" && (
                <Message.Content>
                  {successMessage(
                    selections?.values?.length || 0,
                    reference.length > 0 ? reference.length : ground.length
                  )}
                </Message.Content>
              )}
              {messageSubmitted === "error" && (
                <Message.Content>{failMessage}</Message.Content>
              )}
            </Message>
          </Card.Content>
        )}
        <Card.Content textAlign="center">
          {isCoding ? (
            <ButtonCoding
              disabled={!selections || selections.values.length === 0}
              values={selections?.values || []}
            />
          ) : (
            <ButtonTask
              isTraining={isTraining}
              isTrainingSubmitted={trainingSubmitted}
              isSelectionAcceptable={isSelectionAcceptable()}
              setMessageSubmitted={setMessageSubmitted}
              highlightMissing={highlightMissing}
              values={selections?.values || []}
            />
          )}
        </Card.Content>
        <Card.Content extra>
          <Progress
            value={currentTaskNumber}
            total={totalTasks}
            progress="value"
            color="blue"
          />
        </Card.Content>
      </Card>
    </div>
  );
};

export default inject("store")(observer(TaskComponent));

const taskStyle = style({
  gridArea: "question"
});

const questionTextSize = style({
  fontSize: "1.5em !important",
  textAlign: "justify"
});

const metaSize = style({
  fontSize: "0.8em !important"
});

const whiteText = style({
  color: "whitesmoke !important"
});

const headerStyle = style({
  fontSize: "1.3em !important",
  backgroundColor: "#2185d0 !important"
});
