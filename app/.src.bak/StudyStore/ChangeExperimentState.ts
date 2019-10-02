import { Action, Reducer } from "redux";
import { ExperimentStates } from "./ExperimentStates.enum";

export enum ChangeExperimentActions {
  ADVANCE = "Advance"
}

export interface AdvanceExperimentAction
  extends Action<ChangeExperimentActions> {
  type: ChangeExperimentActions;
}

export const ExperimentStateReducer: Reducer<ExperimentStates> = (
  current: ExperimentStates = ExperimentStates.START,
  action: AdvanceExperimentAction
) => {
  switch (action.type) {
    case ChangeExperimentActions.ADVANCE:
      switch (current) {
        case ExperimentStates.START:
          return ExperimentStates.STOP;
        case ExperimentStates.STOP:
          return ExperimentStates.NEXT;
        case ExperimentStates.NEXT:
          return ExperimentStates.START;
        default:
          return ExperimentStates.START;
      }
    default:
      return current;
  }
};
