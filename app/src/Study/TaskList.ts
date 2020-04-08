import { url } from '..';
import { AppConfig } from '../AppConfig';
import { getTaskFromString } from './TaskString';

export type TaskType = "manual" | "supported";
export type TaskTypeDescription = "User Driven" | "Computer Supported";

export type DatasetType =
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

  // Filter out all category tasks
  let tl = taskList.filter((d) => d.type !== "category");

  // Filter out training medium
  tl = tl.filter((d) => !(d.training === "yes" && d.difficulty === "medium"));
  // tl = tl.filter((d) => d.training !== "yes" && d.difficulty !== "medium");

  if (task !== "none") {
    tl = tl.filter((d) => d.type === task);
  }

  if (predMode === "supported" || predMode === "manual") {
    tl = tl.map((d) => ({ ...d, manual: predMode } as TaskDescription));
  }

  let trainingTasks = tl.filter((d) => d.training === "yes").slice(0, count);

  let tasks = tl.filter((d) => d.training === "no");
  // .map((d) => ({ sort: Math.random(), value: d }))
  // .sort((a, b) => a.sort - b.sort)
  // .map((d) => d.value)
  // .slice(0, count);

  if (config.taskId) {
    tasks = tasks.filter((d) => d.id === config.taskId);
  }

  tasks = assignSupportedOrNot(tasks, count);

  if (config.debugMode) {
    console.log({
      "Manual tasks": tasks.filter((d) => d.manual === "manual").length,
      "Supported tasks":
        tasks.length - tasks.filter((d) => d.manual === "manual").length,
    });
    console.table(tasks.sort(), ["id", "type", "difficulty", "manual"]);
  }

  if (isCoding && !config.taskId) {
    trainingTasks = trainingTasks.map(
      (d) => ({ ...d, training: "no" } as TaskDescription)
    );
    tasks = tasks.map((d) => ({ ...d, taskType: "manual" } as TaskDescription));
    tasks = [...trainingTasks, ...tasks];
    trainingTasks = [];
  }

  if (config.taskId) {
    tasks = tasks.map((d) => ({ ...d, training: "no" } as TaskDescription));
  }

  return { trainingTasks, tasks };
}

function assignSupportedOrNot(
  ogTasks: TaskDescription[],
  count: number
): TaskDescription[] {
  const tasks: TaskDescription[] = [];

  const types: DatasetType[] = [
    "cluster",
    "outlier",
    "linear regression",
    "quadratic regression",
    "skyline",
  ];

  const difficulties: Difficulty[] = ["easy", "medium", "hard"];

  for (let type of types) {
    const subTasks = ogTasks.filter((d) => d.type === type);
    for (let diff of difficulties) {
      const subSubTasks = subTasks.filter((d) => d.difficulty === diff);

      for (let i = 0; i < subSubTasks.length; ++i) {
        const task = subSubTasks[i];
        if (i === 0) {
          task.manual = Math.random() >= 0.5 ? "manual" : "supported";
        } else {
          task.manual =
            subSubTasks[i - 1].manual === "manual" ? "supported" : "manual";
        }
        tasks.push(task);
      }
    }
  }

  return tasks
    .map((d) => ({ sort: Math.random(), value: d }))
    .sort((a, b) => a.sort - b.sort)
    .map((d) => d.value)
    .slice(0, count);
}
