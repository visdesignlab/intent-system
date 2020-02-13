import React, {FC, useContext, useState, useEffect} from 'react';
import IntentStore from '../../Store/IntentStore';
import translate from '../../Utils/Translate';
import {ScaleLinear, select, axisBottom, axisLeft} from 'd3';
import {
  REGULAR_MARK_STYLE,
  UNION_MARK_STYLE,
  INTERSECTION_MARK_STYLE,
} from '../Styles';
import {ActionContext} from '../../App';
import {Plot, ExtendedBrush} from '../../Store/IntentState';
import BrushComponent from '../Brush/Components/BrushComponent';
import {BrushCollection, Brush, BrushAffectType} from '../Brush/Types/Brush';
import {inject, observer} from 'mobx-react';
import _ from 'lodash';

export interface Props {
  store?: IntentStore;
  plot: Plot;
  data: {x: number; y: number}[];
  transform: string;
  height: number;
  width: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
}

const RawPlot: FC<Props> = ({
  store,
  plot,
  data,
  transform,
  height,
  width,
  xScale,
  yScale,
}: Props) => {
  const actions = useContext(ActionContext);
  const [mouseDown, setMouseDown] = useState(false);
  const {plots, multiBrushBehaviour} = store!;
  const {selectedPoints, brushes} = plot;

  function brushHandler(
    _: BrushCollection,
    affectedBrush: Brush,
    affectType: BrushAffectType,
  ) {
    let {x1, x2, y1, y2} = affectedBrush.extents;
    [x1, x2, y1, y2] = [
      xScale.invert(x1 * width),
      xScale.invert(x2 * width),
      yScale.invert(y1 * height),
      yScale.invert(y2 * height),
    ];

    let brushCollection = JSON.parse(JSON.stringify(brushes));
    const points = [];
    switch (affectType) {
      case 'Add':
        for (let i = 0; i < data.length; ++i) {
          const {x, y} = data[i];
          if (x >= x1 && x <= x2 && y <= y1 && y >= y2) {
            points.push(i);
          }
        }

        const addBr: ExtendedBrush = {...affectedBrush, points};

        brushCollection[addBr.id] = addBr;
        actions.addBrush(plot, brushCollection);
        break;
      case 'Change':
        for (let i = 0; i < data.length; ++i) {
          const {x, y} = data[i];
          if (x1 <= x && x2 >= x && y1 >= y && y2 <= y) {
            points.push(i);
          }
        }

        const changeBr: ExtendedBrush = {...affectedBrush, points};

        brushCollection[changeBr.id] = changeBr;
        actions.changeBrush(plot, brushCollection);
        break;
      case 'Remove':
        delete brushCollection[affectedBrush.id];
        actions.removeBrush(plot, brushCollection);
        break;
      case 'Clear':
        break;
      default:
        break;
    }
  }

  const [brushKey, setBrushKey] = useState(Math.random());

  useEffect(() => {
    const brushCount = Object.keys(brushes).length;
    if (brushCount === 0) {
      setBrushKey(Math.random());
    }
  }, [brushes]);

  let clickSelectedPoints: number[] = [];
  let brushSelectedPoints: number[] = [];
  let brushCount = 0;

  for (let plt of plots) {
    clickSelectedPoints.push(...plt.selectedPoints);
    const allBrushes = Object.values(plt.brushes);
    const brushedPoints = allBrushes.map(d => d.points);
    brushSelectedPoints.push(...brushedPoints.flatMap(d => d));
    brushCount += allBrushes.length;
  }

  const brushPointCount = _.countBy(brushSelectedPoints);

  const initialBrushes = JSON.parse(JSON.stringify(brushes));
  const initBrushCounts = Object.keys(initialBrushes).length;

  const brushComponent = (
    <BrushComponent
      key={brushKey}
      extents={{left: 0, top: 0, right: width, bottom: height}}
      extentPadding={10}
      onBrushUpdate={brushHandler}
      initialBrushes={initBrushCounts === 0 ? null : initialBrushes}
    />
  );

  const plotComponent = (
    <g style={{pointerEvents: mouseDown ? 'none' : 'all'}}>
      <g transform={translate(0, height)} className="x-axis" />
      <g className="y-axis" />
      {data.map((data, idx) => {
        let className = REGULAR_MARK_STYLE;
        const isClickSelected = clickSelectedPoints.includes(idx);
        if (!isClickSelected) {
          const isUnion = multiBrushBehaviour === 'Union';
          if (brushPointCount[idx]) {
            if (isUnion) {
              className = UNION_MARK_STYLE;
            } else {
              className =
                brushPointCount[idx] === brushCount
                  ? UNION_MARK_STYLE
                  : INTERSECTION_MARK_STYLE;
            }
          }
        }

        return (
          <circle
            key={idx}
            cx={xScale(data.x)}
            cy={yScale(data.y)}
            r="0.35em"
            className={className}
            onClick={() => {
              if (!selectedPoints.includes(idx)) {
                actions.addPointSelection(plot, [idx]);
              } else {
                actions.removePointSelection(plot, [idx]);
              }
            }}
          />
        );
      })}
    </g>
  );

  useEffect(() => {
    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);
    select('.x-axis').call(xAxis as any);
    select('.y-axis').call(yAxis as any);
  }, [xScale, yScale]);

  return (
    <g transform={transform}>
      <g
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
        onMouseLeave={() => setMouseDown(false)}>
        {brushComponent}
      </g>
      {plotComponent}
    </g>
  );
};

(RawPlot as any).whyDidYouRender = true;
export default inject('store')(observer(RawPlot));
