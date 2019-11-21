import React, {FC, useState, useMemo} from 'react';
import styled from 'styled-components';
import Task from './Components/Task';
import Visualization from './Components/Visualization';
import VisualizationState from './Stores/Visualization/VisualizationState';
import {Dataset} from './Stores/Types/Dataset';
import {connect, Provider} from 'react-redux';
import {
  SinglePlot,
  Plots,
  PointCountInPlot,
  combineBrushSelectionInMultiplePlots,
} from './Stores/Types/Plots';
import {addPlot} from './Stores/Visualization/Setup/PlotsRedux';
import PlotControl from './Components/PlotControl';
import {predictionStore} from '.';
import Predictions from './Components/Predictions';
import SelectionResults from './Components/SelectionResults';
import {max} from 'lodash';
import TaskDetails from './Stores/Types/TaskDetails';

interface OwnProps {
  task: TaskDetails;
}
interface DispatchProps {
  addPlot: (plot: SinglePlot) => void;
}
interface StateProps {
  plots: Plots;
  dataset: Dataset;
}
type Props = OwnProps & StateProps & DispatchProps;

export type BrushSelectionDictionary = PointCountInPlot;

export type PointSelectionArray = number[];

export interface SelectionRecord {
  brushSelections: BrushSelectionDictionary;
  maxBrushCount: number;
  pointSelections: PointSelectionArray;
}

const App: FC<Props> = ({task, dataset, plots, addPlot}: Props) => {
  if (plots.length === 0 && dataset.name !== '') {
    const plot: SinglePlot = {
      id: new Date().valueOf().toString(),
      x: dataset.numericColumns[0],
      y: dataset.numericColumns[1],
      color: dataset.categoricalColumns[0],
      brushes: {},
      brushSelections: {},
      combinedBrushSelections: {},
      selectedPoints: [],
    };

    addPlot(plot);
  }

  const [showCategories, setShowCategories] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const changeShowCategories = (shouldShow: boolean) => {
    setShowCategories(shouldShow);
  };

  const totalSelections: SelectionRecord = useMemo(() => {
    const brushSelections: BrushSelectionDictionary = combineBrushSelectionInMultiplePlots(
      plots,
    );

    const pointSelections: PointSelectionArray = plots.flatMap(
      p => p.selectedPoints,
    );

    const maxBcount = max(Object.values(brushSelections)) || 0;

    const totalSelections: SelectionRecord = {
      brushSelections,
      pointSelections,
      maxBrushCount: maxBcount,
    };
    return totalSelections;
  }, [plots]);

  const study = (
    <MainDiv>
      <TaskVisDiv>
        <Task text={task ? task.text : ''} />
        <VisDiv>
          <PlotControl
            isSubmitted={isSubmitted}
            showCategories={showCategories}
            setShowCategories={changeShowCategories}
          />
          <VisResDiv>
            <Visualization
              isSubmitted={isSubmitted}
              showCategories={showCategories}
            />
            <SelectionResults
              changeIsSubmitted={() => setIsSubmitted(true)}
              selections={totalSelections}></SelectionResults>
          </VisResDiv>
        </VisDiv>
      </TaskVisDiv>
      <Provider store={predictionStore}>
        <Predictions isSubmitted={isSubmitted} dataset={dataset}></Predictions>
      </Provider>
    </MainDiv>
  );

  return study;
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

  max-height: 100vh;

  display: grid;
  grid-template-columns: 3fr 1fr;
`;

const TaskVisDiv = styled('div')`
  width: 100%;
  height: 100%;

  max-height: 100vh;

  display: grid;
  grid-template-rows: 1fr 15fr;
`;

const VisDiv = styled('div')`
  display: grid;
  grid-template-rows: 1fr 10fr;

  width: 100%;
`;

const VisResDiv = styled('div')`
  display: grid;
  grid-template-columns: 4fr 1fr;

  width: 100%;
  height: 100%;
`;
