import * as React from "react";

import { Brush, BrushDictionary } from "../Data Types/BrushType";
import { ScaleLinear, brush, brushSelection, select, max } from "d3";

import { MarkData } from "../Data Types/MarkData";
import { Popup, Header } from "semantic-ui-react";
import styled from "styled-components";
import { VisualizationType } from "@visdesignlab/intent-contract";
import {
  InteractionHistoryAction,
  InteractionHistoryActions
} from "../../../App/VisStore/InteractionHistoryReducer";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import { datasetName } from "../../..";

interface RequiredProps {
  vis: VisualizationType;
  xValues: number[];
  yValues: number[];
  xLabel: string;
  yLabel: string;
  labels: string[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  brushDict: BrushDictionary;
  debugMode: boolean;
  debugKey: string;
  updateBrushDictionary: (dict: BrushDictionary) => void;
  pointSelection: number[];
  updatePointSelection: (points: number[]) => void;
  updateDebugKeys: (keys: string[]) => void;
}

interface StateProps {}

interface DispatchProps {
  addPointSelection: (
    vis: VisualizationType,
    dimensions: string[],
    point: number
  ) => void;
  addPointDeselection: (
    vis: VisualizationType,
    dimensions: string[],
    point: number
  ) => void;
  addRectangularSelection: (
    vis: VisualizationType,
    dimensions: string[],
    brushId: string,
    points: number[],
    extents: number[][]
  ) => void;
}

interface OptionalProps {
  markSize?: number;
  mark_color?: string;
  opacity?: number;
}

interface State {
  brushDict: { [key: string]: any };
  debugInfo: { [key: string]: any };
}

type Props = RequiredProps & OptionalProps & StateProps & DispatchProps;

class MarkSeries extends React.Component<Props, State> {
  marksRef: React.RefObject<SVGGElement> = React.createRef();
  brushRef: React.RefObject<SVGGElement> = React.createRef();
  firstCall: boolean = true;
  programMove: boolean = false;

  static defaultProps: OptionalProps = {
    markSize: 3,
    opacity: 1
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      brushDict: {},
      debugInfo: {}
    };
  }

  componentDidMount() {
    this.setState({
      brushDict: {}
    });
  }

