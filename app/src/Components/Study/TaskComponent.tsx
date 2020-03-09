import React, { FC } from "react";
import { Segment, Header, Container } from "semantic-ui-react";
import { style } from "typestyle";

type Props = {
  task: string;
};

const TaskComponent: FC<Props> = ({ task }: Props) => {
  return (
    <Container>
      <Segment className={taskStyle} textAlign="center">
        <Header>{task}</Header>
      </Segment>
    </Container>
  );
};

export default TaskComponent;

const taskStyle = style({
  gridArea: "question"
});
