import { selectAll } from 'd3';
import { inject, observer } from 'mobx-react';
import React, { FC, memo, useContext, useEffect, useState } from 'react';
import { Button, Header, Label, Popup, Table } from 'semantic-ui-react';

import { ActionContext } from '../../Contexts';
import IntentStore from '../../Store/IntentStore';
import { hide$ } from '../Scatterplot/RawPlot';
import { FADE_COMP_IN, FADE_OUT } from '../Styles/MarkStyle';
import hoverable from '../UtilComponent/hoverable';
import { topPred$ } from './AnnotationBox';
import JaccardBar from './JaccardBar';
import { getAllSelections, PredictionRowType } from './PredictionRowType';
import ProbabilityBar from './ProbabilityBar';

type Props = {
  store?: IntentStore;
  predictions: PredictionRowType[];
  isTask: boolean;
};

export type SortableColumns = "similarity" | "probability" | "rankAc";
export type SortDirection = "ascending" | "descending" | "undefined";

const PredictionTable: FC<Props> = ({
  store,
  predictions: basePredictions,
  isTask = false,
}: Props) => {
  const { selectedPrediction, plots, multiBrushBehaviour } = store!;
  const [predictionsInput, setPredictionsInput] = useState<PredictionRowType[]>(
    []
  );

  const [sortColumn, setSortColumn] = useState<SortableColumns>("similarity");
  const [direction, setDirection] = useState<SortDirection>("descending");

  const predString = JSON.stringify(basePredictions);

  useEffect(() => {
    if (predString === JSON.stringify(predictionsInput)) return;
    let preds = JSON.parse(predString) as PredictionRowType[];
    setPredictionsInput(preds);
  }, [predString, predictionsInput]);

  let predictions: PredictionRowType[] = [];

  if (direction === "ascending")
    predictions = predictionsInput.sort(
      (a, b) => a[sortColumn] - b[sortColumn]
    );
  else
    predictions = predictionsInput.sort(
      (a, b) => b[sortColumn] - a[sortColumn]
    );

  useEffect(() => {
    if (predictions.length > 0) topPred$.next(predictions[0]);
  }, [predictions]);

  const barHeight = 30;
  const actions = useContext(ActionContext);

  const HoverTableCell = hoverable(Table.Cell);

  function predRowRender(pred: PredictionRowType, idx: number) {
    const { matches, isnp, ipns, similarity, type, probability, rankAc } = pred;

    function rowClick() {
      if (isTask) {
        selectAll(".base-mark")
          .classed(FADE_COMP_IN, false)
          .classed(FADE_OUT, false);
        const curr = getAllSelections(plots, multiBrushBehaviour === "Union")
          .values;
        actions.turnPredictionInSelection(pred, curr);
        hide$.next(null);
      } else {
        if (pred.intent === selectedPrediction) {
          actions.selectPrediction("none");
          topPred$.next(predictions[0]);
        } else {
          actions.selectPrediction(pred.intent);
          topPred$.next(pred);
        }
      }
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
            score={rankAc}
            label={rankAc.toFixed(2)}
          />
        </Table.Cell>
        {!isTask && (
          <Table.Cell
          // onClick={rowClick}
          >
            <ProbabilityBar
              height={barHeight}
              score={probability}
              label={probability.toFixed(2)}
            />
          </Table.Cell>
        )}
        <Table.Cell>
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
        </Table.Cell>
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
      setDirection((dir) => (dir === "ascending" ? "descending" : "ascending"));
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
    setSortColumn(column);
    setDirection("descending");
  }

  return (
    <Table sortable textAlign="center" compact>
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
          <Table.HeaderCell
            sorted={sortColumn === "rankAc" ? direction : (null as any)}
            onClick={() => sortHandler("rankAc")}
          >
            Auto Complete Rank
          </Table.HeaderCell>
          {!isTask && (
            <Table.HeaderCell
              sorted={sortColumn === "probability" ? direction : (null as any)}
              onClick={() => sortHandler("probability")}
            >
              Probability
            </Table.HeaderCell>
          )}
          <Table.HeaderCell colSpan={isTask ? 1 : 2}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{predictions.map(predRowRender)}</Table.Body>
    </Table>
  );
};

(PredictionTable as any).whyDidYouRender = true;
export default memo(inject("store")(observer(PredictionTable)));
