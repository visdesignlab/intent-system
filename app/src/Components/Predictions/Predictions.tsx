import React, {FC, useState, memo} from 'react';
import IntentStore from '../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import AnnotationBox from './AnnotationBox';
import {style} from 'typestyle';
import PredictionList from './PredictionList';
import Selections from './Selections';
import {
  getAllSelections,
  UserSelections,
  defaultSelections,
} from './PredictionRowType';

interface Props {
  store?: IntentStore;
}

const Predictions: FC<Props> = ({store}: Props) => {
  const {annotation, plots, multiBrushBehaviour} = store!;

  const [selections, setSelections] = useState<UserSelections>(
    defaultSelections,
  );

  const computedSelections = getAllSelections(
    plots,
    multiBrushBehaviour === 'Union',
  );

  if (JSON.stringify(computedSelections) !== JSON.stringify(selections)) {
    setSelections(computedSelections);
  }

  return (
    <div className={predictionColumnStyle}>
      <AnnotationBox annotation={annotation} />
      <PredictionList selections={selections.values} />
      <Selections selections={selections} />
    </div>
  );
};

export default memo(inject('store')(observer(Predictions)));

const predictionColumnStyle = style({
  gridArea: 'pred',
  height: '100vh',
  display: 'grid',
  gridTemplateRows: 'min-content 1fr 0.5fr',
  gridTemplateAreas: `
  "annotation"
  "predictions"
  "selections"
  `,
});
