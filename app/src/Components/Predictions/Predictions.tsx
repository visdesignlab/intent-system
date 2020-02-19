import React, {FC} from 'react';
import IntentStore from '../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import AnnotationBox from './AnnotationBox';
import {style} from 'typestyle';
import PredictionList from './PredictionList';

interface Props {
  store?: IntentStore;
}

const Predictions: FC<Props> = ({store}: Props) => {
  const {annotation, predictionSet} = store!;

  const {predictions} = predictionSet;

  return (
    <div className={predictionColumnStyle}>
      <AnnotationBox annotation={annotation} />
      <PredictionList annotation={annotation} predictions={predictions} />
    </div>
  );
};

export default inject('store')(observer(Predictions));

const predictionColumnStyle = style({
  gridArea: 'pred',
  height: '100vh',
  display: 'grid',
  gridTemplateRows: 'min-content minmax(0, 1fr) 0.5fr',
  gridTemplateAreas: `
  "annotation"
  "predictions"
  "selections"
  `,
});
