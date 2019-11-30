import React, {FC, useRef, CSSProperties} from 'react';
import {scaleLinear} from 'd3';
import {PredictionType} from '../../Stores/Predictions/PredictionsState';
import {TypedPrediction} from './PredictionList';
import {Dataset} from '../../Stores/Types/Dataset';

interface Props {
  dataset: Dataset;
  barHeight: number;
  prediction: TypedPrediction;
  selectedIds: number[];
}

export const PredictionListJaccardItem: FC<Props> = ({
  prediction,
  barHeight,
}: Props) => {
  let barColor = '#A8D3EE';

  const svgRef = useRef<SVGSVGElement>(null);
  const maxWidth = svgRef.current ? svgRef.current.clientWidth : 0;
  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, maxWidth]);

  const {intent, type} = prediction;
  let [
    hash = '',
    dimensions = '',
    intentName = '',
    intentDetails = '',
    info = '',
  ] =
    type === PredictionType.Range
      ? ['', '', intent, '', '']
      : intent.split(':');

  if (type === PredictionType.Category) {
    if (intentName.includes(PredictionType.Category)) {
      const splitNames = intentName.split('|');
      if (splitNames.length > 0)
        intentName = `Category: ${splitNames.reverse()[0]}`;
    } else if (info.includes(PredictionType.Category)) {
      const splitNames = info.split('|');
      if (splitNames.length > 0)
        intentName = `Category: ${splitNames.reverse()[0]}`;
    }
  }

  return (
    <svg
      key={`${hash}${dimensions}${intentName}${intentDetails}${info}`}
      ref={svgRef}
      height={barHeight}
      width="100%">
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
        <tspan>{`${intentName} `}</tspan>
      </text>
    </svg>
  );
};

export const PredictionListNBItem: FC<Props> = ({
  prediction,
  barHeight,
}: Props) => {
  const {intent, type} = prediction;
  let [
    hash = '',
    dimensions = '',
    intentName = '',
    intentDetails = '',
    info = '',
  ] =
    type === PredictionType.Range
      ? ['', '', intent, '', '']
      : intent.split(':');

  const svgRef = useRef<SVGSVGElement>(null);

  let barColor = '#f8bf84';

  const maxWidth = svgRef.current ? svgRef.current.clientWidth : 0;

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, maxWidth]);

  let barValue = 0;

  if (prediction.info) barValue = (prediction.info as any).probability || 0;

  return (
    <svg
      key={`${hash}${dimensions}${intentName}${intentDetails}${info}`}
      ref={svgRef}
      height={barHeight}
      width="100%">
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
        {barValue.toFixed(2)}
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
