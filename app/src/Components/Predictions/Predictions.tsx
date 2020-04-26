import { inject, observer } from 'mobx-react';
import React, { FC, memo, useContext, useState } from 'react';
import { style } from 'typestyle';

import { TaskConfigContext } from '../../Contexts';
import IntentStore from '../../Store/IntentStore';
import AnnotationBox from './AnnotationBox';
import PredictionList from './PredictionList';
import { defaultSelections, getAllSelections, UserSelections } from './PredictionRowType';
import Selections from './Selections';

interface Props {
  store?: IntentStore;
}

const Predictions: FC<Props> = ({ store }: Props) => {
  const { plots, multiBrushBehaviour } = store!;

  const taskConfig = useContext(TaskConfigContext);

  const { task, isManual = false } = taskConfig || {};

  const [selections, setSelections] = useState<UserSelections>(
    defaultSelections
  );

  const computedSelections = getAllSelections(
    plots,
    multiBrushBehaviour === "Union"
  );

  if (JSON.stringify(computedSelections) !== JSON.stringify(selections)) {
    setSelections(computedSelections);
  }

  return (
    <div className={predictionColumnStyle(!isManual)}>
      {!task && <AnnotationBox selections={selections.values} />}
      {!isManual && <PredictionList selections={selections.values} />}
      {!task && <Selections selections={selections} />}
    </div>
  );
};

export default memo(inject("store")(observer(Predictions)));

const predictionColumnStyle = (predictionSupport: boolean) => {
  const gridTemplateRows = predictionSupport
    ? "min-content 1fr 0.75fr"
    : "min-content auto";
  const gridTemplateAreas = predictionSupport
    ? `
  "annotation"
  "predictions"
  "selections"
  `
    : `
  "annotation"
  "selections"
  `;

  return style({
    gridArea: "pred",
    height: "100vh",
    display: "grid",
    gridTemplateRows,
    gridTemplateAreas,
  });
};