  componentDidUpdate(prevProps: Props) {
    const { brushRef } = this;
    const brushGElement = brushRef.current as SVGGElement;
    const {
      xScale,
      yScale,
      xLabel,
      yLabel,
      xValues,
      yValues,
      addRectangularSelection,
      vis,
      updateDebugKeys
    } = this.props;

    if (
      xLabel.length > 0 &&
      yLabel.length > 0 &&
      (prevProps.xLabel !== xLabel || prevProps.yLabel !== yLabel)
    ) {
      const data = [xLabel, yLabel];
      axios
        .post(`/dataset/${datasetName}/info`, JSON.stringify(data), {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(res => {
          this.setState({
            debugInfo: res.data
          });

          if (Object.values(res.data.measures).length > 0) {
            const measure = res.data.measures[0];
            const keys = Object.keys(measure).filter(
              key => !isNaN(measure[key])
            );
            updateDebugKeys(["Off", ...keys]);
          }
        })
        .catch(err => console.log(err));
    }

    const space = `${xLabel} ${yLabel}`;

    const height = yScale.range()[1];
    const width = xScale.range()[1];

    const newBrush = () => {
      const brushes = this.props.brushDict[space] || [];

      const instance = this;

      const nBrush = brush()
        .extent([[-10, -10], [width + 10, height + 10]])
        .on("end", function() {
          if (instance.programMove) return;
          const id = brushes[brushes.length - 1].id;
          const lastBrush = (document.getElementById(
            `brush-${id}`
          ) as unknown) as SVGGElement;

          const lastSelection = brushSelection(lastBrush);

          if (lastSelection && lastSelection[0] !== lastSelection[1]) {
            newBrush();
          }

          const selection = brushSelection(this);

          if (selection) {
            const [[left, top], [right, bottom]] = selection;
            const selectedIndices: number[] = [];

            xValues.forEach((x, i) => {
              if (
                xScale(x) >= left &&
                xScale(x) <= right &&
                yScale(yValues[i]) >= top &&
                yScale(yValues[i]) <= bottom
              )
                selectedIndices.push(i);
              else if (
                (!x &&
                  left < xScale.range()[0] &&
                  yScale(yValues[i]) >= top &&
                  yScale(yValues[i]) <= bottom) ||
                (!yValues[i] &&
                  bottom > yScale.range()[1] &&
                  xScale(x) >= left &&
                  xScale(x) <= right) ||
                (!x &&
                  !yValues[i] &&
                  left < xScale.range()[0] &&
                  bottom > yScale.range()[1])
              ) {
                selectedIndices.push(i);
              }
            });

            const br: Brush = {
              id: select(this)
                .attr("id")
                .replace("brush-", ""),
              brush: nBrush,
              selectedPoints: selectedIndices,
              extents: [
                [xScale.invert(left), yScale.invert(top)],
                [xScale.invert(right), yScale.invert(bottom)]
              ]
            };

            brushes.forEach(brs => {
              if (brs.id === br.id) {
                brs.extents = br.extents;
                brs.selectedPoints = br.selectedPoints;
              }
            });

            const { brushDict } = instance.props;

            brushDict[space] = brushes;
            instance.setState({
              brushDict
            });

            addRectangularSelection(
              vis,
              [xLabel, yLabel],
              br.id,
              br.selectedPoints,
              br.extents
            );
          }
        });

      brushes.push({
        id: new Date().valueOf().toString(),
        brush: nBrush,
        selectedPoints: [],
        extents: [[], []]
      });

      const { brushDict } = this.props;
      brushDict[space] = brushes;
      this.props.updateBrushDictionary(brushDict);

      drawBrush();
    };

    const drawBrush = () => {
      const instance = this;
      const brushes = this.props.brushDict[space] || [];

      const brushGSelection = select(brushGElement);
      const brushesSelection = brushGSelection
        .selectAll(".brush")
        .data(brushes, (d: any) => d.id);

      brushesSelection.exit().remove();

      brushesSelection
        .enter()
        .insert("g", ".brush")
        .classed("brush", true)
        .attr("id", brush => `brush-${brush.id}`)
        .each(function(brushObject) {
          brushObject.brush(select(this));
          const brs = instance.props.brushDict[space].filter(
            d => d.id === brushObject.id
          );
          if (brs.length === 1) {
            const br = brs[0];
            instance.programMove = true;
            select(this).call(brushObject.brush.move, [
              [xScale(br.extents[0][0]), yScale(br.extents[0][1])],
              [xScale(br.extents[1][0]), yScale(br.extents[1][1])]
            ]);
            instance.programMove = false;
          }
        });

      brushesSelection.each(function(brushObject) {
        select(this)
          .classed("brush", true)
          .selectAll(".overlay")
          .style("pointer-events", () => {
            let brush = brushObject.brush;
            return brushes[brushes.length - 1].id === brushObject.id &&
              brush !== undefined
              ? "all"
              : "none";
          });
      });
    };

    if (!this.props.brushDict[space]) {
      newBrush();
    }
    drawBrush();
  }

  render() {
    const {
      vis,
      xValues,
      xScale,
      yValues,
      yScale,
      markSize,
      opacity,
      labels,
      xLabel,
      yLabel,
      pointSelection,
      updatePointSelection,
      addPointDeselection,
      addPointSelection,
      debugMode,
      debugKey
    } = this.props;
    const { brushDict } = this.props;
    const { debugInfo } = this.state;
    const space = `${xLabel} ${yLabel}`;

    const data: MarkData[] = xValues.map((x, i) => ({
      rawX: x,
      rawY: yValues[i],
      scaledX: x ? xScale(x) : 0,
      scaledY: yValues[i] ? yScale(yValues[i]) : yScale.range()[1],
      label: labels[i]
    }));

    const selectedArrays = ([] as Brush[]).concat
      .apply([] as Brush[], Object.values(brushDict))
      .map(b => b.selectedPoints);

    const selectedPoints = ([] as number[]).concat.apply([], selectedArrays);

    const higlightedIndices = new Uint8Array(data.length);

    selectedPoints.forEach(
      p => (higlightedIndices[p] = higlightedIndices[p] + 1)
    );

    const highestIntersection = max(higlightedIndices);

    const thisSpacePoints = ([] as number[]).concat.apply(
      [],
      (brushDict[space] || []).map(b => b.selectedPoints)
    );

    return !debugMode ? (
      <g>
        <g ref={this.brushRef} />
        <g ref={this.marksRef}>
          {data.map((d, i) => {
            return (
              <Popup
                key={`${JSON.stringify(d)} ${i}`}
                content={
                  <div>
                    <Header>{labels[i]}</Header>
                    <pre>{debugInfo ? debugInfo["dimensions"] : ""}</pre>
                    <pre>
                      {JSON.stringify(
                        debugInfo["measures"] ? debugInfo["measures"][i] : {},
                        null,
                        2
                      )}
                    </pre>
                  </div>
                }
                trigger={
                  higlightedIndices[i] > 0 || pointSelection.includes(i) ? (
                    higlightedIndices[i] === highestIntersection ? (
                      <UnionCircularMark
                        cx={d.scaledX}
                        cy={d.scaledY}
                        r={markSize}
                        opacity={opacity}
                        thisSpace={thisSpacePoints.includes(i)}
                        onClick={() => {
                          let sel = [...pointSelection];
                          sel = sel.filter(idx => idx !== i);
                          updatePointSelection(sel);
                          addPointDeselection(vis, [xLabel, yLabel], i);
                        }}
                      />
                    ) : (
                      <SelectedCircularMark
                        cx={d.scaledX}
                        cy={d.scaledY}
                        r={markSize}
                        opacity={opacity}
                        thisSpace={thisSpacePoints.includes(i)}
                        onClick={() => {
                          let sel = [...pointSelection];
                          sel = sel.filter(idx => idx !== i);
                          updatePointSelection(sel);
                          addPointDeselection(vis, [xLabel, yLabel], i);
                        }}
                      />
                    )
                  ) : (
                    <RegularCircularMark
                      cx={d.scaledX}
                      cy={d.scaledY}
                      r={markSize}
                      opacity={opacity}
                      thisSpace={thisSpacePoints.includes(i)}
                      onClick={() => {
                        let sel = [...pointSelection];
                        sel.push(i);
                        updatePointSelection(sel);
                        addPointSelection(
                          VisualizationType.ScatterPlot,
                          [xLabel, yLabel],
                          i
                        );
                      }}
                    />
                  )
                }
              />
            );
          })}
        </g>
      </g>
    ) : (
      <g>
        <g ref={this.brushRef} />
        <g ref={this.marksRef}>
          {data.map((d, i) => {
            return (
              <Popup
                key={`${JSON.stringify(d)} ${i}`}
                content={
                  <div>
                    <Header>{labels[i]}</Header>
                    <pre>{debugInfo ? debugInfo["dimensions"] : ""}</pre>
                    <pre>
                      {JSON.stringify(
                        debugInfo["measures"] ? debugInfo["measures"][i] : {},
                        null,
                        2
                      )}
                    </pre>
                  </div>
                }
                trigger={
                  debugInfo.measures[i][debugKey] === 0 ? (
                    <RegularCircularMark
                      cx={d.scaledX}
                      cy={d.scaledY}
                      r={markSize}
                      opacity={opacity}
                      thisSpace={thisSpacePoints.includes(i)}
                    />
                  ) : (
                    <SelectedCircularMark
                      cx={d.scaledX}
                      cy={d.scaledY}
                      r={markSize}
                      opacity={opacity}
                      thisSpace={thisSpacePoints.includes(i)}
                      onClick={() => {
                        let sel = [...pointSelection];
                        sel = sel.filter(idx => idx !== i);
                        updatePointSelection(sel);
                        addPointDeselection(vis, [xLabel, yLabel], i);
                      }}
                    />
                  )
                }
              />
            );
          })}
        </g>
      </g>
    );
  }
}

const mapDispatchToProp = (
  dispatch: Dispatch<InteractionHistoryAction>
): DispatchProps => ({
  addPointSelection: (
    vis: VisualizationType,
    dimensions: string[],
    point: number
  ) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        visualizationType: vis,
        interactionType: {
          kind: "selection",
          dimensions: dimensions,
          dataIds: [point]
        }
      }
    });
  },
  addPointDeselection: (
    vis: VisualizationType,
    dimensions: string[],
    point: number
  ) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        visualizationType: vis,
        interactionType: {
          kind: "deselection",
          dimensions: dimensions,
          dataIds: [point]
        }
      }
    });
  },
  addRectangularSelection: (
    vis: VisualizationType,
    dimensions: string[],
    brushId: string,
    points: number[],
    extents: number[][]
  ) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        visualizationType: vis,
        interactionType: {
          dimensions: dimensions,
          brushId: brushId,
          dataIds: points,
          left: extents[0][0],
          right: extents[1][0],
          top: extents[0][1],
          bottom: extents[1][1]
        }
      }
    });
  }
});

export default connect(
  null,
  mapDispatchToProp
)(MarkSeries);

interface Extend {
  thisSpace: boolean;
}

const RegularCircularMark = styled("circle")<Extend>`
  fill: #648fff;
`;

const SelectedCircularMark = styled("circle")<Extend>`
  fill: #dc267f;
  stroke-width: ${props => (props.thisSpace ? "2px" : 0)};
  stroke: #b31964;
`;

const UnionCircularMark = styled("circle")<Extend>`
  fill: #ffb000;
  stroke-width: ${props => (props.thisSpace ? "2px" : 0)};
  stroke: #bb840a;
`;
