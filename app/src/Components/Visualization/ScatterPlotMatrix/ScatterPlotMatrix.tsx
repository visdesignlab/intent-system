import { VisualizationType } from '@visdesignlab/intent-contract';
import { select } from 'd3';
import React from 'react';
import styled from 'styled-components';

import DimensionSelector from '../../DimensionSelector/DimensionSelector';
import { BrushDictionary } from '../Data Types/BrushType';
import FullSizeSVG from '../ReusableComponents/FullSizeSVG';
import styles from './scatterplotmatrix.module.css';
import SPMComponent from './SPMComponent';

interface State {
  svgHeight: number;
  svgWidth: number;
  selectedDimensions: string[];
  brushDict: BrushDictionary;
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
    selectedDimensions: [],
    brushDict: {}
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

  updateBrushDict = (brushDict: BrushDictionary) => {
    this.setState({ brushDict });
  };

  render() {
    const { dimensions, data, labelColumn } = this.props;
    const { selectedDimensions, svgHeight, svgWidth, brushDict } = this.state;

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
        <div ref={this.divRef} className={styles.square}>
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
                brushDict={brushDict}
                updateBrushDictionary={this.updateBrushDict}
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
