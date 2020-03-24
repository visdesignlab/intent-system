import { inject, observer } from 'mobx-react';
import React, { FC, memo, useContext } from 'react';
import { Button, Header, Label, Popup, Table } from 'semantic-ui-react';

import { ActionContext } from '../../Contexts';
import IntentStore from '../../Store/IntentStore';
import { hide$ } from '../Scatterplot/RawPlot';
import { FADE_COMP_IN, FADE_OUT } from '../Styles/MarkStyle';
import hoverable from '../UtilComponent/hoverable';
import JaccardBar from './JaccardBar';
import { getAllSelections, PredictionRowType } from './PredictionRowType';
import ProbabilityBar from './ProbabilityBar';

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

  function predRowRender(pred: PredictionRowType, idx: number) {
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
          <JaccardBar
            height={barHeight}
            score={similarity}
            label={isTask ? `Pattern ${idx + 1}` : type}
          />
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
          <Table.HeaderCell>Similarity</Table.HeaderCell>
          {!isTask && <Table.HeaderCell>Probability</Table.HeaderCell>}
          <Table.HeaderCell colSpan={isTask ? 2 : 3}></Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{predictions.map(predRowRender)}</Table.Body>
    </Table>
  );
};

(PredictionTable as any).whyDidYouRender = true;
export default memo(inject("store")(observer(PredictionTable)));
