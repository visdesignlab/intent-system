import {BrushCollection} from '../../Components/Brush/Types/Brush';

export type Plots = SinglePlot[];

export type PointCountInPlot = {[key: number]: number};
export type BrushRecordForPlot = {[key: string]: PointCountInPlot};
export type OtherPointSelections = {[key: string]: number[]};

export interface SinglePlot {
  id: string;
  x: string;
  y: string;
  color: string;
  brushes: BrushCollection;
  brushSelections: BrushRecordForPlot;
  combinedBrushSelections: PointCountInPlot;
  selectedPoints: number[];
}

export function combineBrushSelectionInSinglePlot(
  plot: SinglePlot,
): PointCountInPlot {
  return combinePointCountInPlot(Object.values(plot.brushSelections));
}

export function combineBrushSelectionInMultiplePlots(
  plots: SinglePlot[],
): PointCountInPlot {
  return combinePointCountInPlot(plots.map(p => p.combinedBrushSelections));
}

export function combinePointCountInPlot(
  arr: PointCountInPlot[],
): PointCountInPlot {
  return Object.values(arr).reduce(
    (acc: PointCountInPlot, current: PointCountInPlot) => {
      Object.entries(current).forEach(([key, value]: [any, number]) => {
        acc[key] = (acc[key] || 0) + value;
      });

      return acc;
    },
    {} as PointCountInPlot,
  );
}
