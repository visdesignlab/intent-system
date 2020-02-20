import React, {FC} from 'react';
import IntentStore from '../../Store/IntentStore';
import {Loader, Segment, Dimmer, Header} from 'semantic-ui-react';
import {inject, observer} from 'mobx-react';
import {style} from 'typestyle';
import PredictionTable from './PredictionTable';
import {extendPrediction, getAllSelections} from './PredictionRowType';

export interface Props {
  store?: IntentStore;
}

const PredictionList: FC<Props> = ({store}: Props) => {
  const {
    isLoadingPredictions,
    predictionSet,
    plots,
    multiBrushBehaviour,
  } = store!;

  const {predictions} = predictionSet;

  const selections = getAllSelections(plots, multiBrushBehaviour === 'Union');

  const preds = predictions.map(pred => extendPrediction(pred, selections));
  if (preds.length > 0) {
    console.clear();
    console.table(preds.sort((a, b) => b.similarity - a.similarity));
  }

  const predictionTable = <PredictionTable predictions={predictions} />;

  const loadingComponent = (
    <Segment placeholder basic>
      <Dimmer active inverted>
        <Loader inverted active>
          Recompute
        </Loader>
      </Dimmer>
    </Segment>
  );

  return (
    <div className={listStyle}>
      {isLoadingPredictions ? (
        loadingComponent
      ) : predictions.length ? (
        predictionTable
      ) : (
        <Segment basic placeholder textAlign="center">
          <Header>Interact to load predictions</Header>
        </Segment>
      )}
    </div>
  );
};

export default inject('store')(observer(PredictionList));

const listStyle = style({
  gridArea: 'predictions',
  overflow: 'scroll',
});
