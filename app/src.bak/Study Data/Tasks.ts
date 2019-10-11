export type Task = {
  task_no: number;
  question: string;
};

export type Tasks = Task[];

export const TaskList: Tasks = [
  {
    task_no: 1,
    question: "Do something with X Y Z"
  }
];
