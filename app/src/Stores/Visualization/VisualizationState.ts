import {Interaction} from '@visdesignlab/intent-contract';
import {BrushCollection} from '@bit/kirangadhave.multi_brush_component.brush';
import {Dataset} from './Dataset';

export default interface VisualizationState {
  participant: ParticipantDetails;
  task: TaskDetails;
  dataset: Dataset;
  plots: Plots;
  interaction: Interaction;
  multiBrushBehaviour: boolean;
}

type Plots = SinglePlot[];

interface SinglePlot {
  x: string;
  y: string;
  color: string;
  brushes: BrushCollection;
}

interface ParticipantDetails {
  name: string;
}

interface TaskDetails {
  taskId: number;
  order: number;
}

const state: VisualizationState = {} as any;
