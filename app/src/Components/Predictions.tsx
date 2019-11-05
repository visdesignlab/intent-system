import React, {FC, RefObject, useRef} from 'react';
import {Prediction} from '../contract';
import {connect} from 'react-redux';
import {Segment, Header, Popup} from 'semantic-ui-react';
import styled from 'styled-components';
import {min, max, scaleLinear} from 'd3';

interface OwnProps {}

interface StateProps {
  dimensions: string[];
  selectedIds: number[];
  predictions: Prediction[];
}

type Props = OwnProps & StateProps;

const Predictions: FC<Props> = ({
  dimensions,
  selectedIds,
  predictions,
}: Props) => {
  const svgRef: RefObject<SVGSVGElement> = useRef<SVGSVGElement>(null);

  if (!predictions) predictions = [];

  predictions.sort((a, b) => b.rank - a.rank);

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, svgRef.current ? svgRef.current.clientWidth : 0]);

  const barHeight = 30;

  return (
    <div>
      <Segment>
        <Header as="h1" textAlign="center">
          Predictions
        </Header>
      </Segment>
      <PredictionsDiv>
        <svg ref={svgRef} height="100%" width="100%">
          {predictions.map((pred, idx) => (
            <Popup
              key={idx}
              content={
                <div>
                  <Header>{pred.intent}</Header>
                  <pre>
                    {JSON.stringify(
                      pred,
                      (key, val) => {
                        if (key === 'dataIds') return undefined;
                        return val;
                      },
                      2,
                    )}
                  </pre>
                </div>
              }
              trigger={
                <g transform={`translate(0, ${(barHeight + 5) * idx})`}>
                  <rect
                    height={barHeight}
                    width={svgRef.current ? svgRef.current.clientWidth : 0}
                    fill="#A8D3EE"
                    opacity="0.3"></rect>
                  <rect
                    height={barHeight}
                    width={barScale(pred.rank)}
                    fill="#A8D3EE"
                    opacity="0.9"></rect>
                  <text
                    transform={`translate(10, ${barHeight / 2})`}
                    dominantBaseline="middle">
                    {pred.intent}
                  </text>
                </g>
              }></Popup>
          ))}
        </svg>
      </PredictionsDiv>
    </div>
  );
};

const mapStateToProps = (state: any): StateProps => {
  console.log(state.predictionSet);
  return {
    dimensions: state.predictionSet.dimensions,
    selectedIds: state.predictionSet.selectedIds,
    predictions: state.predictionSet.predictions,
  };
};

export default connect(mapStateToProps)(Predictions);

const PredictionsDiv = styled('div')`
  padding: 1em;
  height: 100%;
  width: 100%;
`;
