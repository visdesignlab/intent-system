import TaskDetails from '../../Types/TaskDetails';
import {Action, Reducer} from 'redux';

export const TASK_UPDATE = 'TASK_UPDATE';
export type TASK_UPDATE = typeof TASK_UPDATE;

interface TaskUpdateAction extends Action<TASK_UPDATE> {
  type: TASK_UPDATE;
  args: TaskDetails;
}

export const updateTask = (task: TaskDetails): TaskUpdateAction => ({
  type: TASK_UPDATE,
  args: task,
});

const dummyTask: TaskDetails = {
  taskId: -1,
  order: -1,
};

export const TaskReducer: Reducer<TaskDetails, TaskUpdateAction> = (
  current: TaskDetails = dummyTask,
  action: TaskUpdateAction,
) => {
  switch (action.type) {
    case TASK_UPDATE:
      return action.args;
    default:
      return current;
  }
};
