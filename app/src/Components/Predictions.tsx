import React, {FC} from 'react';
import {PredictionSet, Prediction} from '../contract';
import {PredictionState} from '../Stores/Predictions/PredictionsState';
import {connect} from 'react-redux';

interface OwnProps {}

interface StateProps {
  dimensions: string[];
  selectedIds: number[];
  predictions: Prediction[];
}

type Props = OwnProps & StateProps;

const Predictions: FC<Props> = ({
  dimensions,
  selectedIds,
  predictions,
}: Props) => {
  if (!predictions) predictions = [];

  console.log(predictions);

  return (
    <div>
      {predictions.map(pred => (
        <div key={Math.random()}>{pred.intent}</div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: any): StateProps => {
  console.log(state.predictionSet);
  return {
    dimensions: state.predictionSet.dimensions,
    selectedIds: state.predictionSet.selectedIds,
    predictions: state.predictionSet.predictions,
  };
};

export default connect(mapStateToProps)(Predictions);
