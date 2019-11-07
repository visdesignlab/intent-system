import React, {FC, useState} from 'react';
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
import SelectionResults from './Components/SelectionResults';

interface OwnProps {}
interface DispatchProps {
  addPlot: (plot: SinglePlot) => void;
}
interface StateProps {
  plots: Plots;
  dataset: Dataset;
}
type Props = OwnProps & StateProps & DispatchProps;

export type BrushSelectionDictionary = {[key: string]: number};

export type PointSelectionArray = number[];

export interface SelectionRecord {
  brushSelections: BrushSelectionDictionary;
  maxBrushCount: number;
  pointSelections: PointSelectionArray;
}

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
    addPlot(plot2);
  }

  const [showCategories, setShowCategories] = useState(false);

  const changeShowCategories = (shouldShow: boolean) => {
    setShowCategories(shouldShow);
  };

  const [selections, setSelections] = useState<SelectionRecord>({
    brushSelections: {},
    maxBrushCount: 0,
    pointSelections: [],
  });

  const updateSelections = (sel: SelectionRecord) => {
    if (selections !== sel) setSelections({...sel});
  };

  return (
    <MainDiv>
      <TaskVisDiv>
        <Task text="Study" />
        <VisDiv>
          <PlotControl
            showCategories={showCategories}
            setShowCategories={changeShowCategories}
          />
          <VisResDiv>
            <Visualization
              selRecord={selections}
              updateSelections={updateSelections}
              showCategories={showCategories}
            />
            <SelectionResults selections={selections}></SelectionResults>
          </VisResDiv>
        </VisDiv>
      </TaskVisDiv>
      <Provider store={predictionStore}>
        <Predictions dataset={dataset}></Predictions>
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

const VisResDiv = styled('div')`
  display: grid;
  grid-template-columns: 3fr 1fr;

  width: 100%;
  height: 100%;
`;
