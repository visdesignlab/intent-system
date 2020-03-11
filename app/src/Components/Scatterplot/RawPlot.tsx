import React, {
  FC,
  useContext,
  useState,
  useEffect,
  useMemo,
  memo
} from "react";
import IntentStore from "../../Store/IntentStore";
import translate from "../../Utils/Translate";
import {
  ScaleLinear,
  select,
  axisBottom,
  axisLeft,
  quadtree,
  selectAll
} from "d3";
import { Plot, ExtendedBrush } from "../../Store/IntentState";
import BrushComponent from "../Brush/Components/BrushComponent";
import { BrushCollection, Brush, BrushAffectType } from "../Brush/Types/Brush";
import { inject, observer } from "mobx-react";
import _ from "lodash";
import MarkType from "./MarkType";
import Mark from "./Mark";
import XAxis from "./XAxis";
import YAxis from "./YAxis";
import { Popup, Header, Table, Label } from "semantic-ui-react";
import {
  UserSelections,
  extendPrediction
} from "../Predictions/PredictionRowType";
import {
  FADE_OUT_PRED_SELECTION,
  COLOR,
  REGULAR_MARK_STYLE,
  FADE_SELECTION_IN,
  FADE_OUT,
  FADE_COMP_IN
} from "../Styles/MarkStyle";
import FreeFormBrush from "./Freeform/FreeFormBrush";
import { ActionContext, DataContext, TaskConfigContext } from "../../Contexts";
import { Prediction } from "../../contract";
import hoverable from "../UtilComponent/hoverable";

export interface Props {
  store?: IntentStore;
  plot: Plot;
  data: { x: number; y: number; category?: string }[];
  transform: string;
  height: number;
  width: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  selections: UserSelections;
}

export type MousePosition = {
  x: number;
  y: number;
};

