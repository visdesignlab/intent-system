import { Prediction, VisualizationType } from '@visdesignlab/intent-contract';
import { scaleLinear, select } from 'd3';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Container, ContainerProps, Header, Popup, Segment, SegmentProps } from 'semantic-ui-react';
import styled from 'styled-components';

import ScatterPlot from '../Components/Visualization/ScatterPlot/ScatterPlot';
import ScatterPlotMatrix from '../Components/Visualization/ScatterPlotMatrix/ScatterPlotMatrix';
import { VisualizationChangeAction, VisualizationChangeActions } from './VisStore/VisualizationReducer';
import { VisualizationState } from './VisStore/VisualizationState';

interface StateProps {
  data: any[];
  columns: string[];
  numericColumns: string[];
  labelColumn: string;
  visualization: VisualizationType;
  predictions: Prediction[];
}

interface DispatchProps {
  changeVisualization: (vis: VisualizationType) => void;
}

interface State {
  height: number;
  width: number;
}

type Props = StateProps & DispatchProps;

class App extends React.Component<Props, State> {
  predictionResultsRef: React.RefObject<HTMLDivElement> = React.createRef();
  predictionsResultsSvgRef: React.RefObject<SVGSVGElement> = React.createRef();

  readonly state: State = {
    height: 0,
    width: 0
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

    const { predictions } = this.props;

    if (
      this.state.height !== predSvg.clientHeight ||
      this.state.width !== predSvg.clientWidth ||
      predictions.length !== prevProps.predictions.length
    ) {
      predSvgSelection
        .style("height", `${predictions.length * 50}px`)
        .style("width", `100%`);
      this.setState({
        height: predSvg.clientHeight,
        width: predSvg.clientWidth
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
      predictions,
      columns
    } = this.props;

    const { width } = this.state;
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
                        <g transform={`translate(0, ${(barHeight + 2) * i})`}>
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
  predictions: state.predictions
});

const mapDispatchToProps = (
  dispatch: Dispatch<VisualizationChangeAction>
): DispatchProps => ({
  changeVisualization: (vis: VisualizationType) => {
    dispatch({
      type: VisualizationChangeActions.CHANGE_VISUALIZATION,
      args: vis
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
