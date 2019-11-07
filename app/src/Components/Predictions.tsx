import { scaleLinear, selectAll } from 'd3';
import React, { FC, RefObject, useRef } from 'react';
import { connect } from 'react-redux';
import { Button, Header, Label, Popup, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

import { Prediction } from '../contract';
import { Dataset } from '../Stores/Types/Dataset';
import { hashCode } from '../Utils';

interface OwnProps {
  dataset: Dataset;
}

interface StateProps {
  dimensions: string[];
  selectedIds: number[];
  predictions: Prediction[];
  time: number;
}

type Props = OwnProps & StateProps;

const Predictions: FC<Props> = ({
  dimensions,
  selectedIds,
  predictions,
  time,
  dataset
}: Props) => {
  const svgRef: RefObject<SVGSVGElement> = useRef<SVGSVGElement>(null);
  const { data, labelColumn } = dataset;

  if (!predictions) predictions = [];

  predictions.sort((a, b) => b.rank - a.rank);

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, svgRef.current ? svgRef.current.clientWidth : 0]);

  const barHeight = 30;

  if (!time) time = 0;

  const stringTime = time.toFixed(2);

  return (
    <div>
      <Segment>
        <Header as="h1" textAlign="center">
          Predictions
        </Header>

        {predictions.length > 0 && (
          <Label>{`Time required: ${stringTime} seconds`}</Label>
        )}
      </Segment>
      <PredictionsDiv>
        <svg ref={svgRef} height="100%" width="100%">
          {predictions.map((pred, idx) => {
            const { dataIds = [] } = pred;
            const countries = dataIds.map(d => hashCode(data[d][labelColumn]));

            let isHighlighted = false;
            return (
              <Popup
                key={idx}
                hoverable
                content={
                  <div>
                    <Header>{pred.intent}</Header>
                    <Button
                      compact
                      onClick={() => {
                        countries.forEach(code => {
                          if (
                            !selectAll(`.${code}`).classed(
                              "suggestion_highlight"
                            )
                          ) {
                            isHighlighted = false;
                            return;
                          }
                          isHighlighted = true;
                        });

                        if (!isHighlighted) {
                          selectAll(".mark").classed(
                            "suggestion_highlight",
                            false
                          );

                          countries.forEach(code => {
                            selectAll(`.${code}`).classed(
                              "suggestion_highlight",
                              true
                            );
                          });
                        } else {
                          countries.forEach(code => {
                            selectAll(`.${code}`).classed(
                              "suggestion_highlight",
                              false
                            );
                          });
                        }
                      }}
                      color={isHighlighted ? "red" : "blue"}
                      size="tiny"
                    >
                      {isHighlighted ? "Hide Items" : "Show Items"}
                    </Button>
                    <pre>
                      {JSON.stringify(
                        pred,
                        (key, val) => {
                          if (key === "dataIds") return undefined;
                          return val;
                        },
                        2
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
                      opacity="0.3"
                    ></rect>
                    <rect
                      height={barHeight}
                      width={barScale(pred.rank)}
                      fill="#A8D3EE"
                      opacity="0.9"
                    ></rect>
                    <text
                      transform={`translate(10, ${barHeight / 2})`}
                      dominantBaseline="middle"
                    >
                      {pred.intent}
                    </text>
                  </g>
                }
              ></Popup>
            );
          })}
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
    time: state.predictionSet.time
  };
};

export default connect(mapStateToProps)(Predictions);

const PredictionsDiv = styled("div")`
  padding: 1em;
  height: 100%;
  width: 100%;
`;
