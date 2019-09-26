import {max, min, ScaleLinear, scaleLinear} from 'd3';
import React, {useMemo, useState} from 'react';
import styled from 'styled-components';

import BrushComponent from '../Brush/Components/BrushComponent';
import {BrushCollection} from '../Brush/Types/Brush';

interface Props {
  data: any[];
  columns: string[];
  height: number;
  width: number;
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
        const brushes = brushCollectionDictionary[`${col1}|${col2}`];

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
            scaledY: yValues.map(y => (y ? yScale(y) : -1)),
          };

          pr.push(pair);
        }
      }),
    );

    return pr;
  }, [columns]);

  const selectedIndices: {[key: number]: number} = useMemo(() => {
    const si: {[key: number]: number} = {};

    pairs.forEach(pair => {
      const brushes =
        brushCollectionDictionary[`${pair.xLabel}|${pair.yLabel}`];

      if (brushes) {
        const brushList = Object.values(brushes).map(br => br.extents);
        pair.scaledX.forEach((x, d_id) => {
          const y = pair.scaledY[d_id];
          brushList.forEach(b => {
            if (x >= b.x1 && x <= b.x2 && y >= b.y1 && y <= b.y2) {
              console.log(true);
              if (!si[d_id]) si[d_id] = 0;
              si[d_id] += 1;
            }
          });
        });
      }
    });

    return si;
  }, [JSON.stringify(brushCollectionDictionary)]);

  return (
    <g>
      {pairs.map((p, i) => {
        return (
          <g
            key={i}
            transform={`translate(${p.x * scatterplotWidth}, ${p.y *
              scatterplotHeight})`}>
            <text>
              {p.xLabel} {p.yLabel}
            </text>
            <rect
              fill="none"
              stroke="black"
              height={scatterplotHeight}
              width={scatterplotWidth}
              opacity="0.5"
            />
            <g transform={`translate(${internalPadding},${internalPadding})`}>
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
                      data-id={Math.random()}
                      key={`${id} ${
                        selectedIndices[id] ? selectedIndices[id] : 0
                      }`}>
                      {selectedIndices[id] && selectedIndices[id] > 0 ? (
                        <SelectedCircularMark cx={valX} cy={valY} r="3" />
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
                  bottom: paddedHeight,
                }}
                onBrushUpdate={brushes => {
                  brushCollectionDictionary[
                    `${p.xLabel}|${p.yLabel}`
                  ] = brushes;
                  setBrushCollectionDictionary({
                    ...brushCollectionDictionary,
                  });
                }}></BrushComponent>
            </g>
          </g>
        );
      })}
    </g>
  );
};

export default SPMComponent;

const RegularCircularMark = styled('circle')`
  fill: #648fff;
`;

const SelectedCircularMark = styled('circle')`
  fill: #dc267f;
`;
