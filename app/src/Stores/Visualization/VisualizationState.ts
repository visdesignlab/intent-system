import {Interaction} from '@visdesignlab/intent-contract';
import {Plots} from '../Types/Plots';
import TaskDetails from '../Types/TaskDetails';
import ParticipantDetails from '../Types/ParticipantDetails';
import {Dataset} from '../Types/Dataset';

export default interface VisualizationState {
  participant?: ParticipantDetails;
  task?: TaskDetails;
  dataset: Dataset;
  plots?: Plots;
  interaction?: Interaction;
  multiBrushBehaviour?: boolean;
}
