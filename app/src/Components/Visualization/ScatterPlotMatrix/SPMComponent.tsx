import { max, min, ScaleLinear, scaleLinear } from 'd3';
import React, { useMemo, useState } from 'react';
import { Popup } from 'semantic-ui-react';
import styled from 'styled-components';

import { ColumnMetaData } from '../../../App/VisStore/Dataset';
import Axis, { ScaleType } from '../Axis/Axis';
import BrushComponent from '../Brush/Components/BrushComponent';
import { BrushCollection } from '../Brush/Types/Brush';

interface Props {
  data: any[];
  columns: string[];
  height: number;
  width: number;
  columnMap: { [key: string]: ColumnMetaData };
}

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
  columnMap
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
                          />
                        ) : (
                          <SelectedCircularMark cx={valX} cy={valY} r="3" />
                        )
                      ) : (
                        <RegularCircularMark cx={valX} cy={valY} r="3" />
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
                onBrushUpdate={brushes => {
                  brushCollectionDictionary[
                    `${p.xLabel}|${p.yLabel}`
                  ] = brushes;
                  setBrushCollectionDictionary({
                    ...brushCollectionDictionary
                  });
                }}
              />
            </g>
          </g>
        );
      })}
    </g>
  );
};

export default SPMComponent;

const CircularMark = styled("circle")`
  opacity: 0.5;
`;

const RegularCircularMark = styled(CircularMark)`
  fill: #648fff;
`;

const UnionSelectedCircularMark = styled(CircularMark)`
  fill: #ffb000;
  opacity: 0.8;
`;

const SelectedCircularMark = styled(CircularMark)`
  fill: #dc267f;
  opacity: 0.8;
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
