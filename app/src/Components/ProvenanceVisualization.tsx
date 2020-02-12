import React, {FC, useRef, useState, useEffect} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../Store/IntentStore';
import {style} from 'typestyle';
import {ProvVis} from '@visdesignlab/provvis';

interface Props {
  store?: IntentStore;
}

const ProvenanceVisualization: FC<Props> = ({store}: Props) => {
  const {graph} = store!;
  const ref = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({height: 0, width: 0});

  useEffect(() => {
    const current = ref.current;
    if (current && dimensions.width === 0 && dimensions.height === 0) {
      setDimensions({
        height: current.clientHeight,
        width: current.clientWidth,
      });
    }
  }, [dimensions]);

  const {width, height} = dimensions;

  return (
    <div ref={ref} className={provStyle}>
      {dimensions.width && dimensions.height && (
        <ProvVis
          graph={graph}
          root={graph.root}
          current={graph.current}
          nodeMap={graph.nodes}
          width={width}
          height={height}
          verticalSpace={20}
          textSize={12}
        />
      )}
    </div>
  );
};

(ProvenanceVisualization as any).whyDidYouRender = true;
export default inject('store')(observer(ProvenanceVisualization));

const provStyle = style({gridArea: 'prov'});
