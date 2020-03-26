import { url } from '..';
import { AppConfig } from '../AppConfig';
import { getTaskFromString } from './TaskString';

export type TaskType = "manual" | "supported";
export type TaskTypeDescription = "User Driven" | "Computer Supported";

type DatasetType =
  | "cluster"
  | "outlier"
  | "linear regression"
  | "quadratic regression"
  | "category"
  | "skyline"
  | "none";

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
  ground: number[];
  reference: number[];
};

const taskList = getTaskFromString();

export function getAllTasks(config: AppConfig) {
  const { coding, pred: predMode } = config;

  const isCoding = coding === "yes";

  const urlCategory = url.get("taskCategory");

  let task: DatasetType = "none";
  let countString = url.get("count");

  let count = 1000;
  if (countString) {
    count = parseInt(countString);
    if (count === 0) count = count + 1;
  }

  if (urlCategory) {
    if (urlCategory === "lr") task = "linear regression";
    else if (urlCategory === "qr") task = "quadratic regression";
    else task = urlCategory as any;
  }

  let tl = taskList.filter(d => d.type !== "category");
  // .map(d => ({ ...d, manual: "supported" } as TaskDescription));

  if (task !== "none") {
    tl = tl.filter(d => d.type === task);
  }

  if (predMode === "supported" || predMode === "manual") {
    tl = tl.map(d => ({ ...d, manual: predMode } as TaskDescription));
  }

  let trainingTasks = tl.filter(d => d.training === "yes").slice(0, count);

  let tasks = tl
    .filter(d => d.training === "no")
    .map(d => ({ sort: Math.random(), value: d }))
    .sort((a, b) => a.sort - b.sort)
    .map(d => d.value)
    .slice(0, count);

  if (isCoding) {
    trainingTasks = trainingTasks.map(
      d => ({ ...d, training: "no" } as TaskDescription)
    );
    tasks = tasks.map(d => ({ ...d, taskType: "manual" } as TaskDescription));
    tasks = [...trainingTasks, ...tasks];
    trainingTasks = [];
  }

  return { trainingTasks, tasks };
}
