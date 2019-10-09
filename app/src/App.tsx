import React, {FC} from 'react';
import styled from 'styled-components';
import Task from './Components/Task';

interface OwnProps {}

type Props = OwnProps;

const App: FC<Props> = ({}: Props) => {
  return (
    <MainDiv>
      <TaskVisDiv>
        <Task text="Study" />
        <Task text="Visualization" />
      </TaskVisDiv>
    </MainDiv>
  );
};

export default App;

const MainDiv = styled('div')`
  height: 100vh;
  width: 100vw;

  display: grid;
  grid-template-columns: 3fr 1fr;
`;

const TaskVisDiv = styled('div')`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: 1fr 15fr;
`;
