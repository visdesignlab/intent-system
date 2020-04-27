import { axisBottom, ScaleLinear, select } from 'd3';
import { inject, observer } from 'mobx-react';
import React, { FC, useEffect, useRef } from 'react';

import IntentStore from '../../Store/IntentStore';
import { ColumnDef } from '../../Utils/Dataset';
import translate from '../../Utils/Translate';

interface Props {
  store?: IntentStore;
  scale: ScaleLinear<number, number>;
  width: number;
  dimension: ColumnDef;
}

const XAxis: FC<Props> = ({ store, width, scale, dimension }: Props) => {
  const axisRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const current = axisRef.current;
    if (current) {
      const axis = axisBottom(scale).tickFormat((d: any) => {
        if (d >= 1000000)
          return `${d.toString()[0]}e${d.toString().length - 1}`;
        if (d >= 500000) return `${d / 100000}M`;
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
          transform={translate(width / 2, 35)}
          fontSize="1.1em"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <tspan>{`${dimension.short} | `}</tspan>
          <tspan style={{ fontWeight: "bold" }}>{` ${dimension.text} `}</tspan>
          {dimension.unit.length > 0 && <tspan>{`(${dimension.unit})`}</tspan>}
        </text>
      </>
    )
  );
};

export default inject("store")(observer(XAxis));
