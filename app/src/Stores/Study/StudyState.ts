import ParticipantDetails from '../Types/ParticipantDetails';
import TaskDetails from '../Types/TaskDetails';
import Events from '../Types/EventEnum';
import {Prediction, PredictionSet, InteractionHistory} from '../../contract';

export interface StudyState {
  participant: ParticipantDetails;
  task: TaskDetails;
  event: Events;
  startTime: Date;
  endTime: Date;
  eventTime: Date;
  interactions: InteractionHistory;
  predictionSet: PredictionSet;
  selectedPrediction: {
    prediction: Prediction | null;
    comment?: string;
  };
  answer: {
    submissions: any[];
    comment?: string;
  };
}

export const defaultStudyState: StudyState = {
  participant: {
    uniqueId: null as any,
    name: null as any,
  },
  task: null as any,
  event: null as any,
  startTime: null as any,
  endTime: null as any,
  eventTime: null as any,
  interactions: [],
  predictionSet: null as any,
  selectedPrediction: null as any,
  answer: null as any,
};
