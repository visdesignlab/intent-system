export enum VisualizationType {
  Grid = "Grid",
  Scatterplot = "Scatterplot",
  ScatterplotMatrix = "ScatterplotMatrix",
  ParallelCoordinatePlot = "ParallelCoordinatePlot",
  None = "None",
}

interface Selection {
  plot: Plot;
  dimensions?: Array<string>;
  dataIds: Array<number>;
}

export interface PointSelection extends Selection {
  kind: "selection";
}

export interface PointDeselection extends Selection {
  kind: "deselection";
}

export interface RectangularSelection extends Selection {
  brushId: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface ChangeAxis {
  dimensions: Array<string>;
}

export interface ClearAllSelections extends Selection {
  kind: "clearall";
}

export enum MultiBrushBehavior {
  INTERSECTION = "INTERSECTION",
  UNION = "UNION",
}

export interface Plot {
  id: string;
  x: string;
  y: string;
  color: string;
}

export interface PredictionRequest {
  multiBrushBehavior: MultiBrushBehavior;
  interactionHistory: InteractionHistory;
}

interface PlotsInteraction {
  plot: Plot;
}

export interface AddPlotInteraction extends PlotsInteraction {
  kind: "ADD";
}

export interface RemovePlotInteraction extends PlotsInteraction {
  kind: "REMOVE";
}

export interface UpdatePlotInteraction extends PlotsInteraction {
  kind: "UPDATE";
}

export type InteractionType =
  | ChangeAxis
  | ClearAllSelections
  | PointSelection
  | PointDeselection
  | RectangularSelection
  | AddPlotInteraction
  | RemovePlotInteraction
  | UpdatePlotInteraction;

export interface Interaction {
  visualizationType: VisualizationType;
  interactionType: InteractionType;
}

export type InteractionHistory = Array<Interaction>;

export interface Prediction {
  rank: number;
  rankAc: number;
  intent: string;
  dataIds?: Array<number>;
  info?: object;
  suggestion?: Array<Prediction>;
}

export interface PredictionSet {
  dimensions: Array<string>;
  selectedIds: Array<number>;
  predictions: Array<Prediction>;
}
