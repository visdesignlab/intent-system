import React, {FC} from 'react';
import {Dataset} from '../Stores/Types/Dataset';
import {connect} from 'react-redux';
import VisualizationState from '../Stores/Visualization/VisualizationState';
import {SelectionRecord} from '../App';
import {Header, Segment, Label, List, Button} from 'semantic-ui-react';
import {selectAll} from 'd3';
import {hashCode} from '../Utils';

interface OwnProps {
  selections: SelectionRecord;
}

interface StateProps {
  dataset: Dataset;
}

interface DispatchProps {}

type Props = OwnProps & StateProps & DispatchProps;

const SelectionResults: FC<Props> = ({selections, dataset}: Props) => {
  let pointSelectionsCount: number = selections.pointSelections.length;

  const {maxBrushCount, brushSelections} = selections;

  const brushValues = Object.values(brushSelections) as number[];

  let unionCount: number = brushValues.length;

  let intersectionCount: number = brushValues.filter(b => b === maxBrushCount)
    .length;

  let totalSelections: number = unionCount + pointSelectionsCount;

  const selectedLists: number[] = [
    ...new Set([
      ...Object.keys(brushSelections).map(d => parseInt(d)),
      ...selections.pointSelections,
    ]),
  ];

  const {data, labelColumn} = dataset;

  const detailedSelectedList = selectedLists.map(idx => data[idx]);

  return (
    <div style={{height: '45vh'}}>
      <Segment>
        <Header as="h1" textAlign="center">
          Results
        </Header>
        <Label>{`Selected Items: ${pointSelectionsCount} (Click)`}</Label>
        <Label>{`Selected Items: ${intersectionCount} (Intersection)`}</Label>
        <Label>{`Selected Items: ${unionCount} (Union)`}</Label>
        <Label>{`Selected Items: ${totalSelections} (Total)`}</Label>
      </Segment>
      <Segment style={{height: '100%', overflow: 'scroll', padding: '1em'}}>
        <List>
          {selectedLists.map(selectionId => {
            const selectionObject = data[selectionId];
            const selectionLabel = selectionObject[labelColumn];
            return (
              <List.Item
                key={selectionLabel}
                onMouseEnter={() => {
                  selectAll(`.${hashCode(selectionLabel)}`).classed(
                    'selection_highlight',
                    true,
                  );
                }}
                onMouseLeave={() => {
                  selectAll(`.${hashCode(selectionLabel)}`).classed(
                    'selection_highlight',
                    false,
                  );
                }}>
                {selectionLabel}
              </List.Item>
            );
          })}
        </List>
      </Segment>
      <Segment textAlign="center">
        <Button
          primary
          disabled={selectedLists.length === 0}
          onClick={() => console.table(detailedSelectedList)}>
          Submit ({selectedLists.length} selected)
        </Button>
      </Segment>
    </div>
  );
};

export default connect(
  (state: VisualizationState): StateProps => ({
    dataset: state.dataset,
  }),
)(SelectionResults);
