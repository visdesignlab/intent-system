import React, { FC, useContext, memo } from "react";
import { inject, observer } from "mobx-react";
import IntentStore from "../../Store/IntentStore";
import { Table, Label, Popup, Button } from "semantic-ui-react";
import { PredictionRowType, getAllSelections } from "./PredictionRowType";
import JaccardBar from "./JaccardBar";
import ProbabilityBar from "./ProbabilityBar";
import hoverable from "../UtilComponent/hoverable";
import { FADE_OUT, FADE_COMP_IN } from "../Styles/MarkStyle";
import { ActionContext } from "../../Contexts";

type Props = {
  store?: IntentStore;
  predictions: PredictionRowType[];
  isTask: boolean;
};

const PredictionTable: FC<Props> = ({
  store,
  predictions,
  isTask = false
}: Props) => {
  const { selectedPrediction, plots, multiBrushBehaviour } = store!;
  const barHeight = 30;
  const actions = useContext(ActionContext);

  const HoverTableCell = hoverable(Table.Cell);

  function predRowRender(pred: PredictionRowType) {
    const { matches, isnp, ipns, similarity, type, probability } = pred;

    function rowClick() {
      if (pred.intent === selectedPrediction) {
        actions.selectPrediction("none");
      } else {
        actions.selectPrediction(pred.intent);
      }
    }

    return (
      <Table.Row key={pred.intent} active={pred.intent === selectedPrediction}>
        {!isTask && (
          <Table.Cell>
            {pred.dims.map(dim => (
              <Label size="mini" circular key={dim}>
                {dim}
              </Label>
            ))}
          </Table.Cell>
        )}
        {!isTask && (
          <>
            {" "}
            <HoverTableCell
              configs={
                matches.length === 0
                  ? []
                  : [
                      {
                        selector: ".base-mark",
                        classToApply: FADE_OUT
                      },
                      {
                        selector: matches.map(m => `#mark-${m}`).join(","),
                        classToApply: FADE_COMP_IN
                      }
                    ]
              }
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
                        classToApply: FADE_OUT
                      },
                      {
                        selector: isnp.map(m => `#mark-${m}`).join(","),
                        classToApply: FADE_COMP_IN
                      }
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
                        classToApply: FADE_OUT
                      },
                      {
                        selector: ipns.map(m => `#mark-${m}`).join(","),
                        classToApply: FADE_COMP_IN
                      }
                    ]
              }
            >
              {ipns.length}
            </HoverTableCell>{" "}
          </>
        )}
        <Table.Cell onClick={rowClick}>
          <JaccardBar height={barHeight} score={similarity} label={type} />
        </Table.Cell>
        {!isTask && (
          <Table.Cell onClick={rowClick}>
            <ProbabilityBar
              height={barHeight}
              score={probability}
              label={probability.toFixed(2)}
            />
          </Table.Cell>
        )}
        {!isTask && (
          <Table.Cell>
            <Button
              icon="check"
              positive
              onClick={() => {
                actions.lockPrediction(pred);
              }}
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
            }}
          />
        </Table.Cell>
      </Table.Row>
    );
  }

  return (
    <Table sortable textAlign="center" compact>
      <Table.Header>
        <Table.Row>
          {!isTask && <Table.HeaderCell>Dims</Table.HeaderCell>}
          {!isTask && (
            <>
              {" "}
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
          <Table.HeaderCell>Similarity</Table.HeaderCell>
          {!isTask && <Table.HeaderCell>Probability</Table.HeaderCell>}
          <Table.HeaderCell colSpan={isTask ? 1 : 2}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{predictions.map(predRowRender)}</Table.Body>
    </Table>
  );
};

(PredictionTable as any).whyDidYouRender = true;
export default memo(inject("store")(observer(PredictionTable)));
