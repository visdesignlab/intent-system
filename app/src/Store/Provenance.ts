import {initProvenance} from '@visdesignlab/provenance-lib-core';
import {defaultState, IntentState, MultiBrushBehaviour} from './IntentState';
import IntentStore from './IntentStore';

export type IntentEvents = 'Load Dataset' | 'MultiBrush';

export function setupProvenance(store: IntentStore) {
  const provenance = initProvenance<IntentState, IntentEvents>(
    defaultState,
    true,
  );

  provenance.addGlobalObserver(() => {
    store.isAtRoot = provenance.current().id === provenance.root().id;
    store.isAtLatest = provenance.current().children.length === 0;
    store.graph = provenance.graph();
  });

  store.graph = provenance.graph();

  provenance.addObserver(['dataset'], (state?: IntentState) => {
    if (state && state.dataset !== store.dataset) {
      store.dataset = state.dataset;
    }
  });

  provenance.addObserver(['multiBrushBehaviour'], (state?: IntentState) => {
    if (state && state.multiBrushBehaviour !== store.multiBrushBehaviour) {
      store.multiBrushBehaviour = state.multiBrushBehaviour;
    }
  });

  function setDataset(dataset: string) {
    provenance.applyAction(
      `Load Dataset: ${dataset}`,
      (state: IntentState) => {
        state.dataset = dataset;
        return state;
      },
      undefined,
      {type: 'Load Dataset'},
    );
  }

  function setMulti(multi: MultiBrushBehaviour) {
    provenance.applyAction(
      `Set Multi: ${multi}`,
      (state: IntentState) => {
        state.multiBrushBehaviour = multi;
        return state;
      },
      undefined,
      {type: 'MultiBrush'},
    );
  }

  return {provenance, actions: {setDataset, setMulti}};
}
