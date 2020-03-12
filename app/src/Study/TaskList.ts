export type TaskType = "manual" | "supported";

type DatasetType =
  | "cluster"
  | "outlier"
  | "linear regression"
  | "quadratic regression"
  | "category"
  | "skyline";

type Difficulty = "easy" | "medium" | "hard";

export type PlotDef = {
  x: string;
  y: string;
};

type CategoryEncoding = {
  show: boolean;
  column: string;
};

type Training = "yes" | "no";

type Center = { x: number; y: number };

export type TaskDescription = {
  id: string;
  task: string;
  dataset: string;
  plots: PlotDef[];
  category: CategoryEncoding;
  enablePlotAddition: boolean;
  taskType: TaskType;
  type: DatasetType;
  difficulty: Difficulty;
  training: Training;
  center: Center | null;
};

const taskList: TaskDescription[] = [
  {
    id: "0",
    task:
      "Select the points which show a strong correlation in Physics and CS.",
    dataset: "cluster",
    plots: [{ x: "Physics", y: "CS" }],
    category: {
      show: false,
      column: "Profession"
    },
    enablePlotAddition: true,
    taskType: "manual",
    type: "linear regression",
    difficulty: "easy",
    training: "yes",
    center: { x: 19, y: 23 }
  },
  {
    id: "1",
    task:
      "Select the points which belong to the cluster centered on the cross [SYMBOL].",
    dataset: "cluster",
    plots: [{ x: "Physics", y: "CS" }],
    category: {
      show: false,
      column: "Profession"
    },
    enablePlotAddition: false,
    taskType: "supported",
    type: "cluster",
    difficulty: "easy",
    training: "no",
    center: null
  }
];

export function getAllTasks(): TaskDescription[] {
  return taskList
    .map(d => ({ sort: Math.random(), value: d }))
    .sort((a, b) => a.sort - b.sort)
    .map(d => d.value);
}
