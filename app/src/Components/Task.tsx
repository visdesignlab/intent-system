import React, {FC} from 'react';
import {Segment} from 'semantic-ui-react';

interface OwnProps {
  text: string;
}

type Props = OwnProps;

const Task: FC<Props> = ({text}: Props) => {
  return <Segment>{text}</Segment>;
};

export default Task;
