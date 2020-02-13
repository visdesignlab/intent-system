import {
  initProvenance,
  Provenance,
  NodeID,
} from '@visdesignlab/provenance-lib-core';
import {
  defaultState,
  IntentState,
  MultiBrushBehaviour,
  Plot,
  ExtendedBrushCollection,
} from './IntentState';
import IntentStore from './IntentStore';
import {Dataset} from '../Utils/Dataset';

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

export function setupProvenance(store: IntentStore): ProvenanceControl {
  const provenance = initProvenance<IntentState, IntentEvents>(
    defaultState,
    true,
  );

  store.graph = provenance.graph();

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
            break;
          }
        }
        return state;
      },
      undefined,
      {type: 'Point Deselection'},
    );
  }

  function addBrush(plot: Plot, brushCollection: ExtendedBrushCollection) {
    provenance.applyAction(
      `Add brush to plot`,
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
      {type: 'Add Brush'},
    );
  }

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
    },
  };
}

export interface ProvenanceControl {
  provenance: Provenance<IntentState, IntentEvents>;
  actions: ProvenanceActions;
}

export interface ProvenanceActions {
  setDataset: (dataset: Dataset) => void;
  toggleCategories: (show: boolean, categories?: string[]) => void;
  changeCategory: (category: string) => void;
  toggleMultiBrushBehaviour: (brushBehaviour: MultiBrushBehaviour) => void;
  goToNode: (id: NodeID) => void;
  addPlot: (plot: Plot) => void;
  addPointSelection: (plot: Plot, points: number[]) => void;
  removePointSelection: (plot: Plot, points: number[]) => void;
  addBrush: (plot: Plot, brushCollection: ExtendedBrushCollection) => void;
  changeBrush: (plot: Plot, brushCollection: ExtendedBrushCollection) => void;
  removeBrush: (plot: Plot, brushCollection: ExtendedBrushCollection) => void;
  clearSelections: () => void;
}

function setupObservers(
  provenance: Provenance<IntentState, IntentEvents>,
  store: IntentStore,
) {
  provenance.addGlobalObserver(() => {
    store.isAtRoot = provenance.current().id === provenance.root().id;
    store.isAtLatest = provenance.current().children.length === 0;
    store.graph = provenance.graph();
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
