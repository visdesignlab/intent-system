import React, {FC, useState} from 'react';
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

import {VisualizationProvenance} from '..';
import {MultiBrushBehavior} from '../contract';
import {ColumnMap, Dataset} from '../Stores/Types/Dataset';
import {SinglePlot} from '../Stores/Types/Plots';
import {CHANGE_BRUSH_BEHAVIOR} from '../Stores/Visualization/Setup/MultiBrushRedux';
import {addPlot} from '../Stores/Visualization/Setup/PlotsRedux';
import VisualizationState from '../Stores/Visualization/VisualizationState';

interface OwnProps {
  showCategories: boolean;
  setShowCategories: (shouldShow: boolean) => void;
}

interface StateProps {
  dataset: Dataset;
  multiBrushBehavior: MultiBrushBehavior;
}

interface DispatchProps {
  addPlot: (plot: SinglePlot) => void;
  changeBrushBehavior: (multiBrushBehaviour: MultiBrushBehavior) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const PlotControl: FC<Props> = ({
  showCategories,
  setShowCategories,
  multiBrushBehavior,
  changeBrushBehavior,
  dataset,
  addPlot,
}: Props) => {
  const [addingPlot, setAddingPlot] = useState(false);

  const [singlePlot, setSinglePlot] = useState<SinglePlot>({
    color: dataset.categoricalColumns[0],
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
            setSinglePlot({} as any);
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
            setSinglePlot({} as any);
            setAddingPlot(false);
          }}>
          <Icon name="close"></Icon>
        </Button>
      </Menu.Item>
    </Menu>
  );

  const AddPlotButton = (
    <Button onClick={() => setAddingPlot(true)}>
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

  const Control = (
    <Menu compact>
      <Menu.Item>{AddPlotButton}</Menu.Item>
      <Menu.Item>{HideCategoryToggle}</Menu.Item>
      {showCategories && <Menu.Item>{AddCategoryDropdown}</Menu.Item>}
      <Menu.Item>{MultiBrushBehaviorToggle}</Menu.Item>
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
  addPlot: (plot: SinglePlot) => {
    dispatch(addPlot(plot));
    console.table(Object.values(VisualizationProvenance.graph().nodes));
  },
  changeBrushBehavior: (mbb: MultiBrushBehavior) => {
    dispatch({
      type: CHANGE_BRUSH_BEHAVIOR,
      args: mbb,
    });
  },
});

const mapStateToProps = (state: VisualizationState): StateProps => ({
  dataset: state.dataset,
  multiBrushBehavior: state.multiBrushBehaviour,
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
      text: `${columnMap[col].text} (${columnMap[col].unit})`,
      value: col,
    }));
}
