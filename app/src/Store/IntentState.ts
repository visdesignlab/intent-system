import { Brush } from '../Components/Brush/Types/Brush';
import { InteractionHistory, Prediction } from '../contract';
import { Dataset } from '../Utils/Dataset';

export type MultiBrushBehaviour = "Union" | "Intersection";

export interface ExtendedBrush extends Brush {
  points: number[];
}

export type ExtendedBrushCollection = { [key: string]: ExtendedBrush };

export type BrushType = "Rectangular" | "Freeform" | "None";

export type BrushSize = "20" | "35" | "50" | "None";

export interface Plot {
  id: string;
  x: string;
  y: string;
  brushes: ExtendedBrushCollection;
  selectedPoints: number[];
}

export function getDefaultPlot(): Plot {
  return {
    id: "",
    x: "",
    y: "",
    brushes: {},
    selectedPoints: [],
  };
}

export type Plots = Plot[];

export interface IntentState {
  dataset: Dataset;
  showCategories: boolean;
  categoryColumn: string;
  multiBrushBehaviour: MultiBrushBehaviour;
  plots: Plots;
  interactionHistory: InteractionHistory;
  brushType: BrushType;
  brushSize: BrushSize;
  lockedPrediction: Prediction;
  turnedPrediction: string | null;
}

export const defaultState: IntentState = {
  dataset: { key: "", name: "" },
  multiBrushBehaviour: "Union",
  showCategories: true,
  categoryColumn: "",
  plots: [],
  interactionHistory: [],
  brushType: "Freeform",
  lockedPrediction: null as any,
  brushSize: "50",
  turnedPrediction: null,
};
