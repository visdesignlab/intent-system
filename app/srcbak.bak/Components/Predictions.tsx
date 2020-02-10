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
  clearAll: () => void;
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
  clearAll,
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
          clearAll={clearAll}
          selectionRecord={memoizedSelectionRecord}
          dataset={dataset}
          barHeight={barHeight}
          predictions={predictions}
        />
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
  margin: '0',
  display: 'grid',
  gridTemplateRows: 'min-content 1fr min-content',
  padding: '1em',
};
