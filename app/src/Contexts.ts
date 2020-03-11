import { createContext } from "react";
import { ProvenanceActions } from "./Store/Provenance";
import { Data } from "./Utils/Dataset";
import { TaskDescription } from "./Study/TaskList";
import { ProvenanceGraph } from "@visdesignlab/provenance-lib-core";

export type StudyCommands = {
  endTask: (
    points: number[],
    graph: ProvenanceGraph<any, any, any>,
    confidenceScore: number,
    difficultyScore: number,
    feedback: string
  ) => void;
  currentTaskNumber: number;
  totalTasks: number;
};

const DataContext = createContext<Data>(null as any);
const ActionContext = createContext<ProvenanceActions>(null as any);
const TaskConfigContext = createContext<TaskDescription>(null as any);
const StudyActionContext = createContext<StudyCommands>(null as any);
const ProvenanceContext = createContext<() => ProvenanceGraph<any, any, any>>(
  null as any
);

export {
  DataContext,
  ActionContext,
  TaskConfigContext,
  StudyActionContext,
  ProvenanceContext
};
