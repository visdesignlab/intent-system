import _ from "lodash";

import { Prediction } from "../../contract";
import { Plots } from "../../Store/IntentState";
import { ColumnMap } from "../../Utils/Dataset";
import { Data } from "./../../Utils/Dataset";

export type PredictionType =
  | "Outlier"
  | "Cluster"
  | "Skyline"
  | "Category"
  | "Quadratic Regression - Within"
  | "Quadratic Regression - Outside"
  | "Linear Regression - Within"
  | "Linear Regression - Outside"
  | "Non Outlier"
  | "Range"
  | "Simplified Range";

export type PredictionRowType = Prediction & {
  type: PredictionType;
  probability: number;
  similarity: number;
  matches: number[];
  ipns: number[];
  isnp: number[];
  dims: string[];
};

export type UserSelections = {
  values: number[];
  unionArr: number[];
  intersectionArr: number[];
  individualArr: number[];
  union: number;
  intersection: number;
  individual: number;
  total: number;
};

export function extendRange(pred: Prediction, selection: number[]) {
  if (pred.intent.includes("Range")) {
    pred.dataIds = selection;
  }
  return pred;
}

export function extendPrediction(
  pred: Prediction,
  selections: number[],
  columnMap: ColumnMap,
  data: Data
): PredictionRowType {
  const type: PredictionType = getPredictionType(pred.intent);
  const { probability = 0 } = pred.info! as any;
  const { rank: similarity } = pred;

  let { dataIds = [] } = pred;

  const matches = _.intersection(dataIds, selections);
  const ipns = _.difference(dataIds, selections);
  const isnp = _.difference(selections, dataIds);
  const dims = getDimensions(pred.intent)
    .map((dim) => {
      return columnMap[dim].short;
    })
    .sort();

  return {
    ...pred,
    type,
    probability,
    similarity,
    matches,
    ipns,
    isnp,
    dims,
  };
}

function getDimensions(intent: string) {
  if (!intent.includes("[")) return [];
  const dims = intent
    .split(":")[1]
    .replace(/\[|\]|'|\s/g, "")
    .split(",");
  return dims;
}

function getPredictionType(intent: string): PredictionType {
  if (intent === "Range") return "Range";
  if (intent === "RangeSimplified") return "Simplified Range";
  const intentArr = intent.split(":");
  const intentType = intentArr[2];

  if (intentType === "Outlier") return "Outlier";
  if (intentType === "Non-Outlier") return "Non Outlier";
  if (intentType === "Skyline") return "Skyline";
  if (intentType === "Cluster") return "Cluster";
  if (intentType.includes("Category")) return "Category";
  if (intentType.includes("Regression")) {
    const intentExtraType = intentArr[3];
    if (intentType === "LinearRegression")
      return intentExtraType.includes("within")
        ? "Linear Regression - Within"
        : "Linear Regression - Outside";
    if (intentType === "QuadraticRegression")
      return intentExtraType.includes("within")
        ? "Quadratic Regression - Within"
        : "Quadratic Regression - Outside";
  }

  return "Outlier";
}

export function getAllSelections(
  plots: Plots,
  isUnion: boolean
): UserSelections {
  const selections: number[] = [];
  const individualArr: number[] = [];
  const brushSelections: number[] = [];
  let brushCount: number = 0;

  if (plots === undefined) {
    plots = [];
  }

  for (let i = 0; i < plots.length; ++i) {
    const plot = plots[i];
    selections.push(...plot.selectedPoints);
    individualArr.push(...plot.selectedPoints);

    // Doing this to account for empty brush arrays from firebase
    if (!plot.brushes) {
      plot.brushes = {};
    }

    const brushes = Object.values(plot.brushes);

    for (let y = 0; y < brushes.length; ++y) {
      brushCount += 1;
      const brush = brushes[y];
      selections.push(...brush.points);
      brushSelections.push(...brush.points);
    }
  }

  const values = [...new Set(selections)];

  const brushSelectionCount = _.countBy(brushSelections);

  const unionArr = Object.keys(brushSelectionCount).map(parseInt);
  const union = unionArr.length;
  const intersectionArr = isUnion
    ? unionArr
    : Object.keys(brushSelectionCount)
        .filter((d) => brushSelectionCount[d] === brushCount)
        .map(parseInt);
  const intersection = intersectionArr.length;

  return {
    values,
    unionArr,
    intersectionArr,
    individualArr,
    union,
    intersection,
    total: values.length,
    individual: [...new Set(individualArr)].length,
  };
}

export const defaultSelections = {
  values: [],
  unionArr: [],
  intersectionArr: [],
  individualArr: [],
  union: 0,
  intersection: 0,
  total: 0,
  individual: 0,
};
