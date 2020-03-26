import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';
import { createContext } from 'react';

import { AppConfig } from './AppConfig';
import { ProvenanceActions } from './Store/Provenance';
import { StudyActions } from './Store/StudyStore/StudyProvenance';
import { TaskDescription } from './Study/TaskList';
import { EndTaskFunction } from './StudyMode';
import { Data } from './Utils/Dataset';

export type StudyCommands = {
  endTask: EndTaskFunction;
  currentTaskNumber: number;
  totalTasks: number;
  actions: StudyActions;
};

export type TaskConfig = {
  task: TaskDescription;
  isManual: boolean;
  isTraining: boolean;
  hasCenter: boolean;
  hasCategory: boolean;
  isCoding: boolean;
};

const DataContext = createContext<Data>(null as any);
const ActionContext = createContext<ProvenanceActions>(null as any);
const TaskConfigContext = createContext<TaskConfig>(null as any);
const StudyActionContext = createContext<StudyCommands>(null as any);
const ProvenanceContext = createContext<() => ProvenanceGraph<any, any, any>>(
  null as any
);
const ConfigContext = createContext<AppConfig>(null as any);

export {
  DataContext,
  ActionContext,
  TaskConfigContext,
  StudyActionContext,
  ProvenanceContext,
  ConfigContext
};
