import {
  InteractionHistory,
  MultiBrushBehavior,
  PredictionSet,
  VisualizationType,
} from '@visdesignlab/intent-contract';

import {Dataset} from './Dataset';

export interface VisualizationState {
  dataset: Dataset;
  visualization: VisualizationType;
  interactions: InteractionHistory;
  predictionSet: PredictionSet;
  mutliBrushBehavior: MultiBrushBehavior;
}
