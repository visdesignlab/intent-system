import {Dataset} from '../Utils/Dataset';
import {Brush} from '../Components/Brush/Types/Brush';

export type MultiBrushBehaviour = 'Union' | 'Intersection';

export interface ExtendedBrush extends Brush {
  points: number[];
}

export type ExtendedBrushCollection = {[key: string]: ExtendedBrush};

export interface Plot {
  id: string;
  x: string;
  y: string;
  brushes: ExtendedBrushCollection;
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
