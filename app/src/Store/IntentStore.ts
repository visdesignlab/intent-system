import {observable, action, computed} from 'mobx';
import {defaultState, IntentState, MultiBrushBehaviour} from './IntentState';
import {ProvenanceGraph} from '@visdesignlab/provenance-lib-core';
import {IntentEvents} from './Provenance';
import {Dataset} from '../Utils/Dataset';

export default class IntentStore implements IntentState {
  // Graph properties
  @observable graph: ProvenanceGraph<IntentState, IntentEvents> = null as any;
  @observable isAtRoot: boolean = false;
  @observable isAtLatest: boolean = false;

  // State Properties
  @observable showCategories: boolean = defaultState.showCategories;
  @observable dataset: Dataset = defaultState.dataset;
  @observable categoryColumn: string = defaultState.categoryColumn;
  @observable multiBrushBehaviour: MultiBrushBehaviour =
    defaultState.multiBrushBehaviour;
  @observable plots = defaultState.plots;

  // Restore state action
  @action resetStore() {
    Object.assign(this, defaultState);
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
