import {
  Button,
  Container,
  ContainerProps,
  Header,
  Segment,
  SegmentProps
} from "semantic-ui-react";
import {
  VisualizationChangeAction,
  VisualizationChangeActions
} from "./VisStore/VisualizationReducer";

import { Dispatch } from "redux";
import React from "react";
import ScatterPlot from "../Components/Visualization/ScatterPlot/ScatterPlot";
import { TaskList } from "../Study Data/Tasks";
import TitleBar from "../Components/TitleBar/TitleBar";
import { VisualizationState } from "./VisStore/VisualizationState";
import { VisualizationType } from "@visdesignlab/intent-contract";
import { connect } from "react-redux";
import styled from "styled-components";
import ScatterPlotMatrix from "../Components/Visualization/ScatterPlotMatrix/ScatterPlotMatrix";

interface StateProps {
  data: any[];
  columns: string[];
  numericColumns: string[];
  labelColumn: string;
  visualization: VisualizationType;
  predictions: any[];
}

interface DispatchProps {
  changeVisualization: (vis: VisualizationType) => void;
}

type Props = StateProps & DispatchProps;

const App: React.FC<Props> = ({
  data,
  columns,
  numericColumns,
  labelColumn,
  visualization,
  changeVisualization,
  predictions
}) => {
  return data ? (
    <PageGrid>
      <TitleBar tasks={TaskList} />
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
          <Button
            style={{
              position: "absolute",
              bottom: "0",
              left: "0"
            }}
            onClick={() => changeVisualization(VisualizationType.None)}
          >
            Home
          </Button>
        )}
      </VisualizationGrid>
      <ResultsGrid>
        {predictions
          .sort((a, b) => b.rank - a.rank)
          .map((pred, i) => (
            <pre key={i}>{JSON.stringify(pred, null, 2)}</pre>
          ))}
      </ResultsGrid>
      <SubmitGrid>Test3</SubmitGrid>
    </PageGrid>
  ) : (
    <div />
  );
};

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
  border: 0.5px dashed black;
`;

const ResultsGrid = styled.div`
  grid-column: 16/-1;
  grid-row: 2/16;
  border: 0.5px dashed blue;
`;

const VisualizationGrid = styled.div`
  grid-column: 1 / 16;
  grid-row: 2/-1;
  border: 0.5px dashed red;
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
