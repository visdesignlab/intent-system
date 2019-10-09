import {Interaction} from '@visdesignlab/intent-contract';
import {BrushCollection} from '@bit/kirangadhave.multi_brush_component.brush';

export default interface VisualizationState {
  participant: ParticipantDetails;
  task: TaskDetails;
  plots: Plots;
  interaction: Interaction;
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
