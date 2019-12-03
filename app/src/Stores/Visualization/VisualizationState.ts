import {Plots} from '../Types/Plots';
import TaskDetails from '../Types/TaskDetails';
import ParticipantDetails from '../Types/ParticipantDetails';
import {Dataset} from '../Types/Dataset';
import {InteractionHistory, MultiBrushBehavior} from '../../contract';
import {RefinedPoints} from './VisualizationStore';

export default interface VisualizationState {
  participant: ParticipantDetails;
  task: TaskDetails;
  dataset: Dataset;
  plots: Plots;
  interactions: InteractionHistory;
  multiBrushBehaviour: MultiBrushBehavior;
  refinedPoints: RefinedPoints;
}
