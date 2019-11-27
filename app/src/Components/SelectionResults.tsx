import React, {FC, CSSProperties} from 'react';
import {Dataset} from '../Stores/Types/Dataset';
import {connect} from 'react-redux';
import {SelectionRecord} from '../App';
import {Header, List, Card} from 'semantic-ui-react';
import {selectAll} from 'd3';
import {hashCode} from '../Utils';
import {AppStore} from '../Stores/CombinedStore';
// import Events from '../Stores/Types/EventEnum';
// import {studyProvenance} from '..';
// import {StudyState} from '../Stores/Study/StudyState';

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

  // const detailedSelectedList = selectedLists.map(idx => data[idx]);

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
        {/* <Label>{`Selected Items: ${pointSelectionsCount} (Click)`}</Label> */}
        {/* <Label>{`Selected Items: ${intersectionCount} (Intersection)`}</Label> */}
        {/* <Label>{`Selected Items: ${unionCount} (Union)`}</Label> */}
        {/* <Label>{`Selected Items: ${totalSelections} (Total)`}</Label> */}
        <svg height="150" width="100%">
          <rect
            height="100%"
            width="100%"
            fill="#375E97"
            opacity="0.1"
            stroke="#375E97"
            strokeWidth="3px"></rect>
          <text transform={`translate(10, ${15})`} dominantBaseline="middle">
            {`Total: ${totalSelections}`}
          </text>

          <g transform={`translate(100, 75)`}>
            <circle r="50" stroke="none" fill="#FB6542" opacity="0.5" />
            <text
              transform={`translate(0, ${-34})`}
              style={{
                dominantBaseline: 'middle',
                textAnchor: 'middle',
                fontSize: '1.1em',
              }}>
              {`U: ${unionCount}`}
            </text>
            <circle r="25" stroke="none" fill="#3F681C" opacity="0.4" />
            <text
              style={{
                dominantBaseline: 'middle',
                textAnchor: 'middle',
                fontSize: '1.1em',
              }}>
              {`I: ${intersectionCount}`}
            </text>
          </g>
          <g transform={`translate(300, 75)`}>
            <circle r="50" fill="#FFBB00" opacity="0.5" />
            <text
              style={{
                fontFamily: 'FontAwesome',
                dominantBaseline: 'middle',
                textAnchor: 'middle',
                fontSize: '1.5em',
              }}>
              &#xf25a;
            </text>
            <text
              transform={`translate(0, ${30})`}
              style={{
                dominantBaseline: 'middle',
                textAnchor: 'middle',
                fontSize: '0.95em',
              }}>
              {`Clicked: ${pointSelectionsCount}`}
            </text>
          </g>
        </svg>
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
      {/* <Card.Content textAlign="center"> */}
      {/*   <Button */}
      {/*     primary */}
      {/*     disabled={selectedLists.length === 0} */}
      {/*     onClick={() => { */}
      {/*       studyProvenance.applyAction({ */}
      {/*         label: Events.SUBMIT_ANSWER, */}
      {/*         args: [], */}
      {/*         action: () => { */}
      {/*           let currentState = studyProvenance.graph().current.state; */}
      {/*           if (currentState) { */}
      {/*             currentState = { */}
      {/*               ...currentState, */}
      {/*               event: Events.SUBMIT_PREDICTION, */}
      {/*               answer: { */}
      {/*                 submissions: detailedSelectedList, */}
      {/*                 comment: '', */}
      {/*               }, */}
      {/*             }; */}
      {/*           } */}
      {/*           return currentState as StudyState; */}
      {/*         }, */}
      {/*       }); */}
      {/*       changeIsSubmitted(true); */}
      {/*     }}> */}
      {/*     Submit ({selectedLists.length} selected) */}
      {/*   </Button> */}
      {/* </Card.Content> */}
    </Card>
  );
};

export default connect(
  (state: AppStore): StateProps => ({
    dataset: state.visualization.dataset,
  }),
)(SelectionResults);

const resultsDivStyle: CSSProperties = {
  display: 'grid',
  gridTemplateRows: 'min-content 1fr min-content',
  height: '50vh',
  margin: 0,
  padding: '1em',
};
