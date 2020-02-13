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
  const count = plots.length > 1 ? 2 : 1;

  const dimension =
    height / count > width / count ? width / count : height / count;

  return (
    <div className={flexStyle}>
      {plots.map(plot => (
        <Scatterplot
          plot={plot}
          key={plot.id}
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
