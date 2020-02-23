import React, {FC} from 'react';
import IntentStore from '../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import {style} from 'typestyle';
import Scatterplot from './Scatterplot';
import {getAllSelections} from '../Predictions/PredictionRowType';

interface Props {
  store?: IntentStore;
  height: number;
  width: number;
}

const PlotsGrid: FC<Props> = ({store, height, width}: Props) => {
  const {plots, multiBrushBehaviour} = store!;

  const plotCount = plots.length < 5 ? plots.length : 4;
  const breakCount = 2;

  const selections = getAllSelections(plots, multiBrushBehaviour === 'Union');

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
  dimension -= 8;

  return (
    <div className={flexStyle}>
      {plots.map(plot => (
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
export default inject('store')(observer(PlotsGrid));

const flexStyle = style({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
});
