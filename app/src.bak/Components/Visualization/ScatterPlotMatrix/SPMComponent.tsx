import { MultiBrushBehavior, VisualizationType } from '@visdesignlab/intent-contract';
import { max, min, ScaleLinear, scaleLinear, ScaleOrdinal } from 'd3';
import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Popup } from 'semantic-ui-react';
import styled from 'styled-components';

import { ColumnMetaData } from '../../../App/VisStore/Dataset';
import { InteractionHistoryActions } from '../../../App/VisStore/InteractionHistoryReducer';
import { VisualizationState } from '../../../App/VisStore/VisualizationState';
import Axis, { ScaleType } from '../Axis/Axis';
import BrushComponent from '../Brush/Components/BrushComponent';
import { BrushAffectType, BrushCollection } from '../Brush/Types/Brush';

interface StateProps {
  brushBehavior: MultiBrushBehavior;
}

interface DispatchProps {
  addRectangularSelection: (
    dimensions: string[],
    brushId: string,
    points: number[],
    extents: number[][],
    brushBehavior: MultiBrushBehavior
  ) => void;
}

interface OwnProps {
  data: any[];
  columns: string[];
  height: number;
  width: number;
  columnMap: { [key: string]: ColumnMetaData };
  noOfUniqueCategories: number;
  colorScale: ScaleOrdinal<string, unknown>;
  categoricalColumn: string;
}

type Props = OwnProps & DispatchProps & StateProps;

interface ScatterplotDimension {
  x: number;
  y: number;
  xLabel: string;
  yLabel: string;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  scaledX: number[];
  scaledY: number[];
}

