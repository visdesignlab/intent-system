import React, {FC, useEffect, useRef} from 'react';
import IntentStore from '../../Store/IntentStore';
import {inject, observer} from 'mobx-react';
import {ScaleLinear, select, axisBottom} from 'd3';
import translate from '../../Utils/Translate';
import {ColumnDef} from '../../Utils/Dataset';

interface Props {
  store?: IntentStore;
  scale: ScaleLinear<number, number>;
  width: number;
  dimension: ColumnDef;
}

const XAxis: FC<Props> = ({store, width, scale, dimension}: Props) => {
  const axisRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const current = axisRef.current;
    if (current) {
      const axis = axisBottom(scale).tickFormat((d: any) => {
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
          transform={translate(width / 2, 40)}
          fontSize="1.2em"
          textAnchor="middle"
          dominantBaseline="middle">
          <tspan>{`${dimension.short} | `}</tspan>
          <tspan style={{fontWeight: 'bold'}}>{` ${dimension.text} `}</tspan>
          {dimension.unit.length > 0 && <tspan>{`(${dimension.unit})`}</tspan>}
        </text>
      </>
    )
  );
};

export default inject('store')(observer(XAxis));
