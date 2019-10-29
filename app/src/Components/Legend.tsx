import React, {FC} from 'react';
import {ScaleOrdinal} from 'd3';

interface OwnProps {
  values: string[];
  height: number;
  width: number;
  colorScale: ScaleOrdinal<string, unknown>;
}

interface StateProps {}

type Props = OwnProps & StateProps;

const Legend: FC<Props> = ({values, height, width, colorScale}: Props) => {
  const padding = 5;
  const cellWidth = width / values.length;
  height = height - 2 * padding;
  width = cellWidth - 2 * padding;
  console.log(values);
  return (
    <g>
      {values.map((val, i) => (
        <g key={val} transform={`translate(${cellWidth * i},${padding})`}>
          <circle
            transform="translate(15, 20)"
            r="10"
            fill={colorScale(val) as string}></circle>
          <text
            dominantBaseline="middle"
            textAnchor="start"
            transform={'translate(40, 20)'}>
            {val}
          </text>
          <rect
            height={height}
            width={width}
            stroke="black"
            fill="#eee"
            opacity="0.3"></rect>
        </g>
      ))}
    </g>
  );
};

export default Legend;