const RawPlot: FC<Props> = ({
  store,
  plot,
  data,
  transform,
  height,
  width,
  xScale,
  yScale,
  selections
}: Props) => {
  const actions = useContext(ActionContext);
  const [mouseDown, setMouseDown] = useState(false);
  const {
    plots,
    multiBrushBehaviour,
    predictionSet,
    selectedPrediction,
    brushType
  } = store!;
  const { selectedPoints, brushes } = plot;

  const [mousePos, setMousePos] = useState<MousePosition | null>(null);

  const { taskType = "supported" } = useContext(TaskConfigContext);

  let freeFormPoints: number[] = [];

  const rawData = useContext(DataContext);

  const scaledData = data.map(d => ({
    x: xScale(d.x),
    y: yScale(d.y)
  }));

  const scaledDataString = JSON.stringify(scaledData);

  const mappedData = useMemo(() => {
    const scaledData: {
      x: number;
      y: number;
      category?: string;
    }[] = JSON.parse(scaledDataString);

    const mapped: { [key: string]: number } = {};
    for (let i = 0; i < scaledData.length; ++i) {
      const d = scaledData[i];
      mapped[`${d.x}-${d.y}`] = i;
    }
    return mapped;
  }, [scaledDataString]);

  const quad = useMemo(() => {
    return quadtree<{ x: number; y: number; category?: string }>()
      .x(d => d.x)
      .y(d => d.y)
      .addAll(JSON.parse(scaledDataString));
  }, [scaledDataString]);

  function brushSearch(
    quad: any,
    left: number,
    top: number,
    right: number,
    bottom: number
  ) {
    const points: number[] = [];
    quad.visit(function(
      node: any,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) {
      if (!node.length) {
        do {
          let { x, y } = node.data;

          const isSelected =
            x + 2.5 >= left &&
            x + 2.5 <= right &&
            y + 2.5 >= top &&
            y + 2.5 <= bottom;
          const idx = mappedData[`${x}-${y}`];
          if (isSelected && idx >= 0) {
            points.push(idx);
          }
        } while ((node = node.next));
      }
      return (
        x1 + 5 >= right || y1 + 5 >= bottom || x2 + 5 <= left || y2 + 5 <= top
      );
    });
    return points;
  }

  function brushHandler(
    _: BrushCollection,
    affectedBrush: Brush,
    affectType: BrushAffectType,
    mousePosition?: MousePosition
  ) {
    let { x1, x2, y1, y2 } = affectedBrush.extents;
    [x1, x2, y1, y2] = [x1 * width, x2 * width, y1 * height, y2 * height];

    let brushCollection = JSON.parse(JSON.stringify(brushes));
    const points = [];
    switch (affectType) {
      case "Add":
        points.push(...brushSearch(quad, x1, y1, x2, y2));
        const addBr: ExtendedBrush = { ...affectedBrush, points };
        brushCollection[addBr.id] = addBr;
        actions.addBrush(plot, brushCollection, addBr);
        break;
      case "Change":
        points.push(...brushSearch(quad, x1, y1, x2, y2));
        const changeBr: ExtendedBrush = { ...affectedBrush, points };
        brushCollection[changeBr.id] = changeBr;
        actions.changeBrush(plot, brushCollection, changeBr);
        break;
      case "Remove":
        delete brushCollection[affectedBrush.id];
        const removeBr: ExtendedBrush = { ...affectedBrush, points: [] };
        actions.removeBrush(plot, brushCollection, removeBr);
        break;
      case "Clear":
        break;
      default:
        break;
    }

    if (mousePosition) {
      if (JSON.stringify(mousePos) !== JSON.stringify(mousePosition)) {
        console.log("Setting");
        setMousePos(mousePosition);
      }
    } else {
      setMousePos(null);
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
    select(".x-axis").call(xAxis as any);
    select(".y-axis").call(yAxis as any);
  }, [xScale, yScale]);

  const brushComponent = (
    <BrushComponent
      key={brushKey}
      extents={{ left: 0, top: 0, right: width, bottom: height }}
      extentPadding={20}
      onBrushUpdate={brushHandler}
      initialBrushes={initBrushCounts === 0 ? null : initialBrushes}
      switchOff={brushType !== "Rectangular"}
    />
  );
  const { columnMap } = useContext(DataContext);

  const { predictions } = predictionSet;

  const predictionString = JSON.stringify(predictions);

  const topThree = useMemo(() => {
    const preds: Prediction[] = JSON.parse(predictionString);
    if (preds.length > 3) {
      return preds
        .map(p => extendPrediction(p, selections.values, columnMap))
        .filter(d => d.type !== "Range" && d.type !== "Simplified Range")
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3);
    }
    return preds
      .map(p => extendPrediction(p, selections.values, columnMap))
      .filter(d => d.type !== "Range" && d.type !== "Simplified Range")
      .sort((a, b) => b.similarity - a.similarity);
  }, [predictionString, selections, columnMap]);

  const selectedPred = predictions.find(p => p.intent === selectedPrediction);

  function drawMark(
    data: { x: number; y: number; category?: string },
    idx: number
  ) {
    let dataIds: number[] = [];
    if (selectedPred) {
      dataIds = selectedPred.dataIds || [];
    }

    const isInSelectedPred = dataIds.includes(idx);

    let type: MarkType = "Regular";
    const isClickSelected = clickSelectedPoints.includes(idx);
    if (!isClickSelected) {
      const isUnion = multiBrushBehaviour === "Union";
      if (brushPointCount[idx]) {
        if (isUnion) {
          type = "Union";
        } else {
          type = brushPointCount[idx] === brushCount ? "Union" : "Intersection";
        }
      }
    } else {
      type = "Union";
    }

    let markClass = "regular-mark";
    if (type === "Union") {
      markClass = "union-mark";
    }
    if (selections.individualArr.includes(idx)) {
      markClass = "click-mark";
    }
    if (type === "Intersection") {
      markClass = "intersection-mark";
    }

    markClass = `${markClass} base-mark`;

    if (selectedPred) {
      markClass = `${markClass} ${
        isInSelectedPred ? "" : FADE_OUT_PRED_SELECTION
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
        }}
      >
        <Mark
          id={`mark-${idx}`}
          extraClass={markClass}
          type={type}
          x={xScale(data.x)}
          y={yScale(data.y)}
          category={data.category || ""}
        />
      </g>
    );

    const currColumn = [plot.x, plot.y];

    const columns = [
      ...currColumn,
      ...rawData.columns.filter(a => !currColumn.includes(a))
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

  const plotComponent = (
    <g style={{ pointerEvents: mouseDown ? "none" : "all" }}>
      <g transform={translate(0, height)} style={{ pointerEvents: "none" }}>
        <XAxis width={width} scale={xScale} dimension={columnMap[plot.x]} />
      </g>
      <g style={{ pointerEvents: "none" }}>
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
      const { data } = node!;
      if (data) {
        const { x: x1, y: y1 } = data;
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
      extents={{ left: 0, top: 0, right: width, bottom: height }}
      extentPadding={10}
      onBrushStart={() => {
        freeFormPoints = [];
      }}
      onBrush={(x: number, y: number, radius) => {
        const func = parentFunc(x, y, radius);
        quad.visit(func);
      }}
      onBrushEnd={(mousePos?: MousePosition) => {
        if (freeFormPoints.length === 0) return;
        actions.addPointSelection(plot, freeFormPoints);
        freeFormPoints = [];
        if (mousePos) {
          setMousePos(mousePos);
        }
      }}
    />
  );

  const SelectionLabel = hoverable(Label);

  return (
    <>
      <g transform={transform}>
        <g
          onMouseDown={() => {
            setMouseDown(true);
            setMousePos(null);
          }}
          onMouseUp={() => setMouseDown(false)}
          onMouseLeave={() => setMouseDown(false)}
        >
          {brushComponent}
          {brushType === "Freeform" && freeFormBrushComponent}
        </g>
        {plotComponent}
      </g>
      {taskType === "supported" && (
        <Popup
          basic
          open={mousePos !== null}
          trigger={
            <g transform={translate(mousePos?.x || 0, mousePos?.y || 0)}>
              {mousePos && (
                <rect fill="gray" opacity="0.2" height={1} width={1} />
              )}
            </g>
          }
          content={
            <Label.Group>
              {topThree.map(pred => {
                const idx = (pred.dataIds || [])
                  .map(d => `#mark-${d}`)
                  .join(",");

                return (
                  <SelectionLabel
                    configs={[
                      {
                        selector: ".base-mark",
                        classToApply: FADE_OUT
                      },
                      { selector: idx, classToApply: FADE_COMP_IN }
                    ]}
                    key={pred.intent}
                    onClick={() => {
                      setMousePos(null);
                      actions.turnPredictionInSelection(
                        pred,
                        selections.values
                      );
                    }}
                  >
                    {pred.type}
                  </SelectionLabel>
                );
              })}
            </Label.Group>
          }
        ></Popup>
      )}
    </>
  );
};

(RawPlot as any).whyDidYouRender = true;
export default memo(inject("store")(observer(RawPlot)));