const SPMComponent: React.FC<Props> = ({
  data,
  columns,
  height,
  width,
  columnMap,
  addRectangularSelection,
  brushBehavior,
  noOfUniqueCategories,
  colorScale,
  categoricalColumn
}: Props) => {
  const [brushCollectionDictionary, setBrushCollectionDictionary] = useState<{
    [key: string]: BrushCollection;
  }>({});
  const scatterplotHeight = height / columns.length;
  const scatterplotWidth = width / columns.length;
  const internalPadding = 20;

  const paddedHeight = scatterplotHeight - internalPadding * 2;
  const paddedWidth = scatterplotWidth - internalPadding * 2;

  const pairs: ScatterplotDimension[] = useMemo(() => {
    const pr: ScatterplotDimension[] = [];

    columns.forEach((col1, idx1) =>
      columns.forEach((col2, idx2) => {
        const xValues = data.map(d => d[col1]) as number[];
        const yValues = data.map(d => d[col2]) as number[];
        const [minX, maxX] = [min(xValues), max(xValues)] as number[];
        const [minY, maxY] = [min(yValues), max(yValues)] as number[];
        const xScale = scaleLinear()
          .domain([minX, maxX])
          .range([0, paddedWidth]);
        const yScale = scaleLinear()
          .domain([minY, maxY])
          .range([paddedHeight, 0]);
        if (idx1 <= idx2) {
          const pair = {
            x: idx1,
            y: idx2,
            xLabel: col1,
            yLabel: col2,
            xScale,
            yScale,
            scaledX: xValues.map(x => (x ? xScale(x) : -1)),
            scaledY: yValues.map(y => (y ? yScale(y) : -1))
          };

          pr.push(pair);
        }
      })
    );

    return pr;
  }, [columns, data, paddedHeight, paddedWidth]);

  const selectedIndices: { [key: number]: number } = useMemo(() => {
    const si: { [key: number]: number } = {};

    pairs.forEach(pair => {
      const brushes =
        brushCollectionDictionary[`${pair.xLabel}|${pair.yLabel}`];

      if (brushes) {
        const brushList = Object.values(brushes).map(br => br.extents);
        pair.scaledX.forEach((x, d_id) => {
          const y = pair.scaledY[d_id];
          brushList.forEach(b => {
            if (x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2) {
              if (!si[d_id]) si[d_id] = 0;
              si[d_id] += 1;
            }
          });
        });
      }
    });

    return si;
  }, [brushCollectionDictionary, pairs]);

  const maxValue = max(Object.values(selectedIndices));

  return (
    <g>
      {noOfUniqueCategories > 0 && (
        <g transform={`translate(${width - 150}, 0)`}>
          <rect
            fill="smokegray"
            stroke="none"
            height={noOfUniqueCategories * 50}
            width={150}
            opacity="0.1"
          />
          {colorScale.domain().map((continent, i) => (
            <g key={continent} transform={`translate(0, ${50 * i})`}>
              <rect height="50" width="150" fill="none" stroke="black"></rect>
              <circle
                r={10}
                fill={colorScale(continent) as string}
                transform={`translate(20, 25)`}
              />
              <text
                style={{
                  dominantBaseline: "middle",
                  fontSize: "1.2em",
                  textTransform: "capitalize"
                }}
                transform={`translate(50, 25)`}
              >
                {continent}
              </text>
            </g>
          ))}
        </g>
      )}
      {pairs.map((p, i) => {
        return (
          <g
            key={i}
            transform={`translate(${p.x * scatterplotWidth}, ${p.y *
              scatterplotHeight})`}
          >
            <rect
              fill="none"
              stroke="none"
              height={scatterplotHeight}
              width={scatterplotWidth}
              opacity="0.5"
            />
            <g transform={`translate(${internalPadding},${internalPadding})`}>
              <Axis scale={p.yScale} position={ScaleType.LEFT} />
              <g transform={`translate(0, ${p.yScale.range()[0]})`}>
                <Axis rotate scale={p.xScale} position={ScaleType.BOTTOM} />
                {p.y === columns.length - 1 && (
                  <Popup
                    content={columnMap[p.xLabel] && columnMap[p.xLabel].unit}
                    trigger={
                      <XAxisLabelText
                        transform={`translate(${paddedWidth / 2}, 50)`}
                      >
                        {columnMap[p.xLabel]
                          ? columnMap[p.xLabel].text
                          : p.xLabel}
                      </XAxisLabelText>
                    }
                  />
                )}
              </g>
              {p.x === 0 && (
                <Popup
                  content={columnMap[p.yLabel] && columnMap[p.yLabel].unit}
                  trigger={
                    <YAxisLabelText
                      transform={`translate(-40, ${paddedHeight /
                        2}) rotate(90)`}
                    >
                      {columnMap[p.yLabel]
                        ? columnMap[p.yLabel].text
                        : p.yLabel}
                    </YAxisLabelText>
                  }
                />
              )}

              <rect
                fill="none"
                stroke="blue"
                height={paddedHeight}
                width={paddedWidth}
                opacity="0.2"
              />
              {p.scaledX.map((x, id) => {
                const valX = x;
                const valY = p.scaledY[id];
                return (
                  valX !== -1 &&
                  valY !== -1 && (
                    <g
                      key={`${id} ${
                        selectedIndices[id] ? selectedIndices[id] : 0
                      }`}
                      data-id={Math.random()}
                    >
                      {selectedIndices[id] && selectedIndices[id] > 0 ? (
                        selectedIndices[id] === maxValue ? (
                          <UnionSelectedCircularMark
                            cx={valX}
                            cy={valY}
                            r="3"
                            color={
                              noOfUniqueCategories > 0
                                ? (colorScale(
                                    data[id][categoricalColumn]
                                  ) as string)
                                : (null as any)
                            }
                          />
                        ) : (
                          <SelectedCircularMark
                            cx={valX}
                            cy={valY}
                            r="3"
                            color={
                              noOfUniqueCategories > 0
                                ? (colorScale(
                                    data[id][categoricalColumn]
                                  ) as string)
                                : (null as any)
                            }
                          />
                        )
                      ) : (
                        <RegularCircularMark
                          cx={valX}
                          cy={valY}
                          r="3"
                          color={
                            noOfUniqueCategories > 0
                              ? (colorScale(
                                  data[id][categoricalColumn]
                                ) as string)
                              : (null as any)
                          }
                        />
                      )}
                    </g>
                  )
                );
              })}
              <BrushComponent
                extents={{
                  left: 0,
                  top: 0,
                  right: paddedWidth,
                  bottom: paddedHeight
                }}
                onBrushUpdate={(brushes, affectedBrush, affectType) => {
                  const key = `${p.xLabel}|${p.yLabel}`;
                  brushCollectionDictionary[key] = brushes;
                  setBrushCollectionDictionary({
                    ...brushCollectionDictionary
                  });
                  const extents = [
                    [
                      p.xScale.invert(affectedBrush.extents.x1),
                      p.yScale.invert(affectedBrush.extents.y1)
                    ],
                    [
                      p.xScale.invert(affectedBrush.extents.x2),
                      p.yScale.invert(affectedBrush.extents.y2)
                    ]
                  ];

                  const selectedPoints: number[] = [];
                  p.scaledX.forEach((x, x_idx) => {
                    const y = p.scaledY[x_idx];
                    if (
                      x >= affectedBrush.extents.x1 &&
                      x <= affectedBrush.extents.x2 &&
                      y >= affectedBrush.extents.y1 &&
                      y <= affectedBrush.extents.y2
                    ) {
                      selectedPoints.push(x_idx);
                    }
                  });
                  switch (affectType) {
                    case BrushAffectType.ADD:
                    case BrushAffectType.CHANGE:
                      addRectangularSelection(
                        [p.xLabel, p.yLabel],
                        affectedBrush.id,
                        selectedPoints,
                        extents,
                        brushBehavior
                      );
                      break;
                    case BrushAffectType.REMOVE:
                      addRectangularSelection(
                        [p.xLabel, p.yLabel],
                        affectedBrush.id,
                        [],
                        [[], []],
                        brushBehavior
                      );
                      break;
                    default:
                      return;
                  }
                }}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
};

const mapStateToProps = (state: VisualizationState): StateProps => ({
  brushBehavior: state.mutliBrushBehavior
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  addRectangularSelection: (
    dimensions: string[],
    brushId: string,
    points: number[],
    extents: number[][],
    brushBehavior: MultiBrushBehavior
  ) => {
    dispatch({
      type: InteractionHistoryActions.ADD_INTERACTION,
      args: {
        multiBrushBehavior: brushBehavior,
        interaction: {
          visualizationType: VisualizationType.ScatterplotMatrix,
          interactionType: {
            dimensions: dimensions,
            brushId,
            dataIds: points,
            left: extents[0][0],
            right: extents[1][0],
            top: extents[0][1],
            bottom: extents[1][1]
          }
        }
      }
    });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SPMComponent);

interface CircularMarkProp {
  color?: string;
}

const CircularMark = styled("circle")<CircularMarkProp>``;

const RegularCircularMark = styled(CircularMark)`
  fill: ${props => (props.color ? props.color : "#648fff")};
`;

const UnionSelectedCircularMark = styled(CircularMark)`
  fill: ${props => (props.color ? props.color : "#ffb000")};
  stroke: #ffb000;
`;

const SelectedCircularMark = styled(CircularMark)`
  fill: ${props => (props.color ? props.color : "#dc267f")};
  stroke: #dc267f;
`;

const AxisLabelText = styled("text")`
  font-size: 1.2em;
`;

const XAxisLabelText = styled(AxisLabelText)`
  text-anchor: middle;
`;

const YAxisLabelText = styled(AxisLabelText)`
  text-anchor: middle;
`;
