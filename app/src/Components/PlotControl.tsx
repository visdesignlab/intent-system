import React, {FC, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {
  Button,
  Dropdown,
  Grid,
  Icon,
  Label,
  Menu,
  Radio,
} from 'semantic-ui-react';

import {MultiBrushBehavior} from '../contract';
import {ColumnMap, Dataset} from '../Stores/Types/Dataset';
import {SinglePlot, Plots} from '../Stores/Types/Plots';
import {CHANGE_BRUSH_BEHAVIOR} from '../Stores/Visualization/Setup/MultiBrushRedux';
import {
  addPlot,
  updateAllPlots,
} from '../Stores/Visualization/Setup/PlotsRedux';
import {areEqual} from '../Utils';
import axios from 'axios';
import {datasetName, loadDatasetByName} from '..';
import {AppStore} from '../Stores/CombinedStore';

interface OwnProps {
  plots: Plots;
  isExploreMode: boolean;
  isSubmitted: boolean;
  showCategories: boolean;
  setShowCategories: (shouldShow: boolean) => void;
  clearAll: () => void;
}

interface StateProps {
  dataset: Dataset;
  multiBrushBehavior: MultiBrushBehavior;
}

interface DispatchProps {
  addPlot: (plot: SinglePlot) => void;
  updatePlots: (plots: Plots) => void;
  changeBrushBehavior: (multiBrushBehaviour: MultiBrushBehavior) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const defaultSinglePlot: SinglePlot = ({
  brushes: {},
  brushSelections: {},
  combinedBrushSelections: {},
  selectedPoints: [],
} as unknown) as SinglePlot;

export type DatasetDropdownOption = {
  key: string;
  text: string;
  value: string;
};

export type DatasetDropdownOptions = DatasetDropdownOption[];

function getDatasetOptions(
  datasets: {key: string; name: string}[],
): DatasetDropdownOptions {
  return datasets.map(ds => ({
    key: ds.key,
    text: ds.name,
    value: ds.key,
  }));
}

const PlotControl: FC<Props> = (props: Props) => {
  const {
    showCategories,
    isSubmitted,
    setShowCategories,
    multiBrushBehavior,
    changeBrushBehavior,
    dataset,
    addPlot,
    clearAll,
    plots,
    updatePlots,
  } = props;

  defaultSinglePlot.color = dataset.categoricalColumns[0];

  const [datasets, setDatasets] = useState<DatasetDropdownOptions>([]);

  useEffect(() => {
    axios.get('./dataset').then(response => {
      const datasets = response.data;
      setDatasets(getDatasetOptions(datasets));
    });
  }, []);

  const [addingPlot, setAddingPlot] = useState(false);
  const [singlePlot, setSinglePlot] = useState<SinglePlot>({
    ...defaultSinglePlot,
  } as SinglePlot);

  const AddPlotComponent = (
    <Menu compact>
      <Menu.Item>
        <Label>X Axis</Label>
        <Dropdown
          placeholder="X Axis dimension"
          selection
          onChange={(_, data) => {
            setSinglePlot({...singlePlot, x: data.value as string});
          }}
          options={convertToDropdownFormat(
            dataset.columnMaps,
            'numeric',
          )}></Dropdown>
      </Menu.Item>
      <Menu.Item>
        <Label>Y Axis</Label>
        <Dropdown
          placeholder="Y Axis dimension"
          selection
          onChange={(_, data) => {
            setSinglePlot({...singlePlot, y: data.value as string});
          }}
          options={convertToDropdownFormat(
            dataset.columnMaps,
            'numeric',
          )}></Dropdown>
      </Menu.Item>
      <Menu.Item>
        <Button
          icon
          color="green"
          disabled={!(singlePlot.x && singlePlot.y && singlePlot.color)}
          onClick={() => {
            const plot = singlePlot;
            plot.id = new Date().valueOf().toString();
            plot.brushes = {};
            plot.selectedPoints = [];
            addPlot(plot);
            setSinglePlot({...defaultSinglePlot} as any);
            setAddingPlot(false);
          }}>
          <Icon name="check"></Icon>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          icon
          color="red"
          onClick={() => {
            if (!areEqual(singlePlot, defaultSinglePlot))
              setSinglePlot({...defaultSinglePlot} as any);
            setAddingPlot(false);
          }}>
          <Icon name="close"></Icon>
        </Button>
      </Menu.Item>
    </Menu>
  );

  const AddPlotButton = (
    <Button primary disabled={isSubmitted} onClick={() => setAddingPlot(true)}>
      <Icon name="add"></Icon>
      Add plot
    </Button>
  );

  const HideCategoryToggle = (
    <Radio
      toggle
      checked={showCategories}
      label="Show Categories"
      onChange={(_, state) => {
        let {checked} = state;
        setShowCategories(checked ? true : false);
      }}></Radio>
  );

  const MultiBrushBehaviorToggle = (
    <Radio
      toggle
      disabled={isSubmitted}
      checked={multiBrushBehavior === MultiBrushBehavior.UNION}
      label="Union"
      onChange={() => {
        let mbb =
          multiBrushBehavior === MultiBrushBehavior.UNION
            ? MultiBrushBehavior.INTERSECTION
            : MultiBrushBehavior.UNION;
        changeBrushBehavior(mbb);
      }}></Radio>
  );

  const categoriesOptions = convertToDropdownFormat(
    dataset.columnMaps,
    'categorical',
  );

  const AddCategoryDropdown = (
    <>
      <Label>Color</Label>
      <Dropdown
        placeholder="Color"
        selection
        options={categoriesOptions}
        disabled={categoriesOptions.length < 2}
        defaultValue={categoriesOptions[0].value}></Dropdown>
    </>
  );

  function clearAllSelections() {
    clearAll();
    updatePlots(plots);
  }

  const ClearSelection = (
    <Button color="red" onClick={clearAllSelections}>
      Clear Selections
    </Button>
  );

  const DatasetSwitcher = (
    <Dropdown
      options={datasets}
      defaultValue={datasetName}
      onChange={(_, data) => {
        clearAllSelections();
        loadDatasetByName(data.value as string);
      }}></Dropdown>
  );

  const Control = (
    <Menu compact>
      <Menu.Item>{DatasetSwitcher}</Menu.Item>
      <Menu.Item>{AddPlotButton}</Menu.Item>
      <Menu.Item>{HideCategoryToggle}</Menu.Item>
      {showCategories && <Menu.Item>{AddCategoryDropdown}</Menu.Item>}
      <Menu.Item>{MultiBrushBehaviorToggle}</Menu.Item>
      <Menu.Item>{ClearSelection}</Menu.Item>
    </Menu>
  );

  return (
    <Grid verticalAlign="middle">
      <Grid.Column textAlign="center">
        {!addingPlot ? Control : AddPlotComponent}
      </Grid.Column>
    </Grid>
  );
};

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  addPlot: (plot: SinglePlot) => dispatch(addPlot(plot)),
  updatePlots: (plots: Plots) => {
    dispatch(updateAllPlots(plots));
  },
  changeBrushBehavior: (mbb: MultiBrushBehavior) =>
    dispatch({
      type: CHANGE_BRUSH_BEHAVIOR,
      args: mbb,
    }),
});

const mapStateToProps = (state: AppStore): StateProps => ({
  dataset: state.visualization.dataset,
  multiBrushBehavior: state.visualization.multiBrushBehaviour,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlotControl);

function convertToDropdownFormat(
  columnMap: ColumnMap,
  type: string,
): {key: string; value: string; text: string}[] {
  const columns = Object.keys(columnMap);
  return columns
    .filter(col => columnMap[col].type === type)
    .map(col => ({
      key: col,
      text:
        columnMap[col].unit.length > 0
          ? `${columnMap[col].text} (${columnMap[col].unit})`
          : `${columnMap[col].text}`,
      value: col,
    }));
}
