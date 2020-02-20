import {Prediction} from '../../contract';
import {Plots} from '../../Store/IntentState';
import _ from 'lodash';

export type PredictionType =
  | 'Outlier'
  | 'Cluster'
  | 'Skyline'
  | 'Category'
  | 'Quadratic Regression - Within'
  | 'Quadratic Regression - Outside'
  | 'Linear Regression - Within'
  | 'Linear Regression - Outside'
  | 'Non Outlier'
  | 'Range'
  | 'Simplified Range';

export type PredictionRowType = Prediction & {
  type: PredictionType;
  probability: number;
  similarity: number;
  matches: number[];
  ipns: number[];
  isnp: number[];
};

export function extendPrediction(
  pred: Prediction,
  selections: number[],
): PredictionRowType {
  const type: PredictionType = getPredictionType(pred.intent);
  const {probability = 0} = pred.info! as any;
  const {rank: similarity} = pred;

  const {dataIds = []} = pred;

  const matches = _.intersection(dataIds, selections);
  const ipns = _.difference(dataIds, selections);
  const isnp = _.difference(selections, dataIds);

  return {
    ...pred,
    type,
    probability,
    similarity,
    matches,
    ipns,
    isnp,
  };
}

function getPredictionType(intent: string): PredictionType {
  if (intent === 'Range') return 'Range';
  if (intent === 'RangeSimplified') return 'Simplified Range';
  const intentArr = intent.split(':');
  const intentType = intentArr[2];

  if (intentType === 'Outlier') return 'Outlier';
  if (intentType === 'Non-Outlier') return 'Non Outlier';
  if (intentType === 'Skyline') return 'Skyline';
  if (intentType === 'Cluster') return 'Cluster';
  if (intentType.includes('Category')) return 'Category';
  if (intentType.includes('Regression')) {
    const intentExtraType = intentArr[3];
    if (intentType === 'LinearRegression')
      return intentExtraType.includes('within')
        ? 'Linear Regression - Within'
        : 'Linear Regression - Outside';
    if (intentType === 'QuadraticRegression')
      return intentExtraType.includes('within')
        ? 'Quadratic Regression - Within'
        : 'Quadratic Regression - Outside';
  }

  return 'Outlier';
}

export function getAllSelections(plots: Plots, isUnion: boolean): number[] {
  const selections: number[] = [];

  for (let i = 0; i < plots.length; ++i) {
    const plot = plots[i];
    selections.push(...plot.selectedPoints);
    const brushes = Object.values(plot.brushes);
    for (let y = 0; y < brushes.length; ++y) {
      const brush = brushes[y];
      selections.push(...brush.points);
    }
  }

  return [...new Set(selections)];
}
