import { Extra, initProvenance, isStateNode, NodeID, Provenance, StateNode } from '@visdesignlab/provenance-lib-core';
import axios from 'axios';

import { extendRange, getAllSelections, PredictionRowType } from '../Components/Predictions/PredictionRowType';
import { MultiBrushBehavior, Prediction, PredictionRequest, PredictionSet } from '../contract';
import { ColumnMap, Dataset } from '../Utils/Dataset';
import {
  BrushSize,
  BrushType,
  defaultState,
  ExtendedBrush,
  ExtendedBrushCollection,
  IntentState,
  MultiBrushBehaviour,
  Plot,
  Plots,
} from './IntentState';
import IntentStore from './IntentStore';
import {
  addDummyInteraction,
  addDummyInteractionTrigger,
  addInvertSelectionInteraction,
  addPlotInteraction,
  addPointSelectionInteraction,
  brushInteraction,
  clearSelectionInteraction,
  removeBrushInteraction,
  removePlotInteraction,
  removePointSelectionInteraction,
} from './ProvenanceHelpers';
import { graphRTD } from './StudyStore/FirebaseHandler';

export type IntentEvents =
  | "Load Dataset"
  | "MultiBrush"
  | "Switch Category Visibility"
  | "Change Category"
  | "Add Plot"
  | "Point Selection"
  | "Point Deselection"
  | "Add Brush"
  | "Lock Prediction"
  | "Turn Prediction"
  | "Invert"
  | "Change Brush"
  | "Remove Brush"
  | "Clear All"
  | "Change Brush Type"
  | "Change Brush Size";

export type Annotation = {
  annotation: string;
  predictionSet: PredictionSet;
};

