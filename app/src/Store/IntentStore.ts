import { observable, action, computed } from "mobx";
import {
  defaultState,
  IntentState,
  MultiBrushBehaviour,
  BrushType
} from "./IntentState";
import { ProvenanceGraph } from "@visdesignlab/provenance-lib-core";
import { IntentEvents, Annotation } from "./Provenance";
import { Dataset } from "../Utils/Dataset";
import { PredictionSet, InteractionHistory, Prediction } from "../contract";

export const predSet: PredictionSet = {
  dimensions: [],
  selectedIds: [],
  predictions: []
};

export default class IntentStore implements IntentState {
  // Graph properties
  @observable graph: ProvenanceGraph<
    IntentState,
    IntentEvents,
    Annotation
  > = null as any;
  @observable isAtRoot: boolean = false;
  @observable selectedPrediction: string = "";
  @observable isAtLatest: boolean = false;

  // State Properties
  @observable showCategories: boolean = defaultState.showCategories;
  @observable dataset: Dataset = defaultState.dataset;
  @observable categoryColumn: string = defaultState.categoryColumn;
  @observable multiBrushBehaviour: MultiBrushBehaviour =
    defaultState.multiBrushBehaviour;
  @observable plots = defaultState.plots;
  @observable interactionHistory: InteractionHistory = [];
  @observable brushType: BrushType = defaultState.brushType;
  @observable lockedPrediction: Prediction = defaultState.lockedPrediction;

  // Artifact Properties
  @observable predictionSet = predSet;
  @observable annotation = "";
  @observable isLoadingPredictions: boolean = false;

  // Restore state action
  @action resetStore(state?: IntentState) {
    Object.assign(this, { ...defaultState, ...state });
    this.resetPredAndAnnotation();
  }
  @action resetPrediction() {
    this.predictionSet = predSet;
  }
  @action resetAnnotation() {
    this.annotation = "";
  }
  @action resetPredAndAnnotation() {
    this.resetAnnotation();
    this.resetPrediction();
  }
  @action printStore() {
    console.log(JSON.parse(JSON.stringify(this)));
  }
  @computed get isAnythingSelected() {
    for (let i = 0; i < this.plots.length; ++i) {
      const plot = this.plots[i];
      if (plot.selectedPoints.length > 0) return true;
      if (Object.keys(plot.brushes).length > 0) return true;
    }

    return false;
  }
}
