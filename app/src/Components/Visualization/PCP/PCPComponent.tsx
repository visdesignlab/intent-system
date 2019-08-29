import { VisualizationType } from '@visdesignlab/intent-contract';
import { brushSelection, brushY, line, max, min, ScaleLinear, scaleLinear, select, selectAll } from 'd3';
import React from 'react';
import { connect } from 'react-redux';

import { Brush, BrushDictionary } from '../Data Types/BrushType';
import { Dimension, DimensionType } from '../Data Types/Dimension';
import styles from './pcp.module.css';

const emptyRegex = /[\n\r\s\t]+/g;

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

    if (columns === prevProps.columns && this.state.shouldUpdate <= 0) return;

    const padding = height * 0.02;

    const paddedCellWidth = cellWidth - padding;

    let axes: PCPDimension[] = [];

    columns.forEach((col, i) => {
      const values = data.map(d => d[col]) as number[];
      const scale = scaleLinear()
        .domain([(min(values) as number) * 0.95, max(values) as number])
        .range([0, cellHeight]);

      axes.push({
        idx: i + 1,
        label: col,
        scale: scale,
        values: values,
        scaledValues: values.map(v => (v ? scale(v) : scale.range()[0])),
        type: DimensionType.SPM
      });
    });
    const instance = this;
    const labelScale = scaleLinear()
      .domain([0, this.props.labels.length])
      .range([0, cellHeight]);

    axes.forEach(axis => {
      const id = `#id-${axis.label.replace(emptyRegex, "-")}`;
      const plot = select(id);
      const brushArea = plot.select(".brush");
      const scale = axis.scale;

      const nBrush = brushY()
        .extent([[-10, 0], [10, cellHeight]])
        .on("end", function() {
          if (instance.programMove) return;

          const selection = brushSelection(this);
          if (selection) {
            const [top, bottom] = selection as number[];

            const selectedIndices: number[] = [];
            console.log(top, bottom);
            axis.scaledValues.forEach((y, i) => {
              if (y >= top && y <= bottom) {
                selectedIndices.push(i);
              }
            });

            const br: Brush = {
              id: id,
              brush: nBrush,
              selectedPoints: selectedIndices,
              extents: [
                [scale.invert(top), scale.invert(top)],
                [scale.invert(bottom), scale.invert(bottom)]
              ]
            };

            const { brushDict } = instance.props;
            brushDict[id] = [br];
            instance.props.updateBrushDictionary(brushDict);
            instance.setState({ shouldUpdate: 2 });
          } else {
            const br: Brush = {
              id: id,
              brush: nBrush,
              selectedPoints: [],
              extents: [[], []]
            };
            const { brushDict } = instance.props;
            brushDict[id] = [br];
            instance.props.updateBrushDictionary(brushDict);
            instance.setState({ shouldUpdate: 2 });
          }
        });

      brushArea.call(nBrush as any);
    });

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

    // if (this.state.shouldUpdate <= 0) this.setState({ shouldUpdate: 2 });

    const { brushDict } = this.props;

    selectAll(".paths")
      .selectAll("path")
      .classed(styles.selected, false);
    selectAll(".paths")
      .selectAll("path")
      .classed(styles.intersection, false);

    Object.values(brushDict).forEach(brush => {
      const { selectedPoints } = brush[0];
      data.forEach((d, i) => {
        if (selectedPoints.includes(i)) {
          const path = select(`#path-id-${i}`);
          path.raise();
          if (path.classed(styles.selected))
            path.classed(styles.intersection, true);
          else path.classed(styles.selected, true);
        }
      });
    });

    if (this.state.shouldUpdate > 0)
      this.setState({
        cellHeight,
        cellWidth,
        padding,
        axes,
        paddedCellWidth,
        shouldUpdate: this.state.shouldUpdate - 1
      });
    else
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
      padding,
      brushDict
    } = this.state;
    const { width, columns, labels, data } = this.props;

    return (
      <g ref={this.ref}>
        {/* <rect
          height={cellHeight}
          width={width}
          fill="none"
          stroke="black"
          opacity="0.3"
        ></rect> */}
        {axes.map((axis: PCPDimension, idx: number) => (
          <g
            key={idx}
            id={`id-${axis.label.replace(emptyRegex, "-")}`}
            className="pcp-axis"
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
            {/* <rect
              height={cellHeight}
              width={paddedCellWidth}
              fill="none"
              stroke="red"
              opacity="0.5"
            ></rect> */}
            <g
              className="brush"
              transform={`translate(${paddedCellWidth / 2}, 0)`}
            />
            {idx === 0 ? (
              <g transform={`translate(${paddedCellWidth}, 0)`}>
                {labels.map((label, labelId) => (
                  <text
                    key={labelId}
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
          </g>
        ))}
        <g className="paths">
          {data.map((d, i) => (
            <path
              id={`path-id-${i}`}
              key={i}
              fill="none"
              stroke="gray"
              opacity="0.4"
              strokeWidth="3"
              d={calculatePath(
                axes.map((axis, aid) => {
                  if (aid === 0) {
                    return paddedCellWidth;
                  } else {
                    return (
                      (paddedCellWidth + padding) * aid + paddedCellWidth / 2
                    );
                  }
                }),
                axes.map((axis, aid) => {
                  if (aid === 0) {
                    return axis.scale(i);
                  } else {
                    return axis.scaledValues[i];
                  }
                })
              )}
            >
              <title>{this.props.labels[i]}</title>
            </path>
          ))}
        </g>
      </g>
    );
  }
}

export default connect()(PCPComponent);

function calculatePath(xPositions: number[], yPositions: number[]) {
  const arr: [number, number][] = xPositions.map((x, i) => [x, yPositions[i]]);
  return line()(arr) as string;
}
