import React, {FC} from 'react';

interface OwnProps {
  text: string;
}

type Props = OwnProps;

const Task: FC<Props> = ({text}: Props) => {
  return <div>{text}</div>;
};

export default Task;
