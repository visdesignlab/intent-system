export type TaskType = "with_predictions" | "without_predictions";

export type PlotDef = {
  x: string;
  y: string;
};

type CategoryEncoding = {
  show: boolean;
  column: string;
};

export type TaskDescription = {
  id: string;
  task: string;
  dataset: string;
  plots: PlotDef[];
  category: CategoryEncoding;
  enablePlotAddition: boolean;
  predictionSupport: boolean;
};

const taskList: TaskDescription[] = [
  {
    id: "0",
    task: "Select a ll points",
    dataset: "cluster",
    plots: [{ x: "Math", y: "CS" }],
    category: {
      show: false,
      column: "Profession"
    },
    enablePlotAddition: true,
    predictionSupport: false
  },
  {
    id: "1",
    task: "Select all outliers",
    dataset: "cluster",
    plots: [{ x: "Physics", y: "CS" }],
    category: {
      show: false,
      column: "Profession"
    },
    enablePlotAddition: false,
    predictionSupport: true
  }
];

export function getAllTasks(): TaskDescription[] {
  return taskList
    .map(d => ({ sort: Math.random(), value: d }))
    .sort((a, b) => a.sort - b.sort)
    .map(d => d.value);
}
