import { getTaskFromString } from './TaskString';

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

type CategorySymbol = "diamond" | "cross" | "square" | "circle" | "None";

export type TaskDescription = {
  id: string;
  task: string;
  dataset: string;
  plots: PlotDef[];
  category: CategoryEncoding;
  manual: TaskType;
  type: DatasetType;
  difficulty: Difficulty;
  training: Training;
  center: Center | null;
  symbol: CategorySymbol;
  reference: number[];
};

const taskList = getTaskFromString();

function getRandom(): number[] {
  const pointCount = Math.round(Math.random() * 10) + 1;
  const pointGen = () => Math.round(Math.random() * 100);

  const arr = new Array<number>(pointCount).fill(0);

  return arr.map(d => pointGen());
}

export function getAllTasks(isCoding: boolean = false): TaskDescription[] {
  const training = taskList
    .filter(d => d.training === "yes")
    .map(d => ({ ...d, reference: getRandom() } as TaskDescription));

  const tasks = taskList
    .filter(d => d.training === "no")
    .map(d => ({ sort: Math.random(), value: d }))
    .sort((a, b) => a.sort - b.sort)
    .map(d => d.value)
    .map(d => ({ ...d, reference: [] } as TaskDescription));

  let allTasks = [...training, ...tasks];
  if (isCoding) {
    allTasks = allTasks.map(
      d => ({ ...d, taskType: "manual" } as TaskDescription)
    );
  }

  return allTasks;
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
