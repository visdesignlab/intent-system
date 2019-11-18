import React, {FC} from 'react';
import {Segment, Header} from 'semantic-ui-react';

interface OwnProps {
  text: string;
}

type Props = OwnProps;

const Task: FC<Props> = ({text}: Props) => {
  return (
    <Segment textAlign="center">
      <Header>{text}</Header>
    </Segment>
  );
};

export default Task;
