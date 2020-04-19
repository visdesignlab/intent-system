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

export type TaskConfiguration = {
  trainingManual: TaskDescription[];
  trainingCS: TaskDescription[];
  taskManual: TaskDescription[];
  taskCS: TaskDescription[];
};

export function getAllTasks(config: AppConfig): TaskConfiguration {
  const { coding, pred: predMode, task, count } = config;

  const isCoding = coding === "yes";

  // Filter out all category tasks
  let tl = taskList.filter((d) => d.type !== "category");
  tl = tl.filter((d) => {
    if (
      ["out_easy_task_5", "out_med_task_5", "out_hard_task_5"].includes(
        d.dataset
      )
    )
      return false;
    return true;
  });
  // Filter out training medium
  tl = tl.filter((d) => !(d.training === "yes" && d.difficulty === "medium"));

  if (task !== "none") {
    tl = tl.filter((d) => d.type === task);
  }

  let trainingTasks = tl.filter((d) => d.training === "yes");
  let tasks = tl.filter((d) => d.training === "no");

  // if (config.taskId) {
  //   tasks = tasks.filter(d => d.id === config.taskId);
  // }

  tasks = assignSupportedOrNot(tasks);

  if (predMode === "supported" || predMode === "manual") {
    trainingTasks = trainingTasks.map(
      (d) => ({ ...d, manual: predMode } as TaskDescription)
    );
    tasks = tasks.map((d) => ({ ...d, manual: predMode } as TaskDescription));
  }

  if (config.debugMode) {
    console.log({
      "Manual tasks": tasks.filter((d) => d.manual === "manual").length,
      "Supported tasks":
        tasks.length - tasks.filter((d) => d.manual === "manual").length,
    });
    console.table(trainingTasks.sort(), ["id", "type", "difficulty", "manual"]);
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

  const trainingCS = trainingTasks
    .filter((d) => d.manual === "supported")
    .slice(0, count);
  const trainingManual = trainingTasks
    .filter((d) => d.manual !== "supported")
    .slice(0, count);
  const taskCS = tasks.filter((d) => d.manual === "supported").slice(0, count);
  const taskManual = tasks
    .filter((d) => d.manual !== "supported")
    .slice(0, count);

  return {
    trainingCS,
    trainingManual,
    taskCS,
    taskManual,
  };
}

function assignSupportedOrNot(ogTasks: TaskDescription[]): TaskDescription[] {
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
    .map((d) => d.value);
}
