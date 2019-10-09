import React, {FC} from 'react';
import styled from 'styled-components';
import Task from './Components/Task';

interface OwnProps {}

type Props = OwnProps;

const App: FC<Props> = ({}: Props) => {
  return (
    <MainDiv>
      <TaskVisDiv>
        <Task />
        <Task />
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
  grid-template-areas: 'visualization predictions_study';
`;

const TaskVisDiv = styled('div')`
  width: 100%;
  height: 100%;

  display: grid;
  grid-template-rows: 1fr 15fr;
  grid-template-areas:
    'task'
    'viz';
`;
