import * as React from "react";

import { Dimension, DimensionType } from "../Data Types/Dimension";
import {
  InteractionHistoryAction,
  InteractionHistoryActions
} from "../../../App/VisStore/InteractionHistoryReducer";

import { BrushDictionary } from "../Data Types/BrushType";
import DimensionSelector from "../../DimensionSelector/DimensionSelector";
import { Dispatch } from "redux";
import ScatterPlotComponent from "../ScatterPlotComponent/ScatterPlotComponent";
import { VisualizationType } from "@visdesignlab/intent-contract";
import { connect } from "react-redux";
import styled from "styled-components";
import FullSizeSVG from "../ReusableComponents/FullSizeSVG";

interface State {
  svgHeight: number;
  svgWidth: number;
  selectedX: string;
  selectedY: string;
  brushDict: BrushDictionary;
  pointSelection: number[];
}

interface DispatchProps {
  addEmptyInteraction: (vis: VisualizationType, dimensions: string[]) => void;
  addChangeAxisInteraction: (
    vis: VisualizationType,
    dimensions: string[]
  ) => void;
}

interface OwnProps {
  data: any[];
  dimensions: string[];
  labelColumn: string;
}

type Props = OwnProps & DispatchProps;

class ScatterPlot extends React.Component<Props, State> {
  ref: React.RefObject<SVGSVGElement> = React.createRef();

  readonly state: State = {
    svgHeight: 0,
    svgWidth: 0,
    selectedX: "",
    selectedY: "",
    brushDict: {},
    pointSelection: []
  };

  componentWillMount() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  componentDidMount() {
    const { dimensions } = this.props;
    this.setState({
      svgHeight: (this.ref.current as SVGSVGElement).clientHeight,
      svgWidth: (this.ref.current as SVGSVGElement).clientWidth,
      selectedX: dimensions[0],
      selectedY: dimensions[1]
    });
    this.props.addEmptyInteraction(VisualizationType.ScatterPlot, [
      dimensions[0],
      dimensions[1]
    ]);
  }

  changeX(selectedX: string) {
    this.setState({
      selectedX
    });
    this.props.addChangeAxisInteraction(VisualizationType.ScatterPlot, [
      selectedX,
      this.state.selectedY
    ]);
  }

  changeY(selectedY: string) {
    this.setState({
      selectedY
    });
    this.props.addChangeAxisInteraction(VisualizationType.ScatterPlot, [
      this.state.selectedX,
      selectedY
    ]);
  }

  updateBrushDict = (brushDict: BrushDictionary) => {
    this.setState({ brushDict });
  };

  updatePointSelection = (pointSelection: number[]) => {
    this.setState({ pointSelection });
  };

  resize() {
    this.setState({
      svgHeight: (this.ref.current as SVGSVGElement).clientHeight,
      svgWidth: (this.ref.current as SVGSVGElement).clientWidth
    });
  }

  render() {
    const { svgHeight, svgWidth, selectedX, selectedY, brushDict } = this.state;
    const { data, dimensions, labelColumn } = this.props;

    const labels = data.map(r => r[labelColumn]);

    const lesserDim = svgHeight > svgWidth ? svgWidth : svgHeight;

    const X: Dimension<number> = {
      label: selectedX,
      type: DimensionType.X,
      values: data.map(d => d[selectedX])
    };

    const Y: Dimension<number> = {
      label: selectedY,
      type: DimensionType.Y,
      values: data.map(d => d[selectedY])
    };

    return (
      <ScatterPlotDiv>
        <DimensionSelectorGrid>
          <DimensionSelector
            label="X Axis"
            dimensions={dimensions}
            selection={[selectedX]}
            disabledDimensions={[selectedY]}
            notifyColumnChange={(col: string) => this.changeX(col)}
          />
          <DimensionSelector
            label="Y Axis"
            dimensions={dimensions}
            selection={[selectedY]}
            disabledDimensions={[selectedX]}
            notifyColumnChange={(col: string) => this.changeY(col)}
          />
        </DimensionSelectorGrid>
        <FullSizeSVG ref={this.ref}>
          <g transform={`translate(100, 100)`}>
            <ScatterPlotComponent
              vis={VisualizationType.ScatterPlot}
              height={lesserDim - 100}
              width={lesserDim - 100}
              X={X}
              Y={Y}
              YOffset={lesserDim * 0.05}
              XOffset={lesserDim * 0.06}
              labels={labels}
              brushDict={brushDict}
              updateBrushDictionary={this.updateBrushDict}
              pointSelection={this.state.pointSelection}
              updatePointSelection={this.updatePointSelection}
            />
          </g>
        </FullSizeSVG>
      </ScatterPlotDiv>
    );
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<InteractionHistoryAction>
): DispatchProps => ({
  addEmptyInteraction: (vis: VisualizationType, dimensions: string[]) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        visualizationType: vis,
        interactionType: {
          dimensions: dimensions
        }
      }
    });
  },
  addChangeAxisInteraction: (vis: VisualizationType, dimensions: string[]) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        visualizationType: vis,
        interactionType: {
          dimensions: dimensions
        }
      }
    });
  }
});

export default connect(
  null,
  mapDispatchToProps
)(ScatterPlot);

const ScatterPlotDiv = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 15fr;
`;

const DimensionSelectorGrid = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
`;
