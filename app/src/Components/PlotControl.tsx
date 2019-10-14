import React, {FC, useState} from 'react';
import {connect} from 'react-redux';
import VisualizationState from '../Stores/Visualization/VisualizationState';
import {Dataset, ColumnMetaData, ColumnMap} from '../Stores/Types/Dataset';
import {
  Segment,
  Grid,
  Button,
  Icon,
  Menu,
  Label,
  Dropdown,
} from 'semantic-ui-react';
import {SinglePlot} from '../Stores/Types/Plots';
import {VisualizationProvenance} from '..';
import {addPlot} from '../Stores/Visualization/Setup/PlotsRedux';

interface OwnProps {}

interface StateProps {
  dataset: Dataset;
}

interface DispatchProps {
  addPlot: (plot: SinglePlot) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const PlotControl: FC<Props> = ({dataset, addPlot}: Props) => {
  const [addingPlot, setAddingPlot] = useState(true);

  const AddPlotButton = (
    <Button onClick={() => setAddingPlot(true)}>
      <Icon name="add"></Icon>
      Add plot
    </Button>
  );

  const AddPlotComponent = (
    <Menu compact>
      <Menu.Item>
        <Label>X Axis</Label>
        <Dropdown
          placeholder="X Axis dimension"
          selection
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
          options={convertToDropdownFormat(
            dataset.columnMaps,
            'numeric',
          )}></Dropdown>
      </Menu.Item>
      <Menu.Item>
        <Label>Color</Label>
        <Dropdown
          placeholder="Color"
          selection
          options={convertToDropdownFormat(
            dataset.columnMaps,
            'categorical',
          )}></Dropdown>
      </Menu.Item>
      <Menu.Item>
        <Button icon color="green" onClick={() => setAddingPlot(true)}>
          <Icon name="check"></Icon>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button icon color="red" onClick={() => setAddingPlot(true)}>
          <Icon name="close"></Icon>
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Segment>
      <Grid>
        <Grid.Column textAlign="center">
          {addingPlot ? AddPlotComponent : AddPlotButton}
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

const mapDispatchToProps = (): DispatchProps => ({
  addPlot: (plot: SinglePlot) => {
    VisualizationProvenance.apply(addPlot(plot));
  },
});

const mapStateToProps = (state: VisualizationState): StateProps => ({
  dataset: state.dataset,
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
