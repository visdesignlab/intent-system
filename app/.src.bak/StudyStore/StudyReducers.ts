import { combineReducers } from "redux";
import { ExperimentStateReducer } from "./ChangeExperimentState";

const Reducer = combineReducers({
  experimentState: ExperimentStateReducer
});

export default Reducer;
