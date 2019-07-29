import React from "react";
import styled from "styled-components";
import { VisualizationType } from "@visdesignlab/intent-contract";
import { Dimension, DimensionType } from "../Data Types/Dimension";
import { BrushDictionary } from "../Data Types/BrushType";
import { ScaleLinear, scaleLinear, min, max } from "d3";
import Axis, { ScaleType } from "../Axis/Axis";
import MarkSeries from "../MarkSeries/MarkSeries";

interface DispatchProps {}
interface StateProps {}
interface OwnProps {
  vis: VisualizationType;
  height: number;
  width: number;
  labels: string[];
  columns: string[];
  XZero?: boolean;
  YZero?: boolean;
  XOffset: number;
  YOffset: number;
  data: any[];
  // brushDict: BrushDictionary;
  // updateBrushDictionary: (dict: BrushDictionary)=>void;
  // pointSelection: number[];
  // updatePointSelection: (points: number[]) => void;
}

interface SPMDimension extends Dimension<number> {
  scale: ScaleLinear<number, number>;
  xPos: number;
  yPos: number;
}

interface State {
  pairs: SPMDimension[][];
  brushDict: BrushDictionary;
}

type Props = OwnProps & StateProps & DispatchProps;

class SPMComponent extends React.Component<Props, State> {
  readonly state: State = {
    pairs: [],
    brushDict: {}
  };

  updateBrushDict = (brushDict: BrushDictionary) => {
    this.setState({ brushDict });
  };

  componentDidUpdate(prevProps: Props) {
    const {
      height,
      XOffset,
      width,
      YOffset,
      columns,
      data,
      XZero,
      YZero
    } = this.props;

    const actualHeight = height / columns.length;
    const actualWidth = width / columns.length;

    const xoffset = actualWidth * 0.1;
    const yoffset = actualHeight * 0.1;

    const pairs: SPMDimension[][] = [];

    columns.forEach((c1, i1) => {
      columns.forEach((c2, i2) => {
        if (i1 <= i2) {
          const X = data.map(d => d[c1]) as number[];
          const Y = data.map(d => d[c2]) as number[];
          const [minX, maxX] = [min(X) as number, max(X) as number];
          const [minY, maxY] = [min(Y) as number, max(Y) as number];

          pairs.push([
            {
              label: c1,
              type: DimensionType.X,
              values: X,
              scale: scaleLinear()
                .domain([XZero ? 0 : minX, maxX])
                .range([0, actualWidth - xoffset]),
              xPos: i2 % columns.length,
              yPos: i1 % columns.length
            },
            {
              label: c2,
              type: DimensionType.Y,
              values: Y,
              scale: scaleLinear()
                .domain([maxY, YZero ? 0 : minY])
                .range([0, actualHeight - yoffset]),
              xPos: i2 % columns.length,
              yPos: i1 % columns.length
            }
          ]);
        }
      });
    });

    if (columns !== prevProps.columns) {
      this.setState({
        pairs: pairs
      });
      console.log(pairs);
    }
  }

  render() {
    const {
      height,
      XOffset,
      width,
      YOffset,
      columns,
      data,
      labels
    } = this.props;

    const { pairs, brushDict } = this.state;

    const actualHeight = height / columns.length;
    const actualWidth = width / columns.length;

    const xoffset = actualWidth * 0.1;
    const yoffset = actualHeight * 0.1;

    return (
      <g>
        {pairs.map((p, i) => {
          return (
            <g
              transform={`translate(${actualWidth * p[0].xPos}, ${actualHeight *
                p[0].yPos})`}
              key={Math.random()}
            >
              {/* <rect
                height={actualHeight}
                width={actualWidth}
                fill="none"
                stroke="black"
                strokeWidth="1px"
                opacity="0.2"
              /> */}
              <g transform={`translate(${xoffset}, 0)`}>
                <MarkSeries
                  vis={VisualizationType.ScatterPlotMatrix}
                  xLabel={p[0].label}
                  yLabel={p[1].label}
                  markSize={3}
                  opacity={0.4}
                  xValues={p[0].values}
                  yValues={p[1].values}
                  xScale={p[0].scale}
                  yScale={p[1].scale}
                  labels={labels}
                  brushDict={brushDict}
                  updateBrushDictionary={this.updateBrushDict}
                  pointSelection={[]}
                  updatePointSelection={points => {}}
                />
              </g>
              <g transform={`translate(${xoffset}, ${actualHeight - yoffset})`}>
                <Axis
                  scale={p[0].scale}
                  position={ScaleType.BOTTOM}
                  label={p[0].label}
                  size={1}
                />
              </g>
              <g transform={`translate(${yoffset}, ${0})`}>
                <Axis
                  scale={p[1].scale}
                  position={ScaleType.LEFT}
                  label={p[1].label}
                  size={1}
                />
              </g>
            </g>
          );
        })}
      </g>
    );
  }
}

export default SPMComponent;
