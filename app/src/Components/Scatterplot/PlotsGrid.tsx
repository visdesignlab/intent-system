import React, {FC} from 'react';
import IntentStore from '../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import {style} from 'typestyle';
import Scatterplot from './Scatterplot';

interface Props {
  store?: IntentStore;
  height: number;
  width: number;
}

const PlotsGrid: FC<Props> = ({store, height, width}: Props) => {
  const {plots} = store!;

  const plotCount = plots.length < 5 ? plots.length : 4;
  const breakCount = 2;

  let rowCount = Math.floor(plotCount / breakCount);
  if (rowCount === 0) {
    rowCount += 1;
  } else if (plotCount > breakCount && plotCount % breakCount !== 0) {
    rowCount += 1;
  }

  const columnCount = plotCount >= breakCount ? breakCount : plotCount;

  const dividedHeight = height / rowCount;
  const dividedWidth = width / columnCount;

  const dimension = dividedWidth < dividedHeight ? dividedWidth : dividedHeight;

  console.table(JSON.parse(JSON.stringify(plots)));

  return (
    <div className={flexStyle}>
      {plots.map(plot => (
        <Scatterplot
          key={`${plot.id}${dimension}`}
          plot={plot}
          height={dimension}
          width={dimension}
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
