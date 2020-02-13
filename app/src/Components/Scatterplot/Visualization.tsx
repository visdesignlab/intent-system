import React, {FC, useRef, useState, useEffect} from 'react';
import IntentStore from '../../Store/IntentStore';
import {style} from 'typestyle';
import {inject, observer} from 'mobx-react';
import {ProvenanceActions} from '../../Store/Provenance';
import PlotsGrid from './PlotsGrid';

export interface Props {
  store?: IntentStore;
  actions: ProvenanceActions;
}

const Visualization: FC<Props> = ({store, actions}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({height: 0, width: 0});

  useEffect(() => {
    const {height, width} = dims;
    const current = ref.current;
    if (current && height === 0 && width === 0) {
      if (current) {
        setDims({
          height: current.clientHeight,
          width: current.clientWidth,
        });
      }
    }
  }, [dims]);

  const {height, width} = dims;
  const adjustedHeight = height * 1;
  const adjustedWidth = width * 1;

  return (
    <div ref={ref} className={plotStyle}>
      <PlotsGrid height={adjustedHeight} width={adjustedWidth} />
    </div>
  );
};

(Visualization as any).whyDidYouRender = true;
export default inject('store')(observer(Visualization));

const plotStyle = style({
  gridArea: 'plot',
});
