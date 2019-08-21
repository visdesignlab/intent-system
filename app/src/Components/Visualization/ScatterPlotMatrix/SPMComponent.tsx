import { VisualizationType } from '@visdesignlab/intent-contract';
import { axisBottom, axisLeft, brush, brushSelection, max, min, ScaleLinear, scaleLinear, select, values } from 'd3';
import React from 'react';

import { Brush, BrushDictionary } from '../Data Types/BrushType';
import { Dimension, DimensionType } from '../Data Types/Dimension';
import styles from './scatterplotmatrix.module.css';

const emptyRegex = /[\n\r\s\t]+/g;

// import MarkSeries from "../MarkSeries/MarkSeries";
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
  data: any[];
  brushDict: BrushDictionary;
  updateBrushDictionary: (dict: BrushDictionary) => void;
  // pointSelection: number[];
  // updatePointSelection: (points: number[]) => void;
}

interface SPMDimension extends Dimension<number> {
  scale: ScaleLinear<number, number>;
  scaledValues: number[];
  idx: number;
}

interface Pairs {
  X: SPMDimension;
  Y: SPMDimension;
}

interface State {
  pairs: Pairs[];
  brushDict: BrushDictionary;
  cellHeight: number;
  cellWidth: number;
  padding: number;
  paddedCellHeight: number;
  paddedCellWidth: number;
  shouldUpdate: number;
}

type Props = OwnProps & StateProps & DispatchProps;

class SPMComponent extends React.Component<Props, State> {
  ref: React.RefObject<SVGGElement> = React.createRef();
  programMove: boolean = false;
  readonly state: State = {
    pairs: [],
    brushDict: {},
    cellHeight: 0,
    cellWidth: 0,
    padding: 0,
    paddedCellHeight: 0,
    paddedCellWidth: 0,
    shouldUpdate: 2
  };

