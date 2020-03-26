import { inject, observer } from 'mobx-react';
import React, { FC, useContext, useState } from 'react';
import { Button, Icon, Label, Message } from 'semantic-ui-react';

import { ProvenanceContext, StudyActionContext } from '../../../Contexts';
import { hide$ } from '../../Scatterplot/RawPlot';
import Feedback from '../Feedback';
import { $showHint } from './TaskComponent';
import StudyStore from '../../../Store/StudyStore/StudyStore'

type Props = {
  studyStore?: StudyStore;
  isTraining: boolean;
  isTrainingSubmitted: boolean;
  isSelectionAcceptable: boolean;
  setMessageSubmitted: (message: "success" | "error" | "none") => void;
  highlightMissing: () => void;
  values: number[];
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
  const { endTask } = useContext(StudyActionContext);
  const graph = useContext(ProvenanceContext);
  const [trial, setTrial] = useState(0);
  const [showHintButton, setShowHintButton] = useState(false);

  const {hintUsedForTasks} = studyStore!;

  if (trial === 2) {
    if (!showHintButton) setShowHintButton(true);
  }

  const showHint = (
    <Label
      content="Show Hint"
      color="green"
      onMouseOver={() => $showHint.next(true)}
      onMouseOut={() => $showHint.next(false)}
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
        <>
          {showHint}
          <Message content={`You can hover on 'Show Hint' to peek at the solution. You can use hints for at most three training tasks to qualify for the study. You have currently used ${hintUsedForTasks.length}/3 hints`} />
        </>
      )}
    </>
  );
};

export default inject("store", 'studyStore')(observer(ButtonTask));
