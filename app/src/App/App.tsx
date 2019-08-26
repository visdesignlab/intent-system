import { InteractionHistory, MultiBrushBehavior, PredictionSet, VisualizationType } from '@visdesignlab/intent-contract';
import { scaleLinear, select } from 'd3';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Checkbox, Container, ContainerProps, Header, Popup, Segment, SegmentProps } from 'semantic-ui-react';
import styled from 'styled-components';

import { VisStore } from '..';
import ScatterPlot from '../Components/Visualization/ScatterPlot/ScatterPlot';
import ScatterPlotMatrix from '../Components/Visualization/ScatterPlotMatrix/ScatterPlotMatrix';
import { MultiBrushBehaviorAction, MultiBrushBehaviorActions } from './VisStore/MultiBrushBehaviorReducer';
import { VisualizationChangeAction, VisualizationChangeActions } from './VisStore/VisualizationReducer';
import { VisualizationState } from './VisStore/VisualizationState';

interface StateProps {
  data: any[];
  columns: string[];
  numericColumns: string[];
  labelColumn: string;
  visualization: VisualizationType;
  predictionSet: PredictionSet;
}

interface DispatchProps {
  changeVisualization: (vis: VisualizationType) => void;
  changeMultiBrushBehavior: (
    behavior: MultiBrushBehavior,
    interactionHistory: InteractionHistory
  ) => void;
}

interface State {
  height: number;
  width: number;
  hideZero: boolean;
  showSelected: boolean;
  multiBrushIsUnion: boolean;
  debugIndices: number[];
  debugColumns: string[];
  debugSelectedPoints: number[];
}

type Props = StateProps & DispatchProps;

class App extends React.Component<Props, State> {
  predictionResultsRef: React.RefObject<HTMLDivElement> = React.createRef();
  predictionsResultsSvgRef: React.RefObject<SVGSVGElement> = React.createRef();

  readonly state: State = {
    height: 0,
    width: 0,
    hideZero: false,
    debugIndices: [],
    debugColumns: [],
    showSelected: false,
    debugSelectedPoints: [],
    multiBrushIsUnion: false
  };

  componentDidMount() {
    const predSvg = this.predictionsResultsSvgRef.current as SVGSVGElement;
    const predSvgSelection = select(predSvg);
    predSvgSelection.style("height", `100%`).style("width", `100%`);

    this.setState({
      height: predSvg.clientHeight,
      width: predSvg.clientWidth
    });
  }

  componentDidUpdate(prevProps: Props) {
    const predSvg = this.predictionsResultsSvgRef.current as SVGSVGElement;
    const predSvgSelection = select(predSvg);

    const { predictionSet } = this.props;
    const { predictions } = predictionSet;

    if (
      this.state.height !== predSvg.clientHeight ||
      this.state.width !== predSvg.clientWidth ||
      predictionSet.predictions.length !==
        prevProps.predictionSet.predictions.length ||
      JSON.stringify(predictionSet.dimensions) !==
        JSON.stringify(prevProps.predictionSet.dimensions) ||
      JSON.stringify(predictionSet.selectedIds) !==
        JSON.stringify(prevProps.predictionSet.selectedIds)
    ) {
      predSvgSelection
        .style("height", `${predictions.length * 50}px`)
        .style("width", `100%`);
      this.setState({
        height: predSvg.clientHeight,
        width: predSvg.clientWidth,
        debugColumns: predictionSet.dimensions,
        debugSelectedPoints: predictionSet.selectedIds
      });
    }
  }

