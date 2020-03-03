import React, {FC, useContext, memo, useState} from 'react';
import IntentStore from '../../Store/IntentStore';
import {Loader, Segment, Dimmer, Header} from 'semantic-ui-react';
import {inject, observer} from 'mobx-react';
import {style} from 'typestyle';
import PredictionTable from './PredictionTable';
import {extendPrediction, PredictionRowType} from './PredictionRowType';
import {DataContext} from '../../App';

export interface Props {
  store?: IntentStore;
  selections: number[];
}

const PredictionList: FC<Props> = ({store, selections}: Props) => {
  const {isLoadingPredictions, predictionSet} = store!;

  const {columnMap} = useContext(DataContext);

  const {predictions} = predictionSet;

  const [preds, setPreds] = useState<PredictionRowType[]>([]);

  const computedPreds = predictions
    .map(pred => extendPrediction(pred, selections, columnMap))
    .sort((a, b) => b.similarity - a.similarity);

  if (JSON.stringify(computedPreds) !== JSON.stringify(preds)) {
    setPreds(computedPreds);
  }

  const predictionTable = <PredictionTable predictions={preds} />;

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

(PredictionList as any).whyDidYouRender = true;
export default memo(inject('store')(observer(PredictionList)));

const listStyle = style({
  gridArea: 'predictions',
  overflow: 'auto',
});
