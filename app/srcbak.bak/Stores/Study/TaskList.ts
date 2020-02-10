import TaskDetails from '../Types/TaskDetails';

const TaskList: TaskDetails[] = [
  {
    taskId: 1,
    order: 1,
    text:
      'Select countries which have high GDP and higher Life Expectancy with low population',
  },
  {
    taskId: 2,
    order: 2,
    text:
      'Which region (continent) has countries with high GDP but lower health metrics (life expectancy, child mortality)',
  },
  {
    taskId: 3,
    order: 3,
    text:
      'Select 3 countries have similar economic performance (GDP), Life expectancy and population levels',
  },
  {
    taskId: 4,
    order: 4,
    text:
      'Using just the given data, which countries are developing countries (high population as well as growth rate, low GDP and low life expectancy, higher child mortality rates) ',
  },
  {
    taskId: 5,
    order: 5,
    text: 'Using as many plots you want, report an interesting finding.',
  },
];

export default TaskList;
