import React, {FC, useState, CSSProperties, useMemo} from 'react';

import Task from './Components/Task';
import Visualization from './Components/Visualization';
import {Dataset} from './Stores/Types/Dataset';
import {connect} from 'react-redux';
import {
  SinglePlot,
  Plots,
  PointCountInPlot,
  combineBrushSelectionInMultiplePlots,
} from './Stores/Types/Plots';
import {addPlot} from './Stores/Visualization/Setup/PlotsRedux';
import PlotControl, {
  CategoriesDropdownOption,
  CategoriesDropdownOptions,
} from './Components/PlotControl';
import Predictions from './Components/Predictions';
import SelectionResults from './Components/SelectionResults';
import {max} from 'lodash';
import TaskDetails from './Stores/Types/TaskDetails';
import {areEqual} from './Utils';
import {AppState} from './Stores/CombinedStore';
import LiveIntent from './Components/LiveIntent';

interface OwnProps {
  task: TaskDetails;
  isExploreMode: boolean;
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

const App: FC<Props> = ({
  task,
  isExploreMode,
  dataset,
  plots,
  addPlot,
}: Props) => {
  const emptyString = '';

  const [showCategories, setShowCategories] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categoricalColumnsString = JSON.stringify(dataset.categoricalColumns);
  const columnMapsString = JSON.stringify(dataset.columnMaps);
  const memoizedCategoricalList: CategoriesDropdownOptions = useMemo(() => {
    const categoricalCols: string[] = JSON.parse(categoricalColumnsString);
    const columnMaps = JSON.parse(columnMapsString);
    return categoricalCols.map(col => ({
      key: col,
      value: col,
      text: columnMaps[col].text,
    }));
  }, [categoricalColumnsString, columnMapsString]);

  const [selectedCategory, setSelectedCategory] = useState<
    CategoriesDropdownOption
  >(
    memoizedCategoricalList.length > 0
      ? memoizedCategoricalList[0]
      : {key: '', value: '', text: ''},
  );

  if (plots.length === 0 && dataset.name !== '') {
    if (!dataset.categoricalColumns.includes(selectedCategory.value)) {
      setSelectedCategory(memoizedCategoricalList[0]);
    } else {
      const plot: SinglePlot = {
        id: new Date().valueOf().toString(),
        x: dataset.numericColumns[1],
        y: dataset.numericColumns[0],
        color: dataset.categoricalColumns[0],
        brushes: {},
        brushSelections: {},
        combinedBrushSelections: {},
        selectedPoints: [],
      };

      addPlot(plot);
    }
  }

  const [totalSelections, setTotalSelections] = useState<SelectionRecord>({
    brushSelections: {},
    pointSelections: [],
    maxBrushCount: 0,
  });

  const brushSelections: BrushSelectionDictionary = combineBrushSelectionInMultiplePlots(
    plots,
  );

  const pointSelections: PointSelectionArray = plots.flatMap(
    p => p.selectedPoints,
  );

  const maxBcount = max(Object.values(brushSelections)) || 0;

  const totalSels: SelectionRecord = {
    brushSelections,
    pointSelections,
    maxBrushCount: maxBcount,
  };

  if (!areEqual(totalSels, totalSelections)) setTotalSelections(totalSels);

  let clearAllHandler: () => void = () => {};

  function clearAllHandlerSetup(handler: () => void) {
    clearAllHandler = handler;
  }

  function clearAll() {
    clearAllHandler();
  }

  const study = (
    <div style={mainDivStyle}>
      <div style={taskVisDiv(isExploreMode)}>
        {!isExploreMode && <Task text={task ? task.text : emptyString} />}
        <div style={visDiv}>
          <PlotControl
            plots={plots}
            isExploreMode={isExploreMode}
            isSubmitted={isSubmitted}
            showCategories={showCategories}
            setShowCategories={setShowCategories}
            clearAll={clearAll}
            categoryDropdownOptions={memoizedCategoricalList}
            setSelectedCategory={(cat: CategoriesDropdownOption) => {
              if (areEqual(selectedCategory, cat)) return;
              setSelectedCategory(cat);
            }}
            selectionRecord={totalSelections}
          />
          <div style={visResDiv(isExploreMode)}>
            <Visualization
              clearAllHandlerSetup={clearAllHandlerSetup}
              isSubmitted={isSubmitted}
              showCategories={showCategories}
              selectedCategory={selectedCategory.value}
            />
          </div>
        </div>
      </div>
      <div style={resPred}>
        <LiveIntent initialText="" />
        <Predictions
          isExploreMode={isExploreMode}
          clearAll={clearAll}
          isSubmitted={isSubmitted}
          dataset={dataset}
          selectionRecord={totalSelections}></Predictions>
        <SelectionResults
          changeIsSubmitted={setIsSubmitted}
          selections={totalSelections}></SelectionResults>
      </div>
    </div>
  );

  return study;
};

const mapStateToProps = (state: AppState): StateProps => ({
  dataset: state.dataset,
  plots: state.plots,
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  addPlot: (plot: SinglePlot) => {
    dispatch(addPlot(plot));
  },
});

// (App as any).whyDidYouRender = {
//   logOnDifferentValues: true,
// };

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

const mainDivStyle: CSSProperties = {
  height: '100vh',
  maxHeight: '100vh',
  width: '100vw',
  display: 'grid',
  gridTemplateColumns: '3fr 1.5fr',
};

const resPred: CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'min-content 1fr 1fr',
  height: '100vh',
};

const taskVisDiv = (isExploreMode: boolean = false): CSSProperties => {
  return {
    width: '100%',
    height: ' 100%',
    maxHeight: '100vh',
    display: 'grid',
    gridTemplateRows: isExploreMode ? '1fr' : '1fr 15fr',
  };
};

const visDiv: CSSProperties = {
  display: 'grid',
  gridTemplateRows: '1fr 10fr',
  width: '100%',
};

const visResDiv = (isExploreMode: boolean = false): CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: isExploreMode ? '1fr' : '4fr 1fr',
  width: '100%',
  height: '100%',
});
