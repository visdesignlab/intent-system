import {Dataset} from '../Utils/Dataset';

export type MultiBrushBehaviour = 'Union' | 'Intersection';

export interface Plot {
  id: string;
  x: string;
  y: string;
  brushes?: any[];
  selectedPoints: number[];
}

export type Plots = Plot[];

export interface IntentState {
  dataset: Dataset;
  showCategories: boolean;
  categoryColumn: string;
  multiBrushBehaviour: MultiBrushBehaviour;
  plots: Plots;
}

export const defaultState: IntentState = {
  dataset: {key: '', name: ''},
  multiBrushBehaviour: 'Union',
  showCategories: false,
  categoryColumn: '',
  plots: [],
};
