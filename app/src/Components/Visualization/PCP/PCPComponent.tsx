import { VisualizationType } from '@visdesignlab/intent-contract';
import { max, min, ScaleLinear, scaleLinear } from 'd3';
import React from 'react';
import { connect } from 'react-redux';

import { BrushDictionary } from '../Data Types/BrushType';
import { Dimension, DimensionType } from '../Data Types/Dimension';

// const emptyRegex = /[\n\r\s\t]+/g;

interface StateProps {}

interface DispatchProps {}

interface OwnProps {
  vis: VisualizationType;
  height: number;
  width: number;
  labels: string[];
  columns: string[];
  XZero?: boolean;
  YZero?: boolean;
  data: any[];
  brushDict: BrushDictionary;
  updateBrushDictionary: (dict: BrushDictionary) => void;
  pointSelection: number[];
  updatePointSelection: (points: number[]) => void;
  debugIndices: number[];
  debugShowSelected: boolean;
  debugSelectedPoints: number[];
}

type Props = OwnProps & StateProps & DispatchProps;

interface State {
  axes: PCPDimension[];
  brushDict: BrushDictionary;
  cellHeight: number;
  cellWidth: number;
  padding: number;
  paddedCellWidth: number;
  shouldUpdate: number;
}

interface PCPDimension extends Dimension<number> {
  scale: ScaleLinear<number, number>;
  scaledValues: number[];
  idx: number;
}

class PCPComponent extends React.Component<Props, State> {
  ref: React.RefObject<SVGGElement> = React.createRef();
  programMove: boolean = false;
  readonly state: State = {
    axes: [],
    brushDict: {},
    cellHeight: 0,
    cellWidth: 0,
    padding: 0,
    paddedCellWidth: 0,
    shouldUpdate: 2
  };

  componentDidUpdate(prevProps: Props) {
    const { columns, height, width, data } = this.props;
    const cellHeight = height;
    const cellWidth = width / (columns.length + 1);

    if (columns === prevProps.columns) return;

    const padding = height * 0.02;

    const paddedCellWidth = cellWidth - padding;

    let axes: PCPDimension[] = [];

    columns.forEach((col, i) => {
      const values = data.map(d => d[col]) as number[];
      const scale = scaleLinear()
        .domain([min(values) as number, max(values) as number])
        .range([0, cellHeight]);

      axes.push({
        idx: i + 1,
        label: col,
        scale: scale,
        values: values,
        scaledValues: values.map(v => (v ? scale(v) : 0)),
        type: DimensionType.SPM
      });
    });

    const labelScale = scaleLinear()
      .domain([0, this.props.labels.length])
      .range([0, cellHeight]);

    axes = [
      {
        idx: 0,
        label: "LABELS",
        scale: labelScale,
        values: [],
        scaledValues: this.props.labels.map((_, i) => labelScale(i)),
        type: DimensionType.SPM
      },
      ...axes
    ];

    this.setState({
      cellHeight,
      cellWidth,
      padding,
      axes,
      paddedCellWidth
    });
  }

  render() {
    const {
      axes,
      cellHeight,
      cellWidth,
      paddedCellWidth,
      padding
    } = this.state;
    const { width, columns, labels } = this.props;

    return (
      <g ref={this.ref}>
        <rect
          height={cellHeight}
          width={width}
          fill="none"
          stroke="black"
          opacity="0.3"
        ></rect>
        {axes.map((axis: PCPDimension, idx: number) => (
          <g
            key={idx}
            className="pcp-axes"
            transform={`translate(${(paddedCellWidth + padding) * idx}, 0)`}
          >
            <g transform={`translate(${paddedCellWidth / 2}, -10)`}>
              <text
                textAnchor="middle"
                fontSize={columns.length <= 6 ? "1.2rem" : "1rem"}
              >
                {axis.label}
              </text>
            </g>
            <rect
              height={cellHeight}
              width={paddedCellWidth}
              fill="none"
              stroke="red"
              opacity="0.5"
            ></rect>
            {idx === 0 ? (
              <g transform={`translate(${paddedCellWidth}, 0)`}>
                {labels.map((label, labelId) => (
                  <text
                    transform={`translate(-5, ${axis.scale(labelId) + 5})`}
                    textAnchor="end"
                  >
                    {label}
                  </text>
                ))}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={cellHeight}
                  stroke="black"
                ></line>
              </g>
            ) : (
              <g transform={`translate(${paddedCellWidth / 2}, 0)`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2={cellHeight}
                  stroke="black"
                ></line>
                {axis.scaledValues.map((y, yi) => {
                  return (
                    <circle key={yi} r={2} cx={0} cy={y} stroke="red"></circle>
                  );
                })}
              </g>
            )}
            <g className="paths"></g>
          </g>
        ))}
      </g>
    );
  }
}

export default connect()(PCPComponent);