export function setupProvenance(store: IntentStore): ProvenanceControl {
  const provenance = initProvenance<IntentState, IntentEvents, Annotation>(
    defaultState,
    true
  );

  const url = new URLSearchParams(window.location.search);
  const graphPath = url.get("graphPath");

  function importProvenance() {
    graphRTD
      .ref(String(graphPath))
      .once("value")
      .then(function(dataSnapshot) {
        let dataJson: any = dataSnapshot.val();
        if (
          !dataJson ||
          !dataJson["nodes"] ||
          !dataJson["current"] ||
          !dataJson["root"]
        ) {
          return;
        }

        for (let j in dataJson.nodes) {
          if (!dataJson.nodes[j].children) {
            dataJson.nodes[j].children = [];
          }
        }

        provenance.importProvenanceGraph(JSON.stringify(dataJson));
      });
  }

  store.graph = provenance.graph();

  function current() {
    return provenance.current();
  }

  setupObservers(provenance, store);

  if (graphPath !== undefined) {
    importProvenance();
  }

  function setDataset(dataset: Dataset) {
    store.resetStore(defaultState);
    provenance.applyAction(
      `Load ${dataset.name}`,
      (state: IntentState) => {
        state.dataset = dataset;
        state.showCategories = false;
        state.categoryColumn = "";
        return state;
      },
      undefined,
      { type: "Load Dataset" }
    );
  }

  function toggleCategories(show: boolean, categories: string[] = []) {
    provenance.applyAction(
      `${show ? "Show" : "Hide"} Categories`,
      (state: IntentState) => {
        state.showCategories = show;
        if (categories.length > 0 && state.categoryColumn === "") {
          state.categoryColumn = categories[0];
        }

        addDummyInteraction(state);
        return state;
      },
      undefined,
      { type: "Switch Category Visibility" }
    );
  }

  function changeCategory(category: string) {
    provenance.applyAction(
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

  function toggleMultiBrushBehaviour(brushBehaviour: MultiBrushBehaviour) {
    provenance.applyAction(
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

  function goToNode(id: NodeID) {
    provenance.goToNode(id);
  }

  function addPlot(plot: Plot) {
    provenance.applyAction(
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

  function removePlot(plot: Plot) {
    provenance.applyAction(
      `Remove plot: ${plot.x} - ${plot.y}`,
      (state: IntentState) => {
        const plots: Plots = [];

        for (let i = 0; i < state.plots.length; ++i) {
          const plt = state.plots[i];
          if (plt.id !== plot.id) {
            plots.push(plt);
          }
        }
        state.plots = plots;

        removePlotInteraction(state, plot);

        return state;
      },
      undefined,
      { type: "Add Plot" }
    );
  }

  function addPointSelection(
    plot: Plot,
    points: number[],
    isPaintBrush: boolean = false
  ) {
    if (points.length === 0) return;
    provenance.applyAction(
      isPaintBrush ? `P. Brush: ${points.length}` : `Add Point Selection`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            const pts = state.plots[i].selectedPoints;
            state.plots[i].selectedPoints = [...pts, ...points];
            break;
          }
        }
        addPointSelectionInteraction(state, plot, points);
        return state;
      },
      undefined,
      { type: "Point Selection" }
    );
  }

  function removePointSelection(plot: Plot, points: number[]) {
    provenance.applyAction(
      `Unselect points`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            const pts = state.plots[i].selectedPoints.filter(
              (p) => !points.includes(p)
            );
            state.plots[i].selectedPoints = [...pts];
            break;
          }
        }
        removePointSelectionInteraction(state, plot, points);
        return state;
      },
      undefined,
      { type: "Point Deselection" }
    );
  }

  function addBrush(
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush
  ) {
    const pointCount = affectedBrush.points.length;
    provenance.applyAction(
      `Add R. Brush: ${pointCount} points`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            state.plots[i].brushes = { ...brushCollection };
            break;
          }
        }

        brushInteraction(state, plot, affectedBrush);
        return state;
      },
      undefined,
      { type: "Add Brush" }
    );
  }

  function changeBrush(
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush
  ) {
    const pointCount = affectedBrush.points.length;
    provenance.applyAction(
      `Change R. Brush: ${pointCount}`,
      (state: IntentState) => {
        let i = 0;
        for (i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            state.plots[i].brushes = { ...brushCollection };
            break;
          }
        }

        brushInteraction(state, plot, affectedBrush);

        return state;
      },
      undefined,
      { type: "Change Brush" }
    );
  }

  function removeBrush(
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush
  ) {
    provenance.applyAction(
      `Remove R. Brush`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            state.plots[i].brushes = { ...brushCollection };
            break;
          }
        }

        removeBrushInteraction(state, plot, affectedBrush);

        return state;
      },
      undefined,
      { type: "Remove Brush" }
    );
  }

  function clearSelections() {
    provenance.applyAction(
      `Clear all`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          state.plots[i].selectedPoints = [];
          state.plots[i].brushes = {};
        }
        clearSelectionInteraction(state);
        return state;
      },
      undefined,
      { type: "Clear All" }
    );
  }

  function annotateNode(annotate: string) {
    provenance.addExtraToNodeArtifact(current().id, {
      annotation: annotate,
      predictionSet: JSON.parse(JSON.stringify(store.predictionSet)),
    });
  }

  function selectPrediction(pred: string) {
    store.selectedPrediction = pred;
  }

  function changeBrushType(brushType: BrushType) {
    let message: string = "";
    switch (brushType) {
      case "Rectangular":
      case "Freeform":
        message = `${brushType === "Freeform" ? "Paint" : "Rectangular"} brush`;
        break;
      case "None":
      default:
        message = "Brushing disabled";
    }

    provenance.applyAction(
      message,
      (state: IntentState) => {
        state.brushType = brushType;
        if (brushType === "Freeform" && state.brushSize === "None") {
          state.brushSize = "20";
        }
        if (brushType === "Rectangular") {
          state.brushSize = "None";
        }
        addDummyInteraction(state);
        return state;
      },
      undefined,
      { type: "Change Brush Type" }
    );
  }

  function invertSelection(currentSelected: number[], all: number[]) {
    provenance.applyAction(
      `Invert selection`,
      (state: IntentState) => {
        const newSelection = all.filter((a) => !currentSelected.includes(a));
        for (let i = 0; i < state.plots.length; ++i) {
          if (i === 0) {
            state.plots[i].selectedPoints = newSelection;
          } else {
            state.plots[i].selectedPoints = [];
          }
          state.plots[i].brushes = {};
        }

        addInvertSelectionInteraction(state, newSelection);
        return state;
      },
      undefined,
      { type: "Invert" }
    );
  }

  function turnPredictionInSelection(
    pred: Prediction,
    currentSelections: number[],
    columnMap: ColumnMap
  ) {
    provenance.applyAction(
      `${(pred as any).type} ➞ Selection`,
      (state: IntentState) => {
        const { dims = [] } = pred as PredictionRowType;

        let basePlot = state.plots[0];

        if (dims.length === 2) {
          let dimNames = dims.map((d) => {
            const di = Object.entries(columnMap).filter(
              ([k, v]) => v.short === d
            );
            return di[0][0];
          });

          for (let i = 0; i < state.plots.length; ++i) {
            const p = state.plots[i];
            if (dimNames.includes(p.x) && dimNames.includes(p.y)) {
              basePlot = p;
              break;
            }
          }
        }

        let newSelection = pred.dataIds || [];

        for (let i = 0; i < state.plots.length; ++i) {
          if (state.plots[i].id === basePlot.id)
            state.plots[i].selectedPoints = newSelection;
          else state.plots[i].selectedPoints = [];
          state.plots[i].brushes = {};
        }

        clearSelectionInteraction(state);
        addPointSelectionInteraction(state, basePlot, newSelection);
        addDummyInteractionTrigger(state);

        state.turnedPrediction = pred.intent;
        return state;
      },
      undefined,
      { type: "Turn Prediction" }
    );
  }

  function lockPrediction(
    pred: Prediction | string,
    columnMap: ColumnMap,
    currentSelections: number[] = []
  ) {
    let predName = "";

    if (typeof pred === "string") {
      predName = "Insight: " + pred;
    } else {
      predName = "Insight: " + (pred as any).type;
    }

    provenance.applyAction(
      predName,
      (state: IntentState) => {
        state.lockedPrediction = pred as any;

        if (typeof pred !== "string") {
          const { dims = [] } = pred as PredictionRowType;

          let basePlot = state.plots[0];

          if (dims.length === 2) {
            let dimNames = dims.map((d) => {
              const di = Object.entries(columnMap).filter(
                ([k, v]) => v.short === d
              );
              return di[0][0];
            });

            for (let i = 0; i < state.plots.length; ++i) {
              const p = state.plots[i];
              if (dimNames.includes(p.x) && dimNames.includes(p.y)) {
                basePlot = p;
                break;
              }
            }
          }

          let newSelection = pred.dataIds || [];

          for (let i = 0; i < state.plots.length; ++i) {
            if (state.plots[i].id === basePlot.id)
              state.plots[i].selectedPoints = newSelection;
            else state.plots[i].selectedPoints = [];
            state.plots[i].brushes = {};
          }

          clearSelectionInteraction(state);
          addPointSelectionInteraction(state, basePlot, newSelection);
          addDummyInteractionTrigger(state);

          state.turnedPrediction = pred.intent;
        }

        return state;
      },
      undefined,
      { type: "Lock Prediction" }
    );
  }

  function changeBrushSize(size: BrushSize) {
    let message = `Brush size: ${size}`;

    if (store.brushType === "Rectangular") {
      message = "Paint brush";
    }

    provenance.applyAction(
      message,
      (state: IntentState) => {
        state.brushType = "Freeform";
        state.brushSize = size;
        addDummyInteraction(state);
        return state;
      },
      undefined,
      { type: "Change Brush Size" }
    );
  }

  function goBack() {
    provenance.goBackOneStep();
  }

  function goForward() {
    provenance.goForwardOneStep();
  }

  return {
    provenance,
    actions: {
      setDataset,
      toggleCategories,
      changeCategory,
      toggleMultiBrushBehaviour,
      goToNode,
      turnPredictionInSelection,
      addPlot,
      addPointSelection,
      removePointSelection,
      addBrush,
      changeBrush,
      removeBrush,
      clearSelections,
      removePlot,
      annotateNode,
      selectPrediction,
      changeBrushType,
      changeBrushSize,
      lockPrediction,
      invertSelection,
      goBack,
      goForward,
    },
  };
}

