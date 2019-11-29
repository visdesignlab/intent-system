import React, {FC, CSSProperties, useMemo} from 'react';
import {connect} from 'react-redux';
import {Header, Label, Loader, Card} from 'semantic-ui-react';

import {Prediction} from '../contract';
import {Dataset} from '../Stores/Types/Dataset';
import {AppState} from '../Stores/CombinedStore';
import PredictionList from './PredictionComponents/PredictionList';
import {SelectionRecord} from '../App';

interface OwnProps {
  isExploreMode: boolean;
  dataset: Dataset;
  isSubmitted: boolean;
  selectionRecord: SelectionRecord;
}

interface StateProps {
  dimensions: string[];
  selectedIds: number[];
  predictions: Prediction[];
  time: number;
  isLoading: boolean;
}

type Props = OwnProps & StateProps;

const Predictions: FC<Props> = ({
  predictions,
  time,
  dataset,
  isLoading,
  selectionRecord,
}: Props) => {
  if (!predictions) predictions = [];

  const selectionRecordString = JSON.stringify(selectionRecord);

  const memoizedSelectionRecord: SelectionRecord = useMemo(
    () => JSON.parse(selectionRecordString),
    [selectionRecordString],
  );

  predictions.sort((a, b) => b.rank - a.rank);

  const barHeight = 30;

  if (!time) time = 0;

  const stringTime = time.toFixed(2);

  const loadingScreen = (
    <Loader
      size="massive"
      active
      inline="centered"
      style={{
        display: 'absolute',
      }}>
      Recomputing
    </Loader>
  );

  return (
    <Card fluid style={masterPredictionDiv}>
      <Card.Content>
        <Header as="h1" textAlign="center">
          Predictions
          <Label>{`Time required: ${stringTime} seconds`}</Label>
        </Header>
      </Card.Content>
      <Card.Content
        style={{
          overflow: 'auto',
        }}>
        {isLoading && loadingScreen}
        <PredictionList
          selectionRecord={memoizedSelectionRecord}
          dataset={dataset}
          barHeight={barHeight}
          predictions={predictions}
        />
      </Card.Content>
      <Card.Content textAlign="center">
        {/* <Form> */}
        {/*   <Form.TextArea */}
        {/*     disabled={selectedPrediction === null} */}
        {/*     required={ */}
        {/*       selectedPrediction && */}
        {/*       ['Regression', 'Domain Knowledge', 'Other'].includes( */}
        {/*         selectedPrediction.intent, */}
        {/*       ) */}
        {/*     } */}
        {/*     value={predictionComment.length > 0 ? predictionComment : ''} */}
        {/*     onChange={(_, data) => setPredictionComment(data.value as string)} */}
        {/*     label="More Info" */}
        {/*     placeholder="Please tell us more about your intent"></Form.TextArea> */}
        {/*   {!finalSubmitted ? ( */}
        {/*     <Form.Field */}
        {/*       disabled={selectedPrediction === null} */}
        {/*       control={Button} */}
        {/*       primary */}
        {/*       onClick={() => { */}
        {/*         if ( */}
        {/*           selectedPrediction && */}
        {/*           ['Regression', 'Domain Knowledge', 'Other'].includes( */}
        {/*             selectedPrediction.intent, */}
        {/*           ) && */}
        {/*           predictionComment.length === 0 */}
        {/*         ) */}
        {/*           return; */}
        {/*         studyProvenance.applyAction({ */}
        {/*           label: Events.SUBMIT_PREDICTION, */}
        {/*           action: () => { */}
        {/*             let currentState = studyProvenance.graph().current.state; */}
        {/*             if (currentState) { */}
        {/*               currentState = { */}
        {/*                 ...currentState, */}
        {/*                 event: Events.SUBMIT_PREDICTION, */}
        {/*                 predictionSet: { */}
        {/*                   dimensions, */}
        {/*                   selectedIds, */}
        {/*                   predictions, */}
        {/*                 }, */}
        {/*                 selectedPrediction: { */}
        {/*                   prediction: selectedPrediction, */}
        {/*                   comment: predictionComment, */}
        {/*                 }, */}
        {/*               }; */}
        {/*             } */}
        {/*             return currentState as StudyState; */}
        {/*           }, */}
        {/*           args: [], */}
        {/*         }); */}
        {/*         setFinalSubmitted(true); */}
        {/*       }}> */}
        {/*       Submit */}
        {/*     </Form.Field> */}
        {/*   ) : ( */}
        {/*     <Form.Field */}
        {/*       control={Button} */}
        {/*       onClick={() => { */}
        {/*         console.log('Hello'); */}
        {/*         taskManager.advanceTask(); */}
        {/*       }} */}
        {/*       color="green"> */}
        {/*       Next */}
        {/*     </Form.Field> */}
        {/*   )} */}
        {/* </Form> */}
      </Card.Content>
    </Card>
  );
};

const mapStateToProps = (state: AppState): StateProps => {
  return {
    dimensions: state.predictionSet.dimensions,
    selectedIds: state.predictionSet.selectedIds,
    predictions: state.predictionSet.predictions,
    time: (state.predictionSet as any).time,
    isLoading: state.isLoading,
  };
};

export default connect(mapStateToProps)(Predictions);

const masterPredictionDiv: CSSProperties = {
  height: '50vh',
  margin: '0',
  display: 'grid',
  gridTemplateRows: 'min-content 1fr min-content',
  padding: '1em',
};
