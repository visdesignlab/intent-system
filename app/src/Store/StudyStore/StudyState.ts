import { ProvenanceGraph } from '@visdesignlab/provenance-lib-core';

import { AppConfig } from '../../AppConfig';
import { IntentState } from '../IntentState';
import { Annotation, IntentEvents } from '../Provenance';

export type StudyState = typeof defaultStudyState;

export type Phase =
  | "Passive Training"
  | "Training Tasks"
  | "Tasks"
  | "Final Feedback"
  | "Complete";

export type TaskEvents =
  | "StudyStart"
  | "StudyComplete"
  | "StartTask"
  | "EndTask"
  | "FocusOut"
  | "FocusIn";

export const defaultStudyState = {
  participantId: "",
  sessionId: "",
  studyId: "",
  event: "StudyStart" as TaskEvents,
  taskId: "-1",
  eventTime: Date.now().toString(),
  selections: [] as number[],
  graph: "None",
  confidenceScore: -1,
  difficultyScore: -1,
  feedback: "",
  phase: "Training Tasks" as Phase
};

export function stringifyGraph(
  graph: ProvenanceGraph<IntentState, IntentEvents, Annotation>
): string {
  if (graph) return JSON.stringify(graph);
  return "None";
}

export function getDefaultStudyState(config: AppConfig): StudyState {
  const { participantId, studyId, sessionId, coding } = config;
  let phase: Phase = "Final Feedback";
  if (coding === "yes") {
    phase = "Tasks";
  }
  return { ...defaultStudyState, participantId, studyId, sessionId, phase };
}

export const temp: StudyState = null as any;