export interface ProvenanceControl {
  provenance: Provenance<IntentState, IntentEvents, Annotation>;
  actions: ProvenanceActions;
}

export interface ProvenanceActions {
  setDataset: (dataset: Dataset) => void;
  toggleCategories: (show: boolean, categories?: string[]) => void;
  changeCategory: (category: string) => void;
  toggleMultiBrushBehaviour: (brushBehaviour: MultiBrushBehaviour) => void;
  goToNode: (id: NodeID) => void;
  addPlot: (plot: Plot) => void;
  removePlot: (plot: Plot) => void;
  addPointSelection: (
    plot: Plot,
    points: number[],
    isPaintBrush?: boolean
  ) => void;
  removePointSelection: (plot: Plot, points: number[]) => void;
  addBrush: (
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush
  ) => void;
  changeBrush: (
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush
  ) => void;
  removeBrush: (
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush
  ) => void;
  clearSelections: () => void;
  annotateNode: (annotation: string) => void;
  selectPrediction: (pred: string) => void;
  changeBrushType: (brushType: BrushType) => void;
  changeBrushSize: (size: BrushSize) => void;
  goBack: () => void;
  goForward: () => void;
  invertSelection: (currentSelected: number[], all: number[]) => void;
  lockPrediction: (
    pred: Prediction | string,
    colMap: ColumnMap,
    currentSelection?: number[]
  ) => void;
  turnPredictionInSelection: (
    pred: Prediction,
    currentSelection: number[],
    colMap: ColumnMap
  ) => void;
}

