import { inject, observer } from 'mobx-react';
import React, { FC, useContext, useState } from 'react';
import { Button, Card, Divider, Icon, Message } from 'semantic-ui-react';

import { ProvenanceContext, StudyActionContext } from '../../../Contexts';
import StudyStore from '../../../Store/StudyStore/StudyStore';
import { hide$ } from '../../Scatterplot/RawPlot';
import Feedback from '../Feedback';
import { $showHint } from './TaskComponent';

type Props = {
  studyStore?: StudyStore;
  isTraining: boolean;
  isTrainingSubmitted: boolean;
  isSelectionAcceptable: boolean;
  setMessageSubmitted: (message: "success" | "error" | "none") => void;
  highlightMissing: () => void;
  values: number[];
  taskId: string;
};

const ButtonTask: FC<Props> = ({
  isTraining,
  isTrainingSubmitted,
  isSelectionAcceptable,
  setMessageSubmitted,
  highlightMissing,
  values,
  studyStore
}: Props) => {
  const { endTask, actions } = useContext(StudyActionContext);
  const graph = useContext(ProvenanceContext);
  const [trial, setTrial] = useState(0);
  const [showHintButton, setShowHintButton] = useState(false);

  const { hintUsedForTasks } = studyStore!;

  if (trial === 2) {
    if (!showHintButton) setShowHintButton(true);
  }

  const showHint = (
    <Button
      content="Show Hint"
      positive
      onClick={() => {
        $showHint.next(true);
      }}
      onMouseOut={() => setTimeout(() => $showHint.next(false), 250)}
    />
  );

  const trainingNotSubmittedButton = (
    <Button
      content="Submit"
      //   disabled={!selections || selections.values.length === 0}
      primary
      onClick={() => {
        if (isSelectionAcceptable) {
          setMessageSubmitted("success");
          highlightMissing();
        } else {
          setTrial(s => s + 1);
          setMessageSubmitted("error");
        }
      }}
    />
  );

  const trainingSubmittedButton = (
    <Button
      icon
      labelPosition="right"
      primary
      onClick={() => {
        endTask(values, graph(), 0, 0, "Training");
      }}
    >
      Next
      <Icon name="triangle right" />
    </Button>
  );

  const feedbackButton = (
    <Feedback
      trigger={
        <Button
          disabled={values.length === 0}
          primary
          content="Submit"
          onClick={() => hide$.next(null)}
        />
      }
      graph={graph()}
      selections={values}
    />
  );

  return (
    <>
      {isTraining
        ? !isTrainingSubmitted
          ? trainingNotSubmittedButton
          : trainingSubmittedButton
        : feedbackButton}
      {showHintButton && (
        <Card.Content>
          <Divider />
          <Message
            content={
              <>
                <p>{`You can hover on 'Show Hint' to peek at the solution. You can use hints for at most three training tasks to qualify for the study.`}</p>
                <p>
                  You have currently used{" "}
                  <strong>{hintUsedForTasks.length}/6</strong> hints
                </p>
              </>
            }
          />
          {showHint}
        </Card.Content>
      )}
    </>
  );
};

export default inject("store", "studyStore")(observer(ButtonTask));
