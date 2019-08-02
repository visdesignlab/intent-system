import {
  InteractionHistory,
  VisualizationType
} from "@visdesignlab/intent-contract";

import { BrushDictionary } from "./ScatterPlotBrushState";
import { Dataset } from "./Dataset";

export interface VisualizationState {
  dataset: Dataset;
  visualization: VisualizationType;
  interactions: InteractionHistory;
  predictions: any[];
}
