import React, {FC} from 'react';
import {Segment, Header} from 'semantic-ui-react';

interface OwnProps {
  text: string;
}

type Props = OwnProps;

const Task: FC<Props> = ({text}: Props) => {
  return (
    <div style={{padding: '1em 1em 0 1em'}}>
      <Segment textAlign="center">
        <Header>{text}</Header>
      </Segment>
    </div>
  );
};

export default Task;
