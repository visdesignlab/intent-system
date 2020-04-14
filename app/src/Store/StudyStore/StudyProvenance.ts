import { initProvenance, Provenance, ProvenanceGraph } from '@visdesignlab/provenance-lib-core';

import { AppConfig } from '../../AppConfig';
import { IntentState } from '../IntentState';
import { Annotation, IntentEvents } from '../Provenance';
import { TaskDescription } from './../../Study/TaskList';
import logToFirebase from './FirebaseHandler';
import { getDefaultStudyState, Phase, stringifyGraph, StudyState } from './StudyState';
import StudyStore from './StudyStore';

export function setupStudy(
  config: AppConfig,
  store: StudyStore
): StudyProvenanceControl {
  const defState = getDefaultStudyState(config);
  store.phase = defState.phase;
  const studyProvenance = initProvenance<StudyState, any, any>(defState);

  studyProvenance.addGlobalObserver((state?: StudyState) => {
    if (state) {
      const { participantId, sessionId, studyId } = state;
      logToFirebase({
        participantId,
        sessionId,
        studyId,
        graph: studyProvenance.graph()
      });
    }
  });

  studyProvenance.addObserver(["phase"], (state?: StudyState) => {
    if (state) {
      store.phase = state.phase;
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
    console.log(studyProvenance.graph());
  };

  function startTask(taskId: string, task: TaskDescription) {
    studyProvenance.applyAction(
      `Start task: ${taskId}`,
      (state: StudyState) => {
        state.taskId = taskId;
        state.event = "StartTask";
        state.task = task;
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
    store.loading = true;
  }

  function completeStudy() {
    studyProvenance.applyAction("Study Completed", (state: StudyState) => {
      state.event = "StudyComplete";
      state.eventTime = Date.now().toString();
      return state;
    });
  }

  function acceptedInstructions(mode: string) {
    studyProvenance.applyAction(
      `Instructions accepted for: ${mode}`,
      (state: StudyState) => {
        state.event = "InstructionsAccepted";
        state.eventTime = Date.now().toString();
        return state;
      }
    );
  }

  function nextPhase(phase: Phase) {
    studyProvenance.applyAction(
      `Start phase: ${phase}`,
      (state: StudyState) => {
        state.phase = phase;
        return state;
      }
    );
  }

  function phase() {
    return studyProvenance.current().state.phase;
  }

  function setLoading(isLoading: boolean) {
    store.loading = isLoading;
  }

  function addHintLookedAt(taskId: string) {
    if (!store.hintUsedForTasks.includes(taskId)) {
      store.hintUsedForTasks.push(taskId);
      hintUsed(taskId);
    }
  }

  function submitFinalFeedback(feedback: number[], feedbackText: string = "") {
    studyProvenance.applyAction("Final Feedback", (state: StudyState) => {
      state.finalFeedbackArr = feedback;
      state.finalFeedbackComment = feedbackText;
      return state;
    });
  }

  function hintUsed(taskId: string) {
    studyProvenance.applyAction(`Hint used`, (state: StudyState) => {
      if (!state.hintTasks.includes(taskId)) {
        state.hintTasks.push(taskId);
      }
      return state;
    });
  }

  function feedbackStarted(taskId: string) {
    studyProvenance.applyAction(
      `Feedback started for: ${taskId}`,
      (state: StudyState) => {
        state.event = "FeedbackStarted";
        state.eventTime = Date.now().toString();
        return state;
      }
    );
  }

  return {
    studyProvenance,
    studyActions: {
      startTask,
      endTask,
      completeStudy,
      nextPhase,
      setLoading,
      addHintLookedAt,
      submitFinalFeedback,
      hintUsed,
      acceptedInstructions,
      feedbackStarted
    },
    phase
  };
}

export interface StudyProvenanceControl {
  studyProvenance: Provenance<StudyState, any, any>;
  studyActions: StudyActions;
  phase: () => Phase;
}

export interface StudyActions {
  startTask: (taskId: string, task: TaskDescription) => void;
  nextPhase: (phase: Phase) => void;
  endTask: (
    taskId: string,
    points: number[],
    graph: ProvenanceGraph<IntentState, IntentEvents, Annotation>,
    confidenceScore: number,
    difficultyScore: number,
    feedback: string
  ) => void;
  completeStudy: () => void;
  setLoading: (isLoading: boolean) => void;
  addHintLookedAt: (taskId: string) => void;
  submitFinalFeedback: (feedbackArr: number[], feedbackText?: string) => void;
  hintUsed: (taskId: string) => void;
  acceptedInstructions: (mode: string) => void;
  feedbackStarted: (id: string) => void;
}
