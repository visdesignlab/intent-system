import React, {FC} from 'react';
import styled from 'styled-components';
import Task from './Components/Task';
import Visualization from './Components/Visualization';
import VisualizationState from './Stores/Visualization/VisualizationState';
import {Dataset} from './Stores/Types/Dataset';
import {connect, Provider} from 'react-redux';
import {SinglePlot, Plots} from './Stores/Types/Plots';
import {addPlot} from './Stores/Visualization/Setup/PlotsRedux';
import PlotControl from './Components/PlotControl';
import {predictionStore} from '.';
import Predictions from './Components/Predictions';

interface OwnProps {}
interface DispatchProps {
  addPlot: (plot: SinglePlot) => void;
}
interface StateProps {
  plots: Plots;
  dataset: Dataset;
}
type Props = OwnProps & StateProps & DispatchProps;

const App: FC<Props> = ({dataset, plots, addPlot}: Props) => {
  if (plots.length === 0 && dataset.name !== '') {
    const plot: SinglePlot = {
      id: new Date().valueOf().toString(),
      x: dataset.numericColumns[0],
      y: dataset.numericColumns[1],
      color: dataset.categoricalColumns[0],
      brushes: {},
      selectedPoints: [],
    };
    const plot2: SinglePlot = {
      id: `test-${new Date().valueOf().toString()}`,
      x: dataset.numericColumns[1],
      y: dataset.numericColumns[2],
      color: dataset.categoricalColumns[0],
      brushes: {},
      selectedPoints: [],
    };

    addPlot(plot);
    //addPlot(plot2);
  }
  return (
    <MainDiv>
      <TaskVisDiv>
        <Task text="Study" />
        <VisDiv>
          <PlotControl />
          <Visualization />
        </VisDiv>
      </TaskVisDiv>
      <Provider store={predictionStore}>
        <Predictions></Predictions>
      </Provider>
    </MainDiv>
  );
};

const mapStateToProps = (state: VisualizationState): StateProps => ({
  dataset: state.dataset,
  plots: state.plots,
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  addPlot: (plot: SinglePlot) => {
    dispatch(addPlot(plot));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

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

const VisDiv = styled('div')`
  display: grid;
  grid-template-rows: 1fr 10fr;

  width: 100%;
  height: 100%;
`;
