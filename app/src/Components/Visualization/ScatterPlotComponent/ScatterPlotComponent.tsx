import * as React from "react";

import Axis, { ScaleType } from "../Axis/Axis";
import { max, min, scaleLinear } from "d3";

import { BrushDictionary } from "../Data Types/BrushType";
import { Dimension } from "../Data Types/Dimension";
import MarkSeries from "../MarkSeries/MarkSeries";
import { VisualizationType } from "@visdesignlab/intent-contract";

interface RequiredProps {
  vis: VisualizationType;
  height: number;
  width: number;
  labels: string[];
  X: Dimension<number>;
  Y: Dimension<number>;
  brushDict: BrushDictionary;
  debugMode: boolean;
  debugKey: string;
  updateBrushDictionary: (dict: BrushDictionary) => void;
  pointSelection: number[];
  updatePointSelection: (points: number[]) => void;
  updateDebugKeys: (keys: string[]) => void;
}

interface OptionalProps {
  XOffset?: number;
  YOffset?: number;
  XZero?: boolean;
  YZero?: boolean;
}

type Props = RequiredProps & OptionalProps;

const defaultProps: OptionalProps = {
  XOffset: 0,
  YOffset: 0,
  XZero: false,
  YZero: false
};

const ScatterPlotComponent: React.FC<Props> = ({
  vis,
  height,
  width,
  X,
  Y,
  XOffset,
  YOffset,
  XZero,
  YZero,
  labels,
  brushDict,
  updateBrushDictionary,
  pointSelection,
  updatePointSelection,
  updateDebugKeys,
  debugKey,
  debugMode
}) => {
  const actualHeight = height - 2 * (YOffset as number);
  const actualWidth = width - 2 * (XOffset as number);

  const [minX, maxX] = [min(X.values) as number, max(X.values) as number];
  const [minY, maxY] = [min(Y.values) as number, max(Y.values) as number];

  const scaleX = scaleLinear()
    .domain([XZero ? 0 : minX * 0.9, maxX])
    .range([0, actualWidth]);

  const scaleY = scaleLinear()
    .domain([maxY, YZero ? 0 : minY * 0.9])
    .range([0, actualHeight]);

  return (
    <g>
      <g transform={`translate(${XOffset}, 0)`}>
        <MarkSeries
          vis={vis}
          xLabel={X.label}
          yLabel={Y.label}
          markSize={5}
          opacity={0.6}
          xValues={X.values}
          yValues={Y.values}
          xScale={scaleX}
          yScale={scaleY}
          labels={labels}
          brushDict={brushDict}
          updateBrushDictionary={updateBrushDictionary}
          pointSelection={pointSelection}
          updatePointSelection={updatePointSelection}
          updateDebugKeys={updateDebugKeys}
          debugKey={debugKey}
          debugMode={debugMode}
        />
      </g>
      <g transform={`translate(${XOffset}, ${actualHeight})`}>
        <Axis scale={scaleX} position={ScaleType.BOTTOM} label={X.label} />
      </g>
      <g transform={`translate(${XOffset}, 0)`}>
        <Axis scale={scaleY} position={ScaleType.LEFT} label={Y.label} />
      </g>
    </g>
  );
};

ScatterPlotComponent.defaultProps = defaultProps;

export default ScatterPlotComponent;
