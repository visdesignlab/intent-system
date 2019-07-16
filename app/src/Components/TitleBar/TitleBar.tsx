import * as React from "react";

import { Button, Container, Icon, Segment } from "semantic-ui-react";

import { ChangeExperimentActions } from "../../StudyStore/ChangeExperimentState";
import { ExperimentStates } from "../../StudyStore/ExperimentStates.enum";
import { StudyProvenance } from "../..";
import { StudyState } from "../../StudyStore/StudyStore";
import { Tasks } from "../../Study Data/Tasks";
import { connect } from "react-redux";
import { recordableReduxActionCreator } from "@visdesignlab/provenance-lib-core/lib/src";
import styled from "styled-components";
import { useState } from "react";

interface StateProps {
  exptState: ExperimentStates;
}

interface DispatchProps {
  advanceExptState: any;
}

interface OwnProps {
  tasks: Tasks;
}

type Props = StateProps & OwnProps & DispatchProps;

const TitleBar: React.FC<Props> = ({ tasks, exptState, advanceExptState }) => {
  const [currentTask, setCurrentTask] = useState(tasks[0]);

  const a = 1;
  if (a + 1 === 1) setCurrentTask(tasks[0]);

  function handleExperimentButtonClick() {
    advanceExptState();
  }

  const ButtonColors: { [key in ExperimentStates]: any } = {
    start: "green",
    next: "blue",
    stop: "red"
  };

  return (
    <>
      <TaskNumberSegment>Task # {currentTask.task_no}</TaskNumberSegment>
      <TaskDescContainer>{currentTask.question}</TaskDescContainer>
      <StartNextButtonDiv>
        <Button
          onClick={handleExperimentButtonClick}
          size="huge"
          color={ButtonColors[exptState]}
        >
          <Icon
            name={(() => {
              switch (exptState) {
                case ExperimentStates.START:
                  return "play";
                case ExperimentStates.STOP:
                  return "stop";
                case ExperimentStates.NEXT:
                  return "step forward";
                default:
                  return "play";
              }
            })()}
          />
          {(() => {
            switch (exptState) {
              case ExperimentStates.START:
                return "Start";
              case ExperimentStates.STOP:
                return "Stop";
              case ExperimentStates.NEXT:
                return "Next";
              default:
                return "play";
            }
          })()}
        </Button>
      </StartNextButtonDiv>
    </>
  );
};

const mapStateToProps = (state: StudyState): StateProps => ({
  exptState: state.experimentState
});

const mapDispatchToProps = (): DispatchProps => ({
  advanceExptState: () => {
    StudyProvenance.apply(
      recordableReduxActionCreator(
        "Advance State",
        ChangeExperimentActions.ADVANCE,
        []
      )
    );
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TitleBar);

const TaskNumberSegment = styled(Segment).attrs({
  textAlign: "center",
  size: "massive"
})`
  height: 100%;
  grid-column: 1/3;
  font-size: 2em !important;
  margin-bottom: 0 !important;
`;

const TaskDescContainer = styled(Container).attrs({
  textAlign: "center"
})`
  grid-column: 3/19;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-size: 2rem;
`;

const StartNextButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1em !important;
  grid-column: 19/-1;
`;
