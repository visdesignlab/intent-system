import React, {FC} from 'react';
import {Header} from 'semantic-ui-react';

type Props = {
  task: string;
};

const Task: FC<Props> = ({task}: Props) => {
  return <Header>{task}</Header>;
};

export default Task;
