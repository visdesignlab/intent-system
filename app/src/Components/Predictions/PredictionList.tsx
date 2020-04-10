import { inject, observer } from 'mobx-react';
import React, { FC, memo, useContext, useState } from 'react';
import { Dimmer, Header, Loader, Segment } from 'semantic-ui-react';
import { style } from 'typestyle';

import { DataContext, TaskConfigContext } from '../../Contexts';
import IntentStore from '../../Store/IntentStore';
import { extendPrediction, PredictionRowType } from './PredictionRowType';
import PredictionTable from './PredictionTable';

interface Props {
  store?: IntentStore;
  selections: number[];
}

const PredictionList: FC<Props> = ({ store, selections }: Props) => {
  const { isLoadingPredictions, predictionSet } = store!;

  const { columnMap } = useContext(DataContext);
  const { predictions } = predictionSet;

  const task = useContext(TaskConfigContext);

  const [preds, setPreds] = useState<PredictionRowType[]>([]);

  let computedPreds = predictions
    .map(pred => extendPrediction(pred, selections, columnMap))
    .sort((a, b) => b.similarity - a.similarity);

  if (task) {
    computedPreds = computedPreds
      .filter(
        d =>
          !task ||
          (d.type !== "Range" &&
            d.type !== "Simplified Range" &&
            d.type !== "Category")
      )
      .sort((a, b) => b.similarity - a.similarity);
  }

  if (JSON.stringify(computedPreds) !== JSON.stringify(preds)) {
    setPreds(computedPreds);
  }

  const predictionTable = (
    <PredictionTable predictions={preds} isTask={task !== null} />
  );

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
export default memo(inject("store")(observer(PredictionList)));

const listStyle = style({
  gridArea: "predictions",
  overflow: "auto"
});
