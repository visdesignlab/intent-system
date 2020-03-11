import {
  Provenance,
  initProvenance,
  ProvenanceGraph
} from "@visdesignlab/provenance-lib-core";
import { StudyState, getDefaultStudyState, stringifyGraph } from "./StudyState";
import { Annotation, IntentEvents } from "../Provenance";
import { IntentState } from "../IntentState";
import { AppConfig } from "../../AppConfig";
import { initializeFirebase } from "./Firebase";

export function setupStudy(config: AppConfig): StudyProvenanceControl {
  const studyProvenance = initProvenance<StudyState, any, any>(
    getDefaultStudyState(config)
  );

  const { firestore } = initializeFirebase();

  studyProvenance.addGlobalObserver((state?: StudyState) => {
    if (state) {
      const { participantId, sessionId, studyId } = state;
      firestore
        .collection(`${participantId}_${studyId}`)
        .doc(sessionId)
        .set(studyProvenance.graph());
    }
  });

  document.addEventListener("visibilitychange", function() {
    if (document.visibilityState === "hidden") {
      studyProvenance.applyAction("Out of focus", (state: StudyState) => {
        state.event = "FocusOut";
        state.eventTime = Date.now().toString();
        return state;
      });
    } else if (document.visibilityState === "visible") {
      studyProvenance.applyAction("In Focus", (state: StudyState) => {
        state.event = "FocusIn";
        state.eventTime = Date.now().toString();
        return state;
      });
    }
  });

  (window as any).printStudy = function() {
    const node = Object.values(studyProvenance.graph().nodes);
    console.table(node);
  };

  function startTask(taskId: string) {
    studyProvenance.applyAction(
      `Start task: ${taskId}`,
      (state: StudyState) => {
        state.taskId = taskId;
        state.event = "StartTask";
        state.eventTime = Date.now().toString();
        return state;
      }
    );
  }

  function endTask(
    taskId: string,
    points: number[],
    graph: ProvenanceGraph<IntentState, IntentEvents, Annotation>,
    confidenceScore: number,
    difficultyScore: number,
    feedback: string
  ) {
    studyProvenance.applyAction(
      `Complete task: ${taskId}`,
      (state: StudyState) => {
        if (state.taskId !== taskId) throw new Error("Something went wrong.");
        state.event = "EndTask";
        state.selections = points;
        state.eventTime = Date.now().toString();
        state.graph = stringifyGraph(graph);
        state.confidenceScore = confidenceScore;
        state.difficultyScore = difficultyScore;
        state.feedback = feedback;
        return state;
      }
    );
  }

  function completeStudy() {
    studyProvenance.applyAction("Study Completed", (state: StudyState) => {
      state.event = "StudyComplete";
      state.eventTime = Date.now().toString();
      return state;
    });
  }

  return {
    studyProvenance,
    studyActions: { startTask, endTask, completeStudy }
  };
}

export interface StudyProvenanceControl {
  studyProvenance: Provenance<StudyState, any, any>;
  studyActions: StudyActions;
}

export interface StudyActions {
  startTask: (taskId: string) => void;
  endTask: (
    taskId: string,
    points: number[],
    graph: ProvenanceGraph<IntentState, IntentEvents, Annotation>,
    confidenceScore: number,
    difficultyScore: number,
    feedback: string
  ) => void;
  completeStudy: () => void;
}