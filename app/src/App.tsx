import React, {FC} from 'react';
import styled from 'styled-components';
import Task from './Components/Task';
import Visualization from './Components/Visualization';
import VisualizationState from './Stores/Visualization/VisualizationState';
import {Dataset} from './Stores/Types/Dataset';
import {connect} from 'react-redux';

interface OwnProps {}
interface StateProps {
  dataset: Dataset;
}
type Props = OwnProps & StateProps;

const App: FC<Props> = ({dataset}: Props) => {
  return (
    <MainDiv>
      <TaskVisDiv>
        <Task text="Test" />
        <Visualization />
      </TaskVisDiv>
    </MainDiv>
  );
};

const mapStateToProps = (state: VisualizationState): StateProps => ({
  dataset: state.dataset,
});

export default connect(mapStateToProps)(App);

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
