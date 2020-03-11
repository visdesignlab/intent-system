import React, { FC, useContext, memo } from "react";
import { Divider, Header, Statistic, Label } from "semantic-ui-react";
import { style } from "typestyle";
import IntentStore from "../../Store/IntentStore";
import { inject, observer } from "mobx-react";
import { UserSelections } from "./PredictionRowType";
import hoverable from "../UtilComponent/hoverable";
import { FADE_OUT, FADE_IN, FADE_SELECTION_IN } from "../Styles/MarkStyle";
import {
  DataContext,
  StudyActionContext,
  ProvenanceContext
} from "../../Contexts";

export interface Props {
  store?: IntentStore;
  selections: UserSelections;
}

const Selections: FC<Props> = ({ store, selections }: Props) => {
  const { multiBrushBehaviour } = store!;
  const data = useContext(DataContext);
  const HoverableStatistic = hoverable(Statistic);
  const SelectionLabel = hoverable(Label);

  return (
    <div className={selectionStyle}>
      <div>
        <Header textAlign="center" as="h1">
          Selections
        </Header>
        <Statistic.Group widths="4" size="small">
          <HoverableStatistic
            className={backgroundHover}
            configs={[
              {
                selector: ".regular-mark,.intersection-mark,.click-mark",
                classToApply: FADE_OUT
              },
              {
                selector: ".union-mark",
                classToApply: FADE_IN
              }
            ]}
            color="orange"
          >
            <Statistic.Value>{selections.union}</Statistic.Value>
            <Statistic.Label>Union</Statistic.Label>
          </HoverableStatistic>
          <HoverableStatistic
            className={backgroundHover}
            configs={[
              {
                selector:
                  multiBrushBehaviour === "Union"
                    ? ".regular-mark,.intersection-mark,.click-mark"
                    : ".regular-mark,.union-mark,.click-mark",
                classToApply: FADE_OUT
              },
              {
                selector:
                  multiBrushBehaviour === "Union"
                    ? ".union-mark"
                    : ".intersection-mark",
                classToApply: FADE_IN
              }
            ]}
            color={multiBrushBehaviour === "Union" ? "orange" : "blue"}
          >
            <Statistic.Value>{selections.intersection}</Statistic.Value>
            <Statistic.Label>Intersection</Statistic.Label>
          </HoverableStatistic>
          <HoverableStatistic
            className={backgroundHover}
            configs={[
              {
                selector: ".click-mark",
                classToApply: FADE_IN
              },
              {
                selector: ".regular-mark,.intersection-mark,.union-mark",
                classToApply: FADE_OUT
              }
            ]}
            color="red"
          >
            <Statistic.Value>{selections.individual}</Statistic.Value>
            <Statistic.Label>Individual</Statistic.Label>
          </HoverableStatistic>
          <HoverableStatistic
            className={backgroundHover}
            configs={[
              {
                selector: ".click-mark,.intersection-mark,.union-mark",
                classToApply: FADE_IN
              },
              {
                selector: ".regular-mark",
                classToApply: FADE_OUT
              }
            ]}
          >
            <Statistic.Value>{selections.total}</Statistic.Value>
            <Statistic.Label>Total</Statistic.Label>
          </HoverableStatistic>
        </Statistic.Group>
        <Divider />
      </div>
      <div className={selectionList}>
        {selections.values.map(idx => (
          <SelectionLabel
            className={selectionLabelMargin}
            configs={[
              {
                selector: `#mark-${idx}`,
                classToApply: FADE_SELECTION_IN
              }
            ]}
            key={idx}
          >
            {data.values[idx][data.labelColumn]}
          </SelectionLabel>
        ))}
      </div>
      {/* <div>
        <Divider />
        <Container fluid textAlign="center">
          <Button
            disabled={selections.values.length === 0}
            primary
            onClick={() => studyActions.endTask(selections.values, graph())}
          >
            Submit
          </Button>
        </Container>
      </div> */}
    </div>
  );
};

(Selections as any).whyDidYouRender = true;
export default memo(inject("store")(observer(Selections)));

const selectionStyle = style({
  gridArea: "selections",
  overflow: "hidden",
  display: "grid",
  gridTemplateRows: "min-content auto min-content"
});

const selectionList = style({
  overflow: "auto"
});

const backgroundHover = style({
  background: "rgba(0,0,0,0)",
  transition: "background 0.25s linear",
  $nest: {
    "&:hover": {
      background: "rgba(0,0,0,0.05)",
      transition: "background 0.25s linear"
    }
  }
});

const selectionLabelMargin = style({
  margin: "0.3em !important"
});
