import { Dataset } from "../Utils/Dataset";
import {
  MultiBrushBehaviour,
  Plots,
  Plot,
  BrushType,
  BrushSize,
} from "./IntentState";
import { InteractionHistory, Prediction } from "../contract";
import { observable, action, computed, reaction } from "mobx";
import {
  Provenance,
  initProvenance,
  NodeID,
} from "@visdesignlab/provenance-lib-core";
import { Annotation, IntentEvents } from "./Provenance";
import {
  addDummyInteraction,
  addPlotInteraction,
  removePlotInteraction,
} from "./ProvenanceHelpers";

export interface IntentState {
  dataset: Dataset;
  showCategories: boolean;
  categoryColumn: string;
  multiBrushBehaviour: MultiBrushBehaviour;
  plots: Plots;
  interactionHistory: InteractionHistory;
  brushType: BrushType;
  brushSize: BrushSize;
  lockedPrediction: Prediction;
  turnedPrediction: string | null;
}

class IntentStore {
  @observable provenance: Provenance<IntentState, IntentEvents, Annotation>;
  baseConfig: IntentState;
  @observable dataset: Dataset = { key: "", name: "" };
  @observable showCategories: boolean = false;
  @observable categoryColumn: string = "";
  @observable multiBrushBehaviour: MultiBrushBehaviour = "Union";
  @observable plots: Plots = [];
  @observable interactionHistory: InteractionHistory = [];
  @observable brushType: BrushType = "Freeform";
  @observable brushSize: BrushSize = "50";
  @observable lockedPrediction: Prediction = null as any;
  @observable turnedPrediction: string | null = null;

  constructor(config: IntentState) {
    // Append partial state
    this.baseConfig = config;
    this.updateValues(config);

    reaction(
      () => this.provenance,
      () => this.setupObservers()
    );

    this.provenance = initProvenance(config, true);
    (window as any).pprov = this.provenance;
  }

  updateValues(config: IntentState) {
    Object.entries(config).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
  }

  @computed get graph() {
    return this.provenance.graph();
  }

  @computed get isAtRoot() {
    return this.provenance.current().label.includes("Load Dataset");
  }

  @computed get isAtLatest() {
    return this.provenance.current().children.length === 0;
  }

  @action setupObservers() {
    this.provenance.addGlobalObserver(() => {
      const { state } = this.provenance.current();
      Object.entries(state).forEach(([key, value]) => {
        (this as any)[key] = value;
      });
    });
  }

  @action setupProvenance(config: IntentState) {
    this.provenance = initProvenance(config, true);
    (window as any).pprov = this.provenance;
  }

  @action reset(config: Partial<IntentState> = {}) {
    const con = { ...this.baseConfig, ...config };
    Object.entries(con).forEach(([key, value]) => {
      (this as any)[key] = value;
    });
    this.provenance = initProvenance(con, true);
  }

  @computed get currentNode() {
    return this.provenance.current();
  }

  @action setDataset(dataset: Dataset, first: boolean = false) {
    this.reset();
    this.dataset = dataset;
    if (!first) {
      this.showCategories = false;
      this.categoryColumn = "";
    }
    this.provenance.applyAction(
      `Load ${dataset.name}`,
      (state: IntentState) => {
        state.dataset = dataset;
        if (!first) {
          state.showCategories = false;
          state.categoryColumn = "";
        }
        return state;
      },
      undefined,
      { type: "Load Dataset" }
    );
  }

  @action toggleCategories(show: boolean, categories: string[] = []) {
    this.showCategories = show;
    if (categories.length > 0 && this.categoryColumn === "") {
      this.categoryColumn = categories[0];
    }

    this.provenance.applyAction(
      `${show ? "Show" : "Hide"} Categories`,
      (state: IntentState) => {
        state.showCategories = this.showCategories;
        state.categoryColumn = this.categoryColumn;
        addDummyInteraction(state);
        return state;
      },
      undefined,
      { type: "Switch Category Visibility" }
    );
  }

  @action changeCategory(category: string) {
    this.categoryColumn = category;
    this.provenance.applyAction(
      `Category: ${category}`,
      (state: IntentState) => {
        state.categoryColumn = category;
        addDummyInteraction(state);
        return state;
      },
      undefined,
      { type: "Change Category" }
    );
  }

  @action toggleMultiBrushBehaviour(brushBehaviour: MultiBrushBehaviour) {
    this.multiBrushBehaviour = brushBehaviour;
    this.provenance.applyAction(
      `${brushBehaviour} selections`,
      (state: IntentState) => {
        state.multiBrushBehaviour = brushBehaviour;
        addDummyInteraction(state);
        return state;
      },
      undefined,
      { type: "MultiBrush" }
    );
  }

  @action goToNode(id: NodeID) {
    this.provenance.goToNode(id);
  }

  @action addPlot(plot: Plot) {
    this.plots.push(plot);
    this.provenance.applyAction(
      `Add plot: ${plot.x} - ${plot.y}`,
      (state: IntentState) => {
        state.plots.push(plot);

        addPlotInteraction(state, plot);
        return state;
      },
      undefined,
      { type: "Add Plot" }
    );
  }

  @action removePlot(plot: Plot) {
    const plots: Plots = [];

    for (let i = 0; i < this.plots.length; ++i) {
      const plt = this.plots[i];
      if (plt.id !== plot.id) {
        plots.push(plt);
      }
    }

    this.plots = plots;

    this.provenance.applyAction(
      `Remove plot: ${plot.x} - ${plot.y}`,
      (state: IntentState) => {
        state.plots = plots;
        removePlotInteraction(state, plot);
        return state;
      },
      undefined,
      { type: "Add Plot" }
    );
  }

  // End
}

export default IntentStore;
