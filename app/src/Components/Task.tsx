import React, {FC} from 'react';

interface Props {
  text: string;
}

const Task: FC<Props> = ({text}: Props) => {
  return <div>{text}</div>;
};

export default Task;
