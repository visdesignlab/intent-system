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
} from './IntentState';
import IntentStore from './IntentStore';
import {Dataset} from '../Utils/Dataset';
import {
  PredictionSet,
  MultiBrushBehavior,
  VisualizationType,
  PredictionRequest,
} from '../contract';
import axios from 'axios';

export type IntentEvents =
  | 'Load Dataset'
  | 'MultiBrush'
  | 'Switch Category Visibility'
  | 'Change Category'
  | 'Add Plot'
  | 'Point Selection'
  | 'Point Deselection'
  | 'Add Brush'
  | 'Change Brush'
  | 'Remove Brush'
  | 'Clear All';

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

        state.interactionHistory.push({
          visualizationType: VisualizationType.Scatterplot,
          interactionType: {
            kind: 'ADD',
            plot: {
              id: plot.id,
              x: plot.x,
              y: plot.y,
              color: state.categoryColumn,
            },
          },
        });
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
            break;
          }
        }
        state.interactionHistory.push({
          visualizationType: VisualizationType.Scatterplot,
          interactionType: {
            kind: 'selection',
            plot: {
              id: plot.id,
              x: plot.x,
              y: plot.y,
              color: state.categoryColumn,
            },
            dimensions: [plot.x, plot.y],
            dataIds: points,
          },
        });
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
            state.interactionHistory.push({
              visualizationType: VisualizationType.Scatterplot,
              interactionType: {
                kind: 'deselection',
                plot: {
                  id: plot.id,
                  x: plot.x,
                  y: plot.y,
                  color: state.categoryColumn,
                },
                dimensions: [plot.x, plot.y],
                dataIds: points,
              },
            });
            break;
          }
        }
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

        state.interactionHistory.push({
          visualizationType: VisualizationType.Scatterplot,
          interactionType: {
            brushId: affectedBrush.id,
            left: affectedBrush.extents.x1,
            right: affectedBrush.extents.x2,
            top: affectedBrush.extents.y1,
            bottom: affectedBrush.extents.y2,
            dimensions: [plot.x, plot.y],
            dataIds: affectedBrush.points,
            plot: {
              id: plot.id,
              x: plot.x,
              y: plot.y,
              color: state.categoryColumn,
            },
          },
        });

        return state;
      },
      undefined,
      {type: 'Add Brush'},
    );
  }

  // function getPredictions() {

  //   axios
  //     .post(`/dataset/${store.dataset.key}/predict`, {
  //       multiBrushBehavior: MultiBrushBehavior.INTERSECTION,
  //       interactionHistory,
  //     })
  //     .then(response => {
  //       console.log(response.data);
  //     })
  //     .catch(err => console.error(err));
  // }

  function changeBrush(plot: Plot, brushCollection: ExtendedBrushCollection) {
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
        return state;
      },
      undefined,
      {type: 'Change Brush'},
    );
  }

  function removeBrush(plot: Plot, brushCollection: ExtendedBrushCollection) {
    provenance.applyAction(
      `Remove Brush`,
      (state: IntentState) => {
        for (let i = 0; i < state.plots.length; ++i) {
          if (plot.id === state.plots[i].id) {
            state.plots[i].brushes = {...brushCollection};
            break;
          }
        }
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

        return state;
      },
      undefined,
      {type: 'Add Plot'},
    );
  }

  function annotateNode(annotate: string) {
    provenance.addExtraToNodeArtifact(current().id, {
      annotation: annotate,
      predictionSet: JSON.parse(JSON.stringify(store.predictionSet)),
    });
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
  changeBrush: (plot: Plot, brushCollection: ExtendedBrushCollection) => void;
  removeBrush: (plot: Plot, brushCollection: ExtendedBrushCollection) => void;
  clearSelections: () => void;
  annotateNode: (annotation: string) => void;
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
      const {interactionHistory} = state;

      const request: PredictionRequest = {
        multiBrushBehavior,
        interactionHistory,
      };

      if (isStateNode(current)) {
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
      }
    }
  });

  const arrs = [
    'dataset',
    'multiBrushBehaviour',
    'showCategories',
    'categoryColumn',
    'plots',
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
