import { selectAll } from "d3";
import { inject, observer } from "mobx-react";
import React, { FC, memo, useContext, useEffect, useState } from "react";
import { Button, Header, Label, Popup, Table } from "semantic-ui-react";

import { ActionContext, DataContext } from "../../Contexts";
import IntentStore, { SortableColumns } from "../../Store/IntentStore";
import { hide$ } from "../Scatterplot/RawPlot";
import { FADE_COMP_IN, FADE_OUT } from "../Styles/MarkStyle";
import hoverable from "../UtilComponent/hoverable";
import { topPred$ } from "./AnnotationBox";
import JaccardBar from "./JaccardBar";
import { getAllSelections, PredictionRowType } from "./PredictionRowType";
import ProbabilityBar from "./ProbabilityBar";
import useDeepCompareEffect from "use-deep-compare-effect";

type Props = {
  store?: IntentStore;
  predictions: PredictionRowType[];
  isTask: boolean;
};

const PredictionTable: FC<Props> = ({
  store,
  predictions: basePredictions,
  isTask = false,
}: Props) => {
  const { selectedPrediction, plots, multiBrushBehaviour } = store!;
  const [predictions, setPredictions] = useState<PredictionRowType[]>([]);
  const { columnMap } = useContext(DataContext);

  const {
    sortColumn = "similarity",
    sortDirection: direction = "descending",
  } = store!;

  useDeepCompareEffect(() => {
    let pred = predictions.length > 0 ? predictions : basePredictions;
    pred = JSON.parse(JSON.stringify(pred));

    if (direction === "ascending") {
      pred.sort((a, b) => a[sortColumn] - b[sortColumn]);
    } else {
      pred.sort((b, a) => a[sortColumn] - b[sortColumn]);
    }

    setPredictions(pred);
    if (pred.length > 0) topPred$.next(pred[0]);
  }, [basePredictions, direction, sortColumn]);

  const barHeight = 30;
  const actions = useContext(ActionContext);

  const HoverTableCell = hoverable(Table.Cell);

  function predRowRender(pred: PredictionRowType, idx: number) {
    const { matches, isnp, ipns, similarity, type, probability, rankAc } = pred;

    function rowClick() {
      selectAll(".base-mark")
        .classed(FADE_COMP_IN, false)
        .classed(FADE_OUT, false);
      const curr = getAllSelections(plots, multiBrushBehaviour === "Union")
        .values;
      actions.turnPredictionInSelection(pred, curr, columnMap);
      hide$.next(null);
      // if (isTask) {
      //   selectAll(".base-mark")
      //     .classed(FADE_COMP_IN, false)
      //     .classed(FADE_OUT, false);
      //   const curr = getAllSelections(plots, multiBrushBehaviour === "Union")
      //     .values;
      //   actions.turnPredictionInSelection(pred, curr);
      //   hide$.next(null);
      // } else {
      //   if (pred.intent === selectedPrediction) {
      //     actions.selectPrediction("none");
      //     topPred$.next(predictions[0]);
      //   } else {
      //     actions.selectPrediction(pred.intent);
      //     topPred$.next(pred);
      //   }
      // }
    }

    const marks = (pred.dataIds || []).map((d) => `#mark-${d}`).join(",");

    return (
      <Table.Row
        key={pred.intent}
        active={pred.intent === selectedPrediction}
        onClick={rowClick}
      >
        {!isTask && (
          <Table.Cell>
            {pred.dims.length > 0
              ? pred.dims.map((dim) => (
                  <Label size="mini" circular key={dim}>
                    {dim}
                  </Label>
                ))
              : "-"}
          </Table.Cell>
        )}
        {!isTask && (
          <>
            <HoverTableCell
              selectable
              configs={
                matches.length === 0
                  ? []
                  : [
                      {
                        selector: ".base-mark",
                        classToApply: FADE_OUT,
                      },
                      {
                        selector: matches.map((m) => `#mark-${m}`).join(","),
                        classToApply: FADE_COMP_IN,
                      },
                    ]
              }
              onClick={() => {}}
            >
              {matches.length}
            </HoverTableCell>
            <HoverTableCell
              selectable
              configs={
                isnp.length === 0
                  ? []
                  : [
                      {
                        selector: ".base-mark",
                        classToApply: FADE_OUT,
                      },
                      {
                        selector: isnp.map((m) => `#mark-${m}`).join(","),
                        classToApply: FADE_COMP_IN,
                      },
                    ]
              }
            >
              {isnp.length}
            </HoverTableCell>
            <HoverTableCell
              selectable
              configs={
                ipns.length === 0
                  ? []
                  : [
                      {
                        selector: ".base-mark",
                        classToApply: FADE_OUT,
                      },
                      {
                        selector: ipns.map((m) => `#mark-${m}`).join(","),
                        classToApply: FADE_COMP_IN,
                      },
                    ]
              }
            >
              {ipns.length}
            </HoverTableCell>
          </>
        )}
        <Table.Cell
          // onClick={rowClick}
          onMouseOver={() => {
            selectAll(".base-mark").classed(FADE_OUT, true);
            if (marks.length > 0) selectAll(marks).classed(FADE_COMP_IN, true);
          }}
          onMouseOut={() => {
            selectAll(".base-mark").classed(FADE_OUT, false);
            if (marks.length > 0) selectAll(marks).classed(FADE_COMP_IN, false);
          }}
        >
          <JaccardBar
            height={barHeight}
            score={similarity}
            label={isTask ? `Pattern ${idx + 1}` : type}
          />
        </Table.Cell>
        {!isTask && (
          <>
            <Table.Cell
              // onClick={rowClick}
              onMouseOver={() => {
                selectAll(".base-mark").classed(FADE_OUT, true);
                if (marks.length > 0)
                  selectAll(marks).classed(FADE_COMP_IN, true);
              }}
              onMouseOut={() => {
                selectAll(".base-mark").classed(FADE_OUT, false);
                if (marks.length > 0)
                  selectAll(marks).classed(FADE_COMP_IN, false);
              }}
            >
              <JaccardBar
                height={barHeight}
                score={rankAc !== undefined ? rankAc : 0}
                label={rankAc !== undefined ? rankAc.toFixed(2) : "0"}
              />
            </Table.Cell>
            <Table.Cell
              onMouseOver={() => {
                selectAll(".base-mark").classed(FADE_OUT, true);
                if (marks.length > 0)
                  selectAll(marks).classed(FADE_COMP_IN, true);
              }}
              onMouseOut={() => {
                selectAll(".base-mark").classed(FADE_OUT, false);
                if (marks.length > 0)
                  selectAll(marks).classed(FADE_COMP_IN, false);
              }}
              // onClick={rowClick}
            >
              <ProbabilityBar
                height={barHeight}
                score={probability}
                label={probability.toFixed(2)}
              />
            </Table.Cell>
          </>
        )}
        {/* <Table.Cell>
          <Button
            icon="hand pointer"
            primary
            onClick={() => {
              const curr = getAllSelections(
                plots,
                multiBrushBehaviour === "Union"
              ).values;
              actions.turnPredictionInSelection(pred, curr);
              hide$.next(null);
            }}
          />
        </Table.Cell> */}
        <Table.Cell>
          <Popup
            hoverable
            mouseEnterDelay={500}
            trigger={
              <Button
                icon="info"
                circular
                onClick={() => console.log(JSON.parse(JSON.stringify(pred)))}
              />
            }
            content={
              <>
                <Header>Info</Header>
                <pre>
                  {JSON.stringify(
                    pred,
                    (k, v) =>
                      ["dataIds", "matches", "isnp", "ipns"].includes(k)
                        ? undefined
                        : v,
                    2
                  )}
                </pre>
              </>
            }
          />
        </Table.Cell>
      </Table.Row>
    );
  }

  function sortHandler(column: SortableColumns) {
    const isAlreadyCurrent = column === sortColumn;

    if (isAlreadyCurrent) {
      store?.setSortDirection(
        direction === "ascending" ? "descending" : "ascending"
      );

      // setDirection((dir) => (dir === "ascending" ? "descending" : "ascending"));
      // if (store) {
      //   store.direction =
      //     direction === "ascending" ? "descending" : "ascending";
      // }

      return;
    }

    // if (store) {
    //   store.sortColumn = column;
    //   store.direction = "descending";
    // }
    store?.setSortColumn(column);
    store?.setSortDirection("descending");
    // setSortColumn(column);
    // setDirection("descending");
  }

  return (
    <Table sortable textAlign="center" selectable compact>
      <Table.Header>
        <Table.Row>
          {!isTask && <Table.HeaderCell>Dims</Table.HeaderCell>}
          {!isTask && (
            <>
              <Popup
                trigger={<Table.HeaderCell>M</Table.HeaderCell>}
                content={"Matches"}
              />
              <Popup
                trigger={<Table.HeaderCell>NP</Table.HeaderCell>}
                content={"In selection, not predicted"}
              />
              <Popup
                trigger={<Table.HeaderCell>NS</Table.HeaderCell>}
                content={"In prediction, not selected"}
              />
            </>
          )}
          {!isTask && (
            <Table.HeaderCell
              sorted={sortColumn === "similarity" ? direction : (null as any)}
              onClick={() => sortHandler("similarity")}
            >
              Intent Rank
            </Table.HeaderCell>
          )}
          {!isTask && (
            <>
              <Table.HeaderCell
                sorted={sortColumn === "rankAc" ? direction : (null as any)}
                onClick={() => sortHandler("rankAc")}
              >
                Auto Complete Rank
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={
                  sortColumn === "probability" ? direction : (null as any)
                }
                onClick={() => sortHandler("probability")}
              >
                Probability
              </Table.HeaderCell>
            </>
          )}
          <Table.HeaderCell></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{predictions.map(predRowRender)}</Table.Body>
    </Table>
  );
};

(PredictionTable as any).whyDidYouRender = true;
export default memo(inject("store")(observer(PredictionTable)));
