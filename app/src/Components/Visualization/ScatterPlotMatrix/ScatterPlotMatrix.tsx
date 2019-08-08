import React from "react";
import styled from "styled-components";
import DimensionSelector from "../../DimensionSelector/DimensionSelector";
import SPMComponent from "./SPMComponent";
import FullSizeSVG from "../ReusableComponents/FullSizeSVG";
import { VisualizationType } from "@visdesignlab/intent-contract";
import styles from "./scatterplotmatrix.module.css";
import { select } from "d3";

interface State {
  svgHeight: number;
  svgWidth: number;
  selectedDimensions: string[];
}

interface DispatchProps {}
interface StateProps {}

interface OwnProps {
  data: any[];
  dimensions: string[];
  labelColumn: string;
}

type Props = OwnProps & DispatchProps & StateProps;

class ScatterPlotMatrix extends React.Component<Props, State> {
  ref: React.RefObject<SVGSVGElement> = React.createRef();
  divRef: React.RefObject<HTMLDivElement> = React.createRef();

  readonly state: State = {
    svgHeight: 0,
    svgWidth: 0,
    selectedDimensions: []
  };

  componentDidMount() {
    const { dimensions } = this.props;

    const divHeight = (this.divRef.current as HTMLDivElement).clientHeight;
    const divWidth = (this.divRef.current as HTMLDivElement).clientWidth;
    const lesser = divHeight < divWidth ? divHeight : divWidth;

    select(this.divRef.current)
      .style("height", `${lesser}px`)
      .style("width", `${lesser}px`);

    this.setState({
      svgHeight: lesser,
      svgWidth: lesser,
      selectedDimensions: dimensions.slice(0, 3)
    });
    // this.props.addEmptyInteraction(VisualizationType.ScatterPlot, [
    //   dimensions[0],
    //   dimensions[1]
    // ]);
  }

  componentWillMount() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize.bind(this));
  }

  resize() {
    const divHeight = (this.divRef.current as HTMLDivElement).clientHeight;
    const divWidth = (this.divRef.current as HTMLDivElement).clientWidth;
    const lesser = divHeight < divWidth ? divHeight : divWidth;

    select(this.divRef.current)
      .style("height", `${lesser}px`)
      .style("width", `${lesser}px`);

    this.setState({
      svgHeight: lesser,
      svgWidth: lesser
    });
  }

  updateSelection = (selectedDimensions: string[]) => {
    this.setState({ selectedDimensions });
  };

  render() {
    const { dimensions, data, labelColumn } = this.props;
    const { selectedDimensions, svgHeight, svgWidth } = this.state;

    const labels = data.map(r => r[labelColumn]);

    const lesserDim = svgHeight > svgWidth ? svgWidth : svgHeight;

    return (
      <ScatterPlotDiv>
        <DimensionSelector
          label="X Axis"
          dimensions={dimensions}
          selection={selectedDimensions}
          disabledDimensions={[]}
          notifyColumnChange={(col: string) => {
            let selDims: any[] = [];
            if (selectedDimensions.includes(col))
              selDims = selectedDimensions.filter(d => d !== col);
            else selDims = [...selectedDimensions, col];

            this.setState({
              selectedDimensions: selDims
            });
          }}
        />
        <div
          ref={this.divRef}
          className={styles.square}
          style={{ border: "1px solid red" }}
        >
          <FullSizeSVG ref={this.ref}>
            <g transform={`translate(50,50)`}>
              <SPMComponent
                vis={VisualizationType.ScatterPlotMatrix}
                data={data}
                height={lesserDim - 100}
                width={lesserDim - 100}
                labels={labels}
                columns={selectedDimensions}
                XZero={false}
                YZero={false}
                XOffset={lesserDim * 0.05}
                YOffset={lesserDim * 0.06}
              />
            </g>
          </FullSizeSVG>
        </div>
      </ScatterPlotDiv>
    );
  }
}

export default ScatterPlotMatrix;

const ScatterPlotDiv = styled.div`
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 1fr 15fr;
`;
