import React, {FC, CSSProperties} from 'react';
import {Dataset} from '../Stores/Types/Dataset';
import {connect, useSelector} from 'react-redux';
import {SelectionRecord} from '../App';
import {Header, List, Card, Statistic} from 'semantic-ui-react';
import {selectAll} from 'd3';
import {hashCode} from '../Utils';
import {AppState} from '../Stores/CombinedStore';
import {MultiBrushBehavior} from '../contract';

interface OwnProps {
  selections: SelectionRecord;
  changeIsSubmitted: (isSubmitted: boolean) => void;
}

interface StateProps {
  dataset: Dataset;
}

interface DispatchProps {}

type Props = OwnProps & StateProps & DispatchProps;

const SelectionResults: FC<Props> = ({selections, dataset}: Props) => {
  let pointSelectionsCount: number = selections.pointSelections.length;

  const multiBrushBehavior: MultiBrushBehavior = useSelector(
    (state: AppState) => state.multiBrushBehaviour,
  );

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

  return (
    <Card fluid style={resultsDivStyle}>
      <Card.Content
        style={{
          paddingTop: 0,
          paddingBottom: 0,
        }}>
        <Header as="h2" textAlign="center" style={{margin: 0}}>
          Selections
        </Header>
        <Statistic.Group size="tiny" widths="four">
          <Statistic
            color={
              multiBrushBehavior === MultiBrushBehavior.UNION
                ? 'orange'
                : 'blue'
            }
            value={unionCount}
            label="Union"
          />
          <Statistic
            color={'orange'}
            value={intersectionCount}
            label="Intersection"
          />
          <Statistic color="red" value={pointSelectionsCount} label="Click" />
          <Statistic value={totalSelections} label="Total" />
        </Statistic.Group>
      </Card.Content>
      <Card.Content style={{overflow: 'auto', padding: '1em'}}>
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
    </Card>
  );
};

export default connect(
  (state: AppState): StateProps => ({
    dataset: state.dataset,
  }),
)(SelectionResults);

const resultsDivStyle: CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'min-content 1fr min-content',
  margin: 0,
  padding: '1em',
};
