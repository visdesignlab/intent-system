enum VisualizationType {
    ScatterPlot = "ScatterPlot",
    ScatterPlotMatrix = "ScatterPlotMatrix",
    Table = "Table",
    None = "None"
}

interface Selection {
    dimensions: Array<string>;
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
    UNION = "UNION"
}

export interface PredictionRequest {
    multiBrushBehavior: MultiBrushBehavior;
    interactionHistory: InteractionHistory;
}

export interface Interaction {
    visualizationType: VisualizationType;
    interactionType:
    | ChangeAxis
    | ClearAllSelections
    | PointSelection
    | PointDeselection
    | RectangularSelection;
}

export type InteractionHistory = Array<Interaction>;

export interface Prediction {
    rank: number;
    intent: string;
    dataIds?: Array<number>;
    info?: object;
    suggestion?: Array<Prediction>;
}

export interface PredictionSet {
    dimensions: Array<string>;
    selectedIds: Array<number>;
    predictions: Array<Prediction>;
    time: number;
}

export { VisualizationType };
