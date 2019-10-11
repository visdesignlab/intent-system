import ParticipantDetails from '../Types/ParticipantDetails';
import TaskDetails from '../Types/TaskDetails';
import Events from '../Types/EventEnum';

export default interface StudyState {
  participant: ParticipantDetails;
  task: TaskDetails;
  event: Events;
  startTime: Date;
  endTime: Date;
  eventTime: Date;
}
