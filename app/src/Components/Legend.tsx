import React, {FC} from 'react';
import {ScaleOrdinal} from 'd3';
import styled from 'styled-components';

interface OwnProps {
  values: string[];
  height: number;
  width: number;
  colorScale: ScaleOrdinal<string, unknown>;
  categorySymbolMap: any;
}

interface StateProps {}

type Props = OwnProps & StateProps;

const Legend: FC<Props> = ({
  values,
  height,
  width,
  categorySymbolMap,
}: Props) => {
  const padding = 5;
  const cellWidth = width / values.length;
  height = height - 2 * padding;
  width = cellWidth - 2 * padding;

  return (
    <g>
      {values.map((val, i) => (
        <g key={val} transform={`translate(${cellWidth * i},${padding})`}>
          <rect
            height={height}
            width={width}
            stroke="black"
            strokeWidth="0.5"
            fill="#eee"
            opacity="0.3"></rect>
          <path transform="translate(15, 20)" d={categorySymbolMap[val]}></path>
          <LegendText
            dominantBaseline="middle"
            textAnchor="start"
            transform={'translate(40, 20)'}>
            {val}
          </LegendText>
        </g>
      ))}
    </g>
  );
};

export default Legend;

const LegendText = styled('text')`
  text-transform: capitalize;
`;
