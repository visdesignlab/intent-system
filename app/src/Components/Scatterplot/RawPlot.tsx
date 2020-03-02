import React, {FC, useContext, useState, useEffect, useMemo, memo} from 'react';
import IntentStore from '../../Store/IntentStore';
import translate from '../../Utils/Translate';
import {
  ScaleLinear,
  select,
  axisBottom,
  axisLeft,
  quadtree,
  selectAll,
} from 'd3';
import {ActionContext, DataContext} from '../../App';
import {Plot, ExtendedBrush} from '../../Store/IntentState';
import BrushComponent from '../Brush/Components/BrushComponent';
import {BrushCollection, Brush, BrushAffectType} from '../Brush/Types/Brush';
import {inject, observer} from 'mobx-react';
import _ from 'lodash';
import MarkType from './MarkType';
import Mark from './Mark';
import XAxis from './XAxis';
import YAxis from './YAxis';
import {Popup, Header, Table} from 'semantic-ui-react';
import {UserSelections} from '../Predictions/PredictionRowType';
import {
  FADE_OUT_PRED_SELECTION,
  COLOR,
  REGULAR_MARK_STYLE,
} from '../Styles/MarkStyle';
import FreeFormBrush from './Freeform/FreeFormBrush';

export interface Props {
  store?: IntentStore;
  plot: Plot;
  data: {x: number; y: number; category?: string}[];
  transform: string;
  height: number;
  width: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  selections: UserSelections;
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
  selections,
}: Props) => {
  const actions = useContext(ActionContext);
  const [mouseDown, setMouseDown] = useState(false);
  const {
    plots,
    multiBrushBehaviour,
    predictionSet,
    selectedPrediction,
    brushType,
  } = store!;
  const {selectedPoints, brushes} = plot;

  let freeFormPoints: number[] = [];

  const rawData = useContext(DataContext);

  const scaledData = data.map(d => ({
    x: xScale(d.x),
    y: yScale(d.y),
  }));

  const scaledDataString = JSON.stringify(scaledData);

  const mappedData = useMemo(() => {
    const scaledData: {x: number; y: number; category?: string}[] = JSON.parse(
      scaledDataString,
    );

    const mapped: {[key: string]: number} = {};
    for (let i = 0; i < scaledData.length; ++i) {
      const d = scaledData[i];
      mapped[`${d.x}-${d.y}`] = i;
    }
    return mapped;
  }, [scaledDataString]);

  const quad = useMemo(() => {
    return quadtree<{x: number; y: number; category?: string}>()
      .x(d => d.x)
      .y(d => d.y)
      .addAll(JSON.parse(scaledDataString));
  }, [scaledDataString]);

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
        actions.addBrush(plot, brushCollection, addBr);
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
        actions.changeBrush(plot, brushCollection, changeBr);
        break;
      case 'Remove':
        delete brushCollection[affectedBrush.id];
        const removeBr: ExtendedBrush = {...affectedBrush, points: []};
        actions.removeBrush(plot, brushCollection, removeBr);
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

  useEffect(() => {
    const xAxis = axisBottom(xScale);
    const yAxis = axisLeft(yScale);
    select('.x-axis').call(xAxis as any);
    select('.y-axis').call(yAxis as any);
  }, [xScale, yScale]);

  const brushComponent = (
    <BrushComponent
      key={brushKey}
      extents={{left: 0, top: 0, right: width, bottom: height}}
      extentPadding={10}
      onBrushUpdate={brushHandler}
      initialBrushes={initBrushCounts === 0 ? null : initialBrushes}
    />
  );

  const {predictions} = predictionSet;
  const selectedPred = predictions.find(p => p.intent === selectedPrediction);

  function drawMark(
    data: {x: number; y: number; category?: string},
    idx: number,
  ) {
    let dataIds: number[] = [];
    if (selectedPred) {
      dataIds = selectedPred.dataIds || [];
    }

    const isInSelectedPred = dataIds.includes(idx);

    let type: MarkType = 'Regular';
    const isClickSelected = clickSelectedPoints.includes(idx);
    if (!isClickSelected) {
      const isUnion = multiBrushBehaviour === 'Union';
      if (brushPointCount[idx]) {
        if (isUnion) {
          type = 'Union';
        } else {
          type = brushPointCount[idx] === brushCount ? 'Union' : 'Intersection';
        }
      }
    } else {
      type = 'Union';
    }

    let markClass = 'regular-mark';
    if (type === 'Union') {
      markClass = 'union-mark';
    }
    if (selections.individualArr.includes(idx)) {
      markClass = 'click-mark';
    }
    if (type === 'Intersection') {
      markClass = 'intersection-mark';
    }

    markClass = `${markClass} base-mark`;

    if (selectedPred) {
      markClass = `${markClass} ${
        isInSelectedPred ? '' : FADE_OUT_PRED_SELECTION
      }`;
    }

    const mark = (
      <g
        onClick={() => {
          if (!selectedPoints.includes(idx)) {
            actions.addPointSelection(plot, [idx]);
          } else {
            actions.removePointSelection(plot, [idx]);
          }
        }}>
        <Mark
          id={`mark-${idx}`}
          extraClass={markClass}
          type={type}
          x={xScale(data.x)}
          y={yScale(data.y)}
          category={data.category || ''}
        />
      </g>
    );

    const currColumn = [plot.x, plot.y];

    const columns = [
      ...currColumn,
      ...rawData.columns.filter(a => !currColumn.includes(a)),
    ];

    const popupContent = (
      <div>
        <Header>{rawData.values[idx][rawData.labelColumn]}</Header>
        <Table compact>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Property</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {columns.map(col => {
              return (
                rawData.columnMap[col] && (
                  <Table.Row key={col}>
                    <Table.Cell>
                      {plot.x === col || plot.y === col ? (
                        <Header>{rawData.columnMap[col].text}</Header>
                      ) : (
                        rawData.columnMap[col].text
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      {plot.x === col || plot.y === col ? (
                        <Header>{rawData.values[idx][col]}</Header>
                      ) : (
                        rawData.values[idx][col]
                      )}
                    </Table.Cell>
                  </Table.Row>
                )
              );
            })}
          </Table.Body>
        </Table>
      </div>
    );

    return <Popup key={idx} content={popupContent} trigger={mark} />;
  }

  const {columnMap} = useContext(DataContext);

  const plotComponent = (
    <g style={{pointerEvents: mouseDown ? 'none' : 'all'}}>
      <g transform={translate(0, height)} style={{pointerEvents: 'none'}}>
        <XAxis width={width} scale={xScale} dimension={columnMap[plot.x]} />
      </g>
      <g style={{pointerEvents: 'none'}}>
        <YAxis height={height} scale={yScale} dimension={columnMap[plot.y]} />
      </g>
      {data.map(drawMark)}
    </g>
  );

  function radius(x: number, y: number, x1: number, y1: number) {
    return Math.pow(Math.pow(x - x1, 2) + Math.pow(y - y1, 2), 0.5);
  }

  function parentFunc(x: number, y: number, r: number) {
    return function(node: any, x1: number, y1: number, x2: number, y2: number) {
      const ctnx = x - r <= x1 && x + r >= x2;
      const ctny = y - r <= y1 && y + r >= y2;
      const interx1 = r + x < x2 && r + x > x1;
      const interx2 = x - r > x1 && x - r < x2;
      const intery1 = y - r > y1 && y - r < y2;
      const intery2 = y + r < y2 && y + r > y1;

      if (!((interx1 || interx2) && (intery1 || intery2)) && !(ctnx || ctny))
        return;
      const {data} = node!;
      if (data) {
        const {x: x1, y: y1} = data;
        const ptr = radius(x, y, x1, y1);
        if (ptr <= r) {
          const idx = mappedData[`${x1}-${y1}`];
          if (idx >= 0) {
            const marks = selectAll(`#mark-${idx}`);
            if (!marks.classed(REGULAR_MARK_STYLE)) return;

            marks.classed(COLOR, true);
            if (!freeFormPoints.includes(idx)) freeFormPoints.push(idx);
          }
        }
      }
    };
  }

  const freeFormBrushComponent = (
    <FreeFormBrush
      extents={{left: 0, top: 0, right: width, bottom: height}}
      extentPadding={10}
      onBrushStart={() => {
        freeFormPoints = [];
      }}
      onBrush={(x: number, y: number, radius) => {
        const func = parentFunc(x, y, radius);
        quad.visit(func);
      }}
      onBrushEnd={() => {
        if (freeFormPoints.length === 0) return;
        actions.addPointSelection(plot, freeFormPoints);
        freeFormPoints = [];
      }}
    />
  );

  return (
    <g transform={transform}>
      <g
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
        onMouseLeave={() => setMouseDown(false)}>
        {brushComponent}
        {brushType === 'Freeform' && freeFormBrushComponent}
      </g>
      {plotComponent}
    </g>
  );
};

(RawPlot as any).whyDidYouRender = true;
export default memo(inject('store')(observer(RawPlot)));
