import {
  initProvenance,
  Provenance,
  NodeID,
  Extra,
  isStateNode,
  StateNode,
} from '@visdesignlab/provenance-lib-core';
import {
  defaultState,
  IntentState,
  MultiBrushBehaviour,
  Plot,
  ExtendedBrushCollection,
  Plots,
  ExtendedBrush,
  BrushType,
} from './IntentState';
import IntentStore from './IntentStore';
import {Dataset} from '../Utils/Dataset';
import {
  PredictionSet,
  MultiBrushBehavior,
  PredictionRequest,
} from '../contract';
import axios from 'axios';
import {
  addDummyInteraction,
  addPlotInteraction,
  addPointSelectionInteraction,
  removePointSelectionInteraction,
  brushInteraction,
  removeBrushInteraction,
  removePlotInteraction,
} from './ProvenanceHelpers';

export type IntentEvents =
  | 'Load Dataset'
  | 'MultiBrush'
  | 'Switch Category Visibility'
  | 'Change Category'
  | 'Add Plot'
  | 'Point Selection'
  | 'Point Deselection'
  | 'Add Brush'
  | 'Invert'
  | 'Change Brush'
  | 'Remove Brush'
  | 'Clear All'
  | 'Change Brush Type';

export type Annotation = {
  annotation: string;
  predictionSet: PredictionSet;
};

