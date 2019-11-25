import React, {FC, CSSProperties} from 'react';
import {Dataset} from '../Stores/Types/Dataset';
import {connect} from 'react-redux';
import VisualizationState from '../Stores/Visualization/VisualizationState';
import {SelectionRecord} from '../App';
import {Header, Label, List, Button, Card} from 'semantic-ui-react';
import {selectAll} from 'd3';
import {hashCode} from '../Utils';
import Events from '../Stores/Types/EventEnum';
import {studyProvenance} from '..';
import {StudyState} from '../Stores/Study/StudyState';

interface OwnProps {
  selections: SelectionRecord;
  changeIsSubmitted: (isSubmitted: boolean) => void;
}

interface StateProps {
  dataset: Dataset;
}

interface DispatchProps {}

type Props = OwnProps & StateProps & DispatchProps;

const SelectionResults: FC<Props> = ({
  selections,
  changeIsSubmitted,
  dataset,
}: Props) => {
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
    <Card fluid style={resultsDivStyle}>
      <Card.Content>
        <Header as="h1" textAlign="center">
          Selections
        </Header>
        <Label>{`Selected Items: ${pointSelectionsCount} (Click)`}</Label>
        <Label>{`Selected Items: ${intersectionCount} (Intersection)`}</Label>
        <Label>{`Selected Items: ${unionCount} (Union)`}</Label>
        <Label>{`Selected Items: ${totalSelections} (Total)`}</Label>
      </Card.Content>
      <Card.Content style={{overflow: 'scroll', padding: '1em'}}>
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
      </Card.Content>
      <Card.Content textAlign="center">
        <Button
          primary
          disabled={selectedLists.length === 0}
          onClick={() => {
            studyProvenance.applyAction({
              label: Events.SUBMIT_ANSWER,
              args: [],
              action: () => {
                let currentState = studyProvenance.graph().current.state;
                if (currentState) {
                  currentState = {
                    ...currentState,
                    event: Events.SUBMIT_PREDICTION,
                    answer: {
                      submissions: detailedSelectedList,
                      comment: '',
                    },
                  };
                }
                return currentState as StudyState;
              },
            });
            changeIsSubmitted(true);
          }}>
          Submit ({selectedLists.length} selected)
        </Button>
      </Card.Content>
    </Card>
  );
};

export default connect(
  (state: VisualizationState): StateProps => ({
    dataset: state.dataset,
  }),
)(SelectionResults);

const resultsDivStyle: CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'min-content 1fr min-content',
  height: '50vh',
  margin: 0,
  padding: '1em',
};
