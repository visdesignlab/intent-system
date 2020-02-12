import {initProvenance, Provenance} from '@visdesignlab/provenance-lib-core';
import {defaultState, IntentState, MultiBrushBehaviour} from './IntentState';
import IntentStore from './IntentStore';
import {Dataset} from '../Utils/Dataset';

export type IntentEvents =
  | 'Load Dataset'
  | 'MultiBrush'
  | 'Switch Category Visibility'
  | 'Change Category';

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

  return {
    provenance,
    actions: {
      setDataset,
      toggleCategories,
      changeCategory,
      toggleMultiBrushBehaviour,
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
