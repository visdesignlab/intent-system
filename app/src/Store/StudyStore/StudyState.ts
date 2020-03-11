import { ProvenanceGraph } from "@visdesignlab/provenance-lib-core";
import { IntentState } from "../IntentState";
import { IntentEvents, Annotation } from "../Provenance";
import { AppConfig } from "../../AppConfig";

export type StudyState = typeof defaultStudyState;

export type TaskEvents =
  | "StudyStart"
  | "StudyComplete"
  | "StartTask"
  | "EndTask"
  | "FocusOut"
  | "FocusIn";

const defaultStudyState = {
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
  feedback: ""
};

export function stringifyGraph(
  graph: ProvenanceGraph<IntentState, IntentEvents, Annotation>
): string {
  if (graph) return JSON.stringify(graph);
  return "None";
}

export function getDefaultStudyState(config: AppConfig): StudyState {
  const { participantId, studyId, sessionId } = config;
  return { ...defaultStudyState, participantId, studyId, sessionId };
}

export const temp: StudyState = null as any;
