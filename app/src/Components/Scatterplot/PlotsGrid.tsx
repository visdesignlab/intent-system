import { inject, observer } from 'mobx-react';
import React, { FC, memo, useState } from 'react';
import { style } from 'typestyle';

import IntentStore from '../../Store/IntentStore';
import { defaultSelections, getAllSelections, UserSelections } from '../Predictions/PredictionRowType';
import Scatterplot from './Scatterplot';

interface Props {
  store?: IntentStore;
  height: number;
  width: number;
}

const PlotsGrid: FC<Props> = ({ store, height, width }: Props) => {
  let { plots, multiBrushBehaviour } = store!;

  if (plots === undefined) {
    plots = [];
  }

  const plotCount = plots.length < 5 ? plots.length : 4;
  const breakCount = 2;

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

  let rowCount = Math.floor(plotCount / breakCount);

  if (rowCount === 0) {
    rowCount += 1;
  } else if (plotCount > breakCount && plotCount % breakCount !== 0) {
    rowCount += 1;
  }

  const columnCount = plotCount >= breakCount ? breakCount : plotCount;

  const dividedHeight = height / rowCount;
  const dividedWidth = width / columnCount;

  let dimension = dividedWidth < dividedHeight ? dividedWidth : dividedHeight;
  dimension -= 10;

  return (
    <div className={flexStyle}>
      {plots.map((plot) => (
        <Scatterplot
          key={`${plot.id}${dimension}`}
          plot={plot}
          height={dimension}
          width={dimension}
          selections={selections}
        />
      ))}
    </div>
  );
};

(PlotsGrid as any).whyDidYouRender = true;
export default memo(inject("store")(observer(PlotsGrid)));

const flexStyle = style({
  height: `100%`,
  width: `100%`,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "flex-start",
  justifyContent: "center",
});
