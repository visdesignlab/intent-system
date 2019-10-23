import {
  axisBottom,
  axisLeft,
  max,
  min,
  scaleLinear,
  scaleOrdinal,
  schemeSet2,
  select,
} from 'd3';
import React, {createRef, FC, RefObject, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Popup} from 'semantic-ui-react';
import styled from 'styled-components';

import {Dataset} from '../Stores/Types/Dataset';
import {SinglePlot} from '../Stores/Types/Plots';
import {removePlot, updatePlot} from '../Stores/Visualization/Setup/PlotsRedux';
import VisualizationState from '../Stores/Visualization/VisualizationState';
import BrushComponent from './Brush/Components/BrushComponent';
import {ThunkDispatch} from 'redux-thunk';
import {BrushAffectType} from './Brush/Types/Brush';
import {
  RectangularSelection,
  MultiBrushBehavior,
  VisualizationType,
  PointSelection,
  PointDeselection,
} from '../contract';
import {ADD_INTERACTION} from '../Stores/Visualization/Setup/InteractionsRedux';

interface OwnProps {
  plot: SinglePlot;
  size: number;
  lastPlot: boolean;
}

interface StateProps {
  dataset: Dataset;
  multiBrushBehavior: MultiBrushBehavior;
}

interface DispatchProps {
  updatePlot: (plot: SinglePlot, addInteraction: boolean) => void;
  removePlot: (plot: SinglePlot) => void;
  addBrush: (
    selection: RectangularSelection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => void;
  removeBrush: (
    selection: RectangularSelection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => void;
  updateBrush: (
    selection: RectangularSelection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => void;
  addPointSelection: (
    interaction: PointSelection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => void;
  addPointDeselection: (
    interaction: PointDeselection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => void;
}

type Props = OwnProps & StateProps & DispatchProps;

const Scatterplot: FC<Props> = ({
  plot,
  size,
  dataset,
  lastPlot,
  updatePlot,
  removePlot,
  addBrush,
  updateBrush,
  removeBrush,
  multiBrushBehavior,
  addPointDeselection,
  addPointSelection,
}: Props) => {
  const xAxisRef: RefObject<SVGGElement> = createRef();
  const yAxisRef: RefObject<SVGGElement> = createRef();

  const {x, y, color, brushes} = plot;
  const data = dataset.data.map(v => ({
    x: v[x],
    y: v[y],
    color: v[color],
  }));

  const [mouseIsDown, setMouseIsDown] = useState(false);

  const padding = 50;
  const paddedSize = size - 2 * padding;
  const xScale = scaleLinear()
    .domain([min(data.map(d => d.x)), max(data.map(d => d.x))])
    .range([0, paddedSize]);

  const yScale = scaleLinear()
    .domain([max(data.map(d => d.y)), min(data.map(d => d.y))])
    .range([0, paddedSize]);

  const colorScale = scaleOrdinal()
    .domain([...new Set(data.map(d => d.color))])
    .range(schemeSet2);

  useEffect(() => {
    if (xAxisRef.current) {
      const xAxis = axisBottom(xScale).tickFormat((d: any) => {
        if (d > 10000000) return `${d / 10000000}M`;
        if (d > 1000) return `${d / 1000}K`;
        return d;
      });
      select(xAxisRef.current).call(xAxis);
    }
    if (yAxisRef.current) {
      const yAxis = axisLeft(yScale).tickFormat((d: any) => {
        if (d > 10000000) return `${d / 10000000}M`;
        if (d > 1000) return `${d / 1000}K`;
        return d;
      });
      select(yAxisRef.current).call(yAxis);
    }
  }, [size, xAxisRef, xScale, yAxisRef, yScale]);

  const selectedIndices: {[key: number]: number} = {};

  const extentPadding = 5;
  const [height, width] = [
    Math.abs(paddedSize + extentPadding - (0 - extentPadding)),
    Math.abs(0 - extentPadding - (paddedSize + extentPadding)),
  ];

  let maxIntersection = 1;

  data.forEach((d, i) => {
    if (plot.selectedPoints.includes(i)) {
      if (!selectedIndices[i]) {
        selectedIndices[i] = 0;
      }
      selectedIndices[i] += 1;
    }

    Object.values(brushes).forEach(brush => {
      let {x1, x2, y1, y2} = brush.extents;
      [x1, x2, y1, y2] = [
        xScale.invert(x1 * width - extentPadding),
        xScale.invert(x2 * width - extentPadding),
        yScale.invert(y1 * height - extentPadding),
        yScale.invert(y2 * height - extentPadding),
      ];

      if (d.x >= x1 && d.x <= x2 && d.y <= y1 && d.y >= y2) {
        if (!selectedIndices[i]) {
          selectedIndices[i] = 0;
        }
        selectedIndices[i] += 1;
        if (selectedIndices[i] > maxIntersection)
          maxIntersection = selectedIndices[i];
      }
    });
  });

  const BrushLayer = (
    <g
      onMouseDown={() => setMouseIsDown(true)}
      onMouseUp={() => setMouseIsDown(false)}
      onMouseOut={() => setMouseIsDown(false)}>
      <BrushComponent
        extents={{
          left: 0,
          top: 0,
          right: paddedSize,
          bottom: paddedSize,
        }}
        extentPadding={extentPadding}
        onBrushUpdate={(brushes, affectedBrush, affectType) => {
          const currPlot = {...plot};
          currPlot.brushes = {...brushes};
          updatePlot(currPlot, false);
          let {x1, x2, y1, y2} = affectedBrush.extents;
          [x1, x2, y1, y2] = [
            xScale.invert(x1 * width - extentPadding),
            xScale.invert(x2 * width - extentPadding),
            yScale.invert(y1 * height - extentPadding),
            yScale.invert(y2 * height - extentPadding),
          ];

          const selectedIndices: {[key: number]: number} = {};

          data.forEach((d, i) => {
            if (d.x >= x1 && d.x <= x2 && d.y <= y1 && d.y >= y2) {
              if (!selectedIndices[i]) {
                selectedIndices[i] = 0;
              }
              selectedIndices[i] += 1;
            }
          });

          const selection: RectangularSelection = {
            plot,
            dataIds: Object.keys(selectedIndices).map(d => parseInt(d)),
            brushId: affectedBrush.id,
            left: x1,
            right: x2,
            top: y1,
            bottom: y2,
          };

          switch (affectType) {
            case BrushAffectType.ADD:
              addBrush(selection, multiBrushBehavior);
              break;
            case BrushAffectType.CHANGE:
              updateBrush(selection, multiBrushBehavior);
              break;
            case BrushAffectType.REMOVE:
              selection.dataIds = null as any;
              selection.left = null as any;
              selection.right = null as any;
              selection.top = null as any;
              selection.bottom = null as any;
              removeBrush(selection, multiBrushBehavior);
              break;
            default:
              throw new Error(
                'Wrong brush effect! Something went wrong with BrushComponent',
              );
          }
        }}
      />
    </g>
  );

  const MarksLayer = (
    <g style={{pointerEvents: mouseIsDown ? 'none' : 'all'}} className="marks">
      {data.map((d, i) => (
        <Popup
          key={i}
          trigger={
            selectedIndices[i] ? (
              selectedIndices[i] < maxIntersection ? (
                <UnionMark
                  onClick={() => {
                    let points = plot.selectedPoints.filter(p => p !== i);

                    plot.selectedPoints = points;
                    updatePlot({...plot}, false);
                    addPointDeselection(
                      {
                        plot,
                        dataIds: [i],
                        kind: 'deselection',
                      },
                      multiBrushBehavior,
                    );
                  }}
                  fill={colorScale(d.color) as string}
                  cx={xScale(d.x)}
                  cy={yScale(d.y)}
                  r={5}></UnionMark>
              ) : (
                <IntersectionMark
                  onClick={() => {
                    let points = plot.selectedPoints.filter(p => p !== i);

                    plot.selectedPoints = points;
                    updatePlot({...plot}, false);

                    addPointDeselection(
                      {
                        plot,
                        dataIds: [i],
                        kind: 'deselection',
                      },
                      multiBrushBehavior,
                    );
                  }}
                  fill={colorScale(d.color) as string}
                  cx={xScale(d.x)}
                  cy={yScale(d.y)}
                  r={5}></IntersectionMark>
              )
            ) : (
              <RegularMark
                onClick={() => {
                  let points = plot.selectedPoints;
                  if (!points.includes(i)) points.push(i);
                  plot.selectedPoints = points;
                  updatePlot({...plot}, false);
                  addPointSelection(
                    {
                      plot,
                      dataIds: [i],
                      kind: 'selection',
                    },
                    multiBrushBehavior,
                  );
                }}
                fill={colorScale(d.color) as string}
                cx={xScale(d.x)}
                cy={yScale(d.y)}
                r={5}></RegularMark>
            )
          }
          content={
            <div>
              <h1>{dataset.data[i].country}</h1>
              <pre>{JSON.stringify(dataset.data[i], null, 2)}</pre>
            </div>
          }></Popup>
      ))}
    </g>
  );

  const [first, second] = [BrushLayer, MarksLayer];

  return (
    <g>
      <g transform={`translate(${padding}, ${padding})`}>
        <g className="axis">
          <g transform={`translate(0, ${xScale.range()[1]})`}>
            <g ref={xAxisRef} className="x"></g>
            <text
              transform={`translate(${paddedSize / 2}, 40)`}
              fontSize="1.2em"
              textAnchor="middle">
              <tspan style={{fontWeight: 'bold'}}>
                {dataset.columnMaps[plot.x].text}
              </tspan>
              (<tspan>{dataset.columnMaps[plot.x].unit}</tspan>)
            </text>
          </g>
          <g>
            <g ref={yAxisRef} className="y"></g>
            <text
              fontSize="1.2em"
              textAnchor="middle"
              transform={`translate(-40, ${paddedSize / 2})rotate(270)`}>
              <tspan style={{fontWeight: 'bold'}}>
                {dataset.columnMaps[plot.y].text}{' '}
              </tspan>
              (<tspan>{dataset.columnMaps[plot.y].unit}</tspan>)
            </text>
          </g>
        </g>
        <g className="plot">
          <rect
            x={-extentPadding}
            y={-extentPadding}
            height={paddedSize + extentPadding}
            width={paddedSize + extentPadding}
            fill="gray"
            opacity={0.05}></rect>
          {first}
          {second}
        </g>
      </g>
      <g className="close" transform={`translate(0, ${size - padding})`}>
        {!lastPlot && (
          <CloseGroup>
            <circle fill="red" r={10} onClick={() => removePlot(plot)}></circle>
          </CloseGroup>
        )}
        )}
      </g>
    </g>
  );
};

const mapStateToProps = (state: VisualizationState): StateProps => ({
  dataset: state.dataset,
  multiBrushBehavior: state.multiBrushBehaviour,
});

const mapDispatchToProps = (
  dispatch: ThunkDispatch<{}, {}, any>,
): DispatchProps => ({
  removePlot: (plot: SinglePlot) => {
    dispatch(removePlot(plot));
  },
  updatePlot: (plot: SinglePlot, addInteraction: boolean) => {
    dispatch(updatePlot(plot, addInteraction));
  },
  addBrush: (
    interaction: RectangularSelection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => {
    dispatch({
      type: ADD_INTERACTION,
      args: {
        interaction: {
          visualizationType: VisualizationType.Grid,
          interactionType: interaction,
        },
        multiBrushBehavior: multiBrushBehavior,
      },
    });
  },
  removeBrush: (
    interaction: RectangularSelection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => {
    dispatch({
      type: ADD_INTERACTION,
      args: {
        interaction: {
          visualizationType: VisualizationType.Grid,
          interactionType: interaction,
        },
        multiBrushBehavior: multiBrushBehavior,
      },
    });
  },
  updateBrush: (
    interaction: RectangularSelection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => {
    dispatch({
      type: ADD_INTERACTION,
      args: {
        interaction: {
          visualizationType: VisualizationType.Grid,
          interactionType: interaction,
        },
        multiBrushBehavior: multiBrushBehavior,
      },
    });
  },
  addPointSelection: (
    interaction: PointSelection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => {
    dispatch({
      type: ADD_INTERACTION,
      args: {
        interaction: {
          visualizationType: VisualizationType.Grid,
          interactionType: interaction,
        },
        multiBrushBehavior,
      },
    });
  },
  addPointDeselection: (
    interaction: PointDeselection,
    multiBrushBehavior: MultiBrushBehavior,
  ) => {
    dispatch({
      type: ADD_INTERACTION,
      args: {
        interaction: {
          visualizationType: VisualizationType.Grid,
          interactionType: interaction,
        },
        multiBrushBehavior,
      },
    });
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Scatterplot);

const CloseGroup = styled('g')`
  cursor: pointer;
`;

interface MarkProps {
  fill?: string;
}

const RegularMark = styled('circle')<MarkProps>`
  fill: ${props => (props.fill ? props.fill : 'black')};
  opacity: 0.6;
  cursor: pointer;
  &:hover {
    r: 7px;
  }
`;

const UnionMark = styled(RegularMark)<MarkProps>`
  fill: ${props => (props.fill ? props.fill : 'black')};
  stroke: black;
  stroke-width: 1.5px;
  opacity: 0.6;
`;

const IntersectionMark = styled(RegularMark)<MarkProps>`
  fill: ${props => (props.fill ? props.fill : 'black')};
  stroke: red;
  stroke-width: 1.5px;
  opacity: 0.6;
`;