  render() {
    const {
      data,
      numericColumns,
      labelColumn,
      visualization,
      changeVisualization,
      changeMultiBrushBehavior,
      columns
    } = this.props;
    const { width, hideZero, showSelected, multiBrushIsUnion } = this.state;

    let { predictionSet } = this.props;
    let { predictions } = predictionSet;
    if (hideZero) predictions = predictions.filter(p => p.rank !== 0);

    const scale = scaleLinear()
      .domain([0, 1])
      .range([0, width]);

    const barHeight = 30;

    return data ? (
      <PageGrid key={JSON.stringify(columns)} className={""}>
        {/* <TitleBar tasks={TaskList} /> */}
        <VisualizationGrid>
          {(() => {
            switch (VisualizationType[visualization]) {
              case VisualizationType.ScatterPlot:
                return (
                  data.length > 0 && (
                    <ScatterPlot
                      data={data}
                      dimensions={numericColumns}
                      labelColumn={labelColumn}
                    />
                  )
                );
              case VisualizationType.ScatterPlotMatrix:
                return (
                  data.length > 0 && (
                    <ScatterPlotMatrix
                      data={data}
                      dimensions={numericColumns}
                      labelColumn={labelColumn}
                      debugIndices={this.state.debugIndices}
                      debugColumns={this.state.debugColumns}
                      debugShowSelected={this.state.showSelected}
                      debugSelectedPoints={this.state.debugSelectedPoints}
                    />
                  )
                );
              default:
                return (
                  <PaddedContainer textAlign="center">
                    <Header>Select Visualization</Header>
                    <VisSegment
                      placeholder
                      onClick={() =>
                        changeVisualization(VisualizationType.ScatterPlot)
                      }
                    >
                      Scatterplot
                    </VisSegment>
                    <VisSegment placeholder>Scatterplot Matrix</VisSegment>
                  </PaddedContainer>
                );
            }
          })()}
          {visualization !== VisualizationType.None && (
            <div />
            // <Button
            //   style={{
            //     position: "absolute",
            //     bottom: "0",
            //     left: "0"
            //   }}
            //   onClick={() => changeVisualization(VisualizationType.None)}
            // >
            //   Home
            // </Button>
          )}
        </VisualizationGrid>
        <ResultsGrid ref={this.predictionResultsRef}>
          <Segment>
            <Header textAlign="center" size="huge">
              Predictions
            </Header>
            <div>
              <Checkbox
                label="Hide 0"
                toggle
                checked={hideZero}
                onChange={() =>
                  this.setState({
                    hideZero: !hideZero
                  })
                }
              />
            </div>
            <div>
              <Checkbox
                label="Show selected IDs"
                toggle
                checked={showSelected}
                onChange={() =>
                  this.setState({
                    showSelected: !showSelected
                  })
                }
              />
            </div>
            <div>
              <Checkbox
                label={`Multi Brush Behavior: ${
                  multiBrushIsUnion ? "Union" : "Intersection"
                }`}
                toggle
                checked={multiBrushIsUnion}
                onChange={() => {
                  this.setState({
                    multiBrushIsUnion: !multiBrushIsUnion
                  });
                  changeMultiBrushBehavior(
                    !multiBrushIsUnion
                      ? MultiBrushBehavior.UNION
                      : MultiBrushBehavior.INTERSECTION,
                    VisStore.visStore().getState().interactions
                  );
                }}
              />
            </div>
          </Segment>
          {(!predictions || predictions.length <= 0) && (
            <Header textAlign="center"> Please Make Selection</Header>
          )}
          <div
            style={{
              padding: "1em",
              height: "100%",
              width: "100%",
              overflow: "auto"
            }}
          >
            <svg id="predictions-svg" ref={this.predictionsResultsSvgRef}>
              {predictions &&
                predictions.length > 0 &&
                predictions.map((pred, i) => {
                  return (
                    <Popup
                      key={i}
                      trigger={
                        <g
                          transform={`translate(0, ${(barHeight + 2) * i})`}
                          onMouseEnter={() => {
                            this.setState({
                              debugIndices: pred.dataIds as number[]
                            });
                          }}
                          onMouseLeave={() => {
                            this.setState({
                              debugIndices: []
                            });
                          }}
                        >
                          <BackgroundRect
                            height={barHeight}
                            width={scale.range()[1]}
                          />
                          <ForegroundRect
                            height={barHeight}
                            width={scale(pred.rank)}
                          />
                          <PredictionText
                            transform={`translate(20, ${barHeight / 2})`}
                          >
                            {pred.intent}
                          </PredictionText>
                        </g>
                      }
                      content={
                        <div>
                          Confidence: {pred.rank}
                          <pre>{JSON.stringify(pred.info, null, 2)}</pre>
                        </div>
                      }
                    />
                  );
                })}
            </svg>
          </div>
        </ResultsGrid>
        <SubmitGrid />
      </PageGrid>
    ) : (
      <div />
    );
  }
}

const mapStateToProps = (state: VisualizationState): StateProps => ({
  data: state.dataset.data,
  columns: state.dataset.columns,
  numericColumns: state.dataset.numericColumns,
  labelColumn: state.dataset.labelColumn,
  visualization: state.visualization,
  predictionSet: state.predictionSet
});

const mapDispatchToProps = (
  dispatch: Dispatch<VisualizationChangeAction | MultiBrushBehaviorAction>
): DispatchProps => ({
  changeVisualization: (vis: VisualizationType) => {
    dispatch({
      type: VisualizationChangeActions.CHANGE_VISUALIZATION,
      args: vis
    });
  },
  changeMultiBrushBehavior: (
    brush: MultiBrushBehavior,
    interactionHistory: InteractionHistory
  ) => {
    dispatch({
      type: MultiBrushBehaviorActions.SWITCH,
      args: {
        multiBrushBehavior: brush,
        interactions: interactionHistory
      }
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

const SubmitGrid = styled.div`
  grid-column: 16/-1;
  grid-row: 16/-1;
  border: 0.5px dashed white;
`;

const ResultsGrid = styled.div`
  grid-column: 16/-1;
  grid-row: 1/16;
  border: 0.5px dashed white;
  padding: 1em;
`;

const VisualizationGrid = styled.div`
  grid-column: 1 / 16;
  grid-row: 1/-1;
  border: 0.5px dashed white;
`;

const PageGrid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: repeat(20, 1fr);
  grid-template-columns: repeat(20, 1fr);
`;

const PaddedContainer = styled(Container)<ContainerProps>`
  padding: 1em !important;
`;

const VisSegment = styled(Segment)<SegmentProps>`
  font-size: 2em !important;
  cursor: pointer;
`;

const BackgroundRect = styled.rect`
  fill: #bde1dd;
`;

const ForegroundRect = styled.rect`
  fill: #49bdb6;
`;

const PredictionText = styled.text`
  dominant-baseline: middle;
  font-size: 1.2em;
  font-color: white;
`;

// background-color: rgba(128, 128, 128, 0.05);
