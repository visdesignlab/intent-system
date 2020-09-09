import { ProvenanceGraph } from "@visdesignlab/provenance-lib-core";
import { action, computed, observable } from "mobx";

import { InteractionHistory, Prediction, PredictionSet } from "../contract";
import { Dataset } from "../Utils/Dataset";
import {
  BrushSize,
  BrushType,
  defaultState,
  IntentState,
  MultiBrushBehaviour,
} from "./IntentState";
import { Annotation, IntentEvents } from "./Provenance";

export const predSet: PredictionSet = {
  dimensions: [],
  selectedIds: [],
  predictions: [],
};

export type SortableColumns = "similarity" | "probability" | "rankAc";
export type SortDirection = "ascending" | "descending" | "undefined";

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
  @observable brushSize: BrushSize = defaultState.brushSize;
  @observable lockedPrediction: Prediction = defaultState.lockedPrediction;
  @observable turnedPrediction: string | null = defaultState.turnedPrediction;
  @observable sortColumn: SortableColumns = "similarity";
  @observable sortDirection: SortDirection = "descending";

  // Artifact Properties
  @observable predictionSet = predSet;
  @observable annotation = "";
  @observable isLoadingPredictions: boolean = false;

  // Restore state action
  @action resetStore(state?: IntentState) {
    Object.assign(this, { ...defaultState, ...state });
    this.sortDirection = "descending";
    this.sortColumn = "similarity";
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

  @action setSortColumn(col: SortableColumns) {
    this.sortColumn = col;
  }
  @action setSortDirection(dir: SortDirection) {
    this.sortDirection = dir;
  }

  @computed get isAnythingSelected() {
    if (this.plots === undefined) {
      return false;
    }

    for (let i = 0; i < this.plots.length; ++i) {
      const plot = this.plots[i];
      if (!plot.selectedPoints) plot.selectedPoints = [];
      if (!plot.brushes) plot.brushes = {};

      if (plot.selectedPoints.length > 0) return true;
      if (Object.keys(plot.brushes).length > 0) return true;
    }

    return false;
  }
}