  componentDidUpdate(prevProps: Props) {
    const { columns, height, width, data } = this.props;
    if (columns === prevProps.columns && this.state.shouldUpdate <= 0) return;

    const cellHeight = height / columns.length;
    const cellWidth = width / columns.length;
    const padding = height * 0.02;

    const paddedCellHeight = cellHeight - 2 * padding;
    const paddedCellWidth = cellWidth - 2 * padding;

    const pairs: Pairs[] = [];

    columns.forEach((col1, idx1) => {
      const xValues = data.map(d => d[col1]) as number[];
      const xScale = scaleLinear()
        .domain([min(xValues) as number, max(xValues) as number])
        .range([0, paddedCellWidth]);

      columns.forEach((col2, idx2) => {
        if (idx1 <= idx2) {
          const yValues = data.map(d => d[col2]) as number[];
          const yScale = scaleLinear()
            .domain([min(yValues) as number, max(yValues) as number])
            .range([paddedCellHeight, 0]);

          pairs.push({
            X: {
              label: col1,
              idx: idx1,
              values: xValues,
              scale: xScale,
              scaledValues: xValues.map(v => (v ? xScale(v) : 0)),
              type: DimensionType.SPM
            },
            Y: {
              label: col2,
              idx: idx2,
              values: yValues,
              scale: yScale,
              scaledValues: yValues.map(v =>
                v ? yScale(v) : yScale.range()[0]
              ),
              type: DimensionType.SPM
            }
          });
        }
      });
    });

    const spm = select(this.ref.current);

    pairs.forEach(pair => {
      const id = `#id-${pair.X.label.replace(
        emptyRegex,
        "-"
      )}-${pair.Y.label.replace(emptyRegex, "-")}`;

      const plot = spm.select(id);

      const axesGroup = plot.select(`.${styles.axes}`);
      const xAxis = axesGroup.select(`.${styles.x_axis}`);
      const yAxis = axesGroup.select(`.${styles.y_axis}`);

      xAxis.call(axisBottom(pair.X.scale) as any);
      yAxis.call(axisLeft(pair.Y.scale) as any);

      const marksGroup = plot.select(`.${styles.marks}`);

      let marks = marksGroup
        .selectAll(`.${styles.circular_mark}`)
        .data(pair.X.scaledValues);

      marks = marks.join(
        enter =>
          enter
            .append("circle")
            .classed(styles.circular_mark, true)
            .classed(styles.regular_circular_mark, true)
            .attr("r", 3)
            .attr("cx", d => d)
            .attr("cy", (_, i) => pair.Y.scaledValues[i]),
        update =>
          update
            .classed(styles.circular_mark, true)
            .classed(styles.regular_circular_mark, true)
            .attr("r", 3)
            .attr("cx", d => d)
            .attr("cy", (_, i) => pair.Y.scaledValues[i]),
        exit => exit.remove()
      );

      const instance = this;
      const space = `${pair.X.label} ${pair.Y.label}`;

      const xScale = pair.X.scale;
      const yScale = pair.Y.scale;

      const brushGroup = plot.select(`.${styles.brush}`);
      const nBrush = brush()
        .extent([[-10, -10], [paddedCellWidth + 5, paddedCellHeight + 5]])
        .on("end", function() {
          if (instance.programMove) return;

          const selection = brushSelection(this);

          if (selection) {
            const [[left, top], [right, bottom]] = selection;
            const selectedIndices: number[] = [];

            pair.X.values.forEach((x, i) => {
              if (
                xScale(x) >= left &&
                xScale(x) <= right &&
                yScale(pair.Y.values[i]) >= top &&
                yScale(pair.Y.values[i]) <= bottom
              )
                selectedIndices.push(i);
              else if (
                (!x &&
                  left < xScale.range()[0] &&
                  yScale(pair.Y.values[i]) >= top &&
                  yScale(pair.Y.values[i]) <= bottom) ||
                (!pair.Y.values[i] &&
                  bottom > yScale.range()[1] &&
                  xScale(x) >= left &&
                  xScale(x) <= right) ||
                (!x &&
                  !pair.Y.values[i] &&
                  left < xScale.range()[0] &&
                  bottom > yScale.range()[1])
              )
                selectedIndices.push(i);
            });

            const br: Brush = {
              id: id,
              brush: nBrush,
              selectedPoints: selectedIndices,
              extents: [
                [xScale.invert(left), yScale.invert(top)],
                [xScale.invert(right), yScale.invert(bottom)]
              ]
            };

            const { brushDict } = instance.props;
            brushDict[space] = [br];
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
            brushDict[space] = [br];
            instance.props.updateBrushDictionary(brushDict);
            instance.setState({ shouldUpdate: 2 });
          }
        });

      const brs = this.props.brushDict[space];
      if (brs && brs.length === 1) {
        const core_brush = brs[0];
        brushGroup.html("");

        const coreBrushGroup = brushGroup
          .append("g")
          .classed(styles.core_brush, true);
        this.programMove = true;
        core_brush.brush(coreBrushGroup);
        coreBrushGroup.call(core_brush.brush.move, [
          [xScale(core_brush.extents[0][0]), yScale(core_brush.extents[0][1])],
          [xScale(core_brush.extents[1][0]), yScale(core_brush.extents[1][1])]
        ]);
        this.programMove = false;
      }
      const allSelectedPointsArr = Object.values(this.props.brushDict).map(
        c => c[0].selectedPoints
      );

      const sel = ([] as number[]).concat.apply(
        [] as number[],
        allSelectedPointsArr
      );

      const highlightIndices = new Uint8Array(pair.X.values.length);

      sel.forEach(s => (highlightIndices[s] = highlightIndices[s] + 1));

      marks.each(function(_, i) {
        select(this).classed(styles.regular_circular_mark, true);
        select(this).classed(styles.union_circular_mark, false);
        select(this).classed(styles.selected_circular_mark, false);

        if (highlightIndices[i] > 1) {
          select(this).classed(styles.regular_circular_mark, false);
          select(this).classed(styles.union_circular_mark, true);
          select(this).raise();
        } else if (highlightIndices[i] > 0) {
          select(this).classed(styles.regular_circular_mark, false);
          select(this).classed(styles.selected_circular_mark, true);
          select(this).raise();
        }
      });

      if (
        !instance.props.brushDict[space] ||
        instance.props.brushDict[space].length !== 1
      ) {
        brushGroup
          .append("g")
          .classed("brush", true)
          .attr("id", "temp")
          .call(nBrush as any);
      } else {
        brushGroup.selectAll(".brush").remove();
      }
    });

    if (this.state.shouldUpdate <= 0) this.setState({ shouldUpdate: 2 });

    if (this.state.shouldUpdate > 0)
      this.setState({
        cellHeight,
        cellWidth,
        padding,
        pairs,
        paddedCellHeight,
        paddedCellWidth,
        shouldUpdate: this.state.shouldUpdate - 1
      });
    else
      this.setState({
        cellHeight,
        cellWidth,
        padding,
        pairs,
        paddedCellHeight,
        paddedCellWidth
      });
  }

  render() {
    const { height, width, labels } = this.props;
    const {
      cellHeight,
      cellWidth,
      padding,
      pairs,
      paddedCellHeight,
      paddedCellWidth
    } = this.state;

    return (
      <g ref={this.ref}>
        {pairs.map((p: Pairs, idx: number) => (
          <g
            key={idx}
            className="scatterplot"
            id={`id-${p.X.label.replace(emptyRegex, "-")}-${p.Y.label.replace(
              emptyRegex,
              "-"
            )}`}
            transform={`translate(${cellWidth * p.X.idx}, ${cellHeight *
              p.Y.idx})`}
          >
            <rect
              className={styles.border_rect}
              height={cellHeight}
              width={cellWidth}
            />
            <g transform={`translate(${padding}, ${padding})`}>
              <rect
                className={styles.border_rect_red}
                height={paddedCellHeight}
                width={paddedCellWidth}
              />
              <g className={styles.axes}>
                <g
                  transform={`translate(0, ${paddedCellHeight})`}
                  className={styles.x_axis}
                />
                <g className={styles.y_axis} />
              </g>
              <g className={styles.marks} />
              <g className={styles.brush} />
            </g>
            <text transform={`translate(0, ${padding})`}>
              {p.X.label} {p.Y.label}
            </text>
          </g>
        ))}
      </g>
    );
  }
}

export default SPMComponent;
