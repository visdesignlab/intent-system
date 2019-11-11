import React, {FC, useState} from 'react';
import {Dataset} from '../Stores/Types/Dataset';
import {connect} from 'react-redux';
import VisualizationState from '../Stores/Visualization/VisualizationState';
import {SelectionRecord} from '../App';
import {
  Header,
  Segment,
  Label,
  List,
  Button,
  Checkbox,
} from 'semantic-ui-react';
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

  const [finalSelection, setFinalSelection] = useState<string[]>([]);

  const {maxBrushCount, brushSelections} = selections;

  const brushValues = Object.values(brushSelections) as number[];

  let unionCount: number = brushValues.length;

  let intersectionCount: number = brushValues.filter(b => b === maxBrushCount)
    .length;

  let totalSelections: number = unionCount + pointSelectionsCount;

  const selectedLists: number[] = [
    ...Object.keys(brushSelections).map(d => parseInt(d)),
    ...selections.pointSelections,
  ];

  const {data, labelColumn} = dataset;

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
                <Checkbox
                  label={selectionLabel}
                  checked={finalSelection.includes(selectionLabel)}
                  onChange={() => {
                    if (finalSelection.includes(selectionLabel)) {
                      setFinalSelection(
                        finalSelection.filter(sel => sel !== selectionLabel),
                      );
                    } else {
                      setFinalSelection([...finalSelection, selectionLabel]);
                    }
                  }}></Checkbox>
              </List.Item>
            );
          })}
        </List>
      </Segment>
      <Segment textAlign="center">
        <Button primary onClick={() => console.log(finalSelection)}>
          Submit
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
