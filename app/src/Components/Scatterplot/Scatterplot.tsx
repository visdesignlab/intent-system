import { scaleLinear } from 'd3';
import { inject, observer } from 'mobx-react';
import React, { FC, memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { style } from 'typestyle';

import { DataContext } from '../../Contexts';
import { Plot } from '../../Store/IntentState';
import IntentStore from '../../Store/IntentStore';
import { Data } from '../../Utils/Dataset';
import translate from '../../Utils/Translate';
import { UserSelections } from '../Predictions/PredictionRowType';
import RawPlot from './RawPlot';
import ScatterplotControls from './ScatterplotControls';

export interface Props {
  store?: IntentStore;
  height: number;
  width: number;
  plot: Plot;
  selections: UserSelections;
}

const Scatterplot: FC<Props> = ({
  width,
  height,
  plot,
  store,
  selections
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const data = useContext(DataContext);

  const { categoryColumn, plots } = store!;

  const [dim, setDim] = useState({ height: 0, width: 0 });
  const { height: dh, width: dw } = dim;

  useEffect(() => {
    const { current } = svgRef;
    if (current && dh === 0 && dw === 0) {
      const size = current.getBoundingClientRect();
      setDim({ height: size.height, width: size.width });
    }
  }, [dh, dw]);

  let reducePercentage = 0.85;

  if (plots.length > 1) reducePercentage = 0.85;
  if (plots.length > 2) reducePercentage = 0.75;

  const adjustedWidth = dim.width * reducePercentage;
  const adjustedHeight = dim.height * reducePercentage;
  const xPadding = (dim.width - adjustedWidth) / 2;
  const yPadding = (dim.height - adjustedHeight) / 2;

  const { x, y } = plot;

  const dataString = JSON.stringify(data);

  const xyData = useMemo(() => {
    const data: Data = JSON.parse(dataString);

    return data.values.map(d => ({
      x: d[x],
      y: d[y],
      category: categoryColumn ? d[categoryColumn] : null
    }));
  }, [dataString, categoryColumn, x, y]);

  const [xMin, xMax] = [
    Math.min(...xyData.map(d => d.x)),
    Math.max(...xyData.map(d => d.x))
  ];

  const [yMin, yMax] = [
    Math.min(...xyData.map(d => d.y)),
    Math.max(...xyData.map(d => d.y))
  ];

  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([xMin, xMax])
      .range([0, adjustedWidth])
      .nice();
  }, [adjustedWidth, xMax, xMin]);

  const yScale = useMemo(() => {
    return scaleLinear()
      .domain([yMax, yMin])
      .range([0, adjustedHeight])
      .nice();
  }, [adjustedHeight, yMax, yMin]);

  return (
    <div className={surroundDiv}>
      <ScatterplotControls plotID={plot.id} />
      <svg className={svgStyle} ref={svgRef}>
        <rect
          id="background"
          height={dim.height}
          width={dim.width}
          fill="#ccc"
          opacity="0.1"
        />
        <RawPlot
          plotId={plot.id}
          height={adjustedHeight}
          width={adjustedWidth}
          data={xyData}
          transform={translate(xPadding, yPadding)}
          xScale={xScale}
          yScale={yScale}
          selections={selections}
        />
      </svg>
    </div>
  );
};

export default memo(inject("store")(observer(Scatterplot)));

const surroundDiv = style({
  padding: "0.5em",
  position: "relative",
  height: "100%",
  width: "100%"
});

const svgStyle = style({
  height: "100%",
  width: "100%"
});
