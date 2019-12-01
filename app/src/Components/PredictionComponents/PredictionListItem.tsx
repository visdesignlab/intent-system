import React, {FC, useRef, CSSProperties, useState, useEffect} from 'react';
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
  const [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    if (svgRef.current) {
      if (maxWidth !== svgRef.current.clientWidth)
        setMaxWidth(svgRef.current.clientWidth);
    }
  }, [maxWidth]);

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, maxWidth]);

  let {intentName, type, _info, intentDetails} = prediction;
  const info = _info;

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
  } else if (type === PredictionType.QuadraticRegression) {
    if (intentDetails.includes('outside')) {
      intentName = 'Outside Quad. Reg.';
    }
    if (intentDetails.includes('within')) {
      intentName = 'Within Quad. Reg.';
    }
  } else if (type === PredictionType.LinearRegression) {
    if (intentDetails.includes('outside')) {
      intentName = 'Outside Lin. Reg.';
    }
    if (intentDetails.includes('within')) {
      intentName = 'Within Lin. Reg.';
    }
  }

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
        <tspan>{`${intentName} `}</tspan>
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

  const [maxWidth, setMaxWidth] = useState(0);

  useEffect(() => {
    if (svgRef.current) {
      if (maxWidth !== svgRef.current.clientWidth)
        setMaxWidth(svgRef.current.clientWidth);
    }
  }, [maxWidth]);

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, maxWidth]);

  let barValue = prediction.probability;

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
