import { getTaskFromString } from "./TaskString";

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

const temp = getTaskFromString();

export type TaskDescription = {
  id: string;
  task: string;
  dataset: string;
  plots: PlotDef[];
  category: CategoryEncoding;
  taskType: TaskType;
  type: DatasetType;
  difficulty: Difficulty;
  training: Training;
  center: Center | null;
};

const taskList = getTaskFromString();

export function getAllTasks(isCoding: boolean = false): TaskDescription[] {
  const training = taskList.filter(d => d.training === "yes");
  const tasks = taskList
    .filter(d => d.training === "no")
    .map(d => ({ sort: Math.random(), value: d }))
    .sort((a, b) => a.sort - b.sort)
    .map(d => d.value);

  return [...training, ...tasks].map(d => ({ ...d, taskType: "manual" }));
}

// const taskList: TaskDescription[] = [
//   {
//     id: "0",
//     task:
//       "Select the points which show a strong correlation in Physics and CS.",
//     dataset: "cluster",
//     plots: [{ x: "Physics", y: "CS" }],
//     category: {
//       show: false,
//       column: "Profession"
//     },
//     taskType: "manual",
//     type: "linear regression",
//     difficulty: "easy",
//     training: "yes",
//     center: { x: 19, y: 23 }
//   },
//   {
//     id: "1",
//     task:
//       "Select the points which belong to the cluster centered on the cross [SYMBOL].",
//     dataset: "cluster",
//     plots: [{ x: "Physics", y: "CS" }],
//     category: {
//       show: false,
//       column: "Profession"
//     },
//     taskType: "supported",
//     type: "cluster",
//     difficulty: "easy",
//     training: "no",
//     center: null
//   }
// ];
