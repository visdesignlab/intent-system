import React, {FC, useRef, useState, useEffect, useContext} from 'react';
import {inject, observer} from 'mobx-react';
import IntentStore from '../../Store/IntentStore';
import {style} from 'typestyle';
import {DataContext, ActionContext} from '../../App';
import {Plot} from '../../Store/IntentState';
import {scaleLinear} from 'd3';
import translate from '../../Utils/Translate';
import RawPlot from './RawPlot';
import {Button} from 'semantic-ui-react';
import {UserSelections} from '../Predictions/PredictionRowType';

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
  selections,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const data = useContext(DataContext);
  const actions = useContext(ActionContext);

  const {categoryColumn, plots, brushType} = store!;

  const [dim, setDim] = useState({height: 0, width: 0});

  useEffect(() => {
    const {height, width} = dim;
    const {current} = svgRef;
    if (current && height === 0 && width === 0) {
      const size = current.getBoundingClientRect();
      setDim({height: size.height, width: size.width});
    }
  }, [dim]);

  let reducePercentage = 0.9;

  if (plots.length > 1) reducePercentage = 0.85;
  if (plots.length > 2) reducePercentage = 0.75;

  const adjustedWidth = dim.width * reducePercentage;
  const adjustedHeight = dim.height * reducePercentage;
  const xPadding = (dim.width - adjustedWidth) / 2;
  const yPadding = (dim.height - adjustedHeight) / 2;

  const {x, y} = plot;

  const xyData = data.values.map(d => ({
    x: d[x],
    y: d[y],
    category: categoryColumn ? d[categoryColumn] : null,
  }));

  const [xMin, xMax] = [
    Math.min(...xyData.map(d => d.x)),
    Math.max(...xyData.map(d => d.x)),
  ];

  const [yMin, yMax] = [
    Math.min(...xyData.map(d => d.y)),
    Math.max(...xyData.map(d => d.y)),
  ];

  const xScale = scaleLinear()
    .domain([xMin, xMax])
    .range([0, adjustedWidth])
    .nice();
  const yScale = scaleLinear()
    .domain([yMax, yMin])
    .range([0, adjustedHeight])
    .nice();

  return (
    <div className={surroundDiv} style={{height, width}}>
      <Button.Group className={brushButtonStyle} size="mini">
        <Button
          icon="square outline"
          content="Rectangular"
          disabled={brushType === 'Rectangular'}
          onClick={() => actions.changeBrushType('Rectangular')}
        />
        <Button.Or />
        <Button
          icon="magic"
          content="Freeform"
          disabled={brushType === 'Freeform'}
          onClick={() => actions.changeBrushType('Freeform')}
        />
      </Button.Group>
      {plots.length > 1 && (
        <Button
          icon="close"
          onClick={() => actions.removePlot(plot)}
          size="mini"
          negative
          compact
          className={closeButtonStyle}
        />
      )}
      <svg className={svgStyle} ref={svgRef}>
        <rect height={dim.height} width={dim.width} fill="#ccc" opacity="0.1" />
        <RawPlot
          plot={plot}
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

(Scatterplot as any).whyDidYouRender = true;
export default inject('store')(observer(Scatterplot));

const surroundDiv = style({
  padding: '1em',
  position: 'relative',
});

const svgStyle = style({
  height: '100%',
  width: '100%',
});

const closeButtonStyle = style({
  position: 'absolute',
  right: 0,
  top: 0,
  opacity: 0.4,
  transition: 'opacity 0.5s',
  $nest: {
    '&:hover': {
      opacity: 1,
      transition: 'opacity 0.5s',
    },
  },
});

const brushButtonStyle = style({
  position: 'absolute',
  left: 0,
  top: 0,
});
