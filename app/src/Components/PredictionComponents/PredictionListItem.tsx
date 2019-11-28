import React, {FC, useRef, CSSProperties} from 'react';
import {Prediction} from '../../contract';
import {scaleLinear} from 'd3';

interface Props {
  barHeight: number;
  prediction: Prediction;
}

export const PredictionListJaccardItem: FC<Props> = ({
  prediction,
  barHeight,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  let barColor = '#A8D3EE';

  const maxWidth = svgRef.current ? svgRef.current.clientWidth : 0;

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, maxWidth]);

  return (
    <svg ref={svgRef} height={barHeight} width="100%">
      <rect
        height={barHeight}
        width={maxWidth}
        style={backgroundBarStyle(barColor)}></rect>
      <rect
        height={barHeight}
        width={barScale(prediction.rank)}
        style={foregroundBarStyle(barColor)}></rect>
      <text
        dominantBaseline="middle"
        transform={`translate(10, ${barHeight / 2})`}>
        {prediction.intent}
      </text>
    </svg>
  );
};

export const PredictionListNBItem: FC<Props> = ({
  prediction,
  barHeight,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  let barColor = '#f8bf84';

  const maxWidth = svgRef.current ? svgRef.current.clientWidth : 0;

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, maxWidth]);

  let barValue = 0;

  if (prediction.info) barValue = (prediction.info as any).probability || 0;

  return (
    <svg ref={svgRef} height={barHeight} width="100%">
      <rect
        height={barHeight}
        width={maxWidth}
        style={backgroundBarStyle(barColor)}></rect>
      <rect
        height={barHeight}
        width={barScale(barValue)}
        style={foregroundBarStyle(barColor)}></rect>
      <text
        dominantBaseline="middle"
        transform={`translate(10, ${barHeight / 2})`}>
        {prediction.intent}
      </text>
    </svg>
  );
};

const backgroundBarStyle = (color: string): CSSProperties => ({
  fill: color,
  opacity: '0.3',
});

const foregroundBarStyle = (color: string): CSSProperties => ({
  fill: color,
  opacity: '0.9',
});