function getExtra(
  provenance: Provenance<IntentState, IntentEvents, Annotation>,
  node: StateNode<IntentState, IntentEvents, Annotation>
): Extra<Annotation>[] {
  return provenance.getExtraFromArtifact(node.id);
}

function setupObservers(
  provenance: Provenance<IntentState, IntentEvents, Annotation>,
  store: IntentStore
) {
  provenance.addGlobalObserver(() => {
    store.isAtRoot = provenance.current().label.includes("Load Dataset");
    store.isAtLatest = provenance.current().children.length === 0;
    store.graph = provenance.graph();
  });

  provenance.addArtifactObserver((extra: Extra<Annotation>[]) => {
    if (extra.length > 0) {
      const latest = extra[extra.length - 1];
      const pSet = latest.e.predictionSet;
      if (pSet) {
        const selections = getAllSelections(
          store.plots,
          store.multiBrushBehaviour === "Union"
        );
        pSet.predictions = pSet.predictions.map((d) =>
          extendRange(d, selections.values)
        );
      }
      store.predictionSet = pSet;
      store.annotation = latest.e.annotation;
      store.graph = provenance.graph();
    } else {
      store.resetPredAndAnnotation();
    }
  });

  provenance.addObserver(["interactionHistory"], (state?: IntentState) => {
    if (state) {
      const current = provenance.current();

      const multiBrushBehavior =
        state.multiBrushBehaviour === "Union"
          ? MultiBrushBehavior.UNION
          : MultiBrushBehavior.INTERSECTION;

      if (state.interactionHistory === undefined) {
        state.interactionHistory = [];
      }

      const lastInteractionIsNull =
        state.interactionHistory[state.interactionHistory.length - 1] === null;

      const interactionHistory = state.interactionHistory
        .filter((d) => d)
        .filter((d: any) => typeof d !== "string");

      const request: PredictionRequest = {
        multiBrushBehavior,
        interactionHistory,
      };

      if (isStateNode(current)) {
        if (!lastInteractionIsNull) {
          const extraList = getExtra(provenance, current);

          if (extraList.length === 0 && !store.isLoadingPredictions) {
            store.isLoadingPredictions = true;
            axios
              .post(`/dataset/${store.dataset.key}/predict`, request)
              .then((response) => {
                if (isStateNode(current)) {
                  let predictionSet: PredictionSet = response.data;

                  const annotate: Annotation = {
                    annotation: "",
                    predictionSet: predictionSet,
                  };

                  provenance.addExtraToNodeArtifact(current.id, annotate);
                }
              })
              .catch((err) => console.error(err))
              .finally(() => {
                store.isLoadingPredictions = false;
              });
          }
        } else {
          const currentNode = provenance.current();
          const extraList = getExtra(provenance, current);
          if (isStateNode(currentNode) && extraList.length === 0) {
            const parentNode = provenance.graph().nodes[currentNode.parent];
            if (isStateNode(parentNode)) {
              const extraList = provenance.getExtraFromArtifact(parentNode.id);
              if (extraList.length === 0) return;
              const extra = extraList[extraList.length - 1].e;
              provenance.addExtraToNodeArtifact(currentNode.id, {
                annotation: "",
                predictionSet: extra.predictionSet,
              });
            }
          }
        }
      }
    }
  });

  const arrs = [
    "dataset",
    "multiBrushBehaviour",
    "showCategories",
    "categoryColumn",
    "plots",
    "brushType",
    "brushSize",
  ];

  arrs.forEach((key) => {
    provenance.addObserver([key], (state?: IntentState) => {
      observerFunction(state, store, key);
    });
  });
}

function observerFunction(state: any, store: any, key: string) {
  if (state && state[key] !== store[key]) {
    store[key] = state[key];
  }
}

export function getPathTo(nodes: any, from: string, to: string): string[] {
  const path: string[] = [];

  search(nodes, from, to, path);

  return [from, ...path.reverse()];
}

function search(nodes: any, node: string, final: string, path: string[]) {
  if (!nodes[node]) return false;

  if (node === final) {
    path.push(node);
    return true;
  }

  const children = nodes[node].children || [];

  for (let child of children) {
    if (search(nodes, child.id!, final, path)) {
      path.push(child.id!);
      return true;
    }
  }

  return false;
}
