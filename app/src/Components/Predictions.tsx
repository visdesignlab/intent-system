import {scaleLinear, selectAll} from 'd3';
import React, {FC, RefObject, useRef, useState, CSSProperties} from 'react';
import {connect} from 'react-redux';
import {
  Button,
  Header,
  Label,
  Popup,
  Loader,
  Form,
  Card,
} from 'semantic-ui-react';

import {Prediction} from '../contract';
import {Dataset} from '../Stores/Types/Dataset';
import {hashCode} from '../Utils';
import {PredictionState} from '../Stores/Predictions/PredictionsState';
import Events from '../Stores/Types/EventEnum';
import {studyProvenance, taskManager} from '..';
import {StudyState} from '../Stores/Study/StudyState';

interface OwnProps {
  isExploreMode: boolean;
  dataset: Dataset;
  isSubmitted: boolean;
}

interface StateProps {
  dimensions: string[];
  selectedIds: number[];
  predictions: Prediction[];
  time: number;
  isLoading: boolean;
}

type Props = OwnProps & StateProps;

const Predictions: FC<Props> = ({
  isSubmitted,
  dimensions,
  selectedIds,
  predictions,
  time,
  dataset,
  isLoading,
}: Props) => {
  const svgRef: RefObject<SVGSVGElement> = useRef<SVGSVGElement>(null);
  const {data, labelColumn} = dataset;

  const [selectedPrediction, setSelectedPrediction] = useState<Prediction>(
    null as any,
  );
  const [predictionComment, setPredictionComment] = useState('');
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  if (!predictions) predictions = [];

  predictions.sort((a, b) => b.rank - a.rank);

  const barScale = scaleLinear()
    .domain([0, 1])
    .range([0, svgRef.current ? svgRef.current.clientWidth : 0]);

  const barHeight = 30;

  if (!time) time = 0;

  const stringTime = time.toFixed(2);

  const loadingScreen = (
    <Loader
      size="massive"
      active
      inline="centered"
      style={{
        display: 'absolute',
      }}>
      Recomputing
    </Loader>
  );

  if (predictions.length > 0) {
    const regression: Prediction = {
      intent: 'Regression',
      rank: 0,
      info: undefined,
      dataIds: [],
    };

    const knowledge: Prediction = {
      intent: 'Domain Knowledge',
      rank: 0,
      info: undefined,
      dataIds: [],
    };

    const other: Prediction = {
      intent: 'Other',
      rank: 0,
      info: undefined,
      dataIds: [],
    };
    predictions = [...predictions, regression, knowledge, other];
  }

  const detailedDimensionList: string[] = dimensions
    ? dimensions.map(d => dataset.columnMaps[d].text)
    : [];

  return (
    <Card fluid style={masterPredictionDiv}>
      <Card.Content>
        <Header as="h1" textAlign="center">
          Intents
          <Label>{`Time required: ${stringTime} seconds`}</Label>
        </Header>
      </Card.Content>
      <Card.Content
        style={{
          overflow: 'scroll',
        }}>
        {isLoading && loadingScreen}
        <svg
          ref={svgRef}
          height={(barHeight + 5) * predictions.length}
          width="100%">
          {!isLoading &&
            predictions.map((pred, idx) => {
              const {dataIds = []} = pred;
              const countries = dataIds.map(d =>
                hashCode(data[d][labelColumn]),
              );

              let isHighlighted = false;

              const info: any = pred.info;
              const {probability} = info || 0;

              const {intent} = pred;

              let intentName = '';

              if (intent.includes('Cluster')) {
                intentName = `Cluster ${intent.split(':').reverse()[0]}`;
              } else if (intent.includes('Category')) {
                intentName = `${intent.split(':').reverse()[0]}`;
              } else if (intent.includes('Skyline')) {
                const minMax = intent
                  .split(':')
                  .reverse()[0]
                  .split(';');
                console.log(minMax);
                intentName = `Skyline across: ${detailedDimensionList
                  .map((d, i) => `${d} (${minMax[i]})`)
                  .join(' - ')}`;
              }

              return (
                <g
                  key={idx}
                  transform={`translate(0, ${(barHeight + 5) * idx})`}
                  onClick={() => {
                    console.log(pred);
                    if (!isSubmitted) return;
                    if (
                      selectedPrediction &&
                      pred.intent === selectedPrediction.intent
                    )
                      setSelectedPrediction(null as any);
                    else setSelectedPrediction(pred);
                  }}>
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
                  {probability && (
                    <line
                      stroke="black"
                      strokeWidth={0.5}
                      x1={barScale(probability)}
                      x2={barScale(probability)}
                      y1="0"
                      y2={barHeight}></line>
                  )}
                  <text
                    style={{
                      textTransform: 'capitalize',
                    }}
                    transform={`translate(10, ${barHeight / 2})`}
                    dominantBaseline="middle">
                    {intentName ? intentName : pred.intent}
                  </text>
                  {selectedPrediction &&
                    selectedPrediction.intent === pred.intent && (
                      <rect
                        height={barHeight}
                        width={svgRef.current ? svgRef.current.clientWidth : 0}
                        stroke="black"
                        fill="none"
                        opacity="1"></rect>
                    )}
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
                                  'suggestion_highlight',
                                )
                              ) {
                                isHighlighted = false;
                                return;
                              }
                              isHighlighted = true;
                            });

                            if (!isHighlighted) {
                              selectAll('.mark').classed(
                                'suggestion_highlight',
                                false,
                              );

                              if (pred.intent === 'Range') {
                                console.log('Test');
                              } else {
                                countries.forEach(code => {
                                  selectAll(`.${code}`).classed(
                                    'suggestion_highlight',
                                    true,
                                  );
                                });
                              }
                            } else {
                              countries.forEach(code => {
                                selectAll(`.${code}`).classed(
                                  'suggestion_highlight',
                                  false,
                                );
                              });
                            }
                          }}
                          size="tiny"
                          primary>
                          {isHighlighted ? 'Hide Items' : 'Show Items'}
                        </Button>
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
                    position="top right"
                    trigger={
                      <text
                        transform={`translate(${(svgRef.current
                          ? svgRef.current.clientWidth
                          : 0) - 20}, ${barHeight / 2})`}
                        style={{
                          fontFamily: 'FontAwesome',
                          fontSize: '1em',
                          dominantBaseline: 'middle',
                          opacity: 0.3,
                        }}>
                        &#xf05a;
                      </text>
                    }></Popup>
                </g>
              );
            })}
        </svg>
      </Card.Content>
      <Card.Content textAlign="center">
        <Form>
          <Form.TextArea
            disabled={selectedPrediction === null}
            required={
              selectedPrediction &&
              ['Regression', 'Domain Knowledge', 'Other'].includes(
                selectedPrediction.intent,
              )
            }
            value={predictionComment.length > 0 ? predictionComment : ''}
            onChange={(_, data) => setPredictionComment(data.value as string)}
            label="More Info"
            placeholder="Please tell us more about your intent"></Form.TextArea>
          {!finalSubmitted ? (
            <Form.Field
              disabled={selectedPrediction === null}
              control={Button}
              primary
              onClick={() => {
                if (
                  selectedPrediction &&
                  ['Regression', 'Domain Knowledge', 'Other'].includes(
                    selectedPrediction.intent,
                  ) &&
                  predictionComment.length === 0
                )
                  return;
                studyProvenance.applyAction({
                  label: Events.SUBMIT_PREDICTION,
                  action: () => {
                    let currentState = studyProvenance.graph().current.state;
                    if (currentState) {
                      currentState = {
                        ...currentState,
                        event: Events.SUBMIT_PREDICTION,
                        predictionSet: {
                          dimensions,
                          selectedIds,
                          predictions,
                        },
                        selectedPrediction: {
                          prediction: selectedPrediction,
                          comment: predictionComment,
                        },
                      };
                    }
                    return currentState as StudyState;
                  },
                  args: [],
                });
                setFinalSubmitted(true);
              }}>
              Submit
            </Form.Field>
          ) : (
            <Form.Field
              control={Button}
              onClick={() => {
                console.log('Hello');
                taskManager.advanceTask();
              }}
              color="green">
              Next
            </Form.Field>
          )}
        </Form>
      </Card.Content>
    </Card>
  );
};

const mapStateToProps = (state: PredictionState): StateProps => {
  return {
    dimensions: state.predictionSet.dimensions,
    selectedIds: state.predictionSet.selectedIds,
    predictions: state.predictionSet.predictions,
    time: (state.predictionSet as any).time,
    isLoading: state.isLoading,
  };
};

export default connect(mapStateToProps)(Predictions);

const masterPredictionDiv: CSSProperties = {
  height: '50vh',
  margin: '0',
  display: 'grid',
  gridTemplateRows: 'min-content 1fr min-content',
  padding: '1em',
};
