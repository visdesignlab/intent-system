import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';

import { AppConfig } from '../../AppConfig';
import { IntentState } from '../IntentState';
import { Annotation, IntentEvents } from '../Provenance';
import { Questions } from './../../Components/Study/FinalFeedback/FeedbackQuestions';
import { TaskDescription } from './../../Study/TaskList';

export type StudyState = typeof defaultStudyState;

export type Phase =
  | "Consent"
  | "Video"
  | "Training - Manual"
  | "Training - CS"
  | "Tasks - Manual"
  | "Tasks - CS"
  | "Final Feedback"
  | "Complete";

export type TaskEvents =
  | "StudyStart"
  | "StudyComplete"
  | "StartTask"
  | "EndTask"
  | "FocusOut"
  | "FocusIn"
  | "InstructionsAccepted"
  | "FeedbackStarted";

export const defaultStudyState = {
  participantId: "",
  sessionId: "",
  studyId: "",
  event: "StudyStart" as TaskEvents,
  taskId: "-1",
  task: {} as TaskDescription,
  eventTime: Date.now().toString(),
  selections: [] as number[],
  hintTasks: [] as string[],
  graph: "None",
  confidenceScore: -1,
  difficultyScore: -1,
  feedback: "",
  phase: "Training Tasks" as Phase,
  finalFeedbackArr: new Array(Questions.length).fill(-1) as number[],
  finalFeedbackComment: ""
};

export function stringifyGraph(
  graph: ProvenanceGraph<IntentState, IntentEvents, Annotation>
): string {
  if (graph) return JSON.stringify(graph);
  return "None";
}

export function getDefaultStudyState(config: AppConfig): StudyState {
  const { participantId, studyId, sessionId, coding } = config;
  let phase: Phase = "Consent";
  if (config.debugMode) phase = "Training - Manual";
  if (coding === "yes") {
    phase = "Tasks - Manual";
  }
  return { ...defaultStudyState, participantId, studyId, sessionId, phase };
}

export const temp: StudyState = null as any;
