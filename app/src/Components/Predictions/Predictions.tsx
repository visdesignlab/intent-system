import React, { FC, useState, memo, useContext } from "react";
import IntentStore from "../../Store/IntentStore";
import { inject, observer } from "mobx-react";
import AnnotationBox from "./AnnotationBox";
import { style } from "typestyle";
import PredictionList from "./PredictionList";
import Selections from "./Selections";
import {
  getAllSelections,
  UserSelections,
  defaultSelections
} from "./PredictionRowType";
import { TaskConfigContext } from "../../Contexts";

interface Props {
  store?: IntentStore;
}

const Predictions: FC<Props> = ({ store }: Props) => {
  const { annotation, plots, multiBrushBehaviour } = store!;

  const task = useContext(TaskConfigContext);

  const { taskType = "supported" } = task || {};

  const [selections, setSelections] = useState<UserSelections>(
    defaultSelections
  );

  const computedSelections = getAllSelections(
    plots,
    multiBrushBehaviour === "Union"
  );

  if (JSON.stringify(computedSelections) !== JSON.stringify(selections)) {
    setSelections(computedSelections);
  }

  return (
    <div className={predictionColumnStyle(taskType === "supported")}>
      {!task && <AnnotationBox annotation={annotation} />}
      {taskType === "supported" && (
        <PredictionList selections={selections.values} />
      )}
      {!task && <Selections selections={selections} />}
    </div>
  );
};

export default memo(inject("store")(observer(Predictions)));

const predictionColumnStyle = (predictionSupport: boolean) => {
  const gridTemplateRows = predictionSupport
    ? "min-content 1fr 0.75fr"
    : "min-content auto";
  const gridTemplateAreas = predictionSupport
    ? `
  "annotation"
  "predictions"
  "selections"
  `
    : `
  "annotation"
  "selections"
  `;

  return style({
    gridArea: "pred",
    height: "100vh",
    display: "grid",
    gridTemplateRows,
    gridTemplateAreas
  });
};
