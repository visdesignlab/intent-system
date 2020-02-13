import React, {FC, useEffect, useRef} from 'react';
import IntentStore from '../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import {ScaleLinear, select, axisBottom, axisLeft} from 'd3';
import translate from '../../Utils/Translate';
import {ColumnDef} from '../../Utils/Dataset';

interface Props {
  store?: IntentStore;
  scale: ScaleLinear<number, number>;
  height: number;
  dimension: ColumnDef;
}

const YAxis: FC<Props> = ({store, height, scale, dimension}: Props) => {
  const axisRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const current = axisRef.current;
    if (current) {
      const axis = axisLeft(scale).tickFormat((d: any) => {
        if (d >= 500000) return `${d / 1000000}M`;
        if (d >= 1000) return `${d / 1000}K`;
        return d;
      });

      select(current).call(axis as any);
    }
  }, [scale]);

  return (
    dimension && (
      <>
        <g ref={axisRef} />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`${translate(-35, height / 2)}rotate(270)`}
          fontSize="1.2em">
          <tspan>{`${dimension.short} | `}</tspan>
          <tspan style={{fontWeight: 'bold'}}>{` ${dimension.text} `}</tspan>
          {dimension.unit.length > 0 && <tspan>{`(${dimension.unit})`}</tspan>}
        </text>
      </>
    )
  );
};

export default inject('store')(observer(YAxis));
