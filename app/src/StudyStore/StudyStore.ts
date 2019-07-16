import { ExperimentStates } from "./ExperimentStates.enum";
import { Store, createStore } from "redux";
import Reducer from "./StudyReducers";

export interface StudyState {
  experimentState: ExperimentStates;
}

export function initStudyStore(state?: StudyState): Store<StudyState> {
  if (state) return createStore(Reducer, state);
  return createStore(Reducer);
}
