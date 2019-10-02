import React, {FC, useState} from 'react';

import {ColumnMap} from '../../../App/VisStore/Dataset';
import styled from 'styled-components';

interface OwnProps {
  data: any[];
  columns: string[];
  numericColumns: string[];
  categoricalColumns: string[];
  labelColumn: string;
  columnMap: ColumnMap;
  defaultColumns: string[];
}

interface GridPlot {
  xLabel: string;
  yLabel: string;
  xPosition: number;
  yPosition: number;
}

export type GridContent = GridPlot[];

type Props = OwnProps;

const ScatterplotGrid: FC<Props> = ({defaultColumns}: Props) => {
  const [gridContent, setGridContent] = useState<GridContent>([]);

  if (gridContent.length === 0)
    setGridContent([
      {
        xLabel: defaultColumns[0],
        yLabel: defaultColumns[1],
        xPosition: 0,
        yPosition: 0,
      },
    ]);

  const breakCount = 2;

  const rows = 3;
  const columns = 3;
  const mul = rows * columns;

  const arr: number[] = [];
  for (let i = 0; i < mul; ++i) {
    arr.push(i);
  }
  console.log(arr);
  console.table(gridContent);
  return (
    <VisualizationGrid>
      <div>Test</div>
      <GridCell rows={rows} columns={columns}>
        {arr.map(a => (
          <div style={{border: '1px solid red'}} key={a}>
            Test
          </div>
        ))}
      </GridCell>
    </VisualizationGrid>
  );
};

export default ScatterplotGrid;

interface GridCellProps {
  rows: number;
  columns: number;
}

const GridCell = styled('div')<GridCellProps>`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(${props => props.rows}, 1fr);
  grid-template-columns: repeat(${props => props.rows}, 1fr);
`;

const VisualizationGrid = styled('div')`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 15fr;
`;