export function setupProvenance(store: IntentStore): ProvenanceControl {
  const provenance = initProvenance<IntentState, IntentEvents, Annotation>(
    defaultState,
    true,
  );

  store.graph = provenance.graph();

  function current() {
    return provenance.current();
  }

  setupObservers(provenance, store);

  function setDataset(dataset: Dataset) {
    store.resetStore();
    provenance.applyAction(
      `Load Dataset: ${dataset.name}`,
      (state: IntentState) => {
        state.dataset = dataset;
        return state;
      },
      undefined,
      {type: 'Load Dataset'},
    );
  }

  function toggleCategories(show: boolean, categories: string[] = []) {
    provenance.applyAction(
      `${show ? 'Show' : 'Hide'} Categories`,
      (state: IntentState) => {
        state.showCategories = show;
        if (categories.length > 0 && state.categoryColumn === '') {
          state.categoryColumn = categories[0];
        }

        addDummyInteraction(state);
        return state;
      },
      undefined,
      {type: 'Switch Category Visibility'},
    );
  }

  function changeCategory(category: string) {
    provenance.applyAction(
      `Switch category encoding: ${category}`,
      (state: IntentState) => {
        state.categoryColumn = category;
        addDummyInteraction(state);
        return state;
      },
      undefined,
      {type: 'Change Category'},
    );
  }

  function toggleMultiBrushBehaviour(brushBehaviour: MultiBrushBehaviour) {
    provenance.applyAction(
      `Set brush behaviour: ${brushBehaviour}`,
      (state: IntentState) => {
        state.multiBrushBehaviour = brushBehaviour;
        addDummyInteraction(state);
        return state;
      },
      undefined,
      {type: 'MultiBrush'},
    );
  }

  function goToNode(id: NodeID) {
    provenance.goToNode(id);
  }

  function addPlot(plot: Plot) {
    provenance.applyAction(
      `Add plot for ${plot.x} - ${plot.y}`,
      (state: IntentState) => {
        state.plots.push(plot);

        addPlotInteraction(state, plot);
        return state;
      },
      undefined,
      {type: 'Add Plot'},
    );
  }

  function removePlot(plot: Plot) {
    provenance.applyAction(
      `Remove plot for ${plot.x} - ${plot.y}`,
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
      {type: 'Add Plot'},
    );
  }

  function addPointSelection(plot: Plot, points: number[]) {
    provenance.applyAction(
      `Add Point Selection`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            const pts = state.plots[i].selectedPoints;
            state.plots[i].selectedPoints = [...pts, ...points];
          }
        }
        addPointSelectionInteraction(state, plot, points);
        return state;
      },
      undefined,
      {type: 'Point Selection'},
    );
  }

  function removePointSelection(plot: Plot, points: number[]) {
    provenance.applyAction(
      `Remove Point Selection`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            const pts = state.plots[i].selectedPoints.filter(
              p => !points.includes(p),
            );
            state.plots[i].selectedPoints = [...pts];
          }
        }
        removePointSelectionInteraction(state, plot, points);
        return state;
      },
      undefined,
      {type: 'Point Deselection'},
    );
  }

  function addBrush(
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush,
  ) {
    provenance.applyAction(
      `Add brush to plot`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            state.plots[i].brushes = {...brushCollection};
            break;
          }
        }

        brushInteraction(state, plot, affectedBrush);
        return state;
      },
      undefined,
      {type: 'Add Brush'},
    );
  }

  function changeBrush(
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush,
  ) {
    provenance.applyAction(
      `Change Brush`,
      (state: IntentState) => {
        let i = 0;
        for (i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            state.plots[i].brushes = {...brushCollection};
            break;
          }
        }

        brushInteraction(state, plot, affectedBrush);

        return state;
      },
      undefined,
      {type: 'Change Brush'},
    );
  }

  function removeBrush(
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush,
  ) {
    provenance.applyAction(
      `Remove Brush`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            state.plots[i].brushes = {...brushCollection};
            break;
          }
        }

        removeBrushInteraction(state, plot, affectedBrush);

        return state;
      },
      undefined,
      {type: 'Remove Brush'},
    );
  }

  function clearSelections() {
    provenance.applyAction(
      `Clear all selections`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          state.plots[i].selectedPoints = [];
          state.plots[i].brushes = {};
        }
        return state;
      },
      undefined,
      {type: 'Clear All'},
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
    provenance.applyAction(
      `Change brush to ${brushType}`,
      (state: IntentState) => {
        state.brushType = brushType;
        addDummyInteraction(state);
        return state;
      },
      undefined,
      {type: 'Change Brush Type'},
    );
  }

  function invertSelection(currentSelected: number[], all: number[]) {
    provenance.applyAction(
      `Invert current selection`,
      (state: IntentState) => {
        const basePlot = state.plots[0];

        const newSelection = all.filter(a => !currentSelected.includes(a));
        for (let i = 0; i < state.plots.length; ++i) {
          state.plots[i].selectedPoints = newSelection;
          state.plots[i].brushes = {};
        }

        removePointSelectionInteraction(state, basePlot, currentSelected);
        addPointSelectionInteraction(state, basePlot, newSelection);
        return state;
      },
      undefined,
      {type: 'Invert'},
    );
  }

  return {
    provenance,
    actions: {
      setDataset,
      toggleCategories,
      changeCategory,
      toggleMultiBrushBehaviour,
      goToNode,
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
      invertSelection,
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
  addPointSelection: (plot: Plot, points: number[]) => void;
  removePointSelection: (plot: Plot, points: number[]) => void;
  addBrush: (
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush,
  ) => void;
  changeBrush: (
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush,
  ) => void;
  removeBrush: (
    plot: Plot,
    brushCollection: ExtendedBrushCollection,
    affectedBrush: ExtendedBrush,
  ) => void;
  clearSelections: () => void;
  annotateNode: (annotation: string) => void;
  selectPrediction: (pred: string) => void;
  changeBrushType: (brushType: BrushType) => void;
  invertSelection: (currentSelected: number[], all: number[]) => void;
}

function getExtra(
  provenance: Provenance<IntentState, IntentEvents, Annotation>,
  node: StateNode<IntentState, IntentEvents, Annotation>,
): Extra<Annotation>[] {
  return provenance.getExtraFromArtifact(node.id);
}

function setupObservers(
  provenance: Provenance<IntentState, IntentEvents, Annotation>,
  store: IntentStore,
) {
  provenance.addGlobalObserver(() => {
    store.isAtRoot = provenance.current().id === provenance.root().id;
    store.isAtLatest = provenance.current().children.length === 0;
    store.graph = provenance.graph();
  });

  provenance.addArtifactObserver((extra: Extra<Annotation>[]) => {
    if (extra.length > 0) {
      const latest = extra[extra.length - 1];
      store.predictionSet = latest.e.predictionSet;
      store.annotation = latest.e.annotation;
    } else {
      store.resetPredAndAnnotation();
    }
  });

  provenance.addObserver(['interactionHistory'], (state?: IntentState) => {
    if (state) {
      const current = provenance.current();

      const multiBrushBehavior =
        state.multiBrushBehaviour === 'Union'
          ? MultiBrushBehavior.UNION
          : MultiBrushBehavior.INTERSECTION;

      const lastInteractionIsNull =
        state.interactionHistory[state.interactionHistory.length - 1] === null;

      const interactionHistory = state.interactionHistory.filter(d => d);

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
              .then(response => {
                if (isStateNode(current)) {
                  const predictionSet: PredictionSet = response.data;

                  const annotate: Annotation = {
                    annotation: '',
                    predictionSet: predictionSet,
                  };

                  provenance.addExtraToNodeArtifact(current.id, annotate);
                }
              })
              .catch(err => console.error(err))
              .finally(() => {
                store.isLoadingPredictions = false;
              });
          }
        } else {
          const currentNode = provenance.current();
          if (isStateNode(currentNode)) {
            const parentNode = provenance.graph().nodes[currentNode.parent];
            if (isStateNode(parentNode)) {
              const extraList = provenance.getExtraFromArtifact(parentNode.id);
              if (extraList.length === 0) return;
              const extra = extraList[extraList.length - 1].e;
              provenance.addExtraToNodeArtifact(currentNode.id, extra);
            }
          }
        }
      }
    }
  });

  const arrs = [
    'dataset',
    'multiBrushBehaviour',
    'showCategories',
    'categoryColumn',
    'plots',
    'brushType',
  ];

  arrs.forEach(key => {
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
